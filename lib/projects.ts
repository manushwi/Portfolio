export type Project = {
  name: string;
  description: string;
  tags: string[];
  href?: string;
  githubUrl?: string;
  stars?: number | null;
  updatedAt?: string | null;
  featured?: boolean;
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    name: "PathFlow",
    description:
      "AI-powered open-source contribution platform — helps contributors find issues and get meaningful PRs reviewed.",
    tags: ["FastAPI", "Next.js", "Celery", "Redis", "Qdrant", "PostgreSQL"],
    href: "https://pathflow-manu.vercel.app/",
    image: "/card5.png",
    featured: true,
  },
  {
    name: "Manime",
    description:
      "Modern web app for finding information about your favourite anime — catalogue, search and details in one place.",
    tags: ["React", "Tailwind", "GSAP"],
    href: "https://manime-manushwi.netlify.app/",
    image: "/card2.png",
    featured: true,
  },
  {
    name: "Vibe-a-thon",
    description:
      "Official site for the AI-based vibe-coding hackathon — event info, schedule and registration.",
    tags: ["React", "Tailwind", "GSAP"],
    href: "https://codezy-vibeathon.vercel.app/",
    image: "/vibe.png",
    featured: true,
  },
  {
    name: "AUITS",
    description:
      "Full-fledged web app for managing customers and admins — dashboards, bookings and records.",
    tags: ["React", "Tailwind"],
    href: "https://auits-manushwi.netlify.app/",
    image: "/card3.png",
  },
  {
    name: "Codefetch",
    description:
      "Image processing tool for content creators — grabs and processes images from the web.",
    tags: ["React", "Chrome API"],
    href: "https://codefetch.netlify.app/",
    image: "/card1.png",
  },
  {
    name: "EcoLoop",
    description:
      "AI-powered tool that helps people recycle, reuse and donate items instead of throwing them away.",
    tags: ["HTML5", "CSS3", "Express.js"],
    href: "https://ecoloop-unwj.onrender.com/",
    image: "/card4.png",
  },
  {
    name: "ACS Services",
    description:
      "Production site for a professional cleaning company — service showcase, seamless user interaction and booking.",
    tags: ["React", "Tailwind", "Supabase", "Resend"],
    href: "https://avtaarcleaningsolutions.in/",
    image: "/acs2.png",
    featured: true,
  },
];

export function projectTags(): string[] {
  return Array.from(new Set(PROJECTS.flatMap((p) => p.tags))).sort();
}
