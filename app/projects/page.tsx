import type { Metadata } from "next";
import { ProjectsList } from "@/components/projects/ProjectsList";

export const metadata: Metadata = {
  title: "projects — Manushwi Raj Bhardwaj",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-sm text-fg">
        <span className="text-accent">~</span> projects
      </h1>
      <p className="mt-1 text-sm text-muted">
        things i've built — web apps, tooling and experiments.
      </p>

      <div className="mt-8">
        <ProjectsList />
      </div>
    </main>
  );
}
