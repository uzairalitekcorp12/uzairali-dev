import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { InnerHeader } from "@/components/inner-header";
import { ProjectCard } from "@/components/project-card";
import { getPortfolioContent } from "@/lib/portfolio-content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected product, interface, and full-stack work by Uzair Ali.",
};

export const revalidate = 300;

export default async function ProjectsPage() {
  const content = await getPortfolioContent();
  return (
    <>
      <InnerHeader />
      <main className="projects-page">
        <header className="projects-page-hero">
          <p className="section-index">PROJECT ARCHIVE / {String(content.projects.length).padStart(2, "0")}</p>
          <h1>Work with<br /><span>something to say.</span></h1>
          <div>
            <p>
              Product interfaces, frontend builds, and full-stack experiments. Every project lives in one
              data file, so adding the next fifteen is straightforward.
            </p>
            <Link href="/#work"><ArrowLeft /> Back to featured work</Link>
          </div>
        </header>
        <section className="projects-archive-grid" aria-label="All projects">
          {content.projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          <article className="project-add-card">
            <Plus />
            <h2>Next project</h2>
            <p>Add one object to <code>data/portfolio.ts</code> and it appears here, in the slider, and in its own case study.</p>
          </article>
        </section>
      </main>
    </>
  );
}
