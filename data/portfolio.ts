export const portfolio = {
  person: {
    name: "Uzair Ali",
    firstName: "Uzair",
    role: "Full-stack developer & digital designer",
    location: "Karachi, Pakistan",
    availability: "Available for select projects",
    intro:
      "I design and build polished digital products where strong engineering meets memorable visual storytelling.",
    shortBio:
      "Computer Science student, frontend specialist, and creative problem-solver focused on interfaces that feel fast, clear, and distinctly human.",
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Playground", href: "#playground" },
    { label: "Contact", href: "#contact" },
  ],
  socials: {
    github: "https://github.com/uzairali12",
    linkedin: "https://linkedin.com/in/muhammad-uzair-ali-32aa63372",
    instagram: "https://instagram.com/its_uzair.xyz",
    whatsapp:
      "https://api.whatsapp.com/send/?phone=923282626204&text=Hello%20Uzair%2C%20I%27d%20like%20to%20work%20with%20you.&type=phone_number&app_absent=0",
  },
  stats: [
    { value: "03+", label: "Years building" },
    { value: "12+", label: "Projects shipped" },
    { value: "04", label: "Core disciplines" },
  ],
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
    "Three.js",
    "UI / UX",
    "Testing",
    "Cloud",
  ],
  services: [
    {
      number: "01",
      title: "Product interfaces",
      description:
        "Responsive web experiences with thoughtful interaction design, strong accessibility, and a clear visual system.",
      tags: ["UI design", "Design systems", "Prototyping"],
    },
    {
      number: "02",
      title: "Frontend engineering",
      description:
        "Production-ready React and Next.js builds that stay maintainable as the product and the team grow.",
      tags: ["React", "Next.js", "TypeScript"],
    },
    {
      number: "03",
      title: "Full-stack solutions",
      description:
        "Reliable APIs, data models, authentication flows, and integrations shaped around real product needs.",
      tags: ["Node.js", "MongoDB", "REST APIs"],
    },
    {
      number: "04",
      title: "Quality & launch",
      description:
        "Careful testing, performance tuning, responsive QA, and deployment support for a confident release.",
      tags: ["Testing", "Performance", "Vercel"],
    },
  ],
  projects: [
    {
      number: "01",
      slug: "savvy-idea",
      title: "Savvy Idea",
      kind: "Wedding planning platform",
      year: "2025",
      description:
        "A high-touch planning experience built around clear discovery, quick navigation, and a refined responsive interface.",
      overview:
        "A responsive wedding-planning experience that turns a complicated service journey into a calm, guided flow.",
      challenge:
        "Organize a large amount of planning information without making the experience feel heavy or overwhelming.",
      solution:
        "A modular interface, clear information hierarchy, and mobile-first navigation built with reusable Next.js sections.",
      outcome:
        "A fast, polished platform foundation that can grow with new vendors, planning tools, and editorial content.",
      tags: ["Next.js", "Tailwind CSS", "Responsive"],
      accent: "violet",
      image: "",
      github: "https://github.com/uzairali12/linkleap",
      live: "https://linkleap-app.netlify.app",
    },
    {
      number: "02",
      slug: "linkleap",
      title: "LinkLeap",
      kind: "Collaborative task workspace",
      year: "2025",
      description:
        "A multi-user productivity concept that keeps project status, tasks, and team actions easy to scan and update.",
      overview:
        "A focused team workspace for tracking tasks, project movement, and the work that needs attention next.",
      challenge:
        "Make dense project activity understandable at a glance for both individual contributors and small teams.",
      solution:
        "A status-led dashboard, lightweight interaction patterns, and a compact visual language designed around daily use.",
      outcome:
        "A flexible product concept that demonstrates end-to-end product thinking from interface structure to interaction design.",
      tags: ["JavaScript", "Product design", "Local data"],
      accent: "cyan",
      image: "",
      github: "https://github.com/uzairali12/linkleap",
      live: "https://linkleap-app.netlify.app",
    },
    {
      number: "03",
      slug: "weather-atlas",
      title: "Weather Atlas",
      kind: "Live weather dashboard",
      year: "2024",
      description:
        "A focused data experience that translates changing forecast information into an approachable visual dashboard.",
      overview:
        "A clean real-time weather dashboard for quickly reading current conditions and near-term forecasts.",
      challenge:
        "Present multiple weather values and changing API states without creating a visually noisy dashboard.",
      solution:
        "Prioritized data groups, resilient loading states, and a responsive layout that keeps primary conditions prominent.",
      outcome:
        "A compact API-driven interface that remains readable across phone, tablet, and desktop screens.",
      tags: ["React", "API", "Data UI"],
      accent: "amber",
      image: "",
      github: "https://github.com/uzairali12",
      live: "https://github.com/uzairali12",
    },
    {
      number: "04",
      slug: "pixelcraft",
      title: "PixelCraft",
      kind: "Browser image editor",
      year: "2024",
      description:
        "A lightweight Canvas-based editor exploring crop, filter, adjustment, and export workflows directly in the browser.",
      overview:
        "An in-browser image editor that keeps common creative tools quick, understandable, and close to the canvas.",
      challenge:
        "Deliver useful editing controls while maintaining immediate visual feedback and a lightweight browser footprint.",
      solution:
        "Canvas API rendering, direct manipulation controls, and a focused tool architecture for crop, filters, and export.",
      outcome:
        "A capable creative utility that demonstrates browser graphics work and detailed interaction design.",
      tags: ["Canvas API", "JavaScript", "Interaction"],
      accent: "rose",
      image: "",
      github: "https://github.com/uzairali12",
      live: "https://github.com/uzairali12",
    },
    {
      number: "05",
      slug: "studysync-lms",
      title: "StudySync LMS",
      kind: "Learning management platform",
      year: "2024",
      description:
        "An e-learning platform with course tracking, authentication, and progress analytics backed by Node.js and MongoDB.",
      overview:
        "A learning workspace that brings course progress, content, and student activity into one straightforward experience.",
      challenge:
        "Keep learner progress and course content easy to understand across several roles and content states.",
      solution:
        "Role-aware flows, structured course data, and dashboards that emphasize progress and next actions.",
      outcome:
        "A full-stack learning product foundation with authentication, persistent data, and reporting-ready structures.",
      tags: ["Node.js", "MongoDB", "EJS"],
      accent: "lime",
      image: "",
      github: "https://github.com/uzairali12",
      live: "https://github.com/uzairali12",
    },
    {
      number: "06",
      slug: "quicknotes",
      title: "QuickNotes",
      kind: "Minimal notes workspace",
      year: "2023",
      description:
        "A distraction-free note app with automatic saving, Markdown support, and a compact responsive workspace.",
      overview:
        "A small, fast writing tool designed for capturing and organizing ideas without interrupting the thought process.",
      challenge:
        "Make writing feel immediate while reliably preserving content and keeping the interface out of the way.",
      solution:
        "Automatic local persistence, Markdown rendering, and a minimal React component system.",
      outcome:
        "A dependable offline-friendly utility and a practical exploration of local-first interaction patterns.",
      tags: ["React", "Markdown", "LocalStorage"],
      accent: "cyan",
      image: "",
      github: "https://github.com/uzairali12",
      live: "https://github.com/uzairali12",
    },
  ],
  education: [
    {
      period: "Present",
      title: "BS Computer Science",
      place: "Iqra University, Airport Campus",
      detail:
        "Building depth across frontend, backend, data structures, and cloud technologies.",
    },
    {
      period: "Completed",
      title: "Intermediate — FSc",
      place: "Bahria College EAB-1 Majeed Campus",
      detail: "Completed through the Karachi Board with 82%.",
    },
    {
      period: "Completed",
      title: "Matriculation",
      place: "Al-Hamra School & College",
      detail: "Graduated with 96%, building an early foundation in analytical work.",
    },
  ],
  experience: [
    {
      period: "2022 — Present",
      role: "Web developer",
      company: "Freelance",
      description:
        "Designing and developing responsive websites and product interfaces for clients using modern web technologies.",
    },
    {
      period: "2021 — Present",
      role: "Graphic designer",
      company: "Independent",
      description:
        "Creating brand assets, digital campaigns, and visual systems that translate ideas into consistent identities.",
    },
    {
      period: "Summer 2023",
      role: "Software development intern",
      company: "Product team",
      description:
        "Contributed to agile full-stack projects and built CRUD workflows with Node.js and MongoDB.",
    },
  ],
  testimonials: [
    {
      name: "Thomas",
      role: "Product client",
      quote:
        "Uzair's design skills transformed our app's user experience. Clear thinking and a highly professional process.",
      image: "testimonal-1.jpeg",
    },
    {
      name: "Julia",
      role: "Development client",
      quote:
        "His development expertise kept the project moving and the final experience felt considered at every size.",
      image: "testimonal-2.jpeg",
    },
    {
      name: "Jane",
      role: "Brand client",
      quote:
        "Uzair's attention to detail and creative direction helped our website feel genuinely different.",
      image: "testimonal-3.jpeg",
    },
  ],
} as const;

export type ProjectAccent = "violet" | "cyan" | "amber" | "rose" | "lime";

export type Project = {
  number: string;
  slug: string;
  title: string;
  kind: string;
  year: string;
  description: string;
  overview: string;
  challenge: string;
  solution: string;
  outcome: string;
  tags: readonly string[];
  accent: ProjectAccent;
  image?: string;
  github: string;
  live: string;
};

export type EducationItem = {
  period: string;
  title: string;
  place: string;
  detail: string;
};

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  description: string;
};

export type PortfolioContent = {
  projects: Project[];
  education: EducationItem[];
  experience: ExperienceItem[];
};
