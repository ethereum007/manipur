import fs from 'node:fs';import assert from 'node:assert/strict';
const html=fs.readFileSync('data/processed/official-candidate-index-2022.html','utf8');
const strip=s=>s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const codes={"Bharatiya Janata Party":"BJP","Indian National Congress":"INC","Republican Party of India (A)":"RPI(A)","Republican Party of India (Athawale)":"RPI(A)","Shiv Sena":"SHS","Communist Party of India":"CPI","Nationalist Congress Party":"NCP","National People's Party":"NPP","Janata Dal (United)":"JD(U)","Janata Dal (United":"JD(U)","Lok Janshakti Party(Ram Vilas)":"LJP(RV)","Independent":"IND","Kuki People’s Aliance":"KPA","Kuki National Assembly":"KNA","Rashtriya Janhit Sangharsh Party":"RJSP","Naga Peoples Front":"NPF"};
const winners=JSON.parse(fs.readFileSync('data/processed/winners.json','utf8')).filter(r=>r.year===2022);
const votes=JSON.parse(fs.readFileSync('data/processed/results.json','utf8')).filter(r=>r.year===2022);
const key=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');const rows=[];
for(const block of html.split(/<div class="card mt-2"\s*>/).slice(1)){
 const match=block.match(/card-header[^>]*>\s*(\d+)\s*-\s*([^<]+)/)||block.match(/^\s*(53)\s*-\s*([^<]+)/);if(!match)continue;const ac=Number(match[1]);
 for(const row of block.split(/<tr\b[^>]*>/i)){const cells=[...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>m[1]);if(cells.length<6||strip(cells[5])!=='Contested')continue;
 const candidate=strip(cells[1]),sourceParty=strip(cells[3]),affidavit=cells[4].match(/href="([^"]+)"/)?.[1],party=codes[sourceParty];assert(party&&affidavit,'Unmapped source field');assert(Number(affidavit.split('/')[1])===ac,'Affidavit AC mismatch');
 const winner=winners.find(w=>w.ac===ac);assert(winner);const result=votes.find(r=>r.ac===ac&&key(r.candidate)===key(candidate));rows.push({...{year:2022,ac,name:winner.name,candidate,party,sourceParty,votes:null,rank:key(candidate)===key(winner.candidate)?1:null,source:'candidate-index-2022',sourcePage:0,indexUrl:'https://ceomanipur.nic.in/Affidavits/AssemblyElection/ge_2022',affidavitUrl:new URL(affidavit,'https://ceomanipur.nic.in/Affidavits/AssemblyElection/').href,verification:'Official candidate index; Contested status only. Vote totals pending reconciliation.'},...result});
 }}
assert(rows.length===265);assert(new Set(rows.map(r=>r.ac)).size===60);assert(new Set(rows.map(r=>r.ac+'/'+key(r.candidate))).size===265);const old=JSON.parse(fs.readFileSync('data/processed/candidate-register.json','utf8'));fs.writeFileSync('data/processed/candidate-register.json',JSON.stringify([...old.filter(r=>r.year!==2022),...rows],null,2));console.log('Indexed 265 official candidacies, retaining reviewed vote records.');
