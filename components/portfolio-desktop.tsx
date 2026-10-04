"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Command,
  Code2,
  FileText,
  FolderCode,
  Gamepad2,
  GraduationCap,
  Github,
  Home,
  MapPin,
  Mail,
  Monitor,
  ScrollText,
  Sparkles,
  TerminalSquare,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import type { ComputerApp } from "@/components/portfolio-terminal";
import { portfolio, type PortfolioContent, type Project } from "@/data/portfolio";

const PortfolioTerminal = dynamic(
  () => import("@/components/portfolio-terminal").then((module) => module.PortfolioTerminal),
  { loading: () => <div className="mac-app-loading">Opening terminal…</div> },
);
const SnakeGame = dynamic(
  () => import("@/components/games/snake-game").then((module) => module.SnakeGame),
  { loading: () => <div className="mac-app-loading">Loading Snake…</div> },
);
const PongGame = dynamic(
  () => import("@/components/games/pong-game").then((module) => module.PongGame),
  { loading: () => <div className="mac-app-loading">Loading Pong…</div> },
);

const navItems: Array<{ id: ComputerApp; label: string; icon: typeof TerminalSquare }> = [
  { id: "desktop", label: "Home", icon: Home },
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "projects", label: "Projects", icon: FolderCode },
  { id: "about", label: "About", icon: UserRound },
  { id: "snake", label: "Snake", icon: Gamepad2 },
  { id: "pong", label: "Pong", icon: Monitor },
];

const appTitles: Record<ComputerApp, string> = {
  desktop: "Home",
  terminal: "Terminal",
  projects: "Projects",
  about: "About Uzair",
  snake: "Snake",
  pong: "Pong",
};

