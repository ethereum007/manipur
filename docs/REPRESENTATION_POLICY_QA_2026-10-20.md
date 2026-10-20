# Representation and policy release — 20 October 2026

Production code commit: e750f4b73c71afe0559b4ab79075cb5674a5d84a.

Cloud verification and deployment: https://github.com/ethereum007/manipur/actions/runs/39427181195 — successful. 18 data tests and 14 browser tests passed; 910 static pages generated. The existing five-page executive PDF passed verification.

## Scope

Added a dated 60-seat Assembly-directory observation, integrated into all constituency pages, and seven primary-source policy studies: housing, food, rehabilitation budget, roads, urban water, rural water and livelihoods. Added shared evidence metadata and register pagination components, source downloads, source hashes and reproducible cloud acquisition/review workflows.

The directory lists 58 members and two vacancies at capture, but supplies no individual effective dates. Its site footer and older party-position table are dated separately. Historical election results are not overwritten by directory labels. Profile career notes are not certified current offices.

Policy statistics preserve their reference periods, geographic scope and administrative stages. Statewide housing totals are not IDP-only deliveries; budget provisions are not expenditure; release/utilisation totals are not employment outcomes. Constituency allocations are explicitly unavailable for these studies. No 2027 probabilities or inferred religion/community attributes were added.

## Visual review

Reviewed six cloud-generated screenshots: representation desktop and mobile, constituency representation mobile, housing desktop and mobile, livelihoods mobile. Typography, source dates, monetary units, wrapping and page hierarchy were legible. The representation table intentionally scrolls within its container on mobile, with an explicit swipe instruction; browser checks confirmed no page-level horizontal overflow. No blocking visual defect found. Two representative screenshots are retained in docs/review.

## Primary-source review

Acquisition workflow https://github.com/ethereum007/manipur/actions/runs/39426042385 succeeded for eight sources. Original housing p.2, food p.2, urban-water p.3 and budget p.3 were visually reviewed against the displayed figures. The audit JSON preserves source SHA-256 hashes and capture dates. Original materials are archived in the primary-sources-2026-10-19 release asset public-policy-evidence-2026-10-20.zip. This is selected evidence, not an exhaustive programme audit.

## Production verification

HTTPS GET returned 200 for the homepage, representation register, policy index, all seven policy detail pages and all three new JSON downloads. Source/code operations and all builds, browser tests and screenshots remained in GitHub; screenshot review used RAM only.
