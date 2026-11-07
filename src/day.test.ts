// Automated checks for the day logic. Run with: npm test
import { describe, expect, it } from 'vitest';
import { buildTimeline, getDayState } from './day';
import type { Session } from './types';

const H = 3600_000;
const sleep = (start: number, end: number | null, sleepType: 'main' | 'nap' = 'main'): Session => ({
  id: `s${start}`, kind: 'sleep', activityId: null, sleepType, start, end, source: 'live',
});
const act = (start: number, end: number | null): Session => ({
  id: `a${start}`, kind: 'activity', activityId: 'x', start, end, source: 'live',
});

describe('getDayState', () => {
  it('has no day before any main sleep is logged', () => {
    expect(getDayState([act(0, H)])).toEqual({ status: 'no-day' });
  });

  it('starts the day when you wake from main sleep', () => {
    expect(getDayState([sleep(0, 8 * H)])).toEqual({ status: 'awake', start: 8 * H });
  });

  it('naps do not start a new day', () => {
    const s = [sleep(0, 8 * H), sleep(14 * H, 15 * H, 'nap')];
    expect(getDayState(s)).toEqual({ status: 'awake', start: 8 * H });
  });

  it('nocturnal schedule: waking at 4pm starts the day at 4pm', () => {
    expect(getDayState([sleep(8 * H, 16 * H)])).toEqual({ status: 'awake', start: 16 * H });
  });

  it('all-nighter: the day keeps going until the next main sleep', () => {
    expect(getDayState([sleep(0, 8 * H)])).toEqual({ status: 'awake', start: 8 * H });
  });

  it('while in main sleep, reports the day that is closing', () => {
    const s = [sleep(0, 8 * H), sleep(24 * H, null)];
    expect(getDayState(s)).toEqual({ status: 'asleep', sleepStart: 24 * H, dayStart: 8 * H });
  });
});

describe('buildTimeline', () => {
  it('shows untracked gaps between sessions', () => {
    const items = buildTimeline([act(1 * H, 2 * H), act(3 * H, 4 * H)], 0, 5 * H);
    expect(items.map((i) => i.type)).toEqual(['gap', 'session', 'gap', 'session', 'gap']);
  });

  it('clips sessions to the window and marks running ones', () => {
    const items = buildTimeline([act(-H, null)], 0, 2 * H);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ type: 'session', start: 0, end: 2 * H, running: true });
  });

  it('ignores tiny gaps from switching activities', () => {
    const items = buildTimeline([act(0, H), act(H + 30_000, 2 * H)], 0, 2 * H);
    expect(items.every((i) => i.type === 'session')).toBe(true);
  });
});
