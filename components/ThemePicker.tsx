"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const THEMES = ["green", "amber", "blue", "rose", "mono"] as const;

/**
 * Minimal theme switcher: a text trigger that opens a small terminal-style
 * list. Persists via localStorage through next-themes.
 */
export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = THEMES.includes((theme ?? "") as (typeof THEMES)[number])
    ? (theme as (typeof THEMES)[number])
    : "green";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="nav-link text-xs text-muted hover:text-accent"
      >
        theme: <span className="text-accent">{mounted ? current : "--"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-28 border border-line bg-bg p-1">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTheme(t);
                setOpen(false);
              }}
              className={cn(
                "block w-full px-2 py-1 text-left text-xs transition-colors hover:bg-line",
                t === current ? "text-accent" : "text-muted hover:text-fg"
              )}
            >
              {t === current ? `> ${t}` : `  ${t}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
