export const SITE = {
  handle: "manushwi",
  name: "Manushwi Raj Bhardwaj",
  role: "Full Stack Developer",
  tagline: "building web apps, mobile apps, tui tools and dev tooling",
  bio: "I'm a full-stack developer from India who likes clean terminals, sharp tooling and quiet, well-considered interfaces. I spend most of my time on the web — APIs, apps, automation — and I'm always tinkering with something new.",
  tldr: "full-stack dev · ai/ml dabbler · likes clean terminals",
  status: "open to work",
  availability: "available for freelance + full-time",
  email: "manushwi.work@gmail.com",
  phone: "+91 8920976910",
  timezone: "Asia/Kolkata",
  resume: "/Manushwi Raj Bhardwaj Resume.pdf",
  bookCall: "mailto:manushwi.work@gmail.com?subject=Book%20a%20call",
  url: "https://manushwi.vercel.app",
  portrait: "/ghibli.png",
} as const;

export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/#contact" },
] as const;

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/manushwi", icon: "github" },
  { label: "X / Twitter", href: "https://x.com/Manushwi", icon: "x" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/manushwi-raj-bhardwaj/",
    icon: "linkedin",
  },
  { label: "Email", href: "mailto:manushwi.work@gmail.com", icon: "mail" },
] as const;

export const SKILLS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Next.js",
  "React",
  "Node.js",
  "FastAPI",
  "Flutter",
  "Docker",
  "PostgreSQL",
  "Redis",
  "Tailwind",
] as const;
