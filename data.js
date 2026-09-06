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
// The Sep 3 pull ran at 22:02 Pacific over a Sep 3 window, so it does not cover Sep 3
// in full and Sep 2 is the last date it closes over -- the same reasoning that set
// this to Aug 31 off the Sep 1 22:45 pull. A logged run matches its session before
// this check runs, so Thursday's easy run reads as done regardless, and Sunday's long
// run sits past the line and reads "Awaiting data" until an export covers it.
window.DATA_THROUGH = "2026-09-02";

// Logged runs. Seeded from Apple Health; latest pull Sep 3, 2026 via the
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
  // Week 6 Tuesday, the peak-week tempo: 1mi WU + 3mi @ goal pace + 1mi CD. Run solo
  // in the evening, started 9:38pm. 4.52 mi against 5 planned -- the missing half mile
  // is all cool-down, so the session's quality volume was hit in full.
  //
  // The three quality miles came back 8:00 / 8:02 / 7:54, averaging 7:59/mi against a
  // 7:37-7:47 band. That is 12 s/mi outside the slow edge and 17 s/mi off the 7:42 goal.
  // Read the whole-run average with the same care Aug 25 needed, for the opposite
  // reason: 8:34/mi overall folds in a 9:45 warm-up and a 9:13 cool-down and makes the
  // session look far worse than it was.
  //
  // The heart rate is the story, not the pace. Mile 4 ran 7:54 at 170 bpm; on Aug 30,
  // two days earlier, mile 10 ran 7:52 at 156 -- the same pace for 14 more beats, and
  // 170 is the floor of Zone 5. The cool-down then held 170 bpm while pace fell away to
  // 9:13/mi, which is not what a recovered runner's heart does when the effort stops.
  // Resting HR that morning was 86 against a 79 median over the preceding week.
  // Everything here reads as accumulated load: a 3-hour hike on Aug 29, the longest run
  // of the cycle on Aug 30, then a hard evening session on Sep 1.
  //
  // Merged from two watch recordings with a ~6.5 min stop between them, sitting between
  // mile 2 and mile 3. Kai's account, which settles it: the watch was not recording the
  // way he wanted and he stopped to sort it out. So the stop was a full standing recovery
  // rather than anything the session asked for, and the "3 continuous miles" of the
  // export's planMatch is not what happened -- it was 1 mi at pace, a break, then 2 mi at
  // pace. That is an easier session than the continuous three that were written.
  //
  // Which makes the heart rate worse, not better, and corrects the reading first recorded
  // here: mile 3's 166 is a mean across a restart ramp, not a steady state. HR fell
  // through the break and climbed back over the opening minutes of the mile, so 8:02/mi
  // was costing more than 166 by the end of it. Mile 2's 150 understates the cost the
  // same way from the other side -- it came straight off the 9:45 warm-up with HR still
  // catching up. Mile 4 is the one split carrying neither artifact, and it says 7:54/mi
  // cost 170 bpm. Read the progression as two ramps around a genuine ~170 steady state,
  // not as 150 -> 166 -> 170 of drift.
  //
  // The export scores mile 4 against a 7:56 goal pace and calls the session an interval
  // workout of 4x1mi. Both are stale phone-side notes -- GOAL_PACE has been 7:42 since
  // the Aug 22 benchmark, and the plan has asked for 3 continuous goal-pace miles since
  // the Aug 23 rebuild. The measurements themselves are sound.
  //
  // Splits sum to 38:06 against the 38:45 total; the ~39 s difference is a 0.04 mi tail
  // at the end of the first recording that has no split of its own. That tail also means
  // the closing partial covers 0.48 mi rather than 0.52, putting it at ~9:13/mi against
  // the 9:17 the export states -- indicative either way over so short a remainder.
  // Cadence averaged 168 spm. No elevation or weather: neither was retrievable.
  {date:"2026-09-01", dist:4.52, mins:38.75, hrAvg:160, hrMax:180,
   splits:[
     {mi:1, mins:9.750, hrAvg:151},
     {mi:2, mins:8.000, hrAvg:150},
     {mi:3, mins:8.030, hrAvg:166},
     {mi:4, mins:7.900, hrAvg:170},
     {mi:4.52, mins:4.420, hrAvg:170},
   ]},
  // Week 6 Thursday, the easy day: 4 mi solo in true Zone 2, hold back. Run exactly
  // that way -- solo, 7:13pm, Delridge / West Duwamish Greenbelt. 4.02 mi at 141 bpm
  // average against a Zone 2 that tops out at 149, and at the top of the 136-142 band
  // that counts as genuinely easy.
  //
  // The export files this as "Westies club run" and matches it to a Group session.
  // Both are wrong: Kai had a scheduling conflict and ran alone, and the plan has
  // programmed this day as a solo Zone 2 run since the Aug 23 rebuild. It is the same
  // failure mode as the Aug 27 export, which also assumed the Thursday club run, and
  // the same family as the stale goal paces -- the phone cannot read the repo, so it
  // reconstructs context from memory and gets it wrong. The measurements are sound.
  //
  // It matters here because it changes what the run demonstrates. A club run at
  // 9:58/mi would mean the group happened to go out easy; running 9:58 alone, with
  // nobody setting the pace, is a deliberate choice to hold back. That is the harder
  // version and the one that transfers.
  //
  // This is the run the Sep 1 entry said was owed. Resting HR came back 74 on both
  // Sep 2 and Sep 3 against 86 on Sep 1 -- the lowest two readings in the series, and
  // the fatigue behind Tuesday's 170 bpm at 8:00/mi has cleared rather than compounded.
  //
  // No cardiac drift, and the claim rests on miles 2-4: 10:01 / 10:08 / 10:00 while HR
  // read 145 / 139 / 141. Heart rate falling while pace holds flat is the opposite of
  // decoupling. Mile 1's 145 is the one figure here not to lean on -- see below.
  //
  // Worth holding next to the easy days from three weeks ago. Aug 13 ran 8:24/mi at
  // 157 bpm and Aug 18 ran 8:45/mi at 153, both programmed easy and neither of them
  // easy. Tonight is 141. Most of that is discipline rather than physiology -- he is
  // choosing to hold back where he used to drift -- but it is the change that makes
  // the aerobic base actually accumulate.
  //
  // Two data caveats, both from the export and neither affecting the read above.
  // Kai confirmed the watch lost wrist contact from 19:16:23 to 19:21:44 and he
  // adjusted it mid-run; those 52 samples read 92-110 bpm while he was running and are
  // invalid. They were dropped, not backfilled -- a synthesized sample is
  // indistinguishable from a measured one downstream. hrAvg 141 survives it: the 282
  // clean samples mean 141.59 against Apple's time-weighted 141, two methods agreeing
  // inside 0.6 bpm. The bad window sits entirely inside mile 1 (which ended 19:22:59),
  // so mile 1's displayed 145 comes from Apple's smoothed stream rather than the raw
  // one, and this session's Apple zone breakdown -- Zone 1 in particular -- is
  // contaminated and must stay out of any time-in-zone trend.
  //
  // mins is moving time. Wall clock was 43:53 against 40:01 of movement, about 3:52 of
  // pauses at traffic lights; the splits reconcile to moving time within half a second,
  // and pace analysis wants the time he was actually running. Cadence 168 spm. No
  // elevation: health_query_v0's workout record does not expose it and flightsClimbed
  // is not a substitute, so this is a tool limit, not a gap in the watch data.
  {date:"2026-09-03", dist:4.02, mins:40.02, hrAvg:141, hrMax:163,
   splits:[
     {mi:1, mins:9.700, hrAvg:145},
     {mi:2, mins:10.020, hrAvg:145},
     {mi:3, mins:10.130, hrAvg:139},
     {mi:4, mins:10.000, hrAvg:141},
     {mi:4.02, mins:0.170, hrAvg:141},
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

// Daily resting heart rate, as reported by the exports. It is the cheapest recovery
// signal in the pipeline and until now the page threw it away, so the series starts
// where the exports start rather than where training did -- Aug 27 is the first pull
// that carried it, not the first day it was measured.
//
// A single reading says very little: this series moves 72 -> 80 -> 72 on consecutive
// days that held a run, a hike and nothing at all. What is worth reading is the level
// against the recent run of days, which is why the dashboard shows the latest figure
// beside a trailing median instead of a day-over-day delta.
window.RESTING_HR = [
  {date:"2026-08-27", bpm:72},
  {date:"2026-08-28", bpm:80},
  {date:"2026-08-29", bpm:72},
  {date:"2026-08-30", bpm:79},
  {date:"2026-08-31", bpm:80},
  // 86 is the high of the series, two days after the 10.18 mi long run and three after
  // the hike -- the 80 on Aug 31 is the morning-after reading. Resting HR still climbing
  // on day two is the ordinary shape of a hard weekend, not a warning on its own; what
  // makes it worth reading is that the Sep 1 tempo agrees with it.
  {date:"2026-09-01", bpm:86},
  // The spike resolves. Two days at 74 -- the lowest pair in the series -- and the
  // Sep 3 easy run agrees with them, so Sep 1's 86 was the weekend's load clearing
  // rather than the start of a hole. The Sep 3 export re-reported Aug 28 - Sep 1
  // unchanged, which is the first independent confirmation these readings are stable.
  {date:"2026-09-02", bpm:74},
  {date:"2026-09-03", bpm:74},
];
