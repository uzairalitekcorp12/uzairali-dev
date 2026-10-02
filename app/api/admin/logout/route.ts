import { SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
  return response;
}
