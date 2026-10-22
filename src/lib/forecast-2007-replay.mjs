const requireCondition=(ok,message)=>{if(!ok)throw new Error(message)};
const rules=['prior-seat-party','prior-statewide-leader'];
function assertSeats(rows,year){
 requireCondition(Array.isArray(rows)&&rows.length===60,'Expected exactly sixty seats');
 requireCondition(new Set(rows.map(r=>r.ac)).size===60,'Duplicate AC');
 requireCondition(rows.every(r=>Number.isInteger(r.ac)&&r.ac>=1&&r.ac<=60&&typeof r.party==='string'&&r.party.length>0&&r.party===r.party.trim()),'Invalid AC or literal party code');
 if(year!==undefined)requireCondition(rows.every(r=>r.year===year),'Unexpected target election year');
}
// This function accepts the prior register only. No target object is reachable here.
export function predict2007(register){
 requireCondition(register?.electionYear===2007,'Expected original 2007 general-election register');
 const input=register.records;assertSeats(input);
 const counts={};for(const r of input)if(r.party!=='IND')counts[r.party]=(counts[r.party]||0)+1;
 const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 const leader=ranked.length&&(ranked.length===1||ranked[0][1]>ranked[1][1])?ranked[0][0]:null;
 return {trainingYear:2007,targetYear:2012,nonIndependentSeatCounts:counts,statewideParty:leader,
 rows:[...input].sort((a,b)=>a.ac-b.ac).map(r=>({ac:r.ac,priorParty:r.party,predictions:{'prior-seat-party':r.party==='IND'?null:r.party,'prior-statewide-leader':leader},reasons:{'prior-seat-party':r.party==='IND'?'Prior IND is not a continuous party or a verified person match':null,'prior-statewide-leader':leader===null?'No unique largest non-IND prior seat party':null}}))};
}
function validatePredictions(predictions){
 requireCondition(predictions?.trainingYear===2007&&predictions.targetYear===2012,'Unexpected prediction years');
 assertSeats(predictions.rows.map(r=>({ac:r.ac,party:r.priorParty})));
 for(const r of predictions.rows)for(const rule of rules)requireCondition(r.predictions?.[rule]===null||(typeof r.predictions?.[rule]==='string'&&r.predictions[rule].length>0),'Invalid detached prediction');
}
function score(rows,rule){
 const eligible=rows.filter(r=>r.predictions[rule]!==null),correct=eligible.filter(r=>r.matches[rule]===true).length;
 return {correct,total:eligible.length,accuracy:eligible.length?correct/eligible.length:null,errorACs:eligible.filter(r=>r.matches[rule]===false).map(r=>r.ac),abstainedACs:rows.filter(r=>r.predictions[rule]===null).map(r=>r.ac)};
}
// Detached prediction values are joined to targets only in this scorer.
export function score2012(predictions,targets){
 validatePredictions(predictions);assertSeats(targets,2012);
 const byAC=new Map(targets.map(t=>[t.ac,t]));
 const rows=predictions.rows.map(p=>{const t=byAC.get(p.ac);return {...structuredClone(p),actualParty:t.party,targetSource:{source:t.source??null,page:t.sourcePage??null},commonEligible:rules.every(rule=>p.predictions[rule]!==null),matches:Object.fromEntries(rules.map(rule=>[rule,p.predictions[rule]===null?null:p.predictions[rule]===t.party]))}});
 const common=rows.filter(r=>r.commonEligible);
 return {trainingYear:2007,targetYear:2012,statewideParty:predictions.statewideParty,commonACs:common.map(r=>r.ac),excludedFromCommon:rows.filter(r=>!r.commonEligible).map(r=>({ac:r.ac,reasons:Object.fromEntries(rules.filter(rule=>r.predictions[rule]===null).map(rule=>[rule,r.reasons[rule]]))})),common:Object.fromEntries(rules.map(rule=>[rule,score(common,rule)])),fullEligibility:Object.fromEntries(rules.map(rule=>[rule,score(rows,rule)])),rows};
}
