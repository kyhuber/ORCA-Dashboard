---
name: orca-training-analysis
description: Use when Kai asks to check his running/workout data, update his training dashboard, review recent runs, pull health data, or wants his half marathon (or future marathon) training plan adjusted based on recent performance. Triggers on requests like "check my runs this week," "how's training going," "update the dashboard," "pull my runs," or "should I adjust anything."
---

# Orca Half Marathon Training Analysis

> Canonical copy lives in the ORCA-Dashboard repo at `skills/orca-training-analysis/SKILL.md`.
> Edit it there, then paste into claude.ai so every surface picks up the change. The copy
> synced into a Claude Code container is read-only — editing it there changes nothing upstream.

## Context (don't re-derive this — it's settled)

- **Goal race:** Brooks Orca Half Marathon, **Saturday September 19, 2026**, West Seattle
  (Lincoln Park to Don Armeni Boat Launch). The event weekend spans Sep 19–20; the half is Saturday.
- **Time zone — Kai is in Seattle, `America/Los_Angeles`.** Every date in this project is a
  Pacific date: the plan, `SEEDED_ACTUALS`, `DATA_THROUGH`, export filenames, and the day Kai
  means when he says "today". **A Claude Code container's clock is UTC**, which is 7 hours ahead
  in PDT and 8 in PST — so from 17:00 Pacific onward (16:00 in winter) the container is already
  on tomorrow's date. An evening run is the normal case here, not the edge case, so this is a
  trap the project has now sprung twice: the Sep 8 export was first written to Drive under a
  Sep 9 filename and had to be retracted, and a Sep 10 run pulled at 19:10 Pacific was read a
  day later as "yesterday's run" by a session trusting its own clock.
  **So: never take today's date from the environment, and never describe a run as today,
  yesterday, or last night without converting first.** `TZ=America/Los_Angeles date` gives the
  real answer in one command; run it before any reasoning about recency, before setting
  `DATA_THROUGH`, and before telling Kai when something happened. The dashboard itself already
  gets this right — `PLAN_TZ` and `todayISO()` in `index.html` compute the Pacific day
  deliberately — so a mismatch between the page and your own sense of "today" means you are
  the one who is wrong.
- **Goal pace:** the single source of truth is `window.GOAL_PACE` in `data.js` — **read it, do
  not quote a figure from memory.** It was **7:42/mi → 1:40:56** as of the Aug 22 benchmark,
  reset from an earlier 7:56/mi → 1:44:00; it can be reset again, so any number written here is
  only ever a snapshot. Never hardcode a goal time anywhere else — the dashboard derives the
  projected finish, the pace-chart goal line, and the week 7–8 target paces from that one value.
- **Framing:** Not competitive. Kai's own words: "solid effort, feel good about the race."
  Train the experience, not the clock.
- **Sep 19 race, as of Sep 15: it is on.** Kai runs it, applying the cue, the mile 6–7 gel and
  the pre-race meal plan below. Race-week running is unchanged — Tue/Wed were already rest, which
  happens to give the muscle its recovery; Thursday's shakeout doubles as the cue rehearsal and
  the gel taste-test; Friday is the carb-loading day. **Revised stop-rule for race day, now that
  the mechanism is understood and the PT has cleared it: the default is to finish**, resetting the
  cue every few miles as a check-in. He still stops — and stops trying to push through — if
  anything sharpens meaningfully or changes his stride, but that is now a low-probability fallback
  rather than an open question about whether running at all is safe. Goal framing is unchanged:
  "solid effort, feel good," not a time goal.
- **Longer arc:** This half is a stepping stone to a **full marathon on Nov 29, 2026**, to be
  built as a bridge plan covering **Weeks 9–18**. That plan does not exist yet. Favor aerobic
  base-building over race-specific sharpening, and don't optimize purely for Sept 19 at the
  expense of durability — the knee section below is the main input to the bridge build, and
  the reason it was written down before the build started rather than after.
