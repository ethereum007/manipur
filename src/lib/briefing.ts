import fieldReviews from '../../data/research/disclosure-field-reviews-2022.json';
const reviewedCandidates=fieldReviews.records.length;
const reviewedFields=fieldReviews.records.reduce((sum,r)=>sum+r.fields.length,0);
export const slides = [
  {
    title: "A state. Sixty constituencies.",
    subtitle: "Mandate Terrain · Manipur Analysis",
    body: "An independent research briefing on geography, representation and electoral change.",
    source: "https://ceomanipur.nic.in/StatisticalReports",
    sourceLabel: "Chief Electoral Officer, Manipur",
    kind: "opening",
  },
  {
    title: "Read the land before the vote.",
    subtitle: "Geographic context",
    body: "The Imphal Valley lies within surrounding hill systems. Manipur shares an international boundary with Myanmar. Geography frames access and administration; it does not determine individual political choices.",
    source: "https://ssamanipur.nic.in/StateProfile.htm",
    sourceLabel: "Government of Manipur · State profile",
    kind: "terrain",
  },
  {
    title: "A baseline has a date.",
    subtitle: "Population and education · Census 2011",
    body: "The Economic Survey reproduces a population of 28,55,794 and literacy of 76.94% for 2011. These figures are historical, not current estimates.",
    source:
      "https://www.nitiforstates.gov.in/public-assets/Policy/policy_files/RSS2131M000234.pdf",
    sourceLabel: "Government of Manipur · Economic Survey 2019–20",
    kind: "text",
  },
  {
    title: "Sixty seats, different categories.",
    subtitle: "Representation",
    body: "The Assembly has 40 general constituencies, one SC reserved constituency and 19 ST reserved constituencies. Reservation is not a classification of every resident.",
    source: "https://ceomanipur.nic.in/StatisticalReports",
    sourceLabel: "CEO Manipur · Assembly statistical reports",
    kind: "text",
  },
  {
    title: "The 2012 electoral record.",
    subtitle: "Assembly election · seats won",
    body: "Read election-day seats separately from subsequent party changes. Missing reconciled records remain unavailable.",
    source:
      "https://ceomanipur.nic.in/StatisticalReport/AssemblyElection/statistical_report_2012.pdf",
    sourceLabel: "CEO Manipur · 2012 statistical report",
    kind: "seats",
    year: 2012,
  },
  {
    title: "The 2017 electoral record.",
    subtitle: "Assembly election · seats won",
    body: "A plurality differs from an outright majority. Government formation and coalition support need separate documentary records.",
    source:
      "https://ceomanipur.nic.in/StatisticalReport/AssemblyElection/statistical_report_2017.pdf",
    sourceLabel: "CEO Manipur · 2017 statistical report",
    kind: "seats",
    year: 2017,
  },
  {
    title: "The 2022 electoral record.",
    subtitle: "Assembly election · seats won",
    body: "Compare party and constituency results. Subsequent defections must not silently rewrite election-day outcomes.",
    source:
      "https://ceomanipur.nic.in/StatisticalReport/AssemblyElection/Statistical%20Report%202022.pdf",
    sourceLabel: "CEO Manipur · 2022 statistical report",
    kind: "seats",
    year: 2022,
  },
  {
    title: "Seats and votes answer different questions.",
    subtitle: "Interpretation",
    body: "Seat share divides wins by 60. Candidate shares in this atlas exclude NOTA and rejected ballots. Statewide vote share requires a reconciled denominator. Neither measure alone establishes causation.",
    source: "https://ceomanipur.nic.in/StatisticalReports",
    sourceLabel: "CEO Manipur · primary election records; atlas methodology",
    kind: "text",
  },
  {
    title: "A political career is a record.",
    subtitle: "N. Biren Singh · Heingang",
    body: "The Assembly records election on a DRPP ticket in 2002, INC in 2007 and 2012, and BJP in 2017 and 2022. These are documented milestones, not an inferred name match.",
    source:
      "https://assembly.mn.gov.in/members/profile/nongthombam-biren-singh",
    sourceLabel: "Manipur Legislative Assembly · historical member profile",
    kind: "text",
  },
  {
    title: "Declarations are dated self-reports.",
    subtitle: "Public disclosures",
    body: "ADR transcribes 2022 assets of ₹1,47,48,361 and liabilities of ₹1,44,300 for Biren Singh. These are not current wealth estimates. Declared cases are not convictions. Conflicting 2017 ADR totals remain withheld.",
    source: "https://www.myneta.info/manipur2022/candidate.php?candidate_id=37",
    sourceLabel: "ADR / MyNeta · secondary affidavit transcription",
    kind: "text",
  },
  {
    title: "An inquiry is not a finding.",
    subtitle: "Conflict beginning in May 2023",
    body: "On 4 June 2023, the Union government notified a Commission of Inquiry covering violence on 3 May and thereafter. Its remit does not itself establish responsibility.",
    source:
      "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1929742&lang=2&reg=48",
    sourceLabel: "Ministry of Home Affairs · 4 June 2023",
    kind: "text",
  },
  {
    title: "Political administration changed.",
    subtitle: "Dated governance milestones",
    body: "President’s Rule began on 13 February 2025. Akashvani reported revocation and Yumnam Khemchand Singh’s swearing-in on 4 February 2026. This briefing is not a real-time officeholder feed.",
    source: "https://newsonair.gov.in/presidents-rule-revoked-in-manipur/",
    sourceLabel: "Akashvani · 4 February 2026",
    kind: "text",
  },
  {
    title: "A different election, a different question.",
    subtitle: "Lok Sabha · 2024",
    body: "Two parliamentary constituencies. Different candidates, alliances, issues and participation from an Assembly contest. Segment results must reconcile before mapping differences.",
    source:
      "https://ceomanipur.nic.in/StatisticalReport/LokSabhaElection/SR_lok_Sabha_2024.pdf",
    sourceLabel: "CEO Manipur · 2024 Lok Sabha report",
    kind: "text",
  },
  {
    title: "Know the review boundary.",
    subtitle: "Historical research coverage and limits",
    body: `Selected original financial comparisons cover ${reviewedCandidates} of 265 candidates and ${reviewedFields} scoped field notes; ${265-reviewedCandidates} candidates remain without selected comparison. Retrieval and OCR are not field verification or a complete independent affidavit audit. 2027 analysis is deferred.`,
    source: "https://mandateterrain.com/analysis/evidence/",
    sourceLabel: "Mandate Terrain · coverage register and unresolved discrepancies",
    kind: "text",
  },
  {
    title: "Return to the source.",
    subtitle: "Evidence before interpretation",
    body: "Read dates, coverage gaps, geography caveats and verification status. No synthetic statistics, inferred community identities or demographic voter targeting.",
    source: "https://mandateterrain.com/sources/",
    sourceLabel: "Atlas sources and methodology",
    kind: "closing",
  },
];
