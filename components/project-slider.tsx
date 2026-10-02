"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { portfolio } from "@/data/portfolio";

export function ProjectSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const projects = [...portfolio.projects, ...portfolio.projects];

  const move = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".project-slide-card");
    track.scrollBy({ left: direction * ((card?.offsetWidth ?? 420) + 20), behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => move(1), 3600);
    return () => window.clearInterval(timer);
  }, [move, paused]);

  const keepLooping = () => {
    const track = trackRef.current;
    if (!track) return;
    const halfway = track.scrollWidth / 2;
    if (track.scrollLeft >= halfway - 2) {
      track.scrollLeft -= halfway;
    }
  };

  return (
    <div
      className="project-slider"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="slider-controls">
        <p>Drag, swipe, or use the controls</p>
        <div>
          <button type="button" onClick={() => move(-1)} aria-label="Previous project"><ArrowLeft /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next project"><ArrowRight /></button>
        </div>
      </div>
      <div ref={trackRef} className="project-slider-track" onScroll={keepLooping}>
        {projects.map((project, index) => (
          <ProjectCard key={`${project.slug}-${index}`} project={project} />
        ))}
      </div>
    </div>
  );
}
