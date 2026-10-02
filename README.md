# Uzair Ali — Portfolio v3

A responsive portfolio built with Next.js, React, TypeScript, Tailwind CSS, Three.js, WebGL, and Anime.js.

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

Each project automatically appears in the home-page carousel, the `/projects` archive, and its own `/projects/[slug]` case-study route. Add another object to `portfolio.projects` to add another project everywhere.

Images live in `assets/`. The portrait is imported in `app/page.tsx`; testimonial portraits are imported in `components/testimonials-slider.tsx`. Replace an image while keeping its filename, or update the matching import.

The résumé button serves `Uzair_Ali_Resume.pdf` through `app/resume/route.ts`. Replace the PDF with a new file using the same filename to update it.

## Main components

```text
app/page.tsx                              Main page and sections
app/projects/                             Project archive and slug pages
app/admin/                                Private admin workspace
app/api/contact/route.ts                  Contact-form endpoint
app/globals.css                           Visual system and responsive layout
components/ui/spiral-animation.tsx        Opening particle experience
components/ui/black-hole-hero-section.tsx Hero WebGL black hole
components/portfolio-desktop.tsx          3D CRT interface
components/portfolio-terminal.tsx         Command terminal
components/games/                         Snake and Pong
data/portfolio.ts                         Editable portfolio content
```

## Admin and contact storage

Local development stores submissions, reminders, and notes in the ignored `.data/` directory. Create `.env.development.local` from `.env.example` and set:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
```

For Vercel, connect an Upstash Redis database and add its REST variables as either `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_URL` / `KV_REST_API_TOKEN`. Add the three admin variables in Vercel as well. The `/admin` route will then use persistent production storage.

## Deploy to Vercel

Push the repository to GitHub, import it in Vercel, and keep the detected framework preset as **Next.js**. Public portfolio pages need no environment variables; the admin/contact workflow needs the variables listed above.

You can also deploy from the command line:

```bash
npx vercel
```
