import { randomUUID } from "node:crypto";
import { mutateAdminData } from "@/lib/admin-storage";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; email?: string; message?: string; company?: string };
    if (body.company) return Response.json({ ok: true });

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const message = body.message?.trim() ?? "";
    if (name.length < 2 || name.length > 100) {
      return Response.json({ error: "Please enter a valid name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    if (message.length < 10 || message.length > 5000) {
      return Response.json({ error: "Your message must be between 10 and 5,000 characters." }, { status: 400 });
    }

    await mutateAdminData((data) => {
      data.submissions.unshift({
        id: randomUUID(),
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
        status: "new",
      });
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save your message.";
    return Response.json({ error: message }, { status: 503 });
  }
}
