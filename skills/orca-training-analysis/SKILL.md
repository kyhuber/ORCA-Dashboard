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
- **Goal pace:** the single source of truth is `window.GOAL_PACE` in `data.js` — **read it, do
  not quote a figure from memory.** It was **7:42/mi → 1:40:56** as of the Aug 22 benchmark,
  reset from an earlier 7:56/mi → 1:44:00; it can be reset again, so any number written here is
  only ever a snapshot. Never hardcode a goal time anywhere else — the dashboard derives the
  projected finish, the pace-chart goal line, and the week 7–8 target paces from that one value.
- **Framing:** Not competitive. Kai's own words: "solid effort, feel good about the race."
  Train the experience, not the clock.
- **Longer arc:** This half is a stepping stone to an eventual full marathon. Favor aerobic
  base-building over race-specific sharpening. Don't optimize purely for Sept 19 at the expense
  of durability.
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
2. Merge into `window.SEEDED_ACTUALS`, **deduping by `date`**. Existing rows win only if the
   incoming row has strictly less detail; otherwise the richer row replaces it.
3. Keep runs under 1.0 mi out (accidental / partial recordings). Also drop any workout with
   no distance — `index.html` calls `c.dist.toFixed(2)` unguarded, so a distance-less entry
   breaks the page.
4. Non-running workouts go to `window.CROSS_TRAINING`, not `SEEDED_ACTUALS` — they count for
   training load but must stay out of pace analysis.
5. Commit and push. GitHub Pages redeploys automatically.

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
- Weekly mileage jumps of more than ~10% week over week — the injury risk he's most exposed to
  isn't fitness, it's ramping too fast.
- Two or more sessions in a row where pace at the same effort is meaningfully slower than
  baseline — possible under-recovery, not a fitness problem to push through.

## Adjustment logic (draft — Kai can override any of this)

- Missed a run → shift the week, don't stack a makeup session. Never frame it as falling behind.
- Mileage jump >10% week over week → pull it back before adding more.
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
