# Original notes (in my own words)

These are the messages I wrote while coming up with the idea, kept word for word so I never have to type them again. Go back to them if a feature drifts from what I meant.

---

## 1. The starting point: three ideas

> I want to have a smaller side project for funsies. Right now we are in the idea stage. I'm trying to learn how to vibecode. I want something to help with time management because my life is a mess right now. A few ideas is a task tracker where you pull things from my byu learning suite and canvas and I track my status, watch the due dates and give myself do dates and stuff like that. another idea is a time tracker like think calorie tracker for how you spend your time. You have goals but either way you log when you wake up, clock in and out of the stuff you do- even if it's scrolling or something. another idea is an accountability thing where you check things off when you're done and if you don't it messages someone. I want to figure out how to make it also work on my phone as an app and once I refine it enough for myself I can maybe make a real app

**Decision:** Build the time tracker first. The task tracker (Canvas/Learning Suite) and accountability messaging could become parts of the same app later.

---

## 2. The time tracker vision

> I want to do the time tracker, but I want it to be pretty in depth. I want to track wake up and sleep to see how your sleep is going over time. I am thinking we have something like myfitnesspal or routines but for time tracking. We can add activities, I want to have sub activities(think homework as an activity, and the sub activities are the class) or maybe catagories(playing games and scrolling are inherently very different but I would catagorize them differently). I want to track time with a clock in/clock out system, and set goals in the app to reach or limit certain activity(this is not a screen time app, like a calorie tracker, we care a lot more about reflecting reality). We can review the day and edit the times. downtime is allowed just collected at the end and when you do the good night stuff if it's over an hour at a time unaccounted for you can add it. Adding activities is easy and it's esay to edit and catagorize it later. you can be able to review your days, weeks, and months and see how you have improved. We try to keep people on it every day with daily streaks. It will be easy to edit previous days, easpecially the previous day if you forgot to do goodnight stuff. It is meant to help people who's life has fallen apart so we can handle the sleep stuff no matter if they are noctornal, pulling all nighters, doing naps at odd times, where we are tracking but also helping them. I want to find a way to give them a sense of "next day" even when they are pulling all nighters sleeping during the day or taking sporadic naps. what do you think are other features to make this the most robust time tracker possible? what is possible, and what is the priority order?

---

## 3. Sleep, encouragement, and streaks

> I want it to be friendly to messed up sleep schedules I want to somewhat encourage better times though and I don't know how to. Maybe a goals system. Eventually both if I make a real thing but I have an iPhone. For the day streaks I like how my calorie tracker does it where if you forget a day you can log what the previous day looked like and it's not for free but you can recover streaks very easily

**Notes:** I'm on iPhone. "Eventually both" means iPhone and Android if it becomes a real app.

---

## 4. Project organization

> I want to make a mission markdown folder that has all of our goals and motivations and reasons and mental stuff and I can add science and stuff and I think that would be really cool and I don't know if this would be the same folder or a different was but a production section with all of the goals we talked about and maybe some goals for time and stuff.

**Decision:** `mission/` holds the why, `product/` holds the what, `README.md` covers code only, and `CLAUDE.md` makes sure every Claude session reads all of it.
