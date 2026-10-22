# Integrated historical readiness and current-source index QA — 22 October 2026 IST

Production code: 593f8c2f7a91112be338866b32b4119fffdf74bd. Successful full build, browser and Pages deployment: https://github.com/ethereum007/manipur/actions/runs/39729169216.

## Completed finite work

Reconciled all five existing evaluation views directly against their seat-level predictions and observed Assembly targets. There are three distinct Assembly transitions, not five: the Parliamentary-context views reuse 2017 and 2022 targets. The deterministic builder asserts score/cohort agreement and records three input-report SHA fingerprints. It exports common and full-eligibility scores separately, each view's exclusions and frozen rule policy. No pooled hit rate, significance estimate, fitted model or probability was computed. Existing Assembly-only, earlier-register and Parliamentary-context golden reports remain unchanged.

Common repeat/statewide counts: 2007→2012 22/50 and35/50; 2012→2017 23/60 and28/60; 2017→2022 26/59 and5/59. Context views use common repeat/statewide/Parliamentary counts23/60,28/60,26/60 and25/58,5/58,27/58. All full denominators remain separately visible. Context2022 excludes AC40 prior IND and AC57 unavailable2019 source, so its repeat result must not be confused with26/59. Statewide tie policies remain distinct across frozen protocols. The public readiness register and outlook copy now describe three transitions, correlated observations and missing prospective/source-vintage evidence accurately.

## Bounded official source capture

Source acquisition run: https://github.com/ethereum007/manipur/actions/runs/39728401329. Three official HTML index responses were captured entirely in GitHub: CEO candidate index, Assembly party-position page and CEO homepage. All returned200; response hashes/bytes, UTC capture timestamps, selected headings/links and explicit scope retained in current-source-index-audit.json. Full HTML was hashed in the runner but not retained/exported; no personal contact fields or full-page text were published.

Party-position page prints an as-of date of11September2025 while its site footer says5October2026. The selected homepage nomination link points to a2021–2022 document path, not a verified2027 nomination. These are bounded index observations, not a complete search of party announcements or official accepted nominations. A missing indexed set does not prove no announcements exist. October2026 Returning Officer and2026 electoral-roll links are leads only; their documents were not reviewed in this phase. Current directory effective dates remain null and earlier observations remain unchanged.

## Automated and visual verification

74 Node tests,15 Python source/adversarial checks and33 browser tests passed. New tests reject changed scores, invalid common cohorts, duplicate seats, future Parliamentary context and duplicate target-transition claims. Exact inventory regeneration runs on every build. Five landscape PDF pages verified. Static audit:912HTML pages /31,196local references /zero errors.

An initial cloud run39728733950 was blocked by two disclosure geometry tests. Failure snapshot showed the transient main-content loading fallback while DOM text assertions had previously found the section; geometry values were zero. Measurements now explicitly wait for the grid to be visible, scrolled into view and positive-height before enforcing the original spacing threshold. No spacing threshold was relaxed and no CSS changed. Final normal-font and blocked-font checks passed. This records the observed loading-state failure and correction, not an unproven CSS/font root cause.

Six final screenshots visually reviewed and retained in docs/qa/integrated-readiness-2026-10-22/: evaluation desktop/mobile, current-input audit desktop/mobile and disclosure coverage desktop/mobile. Typography, grid spacing, mobile wrapping and intentionally scrollable table were clean; no page overflow or overlap. Production validation/outlook pages and all three updated JSON exports returned200. Published inventory and source-audit JSON exactly matched committed cloud artifact bytes. All project authoring, acquisition, processing, builds and screenshots remained in GitHub; orchestration used memory only.

## Remaining finite backlog

1. Acquire and hash the two concrete official PDFs linked from the captured CEO homepage: final2026 SIR press note and15October2026 RO/ARO Gazette. Review title/date and relevant aggregate/administrative scope; preserve reference/capture/effective dates separately. Do not download personal electoral-roll records or promote an RO appointment into candidate, alliance or territorial-continuity evidence. Archive/render in GitHub and publish only reviewed aggregates when supported. If sources fail after bounded attempts, record exact blockers rather than loop.
2. Review the next two previously unreviewed fixed financial-summary regions. Selected coverage currently remains5candidates/10notes;260without comparison and zero complete independent audits. Preserve existing financial and53-versus56case-count discrepancies.
3. Close this bounded readiness/source phase with updated gates and remaining externally dependent candidate/alliance/opinion/vintage evidence. No probability model is justified by this inventory alone. Cadence remains requested while scoped tasks remain.
