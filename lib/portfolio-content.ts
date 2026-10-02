import { portfolio, type PortfolioContent, type ProjectAccent } from "@/data/portfolio";
import { getAdminData } from "@/lib/admin-storage";

const accents = new Set<ProjectAccent>(["violet", "cyan", "amber", "rose", "lime"]);

export function defaultPortfolioContent(): PortfolioContent {
  return JSON.parse(JSON.stringify({
    projects: portfolio.projects,
    education: portfolio.education,
    experience: portfolio.experience,
  })) as PortfolioContent;
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, 5000) : fallback;
}

export function normalizePortfolioContent(value: unknown): PortfolioContent | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<PortfolioContent>;
  if (!Array.isArray(candidate.projects) || !Array.isArray(candidate.education) || !Array.isArray(candidate.experience)) return null;

  const projects = candidate.projects.slice(0, 100).map((item, index) => {
    const project = item && typeof item === "object" ? item : {};
    const source = project as Record<string, unknown>;
    const title = text(source.title, `Project ${index + 1}`);
    const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `project-${index + 1}`;
    const accent = accents.has(source.accent as ProjectAccent) ? source.accent as ProjectAccent : "violet";
    return {
      number: text(source.number, String(index + 1).padStart(2, "0")),
      slug: text(source.slug, generatedSlug).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
      title,
      kind: text(source.kind),
      year: text(source.year),
      description: text(source.description),
      overview: text(source.overview),
      challenge: text(source.challenge),
      solution: text(source.solution),
      outcome: text(source.outcome),
      tags: Array.isArray(source.tags) ? source.tags.map((tag) => text(tag)).filter(Boolean).slice(0, 12) : [],
      accent,
      image: text(source.image),
      github: text(source.github, "#"),
      live: text(source.live, "#"),
    };
  });

  const education = candidate.education.slice(0, 40).map((item) => {
    const source = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return { period: text(source.period), title: text(source.title), place: text(source.place), detail: text(source.detail) };
  });
  const experience = candidate.experience.slice(0, 40).map((item) => {
    const source = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return { period: text(source.period), role: text(source.role), company: text(source.company), description: text(source.description) };
  });

  return { projects, education, experience };
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    const stored = await getAdminData();
    return normalizePortfolioContent(stored.portfolioContent) ?? defaultPortfolioContent();
  } catch {
    return defaultPortfolioContent();
  }
}
