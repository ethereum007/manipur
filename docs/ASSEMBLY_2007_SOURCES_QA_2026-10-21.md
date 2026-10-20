# 2007 Assembly source-readiness QA — 21 October 2026 IST

## Release and scope

Production code: f9a1db48bb32d6ec17ccfd14a1247e0243b0ae2e. Successful cloud build/deploy: https://github.com/ethereum007/manipur/actions/runs/39509114570. Production /outlook/inputs/#assembly-2007-sources and /data/assembly-2007-source-audit.json both returned HTTP 200 with the expected section and readiness fields after deployment.

First acquisition https://github.com/ethereum007/manipur/actions/runs/39508290361 recovered 60/60 indexed official 2007 general-election Form 20 PDFs, 101 pages, native text in every document; plus the four-page official annual administrative report. First immutable archive and dated manifest are linked in the public audit. Separate ECI statistical report and boundary-order requests returned HTTP 406, preserved without invented hashes. Selected AC1 rendered original page visually inspected; no complete all-page or numerical audit claimed.

Administrative report pages 2–3 records June 2 by-elections for AC1 and AC35. This native-text observation is explicitly scoped and kept separate from general-election records. Two regression tests cover source identity/hash/coverage, retrieval failure semantics and the prohibition on silently promoting acquisition to an approved historical benchmark or replacing general-election records with by-elections.

Second acquisition https://github.com/ethereum007/manipur/actions/runs/39508937543 also recovered the sixty sheets and preserved unreviewed native table diagnostics in data/processed/assembly-2007-pages.json. India Code alternate boundary-order copy timed out; both ECI requests again returned 406. See ASSEMBLY_2007_DIAGNOSTIC_FOLLOWUP_2026-10-21.md and its complete retrieval manifest. Public first-capture snapshot remains unchanged.

## Verification

- 44 data tests, all passed; 23 browser tests, all passed.
- Five landscape briefing PDF pages verified.
- Static audit: 911 HTML pages, 31,138 internal references, zero errors.
- Desktop 1440px and mobile 390px screenshots reviewed: editorial type hierarchy, source links and stacked columns legible; no clipping or horizontal page overflow. Saved alongside this receipt under docs/qa/assembly-2007-2026-10-21/.
- New public JSON export checked in browser tests and production.
- Existing reference/context benchmark reports and twelve-slot snapshots remain unchanged and pass golden checks.

## Remaining finite gates

1. Reconcile all sixty native Form 20 candidate-column and ordinary/postal/final totals; publish exceptions instead of guessing.
2. Recover/archive authoritative boundary documentation and assess 2007-to-2012 comparability beyond matching names/numbers.
3. Freeze an explicit general-election-only additional-window protocol before scoring. This retrospective work does not establish original historical publication-version availability or prospective validation.

No new historical score, 2027 probability, fitted model, identity inference or complete manual audit is claimed. All current project authoring, acquisition, diagnostics, builds and screenshots are in GitHub; no local project writes or installations were used. Hourly cadence remains active.
