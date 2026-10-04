"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { PortfolioContent } from "@/data/portfolio";

const PortfolioDesktop = dynamic(
  () => import("@/components/portfolio-desktop").then((module) => module.PortfolioDesktop),
  {
    ssr: false,
    loading: () => <div className="portfolio-workspace-loading" aria-label="Loading interactive workspace">Loading workspace...</div>,
  },
);

export function PortfolioDesktopDeferred({ content }: { content: PortfolioContent }) {
  const markerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: "700px 0px" });
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={markerRef} className="portfolio-workspace-deferred">
      {shouldLoad
        ? <PortfolioDesktop content={content} />
        : <div className="portfolio-workspace-loading" aria-label="Interactive studio loads as you approach"><span /> Preparing interactive studio…</div>}
    </div>
  );
}
