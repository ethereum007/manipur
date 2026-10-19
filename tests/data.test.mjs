import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { electoralMetrics, percentagePointChange } from "../src/lib/metrics.ts";
const rows = JSON.parse(fs.readFileSync("data/processed/results.json", "utf8"));
test("a tied election has no artificial majority", () => {
  const m = electoralMetrics([100, 100]);
  assert.equal(m.margin, 0);
  assert.equal(m.marginPct, 0);
  assert.equal(m.effectiveCandidates, 2);
});
test("missing denominators remain unavailable", () => {
  assert.equal(electoralMetrics([0, 0]), null);
  assert.equal(percentagePointChange(null, 80), null);
  assert.throws(() => electoralMetrics([-1, 20]));
  assert.equal(percentagePointChange(79, 81), 2);
});
test("published candidates have valid source identifiers, votes and unique records", () => {
  const ids = new Set();
  for (const r of rows) {
    assert.ok([2012, 2017, 2022].includes(r.year));
    assert.ok(Number.isInteger(r.ac) && r.ac >= 1 && r.ac <= 60);
    assert.ok(Number.isInteger(r.votes) && r.votes >= 0);
    assert.ok(r.source && r.sourcePage > 0);
    const key = [r.year, r.ac, r.candidate].join("/");
    assert.ok(!ids.has(key));
    ids.add(key);
  }
});
test("ranks and winner margins reconcile inside every published contest", () => {
  const groups = Map.groupBy(rows, (r) => r.year + "/" + r.ac);
  for (const g of groups.values()) {
    g.sort((a, b) => b.votes - a.votes);
    g.forEach((r, i) => assert.equal(r.rank, i + 1));
    assert.equal(
      electoralMetrics(g.map((x) => x.votes))?.margin,
      g.length > 1 ? g[0].votes - g[1].votes : null,
    );
  }
});
