// Today's timeline: every block of time since you woke up, with untracked gaps. Tap anything to edit it.
import { useMemo, useState } from 'react';
import { SessionEditor, type SessionDraft } from '../components/SessionEditor';
import { buildTimeline, type DayState } from '../day';
import { formatDuration, formatTime } from '../format';
import { useNow, type Library } from '../hooks';
import type { Session } from '../types';

export function TodayScreen({ lib, sessions, day }: { lib: Library; sessions: Session[]; day: DayState }) {
  useNow(30_000); // re-draw every 30s so running blocks grow
  const now = Date.now(); // always the real current time, so brand-new entries show up right away
  const [editing, setEditing] = useState<{ session?: Session; draft?: SessionDraft } | null>(null);

  // Which stretch of time counts as "today".
  const { windowStart, title, subtitle } = useMemo(() => {
    if (day.status === 'awake') return { windowStart: day.start, title: 'Today', subtitle: `Since you woke up at ${formatTime(day.start)}` };
    if (day.status === 'asleep' && day.dayStart !== null)
      return { windowStart: day.dayStart, title: 'Your last day', subtitle: `From ${formatTime(day.dayStart)} until now` };
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    return {
      windowStart: midnight.getTime(),
      title: 'Today',
      subtitle: 'Since midnight. Once you log a wake-up, days will start when you wake.',
    };
  }, [day, now]);

  const items = useMemo(() => buildTimeline(sessions, windowStart, now), [sessions, windowStart, now]);

  // Totals per activity, for the summary at the top.
  const totals = useMemo(() => {
    const map = new Map<string, { label: string; emoji: string; color: string; ms: number }>();
    let untracked = 0;
    for (const it of items) {
      if (it.type === 'gap') {
        untracked += it.end - it.start;
        continue;
      }
      const s = it.session;
      const key = s.kind === 'sleep' ? `sleep:${s.sleepType}` : `act:${s.activityId}`;
      const prev = map.get(key) ?? { label: lib.sessionLabel(s), emoji: lib.sessionEmoji(s), color: lib.sessionColor(s), ms: 0 };
      prev.ms += it.end - it.start;
      map.set(key, prev);
    }
    return { list: [...map.values()].sort((a, b) => b.ms - a.ms), untracked };
  }, [items, lib]);
  const total = now - windowStart;

  return (
    <div className="screen">
      <header className="day-header">
        <div className="day-title">{title}</div>
        <div className="muted">{subtitle}</div>
      </header>

      {total > 0 && (
        <section className="card">
          <div className="summary-bar" aria-hidden>
            {totals.list.map((t) => (
              <span key={t.label} style={{ flexGrow: t.ms, background: t.color }} />
            ))}
            {totals.untracked > 0 && <span className="untracked-fill" style={{ flexGrow: totals.untracked }} />}
          </div>
          <ul className="totals">
            {totals.list.map((t) => (
              <li key={t.label}>
                <span className="dot" style={{ background: t.color }} />
                <span className="grow">
                  {t.emoji} {t.label}
                </span>
                <span>{formatDuration(t.ms)}</span>
              </li>
            ))}
            {totals.untracked > 0 && (
              <li className="muted">
                <span className="dot untracked-fill" />
                <span className="grow">Untracked</span>
                <span>{formatDuration(totals.untracked)}</span>
              </li>
            )}
          </ul>
        </section>
      )}

      <h3 className="section-title">Timeline</h3>
      <ol className="timeline">
        {items.map((it) =>
          it.type === 'gap' ? (
            <li key={`gap-${it.start}`}>
              <button className="tl-gap" onClick={() => setEditing({ draft: { start: it.start, end: it.end } })}>
                <span className="tl-time">{formatTime(it.start)}</span>
                <span className="grow">Untracked · {formatDuration(it.end - it.start)}</span>
                <span className="tl-add">+ Fill in</span>
              </button>
            </li>
          ) : (
            <li key={it.session.id}>
              <button
                className="tl-block"
                style={{ ['--tile-color' as string]: lib.sessionColor(it.session) }}
                onClick={() => setEditing({ session: it.session })}
              >
                <span className="tl-time">{formatTime(it.start)}</span>
                <span className="grow">
                  <span className="tl-label">
                    {lib.sessionEmoji(it.session)} {lib.sessionLabel(it.session)}
                  </span>
                  <span className="muted small">
                    {it.running ? 'still going' : `until ${formatTime(it.end)}`} · {formatDuration(it.end - it.start)}
                    {it.session.note ? ` · ${it.session.note}` : ''}
                  </span>
                </span>
                <span className="tl-edit">Edit</span>
              </button>
            </li>
          ),
        )}
        {items.length === 0 && <li className="muted">Nothing here yet.</li>}
      </ol>

      <button className="btn" onClick={() => setEditing({ draft: { start: Math.max(windowStart, now - 30 * 60_000), end: now } })}>
        + Add time
      </button>

      {editing && <SessionEditor lib={lib} session={editing.session} draft={editing.draft} onClose={() => setEditing(null)} />}
    </div>
  );
}
