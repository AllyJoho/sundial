// Add or edit a task. Only the title is needed; notes, due date, and hours are all optional
// and tucked under "More details". (Sun Check 2026-11-07, "To-do list".)
import { useState } from 'react';
import { deleteTask, saveTask } from '../actions';
import { saveFile } from '../backup';
import { dateKey, describeWindow, dueLabel, formatMinutes, taskToIcs } from '../tasks';
import type { Task, TaskWindow } from '../types';
import { Sheet } from './Sheet';

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const BUSINESS_HOURS: TaskWindow = { days: [1, 2, 3, 4, 5], start: 9 * 60, end: 17 * 60 };

export function TaskSheet({ task, calendarExport, onClose }: { task: Task; calendarExport: boolean; onClose: () => void }) {
  const [title, setTitle] = useState(task.title);
  const [list, setList] = useState<Task['list']>(task.list);
  const [notes, setNotes] = useState(task.notes ?? '');
  const [due, setDue] = useState<string | undefined>(task.due);
  const [hours, setHours] = useState<TaskWindow | undefined>(task.window);
  const [details, setDetails] = useState(!!(task.notes || task.due || task.window));
  const [pickDate, setPickDate] = useState(false);

  const now = Date.now();
  const inDays = (n: number) => dateKey(new Date(new Date().setHours(12, 0, 0, 0)).setDate(new Date().getDate() + n));
  const current = (): Task => ({
    ...task,
    title: title.trim() || task.title,
    list,
    notes: notes.trim() || undefined,
    due,
    window: hours,
  });

  async function save() {
    if (!title.trim()) return;
    await saveTask(current());
    onClose();
  }

  return (
    <Sheet title="Task" onClose={onClose}>
      <label className="field">
        <span>What to do</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Call Verizon about the bill" />
      </label>

      <div className="segmented" role="group" aria-label="Which list">
        <button className={list === 'today' ? 'on' : ''} onClick={() => setList('today')}>
          Today
        </button>
        <button className={list === 'later' ? 'on' : ''} onClick={() => setList('later')}>
          Later
        </button>
      </div>

      {!details ? (
        <button className="link-btn" onClick={() => setDetails(true)}>
          + More details (notes, due date, hours)
        </button>
      ) : (
        <>
          <label className="field">
            <span>Notes / instructions (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What exactly to do, so tomorrow-you remembers (numbers, names, what to ask…)"
            />
          </label>

          <div className="field">
            <span>Due (optional){due ? ` · ${dueLabel(due, now)}` : ''}</span>
            <div className="chips">
              {[
                { label: 'No date', value: undefined },
                { label: 'Today', value: inDays(0) },
                { label: 'Tomorrow', value: inDays(1) },
                { label: 'In a week', value: inDays(7) },
              ].map((o) => (
                <button key={o.label} type="button" className={`chip ${due === o.value && !pickDate ? 'on' : ''}`} onClick={() => (setDue(o.value), setPickDate(false))}>
                  {o.label}
                </button>
              ))}
              <button type="button" className={`chip ${pickDate ? 'on' : ''}`} onClick={() => setPickDate(true)}>
                Pick a date…
              </button>
            </div>
            {pickDate && <input type="date" value={due ?? inDays(0)} onChange={(e) => setDue(e.target.value || undefined)} />}
          </div>

          <div className="field">
            <span>Only during (optional){hours ? ` · ${describeWindow(hours)}` : ''}</span>
            <div className="chips">
              <button type="button" className={`chip ${!hours ? 'on' : ''}`} onClick={() => setHours(undefined)}>
                Anytime
              </button>
              <button
                type="button"
                className={`chip ${hours && JSON.stringify(hours) === JSON.stringify(BUSINESS_HOURS) ? 'on' : ''}`}
                onClick={() => setHours(BUSINESS_HOURS)}
              >
                Business hours (Mon–Fri 9–5)
              </button>
              <button type="button" className={`chip ${hours && JSON.stringify(hours) !== JSON.stringify(BUSINESS_HOURS) ? 'on' : ''}`} onClick={() => setHours({ ...BUSINESS_HOURS, days: [...BUSINESS_HOURS.days] })}>
                Custom…
              </button>
            </div>
            {hours && (
              <div className="window-editor">
                <div className="day-toggles" role="group" aria-label="Days">
                  {DAY_LETTERS.map((l, d) => (
                    <button
                      type="button"
                      key={d}
                      className={`day-toggle ${hours.days.includes(d) ? 'on' : ''}`}
                      aria-pressed={hours.days.includes(d)}
                      onClick={() =>
                        setHours({ ...hours, days: hours.days.includes(d) ? hours.days.filter((x) => x !== d) : [...hours.days, d].sort() })
                      }
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <TimeStepper label="From" minutes={hours.start} onChange={(m) => setHours({ ...hours, start: m })} />
                <TimeStepper label="Until" minutes={hours.end} onChange={(m) => setHours({ ...hours, end: m })} />
              </div>
            )}
          </div>
        </>
      )}

      {calendarExport && (
        <button className="btn" onClick={() => saveFile(`${current().title.slice(0, 40)}.ics`, taskToIcs(current(), Date.now()), 'text/calendar')}>
          🗓️ Add to iPhone Calendar
        </button>
      )}

      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!title.trim()}>
          Save
        </button>
        <button
          className="btn danger-quiet"
          onClick={async () => {
            if (window.confirm(`Delete "${task.title}"?`)) {
              await deleteTask(task.id);
              onClose();
            }
          }}
        >
          Delete
        </button>
      </div>
    </Sheet>
  );
}

/** − 9:00 AM + in half-hour steps. */
function TimeStepper({ label, minutes, onChange }: { label: string; minutes: number; onChange: (m: number) => void }) {
  const step = (by: number) => onChange((minutes + by + 1440) % 1440);
  return (
    <div className="time-stepper">
      <span className="muted small">{label}</span>
      <button type="button" className="step-btn" onClick={() => step(-30)} aria-label={`${label} 30 minutes earlier`}>
        −
      </button>
      <span className="step-value">{formatMinutes(minutes)}</span>
      <button type="button" className="step-btn" onClick={() => step(30)} aria-label={`${label} 30 minutes later`}>
        +
      </button>
    </div>
  );
}

