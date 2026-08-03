import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

const FEATURED = PROJECTS.filter((p) => p.featured);

/**
 * Homepage preview: the featured projects plus a "view all" link.
 */
export function ProjectsPreview() {
  return (
    <section id="projects" className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm text-fg">
          <span className="text-accent">~</span> projects
        </h2>
        <Link
          href="/projects"
          className="nav-link text-xs text-muted"
        >
          view all →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURED.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
