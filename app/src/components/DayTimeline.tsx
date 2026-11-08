// A day's summary, its timeline, and the diary (timeline grouped into parts of the day).
// Used by the Today tab and the goodnight / close-out review.
import { useMemo, useState } from 'react';
import { buildTimeline, type TimelineItem } from '../day';
import { GAP_PROMPT_MS } from '../days';
import { formatDuration, formatTime } from '../format';
import type { Library } from '../hooks';
import type { Session } from '../types';

interface DayData {
  items: TimelineItem[];
  totals: {
    list: { label: string; emoji: string; color: string; ms: number }[];
    untracked: number;
    covered: number;
    multitasking: number;
  };
  /** Blocks that overlap an earlier one (multitasking), shown nested. */
  overlapping: Set<string>;
}

function useDayData(lib: Library, sessions: Session[], start: number, end: number): DayData {
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
    const sum = [...map.values()].reduce((t, x) => t + x.ms, 0);
    const covered = end - start - untracked;
    // Overlapping blocks count fully for each activity (Sun Check 2026-11-07), so the sum can exceed real time.
    return { list: [...map.values()].sort((a, b) => b.ms - a.ms), untracked, covered, multitasking: Math.max(0, sum - covered) };
  }, [items, lib, start, end]);
  const overlapping = useMemo(() => {
    const set = new Set<string>();
    let maxEnd = -Infinity;
    for (const it of items) {
      if (it.type !== 'session') continue;
      if (it.start < maxEnd - 60_000) set.add(it.session.id);
      maxEnd = Math.max(maxEnd, it.end);
    }
    return set;
  }, [items]);
  return { items, totals, overlapping };
}

interface ItemHandlers {
  onEditSession?: (s: Session) => void;
  onFillGap?: (gap: { start: number; end: number }) => void;
  /** Label gaps of an hour or more "What was this?" */
  askAboutGaps?: boolean;
}

/** The bar, "% tracked", and (optionally collapsed) totals per activity. */
function Summary({ data, start, end, collapsible }: { data: DayData; start: number; end: number; collapsible?: boolean }) {
  const [open, setOpen] = useState(!collapsible);
  const { totals } = data;
  if (end <= start) return null;
  return (
    <section className="card">
      <div className="summary-bar" aria-hidden>
        {totals.list.map((t) => (
          <span key={t.label} style={{ flexGrow: t.ms, background: t.color }} />
        ))}
        {totals.untracked > 0 && <span className="untracked-fill" style={{ flexGrow: totals.untracked }} />}
      </div>
      <div className="summary-line">
        <span className="small muted grow">
          {formatDuration(end - start)} awake · {formatDuration(totals.covered)} tracked ({Math.round((totals.covered / (end - start)) * 100)}%)
          {totals.multitasking >= 60_000 && <> · includes {formatDuration(totals.multitasking)} multitasking</>}
        </span>
        {collapsible && totals.list.length > 0 && (
          <button className="link-btn small" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? 'Less' : 'Details'}
          </button>
        )}
      </div>
      {open && (
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
      )}
    </section>
  );
}

function Item({ it, lib, data, onEditSession, onFillGap, askAboutGaps }: { it: TimelineItem; lib: Library; data: DayData } & ItemHandlers) {
  if (it.type === 'gap') {
    return (
      <li>
        <button className="tl-gap" onClick={() => onFillGap?.(it)} disabled={!onFillGap}>
          <span className="tl-time">{formatTime(it.start)}</span>
          <span className="grow">
            {askAboutGaps && it.end - it.start >= GAP_PROMPT_MS ? 'What was this?' : 'Untracked'} · {formatDuration(it.end - it.start)}
          </span>
          {onFillGap && <span className="tl-add">+ Fill in</span>}
        </button>
      </li>
    );
  }
  const nested = data.overlapping.has(it.session.id);
  return (
    <li>
      <button
        className={`tl-block ${nested ? 'tl-overlap' : ''}`}
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
            {nested && 'at the same time · '}
            {it.running ? 'still going' : `until ${formatTime(it.end)}`} · {formatDuration(it.end - it.start)}
            {it.session.note ? ` · ${it.session.note}` : ''}
          </span>
        </span>
        {onEditSession && <span className="tl-edit">Edit</span>}
      </button>
    </li>
  );
}

/** Summary + one continuous timeline. (Used in the goodnight / close-out review.) */
export function DayTimeline({ lib, sessions, start, end, ...handlers }: { lib: Library; sessions: Session[]; start: number; end: number } & ItemHandlers) {
  const data = useDayData(lib, sessions, start, end);
  return (
    <>
      <Summary data={data} start={start} end={end} />
      <ol className="timeline">
        {data.items.map((it) => (
          <Item key={it.type === 'gap' ? `gap-${it.start}` : it.session.id} it={it} lib={lib} data={data} {...handlers} />
        ))}
        {data.items.length === 0 && <li className="muted">Nothing here yet.</li>}
      </ol>
    </>
  );
}

/** Just the summary card (collapsible), for the top of the Today tab. */
export function DaySummary({ lib, sessions, start, end }: { lib: Library; sessions: Session[]; start: number; end: number }) {
  const data = useDayData(lib, sessions, start, end);
  return <Summary data={data} start={start} end={end} collapsible />;
}

/** The diary: the day's whole timeline as one list, with "+ Add". */
export function Diary({
  lib,
  sessions,
  start,
  end,
  onAdd,
  ...handlers
}: { lib: Library; sessions: Session[]; start: number; end: number; onAdd: (range: { start: number; end: number }) => void } & ItemHandlers) {
  const data = useDayData(lib, sessions, start, end);
  // "+ Add" starts where the last block ends (or 30 minutes ago), for 30 minutes.
  const lastEnd = data.items.reduce((m, it) => (it.type === 'session' ? Math.max(m, it.end) : m), start);
  const addStart = Math.max(start, Math.min(lastEnd, end - 30 * 60_000));
  return (
    <div className="diary">
      <div className="diary-head">
        <h3 className="diary-title">Diary</h3>
        <button className="link-btn" onClick={() => onAdd({ start: addStart, end: Math.min(addStart + 30 * 60_000, end) })}>
          + Add
        </button>
      </div>
      <ol className="timeline">
        {data.items.map((it) => (
          <Item key={it.type === 'gap' ? `gap-${it.start}` : it.session.id} it={it} lib={lib} data={data} {...handlers} />
        ))}
        {data.items.length === 0 && <li className="muted small diary-empty">Nothing yet.</li>}
      </ol>
    </div>
  );
}
