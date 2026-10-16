import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/data/portfolio";

export function ProjectSlider({ items }: { items: Project[] }) {
  return (
    <div className="project-slider project-slider--static">
      <div className="project-compact-grid" role="list" aria-label="Featured projects">
        {items.map((project) => (
          <div key={project.slug} role="listitem">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
