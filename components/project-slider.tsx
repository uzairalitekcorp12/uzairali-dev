"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/data/portfolio";

export function ProjectSlider({ items }: { items: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const projects = [...items, ...items];

  useEffect(() => {
    if (paused || items.length < 2) return;
    let frame = 0;
    let previous = performance.now();
    const move = (now: number) => {
      const track = trackRef.current;
      const delta = Math.min(40, now - previous);
      previous = now;
      if (track) track.scrollLeft += delta * 0.028;
      frame = window.requestAnimationFrame(move);
    };
    frame = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frame);
  }, [items.length, paused]);

  const keepLooping = () => {
    const track = trackRef.current;
    if (!track) return;
    const halfway = track.scrollWidth / 2;
    if (halfway > 0 && track.scrollLeft >= halfway - 2) track.scrollLeft -= halfway;
  };

  return (
    <div
      className="project-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="slider-controls">
        <p><span /> Moving automatically — hover to pause or swipe on touch</p>
      </div>
      <div ref={trackRef} className="project-slider-track" onScroll={keepLooping}>
        {projects.map((project, index) => (
          <ProjectCard key={`${project.slug}-${index}`} project={project} />
        ))}
      </div>
    </div>
  );
}
