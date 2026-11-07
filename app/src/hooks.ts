// "Hooks" are reusable pieces of React logic. These ones read live data from the database:
// whenever the data changes, any screen using them re-draws automatically.
import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { colorVar, inkVar } from './palette';
import { DEFAULT_SETTINGS, type Activity, type Category, type DayReview, type Goal, type Routine, type Session, type Settings } from './types';

/** The current time, updated every `intervalMs`. Used for running timers. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    // When you come back to the app, update right away instead of waiting for the next tick.
    const onVisible = () => document.visibilityState === 'visible' && setNow(Date.now());
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);
  return now;
}

/**
 * Every session, oldest first. Even a year of heavy use is only several thousand small records,
 * which is fine to keep in memory. (If it ever gets slow, this is the place to load less.)
 */
export function useSessions(): Session[] | undefined {
  return useLiveQuery(() => db.sessions.orderBy('start').toArray());
}

export function useReviews(): DayReview[] | undefined {
  return useLiveQuery(() => db.reviews.toArray());
}

export function useRoutines(): Routine[] | undefined {
  return useLiveQuery(async () => (await db.routines.toArray()).sort((a, b) => a.createdAt - b.createdAt));
}

export function useGoals(): Goal[] | undefined {
  return useLiveQuery(() => db.goals.toArray());
}

/** Settings, filled in with defaults for anything not set yet. */
export function useSettings(): Settings | undefined {
  const row = useLiveQuery(async () => (await db.settings.get('#main')) ?? null);
  return useMemo(() => (row === undefined ? undefined : { ...DEFAULT_SETTINGS, ...(row ?? {}) }), [row]);
}

export const UNCATEGORIZED_COLOR = '#8f877b';
export const SLEEP_COLOR = '#5b6bb0';
export const NAP_COLOR = '#8c97cc';

export interface Library {
  categories: Category[];
  activities: Activity[];
  activityById: Map<string, Activity>;
  categoryById: Map<string, Category>;
  label: (a: Activity | undefined) => string;
  color: (a: Activity | undefined) => string;
  /** Text color that reads on top of `color`. */
  ink: (a: Activity | undefined) => string;
  emoji: (a: Activity | undefined) => string;
  sessionLabel: (s: Session) => string;
  sessionColor: (s: Session) => string;
  sessionEmoji: (s: Session) => string;
}

/** All categories and activities, plus helpers to label and color them. */
export function useLibrary(): Library | undefined {
  const categories = useLiveQuery(() => db.categories.orderBy('order').toArray());
  const activities = useLiveQuery(() => db.activities.toArray());

  return useMemo(() => {
    if (!categories || !activities) return undefined;
    const activityById = new Map(activities.map((a) => [a.id, a]));
    const categoryById = new Map(categories.map((c) => [c.id, c]));

    const label = (a: Activity | undefined) => {
      if (!a) return 'Deleted activity';
      const parent = a.parentId ? activityById.get(a.parentId) : undefined;
      return parent ? `${parent.name} › ${a.name}` : a.name;
    };
    const color = (a: Activity | undefined) => {
      const cat = a?.categoryId ? categoryById.get(a.categoryId) : undefined;
      return cat ? colorVar(cat.color) : UNCATEGORIZED_COLOR;
    };
    const ink = (a: Activity | undefined) => {
      const cat = a?.categoryId ? categoryById.get(a.categoryId) : undefined;
      return cat ? inkVar(cat.color) : '#ffffff';
    };
    const emoji = (a: Activity | undefined) => {
      if (!a) return '';
      const parent = a.parentId ? activityById.get(a.parentId) : undefined;
      return a.emoji || parent?.emoji || (a.categoryId ? categoryById.get(a.categoryId)?.emoji : undefined) || '';
    };
    const sessionLabel = (s: Session) =>
      s.kind === 'sleep' ? (s.sleepType === 'nap' ? 'Nap' : 'Sleep') : label(activityById.get(s.activityId ?? ''));
    const sessionColor = (s: Session) =>
      s.kind === 'sleep' ? (s.sleepType === 'nap' ? NAP_COLOR : SLEEP_COLOR) : color(activityById.get(s.activityId ?? ''));
    const sessionEmoji = (s: Session) =>
      s.kind === 'sleep' ? (s.sleepType === 'nap' ? '💤' : '🌙') : emoji(activityById.get(s.activityId ?? ''));

    return { categories, activities, activityById, categoryById, label, color, ink, emoji, sessionLabel, sessionColor, sessionEmoji };
  }, [categories, activities]);
}
