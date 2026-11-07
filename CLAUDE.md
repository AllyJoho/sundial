# Sundial — instructions for Claude

Sundial is a time tracker that works like a calorie tracker, but for how you spend your time. It's a personal side project and a way to learn vibecoding. It may become a real app later.

## Read these before doing product or design work
- `mission/mission.md`: who it's for and why it exists
- `mission/principles.md`: rules every feature has to follow (**kind, not shaming; reflect reality**)
- `mission/original-notes.md`: the owner's original words. Treat these as the source of truth for intent.
- `product/features.md`: the full feature design, including the sleep-based "day" model
- `product/roadmap.md`: priority order. **Build in this order. Don't jump ahead.**
- `product/project-goals.md`: the owner's goals for the project itself

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
