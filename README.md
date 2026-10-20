# Manipur 2027 · The Political Atlas

A source-led, nonpartisan data-journalism application built with Next.js App Router, TypeScript, React and D3 geographic projection.

**Website:** https://mandateterrain.com/

## GitHub-only workflow

The owner requires project storage and execution in GitHub. Source changes go to main. GitHub Actions installs dependencies, acquires official documents, performs OCR, normalizes records, builds the static application and runs Playwright in Chromium. No local clone or installation is needed.

- **Build, browser QA and GitHub Pages:** automatic on main; screenshots and traces in the visual-review artifact; deployment requires passing tests.
- **Research acquisition:** manual workflow; statistical originals and SHA256 checksums preserved in the primary-sources-2026-10-19 GitHub release; extracted pages in the repository. This workflow is intentionally separate from page builds.
- **Normalize and audit election records:** manual workflow; candidate sums and independent winner register checks; inconsistent source tables are withheld and documented.

## Architecture

- src/app: server-rendered App Router routes, 60 statically generated constituency pages and election-scoped candidate routes.
- src/components: reusable editorial primitives, map, search, comparisons, chronology and presentation.
- data/raw: immutable fetched documents, GitHub runner only; never commit large scans.
- data/processed: source extracts, provenance, normalized records, independent winners and quality reports.
- data/research: curated notes with date, classification and source IDs.
- scripts/ingest: reproducible cloud ingestion.
- scripts/validate-data.mjs: duplicate, rank, vote-total and coverage checks.
- docs/architecture/SCHEMA.sql: optional relational storage schema; the published research edition needs no paid backend.

## Verification

The three core pages were reviewed from 1440px and 390px browser screenshots before expansion. Tests check page errors, overflow, year selection, constituency search and comparison. Later checks include all 60 routes and keyboard briefing navigation.

Missing data are never converted to zeros. Election-day winners are separate from later House membership. The DataMeet reference map is marked pre-delimitation; it is not a certified current boundary product.

## Optional setup elsewhere

If a future developer chooses a separate development environment with adequate storage: Node 22, Python 3.11; npm install; pip install requests pyshp shapely; python scripts/prepare-preview.py; npm run dev. NEXT_PUBLIC_BASE_PATH=/manipur is used only for the GitHub Pages build. npm run build creates out/. npm test runs arithmetic checks. npm run test:e2e runs Chromium browser checks.

Read SOURCES.md, DATA_DICTIONARY.md, LIMITATIONS.md and PROGRESS.md before interpreting results. Acquisition does not establish complete verification.

## Verified coverage

180 election-day Assembly winners (60 each in 2012/2017/2022); 58 complete 2017 candidate contests; 37 complete 2022 contests; reviewed 2012 Heingang votes; all 265 official 2022 candidacies with affidavit links; all ten 2024 parliamentary candidates. Remaining candidate votes, disclosures, 2024 segment accounting and turnout are explicitly incomplete. See PROGRESS.md for outstanding research.

Reproduce the 2022 candidate index with `node scripts/ingest/index-candidates-2022.mjs` in a GitHub runner after source acquisition. This checks all 60 constituencies, 265 unique records, party labels and affidavit AC numbers, and retains reviewed vote totals.

## Executive meeting edition

Open `/briefing/` for the five-minute walkthrough, presenter notes and a five-page PDF handout. `/presentation/` retains the full 15-slide research briefing. `/development/` includes the official 2026–27 fiscal explorer. Source acceptance distinguishes original-image review from machine-reconciled OCR; both retain provenance. Domain setup is documented in docs/architecture/DOMAIN.md.

## Research expansion — 20 October 2026

[2024 segment explorer](https://mandateterrain.com/analysis/segments/) · [265 disclosure summaries](https://mandateterrain.com/analysis/disclosures/) · [Evidence coverage and discrepancies](https://mandateterrain.com/analysis/evidence/)

804 reconciled Assembly candidate results across 179 of 180 contests. All 60 ordinary 2024 Parliamentary segments, two separately reviewed special-station groups, candidate-by-candidate reconciliation, and local 2027 evidence notes. Religion/community fields require sourced public self-description; unknown stays null. No unverified future nominations, causal findings or winning probabilities are invented.

All project processing and builds remain in GitHub. Native PDFs, extracted snapshots and ADR summary source pages are archived in [GitHub Releases](https://github.com/ethereum007/manipur/releases/tag/primary-sources-2026-10-19). See LIMITATIONS.md and DATA_DICTIONARY.md before reusing data.
