import "server-only";

export type SupabaseServerConfiguration = {
  url: string;
  secretKey: string;
  bucket: string;
  privateBucket: string;
};

type SupabaseBucketOptions = {
  isPublic: boolean;
  fileSizeLimit: number;
  allowedMimeTypes: string[];
};

const bucketSetup = new Map<string, Promise<void>>();

function normalizeUrl(value?: string) {
  if (!value) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function getSupabaseServerConfiguration(): SupabaseServerConfiguration | null {
  const url = normalizeUrl(process.env.SUPABASE_URL);
  const modernSecretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  const legacyServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const secretKey = modernSecretKey?.startsWith("sb_secret_")
    ? modernSecretKey
    : legacyServiceRoleKey;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio-assets";

  const containsPlaceholder = /YOUR_PROJECT_REF|REPLACE_ME/i.test(`${url} ${secretKey ?? ""}`);
  return url && secretKey && !containsPlaceholder
    ? { url, secretKey, bucket, privateBucket: `${bucket}-private` }
    : null;
}

export function getSupabaseConfigurationIssue() {
  const url = process.env.SUPABASE_URL;
  const modernSecretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (url && modernSecretKey?.startsWith("sb_publishable_")) {
    return "SUPABASE_SECRET_KEY must be an sb_secret_ server key, not an sb_publishable_ browser key.";
  }

  return "Persistent storage needs SUPABASE_URL and SUPABASE_SECRET_KEY.";
}

export function supabaseServerHeaders(configuration: SupabaseServerConfiguration, headers?: HeadersInit) {
  const result = new Headers(headers);
  result.set("apikey", configuration.secretKey);

  // Legacy service_role keys are JWTs. New sb_secret keys must be sent only
  // through `apikey` or Supabase will try (and fail) to parse them as JWTs.
  if (!configuration.secretKey.startsWith("sb_secret_")) {
    result.set("Authorization", `Bearer ${configuration.secretKey}`);
  }

  return result;
}

async function createSupabaseBucket(
  configuration: SupabaseServerConfiguration,
  bucket: string,
  options: SupabaseBucketOptions,
) {
  const existing = await fetch(`${configuration.url}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
    headers: supabaseServerHeaders(configuration),
    cache: "no-store",
  });

  if (existing.ok) {
    const current = await existing.json() as {
      public?: boolean;
      file_size_limit?: number | null;
      allowed_mime_types?: string[] | null;
    };
    const currentMimeTypes = [...(current.allowed_mime_types ?? [])].sort();
    const requestedMimeTypes = [...options.allowedMimeTypes].sort();
    const isConfigured = current.public === options.isPublic
      && current.file_size_limit === options.fileSizeLimit
      && currentMimeTypes.length === requestedMimeTypes.length
      && currentMimeTypes.every((mimeType, index) => mimeType === requestedMimeTypes[index]);
    if (isConfigured) return;

    const updated = await fetch(`${configuration.url}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
      method: "PUT",
      headers: supabaseServerHeaders(configuration, { "Content-Type": "application/json" }),
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        public: options.isPublic,
        file_size_limit: options.fileSizeLimit,
        allowed_mime_types: options.allowedMimeTypes,
      }),
      cache: "no-store",
    });
    if (!updated.ok) {
      const detail = (await updated.text()).slice(0, 240);
      throw new Error(`Supabase bucket update failed (${updated.status})${detail ? `: ${detail}` : "."}`);
    }
    return;
  }
  if (existing.status !== 404 && existing.status !== 400) {
    const detail = (await existing.text()).slice(0, 240);
    throw new Error(`Supabase bucket check failed (${existing.status})${detail ? `: ${detail}` : "."}`);
  }

  const created = await fetch(`${configuration.url}/storage/v1/bucket`, {
    method: "POST",
    headers: supabaseServerHeaders(configuration, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      id: bucket,
      name: bucket,
      public: options.isPublic,
      file_size_limit: options.fileSizeLimit,
      allowed_mime_types: options.allowedMimeTypes,
    }),
    cache: "no-store",
  });

  if (!created.ok && created.status !== 409) {
    const detail = (await created.text()).slice(0, 240);
    throw new Error(`Supabase bucket setup failed (${created.status})${detail ? `: ${detail}` : "."}`);
  }
}

export function ensureSupabaseBucket(
  configuration: SupabaseServerConfiguration,
  bucket: string,
  options: SupabaseBucketOptions,
) {
  const key = `${configuration.url}:${bucket}`;
  const pending = bucketSetup.get(key);
  if (pending) return pending;

  const setup = createSupabaseBucket(configuration, bucket, options).catch((error) => {
    bucketSetup.delete(key);
    throw error;
  });
  bucketSetup.set(key, setup);
  return setup;
}
