"use client";

import dynamic from "next/dynamic";

const BlackHoleHeroSection = dynamic(
  () => import("@/components/ui/black-hole-hero-section").then((module) => module.BlackHoleHeroSection),
  {
    ssr: false,
    loading: () => <div className="hero-black-hole-fallback" aria-hidden="true" />,
  },
);

export function HeroBlackHole() {
  return (
    <BlackHoleHeroSection
      focus={[0.42, 0.5]}
      steps={170}
      resolution={0.5}
      maxDpr={1.25}
      brightness={1.12}
      glow={1.14}
    />
  );
}
