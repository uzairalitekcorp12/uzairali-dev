import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  ensureSupabaseBucket,
  getSupabaseConfigurationIssue,
  getSupabaseServerConfiguration,
  supabaseServerHeaders,
} from "@/lib/supabase-server";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const configuration = getSupabaseServerConfiguration();
  if (!configuration) {
    if (!process.env.VERCEL) return Response.json({ configured: true, provider: "local", bucket: ".data/uploads" });
    return Response.json({ configured: false, provider: "missing", error: getSupabaseConfigurationIssue() }, { status: 503 });
  }

  try {
    await ensureSupabaseBucket(configuration, configuration.bucket, {
      isPublic: true,
      fileSizeLimit: MAX_IMAGE_SIZE,
      allowedMimeTypes: Object.keys(extensions),
    });
    return Response.json({ configured: true, provider: "supabase", bucket: configuration.bucket });
  } catch (error) {
    return Response.json({
      configured: false,
      provider: "missing",
      error: error instanceof Error ? error.message : "Unable to configure Supabase Storage.",
    }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const configuration = getSupabaseServerConfiguration();
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") === "projects" ? "projects" : "uploads";

  if (!(file instanceof File)) return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!extensions[file.type]) return Response.json({ error: "Use a JPG, PNG, WebP, or AVIF image." }, { status: 400 });
  if (file.size > MAX_IMAGE_SIZE) return Response.json({ error: "Images must be 8 MB or smaller." }, { status: 400 });

  const objectName = `${folder}/${randomUUID()}.${extensions[file.type]}`;
  try {
    if (!configuration) {
      if (process.env.VERCEL) return Response.json({ error: getSupabaseConfigurationIssue() }, { status: 503 });
      const uploadDirectory = join(process.cwd(), ".data", "uploads", folder);
      await mkdir(uploadDirectory, { recursive: true });
      await writeFile(join(uploadDirectory, objectName.split("/").at(-1)!), Buffer.from(await file.arrayBuffer()));
      return Response.json({ url: `/uploads/${objectName}`, path: objectName, provider: "local" }, { status: 201 });
    }

    await ensureSupabaseBucket(configuration, configuration.bucket, {
      isPublic: true,
      fileSizeLimit: MAX_IMAGE_SIZE,
      allowedMimeTypes: Object.keys(extensions),
    });
    const uploadUrl = `${configuration.url}/storage/v1/object/${encodeURIComponent(configuration.bucket)}/${objectName}`;
    const upload = await fetch(uploadUrl, {
      method: "POST",
      headers: supabaseServerHeaders(configuration, {
        "Content-Type": file.type,
        "x-upsert": "false",
        "Cache-Control": "public, max-age=31536000, immutable",
      }),
      body: await file.arrayBuffer(),
    });

    if (!upload.ok) {
      const detail = await upload.text();
      return Response.json({ error: `Supabase upload failed (${upload.status}): ${detail.slice(0, 180)}` }, { status: 502 });
    }

    const url = `${configuration.url}/storage/v1/object/public/${encodeURIComponent(configuration.bucket)}/${objectName}`;
    return Response.json({ url, path: objectName, provider: "supabase" }, { status: 201 });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : "Unable to upload image.",
    }, { status: 502 });
  }
}
