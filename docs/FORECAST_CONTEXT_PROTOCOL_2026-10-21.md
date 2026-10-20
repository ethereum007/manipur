# Historical context evaluation protocol v1 — 21 October 2026 IST

Status: written before implementing the next contextual rule, but AFTER the historical Assembly outcomes and reference-rule scores were inspected. This is not pre-election preregistration, an unseen historical holdout, a calibrated forecast or prospective validation. No new accuracy figure is asserted here.

## Research question and fixed scope

Does a literal prior Parliamentary segment leading-party rule add descriptive predictive information relative to the two existing prior-Assembly reference rules? Evaluate only 2014 Parliamentary → 2017 Assembly and 2019 Parliamentary → 2022 Assembly, alongside the existing 2012 → 2017 and 2017 → 2022 Assembly reference inputs. These remain two historical transitions, not 120 independent elections.

Freeze exactly three rules for this batch: (A) prior Assembly winning party in that seat; (B) prior statewide Assembly leader by seats, applied to every seat; (C) prior ordinary Parliamentary segment leading party. C is a deliberately simple contextual benchmark, not a fitted model. Do not tune a blend, select a favourable window, change party aliases after viewing misses, or try additional rules and publish only the best. Any new rule requires a dated protocol revision and disclosure that prior outcomes have already been seen.

## Targets and literal party semantics

The target is the independently sourced Assembly winning-party record. Parliamentary local leads never become Assembly targets. Withheld 2017 AC21 full contest arithmetic does not erase its separately verified winner-party target. Use literal election-scoped party codes unless an independently sourced, versioned alias map is fixed before computation. Do not infer mergers, candidate continuity, coalition continuity, current affiliation or government formation. A prior independent is an abstention for continuity rules, not a persistent political party/person identity. A target-year independent remains a legitimate observed outcome and is not dropped because a party rule missed it.

## Eligible inputs and cutoffs

A result event must precede its target Assembly election. 2024 Parliamentary observations, 2026 directory observations, current memberships, future nominations, target-year winners and target-year vote shares are forbidden inputs to A/B/C. Generate predictions without supplying target labels to the prediction function; join labels only in the scorer. Hash all input files, protocol and implementation and retain run ID, event scope, missing records and abstention reasons.

Distinguish two validation claims. An event-prior retrospective reconstruction uses older election events from sources captured now. A vintage-verified replay additionally proves that the exact source version was available at the chosen historical cutoff. Original publication/archive timestamps for the recovered Parliamentary sheets remain unverified, so this batch may only claim event-prior retrospective reconstruction. Current capture dates cannot be backdated or treated as contemporaneous availability. Never call its score a prospective 2027 probability.

## Source-specific coverage

2014: sixty combined-sheet rows pass arithmetic and ordinary/postal/final conservation; five selected scanned footers compared, zero complete individual-station audits. Keep the combined valid-including-NOTA convention separate from candidate votes. Preserve AC29 source label Moirang alongside selected Kumbi header evidence, the AC33 index/diagnostic distinction and AC50 exact native-cell overflow note. Do not promote the five selected comparisons into all-document verification.

2019: use only the 59 released reconciled segment tables. AC57 Henglep is withheld because official segment/combined candidate cells conflict. The separately reviewed combined row is diagnostic evidence, not an automatic substitute. Preserve AC27 printed station ID and AC31 selected exact-cell exception. New evidence or a different source-selection rule requires a versioned sensitivity report; never silently fill a withheld input to improve a score.

Postal/non-ordinary votes cannot be allocated proportionately into local segments. Religious/ethnic labels or proxies, inferred voter blocs, unreviewed affidavit text, budget allocations as outcome measures, and guessed causal motives are excluded.

## Denominators, ties and scores

Create a seat-level eligibility ledger before scoring. Rule A abstains on prior Assembly IND; rule C abstains on prior Parliamentary IND, tied first place, withheld/missing segment data or unresolved party coding. Rule B must abstain if its prior statewide seat leader is tied unless a tie policy is prospectively versioned. Do not break candidate ties alphabetically or use a target result to choose a party.

For each target year publish each rule's full eligible denominator and all abstentions. For the primary comparison score ALL THREE rules on the intersection of their eligible seats; do not compare a smaller C cohort against a larger A/B cohort. Show excluded seats and reasons even when they reduce apparent accuracy. Preserve existing historical reference reports as separate immutable-scope results; the new common cohort must not overwrite their denominators.

Report correct/eligible counts, accuracy, every seat-level prediction and miss, confusion counts and differences in correct predictions on the common cohort. Show both windows separately. Any pooled score is descriptive only; do not use seat-level binomial intervals as though correlated seats were independent temporal replications. With two transitions, stable out-of-time uncertainty and broad generalisation are not established. No Brier score, probability calibration, confidence bands or numeric 2027 probability is supported by these deterministic rules.

## Required tests and publication gates

Tests must poison or alter target/future-year data and confirm unchanged predictions; verify target labels enter scoring only; exercise missing/withheld segments, new parties, independents and ties; reconcile exact common denominators; and reproduce committed reports from hashed inputs. Preserve source-scope/vintage warnings on every public summary. Run cloud unit/browser/static-site/PDF checks and inspect desktop/mobile screenshots for visual changes. Publish unflattering results and exclusions as well as favourable ones.

## Beyond this batch

Investigate additional compatible Assembly history with an explicit geographic/candidate/party crosswalk before pooling. Extra candidate records within an election do not create extra independent validation windows. A fitted probabilistic model needs a separate training/selection/temporal-holdout protocol and enough supportable windows; these rules do not meet that condition by themselves. A prospective 2027 forecast would additionally need dated nominations/alliances, defensible inputs, a frozen pre-outcome artifact and subsequent outcome evaluation. Until those gates are satisfied, keep nominations, favourites and numerical probabilities unavailable rather than invent them.
