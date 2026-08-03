"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/** Live clock in the site's timezone, e.g. "12:04:05 IST". */
export function useCurrentTime(): string {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tz = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE.timezone,
      timeZoneName: "short",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value;

    const tick = () => setTime(`${fmt.format(new Date())} ${tz ?? ""}`);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
