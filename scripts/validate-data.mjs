import fs from "node:fs";
import assert from "node:assert/strict";
const records = JSON.parse(
  fs.readFileSync("data/processed/results.json", "utf8"),
);
const winners = fs.existsSync("data/processed/winners.json")
  ? JSON.parse(fs.readFileSync("data/processed/winners.json", "utf8"))
  : [];
const groups = Map.groupBy(records, (r) => r.year + "/" + r.ac);
const seen = new Set();
for (const r of records) {
  const id = [r.year, r.ac, r.candidate].join("/");
  assert(!seen.has(id), "Duplicate candidacy " + id);
  seen.add(id);
  assert([2012, 2017, 2022].includes(r.year));
  assert(r.ac >= 1 && r.ac <= 60 && r.source && r.sourcePage > 0);
  assert(Number.isInteger(r.votes) && r.votes >= 0);
}
for (const [id, g] of groups) {
  const sorted = [...g].sort((a, b) => b.votes - a.votes);
  sorted.forEach((r, i) => assert(r.rank === i + 1, "Rank mismatch " + id));
  assert(g.length >= 2, "Incomplete contest " + id);
  if (g[0].validVotes != null)
    assert(
      g.reduce((s, r) => s + r.votes, 0) === g[0].validVotes,
      "Candidate sum " + id,
    );
  if (g[0].validVotes != null && g[0].votesPolled != null)
    assert(
      g[0].validVotes + (g[0].nota || 0) + (g[0].rejected || 0) ===
        g[0].votesPolled,
      "Poll total " + id,
    );
}
const parliament = JSON.parse(
  fs.readFileSync("data/processed/parliament-2024.json", "utf8"),
);
for (const c of parliament.constituencies) {
  assert(c.candidates.reduce((s, r) => s + r.votes, 0) === c.candidateVotes);
  assert(
    c.candidates.every(
      (r, i) =>
        r.rank === i + 1 && (i === 0 || c.candidates[i - 1].votes >= r.votes),
    ),
  );
}
assert(parliament.constituencies.flatMap((c) => c.candidates).length === 10);
const winnerKeys = new Set();
for (const w of winners) {
  const key = w.year + "/" + w.ac;
  assert(!winnerKeys.has(key), "Duplicate winner " + key);
  winnerKeys.add(key);
}
for (const year of [2012, 2017, 2022])
  assert(
    winners.filter((w) => w.year === year).length === 60,
    "Incomplete winner register " + year,
  );
const report = {
  generatedAt: new Date().toISOString(),
  candidacies: records.length,
  years: [2012, 2017, 2022].map((year) => ({
    year,
    candidateContests: new Set(
      records.filter((r) => r.year === year).map((r) => r.ac),
    ).size,
    winnerRecords: winners.filter((r) => r.year === year).length,
    missingContests: Array.from({ length: 60 }, (_, i) => i + 1).filter(
      (ac) => !groups.has(year + "/" + ac),
    ),
  })),
  status:
    "Published records pass structural and arithmetic checks. Missing coverage remains an explicit research gap.",
  limitations: [
    "Arithmetic agreement does not replace a visual source audit.",
    "2017 electorate and turnout definitions vary between summary and Form 20; official turnout is withheld.",
    "Reference polygons are marked pre-delimitation by their publisher.",
    "2024 segment comparisons pending reconciliation.",
  ],
};
fs.writeFileSync(
  "data/processed/data-quality.json",
  JSON.stringify(report, null, 2),
);
fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync(
  "public/data/data-quality.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report));
