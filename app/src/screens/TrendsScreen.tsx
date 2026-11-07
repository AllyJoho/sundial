// Week and month reviews: time by category per day, sleep times, and goal hit rates.
// Charts follow a tested recipe: thin marks, 2px gaps between stacked pieces, a legend that doubles
// as the table of exact numbers, and tap-to-read (tapping is the phone version of hovering).
import { useMemo, useState } from 'react';
import type { AppData } from '../App';
import { formatDuration, formatTime } from '../format';
import { averageClockTime, formatClockMinutes, inSleepRange, minuteOfDay, targetWake, totalSleep } from '../goals';
import { UNCATEGORIZED_COLOR, SLEEP_COLOR } from '../hooks';
import { colorVar } from '../palette';
import { bucketByDate, getPeriod, goalHitRate, nightsInPeriod, totalsByCategory, UNCATEGORIZED, type DateBucket, type PeriodKind } from '../trends';
import type { SleepNight } from '../goals';
import { describeGoal } from './GoalsPage';

const H = 3600_000;

interface Series {
  key: string;
  label: string;
  color: string;
}

export function TrendsScreen({ data }: { data: AppData }) {
  const { lib, days, sessions } = data;
  const [kind, setKind] = useState<PeriodKind>('week');
  const [offset, setOffset] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  // These are recalculated whenever your data changes (which re-draws this screen), using the current time.
  const now = Date.now();
  const period = getPeriod(kind, now, offset);
  const prev = getPeriod(kind, now, offset - 1);
  const { buckets, prevBuckets, nights } = useMemo(
    () => ({
      buckets: bucketByDate(period, days, sessions, lib.activities, now),
      prevBuckets: bucketByDate(prev, days, sessions, lib.activities, now),
      nights: nightsInPeriod(period, sessions, days, now),
    }),
    // Recalculate when the data or the chosen period changes.
    [period.start, kind, days, sessions, lib.activities], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const totals = totalsByCategory(buckets);
  const prevTotals = totalsByCategory(prevBuckets);
  // Compare per-day averages, so a week or month that's still in progress is compared fairly.
  const prevDates = prevBuckets.filter((b) => b.awake > 0).length;

  // Series in a fixed order (category order), so a category's color never depends on its rank.
  const series: Series[] = [
    ...lib.categories.map((c) => ({ key: c.id, label: `${c.emoji ?? ''} ${c.name}`.trim(), color: colorVar(c.color) })),
    { key: UNCATEGORIZED, label: 'Uncategorized', color: UNCATEGORIZED_COLOR },
  ].filter((s) => (totals.get(s.key) ?? 0) > 0 || (prevTotals.get(s.key) ?? 0) > 0);

  const datesWithData = buckets.filter((b) => b.awake > 0).length;
  const totalTracked = [...totals.values()].reduce((a, b) => a + b, 0);
  const label =
    kind === 'week'
      ? offset === 0
        ? 'This week'
        : offset === -1
          ? 'Last week'
          : `${fmtDate(period.start)} – ${fmtDate(period.end - 1)}`
      : new Date(period.start).toLocaleDateString([], { month: 'long', year: 'numeric' });

  const dailyGoals = data.goals.filter((g) => !g.archived && g.period === 'day');

  return (
    <div className="screen">
      <header className="day-header">
        <div className="day-title">Trends</div>
      </header>

      {/* One filter row above everything it applies to. */}
      <div className="filter-row">
        <div className="segmented small-seg" role="group" aria-label="Period">
          <button className={kind === 'week' ? 'on' : ''} onClick={() => (setKind('week'), setOffset(0))}>
            Week
          </button>
          <button className={kind === 'month' ? 'on' : ''} onClick={() => (setKind('month'), setOffset(0))}>
            Month
          </button>
        </div>
        <div className="period-nav">
          <button className="icon-btn" onClick={() => setOffset(offset - 1)} aria-label="Previous">
            ‹
          </button>
          <span className="period-label">{label}</span>
          <button className="icon-btn" onClick={() => setOffset(offset + 1)} disabled={offset >= 0} aria-label="Next">
            ›
          </button>
        </div>
      </div>

      <section className="card">
        <h3 className="card-title">Where your time went</h3>
        {totalTracked === 0 ? (
          <p className="muted">Nothing tracked in this {kind} yet.</p>
        ) : (
          <>
            {/* key: a new period starts with nothing selected */}
            <StackedColumns key={period.start} buckets={buckets} series={series} kind={kind} focus={focus} />
            <table className="legend-table">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Total</th>
                  <th scope="col">Per day</th>
                  <th scope="col">Per day vs {kind === 'week' ? 'last week' : 'last month'}</th>
                </tr>
              </thead>
              <tbody>
                {series.map((s) => {
                  const t = totals.get(s.key) ?? 0;
                  const p = prevTotals.get(s.key) ?? 0;
                  return (
                    <tr
                      key={s.key}
                      className={focus && focus !== s.key ? 'dim' : ''}
                      onClick={() => setFocus(focus === s.key ? null : s.key)}
                    >
                      <th scope="row">
                        <span className="swatch-sm" style={{ background: s.color }} />
                        {s.label}
                      </th>
                      <td>{formatDuration(t)}</td>
                      <td>{datesWithData ? formatDuration(t / datesWithData) : '–'}</td>
                      <td className="muted">{!datesWithData || !prevDates ? '–' : signed(t / datesWithData - p / prevDates)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="muted small" style={{ margin: '8px 0 0' }}>
              Tap a bar or a row for details. Days count on the date you woke up.
            </p>
          </>
        )}
      </section>

      <SleepSection data={data} nights={nights} dates={period.dates} kind={kind} />

      {dailyGoals.length > 0 && (
        <section className="card">
          <h3 className="card-title">Daily goals</h3>
          <ul className="stat-list">
            {dailyGoals.map((g) => {
              const r = goalHitRate(g, period, days, sessions, lib.activities, now);
              return (
                <li key={g.id}>
                  <span className="grow">{describeGoal(g, data)}</span>
                  <strong>{r.total ? `${r.met} of ${r.total} days` : '–'}</strong>
                </li>
              );
            })}
          </ul>
        </section>
      )}

    </div>
  );
}

function SleepSection({ data, nights, dates, kind }: { data: AppData; nights: Map<number, SleepNight>; dates: number[]; kind: PeriodKind }) {
  const { settings, days } = data;
  const list = [...nights.values()];
  if (list.length === 0) {
    return (
      <section className="card">
        <h3 className="card-title">Sleep</h3>
        <p className="muted">No sleep logged in this {kind}.</p>
      </section>
    );
  }
  const avg = list.reduce((t, n) => t + totalSleep(n, settings), 0) / list.length;
  const inRange = list.filter((n) => inSleepRange(totalSleep(n, settings), settings)).length;
  const usualWake = averageClockTime(list.map((n) => minuteOfDay(n.wake)))!;
  const target = targetWake(settings, days, Date.now());
  return (
    <section className="card">
      <h3 className="card-title">Sleep</h3>
      <SleepChart key={dates[0]} nights={nights} dates={dates} target={target} windowMinutes={settings.wakeWindowMinutes} kind={kind} />
      <ul className="stat-list">
        <li>
          <span>Average sleep</span>
          <strong>{formatDuration(avg)}</strong>
        </li>
        <li>
          <span>
            Nights in your {settings.sleepHoursMin}–{settings.sleepHoursMax}h range
          </span>
          <strong>
            {inRange} of {list.length}
          </strong>
        </li>
        <li>
          <span>Usual wake time</span>
          <strong>{formatClockMinutes(usualWake)}</strong>
        </li>
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Charts (plain SVG)
// ---------------------------------------------------------------------------

const W = 340;
const PLOT_H = 150;
const AXIS_W = 34;
const AXIS_H = 20;

function StackedColumns({ buckets, series, kind, focus }: { buckets: DateBucket[]; series: Series[]; kind: PeriodKind; focus: string | null }) {
  const [sel, setSel] = useState<{ date: number; key: string } | null>(null);
  const maxMs = Math.max(...buckets.map((b) => b.tracked), 2 * H);
  const step = niceStep(maxMs / H);
  const yMax = Math.ceil(maxMs / H / step) * step;
  const plotW = W - AXIS_W;
  const slot = plotW / buckets.length;
  const barW = Math.min(24, slot * 0.62);
  const y = (h: number) => PLOT_H - (h / yMax) * PLOT_H;

  const selBucket = sel ? buckets.find((b) => b.date === sel.date) : undefined;
  const selSeries = sel ? series.find((s) => s.key === sel.key) : undefined;

  return (
    <div>
      <p className="readout" aria-live="polite">
        {selBucket && selSeries ? (
          <>
            <strong>{formatDuration(selBucket.byCategory.get(sel!.key) ?? 0)}</strong> {selSeries.label}
            <span className="muted"> · {fmtDate(selBucket.date, true)} · {formatDuration(selBucket.tracked)} tracked</span>
          </>
        ) : (
          <span className="muted">Hours tracked per day</span>
        )}
      </p>
      <svg viewBox={`0 0 ${W} ${PLOT_H + AXIS_H}`} className="chart" role="img" aria-label="Hours tracked per day by category">
        {ticks(yMax, step).map((h) => (
          <g key={h}>
            <line x1={AXIS_W} x2={W} y1={y(h)} y2={y(h)} className="grid" />
            <text x={AXIS_W - 6} y={y(h) + 4} className="axis-label" textAnchor="end">
              {h}h
            </text>
          </g>
        ))}
        {buckets.map((b, i) => {
          const cx = AXIS_W + slot * i + slot / 2;
          let top = PLOT_H;
          const pieces = series.filter((s) => (b.byCategory.get(s.key) ?? 0) > 0);
          return (
            <g key={b.date}>
              {pieces.map((s, j) => {
                const hgt = ((b.byCategory.get(s.key) ?? 0) / H / yMax) * PLOT_H;
                const gap = j > 0 ? 2 : 0; // 2px surface gap between stacked pieces
                const yTop = top - hgt;
                const h = Math.max(0, hgt - gap);
                top = yTop;
                const isTop = j === pieces.length - 1;
                const dim = (focus && focus !== s.key) || (sel && !(sel.date === b.date && sel.key === s.key));
                return (
                  <path
                    key={s.key}
                    d={isTop ? roundedTop(cx - barW / 2, yTop, barW, h, Math.min(4, barW / 2, h)) : rect(cx - barW / 2, yTop, barW, h)}
                    fill={s.color}
                    opacity={dim ? 0.35 : 1}
                    className="mark"
                    tabIndex={0}
                    role="button"
                    aria-label={`${fmtDate(b.date, true)}: ${s.label} ${formatDuration(b.byCategory.get(s.key) ?? 0)}`}
                    onClick={() => setSel(sel?.date === b.date && sel.key === s.key ? null : { date: b.date, key: s.key })}
                    onFocus={() => setSel({ date: b.date, key: s.key })}
                  />
                );
              })}
              {(kind === 'week' || i % 7 === 0) && (
                <text x={cx} y={PLOT_H + 15} className="axis-label" textAnchor="middle">
                  {kind === 'week' ? new Date(b.date).toLocaleDateString([], { weekday: 'narrow' }) : new Date(b.date).getDate()}
                </text>
              )}
            </g>
          );
        })}
        <line x1={AXIS_W} x2={W} y1={PLOT_H} y2={PLOT_H} className="axis" />
      </svg>
    </div>
  );
}

function SleepChart({
  nights,
  dates,
  target,
  windowMinutes,
  kind,
}: {
  nights: Map<number, SleepNight>;
  dates: number[];
  target: number | null;
  windowMinutes: number;
  kind: PeriodKind;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const list = [...nights.values()];
  // Put times on a continuous scale around your usual wake time, so a night that crosses midnight
  // (or a 4 PM wake-up) draws as one unbroken bar.
  const anchor = averageClockTime(list.map((n) => minuteOfDay(n.wake))) ?? 480;
  const unwrap = (m: number) => anchor + ((((m - anchor) % 1440) + 1440 + 720) % 1440) - 720;
  const bars = new Map(
    [...nights.entries()].map(([date, n]) => {
      const wake = unwrap(minuteOfDay(n.wake));
      return [date, { wake, bed: wake - Math.round((n.wake - n.bed) / 60_000), night: n }];
    }),
  );
  const values = [...bars.values()].flatMap((b) => [b.bed, b.wake]);
  if (target !== null) values.push(unwrap(target) - windowMinutes, unwrap(target) + windowMinutes);
  const lo = Math.floor((Math.min(...values) - 30) / 120) * 120;
  const hi = Math.ceil((Math.max(...values) + 30) / 120) * 120;
  const span = hi - lo;
  const tickStep = span > 16 * 60 ? 360 : span > 8 * 60 ? 240 : 120;
  const yOf = (m: number) => ((m - lo) / span) * PLOT_H; // earlier times at the top
  const plotW = W - AXIS_W - 22;
  const slot = plotW / dates.length;
  const barW = Math.min(24, slot * 0.62);
  const selBar = sel !== null ? bars.get(sel) : undefined;

  return (
    <div>
      <p className="readout" aria-live="polite">
        {selBar ? (
          <>
            <strong>{formatDuration(selBar.night.wake - selBar.night.bed)}</strong>
            <span className="muted">
              {' '}
              · {fmtDate(sel!, true)} · {formatTime(selBar.night.bed)} – {formatTime(selBar.night.wake)}
            </span>
          </>
        ) : (
          <span className="muted">Bedtime to wake-up, each night</span>
        )}
      </p>
      <svg viewBox={`0 0 ${W} ${PLOT_H + AXIS_H}`} className="chart" role="img" aria-label="Sleep times per night">
        {Array.from({ length: Math.floor(span / tickStep) + 1 }, (_, i) => lo + i * tickStep).map((m) => (
          <g key={m}>
            <line x1={AXIS_W} x2={W - 22} y1={yOf(m)} y2={yOf(m)} className="grid" />
            <text x={AXIS_W - 4} y={yOf(m) + 4} className="axis-label" textAnchor="end">
              {shortClock(((m % 1440) + 1440) % 1440)}
            </text>
          </g>
        ))}
        {target !== null && (
          <g>
            <rect
              x={AXIS_W}
              width={plotW}
              y={yOf(unwrap(target) - windowMinutes)}
              height={yOf(unwrap(target) + windowMinutes) - yOf(unwrap(target) - windowMinutes)}
              className="target-band"
            />
            <text x={W - 20} y={yOf(unwrap(target)) + 4} className="axis-label">
              wake
            </text>
          </g>
        )}
        {dates.map((date, i) => {
          const b = bars.get(date);
          const cx = AXIS_W + slot * i + slot / 2;
          return (
            <g key={date}>
              {b && (
                <rect
                  x={cx - barW / 2}
                  y={yOf(b.bed)}
                  width={barW}
                  height={Math.max(2, yOf(b.wake) - yOf(b.bed))}
                  rx={Math.min(4, barW / 2)}
                  fill={SLEEP_COLOR}
                  opacity={sel !== null && sel !== date ? 0.35 : 1}
                  className="mark"
                  tabIndex={0}
                  role="button"
                  aria-label={`${fmtDate(date, true)}: slept ${formatTime(b.night.bed)} to ${formatTime(b.night.wake)}`}
                  onClick={() => setSel(sel === date ? null : date)}
                  onFocus={() => setSel(date)}
                />
              )}
              {(kind === 'week' || i % 7 === 0) && (
                <text x={cx} y={PLOT_H + 15} className="axis-label" textAnchor="middle">
                  {kind === 'week' ? new Date(date).toLocaleDateString([], { weekday: 'narrow' }) : new Date(date).getDate()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function niceStep(maxHours: number) {
  return [1, 2, 4, 6, 8].find((s) => maxHours / s <= 4) ?? 12;
}
function ticks(max: number, step: number) {
  return Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
}
function rect(x: number, y: number, w: number, h: number) {
  return `M${x},${y}h${w}v${h}h${-w}Z`;
}
/** A bar with rounded top corners and a square bottom (the end that sits on the baseline). */
function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  if (h <= 0) return '';
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}
function fmtDate(t: number, weekday = false) {
  return new Date(t).toLocaleDateString([], weekday ? { weekday: 'short', month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric' });
}
function shortClock(m: number) {
  const h = Math.floor(m / 60);
  return `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'a' : 'p'}`;
}
/** "+1h 20m" / "−45m": a plain difference, no good/bad coloring. */
function signed(ms: number) {
  if (Math.abs(ms) < 60_000) return 'same';
  return `${ms > 0 ? '+' : '−'}${formatDuration(Math.abs(ms))}`;
}
