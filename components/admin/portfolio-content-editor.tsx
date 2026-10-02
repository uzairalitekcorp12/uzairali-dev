"use client";

import { BriefcaseBusiness, GraduationCap, Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { AdminData } from "@/lib/admin-types";
import { defaultPortfolioContent } from "@/lib/portfolio-content";
import type { EducationItem, ExperienceItem, PortfolioContent, Project } from "@/data/portfolio";

const clone = (content: PortfolioContent) => JSON.parse(JSON.stringify(content)) as PortfolioContent;

function Field({ label, value, onChange, multiline = false, placeholder = "" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span>{label}</span>
      {multiline
        ? <textarea rows={3} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
        : <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

export function PortfolioContentEditor({ content, onSaved }: {
  content?: PortfolioContent;
  onSaved: (data: AdminData) => void;
}) {
  const [draft, setDraft] = useState(() => clone(content ?? defaultPortfolioContent()));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft(clone(content ?? defaultPortfolioContent()));
  }, [content]);

  const updateProject = <Key extends keyof Project>(index: number, key: Key, value: Project[Key]) => {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((project, itemIndex) => itemIndex === index ? { ...project, [key]: value } : project),
    }));
  };

  const updateEducation = (index: number, key: keyof EducationItem, value: string) => {
    setDraft((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const updateExperience = (index: number, key: keyof ExperienceItem, value: string) => {
    setDraft((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const addProject = () => {
    setDraft((current) => ({
      ...current,
      projects: [...current.projects, {
        number: String(current.projects.length + 1).padStart(2, "0"),
        slug: `new-project-${current.projects.length + 1}`,
        title: "New project",
        kind: "Project type",
        year: new Date().getFullYear().toString(),
        description: "Short project description.",
        overview: "Project overview.",
        challenge: "The challenge.",
        solution: "The solution.",
        outcome: "The outcome.",
        tags: ["Next.js"],
        accent: "violet",
        image: "",
        github: "https://github.com/uzairali12",
        live: "#",
      }],
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioContent: draft }),
      });
      const payload = await response.json() as AdminData & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to save changes.");
      onSaved(payload);
      setMessage("Portfolio content saved. Public pages now use these changes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-editor">
      <div className="content-editor-toolbar">
        <div><p>CONTENT MANAGER</p><h2>Projects, experience & education</h2></div>
        <button type="button" onClick={() => void save()} disabled={saving}><Save /> {saving ? "Saving…" : "Save all changes"}</button>
      </div>
      {message && <p className="content-editor-message" role="status">{message}</p>}

      <section className="content-editor-section">
        <header><div><BriefcaseBusiness /><div><h3>Projects</h3><p>Use a full image URL, or a path such as /projects/project-name.jpg.</p></div></div><button type="button" onClick={addProject}><Plus /> Add project</button></header>
        <div className="content-editor-list">
          {draft.projects.map((project, index) => (
            <details key={`${project.slug}-${index}`} className="content-editor-card" open={index === 0}>
              <summary>
                <span>{project.number}</span><strong>{project.title}</strong><small>{project.year}</small>
              </summary>
              <div className="content-editor-fields">
                <div className="admin-project-preview" style={project.image ? { backgroundImage: `url("${project.image.replace(/"/g, "%22")}")` } : undefined}>
                  {!project.image && <><ImageIcon /><span>Add an image URL</span></>}
                </div>
                <div className="admin-form-grid">
                  <Field label="Number" value={project.number} onChange={(value) => updateProject(index, "number", value)} />
                  <Field label="Year" value={project.year} onChange={(value) => updateProject(index, "year", value)} />
                  <Field label="Title" value={project.title} onChange={(value) => updateProject(index, "title", value)} />
                  <Field label="Slug" value={project.slug} onChange={(value) => updateProject(index, "slug", value)} />
                  <Field label="Project type" value={project.kind} onChange={(value) => updateProject(index, "kind", value)} />
                  <label><span>Accent</span><select value={project.accent} onChange={(event) => updateProject(index, "accent", event.target.value as Project["accent"])}><option>violet</option><option>cyan</option><option>amber</option><option>rose</option><option>lime</option></select></label>
                </div>
                <Field label="Project image" value={project.image ?? ""} placeholder="https://… or /projects/image.jpg" onChange={(value) => updateProject(index, "image", value)} />
                <Field label="Short description" value={project.description} multiline onChange={(value) => updateProject(index, "description", value)} />
                <Field label="Overview" value={project.overview} multiline onChange={(value) => updateProject(index, "overview", value)} />
                <Field label="Challenge" value={project.challenge} multiline onChange={(value) => updateProject(index, "challenge", value)} />
                <Field label="Solution" value={project.solution} multiline onChange={(value) => updateProject(index, "solution", value)} />
                <Field label="Outcome" value={project.outcome} multiline onChange={(value) => updateProject(index, "outcome", value)} />
                <Field label="Tags (comma separated)" value={project.tags.join(", ")} onChange={(value) => updateProject(index, "tags", value.split(",").map((tag) => tag.trim()).filter(Boolean))} />
                <div className="admin-form-grid">
                  <Field label="Live URL" value={project.live} onChange={(value) => updateProject(index, "live", value)} />
                  <Field label="GitHub URL" value={project.github} onChange={(value) => updateProject(index, "github", value)} />
                </div>
                <button className="admin-danger-button" type="button" onClick={() => setDraft((current) => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 /> Remove project</button>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="content-editor-section">
        <header><div><BriefcaseBusiness /><div><h3>Experience</h3><p>Add or update professional milestones.</p></div></div><button type="button" onClick={() => setDraft((current) => ({ ...current, experience: [...current.experience, { period: "Present", role: "New role", company: "Company", description: "Role description." }] }))}><Plus /> Add experience</button></header>
        <div className="content-simple-grid">
          {draft.experience.map((item, index) => (
            <article key={index}>
              <Field label="Period" value={item.period} onChange={(value) => updateExperience(index, "period", value)} />
              <Field label="Role" value={item.role} onChange={(value) => updateExperience(index, "role", value)} />
              <Field label="Company" value={item.company} onChange={(value) => updateExperience(index, "company", value)} />
              <Field label="Description" value={item.description} multiline onChange={(value) => updateExperience(index, "description", value)} />
              <button className="admin-danger-button" type="button" onClick={() => setDraft((current) => ({ ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 /> Remove</button>
            </article>
          ))}
        </div>
      </section>

      <section className="content-editor-section">
        <header><div><GraduationCap /><div><h3>Education</h3><p>Keep qualifications and study details current.</p></div></div><button type="button" onClick={() => setDraft((current) => ({ ...current, education: [...current.education, { period: "Present", title: "New qualification", place: "Institution", detail: "Education details." }] }))}><Plus /> Add education</button></header>
        <div className="content-simple-grid">
          {draft.education.map((item, index) => (
            <article key={index}>
              <Field label="Period" value={item.period} onChange={(value) => updateEducation(index, "period", value)} />
              <Field label="Qualification" value={item.title} onChange={(value) => updateEducation(index, "title", value)} />
              <Field label="Institution" value={item.place} onChange={(value) => updateEducation(index, "place", value)} />
              <Field label="Details" value={item.detail} multiline onChange={(value) => updateEducation(index, "detail", value)} />
              <button className="admin-danger-button" type="button" onClick={() => setDraft((current) => ({ ...current, education: current.education.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 /> Remove</button>
            </article>
          ))}
        </div>
      </section>

      <div className="content-editor-bottom"><button type="button" onClick={() => void save()} disabled={saving}><Save /> {saving ? "Saving…" : "Save all changes"}</button></div>
    </div>
  );
}
