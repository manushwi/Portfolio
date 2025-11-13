"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  Moon,
  Sun,
  Twitter,
  Linkedin,
  Github,
  Code,
  Instagram,
  FileText,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Icon,
  Menu,
  X,
} from "lucide-react";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import FlipLink from "@/components/ui/text-effect-flipper";
import { CardCarousel } from "@/components/ui/card-carousel";
import { TextScroll } from "@/components/ui/text-scroll";
import Image from "next/image";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { FloatingDock } from "@/components/ui/floating-dock";

// ----------------------
// Profile Card
// ----------------------
const ProfileCard: React.FC = () => {
  return (
    <div className="relative flex justify-center lg:justify-end">
      
      <div className="bg-white/50 scale-100 sm:scale-110 lg:scale-150 relative lg:top-1/2 dark:bg-gray-700 p-3 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="w-32 h-40 sm:w-40 sm:h-48 lg:w-48 lg:h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 rounded flex items-center justify-center">
          <div className="w-full h-full bg-gray-400 dark:bg-gray-500 flex items-center justify-center text-white text-xs">
            <Image
              src="/myGhibli.jpg"
              alt="Profile picture"
              width={192}
              height={224}
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white">
            Manushwi Raj Bhardwaj
          </p>
          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
            Fullstack Developer
          </p>
          <div className="flex justify-end mt-2">
            <span className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white">
              2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------
// Project Card
// ----------------------
type ProjectCardProps = {
  title: string;
  description: string;
  tech: string[];
  image?: string;
  link?: string;
  status: "Live" | "In Progress" | "Beta" | "Archived";
  href: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tech,
  image,
  link,
  status,
  href,
}) => {
  return (
    <a href={href} className="block">
      <div className="bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl p-3 sm:p-4 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {title}
        </h3>

        {/* Image */}
        <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden mb-3 sm:mb-4 flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 flex-grow line-clamp-3 sm:line-clamp-4">
          {description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {tech.map((t, i) => (
            <span
              key={i}
              className="px-1.5 sm:px-2 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-[10px] sm:text-xs font-medium rounded-md whitespace-nowrap"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Status + Link */}
        <div className="flex items-center justify-between mt-auto">
          <span
            className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-md whitespace-nowrap ${
              status === "Live"
                ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                : status === "In Progress"
                ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                : status === "Beta"
                ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                : "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
            }`}
          >
            {status}
          </span>

          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="ml-2 flex-shrink-0">
              <ExternalLink
                size={14}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]"
              />
            </a>
          )}
        </div>
      </div>
    </a>
  );
};


  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#home",
    },
 
    {
      title: "Projects",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#projects",
    },
    {
      title: "Resume",
      icon: (
        <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/ManushwiResume.pdf",
    },
    {
      title: "Leetcode",
      icon: (
        <Code className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://leetcode.com/u/Manushwi/",
    },
 
    {
      title: "Twitter",
      icon: (
        <Twitter className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://x.com/Manushwi",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/manushwi",
    },
  ];

// ----------------------
// Paper Document Wrapper
// ----------------------
type PaperDocumentProps = {
  children: ReactNode;
};

const PaperDocument: React.FC<PaperDocumentProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center overflow-x-hidden"

      style={{
        backgroundColor: '#0f3a2e', // dark green board
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
      <div className="relative max-w-4xl w-full">

<div className="hidden sm:block absolute -top-4 left-32 z-20 w-24 h-8 bg-yellow-100/40 dark:bg-yellow-200/30 shadow-md transform -rotate-3"></div>
        <div className="hidden sm:block absolute top-2 -right-10 z-20 w-24 h-8 bg-yellow-100/40 dark:bg-yellow-200/30 shadow-md transform rotate-45"></div>


<div className="hidden sm:block absolute top-80 -left-10 z-20 w-24 h-8 bg-yellow-100/80 dark:bg-yellow-200/30 shadow-md transform -rotate-90"></div>
        <div className="hidden sm:block absolute top-80 -right-13 z-20 w-24 h-8 bg-yellow-100/80 dark:bg-yellow-200/30 shadow-md transform -rotate-90"></div>

        <div className="hidden sm:block absolute bottom-80 -left-10 z-20 w-24 h-8 bg-yellow-100/80 dark:bg-yellow-200/30 shadow-md transform -rotate-90"></div>
        <div className="hidden sm:block absolute bottom-200 -right-13 z-20 w-24 h-8 bg-yellow-100/80 dark:bg-yellow-200/30 shadow-md transform -rotate-90"></div>


        <div className="hidden sm:block absolute bottom-80 -left-10 z-20 w-24 h-8 bg-yellow-100/40 dark:bg-yellow-200/30 shadow-md transform -rotate-90"></div>
        <div className="hidden sm:block absolute bottom-400 -right-13 z-20 w-24 h-8 bg-yellow-100/80 dark:bg-yellow-200/30 shadow-md transform -rotate-90"></div>


        {/* Main Paper */}
        <div className="relative bg-white/80 dark:bg-gray-800 shadow-2xl">
          {/* Dotted Background */}
          <div className="absolute inset-0 opacity-10 sm:opacity-20 dark:opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #6b7280 2px, transparent 1px)",
                backgroundSize: "15px 15px",
              }}
            />
          </div>
{/* Floating Buttons inside the paper section (mobile only) */}
<div className="absolute top-4 right-4 z-40 flex flex-col items-end gap-3 md:hidden">
  {/* Menu Button */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="p-3 rounded-full shadow-md bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 backdrop-blur-md hover:scale-105 transition-all duration-200"
    aria-label="Toggle menu"
  >
    {menuOpen ? (
      <X size={22} className="text-gray-800 dark:text-gray-200" />
    ) : (
      <Menu size={22} className="text-gray-800 dark:text-gray-200" />
    )}
  </button>

  {/* Theme Toggle Button */}
  <ThemeToggleButton />
</div>

{/* Floating Dropdown Menu inside the paper (mobile only) */}
{menuOpen && (
  <div className="absolute top-16 right-4 w-48 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl backdrop-blur-md animate-fadeIn z-30 md:hidden">
    <nav className="flex flex-col p-3 space-y-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 px-2 py-2 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-emerald-100/80 dark:hover:bg-emerald-800/40 transition-all"
        >
          {link.icon}
          <span>{link.title}</span>
        </a>
      ))}
    </nav>
  </div>
)}



          {/* Hole Punches - Responsive */}
          <div className="absolute left-2 sm:left-4 lg:left-8 top-0 bottom-0 flex flex-col justify-start pt-8 sm:pt-12 space-y-2 sm:space-y-4 lg:space-y-6">
            {[...Array(88)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-gray-800 dark:bg-gray-300 rounded-full"
              ></div>
            ))}
          </div>

          {/* Content - Responsive padding */}
          <div className="relative z-10 pl-8 sm:pl-12 lg:pl-20 pr-4 sm:pr-6 lg:pr-8 py-8 sm:py-10 lg:py-12">
            {children}
          </div>

          {/* Corner Fold */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] sm:border-l-[30px] border-l-transparent border-b-[20px] sm:border-b-[30px] border-b-gray-200 dark:border-b-gray-700"></div>
        </div>

        {/* Shadow */}
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-full h-full bg-black/10 dark:bg-black/30 -z-10 transform rotate-1"></div>
      </div>
    </div>
  );
};

// ----------------------
// Portfolio Component
// ----------------------
const Portfolio: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/Manushwi", label: "Twitter" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/manushwi-raj-bhardwaj/",
      label: "LinkedIn",
    },
    { icon: Github, href: "https://github.com/manushwi", label: "GitHub" },
    { icon: Code, href: "https://leetcode.com/u/Manushwi/", label: "Leetcode" },
    { icon: FileText, href: "/ManushwiResume.pdf", label: "Resume", download: true },
  ];

  const projects: ProjectCardProps[] = [
    {
      title: "Manime",
      description:
        "Modern web application for finding information about your favourite anime.",
      tech: ["React", "Tailwind", "GSAP"],
      status: "Live",
      image: "./card2.png",
      href: "https://manime-manushwi.netlify.app/",
    },
    {
      title: "Vibe-a-thon",
      description:
        "Webiste for the AI based vibe coding hackathon",
      tech: ["React", "Tailwind", "GSAP"],
      status: "Live",
      image: "./vibe.png",
      href: "https://codezy-vibeathon.vercel.app/",
    },
    {
      title: "AUITS",
      description: "A ful fledge webpage for managing customers and admin.",
      tech: ["React", "Tailwind"],
      status: "Live",
      image: "/card3.png",
      href: "https://auits-manushwi.netlify.app/",
    },
    {
      title: "Codefetch",
      description: "Image processing tool for content creators",
      tech: ["React", "Chrome API", "manifest.json"],
      status: "Beta",
      image: "/card1.png",
      href: "https://codefetch.netlify.app/",
    },
    {
      title: "EcoLoop",
      description:
        "An AI powered tool helps to recycle, reuse and donate items",
      tech: ["HTML5", "CSS3", "Express.js"],
      status: "In Progress",
      image: "/card4.png",
      href: "#",
    },
  ];


  
  const skills = [
    { category: "Frontend", skills: ["React", "Tailwind CSS"] },
    { category: "Backend", skills: ["Node.js", "MongoDB", "Express.js"] },
    { category: "Tools", skills: ["Git", "Figma", "Photoshop"] },
    { category: "Other", skills: ["UI/UX Design", "Chess", "Sketching"] },
  ];

  return (
    <div className="min-h-screen">

{/* Floating Dropdown Menu */}
{menuOpen && (
  <div className="fixed top-16 right-4 w-48 z-40 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl backdrop-blur-md animate-fadeIn">
    <nav className="flex flex-col p-3 space-y-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 px-2 py-2 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-emerald-100/80 dark:hover:bg-emerald-800/40 transition-all"
        >
          {link.icon}
          <span>{link.title}</span>
        </a>
      ))}
    </nav>
  </div>
)}


{/* Mobile Menu Dropdown */}
{menuOpen && (
  <div className="md:hidden fixed top-[56px] left-0 w-full z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
    <nav className="flex flex-col p-4 space-y-3">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="flex items-center gap-2 text-gray-800 dark:text-gray-200 text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          {link.icon}
          <span>{link.title}</span>
        </a>
      ))}
    </nav>
  </div>
)}

{/* Desktop Floating Dock */}
<div className="hidden md:flex fixed bottom-0 left-0 w-full z-50 items-start justify-center h-[8rem] py-4">
  <FloatingDock mobileClassName="translate-y-20" items={links} />
</div>



      <PaperDocument>
        {/* Hero */}
        <section id="home" className="mb-12 sm:mb-16">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  HUMAN NAME:
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  MANUSHWI RAJ <br /> BHARDWAJ
                </h1>
              </div>

              <div className="space-y-3 sm:space-y-4 text-gray-800 dark:text-gray-300">
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  I&apos;m just a guy who codes like he's running out of
                  time—because maybe I am. No grand destiny, no chosen
                  one—just me, a deadline, and the will to win.
                </p>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  Fullstack by skill, obsessed with making frontends look way
                  too good.
                </p>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  I&apos;m{" "}
                  <span className="italic font-medium">
                    a man of hundred hobbies (with the latest one being chess)
                  </span>
                </p>
              </div>
              
              {/* Profile Card - Mobile positioned here */}
              <div className="flex justify-center lg:hidden mt-8">
                <ProfileCard />
              </div>
            </div>
            
            {/* Profile Card - Desktop positioned here */}
            <div className="hidden lg:flex justify-center">
              <ProfileCard />
            </div>
          </div>

          {/* Socials - Responsive */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8">
            {socialLinks.map(({ icon: Icon, href, label, download }, i) => (
              <a
                key={i}
                href={href}
                download={download ? "" : undefined}
                target={download ? "_self" : "_blank"}
                className={`flex items-center justify-center p-3 sm:p-4 h-16 sm:h-20 mb-4 sm:mb-5 
                dark:border-gray-600 hover:border-black-600 transition-all duration-200 group
                ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <Icon
                  size={60}
                  className={`sm:w-[70px] sm:h-[70px] lg:w-[80px] lg:h-[80px] text-gray-600 dark:text-gray-300 
                  group-hover:text-black-600 dark:group-hover:text-black-400 mb-1
                  ${i % 2 === 0 ? "mr-3 sm:mr-5" : "ml-3 sm:ml-5"}`}
                />
                <FlipLink href={href}>{label}</FlipLink>
              </a>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-12 sm:mb-16">
          <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                INTERESTING PROJECTS
              </h2>
              <a
                href="https://github.com/manushwi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-400 underline"
              >
                CHECK OUT MORE INTERESTING PROJECTS
              </a>
            </div>
            
            {/* Mobile: Simple grid layout */}
            <div className="block md:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            </div>
            
            {/* Desktop: Carousel layout */}
            <div className="hidden md:block w-full bg">
              <CardCarousel
                cards={projects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
                autoplayDelay={5000}
                showPagination={false}
                showNavigation={true}
              />
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="mb-12 sm:mb-16">
          <div className="border-t border-gray-300 dark:border-gray-600 pt-6 sm:pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 sm:mb-8">
              EDUCATION
            </h2>

            <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100 p-4 sm:p-6 rounded-lg">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    B.Tech in Computer Science and Engineering
                  </h3>
                  <p className="text-sm sm:text-base text-gray-950 dark:text-gray-400">
                    2024 - 2028
                  </p>
                </div>

                <div className="border-t border-gray-700 dark:border-gray-600 pt-3 sm:pt-4">
                  <h4 className="text-sm sm:text-base font-medium mb-2">Key Courses:</h4>
                  <p className="text-gray-950 dark:text-gray-400 text-xs sm:text-sm">
                    Data Structures and Algorithms • Web Development •
                    Database Management • Machine Learning • Software
                    Engineering • Statistics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mb-12 sm:mb-16">
          <div className="border-t border-gray-300 dark:border-gray-600 pt-6 sm:pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 sm:mb-8">
              SKILLS
            </h2>

            <div className="bg-white/50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Capabilities Console
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                A curated collection of my technical skills and interests
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {skills.map((group, i) => (
                  <div key={i}>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {group.category}
                    </h4>
                    <div className="space-y-1 sm:space-y-2">
                      {group.skills.map((s, j) => (
                        <div
                          key={j}
                          className="flex items-center justify-between py-1 sm:py-2 border-b border-gray-200 dark:border-gray-600"
                        >
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            {s}
                          </span>
                          <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-6 sm:mb-8">
          <div className="border-t border-gray-300 dark:border-gray-600 pt-6 sm:pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 sm:mb-8">
              CONTACT
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Get In Touch
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Mail
                      className="text-emerald-700 dark:text-emerald-400 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 break-all">
                      manushwi.work@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Phone
                      className="text-emerald-700 dark:text-emerald-400 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-300">
                      +91 8920976910
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <MapPin
                      className="text-emerald-700 dark:text-emerald-400 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-300">
                      India
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 p-3 sm:p-4">
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                  Always open to discussing new opportunities, collaborations,
                  or just having a chat about tech, skateboarding, or any of
                  my hundred hobbies. Drop me a line!
                </p>
              </div>
            </div>
          </div>
        </section>

        <TextScroll
          className="font-display text-center text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-black dark:text-white md:leading-[5rem]"
          text="MRB!!  "
          default_velocity={5}
        />
      </PaperDocument>
    </div>
  );
};

export default Portfolio;