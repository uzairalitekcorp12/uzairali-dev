"use client";

import { animate, stagger } from "animejs";
import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("is-revealed");
          const children = element.querySelectorAll("[data-reveal-child]");
          if (children.length) {
            animate(children, {
              opacity: { from: 0 },
              y: { from: 30 },
              duration: 850,
              delay: stagger(85),
              ease: "outExpo",
            });
          }
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
