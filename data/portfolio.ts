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
    { value: "16", label: "Public repositories" },
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
      slug: "tekbooks",
      title: "TekBooks",
      kind: "Multi-platform TypeScript product",
      year: "2026",
      description:
        "A TypeScript product workspace with a Node backend and a companion Expo mobile application.",
      overview:
        "A public full-stack codebase connecting a production-minded Express API, MongoDB data layer, and Expo mobile experience.",
      challenge:
        "Keep backend workflows, document handling, and a mobile client aligned in one maintainable product codebase.",
      solution:
        "A TypeScript workspace with Express, MongoDB, JWT authentication, S3-compatible storage tooling, and an Expo Router mobile app.",
      outcome:
        "A public repository that demonstrates the architecture behind a backend and mobile application working as one product.",
      tags: ["TypeScript", "Express", "MongoDB", "Expo"],
      accent: "violet",
      image: "",
      github: "https://github.com/uzairali12/tekbooks1",
      live: "",
    },
    {
      number: "02",
      slug: "bseccure",
      title: "BSeccure",
      kind: "Cybersecurity web experience",
      year: "2026",
      description:
        "A responsive cybersecurity website with services, insights, contact UI, and a rotating D3 Earth visual.",
      overview:
        "A polished digital presence for a cybersecurity brand, built around an animated globe, clear services, and responsive storytelling.",
      challenge:
        "Create a security-focused experience that feels technical and credible while staying fast and approachable across devices.",
      solution:
        "A Next.js and TypeScript implementation with a D3 globe, responsive navigation, modular sections, and tailored visual states.",
      outcome:
        "A responsive public demo that brings brand storytelling, interaction design, and frontend engineering into one experience.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "D3"],
      accent: "cyan",
      image: "",
      github: "https://github.com/uzairali12/BSeccure",
      live: "https://bseccure.vercel.app",
    },
    {
      number: "03",
      slug: "resumeguard",
      title: "ResumeGuard",
      kind: "AI resume fraud detector",
      year: "2026",
      description:
        "A resume analysis tool for surfacing timeline overlaps, experience inflation, credibility signals, and other fraud indicators.",
      overview:
        "A focused upload-to-result flow that gives recruiters an understandable first-pass view of potential resume fraud.",
      challenge:
        "Turn a complex set of credibility signals into an interface that feels clear, quick, and privacy conscious.",
      solution:
        "A PDF and DOCX upload interface paired with ML-powered analysis, readable result views, and a saved-history flow.",
      outcome:
        "A public prototype that communicates a complex screening workflow through a calm, straightforward product interface.",
      tags: ["Machine learning", "PDF / DOCX", "JavaScript", "UX"],
      accent: "amber",
      image: "",
      github: "https://github.com/uzairali12/resume-fraud-detector",
      live: "",
    },
    {
      number: "04",
      slug: "symptoscan",
      title: "SymptoScan",
      kind: "AI symptom analysis dashboard",
      year: "2026",
      description:
        "An AI-powered symptom analysis interface with confidence scoring, clinical insights, analytics, and session history.",
      overview:
        "A health dashboard designed to make symptom analysis and confidence signals easier to scan without overwhelming the user.",
      challenge:
        "Present health-related insights with a calm visual hierarchy while supporting diagnosis, analytics, history, and account flows.",
      solution:
        "A responsive single-page interface with a dedicated diagnostic dashboard, Supabase integration, and a custom scanner visual system.",
      outcome:
        "A public demo that combines product UX, visual design, and a multi-view healthcare workflow in one cohesive application.",
      tags: ["Supabase", "JavaScript", "Analytics", "Health UX"],
      accent: "rose",
      image: "",
      github: "https://github.com/uzairali12/SymptoScan",
      live: "https://sympto-scan-health.vercel.app/",
    },
    {
      number: "05",
      slug: "restaurio-pro",
      title: "Restaurio Pro",
      kind: "Restaurant point-of-sale system",
      year: "2026",
      description:
        "A responsive restaurant POS system for orders, billing, kitchen tickets, menu management, and daily sales tracking.",
      overview:
        "A browser-based cashier experience with realistic restaurant workflows, designed to stay quick at the point of service.",
      challenge:
        "Bring order handling, billing, stock awareness, receipt printing, and sales tracking together without a heavy framework.",
      solution:
        "A single-file HTML, CSS, and JavaScript application with local storage, keyboard shortcuts, responsive layouts, and light/dark themes.",
      outcome:
        "A public, working POS prototype that shows detailed product behavior from cart management through receipt and sales workflows.",
      tags: ["JavaScript", "LocalStorage", "Responsive UI", "POS"],
      accent: "lime",
      image: "",
      github: "https://github.com/uzairali12/Restaurio-Pro---A-Resturant-POS-system-",
      live: "https://restaurio-pro-a-resturant-pos-syste.vercel.app",
    },
    {
      number: "06",
      slug: "hospital-management-system",
      title: "Hospital Management System",
      kind: "Java + MySQL operations platform",
      year: "2026",
      description:
        "A Java desktop application that manages patient records, staff information, rooms, admissions, and ambulance activity with MySQL.",
      overview:
        "A centralized hospital operations platform that replaces manual record keeping with a structured, role-aware administration workflow.",
      challenge:
        "Digitize hospital administration while keeping patient, employee, room, and emergency data easy to manage in real time.",
      solution:
        "A Java Swing interface connected to MySQL through JDBC, with modules for login, reception, patient intake, rooms, employees, and ambulances.",
      outcome:
        "A public system that demonstrates object-oriented design, desktop UI development, database work, and operational problem solving.",
      tags: ["Java", "MySQL", "Swing", "JDBC"],
      accent: "cyan",
      image: "",
      github: "https://github.com/uzairali12/Hospital-Mangement-System",
      live: "",
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

export type ProjectMetric = {
  value: string;
  label: string;
};

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
  imageAlt?: string;
  gallery?: readonly string[];
  metrics?: readonly ProjectMetric[];
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
