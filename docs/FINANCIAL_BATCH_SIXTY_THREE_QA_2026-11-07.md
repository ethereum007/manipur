# Batch 63 release QA — 7 November 2026

Production verified at 126 candidates and 250 scoped notes, with 139 of 265 candidates without a selected comparison and zero complete independent affidavit audits. The public JSON matches the repository semantically after deployment recovery.

Corrected commit 74d8ad8c122433cb38fe255fae11e04250539a02 passed run 42240185102. Build 127968101128 and deployment 127971022487 succeeded. 144 Node, 15 Python and 101 browser checks passed, along with five landscape PDF pages and 31,474 internal references across 913 HTML pages with zero errors. The earlier run 42235770248 caught an unrelated historical document count changed by a broad test edit. The correction restored the 124-document assertion.

Collector 42244891602 succeeded. The retained Karamjit desktop and Kanba mobile profiles under docs/qa/financial-batch-sixty-three-2026-11-06/ were manually inspected. Amounts, source links and scope limits were readable without clipping. The collector-triggered run 42244870814 initially timed out on deployment. Its retry succeeded with deployment 128294562138.

The source receipt FINANCIAL_BATCH_SIXTY_THREE_SOURCE_REVIEW_2026-11-06.md retains the selected regions and limits. Karamjit’s selected loan matches ADR numerically. Kanba’s visible NIL and NA loan cells cover a narrower scope than the ADR total. Complete primary totals remain null. This closes the pending release receipt. The historical backlog remains active and 2027 analysis is deferred.