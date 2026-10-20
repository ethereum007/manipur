import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const r=read('data/research/representation-snapshot.json'),p=read('data/research/policy-evidence.json'),a=read('data/research/public-evidence-audit.json');
test('representation observation covers exactly sixty seats without inventing a current effective date',()=>{
 assert.equal(r.records.length,60);assert.deepEqual([...r.records.map(r=>r.ac)].sort((a,b)=>a-b),Array.from({length:60},(_,i)=>i+1));
 assert.deepEqual(r.records.filter(r=>r.status==='listed-vacant').map(r=>r.ac),[49,56]);
 assert.equal(r.records.filter(r=>r.status==='listed-member').length,58);
 assert(r.records.every(r=>r.effectiveDate===null));
 assert.equal(r.partySummary.asOf,'2025-09-11');assert.equal(r.partySummary.occupied,59);
 assert.equal(r.records.filter(r=>r.party==='BJP').length,36);
 for(const member of r.records){assert(member.profileUrl.startsWith('https://assembly.mn.gov.in/members/profile/'));assert(/^[a-f0-9]{64}$/.test(member.sourceExtractSha256));if(member.party)assert.equal(member.partyName,member.profileParty);assert(!Object.keys(member).some(k=>/address|email|phone|birth|contact/i.test(k)));}
});
test('dated office announcements stay distinct from potentially stale career notes',()=>{
 assert.equal(r.officeVerification.announcementDate,'2026-02-04');assert.equal(r.officeVerification.name,'Yumnam Khemchand Singh');
 const s=r.records.find(r=>r.ac===13);assert(s.officeHistory.includes('Minister'));assert(r.freshnessIssues.some(i=>i.id==='career-note-office'));
 assert.equal(r.records.filter(r=>r.education).length,58);
});
test('policy figures retain stages, geography and primary-source hashes',()=>{
 assert.equal(p.topics.length,7);assert.equal(new Set(p.topics.map(t=>t.slug)).size,7);
 const sources=new Map(p.sources.map(s=>[s.id,s]));assert.equal(sources.size,8);
 for(const s of sources.values())assert(/^[a-f0-9]{64}$/.test(s.sha256));
 for(const t of p.topics){assert.equal(t.constituencyAllocationAvailable,false);assert(t.reference&&t.scope&&t.limits.length&&t.questions.length);for(const m of t.metrics){assert(Number.isFinite(m.value)&&m.value>=0);assert(sources.has(m.sourceId));if(m.page!=null){assert(Number.isInteger(m.page)&&m.page>0);assert.equal(sources.get(m.sourceId).kind,'pdf');}}}
 assert(a.records.every(s=>s.status==='retrieved'));
});
test('administrative quantities cannot silently become local delivery or an invalid utilisation ratio',()=>{
 const housing=p.topics.find(t=>t.slug==='housing');assert.equal(housing.metrics.find(m=>m.id==='sanctioned').value,56045);assert.equal(housing.metrics.find(m=>m.id==='completed').value,20591);assert(housing.scope.includes('not an IDP-only'));
 assert.equal(p.topics.find(t=>t.slug==='roads').metrics[0].value,914);assert.equal(p.topics.find(t=>t.slug==='roads').metrics[0].stage,'Budget estimate');
 assert.equal(p.topics.find(t=>t.slug==='rehabilitation-budget').metrics[0].value,734);
 const skills=p.topics.find(t=>t.slug==='livelihoods');assert.equal(skills.metrics.find(m=>m.id==='released').value,21.37);assert.equal(skills.metrics.find(m=>m.id==='utilised').value,52.17);assert(skills.findings.join(' ').includes('opening SNA balances'));
 const water=p.topics.find(t=>t.slug==='urban-water');assert.equal(water.metrics[0].value,28947);assert.equal(water.metrics[1].value,4000);
 assert.equal(p.topics.find(t=>t.slug==='rural-water').metrics.length,0);
});
