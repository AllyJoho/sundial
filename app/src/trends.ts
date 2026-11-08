// Week and month reviews (product/features.md section 9). All calculated from sessions.
import type { Day } from './days';
import { goalProgress, sleepNights, type SleepNight } from './goals';
import type { Activity, Goal, Session } from './types';

export type PeriodKind = 'week' | 'month';

export interface Period {
  kind: PeriodKind;
  /** Local midnight of the first date. */
  start: number;
  /** Local midnight after the last date. */
  end: number;
  /** Each calendar date in the period (local midnight). */
  dates: number[];
}

/** The week (Monday–Sunday) or month containing `t`, moved `offset` periods back (negative) or forward. */
export function getPeriod(kind: PeriodKind, t: number, offset = 0): Period {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  let start: Date;
  let end: Date;
  if (kind === 'week') {
    start = new Date(d);
    start.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7);
    end = new Date(start);
    end.setDate(start.getDate() + 7);
  } else {
    start = new Date(d.getFullYear(), d.getMonth() + offset, 1);
    end = new Date(d.getFullYear(), d.getMonth() + offset + 1, 1);
  }
  const dates: number[] = [];
  // Step by calendar date (not 24h) so daylight-saving changes don't skip or repeat a day.
  for (const x = new Date(start); x < end; x.setDate(x.getDate() + 1)) dates.push(x.getTime());
  return { kind, start: start.getTime(), end: end.getTime(), dates };
}

