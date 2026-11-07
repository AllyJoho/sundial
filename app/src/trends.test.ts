// Automated checks for week/month reviews. Run with: npm test
import { describe, expect, it } from 'vitest';
import { listDays } from './days';
import { bucketByDate, getPeriod, goalHitRate, nightsInPeriod, totalsByCategory } from './trends';
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

  it('finds nights by wake date', () => {
    expect(nightsInPeriod(week, sessions, days, at(10, 5, 15)).size).toBe(3);
  });

  it('counts how many days met a goal', () => {
    const goal: Goal = { id: 'g', target: { type: 'activity', id: 'hw' }, kind: 'min', minutes: 180, period: 'day', createdAt: 0, archived: false };
    expect(goalHitRate(goal, week, days, sessions, activities, at(10, 5, 15))).toEqual({ met: 1, total: 2 });
  });
});
