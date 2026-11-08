// The calendar on Trends: a week (or month) laid out like iPhone Calendar, so you can see at a glance
// how your time was spent and on what. One column per date, midnight at the top and bottom.
// Sleep, naps, and activities are drawn where they happened, in their category colors.
// Untracked time is simply left blank. An orange dot marks each wake-up: when a new day started.
// Tap (or hover with a mouse) a block or a day for the details underneath.
import { useMemo, useState } from 'react';
import { formatDuration, formatTime } from '../format';
import { UNCATEGORIZED_COLOR, type Library } from '../hooks';
import { colorVar } from '../palette';
import { calendarDay, minutesFromDate, NAP, UNCATEGORIZED, type CalendarDay, type Period } from '../trends';
import type { Session } from '../types';

const W = 340;
const AXIS_W = 40; // hour labels on the left
const PLOT_W = W - AXIS_W;

interface Key {
  key: string;
  label: string;
  color: string;
}

type Sel = { date: number; id?: string };

export function CalendarView({ lib, sessions, period, now }: { lib: Library; sessions: Session[]; period: Period; now: number }) {
  const week = period.kind === 'week';
  const days = useMemo(
    () => period.dates.map((date) => calendarDay(date, sessions, lib.activities, now)),
    [period.start, period.kind, sessions, lib.activities], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // hover = where the mouse is; pinned = what you tapped.
  const [hover, setHover] = useState<Sel | null>(null);
  const [pinned, setPinned] = useState<Sel | null>(null);

  const headH = week ? 34 : 18;
  const hourH = week ? 16 : 12;
  const height = headH + 24 * hourH + 2;
  const colW = PLOT_W / days.length;
  const yOf = (minutes: number) => headH + (Math.min(1440, Math.max(0, minutes)) / 60) * hourH;
  const colX = (i: number) => AXIS_W + i * colW;

  // Everything that shows up, in a fixed order (sleep, nap, then categories in your order), so colors never shift.
  const used = new Set(days.flatMap((d) => [...d.totals.keys()]));
  const keys: Key[] = [
    { key: 'sleep', label: '🌙 Sleep', color: 'var(--sleep)' },
    { key: NAP, label: '💤 Nap', color: 'var(--nap)' },
    ...lib.categories.map((c) => ({ key: c.id, label: `${c.emoji ?? ''} ${c.name}`.trim(), color: colorVar(c.color) })),
    { key: UNCATEGORIZED, label: 'Uncategorized', color: UNCATEGORIZED_COLOR },
  ];
  const keyById = new Map(keys.map((k) => [k.key, k]));
  const blockColor = (s: Session) =>
    s.kind === 'sleep' ? (s.sleepType === 'nap' ? 'var(--nap)' : 'var(--sleep)') : lib.color(lib.activityById.get(s.activityId ?? ''));

  const todayKey = days.find((d) => now >= d.date && now < d.dateEnd)?.date;
  const fallback = todayKey ?? [...days].reverse().find((d) => d.blocks.length)?.date ?? days[0].date;
  const active = hover ?? pinned;
  const shownDay = days.find((d) => d.date === (active?.date ?? fallback))!;
  const shownBlock = active?.id ? shownDay.blocks.find((b) => b.session.id === active.id) : undefined;

  const pick = (sel: Sel) => setPinned((p) => (p && p.date === sel.date && p.id === sel.id ? null : sel));
  const onMouse = (sel: Sel) => (e: React.PointerEvent) => e.pointerType === 'mouse' && setHover(sel);

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="chart calendar"
        role="group"
        aria-label="Calendar of how you spent your time"
        onPointerLeave={() => setHover(null)}
      >
        {/* Hour lines every 3 hours. */}
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
          <g key={h}>
            <line x1={AXIS_W} x2={W} y1={yOf(h * 60)} y2={yOf(h * 60)} className={h % 24 === 0 ? 'axis' : 'grid'} />
            {h < 24 && (
              <text x={AXIS_W - 5} y={yOf(h * 60) + 4} className="axis-label" textAnchor="end">
                {hourLabel(h)}
              </text>
            )}
          </g>
        ))}

        {days.map((d, i) => {
          const x = colX(i);
          const future = d.date > now;
          const isToday = d.date === todayKey;
          const selected = shownDay.date === d.date && active !== null;
          return (
            <g key={d.date}>
              {/* Day header */}
              {week ? (
                <>
                  <text x={x + colW / 2} y={13} textAnchor="middle" className={`axis-label ${isToday ? 'cal-today' : ''}`}>
                    {new Date(d.date).toLocaleDateString([], { weekday: 'short' })}
                  </text>
                  <text x={x + colW / 2} y={28} textAnchor="middle" className={`cal-date ${isToday ? 'cal-today' : ''} ${future ? 'future' : ''}`}>
                    {new Date(d.date).getDate()}
                  </text>
                </>
              ) : (
                (i % 7 === 0 || isToday) && (
                  <text x={x + colW / 2} y={12} textAnchor="middle" className={`axis-label ${isToday ? 'cal-today' : ''}`}>
                    {new Date(d.date).getDate()}
                  </text>
                )
              )}

              {/* The whole column is a tap target for the day. */}
              <rect
                x={x + 0.5}
                y={headH}
                width={colW - 1}
                height={24 * hourH}
                className={`cal-col ${selected ? 'on' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={describeDay(d, keyById)}
                onClick={() => pick({ date: d.date })}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick({ date: d.date }))}
                onPointerEnter={onMouse({ date: d.date })}
              />

              {d.blocks.map((b) => {
                const top = yOf(minutesFromDate(d.date, b.start));
                const bottom = d.dateEnd <= b.end ? yOf(1440) : yOf(minutesFromDate(d.date, b.end));
                const h = Math.max(1.5, bottom - top);
                // Multitasking: the later block sits in the right half, beside the one already going.
                const bx = b.overlap ? x + colW / 2 : x + 1;
                const bw = b.overlap ? colW / 2 - 1 : colW - 2;
                const dim = active?.id && active.id !== b.session.id;
                return (
                  <g key={b.session.id} className="cal-block-g" opacity={dim ? 0.45 : 1}>
                    <rect
                      x={bx}
                      y={top}
                      width={bw}
                      height={h}
                      rx={week ? 3 : 1.5}
                      fill={blockColor(b.session)}
                      className={`cal-block ${active?.id === b.session.id ? 'on' : ''}`}
                      role="button"
                      tabIndex={week ? 0 : -1}
                      aria-label={`${lib.sessionLabel(b.session)}, ${formatTime(b.session.start)} to ${b.session.end ? formatTime(b.session.end) : 'now'}`}
                      onClick={() => pick({ date: d.date, id: b.session.id })}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick({ date: d.date, id: b.session.id }))}
                      onPointerEnter={onMouse({ date: d.date, id: b.session.id })}
                    />
                    {/* "On what": the activity's emoji, when the block is tall enough to hold it. */}
                    {week && h >= 15 && (
                      <text x={bx + bw / 2} y={top + 12} textAnchor="middle" className="cal-emoji">
                        {lib.sessionEmoji(b.session)}
                      </text>
                    )}
                  </g>
                );
              })}

              {d.wakes.map((t) => (
                <circle key={t} cx={x + colW / 2} cy={yOf(minutesFromDate(d.date, t))} r={week ? 4 : 2.5} className="wake-dot" />
              ))}

              {isToday && <line x1={x} x2={x + colW} y1={yOf(minutesFromDate(d.date, now))} y2={yOf(minutesFromDate(d.date, now))} className="now-line" />}
            </g>
          );
        })}
      </svg>

      <div className="chart-legend small">
        {keys
          .filter((k) => used.has(k.key))
          .map((k) => (
            <span key={k.key}>
              <i className="key-bar" style={{ background: k.color }} /> {k.label}
            </span>
          ))}
        <span>
          <i className="key-dot" /> New day started
        </span>
        <span>
          <i className="key-blank" /> Untracked
        </span>
      </div>

      <div className="sleep-detail" aria-live="polite">
        <div>
          <strong>{new Date(shownDay.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
          {shownDay.date === todayKey && <span className="muted"> · today so far</span>}
        </div>
        {shownBlock && (
          <div className="cal-picked">
            <i className="key-bar" style={{ background: blockColor(shownBlock.session) }} />
            <span className="grow">
              {lib.sessionEmoji(shownBlock.session)} <strong>{lib.sessionLabel(shownBlock.session)}</strong>
              <br />
              <span className="muted small">
                {whenText(shownBlock.session.start, shownDay.date)} – {shownBlock.session.end ? whenText(shownBlock.session.end, shownDay.date) : 'now'}
              </span>
            </span>
            <strong>{formatDuration((shownBlock.session.end ?? now) - shownBlock.session.start)}</strong>
          </div>
        )}
        {shownDay.date > now ? (
          <div className="muted">Still to come.</div>
        ) : (
          <ul className="cal-totals">
            {keys
              .filter((k) => shownDay.totals.has(k.key))
              .sort((a, b) => shownDay.totals.get(b.key)! - shownDay.totals.get(a.key)!)
              .map((k) => (
                <li key={k.key}>
                  <i className="key-bar" style={{ background: k.color }} />
                  <span className="grow">{k.label}</span>
                  <span>{formatDuration(shownDay.totals.get(k.key)!)}</span>
                </li>
              ))}
            {shownDay.untracked >= 60_000 && (
              <li className="muted">
                <i className="key-blank" />
                <span className="grow">Untracked</span>
                <span>{formatDuration(shownDay.untracked)}</span>
              </li>
            )}
          </ul>
        )}
        {shownDay.wakes.map((t) => (
          <div key={t} className="small">
            <i className="key-dot" /> New day started at <strong>{formatTime(t)}</strong>
          </div>
        ))}
        {active === null && <div className="muted small">Tap a block or a day for its details.</div>}
      </div>
    </div>
  );
}

function hourLabel(h: number) {
  if (h === 0) return 'Midnight';
  if (h === 12) return 'Noon';
  return `${h % 12} ${h < 12 ? 'AM' : 'PM'}`;
}

/** A time, with the weekday added when it's on a different date than the one shown ("Sun 11:30 PM"). */
function whenText(t: number, date: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === date ? formatTime(t) : `${new Date(t).toLocaleDateString([], { weekday: 'short' })} ${formatTime(t)}`;
}

function describeDay(d: CalendarDay, keys: Map<string, Key>) {
  const date = new Date(d.date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  const parts = [...d.totals.entries()].map(([k, ms]) => `${keys.get(k)?.label ?? 'Other'} ${formatDuration(ms)}`);
  return `${date}: ${parts.length ? parts.join(', ') : 'nothing logged'}`;
}
