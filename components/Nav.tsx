"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import { ThemePicker } from "./ThemePicker";

/**
 * Top nav: handle on the left, lowercase links + theme picker on the right.
 * On small screens the links collapse behind a hamburger menu (the theme
 * picker stays in the bar). The "projects" link is marked active on the
 * /projects route.
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/#top"
          className="nav-link text-sm text-fg"
          aria-label="Home"
        >
          <span className="text-muted">~/</span>
          <span className="text-accent">mrb</span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/projects" && pathname === "/projects";
            return (
              <Link
                key={link.label}
                href={link.href}
                data-active={isActive ? "true" : "false"}
                className="nav-link text-xs text-muted"
              >
                {link.label.toLowerCase()}
              </Link>
            );
          })}
          <ThemePicker />
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          <ThemePicker />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="nav-link flex h-8 w-8 items-center justify-center text-lg leading-none text-muted hover:text-accent"
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </nav>

      {open && (
        <nav className="border-t border-line bg-bg/95 backdrop-blur-sm sm:hidden">
          <div className="mx-auto flex max-w-3xl flex-col px-4 py-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/projects" && pathname === "/projects";
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  data-active={isActive ? "true" : "false"}
                  className="nav-link border-b border-line py-3 text-sm text-muted last:border-b-0"
                >
                  {link.label.toLowerCase()}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
