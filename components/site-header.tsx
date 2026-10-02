"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { portfolio } from "@/data/portfolio";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <a href="#home" className="site-logo" aria-label="Uzair Ali — home" onClick={() => setOpen(false)}>
        <span>UA</span>
        <i />
      </a>

      <nav className={`site-nav ${open ? "site-nav--open" : ""}`} aria-label="Primary navigation">
        {portfolio.navigation.map((item, index) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <small>0{index + 1}</small>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contact">
        Let&apos;s talk <span>↗</span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
