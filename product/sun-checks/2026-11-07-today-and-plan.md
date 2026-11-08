# Sun Check — 2026-11-07 (2): One "Today" tab, and a Plan tab

_Inspiration: MyFitnessPal (Dashboard + Diary with ‹ date ›, meal sections with "Add food", "Complete diary", center "+" button)._

## Topics
1. Merging the Now and Days tabs
2. The tab bar, with room for the future calendar/schedule/task tracker
3. What to call that tab
4. How the day's diary is laid out

## Decided
- **One "Today" tab** replaces Now and Days.
  - Top: the live timer, the "What are you doing?" box, and the "Your usual" tiles.
  - Then a summary strip: awake, tracked, and a tracked bar. Goals and the sleep summary follow.
  - Then the **diary**: the day's timeline.
  - At the bottom, a **"Complete today"** button (goodnight / close out), like MFP's "Complete diary".
  - **‹ › arrows** at the top go to past days. Past days show the diary and their close-out status, without the timer and quick start.
- **Tab bar:** **Today · Plan · ( + ) · Trends · More.**
  - The center **+** opens quick logging from any tab: what are you doing, log past time, nap, going to sleep.
- **The planner tab is called "Plan".** It's a placeholder for now, describing what's coming:
  - **Today's intentions** (research-ideas #2): 1–3 small things with rough windows. Missed ones never pile up.
  - **Schedule / calendar:** export to iPhone Calendar via .ics, so Calendar sends the alerts (see `iphone-feasibility.md`).
  - **Tasks / assignments:** Canvas and BYU Learning Suite, through a file import or a small proxy (their feeds block direct browser access).
- **Diary layout:** part-of-day sections (**Morning / Afternoon / Evening / Night**), shown in the order *your* day happens. A 4 PM wake-up starts with Afternoon. Each section has its own "+ Add".
  - Parts of day by clock: Morning 5 AM–noon, Afternoon noon–5 PM, Evening 5–9 PM, Night 9 PM–5 AM.

## Status
Built on 2026-11-07. Tested in a phone-sized browser; not yet on a real iPhone.

## Notes
- Building the actual Plan features follows the roadmap. This Sun Check only adds the tab and the placeholder.
