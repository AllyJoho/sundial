// The "More" tab: goals, sleep, activities, backup. Each opens its own page with a back button.
import { useState } from 'react';
import type { AppData } from '../App';
import { lastBackupAt } from '../backup';
import { cloudEnabled } from '../cloud';
import { AccountPage, SyncBadge } from './AccountPage';
import { ActivitiesScreen } from './ActivitiesScreen';
import { BackupPage } from './BackupPage';
import { GoalsPage } from './GoalsPage';
import { RoutinesPage } from './RoutinesPage';
import { TasksSettingsPage } from './TasksSettingsPage';
import { SleepPage } from './SleepPage';

type Page = 'menu' | 'account' | 'goals' | 'sleep' | 'routines' | 'tasks' | 'activities' | 'backup';

const BACKUP_NUDGE_MS = 7 * 24 * 3600_000;

export function MoreScreen({ data }: { data: AppData }) {
  const [page, setPage] = useState<Page>('menu');
  const last = lastBackupAt();
  const backupDue = data.sessions.length > 20 && (!last || Date.now() - last > BACKUP_NUDGE_MS);

  if (page === 'activities') {
    return (
      <div className="screen">
        <BackButton onClick={() => setPage('menu')} />
        <ActivitiesScreen lib={data.lib} />
      </div>
    );
  }

  const titles: Record<Exclude<Page, 'menu' | 'activities'>, string> = { account: 'Account & sync', goals: 'Goals', sleep: 'Sleep', routines: 'Routines', tasks: 'To-do list', backup: 'Backup' };
  if (page !== 'menu') {
    return (
      <div className="screen">
        <BackButton onClick={() => setPage('menu')} />
        <header className="day-header">
          <div className="day-title">{titles[page]}</div>
        </header>
        {page === 'account' && <AccountPage />}
        {page === 'goals' && <GoalsPage data={data} />}
        {page === 'sleep' && <SleepPage data={data} />}
        {page === 'routines' && <RoutinesPage data={data} />}
        {page === 'tasks' && <TasksSettingsPage data={data} />}
        {page === 'backup' && <BackupPage />}
      </div>
    );
  }

  const activeGoals = data.goals.filter((g) => !g.archived).length;
  // Typed-in activities land in Uncategorized; this is a gentle count, not a to-do.
  const toSort = data.lib.activities.filter((a) => !a.archived && !a.categoryId && a.id !== '#act-downtime').length;
  const modeName = { track: 'Just track', stabilize: 'Stabilize', shift: 'Shift' }[data.settings.sleepMode];
  return (
    <div className="screen">
      <header className="day-header">
        <div className="day-title">More</div>
      </header>
      <ul className="settings-list card">
        <MenuRow icon="☁️" title="Account & sync" detail={cloudEnabled ? <SyncBadge /> : 'This device only'} onClick={() => setPage('account')} />
        <MenuRow icon="🎯" title="Goals" detail={activeGoals ? `${activeGoals} active` : 'None yet'} onClick={() => setPage('goals')} />
        <MenuRow icon="🌙" title="Sleep" detail={modeName} onClick={() => setPage('sleep')} />
        <MenuRow icon="🔁" title="Routines" detail={data.routines.length ? `${data.routines.length}` : undefined} onClick={() => setPage('routines')} />
        <MenuRow icon="✅" title="To-do list" detail={data.settings.calendarExport ? 'Calendar on' : undefined} onClick={() => setPage('tasks')} />
        <MenuRow icon="🗂️" title="Activities & categories" detail={toSort ? `${toSort} to sort` : undefined} onClick={() => setPage('activities')} />
        <MenuRow icon="💾" title="Backup & export" detail={backupDue ? 'Time for a backup' : undefined} onClick={() => setPage('backup')} />
      </ul>
      <p className="muted small center-text">Sundial · your data stays on this device</p>
    </div>
  );
}

function MenuRow({ icon, title, detail, onClick }: { icon: string; title: string; detail?: React.ReactNode; onClick: () => void }) {
  return (
    <li>
      <button className="settings-row" onClick={onClick}>
        <span className="menu-icon">{icon}</span>
        <span className="grow">{title}</span>
        {detail && <span className="muted small">{detail}</span>}
        <span className="muted">›</span>
      </button>
    </li>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="link-btn back-btn" onClick={onClick}>
      ‹ More
    </button>
  );
}
