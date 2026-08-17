// Orca Half Marathon — training data
// Edit this file to update run data; index.html reads these as globals.

// Logged runs. Seeded from Apple Health, pulled by Claude on Aug 13, 2026.
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
];

// Non-running load — counted for training stress, excluded from pace analysis.
// Fields: date, kind, dist (mi), mins — hrAvg / hrMax / note optional.
window.CROSS_TRAINING = [
  {date:"2026-08-01", kind:"Cycling", dist:4.50, mins:19.3, note:"Replaced Sat tempo"},
  {date:"2026-08-01", kind:"Cycling", dist:2.68, mins:11.1, note:""},
  {date:"2026-08-09", kind:"Ruck", dist:4.17, mins:105.2, hrAvg:113, hrMax:151, note:"60+ lb pack · ~430 ft gain"},
  {date:"2026-08-10", kind:"Ruck", dist:4.06, mins:112.4, hrAvg:104, hrMax:149, note:"60+ lb pack · ~650 ft gain"},
];
