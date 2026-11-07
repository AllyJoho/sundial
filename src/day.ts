// The sleep-based "day" (product/features.md, section 1).
// A day runs from waking up from a MAIN sleep until the start of the next main sleep.
// Naps are logged as sleep but don't end the day. Nothing here is stored. It's all calculated.
import type { Session } from './types';

export type DayState =
  /** No main sleep logged yet, so we don't know when the day began. */
  | { status: 'no-day' }
  /** Awake. The day started at `start`. */
  | { status: 'awake'; start: number }
  /** In a main sleep right now. The previous day ran from `dayStart` (if known) to `sleepStart`. */
  | { status: 'asleep'; sleepStart: number; dayStart: number | null };

const isMainSleep = (s: Session) => s.kind === 'sleep' && s.sleepType === 'main';

export function getDayState(sessions: Session[]): DayState {
  const mains = sessions.filter(isMainSleep).sort((a, b) => a.start - b.start);
  const last = mains[mains.length - 1];
  if (!last) return { status: 'no-day' };
  if (last.end === null) {
    const prev = mains[mains.length - 2];
    return { status: 'asleep', sleepStart: last.start, dayStart: prev?.end ?? null };
  }
  return { status: 'awake', start: last.end };
}

export interface TimelineBlock {
  type: 'session';
  session: Session;
  /** Start/end clipped to the day's window. */
  start: number;
  end: number;
  running: boolean;
}
export interface TimelineGap {
  type: 'gap';
  start: number;
  end: number;
}
export type TimelineItem = TimelineBlock | TimelineGap;

/** Gaps shorter than this aren't shown (switching between activities takes a moment). */
const MIN_GAP_MS = 2 * 60 * 1000;

/**
 * Builds the timeline for a window of time: the sessions inside it, in order,
 * with "untracked" gaps between them.
 */
export function buildTimeline(sessions: Session[], windowStart: number, windowEnd: number): TimelineItem[] {
  const blocks: TimelineBlock[] = sessions
    .filter((s) => s.start < windowEnd && (s.end ?? windowEnd) > windowStart)
    .map((s) => ({
      type: 'session' as const,
      session: s,
      start: Math.max(s.start, windowStart),
      end: Math.min(s.end ?? windowEnd, windowEnd),
      running: s.end === null,
    }))
    .sort((a, b) => a.start - b.start);

  const items: TimelineItem[] = [];
  let cursor = windowStart;
  for (const b of blocks) {
    if (b.start - cursor >= MIN_GAP_MS) items.push({ type: 'gap', start: cursor, end: b.start });
    items.push(b);
    cursor = Math.max(cursor, b.end);
  }
  if (windowEnd - cursor >= MIN_GAP_MS) items.push({ type: 'gap', start: cursor, end: windowEnd });
  return items;
}
