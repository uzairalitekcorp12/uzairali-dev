"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { portfolio } from "@/data/portfolio";

export type ComputerApp = "terminal" | "projects" | "about" | "snake" | "pong";

type TerminalLine = {
  text: string;
  tone?: "muted" | "accent" | "error" | "prompt";
};

const shortcuts = ["help", "ls", "about", "start projects", "start snake", "start pong"];
const validDirectories = ["/home/visitor", "/home/visitor/about", "/home/visitor/projects", "/home/visitor/games"];

const bootLines: TerminalLine[] = [
  { text: "UZAIR/OS 3.1.0 — portfolio interface", tone: "accent" },
  { text: "Memory check ................. OK", tone: "muted" },
  { text: "Interactive modules .......... READY", tone: "muted" },
  { text: "Type `help` or choose a command below." },
];

export function PortfolioTerminal({ onOpen }: { onOpen: (app: ComputerApp) => void }) {
  const [lines, setLines] = useState<TerminalLine[]>(bootLines);
  const [command, setCommand] = useState("");
  const [directory, setDirectory] = useState("/home/visitor");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const prompt = `${directory.replace("/home/visitor", "~") || "~"} $`;

  const execute = (raw: string): TerminalLine[] => {
    const normalized = raw.trim().replace(/\s+/g, " ");
    const lower = normalized.toLowerCase();
    const [name, ...args] = lower.split(" ");

    if (!normalized) return [];
    if (lower === "help") {
      return [
        { text: "AVAILABLE COMMANDS", tone: "accent" },
        { text: "  ls                 list files and directories" },
        { text: "  cd <name>          change directory (about, projects, games, ..)" },
        { text: "  cat <file>         read about.txt, skills.txt, education.txt" },
        { text: "  start project(s)   open the project explorer" },
        { text: "  start snake        launch Snake" },
        { text: "  start pong         launch Pong" },
        { text: "  open resume        open résumé in a new tab" },
        { text: "  contact            jump to the contact form" },
        { text: "  pwd / whoami / date / clear" },
      ];
    }
    if (lower === "clear" || lower === "cls") {
      return [];
    }
    if (lower === "pwd") return [{ text: directory }];
    if (lower === "whoami") return [{ text: "visitor — exploring Uzair Ali's portfolio" }];
    if (lower === "date") return [{ text: new Date().toLocaleString() }];
    if (lower === "about") {
      onOpen("about");
      return [{ text: "Opening /about/about.txt …", tone: "accent" }];
    }
    if (lower === "skills") return [{ text: portfolio.skills.join("  ·  ") }];
    if (lower === "education") {
      return portfolio.education.map((item) => ({ text: `${item.title} — ${item.place}` }));
    }
    if (lower === "projects") {
      onOpen("projects");
      return [{ text: `Opening ${portfolio.projects.length} project records …`, tone: "accent" }];
    }
    if (lower === "ls") {
      if (directory.endsWith("/projects")) {
        return portfolio.projects.map((project) => ({ text: `${project.slug}.project` }));
      }
      if (directory.endsWith("/games")) return [{ text: "snake.exe    pong.exe" }];
      if (directory.endsWith("/about")) return [{ text: "about.txt    skills.txt    education.txt" }];
      return [{ text: "about/    projects/    games/    resume.pdf    contact.link" }];
    }
    if (name === "cd") {
      const target = args.join(" ");
      let next = directory;
      if (!target || target === "~" || target === "/home/visitor") next = "/home/visitor";
      else if (target === "..") next = directory.split("/").slice(0, -1).join("/") || "/home/visitor";
      else if (["about", "projects", "games"].includes(target)) next = `/home/visitor/${target}`;
      if (!validDirectories.includes(next)) return [{ text: `cd: no such directory: ${target}`, tone: "error" }];
      setDirectory(next);
      return [];
    }
    if (name === "cat") {
      const file = args.join(" ");
      if (file === "about.txt") return [{ text: portfolio.person.shortBio }];
      if (file === "skills.txt") return [{ text: portfolio.skills.join("  ·  ") }];
      if (file === "education.txt") {
        return portfolio.education.map((item) => ({ text: `${item.period} | ${item.title} | ${item.place}` }));
      }
      return [{ text: `cat: ${file || "missing filename"}: file not found`, tone: "error" }];
    }
    if (name === "start") {
      const app = args.join(" ");
      if (app === "project" || app === "projects") {
        onOpen("projects");
        return [{ text: "Starting project explorer …", tone: "accent" }];
      }
      if (app === "snake" || app === "snake.exe") {
        onOpen("snake");
        return [{ text: "Loading SNAKE.EXE …", tone: "accent" }];
      }
      if (app === "pong" || app === "pong.exe" || app === "ping pong") {
        onOpen("pong");
        return [{ text: "Loading PONG.EXE …", tone: "accent" }];
      }
      return [{ text: `start: unknown program: ${app}`, tone: "error" }];
    }
    if (lower === "open resume" || lower === "resume") {
      window.open("/resume", "_blank", "noopener,noreferrer");
      return [{ text: "Opening resume.pdf in a new tab …", tone: "accent" }];
    }
    if (lower === "contact") {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      return [{ text: "Moving to contact channel …", tone: "accent" }];
    }
    if (name === "echo") return [{ text: raw.trim().slice(5) }];
    return [{ text: `${name}: command not found. Type 'help'.`, tone: "error" }];
  };

  const run = (value: string) => {
    if (!value.trim()) return;
    const output = execute(value);
    const clearsScreen = ["clear", "cls"].includes(value.trim().toLowerCase());
    setLines((current) => clearsScreen ? [] : [
      ...current,
      { text: `${prompt} ${value}`, tone: "prompt" },
      ...output,
    ]);
    setCommandHistory((current) => [...current, value]);
    setHistoryIndex(-1);
    setCommand("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    run(command);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && commandHistory.length) {
      event.preventDefault();
      const next = Math.min(commandHistory.length - 1, historyIndex + 1);
      setHistoryIndex(next);
      setCommand(commandHistory[commandHistory.length - 1 - next]);
    }
    if (event.key === "ArrowDown" && historyIndex >= 0) {
      event.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setCommand(next < 0 ? "" : commandHistory[commandHistory.length - 1 - next]);
    }
  };

  return (
    <div className="crt-terminal" onClick={() => inputRef.current?.focus()}>
      <div ref={outputRef} className="crt-terminal-output" aria-live="polite">
        {lines.map((line, index) => (
          <p key={`${line.text}-${index}`} className={line.tone ? `terminal-${line.tone}` : undefined}>{line.text}</p>
        ))}
      </div>
      <form onSubmit={submit} className="crt-terminal-prompt">
        <label htmlFor="terminal-command">{prompt}</label>
        <input
          ref={inputRef}
          id="terminal-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command"
        />
        <span aria-hidden="true" />
      </form>
      <div className="terminal-shortcuts" aria-label="Command shortcuts">
        {shortcuts.map((shortcut) => (
          <button key={shortcut} type="button" onClick={() => run(shortcut)}>{shortcut}</button>
        ))}
      </div>
    </div>
  );
}
