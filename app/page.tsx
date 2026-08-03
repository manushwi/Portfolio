import { Hero } from "@/components/hero/Hero";
import { ContributionGraph } from "@/components/github/ContributionGraph";
import { ProjectsPreview } from "@/components/projects/ProjectsPreview";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SocialIcon } from "@/components/hero/SocialLinks";
import { SITE, SOCIALS } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Hero />

      <ScrollReveal>
        <ContributionGraph />
      </ScrollReveal>

      <ScrollReveal>
        <ProjectsPreview />
      </ScrollReveal>

      <ScrollReveal as="section">
        <section
          id="about"
          className="mx-auto w-full max-w-3xl border-t border-line px-4 py-10 sm:px-6"
        >
          <h2 className="text-sm text-fg">
            <span className="text-accent">~</span> about
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {SITE.bio}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            <span className="text-fg">currently:</span> {SITE.status} ·{" "}
            {SITE.availability}.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal as="section">
        <section
          id="contact"
          className="mx-auto w-full max-w-3xl border-t border-line px-4 py-10 sm:px-6"
        >
          <h2 className="text-sm text-fg">
            <span className="text-accent">~</span> contact
          </h2>
          <p className="mt-3 text-sm text-muted">
            want to build something, or just say hi?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {SITE.email}
            </a>
          </p>

          <div className="mt-4 flex items-center gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={social.label}
                className="h-5 w-5 text-muted transition-colors duration-200 hover:text-accent"
              >
                <SocialIcon icon={social.icon} className="h-full w-full" />
              </a>
            ))}
            <a
              href={SITE.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-xs text-muted"
            >
              resume →
            </a>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
