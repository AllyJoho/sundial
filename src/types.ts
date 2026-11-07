// The shapes of everything Sundial stores. See product/features.md → "Data model sketch".
// Times are stored as milliseconds since 1970 (Date.now()), which is easy to compare and sort.

export interface Category {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  order: number;
  archived: boolean;
}

export interface Activity {
  id: string;
  name: string;
  /** null = "uncategorized" (quick-add puts things here). */
  categoryId: string | null;
  /** Set when this is a sub-activity, e.g. "CS 235" under "Homework". */
  parentId: string | null;
  emoji?: string;
  favorite: boolean;
  archived: boolean;
  createdAt: number;
}

export type SleepType = 'main' | 'nap';

/**
 * A Session is one block of time. This is the source of truth.
 * Days, stats, and streaks are all calculated from these.
 */
export interface Session {
  id: string;
  kind: 'activity' | 'sleep';
  /** Which activity (only for kind = 'activity'). */
  activityId: string | null;
  /** Only for kind = 'sleep'. A main sleep ends the day; a nap doesn't. */
  sleepType?: SleepType;
  start: number;
  /** null while it's still running. */
  end: number | null;
  note?: string;
  source: 'live' | 'manual';
}
