// Automated checks for days, streaks, check-ins and overlaps. Run with: npm test
import { describe, expect, it } from 'vitest';
import { getDayState } from './day';
import { countsForStreak, detectCheckIn, getStreak, listDays, moreNeededMs, planInsert, RECOVERY_WINDOW_MS } from './days';
import { stillDoingCheck, typicalLength } from './nudges';
import type { DayReview, Session } from './types';

const H = 3600_000;
const D = 24 * H;
let n = 0;
const sleep = (start: number, end: number | null, sleepType: 'main' | 'nap' = 'main'): Session => ({
  id: `sleep${n++}`, kind: 'sleep', activityId: null, sleepType, start, end, source: 'live',
});
const act = (start: number, end: number | null): Session => ({
  id: `act${n++}`, kind: 'activity', activityId: 'x', start, end, source: 'live',
});
const review = (sleepId: string, closedAt: number): DayReview => ({ id: `r${n++}`, sleepId, closedAt });

/** A run of normal nights: sleep 23:00–07:00 for `count` nights, starting the night before day 0. */
function nights(count: number) {
  return Array.from({ length: count }, (_, i) => sleep(i * D - 1 * H, i * D + 7 * H));
}

/** Adds 14h of activity to each day between the given sleeps (days are 16h long, so they're well over half tracked). */
function withActivity(sleeps: Session[]) {
  return [...sleeps, ...sleeps.slice(0, -1).map((sl) => act(sl.end! + 1 * H, sl.end! + 15 * H))];
}

describe('listDays', () => {
  it('builds days between main sleeps, ignoring naps', () => {
    const s = [...nights(3), sleep(D + 14 * H, D + 15 * H, 'nap')];
    const days = listDays(s, []);
    expect(days).toHaveLength(3);
    expect(days[0]).toMatchObject({ start: 7 * H, end: D - 1 * H });
    expect(days[2]).toMatchObject({ start: 2 * D + 7 * H, end: null });
  });

  it('attaches the review to the day the sleep closed', () => {
    const s = nights(2);
    const days = listDays(s, [review(s[1].id, D)]);
    expect(days[0].review?.sleepId).toBe(s[1].id);
    expect(days[1].review).toBeUndefined();
  });
});

describe('getStreak', () => {
  it('counts closed days in a row', () => {
    const s = nights(4);
    const r = s.slice(1).map((x) => review(x.id, x.start));
    expect(getStreak(listDays(withActivity(s), r), 3 * D + 10 * H)).toMatchObject({ count: 3, recoverable: [] });
  });

  it('a missing review breaks the streak once the recovery window passes', () => {
    const s = nights(4);
    const r = [review(s[1].id, s[1].start), review(s[3].id, s[3].start)]; // the day closed by s[2] was never reviewed
    expect(getStreak(listDays(withActivity(s), r), 3 * D + 10 * H).count).toBe(2); // still inside the window: pending, not broken
    expect(getStreak(listDays(withActivity(s), r), 5 * D).count).toBe(1); // window passed: starts over
  });

  it('recent unclosed days are recoverable and do not break the streak yet', () => {
    const s = nights(4);
    const r = [review(s[1].id, s[1].start), review(s[2].id, s[2].start)];
    const streak = getStreak(listDays(withActivity(s), r), 3 * D + 10 * H);
    expect(streak.count).toBe(2);
    expect(streak.recoverable).toHaveLength(1);
  });

  it('a day closed after the recovery window does not count', () => {
    const s = nights(2);
    const days = listDays(withActivity(s), [review(s[1].id, s[1].start + RECOVERY_WINDOW_MS + H)]);
    expect(getStreak(days, 5 * D).count).toBe(0);
  });
});

describe('detectCheckIn', () => {
  it('asks "still asleep?" after a very long main sleep', () => {
    const s = [sleep(0, null)];
    expect(detectCheckIn(s, getDayState(s), 15 * H)?.type).toBe('long-sleep');
    expect(detectCheckIn(s, getDayState(s), 9 * H)).toBeNull();
  });

  it('suggests the longest untracked gap as a missed sleep', () => {
    // Woke 7:00, tracked 7–24, nothing 24:00–9:00 next day, tracked again since 9:00. Now 10:00 next day (27h awake).
    const s = [sleep(-8 * H, 7 * H), act(7 * H, 24 * H), act(33 * H, null)];
    const c = detectCheckIn(s, getDayState(s), 34 * H);
    expect(c).toMatchObject({ type: 'missed-sleep', suggestStart: 24 * H, suggestEnd: 33 * H });
  });

  it('does not bother you during a normal day', () => {
    const s = [sleep(-8 * H, 7 * H), act(7 * H, null)];
    expect(detectCheckIn(s, getDayState(s), 20 * H)).toBeNull();
  });

  it('asks after a long stretch with nothing tracked (forgot goodnight)', () => {
    const s = [sleep(-8 * H, 7 * H), act(7 * H, 17 * H)];
    expect(detectCheckIn(s, getDayState(s), 23 * H)?.type).toBe('missed-sleep');
  });
});

