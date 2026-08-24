// Orca Half Marathon — training data
// Edit this file to update run data; index.html reads these as globals.

// Goal race pace, min:sec per mile. Drives the projected finish time, the
// target paces on goal-pace sessions in weeks 7-8, the dashed line on the
// pace chart, and the 10K time the Predicted Finish card asks you to hit.
// Set from the Aug 22 benchmark: 6.01 mi in 44.16 (7:21/mi) projects to 1:40:56
// via Riegel. Riegel assumes endurance scales with speed; the longest run this
// cycle is 9.02 mi, so this target leads the endurance base rather than reflecting it.
window.GOAL_PACE = "7:42";

// Logged runs. Seeded from Apple Health; latest pull Aug 22, 2026 via the
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
];

// Non-running load — counted for training stress, excluded from pace analysis.
// Fields: date, kind, dist (mi), mins — hrAvg / hrMax / note optional.
window.CROSS_TRAINING = [
  {date:"2026-08-01", kind:"Cycling", dist:4.50, mins:19.3, note:"Replaced Sat tempo"},
  {date:"2026-08-01", kind:"Cycling", dist:2.68, mins:11.1, note:""},
  {date:"2026-08-09", kind:"Ruck", dist:4.17, mins:105.2, hrAvg:113, hrMax:151, note:"60+ lb pack · ~430 ft gain"},
  {date:"2026-08-10", kind:"Ruck", dist:4.06, mins:112.4, hrAvg:104, hrMax:149, note:"60+ lb pack · ~650 ft gain"},
  {date:"2026-08-22", kind:"Walking", dist:1.03, mins:20.24, hrAvg:123, hrMax:141, note:"Cool-down after the benchmark — recovery, not load"},
];
