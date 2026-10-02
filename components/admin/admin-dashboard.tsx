"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useState } from "react";
import {
  BellRing,
  Check,
  CircleUserRound,
  FileText,
  Inbox,
  LogOut,
  PanelsTopLeft,
  Plus,
  RefreshCw,
  StickyNote,
  Trash2,
} from "lucide-react";
import { PortfolioContentEditor } from "@/components/admin/portfolio-content-editor";
import type { AdminData } from "@/lib/admin-types";

type Tab = "submissions" | "content" | "reminders" | "notes";
const emptyData: AdminData = { submissions: [], reminders: [], notes: [] };

export function AdminDashboard({ initialData = emptyData, initialError = "" }: { initialData?: AdminData; initialError?: string }) {
  const [data, setData] = useState<AdminData>(initialData);
  const [tab, setTab] = useState<Tab>("submissions");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/data", { cache: "no-store" });
    const payload = await response.json() as AdminData & { error?: string };
    if (!response.ok) setError(payload.error ?? "Unable to load the workspace.");
    else {
      setData(payload);
      setError("");
    }
    setLoading(false);
  };

  const remove = async (type: "submission" | "reminder" | "note", id: string) => {
    if (!window.confirm("Delete this item permanently?")) return;
    const response = await fetch(`/api/admin/data?type=${type}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) setData(await response.json() as AdminData);
  };

  const patch = async (body: object) => {
    const response = await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) setData(await response.json() as AdminData);
  };

  const add = async (event: FormEvent<HTMLFormElement>, type: "note" | "reminder") => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const response = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        title: values.get("title"),
        content: values.get("content"),
        dueAt: values.get("dueAt"),
      }),
    });
    if (response.ok) {
      setData(await response.json() as AdminData);
      form.reset();
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const unread = data.submissions.filter((item) => item.status === "new").length;
  const openReminders = data.reminders.filter((item) => !item.done).length;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="site-logo"><span>Uzair <b>Ali</b></span><i /></Link>
        <div className="admin-identity"><CircleUserRound /><div><strong>Uzair Ali</strong><span>Private workspace</span></div></div>
        <nav>
          <button className={tab === "submissions" ? "active" : ""} onClick={() => setTab("submissions")}><Inbox /> Inbox <span>{unread}</span></button>
          <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}><PanelsTopLeft /> Portfolio content</button>
          <button className={tab === "reminders" ? "active" : ""} onClick={() => setTab("reminders")}><BellRing /> Reminders <span>{openReminders}</span></button>
          <button className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}><StickyNote /> Private notes <span>{data.notes.length}</span></button>
        </nav>
        <button type="button" className="admin-logout" onClick={logout}><LogOut /> Sign out</button>
      </aside>

      <section className="admin-workspace">
        <header>
          <div><p>ADMIN / {tab.toUpperCase()}</p><h1>{tab === "submissions" ? "Contact inbox" : tab === "content" ? "Portfolio content" : tab === "reminders" ? "Follow-up reminders" : "Private notes"}</h1></div>
          <button type="button" onClick={() => void load()}><RefreshCw className={loading ? "spin" : ""} /> Refresh</button>
        </header>

        {error && <div className="admin-storage-error" role="alert"><strong>Storage unavailable</strong><p>{error}</p></div>}

        {tab === "submissions" && (
          <div className="admin-list">
            {data.submissions.length === 0 && <div className="admin-empty"><Inbox /><h2>No messages yet</h2><p>New contact form submissions will appear here.</p></div>}
            {data.submissions.map((submission) => (
              <article key={submission.id} className={submission.status === "new" ? "is-new" : ""}>
                <header><div><span>{submission.status}</span><time>{new Date(submission.createdAt).toLocaleString()}</time></div><button onClick={() => remove("submission", submission.id)} aria-label="Delete submission"><Trash2 /></button></header>
                <h2>{submission.name}</h2>
                <a href={`mailto:${submission.email}`}>{submission.email}</a>
                <p>{submission.message}</p>
                {submission.status === "new" && <button onClick={() => patch({ type: "submission", id: submission.id, status: "read" })}><Check /> Mark as read</button>}
              </article>
            ))}
          </div>
        )}

        {tab === "content" && <PortfolioContentEditor key={JSON.stringify(data.portfolioContent ?? {})} content={data.portfolioContent} onSaved={setData} />}

        {tab === "reminders" && (
          <div className="admin-split">
            <form onSubmit={(event) => add(event, "reminder")} className="admin-create-card">
              <BellRing /><h2>Add reminder</h2>
              <label><span>What needs attention?</span><input name="title" required /></label>
              <label><span>When?</span><input name="dueAt" type="datetime-local" /></label>
              <button type="submit"><Plus /> Save reminder</button>
            </form>
            <div className="reminder-list">
              {data.reminders.map((reminder) => (
                <article key={reminder.id} className={reminder.done ? "done" : ""}>
                  <button onClick={() => patch({ type: "reminder", id: reminder.id, done: !reminder.done })} aria-label="Toggle reminder"><Check /></button>
                  <div><h2>{reminder.title}</h2><time>{reminder.dueAt ? new Date(reminder.dueAt).toLocaleString() : "No due date"}</time></div>
                  <button onClick={() => remove("reminder", reminder.id)} aria-label="Delete reminder"><Trash2 /></button>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="admin-split">
            <form onSubmit={(event) => add(event, "note")} className="admin-create-card">
              <FileText /><h2>New private note</h2>
              <label><span>Title</span><input name="title" required /></label>
              <label><span>Note</span><textarea name="content" rows={7} /></label>
              <button type="submit"><Plus /> Save note</button>
            </form>
            <div className="notes-grid">
              {data.notes.map((note) => (
                <article key={note.id}><header><time>{new Date(note.createdAt).toLocaleDateString()}</time><button onClick={() => remove("note", note.id)} aria-label="Delete note"><Trash2 /></button></header><h2>{note.title}</h2><p>{note.content}</p></article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
