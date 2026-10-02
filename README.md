# Uzair Ali — Portfolio v2

A responsive, interactive portfolio built with Next.js, React, TypeScript, Tailwind CSS, Three.js, and Anime.js.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production check:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Edit your content

Almost all personal content is in one file:

```text
data/portfolio.ts
```

Edit that file to update:

- name, role, bio, location, and availability
- navigation and social links
- stats and skills
- services
- projects and project links
- experience and education
- testimonials

Images live in `assets/`. The main portrait and testimonials are imported in `app/page.tsx`. Replace an image while keeping its filename, or update the matching import.

The résumé button serves `Uzair_Ali_Resume.pdf` through `app/resume/route.ts`. Replace the PDF with a new file using the same filename to update it.

## Main components

```text
app/page.tsx                    Main page and sections
app/globals.css                 Visual system and responsive layout
components/cosmic-scene.tsx    Three.js intro and black-hole scenes
components/intro-gate.tsx      Opening experience and Anime.js motion
components/portfolio-desktop.tsx
components/games/snake-game.tsx
components/games/pong-game.tsx
components/portfolio-terminal.tsx
```

## Deploy to Vercel

Push the repository to GitHub, import it in Vercel, and keep the detected framework preset as **Next.js**. No environment variables are required.

You can also deploy from the command line:

```bash
npx vercel
```
