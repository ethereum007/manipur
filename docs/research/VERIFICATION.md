# Verification ledger

## Visual foundation

The homepage, electoral atlas and candidate profile were implemented in the actual Next.js App Router architecture before other routes. GitHub Actions run 39232378597 passed all four original browser tests. Desktop 1440px and mobile 390px captures were reviewed in memory from the GitHub artifact, without saving screenshots on the owner's computer. An initial direct-route failure was corrected with directory-based static export routing.

## Expansion

All 60 constituency pages resolve. Later browser tests cover the 15-slide briefing, keyboard navigation, desktop/mobile layout, runtime errors, search, historical year switching and comparison controls. The populated 2017 map and briefing were reviewed from run 39234765694; this run passed all six tests. The year-specific map legend was corrected to include AITC and LJP for 2017.

## Data

The 2017 successful-candidate register contains 60 winners. Candidate headers are paired with Form 20 total rows. Acceptance requires candidate sum = printed valid votes; valid + rejected + NOTA = total; total <= source electors; winning party agrees with independent register. Source heading and line-wrap variants are handled explicitly. Numbers are never repaired to force agreement.

257 candidate records across 58 contests reconcile. AC 7 Andro: candidate sum 29,678 versus printed valid votes 29,698. AC 21 Naoriya Pakhanglakpa: valid 30,181 + rejected 1 + NOTA 153 does not equal printed total 30,334. Candidate vote totals in those two contests are withheld. The source header names can be indexed separately with null votes.

Official 2017 turnout is withheld because summary and Form 20 electorate values differ; source elector numbers are preserved as printed. Mathematical consistency does not establish a correct denominator.

## Source hierarchy

Official reports and affidavits take priority. ADR / MyNeta 2022 disclosures are explicitly secondary transcriptions. A conflicting 2017 ADR financial comparison remains withheld. OCR text is an unreviewed extraction layer, not a verified result dataset.

## Storage

All subsequent project authoring, builds, raw scans, OCR, screenshots and test artifacts run in GitHub. The initial local checkout cleanup was rejected by the command policy, and its exact path was reported to the owner. No later project files or dependencies were written locally.


## 19 October 2026 — cloud acceptance

- Commit `6f3fd07bc7574504239b26e085f69f52a194b171`; Actions run [39237907318](https://github.com/ethereum007/manipur/actions/runs/39237907318). Production build, structural/arithmetic checks and seven browser tests passed.
- Desktop 1440px and mobile 390px screenshots reviewed for homepage, atlas and candidate profile; mobile parliamentary charts and desktop linked comparison reviewed. Corrected stacked comparison maps to matching adjacent views.
- All 60 constituency routes return HTTP 200. Year selection, search, party filter, margin metric, comparison maps and briefing keyboard navigation verified.
- Official candidate-index parser validates 265 unique 2022 candidacies across 60 constituencies, party codes and affidavit AC numbers while retaining reviewed votes.
- Accepted numerical coverage: 180 winner records; 259 Assembly vote records (58 complete 2017 contests and one 2022 contest); ten 2024 parliamentary candidates. This does not establish full historical candidate-vote or affidavit coverage.
- Screenshots retained in GitHub visual-review artifact for seven days; sources permanently in GitHub release. No local screenshot files or dependencies were created in this review.
