// Create and edit goals. New goals start from your real average (principle 5: meet people where they are).
import { useMemo, useState } from 'react';
import type { AppData } from '../App';
import { deleteGoal, saveGoal } from '../actions';
import { GoalBars } from '../components/GoalBars';
import { ActivityField } from '../components/ActivityField';
import { DurationStepper } from '../components/Choice';
import { Sheet } from '../components/Sheet';
import { formatDuration } from '../format';
import { dailyBaseline, goalProgress } from '../goals';
import type { Goal } from '../types';

export function GoalsPage({ data }: { data: AppData }) {
  const { lib, goals, sessions, day } = data;
  const [editing, setEditing] = useState<Goal | 'new' | null>(null);
  const now = Date.now();
  const dayStart = day.status === 'awake' ? day.start : day.status === 'asleep' && day.dayStart ? day.dayStart : new Date().setHours(0, 0, 0, 0);
  const active = goals.filter((g) => !g.archived);

  return (
    <>
      <p className="muted" style={{ margin: 0 }}>
        Goals work like calorie goals: a <strong>minimum</strong> ("at least 3h homework") or a <strong>limit</strong> ("under
        1h scrolling"), per day or per week. Small steps from where you are now work best.
      </p>
      {active.length > 0 && (
        <section className="card">
          <GoalBars lib={lib} progress={active.map((g) => goalProgress(g, lib.activities, sessions, dayStart, now, now))} />
        </section>
      )}
      <ul className="settings-list">
        {active.map((g) => (
          <li key={g.id}>
            <button className="settings-row" onClick={() => setEditing(g)}>
              <span className="grow">{describeGoal(g, data)}</span>
              <span className="muted">Edit ›</span>
            </button>
          </li>
        ))}
      </ul>
      <button className="btn primary" onClick={() => setEditing('new')}>
        + New goal
      </button>
      {editing && <GoalEditor data={data} goal={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function targetName(t: Goal['target'], data: AppData) {
  if (t.type === 'activity') {
    const a = data.lib.activityById.get(t.id);
    return a ? `${data.lib.emoji(a)} ${data.lib.label(a)}` : 'a removed activity';
  }
  const c = data.lib.categoryById.get(t.id);
  return c ? `${c.emoji ?? ''} ${c.name} (all)`.trim() : 'a removed category';
}

export function describeGoal(g: Goal, data: AppData) {
  return `${g.kind === 'min' ? 'At least' : 'No more than'} ${formatDuration(g.minutes * 60_000)} of ${targetName(g.target, data)} a ${g.period}`;
}

function GoalEditor({ data, goal, onClose }: { data: AppData; goal?: Goal; onClose: () => void }) {
  const { lib } = data;
  const [target, setTarget] = useState(goal ? `${goal.target.type}:${goal.target.id}` : '');
  const [kind, setKind] = useState<Goal['kind']>(goal?.kind ?? 'min');
  const [period, setPeriod] = useState<Goal['period']>(goal?.period ?? 'day');
  const [minutes, setMinutes] = useState(goal?.minutes ?? 60);

  const parsed = target ? ({ type: target.split(':')[0], id: target.split(':')[1] } as Goal['target']) : null;
  const baseline = useMemo(
    () => (parsed ? dailyBaseline(parsed, lib.activities, data.sessions, data.days) : null),
    [parsed?.type, parsed?.id, lib.activities, data.sessions, data.days],
  );
  const baselineMin = baseline === null ? null : Math.round(baseline / 60_000) * (period === 'week' ? 7 : 1);
  // A small first step from your real average.
  const step = period === 'week' ? 60 : 15;
  const suggestion = baselineMin === null ? null : Math.max(15, roundTo(kind === 'min' ? baselineMin + step : baselineMin - step, 15));

  async function save() {
    if (!parsed || minutes <= 0) return;
    await saveGoal({ ...(goal ?? {}), target: parsed, kind, period, minutes });
    onClose();
  }

  return (
    <Sheet title={goal ? 'Edit goal' : 'New goal'} onClose={onClose}>
      <ActivityField
        lib={lib}
        sessions={data.sessions}
        label="Goal for"
        includeCategories
        allowCreate={false}
        // The picker speaks "act:"/"cat:"; goals store "activity:"/"category:".
        value={target.replace(/^activity:/, 'act:').replace(/^category:/, 'cat:')}
        onChange={(v) => setTarget(v.replace(/^act:/, 'activity:').replace(/^cat:/, 'category:'))}
      />

      <div className="segmented" role="group" aria-label="Kind of goal">
        <button className={kind === 'min' ? 'on' : ''} onClick={() => setKind('min')}>
          At least
        </button>
        <button className={kind === 'limit' ? 'on' : ''} onClick={() => setKind('limit')}>
          No more than
        </button>
      </div>

      <DurationStepper
        label="How much"
        minutes={minutes}
        onChange={setMinutes}
        step={15}
        min={15}
        max={period === 'week' ? 60 * 60 : 16 * 60}
        presets={period === 'week' ? [120, 300, 600, 1200] : [30, 60, 120, 180]}
      />

      <div className="segmented" role="group" aria-label="Per">
        <button className={period === 'day' ? 'on' : ''} onClick={() => setPeriod('day')}>
          Per day
        </button>
        <button className={period === 'week' ? 'on' : ''} onClick={() => setPeriod('week')}>
          Per week
        </button>
      </div>

      {parsed && (
        <div className="notice">
          {baselineMin === null ? (
            <p>Once you've tracked a few days, you'll see your real average here to start from.</p>
          ) : (
            <>
              <p>
                Lately you average <strong>{formatDuration(baselineMin * 60_000)}</strong> a {period}.
              </p>
              {suggestion !== null && suggestion !== minutes && (
                <p>
                  A small first step:{' '}
                  <button className="link-btn inline" onClick={() => setMinutes(suggestion)}>
                    use {formatDuration(suggestion * 60_000)}
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!parsed || minutes <= 0}>
          Save
        </button>
        {goal && (
          <button
            className="btn danger-quiet"
            onClick={async () => {
              if (window.confirm('Delete this goal? Your tracked time is not affected.')) {
                await deleteGoal(goal.id);
                onClose();
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </Sheet>
  );
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;
