// A dropdown for choosing what a block of time was: any activity, or sleep/nap.
import type { Library } from '../hooks';
import type { Activity } from '../types';

/** Values look like "act:<id>", "sleep:main", or "sleep:nap". */
export function ActivitySelect({
  lib,
  value,
  onChange,
  includeSleep = true,
}: {
  lib: Library;
  value: string;
  onChange: (v: string) => void;
  includeSleep?: boolean;
}) {
  const groups = activityGroups(lib, value.startsWith('act:') ? value.slice(4) : undefined);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        Choose…
      </option>
      {includeSleep && (
        <optgroup label="Sleep">
          <option value="sleep:main">🌙 Sleep</option>
          <option value="sleep:nap">💤 Nap</option>
        </optgroup>
      )}
      {groups.map((g) => (
        <optgroup key={g.key} label={g.name}>
          {g.activities.map((a) => (
            <option key={a.id} value={`act:${a.id}`}>
              {lib.emoji(a)} {lib.label(a)}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

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
