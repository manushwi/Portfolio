"use client";

import { SITE } from "@/lib/site";
import { useCurrentTime } from "@/hooks/use-current-time";
import { useIsOnline } from "@/hooks/use-is-online";

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-line px-2 py-0.5 text-[11px] text-muted ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Status + utility pills: open-to-work status, tl;dr, live local time and
 * an online/offline indicator.
 */
export function HeroPills() {
  const time = useCurrentTime();
  const online = useIsOnline();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill className="border-accent/50 text-accent">
        <span className="inline-block h-1.5 w-1.5 animate-blink bg-accent" />
        {SITE.status}
      </Pill>
      <Pill>tl;dr — {SITE.tldr}</Pill>
      <Pill>{time}</Pill>
      <Pill>
        <span
          className={`inline-block h-1.5 w-1.5 ${
            online ? "bg-accent" : "bg-muted"
          }`}
        />
        {online ? "online" : "offline"}
      </Pill>
    </div>
  );
}