- **Knee history — load-bearing context, added Sep 14, 2026.** Kai is 39, healthy BMI and diet.
  In 2023 his foot locked in a rock crevice while backpacking and the pack weight twisted him:
  complete ACL tear, with concomitant meniscus and MCL damage cleaned up surgically in the same
  procedure. ACL reconstruction October 2023, successful. He rehabbed deliberately hard, then
  hired a trainer specifically to build the musculature protecting the knee for skiing, sat out
  a full ski season, and returned to skiing 15 months post-op — his own read is that he is a
  better, more prepared skier now than before the injury, because of that work.
  - **He did not run at all for roughly 20 years before this block**, despite staying very
    active (cycling, hiking, walking, backpacking), and not consistently since the 2023 surgery
    either. This is the single most important physiological fact in the project after the HR
    zones: two decades of aerobic cross-training gave him real cardiovascular fitness and
    **essentially zero running-specific tissue adaptation** — bone, tendon, and the structures
    around the knee. Cardiovascular fitness improves faster than that tissue does, and that gap
    causes pain in returning cross-trained athletes more often than any single old injury does.
    When something hurts, reach for that explanation before reaching for the ACL.
  - **Sep 13, 2026 — first real knee pain during a run.** Upper medial side, onset around mile 6
    of the 8-mile taper long run; eased with a pace reduction and a foot-strike adjustment, and
    he finished. Full incident detail is in `export-2026-09-14-0054.json` in the Drive folder.
  - **DIAGNOSED Sep 15, 2026 by his PT — and it is not the knee.** The problem is an
    **overloaded vastus medialis**, the inner quad just above the knee. Not a joint issue, not a
    graft issue, and in her words **not a long-term blocker to marathon training or racing**.
    The mechanism: a native ACL carries mechanoreceptors feeding real-time joint-position sense,
    and a graft restores the mechanical restraint but not that sensory network, so proprioception
    can stay subtly reduced for years. The downstream effect is a faint tendency for the knee to
    drift inward (dynamic valgus) under running's repeated single-leg loading; the vastus
    medialis is the muscle that corrects that drift, so it has been doing extra work every
    stride. That reads as muscle overload, not joint pain — and it worsens with fatigue, which is
    why the pain arrived at mile 6 rather than mile 1.
  - **The Sep 13 in-run fix was the wrong one.** Kai focused on foot-strike and shoe contact.
    He and the PT now both read that as counterproductive: it pulled attention away from the
    knee, which is the thing that actually needed correcting.
  - **The cue, in force immediately and including race day:** foam roll the quad/vastus medialis
    before running, then run with **one** cue — keep the knee tracking straight forward-back, and
    let the foot land however it naturally lands. One cue, not two.
  - **This supersedes the risk framing that used to live here.** The general ACL/meniscus
    literature below is still background worth keeping in view, but the acute question is
    answered and it is a muscle, not the graft. Do not re-open it as though it were still open.
  - What the literature actually supports, kept brief because it is extrapolation: running is a
    materially lower-risk category for graft stress than pivoting/cutting sports, and the
    reinjury research is dominated by soccer/basketball mechanisms that match neither his tear
    nor his sport. Combined ACL+MCL is common (~38% of ACL injuries) and does well when
    addressed at surgery, as his was. The one signal worth taking seriously long-term: even a
    "minor" concomitant meniscus injury is independently associated with higher rates of a
    symptomatic knee and osteoarthritis at long-term follow-up versus isolated ACL
    reconstruction. Not an emergency — the reason his PT's read outranks any population average.
    Marathon-volume-specific data barely exists; treat all of this as reasonable extrapolation.
- **Monitoring rule — this one is a safety rule, not an analysis preference.** Soreness gone by
  the next morning with no change to gait is normal adaptation: keep going. **Pain that alters
  his stride, or any swelling after a run, means stop and report it** — never run through it to
  see what happens, and never coach him to. If an export or Kai's own account describes either,
  say so plainly and early rather than burying it under the pace analysis.
- **Plan structure:** **8 weeks, Jul 27 – Sep 19, 2026.** Phases by week:
  1–2 Rebuild · 3 Build · 4 Benchmark · 5 Peak build · 6 Peak · 7 Taper begins · 8 Race week.
  The authoritative week/session list is `const PLAN` in `index.html` — read it rather than
  reconstructing the calendar. (An earlier 13-week June-start plan was drafted but never run;
  there are no logged runs between Jun 13 and Jul 23. Ignore any reference to it.)
  **This applies to the producer side too.** The iOS app cannot read the repo, so it has no way
  to check a session it remembers — the Aug 25 export described that day as "1mi WU + 5x1mi +
  1mi CD (7 mi)" when the plan had said 1mi WU + 2mi @ goal + 1mi CD (4 mi) for some time. If you
  are producing an export, do not state what was planned: record what was *run*, and let the
  consumer side match it against `PLAN`. A `planMatch` written from memory is worse than none.
