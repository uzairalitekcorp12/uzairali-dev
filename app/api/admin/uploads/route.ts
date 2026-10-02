import { randomUUID } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function storageConfiguration() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio-assets";
  return url && serviceRoleKey ? { url, serviceRoleKey, bucket } : null;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const configuration = storageConfiguration();
  if (!configuration) {
    return Response.json({ error: "Image uploads need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") === "projects" ? "projects" : "uploads";

  if (!(file instanceof File)) return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!extensions[file.type]) return Response.json({ error: "Use a JPG, PNG, WebP, or AVIF image." }, { status: 400 });
  if (file.size > MAX_IMAGE_SIZE) return Response.json({ error: "Images must be 8 MB or smaller." }, { status: 400 });

  const objectName = `${folder}/${randomUUID()}.${extensions[file.type]}`;
  const uploadUrl = `${configuration.url}/storage/v1/object/${encodeURIComponent(configuration.bucket)}/${objectName}`;
  const upload = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configuration.serviceRoleKey}`,
      apikey: configuration.serviceRoleKey,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: await file.arrayBuffer(),
  });

  if (!upload.ok) {
    const detail = await upload.text();
    return Response.json({ error: `Supabase upload failed (${upload.status}): ${detail.slice(0, 180)}` }, { status: 502 });
  }

  const url = `${configuration.url}/storage/v1/object/public/${encodeURIComponent(configuration.bucket)}/${objectName}`;
  return Response.json({ url, path: objectName }, { status: 201 });
}
