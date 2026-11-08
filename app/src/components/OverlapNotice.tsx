// When a block of time overlaps others: keep both (multitasking) or make room (shorten the others).
// "Keep both" is the default because it never changes or deletes anything else. (Sun Check 2026-11-07)
import { isEmptyPlan, type InsertPlan } from '../days';
import { formatDayTime } from '../format';
import type { Library } from '../hooks';

export function OverlapNotice({
  lib,
  plan,
  keepBoth,
  onKeepBothChange,
}: {
  lib: Library;
  plan: InsertPlan;
  /** When provided with onKeepBothChange, shows the keep-both / make-room choice. */
  keepBoth?: boolean;
  onKeepBothChange?: (v: boolean) => void;
}) {
  if (isEmptyPlan(plan)) return null;
  const name = (s: Parameters<Library['sessionLabel']>[0]) => (
    <strong>
      {lib.sessionEmoji(s)} {lib.sessionLabel(s)}
    </strong>
  );
  const others = [...plan.trimEnd.map((x) => x.session), ...plan.moveStart.map((x) => x.session), ...plan.split.map((x) => x.session), ...plan.remove];
  const choosable = onKeepBothChange !== undefined;

  return (
    <div className="notice">
      <p className="muted small">
        This overlaps {others.length === 1 ? 'other time' : `${others.length} other blocks`}:{' '}
        {others.map((s, i) => (
          <span key={s.id}>
            {i > 0 && ', '}
            {name(s)}
          </span>
        ))}
        .
      </p>
      {choosable && (
        <div className="segmented" role="group" aria-label="Overlapping time">
          <button className={keepBoth ? 'on' : ''} onClick={() => onKeepBothChange(true)}>
            Keep both
          </button>
          <button className={!keepBoth ? 'on' : ''} onClick={() => onKeepBothChange(false)}>
            Make room
          </button>
        </div>
      )}
      {choosable && keepBoth ? (
        <p className="small">Both stay, as multitasking. Each one counts its full time.</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
