// The Sleep card on Trends: the period's sleep in a few numbers (the calendar above shows when).
// Compares you to your own goal range, never to "normal" (principles 4 and 5).
import type { AppData } from '../App';
import { formatDuration } from '../format';
import { averageClockTime, formatClockMinutes, inSleepRange, minuteOfDay, totalSleep, type SleepNight } from '../goals';
import type { PeriodKind, SleepRow } from '../trends';

export function SleepSummary({ data, rows, nights, kind }: { data: AppData; rows: SleepRow[]; nights: Map<number, SleepNight>; kind: PeriodKind }) {
  const { settings } = data;
  const list = [...nights.values()];
  const naps = rows.flatMap((r) => r.naps);
  if (list.length === 0 && naps.length === 0) {
    return (
      <section className="card">
        <h3 className="card-title">Sleep</h3>
        <p className="muted">No sleep logged in this {kind}.</p>
      </section>
    );
  }
  const avg = list.length ? list.reduce((t, n) => t + totalSleep(n, settings), 0) / list.length : null;
  const inRange = list.filter((n) => inSleepRange(totalSleep(n, settings), settings)).length;
  const usualBed = averageClockTime(list.map((n) => minuteOfDay(n.bed)));
  const usualWake = averageClockTime(list.map((n) => minuteOfDay(n.wake)));
  const napMs = naps.reduce((t, n) => t + n.end - n.start, 0);

  return (
    <section className="card">
      <h3 className="card-title">Sleep</h3>
      {avg !== null && (
        <p className="sleep-headline">
          <strong>{formatDuration(avg)}</strong> <span className="muted">average a night</span>
        </p>
      )}
      <ul className="stat-list">
        {usualBed !== null && usualWake !== null && (
          <li>
            <span>Usually</span>
            <strong>
              {formatClockMinutes(usualBed)} → {formatClockMinutes(usualWake)}
            </strong>
          </li>
        )}
        {list.length > 0 && (
          <li>
            <span>
              Nights in your {settings.sleepHoursMin}–{settings.sleepHoursMax}h range
            </span>
            <strong>
              {inRange} of {list.length}
            </strong>
          </li>
        )}
        {naps.length > 0 && (
          <li>
            <span>Naps{settings.napsCount ? ' (counted in your sleep)' : ''}</span>
            <strong>
              {naps.length} · {formatDuration(napMs)}
            </strong>
          </li>
        )}
      </ul>
    </section>
  );
}
