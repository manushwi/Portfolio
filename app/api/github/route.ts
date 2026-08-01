import { NextRequest } from "next/server";
import {
  computeMonths,
  levelForCount,
  type Contributions,
  type Week,
} from "@/lib/github";
import { mockContributions } from "@/lib/github-fallback";

export const runtime = "nodejs";
export const revalidate = 3600;

const TOKEN = process.env.GITHUB_TOKEN;

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query ($user: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $user) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

function levelFrom(level: string): number {
  switch (level) {
    case "FIRST_QUARTILE":
      return 1;
    case "SECOND_QUARTILE":
      return 2;
    case "THIRD_QUARTILE":
      return 3;
    case "FOURTH_QUARTILE":
      return 4;
    default:
      return 0;
  }
}

async function fetchContributions(): Promise<Contributions> {
  if (!TOKEN) throw new Error("GITHUB_TOKEN not set");

  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - 363);
  from.setHours(0, 0, 0, 0);

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: {
        user: "manushwi",
        from: from.toISOString(),
        to: today.toISOString(),
      },
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("No contribution calendar returned");

  const weeks: Week[] = calendar.weeks.map((w: { contributionDays: never[] }) =>
    w.contributionDays.map(
      (d: {
        date: string;
        contributionCount: number;
        contributionLevel: string;
      }) => ({
        date: d.date,
        count: d.contributionCount,
        level: levelFrom(d.contributionLevel) ?? levelForCount(d.contributionCount),
      })
    )
  );

  return {
    source: "live",
    total: calendar.totalContributions as number,
    months: computeMonths(weeks),
    weeks,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");

  if (data === "contributions") {
    try {
      return Response.json(await fetchContributions(), {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      });
    } catch {
      return Response.json(mockContributions());
    }
  }

  return Response.json({ error: "unknown data type" }, { status: 400 });
}