function AboutPanel() {
  const capabilities = [
    { icon: Sparkles, label: "Product thinking", detail: "Clear flows and memorable interfaces" },
    { icon: Code2, label: "Frontend craft", detail: "Responsive React and Next.js builds" },
    { icon: BriefcaseBusiness, label: "Full-stack delivery", detail: "Ideas carried through to launch" },
  ];

  return (
    <div className="crt-document mac-document mac-profile">
      <header className="mac-profile-header"><p>ABOUT_UZAIR.TXT</p><span><i /> {portfolio.person.availability}</span></header>
      <section className="mac-profile-intro">
        <div className="mac-profile-mark" aria-hidden="true">UA</div>
        <div><p>CREATIVE ENGINEER / 001</p><h3>{portfolio.person.name}</h3><strong>{portfolio.person.role}</strong></div>
      </section>
      <p className="mac-profile-bio">{portfolio.person.shortBio}</p>
      <div className="mac-profile-stats" aria-label="Portfolio highlights">
        {portfolio.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </div>
      <section className="mac-profile-overview" aria-label="Profile details">
        <article><MapPin /><div><span>BASED IN</span><strong>{portfolio.person.location}</strong></div></article>
        <article><GraduationCap /><div><span>NOW STUDYING</span><strong>{portfolio.education[0].title}</strong></div></article>
        <article><Code2 /><div><span>FOCUS</span><strong>Product design + frontend</strong></div></article>
      </section>
      <section className="mac-profile-capabilities"><p>HOW I HELP</p><div>{capabilities.map((capability) => { const Icon = capability.icon; return <article key={capability.label}><Icon /><div><strong>{capability.label}</strong><span>{capability.detail}</span></div></article>; })}</div></section>
      <section className="mac-profile-skills"><p>TOOLKIT</p><div>{portfolio.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
      <footer className="mac-profile-actions"><button type="button" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>Start a conversation <ArrowUpRight /></button><Link href="/resume">View r&eacute;sum&eacute;</Link></footer>
    </div>
  );
}

function ProjectReader({ project, onBack }: { project: Project; onBack: () => void }) {
  const gallery = [project.image, ...(project.gallery ?? [])].filter(Boolean).slice(0, 3) as string[];
  const highlights = project.metrics?.length ? project.metrics : [
    { value: project.year, label: "Delivered" },
    { value: String(project.tags.length).padStart(2, "0"), label: "Core tools" },
    { value: "01", label: "Focused outcome" },
  ];
  return (
    <div className="mac-project-reader">
      <header className="mac-project-reader-header"><button type="button" onClick={onBack}><ArrowLeft /> All projects</button><span>{project.number} / {project.year}</span></header>
      <div className="mac-project-reader-content">
        <div className="mac-project-reader-art" style={project.image ? { backgroundImage: `url("${project.image.replace(/"/g, "%22")}")` } : undefined}><span>{project.kind}</span><strong>{project.title.slice(0, 2).toUpperCase()}</strong></div>
        <p className="mac-project-reader-type">{project.kind}</p>
        <h3>{project.title}</h3>
        <p className="mac-project-reader-overview">{project.overview}</p>
        <div className="mac-project-reader-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <section className="mac-project-reader-metrics">{highlights.map((metric) => <div key={`${metric.value}-${metric.label}`}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</section>
        <section className="mac-project-reader-story">
          <article><span>CHALLENGE</span><p>{project.challenge}</p></article>
          <article><span>SOLUTION</span><p>{project.solution}</p></article>
          <article><span>OUTCOME</span><p>{project.outcome}</p></article>
        </section>
        {gallery.length > 1 ? <section className="mac-project-reader-gallery"><p>VISUAL NOTES</p><div>{gallery.slice(1).map((image, index) => <span key={image} style={{ backgroundImage: `url("${image.replace(/"/g, "%22")}")` }} aria-label={`${project.title} visual ${index + 1}`} role="img" />)}</div></section> : null}
        <footer><Link href={`/projects/${project.slug}`}>Open full case study <ArrowUpRight /></Link><a href={project.github} target="_blank" rel="noreferrer"><Github /> Source</a></footer>
      </div>
    </div>
  );
}

function ProjectsPanel({ projects }: { projects: Project[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedProject = projects.find((project) => project.slug === selectedSlug);
  const featuredProject = projects[0];

  if (selectedProject) return <ProjectReader project={selectedProject} onBack={() => setSelectedSlug(null)} />;

  return (
    <div className="crt-projects mac-projects">
      <header className="mac-projects-header"><div><p>PROJECT LIBRARY</p><h3>Selected work</h3></div><span>{String(projects.length).padStart(2, "0")} ITEMS</span></header>
      {featuredProject ? <button type="button" className={`mac-project-feature mac-project-feature--${featuredProject.accent}`} onClick={() => setSelectedSlug(featuredProject.slug)}>
        <span>FEATURED / {featuredProject.year}</span><ArrowUpRight /><div><p>{featuredProject.kind}</p><h4>{featuredProject.title}</h4><strong>{featuredProject.overview}</strong><i>{featuredProject.tags.slice(0, 3).map((tag) => <em key={tag}>{tag}</em>)}</i></div>
      </button> : null}
      <div className="mac-project-grid">
        {projects.map((project) => (
          <article key={project.slug} className={`mac-project-card mac-project-card--${project.accent}`}>
            <button type="button" onClick={() => setSelectedSlug(project.slug)} aria-label={`Read about ${project.title}`}>
              <span>{project.number} <i>{project.year}</i></span>
              <div><p>{project.kind}</p><h4>{project.title}</h4></div>
              <ArrowRight aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
      <Link href="/projects" className="crt-all-projects">Open full project archive <ArrowUpRight /></Link>
    </div>
  );
}

function DesktopHome({ open, projectCount }: { open: (app: ComputerApp) => void; projectCount: number }) {
  const apps = [
    { label: "Projects", detail: `${projectCount} project files`, icon: FolderCode, action: () => open("projects"), accent: "violet" },
    { label: "About Uzair", detail: "Profile.txt", icon: FileText, action: () => open("about"), accent: "cyan" },
    { label: "Terminal", detail: "Command line", icon: TerminalSquare, action: () => open("terminal"), accent: "dark" },
    { label: "Snake", detail: "Game.app", icon: Gamepad2, action: () => open("snake"), accent: "lime" },
    { label: "Pong", detail: "Game.app", icon: Monitor, action: () => open("pong"), accent: "rose" },
    { label: "Resume", detail: "PDF document", icon: ScrollText, action: () => window.open("/resume", "_blank", "noopener,noreferrer"), accent: "amber" },
  ];

  return (
    <div className="mac-desktop-home">
      <header className="mac-desktop-menubar">
        <div><Command /><strong>Uzair</strong><span>Finder</span><span>File</span><span>Edit</span><span>View</span></div>
        <div><span>Portfolio OS</span><i /> <span>Online</span></div>
      </header>
      <div className="mac-desktop-welcome">
        <div><p>WELCOME BACK</p><h3>Good ideas deserve<br />a better interface.</h3><span>Explore the files, projects, and a fully working terminal.</span></div>
        <aside className="mac-desktop-spotlight"><span>STUDIO / 2026</span><strong>Design systems<br />in motion.</strong><button type="button" onClick={() => open("terminal")}><TerminalSquare /> Open terminal</button></aside>
      </div>
      <div className="mac-file-grid" aria-label="Workspace files and applications">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button key={app.label} type="button" className={`mac-file-card mac-file-card--${app.accent}`} onClick={app.action}>
              <i><Icon /></i>
              <strong>{app.label}</strong>
              <span>{app.detail}</span>
            </button>
          );
        })}
      </div>
      <div className="mac-desktop-footer">
        <span><i /> Available for thoughtful work</span>
        <div className="mac-desktop-dock" aria-label="Quick application launcher">
          {apps.map((app) => {
            const Icon = app.icon;
            return <button key={app.label} type="button" onClick={app.action} aria-label={`Open ${app.label}`} title={app.label}><Icon /></button>;
          })}
        </div>
        <a href="#contact"><Mail /> Start a conversation</a>
      </div>
    </div>
  );
}

export function PortfolioDesktop({ content }: { content: PortfolioContent }) {
  const [activeApp, setActiveApp] = useState<ComputerApp>("desktop");
  const [terminalFocusRequest, setTerminalFocusRequest] = useState(0);

  const openApp = (app: ComputerApp) => {
    setActiveApp(app);
    if (app === "terminal") setTerminalFocusRequest((current) => current + 1);
  };

  return (
    <section className="mac-workspace" aria-label="Interactive portfolio workspace">
      {activeApp === "desktop" ? <DesktopHome open={openApp} projectCount={content.projects.length} /> : (
        <>
          <header className="mac-window-titlebar">
            <div className="mac-traffic-lights" aria-hidden="true"><i /><i /><i /></div>
            <div className="mac-window-name"><FolderCode /><span>{appTitles[activeApp]}</span></div>
            <span className="mac-window-status">uzairali.dev</span>
          </header>
          <div className="mac-workspace-shell">
            <nav className="mac-sidebar" aria-label="Workspace applications">
              <p>FAVORITES</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={activeApp === item.id ? "active" : ""}
                    onClick={() => openApp(item.id)}
                    aria-current={activeApp === item.id ? "page" : undefined}
                  >
                    <Icon /><span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className={`mac-app-content mac-app-content--${activeApp}`}>
              {activeApp === "terminal" && <PortfolioTerminal onOpen={openApp} content={content} focusRequest={terminalFocusRequest} />}
              {activeApp === "about" && <AboutPanel />}
              {activeApp === "projects" && <ProjectsPanel projects={content.projects} />}
              {activeApp === "snake" && <SnakeGame />}
              {activeApp === "pong" && <PongGame />}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
