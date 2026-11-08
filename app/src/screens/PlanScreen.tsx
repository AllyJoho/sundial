// The Plan tab: a placeholder for the calendar / schedule / task tracker (Sun Check 2026-11-07).
// Building the real features follows product/roadmap.md; this shows what's coming.

const COMING: { icon: string; title: string; body: string }[] = [
  {
    icon: '🌤️',
    title: "Today's intentions",
    body: '1–3 small things you want to do today, each with a rough window like "afternoon" instead of a clock time. Missed ones never pile up: you choose to carry them to tomorrow or let them go.',
  },
  {
    icon: '🗓️',
    title: 'Schedule',
    body: 'Classes, shifts, and appointments, shown next to how your day actually went. You can send them to iPhone Calendar so it reminds you.',
  },
  {
    icon: '📝',
    title: 'Tasks & assignments',
    body: 'Assignments from Canvas and BYU Learning Suite, with "do dates" next to due dates, so you can plan when to work on things.',
  },
];

export function PlanScreen() {
  return (
    <div className="screen">
      <header className="day-header">
        <div className="day-title">Plan</div>
        <div className="muted">Coming soon. Here's what this tab will hold:</div>
      </header>
      {COMING.map((c) => (
        <section key={c.title} className="card plan-card">
          <div className="plan-icon" aria-hidden>
            {c.icon}
          </div>
          <div>
            <h3 className="card-title">{c.title}</h3>
            <p className="muted" style={{ margin: 0 }}>
              {c.body}
            </p>
          </div>
        </section>
      ))}
      <p className="muted small center-text">Have an idea for this tab? Bring it to the next Sun Check ☀️</p>
    </div>
  );
}
