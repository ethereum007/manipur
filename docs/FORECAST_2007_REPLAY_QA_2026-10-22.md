# Original-register 2007 → 2012 replay QA — 22 October 2026 IST

Production code: 0ab55e765492026f5049c5b4b9dfc6cb3c54acbc. Successful complete cloud build/browser/Pages run: https://github.com/ethereum007/manipur/actions/runs/39723399172. Initial isolated replay generation and adversarial tests: https://github.com/ethereum007/manipur/actions/runs/39723000394.

## Completed finite phase

Implemented the exact separately frozen protocol from revision 485e97c4a8a1d4badfa8eaaf89700d3b1fdfedb5. Pure predict2007 accepts only the original 2007 register; score2012 accepts detached predictions and separately validated 2012 targets. The builder serializes predictions before opening the target file, checks pinned predictor/target/lineage/acceptance hashes and records protocol, engine, builder and prediction fingerprints. A separate JSON report is committed and exact-regenerated on every build. Existing two-window and Parliamentary-context golden reports remain unchanged.

## Results and denominators

On the identical fifty-seat common cohort: prior-seat party 22/50; prior statewide non-IND seat leader 35/50. Full eligibility: prior-seat party 22/50 and statewide rule 42/60. Excluded from both common-cohort scores by fixed prior IND policy: AC19,42,43,44,45,48,49,51,52,53. All sixty target party codes, predictions, matches/misses, exclusions and target source/page locators are published. No identity merge, modern party alias or replacement of original general-election entries occurred. Prior statewide leader is INC, counted from original seat entries rather than unique people; ties or no non-IND party abstain.

The new frozen rule abstains on ties; older two-window protocol retains its documented alphabetical tie break. Neither requires a changed historical result. No aggregate accuracy across differently scoped windows is presented as prospective performance.

## Tests and visual review

70 Node data tests passed, including detached prediction isolation, target perturbation without changing predictions/cohorts, unique-leader/tie/all-IND abstention, exact NPP/NPEP codes, IND noncontinuity, duplicate-person seat counting, row-order invariance, invalid source/target rejection and real-source report regeneration/fingerprints. Fifteen Python source/adversarial checks and 32 browser tests passed. Five landscape PDF pages verified. Static audit: 912 HTML pages / 31,187 local references / zero errors.

Final replay desktop, mobile and mobile sixty-row table screenshots, plus updated source-acceptance desktop/mobile panels, were visually reviewed. No overlap or page overflow; the mobile table intentionally scrolls horizontally with its hint visible. Five images retained in docs/qa/forecast-2007-replay-2026-10-22/. Integration updated current boundary-status labels and the browser assertions while preserving immutable pre-implementation decision/protocol JSON snapshots.

Production /outlook/validation/, /outlook/boundaries/ and /data/forecast-2007-replay.json returned HTTP 200 after successful deployment. Published JSON bytes matched the cloud-generated committed report SHA exactly. No project acquisition, execution, processing, builds, screenshot files or repository writes were performed locally; authoring and GitHub REST orchestration used memory only.

## Limits and next finite work

This is retrospective reconstruction after historical outcomes were already available, not prospective preregistration or an unseen holdout. Three election transitions and correlated seats do not establish calibration. Historical online publication-version proof and certified territorial extent remain unavailable. Six withheld 2007 candidate-vote tables and thirteen candidate-name differences remain unresolved. No 2027 probabilities, nominations, favourites, voter motives or inferred sensitive identities are produced.

Next: bounded integrated readiness reconciliation across the three historical transitions, preserving differing protocols, cohorts and source vintage. Review current-affiliation/nomination/alliance source availability with event/capture/effective dates and explicit missing observations; do not invent a 2027 candidate set. Then advance the next two fixed-region primary financial-summary reviews. Current selected coverage remains 5 candidates / 10 notes, 260 without selected comparison, zero complete independent affidavit audits. Cadence remains requested while this finite research backlog remains.
