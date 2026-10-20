import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const results=read('data/processed/results.json'),winners=read('data/processed/winners.json'),registry=read('data/processed/candidate-register.json');
const disclosures=read('data/research/disclosures-2022.json'),segments=read('data/research/parliament-segments-2024.json'),context=read('data/research/election-context-2024.json');
test('complete-election publication preserves the one unresolved contest',()=>{
 assert.equal(results.length,804);
 for(const [year,rows,contests] of [[2012,279,60],[2017,260,59],[2022,265,60]]){const r=results.filter(r=>r.year===year);assert.equal(r.length,rows);assert.equal(new Set(r.map(r=>r.ac)).size,contests);}
 assert(!results.some(r=>r.year===2017&&r.ac===21));
 assert(results.filter(r=>r.year===2012).every(r=>r.nota===null));
 for(const r of results.filter(r=>r.rank===1))assert.equal(r.party,winners.find(w=>w.year===r.year&&w.ac===r.ac).party);
});
test('ordinary 2024 segment totals cannot absorb unallocated constituency votes',()=>{
 assert.equal(segments.segments.length,60);assert.equal(new Set(segments.segments.map(s=>s.ac)).size,60);
 const one=segments.segments.find(s=>s.ac===1);assert.equal(one.candidates[0].votes,8480);assert.equal(one.candidates[1].votes,6318);assert.equal(one.votesPolled,20646);
 const sixty=segments.segments.find(s=>s.ac===60);assert.equal(sixty.candidates[0].votes,19499);assert.equal(sixty.candidates[1].votes,705);
 const leads=segments.segments.reduce((t,s)=>(t[s.candidates[0].party]=(t[s.candidates[0].party]||0)+1,t),{});assert.deepEqual(leads,{INC:36,BJP:9,NPF:13,IND:2});
 for(const pc of segments.reconciliation)for(const c of pc.candidates){assert(c.unallocatedToOrdinarySegments>0);assert.equal(c.ordinarySegmentVotes+c.unallocatedToOrdinarySegments,c.votes);}
 assert.equal(segments.reconciliation[0].candidates[0].unallocatedToOrdinarySegments,4694);
});
test('disclosure joins remain election-scoped and explicit Nil is distinct from missing',()=>{
 assert.equal(disclosures.records.length,265);assert.equal(new Set(disclosures.records.map(r=>r.ac+'/'+r.registryCandidate)).size,265);
 assert.equal(disclosures.records.filter(r=>r.declaredCases>0).length,53);
 for(const r of disclosures.records)assert(registry.some(c=>c.year===2022&&c.ac===r.ac&&c.candidate===r.registryCandidate&&c.party===r.party));
 const nil=disclosures.records.filter(r=>r.assetsSourceText==='Nil');assert.equal(nil.length,2);assert(nil.every(r=>r.assets===0));
 assert.equal(disclosures.primaryAuditComplete,false);
});
test('public identity fields require explicit attributed sources; unknown stays null',()=>{
 assert.equal(context.people.length,10);
 assert.equal(context.people.filter(r=>r.community!==null).length,2);
 assert.equal(context.people.filter(r=>r.religion!==null).length,1);
 for(const r of context.people)if(r.community||r.religion)assert(r.identitySources.length>0&&r.identitySources.every(s=>s.url.startsWith('https://')&&s.basis));
 assert.equal(context.repolls.reduce((sum,r)=>sum+r.pollingStations,0),17);
});
