import type { Project } from "@/lib/projects";
import { Tag } from "@/components/shared/Tag";

/**
 * Minimal project card: thin 1px border, no shadow. The whole card is a
 * link when a URL exists; border + name brighten on hover.
 */
export function ProjectCard({ project }: { project: Project }) {
  const Comp = project.href ? "a" : "div";
  const linkProps = project.href
    ? {
        href: project.href,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Comp
      {...linkProps}
      data-project-preview
      data-project-name={project.name}
      className="group block border border-line p-5 transition-colors duration-150 hover:border-accent/60"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-accent">{project.name}</h3>
        {project.href && (
          <span className="text-muted transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent">
            ↗
          </span>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag} className="text-[10px]">
            {tag}
          </Tag>
        ))}
      </div>
    </Comp>
  );
}
