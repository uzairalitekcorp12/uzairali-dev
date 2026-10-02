import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const file = await readFile(join(process.cwd(), "Uzair_Ali_Resume.pdf"));
    return new Response(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${request.nextUrl.searchParams.get("download") === "1" ? "attachment" : "inline"}; filename="Uzair_Ali_Resume.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Résumé not found.", { status: 404 });
  }
}
