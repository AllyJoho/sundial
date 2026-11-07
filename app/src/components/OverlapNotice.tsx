// Explains what will change when a new block of time overlaps existing ones, before you save.
import { isEmptyPlan, type InsertPlan } from '../days';
import { formatDayTime } from '../format';
import type { Library } from '../hooks';

export function OverlapNotice({ lib, plan }: { lib: Library; plan: InsertPlan }) {
  if (isEmptyPlan(plan)) return null;
  const name = (s: Parameters<Library['sessionLabel']>[0]) => (
    <strong>
      {lib.sessionEmoji(s)} {lib.sessionLabel(s)}
    </strong>
  );
  return (
    <div className="notice">
      <p className="muted small">This overlaps other time, so:</p>
      {plan.trimEnd.map(({ session, end }) => (
        <p key={session.id}>
          {name(session)} will end at {formatDayTime(end)}
          {session.end === null ? ' (stopping its timer)' : ''}.
        </p>
      ))}
      {plan.moveStart.map(({ session, start }) => (
        <p key={session.id}>
          {name(session)} will start at {formatDayTime(start)}.
        </p>
      ))}
      {plan.split.map(({ session }) => (
        <p key={session.id}>{name(session)} will be split around it.</p>
      ))}
      {plan.remove.map((session) => (
        <p key={session.id}>
          {name(session)} from {formatDayTime(session.start)} is completely covered and will be removed.
        </p>
      ))}
    </div>
  );
}
