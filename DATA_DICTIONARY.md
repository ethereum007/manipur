# Data dictionary

- year: election year; integer, 2012/2017/2022 for Assembly results.
- ac: official Assembly constituency number, 1–60.
- name: constituency source label.
- candidate: exact or whitespace-normalized public candidate name; never a cross-year person ID.
- party: source party code normalized through an explicit dictionary.
- votes: source candidate votes, nonnegative integer; missing values are null, never zero.
- rank: calculated descending candidate-vote rank within a complete contest; ties require review.
- source: source-register identifier.
- sourcePage: 1-based PDF page, not printed folio.
- electors: source denominator if reconciled, otherwise null.
- nota: source NOTA count where applicable and verified, otherwise null.

Candidate share = votes / sum(candidate votes) × 100. It excludes NOTA and rejected ballots and must be labeled accordingly. Margin = winner minus runner-up. HHI = sum of squared candidate vote fractions; effective electoral candidate count = 1 / HHI. Do not call the candidate-level measure effective number of parties unless votes are grouped by party first.
