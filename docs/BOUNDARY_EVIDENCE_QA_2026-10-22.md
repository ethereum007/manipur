# Boundary evidence release — QA receipt

Date: 22 October 2026 IST. Production code: ce21d5a04b15f70c5735f7715fa7945a263ca6f6.

## Delivered research

Recovered and archived three distinct official source files through GitHub Actions: two ECI releases published by PIB, dated 2 and 3 March 2009, and the February 2019 ECI Handbook for Candidate hosted by CEO Manipur. Source acquisition succeeded for all three, with HTTP 200, original-file SHA-256 hashes, capture dates and archive filenames. The handbook contains 472 pages; only the selected delimitation passage on PDF page 24, printed page 20, section 1.17.1 was visually inspected in this phase. The edition wording was checked against published title-page text. No all-page visual review is claimed.

Acquisition run: https://github.com/ethereum007/manipur/actions/runs/39715154538
Original archive: https://github.com/ethereum007/manipur/releases/download/primary-sources-2026-10-19/boundary-continuity-run-39715154538.zip
Manifest: docs/boundary-continuity-manifest-2026-10-22.json.
Public review: data/research/boundary-continuity-review.json.

The sources provide dated context about Manipur's exception to the new delimitation exercise described under the 2002 Act. The 2009 seat-count backgrounder is Parliamentary in scope; it is not an Assembly boundary table. The later handbook directs candidates to corrected constituency orders, and is not itself the original order or a contemporary 2012 election notification. Reference dates, archive capture dates and legal effective dates are not conflated.

## Product and verification

New research page: https://mandateterrain.com/outlook/boundaries/
Export: https://mandateterrain.com/data/boundary-continuity-review.json

Linked from the forecasting landing page and the 2007 source audit; added to the sitemap and static export. Uses existing editorial components and typography, stable source identities, server-rendered JSON imports, source locators, bounded findings and a finite missing-evidence table. No client payload or model input was added for the documentary review.

Final cloud build, browser QA and deployment succeeded:
https://github.com/ethereum007/manipur/actions/runs/39716752187

59 Node data tests, 15 Python source/adversarial tests and 30 browser tests passed. Five landscape PDF pages verified. Static audit: 912 HTML pages, 31,179 local references, zero errors. Existing feature-inventory, Assembly-reference and Parliamentary-context golden reports remain unchanged.

Desktop 1440 and mobile 390 screenshots of the new page and disclosure coverage were visually reviewed. Typography, source dates, limits, table scrolling and card spacing are readable; no page overflow. Permanent proofs are in docs/qa/boundary-evidence-2026-10-22/.

Production checks returned HTTP 200 for the page and JSON export. The page contains the new title; all three source hashes match the committed ledger. Geographic compatibility, additional benchmark approval, historical publication-version verification and prospective forecast validation remain false.

## Regression caught and corrected

The first full run (39715705848) blocked deployment on an existing disclosure-spacing assertion. Waiting for fonts alone in run 39716352726 did not solve it: the new fallback-font test measured a real zero-pixel gap even after fonts settled. Removed the optional grid-margin override introduced with the new source-page styling. The final run passes the original desktop/mobile spacing requirement and an additional test with web-font requests blocked. No spacing threshold was relaxed. Compiler/cascade internals were not independently established as a root cause; the observed regression and effective correction are recorded without attributing it to font timing.

## Remaining scope and finite next batch

This release completes the acquisition and selected-passage review batch. It does not approve the 2007–2012 comparison or compute an extra score. The numerical audit remains 54/60; AC9,11,20,42,57,59 remain withheld. Thirteen name differences remain unresolved, without identity aliases.

Next: assess the complete archived documentary chain, including the earlier 2018 ERO/AERO legal-context passage and the existing 2012 primary statistical report, then write an explicit source-acceptance/compatibility decision. Seek a specific additional official order or operational source only where a material gap remains. Do not repeat broad searches or treat unchanged names/counts as extent proof. A winner-party-only protocol may assess the sixty-seat elected-member register independently of incomplete full vote tables. Freeze source acceptance, cohorts and evaluation rules before computing a score.

Later documentary sources may inform a clearly labelled retrospective compatibility audit; they must not enter an earlier election's predictive features. Historical online availability remains a separate unresolved source-vintage question. No 2027 nomination, favourite, motive or probability is inferred.

Primary disclosure coverage remains five candidates and ten selected financial notes, with 260 candidates lacking a selected comparison and zero independently complete affidavit audits. Cadence remains active. Project files, acquisition, builds and screenshots were kept in GitHub; no local project writes.
