import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AdminData } from "@/lib/admin-types";
import {
  ensureSupabaseBucket,
  getSupabaseConfigurationIssue,
  getSupabaseServerConfiguration,
  supabaseServerHeaders,
} from "@/lib/supabase-server";

const SUPABASE_STATE_OBJECT = "admin-state.json";
const emptyData = (): AdminData => ({ submissions: [], notes: [], reminders: [] });

async function readLocal(): Promise<AdminData> {
  const directory = join(process.cwd(), ".data");
  const file = join(directory, "admin-store.json");
  try {
    return JSON.parse(await readFile(file, "utf8")) as AdminData;
  } catch {
    await mkdir(directory, { recursive: true });
    const data = emptyData();
    await writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

async function writeLocal(data: AdminData) {
  const directory = join(process.cwd(), ".data");
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "admin-store.json"), JSON.stringify(data, null, 2), "utf8");
}

async function readSupabase(): Promise<AdminData> {
  const configuration = getSupabaseServerConfiguration();
  if (!configuration) throw new Error(getSupabaseConfigurationIssue());

  await ensureSupabaseBucket(configuration, configuration.privateBucket, {
    isPublic: false,
    fileSizeLimit: 2 * 1024 * 1024,
    allowedMimeTypes: ["application/json"],
  });

  const listing = await fetch(`${configuration.url}/storage/v1/object/list/${encodeURIComponent(configuration.privateBucket)}`, {
    method: "POST",
    headers: supabaseServerHeaders(configuration, { "Content-Type": "application/json" }),
    body: JSON.stringify({ prefix: "", search: SUPABASE_STATE_OBJECT, limit: 1 }),
    cache: "no-store",
  });
  if (!listing.ok) {
    const detail = (await listing.text()).slice(0, 240);
    throw new Error(`Supabase data check failed (${listing.status})${detail ? `: ${detail}` : "."}`);
  }
  const files = await listing.json() as Array<{ name?: string }>;
  if (!files.some((file) => file.name === SUPABASE_STATE_OBJECT)) return emptyData();

  const response = await fetch(
    `${configuration.url}/storage/v1/object/${encodeURIComponent(configuration.privateBucket)}/${SUPABASE_STATE_OBJECT}`,
    { headers: supabaseServerHeaders(configuration), cache: "no-store" },
  );
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw new Error(`Supabase data read failed (${response.status})${detail ? `: ${detail}` : "."}`);
  }
  return await response.json() as AdminData;
}

async function writeSupabase(data: AdminData) {
  const configuration = getSupabaseServerConfiguration();
  if (!configuration) throw new Error(getSupabaseConfigurationIssue());

  await ensureSupabaseBucket(configuration, configuration.privateBucket, {
    isPublic: false,
    fileSizeLimit: 2 * 1024 * 1024,
    allowedMimeTypes: ["application/json"],
  });

  const response = await fetch(
    `${configuration.url}/storage/v1/object/${encodeURIComponent(configuration.privateBucket)}/${SUPABASE_STATE_OBJECT}`,
    {
      method: "POST",
      headers: supabaseServerHeaders(configuration, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "x-upsert": "true",
      }),
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw new Error(`Supabase data write failed (${response.status})${detail ? `: ${detail}` : "."}`);
  }
}

export async function getAdminData(): Promise<AdminData> {
  if (getSupabaseServerConfiguration()) return readSupabase();
  if (process.env.VERCEL) {
    throw new Error(getSupabaseConfigurationIssue());
  }
  return readLocal();
}

export async function saveAdminData(data: AdminData) {
  if (getSupabaseServerConfiguration()) {
    await writeSupabase(data);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error(getSupabaseConfigurationIssue());
  }
  await writeLocal(data);
}

export async function mutateAdminData(mutator: (data: AdminData) => AdminData | void) {
  const current = await getAdminData();
  const next = mutator(current) ?? current;
  await saveAdminData(next);
  return next;
}
