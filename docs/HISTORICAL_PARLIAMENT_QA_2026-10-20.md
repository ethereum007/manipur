# Historical Parliamentary acquisition QA — 20 October 2026

Source acquisition: https://github.com/ethereum007/manipur/actions/runs/39474110759. Production code: 1e80998f906dfd8928cc3d4974990d93565a9043. Successful build/deployment: https://github.com/ethereum007/manipur/actions/runs/39474663620.

## Sources recovered

Official indexes: https://ceomanipur.nic.in/ResultSheets/LSResult2014.html and https://ceomanipur.nic.in/lse2019. Each lists sixty indexed segment references plus two combined-result documents. The 2014 Heirok AC33 link points to 34.pdf, also linked for Wangjing Tentha; hence its sixty references have only fifty-nine distinct indexed URLs. A separate 33.pdf diagnostic probe was tracked without rewriting that source index. Total: 125 references, 124 distinct source URLs. All 124 returned PDFs that opened successfully; 258 pages across unique URLs (127 from 2014, 131 from 2019, including combined/diagnostic sources).

Native text exceeded the eighty-character page threshold in every one of the sixty 2019 indexed segment sources, and in none of the 2014 indexed segment sources. This is machine-readiness evidence, not table reconciliation or a complete visual audit.

Original PDFs and the acquisition manifest are permanently archived at https://github.com/ethereum007/manipur/releases/download/primary-sources-2026-10-19/historical-parliament-2014-2019-run-39474110759.zip. The release asset exists, size 36,646,974 bytes. Archive entries use content-derived filenames and preserve original document hashes/source URLs in the manifest. No source vote values were normalized or added to forecast features by this acquisition.

## Selected header review

Codex visually inspected original first-page images for 2014 33.pdf (33 - Heirok), 2014 34.pdf (34 - Wangjing Tentha), 2019 01.pdf (1 - Khundrakpam), and 2019 60.pdf (60 - Singhat (ST)). These establish the selected header observations only. The original indexed Heirok-to-34 reference and recovered 33 diagnostic remain distinct in public JSON. No duplicate 34 vote table is assigned to Heirok. Vote totals, complete candidate/party mappings, source-to-target comparability and non-ordinary reconciliation remain pending. Original source-review images were not used as site graphics; only website QA screenshots are retained in docs/review.

## Product and verification

Added a historical-source section to /outlook/inputs, with explicit reference-versus-unique-URL counts, text-readiness coverage, mapping discrepancy, source links, archive and JSON download. Current twelve-slot feature inventory and winner-only historical benchmark outputs are unchanged.

32 data tests and 19 browser tests passed. Tests guard complete logical index cohorts, document/source fingerprints, separate diagnostic role, non-equivalent Heirok/Wangjing files and pending numerical-normalization status. Browser tests confirm coverage text, discrepancy labels, model-input limits, JSON response and no mobile page-level horizontal overflow. Five-page PDF verified; full site audit passed for 909 HTML pages and 31,001 internal references.

Reviewed desktop and mobile website screenshots: coverage and mapping caveats remain legible; wide table scroll is explicit; no blocking defects. Production verified the section and 124-document JSON with HTTP 200, successful deployment and permanent release asset.

## Next bounded task

Normalize 2019 native segment tables first: verify both Parliamentary candidate column maps, parse all sixty final rows, reconcile candidate sums and NOTA/rejected totals, compare ordinary segment sums against combined result sheets and record residuals separately. Use selected original header/footer review; withhold contradictory rows rather than repairing them silently. Do not confuse source retrieval with approved model features. 2014 needs OCR/image review and separate Heirok mapping provenance. Cadence remains ACTIVE.
