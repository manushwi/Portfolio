"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PROJECTS } from "@/lib/projects";
import type { Project } from "@/lib/projects";

const PANEL_W = 288;
const PANEL_H = 230;
const OFFSET = 18;
const MARGIN = 8;

/**
 * Floating project preview: when the cursor enters a card tagged with
 * `data-project-preview`, a terminal-style panel shows that project's
 * screenshot next to the cursor (edge-clamped) and follows it. Position is
 * written straight to the DOM (no re-render per mousemove); only the active
 * project is React state, so screenshots load on first hover.
 */
export function ProjectPreviewPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    let current: string | null = null;

    const place = (cx: number, cy: number) => {
      const el = panelRef.current;
      if (!el) return;
      let x = cx + OFFSET;
      let y = cy + OFFSET;
      if (x + PANEL_W > window.innerWidth - MARGIN) x = cx - PANEL_W - OFFSET;
      if (y + PANEL_H > window.innerHeight - MARGIN) y = cy - PANEL_H - OFFSET;
      el.style.left = `${Math.max(MARGIN, x)}px`;
      el.style.top = `${Math.max(MARGIN, y)}px`;
    };

    const onOver = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(
        "[data-project-preview]"
      ) as HTMLElement | null;
      if (!card) return;
      const name = card.dataset.projectName;
      if (!name) return;
      current = name;
      setActive(PROJECTS.find((p) => p.name === name) ?? null);
      place(e.clientX, e.clientY);
    };

    const onMove = (e: PointerEvent) => {
      if (current) place(e.clientX, e.clientY);
    };

    const onOut = (e: PointerEvent) => {
      const from = (e.target as Element | null)?.closest?.(
        "[data-project-preview]"
      ) as HTMLElement | null;
      if (!from) return;
      const to = e.relatedTarget as Element | null;
      if (!to || !from.contains(to)) {
        current = null;
        setActive(null);
      }
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-30"
      style={{
        width: PANEL_W,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 150ms ease, transform 150ms ease",
      }}
    >
      {active && (
        <div className="overflow-hidden border border-line bg-bg shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          {active.image && (
            <div className="relative aspect-[16/9]">
              <Image
                src={active.image}
                alt={active.name}
                fill
                sizes="288px"
                quality={80}
                loading="eager"
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-1.5 p-3">
            <p className="text-xs font-medium text-accent">{active.name}</p>
            {active.tags.length > 0 && (
              <p className="text-[10px] leading-relaxed text-muted">
                {active.tags.slice(0, 4).join(" · ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
