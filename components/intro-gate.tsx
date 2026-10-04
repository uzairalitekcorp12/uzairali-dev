"use client";

import { animate, stagger } from "animejs";
import { ArrowDown, CornerDownLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SpiralAnimation } from "@/components/ui/spiral-animation";

export function IntroGate() {
  const [visible, setVisible] = useState(true);
  const leavingRef = useRef(false);
  const shellRef = useRef<HTMLDivElement>(null);

  const enter = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    const shell = shellRef.current;
    if (shell) {
      animate(shell, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(12px)",
        duration: 825,
        ease: "inOutExpo",
      });
    }

    window.setTimeout(() => {
      setVisible(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 795);
  }, []);

  useEffect(() => {
    document.body.dataset.intro = "open";
    const targets = shellRef.current?.querySelectorAll("[data-intro-item]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (targets?.length && reduceMotion) {
      targets.forEach((target) => {
        (target as HTMLElement).style.opacity = "1";
      });
    } else if (targets?.length) {
      animate(targets, {
        opacity: 1,
        y: { from: 24 },
        duration: 1068,
        delay: stagger(126, { start: 436 }),
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
    <div ref={shellRef} className="intro-gate" role="dialog" aria-modal="true" aria-label="Portfolio introduction">
      <div className="intro-canvas"><SpiralAnimation /></div>
      <div className="intro-topline" data-intro-item>
        <span>UZAIR ALI</span>
        <span className="intro-status"><i /> PORTFOLIO / 2026</span>
      </div>

      <div className="intro-copy">
        <p data-intro-item className="eyebrow">Independent designer + developer</p>
        <h1 data-intro-item>
          UZAIR <span>ALI</span>
        </h1>
        <p data-intro-item className="intro-subtitle">
          Thoughtful digital experiences, shaped from concept to code.
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