- **Key benchmark:** Aug 22, 2026 — 10K time trial. Feeds the Predicted Finish card via Riegel.
- **Running club:** meets **Thursday or Sunday** — not a fixed Thursday anchor, and Kai often
  does not know in advance which day he can make. Social, conversational pace (~9:00–9:30/mi),
  never programmed as a hard effort day. Because attendance is unpredictable, do not build a
  week that depends on a club run landing on a particular day: program the *session* Kai needs
  and note where a club run can substitute. Club pace is easier than a workout but faster than
  his true Zone 2, so it substitutes for an easy day only loosely — if the club run replaces a
  Zone 2 session, that week has one less genuinely easy run in it.
- **Frequency:** 3–4 runs/week is the real target. Explicitly: "4 days feel like a win, 5 feel
  like a bonus." Kai has said he *could* run 7 days but that this backfires on motivation.
  Never program 7-day weeks. Never frame a missed run as a failure — reframe and move forward.
- **Training partner:** Doug. They don't always run together, but **Doug is also running the
  Orca Half on Sep 19.** Doug is separately being coached by Claude — do not conflate their
  plans, paces, or goal times.
- **Physiology baseline:**
  - **Heart-rate zones come from Apple Fitness, not from a hand-set figure.** As of Aug 25, 2026:
    Z1 <140 · Z2 141–149 · Z3 150–159 · Z4 160–169 · Z5 170+. Apple recalibrates these as fitness
    changes, so treat them as a dated snapshot: when an export reports different boundaries,
    update `HR_ZONES` in `index.html` (and its `asOf` date) rather than arguing with the export.
    A run at or below 149 bpm is an easy day; Zone 1 counts as easy too. These superseded an
    earlier hand-set Zone 2 ceiling of 142 bpm.
  - Easy *pace* still sits around 10:00–10:30/mile. That band was calibrated against the old
    142 bpm ceiling, so it may now be conservative — watch whether easy runs come in under
    149 bpm at a faster pace before moving it.
  - Last year's Orca Half (run untrained): 8:30/mile average, 166–176 bpm, negative-split,
    closed with a 6:58 final mile. This is the "all-out effort" reference point, not the
    training target.
  - Aerobic capacity is a strength; the limiter is muscular endurance and pacing confidence.

## The data pipeline

HealthKit data lives on Kai's iPhone. Only the **Claude iOS app** can read it — a Claude Code
session runs in a cloud container with no route to the device, and there is no Apple Health
connector. So the phone is always the producer, and Google Drive is the transport.

```
Claude iOS app            Google Drive                 Claude Code
──────────────            ────────────                 ───────────
health_query_v0     →     orca-health-exports/   →     read → merge → data.js
(reads HealthKit)         export-*.json                → commit → push → Pages
```

### If you are the iOS app (you have `health_query_v0`): produce

1. Pull the workouts per **Pulling the data** below.
2. Write **one new JSON file per pull** to the Google Drive folder `orca-health-exports`
   (already created, at Drive root). Never edit a previous export — these are append-only, which avoids
   read-modify-write races and keeps an audit trail.
3. Filename: `export-YYYY-MM-DD-HHMM.json` using local Seattle time of the pull.
4. Conform to the shape below. It is reproduced here **on purpose**: the iOS app has twice
   reported this repo as containing only `.gitignore`, `data.js` and `index.html` — including
   fifteen hours after `schema/` was merged to `main` — so it cannot read the repo live and a
   contract referenced by path will never arrive. `schema/health-export.schema.json` in the
   repo is the machine-readable copy for the consumer side; **this block is the authority for
   the producer.** If the two ever disagree, say so in `notes`.

