// Progress bars for goals. Going over a limit is shown neutrally: no red, no alarms (principle 2).
import type { GoalProgress } from '../goals';
import { formatDuration } from '../format';
import type { Library } from '../hooks';
import { colorVar } from '../palette';

export function GoalBars({ lib, progress, emptyHint }: { lib: Library; progress: GoalProgress[]; emptyHint?: React.ReactNode }) {
  if (progress.length === 0) return emptyHint ? <>{emptyHint}</> : null;
  return (
    <ul className="goal-bars">
      {progress.map((p) => {
        const t = p.goal.target;
        const target = t.type === 'activity' ? lib.activityById.get(t.id) : undefined;
        const cat = t.type === 'category' ? lib.categoryById.get(t.id) : undefined;
        const name = target ? `${lib.emoji(target)} ${lib.label(target)}` : cat ? `${cat.emoji ?? ''} ${cat.name}`.trim() : 'Removed';
        const color = target ? lib.color(target) : (cat ? colorVar(cat.color) : 'var(--muted)');
        const isLimit = p.goal.kind === 'limit';
        let status: string;
        if (isLimit) status = p.overMs > 0 ? `${formatDuration(p.overMs)} over` : `${formatDuration(p.targetMs - p.spentMs)} left`;
        else status = p.met ? '✓ reached' : `${formatDuration(p.targetMs - p.spentMs)} to go`;
        return (
          <li key={p.goal.id} className="goal-bar">
            <div className="goal-bar-top">
              <span className="grow">{name}</span>
              <span className="muted small">
                {formatDuration(p.spentMs)} / {isLimit ? 'max ' : ''}
                {formatDuration(p.targetMs)}
                {p.goal.period === 'week' ? ' this week' : ''}
              </span>
            </div>
            <div className={`bar ${isLimit ? 'limit' : ''} ${p.met && !isLimit ? 'met' : ''}`}>
              <span style={{ width: `${Math.min(100, p.ratio * 100)}%`, background: color }} />
            </div>
            <div className={`goal-status small ${p.met && !isLimit ? 'met' : 'muted'}`}>{status}</div>
          </li>
        );
      })}
    </ul>
  );
}
