# Sundial — instructions for Claude

Sundial is a time tracker that works like a calorie tracker, but for how you spend your time. It's a personal side project and a way to learn vibecoding. It may become a real app later.

## Read these before doing product or design work
- `mission/mission.md`: who it's for and why it exists
- `mission/principles.md`: rules every feature has to follow (**kind, not shaming; reflect reality**)
- `mission/original-notes.md`: the owner's original words. Treat these as the source of truth for intent.
- `product/features.md`: the full feature design, including the sleep-based "day" model
- `product/roadmap.md`: priority order. **Build in this order. Don't jump ahead.**
- `product/project-goals.md`: the owner's goals for the project itself
- `mission/science.md`: what the research says (sleep, scrolling, tracking, time). Check here before making claims in the UI.
- `product/research-ideas.md`: every research-backed idea, rated for helpfulness and size. An idea bank, not the build order.
- `product/iphone-feasibility.md`: what a home-screen web app can and can't do on iPhone

## About the owner
- Learning to vibecode. **Explain what you're doing in plain language**, and avoid unexplained jargon.
- Uses an **iPhone**. The app has to work well in iPhone Safari and installed to the home screen.
- `README.md` is for code and setup only. Mission and product thinking go in `mission/` and `product/`.

## Technical direction (proposed, confirm with the owner before locking in)
- **PWA** (installable web app) first. A native iOS app comes later, maybe.
- Vite + React + TypeScript, with code in `app/`.
- All data stored on the device (IndexedDB). Data must be exportable. Optional sync between devices via Dexie Cloud (email-code sign-in), off unless configured; see `product/accounts.md`.
- **Store raw timestamped intervals, and derive everything else** (days, streaks, stats). Never store "days" as the source of truth.
- Timers store a start timestamp, not a running counter, so they stay correct when the app is closed.
- Mobile-first UI with big, quick tap targets. Logging must take as few taps as possible.

## Working rules
- Keep `product/roadmap.md` up to date when something gets built or plans change.
- Use neutral language in the UI ("untracked", never "wasted").
- **Mobile first, always.** No browser `<select>` dropdowns; use the custom pickers in `app/src/components/` (ActivityField, Choice). Check at a 390px-wide screen.
- **Feature discussions are "Sun Checks."** Record each one in `product/sun-checks/` (Topics / Decided / Notes), then update `features.md` and `roadmap.md`.

## Committing (the owner forgets, so ask)
- **After finishing a feature, a Sun Check, or any big batch of changes, ask: "Want me to commit and push?"** Also ask if it's been a while (about an hour of work) with nothing committed.
- Only commit or push when the owner says yes. Run the tests and the build first (`cd app && npx vitest run && npm run build`).
- Use clear commit messages that say what changed in plain words.

## Several Claude sessions at once
The owner often runs a few Claude sessions on this project at the same time. To keep from overwriting each other:
- **Before editing a file, check whether someone else changed it** (`git status`, `git diff <file>`, or the file's modified time). If it changed since you last read it, read it again first.
- **Make small, targeted edits.** Never rewrite a whole shared file (especially `app/src/styles.css`, `App.tsx`, `types.ts`, `db.ts`) from an old copy. Add to the end or edit just the lines you need.
- **Stay in your lane.** Stick to the files your task needs. If you have to touch a big shared file, say so.
- **Talk to each other.** Use ListAgents / SendMessage to tell other sessions when you're changing a shared file, adding a database version, or committing.
- **Database versions:** each new table or change needs the next `this.version(N)` in `db.ts`. Check the latest number right before adding one, so two sessions don't both add "version 9".
- For bigger parallel work, a session can use its own git worktree and branch, then merge when done.
