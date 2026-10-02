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
      title: "Savvy Idea",
      kind: "Wedding planning platform",
      description:
        "A high-touch planning experience built around clear discovery, quick navigation, and a refined responsive interface.",
      tags: ["Next.js", "Tailwind CSS", "Responsive"],
      accent: "violet",
      github: "https://github.com/uzairali12/linkleap",
      live: "https://linkleap-app.netlify.app",
    },
    {
      number: "02",
      title: "LinkLeap",
      kind: "Collaborative task workspace",
      description:
        "A multi-user productivity concept that keeps project status, tasks, and team actions easy to scan and update.",
      tags: ["JavaScript", "Product design", "Local data"],
      accent: "cyan",
      github: "https://github.com/uzairali12/linkleap",
      live: "https://linkleap-app.netlify.app",
    },
    {
      number: "03",
      title: "Weather Atlas",
      kind: "Live weather dashboard",
      description:
        "A focused data experience that translates changing forecast information into an approachable visual dashboard.",
      tags: ["React", "API", "Data UI"],
      accent: "amber",
      github: "https://github.com/uzairali12",
      live: "https://github.com/uzairali12",
    },
    {
      number: "04",
      title: "PixelCraft",
      kind: "Browser image editor",
      description:
        "A lightweight Canvas-based editor exploring crop, filter, adjustment, and export workflows directly in the browser.",
      tags: ["Canvas API", "JavaScript", "Interaction"],
      accent: "rose",
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

export type Project = (typeof portfolio.projects)[number];
