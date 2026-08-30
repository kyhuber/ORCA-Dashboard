// Orca Half Marathon — training data
// Edit this file to update run data; index.html reads these as globals.

// Goal race pace, min:sec per mile. Drives the projected finish time, the
// target paces on goal-pace sessions in weeks 7-8, the dashed line on the
// pace chart, and the 10K time the Predicted Finish card asks you to hit.
// Set from the Aug 22 benchmark: 6.01 mi in 44.16 (7:21/mi) projects to 1:40:56
// via Riegel. Riegel assumes endurance scales with speed; the longest run this
// cycle is 9.02 mi, so this target leads the endurance base rather than reflecting it.
window.GOAL_PACE = "7:42";

// The last date a health export covers in full. Everything on or before it is
// known: a planned session with nothing logged against it really was missed.
// After it the dashboard knows nothing either way, so those sessions read
// "Awaiting data" instead of being called missed on no evidence.
//
// Set this to the last COMPLETE day a pull covers, not the day the pull ran --
// the Aug 30 13:33 pull covers Aug 29 in full but says nothing about the rest of
// Aug 30. Move it on every merge, along with the ?v= on the data.js script tag in
// index.html.
//
// A logged run matches its session before this check runs, so the Aug 30 long run
// reads as done either way. Week 5 is now complete and week 6 has not started, so
// nothing is marked missed at this value.
window.DATA_THROUGH = "2026-08-29";

