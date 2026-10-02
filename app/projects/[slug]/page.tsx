import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHeader } from "@/components/inner-header";
import { portfolio } from "@/data/portfolio";

export function generateStaticParams() {
  return portfolio.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.projects.find((item) => item.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = portfolio.projects.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const project = portfolio.projects[index];
  const next = portfolio.projects[(index + 1) % portfolio.projects.length];

  return (
    <>
      <InnerHeader backHref="/projects" backLabel="All projects" />
      <main className={`project-detail project-detail--${project.accent}`}>
        <header className="project-detail-hero">
          <div>
            <p className="section-index">PROJECT {project.number} / {project.year}</p>
            <h1>{project.title}</h1>
            <p>{project.overview}</p>
            <div className="project-detail-actions">
              <a href={project.live} target="_blank" rel="noreferrer">Open live site <ArrowUpRight /></a>
              <a href={project.github} target="_blank" rel="noreferrer"><Github /> Source code</a>
            </div>
          </div>
          <div className="project-detail-art" aria-hidden="true">
            <span>{project.number}</span>
            <div><i /><i /><i /><b>{project.title}</b></div>
          </div>
        </header>

        <section className="project-detail-facts">
          <div><span>Type</span><strong>{project.kind}</strong></div>
          <div><span>Year</span><strong>{project.year}</strong></div>
          <div><span>Stack</span><strong>{project.tags.join(" / ")}</strong></div>
        </section>

        <section className="project-story">
          <article><span>01</span><div><h2>The challenge</h2><p>{project.challenge}</p></div></article>
          <article><span>02</span><div><h2>The solution</h2><p>{project.solution}</p></div></article>
          <article><span>03</span><div><h2>The outcome</h2><p>{project.outcome}</p></div></article>
        </section>

        <nav className="next-project" aria-label="Project navigation">
          <Link href="/projects"><ArrowLeft /> All projects</Link>
          <Link href={`/projects/${next.slug}`}><span>Next project</span><strong>{next.title}</strong><ArrowRight /></Link>
        </nav>
      </main>
    </>
  );
}
