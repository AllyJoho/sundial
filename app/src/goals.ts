// Goals and sleep goals (product/features.md sections 6 and 7). All calculated from sessions.
import type { Day } from './days';
import type { Activity, Goal, Session, Settings } from './types';

const MIN = 60_000;
const H = 60 * MIN;
const DAY = 24 * H;

// ---------------------------------------------------------------------------
// Time spent on a goal's target
// ---------------------------------------------------------------------------

/** Which activity ids count toward a target (an activity includes its sub-activities). */
export function targetActivityIds(target: Goal['target'], activities: Activity[]): Set<string> {
  if (target.type === 'category') return new Set(activities.filter((a) => a.categoryId === target.id).map((a) => a.id));
  return new Set([target.id, ...activities.filter((a) => a.parentId === target.id).map((a) => a.id)]);
}

/** Milliseconds spent on those activities between start and end (running sessions count up to `now`). */
export function timeOn(ids: Set<string>, sessions: Session[], start: number, end: number, now: number): number {
  let total = 0;
  for (const s of sessions) {
    if (s.kind !== 'activity' || !s.activityId || !ids.has(s.activityId)) continue;
    const a = Math.max(s.start, start);
    const b = Math.min(s.end ?? now, end);
    if (b > a) total += b - a;
  }
  return total;
}

/** Monday 00:00 (local time) of the week containing `t`. */
export function weekStart(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  const daysSinceMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - daysSinceMonday);
  return d.getTime();
}

export interface GoalProgress {
  goal: Goal;
  spentMs: number;
  targetMs: number;
  /** 0..1+ (can go above 1). */
  ratio: number;
  /** For a minimum: reached it. For a limit: still under it. */
  met: boolean;
  /** How far past a limit (0 if not over). */
  overMs: number;
}

/**
 * Progress on a goal. Daily goals use your sleep-based day (dayStart → now or day end).
 * Weekly goals use the calendar week (Monday to Sunday).
 */
export function goalProgress(
  goal: Goal,
  activities: Activity[],
  sessions: Session[],
  dayStart: number,
  dayEnd: number,
  now: number,
): GoalProgress {
  const ids = targetActivityIds(goal.target, activities);
  const start = goal.period === 'day' ? dayStart : weekStart(dayStart);
  const end = goal.period === 'day' ? dayEnd : Math.min(start + 7 * DAY, now);
  const spentMs = timeOn(ids, sessions, start, end, now);
  const targetMs = goal.minutes * MIN;
  const ratio = targetMs > 0 ? spentMs / targetMs : 0;
  return {
    goal,
    spentMs,
    targetMs,
    ratio,
    met: goal.kind === 'min' ? spentMs >= targetMs : spentMs <= targetMs,
    overMs: goal.kind === 'limit' ? Math.max(0, spentMs - targetMs) : 0,
  };
}

/**
 * Your recent average per day for a target, so goals can start from your real baseline (principle 5).
 * Uses up to the last 14 finished days. Returns null if there isn't enough history.
 */
export function dailyBaseline(target: Goal['target'], activities: Activity[], sessions: Session[], days: Day[]): number | null {
  const finished = days.filter((d) => d.end !== null).slice(-14);
  if (finished.length < 3) return null;
  const ids = targetActivityIds(target, activities);
  const total = finished.reduce((t, d) => t + timeOn(ids, sessions, d.start, d.end!, d.end!), 0);
  return total / finished.length;
}

// ---------------------------------------------------------------------------
// Sleep
// ---------------------------------------------------------------------------

/** Minutes after local midnight, e.g. 9:30 AM → 570. */
export function minuteOfDay(t: number): number {
  const d = new Date(t);
  return d.getHours() * 60 + d.getMinutes();
}

/** Shortest distance between two times of day, in minutes (so 11:50 PM and 12:10 AM are 20 min apart). */
export function clockDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 1440;
  return Math.min(d, 1440 - d);
}

/**
 * Average time of day, done on a circle so times around midnight average correctly
 * (11 PM and 1 AM average to midnight, not noon).
 */
