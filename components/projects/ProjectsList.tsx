"use client";

import { useState } from "react";
import { PROJECTS, projectTags } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { Tag } from "@/components/shared/Tag";

/**
 * Full project list with a client-side tag filter. "all" resets.
 */
export function ProjectsList() {
  const tags = projectTags();
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.tags.includes(active));

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Tag active={active === "all"} onClick={() => setActive("all")}>
          all
        </Tag>
        {tags.map((tag) => (
          <Tag key={tag} active={active === tag} onClick={() => setActive(tag)}>
            {tag}
          </Tag>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">no projects found for this tag</p>
      )}
    </div>
  );
}
