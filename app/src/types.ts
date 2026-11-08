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

/**
 * The end-of-day review (goodnight). Linked to the main sleep that closed the day,
 * so editing the day's times later doesn't break the link.
 */
export interface DayReview {
  id: string;
  /** The main sleep session that ended this day. */
  sleepId: string;
  /** 1–5, optional. */
  mood?: number;
  /** 1–5, optional. */
  energy?: number;
  note?: string;
  /** When the day was closed out. Used for the 2-day streak recovery window. */
  closedAt: number;
}

/** A goal, like a calorie goal: "at least 3h homework a day" or "under 1h scrolling a day". */
export interface Goal {
  id: string;
  /** What it's about: one activity (including its sub-activities) or a whole category. */
  target: { type: 'activity' | 'category'; id: string };
  /** 'min' = at least this much; 'limit' = no more than this much. */
  kind: 'min' | 'limit';
  minutes: number;
  period: 'day' | 'week';
  createdAt: number;
  archived: boolean;
}

export type SleepMode = 'track' | 'stabilize' | 'shift';

/** App settings. There's one row, with id '#main' ("#" = private to you when syncing, see src/ids.ts). */
export interface Settings {
  id: '#main';
  /** Just track / Stabilize (same wake time daily) / Shift (move wake time earlier gradually). */
  sleepMode: SleepMode;
  /** Total sleep goal range, in hours. */
  sleepHoursMin: number;
  sleepHoursMax: number;
  /** Do naps count toward total sleep? */
  napsCount: boolean;
  /** How close to the target wake time counts as "in the window", in minutes (either side). */
  wakeWindowMinutes: number;
  /** Shift mode: minutes earlier per week, when it started, the wake time it started from, and where to stop. Times are minutes after midnight. */
  shiftMinutesPerWeek: number;
  shiftStartedAt?: number;
  shiftStartWake?: number;
  shiftGoalWake?: number;
  /** The routine you're in the middle of, and which step (0 = first activity). */
  activeRoutine?: { routineId: string; step: number };
  /** Show "Add to iPhone Calendar" on tasks. Off by default (many people won't want it). */
  calendarExport?: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  id: '#main',
  sleepMode: 'track',
  sleepHoursMin: 7,
  sleepHoursMax: 9,
  napsCount: true,
  wakeWindowMinutes: 60,
  shiftMinutesPerWeek: 15,
};

/** A routine: one tap starts a sequence of activities, like a morning routine. */
export interface Routine {
  id: string;
  name: string;
  emoji?: string;
  /** The activities, in order. */
  activityIds: string[];
  createdAt: number;
}

/**
 * A to-do item (Sun Check 2026-11-07, "To-do list"). Everything except the title is optional.
 * Tasks aren't time blocks; doing one can still be tracked as an activity like anything else.
 */
export interface Task {
  id: string;
  title: string;
  /** Instructions for future-you ("ask for billing, account #1234"). */
  notes?: string;
  /** Due date as a calendar date, "YYYY-MM-DD". */
  due?: string;
  /** Only doable during these hours, e.g. Mon–Fri 9–5 (phone calls to businesses). */
  window?: TaskWindow;
  /** 'today' = on today's list; 'later' = the Later list (moves to the Plan tab once it exists). */
  list: 'today' | 'later';
  createdAt: number;
  /** When it was checked off (done tasks drop off the list after the day they were done). */
  doneAt?: number;
}

export interface TaskWindow {
  /** Days of the week it's open: 0 = Sunday … 6 = Saturday. */
  days: number[];
  /** Minutes after midnight, e.g. 9:00 → 540, 17:00 → 1020. */
  start: number;
  end: number;
}
