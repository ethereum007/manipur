# Historical forecast validation lab — 20 October 2026

Production code: 3714d563f61610c639c228e4d597ae2d1d0e367f. Successful cloud build and deployment: https://github.com/ethereum007/manipur/actions/runs/39471084665. The hourly continuation cadence is ACTIVE with predictive readiness as its primary priority.

## Reproducible research

Protocol 1.0 replays two deliberately simple winning-party-code rules: repeat the previous seat winner, and choose the prior statewide largest party by Assembly seat count everywhere. Each build recomputes the complete report from the versioned independent winner register and checks the committed snapshot including its input SHA-256. It uses 2012 inputs for 2017, and 2017 inputs for 2022. Predictions are computed before target labels are joined for scoring. No 2024 Parliamentary target, current directory, candidate financial field or post-target event is used.

Results on the shared comparison cohorts:

| Input year | Target year | Repeat party | Prior statewide seat leader | Cohort |
|---|---|---|---|---|
| 2012 | 2017 | 23/60 (38.3%) | 28/60 (46.7%) | 60 |
| 2017 | 2022 | 26/59 (44.1%) | 5/59 (8.5%) | 59 |

The 2017 independent winner in AC40 Jiribam is not treated as a continuous party or automatic person match. Repeat abstains; both comparison scores exclude that seat. It remains visible in the error register. The statewide rule also has a separately labelled full-cohort score of 5/60. Literal party codes are retained without post-hoc merger/alliance repair. Independent target outcomes are historical categories only. Largest party by seats is not equated with government formation.

This is a retrospective replay after outcomes were known, not a pre-registered prospective forecast or reconstruction of all contemporaneously available information. Two transitions and correlated seats do not establish stable calibration; the 119 comparable rows are not 119 independent elections. No Brier/log-loss, calibrated win probabilities, future candidate predictions or 2027 seat projection is claimed.

## Product

Added /outlook/validation with benchmark comparisons, window/rule/constituency/outcome filters, all sixty historical observations per window, confusion counts, protocol and readiness gates, source fingerprint and JSON exports. Added entry points on outlook, research desk, sitemap and all sixty local 2027 evidence notes, including query-selected constituency context.

Readiness gates document historical input availability and explicit missing or partial inputs: dated membership, complete verified nominations/alliances, representative opinion evidence, additional evaluation history, probability estimation/calibration and a prospective record. They are evidence statuses, not a self-assigned quality or probability score.

## QA and fixes

27 data tests and 17 browser tests passed. Regression checks alter held-out outcomes and add future records without changing benchmark outputs; enforce fair independent exclusions and confusion-count conservation; reject incomplete, duplicate and reversed windows. The public replay report is checked against a fresh recomputation in every build.

The first browser run blocked deployment on an imprecise accessible filter name; explicit names fixed it. Screenshot review then found four cramped phone filters with invisible selected values. They now stack at phone widths with shorter option labels; a 390px browser check requires each control width to be at least 300px. Final desktop and corrected mobile screenshots were visually reviewed: filter values, score denominators and chart labels are legible. Tables intentionally scroll within their containers with an explicit instruction; no page-level horizontal overflow.

The five-page PDF remains verified. Full-export audit: 908 HTML pages, 30,903 internal references, zero errors. Production HTTP checks confirmed the lab with ac=40 preserved, corrected controls, both JSON exports and the local Jiribam link. Deployment succeeded. Representative website screenshots are retained under docs/review.

## Continued work

See FORECAST_RESEARCH_BACKLOG_2026-10-20.md. Next is a dated sixty-seat feature inventory with per-feature vintages and missing-input flags, followed by historical Parliamentary-as-input acquisition feasibility, compatible Assembly evaluation history and model research. The initial release checklist is not a stop condition; continuation stays active.
