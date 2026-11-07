// Create and edit routines: a named list of activities you do in order.
import { useState } from 'react';
import type { AppData } from '../App';
import { deleteRoutine, saveRoutine } from '../actions';
import { ActivitySelect } from '../components/ActivityPicker';
import { Sheet } from '../components/Sheet';
import type { Routine } from '../types';

export function RoutinesPage({ data }: { data: AppData }) {
  const { lib, routines } = data;
  const [editing, setEditing] = useState<Routine | 'new' | null>(null);
  return (
    <>
      <p className="muted" style={{ margin: 0 }}>
        A routine starts a sequence with one tap, like "Morning: Getting ready → Eating → Class". On the home screen, tap{' '}
        <strong>Next</strong> to move to the next activity.
      </p>
      <ul className="settings-list card">
        {routines.map((r) => (
          <li key={r.id}>
            <button className="settings-row" onClick={() => setEditing(r)}>
              <span className="menu-icon">{r.emoji || '🔁'}</span>
              <span className="grow">
                {r.name}
                <span className="muted small">
                  {' '}
                  · {r.activityIds.map((id) => lib.activityById.get(id)?.name ?? '?').join(' → ')}
                </span>
              </span>
              <span className="muted">›</span>
            </button>
          </li>
        ))}
        {routines.length === 0 && <li className="muted settings-row">No routines yet.</li>}
      </ul>
      <button className="btn primary" onClick={() => setEditing('new')}>
        + New routine
      </button>
      {editing && <RoutineEditor data={data} routine={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function RoutineEditor({ data, routine, onClose }: { data: AppData; routine?: Routine; onClose: () => void }) {
  const { lib } = data;
  const [name, setName] = useState(routine?.name ?? '');
  const [emoji, setEmoji] = useState(routine?.emoji ?? '');
  const [steps, setSteps] = useState<string[]>(routine?.activityIds ?? []);
  const [adding, setAdding] = useState('');

  const move = (i: number, by: number) => {
    const next = [...steps];
    const [x] = next.splice(i, 1);
    next.splice(i + by, 0, x);
    setSteps(next);
  };

  async function save() {
    if (!name.trim() || steps.length === 0) return;
    await saveRoutine({ ...(routine ?? {}), name: name.trim(), emoji: emoji.trim() || undefined, activityIds: steps });
    onClose();
  }

  return (
    <Sheet title={routine ? 'Edit routine' : 'New routine'} onClose={onClose}>
      <div className="field-row">
        <label className="field emoji-field">
          <span>Emoji</span>
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🌅" maxLength={4} />
        </label>
        <label className="field grow">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Morning" autoFocus={!routine} />
        </label>
      </div>
      <div className="field">
        <span>Steps, in order</span>
        <ol className="step-list">
          {steps.map((id, i) => {
            const a = lib.activityById.get(id);
            return (
              <li key={`${id}-${i}`}>
                <span className="grow">
                  {i + 1}. {lib.emoji(a)} {lib.label(a)}
                </span>
                <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === steps.length - 1} aria-label="Move down">
                  ↓
                </button>
                <button className="icon-btn" onClick={() => setSteps(steps.filter((_, j) => j !== i))} aria-label="Remove">
                  ✕
                </button>
              </li>
            );
          })}
        </ol>
        <ActivitySelect
          lib={lib}
          value={adding}
          includeSleep={false}
          onChange={(v) => {
            setSteps([...steps, v.slice(4)]);
            setAdding('');
          }}
        />
        <span className="small">Pick an activity above to add it as the next step.</span>
      </div>
      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!name.trim() || steps.length === 0}>
          Save
        </button>
        {routine && (
          <button
            className="btn danger-quiet"
            onClick={async () => {
              if (window.confirm(`Delete the "${routine.name}" routine? Your tracked time is not affected.`)) {
                await deleteRoutine(routine.id);
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