/** Local midnight of the date containing `t`. */
export function dateKey(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Category key for a session: its activity's category, 'none' for uncategorized. */
export const UNCATEGORIZED = 'none';
/** Key for naps, which show up next to the categories. */
export const NAP = 'nap';

export interface DateBucket {
  date: number;
  /** Milliseconds per category key. */
  byCategory: Map<string, number>;
  tracked: number;
  /** Total awake time of the day(s) that started on this date. */
  awake: number;
}

/**
 * Time per category for each date in the period. A sleep-based day is counted on the date you woke up,
 * so an all-nighter or a 4 PM wake-up still lands on one date. Main sleep isn't included here (it's the edge of the day), but naps are.
 */
export function bucketByDate(period: Period, days: Day[], sessions: Session[], activities: Activity[], now: number): DateBucket[] {
  const catOf = new Map(activities.map((a) => [a.id, a.categoryId ?? UNCATEGORIZED]));
  const buckets = new Map(period.dates.map((date) => [date, { date, byCategory: new Map<string, number>(), tracked: 0, awake: 0 }]));
  const relevant = days.filter((d) => d.start < period.end && (d.end ?? now) > period.start);
  for (const day of relevant) {
    const bucket = buckets.get(dateKey(day.start));
    if (!bucket) continue; // day started outside the period
    const end = day.end ?? now;
    bucket.awake += end - day.start;
    for (const s of sessions) {
      const isNap = s.kind === 'sleep' && s.sleepType === 'nap';
      if (!isNap && (s.kind !== 'activity' || !s.activityId)) continue;
      const a = Math.max(s.start, day.start);
      const b = Math.min(s.end ?? now, end);
      if (b <= a) continue;
      const key = isNap ? NAP : (catOf.get(s.activityId!) ?? UNCATEGORIZED);
      bucket.byCategory.set(key, (bucket.byCategory.get(key) ?? 0) + (b - a));
      bucket.tracked += b - a;
    }
  }
  return [...buckets.values()];
}

/** Totals per category over a set of buckets. */
export function totalsByCategory(buckets: DateBucket[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const b of buckets) for (const [k, v] of b.byCategory) out.set(k, (out.get(k) ?? 0) + v);
  return out;
}

/** Nights whose wake-up falls in the period, one per date (the latest wake-up if there are two). */
export function nightsInPeriod(period: Period, sessions: Session[], days: Day[], now: number): Map<number, SleepNight> {
  const out = new Map<number, SleepNight>();
  for (const n of sleepNights(sessions, days, now)) {
    if (n.wake < period.start || n.wake >= period.end) continue;
    out.set(dateKey(n.wake), n);
  }
  return out;
}

/** How many finished days in the period met each daily goal. */
export function goalHitRate(goal: Goal, period: Period, days: Day[], sessions: Session[], activities: Activity[], now: number) {
  const finished = days.filter((d) => d.end !== null && d.start >= period.start && d.start < period.end);
  const met = finished.filter((d) => goalProgress(goal, activities, sessions, d.start, d.end!, now).met).length;
  return { met, total: finished.length };
}

/** One row of the sleep chart: everything you slept for the day that started on this date. */
export interface SleepRow {
  /** Local midnight of the date (the date you woke up). */
  date: number;
  /** Main sleeps that ended on this date. Each wake-up is when a new day started. Usually just one. */
  mains: { start: number; end: number }[];
  /** Naps during the day that started on this date. */
  naps: { start: number; end: number }[];
}

/**
 * Sleep for each date in the period. A night goes on the date you woke up (the same rule as the rest of Trends),
 * and a nap goes on the date its day started, so a 1 AM nap during a late day stays with that day.
 */
export function sleepRows(period: Period, sessions: Session[], days: Day[], now: number): SleepRow[] {
  const rows = new Map(period.dates.map((date) => [date, { date, mains: [], naps: [] } as SleepRow]));
  for (const s of sessions) {
    if (s.kind !== 'sleep') continue;
    if (s.sleepType === 'nap') {
      const day = days.find((d) => s.start >= d.start && s.start < (d.end ?? now));
      rows.get(dateKey(day ? day.start : s.start))?.naps.push({ start: s.start, end: s.end ?? now });
    } else if (s.end !== null) {
      rows.get(dateKey(s.end))?.mains.push({ start: s.start, end: s.end });
    }
  }
  for (const r of rows.values()) {
    r.mains.sort((a, b) => a.start - b.start);
    r.naps.sort((a, b) => a.start - b.start);
  }
  return [...rows.values()];
}

/** Minutes from the row's midnight to `t`. Negative = the evening before. Uses calendar dates, so daylight saving can't shift it. */
export function minutesFromDate(date: number, t: number): number {
  const d = new Date(t);
  const dayDiff = Math.round((dateKey(t) - date) / 86_400_000);
  return dayDiff * 1440 + d.getHours() * 60 + d.getMinutes();
}

/** A block drawn on the calendar: a session cut to one calendar date. */
export interface CalendarBlock {
  session: Session;
  start: number;
  end: number;
  /** Starts while an earlier block is still going (multitasking), so it's drawn beside it. */
  overlap: boolean;
}

export interface CalendarDay {
  /** Local midnight. */
  date: number;
  /** Local midnight of the next date (daylight saving can make a date 23 or 25 hours). */
  dateEnd: number;
  blocks: CalendarBlock[];
  /** Milliseconds per key: 'sleep', NAP, a category id, or UNCATEGORIZED. */
  totals: Map<string, number>;
  /** Time not covered by any block (up to now, for today). */
  untracked: number;
  /** Wake-ups from main sleep on this date: when a new day started. */
  wakes: number[];
}

/** Everything on one calendar date (midnight to midnight), for the calendar view. */
export function calendarDay(date: number, sessions: Session[], activities: Activity[], now: number): CalendarDay {
  const d = new Date(date);
  const dateEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
  const until = Math.min(dateEnd, now);
  const catOf = new Map(activities.map((a) => [a.id, a.categoryId ?? UNCATEGORIZED]));
  const blocks: CalendarBlock[] = [];
  const totals = new Map<string, number>();
  const wakes: number[] = [];
  const sorted = sessions.filter((s) => s.start < dateEnd && (s.end ?? now) > date).sort((a, b) => a.start - b.start);
  let maxEnd = -Infinity;
  let covered = 0;
  for (const s of sorted) {
    const start = Math.max(s.start, date);
    const end = Math.min(s.end ?? now, dateEnd);
    if (end <= start) continue;
    blocks.push({ session: s, start, end, overlap: start < maxEnd - 60_000 });
    // Time covered by at least one block (overlaps count once), for "untracked".
    const a = Math.max(start, maxEnd);
    const b = Math.min(end, until);
    if (b > a) covered += b - a;
    maxEnd = Math.max(maxEnd, end);
    const key = s.kind === 'sleep' ? (s.sleepType === 'nap' ? NAP : 'sleep') : (catOf.get(s.activityId ?? '') ?? UNCATEGORIZED);
    totals.set(key, (totals.get(key) ?? 0) + (end - start));
    if (s.kind === 'sleep' && s.sleepType !== 'nap' && s.end !== null && s.end >= date && s.end < dateEnd) wakes.push(s.end);
  }
  return { date, dateEnd, blocks, totals, untracked: Math.max(0, until - date - covered), wakes };
}
