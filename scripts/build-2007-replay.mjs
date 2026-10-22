import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {predict2007,score2012} from '../src/lib/forecast-2007-replay.mjs';
const hash=t=>crypto.createHash('sha256').update(t).digest('hex');
const protocolPath='data/research/forecast-protocol-2007-2012.json';const protocolText=fs.readFileSync(protocolPath,'utf8'),protocol=JSON.parse(protocolText);
const input=protocol.sourceInputs;const priorText=fs.readFileSync(input.predictorPath,'utf8');assert.equal(hash(priorText),input.predictorSha256,'Predictor fingerprint drift');
const lineageText=fs.readFileSync(input.lineagePath,'utf8');assert.equal(hash(lineageText),input.lineageSha256,'Lineage fingerprint drift');
const acceptancePath='data/research/assembly-2007-2012-source-acceptance.json';const acceptanceText=fs.readFileSync(acceptancePath,'utf8');assert.equal(hash(acceptanceText),protocol.sourceAcceptanceSha256,'Acceptance fingerprint drift');assert.equal(JSON.parse(acceptanceText).winnerPartyInputAccepted,true);
// Deliberately generate and serialize predictions before opening the target file.
const predictions=JSON.parse(JSON.stringify(predict2007(JSON.parse(priorText))));
const targetText=fs.readFileSync(input.targetPath,'utf8');assert.equal(hash(targetText),input.targetSha256,'Target fingerprint drift');
const targets=JSON.parse(targetText).filter(r=>r.year===2012);const scored=score2012(predictions,targets);
assert.equal(scored.commonACs.length,50);assert.deepEqual(scored.excludedFromCommon.map(r=>r.ac),[19,42,43,44,45,48,49,51,52,53]);
const enginePath='src/lib/forecast-2007-replay.mjs',builderPath='scripts/build-2007-replay.mjs';
const report={schemaVersion:1,id:'manipur-2007-2012-reference-replay-v1',reviewedAt:'2026-10-22',scope:'Retrospective original-register winner-party replay; not prospective validation or certified territorial geometry',protocol:{path:protocolPath,sha256:hash(protocolText),frozenRevision:'485e97c4a8a1d4badfa8eaaf89700d3b1fdfedb5'},fingerprints:{predictor:input.predictorSha256,target:input.targetSha256,lineage:input.lineageSha256,acceptance:protocol.sourceAcceptanceSha256,engine:hash(fs.readFileSync(enginePath)),builder:hash(fs.readFileSync(builderPath)),detachedPredictions:hash(JSON.stringify(predictions))},readiness:protocol.readiness,limitations:[...protocol.limitations,'All six withheld 2007 numerical tables and thirteen candidate-name differences remain unresolved; this replay uses the separate elected-member register.'],detachedPredictions:predictions,...scored};
const output='data/research/forecast-2007-replay.json';
if(process.argv.includes('--write'))fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');else assert.deepEqual(report,JSON.parse(fs.readFileSync(output,'utf8')),'Replay report differs from deterministic regeneration');
console.log(JSON.stringify({common:report.common,fullEligibility:report.fullEligibility}));
