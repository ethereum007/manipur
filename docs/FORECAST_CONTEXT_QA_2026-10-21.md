# Historical context benchmark QA — 21 October 2026 IST

## Protocol and computation

Dated protocol: docs/FORECAST_CONTEXT_PROTOCOL_2026-10-21.md, committed before implementing the contextual rule. Historical outcomes and existing reference scores had already been inspected; this is not unseen holdout validation, pre-election preregistration or a prospective forecasting record. Exactly three rules were evaluated; no blend, tuning or selected-best-window result was introduced.

Final standalone evaluation: https://github.com/ethereum007/manipur/actions/runs/39501817162 . Pure engine: src/lib/forecast-context.mjs. Reproduce in GitHub with node scripts/build-context-validation.mjs --output work-context/forecast-context-validation.json; the normal site build recomputes and asserts exact equality with the committed report, then exports public JSON. Six fingerprints bind the Assembly winner register, both Parliamentary source datasets, 2019 party-column register, implementation and dated protocol. All project files, processing, tests and screenshots remain in GitHub; no local project writes or clone.

## Rules and fair denominators

A: previous Assembly seat-winning party (prior IND abstains). B: previous statewide Assembly seat-count leader everywhere (context protocol abstains on ties/IND leader; neither real prior year has a statewide tie). C: previous ordinary Parliamentary segment leading party (IND, tied, missing, withheld or unresolved coding abstains). The target is always the independently sourced Assembly winning-party register, not a Parliamentary local lead. Prior-only predictions are computed without target labels; labels are joined in a separate scorer bound to the declared Assembly target year.

2017 common cohort: all 60 seats. A 23/60 (38.3%); B 28/60 (46.7%); C 26/60 (43.3%). C versus A: both correct 21, C-only 5, A-only 2, both wrong 32, net+3. C trails B by 2 matches.

2022 common cohort: 58 seats; AC40 Jiribam prior Assembly IND and AC57 Henglep source contradiction excluded from ALL THREE main scores. A 25/58 (43.1%); B 5/58 (8.6%); C 27/58 (46.6%). C versus A: both correct 21, C-only 6, A-only 4, both wrong 27, net+2. Separate full-eligibility scores remain A 26/59, B 5/60, C 27/59. They are not mixed into the common comparison. Target-year independent outcomes remain observed targets, not exclusions.

Both C windows miss more than half the common seats. A small historical net gain is not stable uncertainty, probability calibration, an independently established forecasting edge or a 2027 favourite. The two transitions are not 118 independent election experiments. Existing Assembly-only reference report scores and denominators remain unchanged.

## Source fidelity and detected header issue

2014 uses sixty reconciled native combined-sheet rows, with five selected scanned-footer comparisons and zero complete individual-station audits. 2019 uses 59 released native individual segment tables; Henglep remains withheld, and its conflicting combined row is never substituted. Exact footer locator p2 is retained for withheld evidence. Existing source exceptions and original historical publication-version limits remain explicit.

The pre-scoring source guard rejected Chingai AC45 column3: source prints NPEP instead of the NPP code in other source headers. Original page reviewed in cloud run https://github.com/ethereum007/manipur/actions/runs/39501137123 . SHA-256 b04c5395197f02be814739c3baf974d3c870566f8143237e4f74d7fb18d016ed, page 1. Version 1.1 column register preserves that exact literal exception; no NPP/NPEP merger alias or identity inference is made. The same source prints IND as a prefix; the marker guard now accepts its explicit prefix syntax. This source handling was fixed before any successful contextual score was inspected. Selected source image is retained in docs/review.

JD(U)/JDU (United) punctuation/name renderings are explicitly documented in the source-column register. No undocumented merger, alliance, defection or candidate continuity mapping repairs a missed party prediction. Candidate names, sensitive identities, opinion guesses, directory labels and future 2024/2026 observations are not predictive inputs.

## Tests and public lab

Five new unit tests exercise target/future poison invariance; target-label separation and target-year rejection; equal common denominators; complete abstention ledger; prior independents versus observed target independents; literal new codes; statewide/candidate ties; missing/withheld inputs; unchanged Henglep withholding after combined-row poisoning; literal NPEP preservation; and score/confusion/paired-count conservation.

Public /outlook/context provides two-window/three-rule/seat/outcome filters, all 120 seat observations, source links, common-cohort chart, separate full-eligibility scores, exclusions, paired gains/losses and confusion counts. Links from the original validation lab, source register and 2014 explorer establish discovery. Readiness remains partial/not-ready for probability publication. Sitemap includes the context lab and the previously omitted 2014 explorer.

Full site release https://github.com/ethereum007/manipur/actions/runs/39501966218 succeeded for d25a23c11691093c964b3da896defb4f3712311d. All 42 data tests and 22 browser tests passed, five landscape PDF pages verified, and 911 HTML pages / 31,137 internal references passed with zero errors. Both the legacy reference report and the new context report reproduced exactly in the same build. Desktop and 390px mobile screenshots inspected: readable full-width mobile controls, common-score chart, explicit score/denominator labels, source-vintage warning and intentional swipeable tables; no blocking defect or page-level horizontal overflow. Production /outlook/context/ and /data/forecast-context-validation.json returned HTTP 200; common cohorts [60,58], C correct counts [26,27], vintageVerified=false and probabilitiesAvailable=false verified. Production sitemap contains both the context lab and 2014 explorer. Screenshots and original selected NPEP header image are retained in docs/review.

## Next finite research phase

Investigate one additional compatible Assembly window, beginning with official 2007 source availability, archived document hashes and geographic/AC comparability to 2012. Do not pool based only on similar names or uncertified DataMeet geometry. Add a window only under a dated protocol revision when source comparability is supportable; keep all scores retrospective and do not treat one extra window as sufficient calibration. Continue bounded source/disclosure reviews secondarily. Henglep remains unresolved unless additional primary evidence permits resolution. Hourly cadence ACTIVE.
