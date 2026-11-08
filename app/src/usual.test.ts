// Automated checks for "Your usual" tiles and "What are you doing?" suggestions. Run with: npm test
import { describe, expect, it } from 'vitest';
import type { Activity, Session } from './types';
import { exactMatch, searchActivities, usageStats, usualActivities } from './usual';

const DAY = 24 * 3600_000;
const now = 100 * DAY;
const act = (id: string, name: string, extra: Partial<Activity> = {}): Activity => ({
  id, name, categoryId: null, parentId: null, favorite: false, archived: false, createdAt: 0, ...extra,
});
let n = 0;
const use = (activityId: string, daysAgo: number): Session => ({
  id: `s${n++}`, kind: 'activity', activityId, start: now - daysAgo * DAY, end: now - daysAgo * DAY + 3600_000, source: 'live',
});

const activities = [
  act('#act-class', 'Class'),
  act('#act-scrolling', 'Scrolling'),
  act('test', 'Test'),
  act('cooking', 'Cooking'),
  act('pinned', 'Piano', { favorite: true }),
  act('old', 'Old thing', { archived: true }),
];

describe('Your usual', () => {
  it('puts pinned first, then most-used; one-offs and archived never show', () => {
    const sessions = [use('cooking', 1), use('cooking', 2), use('cooking', 3), use('test', 1), use('old', 1), use('old', 2)];
    const ids = usualActivities(activities, usageStats(sessions, now), 3).map((a) => a.id);
    expect(ids[0]).toBe('pinned');
    expect(ids[1]).toBe('cooking');
    expect(ids).not.toContain('test'); // used once: a one-off
    expect(ids).not.toContain('old');
  });

  it('fills with starter activities when there is not much history yet', () => {
    const ids = usualActivities(activities, usageStats([], now), 3).map((a) => a.id);
    expect(ids).toEqual(['pinned', '#act-scrolling', '#act-class']);
  });

  it('recent use outweighs old use', () => {
    const sessions = [use('cooking', 25), use('cooking', 26), use('cooking', 27), use('test', 1), use('test', 2)];
    const ids = usualActivities(activities.filter((a) => !a.favorite), usageStats(sessions, now), 1).map((a) => a.id);
    expect(ids).toEqual(['test']); // 2 uses this week (score 4) beat 3 uses weeks ago (score 3)
  });
});

describe('What are you doing? suggestions', () => {
  const label = (a: Activity) => a.name;
  it('matches the start of a name first, then anywhere', () => {
    const results = searchActivities(activities, label, usageStats([], now), 'te').map((a) => a.name);
    expect(results).toEqual(['Test']);
    expect(searchActivities(activities, label, usageStats([], now), 'ing').map((a) => a.name)).toEqual(
      expect.arrayContaining(['Scrolling', 'Cooking']),
    );
  });

  it('finds exact names so typing "test" starts the existing one', () => {
    expect(exactMatch(activities, '  TEST ')?.id).toBe('test');
    expect(exactMatch(activities, 'Old thing')).toBeUndefined(); // archived
  });
});
