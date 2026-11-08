// "What are you doing?" Type a few letters to find a past activity, or type something new to start it
// (it's saved as uncategorized, to sort later). Sun Check 2026-11-07.
import { useMemo, useRef, useState } from 'react';
import { quickAddAndStart, startActivity } from '../actions';
import { formatAgo } from '../format';
import type { Library } from '../hooks';
import type { Session } from '../types';
import { exactMatch, searchActivities, usageStats } from '../usual';

export function ActivitySearch({ lib, sessions, onStarted }: { lib: Library; sessions: Session[]; onStarted?: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const stats = useMemo(() => usageStats(sessions, Date.now()), [sessions]);
  const matches = useMemo(() => searchActivities(lib.activities, lib.label, stats, query, 5), [lib, stats, query]);
  const exact = exactMatch(lib.activities, query);
  const trimmed = query.trim();

  function done() {
    setQuery('');
    inputRef.current?.blur();
    onStarted?.();
  }

  return (
    <div className="activity-search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!trimmed) return;
          // Typing an exact name starts that activity; anything else starts something new.
          if (exact) startActivity(exact.id);
          else quickAddAndStart(trimmed);
          done();
        }}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you doing?"
          enterKeyHint="go"
          autoComplete="off"
          aria-label="What are you doing?"
        />
      </form>
      {trimmed && (
        <ul className="suggestions" role="listbox">
          {matches.map((a) => {
            const last = stats.lastUsed.get(a.id);
            return (
              <li key={a.id}>
                <button
                  className="suggestion"
                  onClick={() => {
                    startActivity(a.id);
                    done();
                  }}
                >
                  <span className="grow">
                    {lib.emoji(a)} {lib.label(a)}
                  </span>
                  <span className="muted small">{last ? formatAgo(Date.now() - last) : 'not used yet'}</span>
                </button>
              </li>
            );
          })}
          {!exact && (
            <li>
              <button
                className="suggestion new"
                onClick={() => {
                  quickAddAndStart(trimmed);
                  done();
                }}
              >
                <span className="grow">
                  + Start “{trimmed}”
                </span>
                <span className="muted small">new · sort it later</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
