"use client";

import {
  BatteryFull,
  CircleUserRound,
  ExternalLink,
  FolderCode,
  Gamepad2,
  Github,
  Maximize2,
  MessageCircle,
  Minus,
  MonitorUp,
  TerminalSquare,
  Wifi,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { PongGame } from "@/components/games/pong-game";
import { SnakeGame } from "@/components/games/snake-game";
import { PortfolioTerminal } from "@/components/portfolio-terminal";
import { portfolio } from "@/data/portfolio";

type AppId = "welcome" | "about" | "projects" | "snake" | "pong" | "terminal";

type DesktopApp = {
  id: AppId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  accent: string;
};

const apps: DesktopApp[] = [
  { id: "about", label: "About_Uzair", shortLabel: "About", icon: CircleUserRound, accent: "violet" },
  { id: "projects", label: "Selected_Work", shortLabel: "Work", icon: FolderCode, accent: "cyan" },
  { id: "snake", label: "Snake.exe", shortLabel: "Snake", icon: Gamepad2, accent: "lime" },
  { id: "pong", label: "Pong.exe", shortLabel: "Pong", icon: MonitorUp, accent: "rose" },
  { id: "terminal", label: "Terminal", shortLabel: "Terminal", icon: TerminalSquare, accent: "amber" },
];

function WelcomeScreen({ open }: { open: (app: AppId) => void }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-orbit" aria-hidden="true"><i /><i /><i /></div>
      <p className="desktop-kicker">UZAIR_OS / BUILD 2.0</p>
      <h3>A portfolio you can play with.</h3>
      <p>
        Open a file, run a game, or use the terminal. The whole desktop works with mouse,
        keyboard, and touch.
      </p>
      <div className="welcome-actions">
        <button type="button" onClick={() => open("projects")}><FolderCode /> Explore work</button>
        <button type="button" onClick={() => open("snake")}><Gamepad2 /> Play a game</button>
      </div>
      <dl>
        <div><dt>STATUS</dt><dd>Available</dd></div>
        <div><dt>LOCATION</dt><dd>Karachi, PK</dd></div>
        <div><dt>FOCUS</dt><dd>Web + Product</dd></div>
      </dl>
    </div>
  );
}

function AboutFile() {
  return (
    <div className="desktop-document">
      <p className="desktop-kicker">ABOUT.TXT</p>
      <h3>{portfolio.person.name}</h3>
      <p className="document-lead">{portfolio.person.shortBio}</p>
      <div className="document-grid">
        <div><small>ROLE</small><strong>{portfolio.person.role}</strong></div>
        <div><small>BASED IN</small><strong>{portfolio.person.location}</strong></div>
      </div>
      <div className="document-skills">
        {portfolio.skills.map((skill) => <span key={skill}>{skill}</span>)}
      </div>
    </div>
  );
}

function ProjectExplorer() {
  return (
    <div className="project-explorer">
      <div className="explorer-sidebar">
        <strong>Favorites</strong>
        <span>◆ All work</span>
        <span>⌁ Web</span>
        <span>◫ Experiments</span>
      </div>
      <div className="explorer-files">
        {portfolio.projects.map((project) => (
          <article key={project.title}>
            <span className={`file-art file-art--${project.accent}`}>{project.number}</span>
            <div>
              <h4>{project.title}</h4>
              <p>{project.kind}</p>
              <div>{project.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>
            </div>
            <a href={project.github} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
              <ExternalLink />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function AppContent({ app, open }: { app: AppId; open: (app: AppId) => void }) {
  switch (app) {
    case "about":
      return <AboutFile />;
    case "projects":
      return <ProjectExplorer />;
    case "snake":
      return <SnakeGame />;
    case "pong":
      return <PongGame />;
    case "terminal":
      return <PortfolioTerminal />;
    default:
      return <WelcomeScreen open={open} />;
  }
}

export function PortfolioDesktop() {
  const [activeApp, setActiveApp] = useState<AppId | null>("welcome");
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setTime(new Date());
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const activeDetails = activeApp === "welcome"
    ? { label: "Welcome", icon: MonitorUp }
    : apps.find((app) => app.id === activeApp);
  const ActiveIcon = activeDetails?.icon ?? MonitorUp;

  return (
    <div className="computer-frame">
      <div className="computer-camera"><i /></div>
      <div className="computer-screen">
        <div className="desktop-wallpaper" aria-hidden="true">
          <span className="wallpaper-orb wallpaper-orb--one" />
          <span className="wallpaper-orb wallpaper-orb--two" />
          <span className="wallpaper-grid" />
        </div>

        <div className="desktop-icons" aria-label="Desktop applications">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                type="button"
                className={`desktop-icon desktop-icon--${app.accent}`}
                onClick={() => setActiveApp(app.id)}
              >
                <span><Icon /></span>
                {app.label}
              </button>
            );
          })}
        </div>

        {activeApp && (
          <section className={`desktop-window desktop-window--${activeApp}`} aria-label={`${activeDetails?.label} window`}>
            <header className="window-bar">
              <div className="window-dots">
                <button type="button" aria-label="Close window" onClick={() => setActiveApp(null)}><X /></button>
                <button type="button" aria-label="Minimize window" onClick={() => setActiveApp(null)}><Minus /></button>
                <span><Maximize2 /></span>
              </div>
              <p><ActiveIcon /> {activeDetails?.label}</p>
              <span />
            </header>
            <div className="window-content">
              <AppContent app={activeApp} open={setActiveApp} />
            </div>
          </section>
        )}

        <div className="desktop-taskbar">
          <button type="button" className="taskbar-brand" onClick={() => setActiveApp("welcome")} aria-label="Open welcome">
            UA
          </button>
          <div className="taskbar-apps">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  className={activeApp === app.id ? "active" : ""}
                  onClick={() => setActiveApp(app.id)}
                  aria-label={`Open ${app.shortLabel}`}
                >
                  <Icon /> <span>{app.shortLabel}</span>
                </button>
              );
            })}
          </div>
          <div className="taskbar-status">
            <Wifi />
            <BatteryFull />
            <time>{time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</time>
          </div>
        </div>
      </div>
      <div className="computer-chin"><span>UZAIR / LAB</span></div>
      <div className="computer-stand" aria-hidden="true"><i /></div>
      <div className="computer-mobile-note">
        <Gamepad2 /> Touch-ready — try the games on your phone.
      </div>
      <div className="computer-links">
        <a href={portfolio.socials.github} target="_blank" rel="noreferrer"><Github /> GitHub</a>
        <a href={portfolio.socials.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> Message</a>
      </div>
    </div>
  );
}
