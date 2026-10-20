# Full-site integrity release — 20 October 2026

Code: b3ef3054152971effd525d61c8e45b86ad34015b. Cloud verification: https://github.com/ethereum007/manipur/actions/runs/39434450692.

18 data tests and 14 browser tests passed. Five landscape PDF pages verified. The new HTML integrity gate audited 907 physical HTML pages and 30,474 local href/src references, including internal section anchors, with zero errors. Next build route counts and physical exported HTML file counts have different definitions.

The first gate run correctly blocked deployment when executed before the browser-generated PDF existed. The gate now runs after PDF generation/verification. It blocks deployments on missing internal targets or section IDs, writes a machine-readable site-integrity.json report, and retains the report in the cloud visual-review artifact. It does not claim external source uptime or replace JavaScript interaction tests.

Live homepage, representation register, policy index and executive PDF returned HTTPS 200. No UI changes were made in this release; previous desktop/mobile visual review is recorded in REPRESENTATION_POLICY_QA_2026-10-20.md.

The hourly continuation cadence is active. Source limitations remain recorded in LIMITATIONS.md and the finite release checklist; this QA pass is not a claim that all unavailable research evidence has been obtained.
