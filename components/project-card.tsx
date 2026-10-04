import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/data/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  const hasLiveSite = Boolean(project.live && project.live !== "#");
  const hasSource = Boolean(project.github && project.github !== "#");

  return (
    <article className={`project-slide-card project-slide-card--${project.accent}`}>
      <Link href={`/projects/${project.slug}`} className="project-slide-art" aria-label={`Read ${project.title} case study`}>
        {project.image ? (
          <div className="project-slide-image">
            <Image
              src={project.image}
              alt={project.imageAlt ?? `${project.title} project preview`}
              fill
              sizes="(max-width: 640px) 88vw, (max-width: 1100px) 48vw, 31rem"
            />
          </div>
        ) : null}
        <span className="project-slide-number">{project.number}</span>
        {!project.image ? (
          <div className="project-slide-window" aria-hidden="true">
            <i /><i /><i />
            <b>{project.title.slice(0, 2).toUpperCase()}</b>
          </div>
        ) : null}
        <div className="project-slide-media-meta">
          <small>{project.year}</small>
          <strong>View case study <ArrowUpRight /></strong>
        </div>
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
          {hasLiveSite ? <a href={project.live} target="_blank" rel="noreferrer">Live site <ArrowUpRight /></a> : null}
          {hasSource ? <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}><Github /></a> : null}
        </div>
      </div>
    </article>
  );
}