```jsonc
{
  "schemaVersion": 1,
  "pulledAt": "2026-08-22T16:07:09-07:00",   // ISO 8601 with local offset
  "window": { "from": "2026-08-17", "to": "2026-08-23" },
  "notes": "free text — anything odd about this pull",
  "restingHr": [ { "date": "2026-08-21", "bpm": 67 } ],
  "workouts": [{
    "date": "2026-08-22",                     // local Seattle date
    "startLocal": "2026-08-22T14:31:23-07:00",
    "kind": "Running",                        // Running | Cycling | Walking | Ruck | ...
    "segment": "benchmark",                   // OPTIONAL: warmup | benchmark | cooldown.
                                              // Set it whenever a date holds more than one
                                              // record, so they don't collapse together.
    "dist": 6.01,                             // miles; required for Running
    "mins": 44.16,                            // decimal minutes
    "hrAvg": 161, "hrMax": 179,
    "elevGainFt": 0, "cadenceAvg": 196, "calories": 661,
    "source": "Apple Watch",
    "planMatch": "Week 4 Sat — 10K time trial",
    "note": "free text",
    "flags": ["observations only — leave the coaching call to the consumer"],
    "weather": {                              // try HKMetadataKeyWeatherTemperature /
      "tempF": 75, "humidityPct": 48,         // HKMetadataKeyWeatherHumidity on the workout
      "feelsLikeF": 78, "windMph": 2,         // before asking Kai for it
      "conditions": "direct sun, breeze outbound, still air after the turnaround"
    },
    "splits": [ { "mi": 1, "mins": 7.38, "hrAvg": 149, "elevGainFt": 15 } ]
  }],
  "missing": [ "state plainly what this pull could NOT capture" ]
}
```

   **Inferring a closing partial mile gets less reliable as the remainder shrinks.** Subtracting
   the sum of miles 1–5 from the total spreads all of their rounding error across whatever
   distance is left: over a 1.01 mi remainder that is a few seconds per mile, over 0.32 mi it
   swings the answer by ±9 s/mi. Report an inferred partial as indicative, name the remainder
   it was derived over, and never treat it as a measured split.

   **`splits` must be distance-based** — one entry per mile, `mi` counting 1, 2, 3… with a
   fractional final entry. Time-quartered segments are not splits: they cannot be compared
   across runs and they do not reconcile against `dist`. If HealthKit will not yield
   distance-based splits, put that in `missing` and omit the array — do not substitute
   time windows under the `splits` key.
5. **Splits require a second query.** The workout aggregate does not carry them: after pulling
   `workoutType`, run a per-segment `runningSpeed` + heart-rate query for each run, using the
   local-time workaround below. Skipping this step is the single most common way an export
   comes back thinner than it should. If splits genuinely cannot be retrieved, list that in
   `missing` rather than omitting it silently.
6. Fill `missing[]` honestly — unavailable data types, a workout that has not happened yet,
   anything you chose not to query. This is what lets the consumer tell "no runs" apart from
   "not pulled," and it is the honest alternative to guessing.
7. **Omit any field you could not actually measure.** Never estimate, interpolate, or
   back-fill a value to make the schema look complete — a missing `splits` array is fine,
   an invented one corrupts the analysis. Same for `hrAvg`/`hrMax`/`cadenceAvg`.
8. Report to Kai what you wrote and what was missing.

### If you are Claude Code (you have Drive + the repo): consume

0. Read exports newest-last and honour `supersedes` / `corrects`: a later export carrying real
   per-mile splits replaces an earlier approximation, and an annotation can change what a run
   *means* without changing a single measurement. Never edit or delete the superseded file.
   A metric that looks like a physiological signal may be an artifact of who Kai was running
   with, what the weather did, or where he thought the finish line was — ask before concluding
   from a number alone, and prefer his account of the run over an inference from the data.
1. List `orca-health-exports`, read any export newer than the newest run already in `data.js`.
   Drive reports `createdTime` in UTC while the filename and `pulledAt` are Pacific, so the two
   disagree by a date for anything pulled after 17:00 Pacific. The filename and `pulledAt` are
   right; `createdTime` is only for ordering.
2. Merge into `window.SEEDED_ACTUALS`, **deduping by `date`**. Existing rows win only if the
   incoming row has strictly less detail; otherwise the richer row replaces it.