// Logged runs. Seeded from Apple Health; latest pull Aug 30, 2026 via the
// orca-health-exports Drive pipeline (see skills/orca-training-analysis/SKILL.md).
// Runs under 1.0 mi are excluded (accidental / partial recordings).
// Fields: date (YYYY-MM-DD), dist (mi), mins — hrAvg / hrMax / elev optional.
window.SEEDED_ACTUALS = [
  {date:"2026-06-11", dist:3.05, mins:31.78},
  {date:"2026-06-12", dist:4.02, mins:34.43},
  {date:"2026-06-13", dist:9.14, mins:96.11},
  {date:"2026-07-23", dist:3.14, mins:30.35},
  {date:"2026-07-27", dist:4.35, mins:36.96},
  {date:"2026-07-29", dist:3.02, mins:25.07},
  {date:"2026-07-30", dist:3.16, mins:28.84},
  {date:"2026-08-02", dist:6.14, mins:59.57, hrAvg:145, hrMax:170, elev:"~430 ft gain"},
  {date:"2026-08-13", dist:5.08, mins:42.68, hrAvg:157, hrMax:185, elev:"~110 ft gain"},
  {date:"2026-08-16", dist:9.02, mins:77.10, hrAvg:154, hrMax:175, elev:"~440 ft gain"},
  {date:"2026-08-18", dist:4.04, mins:35.38, hrAvg:153, hrMax:171, elev:"~320 ft gain"},
  {date:"2026-08-21", dist:3.02, mins:27.55, hrAvg:126, hrMax:157, elev:"~80 ft gain"},
  {date:"2026-08-22", segment:"warmup", dist:1.02, mins:10.34, hrAvg:118, hrMax:135},
  // 6.01 mi, not 6.21: the watch was set to miles and the effort was run as a 6-mile
  // trial — kicked at the 5-mile mark for a perceived final mile and stopped there.
  // A genuine all-out effort for the distance covered, so Riegel scales from it cleanly.
  // Mid-70s, direct sun, breeze outbound and still air after the turnaround.
  // Splits read from the Apple Fitness splits screen. Miles 1-3 were run alongside
  // Doug, who was slowing; Kai held back to stay with him, so they are not a
  // maximal effort. The final entry is inferred (total time less miles 1-5) and
  // carries no HR. Nothing renders these yet — they are here so the highest
  // resolution record of the benchmark is not lost to a Drive file.
  {date:"2026-08-22", segment:"benchmark", dist:6.01, mins:44.16, hrAvg:161, hrMax:179, elev:"flat — no gain recorded",
   splits:[
     {mi:1, mins:7.450, hrAvg:149},
     {mi:2, mins:7.583, hrAvg:156},
     {mi:3, mins:7.717, hrAvg:161},
     {mi:4, mins:7.500, hrAvg:162},
     {mi:5, mins:7.233, hrAvg:167},
     {mi:6.01, mins:6.677},
   ]},
  // Club run, moved to Sunday. Ran 5.32 easy in place of the planned 7.5 mi
  // decoupling test — a sound call the day after an all-out 10K. HR drifted
  // 132->162 while pace slowed 41 s/mi: 9:55/mi at 162 bpm here against
  // 7:21/mi at 161 the day before. Next-day fatigue, not a fitness reading.
  // The closing 0.32 mi is inferred; over so short a remainder the rounding
  // on miles 1-5 swings it between 9:02 and 9:19, so treat it as indicative.
  {date:"2026-08-23", dist:5.32, mins:50.19, hrAvg:144, hrMax:162, elev:"275 ft gain",
   splits:[
     {mi:1, mins:9.233, hrAvg:132},
     {mi:2, mins:9.283, hrAvg:138},
     {mi:3, mins:9.450, hrAvg:144},
     {mi:4, mins:9.367, hrAvg:154},
     {mi:5, mins:9.917, hrAvg:162},
     {mi:5.32, mins:2.937},
   ]},
  // Week 5 Tuesday tempo: 1mi WU + 2mi @ goal pace + 1mi CD. Run solo from home
  // at 10:51pm. The structure was hit exactly -- easy mile, two hard miles, easy
  // mile -- but the two middle miles were not run at goal pace. They were run at
  // 6:54 and 6:37 against a 7:37-7:47 target, roughly 55 s/mi too fast.
  //
  // Read the average with care: 7:45/mi overall lands dead centre of the goal band
  // and looks like textbook execution. It is an artifact of averaging 8:27 / 6:54 /
  // 6:37 / 8:57. Nothing on the page renders splits yet, so the Actual line on this
  // session will read as a perfect hit. It wasn't one -- it was an interval session.
  //
  // Apple's own zone boundaries for Kai, captured for the first time here:
  // Z1 <140, Z2 141-149, Z3 150-159, Z4 160-169, Z5 170+. Time in zone:
  // 3:04 / 6:24 / 5:02 / 7:43 / 8:49. That is 8:49 above 170 bpm on a session meant
  // to be comfortably hard. These are now the dashboard's zones -- see HR_ZONES in
  // index.html, which previously capped Zone 2 by hand at 142 bpm. Apple recomputes
  // them as fitness changes, so a later export reporting different boundaries
  // should update HR_ZONES rather than be reconciled against this entry.
  //
  // hrMax 181 is a block high, past the Aug 22 benchmark's 179. Post-run HR fell
  // 144 -> 120 -> 114 over two minutes; a 24 bpm first-minute drop is strong.
  // Miles 1-4 read off the Apple Fitness splits screen sum to 30:55 against a 31:04
  // total; the ~9 s remainder is a 0.01 mi end-of-run fragment plus split rounding,
  // too small to carry as a segment. Elevation and cadence weren't retrieved -- the
  // HealthKit pull timed out mid-export -- so no gain figure is recorded here.
  {date:"2026-08-25", dist:4.01, mins:31.07, hrAvg:159, hrMax:181,
   elev:"flat overall — a downhill stretch in mile 2, uphill in mile 3; no gain figure recorded",
   splits:[
     {mi:1, mins:8.450, hrAvg:141, powerW:235},
     {mi:2, mins:6.900, hrAvg:163, powerW:311},
     {mi:3, mins:6.617, hrAvg:177, powerW:321},
     {mi:4, mins:8.950, hrAvg:160, powerW:271},
   ]},
  // Week 5 Thursday, run solo around Delridge / Westcrest Park at 7:27pm. The plan
  // asked for an easy 4 mi in true Zone 2, holding back. He ran 3.86 and did it.
  // The export hedges that Thursday is "typically the Westies 5K group run" -- that
  // was the pre-Aug-23 week 5. The rebuilt plan programs this day as a solo Zone 2
  // run, so this is the session, run as written.
  //
  // Time in zone, on Apple's boundaries (unchanged from Aug 25):
  // 6:25 / 25:39 / 3:52 / 0:03 / 0:00. About 70% of the run inside Zone 2, the
  // drift falling to both sides rather than one, and three seconds above 160 bpm.
  // Kai's read was that he kept slipping out of the band; the data says he held it
  // better than it felt, and that he erred low more often than high -- 6:25 too
  // easy against 3:52 too hard. That is the opposite of Aug 13 and Aug 18, which
  // ran easy days at 157 and 153 bpm avg.
  //
  // The number worth keeping: HR read 142 / 144 / 145 / 146 across the four splits
  // while pace moved 9:45 -> 9:05 -> 9:40. Four beats of drift across 37 minutes,
  // and mile 2 bought 40 s/mi for two of them. Compare Aug 23 -- the same 144
  // average, but arrived at by climbing 132 -> 162. That run was inside 24 hours of
  // an all-out 10K, so fatigue explains part of the gap; the flat 10 mi on Aug 30
  // is the honest decoupling test, not a 37-minute evening run.
  //
  // No hrMax: the export did not carry one, so none is recorded rather than
  // estimated. The 0:03 in Zone 4 puts the peak just over 160, which is a floor,
  // not a maximum. Post-run HR fell 138 -> 126 -> 120. The 12 bpm first minute
  // reads smaller than Aug 25's 24, but that drop started from 144 at the end of a
  // Zone 5 session -- recovery scales with how high the finish was, so the two
  // numbers are not comparable.
  //
  // Mile 4 is a real 0.86 mi read off the splits screen (8:18), not inferred by
  // subtraction as on Aug 22 and Aug 23. The ~5 s it leaves against the 36:53 total
  // is rounding across the four displayed splits.
  {date:"2026-08-27", dist:3.86, mins:36.89, hrAvg:144,
   elev:"no significant elevation change — no gain figure recorded",
   splits:[
     {mi:1, mins:9.750, hrAvg:142},
     {mi:2, mins:9.083, hrAvg:144},
     {mi:3, mins:9.667, hrAvg:145},
     {mi:3.86, mins:8.300, hrAvg:146},
   ]},
  // Week 5 Sunday, the peak long run: 10.18 mi in 89:47 (8:47/mi), and the longest
  // run in the file -- past the 9.14 from June and the 9.02 in August. Run the
  // morning after a three-hour hike.
  //
  // The session it was written against: 8 easy miles, then the closing 2 at goal
  // pace, banded 7:42-7:50 with 7:35 as a floor after Aug 25 came back 55 s/mi hot.
  // Miles 9 and 10 were 7:33 and 7:52 -- mile 9 two seconds under the floor, mile 10
  // two seconds past the slow end, and a two-mile average of 7:42.6 against a 7:42
  // goal. That is the cap held, not missed. The comparison is Aug 25, which asked
  // for 7:37-7:47 and returned 6:54 and 6:37 with 8:49 spent above 170 bpm. Today
  // peaked at 168 and never entered Zone 5.
  //
  // The durability read matters more than the finish. Miles 1-8 averaged 9:02/mi at
  // about 139 bpm, and the heart rate did not trend: 140, 139, 134, 139, 138, 139,
  // 136, 145, while pace moved from 9:18 down to 8:56. Eight miles with effectively
  // no cardiac drift, the day after three hours on foot. 49:29 of the 89 minutes sat
  // in Zone 1. This is the decoupling test the Aug 27 entry said was still owed, and
  // it came back clean.
  //
  // Against the Zone 2 anchor of 10:00-10:30 at 136-142 bpm, 9:02/mi at 139 is 60-90
  // s/mi faster at the same heart rate. Terrain and conditions are not controlled
  // between those two, and no elevation figure was retrievable here, so read it as a
  // strong signal rather than a measurement.
  //
  // The export's planMatch calls this "last 3mi @ goal pace"; the plan says 2, and 2
  // is what was run. It also scores the closing miles against a 7:56 goal, which has
  // been 7:42 since the Aug 22 benchmark reset. Both are stale notes on the phone
  // side; the measurements themselves are sound.
  //
  // Splits sum to 89:26 against the 89:28 total -- rounding across eleven segments.
  // No elevation: flightsClimbed came back inconsistent and nothing was estimated
  // from it. The closing 0.18 mi at 9:53/mi is the easy finish after the effort.
  {date:"2026-08-30", dist:10.18, mins:89.47, hrAvg:142, hrMax:168,
   splits:[
     {mi:1, mins:9.300, hrAvg:140},
     {mi:2, mins:9.050, hrAvg:139},
     {mi:3, mins:9.420, hrAvg:134},
     {mi:4, mins:8.930, hrAvg:139},
     {mi:5, mins:8.850, hrAvg:138},
     {mi:6, mins:8.630, hrAvg:139},
     {mi:7, mins:9.120, hrAvg:136},
     {mi:8, mins:8.930, hrAvg:145},
     {mi:9, mins:7.550, hrAvg:158},
     {mi:10, mins:7.870, hrAvg:156},
     {mi:10.18, mins:1.780, hrAvg:148},
   ]},
];

