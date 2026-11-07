// Days, streaks, check-ins, and overlap handling. All calculated from sessions + reviews (nothing stored).
// See product/features.md sections 1, 5 and 8.
import { buildTimeline, type DayState } from './day';
import type { DayReview, Session } from './types';

const H = 3600_000;

// ---------------------------------------------------------------------------
// Days
// ---------------------------------------------------------------------------

export interface Day {
  /** When you woke up (the end of the main sleep before this day). */
  start: number;
  /** When the main sleep that ended this day began. null = the day is still going. */
  end: number | null;
  /** The main sleep that ended this day (reviews link to it). */
  closingSleepId: string | null;
  review?: DayReview;
}

const isMain = (s: Session) => s.kind === 'sleep' && s.sleepType === 'main';

/** Every day you've had, oldest first. The last one may still be going (end = null). */
export function listDays(sessions: Session[], reviews: DayReview[]): Day[] {
  const mains = sessions.filter(isMain).sort((a, b) => a.start - b.start);
  const reviewBySleep = new Map(reviews.map((r) => [r.sleepId, r]));
  const days: Day[] = [];
  for (let i = 0; i < mains.length; i++) {
    const wake = mains[i].end;
    if (wake === null) continue; // still asleep: no day after this one yet
    const next = mains[i + 1];
    days.push({
      start: wake,
      end: next ? Math.max(next.start, wake) : null,
      closingSleepId: next?.id ?? null,
      review: next ? reviewBySleep.get(next.id) : undefined,
    });
  }
  return days;
}

// ---------------------------------------------------------------------------
// Streaks (calorie-tracker style)
// ---------------------------------------------------------------------------

/** How long after a day ends you can still close it out and have it count. */
export const RECOVERY_WINDOW_MS = 48 * H;

/** A day counts toward your streak if it was closed out within the recovery window. */
export function countsForStreak(day: Day): boolean {
  return !!day.review && day.end !== null && day.review.closedAt <= day.end + RECOVERY_WINDOW_MS;
}

export interface StreakInfo {
  /** Days in a row that were closed out. */
  count: number;
  /** Recent days that aren't closed yet but still can be (newest first). Closing them keeps the streak. */
  recoverable: Day[];
  /** Streak freezes saved up (earned one per 7 days in a row, up to MAX_FREEZES). */
  freezes: number;
  /** Start times of days a freeze covered. */
  frozen: Set<number>;
}

/** You earn a freeze every this many days in a row... */
export const FREEZE_EVERY = 7;
/** ...and can save up to this many. */
export const MAX_FREEZES = 2;

/**
 * Walks through your days oldest → newest:
 *  - a closed-out day adds 1 (and every 7th in a row earns a freeze)
 *  - a recent unclosed day (still inside the 2-day window) is "pending": it doesn't count or break anything yet
 *  - a missed day past the window uses a freeze if you have one; otherwise the streak starts over
 */
export function getStreak(days: Day[], now: number): StreakInfo {
  const finished = days.filter((d) => d.end !== null);
  let count = 0;
  let freezes = 0;
  const frozen = new Set<number>();
  for (const d of finished) {
    if (countsForStreak(d)) {
      count++;
      if (count % FREEZE_EVERY === 0) freezes = Math.min(MAX_FREEZES, freezes + 1);
    } else if (!d.review && now <= d.end! + RECOVERY_WINDOW_MS) {
      // pending: can still be closed out
    } else if (freezes > 0) {
      freezes--;
      frozen.add(d.start);
    } else {
      count = 0;
    }
  }
  const recoverable = finished.filter((d) => !d.review && now <= d.end! + RECOVERY_WINDOW_MS).reverse();
  return { count, recoverable, freezes, frozen };
}

// ---------------------------------------------------------------------------
// Check-ins: "Did you sleep?" (forgot goodnight / all-nighter) and "Still asleep?" (forgot good morning)
// ---------------------------------------------------------------------------

export type CheckIn =
  | { type: 'long-sleep'; session: Session; suggestWake: number }
  | { type: 'missed-sleep'; dayStart: number; awakeMs: number; suggestStart: number; suggestEnd: number };

export const ALL_NIGHTER_MS = 20 * H;