describe('planInsert', () => {
  it('trims, moves, splits, and removes around a new block', () => {
    const a = act(0, 3 * H); // overlaps start → trim
    const b = act(4 * H, 5 * H); // inside → remove
    const c = act(5.5 * H, 8 * H); // overlaps end → move start
    const d = act(10 * H, 20 * H); // surrounds second block
    const plan = planInsert([a, b, c], 2 * H, 6 * H, 30 * H);
    expect(plan.trimEnd).toEqual([{ session: a, end: 2 * H }]);
    expect(plan.remove).toEqual([b]);
    expect(plan.moveStart).toEqual([{ session: c, start: 6 * H }]);
    expect(planInsert([d], 12 * H, 13 * H, 30 * H).split).toHaveLength(1);
  });

  it('stops a running timer that spans the new block', () => {
    const r = act(0, null);
    expect(planInsert([r], 2 * H, 6 * H, 10 * H).trimEnd).toEqual([{ session: r, end: 2 * H }]);
  });
});

describe('tracked time and the half-day rule', () => {
  it('counts overlapping blocks once, and naps count as tracked', () => {
    const s = [...nights(2), act(8 * H, 10 * H), act(9 * H, 11 * H), sleep(12 * H, 13 * H, 'nap')];
    expect(listDays(s, [])[0].trackedMs).toBe(4 * H); // 8–11 covered (3h) + 1h nap
  });

  it('a closed day under half tracked does not count, but can still be filled in', () => {
    const s = [...nights(2), act(8 * H, 12 * H)]; // 4h of a 16h day
    const r = [review(s[1].id, s[1].start)];
    const day = listDays(s, r)[0];
    expect(countsForStreak(day)).toBe(false);
    expect(moreNeededMs(day, D)).toBe(4 * H + 60_000); // half is 8h, plus a minute to be "more than" half
    const streak = getStreak(listDays(s, r), D + 8 * H);
    expect(streak.count).toBe(0);
    expect(streak.recoverable).toHaveLength(1);
  });

  it('filling it in past half makes it count', () => {
    const s = [...nights(2), act(8 * H, 12 * H), act(12 * H, 17 * H)]; // 9h of 16h
    expect(countsForStreak(listDays(s, [review(s[1].id, s[1].start)])[0])).toBe(true);
  });
});

describe('streak freezes', () => {
  const closedNights = (count: number) => {
    const s = nights(count);
    return { s, r: s.slice(1).map((x) => review(x.id, x.start)) };
  };

  it('earns a freeze after 7 days in a row', () => {
    const { s, r } = closedNights(9); // 8 closed days
    expect(getStreak(listDays(withActivity(s), r), 9 * D).freezes).toBe(1);
  });

  it('a freeze covers a missed day instead of resetting the streak', () => {
    const { s, r } = closedNights(11);
    const missed = s[8].id; // leave one day unclosed, long ago
    const days = listDays(withActivity(s), r.filter((x) => x.sleepId !== missed));
    const streak = getStreak(days, 20 * D);
    expect(streak.count).toBe(9); // 10 closed days, minus the missed one, which didn't add
    expect(streak.freezes).toBe(0);
    expect(streak.frozen.size).toBe(1);
  });

  it('without a freeze, a missed day resets the streak', () => {
    const { s, r } = closedNights(5);
    const days = listDays(withActivity(s), r.filter((x) => x.sleepId !== s[2].id));
    expect(getStreak(days, 20 * D).count).toBe(2);
  });
});

describe('still doing X?', () => {
  const M = 60_000;
  const past = [0, 1, 2, 3].map((i) => ({ ...act(i * D, i * D + 40 * M), activityId: 'game' }));

  it('learns your usual length', () => {
    expect(typicalLength(past, 'game')).toBe(40 * M);
  });

  it('nudges only when it is much longer than usual', () => {
    const running = { ...act(10 * D, null), activityId: 'game' };
    expect(stillDoingCheck([...past, running], 10 * D + 80 * M)).toBeNull(); // 80m: not yet (needs 100m: usual + 1h)
    expect(stillDoingCheck([...past, running], 10 * D + 101 * M)?.typical).toBe(40 * M);
  });

  it('with no history, waits 4 hours', () => {
    const running = act(0, null);
    expect(stillDoingCheck([running], 3 * H)).toBeNull();
    expect(stillDoingCheck([running], 4 * H)).not.toBeNull();
  });
});
