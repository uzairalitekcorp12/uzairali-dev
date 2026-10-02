import { adminIsConfigured, createSessionToken, SESSION_COOKIE, validateCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!adminIsConfigured()) {
    return Response.json({ error: "Admin credentials are not configured." }, { status: 503 });
  }
  const body = await request.json() as { email?: string; password?: string };
  if (!validateCredentials(body.email ?? "", body.password ?? "")) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${createSessionToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 12}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
  return response;
}
