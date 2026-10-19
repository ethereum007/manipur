import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {seatTransitions,describeContest,pairedContests,median} from '../src/lib/analysis.ts';
const winners=JSON.parse(readFileSync(new URL('../data/processed/winners.json',import.meta.url)));
const rows=JSON.parse(readFileSync(new URL('../data/processed/results.json',import.meta.url)));
test('gross party flows conserve every seat and reconcile to net change',()=>{
 const t=seatTransitions(winners,2017,2022);
 assert.equal(t.complete,true);assert.equal(t.changed,34);assert.equal(t.retained,26);
 for(const f of t.flows){assert.equal(f.previous,f.retained+f.lost);assert.equal(f.current,f.retained+f.gained);assert.equal(f.net,f.gained-f.lost)}
 assert.equal(t.flows.reduce((s,f)=>s+f.current,0),60);
 assert.deepEqual(t.flows.find(f=>f.party==='BJP'),{party:'BJP',previous:21,current:32,retained:16,gained:16,lost:5,net:11});
});
test('incomplete winner pairing cannot become a statewide headline',()=>{
 const t=seatTransitions(winners.filter(r=>!(r.year===2022&&r.ac===60)),2017,2022);
 assert.equal(t.coverage,59);assert.equal(t.complete,false);assert.equal(t.changed,null);assert.equal(t.retained,null);
});
test('matched comparisons include only identical constituencies in both years',()=>{
 const p=pairedContests(rows,2017,2022);
 const a=new Set(rows.filter(r=>r.year===2017).map(r=>r.ac)),b=new Set(rows.filter(r=>r.year===2022).map(r=>r.ac));
 assert.equal(p.length,[...a].filter(id=>b.has(id)).length);
 assert.ok(p.every(r=>r.before.ac===r.after.ac&&r.ac===r.before.ac));
 assert.ok(!p.some(r=>r.ac===7));
});
test('competition denominators, fragmentation and tied majority are exact',()=>{
 const fixture=[{votes:50},{votes:50}].map((r,i)=>({...r,year:2022,ac:1,candidate:'candidate'+i,party:'IND',rank:i+1,source:'test',sourcePage:1}));
 const m=describeContest(fixture);assert.equal(m.total,100);assert.equal(m.margin,0);assert.equal(m.winnerHasMajority,false);assert.equal(m.effectiveCandidates,2);assert.equal(m.topTwoShare,100);
 assert.equal(describeContest(fixture.slice(0,1)),null);assert.equal(median([]),null);
 assert.throws(()=>describeContest([{...fixture[0],votes:-1},fixture[1]]));
});
