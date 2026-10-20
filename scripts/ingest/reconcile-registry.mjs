import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const registry=read('data/processed/candidate-register.json'),results=read('data/processed/results.json'),winners=read('data/processed/winners.json');
const key=r=>[r.year,r.ac,r.candidate.toLowerCase().replace(/[^a-z0-9]/g,'')].join('/');
const indexed=new Map();
for(const r of registry){const k=key(r),old=indexed.get(k);if(old){assert.equal(old.party,r.party,'Conflicting duplicate party '+k);if(old.votes!=null&&r.votes!=null)assert.equal(old.votes,r.votes,'Conflicting duplicate votes '+k);if(old.votes==null&&r.votes!=null)indexed.set(k,{...old,...r});}else indexed.set(k,r);}
const contests=new Set(results.map(r=>r.year+'/'+r.ac));
const combined=results.map(r=>({...indexed.get(key(r)),...r}));
for(const r of indexed.values())if(!contests.has(r.year+'/'+r.ac)){const w=winners.find(w=>key(w)===key(r));combined.push({...r,rank:w?1:r.rank});}
assert.equal(new Set(combined.map(key)).size,combined.length,'Normalized duplicate candidacy');
for(const r of results)assert(combined.some(c=>key(c)===key(r)&&c.party===r.party&&c.votes===r.votes),'Missing result-directory concordance');
combined.sort((a,b)=>a.year-b.year||a.ac-b.ac||(a.rank??999)-(b.rank??999)||a.candidate.localeCompare(b.candidate));
fs.writeFileSync('data/processed/candidate-register.json',JSON.stringify(combined,null,2));
if(fs.existsSync('public/data'))fs.writeFileSync('public/data/candidate-register.json',JSON.stringify(combined,null,2));
console.log('Reconciled',combined.length,'election-scoped candidacies; no normalized duplicate entries.');
