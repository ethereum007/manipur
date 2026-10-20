# Data dictionary

Assembly results: year (2012/2017/2022), ac (official 1–60), name (source constituency label), candidate (election-scoped canonical label; no automatic cross-year person ID), party (normalized source code), votes (nonnegative integer), rank (descending candidate votes within a complete contest), source (register ID), sourcePage (one-based PDF page), sourceUrl (individual native PDF when present; otherwise compiled report), sourceSha256 (native PDF hash), sourceCandidateName (native heading label), sourceNotes (unresolved literal source code), validVotes, rejected, votesPolled, nota (null for 2012 before NOTA; never imputed zero), electors (null where denominator not reviewed).

A sourcePage belongs to sourceUrl when present, not automatically to the compiled statistical report. Per-row source URLs must be preserved in exports. IVD and JMBP are literal unresolved 2012 source codes, not invented full party names.

Candidate share = votes / sum(candidate votes) × 100, excluding NOTA and rejected ballots. Margin = leader minus runner-up. Margin pp = margin / candidate votes × 100. Effective candidates = 1 / sum(squared candidate vote fractions); this is a candidate-level measure, not effective parties.

2024 segments: ac (ordinary geographic Assembly segment), pc (1 Inner, 2 Outer), candidates (descending Parliamentary candidate votes), candidateVotes, nota, rejected, votesPolled, sourceUrl, sourcePage, sourceSha256. The leading candidate is not an elected MLA. reconciliation records constituency votes, ordinarySegmentVotes and unallocatedToOrdinarySegments. The residual is not labelled wholly postal or geographically assigned.

2022 disclosures: source id, candidate (ADR label), registryCandidate (official election label), year, ac, party, sourceParty, declaredCases (dated self-declaration count, not convictions), education (source category), assets and liabilities (nominal rupees at nomination), assetsSourceText and liabilitiesSourceText (retain explicit Nil), profileUrl, sourceUrl, affidavitUrl, matchMethod. Source tier is secondary; current legal and financial status is not inferred.

2024 public identity: community and religion are nullable, with dated identitySources describing public self-identification and attribution. No fields describe voters. 2027 notes are qualitative evidence assessments; no winning probabilities or unverified nominations are stored.
