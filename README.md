# Manipur 2027 · The Political Atlas

A source-led, nonpartisan data-journalism application built with Next.js App Router, TypeScript, React and D3 geographic projection.

**Preview:** https://ethereum007.github.io/manipur/

## GitHub-only workflow

The owner requires project storage and execution in GitHub. Source changes go to main. GitHub Actions installs dependencies, acquires official documents, performs OCR, normalizes records, builds the static application and runs Playwright in Chromium. No local clone or installation is needed.

- **Build, browser QA and GitHub Pages:** automatic on main; screenshots and traces in the visual-review artifact; deployment requires passing tests.
- **Research acquisition:** manual workflow; originals in a 3-day primary-source-archive artifact, hashes and extracted pages in the repository. This workflow is intentionally separate from page builds.
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
