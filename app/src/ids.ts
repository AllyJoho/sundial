// Fixed ids (starter categories/activities, the settings row) start with "#".
// With sync, a "#" id is private to each person: your phone and computer both create "#cat-school"
// and they become the same category (no duplicates), and it can never clash with anyone else's.
// Older Sundial data used ids without the "#"; this renames them everywhere they're referenced.
import type { Activity, Category, DayReview, Goal, Routine, Session, Settings } from './types';

/** Old fixed id → new fixed id. */
export const FIXED_ID_RENAMES: Record<string, string> = Object.fromEntries(
  [
    'cat-school',
    'cat-life',
    'cat-leisure',
    'cat-screens',
    'act-class',
    'act-homework',
    'act-eating',
    'act-getting-ready',
    'act-gaming',
    'act-scrolling',
    'act-downtime',
    'main',
  ].map((id) => [id, `#${id}`]),
);

const r = (id: string | null | undefined) => (id && FIXED_ID_RENAMES[id]) || id;

export interface DataBundle {
  categories: Category[];
  activities: Activity[];
  sessions: Session[];
  reviews: DayReview[];
  goals: Goal[];
  settings: Settings[];
  routines: Routine[];
}

/** Returns a copy of the data with every old fixed id (and every reference to one) renamed. */
export function renameFixedIds<T extends DataBundle>(d: T): T {
  return {
    ...d,
    categories: d.categories.map((c) => ({ ...c, id: r(c.id)! })),
    activities: d.activities.map((a) => ({ ...a, id: r(a.id)!, categoryId: r(a.categoryId) ?? null, parentId: r(a.parentId) ?? null })),
    sessions: d.sessions.map((s) => ({ ...s, activityId: r(s.activityId) ?? null })),
    reviews: d.reviews,
    goals: d.goals.map((g) => ({ ...g, target: { ...g.target, id: r(g.target.id)! } })),
    settings: d.settings.map((s) => ({ ...s, id: '#main' as const })),
    routines: d.routines.map((x) => ({ ...x, activityIds: x.activityIds.map((id) => r(id)!) })),
  };
}

/** True if any old-style fixed id is still present. */
export function hasOldFixedIds(d: Pick<DataBundle, 'categories' | 'activities' | 'settings'>): boolean {
  return [...d.categories, ...d.activities, ...d.settings].some((x) => x.id in FIXED_ID_RENAMES);
}
