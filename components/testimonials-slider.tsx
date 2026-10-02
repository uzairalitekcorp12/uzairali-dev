"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import testimonialOne from "@/assets/testimonal-1.jpeg";
import testimonialTwo from "@/assets/testimonal-2.jpeg";
import testimonialThree from "@/assets/testimonal-3.jpeg";
import { portfolio } from "@/data/portfolio";

const images = [testimonialOne, testimonialTwo, testimonialThree];

export function TestimonialsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inViewport, setInViewport] = useState(false);

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry?.isIntersecting ?? false), { threshold: 0.05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    const next = (index + portfolio.testimonials.length) % portfolio.testimonials.length;
    const track = trackRef.current;
    const card = track?.children[next] as HTMLElement | undefined;
    if (track && card) {
      const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({ left, behavior: "smooth" });
    }
    setActive(next);
  }, []);

  useEffect(() => {
    if (paused || !inViewport || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => goTo(active + 1), 4800);
    return () => window.clearInterval(timer);
  }, [active, goTo, inViewport, paused]);

  const syncActive = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const current = Math.abs(element.offsetLeft + element.offsetWidth / 2 - center);
      if (current < distance) {
        nearest = index;
        distance = current;
      }
    });
    setActive(nearest);
  };

  return (
    <div
      className="testimonials-slider"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div ref={trackRef} className="testimonials-track" onScroll={syncActive}>
        {portfolio.testimonials.map((testimonial, index) => (
          <article key={testimonial.name}>
            <div className="quote-mark">“</div>
            <span className="testimonial-stars" aria-label="Five star rating">
              {Array.from({ length: 5 }, (_, star) => <Star key={star} fill="currentColor" />)}
            </span>
            <blockquote>{testimonial.quote}</blockquote>
            <footer>
              <Image src={images[index]} alt="" width={58} height={58} placeholder="blur" />
              <div><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div>
            </footer>
          </article>
        ))}
      </div>
      <div className="testimonial-slider-footer">
        <div className="testimonial-dots" aria-label="Choose testimonial">
          {portfolio.testimonials.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={index === active ? "active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Show testimonial from ${item.name}`}
            />
          ))}
        </div>
        <div className="slider-controls-buttons">
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous testimonial"><ArrowLeft /></button>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Next testimonial"><ArrowRight /></button>
        </div>
      </div>
    </div>
  );
}
