// "Your usual" tiles and the "What are you doing?" suggestions (Sun Check 2026-11-07).
// Tiles learn from what you actually use, so one-offs (like "took a test") don't clutter them.
import type { Activity, Session } from './types';

const DAY = 24 * 3600_000;
const STARTER_ORDER = ['#act-scrolling', '#act-class', '#act-homework', '#act-eating', '#act-gaming', '#act-getting-ready'];

/** Look back this far when deciding what's "usual". */
const WINDOW = 30 * DAY;
/** An activity needs at least this many uses in the window to become a tile (unless pinned with ★). */
const MIN_USES = 2;

export interface UsageStats {
  /** Recency-weighted use count over the last 30 days. */
  score: Map<string, number>;
  /** Most recent start time per activity (any time). */
  lastUsed: Map<string, number>;
  uses: Map<string, number>;
}

export function usageStats(sessions: Session[], now: number): UsageStats {
  const score = new Map<string, number>();
  const lastUsed = new Map<string, number>();
  const uses = new Map<string, number>();
  for (const s of sessions) {
    if (s.kind !== 'activity' || !s.activityId) continue;
    const id = s.activityId;
    lastUsed.set(id, Math.max(lastUsed.get(id) ?? 0, s.start));
    const age = now - s.start;
    if (age < 0 || age > WINDOW) continue;
    uses.set(id, (uses.get(id) ?? 0) + 1);
    // Recent use counts more: this week ×2, older ×1.
    score.set(id, (score.get(id) ?? 0) + (age < 7 * DAY ? 2 : 1));
  }
  return { score, lastUsed, uses };
}

/**
 * The activities for the "Your usual" tiles: pinned (★) first, then the ones you use most.
 * New users (not much history yet) get the starter activities to fill the space.
 */
export function usualActivities(activities: Activity[], stats: UsageStats, limit: number): Activity[] {
  const live = activities.filter((a) => !a.archived);
  const pinned = live.filter((a) => a.favorite);
  const used = live
    .filter((a) => !a.favorite && (stats.uses.get(a.id) ?? 0) >= MIN_USES)
    .sort((a, b) => (stats.score.get(b.id) ?? 0) - (stats.score.get(a.id) ?? 0));
  // Starters fill in (in this order) until you have enough history; Scrolling first so it's always one tap.
  const starters = STARTER_ORDER.map((id) => live.find((a) => a.id === id)).filter((a): a is Activity => !!a);
  const out: Activity[] = [];
  for (const a of [...pinned, ...used, ...starters]) {
    if (out.length >= limit) break;
    if (!out.some((x) => x.id === a.id)) out.push(a);
  }
  return out;
}

/**
 * Suggestions while typing: names that start with what you typed come first, then names that contain it;
 * within each, the most recently used first.
 */
export function searchActivities(activities: Activity[], labelOf: (a: Activity) => string, stats: UsageStats, query: string, limit = 6): Activity[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const live = activities.filter((a) => !a.archived);
  const rank = (a: Activity) => {
    const name = a.name.toLowerCase();
    const label = labelOf(a).toLowerCase();
    if (name.startsWith(q)) return 0;
    if (label.split(/[\s›]+/).some((w) => w.startsWith(q))) return 1;
    if (label.includes(q)) return 2;
    return -1;
  };
  return live
    .map((a) => ({ a, r: rank(a) }))
    .filter((x) => x.r >= 0)
    .sort((x, y) => x.r - y.r || (stats.lastUsed.get(y.a.id) ?? 0) - (stats.lastUsed.get(x.a.id) ?? 0))
    .slice(0, limit)
    .map((x) => x.a);
}

/** True if an activity with exactly this name already exists (so typing it starts that one, not a duplicate). */
export function exactMatch(activities: Activity[], query: string): Activity | undefined {
  const q = query.trim().toLowerCase();
  return activities.find((a) => !a.archived && a.name.toLowerCase() === q);
}
