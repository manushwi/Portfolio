"use client";

import { useEffect, useRef, useState } from "react";
import type { Contributions, Day } from "@/lib/github";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const LEVEL_PCT = [0, 22, 42, 66, 95];

function colorFor(level: number): string {
  if (level <= 0) return "#1a1b1d";
  return `color-mix(in srgb, var(--accent) ${LEVEL_PCT[level]}%, #0d0e0f)`;
}

function fmtDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Tooltip = { date: string; count: number; left: number; top: number };

/**
 * GitHub-style contribution heatmap for the last ~52 weeks. Fetches live
 * data from /api/github (GraphQL) and falls back to sample data.
 */
export function ContributionGraph() {
  const [data, setData] = useState<Contributions | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github?data=contributions")
      .then((r) => r.json())
      .then((d: Contributions) => {
        if (!cancelled) setData(d);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = data?.weeks ?? [];
  const width = weeks.length * STEP;

  const onEnter = (e: React.MouseEvent<HTMLDivElement>, day: Day) => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const rect = scroll.getBoundingClientRect();
    const el = e.currentTarget.getBoundingClientRect();
    setTooltip({
      date: day.date,
      count: day.count,
      left: el.left - rect.left + el.width / 2,
      top: el.top - rect.top,
    });
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm text-fg">
          <span className="text-accent">~</span> contributions
        </h2>
        <p className="text-xs text-muted">
          {data
            ? `${data.total.toLocaleString("en-US")} in the last year`
            : "loading…"}
          {data?.source === "mock" && (
            <span className="ml-2 text-muted/70">[sample data]</span>
          )}
        </p>
      </div>

      <div ref={scrollRef} className="relative overflow-x-auto pb-1">
        <div className="relative" style={{ width }}>
          {data?.months.map((m) => (
            <span
              key={`${m.label}-${m.weekIndex}`}
              className="absolute top-0 text-[9px] leading-none text-muted"
              style={{ left: m.weekIndex * STEP }}
            >
              {m.label}
            </span>
          ))}

          <div className="mt-4 flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="rounded-[2px] transition-transform duration-100 hover:scale-125"
                    style={{
                      width: CELL,
                      height: CELL,
                      backgroundColor: colorFor(day.level),
                    }}
                    onMouseEnter={(e) => onEnter(e, day)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 border border-line bg-bg px-2 py-1 text-[10px] text-fg"
              style={{
                left: tooltip.left,
                top: tooltip.top - 28,
                transform: "translateX(-50%)",
              }}
            >
              {tooltip.count > 0
                ? `${tooltip.count} contribution${tooltip.count === 1 ? "" : "s"}`
                : "no contributions"}{" "}
              on {fmtDate(tooltip.date)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-[9px] text-muted">
        <span>less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span
            key={l}
            className="rounded-[2px]"
            style={{ width: CELL, height: CELL, backgroundColor: colorFor(l) }}
          />
        ))}
        <span>more</span>
      </div>
    </section>
  );
}
