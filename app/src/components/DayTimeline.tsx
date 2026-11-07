// A day's summary bar, totals, and timeline. Used by the Days tab and the goodnight review.
import { useMemo } from 'react';
import { buildTimeline } from '../day';
import { formatDuration, formatTime } from '../format';
import type { Library } from '../hooks';
import type { Session } from '../types';

export function DayTimeline({
  lib,
  sessions,
  start,
  end,
  onEditSession,
  onFillGap,
}: {
  lib: Library;
  sessions: Session[];
  start: number;
  end: number;
  onEditSession?: (s: Session) => void;
  onFillGap?: (gap: { start: number; end: number }) => void;
}) {
  const items = useMemo(() => buildTimeline(sessions, start, end), [sessions, start, end]);

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

  return (
    <>
      {end > start && (
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

      <ol className="timeline">
        {items.map((it) =>
          it.type === 'gap' ? (
            <li key={`gap-${it.start}`}>
              <button className="tl-gap" onClick={() => onFillGap?.(it)} disabled={!onFillGap}>
                <span className="tl-time">{formatTime(it.start)}</span>
                <span className="grow">Untracked · {formatDuration(it.end - it.start)}</span>
                {onFillGap && <span className="tl-add">+ Fill in</span>}
              </button>
            </li>
          ) : (
            <li key={it.session.id}>
              <button
                className="tl-block"
                style={{ ['--tile-color' as string]: lib.sessionColor(it.session) }}
                onClick={() => onEditSession?.(it.session)}
                disabled={!onEditSession}
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
                {onEditSession && <span className="tl-edit">Edit</span>}
              </button>
            </li>
          ),
        )}
        {items.length === 0 && <li className="muted">Nothing here yet.</li>}
      </ol>
    </>
  );
}