export function averageClockTime(minutes: number[]): number | null {
  if (minutes.length === 0) return null;
  let x = 0;
  let y = 0;
  for (const m of minutes) {
    const angle = (m / 1440) * 2 * Math.PI;
    x += Math.cos(angle);
    y += Math.sin(angle);
  }
  const angle = Math.atan2(y, x);
  return Math.round((((angle / (2 * Math.PI)) * 1440) % 1440 + 1440) % 1440);
}

export function formatClockMinutes(m: number): string {
  const d = new Date(2000, 0, 1, Math.floor(m / 60), m % 60);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** Wake-up times (minutes after midnight) for the last `n` days. */
export function recentWakeTimes(days: Day[], n = 14): number[] {
  return days.slice(-n).map((d) => minuteOfDay(d.start));
}

/** The wake time you're aiming for today, based on the sleep mode. null = no target (Just track, or not enough data). */
export function targetWake(settings: Settings, days: Day[], now: number): number | null {
  if (settings.sleepMode === 'stabilize') {
    // Your own usual wake time (from days before today), whatever it is.
    return averageClockTime(recentWakeTimes(days.slice(0, -1)));
  }
  if (settings.sleepMode === 'shift' && settings.shiftStartWake !== undefined && settings.shiftStartedAt !== undefined) {
    const weeks = Math.max(0, Math.floor((now - settings.shiftStartedAt) / (7 * DAY)));
    const moved = settings.shiftStartWake - weeks * settings.shiftMinutesPerWeek;
    const goal = settings.shiftGoalWake ?? -Infinity;
    // Don't go past the goal. (Shift mode only moves earlier.)
    return ((Math.max(moved, goal) % 1440) + 1440) % 1440;
  }
  return null;
}

export interface SleepNight {
  /** The day this sleep led into. */
  day: Day;
  /** The main sleep before this day. */
  mainMs: number;
  /** Naps during this day. */
  napMs: number;
  /** Bed time and wake time. */
  bed: number;
  wake: number;
}

/** Sleep for each day: the main sleep that started it, plus that day's naps. */
export function sleepNights(sessions: Session[], days: Day[], now: number): SleepNight[] {
  const mains = sessions.filter((s) => s.kind === 'sleep' && s.sleepType === 'main' && s.end !== null);
  const byEnd = new Map(mains.map((s) => [s.end!, s]));
  const naps = sessions.filter((s) => s.kind === 'sleep' && s.sleepType === 'nap');
  return days.flatMap((day) => {
    const main = byEnd.get(day.start);
    if (!main) return [];
    const end = day.end ?? now;
    const napMs = naps.reduce((t, n) => {
      const a = Math.max(n.start, day.start);
      const b = Math.min(n.end ?? now, end);
      return b > a ? t + (b - a) : t;
    }, 0);
    return [{ day, mainMs: main.end! - main.start, napMs, bed: main.start, wake: main.end! }];
  });
}

export const totalSleep = (n: SleepNight, s: Settings) => n.mainMs + (s.napsCount ? n.napMs : 0);
export const inSleepRange = (ms: number, s: Settings) => ms >= s.sleepHoursMin * H && ms <= s.sleepHoursMax * H;

/** How many of the last `n` wake-ups were within the window of the target. */
export function daysInWakeWindow(days: Day[], target: number, windowMinutes: number, n = 7) {
  const recent = days.slice(-n);
  return {
    inWindow: recent.filter((d) => clockDistance(minuteOfDay(d.start), target) <= windowMinutes).length,
    total: recent.length,
  };
}

/** Wake-time consistency: average distance from your average wake time, in minutes (lower = steadier). */
export function wakeSpread(days: Day[], n = 14): number | null {
  const times = recentWakeTimes(days, n);
  if (times.length < 3) return null;
  const avg = averageClockTime(times)!;
  return Math.round(times.reduce((t, m) => t + clockDistance(m, avg), 0) / times.length);
}

/** Sleep debt: how far under your minimum you've been over the last 7 nights (only counts shortfalls). */
export function sleepDebt(nights: SleepNight[], s: Settings, n = 7): number {
  return nights.slice(-n).reduce((t, night) => t + Math.max(0, s.sleepHoursMin * H - totalSleep(night, s)), 0);
}