3. Keep runs under 1.0 mi out (accidental / partial recordings). Also drop any workout with
   no distance — `index.html` calls `c.dist.toFixed(2)` unguarded, so a distance-less entry
   breaks the page.
4. Non-running workouts go to `window.CROSS_TRAINING`, not `SEEDED_ACTUALS` — they count for
   training load but must stay out of pace analysis.
5. **Move `window.DATA_THROUGH` in `data.js` to the last date the pull covers in full**, and
   **bump `?v=` on the `data.js` script tag in `index.html`**. Both, every time, even when the
   pull found no new runs — that is exactly when moving `DATA_THROUGH` matters, because it is
   what turns an unlogged session from "Awaiting data" into "Missed".
   - `DATA_THROUGH` is the last *complete* day covered, not the day the pull ran. A pull at
     00:18 on Aug 26 covers Aug 25 in full and says nothing about the rest of Aug 26, so it
     sets `2026-08-25`. Complete means complete in **Pacific** — work from `pulledAt`'s local
     clock, never from a UTC timestamp, or an evening pull will look like it closed a day it
     did not.
   - Sessions after `DATA_THROUGH` with nothing logged read "Awaiting data"; on or before it
     they read "Missed". The page must never call a session missed on a day it has no data for
     — runs reach it through a manual pipeline (phone writes to Drive, a session merges it,
     Pages redeploys) and none of those steps is bounded in time. On Aug 26 a completed run
     showed as Missed for 40 minutes because the day rolled over before the merge landed.
   - The `?v=` bump matters because `index.html` and `data.js` are cached separately: without
     it a browser can pair a fresh page with a stale dataset, and the page would then fall
     back to calling unsynced sessions missed.
6. Commit and push. GitHub Pages redeploys automatically.

### Pulling the data

Use `health_data_types_v0` then `health_query_v0`.

**Known gotcha — timezone offset breaks per-sample queries.** Querying heart rate / pace samples
using the workout record's own start/end timestamps can silently return zero results even when
the workout itself shows up fine. The fix: query using local Seattle clock time directly
(e.g. `10:00`–`13:30` local) rather than deriving the window from the workout record's timestamps.
This matters most for `splits` and `hrMax`, which depend on sample-level data.

**`workoutType` is the reliable aggregate.** Duration, distance, and calories come through
cleanly regardless of the timezone issue above — pull this first for a quick read, then layer in
HR / pace / cadence samples with the local-time workaround.

**If heart rate / HRV / resting HR come back empty or `health_data_types_v0` shows a narrow set
of types:** the health integration may need reconnecting on Kai's end (Settings > Health on iOS).
Flag this plainly rather than silently working around missing data.

## Analysis approach

