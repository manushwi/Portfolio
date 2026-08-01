import { SITE, SKILLS, SOCIALS } from "@/lib/site";
import { AsciiArt } from "./AsciiArt";
import { HeroPills } from "./Pills";
import { SocialIcon } from "./SocialLinks";
import { Tag } from "@/components/shared/Tag";

/**
 * Hero: two columns on desktop (text left, interactive ASCII portrait right),
 * stacked on mobile.
 */
export function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[7fr_6fr] lg:gap-12">
        <div className="order-2 space-y-5 lg:order-1">
          <p className="text-sm text-muted">
            <span className="text-accent">~</span> whoami
          </p>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {SITE.name.toUpperCase()}
            </h1>
            <p className="text-sm text-fg sm:text-base">
              <span className="text-accent">&gt;</span> {SITE.role}
              <span className="block text-muted">— {SITE.tagline}</span>
            </p>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-muted">
            {SITE.bio}
          </p>

          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>

          <HeroPills />

          <div className="flex items-center gap-4 pt-1">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={social.label}
                className="h-5 w-5 text-muted transition-all duration-200 hover:text-accent"
              >
                <SocialIcon icon={social.icon} className="h-full w-full" />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={SITE.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-accent px-4 py-2 text-sm text-accent transition-colors duration-200 hover:bg-accent hover:text-bg"
            >
              view_resume
            </a>
            <a
              href={SITE.bookCall}
              className="border border-line px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              book_a_call
            </a>
          </div>
        </div>

        <div className="order-1 mx-auto w-full lg:order-2 lg:max-w-[300px]">
          <div className="mx-auto aspect-[2/3] h-[40dvh] w-auto border border-line p-2 lg:h-auto lg:w-full">
            <AsciiArt className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
