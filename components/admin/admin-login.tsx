"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [error, setError] = useState(configured ? "" : "Admin credentials are not configured yet.");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Unable to sign in.");
      setLoading(false);
      return;
    }
    window.location.reload();
  };

  return (
    <main className="admin-login-page">
      <Link href="/"><ArrowLeft /> Back to portfolio</Link>
      <form onSubmit={submit} className="admin-login-card">
        <span><LockKeyhole /></span>
        <p>PRIVATE WORKSPACE</p>
        <h1>Welcome back.</h1>
        <label><span>Email</span><input name="email" type="email" autoComplete="username" required /></label>
        <label><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button type="submit" disabled={loading || !configured}>{loading ? "Signing in…" : "Open workspace"}</button>
      </form>
    </main>
  );
}
