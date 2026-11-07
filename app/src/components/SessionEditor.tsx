// Edit (or add) one block of time: what it was, when it started and ended, or delete it.
import { useMemo, useState } from 'react';
import { deleteSession, placeSession } from '../actions';
import { planInsert } from '../days';
import { fromLocalInput, formatDuration, toLocalInput } from '../format';
import type { Library } from '../hooks';
import type { Session } from '../types';
import { ActivitySelect } from './ActivityPicker';
import { OverlapNotice } from './OverlapNotice';
import { Sheet } from './Sheet';

export interface SessionDraft {
  start: number;
  end: number | null;
}

export function SessionEditor({
  lib,
  sessions,
  session,
  draft,
  onClose,
}: {
  lib: Library;
  /** All sessions, to check for overlaps. */
  sessions: Session[];
  /** Editing an existing block. */
  session?: Session;
  /** Or adding a new one (e.g. filling an untracked gap). */
  draft?: SessionDraft;
  onClose: () => void;
}) {
  const initial = session ?? draft!;
  const [what, setWhat] = useState(
    session ? (session.kind === 'sleep' ? `sleep:${session.sleepType ?? 'main'}` : `act:${session.activityId}`) : '',
  );
  const [start, setStart] = useState(toLocalInput(initial.start));
  const [running, setRunning] = useState(session ? session.end === null : false);
  const [end, setEnd] = useState(toLocalInput(initial.end ?? Date.now()));
  const [note, setNote] = useState(session?.note ?? '');

  const startMs = fromLocalInput(start);
  const endMs = running ? Date.now() : fromLocalInput(end);
  let error = '';
  if (!what) error = 'Choose what this was.';
  else if (startMs === null || endMs === null) error = 'Enter a start and end time.';
  else if (startMs > Date.now()) error = "Start time can't be in the future.";
  else if (!running && endMs <= startMs) error = 'End time needs to be after the start time.';

  const plan = useMemo(
    () => (error || startMs === null || endMs === null ? null : planInsert(sessions, startMs, endMs, Date.now(), session?.id)),
    [error, sessions, startMs, endMs, session?.id],
  );

  async function save() {
    if (error || startMs === null) return;
    const [kind, rest] = what.split(':') as ['act' | 'sleep', string];
    const fields = {
      kind: kind === 'sleep' ? ('sleep' as const) : ('activity' as const),
      activityId: kind === 'act' ? rest : null,
      sleepType: kind === 'sleep' ? (rest as 'main' | 'nap') : undefined,
      start: startMs,
      end: running ? null : endMs,
      note: note.trim() || undefined,
    };
    await placeSession(session ? { ...session, ...fields } : { ...fields, source: 'manual' });
    onClose();
  }

  async function remove() {
    if (session && window.confirm('Delete this block of time?')) {
      await deleteSession(session.id);
      onClose();
    }
  }

  return (
    <Sheet title={session ? 'Edit time' : 'Add time'} onClose={onClose}>
      <label className="field">
        <span>What was it?</span>
        <ActivitySelect lib={lib} value={what} onChange={setWhat} />
      </label>
      <label className="field">
        <span>Started</span>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
      </label>
      {session?.end === null && (
        <label className="check">
          <input type="checkbox" checked={running} onChange={(e) => setRunning(e.target.checked)} />
          Still going
        </label>
      )}
      {!running && (
        <label className="field">
          <span>Ended</span>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      )}
      <label className="field">
        <span>Note (optional)</span>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything to remember?" />
      </label>
      {!error && startMs !== null && endMs !== null && <p className="muted">Length: {formatDuration(endMs - startMs)}</p>}
      {plan && <OverlapNotice lib={lib} plan={plan} />}
      {error && <p className="form-error">{error}</p>}
      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!!error}>
          Save
        </button>
        {session && (
          <button className="btn danger-quiet" onClick={remove}>
            Delete
          </button>
        )}
      </div>
    </Sheet>
  );
}
