import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const audit=JSON.parse(fs.readFileSync('data/research/affidavit-availability-2022.json','utf8'));
const registry=JSON.parse(fs.readFileSync('data/processed/candidate-register.json','utf8')).filter(r=>r.year===2022);
const key=r=>r.ac+'/'+r.candidate.toLowerCase().replace(/[^a-z0-9]/g,'');
test('official affidavit observations cover exactly the 265 official candidacies',()=>{
 assert.equal(audit.records.length,265);assert.equal(new Set(audit.records.map(key)).size,265);
 assert.deepEqual(audit.records.map(key).sort(),registry.map(key).sort());
 assert.equal(audit.manualAuditComplete,false);
 for(const r of audit.records){const official=registry.find(x=>key(x)===key(r));assert.equal(r.affidavitUrl,official.affidavitUrl);assert.equal(r.manualFieldReview,'not-performed-by-this-audit');assert.ok(Number.isFinite(Date.parse(r.checkedAt)));}
});
test('successful primary PDFs have fingerprints and bounded text-page metadata only',()=>{
 const allowed=new Set(['year','ac','candidate','party','affidavitUrl','checkedAt','manualFieldReview','httpStatus','status','sha256','bytes','pages','pagesWithNativeText','nativeTextCharacters','textReadiness','errorType']);
 for(const r of audit.records){for(const k of Object.keys(r))assert.ok(allowed.has(k),'Unexpected or personal PDF field '+k);
 assert.ok(['pdf-opened','http-unavailable','not-a-pdf','request-or-pdf-error'].includes(r.status));
 if(r.status==='pdf-opened'){assert.equal(r.httpStatus,200);assert.match(r.sha256,/^[a-f0-9]{64}$/);assert.ok(r.bytes>0);assert.ok(Number.isInteger(r.pages)&&r.pages>0);assert.ok(r.pagesWithNativeText>=0&&r.pagesWithNativeText<=r.pages);assert.ok(r.nativeTextCharacters>=0);}
 }
});
