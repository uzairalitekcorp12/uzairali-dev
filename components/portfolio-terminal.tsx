"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { portfolio, type PortfolioContent } from "@/data/portfolio";

export type ComputerApp = "desktop" | "terminal" | "projects" | "about" | "snake" | "pong";

type TerminalLine = {
  text: string;
  tone?: "muted" | "accent" | "error" | "prompt";
};

const shortcuts = ["help", "ls", "cat about.txt", "start projects", "start snake", "neofetch"];
const validDirectories = ["/home/visitor", "/home/visitor/about", "/home/visitor/projects", "/home/visitor/games"];
const commandWords = ["help", "clear", "cls", "ls", "cd", "cat", "start", "open", "resume", "contact", "about", "skills", "education", "projects", "history", "neofetch", "pwd", "whoami", "date", "echo"];
const argumentCommands = new Set(["cd", "cat", "start", "open", "echo"]);

const bootLines: TerminalLine[] = [
  { text: "Uzair Terminal 1.0.0 - portfolio workspace", tone: "accent" },
  { text: "Memory check ................. OK", tone: "muted" },
  { text: "Interactive modules .......... READY", tone: "muted" },
  { text: "Press Tab to complete commands, folders, and files.", tone: "muted" },
  { text: "Type `help` or choose a command below." },
];

function editDistance(left: string, right: string) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const previous = row[rightIndex];
      row[rightIndex] = Math.min(
        row[rightIndex] + 1,
        row[rightIndex - 1] + 1,
        diagonal + Number(left[leftIndex - 1] !== right[rightIndex - 1]),
      );
      diagonal = previous;
    }
  }
  return row[right.length];
}

function nearestCompletion(prefix: string, options: string[]) {
  const normalized = prefix.toLowerCase();
  return options.find((option) => option.startsWith(normalized))
    ?? [...options].sort((left, right) => editDistance(normalized, left) - editDistance(normalized, right))[0];
}

