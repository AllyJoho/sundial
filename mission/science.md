# Science & research

What the research actually says about sleep, compulsive scrolling ("dopamine addiction"), self-tracking, and time management, and what that means for Sundial and for real life outside the app.

_Researched November 2026 in three rounds (see the **Research log** at the bottom). Every claim below links to a source someone actually opened (often an abstract, PubMed record, or university press release rather than the full paper). Things that couldn't be verified are listed at the bottom and **should not be used as facts in the app**._

_What we decided to do with all this lives in `product/research-ideas.md` (every idea, rated). What's technically possible on iPhone lives in `product/iphone-feasibility.md`._

> **This is not medical advice.** Some of this (melatonin, ADHD, depression) is stuff to talk through with a doctor or counselor. If things ever feel really heavy, BYU's Counseling and Psychological Services (CAPS) is free for students, and in the US you can call or text **988** any time.

### How to read the evidence labels
- **Strong**: meta-analysis (a study that combines many studies) or several solid randomized trials (RCTs)
- **Good**: at least one solid RCT, or a very large long-term study
- **Some**: small experiments, surveys, or correlations (A goes with B, but we can't be sure A causes B)
- **Expert practice**: what clinicians do, without a trial testing it
- **Myth**: popular claim that the evidence doesn't support

---

## The big picture: 10 things the research agrees on

1. **A regular schedule matters as much as how long you sleep, maybe more.** Students with irregular sleep got worse grades *with the same total hours*. Across 60,000 adults, regularity predicted health better than duration did.
2. **Wake time is the anchor.** The most effective sleep treatment there is (CBT-I) starts with "same wake time every day." Generic "sleep hygiene tips" on their own did basically nothing.
3. **"Dopamine addiction" isn't a real diagnosis, but the struggle is real.** Dopamine drives *wanting* rather than *enjoying*, which is why you can compulsively open an app you don't even like. What's actually going on is **cue-triggered habits** around apps designed to grab "wanting." That's good news: habits respond to known techniques.
4. **Change the environment, not your willpower.** Habits run on cues (place, time, feeling). Friction, distance, and commitment devices beat trying harder. (The "willpower is a battery that runs out" idea failed a 23-lab replication.)
5. **Replace, don't just remove.** Cutting back on phone use helps most when the time goes to people, movement, sleep, or being outside. An empty evening pulls you back to the phone.
6. **Shame makes it worse; self-compassion makes it better.** One slip plus "I'm hopeless" turns into a full relapse (the "what-the-hell effect"). Being kind to yourself after a failure made people try *harder*, not less.
7. **Tracking helps, but only when it leads to a choice.** Writing progress down really does help reach goals. But just *seeing* screen time data rarely changes anything on its own. The mirror needs to come with an optional "want to try something?"
8. **Logging what you do and how it felt is a real depression treatment.** It's called *behavioral activation*, and it's as effective as therapy in trials. It is very close to what Sundial already is.
9. **Time management mostly works by making you feel in control of your time**, which lowers stress and raises life satisfaction. It boosts output less reliably. That fits Sundial: we're aiming for "my time is mine again," not maximum productivity.
10. **Missing a day doesn't ruin a habit.** "21 days" is a myth. Habits took 18 to 250+ days (median ~66), and a single missed day didn't matter.

---

## Part 1: Sleep

### Why sleep matters
| What the research found | Strength | Source |
|---|---|---|
| Sleep loss hits **attention** hardest (zoning out, lapses). Complex reasoning is affected much less. | Strong | Lim & Dinges 2010, *Psychological Bulletin* ([PDF](https://www.med.upenn.edu/uep/assets/user-content/documents/LimDinges2010MetaAnalysis.pdf)) |
| Two weeks of 6h nights caused attention problems similar to up to 2 nights with no sleep, **and people barely felt sleepy**. You can't trust how tired you feel. | Some (lab RCT) | Van Dongen et al. 2003, *Sleep* ([link](https://ntrs.nasa.gov/citations/20040087752)) |
| One good night doesn't undo a bad week. Three 8h recovery nights weren't enough after a week of short sleep. | Some | Belenky et al. 2003, *J Sleep Research* ([link](https://pubmed.ncbi.nlm.nih.gov/12603781/)) |
| Sleep strengthens what you learned that day, and skipping sleep *before* learning makes new memories harder to form. | Strong (field consensus) | Diekelmann & Born 2010, *Nat Rev Neurosci* ([link](https://read.qxmd.com/read/20046194/the-memory-function-of-sleep)) |
| Sleep loss makes the brain's emotional alarm (amygdala) over-react. | Some | Yoo et al. 2007, *Current Biology* ([link](https://news.harvard.edu/gazette/story/2007/02/study-shows-importance-of-sleep-for-optimal-memory-functioning)) |
| Insomnia roughly **doubles** the later risk of depression, and the link runs both ways. | Strong | Li et al. 2016, *BMC Psychiatry* ([link](https://bmcpsychiatry.biomedcentral.com/articles/10.1186/s12888-016-1075-3)) |
| **Improving sleep improves mental health.** Fixing sleep reduced depression, anxiety, and rumination, and bigger sleep gains brought bigger mood gains. This is cause and effect, not just correlation. | Strong (65 RCTs) | Scott et al. 2021, *Sleep Medicine Reviews* ([link](https://pubmed.ncbi.nlm.nih.gov/34607184/)) |
| Over 60% of college students are poor sleepers. | Some (survey) | Lund et al. 2010, *J Adolescent Health* ([link](https://read.qxmd.com/read/20113918/)) |
| Adults 18–25 need about 7–9 hours. | Expert consensus | National Sleep Foundation 2015 ([link](https://www.sciencedaily.com/releases/2015/02/150211132111.htm)) |

### Regularity: the part most people don't know
- **Harvard students (Phillips et al. 2017).** 61 students kept sleep diaries for 30 days. Irregular sleepers had **lower GPAs**, but their **average sleep hours were the same**. Their body clocks ran about **2.6 hours later**, probably because of when they got light. This study created the **Sleep Regularity Index (SRI)**: the chance you're in the same state (asleep or awake) at the same time on consecutive days, from 0 (random) to 100 (perfectly regular). _Some._ ([link](https://www.sciencedaily.com/releases/2017/06/170612094045.htm))
- **UK Biobank (Windred et al. 2024).** 60,977 adults wore wrist trackers. The most regular sleepers had about **20–30% lower risk of dying** during the study than the least regular. **Regularity predicted this better than sleep length did.** The biggest gain was just moving out of the most chaotic group. Caveat: it's observational, and irregular sleep might partly be a *sign* of poor health rather than the cause. _Good._ ([full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC10782501))
- **MIT students (Okano et al. 2019).** Sleep amount, quality, and consistency explained about 25% of grade differences. **The night before the exam didn't matter. The week and month before did.** _Some._ ([link](https://dspace.mit.edu/handle/1721.1/127257))
- **Social jet lag** is the gap between your sleep timing on school days and free days. About 69% of people have at least 1 hour of it, and it's linked to worse health. ([link](https://pmc.ncbi.nlm.nih.gov/articles/PMC5564947))
- **Weekend catch-up sleep** is better than nothing, but it doesn't fully "repay" the debt. In one study, people who caught up on weekends still had worse blood sugar control. _Some._ (Depner et al. 2019, [link](https://www.sciencedaily.com/releases/2019/02/190228113534.htm))

### How to actually fix chaotic sleep
**CBT-I (cognitive behavioral therapy for insomnia) is the first-line treatment, ahead of sleeping pills.** It's well proven (_Strong_: Trauer et al. 2015, [link](https://pubmed.ncbi.nlm.nih.gov/26054060/)). A 2024 study of 241 trials checked which parts actually work (Furukawa et al., *JAMA Psychiatry*, [link](https://www.eurekalert.org/news-releases/1030979)):
- ✅ **Fixed wake time + limiting time in bed to roughly the sleep you actually get** (called "sleep restriction"). You widen it as sleep improves.
- ✅ **Bed is only for sleep:** go to bed when sleepy, and get up if you can't sleep (called "stimulus control").
- ✅ **Working on anxious thoughts about sleep** (called "cognitive restructuring").
- ❌ **"Sleep hygiene" education on its own** (no caffeine, dark room, etc.) did essentially nothing by itself.
- ❌ Relaxation exercises: possibly counterproductive.
- ➖ **Keeping a sleep diary was "inert" as a treatment ingredient.** Logging alone isn't therapy, but the diary is what makes the effective steps possible.
- Verified numbers: the odds of remission went up when each ingredient was added. Cognitive restructuring was ×1.68, sleep restriction ×1.49, stimulus control ×1.43, sleep hygiene ×1.01 (no effect), relaxation ×0.81. Therapist-led, in-person delivery worked best. ([full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC10794978/))

**Apps can deliver CBT-I.** Sleepio and SHUTi both work in RCTs. In the SHUTi trial, about 57% were in remission after a year vs 27% with education only. _Good._ ([Sleepio](https://pmc.ncbi.nlm.nih.gov/articles/PMC3353057), [SHUTi](https://psychnews.psychiatryonline.org/doi/10.1176/appi.pn.2017.1a12)). In a trial with 3,755 university students, digital CBT-I also improved mental health (Freeman et al. 2017, *Lancet Psychiatry*, [link](https://eprints.gla.ac.uk/148519)).

**Light is the main way to move your body clock.**
- Morning light moves it **earlier**. Evening light moves it **later**.
- Normal indoor lighting (~25 lux) is enough to cut evening melatonin by half in a typical person, and people vary more than 50× in how sensitive they are. ([Phillips et al. 2019, *PNAS*](https://pmc.ncbi.nlm.nih.gov/articles/PMC6575863))
- A week of camping with only natural light moved people's clocks about **2 hours earlier**, and night owls caught up with everyone else. ([Wright et al. 2013](https://www.sciencedaily.com/releases/2013/08/130801125601.htm))
- In lab studies, moving a schedule **1 hour/day** earlier with morning bright light worked; **2 hours/day was too fast** for the body clock to keep up. ([Revell et al. 2006](https://pubmed.ncbi.nlm.nih.gov/16263827/))
- In real life (no light box), one treatment study for teens with delayed sleep moved **wake time 30 min earlier per day** ([Gradisar group, *Sleep Medicine* 2019](https://pubmed.ncbi.nlm.nih.gov/30763869/)). No source was found for "15 min/day." Gentler-than-30 is a reasonable choice, but it's _expert judgment_, not a tested number.

**Melatonin: timing matters more than dose.** _Talk to a doctor first._
- For night owls with a severely delayed schedule (called delayed sleep-wake phase disorder), a trial used **0.5 mg about 1 hour before the desired bedtime**, plus a fixed bedtime. People fell asleep 34 min earlier than with a placebo. Interestingly, the placebo group *also* improved, because the fixed bedtime itself helped. ([Sletten et al. 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC6005466)) _Good._
- 0.5 mg shifts the clock about as much as 3 mg when timed right. ([Burgess et al. 2010](https://pubmed.ncbi.nlm.nih.gov/20410229/))
- ⚠️ Supplement labels are unreliable: 22 of 25 melatonin gummies were mislabeled, some with up to 347% of the listed dose. ([Cohen et al. 2023, *JAMA*](https://www.spokesman.com/stories/2023/apr/26/22-out-of-25-melatonin-products-were-mislabeled-st))

**Other things that matter:**
- **Naps:** a **10-minute** nap gave an immediate boost lasting ~2.5 hours. A 30-min nap made people groggy first. ([Brooks & Lack 2006](https://pubmed.ncbi.nlm.nih.gov/16796222/)) _Some._
- **Caffeine:** a big dose 6 hours before bed cut more than 1 hour of sleep, and people **didn't notice**. ([Drake et al. 2013](https://aasm.org/late-afternoon-and-early-evening-caffeine-can-disrupt-sleep-at-night/)) _Some._
- **Alcohol** helps you fall asleep but breaks up the second half of the night. ([link](https://www.livescience.com/26489-alcohol-sleep.html))
- **Evening exercise is fine.** It doesn't hurt sleep, except maybe very hard exercise within an hour of bed. ([Stutz et al. 2019 meta-analysis](https://www.sciencedaily.com/releases/2018/12/181213112057.htm))
- **Screens and blue light: overstated.** Reading on an iPad for 4 hours a night delayed sleep by only ~10 minutes ([Chang et al. 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4313797)). In 11,884 teens, each hour of screen time went with only ~9 min less sleep ([Orben & Przybylski 2020](https://www.ox.ac.uk/node/1475052)). **What matters more is that the phone keeps you up past when you meant to sleep.**
- **Bedtime procrastination** means "not going to bed when you intended, with nothing stopping you." It's real, and it feeds on itself together with problematic phone use. ([Kroese et al. 2014](https://research-portal.uu.nl/en/publications/bedtime-procrastination-introducing-a-new-area-of-procrastination/); [2024 student study](https://doaj.org/article/57b3f4af73a14053bba592bb27e58e79)) The "revenge" version is a social-media term with little research behind it.

### All-nighters
- About 60% of students had pulled one, and they had somewhat lower GPAs. _Some (correlation)._ ([Thacher 2008](https://aasm.org/college-students-who-pull-all-nighters-and-get-no-sleep-more-likely-to-have-a-lower-gpa/))
- Sleep-deprived students did worse on tests **but thought they'd done fine**. ([Pilcher & Walters 1997](https://scilit.com/publications/123b67318dcab08ee4bf1eb86bb2ab5c))
- The kind takeaway: **one all-nighter isn't a catastrophe; the pattern is what matters** (Okano). Afterward, go back to your usual wake time instead of sleeping until 3pm, and expect a few nights to recover.

### Night owls
- **Being a night owl is real and partly genetic** (351 genetic regions found in about 700,000 people; [Jones et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/6351539)).
- **People are at their latest around age 20**, then gradually get earlier. ([Roenneberg et al. 2004](https://www.nature.com/news/2004/041229/full/news041229-5.html)) A college student is at peak biological lateness. That's not laziness.
- Light still moves it a lot (see camping). Being a night owl is part genes, part environment.
- So **"steady at a later time" is a fair goal**, and forcing very early hours creates social jet lag. (No trial has directly compared "regular but late" vs "irregular but early," but everything points the same way.) This backs up principle #4.

### Sleep tracking: careful
- **"Orthosomnia"** is when people got so fixated on tracker scores that they stayed in bed longer to boost them, which made their sleep *worse*. ([Baron et al. 2017](https://www.sciencedaily.com/releases/2017/02/170228185322.htm)) _Some (case reports)._
- People who sleep about 5h overestimate their sleep by about 1.2h. Day-by-day logging is more accurate than "I usually sleep…" ([Lauderdale et al. 2008](https://pubmed.ncbi.nlm.nih.gov/18854708/))
- Sleep diaries are a **core tool** in CBT-I ([Consensus Sleep Diary](https://pmc.ncbi.nlm.nih.gov/articles/PMC3250369)). Logging alone doesn't fix sleep, but it gives you the data the effective steps need.

### Split sleep, long naps, and what counts as "main sleep" (round 4)
_Researched because of a real 4½-hour accidental nap. The decisions it led to are in `product/research-ideas.md` → "Sleep classification spec."_

**Is "first sleep / second sleep" natural?** It's a normal thing human sleep *can* do, but it isn't proven to be the "natural" or better way.
- A historian found many references in pre-industrial European writing to a "first sleep" and "second sleep," with an hour or so awake in between ([Ekirch 2001, *American Historical Review*](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11655156/)). Another historian argues those texts can be read differently ([Boyce 2023, *Medical History*](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10404514/)). _Contested._
- In a famous experiment, men given **14 hours of darkness** every night started sleeping in two blocks with 1–3 hours awake in between ([Wehr 1992](https://doi.org/10.1111/j.1365-2869.1992.tb00019.x)). _Small, never directly replicated, and it needed very long nights._
- Modern hunter-gatherers (Hadza, San, Tsimane) mostly slept in **one block** ([Yetish et al. 2015](https://escholarship.org/content/qt0rk1h44n/qt0rk1h44n.pdf)). But Hadza napped on about half of days ([Samson et al. 2017](https://digitalscholarship.unlv.edu/anthro_fac_articles/382)), and Madagascar farmers napped on 89% of days and often had a waking period after midnight ([Samson et al. 2017](https://doi.org/10.1002/ajhb.22979)). _Observational._

**Total sleep across 24 hours is what matters most for alertness, however it's split.**
- 90 people on 18 schedules mixing a shorter night with a daytime nap: alertness depended mainly on **total sleep time per 24h**, not how it was divided ([Mollicone et al. 2008](https://rex.libraries.wsu.edu/esploro/outputs/journalArticle/Response-surface-mapping-of-neurobehavioral-performance/99900548095201842)). _Good (lab)._
- Teens getting the same 6.5h total: **5h night + 1.5h nap did as well or better on alertness, memory, and mood than 6.5h in one block**, but blood sugar control was worse. Both were worse than 9h. ([Lo et al. 2019, *Sleep*](https://www.duke-nus.edu.sg/nbd/sleeplab/publication/publications/detail/index/differential-effects-of-split-and-continuous-sleep-on-vigilance-and-glucose-tolerance-in-sleep-restricted-adolescents)) _Good (RCT, 58 teens)._
- **Daytime sleep is shorter and lighter than night sleep**, because the body clock pushes you awake during the day. Daytime-only sleepers got the least sleep ([Jackson et al. 2014](https://research.monash.edu/en/publications/investigation-of-the-effectiveness-of-a-split-sleep-schedule-in-s/)). Night-shift workers' day sleep averages about 5–6h ([Rajaratnam et al. 2013](https://www.mja.com.au/journal/2013/199/8/sleep-loss-and-circadian-disruption-shift-work-health-burden-and-management)).
- **Polyphasic schedules** (e.g., "Uberman," 2h a day in naps): a National Sleep Foundation review found **no evidence of benefit** and links to harm via sleep loss ([Weaver et al. 2021](https://pubmed.ncbi.nlm.nih.gov/33795195/)). _Myth._

**What a 4½-hour daytime sleep is**
- **It's real sleep:** about three sleep cycles, including deep sleep that uses up the "sleep pressure" built while awake.
- **That's why a long or early-evening nap makes it harder to fall asleep that night and gives less deep sleep then** ([Werth et al. 1996](https://openresearch.surrey.ac.uk/permalink/44SUR_INST/15d8lgh/alma99515648202346)).
- **Waking from long, deep sleep causes stronger grogginess** ("sleep inertia"), especially when you were already short on sleep ([Hilditch & McHill 2019](https://www.dovepress.com/sleep-inertia-current-insights-peer-reviewed-fulltext-article-NSS)).
- **In 440 college students, naps over 2 hours, or more than 3 a week, went with the worst sleep quality.** Naps between 6–9pm went with shorter school-night sleep. ([Ye et al. 2015](https://pubmed.ncbi.nlm.nih.gov/25397662/)) _Observational._ So long, late naps are both a **sign** of sleep debt and a **cause** of later bedtimes. A loop, not a character flaw.
- **"Long naps are deadly" headlines:** naps of 60+ min/day are linked to more heart disease and death ([Yamada et al. 2015 meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC4667384/)). But this is observational: sick and sleep-deprived people nap more. It's a **sign of sleep debt, not proof naps cause harm.** Don't put scary claims in the app.

**How others decide "main sleep" vs nap**
- **There's no official cutoff.** The clinical sleep diary only asks about naps as an optional extra ([Consensus Sleep Diary](https://pmc.ncbi.nlm.nih.gov/articles/PMC3250369/)).
- A common research wrist-tracker program treats rest periods **longer than 3 hours** as "major" ([Chow et al. 2016](https://www.dovepress.com/defining-the-rest-interval-associated-with-the-main-sleep-period-in-ac-peer-reviewed-fulltext-article-NSS)).
- Garmin reportedly counts naps only if **under 3 hours** (secondary source).
- Fitbit marks the **longest sleep of the day** as main.
- Oura detects naps of 15+ minutes.
- **So 3 hours is a sensible software convention, not biology.**
- The **Sleep Regularity Index** counts all sleep, naps included, as "asleep." It doesn't care which block is "main."

---

## Part 2: "Dopamine addiction," phones, and compulsive habits

### What dopamine actually does
- **Dopamine is a learning and "wanting" signal, not a pleasure chemical.** Dopamine cells fire hardest when something is *better than expected* and barely respond to rewards you saw coming. ([Schultz, Dayan & Montague 1997, *Science*](https://web.math.princeton.edu/~sswang/fundamental-readings-for-Wang-lab-members/schultz_montague97_science.pdf)) _Strong._
- **"Wanting" and "liking" are separate brain systems.** Dopamine drives wanting. Enjoyment runs mostly on other systems. That's why you can feel pulled to an app that doesn't even feel good. ([Berridge & Robinson 1998](https://go.drugbank.com/articles/A1545); [2009 review](https://www.wisebrain.org/media/Papers/BerridgeRobinson&AldridgeDissectingcomponentsofrewardCurrentOpinPharm2009.pdf)) _Strong._
- **Social media follows reward-learning rules.** In over a million posts, people posted more after getting more likes, just like the way animals learn from rewards. ([Lindström et al. 2021, *Nature Communications*](https://www.uva.nl/en/content/news/press-releases/2021/02/we-post-so-much-on-social-media-because-we-learn-from-rewards.html)) _Strong._
- "Infinite scroll is a slot machine" is a reasonable comparison, but nobody has tested it directly. _Expert opinion._

### "Dopamine detox": mostly myth
- The psychologist who coined "dopamine fasting" said it was **"just a way of saying stimulus control,"** a standard CBT technique: avoid the *triggers* for impulsive behaviors. He admitted the name is "technically incorrect." ([summary](https://en.wikipedia.org/wiki/Dopamine_fasting))
- The viral version (no food, no music, no talking to "reset your dopamine") has no evidence behind it. Neuroscientists call "lowering your dopamine" basically meaningless. A short break doesn't erase a habit; change takes *new learning*. ([The Scientist, 2024](https://www.the-scientist.com/debunking-the-dopamine-detox-trend-72036))
- *Dopamine Nation* (Anna Lembke) is clinically useful, but its "pleasure-pain seesaw" is a **metaphor** borrowed from drug research, not something measured for scrolling. _Expert opinion._

### Is it an addiction?
- For phones and social media, researchers mostly say **"problematic use,"** not "addiction." There isn't enough evidence for a separate disorder yet. ([Panova & Carbonell 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC6174603))
- **Gaming disorder *is* an official diagnosis** (ICD-11). It requires loss of control, gaming taking priority over life, and continuing despite harm for about a year. Most heavy gamers don't meet it. ([link](https://findacode.com/icd-11/code-1448597234.html))
- On average across teens, tech use explains very little of wellbeing ([Orben & Przybylski 2019](https://www.oii.ox.ac.uk/technology-use-explains-at-most-0-4-of-adolescent-wellbeing/)). But averages hide individuals who are strongly affected, and the debate (Haidt vs. critics) is still heated.
- **Depression is clearly linked to problematic phone use** (anxiety less so), but it may run in either direction. ([Elhai et al. 2017](https://static1.squarespace.com/static/56916e4805f8e207077fb3ed/t/57fce0a546c3c455d8fa155e/1476190374392/ElhaiDvorakLevineHall2017.pdf))
- **People often scroll to cope** with stress, loneliness, boredom, or low mood. The problem is the unmet need underneath plus the escape habit, not just the device. ([Kardefelt-Winther 2014](https://dblp.org/rec/journals/chb/Kardefelt-Winther14a))
- **Boredom** is linked to problematic tech use across 59 studies. ([related review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12384929/))
- **Sleep loss amplifies "wanting"** and impulsivity, which can feed a loop: late scrolling → less sleep → more scrolling. ([link](https://sites.duke.edu/huettellab/files/2013/07/2013_Sleep_Libedensky.pdf)) _Some (mixed)._

### What has been tested and worked
| What | What happened | Strength | Source |
|---|---|---|---|
| **4 weeks off Facebook** | More offline activities, small but real wellbeing gains, and people **kept using it less afterward** | Good (RCT, ~2,800 people) | [Allcott et al. 2020, *AER*](https://www.nber.org/papers/w25514) |
| **Self-set screen limits** (a commitment device) | Substantially cut use, and the effects lasted, which suggests habits were changing | Good (RCT, ~1,900) | [Allcott, Gentzkow & Song 2022](https://www.povertyactionlab.org/media/file-research-paper/digital-addiction) |
| **Social media capped at ~30 min/day for 3 weeks** | Less loneliness and depression, especially for students who started out more depressed | Some (RCT, 143 students) | [Hunt et al. 2018](https://penntoday.upenn.edu/news/social-media-use-increases-depression-and-loneliness) |
| **Blocking mobile internet for 2 weeks** (calls/texts still worked) | Screen time halved; wellbeing, mental health, and attention improved. Gains came partly from **more socializing, exercise, sleep, and time outside**. Only 25% fully stuck to it. | Good (preregistered RCT, 467) | [Castelo et al. 2025, *PNAS Nexus*](https://academic.oup.com/pnasnexus/article/4/2/pgaf017/8016017) |
| **A pause with the option to back out before an app opens** | App openings dropped 57%. **The option to back out did the work; a "reflect on this" message alone did nothing.** | Some (field study, no control group) | [Grüning et al. 2023, *PNAS*](https://pmc.ncbi.nlm.nih.gov/articles/PMC9974409) |
| **Notifications batched 3×/day** | Less stress, more control. **Turning notifications off completely *increased* anxiety and FOMO.** | Good (randomized field study) | [Fitz et al. 2019](https://scholars.duke.edu/publication/1402953) |
| **Grayscale screen** | About 20 min/day less screen time, more sense of control | Some | [overview](https://doaj.org/article/5665cb9f421447b792d3ed7c0377a603) |
| **Phone in another room ("brain drain")** | Original study: the phone's mere presence lowered focus. **A direct replication failed.** Contested. | Mixed | [Ruiz Pardo & Minda 2022](https://pubmed.ncbi.nlm.nih.gov/36007374/) |

**What the combined studies say about detoxes:** honestly mixed. Some studies show benefits, some show none, a few show harm ([Radtke 2022](https://refubium.fu-berlin.de/handle/fub188/38053?show=full)). Breaks seem to need **at least 1–3 weeks** to help ([Ferguson 2024 + reanalysis](https://scholar.usuhs.edu/en/publications/social-media-reduction-or-abstinence-interventions-are-providing-/)), and **cutting back worked about as well as quitting entirely** ([Burnell et al. 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12421657)). Friction and limits reliably cut *use*, but less use doesn't always mean a better mood ([Zimmermann & Sobolev 2023](https://pubmed.ncbi.nlm.nih.gov/36577008/)). The mood gains seem to come from **what you do instead**.

### Psychological tools with evidence
- **Habits run on context cues** (place, time, mood). Intentions barely touch them. Changing your surroundings works better than willpower. ([Wood & Rünger 2016](https://pubmed.ncbi.nlm.nih.gov/26361052/)) _Strong._
- **If-then plans** ("If I get in bed, then my phone charges on the desk") help, but less than once claimed. The effect is smaller after correcting for publication bias, and weaker for *stopping* behaviors than starting them. ([summary](https://www.thebehavioralscientist.com/glossary/implementation-intentions))
- **Urge surfing** means noticing an urge rise and fall like a wave without acting on it. In a smoking trial, urges stayed the same but people smoked less. ([Bowen & Marlatt 2009](https://pubmed.ncbi.nlm.nih.gov/20025372/)) _Some._
- **Other rewarding activities protect you.** Students with fewer rewarding non-substance activities drank more. This applies to phones too in theory, though that's untested. ([Acuff et al. 2023](https://www.nature.com/articles/s44159-023-00167-y))
- **Movement cuts cravings in the short term.** This was shown for cigarettes; for phones it's plausible but untested. ([Haasova et al. 2013](https://ore.exeter.ac.uk/repository/handle/10871/13951))
- **CBT works for gaming disorder** in the short term. ([Stevens et al. 2019](https://pubmed.ncbi.nlm.nih.gov/30341981/))

### When it might be more than habits
- **ADHD:** ADHD symptoms are consistently linked to problematic phone and internet use ([meta-analysis](https://pubmed.ncbi.nlm.nih.gov/37866293)). **Consider an evaluation if** focus, forgetting, or impulsivity problems **go back to childhood**, show up **in several parts of life** (not just school), and **stay even when sleep and mood are okay**. Women are often missed as kids. ([NIMH](https://www.nimh.nih.gov/health/publications/could-i-have-adhd/)) Note that sleep loss, depression, and anxiety can all mimic ADHD-like problems.
- **Depression:** when nothing feels fun anymore (called *anhedonia*), scrolling can be what's left. That makes it a **symptom worth taking seriously, not a character flaw.** Depression is very treatable.
- If it feels out of control, or grades, sleep, or relationships are suffering, a counselor or doctor can genuinely help. CBT and behavioral activation both have real evidence.

### Shame and slip-ups
- **The "abstinence violation effect":** a slip plus self-blame ("I'm weak") often turns into a full relapse ("I already blew it"). Relapse-prevention therapy treats slips as **expected and learnable**. Boredom and negative emotions are top relapse triggers. ([Larimer, Palmer & Marlatt 1999](https://pmc.ncbi.nlm.nih.gov/articles/PMC6760427)) _Strong (established clinical model)._

---

## Part 3: Self-tracking, streaks, goals, and being kind to yourself

### Does tracking work?
- **Yes.** Across 138 trials, monitoring your progress moderately improved goal success. It worked better when progress was **physically recorded** and (tentatively) when shared with someone. ([Harkin et al. 2016, *Psychological Bulletin*](https://eprints.whiterose.ac.uk/87431)) _Strong._
- Self-monitoring works best combined with **goals, feedback, and reviewing your goals**. ([Michie et al. 2009](https://pubmed.ncbi.nlm.nih.gov/19916637/)) _Strong._
- **The calorie-tracker comparison holds up, more modestly than the headlines say.** In 1,685 dieters, each extra day per week of food-diary keeping went with about **0.5–0.7 kg more weight lost**. It was correlational, with no control group. The paper never says "twice as much"; that phrase came from press coverage. ([Hollis et al. 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2515566/))
- **But seeing data alone rarely changes behavior.** Pop-up warnings about too much phone use didn't reduce it. ([Loid et al. 2020](https://datalearner.com/academic/journal-papers/0747-5632/volumes-and-issues/214/paper-detail/38165)) Awareness is necessary but not enough. It needs to connect to a choice.

### People are bad at remembering where time went
- Across 47 studies, people's estimates of their own phone use matched reality only moderately. ([Parry et al. 2021, *Nature Human Behaviour*](https://experts.illinois.edu/en/publications/a-systematic-review-and-meta-analysis-of-discrepancies-between-lo/)) In one small study (23 people), people used their phones about **85 times a day but guessed 37**, more than double. Their guesses didn't track reality at all. Interestingly, their guesses of *total time* were roughly right. People are bad at counting pickups, not hours. ([Andrews et al. 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4625000/))
- Diaries and "how much do you usually…" questions give different answers. ([BLS 2016](https://www.bls.gov/osmr/research-papers/2016/st160340.htm))
- **The Day Reconstruction Method:** rebuilding yesterday as a series of scenes ("woke up, then… then…") and rating each one is a validated, low-effort way to capture a day. ([Kahneman et al. 2004, *Science*](https://pubmed.ncbi.nlm.nih.gov/15576620/)) **This is the scientific model for Sundial's backfill / streak-recovery feature.**

### Streaks: helpful, with a catch
- **Seeing an unbroken streak makes people keep going; seeing a broken one makes them quit more.** The effect is **weaker when the streak can be repaired** and **stronger when people blame themselves.** ([Silverman & Barasch 2023, *J Consumer Research*](https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions)) _Good (7 studies)._ → **This directly supports Sundial's backfill-to-recover design.**
- **The "what-the-hell effect":** after breaking a self-imposed rule, people abandon it entirely. In a classic study, dieters ate *more* ice cream after being made to "blow" their diet with a milkshake. ([Herman & Mack 1975](https://www.ssib.org/web/classic17.php)) The effect may be weaker than once thought.
- **Points and prizes for doing something can kill your enjoyment of it**, but positive *feedback* increases it. ([Deci, Koestner & Ryan](https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf)) _Strong._
- Gamification has small positive effects that **fade over months**. ([Sailer & Homner 2020](https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056); [Mazeas et al. 2022](https://jmir.org/2022/1/e26779))

### Self-compassion beats self-criticism
- After failing a test, people told to be **self-compassionate studied longer** for the next one than people given a self-esteem boost or nothing. ([Breines & Chen 2012](https://pubmed.ncbi.nlm.nih.gov/22645164/)) _Good (4 experiments)._
- **Students who forgave themselves** for procrastinating on exam 1 procrastinated less on exam 2. ([Wohl et al. 2010](https://bps.org.uk/research-digest/cure-procrastination-forgive-yourself)) _Some._
- Dieters given a short self-compassion message after "breaking" their diet **ate less** afterward, the opposite of the what-the-hell effect. ([Adams & Leary 2007](https://scholars.duke.edu/publication/782823)) _Some._
- Self-compassion training reduced self-criticism, rumination, and depression across 27 RCTs. ([Ferrari et al. 2019](https://contextualscience.org/publications/ferrari_hunt_harrysunker_abbott_beath_einstein_2019))
- **Kindness isn't letting yourself off the hook. It's what makes the next try possible.**

### Goals
- Specific goals you're committed to beat "do your best." ([Locke & Latham 2002](https://goal-lab.psych.umn.edu/orgpsych/2020/readings/5.%20Motivation/Locke%20&%20Latham%20(2002).pdf))
- **Short-term goals** built skill, confidence, *and* interest in kids who were behind. ([Bandura & Schunk 1981](https://files.eric.ed.gov/fulltext/ED199284.pdf)) → Start small from your real baseline (principle #5).
- **WOOP** (Wish, Outcome, Obstacle, Plan): imagine the goal, name what might get in the way, then make an if-then plan. Small-to-medium effect. ([Wang et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8149892))
- **Small wins:** progress on meaningful work was the best part of people's days, in 12,000 diary entries. ([Amabile & Kramer](https://hbswk.hbs.edu/item/6685.html))
- **The fresh start effect:** people are more likely to work on goals after a "new beginning" like a Monday, the 1st of the month, or a birthday. ([Dai, Milkman & Riis 2014](https://faculty.wharton.upenn.edu/wp-content/uploads/2014/06/Dai_Fresh_Start_2014_Mgmt_Sci.pdf))
- **Habits took 18–254 days (median ~66), and missing one day didn't matter.** "21 days" is a myth. In the paper's words, "missing one opportunity to perform the behaviour did not materially affect the habit formation process." Caveat: only 39 of 96 people's data fit the model well, and the 254 is a projection. ([Lally et al. 2010](https://bps.org.uk/research-digest/how-form-habit))
- **Reminders helped people repeat a behavior but *got in the way* of it becoming automatic.** Linking it to something you already do ("after I brush my teeth…") built the habit better. ([Stawarz et al. 2015](https://discovery.ucl.ac.uk/id/eprint/1468224/))
- ❌ **"Willpower is a battery that runs out" (ego depletion) failed** a 23-lab replication (effect ≈ 0). ([Hagger et al. 2016](https://cris.maastrichtuniversity.nl/en/publications/a-multilab-preregistered-replication-of-the-ego-depletion-effect/))

### The downsides of tracking
- **Measuring an activity made people do more of it but enjoy it less.** ([Etkin 2016](https://www.fuqua.duke.edu/duke-fuqua-insights/etkin-counting-steps)) → Leisure shouldn't feel like it's being graded.
- People abandoned about **80% of tracking devices within two months**: too much upkeep, data that wasn't useful, or it didn't fit how they saw themselves. ([Lazar et al. 2015](https://thatlab.umd.edu/papers/2015_p635-lazar.pdf))
- **Lapsing and coming back is a normal part of tracking**, not failure. ([Epstein et al. 2015](https://library.selfresearch.org/research/a-lived-informatics-model-of-personal-informatics/)) Some people quit trackers for good reasons, because they got what they needed. ([Clawson et al. 2015](https://ecl.cc.gatech.edu/node/242))

### Mood ratings and reflection
- **Naming a feeling** ("frustrated") calms the brain's alarm center. ([Lieberman et al. 2007](https://pubmed.ncbi.nlm.nih.gov/17576282/)) → Supports the goodnight mood rating.
- Teens who tracked their mood on their phones gained emotional self-awareness, linked to fewer depressive symptoms. ([Kauer et al. 2012](https://www.jmir.org/2012/3/e67/))
- Expressive writing helps, but only a little. ([Frattaroli 2006](https://stafforini.com/works/frattaroli-2006-experimental-disclosure-its/))
- Gratitude journaling beats doing nothing but is **no better than other positive exercises**, and some famous results didn't replicate. ([Davis et al. 2016](https://bvbvf1.bib-bvb.de/vufind/PrimoRecord/cdi_proquest_miscellaneous_1760876509))

---

## Part 4: Time management, procrastination, and mood

### Does time management work?
- Across 158 studies (~53,000 people), time management was linked **more strongly to wellbeing and life satisfaction than to performance**, and to less distress. Mostly correlational. ([Aeon, Faber & Panaccio 2021, *PLOS ONE*](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0245066)) _Strong._
- **Feeling in control of your time** was the time-management factor that mattered most for students' stress and satisfaction, more than lists or schedules themselves. ([Macan et al. 1990](https://sdlab.fas.harvard.edu/resource/hoffmacan1990timemanagementperceivedstressandperformancepdf))
- Time management training improves skills and lowers stress, but doesn't automatically improve performance. ([Claessens et al. 2007](https://www.emerald.com/insight/content/doi/10.1108/00483480710726136/full/html); [Häfner et al.](https://synapsesocial.com/papers/W2042055797))

**What's hype:**
- **Pomodoro:** fixed breaks made studying feel better but didn't increase output. There's nothing special about 25 minutes. ([Biwer et al. 2023](https://pubmed.ncbi.nlm.nih.gov/36859717/)) Fine as a comfort tool.
- **Eisenhower matrix:** the tool itself is untested. Its idea is supported, though: people do pick urgent-but-unimportant tasks over important ones ([Zhu et al. 2018](https://hub.jhu.edu/2018/05/31/meeting-deadlines-time-management-behaviors)).
- **"Eat the frog":** no studies. It may backfire for anxious people.
- **5am clubs:** no studies, and a poor fit for a 20-year-old's biology. **Consistent beats early.**
- **"21 days to form a habit":** myth (see Lally).

### Procrastination is about feelings, not laziness
- Procrastination is predicted by **how unpleasant a task feels, how far away the payoff is, low confidence, and impulsiveness**. ([Steel 2007](https://prism.ucalgary.ca/handle/1880/47914)) _Strong._
- It's **short-term mood repair**: escaping a bad feeling now and handing the cost to future-you. ([Sirois & Pychyl 2013](https://eprints.whiterose.ac.uk/91793/))
- Procrastinating students felt *less* stressed early in the semester, then had **more stress, more illness, and lower grades** by the end. ([Tice & Baumeister 1997](https://www.psychologicalscience.org/observer/why-wait-the-science-behind-procrastination))
- **Online CBT for procrastination works** (moderate effects). ([Rozental et al. 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC3841370)) Interventions in general help modestly. ([van Eerde & Klingsieck 2018](https://ris.uni-paderborn.de/record/29118))

### The planning fallacy (and why a time tracker can fix it)
- People underestimate how long their own tasks take. Only about 30% of students finished their thesis by their own predicted date, and even their "worst case" guesses were too optimistic. ([Buehler, Griffin & Ross 1994](https://bear.warrington.ufl.edu/brenner/mar7588/Papers/buehler-et-al-1994.pdf)) _Strong (widely replicated)._
- **What fixes it:** breaking a task into parts ([Kruger & Evans 2004](https://en.wikipedia.org/wiki/Planning_fallacy)), and **explicitly connecting past performance to the new prediction**. Just "remembering" past tasks didn't help, because **people underestimate how long past tasks took, too**: "People appear to underestimate future event duration because they underestimate past event duration" ([Roy, Christenfeld & McKenzie 2005, *Psychological Bulletin*](https://pubmed.ncbi.nlm.nih.gov/16187856/)). **Logged durations beat memory.** Sundial can do something here that almost no planning tool does.

### Behavioral activation (BA): the strongest science behind Sundial's core idea
**Behavioral activation is a depression treatment that is basically "log what you do and how it felt, then gently schedule more of what helps."**
- It beat control conditions for depression and was at least as good as medication ([Ekers et al. 2014](https://pubmed.ncbi.nlm.nih.gov/24936656/), 26 RCTs). _Strong_, though study quality was mostly low.
- Delivered by junior staff with no therapy training, it worked **as well as CBT from professional therapists**. ([Richards et al. 2016, *Lancet*](https://eprints.gla.ac.uk/180290)) _Good (440 people)._
- It also raises wellbeing in people who *aren't* depressed. ([Mazzucchelli et al. 2010](https://espace.curtin.edu.au/handle/20.500.11937/22164))

**How BA works** ([Mastery & Pleasure Diary](https://www.psychologytools.com/resource/mastery-and-pleasure-activity-diary)):
1. Log what you do, hour by hour, for about a week. Don't change anything yet. This is just your baseline.
2. Rate each activity for **enjoyment** (0–10) and **accomplishment** (0–10). Accomplishment counts even if it wasn't fun.
3. Look for patterns. What lifts your mood? What flattens it? What's avoidance?
4. Pick what matters to you and **schedule small** enjoyable and accomplishing activities.
5. **Act on the plan, not the mood.** Action comes first and motivation follows ("outside-in").

**Step 1 is literally Sundial.** Step 2 is the next natural feature.

### Time and wellbeing
- **Feeling you have enough time** predicts wellbeing, even after accounting for income. ([Kasser & Sheldon 2009](https://link.springer.com/doi/10.1007/s10551-008-9696-1))
- **Believing leisure is wasteful makes you enjoy it less**, and is linked to more depression, anxiety, and stress. ([Tonietto et al. 2021](https://business.rutgers.edu/sites/default/files/documents/tonietto-viewing-leisure-as-wasteful-undermines-enjoyment.pdf)) → Big implication for how Sundial labels leisure.
- Rest that actually restores you includes **mentally switching off, relaxing, learning or challenge, and having control over your time**. ([Sonnentag & Fritz 2007](https://kops.uni-konstanz.de/entities/publication/901f4299-e3f5-46af-99cb-a27bdd4bca71))
- **Passive** scrolling lowered mood over time, mostly through envy. **Active** use (messaging, posting) didn't. ([Verduyn et al. 2015](https://cris.maastrichtuniversity.nl/en/publications/passive-facebook-usage-undermines-affective-well-being-experiment))
- About **2 hours a week in nature**, in any number of chunks, is linked to better health and wellbeing. ([White et al. 2019](https://neurosciencenews.com/nature-health-wellbeing-14233/))
- The happiest students all had **strong relationships**. ([Diener & Seligman 2002](https://pubmed.ncbi.nlm.nih.gov/29592642/))
- Paying to **save time** (for example, skipping a chore) made people happier than buying things, yet only 2% thought to do it. ([Whillans et al. 2017](https://www.sciencedaily.com/releases/2017/07/170724161258.htm))

### Routine and rhythm
- In a therapy for bipolar disorder, **keeping daily "anchors" regular** (wake time, first contact with a person, start of work, dinner, bedtime) led to fewer relapses. ([Frank et al. 2005](https://www.eurekalert.org/news-releases/543467)) Applying this to everyone is reasonable, but **not proven**.

### For students specifically
- **The study methods that work best are quizzing yourself and spacing study sessions out.** Rereading and highlighting, the most popular methods, rated *low* usefulness. Cramming gets you through tomorrow but is forgotten fast. ([Dunlosky et al. 2013](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html)) _Strong._

---

## Part 5: Planning and scheduling (round 2: "do we need a calendar?")

**Short answer: no full hour-by-hour calendar.** The evidence supports a light "plan a few things, roughly" feature, plus comparing the plan with what actually happened. Full reasoning and the feature decision are in `product/research-ideas.md`.

### Which part of behavioral activation does the work?
- **The behavioral part alone did as well as full cognitive therapy**, and even changed negative *thoughts* about as much. ([Jacobson et al. 1996](https://commons.clarku.edu/faculty_psychology/137); [reanalysis](https://link.springer.com/article/10.1007/s41811-019-00044-8)) _Good (one founding RCT, 150 people)._
- **Activity scheduling on its own** worked about as well as cognitive therapy (16 trials). ([Cuijpers et al. 2007](https://pubmed.ncbi.nlm.nih.gov/17184887/)) _Strong but older, small trials._
- **"Simple" BA (logging plus scheduling) worked as well as "complex" BA**, which added values work and deeper analysis. ([Ekers et al. 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4061095)) So the extras aren't proven to add much.
- **Is logging alone enough? Nobody knows yet.** An Oxford trial tested "activity monitoring alone," but no results have been published ([NCT03995186](https://clinicaltrials.gov/study/NCT03995186)). Every proven package also includes some planning.
- **Hourly check-ins aren't needed.** College students in a BA program weren't more engaged when they monitored hourly than when they monitored 3 times a day ([Fazzino, Lejuez et al. 2023](https://www.cambridge.org/core/journals/behaviour-change/article/engagement-with-activity-monitoring-during-a-behavioral-activation-intervention-a-randomized-test-of-monitoring-format-and-qualitative-evaluation-of-participant-experiences/ECF4BD1F1BCD1518715576B56A4DF162)). _Some (pilot)._
- **Real BA programs plan in two different styles.** Classic BA uses hour-by-hour "appointments with yourself." *Brief* BA uses **weekly targets** ("walk 3× this week, 20 min"). No trial compares them. Every version warns: **don't try to do everything at once; start small**, and "days should not be filled with activity for activity's sake." ([Veale 2008](https://www.veale.co.uk/wp-content/uploads/2010/10/60-BA-for-depression-.pdf); [BATD-R](https://cebc4cw.org/program/behavioral-activation-treatment-for-depression))
- **BA apps work and are quick to use.** In Ly et al. 2015, an app plus 4 therapy sessions came close to 10 face-to-face sessions while using about half the therapist time. The app had an activity list, logging with a comment, and stats, **but no calendar grid** ([link](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0126559)). Sessions in the Moodivate app averaged **about 3.5 minutes** ([Dahne et al. 2019](https://researchconnect.suny.edu/en/publications/pilot-randomized-trial-of-a-self-help-behavioral-activation-mobil/)).

### When exact times help, and when they hurt
- ✅ **For one-time things that are easy to miss, write down a date *and* time.** Among 3,272 employees, writing down a date and time raised flu shot rates from 33.1% to 37.1%. A date alone didn't significantly help. ([Milkman et al. 2011, *PNAS*](https://www.nber.org/system/files/working_papers/w17183/w17183.pdf)) _Good._
- ❌ **Giving fun things an exact time makes them feel like work.** Across 13 studies, just setting a **start time** was enough to cause it. **"Roughly scheduled"** ("after dinner") avoided the problem completely, and the effect only hit leisure, not work tasks. ([Tonietto & Malkoc 2016](https://www.business.rutgers.edu/sites/default/files/documents/tonietto-the-calendar-mindset.pdf)) _Good._ This directly conflicts with scheduling BA's "pleasant activities" by the clock.
- ⚠️ **Planning can backfire for people who feel behind.** For people on track with a goal, planning helped self-control. For people who felt **behind**, it made self-control *worse*. ([Townsend & Liu 2012](https://Rady.ucsd.edu/_files/faculty-research/wendy-liu/planning%20Townsend%20Liu%20jcr%202012%20printed.pdf)) That's Sundial's main user on a bad week.
- **Time-blocking** (scheduling your whole day in blocks) has no controlled studies at all.
- **The Zeigarnik effect** ("you remember unfinished tasks better") showed **no memory advantage** in a 2025 meta-analysis. What survived is the *urge to go back and finish* unfinished tasks (the Ovsiankina effect). ([summary](https://en.wikipedia.org/wiki/Zeigarnik_effect))
- **Planned vs. actual review** is standard in BA practice (daily review of "actual and planned"), but it hasn't been tested on its own. It has to be kind, or it turns into a list of failures.

---

## Part 6: Feedback, nudges, and other people (round 2)

### How feedback should sound
- **Over a third of feedback interventions made performance *worse*** (607 effect sizes). Feedback backfires when it pulls attention to "am I good or bad?" instead of to the task. ([Kluger & DeNisi 1996](https://cris.huji.ac.il/en/publications/the-effects-of-feedback-interventions-on-performance-a-historical/)) _Strong._ → Plain facts ("3h 10m, 40m less than last week") instead of grades or "great job / you failed."
- **Specific positive feedback increased motivation** (d = 0.33). **Rewards for doing or finishing something decreased it** (d ≈ −0.28 to −0.40). ([Deci, Koestner & Ryan 1999](https://pubmed.ncbi.nlm.nih.gov/10589297/), verified from the abstract)
- **Paying people works only while the payments last.** Weight lost with incentives was no longer significantly different from controls a few months after payments stopped. ([Volpp et al. 2008, *JAMA*](https://jamanetwork.com/journals/jama/fullarticle/10.1001/jama.2008.804))
- **The famous "Hawthorne effect" lighting story is largely a myth.** When the original data were recovered, the effect was subtle at best. ([Levitt & List 2011](https://www.nber.org/papers/w15016)) Being asked about a behavior does shift it a little ([question-behavior meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC5781312)).

### Nudges and reminders
- **Well-timed prompts work at first, then fade.** HeartSteps walking suggestions roughly doubled steps in the next 30 minutes at first. The effect shrank about 3% a day and was gone by about day 29, and people called the prompts "boring." ([Klasnja et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6401341)) _Good (micro-randomized trial)._ → Keep prompts few, vary them, and make them easy to turn off.
- **Bedtime reminders for 1,149 university students** (Pitt, measured with Fitbits) ([Giuntella, Saccardo & Sadoff](https://conference.nber.org/conf_papers/f192989/f192989.pdf)). _Good (pre-registered RCT)._
  - **Setup:** a reminder 30 minutes before a personal goal bedtime, plus a wind-down action the student chose.
  - **Reminders + feedback alone:** small effects, about 7 more minutes of sleep.
  - **Adding $4.75 a night:** about 19 more minutes. After the money stopped, bedtimes went back to normal.
  - **What lasted:** **a more regular schedule.** Late-night screen time also dropped about 19 min/day, and GPA rose slightly.
  - **Self-report vs. Fitbit:** students *said* they slept 7+ hours on 69% of nights. Fitbits measured **43%**.
  - Their app's "missed goal" screen was a crying emoji and "You missed out," exactly what Sundial avoids.
- **A lamp that dims at your intended bedtime plus an if-then plan** cut the gap between intended and actual bedtime from 40 to 23 minutes. Total time in bed didn't change. ([Nauts et al.](https://old.ehps.net/files/powerawards_posters/nauts_ehps_poster_bedtime_procrastinationp.pdf)) _Some (42 people)._
- **Planning your bedtime with mental contrasting** (picture the goal, name the obstacle, plan "if X then Y") reduced bedtime procrastination in two student RCTs. ([Valshtein, Oettingen & Gollwitzer 2020](https://www.psy.uni-hamburg.de/arbeitsbereiche/paedagogische-psychologie-und-motivation/personen/oettingen-gabriele/dokumente/valshtein-oettingen-gollwitzer-2020-bedtime-procrastination.pdf)) _Good._
- **No phone for 30 minutes before bed:** time to fall asleep dropped from about 31 to 18 minutes. ([He et al. 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7010281/)) _Some (pilot, 38 people)._

### Other people
- **Reporting progress to someone helps self-monitoring work** (Harkin 2016). But the "public" evidence rests on few studies.
- **Joining with friends helped weight loss:** 66% vs 24% kept weight off. People chose whether to join with friends, so this isn't a clean comparison. ([Wing & Jeffery 1999](https://experts.umn.edu/en/publications/benefits-of-recruiting-participants-with-friends-and-increasing-s/))
- **Online "support" alone didn't increase exercise. *Comparison* with peers did, by about 90%** (790 students). ([Zhang et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5008041/)) But **upward comparison hurts self-esteem and mental health** (48 studies, [McComb et al. 2023](https://www.tandfonline.com/doi/full/10.1080/15213269.2023.2180647)). For someone who already scrolls compulsively, comparing to your own past is the safer choice.
- **The "Harvard 3% with written goals" study never happened.** The researcher who investigated it calls it an urban myth. The often-quoted "76% who sent progress to a friend" comes from a small, unpublished study, and seems to be a misreading of an average score of 7.6. ([Matthews summary](https://www.dominican.edu/sites/default/files/2020-02/gailmatthews-harvard-goals-researchsummary.pdf))
- **Commitment contracts work for the few who sign them.** Only about 11% of smokers signed a deposit contract. It raised quit rates by 3–6 percentage points, and two-thirds of signers still failed. ([Giné, Karlan & Zinman 2010](https://www.povertyactionlab.org/print/pdf/node/1468))
- **Temptation bundling** (only enjoying a treat while doing the hard thing, like audiobooks only at the gym) is real but much smaller than first reported. In a 6,792-person follow-up, workouts rose 10–12% ([Kirgios et al. 2020](https://econpapers.repec.org/RePEc:eee:jobhdp:v:161:y:2020:i:s:p:20-35)), not the original 51%.
- **In the exercise megastudy** (61,293 people, 54 programs), the best program rewarded **coming back after a missed workout**. ([Milkman et al. 2021, *Nature*](https://www.gwern.net/doc/statistics/prediction/2021-milkman.pdf)) → Celebrate returning, not perfect runs.
- **Body doubling / co-working:** almost no controlled evidence (one 12-person VR study). Social facilitation research says other people's presence helps simple tasks and can hurt complex ones ([Bond & Titus 1983](https://pubmed.ncbi.nlm.nih.gov/6356198/)).

### Gamified pets, sound
- **Finch, Forest, Habitica:** no peer-reviewed studies showing they work. A pet that suffers when you don't log, or a tree that dies, is a punishment mechanic.
- **Background music hurts reading and memory tasks** a little ([Vasilev et al. 2018](https://www.frontiersin.org/articles/10.3389/fnhum.2018.00293/pdf)). **White noise slightly helps people with ADHD and slightly hurts people without it** ([Nigg et al. 2024](https://pubmed.ncbi.nlm.nih.gov/38428577/)).
- **Values affirmation** has small effects, and a large school replication failed ([Hanselman et al. 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5589421)).

---

## Part 7: Finding patterns in your own data (round 3)

- **People misread their own experiments.** In TummyTrials, people ran 12-day food experiments on themselves. They often treated "no evidence" as "proven safe," and one person read strong evidence as "no evidence." 12 days could also only catch big effects. ([Karkar et al. 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5432136)) _Some._
- **How many days you need: our own math, not from a paper.** These are for a typical correlation calculation with 80% power. For a real correlation between, say, sleep and mood in one person:

  | How strong the real link is | Days needed |
  |---|---|
  | Strong (r = 0.5) | ~29 days |
  | Medium (r = 0.3) | ~85 days |
  | Weak (r = 0.2) | ~194 days |

  - **Days that resemble each other** make it worse: one day looks like the next, so the effective number of days shrinks by about a quarter.
  - **Weekends** differ from weekdays in both sleep and mood, which can fake a pattern.
  - **"Regression to the mean"** means after an unusually bad week, the next week looks better no matter what you do.
- **Rule of thumb for Sundial:** no "pattern" insights before about **28 logged days with real ups and downs** in both things being compared, and only show strong links. Call anything under about 60 days an **"early hint."** Always show how many days the insight uses, and never say "X causes Y."

### Sleep restriction is not an app feature
- **In a study of people with insomnia, sleep restriction cut sleep by about 91 minutes on the first night.** Sleepiness and attention lapses stayed raised for about 3 weeks. One patient said "I was a danger on the road." Everyone had recovered, with improved insomnia, by 3 months. ([Kyle et al. 2014, *Sleep*](https://pmc.ncbi.nlm.nih.gov/articles/PMC3900612)) _Some (16 people)._
- **Clinicians don't use it** with bipolar disorder (it can trigger mania), epilepsy, or untreated sleep apnea ([overview](https://www.sleepfoundation.org/sleep-hygiene/sleep-restriction-therapy)). An app can't screen for these. → **Sundial should never automate sleep restriction or compression.** Point to a clinician or a proper CBT-I program instead.

---

## Part 8: To-do lists: remembering, dreaded tasks, notes, list length (round 5)
_Research follow-ups from Sun Check 2026-11-07 (3), "To-do list." Decisions are in `product/research-ideas.md` → section 13._

### Remembering to do something during a window (like calling a business 9–5)
- **Tasks tied to a time are the hardest kind to remember.** "Do it at 2pm" has nothing in your surroundings to remind you; you have to remember to keep checking. "Do it when X happens" gets prompted by X. ([Einstein, McDaniel et al. 1995](https://profiles.wustl.edu/en/publications/aging-and-prospective-memory-examining-the-influences-of-self-ini/)) _Good (lab)._ The research name for this is *prospective memory* (remembering to do things later).
- **Cues work best when they're right in what you're already looking at.** A cue you see as part of what you're doing triggers the intention almost automatically. One you have to watch for takes effort. ([McDaniel & Einstein 2000](https://profiles.wustl.edu/en/publications/strategic-and-automatic-processes-in-prospective-memory-retrieval/)) _Theory with lab support._
- **Forgetting to do things is common**, but "most everyday forgetting is this kind" isn't reliably supported. Diary studies disagree ([Laughland & Kvavilashvili](https://uhra.herts.ac.uk/id/eprint/14968/1/Method_Poster_final_23.05.14.pdf)). Don't put "most" in the app.
- **Sleep loss makes it worse in a specific way.** After 24h awake, people **checked the clock just as often but still forgot to act**. Sleep loss seems to break the link between noticing and doing. ([Esposito et al. 2015, *Sleep*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4813356); [Grundgeiger et al. 2014](https://vufind-test.katalog.k.utb.cz/SummonRecord/FETCH-LOGICAL-c337t-f7c54de24652e5315d6548c8e261d4c42c12c0885d8cd46664d35583cf8493c53)) _Some (small lab studies, total sleep loss only)._
- **ADHD:** time-based remembering is consistently harder; event-based results are mixed ([review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8199111)). _Review, no meta-analysis found._
- **Reminders work, and people use them too little.** People who could set reminders followed through more. People also leaned on memory even when a reminder would have paid off ([Gilbert 2015](https://pubmed.ncbi.nlm.nih.gov/25404057/); [Gilbert et al. 2020](https://discovery-pp.ucl.ac.uk/10080846/1/optimal%20reminders.pdf); [review 2023](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9971128/)). _Good (lab + review)._ **Offloading only costs you if the reminder fails to show up.** Saving something can even help you remember the next thing ([Storm & Stone 2015](https://www.psychologicalscience.org/news/releases/saving-old-information-can-boost-memory-for-new-information.html)).
- **Reminders that arrive on their own work in real life.** A reminder pager helped more than 80% of people with brain injuries do everyday tasks and keep appointments ([Wilson et al. 2001](https://jnnp.bmj.com/content/70/4/477.abstract)). _Good (RCT, 143 people, clinical group)._
- **If-then plans improve remembering to act** (medium effect, larger when you both say *and* picture the plan) ([Chen et al. 2015 meta-analysis](https://doi.org/10.1016/j.psychres.2015.01.011); [Chasteen et al. 2001](https://scilit.com/publications/d9c47992ab164ca20ca4d6417f03b4b2)). _Strong._ For behavior in general, the effect is real but more modest than once claimed (Sheeran et al. 2024).
- **Pairing a task with a distinctive cue you'll run into raised follow-through from 42% to 74%** (a toy elephant in one study). The cue has to *stand out*, and people undervalue this trick ([Rogers & Milkman 2016, *Psychological Science*](https://scholar.harvard.edu/files/todd_rogers/files/reminders_through_association_2016.pdf)). _Good (6 lab and field experiments)._
- **Write down a date *and time*, not just a date.** It raised flu-shot rates, and the effect was biggest when the clinic was open only one day, a narrow window like business hours ([Milkman et al. 2011](https://nber.org/system/files/working_papers/w17183/w17183.pdf)). _Good (field RCT)._
- **What a reminder says may matter more than when it arrives.** The best reminders name both the cue and the action. No field study has tested "right before" vs "earlier." _Some._
- **An in-app card only works when you open the app.** That's the same self-started checking that makes time-based tasks hard. People pick up their phones about 75–110 times a day (company data, not peer-reviewed), but that doesn't mean they open Sundial.

### What gets dreaded small tasks done (calls, emails, admin)
- **The more unpleasant a task feels, the more it gets put off.** Boredom, frustration and resentment are the main drivers, and task unpleasantness is one of the strongest predictors of procrastination (Blunt & Pychyl 2000 [venue unverified]; Steel 2007). _Strong (meta-analysis)._
- **A dreaded task feels worst while you're avoiding it.** In a study that paged 45 students through the week, avoided tasks were rated very stressful ([Pychyl et al. 2000](https://www.psychologytoday.com/gb/blog/dont-delay/200803/just-get-started/amp)). The idea that it feels much better once started comes from the author's blog. _Some._
- **⚠️ "It won't be as bad as you think" is *not* supported for ordinary chores and studying.** Across 767 work tasks and 185 students studying for exams, people predicted their bad feelings about right ([Kaplan et al. 2020, *PLOS ONE*](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0235973)). _Good (observational)._ The app shouldn't promise it.
- **✅ For *social* tasks, people do expect worse than they get.**
  - People expected a **phone call** to be more awkward than texting. Calls built stronger connection with no extra awkwardness ([Kumar & Epley](https://news.mccombs.utexas.edu/research/when-we-fear-an-awkward-phone-call-we-often-turn-to-text/)).
  - People underestimate how much others **appreciate being reached out to**, especially weak ties ([Liu et al. 2023, 5,900+ people](https://www.psypost.org/study-identifies-a-robust-tendency-to-underestimate-how-much-others-appreciate-being-reached-out-to); [independent replication](https://replications.clearerthinking.org/?p=1121)).
  - Talking to strangers went better than predicted ([Epley & Schroeder 2014](https://faculty.haas.berkeley.edu/jschroeder/Publications/Epley%26Schroeder2014.pdf)).
  - _Good (multiple experiments)._
- **Phone anxiety is real, but the research is thin.** People with phone anxiety use more texting and digital media, which suggests texting can be a way of avoiding the anxiety ([Kim & Oh 2023](https://ma.x-mol.com/paper/1675187088392962048)). Popular stats like "60% of Gen Z dread calls" come from non-academic surveys.
- **Once you start, you tend to want to finish.** The urge to go back to unfinished tasks (the Ovsiankina effect) held up in a 2025 meta-analysis ([Ghibellini & Meier](https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05000-w.html)). This is the best evidence for "just start." _Strong._
- **A tiny first step plus a small reward.** A 2-minute exercise (name the feeling, pick a tiny first step, pick a small reward) improved mood and intention to act the next day ([Garg, Shelat & Schooler 2025](https://www.universityofcalifornia.edu/news/two-minute-fix-procrastination)). _Some (one study, self-reported intentions, possible conflict of interest)._
- **Thinking about a task concretely reduces procrastination.** Concretely framed questionnaires came back sooner than abstractly framed ones ([McCrea et al. 2008](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2008.02240.x/)). _Some._
- **Batch email.** Checking 3 times a day lowered stress with no loss in how productive people felt ([Kushlev & Dunn 2015](https://www.interruptions.net/literature/Kushlev-ComputHumBehav15.pdf)). _Good (RCT, 124 people)._ Batching calls into one "calls & emails" window is a reasonable extension, but untested.
- **Email recipients feel more urgency than senders intend.** A "no rush" line reduces it ([Giurge & Bohns 2021](https://lbsresearch.london.edu/id/eprint/1928)). _Good (8 preregistered studies)._
- **Gradually facing a feared thing** works for social anxiety (meta-analysis, [link](https://pmc.ncbi.nlm.nih.gov/articles/PMC6746888)). "Make one easy call first" is a reasonable mini-version, but extrapolated. **Writing a call script in advance has no studies.** It's sensible expert advice.
- **Timing:** you do best at your body clock's peak ([May, Hasher & Healey 2023](https://blogs.cofc.edu/mayc/files/2023/06/May-Hasher-Healey-2023.pdf)). For a night owl, that isn't necessarily the morning.
- **The "two-minute rule"** (if it takes under 2 minutes, do it now) and **GTD's "next action"** are untested expert advice ([Heylighen & Vidal 2008](https://web-archive.southampton.ac.uk/cogprints.org/6289/)).

### Do written notes and next steps help tomorrow?
- **Writing a specific plan for an unfinished goal stopped it from nagging at you,** with the intrusive thoughts and lower performance on other work both gone, even without doing the task ([Masicampo & Baumeister 2011](https://pubmed.ncbi.nlm.nih.gov/21688924/)). _Some (one lab group; no replication found either way)._
- **Writing a *specific* to-do list at bedtime helped people fall asleep faster** than writing about what they'd already done (about 9 minutes faster in a sleep lab). The more specific the list, the faster they fell asleep ([Scullin et al. 2018](https://www.sciencedaily.com/releases/2018/01/180111224021.htm)). _Some (lab RCT, ~57 people)._ → Goodnight's Tomorrow/Later step is sleep-friendly.
- **Unfinished tasks are linked to worse sleep through rumination** (going over and over them) ([Syrek et al. 2017](https://pubmed.ncbi.nlm.nih.gov/27101340/)). _Observational._
- **Listing a task's parts makes time estimates more realistic** ([Kruger & Evans 2004](https://core.ac.uk/download/20665233.pdf)). _Some (lab)._
- **Two kinds of plans:** "when, where, how" helps you get started, and "if X gets in the way, then Y" helps you keep going ([Sniehotta et al.](https://eprints.ncl.ac.uk/155807)). _Good._
- **A note on where you left off makes it faster to pick a task back up.** People warned before an interruption prepared, and resumed faster ([Trafton et al. 2003](https://interruptions.net/literature/Trafton-IJHCS03.pdf)). _Some (lab)._
- **"Stop mid-sentence like Hemingway"** has thin support (one small study). Don't promise it.

### How many items before a to-do list backfires?
- **Specific planning helped people with 1 goal but not 6.** Planning made the size of the full list obvious ([Dalton & Spiller 2012](https://sciencedaily.com/releases/2012/05/120516152448.htm)). _Good (lab + field)._
- **Detailed planning made people who felt behind *more* distressed and less self-controlled** ([Townsend & Liu 2012](https://econpapers.repec.org/RePEc:oup:jconrs:doi:10.1086/665053)). _Good._
- **Too many choices hurts only when the choice is hard and you're unsure what you want** ([Chernev et al. 2015](https://www.kellogg.northwestern.edu/faculty/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual)). "What do I do first?" on a long list is exactly that.
- **Working memory holds about 4 items** ([Cowan 2001](https://pubmed.ncbi.nlm.nih.gov/11515286/)). That limits what you hold in mind at once, not what a written list holds, so it's only a loose analogy.
- **Show what's done when motivation is shaky.** When commitment is shaky, seeing what's already done motivates more. When commitment is firm, seeing what's left does ([Koo & Fishbach 2008](https://core.ac.uk/download/158313722.pdf)). _Good (lab)._
- **Small wins:** small progress was the biggest everyday boost to mood and motivation (Amabile & Kramer). No study has tested "done lists" themselves.
- **"Urgent beats important":** people pick urgent-feeling tasks over more important ones, and reminding them of each task's payoff helps ([Zhu, Yang & Hsee 2018](https://hub.jhu.edu/2018/05/31/meeting-deadlines-time-management-behaviors)). → No countdowns.
- **Myths:** "Ivy Lee's 6-item list" (no primary source), and "41% of to-dos never get done" (one company's app data).
- **Practical limit (our synthesis, not a tested number): 1–3 main items** for someone who feels behind, with everything else in Later. Based on Dalton & Spiller, Townsend & Liu, and choice overload.

---

## What actually works outside any app

A practical, honest list. Pick one or two to try; you don't need all of them.

**Sleep**
1. **Same wake time every day, weekends too.** If you can only do one thing, do this. "Same" matters more than "early."
2. **Get light soon after waking.** Go outside, even on cloudy days. **Keep evenings dimmer.**
3. **Go to bed when you're sleepy, not just because it's "time."** If you're lying awake for a long while, get up and do something calm, then try again.
4. **After an all-nighter, wake at your normal time** instead of sleeping until afternoon. Expect a few nights to feel normal again.
5. **If you nap, keep it around 10–20 minutes.**
6. **Stop caffeine about 6+ hours before bed.**
7. **Phone charges away from the bed.** The light matters less than the fact that it keeps you up.
8. **If you want to shift earlier, go gradually** (15–30 min at a time) with morning light. Ask a doctor about low-dose, well-timed melatonin if you're a severe night owl.
9. **If sleep is a real struggle, try CBT-I.** It's the gold standard, and app-based versions work.

**Scrolling and compulsive habits**
1. **Change the environment, not your willpower.** Delete or log out of the worst app, turn on grayscale, keep the phone out of reach in bed, and use an iOS Shortcut that adds a pause and lets you back out before an app opens.
2. **Replace, don't just remove.** Have a specific plan for the freed-up time: a friend, a walk, a club, a game you actually enjoy, a project.
3. **Try a 2–3 week cutback** (for example, social apps under 30 min a day). One-day detoxes show little effect, and cutting back works about as well as quitting.
4. **Batch notifications** (check about 3 times a day) instead of turning them all off.
5. **When an urge hits, move.** A 10-minute walk breaks the cycle. Or **surf the urge**: notice it, let it rise and fade for about 90 seconds.
6. **Ask what the scrolling is doing for you.** Escaping stress, loneliness, boredom, or a dreaded task? That need deserves attention too.
7. **Protect sleep first.** Tiredness amplifies the pull.

**Getting things done**
1. **Start tiny and act before motivation shows up.** Ten minutes counts. Motivation comes *after* starting.
2. **Use your real past times to plan.** Break tasks into steps, and assume it will take longer than you think.
3. **Make if-then plans:** "After my 10am class, I go to the library, 2nd floor."
4. **Study by quizzing yourself and spacing sessions out.** Skip rereading.
5. **Forgive yourself for yesterday.** It predicts doing better tomorrow.

**Life**
1. **See people, ideally in person.** It's the most consistent ingredient of happiness.
2. **Get about 2 hours a week outside in green space.**
3. **Rest without guilt.** Thinking of leisure as "wasteful" ruins it.

**Getting help**
- **BYU CAPS** offers free counseling. They can do CBT, behavioral activation, and CBT-I-style help.
- **Ask about an ADHD evaluation** if focus problems go back to childhood and show up everywhere, even when sleep and mood are okay.
- **If your mood has been low most days for a couple of weeks or more, or nothing feels fun anymore,** that's worth talking to someone about. Depression is very treatable.
- **Crisis:** call or text 988.

---

## What this means for Sundial

### Already backed by research ✅
| Sundial feature or principle | Research support |
|---|---|
| Logging time at all ("calorie tracker for time") | Self-monitoring (Harkin 2016); behavioral activation activity logs; people misremember their time (Parry 2021) |
| Streak recovery by backfilling | Repairable streaks weaken the harm of breaks (Silverman & Barasch 2023); the Day Reconstruction Method (Kahneman 2004); one missed day doesn't matter (Lally 2010) |
| "Kind, not shaming" / neutral language | Self-compassion → more effort (Breines & Chen; Adams & Leary); the abstinence violation effect (Marlatt) |
| Streaks count logging, not performance | What-the-hell effect; self-blame makes broken streaks worse |
| "Stabilize" mode / consistency over earliness | Sleep regularity (Phillips 2017, Windred 2024); a fixed wake time is core to CBT-I |
| Sleep-based day / nocturnal-friendly | Night owls peak at ~20 and chronotype is partly genetic (Roenneberg; Jones 2019) |
| Goals start from your real baseline | Short-term goals (Bandura & Schunk) |
| Mood/energy rating at goodnight | Naming feelings (Lieberman 2007); mood tracking builds self-awareness (Kauer 2012) |
| Compare to yourself, not others | Self-monitoring works best with a personal standard plus feedback (Michie 2009) |
| Easy export | Planning for "happy abandonment" and lapsing then coming back (Epstein; Clawson) |

### Things to reconsider ⚠️
- **The category name "Low-value leisure" in `product/features.md`.** Research shows that viewing leisure as wasteful makes it less enjoyable and is linked to more stress (Tonietto 2021). _Update: the app already uses neutral starter categories ("Leisure" and "Scrolling & screens"). Only the old example in `features.md` still says "Low-value."_
- **The "Shift" mode's 15–30 min per week.** That's slower than the evidence requires. 15–30 min every few days is a common clinical pace, and up to 1h/day worked in the lab with bright morning light. Weekly is fine as a gentle default, but it's a choice, not a science limit. **Never shift more than 1h/day.**
- **"Sleep debt" and any future sleep score.** Keep them descriptive, not graded, to avoid orthosomnia. Never reward time in bed.
- **Heavy reminders as the main engine.** Reminders build dependence more than habit. Prefer cues tied to existing routines.

### New feature ideas, by roadmap stage
_Proposals only. The roadmap order still wins. Nothing here moves the roadmap until you decide._

**v2 (goodnight & streaks)**
- After a missed day, the streak banner uses kind, neutral wording ("Yesterday's empty, want to fill it in?") and never shows a big "broken streak" moment.
- Alongside the streak, show **"logged 23 of the last 30 days"**, so a single miss never looks like zero.
- Make backfill a **step-by-step walk through the day** ("you woke at… then…"), modeled on the Day Reconstruction Method.
- Goodnight extras: a planned bedtime vs actual bedtime, shown without judgment (bedtime procrastination), and a self-compassionate line on rough days.
- After an all-nighter: "Recovery takes a few nights. Waking at your usual time tomorrow helps your clock reset."

**v3 (goals)**
- An optional **if-then plan** field on goals ("When ___, I'll ___"), plus an optional WOOP prompt: "What might get in the way?"
- **"Less" goals as first-class goals, not just "zero."** Cutting back works about as well as quitting.
- When a limit is exceeded, show a neutral display plus a kind line, never red alarms.
- **Fresh-start nudges** on Mondays and the 1st of the month: "New week, want to look at your goals?"
- Sleep: use **wake time as the main target**; add a caffeine cut-off hint based on the person's own bedtime; build the shift planner with a morning light tip.
- A "just for fun" flag on activities that excludes them from goals and nudges, so enjoyment isn't graded (Etkin 2016).

**v4 (reviews)**
- A **Sleep Regularity Index** calculated from the raw sleep intervals. This fits "store intervals, derive everything" perfectly. Show it next to sleep duration.
- **Sleep midpoint and social jet lag** charts.
- **Weekly and monthly views ahead of nightly scores**, since the week and month predicted grades and single nights didn't.
- **"When does scrolling happen?"** Show patterns by time of day or what came before, since habits run on cues.

**v5 / Later**
- **Behavioral-activation ratings:** an optional one-tap **enjoyment** and **accomplishment** rating on activities. Then insights like "Walks and calling friends tend to come before your better-mood days."
- **Planning-fallacy helper:** "You planned 2h for this essay. Your last 4 essay sessions averaged 3h 10m."
- **Guessed vs actual:** "You guessed 2h of scrolling and logged 3h 40m. Most people underestimate." Frame it as curiosity, not a verdict.
- **An optional "urge surfed" one-tap log** that counts as a win.
- **Insights always come with an optional choice** ("Want to try something this week?"), never just a number.
- **Study helper:** "Biology: last studied 4 days ago." Spacing works, and the app could show it visually.
- A **tips / fun facts** feature that draws from the bank below.
- **"Get support" links** (CAPS, 988) that are easy to find but never pushy.

### Things Sundial should never do ❌
- Use "dopamine detox," "reset your dopamine," or "addict" language. It's pseudoscience and it shames.
- Use variable rewards, loot-box-style surprises, points, or prizes to drive engagement. That's what users are trying to escape, and rewards undermine intrinsic motivation.
- Show red alarms, "wasted," "failed," or a dramatic streak reset to zero.
- Promise mood improvements, claim to treat depression, give melatonin doses, or diagnose ADHD.
- Push Pomodoro, 5am routines, or "21 days" as science.
- Send constant pop-up warnings. They don't work and they cause fatigue.
- Default users to turning off all notifications. That raised anxiety in one study.

---

## Fun facts & tips bank (for in-app use later)
Each one is checked against the sources above. Keep the citation with the tip.

**Sleep**
1. Night owls aren't lazy. Body clocks are at their latest around age 20, then gradually shift earlier. _(Roenneberg et al. 2004)_
2. Harvard students with irregular sleep had lower grades, even with the same total sleep. _(Phillips et al. 2017)_
3. The most regular sleepers had about 20–30% lower health risk than the least regular, and regularity predicted it better than sleep length. _(Windred et al. 2024)_
4. The night before the exam mattered less than the month before it. _(Okano et al. 2019)_
5. A 10-minute nap beat a 30-minute one for an immediate boost. _(Brooks & Lack 2006)_
6. Caffeine 6 hours before bed cost over an hour of sleep, and people didn't notice. _(Drake et al. 2013)_
7. Two weeks of 6-hour nights can hurt focus like a night with no sleep, while you only feel a little tired. _(Van Dongen et al. 2003)_
8. A week of camping shifted night owls' clocks about 2 hours earlier. _(Wright et al. 2013)_
9. Ordinary room light is enough to cut evening melatonin in half for a typical person. _(Phillips et al. 2019)_
10. Across 65 trials, improving sleep improved mood. _(Scott et al. 2021)_

**Habits and the brain**

11. "Wanting" and "liking" use different brain systems. That's why you can crave an app you don't even enjoy. _(Berridge & Robinson)_
12. Dopamine responds most to *surprise*. A fully expected reward barely registers. _(Schultz et al. 1997)_
13. Giving people the option to back out before an app opened cut openings by 57%. A "think about it" message alone did nothing. _(Grüning et al. 2023)_
14. Turning off *all* notifications made people more anxious. Checking 3 times a day lowered stress. _(Fitz et al. 2019)_
15. After 4 weeks off Facebook, people kept using it less even when they could go back. _(Allcott et al. 2020)_
16. People's guesses of how often they pick up their phone didn't match reality at all. _(Andrews et al. 2015)_
17. In one study, many people chose to give themselves a mild electric shock rather than sit alone with their thoughts for 15 minutes. _(Wilson et al. 2014, [link](https://www.sciencedaily.com/releases/2014/07/140703142154.htm))_
18. Our minds wander almost half the time we're awake (46.9%). _(Killingsworth & Gilbert 2010)_

**Kindness and progress**

19. Being kind to yourself after a failure made people study *longer* for the next test. _(Breines & Chen 2012)_
20. Students who forgave themselves for procrastinating procrastinated less next time. _(Wohl et al. 2010)_
21. "21 days to build a habit" is a myth. It took a median of ~66 days, and missing one day didn't matter. _(Lally et al. 2010)_
22. Simply naming a feeling ("frustrated") calms the brain's alarm center. _(Lieberman et al. 2007)_
23. Every Monday is a fresh start. Gym visits jump at the start of each week, month, and year. _(Dai, Milkman & Riis 2014)_
24. Writing your progress down, not just thinking about it, made tracking more effective across 138 studies. _(Harkin et al. 2016)_
25. The best workdays were the ones with a bit of progress on something meaningful. _(Amabile & Kramer)_

**Time**

26. Only about 30% of students finished their thesis by the date they predicted. Everyone underestimates. _(Buehler et al. 1994)_
27. Thinking of leisure as "wasteful" makes you enjoy it less. _(Tonietto et al. 2021)_
28. About 2 hours a week in nature is linked to better wellbeing, in one visit or many short ones. _(White et al. 2019)_
29. Rereading and highlighting rate "low utility" for studying. Quizzing yourself rates "high." _(Dunlosky et al. 2013)_
30. Procrastinators felt *less* stressed early in the semester, and then the stress caught up with them. _(Tice & Baumeister 1997)_
31. Only 2% of people thought to spend money buying back time, even though it made people happier. _(Whillans et al. 2017)_
32. In a study of 909 women, commuting was the least enjoyable part of the day. _(Kahneman et al. 2004)_

---

**From rounds 2 and 3**

33. Writing down a date didn't significantly raise flu shot rates. Writing down a date *and a time* did. _(Milkman et al. 2011)_
34. Just picking a start time for something fun is enough to make it feel more like work. "After dinner-ish" doesn't. _(Tonietto & Malkoc 2016)_
35. Over a third of feedback in 607 studies made performance *worse*, usually feedback that made people think "am I good?" instead of about the task. _(Kluger & DeNisi 1996)_
36. Students said they slept 7+ hours on 69% of nights. Their Fitbits said 43%. _(Giuntella et al.)_
37. People used their phones about 85 times a day but guessed 37. Their guesses of total *time* were close, though. _(Andrews et al. 2015)_
38. Walking nudges doubled steps at first, then people found them "boring," and by about day 29 they did nothing. _(Klasnja et al. 2019)_
39. The famous "Harvard 3% with written goals" study never happened. _(Matthews)_
40. The "Hawthorne effect" lighting story is largely a myth. The original data were found decades later. _(Levitt & List 2011)_
41. The best program in a 61,000-person exercise study rewarded coming back after a missed workout. _(Milkman et al. 2021)_
42. People underestimate how long future tasks will take partly because they misremember how long past ones took. _(Roy, Christenfeld & McKenzie 2005)_
43. "You remember unfinished tasks better" (the Zeigarnik effect) didn't hold up in a 2025 meta-analysis. The *urge to finish them* did. _(Ghibellini & Meier 2025)_
44. Doing only the behavioral part of therapy changed negative thoughts about as much as full cognitive therapy. _(Jacobson et al. 1996)_
45. A behavioral activation app session took about 3.5 minutes on average. _(Dahne et al. 2019)_
46. White noise slightly helps people with ADHD focus, and slightly hurts everyone else. _(Nigg et al. 2024)_
47. Give people 14 hours of darkness and their sleep splits into two halves with a quiet wake in the middle. _(Wehr 1992)_
48. Chaucer wrote of a character waking "after her first sleep," one of hundreds of old references to a "second sleep." _(Ekirch)_
49. Teens who split the same 6.5 hours into a night plus a nap were as alert as or more alert than those who slept it in one go. _(Lo et al. 2019)_
50. Madagascar farmers napped on 89% of days. _(Samson et al. 2017)_
51. Hunter-gatherers fell asleep about 3 hours after sunset, not at dusk. _(Yetish et al. 2015)_
52. A toy elephant placed where people would see it raised follow-through on a small task from 42% to 74%. _(Rogers & Milkman 2016)_
53. Writing a specific to-do list at bedtime helped people fall asleep faster than writing about what they'd already done. _(Scullin et al. 2018)_
54. Sleep-deprived people checked the clock just as often but still forgot to do the thing. _(Esposito et al. 2015)_
55. People expect phone calls to be more awkward than texting. They're not, and they feel more connecting. _(Kumar & Epley)_
56. People underestimate how much others appreciate hearing from them. _(Liu et al. 2023)_
57. Planning in detail helped people with one goal, but not people juggling six. _(Dalton & Spiller 2012)_
58. "Pre-crastination": most people picked up the *nearer* of two buckets and carried it farther, just to get a step done sooner. _(Rosenbaum et al. 2014)_
59. A coffee card with 2 of 12 stamps already filled was finished faster than a blank 10-stamp card. _(Kivetz et al. 2006)_

---

## Corrections made after fact-checking (round 3)
- **Ariely & Wertenbroch 2002** (self-imposed deadlines) was **retracted** by *Psychological Science* in September 2026 ([notice](https://doi.org/10.1177/09567976261488042)). We never used it in the app plan; don't cite it.
- **Hollis 2008** never says diary keepers "lost twice as much." Corrected above.
- **Phone pickups:** "more than double" is confirmed (85 actual vs 37 guessed per day, Andrews 2015). Added above.
- **Yoo 2007 "40% worse memory":** that's a best case Walker quoted to the press. The same article gives an average of **19% worse** recall. Don't use "40%."
- **Furukawa 2024:** confirmed, numbers added above.
- **Roy & Christenfeld:** confirmed, added above.
- **Lally 2010:** confirmed, caveat added above.
- **Sleep shift rate:** 30 min/day is used in a real teen treatment study. "15 min/day" has no source.

## Not verified: don't use these as facts
- "60% more amygdala reactivity" (Yoo 2007). The paper is real, but the number couldn't be seen.
- "Streak users are 63% more likely to quit after one missed day." No source found; probably a myth.
- Duolingo's streak-freeze retention numbers. Not published.
- The exact Buehler thesis numbers (33.9 vs 55.5 days). These are the widely cited figures, but not in the abstract.
- The caffeine half-life range. Say "about 5 hours on average, varies a lot between people."
- Kirschenbaum 1981 (daily vs monthly plans for students). Couldn't be reached.
- Results of the Oxford "monitoring alone" BA trial. Not published.
- Peer-reviewed studies of Finch, Forest, Habitica, Focusmate. None found.
- Exact power references for personal correlations. The table above is our own calculation.
- Safety reporting from the Sleepio and SHUTi trials. Not retrieved.
- ADHD "time blindness" meta-analyses. Not retrieved.

---

## Research log
| Round | Date | What | Notes |
|---|---|---|---|
| 1 | Nov 2026 | Sleep; dopamine & phones; self-tracking & streaks; time management & procrastination | 4 parallel research passes, ~150 searches |
| 2 | Nov 2026 | Behavioral activation & calendars; iPhone feasibility; feedback/social/nudges | 3 passes. Hit the session's web search limit partway through |
| 5 | Nov 2026 | To-do list: remembering during a window, dreaded tasks & phone anxiety, notes/next steps, list length | 2 passes, ~55 searches, no limit hit |
| 4 | Nov 2026 | Split/segmented sleep, long naps, how "main sleep" is defined | ~35 searches, no limit hit |
| 3 | Nov 2026 | Open questions (bedtime reminders, pets, co-working, days-needed, sleep restriction safety, Deci, Hawthorne); fact-check of every unverified claim | Search limit hit almost immediately. Verified by opening primary sources directly where possible |

**To research more later:** the items in "Not verified" above. A longer research session needs a higher web-search limit (the `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` setting).

---

## My own notes
_Things you read, videos, personal observations…_
