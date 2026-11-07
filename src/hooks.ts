// "Hooks" are reusable pieces of React logic. These ones read live data from the database:
// whenever the data changes, any screen using them re-draws automatically.
import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import type { Activity, Category, Session } from './types';

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

const RECENT_WINDOW_MS = 45 * 24 * 3600_000;

/** Sessions from roughly the last 45 days (enough for today's day + recents), plus anything still running. */
export function useRecentSessions(): Session[] | undefined {
  return useLiveQuery(async () => {
    const since = Date.now() - RECENT_WINDOW_MS;
    const recent = await db.sessions.where('start').above(since).toArray();
    const running = await db.sessions.filter((s) => s.end === null && s.start <= since).toArray();
    return [...running, ...recent];
  });
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
      return cat?.color ?? UNCATEGORIZED_COLOR;
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

    return { categories, activities, activityById, categoryById, label, color, emoji, sessionLabel, sessionColor, sessionEmoji };
  }, [categories, activities]);
}
