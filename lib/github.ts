export type Day = {
  date: string;
  count: number;
  level: number; // 0..4
};

export type Week = Day[];

export type MonthLabel = {
  weekIndex: number;
  label: string;
};

export type Contributions = {
  source: "live" | "mock";
  total: number;
  months: MonthLabel[];
  weeks: Week[];
};

export type GithubResponse = Contributions | { error: string };

/**
 * Compute month label positions from a week grid. Returns the week index at
 * which each month starts (first visible week of that month).
 */
export function computeMonths(weeks: Week[]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  const seen = new Set<string>();

  weeks.forEach((week, weekIndex) => {
    const day = week[Math.floor(week.length / 2)];
    if (!day) return;
    const month = day.date.slice(0, 7); // YYYY-MM
    if (!seen.has(month)) {
      seen.add(month);
      labels.push({
        weekIndex,
        label: new Date(`${month}-01T00:00:00`)
          .toLocaleString("en-US", { month: "short" })
          .replace(".", ""),
      });
    }
  });

  return labels;
}

/** Map a contribution count to a 0..4 intensity bucket (GitHub-like). */
export function levelForCount(count: number): number {
  if (count <= 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}
