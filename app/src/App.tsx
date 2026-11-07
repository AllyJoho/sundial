// The app shell: loads data, works out the current "day", and shows one of three tabs.
import { useMemo, useState } from 'react';
import { ErrorBanner } from './components/ErrorBanner';
import { getDayState } from './day';
import { useLibrary, useRecentSessions } from './hooks';
import { ActivitiesScreen } from './screens/ActivitiesScreen';
import { NowScreen } from './screens/NowScreen';
import { TodayScreen } from './screens/TodayScreen';

type Tab = 'now' | 'today' | 'activities';

export function App() {
  const [tab, setTab] = useState<Tab>('now');
  const lib = useLibrary();
  const sessions = useRecentSessions();
  const day = useMemo(() => getDayState(sessions ?? []), [sessions]);

  if (!lib || !sessions) return <div className="loading">☀️</div>;

  return (
    <div className="app">
      <ErrorBanner />
      <main>
        {tab === 'now' && <NowScreen lib={lib} sessions={sessions} day={day} />}
        {tab === 'today' && <TodayScreen lib={lib} sessions={sessions} day={day} />}
        {tab === 'activities' && <ActivitiesScreen lib={lib} />}
      </main>
      <nav className="tabbar">
        {(
          [
            ['now', '⏱️', 'Now'],
            ['today', '📋', 'Today'],
            ['activities', '🗂️', 'Activities'],
          ] as const
        ).map(([id, icon, label]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}>
            <span className="tab-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
