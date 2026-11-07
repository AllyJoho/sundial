// Automated checks for renaming old fixed ids. Run with: npm test
import { describe, expect, it } from 'vitest';
import { hasOldFixedIds, renameFixedIds } from './ids';
import { DEFAULT_SETTINGS, type Activity, type Category } from './types';

const cat = (id: string): Category => ({ id, name: id, color: '#000', order: 0, archived: false });
const act = (id: string, categoryId: string | null, parentId: string | null = null): Activity => ({
  id, name: id, categoryId, parentId, favorite: false, archived: false, createdAt: 0,
});

describe('renameFixedIds', () => {
  const old = {
    categories: [cat('cat-school'), cat('my-own-cat')],
    activities: [act('act-homework', 'cat-school'), act('cs235', 'cat-school', 'act-homework'), act('act-downtime', null)],
    sessions: [{ id: 's1', kind: 'activity' as const, activityId: 'act-homework', start: 0, end: 1, source: 'live' as const }],
    reviews: [{ id: 'r1', sleepId: 's9', closedAt: 0 }],
    goals: [{ id: 'g1', target: { type: 'category' as const, id: 'cat-school' }, kind: 'min' as const, minutes: 60, period: 'day' as const, createdAt: 0, archived: false }],
    settings: [{ ...DEFAULT_SETTINGS, id: 'main' as unknown as '#main' }],
    routines: [{ id: 'rt', name: 'Morning', activityIds: ['act-homework', 'cs235'], createdAt: 0 }],
  };
  const renamed = renameFixedIds(old);

  it('renames fixed ids and every reference to them', () => {
    expect(renamed.categories.map((c) => c.id)).toEqual(['#cat-school', 'my-own-cat']);
    expect(renamed.activities.map((a) => [a.id, a.categoryId, a.parentId])).toEqual([
      ['#act-homework', '#cat-school', null],
      ['cs235', '#cat-school', '#act-homework'],
      ['#act-downtime', null, null],
    ]);
    expect(renamed.sessions[0].activityId).toBe('#act-homework');
    expect(renamed.goals[0].target.id).toBe('#cat-school');
    expect(renamed.settings[0].id).toBe('#main');
    expect(renamed.routines[0].activityIds).toEqual(['#act-homework', 'cs235']);
  });

  it('is safe to run twice', () => {
    expect(renameFixedIds(renamed)).toEqual(renamed);
    expect(hasOldFixedIds(old)).toBe(true);
    expect(hasOldFixedIds(renamed)).toBe(false);
  });
});
