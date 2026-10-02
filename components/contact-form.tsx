"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const text = encodeURIComponent(
      `Hello Uzair! I'm ${name} (${email}).\n\n${message}`,
    );
    window.open(`https://wa.me/923282626204?text=${text}`, "_blank", "noopener,noreferrer");
    setSent(true);
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
      <div className="form-submit-row">
        <button type="submit">Start a conversation <ArrowUpRight /></button>
        <p aria-live="polite">
          {sent ? <><CheckCircle2 /> Message prepared in WhatsApp.</> : "Usually replies within 24–48 hours."}
        </p>
      </div>
    </form>
  );
}
