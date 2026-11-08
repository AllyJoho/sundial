// Choose an activity anywhere in the app, the same way as the home screen's "What are you doing?" box:
// tap one of your usual ones, or type to find (or add) anything. Replaces the browser's dropdown, which
// took over the screen on phones. Opens inline, so nothing pops up or scrolls strangely.
//
// Values look like "act:<id>", "sleep:main", "sleep:nap", or (with includeCategories) "cat:<id>".
import { useMemo, useState } from 'react';
import { createActivity } from '../actions';
import { DOWNTIME_ID } from '../db';
import type { Library } from '../hooks';
import type { Activity, Session } from '../types';
import { exactMatch, searchActivities, usageStats, usualActivities } from '../usual';

interface Option {
  value: string;
  label: string;
}

export function ActivityField({
  lib,
  sessions,
  value,
  onChange,
  includeSleep = false,
  includeCategories = false,
  allowCreate = true,
  label = 'What was it?',
}: {
  lib: Library;
  sessions: Session[];
  value: string;
  onChange: (value: string) => void;
  /** Offer 💤 Nap ('nap'), or both 💤 Nap and 🌙 Sleep ('all'). */
  includeSleep?: false | 'nap' | 'all';
  /** Offer whole categories too (for goals). */
  includeCategories?: boolean;
  /** Typing a new name can add it as a new (uncategorized) activity. */
  allowCreate?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(!value);
  const [query, setQuery] = useState('');
  const stats = useMemo(() => usageStats(sessions, Date.now()), [sessions]);

  const describe = (v: string): string => {
    if (v === 'sleep:nap') return '💤 Nap';
    if (v === 'sleep:main') return '🌙 Sleep';
    if (v.startsWith('cat:')) {
      const c = lib.categoryById.get(v.slice(4));
      return c ? `${c.emoji ?? ''} ${c.name} (whole category)`.trim() : 'Removed category';
    }
    const a = lib.activityById.get(v.slice(4));
    return a ? `${lib.emoji(a)} ${lib.label(a)}`.trim() : 'Removed activity';
  };
  const actOption = (a: Activity): Option => ({ value: `act:${a.id}`, label: `${lib.emoji(a)} ${lib.label(a)}`.trim() });

  // Quick picks shown before you type.
  const quick: Option[] = useMemo(() => {
    const out: Option[] = [];
    if (includeCategories)
      for (const c of lib.categories.filter((c) => !c.archived))
        out.push({ value: `cat:${c.id}`, label: `${c.emoji ?? ''} ${c.name} (all)`.trim() });
    if (includeSleep) out.push({ value: 'sleep:nap', label: '💤 Nap' });
    const downtime = lib.activityById.get(DOWNTIME_ID);
    if (downtime && !downtime.archived) out.push(actOption(downtime));
    for (const a of usualActivities(lib.activities, stats, 6)) if (a.id !== DOWNTIME_ID) out.push(actOption(a));
    if (includeSleep === 'all') out.push({ value: 'sleep:main', label: '🌙 Sleep' });
    return out;
  }, [lib, stats, includeSleep, includeCategories]);

  // Matches while typing.
  const trimmed = query.trim();
  const matches: Option[] = useMemo(() => {
    if (!trimmed) return [];
    const q = trimmed.toLowerCase();
    const cats: Option[] = includeCategories
      ? lib.categories
          .filter((c) => !c.archived && c.name.toLowerCase().includes(q))
          .map((c) => ({ value: `cat:${c.id}`, label: `${c.emoji ?? ''} ${c.name} (whole category)`.trim() }))
      : [];
    const sleep: Option[] = includeSleep
      ? [
          { value: 'sleep:nap', label: '💤 Nap' },
          ...(includeSleep === 'all' ? [{ value: 'sleep:main', label: '🌙 Sleep' }] : []),
        ].filter((o) => o.label.toLowerCase().includes(q))
      : [];
    const acts = searchActivities(lib.activities, lib.label, stats, trimmed, 6).map(actOption);
    return [...sleep, ...cats, ...acts].slice(0, 7);
  }, [trimmed, lib, stats, includeSleep, includeCategories]);
  const exact = exactMatch(lib.activities, trimmed);

  function choose(v: string) {
    onChange(v);
    setQuery('');
    setOpen(false);
  }

  async function addNew() {
    if (!trimmed) return;
    const id = exact?.id ?? (await createActivity({ name: trimmed, categoryId: null, parentId: null }));
    choose(`act:${id}`);
  }

  if (!open && value) {
    return (
      <div className="field">
        <span>{label}</span>
        <button type="button" className="picked" onClick={() => setOpen(true)}>
          <span className="grow">{describe(value)}</span>
          <span className="picked-change">Change</span>
        </button>
      </div>
    );
  }

  return (
    <div className="field activity-field">
      <span>{label}</span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (matches[0] && (exact || !allowCreate)) choose(matches[0].value);
            else if (allowCreate) addNew();
          }
        }}
        placeholder={allowCreate ? 'Type to find or add…' : 'Type to find…'}
        enterKeyHint="done"
        autoComplete="off"
        aria-label={label}
      />
      {!trimmed ? (
        <div className="chips">
          {quick.map((o) => (
            <button type="button" key={o.value} className={`chip ${o.value === value ? 'on' : ''}`} onClick={() => choose(o.value)}>
              {o.label}
            </button>
          ))}
          {value && (
            <button type="button" className="chip on-outline" onClick={() => setOpen(false)}>
              Keep {describe(value)}
            </button>
          )}
        </div>
      ) : (
        <ul className="suggestions">
          {matches.map((o) => (
            <li key={o.value}>
              <button type="button" className="suggestion" onClick={() => choose(o.value)}>
                <span className="grow">{o.label}</span>
              </button>
            </li>
          ))}
          {allowCreate && !exact && (
            <li>
              <button type="button" className="suggestion new" onClick={addNew}>
                <span className="grow">+ Add “{trimmed}”</span>
                <span className="muted small">new · sort it later</span>
              </button>
            </li>
          )}
          {matches.length === 0 && !allowCreate && <li className="muted small suggestion">No matches.</li>}
        </ul>
      )}
    </div>
  );
}
