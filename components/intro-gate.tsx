"use client";

import { animate, stagger } from "animejs";
import { ArrowDown, CornerDownLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CosmicScene } from "@/components/cosmic-scene";

export function IntroGate() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const enter = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    const shell = shellRef.current;
    if (shell) {
      animate(shell, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(12px)",
        duration: 850,
        ease: "inOutExpo",
      });
    }

    window.setTimeout(() => {
      setVisible(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 820);
  }, [leaving]);

  useEffect(() => {
    document.body.dataset.intro = "open";
    const targets = shellRef.current?.querySelectorAll("[data-intro-item]");
    if (targets?.length) {
      animate(targets, {
        opacity: 1,
        y: { from: 24 },
        duration: 1100,
        delay: stagger(130, { start: 450 }),
        ease: "outExpo",
      });
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape") enter();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      delete document.body.dataset.intro;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enter]);

  useEffect(() => {
    if (!visible) delete document.body.dataset.intro;
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={shellRef} className="intro-gate" role="dialog" aria-label="Portfolio introduction">
      <CosmicScene mode="intro" className="intro-canvas" />
      <div className="intro-noise" />
      <div className="intro-topline" data-intro-item>
        <span>UA / PORTFOLIO</span>
        <span className="intro-status"><i /> SYSTEM ONLINE</span>
      </div>

      <div className="intro-copy">
        <p data-intro-item className="eyebrow">A digital universe by</p>
        <h1 data-intro-item>
          UZAIR <span>ALI</span>
        </h1>
        <p data-intro-item className="intro-subtitle">
          Developer. Designer. Builder of thoughtful digital experiences.
        </p>
        <button data-intro-item type="button" onClick={enter} className="intro-enter">
          <span>Enter portfolio</span>
          <span className="intro-key"><CornerDownLeft size={14} /> ENTER</span>
        </button>
      </div>

      <button data-intro-item type="button" onClick={enter} className="intro-skip">
        Skip intro <ArrowDown size={14} />
      </button>
    </div>
  );
}
