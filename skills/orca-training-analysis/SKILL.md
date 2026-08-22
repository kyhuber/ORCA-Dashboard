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
- **Goal pace:** **7:56/mi → 1:44:00 finish.** Single source of truth is `window.GOAL_PACE`
  in `data.js`. Never hardcode a goal time anywhere else — the dashboard derives the projected
  finish, the pace-chart goal line, and the week 7–8 target paces from that one value.
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
- **Key benchmark:** Aug 22, 2026 — 10K time trial. Feeds the Predicted Finish card via Riegel.
- **Fixed anchor:** Thursday running club — social, slow, conversational pace. Never programmed
  as a hard effort day.
- **Frequency:** 3–4 runs/week is the real target. Explicitly: "4 days feel like a win, 5 feel
  like a bonus." Kai has said he *could* run 7 days but that this backfires on motivation.
  Never program 7-day weeks. Never frame a missed run as a failure — reframe and move forward.
- **Physiology baseline:**
  - True Zone 2 sits around 10:00–10:30/mile at ~136–142 bpm.
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
4. Conform exactly to `schema/health-export.schema.json` in the ORCA-Dashboard repo.
   `schema/example-export.json` is a worked example.
5. **Omit any field you could not actually measure.** Never estimate, interpolate, or
   back-fill a value to make the schema look complete — a missing `splits` array is fine,
   an invented one corrupts the analysis. Same for `hrAvg`/`hrMax`/`cadenceAvg`.
6. Report to Kai what you wrote and what was missing.

### If you are Claude Code (you have Drive + the repo): consume

1. List `orca-health-exports`, read any export newer than the newest run already in `data.js`.
2. Merge into `window.SEEDED_ACTUALS`, **deduping by `date`**. Existing rows win only if the
   incoming row has strictly less detail; otherwise the richer row replaces it.
3. Keep runs under 1.0 mi out (accidental / partial recordings).
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
1. **The Zone 2 baseline** (136–142 bpm / 10:00–10:30 pace) — is he genuinely holding easy effort
   easy, or drifting into Zone 3 on "easy" days?
2. **Last year's race data** — as fitness builds, easy-pace HR should trend down over weeks;
   that's the fitness signal worth calling out explicitly when it shows up.

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
- Benchmark projects meaningfully behind 1:44 → say so plainly and propose resetting
  `GOAL_PACE` in `data.js`. A goal that no longer matches the data is worse than a slower goal.

## Updating the dashboard

The dashboard is a static site in the **ORCA-Dashboard** repo, served at
https://kyhuber.github.io/ORCA-Dashboard/ from the `main` branch.

- `data.js` — all run data (`SEEDED_ACTUALS`, `CROSS_TRAINING`) and `GOAL_PACE`. **This is the
  file that changes when new runs land.**
- `index.html` — the plan (`const PLAN`) and all rendering. Only changes when the plan changes.

Edit `data.js` in place and commit — don't regenerate the site from scratch, that loses history.
Keep the tone of any written update motivational and specific — Kai's stated goal for this whole
project is having "an AI partner to help me stay focused and motivated," not a clinical report.
