import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET() {
  try {
    const file = await readFile(join(process.cwd(), "Uzair_Ali_Resume.pdf"));
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Uzair_Ali_Resume.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Résumé not found.", { status: 404 });
  }
}
