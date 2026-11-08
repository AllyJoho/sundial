// "To do today" (bottom of Today), the folded-up "Later" list, and the "open now" card.
// (Sun Check 2026-11-07, "To-do list".)
import { useState } from 'react';
import type { AppData } from '../App';
import { addTask, moveTask, toggleTaskDone } from '../actions';
import { dueLabel, openNow, sortLater, todayTasks, windowStatus } from '../tasks';
import type { Task } from '../types';
import { TaskSheet } from './TaskSheet';

export function TodoList({ data, dayStart, now }: { data: AppData; dayStart: number; now: number }) {
  const [editing, setEditing] = useState<Task | null>(null);
  const [draft, setDraft] = useState('');
  const [showLater, setShowLater] = useState(false);
  const today = todayTasks(data.tasks, dayStart);
  const later = sortLater(data.tasks.filter((t) => t.list === 'later' && !t.doneAt));

  return (
    <section className="todo">
      <h3 className="diary-title">To do today</h3>
      <ul className="todo-list">
        {today.map((t) => (
          <TaskRow key={t.id} task={t} now={now} onOpen={() => setEditing(t)} />
        ))}
      </ul>
      <form
        className="todo-add"
        onSubmit={(e) => {
          e.preventDefault();
          addTask(draft);
          setDraft('');
        }}
      >
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="+ Add something to do…" enterKeyHint="done" aria-label="Add something to do" />
      </form>

      {later.length > 0 && (
        <>
          <button className="later-toggle" onClick={() => setShowLater(!showLater)} aria-expanded={showLater}>
            {showLater ? '▾' : '›'} Later ({later.length})
          </button>
          {showLater && (
            <ul className="todo-list">
              {later.map((t) => (
                <TaskRow key={t.id} task={t} now={now} onOpen={() => setEditing(t)} action={{ label: 'Do today', run: () => moveTask(t.id, 'today') }} />
              ))}
            </ul>
          )}
        </>
      )}

      {editing && <TaskSheet task={editing} calendarExport={!!data.settings.calendarExport} onClose={() => setEditing(null)} />}
    </section>
  );
}

function TaskRow({ task, now, onOpen, action }: { task: Task; now: number; onOpen: () => void; action?: { label: string; run: () => void } }) {
  const status = task.window ? windowStatus(task.window, now) : null;
  const done = !!task.doneAt;
  return (
    <li className={`task-row ${done ? 'done' : ''}`}>
      <button className="task-check" onClick={() => toggleTaskDone(task)} aria-label={done ? `Mark "${task.title}" not done` : `Mark "${task.title}" done`} aria-pressed={done}>
        {done ? '✓' : ''}
      </button>
      <button className="task-body" onClick={onOpen}>
        <span className="task-title">{task.title}</span>
        {!done && (task.due || status || task.notes) && (
          <span className="task-meta small">
            {status && <span className={status.open ? 'task-open' : ''}>{status.text}</span>}
            {task.due && <span>{dueLabel(task.due, now)}</span>}
            {task.notes && <span>📝 notes</span>}
          </span>
        )}
      </button>
      {action && !done && (
        <button className="task-action" onClick={action.run}>
          {action.label}
        </button>
      )}
    </li>
  );
}

/** While a task's hours are open, say so at the top of Today ("Call Verizon · open now until 5 PM"). */
export function OpenNowCard({ data, now }: { data: AppData; now: number }) {
  const [editing, setEditing] = useState<Task | null>(null);
  const open = openNow(data.tasks, now);
  if (open.length === 0) return null;
  return (
    <section className="card checkin open-now">
      <h3>Open right now</h3>
      <ul className="todo-list">
        {open.slice(0, 3).map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            now={now}
            onOpen={() => setEditing(t)}
            action={t.list === 'later' ? { label: 'Do today', run: () => moveTask(t.id, 'today') } : undefined}
          />
        ))}
      </ul>
      {open.length > 3 && <p className="muted small">+ {open.length - 3} more in your list</p>}
      {editing && <TaskSheet task={editing} calendarExport={!!data.settings.calendarExport} onClose={() => setEditing(null)} />}
    </section>
  );
}
