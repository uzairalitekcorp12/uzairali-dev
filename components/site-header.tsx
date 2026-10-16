"use client";

import { ArrowUpRight, Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { portfolio } from "@/data/portfolio";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      let current: string = portfolio.navigation[0]?.href ?? "#home";
      for (const item of portfolio.navigation) {
        const section = document.querySelector(item.href);
        if (section instanceof HTMLElement && section.getBoundingClientRect().top <= window.innerHeight * 0.38) current = item.href;
      }
      setActiveHref(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 800) setOpen(false);
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", update);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", update);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <a href="#home" className="site-logo site-logo--header" aria-label="Uzair Ali - home" onClick={() => setOpen(false)}>
        <span className="site-logo-name"><span>UZAIR</span> <span>ALI</span></span>
        <Heart className="site-logo-heart" aria-hidden="true" fill="currentColor" />
      </a>

      <nav id="primary-navigation" className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Primary navigation">
        {portfolio.navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={activeHref === item.href ? "is-active" : ""}
            aria-current={activeHref === item.href ? "location" : undefined}
            onClick={() => {
              setActiveHref(item.href);
              setOpen(false);
            }}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contact">
        Let&apos;s talk <ArrowUpRight />
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
