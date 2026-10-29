import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {describeContest} from '../src/lib/analysis.ts';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const results=read('data/processed/results.json');
const winners=read('data/processed/winners.json');
const segments=read('data/research/parliament-segments-2024.json').segments;
const normalized=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
test('all sixty dossiers retain independent winners and explicit missing contest coverage',()=>{
 const missing=[];
 for(let ac=1;ac<=60;ac++)for(const year of [2012,2017,2022]){
  const register=winners.filter(r=>r.ac===ac&&r.year===year);assert.equal(register.length,1,year+'/'+ac);
  assert.ok(register[0].source);assert.ok(register[0].sourcePage>0);
  const rows=results.filter(r=>r.ac===ac&&r.year===year).sort((a,b)=>b.votes-a.votes);
  if(!rows.length){missing.push([year,ac]);continue;}
  const m=describeContest(rows);assert.ok(m);assert.equal(m.total,rows.reduce((s,r)=>s+r.votes,0));
  assert.equal(normalized(m.winner.party),normalized(register[0].party));
  assert.equal(m.margin,rows[0].votes-rows[1].votes);
  for(const r of rows){assert.ok(r.source);assert.ok(r.sourcePage>0);assert.ok(Number.isSafeInteger(r.votes)&&r.votes>=0);}
 }
 assert.deepEqual(missing,[[2017,21]]);
});
test('all sixty Parliamentary segments use their own reconciled ballot denominator and source locators',()=>{
 assert.equal(segments.length,60);assert.equal(new Set(segments.map(r=>r.ac)).size,60);
 for(const s of segments){assert.equal(s.year,2024);assert.ok(s.ac>=1&&s.ac<=60);assert.equal(s.candidateVotes,s.candidates.reduce((a,r)=>a+r.votes,0));assert.equal(s.votesPolled,s.candidateVotes+s.nota+s.rejected);assert.match(s.sourceUrl,/^https://ceomanipur.nic.in//);assert.match(s.sourceSha256,/^[a-f0-9]{64}$/);assert.ok(s.sourcePage>0);assert.ok(s.candidates[0].votes>=s.candidates[1].votes);}
});
