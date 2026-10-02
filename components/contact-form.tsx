"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Your message could not be sent. Please try again.");
        return;
      }
      form.reset();
      setStatus("sent");
      setMessage("Message received. I’ll get back to you soon.");
    } catch {
      setStatus("error");
      setMessage("The connection failed. Please try again in a moment.");
    }
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          <span>Your name</span>
          <input name="name" type="text" placeholder="Jane Smith" autoComplete="name" required />
        </label>
        <label>
          <span>Your email</span>
          <input name="email" type="email" placeholder="jane@company.com" autoComplete="email" required />
        </label>
      </div>
      <label>
        <span>Tell me about the project</span>
        <textarea name="message" rows={5} placeholder="A quick overview, timeline, and what success looks like…" required />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Company</span>
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-submit-row">
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Start a conversation"} <ArrowUpRight /></button>
        <p aria-live="polite" className={status === "error" ? "form-error" : ""}>
          {status === "sent" ? <><CheckCircle2 /> {message}</> : status === "error" ? message : "Usually replies within 24–48 hours."}
        </p>
      </div>
    </form>
  );
}
