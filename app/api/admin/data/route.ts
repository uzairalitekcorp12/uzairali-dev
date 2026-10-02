import { randomUUID } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminData, mutateAdminData } from "@/lib/admin-storage";
import { normalizePortfolioContent } from "@/lib/portfolio-content";

async function unauthorized() {
  return !(await isAdminAuthenticated());
}

export async function GET() {
  if (await unauthorized()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return Response.json(await getAdminData());
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load data." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (await unauthorized()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { type?: "note" | "reminder"; title?: string; content?: string; dueAt?: string };
  const title = body.title?.trim() ?? "";
  if (!title || title.length > 160) return Response.json({ error: "A title is required." }, { status: 400 });
  const now = new Date().toISOString();
  const data = await mutateAdminData((current) => {
    if (body.type === "note") {
      current.notes.unshift({ id: randomUUID(), title, content: body.content?.trim() ?? "", createdAt: now, updatedAt: now });
    } else if (body.type === "reminder") {
      current.reminders.unshift({ id: randomUUID(), title, dueAt: body.dueAt ?? "", done: false, createdAt: now });
    }
  });
  return Response.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  if (await unauthorized()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { type?: "submission" | "reminder"; id?: string; status?: "new" | "read"; done?: boolean };
  const data = await mutateAdminData((current) => {
    if (body.type === "submission") {
      const item = current.submissions.find((submission) => submission.id === body.id);
      if (item && body.status) item.status = body.status;
    }
    if (body.type === "reminder") {
      const item = current.reminders.find((reminder) => reminder.id === body.id);
      if (item && typeof body.done === "boolean") item.done = body.done;
    }
  });
  return Response.json(data);
}

export async function PUT(request: Request) {
  if (await unauthorized()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { portfolioContent?: unknown };
  const portfolioContent = normalizePortfolioContent(body.portfolioContent);
  if (!portfolioContent) return Response.json({ error: "Invalid portfolio content." }, { status: 400 });
  try {
    const data = await mutateAdminData((current) => {
      current.portfolioContent = portfolioContent;
    });
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save portfolio content." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (await unauthorized()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id." }, { status: 400 });
  const data = await mutateAdminData((current) => {
    if (type === "submission") current.submissions = current.submissions.filter((item) => item.id !== id);
    if (type === "note") current.notes = current.notes.filter((item) => item.id !== id);
    if (type === "reminder") current.reminders = current.reminders.filter((item) => item.id !== id);
  });
  return Response.json(data);
}
