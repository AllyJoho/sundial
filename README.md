# Sundial

A time tracker that works like a calorie tracker, but for how you spend your time. It's an installable web app (PWA), built mobile-first for iPhone.

> Mission and product docs live in `mission/` and `product/`. This README covers the code only.

## Status
Versions 1–5 from `product/roadmap.md` are built and tested. Optional sync is built but switched off until set up (see "Accounts & sync"). Not hosted online yet.

## Tech
- **Vite + React + TypeScript**, code in `app/`
- **Dexie** (a helper library for IndexedDB) stores everything on the device
- **vite-plugin-pwa** makes it installable and work offline
- **dexie-cloud-addon** (optional) syncs between devices when configured

## Getting started
Requires Node.js 20 or 22 (`node -v` to check).

```sh
cd app
npm install        # first time only: downloads the libraries
npm run dev        # starts the app at http://localhost:5173
npm test           # runs the automated checks
npm run build      # makes the final version in app/dist (what gets hosted)
```

### Trying it on your iPhone (same Wi-Fi)
`npm run dev` prints a "Network" address like `http://192.168.x.x:5173`. Open that in Safari on your phone.
Offline mode and "real" installing only fully work once it's hosted on `https://`.

### Installing on iPhone (once hosted)
Open the site in Safari → Share → **Add to Home Screen**.

## Accounts & sync (optional)
Sync keeps your phone and computer the same, using [Dexie Cloud](https://dexie.org/cloud). It's **off** until you do these steps once. Why this option: `product/accounts.md`.

1. **Create the sync database** (asks for your email and sends you a code):
   ```sh
   cd app
   npx dexie-cloud create
   ```
   This makes two files in `app/`: `dexie-cloud.json` (has your database address) and `dexie-cloud.key` (**secret**, already in `.gitignore`; never commit or share it).
2. **Tell the app the address.** Copy `app/.env.example` to `app/.env` and paste the `dbUrl` from `dexie-cloud.json`:
   ```
   VITE_DEXIE_CLOUD_URL=https://xxxxxxxx.dexie.cloud
   ```
3. **Allow the addresses the app runs at** (sync only works on `https://`, or on `localhost` while developing):
   ```sh
   npx dexie-cloud whitelist http://localhost:5173
   npx dexie-cloud whitelist https://YOUR-USERNAME.github.io   # once it's hosted
   ```
4. **Restart** `npm run dev` (or rebuild and deploy). Then in the app: More → Account & sync → Sign in with email.
5. **Keep it free forever:** new users start on a 30-day trial (counting only days you sync). Sign in to the Dexie Cloud dashboard (linked from dexie.org) and give your own account one of the 3 free permanent ("production") seats.

When sync is turned on, each device asks once whether to copy its earlier data into your account. Pick "Copy" on the device with your real data and "Don't copy" on the others. Nothing is deleted either way.


| File | What it does |
|---|---|
| `src/types.ts` | The shapes of the data (Category, Activity, Session, DayReview, Goal, Settings, Routine) |
| `src/db.ts` | The on-device database, its upgrades between versions, and the starter activities |
| `src/day.ts` | Current day state and building a timeline with untracked gaps |
| `src/days.ts` | Listing days, streaks + freezes, "Did you sleep?" check-ins, overlap handling, gap fill |
| `src/goals.ts` | Goal progress, your baseline, sleep math (wake targets, sleep modes, sleep debt) |
| `src/trends.ts` | Week/month grouping for the Trends tab |
| `src/nudges.ts` | "Still doing X?" |
| `src/backup.ts` | Export (JSON/CSV) and restore |
| `src/cloud.ts` | Whether sync is set up (reads `VITE_DEXIE_CLOUD_URL`) |
| `src/ids.ts` | The `#` fixed ids, and renaming older ones |
| `src/localImport.ts` | Offering to copy pre-sync data into your account |
| `src/palette.ts` | Category colors (tested for color blindness), light/dark versions |
| `src/actions.ts` | Everything that changes data |
| `src/hooks.ts` | Reads live data for the screens |
| `src/App.tsx` | The app shell and tab bar: Today · Plan · (+) · Trends · More |
| `src/screens/TodayScreen.tsx` | The Today tab: live timer, quick start, summary, and the diary (any day, with ‹ ›) |
| `src/tasks.ts` | To-do logic: open hours, due labels, the optional calendar file |
| `src/components/TodoList.tsx` | "To do today", the Later list, and the "Open right now" card |
| `src/components/QuickLog.tsx` | The center + menu, and the goodnight / log past time / "just woke up" flows |
| `src/screens/` | The tabs and the pages inside More |
| `src/components/` | Shared pieces: sheets, editors, review flow, check-in cards, goal bars, timeline |
| `src/styles.css` | All styling, including dark mode |
| `src/*.test.ts` | Automated checks (`npm test`) |
| `scripts/make-icons.mjs` | Draws the app icons (`node scripts/make-icons.mjs`) |

## Snapshots (until git is set up)
`checkpoints/` holds a `.tar.gz` snapshot from before/after each version. See `checkpoints/README.md` to roll back.
