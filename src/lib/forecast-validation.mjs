const requireCondition=(condition,message)=>{if(!condition)throw new Error(message)};
function assertElection(rows){
 requireCondition(rows.length===60,'Expected sixty winner records');
 requireCondition(new Set(rows.map(r=>r.ac)).size===60,'Duplicate constituency');
 requireCondition(rows.every(r=>Number.isInteger(r.ac)&&r.ac>=1&&r.ac<=60&&typeof r.party==='string'&&r.party.trim().length>0),'Invalid winner record');
 requireCondition(new Set(rows.map(r=>r.year)).size===1,'Mixed election years');
}
export function predictBenchmarks(training){
 assertElection(training);
 const tally={};for(const row of training)tally[row.party]=(tally[row.party]||0)+1;
 const statewideParty=Object.keys(tally).sort((a,b)=>tally[b]-tally[a]||a.localeCompare(b))[0];
 return [...training].sort((a,b)=>a.ac-b.ac).map(row=>({ac:row.ac,previousParty:row.party,repeatParty:row.party==='IND'?null:row.party,statewideParty,eligible:row.party!=='IND',exclusion:row.party==='IND'?'Previous IND category is not one continuous party or a verified cross-election person match':null}));
}
function score(rows,prediction){
 const correct=rows.filter(r=>r[prediction]===r.actualParty).length;
 const confusion={};for(const r of rows){const key=r[prediction]+'|'+r.actualParty;confusion[key]=(confusion[key]||0)+1}
 return {correct,total:rows.length,accuracy:rows.length?correct/rows.length:null,confusion:Object.entries(confusion).map(([key,count])=>({predicted:key.split('|')[0],actual:key.split('|')[1],count})).sort((a,b)=>b.count-a.count||a.predicted.localeCompare(b.predicted)||a.actual.localeCompare(b.actual))};
}
export function replayWindow(records,trainingYear,targetYear){
 requireCondition(targetYear>trainingYear,'Target must follow training');
 const training=records.filter(r=>r.year===trainingYear),target=records.filter(r=>r.year===targetYear);
 assertElection(target);
 // Predictions are frozen from the prior election only, before target labels are joined.
 const predictions=predictBenchmarks(training);
 const rows=predictions.map(p=>({...p,actualParty:target.find(t=>t.ac===p.ac).party}));
 const eligible=rows.filter(r=>r.eligible);
 return {trainingYear,targetYear,statewideParty:predictions[0].statewideParty,totalSeats:60,eligibleSeats:eligible.length,excludedSeats:rows.filter(r=>!r.eligible).map(r=>({ac:r.ac,reason:r.exclusion})),repeat:score(eligible,'repeatParty'),statewide:score(eligible,'statewideParty'),statewideFullCohort:score(rows,'statewideParty'),rows};
}
export function buildValidation(records){return {protocolVersion:'1.0',reviewedAt:'2026-10-20',target:'Assembly election-day winning party code',kind:'Retrospective fixed-rule benchmark replay; not a prospective forecast',rules:{repeat:'Repeat the previous Assembly winning-party code for that seat; abstain for previous IND',statewide:'Predict the previous statewide largest party by Assembly seat count everywhere; alphabetic tie break',comparison:'Both benchmarks scored on the same non-IND-prior cohort; excluded seats remain visible',partyContinuity:'Literal source party codes; no assumed mergers, alliance pooling, defections or candidate identity matches'},windows:[replayWindow(records,2012,2017),replayWindow(records,2017,2022)],limitations:['Only two Assembly transitions; correlated constituencies are not independent repeated elections.','Rules are replayed retrospectively after outcomes are known, not prospectively pre-registered predictions.','No probabilities, calibration scores or 2027 predictions are produced.','The 2024 Parliamentary election is not substituted for an Assembly target.','Winner-only registers cover all sixty seats, including the 2017 AC21 winner whose full candidate contest remains withheld.','Current party affiliations, alliances, candidate choices, polls, turnout and post-2022 events are not model inputs.']};}
