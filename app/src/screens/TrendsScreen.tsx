// Week and month reviews: time by category per day, sleep times, and goal hit rates.
// Charts follow a tested recipe: thin marks, 2px gaps between stacked pieces, a legend that doubles
// as the table of exact numbers, and tap-to-read (tapping is the phone version of hovering).
import { useMemo, useState } from 'react';
import type { AppData } from '../App';
import { formatDuration } from '../format';
import { UNCATEGORIZED_COLOR } from '../hooks';
import { colorVar } from '../palette';
import { bucketByDate, getPeriod, goalHitRate, NAP, nightsInPeriod, sleepRows, totalsByCategory, UNCATEGORIZED, type DateBucket, type PeriodKind } from '../trends';
import { CalendarView } from '../components/CalendarView';
import { SleepSummary } from '../components/SleepSummary';
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
  const { buckets, prevBuckets, nights, rows } = useMemo(
    () => ({
      buckets: bucketByDate(period, days, sessions, lib.activities, now),
      prevBuckets: bucketByDate(prev, days, sessions, lib.activities, now),
      nights: nightsInPeriod(period, sessions, days, now),
      rows: sleepRows(period, sessions, days, now),
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
    { key: NAP, label: '💤 Naps', color: 'var(--nap)' },
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

      <section className="card">
        <h3 className="card-title">Calendar</h3>
        {/* key: a new period starts with nothing picked */}
        <CalendarView key={period.start} lib={lib} sessions={sessions} period={period} now={now} />
      </section>

      <SleepSummary data={data} rows={rows} nights={nights} kind={kind} />

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
/** "+1h 20m" / "−45m": a plain difference, no good/bad coloring. */
function signed(ms: number) {
  if (Math.abs(ms) < 60_000) return 'same';
  return `${ms > 0 ? '+' : '−'}${formatDuration(Math.abs(ms))}`;
}
