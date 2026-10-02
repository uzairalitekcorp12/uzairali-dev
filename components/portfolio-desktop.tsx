"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FolderCode,
  Gamepad2,
  Home,
  Mail,
  Monitor,
  Power,
  ScrollText,
  TerminalSquare,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { PongGame } from "@/components/games/pong-game";
import { SnakeGame } from "@/components/games/snake-game";
import { PortfolioTerminal, type ComputerApp } from "@/components/portfolio-terminal";
import { portfolio, type PortfolioContent, type Project } from "@/data/portfolio";

const RetroComputerScene = dynamic(
  () => import("@/components/retro-computer-scene").then((module) => module.RetroComputerScene),
  { ssr: false },
);

const navItems: Array<{ id: ComputerApp; label: string; icon: typeof TerminalSquare }> = [
  { id: "desktop", label: "Desktop", icon: Home },
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "projects", label: "Projects", icon: FolderCode },
  { id: "about", label: "About", icon: UserRound },
  { id: "snake", label: "Snake", icon: Gamepad2 },
  { id: "pong", label: "Pong", icon: Monitor },
];

function AboutPanel() {
  return (
    <div className="crt-document">
      <p>ABOUT_UZAIR.TXT</p>
      <h3>{portfolio.person.name}</h3>
      <strong>{portfolio.person.role}</strong>
      <p>{portfolio.person.shortBio}</p>
      <div>{portfolio.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
      <button type="button" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
        Contact Uzair <ArrowUpRight />
      </button>
    </div>
  );
}

function ProjectsPanel({ projects }: { projects: Project[] }) {
  return (
    <div className="crt-projects">
      <header><div><p>PROJECTS/</p><h3>Selected records</h3></div><span>{projects.length} FILES</span></header>
      <div>
        {projects.map((project) => (
          <article key={project.slug}>
            <span>{project.number}</span>
            <div><h4>{project.title}</h4><p>{project.kind}</p></div>
            <Link href={`/projects/${project.slug}`} aria-label={`Read about ${project.title}`}><ArrowUpRight /></Link>
          </article>
        ))}
      </div>
      <Link href="/projects" className="crt-all-projects">Open full project archive <ArrowUpRight /></Link>
    </div>
  );
}

function DesktopHome({ open, projectCount }: { open: (app: ComputerApp) => void; projectCount: number }) {
  const apps = [
    { label: "Projects", detail: `${projectCount} items`, icon: FolderCode, action: () => open("projects") },
    { label: "About Uzair", detail: "Profile.txt", icon: FileText, action: () => open("about") },
    { label: "Terminal", detail: "Command line", icon: TerminalSquare, action: () => open("terminal") },
    { label: "Snake", detail: "Game.app", icon: Gamepad2, action: () => open("snake") },
    { label: "Pong", detail: "Game.app", icon: Monitor, action: () => open("pong") },
    { label: "Résumé", detail: "PDF document", icon: ScrollText, action: () => window.open("/resume", "_blank", "noopener,noreferrer") },
  ];

  return (
    <div className="crt-desktop-home">
      <div className="crt-desktop-welcome">
        <p>WELCOME BACK</p>
        <h3>Uzair Ali</h3>
        <span>Creative developer workspace</span>
      </div>
      <div className="crt-desktop-icons">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button key={app.label} type="button" onClick={app.action}>
              <i><Icon /></i><strong>{app.label}</strong><span>{app.detail}</span>
            </button>
          );
        })}
      </div>
      <div className="crt-desktop-dock">
        <button type="button" onClick={() => open("terminal")}><TerminalSquare /> Open terminal</button>
        <a href="#contact"><Mail /> Contact</a>
        <span>KHI / PK</span>
      </div>
    </div>
  );
}

export function PortfolioDesktop({ content }: { content: PortfolioContent }) {
  const [activeApp, setActiveApp] = useState<ComputerApp>("desktop");

  return (
    <div className="retro-computer">
      <RetroComputerScene />
      <div className="crt-monitor">
        <div className="crt-screen">
          <div className="crt-scanlines" aria-hidden="true" />
          <header className="crt-toolbar">
            <div><i /><strong>UZAIR/OS</strong><span>ONLINE</span></div>
            <nav aria-label="Computer applications">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={activeApp === item.id ? "active" : ""}
                    onClick={() => setActiveApp(item.id)}
                    title={item.label}
                  >
                    <Icon /><span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <button type="button" className="crt-power" onClick={() => setActiveApp("desktop")} aria-label="Return to desktop"><Power /></button>
          </header>
          <div className={`crt-app crt-app--${activeApp}`}>
            {activeApp === "desktop" && <DesktopHome open={setActiveApp} projectCount={content.projects.length} />}
            {activeApp === "terminal" && <PortfolioTerminal onOpen={setActiveApp} content={content} />}
            {activeApp === "about" && <AboutPanel />}
            {activeApp === "projects" && <ProjectsPanel projects={content.projects} />}
            {activeApp === "snake" && <SnakeGame />}
            {activeApp === "pong" && <PongGame />}
          </div>
        </div>
      </div>
    </div>
  );
}
