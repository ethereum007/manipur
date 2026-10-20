# Forecast input register QA — 20 October 2026

Production code: 32e175a0dea0d1d7c6d8c033ffbb547844fe3fbb. Successful build/deployment: https://github.com/ethereum007/manipur/actions/runs/39473044732.

## Source-scoped inventory

Published /outlook/inputs with 60 constituencies and 12 slots per seat (720 total). Five 2022 Assembly result features, two 2024 ordinary Parliamentary-context features, two dated directory observations and three explicitly missing reviewed 2027 input sets are kept separate. No fitted model or win probability is produced. No religion, ethnicity, inferred voter identity, merged candidate identity or unreviewed disclosure value enters this inventory.

Assembly margins and shares recompute from complete reconciled 2022 candidate votes. Source URLs, pages and original-PDF hashes accompany those and Parliamentary rows. Directory fingerprints are explicitly labelled as allowlisted profile-field extract hashes, not whole-page hashes. All three input file hashes are checked during cloud recomputation against the committed snapshot.

knownBy is the platform snapshot capture date, not an invented first-publication date. Original publication dates remain null. The cut-off assessment separates future event years, unestablished historical availability, missing reviewed inputs, current captured observations and a not-applicable vacancy-party slot. A later capture does not establish historical availability; this does not imply that the earlier election result was unpublished. Cut-off status is an observation-coverage assessment, not approval of a feature for a model. Values remain visible for audit even when withheld; the strict captured-subset selector excludes future/unproven/missing values. Existing historical benchmarks continue using their previous winner-only protocol, with no silent feature changes.

AC49/56 directory party values remain null and not applicable within the 2026 capture, separately from their source-observed vacant status. They are not filled with a party, zero or a nomination assumption. Complete verified 2027 nominee sets, verified alliance assumptions and reviewed representative opinion inputs remain missing per seat; this is coverage, not a claim that no announcements or studies exist.

## Verification

30 data tests and 18 browser tests passed. New tests verify all sixty cohorts, exact margin arithmetic, null 2027 inputs, future-event exclusion, conservative historical-vintage handling, strict captured subsets, source fingerprints and vacancy semantics. Each build independently reproduces the inventory. Browser tests cover twelve-row rendering, date switches, source distinctions, query-selected AC49, phone control widths, no page-level horizontal overflow and sixty-row JSON export.

Reviewed desktop (AC1, 2023 cut-off) and mobile (AC49, current capture) screenshots. Controls, source/event labels and missing/vacancy language are legible. The wide research table intentionally scrolls within its container with an explicit instruction. No blocking visual defect found. Representative screenshots are retained in docs/review.

Five-page briefing PDF passed. Full-site integrity: 909 HTML pages, 30,999 local references, zero errors. Production GET confirmed /outlook/inputs/?ac=49, preserved query, inventory section, 60-seat/720-slot JSON download and the local Tadubi link.

## Continuing priorities

The hourly cadence remains ACTIVE. Forecast backlog step 1 is complete as a contextual inventory, not a completed forecasting model. Next: investigate original 2014/2019 Parliamentary segment inputs for pre-2017/pre-2022 context, plus compatible additional Assembly history and dated candidate/alliance evidence where available. No numerical probability is justified merely by inventory coverage.
