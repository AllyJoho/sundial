// Activities grouped by category (used by the "All activities" list).
import type { Library } from '../hooks';
import type { Activity } from '../types';

/** Activities grouped by category, parents followed by their sub-activities. Archived ones are hidden. */
export function activityGroups(lib: Library, keepId?: string) {
  const visible = (a: Activity) => !a.archived || a.id === keepId;
  const ordered = (list: Activity[]) => {
    const tops = list.filter((a) => !a.parentId || !list.some((p) => p.id === a.parentId)).sort(byName);
    return tops.flatMap((t) => [t, ...list.filter((a) => a.parentId === t.id).sort(byName)]);
  };
  const groups = lib.categories
    .filter((c) => !c.archived)
    .map((c) => ({
      key: c.id,
      name: `${c.emoji ?? ''} ${c.name}`.trim(),
      activities: ordered(lib.activities.filter((a) => a.categoryId === c.id && visible(a))),
    }));
  const uncategorized = ordered(
    lib.activities.filter((a) => visible(a) && (!a.categoryId || !lib.categoryById.get(a.categoryId) || lib.categoryById.get(a.categoryId)!.archived)),
  );
  if (uncategorized.length) groups.unshift({ key: 'none', name: 'Uncategorized', activities: uncategorized });
  return groups.filter((g) => g.activities.length > 0);
}

const byName = (a: Activity, b: Activity) => a.name.localeCompare(b.name);
