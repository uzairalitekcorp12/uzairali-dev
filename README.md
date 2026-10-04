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
components/portfolio-desktop.tsx          Lazy-loaded interactive studio
components/portfolio-terminal.tsx         Command terminal
components/games/                         Snake and Pong
data/portfolio.ts                         Editable portfolio content
lib/supabase-server.ts                    Server-only Supabase configuration
```

## Local admin setup

Create `.env.local` with only the local admin credentials:

```dotenv
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_SECRET=generate-at-least-32-random-characters
```

Next.js loads `.env.local` automatically. Local content is saved in the ignored `.data/admin-store.json` file, and local uploads are written under the ignored `.data/uploads/` directory. No local Supabase or Redis variables are required.

Then run:

```bash
npm run dev
```

Open `/admin` and sign in. Images are resized in the browser when useful, uploaded through the authenticated server endpoint, and rendered with responsive Next.js images.

## Deploy to Vercel

Push the repository to GitHub, import it in Vercel, and keep the detected framework preset as **Next.js**. Configure the three admin variables in the project settings, then connect Supabase so Vercel injects `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or the legacy `SUPABASE_SERVICE_ROLE_KEY`) automatically. `SUPABASE_STORAGE_BUCKET` is optional and defaults to `portfolio-assets`.

The first authenticated request creates a public media bucket and a separate private admin-data bucket automatically. There is no database migration or SQL schema to run. Never put a publishable `sb_publishable_...` key in `SUPABASE_SECRET_KEY`; server writes require an `sb_secret_...` key. Do not commit `.env.local`.

You can also deploy from the command line:

```bash
npx vercel
```