// Non-running load — counted for training stress, excluded from pace analysis.
// Fields: date, kind, dist (mi), mins — hrAvg / hrMax / note optional.
window.CROSS_TRAINING = [
  {date:"2026-08-01", kind:"Cycling", dist:4.50, mins:19.3, note:"Replaced Sat tempo"},
  {date:"2026-08-01", kind:"Cycling", dist:2.68, mins:11.1, note:""},
  {date:"2026-08-09", kind:"Ruck", dist:4.17, mins:105.2, hrAvg:113, hrMax:151, note:"60+ lb pack · ~430 ft gain"},
  {date:"2026-08-10", kind:"Ruck", dist:4.06, mins:112.4, hrAvg:104, hrMax:149, note:"60+ lb pack · ~650 ft gain"},
  {date:"2026-08-22", kind:"Walking", dist:1.03, mins:20.24, hrAvg:123, hrMax:141, note:"Cool-down after the benchmark — recovery, not load"},
  // Saturday hike, 2h57m at 94 bpm average and 119 max -- aerobic time on feet, well
  // under any running zone. Logged here rather than in SEEDED_ACTUALS because it is
  // not a run and must stay out of pace analysis.
  //
  // The export files it as replacing "Week 5 Sat -- Tempo" and flags that the week's
  // tempo effort did not happen. Both are wrong: the Aug 23 rebuild removed the
  // Saturday tempos, week 5 runs Tue/Thu/Sun, and its tempo was Aug 25, which was
  // run. This hike displaced nothing and is added load on top of a complete week.
  // No elevation figure -- flightsClimbed returned inconsistent totals for the window.
  {date:"2026-08-29", kind:"Hiking", dist:7.25, mins:177.21, hrAvg:94, hrMax:119,
   note:"2h57m easy — added load, not a replacement for any session"},
];
