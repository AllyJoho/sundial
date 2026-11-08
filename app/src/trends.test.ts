// Automated checks for week/month reviews. Run with: npm test
import { describe, expect, it } from 'vitest';
import { listDays } from './days';
import { bucketByDate, calendarDay, getPeriod, goalHitRate, minutesFromDate, nightsInPeriod, sleepRows, totalsByCategory } from './trends';
import type { Activity, Goal, Session } from './types';

const H = 3600_000;
const at = (month: number, date: number, hour: number) => new Date(2026, month, date, hour).getTime();
const sleep = (start: number, end: number): Session => ({ id: `s${start}`, kind: 'sleep', activityId: null, sleepType: 'main', start, end, source: 'live' });
const act = (activityId: string, start: number, end: number): Session => ({ id: `a${start}`, kind: 'activity', activityId, start, end, source: 'live' });
const activities: Activity[] = [
  { id: 'hw', name: 'Homework', categoryId: 'school', parentId: null, favorite: false, archived: false, createdAt: 0 },
  { id: 'misc', name: 'Misc', categoryId: null, parentId: null, favorite: false, archived: false, createdAt: 0 },
];

describe('periods', () => {
  it('a week runs Monday to Sunday', () => {
    const p = getPeriod('week', at(10, 6, 12)); // Fri Nov 6 2026
    expect(new Date(p.start).getDate()).toBe(2);
    expect(p.dates).toHaveLength(7);
  });

  it('a week across the daylight-saving change still has 7 dates', () => {
    expect(getPeriod('week', at(10, 1, 12)).dates).toHaveLength(7); // week containing Sun Nov 1 2026
  });

  it('months have the right number of dates, and you can go back', () => {
    expect(getPeriod('month', at(1, 10, 12)).dates).toHaveLength(28); // Feb 2026
    expect(new Date(getPeriod('month', at(0, 10, 12), -1).start).getMonth()).toBe(11); // back to December
  });
});

describe('bucketing', () => {
  // Woke Tue 9am, homework 2h, misc 1h; slept 11pm. Woke Wed 4pm (nocturnal), homework until 2am Thu.
  const sessions = [
    sleep(at(10, 3, 1), at(10, 3, 9)),
    act('hw', at(10, 3, 10), at(10, 3, 12)),
    act('misc', at(10, 3, 13), at(10, 3, 14)),
    sleep(at(10, 3, 23), at(10, 4, 16)),
    act('hw', at(10, 4, 22), at(10, 5, 2)),
    sleep(at(10, 5, 6), at(10, 5, 14)),
  ];
  const days = listDays(sessions, []);
  const week = getPeriod('week', at(10, 4, 12));
  const buckets = bucketByDate(week, days, sessions, activities, at(10, 5, 15));

  it('counts a day on the date you woke up, even past midnight', () => {
    const wed = buckets.find((b) => b.date === new Date(2026, 10, 4).getTime())!;
    expect(wed.byCategory.get('school')).toBe(4 * H);
    expect(buckets.find((b) => b.date === new Date(2026, 10, 5).getTime())!.byCategory.size).toBe(0);
  });

  it('puts uncategorized time under "none" and totals it up', () => {
    expect(totalsByCategory(buckets)).toEqual(new Map([['school', 6 * H], ['none', 1 * H]]));
  });

  it('counts naps as their own row, without ending the day', () => {
    const withNap = [...sessions, { id: 'nap1', kind: 'sleep' as const, activityId: null, sleepType: 'nap' as const, start: at(10, 3, 15), end: at(10, 3, 16), source: 'manual' as const }];
    const b = bucketByDate(week, listDays(withNap, []), withNap, activities, at(10, 5, 15));
    expect(totalsByCategory(b).get('nap')).toBe(1 * H);
  });

  it('finds nights by wake date', () => {
    expect(nightsInPeriod(week, sessions, days, at(10, 5, 15)).size).toBe(3);
  });

  it('counts how many days met a goal', () => {
    const goal: Goal = { id: 'g', target: { type: 'activity', id: 'hw' }, kind: 'min', minutes: 180, period: 'day', createdAt: 0, archived: false };
    expect(goalHitRate(goal, week, days, sessions, activities, at(10, 5, 15))).toEqual({ met: 1, total: 2 });
  });
});

describe('sleep rows', () => {
  const sessions: Session[] = [
    sleep(at(10, 2, 23), at(10, 3, 7)), // night before Tue, woke Tue 7am
    { id: 'n1', kind: 'sleep', activityId: null, sleepType: 'nap', start: at(10, 3, 15), end: at(10, 3, 16), source: 'manual' },
    sleep(at(10, 4, 2), at(10, 4, 10)), // went to bed 2am Wed, woke 10am Wed
    { id: 'n2', kind: 'sleep', activityId: null, sleepType: 'nap', start: at(10, 5, 1), end: at(10, 5, 2), source: 'manual' }, // 1am nap, still Wed's day
  ];
  const days = listDays(sessions, []);
  const rows = sleepRows(getPeriod('week', at(10, 4, 12)), sessions, days, at(10, 5, 12));
  const row = (date: number) => rows.find((r) => r.date === new Date(2026, 10, date).getTime())!;

  it('puts each night on the date you woke up, with that day\'s naps', () => {
    expect(row(3).mains).toHaveLength(1);
    expect(row(3).naps).toHaveLength(1);
  });

  it('keeps a late-night nap with the day it happened in', () => {
    expect(row(4).naps).toHaveLength(1);
    expect(row(5).naps).toHaveLength(0);
  });

  it('measures times from the row\'s midnight, negative for the evening before', () => {
    expect(minutesFromDate(new Date(2026, 10, 3).getTime(), at(10, 2, 23))).toBe(-60);
    expect(minutesFromDate(new Date(2026, 10, 3).getTime(), at(10, 3, 15))).toBe(900);
  });
});

describe('calendar days', () => {
  const nap: Session = { id: 'nap', kind: 'sleep', activityId: null, sleepType: 'nap', start: at(10, 3, 15), end: at(10, 3, 16), source: 'manual' };
  const sessions = [
    sleep(at(10, 2, 23), at(10, 3, 7)),
    act('hw', at(10, 3, 9), at(10, 3, 12)),
    act('misc', at(10, 3, 10), at(10, 3, 11)), // at the same time as homework
    nap,
  ];
  const day = calendarDay(new Date(2026, 10, 3).getTime(), sessions, activities, at(10, 4, 12));

  it('cuts a night at midnight and marks the wake-up', () => {
    expect(day.totals.get('sleep')).toBe(7 * H);
    expect(day.wakes).toEqual([at(10, 3, 7)]);
  });

  it('draws multitasking beside the earlier block, and counts it once for untracked', () => {
    expect(day.blocks.find((b) => b.session.activityId === 'misc')!.overlap).toBe(true);
    expect(day.totals.get('nap')).toBe(1 * H);
    expect(day.untracked).toBe(24 * H - 7 * H - 3 * H - 1 * H);
  });

  it('only counts untracked time up to now on today', () => {
    expect(calendarDay(new Date(2026, 10, 3).getTime(), [], activities, at(10, 3, 6)).untracked).toBe(6 * H);
  });
});
