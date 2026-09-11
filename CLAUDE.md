# ORCA-Dashboard

Static training dashboard for Kai's Brooks Orca Half Marathon build, served by GitHub Pages
from `main` at https://kyhuber.github.io/ORCA-Dashboard/.

- `data.js` — run data (`SEEDED_ACTUALS`, `CROSS_TRAINING`, `RESTING_HR`), `GOAL_PACE`,
  `DATA_THROUGH`. This is the file that changes when new runs land.
- `index.html` — `PLAN`, `HR_ZONES`, and all rendering. Changes only when the plan changes.
- `skills/orca-training-analysis/SKILL.md` — **the canonical reference.** Read it before
  touching either file. It carries the training context, the Drive export pipeline, and the
  merge rules, and it is the authority where this file is silent.
- `schema/health-export.schema.json` — machine-readable contract for the Drive exports.

## Kai is in Seattle. Every date here is Pacific.

`America/Los_Angeles`, and this is the single easiest thing to get wrong in this repo.

The plan, the run dates, `DATA_THROUGH`, the export filenames, and the day Kai means when he
says "today" are all **Pacific** dates. A Claude Code container's clock is **UTC** — 7 hours
ahead in PDT, 8 in PST — so from 17:00 Pacific onward the container has already rolled over to
tomorrow. Kai runs in the evening often enough that this is the normal case, not an edge case.

It has already caused two real errors: an export written to Drive under a Sep 9 filename for a
Sep 8 run, and a Sep 10 run reported back to Kai as "yesterday's run" by a session that trusted
its own clock.

**Before reasoning about recency, setting `DATA_THROUGH`, or telling Kai when a run happened:**

```sh
TZ=America/Los_Angeles date
```

Never say "today", "yesterday", or "last night" from the environment's date. Drive's
`createdTime` is UTC too — the export filename and `pulledAt` are the Pacific truth, and
`createdTime` is good only for ordering.

`index.html` already handles this correctly via `PLAN_TZ` and `todayISO()`. If your sense of
"today" disagrees with the page, the page is right.

## Conventions worth knowing before an edit

- **Never hardcode a goal pace.** `window.GOAL_PACE` in `data.js` is the only source; the
  projected finish, the pace-chart goal line, and the week 7–8 targets all derive from it.
  Phone-side export notes have repeatedly carried a stale `7:56` — correct them in a comment,
  but keep the flag text verbatim.
- **`mins` is moving time**, not elapsed, wherever the two differ. Where a run has a real
  standstill the entry says so; do not "correct" it to elapsed.
- **Never estimate a missing measurement.** Omit `elevGainFt`, `cadenceAvg`, `hrAvg` and the
  rest rather than back-filling them. An absent field is fine; an invented one corrupts the
  analysis.
- **Bump `?v=` on the `data.js` script tag in `index.html` on every data change.** The two
  files cache separately, and a fresh page paired with a stale dataset will call synced
  sessions missed.
- **Runs under 1.0 mi stay out**, and every `SEEDED_ACTUALS` row needs a `dist` —
  `index.html` calls `c.dist.toFixed(2)` unguarded.

## Checking a change

There are no tests and no CI. Validate directly:

```sh
node --check data.js
python3 -m http.server 8899    # then load index.html headless and check for page errors
```

The Chart.js CDN is blocked from the sandbox, so a headless load needs it stubbed or it will
throw `Chart is not defined`. Don't curl the live site to verify a deploy — `kyhuber.github.io`
is blocked and returns a misleading HTTP 000; check the `pages build and deployment` run for
the merged SHA instead. `raw.githubusercontent.com` is reachable and works for confirming file
contents on `main`.
