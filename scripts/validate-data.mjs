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
const fiscal = JSON.parse(
  fs.readFileSync("data/research/budget-2026.json", "utf8"),
);
for (const m of fiscal.metrics) {
  assert(m.values.length === fiscal.periods.length);
  assert(m.values.every((v) => Number.isFinite(v) && v >= 0));
}
for (let i = 0; i < 4; i++) {
  const value = (id) => fiscal.metrics.find((m) => m.id === id).values[i];
  assert(
    Math.abs(
      value("revenue-receipts") -
        value("own-tax") -
        value("own-non-tax") -
        value("central-taxes") -
        value("central-grants"),
    ) < 0.02,
    "Budget receipts identity",
  );
}
const disclosures = JSON.parse(fs.readFileSync('data/research/disclosures-2022.json','utf8'));
const segments = JSON.parse(fs.readFileSync('data/research/parliament-segments-2024.json','utf8'));
const registry = JSON.parse(fs.readFileSync('data/processed/candidate-register.json','utf8'));
for (const [year,count] of [[2012,60],[2017,59],[2022,60]]) assert.equal([...groups.keys()].filter(k=>k.startsWith(year+'/')).length,count,'Coverage regression '+year);
for(const [id,g] of groups){const top=[...g].sort((a,b)=>b.votes-a.votes)[0];assert.equal(top.party,winners.find(w=>w.year===top.year&&w.ac===top.ac)?.party,'Independent winner mismatch '+id);}
for(const r of records.filter(r=>r.sourceUrl)){assert(/^https:\/\/ceomanipur\.nic\.in\//.test(r.sourceUrl));assert(/^[a-f0-9]{64}$/.test(r.sourceSha256));}
const candidateKey=r=>[r.year,r.ac,r.candidate.toLowerCase().replace(/[^a-z0-9]/g,'')].join('/');
assert.equal(new Set(registry.map(candidateKey)).size,registry.length,'Directory duplicate');
assert.equal(registry.length,810,'Directory coverage regression');
for(const r of records)assert(registry.some(c=>candidateKey(c)===candidateKey(r)&&c.party===r.party&&c.votes===r.votes),'Result-directory mismatch');
assert.equal(disclosures.records.length,265);assert.equal(new Set(disclosures.records.map(r=>r.ac+'/'+r.registryCandidate)).size,265);
for(const r of disclosures.records){assert(registry.some(c=>c.year===2022&&c.ac===r.ac&&c.candidate===r.registryCandidate&&c.party===r.party),'Unmatched disclosure');for(const key of ['assets','liabilities','declaredCases'])assert(Number.isSafeInteger(r[key])&&r[key]>=0);if(r.assetsSourceText==='Nil')assert.equal(r.assets,0);}
assert.equal(segments.segments.length,60);assert.equal(new Set(segments.segments.map(s=>s.ac)).size,60);
for(const s of segments.segments){assert.equal(s.candidates.reduce((n,r)=>n+r.votes,0),s.candidateVotes);assert.equal(s.candidateVotes+s.rejected+s.nota,s.votesPolled);assert(/^[a-f0-9]{64}$/.test(s.sourceSha256));for(const c of s.candidates)assert(Number.isSafeInteger(c.votes)&&c.votes>=0);}
for(const pc of segments.reconciliation)for(const c of pc.candidates){const sum=segments.segments.filter(s=>s.pc===pc.pc).reduce((n,s)=>n+s.candidates.find(r=>r.candidate===c.candidate).votes,0);assert.equal(sum,c.ordinarySegmentVotes);assert.equal(sum+c.unallocatedToOrdinarySegments,c.votes);assert(c.unallocatedToOrdinarySegments>=0);assert.equal(c.votes,parliament.constituencies.find(p=>p.id===pc.pc).candidates.find(r=>r.candidate===c.candidate).votes);}
for(const g of segments.specialStationGroups){assert.equal(g.candidates.reduce((n,c)=>n+c.votes,0),g.candidateVotes);assert.equal(g.candidateVotes+g.nota+g.rejected,g.votesPolled);assert(!segments.segments.some(s=>s.ac===g.id));}
for(const pc of segments.reconciliation)for(const c of pc.candidates){assert.equal(c.specialStationVotes,segments.specialStationGroups.find(g=>g.pc===pc.pc).candidates.find(r=>r.candidate===c.candidate).votes);assert.equal(c.ordinarySegmentVotes+c.specialStationVotes+c.unallocatedAfterSpecialStations,c.votes);assert(c.unallocatedAfterSpecialStations>=0);}
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
    "2024 special-station and other residual votes are not allocated to ordinary segments.",
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
