# What's possible on iPhone (as a web app)

Sundial is a web app installed to the home screen (a PWA). That's a great fit for most of it, but iPhone limits what web apps can do. This page records what's possible, so feature ideas can be sized honestly. Researched November 2026. The current version is **iOS 27**. Apple changes things often, so **test anything important on a real iPhone**.

**Size key:** **S** = hours · **M** = days · **L** = weeks · **XL** = needs a native app, a new server, or major work.

## Quick table

| Want | Possible? | Size | Notes |
|---|---|---|---|
| Timers that survive closing the app | ✅ Already done | — | Store the start time and recompute on reopen. This is already how Sundial works. |
| Keep data from being deleted | ✅ Partly | S | `navigator.storage.persist()` is already called. **Deleting the home-screen icon likely deletes its data** (widely reported; not confirmed by Apple). Safari and the installed app keep **separate** data. → Keep backups and sync prominent. |
| Push notifications (reminders) | ✅ With a small server | M–L | Works for home-screen apps since iOS 16.4, after the user taps "allow." **Can't be scheduled without a server.** The Notification Triggers API is dead. Cheapest option: a Cloudflare Worker on a timer (free tier). This would be Sundial's first server. Note: Dexie Cloud (sync) doesn't send pushes. |
| App icon badge (a number on the icon) | ✅ | S | `navigator.setAppBadge()`. Needs notification permission, and only updates while the app is open unless there's push. |
| Calendar **export** (.ics file) | ✅ | S–M | Build the file in the browser and share or download it. iPhone Calendar can import it, **and Calendar then sends its own alerts for free**, with no server. Test inside the installed app. |
| Live calendar subscription URL | ❌ without a server | XL | |
| Read the iPhone calendar | ❌ | — | Not possible from the web. |
| Canvas assignment feed | ⚠️ | S manual / M proxy | Canvas's .ics feed blocks browser fetches (CORS). Either download the file and import it, or run a small proxy. |
| BYU Learning Suite feed | ⚠️ | same as Canvas | Has a per-course calendar feed (all-day events, updated daily). Probably blocked the same way. |
| Share a summary with a friend | ✅ | S | Web Share API: tap → iMessage, etc. The user sends it, free. Sharing an image card is the most reliable. |
| Automated texts to a friend | ❌ practical | XL | Needs a server, an SMS service (Twilio), fees and US registration paperwork, plus consent problems. |
| Auto clock-in when Instagram/TikTok opens | ⚠️ Blocked | XL | An iOS Shortcut can run when an app opens, but its "Open URL" opens **Safari**, whose data is separate from the installed app's. Possible workarounds: a server endpoint (maybe Dexie Cloud's API someday, unverified), or the shortcut keeps its own log for later import. |
| "Pause before Instagram" with a back-out option | ✅ As a Shortcut | S–M | Doesn't need Sundial at all. Wait N seconds, then "Continue / Never mind," where Never mind goes to the Home Screen. The tricky part is skipping the pause right after you chose Continue. Since iOS 17 it can run without asking, but shows a small banner. |
| Screen Time numbers | ❌ | — | Even native apps can't read them out. Apple keeps them sandboxed. No Shortcuts action exists (as far as we know). |
| Apple Health sleep import | ✅ Manual | M | (a) Health → Export All → pick the zip in Sundial and parse it in the browser. Big exports may be too heavy for a phone. (b) A Shortcut gathers recent sleep samples and copies them, then you tap "Paste sleep data" in Sundial. |
| Live HealthKit | ❌ native only | XL | With Capacitor, the `capacitor-health` plugin is maintained (v8.4, Sep 2026). |
| Ambient light sensor ("did I get light?") | ❌ | — | Not supported in Safari. Camera brightness is inaccurate and creepy. → Use a one-tap "☀️ went outside" log instead. |
| Background location ("went outside") | ❌ | — | No background location for web apps. |
| Widgets, Live Activities, Dynamic Island, lock-screen timer | ❌ native only | XL | Needs Swift extensions. |
| Statistics (Sleep Regularity Index, correlations) | ✅ | S–M each | Tiny dataset, runs instantly in the browser. |

## Going native someday (Capacitor)
- **What Capacitor is:** it wraps the existing React app in a real iOS app. Most code is reused.
- **What it unlocks:**
  - Local notifications with **no server**
  - HealthKit
  - Widgets and Live Activities, though those still need hand-written Swift
- **Costs:**
  - A Mac with Xcode
  - **$99/year** Apple Developer Program, for TestFlight or the App Store (confirmed). A free setup works on your own phone but expires about every 7 days.
  - App Store review
- **Data:** the native app has its own storage. Moving over would use export → import or sync.
- **Size:** M to get running, L–XL for widgets and Health.

## Sources
- [WebKit: Web Push for Web Apps on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [WebKit: Declarative Web Push](https://webkit.org/blog/16535/meet-declarative-web-push/)
- [Chrome: Notification Triggers ended](https://developer.chrome.com/docs/web-platform/notification-triggers)
- [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [WebKit: storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/)
- [WebKit: Badging](https://webkit.org/blog/14112/badging-for-home-screen-web-apps/)
- [Shortcuts "Run Immediately"](https://matthewcassinelli.com/automations-run-immediately-shortcuts-notifications/)
- [Apple forum: Screen Time data can't leave its extension](https://developer.apple.com/forums/thread/727958)
- [Canvas feed CORS thread](https://community.canvaslms.com/t5/Canvas-Developers-Group/CORS-Error-when-attempting-to-fetch-Calendar-Feed/m-p/618478)
- [BYU Learning Suite calendar](https://softwaresupport.byu.edu/learning-suite/student/schedule/assignment-updates-on-calendar)
- [caniuse: Ambient Light](https://caniuse.com/ambient-light)
- [capacitor-health on npm](https://registry.npmjs.org/capacitor-health)
- [Apple Developer Program](https://developer.apple.com/programs/enroll/)

**Unverified:**
- Whether deleting the home-screen icon deletes its data. Widely reported, but no official statement found.
- Whether any iOS 27 URL trick opens the installed app from a Shortcut.
- Whether Dexie Cloud's API could accept events from a Shortcut.
