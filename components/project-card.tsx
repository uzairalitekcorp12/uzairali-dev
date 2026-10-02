import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/data/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project-slide-card project-slide-card--${project.accent}`}>
      <Link href={`/projects/${project.slug}`} className="project-slide-art" aria-label={`Read ${project.title} case study`}>
        {project.image ? <div className="project-slide-image" style={{ backgroundImage: `url("${project.image.replace(/"/g, "%22")}")` }} /> : null}
        <span>{project.number}</span>
        <div className="project-slide-window" aria-hidden="true">
          <i /><i /><i />
          <b>{project.title.slice(0, 2).toUpperCase()}</b>
        </div>
        <small>{project.year}</small>
      </Link>
      <div className="project-slide-copy">
        <p>{project.kind}</p>
        <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="project-slide-actions">
          <Link href={`/projects/${project.slug}`}>Case study <ArrowUpRight /></Link>
          {project.live ? <a href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight /></a> : null}
          <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}><Github /></a>
        </div>
      </div>
    </article>
  );
}
