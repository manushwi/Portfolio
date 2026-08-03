import { computeMonths, levelForCount, type Contributions, type Week } from "./github";

/**
 * Deterministic mock contribution calendar (52 weeks) so the graph renders
 * with sensible data when no GITHUB_TOKEN is configured or the API fails.
 */
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function mockContributions(): Contributions {
  const rand = seededRandom(20260201);
  const weeks: Week[] = [];

  // Align to the Sunday before (today - 51*7 days).
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 51 * 7);
  start.setHours(0, 0, 0, 0);
  const dow = (start.getDay() + 6) % 7; // Mon=0 … Sun=6
  start.setDate(start.getDate() - dow);

  let total = 0;
  const cursor = new Date(start);
  for (let w = 0; w < 52; w++) {
    const week: Week = [];
    for (let d = 0; d < 7; d++) {
      if (cursor.getTime() > today.getTime()) {
        week.push({ date: isoDate(cursor), count: 0, level: 0 });
      } else {
        const r = rand();
        const count = r < 0.4 ? 0 : r < 0.62 ? 1 : r < 0.82 ? 3 : r < 0.93 ? 6 : 12;
        total += count;
        week.push({ date: isoDate(cursor), count, level: levelForCount(count) });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return {
    source: "mock",
    total,
    months: computeMonths(weeks),
    weeks,
  };
}
