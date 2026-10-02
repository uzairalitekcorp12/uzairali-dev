"use client";

import { FormEvent, useRef, useState } from "react";
import { portfolio } from "@/data/portfolio";

const help = "Commands: about, skills, education, projects, contact, clear";

function runCommand(command: string): string[] {
  switch (command.trim().toLowerCase()) {
    case "help":
      return [help];
    case "about":
      return [portfolio.person.shortBio];
    case "skills":
      return [portfolio.skills.join("  •  ")];
    case "education":
      return portfolio.education.map((item) => `${item.title} — ${item.place}`);
    case "projects":
      return portfolio.projects.map((project) => `${project.number}. ${project.title} / ${project.kind}`);
    case "contact":
      return ["Open the Contact section or send a WhatsApp message from the desktop shortcut."];
    case "":
      return [];
    default:
      return [`Command not found: ${command}. Type “help” to see what works.`];
  }
}

export function PortfolioTerminal() {
  const [history, setHistory] = useState<string[]>([
    "UzairOS terminal [Version 2.0]",
    "Welcome, visitor. Type “help” to explore.",
  ]);
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = command.trim();
    if (value.toLowerCase() === "clear") {
      setHistory([]);
    } else {
      setHistory((current) => [...current, `visitor@uzair:~$ ${value}`, ...runCommand(value)]);
    }
    setCommand("");
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-history" aria-live="polite">
        {history.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
      </div>
      <form onSubmit={submit} className="terminal-prompt">
        <label htmlFor="terminal-command">visitor@uzair:~$</label>
        <input
          ref={inputRef}
          id="terminal-command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command"
        />
      </form>
    </div>
  );
}