export function detectCheckIn(sessions: Session[], day: DayState, now: number): CheckIn | null {
  const running = sessions.find((s) => s.end === null);

  // A sleep timer that has been running a very long time: probably forgot "Good morning".
  if (running?.kind === 'sleep') {
    const limit = running.sleepType === 'nap' ? 4 * H : 14 * H;
    if (now - running.start > limit) {
      const typical = running.sleepType === 'nap' ? 1 * H : 8 * H;
      return { type: 'long-sleep', session: running, suggestWake: Math.min(now, running.start + typical) };
    }
    return null;
  }

  if (day.status !== 'awake') return null;
  const awakeMs = now - day.start;
  if (awakeMs < 16 * H) return null;

  const items = buildTimeline(sessions, day.start, now);
  const gaps = items.filter((i) => i.type === 'gap');
  const longestGap = gaps.reduce<{ start: number; end: number } | null>(
    (best, g) => (!best || g.end - g.start > best.end - best.start ? g : best),
    null,
  );
  const last = items[items.length - 1];
  const trailingGap = last?.type === 'gap' && last.end - last.start >= 5 * H;
  const runningLong = running?.kind === 'activity' && now - running.start >= 8 * H;

  if (!(awakeMs >= ALL_NIGHTER_MS || trailingGap || runningLong)) return null;

  let suggestStart: number;
  let suggestEnd: number;
  if (longestGap && longestGap.end - longestGap.start >= 3 * H) {
    suggestStart = longestGap.start;
    suggestEnd = longestGap.end;
  } else {
    suggestEnd = now;
    suggestStart = Math.max(day.start, now - 8 * H);
  }
  return { type: 'missed-sleep', dayStart: day.start, awakeMs, suggestStart, suggestEnd };
}

// ---------------------------------------------------------------------------
// Overlaps: adding a block of time on top of others
// ---------------------------------------------------------------------------

export interface InsertPlan {
  /** Sessions that get a new end time (they started before the new block). */
  trimEnd: { session: Session; end: number }[];
  /** Sessions that get a new start time (they end after the new block). */
  moveStart: { session: Session; start: number }[];
  /** Finished sessions that surround the new block and get split in two around it. */
  split: { session: Session; firstEnd: number; secondStart: number }[];
  /** Sessions completely covered by the new block. */
  remove: Session[];
}

export const isEmptyPlan = (p: InsertPlan) => !p.trimEnd.length && !p.moveStart.length && !p.split.length && !p.remove.length;

/**
 * Works out what must change so a new block [start, end] doesn't overlap anything.
 * Nothing is changed here; the caller shows the plan, then applies it.
 */
export function planInsert(sessions: Session[], start: number, end: number, now: number, ignoreId?: string): InsertPlan {
  const plan: InsertPlan = { trimEnd: [], moveStart: [], split: [], remove: [] };
  for (const s of sessions) {
    if (s.id === ignoreId) continue;
    const sEnd = s.end ?? now;
    if (s.start >= end || sEnd <= start) continue; // no overlap
    const before = s.start < start;
    const after = sEnd > end;
    if (before && after) {
      // A running timer that spans the block just stops at the block's start.
      if (s.end === null) plan.trimEnd.push({ session: s, end: start });
      else plan.split.push({ session: s, firstEnd: start, secondStart: end });
    } else if (before) plan.trimEnd.push({ session: s, end: start });
    else if (after) plan.moveStart.push({ session: s, start: end });
    else plan.remove.push(s);
  }
  return plan;
}

// ---------------------------------------------------------------------------
// Gap fill for the review
// ---------------------------------------------------------------------------

/** Untracked stretches at least this long get a "What was this?" in the review. */
export const GAP_PROMPT_MS = 1 * H;
/** When rebuilding a mostly-untracked day, long gaps are split into blocks no longer than this. */
const ROUGH_BLOCK_MS = 4 * H;

export interface GapChunk {
  start: number;
  end: number;
}

/** True when less than half the day was tracked, so closing it means rebuilding it (streak recovery). */
export function needsRebuild(sessions: Session[], start: number, end: number): boolean {
  const items = buildTimeline(sessions, start, end);
  const untracked = items.filter((i) => i.type === 'gap').reduce((t, g) => t + (g.end - g.start), 0);
  return end - start > 2 * H && untracked / (end - start) > 0.5;
}

/** The untracked stretches to ask about, split into rough blocks when rebuilding a day. */
export function gapChunks(sessions: Session[], start: number, end: number, rebuild: boolean): GapChunk[] {
  const gaps = buildTimeline(sessions, start, end).filter((i) => i.type === 'gap' && i.end - i.start >= GAP_PROMPT_MS);
  if (!rebuild) return gaps.map((g) => ({ start: g.start, end: g.end }));
  return gaps.flatMap((g) => {
    const parts = Math.max(1, Math.ceil((g.end - g.start) / ROUGH_BLOCK_MS));
    const size = (g.end - g.start) / parts;
    return Array.from({ length: parts }, (_, i) => ({
      start: Math.round(g.start + i * size),
      end: i === parts - 1 ? g.end : Math.round(g.start + (i + 1) * size),
    }));
  });
}
