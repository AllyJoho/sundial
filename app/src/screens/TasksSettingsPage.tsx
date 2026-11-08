// To-do list settings. "Add to iPhone Calendar" is off by default (Sun Check 2026-11-07).
import type { AppData } from '../App';
import { saveSettings } from '../actions';

export function TasksSettingsPage({ data }: { data: AppData }) {
  return (
    <>
      <section className="card">
        <h3 className="card-title">iPhone Calendar reminders</h3>
        <label className="check">
          <input type="checkbox" checked={!!data.settings.calendarExport} onChange={(e) => saveSettings({ calendarExport: e.target.checked })} />
          Show "Add to iPhone Calendar" on tasks
        </label>
        <p className="muted small" style={{ marginBottom: 0 }}>
          Sundial can't send reminders by itself on iPhone. With this on, a task can make a calendar event (for example, the next time its
          hours open), and Calendar sends the alert. Off by default.
        </p>
      </section>
    </>
  );
}