export function PortfolioTerminal({
  onOpen,
  content,
  focusRequest = 0,
}: {
  onOpen: (app: ComputerApp) => void;
  content: PortfolioContent;
  focusRequest?: number;
}) {
  const [lines, setLines] = useState<TerminalLine[]>(bootLines);
  const [command, setCommand] = useState("");
  const [directory, setDirectory] = useState("/home/visitor");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  useEffect(() => {
    const frame = window.requestAnimationFrame(focusInput);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!focusRequest) return;
    const frame = window.requestAnimationFrame(focusInput);
    const timeout = window.setTimeout(focusInput, 100);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [focusRequest]);

  useEffect(() => () => {
    void audioContextRef.current?.close();
  }, []);

  const playTone = (frequency = 270, duration = 0.025, volume = 0.025) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const context = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = context;
      const start = () => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, context.currentTime);
        gain.gain.setValueAtTime(volume, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + duration);
      };
      if (context.state === "suspended") void context.resume().then(start).catch(() => undefined);
      else start();
    } catch {
      // Audio is optional; a browser without Web Audio still gets a complete terminal.
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!next || typeof window === "undefined") return;
    try {
      const context = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = context;
      if (context.state === "suspended") void context.resume();
    } catch {
      // The preference is retained even where audio cannot be started.
    }
  };

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
        { text: "  open resume        open resume in a new tab" },
        { text: "  contact            jump to the contact form" },
        { text: "  history / neofetch / pwd / whoami / date / clear" },
      ];
    }
    if (lower === "clear" || lower === "cls") return [];
    if (lower === "pwd") return [{ text: directory }];
    if (lower === "whoami") return [{ text: "visitor - exploring Uzair Ali's portfolio" }];
    if (lower === "date") return [{ text: new Date().toLocaleString() }];
    if (lower === "history") {
      return commandHistory.length
        ? commandHistory.map((entry, index) => ({ text: `${String(index + 1).padStart(2, " ")}  ${entry}`, tone: "muted" }))
        : [{ text: "No commands in this session yet.", tone: "muted" }];
    }
    if (lower === "neofetch") {
      return [
        { text: "uzair@portfolio", tone: "accent" },
        { text: "----------------" },
        { text: `Role: ${portfolio.person.role}` },
        { text: `Location: ${portfolio.person.location}` },
        { text: `Focus: ${portfolio.skills.slice(0, 4).join(" / ")}` },
        { text: "Shell: interactive portfolio terminal" },
      ];
    }
    if (lower === "about") {
      onOpen("about");
      return [{ text: "Opening /about/about.txt ...", tone: "accent" }];
    }
    if (lower === "skills") return [{ text: portfolio.skills.join(" / ") }];
    if (lower === "education") return content.education.map((item) => ({ text: `${item.title} - ${item.place}` }));
    if (lower === "projects") {
      onOpen("projects");
      return [{ text: `Opening ${content.projects.length} project records ...`, tone: "accent" }];
    }
    if (lower === "ls") {
      if (directory.endsWith("/projects")) return content.projects.map((project) => ({ text: `${project.slug}.project` }));
      if (directory.endsWith("/games")) return [{ text: "snake.app    pong.app" }];
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
      if (file === "skills.txt") return [{ text: portfolio.skills.join(" / ") }];
      if (file === "education.txt") return content.education.map((item) => ({ text: `${item.period} | ${item.title} | ${item.place}` }));
      return [{ text: `cat: ${file || "missing filename"}: file not found`, tone: "error" }];
    }
    if (name === "start") {
      const app = args.join(" ");
      if (app === "project" || app === "projects") {
        onOpen("projects");
        return [{ text: "Starting project explorer ...", tone: "accent" }];
      }
      if (app === "snake" || app === "snake.app" || app === "snake.exe") {
        onOpen("snake");
        return [{ text: "Loading SNAKE.APP ...", tone: "accent" }];
      }
      if (app === "pong" || app === "pong.app" || app === "pong.exe" || app === "ping pong") {
        onOpen("pong");
        return [{ text: "Loading PONG.APP ...", tone: "accent" }];
      }
      return [{ text: `start: unknown program: ${app}`, tone: "error" }];
    }
    if (lower === "open resume" || lower === "resume") {
      window.open("/resume", "_blank", "noopener,noreferrer");
      return [{ text: "Opening resume.pdf in a new tab ...", tone: "accent" }];
    }
    if (lower === "contact") {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      return [{ text: "Moving to contact channel ...", tone: "accent" }];
    }
    if (name === "echo") return [{ text: raw.trim().slice(5) }];
    return [{ text: `${name}: command not found. Type 'help'.`, tone: "error" }];
  };

  const run = (value: string) => {
    if (!value.trim()) return;
    playTone(420, 0.045, 0.035);
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
    if (event.key === "Tab") {
      event.preventDefault();
      const words = command.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.length) return;
      const hasTrailingSpace = /\s$/.test(command);
      const argumentIndex = hasTrailingSpace ? words.length : words.length - 1;
      const program = words[0];
      const prefix = hasTrailingSpace ? "" : words.at(-1) ?? "";
      const options = argumentIndex === 0
        ? commandWords
        : program === "cd"
          ? ["about", "projects", "games", "..", "~"]
          : program === "cat"
            ? ["about.txt", "skills.txt", "education.txt"]
            : program === "start"
              ? ["projects", "project", "snake", "pong"]
              : program === "open"
                ? ["resume"]
                : program === "echo"
                  ? []
                  : directory.endsWith("/projects")
                    ? content.projects.map((project) => `${project.slug}.project`)
                    : [];
      const completion = options.length ? nearestCompletion(prefix, options) : undefined;
      if (!completion) return;
      const start = hasTrailingSpace ? command.length : command.length - prefix.length;
      const addSpace = argumentIndex === 0 && argumentCommands.has(completion);
      setCommand(`${command.slice(0, start)}${completion}${addSpace ? " " : ""}`);
      playTone(590, 0.035, 0.03);
      return;
    }
    if (event.key.length === 1 || event.key === "Enter" || event.key === "Backspace") playTone();
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
    <div className="crt-terminal" onPointerDown={focusInput}>
      <header className="terminal-titlebar">
        <div className="terminal-traffic-lights" aria-hidden="true"><i /><i /><i /></div>
        <span>visitor@uzair - zsh</span>
        <button
          type="button"
          className="terminal-sound-toggle"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? "Turn terminal sound off" : "Turn terminal sound on"}
          title={soundEnabled ? "Turn terminal sound off" : "Turn terminal sound on"}
        >
          {soundEnabled ? <Volume2 /> : <VolumeX />}
        </button>
      </header>
      <div ref={outputRef} className="crt-terminal-output" aria-live="polite" aria-label="Terminal output">
        {lines.map((line, index) => <p key={`${line.text}-${index}`} className={line.tone ? `terminal-${line.tone}` : undefined}>{line.text}</p>)}
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
          inputMode="text"
          enterKeyHint="send"
          aria-label="Terminal command"
        />
        <span aria-hidden="true" />
      </form>
      <button type="button" className="terminal-mobile-focus" onClick={focusInput}>Tap to type a command</button>
      <div className="terminal-shortcuts" aria-label="Command shortcuts">
        {shortcuts.map((shortcut) => <button key={shortcut} type="button" onClick={() => run(shortcut)}>{shortcut}</button>)}
      </div>
    </div>
  );
}
