"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  FolderCode,
  Gamepad2,
  Github,
  Power,
  TerminalSquare,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { PongGame } from "@/components/games/pong-game";
import { SnakeGame } from "@/components/games/snake-game";
import { PortfolioTerminal, type ComputerApp } from "@/components/portfolio-terminal";
import { portfolio } from "@/data/portfolio";

const RetroComputerScene = dynamic(
  () => import("@/components/retro-computer-scene").then((module) => module.RetroComputerScene),
  { ssr: false },
);

const navItems: Array<{ id: ComputerApp; label: string; icon: typeof TerminalSquare }> = [
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "projects", label: "Projects", icon: FolderCode },
  { id: "about", label: "About", icon: UserRound },
  { id: "snake", label: "Snake", icon: Gamepad2 },
  { id: "pong", label: "Pong", icon: Gamepad2 },
];

function AboutPanel() {
  return (
    <div className="crt-document">
      <p>ABOUT.TXT</p>
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

function ProjectsPanel() {
  return (
    <div className="crt-projects">
      <header><div><p>PROJECTS/</p><h3>Selected records</h3></div><span>{portfolio.projects.length} FILES</span></header>
      <div>
        {portfolio.projects.map((project) => (
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

export function PortfolioDesktop() {
  const [activeApp, setActiveApp] = useState<ComputerApp>("terminal");

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
            <Power aria-hidden="true" />
          </header>
          <div className={`crt-app crt-app--${activeApp}`}>
            {activeApp === "terminal" && <PortfolioTerminal onOpen={setActiveApp} />}
            {activeApp === "about" && <AboutPanel />}
            {activeApp === "projects" && <ProjectsPanel />}
            {activeApp === "snake" && <SnakeGame />}
            {activeApp === "pong" && <PongGame />}
          </div>
        </div>
      </div>
      <div className="retro-computer-caption">
        <p><span>Interactive terminal</span> — try <code>help</code>, <code>ls</code>, or <code>start snake</code>.</p>
        <a href={portfolio.socials.github} target="_blank" rel="noreferrer"><Github /> GitHub</a>
      </div>
    </div>
  );
}
