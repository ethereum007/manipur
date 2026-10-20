const need=(condition,message)=>{if(!condition)throw new Error(message)};
export const contextRules=['repeat','statewide','parliament'];
function completeSeats(rows,label){need(rows.length===60,label+': expected sixty records');need(new Set(rows.map(r=>r.ac)).size===60,label+': duplicate AC');need(rows.every(r=>Number.isInteger(r.ac)&&r.ac>=1&&r.ac<=60),label+': invalid AC');}
function priorWinners(rows,year){completeSeats(rows,'Prior Assembly');need(rows.every(r=>r.year===year&&typeof r.party==='string'&&r.party.trim()),'Invalid prior Assembly year/party');}
export function normalizeParliament(dataset,year,columnRegister){
 need(year===2014||year===2019,'Unsupported Parliamentary source year');
 if(year===2014)need(dataset.year===2014&&dataset.combinedNormalizationComplete===true,'2014 source scope incomplete');
 completeSeats(dataset.segments,'Parliamentary sources');
 return dataset.segments.map(s=>{
  const source={url:s.sourceUrl,sha256:s.sourceSha256||s.sha256,page:s.sourcePage||s.footerPage||null,scope:year===2014?'official combined sheet; five selected scanned footers, no complete station audit':'individual native table; selected visual checks and source exceptions retained'};
  need(typeof source.url==='string'&&source.url.includes(year===2014?'/2014/':'/LS2019/'),'Parliamentary source event-year mismatch');need(/^[a-f0-9]{64}$/.test(source.sha256),'Missing source fingerprint');
  if(year===2019&&s.status==='withheld')return {ac:s.ac,year,status:'withheld',reason:'Prior Parliamentary segment withheld: contradictory official sources',candidates:[],source};
  let candidates;
  if(year===2014){need(s.year===2014,'Mixed 2014 source events');candidates=s.candidates.map(c=>({party:c.party,votes:c.votes,sourceColumn:c.sourceColumn}));}
  else{
   need(s.status==='reconciled','Unapproved 2019 segment status');const map=columnRegister.sources.find(r=>r.pc===s.pc);need(map,'Missing source-column map');const n=map.parties.length;
   need(s.values.length===n+5&&s.candidateHeaders.length===n,'2019 source column count');
   need(s.values.slice(0,n).reduce((a,b)=>a+b,0)===s.values[n],'2019 candidate-sum discrepancy');
   candidates=map.parties.map((baseParty,i)=>{const override=columnRegister.cellOverrides?.find(r=>r.ac===s.ac&&r.sourceColumn===i+1);if(override)need(s.candidateHeaders[i]===override.sourceHeader,'Changed reviewed source-header exception');const party=override?.party||baseParty;const h=s.candidateHeaders[i].toUpperCase(),compact=h.replace(/[^A-Z]/g,'');need(party==='IND'?/INDEPENDENT|\(IND\)?|^IND\b/.test(h):compact.includes(party.replace(/[^A-Z]/g,'')),'2019 source-party column mismatch');return {party,votes:s.values[i],sourceColumn:i+1};});
  }
  need(candidates.length>1&&candidates.every(c=>Number.isInteger(c.votes)&&c.votes>=0),'Invalid Parliamentary candidate votes');
  return {ac:s.ac,year,status:'available',candidates,source};
 });
}
// This function receives prior inputs only. Target labels are supplied to scoreContext separately.
export function predictContext(priorAssembly,priorParliament,{assemblyYear,parliamentYear,targetYear}){
 need(assemblyYear<parliamentYear&&parliamentYear<targetYear,'Input event must precede target');priorWinners(priorAssembly,assemblyYear);completeSeats(priorParliament,'Prior Parliament');need(priorParliament.every(r=>r.year===parliamentYear),'Mixed/future Parliamentary input');
 const tally={};for(const r of priorAssembly)tally[r.party]=(tally[r.party]||0)+1;
 const max=Math.max(...Object.values(tally)),leaders=Object.keys(tally).filter(p=>tally[p]===max).sort();
 const statewide=leaders.length===1&&leaders[0]!=='IND'?leaders[0]:null;
 const statewideReason=statewide?null:leaders.length>1?'Prior statewide Assembly seat leader is tied':'Prior statewide leader is IND, not a continuous party';
 return [...priorAssembly].sort((a,b)=>a.ac-b.ac).map(a=>{
  const p=priorParliament.find(r=>r.ac===a.ac);let parliament=null,leadParty=null,reason=null,tiedParties=[];
  if(p.status!=='available'||!p.candidates.length)reason=p.reason||'Prior Parliamentary input missing or withheld';
  else{const top=Math.max(...p.candidates.map(c=>c.votes));const topRows=p.candidates.filter(c=>c.votes===top);if(topRows.length>1){tiedParties=topRows.map(c=>c.party);reason='Prior Parliamentary candidate lead is tied';}else{leadParty=topRows[0].party;if(typeof leadParty!=='string'||!leadParty.trim()){leadParty=null;reason='Prior Parliamentary party coding unresolved';}else if(leadParty==='IND')reason='Prior Parliamentary IND is not a persistent party or verified person match';else parliament=leadParty;}}
  const predictions={repeat:a.party==='IND'?null:a.party,statewide,parliament};const abstentions={repeat:a.party==='IND'?'Prior Assembly IND is not a persistent party or verified person match':null,statewide:statewideReason,parliament:reason};
  return {ac:a.ac,targetYear,priorAssemblyParty:a.party,priorParliamentLeadParty:leadParty,priorParliamentTiedParties:tiedParties,parliamentSource:p.source,predictions,abstentions,commonEligible:contextRules.every(rule=>predictions[rule]!==null)};
 });
}
function countScore(rows,rule){const confusion={};for(const row of rows){const p=row.predictions[rule];need(p!==null,'Abstention cannot be scored');const key=JSON.stringify([p,row.actualParty]);confusion[key]=(confusion[key]||0)+1;}const correct=rows.filter(r=>r.predictions[rule]===r.actualParty).length;return {correct,total:rows.length,accuracy:rows.length?correct/rows.length:null,confusion:Object.entries(confusion).map(([key,count])=>{const [predicted,actual]=JSON.parse(key);return {predicted,actual,count}}).sort((a,b)=>b.count-a.count||a.predicted.localeCompare(b.predicted)||a.actual.localeCompare(b.actual))};}
function paired(rows,reference){const counts={bothCorrect:0,parliamentOnlyCorrect:0,referenceOnlyCorrect:0,bothWrong:0};for(const r of rows){const c=r.predictions.parliament===r.actualParty,b=r.predictions[reference]===r.actualParty;counts[c?(b?'bothCorrect':'parliamentOnlyCorrect'):(b?'referenceOnlyCorrect':'bothWrong')]++;}return {...counts,total:rows.length,netCorrect:counts.parliamentOnlyCorrect-counts.referenceOnlyCorrect};}
export function scoreContext(predictions,target){completeSeats(predictions,'Frozen predictions');completeSeats(target,'Assembly target');need(predictions.every(p=>p.targetYear===predictions[0].targetYear)&&target.every(r=>r.year===predictions[0].targetYear&&typeof r.party==='string'&&r.party.trim()),'Invalid Assembly target year/party');const rows=predictions.map(p=>({...p,actualParty:target.find(t=>t.ac===p.ac).party}));const common=rows.filter(r=>r.commonEligible);return {commonSeats:common.length,commonScores:Object.fromEntries(contextRules.map(rule=>[rule,countScore(common,rule)])),fullEligibleScores:Object.fromEntries(contextRules.map(rule=>[rule,countScore(rows.filter(r=>r.predictions[rule]!==null),rule)])),excludedSeats:rows.filter(r=>!r.commonEligible).map(r=>({ac:r.ac,reasons:contextRules.filter(rule=>r.abstentions[rule]).map(rule=>({rule,reason:r.abstentions[rule]}))})),paired:{versusRepeat:paired(common,'repeat'),versusStatewide:paired(common,'statewide')},rows};}
export function buildContextValidation({winners,parliament2014,parliament2019,columns2019}){
 const windows=[{assemblyYear:2012,parliamentYear:2014,targetYear:2017},{assemblyYear:2017,parliamentYear:2019,targetYear:2022}].map(config=>{
  const priorAssembly=winners.filter(r=>r.year===config.assemblyYear);
  const priorParliament=normalizeParliament(config.parliamentYear===2014?parliament2014:parliament2019,config.parliamentYear,columns2019);
  const predictions=predictContext(priorAssembly,priorParliament,config);
  // Historical Assembly labels are joined after prior-only predictions are frozen.
  const target=winners.filter(r=>r.year===config.targetYear);
  return {...config,...scoreContext(predictions,target)};
 });
 return {protocolVersion:'context-1.0',reviewedAt:'2026-10-21',kind:'Event-prior retrospective context-rule comparison; historical outcomes were already known',target:'Assembly election-day winning-party code',vintageVerified:false,prospectivelyValidated:false,probabilitiesAvailable:false,rules:{repeat:'Prior Assembly seat-winning party; prior IND abstains',statewide:'Prior statewide Assembly seat-count leader everywhere; ties and IND leader abstain',parliament:'Prior ordinary Parliamentary segment leading-party code; IND, ties, missing/withheld or unresolved coding abstain'},comparison:'All three primary scores use the intersection of eligible seats. Full eligible denominators are separate. Existing Assembly-only reports are unchanged.',limitations:['Only two historical transitions; seats are correlated, not independent repeated elections.','Historical outcomes were inspected before this protocol; no unseen or prospective validation is claimed.','Sources were acquired in 2026; original historical publication-version availability remains unverified.','2014 uses combined-sheet rows with five selected scan comparisons, not sixty complete station audits.','2019 Henglep remains withheld; its combined-sheet row is not substituted.','Parliamentary local leads are contextual inputs, never Assembly target outcomes.','No fitted model, causal findings, sensitive-identity inputs, 2027 favourites or probabilities are produced.'],windows};
}
