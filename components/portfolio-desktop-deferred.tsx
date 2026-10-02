"use client";

import dynamic from "next/dynamic";
import type { PortfolioContent } from "@/data/portfolio";

const PortfolioDesktop = dynamic(
  () => import("@/components/portfolio-desktop").then((module) => module.PortfolioDesktop),
  {
    ssr: false,
    loading: () => <div className="portfolio-workspace-loading" aria-label="Loading interactive workspace">Loading workspace...</div>,
  },
);

export function PortfolioDesktopDeferred({ content }: { content: PortfolioContent }) {
  return <PortfolioDesktop content={content} />;
}
