// Automated checks for copying data between devices. Run with: npm test
import { describe, expect, it } from 'vitest';
import { decodeTransfer, deviceName, encodeTransfer, mergeIncoming, type Backup } from './backup';
import type { Activity, Session } from './types';

const H = 3600_000;
const act = (id: string, activityId: string, start: number, end: number | null): Session => ({ id, kind: 'activity', activityId, start, end, source: 'live' });
const activity = (id: string, extra: Partial<Activity> = {}): Activity => ({
  id, name: id, categoryId: null, parentId: null, favorite: false, archived: false, createdAt: 0, ...extra,
});
const backup = (b: Partial<Backup>): Backup => ({
  app: 'sundial', format: 1, exportedAt: 0, categories: [], activities: [], sessions: [], reviews: [], goals: [], settings: [], routines: [], tasks: [], ...b,
});

describe('pasting a save from your other device', () => {
  const incoming = backup({
    activities: [activity('hw')],
    sessions: [act('a', 'hw', 0, 2 * H), act('b', 'hw', 4 * H, 6 * H)],
    tasks: [{ id: 't1', title: 'from computer', list: 'today', createdAt: 0 }],
  });

  it('the pasted save wins; only blocks that fill its untracked time are kept from this device', () => {
    const local = backup({
      categories: [{ id: 'cat', name: 'Fun', color: '#000', order: 0, archived: false }],
      activities: [activity('hw'), activity('walk', { categoryId: 'cat' }), activity('old')],
      sessions: [
        act('gap', 'walk', 2.5 * H, 3.5 * H), // fills untracked time → kept
        act('clash', 'old', 1 * H, 3 * H), // overlaps pasted time → dropped
        act('a', 'hw', 0, 1 * H), // same block edited differently → pasted version wins
      ],
      tasks: [{ id: 't2', title: 'phone-only task', list: 'today', createdAt: 0 }],
    });
    const { merged, rescued } = mergeIncoming(local, incoming, 10 * H);
    expect(rescued.map((s) => s.id)).toEqual(['gap']);
    expect(merged.sessions.map((s) => s.id).sort()).toEqual(['a', 'b', 'gap']);
    expect(merged.sessions.find((s) => s.id === 'a')!.end).toBe(2 * H);
    expect(merged.activities.map((a) => a.id).sort()).toEqual(['hw', 'walk']); // 'old' not needed
    expect(merged.categories.map((c) => c.id)).toEqual(['cat']); // needed by 'walk'
    expect(merged.tasks.map((t) => t.id)).toEqual(['t1']); // everything else: pasted save only
  });

  it('keeps only one live timer', () => {
    const withRunning = backup({ ...incoming, sessions: [...incoming.sessions, act('run1', 'hw', 8 * H, null)] });
    const local = backup({ sessions: [act('run2', 'hw', 7 * H, null)] });
    expect(mergeIncoming(local, withRunning, 9 * H).rescued).toEqual([]);
  });
});

describe('copy format', () => {
  it('round-trips a backup through compressed text', async () => {
    const b = backup({ from: 'Mac', sessions: Array.from({ length: 200 }, (_, i) => act(`s${i}`, 'hw', i * H, i * H + 30 * 60_000)) });
    const text = await encodeTransfer(b);
    expect(text.startsWith('SUNDIAL1:')).toBe(true);
    expect(text.length).toBeLessThan(JSON.stringify(b).length / 3); // compressed
    const back = await decodeTransfer(text);
    expect(back.sessions).toHaveLength(200);
    expect(back.from).toBe('Mac');
  });

  it('accepts plain backup JSON too, and explains bad pastes kindly', async () => {
    expect((await decodeTransfer(JSON.stringify(backup({})))).app).toBe('sundial');
    await expect(decodeTransfer('hello')).rejects.toThrow(/isn't Sundial data/);
    await expect(decodeTransfer('SUNDIAL1:abc')).rejects.toThrow(/cut off/);
  });

  it('names the device', () => {
    expect(deviceName('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe('iPhone');
    expect(deviceName('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)')).toBe('Mac');
  });
});

describe('messy pastes still work', () => {
  it('finds the data even with junk before it, line breaks, invisible characters, or a double paste', async () => {
    const text = await encodeTransfer(backup({ from: 'iPhone', sessions: [act('s1', 'hw', 0, 3600_000)] }));
    const body = text.slice('SUNDIAL1:'.length);
    const messy = [
      `old attempt ${text}`, // pasted after earlier text
      `​${text}`, // invisible zero-width space in front
      `SUNDIAL1:${body.slice(0, 40)}\n${body.slice(40)}`, // a line break in the middle
      `"${text}"`, // wrapped in quotes
      `${text}${text}`, // pasted twice
    ];
    for (const m of messy) expect((await decodeTransfer(m)).from).toBe('iPhone');
  });
});
