"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    document.documentElement.classList.add("reveal-ready");

    elements.forEach((element) => {
      element.querySelectorAll<HTMLElement>("[data-reveal-child]").forEach((child, index) => {
        child.style.setProperty("--reveal-delay", `${Math.min(index * 70, 350)}ms`);
      });
    });

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return () => document.documentElement.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("is-revealed");
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
