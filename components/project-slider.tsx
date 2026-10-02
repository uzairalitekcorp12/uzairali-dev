"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/data/portfolio";

export function ProjectSlider({ items }: { items: Project[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ pointerId: -1, startX: 0, startY: 0, scrollLeft: 0, axis: "pending" as "pending" | "horizontal" | "vertical", moved: false });
  const suppressClick = useRef(false);
  const [paused, setPaused] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [dragging, setDragging] = useState(false);
  const projects = [...items, ...items];

  useEffect(() => {
    const element = sliderRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry?.isIntersecting ?? false), { threshold: 0.05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inViewport || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let previous = performance.now();
    let documentVisible = !document.hidden;
    const move = (now: number) => {
      if (!documentVisible) {
        frame = 0;
        return;
      }
      const track = trackRef.current;
      const delta = Math.min(40, now - previous);
      previous = now;
      if (track) track.scrollLeft += delta * 0.028;
      frame = window.requestAnimationFrame(move);
    };
    frame = window.requestAnimationFrame(move);
    const onVisibilityChange = () => {
      documentVisible = !document.hidden;
      previous = performance.now();
      if (documentVisible && !frame) frame = window.requestAnimationFrame(move);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [inViewport, items.length, paused]);

  const keepLooping = () => {
    const track = trackRef.current;
    if (!track) return;
    const halfway = track.scrollWidth / 2;
    if (halfway > 0 && track.scrollLeft >= halfway - 2) track.scrollLeft -= halfway;
  };

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".project-slide-card");
    const amount = card?.getBoundingClientRect().width ?? track.clientWidth * 0.8;
    track.scrollBy({ left: direction * (amount + 20), behavior: "smooth" });
  };

  const onDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, scrollLeft: track.scrollLeft, axis: "pending", moved: false };
    track.setPointerCapture(event.pointerId);
    setPaused(true);
    setDragging(true);
  };

  const onDragMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = dragState.current;
    if (!track || state.pointerId !== event.pointerId || state.axis === "vertical") return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    if (state.axis === "pending") {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 6) return;
      state.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
      if (state.axis === "vertical") return;
    }

    state.moved = true;
    track.scrollLeft = state.scrollLeft - deltaX;
  };

  const onDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = dragState.current;
    if (state.pointerId !== event.pointerId) return;
    if (track?.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (state.moved) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 0);
    }
    dragState.current.pointerId = -1;
    setDragging(false);
    setPaused(false);
  };

  return (
    <div
      ref={sliderRef}
      className={`project-slider ${dragging ? "is-dragging" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (dragState.current.pointerId === -1) setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="slider-controls">
        <div className="slider-controls-buttons" aria-label="Project slider controls">
          <button type="button" aria-label="Show previous projects" onClick={() => scrollByCard(-1)}><ArrowLeft /></button>
          <button type="button" aria-label="Show next projects" onClick={() => scrollByCard(1)}><ArrowRight /></button>
        </div>
        <p><span /> Moving automatically — hover to pause or swipe on touch</p>
      </div>
      <div
        ref={trackRef}
        className="project-slider-track"
        tabIndex={0}
        role="region"
        aria-label="Featured projects. Drag or swipe to explore."
        onScroll={keepLooping}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={`${project.slug}-${index}`} project={project} />
        ))}
      </div>
    </div>
  );
}