Compare each new run against two references, not just against last week:
1. **The Zone 2 baseline** (≤149 bpm per Apple's current zones / 10:00–10:30 pace) — is he
   genuinely holding easy effort easy, or drifting into Zone 3 on "easy" days?
2. **Last year's race data** — as fitness builds, easy-pace HR should trend down over weeks;
   that's the fitness signal worth calling out explicitly when it shows up.

**Weather contextualizes pace; it does not correct it.** Never adjust a logged pace, a projection,
or `GOAL_PACE` for conditions — the correction factor would carry more uncertainty than the signal
it is trying to recover, applied on top of a Riegel projection that is already estimating. What
weather is *for* is preventing a misread: a long run 40 s/mi slower in mid-70s direct sun is not a
loss of fitness, and without the conditions logged that is exactly what it looks like six weeks
later. State the conditions alongside the pace and let Kai weigh them.

Useful anchors: endurance performance degrades above roughly 10–15 °C WBGT, and WBGT — not air
temperature — is the metric that matters, because it folds in humidity, wind and solar load. Same
thermometer reading in shade with a breeze versus direct sun with still air is a materially
different physiological cost. Shorter efforts are penalized less than long ones: a 45-minute 10K
accumulates far less core heat than a 1:40 half.

With `splits` available, also check:
- **Cardiac drift / decoupling** on long runs — HR climbing while pace holds flat is the
  aerobic-durability signal that matters most for the marathon arc.
- **Pacing discipline** — negative vs. positive split, and whether "easy" runs actually start easy.

Watch for:
- Long runs that surge in the final mile instead of finishing easy (raises injury/recovery cost,
  and last year's negative-split race pattern makes this an actual known pattern of his).
- **Long-run spikes above ~110% of the longest run in the trailing 30 days.** This is the
  ramp-rate check to lead with; the familiar weekly-mileage 10% rule has weaker evidence behind
  it than its reputation suggests, so treat a weekly jump as context rather than the verdict.
  The injury risk he is most exposed to isn't fitness, it's ramping too fast — and with tissue
  still catching up to his cardio, the single long run is where that bites.
- Knee symptoms of any kind, against the monitoring rule in Context. A run that needed a pace
  or form change to finish is a finding, not a footnote.
- Two or more sessions in a row where pace at the same effort is meaningfully slower than
  baseline — possible under-recovery, not a fitness problem to push through.

## Adjustment logic (draft — Kai can override any of this)

- Missed a run → shift the week, don't stack a makeup session. Never frame it as falling behind.
- Long run above ~110% of the longest run in the trailing 30 days → pull it back before adding
  more. Weekly mileage is the secondary check, not the primary one.
- Zone 2 HR drifting down at consistent pace over multiple weeks → name it as progress, it's real signal.
- Long run finishing with a hard surge → note it, ask if it was terrain or effort, don't
  over-correct off one data point.
- Approaching Taper phase (weeks 7–8) → reduce volume, protect the goal-race legs, resist the
  urge to add one more "quality" session.
- Benchmark projects meaningfully behind the current `GOAL_PACE` → say so plainly and propose
  resetting it in `data.js`. A goal that no longer matches the data is worse than a slower goal.
- A goal-pace session run meaningfully *faster* than the target band is a miss, not a win — it
  trains the strength (top-end speed) and skips the limiter (holding a pace). Name it, and give
  the next goal-pace session an explicit "do not run faster than" ceiling.
- Knee pain reported on a run → the monitoring rule in Context decides, not the training
  calendar. Pain that changed his stride or any post-run swelling outranks whatever the plan
  said that week, and pending the PT visit it is her call rather than this plan's.

### Designing around the tissue gap (inputs for the Nov 29 bridge plan)

These come from the Sep 14 knee-context document and are meant to shape the Weeks 9–18 build
from the start rather than be bolted on. The frame: his cardio does not need running to stay
fit — it needs running to build **tissue tolerance**, which is much slower. Program for the
tissue, not the aerobic engine.

- **Strength, 2×/week — and the PT has now written it.** Her prescribed program *is* this slot,
  no longer a generic recommendation: it is single-leg-dominant work aimed squarely at the
  diagnosed mechanism (vastus medialis / valgus control). **It starts after Saturday's race, not
  during race week** — loaded single-leg squats, loaded lunges and plyometric hopping are a real
  training stimulus, and novel loading this close to a race buys exactly the soreness taper
  exists to avoid. The one safe exception is the unloaded "runner's balance" hold, if he wants
  something proactive before Saturday; it is not necessary.
  - *Leg strength:* single bridge with foot on a foam roller 2×20 · pistol squat with 15 lb
    kettlebell, knee in line with foot, 3×10 · lateral lunges with 15 lb kettlebell 3×10 ·
    barbell or goblet squat (reps not captured).
  - *Coordination / agility:* runner's balance, progressing to a one-side 15 lb kettlebell,
    2×10 · skaters, progressing to longer side-to-side hops, 2×20 · forward single-leg hop ×3,
    progressing further forward, 10 rounds · single-leg pogo hop 1×20s, plus front-to-back and
    side-to-side variants 1×20s each · clock hop double-leg progressing to single-leg, 10 rounds.
  - **This table is a photographed excerpt — rows 3–10 of a larger sheet. Get the complete
    program from Kai before treating it as the whole prescription.**
- **Cadence.** Baseline is ~167–172 spm, sagging into the high 160s on slower or fatigued miles.
  A modest 5–10% increase reduces dynamic knee valgus in the research, which is directly on
  mechanism now rather than generically useful. Expect it to rise somewhat on its own if the
  knee-forward cue is working — do not stack a conscious cadence target on top of the cue.
- **Fueling on long runs.** Carry the race-day approach below into the bridge plan's long runs,
  not just race day: the same central-fatigue mechanism applies any time a run goes long enough
  for it to set in, and a muscle already compensating off a degraded sensorimotor signal is where
  a general loss of neuromuscular precision would show up first.
- **Terrain.** Downhill loads the knee eccentrically harder than flat or uphill. Factor it into
  route choice on Highland Park's hills and into how the bridge plan's long runs are routed —
  this is now a programming variable, not a nicety.
- **Cross-training as filler, not compromise.** An easy bike or hike in place of a second
  running day adds aerobic volume without adding impact to tissue that is still catching up.
  It fits how active he already is outside running, so it costs him nothing to adopt.

## Race-day fueling and the pre-race meal plan (Sep 15)

High-level and deliberately not gram-calculated — Kai asked for ideas and reasoning, not a
nutrition protocol. Forecast for Sep 19 is mild (upper-50s°F at the 7am start, mid-70s later),
so hydration and electrolyte needs are ordinary.

- **In-race:** one gel of ~20–25 g carbs, glucose/maltodextrin-based rather than fructose-heavy,
  around **mile 6–7** (~47–55 min at goal pace) with water at an aid station. A few chews around
  mile 10–11 are optional and not necessary at this distance. The PT suggested fueling on the
  grounds that falling energy availability weakens neuromuscular control; the sharper mechanism
  is *central fatigue* — hypoglycemia measurably reduces voluntary muscle activation, and
  carbohydrate during exercise preserves it in studies of ~2-hour running efforts, which is close
  to his expected race duration. "No risk" is accurate for health; the only real risk is GI
  distress from something untested, which is why Thursday's taste-test matters.
- **Wed Sep 16:** nothing special. Start leaning toward familiar meals and easing off very
  high-fibre or gas-prone foods — gut settling takes days, not hours.
- **Thu Sep 17:** normal balanced meals, carbs a comfortable share of the plate. Test the gel
  (at rest is fine — the point is taste and tolerance). Start easing fibre back at dinner.
- **Fri Sep 18, the main loading day:** for a >90-minute effort the evidence supports a single
  focused carb-forward day spread across meals, not a multi-day marathon-style protocol.
  Breakfast oatmeal/toast/cereal with fruit; lunch a rice or pasta bowl or a sandwich plus fruit;
  dinner familiar and carb-forward, moderate protein, lighter on fat and fibre than usual. Extra
  hydration through the day, pale-yellow urine as a rough gauge. Skip or limit alcohol; normal
  caffeine, timed early enough not to cost sleep.
- **Sat Sep 19, 7am start, leaving ~6:30am.** The tight window is the real constraint — a full
  meal wants 2–3 hours, meaning eating by ~4:30–5am. Either wake ~5am for a light low-fibre
  breakfast (toast or a bagel with honey or jam, a banana, maybe low-fibre cereal), or sleep
  later and keep it small and liquid/semi-solid at 6:15–6:30 (banana, a few dates, a sports
  drink). Nothing new, nothing high-fibre or high-fat. Sip 16–20 oz across the two hours before
  the gun, tapering in the last 30–45 min. If he is a regular coffee drinker, the normal cup
  45–60 min before the start is well supported — skipping it risks mild withdrawal working
  against him. If he is not, race morning is not the day to start.

## Updating the dashboard

The dashboard is a static site in the **ORCA-Dashboard** repo, served at
https://kyhuber.github.io/ORCA-Dashboard/ from the `main` branch.

- `data.js` — all run data (`SEEDED_ACTUALS`, `CROSS_TRAINING`) and `GOAL_PACE`. **This is the
  file that changes when new runs land.**
- `index.html` — the plan (`const PLAN`) and all rendering. Only changes when the plan changes.

Edit `data.js` in place and commit — don't regenerate the site from scratch, that loses history.

**Verifying a deploy from a Claude Code container:** don't curl the live site. `kyhuber.github.io`
is blocked by the sandbox network policy and the request fails with HTTP 000, which is easy to
misread as a stale or failed deploy. Check the `pages build and deployment` workflow run for the
pushed SHA instead — a `success` conclusion means the site is live. `raw.githubusercontent.com`
is reachable, so that works for confirming file contents on `main`.
Keep the tone of any written update motivational and specific — Kai's stated goal for this whole
project is having "an AI partner to help me stay focused and motivated," not a clinical report.
