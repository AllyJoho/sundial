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
 * so an all-nighter or a 4 PM wake-up still lands on one date. Sleep itself isn't included here.
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
      if (s.kind !== 'activity' || !s.activityId) continue;
      const a = Math.max(s.start, day.start);
      const b = Math.min(s.end ?? now, end);
      if (b <= a) continue;
      const key = catOf.get(s.activityId) ?? UNCATEGORIZED;
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
