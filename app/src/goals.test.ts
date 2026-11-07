// Automated checks for goals, sleep math, and backups. Run with: npm test
import { describe, expect, it } from 'vitest';
import { parseBackup, sessionsToCsv } from './backup';
import { listDays } from './days';
import {
  averageClockTime,
  clockDistance,
  dailyBaseline,
  daysInWakeWindow,
  goalProgress,
  sleepNights,
  targetWake,
  timeOn,
  targetActivityIds,
  weekStart,
} from './goals';
import { DEFAULT_SETTINGS, type Activity, type Goal, type Session } from './types';

const MIN = 60_000;
const H = 60 * MIN;
const D = 24 * H;
const act = (id: string, parentId: string | null = null, categoryId: string | null = 'school'): Activity => ({
  id, name: id, categoryId, parentId, favorite: false, archived: false, createdAt: 0,
});
const sess = (activityId: string, start: number, end: number | null): Session => ({
  id: `${activityId}${start}`, kind: 'activity', activityId, start, end, source: 'live',
});
const sleep = (start: number, end: number | null, sleepType: 'main' | 'nap' = 'main'): Session => ({
  id: `sl${start}`, kind: 'sleep', activityId: null, sleepType, start, end, source: 'live',
});
const goal = (g: Partial<Goal>): Goal => ({
  id: 'g', target: { type: 'activity', id: 'hw' }, kind: 'min', minutes: 120, period: 'day', createdAt: 0, archived: false, ...g,
});

const activities = [act('hw'), act('cs235', 'hw'), act('scroll', null, 'screens')];

describe('goal progress', () => {
  it('counts sub-activities toward their parent', () => {
    expect(targetActivityIds({ type: 'activity', id: 'hw' }, activities)).toEqual(new Set(['hw', 'cs235']));
  });

  it('counts a category', () => {
    expect(targetActivityIds({ type: 'category', id: 'school' }, activities)).toEqual(new Set(['hw', 'cs235']));
  });

  it('clips time to the window and counts running sessions up to now', () => {
    const s = [sess('hw', -H, H), sess('cs235', 2 * H, null)];
    expect(timeOn(new Set(['hw', 'cs235']), s, 0, 10 * H, 3 * H)).toBe(2 * H);
  });

  it('a minimum goal is met once you reach it', () => {
    const p = goalProgress(goal({}), activities, [sess('hw', 0, 2.5 * H)], 0, 10 * H, 10 * H);
    expect(p.met).toBe(true);
    expect(p.ratio).toBeCloseTo(1.25);
  });

  it('a limit goal reports how far over, neutrally', () => {
    const p = goalProgress(goal({ target: { type: 'activity', id: 'scroll' }, kind: 'limit', minutes: 60 }), activities, [sess('scroll', 0, 1.5 * H)], 0, 10 * H, 10 * H);
    expect(p.met).toBe(false);
    expect(p.overMs).toBe(30 * MIN);
  });

  it('weeks start on Monday', () => {
    const wed = new Date(2026, 10, 4, 15).getTime(); // Wed Nov 4 2026
    expect(new Date(weekStart(wed)).getDate()).toBe(2);
  });

  it('baseline is your recent daily average', () => {
    const s = [sleep(-8 * H, 0), sess('hw', 1 * H, 2 * H), sleep(16 * H, D), sess('hw', D + H, D + 4 * H), sleep(D + 16 * H, 2 * D), sleep(2 * D + 16 * H, 3 * D)];
    expect(dailyBaseline({ type: 'activity', id: 'hw' }, activities, s, listDays(s, []))).toBeCloseTo((4 * H) / 3);
  });
});

describe('sleep math', () => {
  it('averages times around midnight correctly', () => {
    expect(averageClockTime([23 * 60, 1 * 60])).toBe(0);
    expect(clockDistance(23 * 60 + 50, 10)).toBe(20);
  });

  it('stabilize mode targets your own usual wake time', () => {
    // Waking at 4 PM every day (nocturnal). Dates built from the calendar so daylight-saving changes don't matter.
    const wake = (i: number) => new Date(2026, 9, 28 + i, 16, 0).getTime();
    const s = [0, 1, 2, 3, 4].map((i) => sleep(wake(i) - 8 * H, wake(i)));
    const days = listDays(s, []);
    expect(targetWake({ ...DEFAULT_SETTINGS, sleepMode: 'stabilize' }, days, wake(4))).toBe(16 * 60);
    expect(daysInWakeWindow(days, 16 * 60, 60).inWindow).toBe(5);
  });

  it('shift mode moves the target earlier each week, stopping at the goal', () => {
    const settings = { ...DEFAULT_SETTINGS, sleepMode: 'shift' as const, shiftStartedAt: 0, shiftStartWake: 600, shiftGoalWake: 540, shiftMinutesPerWeek: 15 };
    expect(targetWake(settings, [], 0)).toBe(600);
    expect(targetWake(settings, [], 2 * 7 * D + 1)).toBe(570);
    expect(targetWake(settings, [], 10 * 7 * D)).toBe(540);
  });

  it('adds naps to the day they happen in', () => {
    const s = [sleep(-8 * H, 0), sleep(5 * H, 6 * H, 'nap'), sleep(16 * H, null)];
    const nights = sleepNights(s, listDays(s, []), 20 * H);
    expect(nights[0]).toMatchObject({ mainMs: 8 * H, napMs: H });
  });
});

describe('backup', () => {
  it('rejects files that are not Sundial backups', () => {
    expect(() => parseBackup('hello')).toThrow(/isn't a Sundial backup/);
    expect(() => parseBackup('{"app":"other"}')).toThrow(/isn't a Sundial backup/);
  });

  it('accepts a valid backup', () => {
    const b = { app: 'sundial', format: 1, exportedAt: 0, categories: [], activities: [], sessions: [sess('hw', 0, H)], reviews: [] };
    expect(parseBackup(JSON.stringify(b)).sessions).toHaveLength(1);
  });

  it('makes a CSV with quoted notes', () => {
    const csv = sessionsToCsv({ sessions: [{ ...sess('cs235', 0, 90 * MIN), note: 'hard, but "fine"' }], activities, categories: [] });
    expect(csv.split('\n')[1]).toContain(',90,cs235,hw,');
    expect(csv).toContain('"hard, but ""fine"""');
  });
});
