from pathlib import Path
from datetime import datetime,timezone
import json,requests,pymupdf,hashlib,re,os
out=Path('work-2014');out.mkdir(exist_ok=True)
m=json.loads(Path('data/research/historical-parliament-sources.json').read_text())
review=json.loads(Path('data/research/parliament-2014-selected-review.json').read_text())
def numeric(cell):
 text=re.sub(r'[\s,]','',cell or '')
 if not re.fullmatch(r'\d+',text):raise ValueError('Non-numeric source cell '+repr(cell))
 return int(text)
def ballot(v,n):
 assert sum(v[:n])+v[n]==v[n+1],('Printed valid includes NOTA',v)
 assert v[n+1]+v[n+2]==v[n+3],('Total ballot accounting',v)
def packed(v,n):
 return {'candidateVotes':v[:n],'candidateSum':sum(v[:n]),'nota':v[n],'printedValidIncludingNota':v[n+1],'rejected':v[n+2],'votesPolled':v[n+3],'tendered':v[n+4]}
segments=[];pcs=[]
for pc in [1,2]:
 spec=next(r for r in m['records'] if r['year']==2014 and r['role']=='combined-result' and ('INNER' if pc==1 else 'OUTER') in r['url'])
 raw=requests.get(spec['url'],timeout=(20,120)).content;assert hashlib.sha256(raw).hexdigest()==spec['sha256']
 doc=pymupdf.open(stream=raw,filetype='pdf');assert len(doc)==1
 table=doc[0].find_tables().tables[0].extract();n=8 if pc==1 else 10
 header=next(r[2:2+n] for r in table if not r[0] and all(r[2:2+n]))
 anchors=['meinya','nara','ranjan','manaobi','ibomcha','jotin','tonsana','indira'] if pc==1 else ['kim','kamei','doungel','baite','lorho','khamchinpau','lamminlien','sankhil','charenamei','lamlalmoi']
 assert all(a in re.sub(r'[^a-z]','',h.lower()) for a,h in zip(anchors,header)),'Candidate column anchors'
 footer={};vectors=[]
 for row in table:
  if len(row)!=n+7:continue
  key=re.sub(r'[^a-z]','',(row[0] or '').lower())
  if re.fullmatch(r'\d+',row[0] or ''):
   ac=int(row[0]);cells=row[2:].copy();notes=[]
   if ac==50:
    assert cells[0]==review['nativeCellException']['raw'];cells[0]=str(review['nativeCellException']['value']);notes=[review['nativeCellException']]
   v=[numeric(c) for c in cells];ballot(v,n);vectors.append(v)
   canonical=next(r['label'] for r in m['records'] if r['year']==2014 and r['role']=='indexed-segment' and r['ac']==ac)
   candidates=[{'sourceColumn':i+1,'candidate':name,'party':party,'sourceHeader':header[i],'votes':v[i]} for i,(name,party) in enumerate(review['candidateColumns'][str(pc)])]
   segments.append({'year':2014,'ac':ac,'name':canonical,'sourceLabel':row[1],'pc':pc,'sourceUrl':spec['url'],'sourcePage':1,'sourceSha256':spec['sha256'],'capturedAt':spec['checkedAt'],'originalPublicationDate':None,'scope':'Ordinary segment row in official combined Parliamentary sheet; no all-station reconciliation','rawCells':row,'candidateVotes':sum(v[:n]),'nota':v[n],'printedValidIncludingNota':v[n+1],'rejected':v[n+2],'votesPolled':v[n+3],'tendered':v[n+4],'candidates':sorted(candidates,key=lambda c:(-c['votes'],c['sourceColumn'])),'normalizationNotes':notes,'selectedIndividualFooterReviewed':any(f['ac']==ac for f in review['footers']),'stationAuditComplete':False,'labelDiscrepancy':review['labelDiscrepancy'] if ac==29 else None})
  elif key in ['grandtotal','noofvotesonpostalballotpapers','totalvotespolled']:
   v=[numeric(c) for c in row[2:]];ballot(v,n);footer[key]={'sourceLabel':row[0],'values':v,**packed(v,n)}
 assert len(vectors)==(32 if pc==1 else 28)
 ordinary=footer['grandtotal'];postal=footer['noofvotesonpostalballotpapers'];total=footer['totalvotespolled']
 assert [sum(v[j] for v in vectors) for j in range(n+5)]==ordinary['values'],'Segment/footer sums'
 assert [a+b for a,b in zip(ordinary['values'],postal['values'])]==total['values'],'Ordinary/postal/total conservation'
 pcs.append({'pc':pc,'sourceUrl':spec['url'],'sourceSha256':spec['sha256'],'sourcePage':1,'candidateHeaders':header,'ordinary':ordinary,'postal':postal,'total':total,'checksPassed':True})
segments.sort(key=lambda s:s['ac']);assert [s['ac'] for s in segments]==list(range(1,61))
for f in review['footers']:
 s=next(s for s in segments if s['ac']==f['ac']);ordered=sorted(s['candidates'],key=lambda c:c['sourceColumn'])
 assert [c['votes'] for c in ordered]==f['candidateVotes']
 assert s['candidateVotes']==f['candidateSum'] and s['nota']==f['nota'] and s['votesPolled']==f['total']
report={'year':2014,'electionType':'Parliamentary','processedAt':datetime.now(timezone.utc).isoformat(),'cloudRun':'https://github.com/ethereum007/manipur/actions/runs/'+os.environ['GITHUB_RUN_ID'],'scope':'60 ordinary segment rows from two official combined sheets. Numerical within-source reconciliation; five selected scanned footer comparisons. Not a 60-document station audit, Assembly target, original publication-time proof or approved forecast feature.','accountingConvention':'Combined printed valid totals include NOTA; normalized candidateVotes excludes NOTA. Individual scanned Form20 footers separate candidate-valid votes and NOTA.','combinedNormalizationComplete':True,'allIndividualStationAuditsComplete':False,'segments':segments,'parliamentaryTotals':pcs,'selectedReview':review}
(out/'reconciliation.json').write_text(json.dumps(report,indent=2));print(json.dumps({'segments':len(segments),'selectedFooterChecks':len(review['footers']),'combinedTotalsPassed':all(p['checksPassed'] for p in pcs),'stationAuditComplete':False}))
