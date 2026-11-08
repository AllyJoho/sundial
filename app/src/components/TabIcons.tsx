// Line icons for the bottom tab bar, drawn in one consistent style (24×24, rounded strokes).
// They take the text color, so they tint automatically. The selected tab's icon fills in a little.
import type { ReactNode } from 'react';

export type TabIconName = 'today' | 'plan' | 'trends' | 'more';

export function TabIcon({ name, on }: { name: TabIconName; on: boolean }) {
  // Shapes that fill in when the tab is selected.
  const fill = on ? 'currentColor' : 'none';
  const shapes: Record<TabIconName, ReactNode> = {
    // Today: a sun (it's Sundial, after all).
    today: (
      <>
        <circle cx="12" cy="12" r="4.2" fill={fill} />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.55 1.55M17.15 17.15l1.55 1.55M5.3 18.7l1.55-1.55M17.15 6.85l1.55-1.55" />
      </>
    ),
    // Plan: a calendar page.
    plan: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
        <path d="M3.5 10h17" />
        {on && <path d="M3.5 8a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v2h-17z" fill="currentColor" stroke="none" />}
        <path d="M8 3v4M16 3v4" />
        <circle cx="8.5" cy="14.5" r="0.6" fill="currentColor" />
        <circle cx="12" cy="14.5" r="0.6" fill="currentColor" />
        <circle cx="15.5" cy="14.5" r="0.6" fill="currentColor" />
      </>
    ),
    // Trends: three bars.
    trends: (
      <>
        <rect x="4" y="12" width="4" height="8" rx="1.3" fill={fill} />
        <rect x="10" y="4" width="4" height="16" rx="1.3" fill={fill} />
        <rect x="16" y="8.5" width="4" height="11.5" rx="1.3" fill={fill} />
      </>
    ),
    // More: three dots in a rounded square.
    more: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill={on ? 'currentColor' : 'none'} />
        <g fill={on ? 'var(--card)' : 'currentColor'} stroke="none">
          <circle cx="8" cy="12" r="1.4" />
          <circle cx="12" cy="12" r="1.4" />
          <circle cx="16" cy="12" r="1.4" />
        </g>
      </>
    ),
  };
  return (
    <svg
      className="tab-icon"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {shapes[name]}
    </svg>
  );
}
