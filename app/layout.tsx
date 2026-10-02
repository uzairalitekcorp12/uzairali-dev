import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Uzair Ali — Full-stack Developer & Designer",
    template: "%s — Uzair Ali",
  },
  description:
    "Portfolio of Uzair Ali, a full-stack developer and digital designer in Karachi creating memorable, high-performance web experiences.",
  keywords: [
    "Uzair Ali",
    "full-stack developer",
    "React developer",
    "Next.js developer",
    "web designer",
    "Karachi",
  ],
  authors: [{ name: "Uzair Ali" }],
  creator: "Uzair Ali",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Uzair Ali — Full-stack Developer & Designer",
    description: "Engineering sharp, expressive digital experiences.",
    siteName: "Uzair Ali Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uzair Ali — Full-stack Developer & Designer",
    description: "Engineering sharp, expressive digital experiences.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
