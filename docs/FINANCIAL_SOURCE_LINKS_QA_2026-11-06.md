# Financial source-page links QA — 6 November 2026

Closes docs/FINANCIAL_SOURCE_LINKS_PENDING_2026-11-05.md. Bounded criterion: adjacent official PDF page links have visible separation and an accessible group label, with unchanged financial observations.

- Code: 83e8fe7d709fa57399222ff0c0f41b806d5c6b02, src/components/disclosure-field-review.tsx. Flex wrapping, row/column gaps and named source-page group.
- Full cloud run 42061095190 succeeded; build 127362708400 and deployment 127369365805 succeeded. 141 Node + 15 Python + 98 browser checks = 254; five landscape PDF pages; 913 HTML pages / 31,468 internal references / zero reference errors.
- Screenshot collector 42065840965 and collector-triggered full run 42065808805 reached final success. Retained images: docs/qa/financial-source-links-2026-11-05/financial-dingo-b60-desktop.png and financial-ranjit-b60-mobile.png. Both profiles manually inspected: Dingo PDF 17/18 links visibly separate; Ranjit mobile source link readable without clipping. Coverage images were retained but are not claimed manually reviewed. Multi-link mobile wrapping was not separately exercised; existing browser mobile-overflow checks passed.
- Production checked 6 November: /candidates/heikham-dingo-singh-2022-16/ returns the named group, expected spacing and both PDF page 17/18 anchors. Live disclosure-field-reviews-2022.json is semantically identical to repository data (serialization is not claimed byte-identical).
- Coverage remains 120 candidates / 238 scoped field notes / 145 candidates without selected comparison / zero complete independent affidavit audits. No financial values, individual source dates or scope limits changed.

This closes the bounded link-usability phase, not the historical research backlog. Preserve missing fields, contradictions, whole-record deferrals and partial scopes. 2027 analysis remains deferred; historical 30-minute cadence remains active.