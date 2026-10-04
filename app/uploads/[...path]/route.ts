import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (process.env.VERCEL) return new Response("Not found", { status: 404 });

  const { path } = await params;
  const [folder, fileName, ...extra] = path;
  const extension = extname(fileName ?? "").toLowerCase();
  const isValidPath = extra.length === 0
    && (folder === "projects" || folder === "uploads")
    && /^[0-9a-f-]+\.(?:jpg|png|webp|avif)$/i.test(fileName ?? "")
    && Boolean(contentTypes[extension]);

  if (!isValidPath) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(join(process.cwd(), ".data", "uploads", folder, fileName));
    return new Response(file, {
      headers: {
        "Content-Type": contentTypes[extension],
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
