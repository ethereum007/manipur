from pathlib import Path
from datetime import datetime,timezone
from concurrent.futures import ThreadPoolExecutor
import json,requests,pymupdf,hashlib,re,os
out=Path('work-2019');out.mkdir(exist_ok=True)
m=json.loads(Path('data/research/historical-parliament-sources.json').read_text())
fixture=json.loads(Path('data/research/parliament-2019-combined-review.json').read_text())
def num(s):
 s=re.sub(r'[\s,]','',s or '')
 if not re.fullmatch(r'\d+',s):raise ValueError('Non-numeric cell: '+repr(s))
 return int(s)
def ballot(v,n):
 assert sum(v[:n])==v[n],('candidate-sum',v)
 assert v[n]+v[n+1]+v[n+2]==v[n+3],('ballot-accounting',v)
def process(r):
 ac=r['ac'];pc=1 if ac<=32 else 2;n=11 if pc==1 else 8
 try:
  raw=requests.get(r['url'],timeout=(20,120)).content
  assert hashlib.sha256(raw).hexdigest()==r['sha256'],'Source hash changed'
  doc=pymupdf.open(stream=raw,filetype='pdf');stations=[];footers=[];headers=[];issues=[]
  for pi,p in enumerate(doc):
   text=p.get_text();match=re.search(r'Name\s*of\s*(?:the\s*)?Assembly\s*(?:Segment|Segmen|Segement|Constituency)\s*:\s*(\d+)',text,re.I)
   assert match and int(match[1])==ac,('AC header',ac,pi+1)
   for table in p.find_tables().tables:
    for row in table.extract():
     if len(row)!=n+7:continue
     if not row[0] and all(row[2:2+n]) and any('James' in str(c) or 'Nabakishore' in str(c) for c in row[2:2+n]):headers.append(row[2:2+n])
     if re.fullmatch(r'\d+/\d+[A-Z]?',re.sub(r'\s','',row[0] or '')):
      cells=row[2:]
      if ac==31 and row[0]=='31/24' and re.sub(r'\s','',cells[7])=='0..':cells[7]='0'
      v=list(map(num,cells))
      try:ballot(v,n)
      except AssertionError:issues.append({'kind':'station-ballot-accounting','station':row[0],'page':pi+1,'values':v,'candidateSum':sum(v[:n])})
      stations.append({'id':re.sub(r'\s','',row[0]),'page':pi+1,'values':v})
     elif re.search(r'totalvote[sd]?polled', re.sub(r'[^a-z]','',(' '.join(str(x or '') for x in row[:2])).lower())):
      v=list(map(num,row[2:]));footers.append({'page':pi+1,'values':v});ballot(v,n)
  assert len(footers)==1,('footer count',len(footers))
  assert stations and len({s['id'] for s in stations})==len(stations),'station coverage'
  for s in stations:
   if int(s['id'].split('/')[0])!=ac:issues.append({'kind':'printed-station-prefix','station':s['id'],'page':s['page'],'assignedBy':'PDF Assembly header; printed station ID preserved'})
  station_sums=[sum(s['values'][j] for s in stations) for j in range(n+5)]
  if station_sums!=footers[0]['values']:issues.append({'kind':'station-footer-discrepancy','stationSums':station_sums,'footer':footers[0]['values']})
  if ac==34:headers=[['Angam Karung Kom (NCP)','K. James (INC)','Thangminlien Kipgen (NPP)','Lorho S. Pfoze (NPF)','Houlim Shokhopao Mate @ Benjamin (BJP)','Ashang Kasar (NEIDP)','Hangkhanpau Taithul (JDU (United))','Leikhan Kaipu (IND)']] 
  assert headers,'candidate headers missing'
  anchors=['nabakishore','nara','ranjan','anand','jugindro','tonsana','nandeshw?ore','yash','nongshaba','somendro','pabitra'] if pc==1 else ['kom','james','kipgen','pfoze','shokhopao','kasar','taithul','kaiph?u']
  assert all(re.search(anchor,re.sub(r'[^a-z]','',header.lower())) for anchor,header in zip(anchors,headers[0])),'candidate column order'
  assert all(h==headers[0] for h in headers),'within-document candidate order changed'
  if issues or ac in [1,34,60]:
   for i,p in enumerate(doc):p.get_pixmap(dpi=120).save(out/('review-'+str(ac)+'-'+str(i+1)+'.png'))
  return {'ac':ac,'name':r['label'],'pc':pc,'status':'reconciled','sourceUrl':r['url'],'sha256':r['sha256'],'footerPage':footers[0]['page'],'candidateHeaders':headers[0],'values':footers[0]['values'],'pollingStations':len(stations),'stationRows':stations,'stationAuditComplete':not issues,'issues':issues,'headerMethod':'selected-page visual transcription' if ac==34 else 'native table header','cellNotes':[{'station':'31/24','page':1,'candidateColumn':8,'nativeCell':'0 with stray dots','value':0,'method':'selected original-page visual comparison 21 October 2026'}] if ac==31 else []}
 except Exception as exc:
  if 'doc' in locals():
   (out/('diagnostic-'+str(ac)+'.json')).write_text(json.dumps([{'page':i+1,'text':p.get_text(),'tables':[t.extract() for t in p.find_tables().tables]} for i,p in enumerate(doc)]))
   if ac in [27,31,34,43,57]:
    for i,p in enumerate(doc):p.get_pixmap(dpi=120).save(out/('review-'+str(ac)+'-'+str(i+1)+'.png'))
  return {'ac':ac,'pc':pc,'status':'withheld','reason':str(exc),'printedFooter':footers[0] if 'footers' in locals() and footers else None,'stationIssues':issues if 'issues' in locals() else [],'sourceUrl':r['url'],'sha256':r['sha256']}
records=sorted([r for r in m['records'] if r['year']==2019 and r['role']=='indexed-segment'],key=lambda r:r['ac'])
with ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(process,records))
checks=[]
for pc in [1,2]:
 n=11 if pc==1 else 8;group=[r for r in rows if r['pc']==pc and r['status']=='reconciled'];f=fixture['parliamentaryTotals'][str(pc)]
 expected=f['ordinary']['votes']+[f['ordinary'][k] for k in ['valid','rejected','nota','total','tendered']]
 actual=[sum(r['values'][j] for r in group) for j in range(n+5)]
 conservation=all(f['ordinary'][k]+f['postal'][k]==f['grand'][k] for k in ['valid','rejected','nota','total','tendered']) and all(a+b==c for a,b,c in zip(f['ordinary']['votes'],f['postal']['votes'],f['grand']['votes']))
 checks.append({'pc':pc,'segments':len(group),'expected':expected,'actual':actual,'matchesCombinedOrdinary':actual==expected,'postalGrandConservation':conservation})
report={'generatedAt':datetime.now(timezone.utc).isoformat(),'cloudRun':'https://github.com/ethereum007/manipur/actions/runs/'+os.environ['GITHUB_RUN_ID'],'scope':'2019 Parliamentary ordinary polling-station and segment arithmetic. Not Assembly winners, model-ready vintage verification or full visual audit. Native candidate header text preserved; no cross-election identity join.','segments':rows,'checks':checks,'complete':len(rows)==60 and all(r['status']=='reconciled' for r in rows) and all(c['matchesCombinedOrdinary'] and c['postalGrandConservation'] for c in checks)}
exception=next((r for r in rows if r['ac']==57),None)
combined57=[353,3373,944,3277,17743,65,199,17,25971,0,53,26024,0]
report['combinedHenglepReview']={'values':combined57,'page':1,'sourceUrl':next(r['url'] for r in m['records'] if r['year']==2019 and r['role']=='combined-result' and 'Outer' in r['url']),'scope':'Selected original combined-page visual transcription; contradictory segment footer remains withheld.'}
report['releaseChecksPassed']=len(rows)==60 and sum(r['status']=='reconciled' for r in rows)==59 and exception is not None and exception['status']=='withheld' and (exception.get('printedFooter') or {}).get('values')==[353,3373,924,3277,17473,65,196,17,25971,0,53,26024,0] and checks[0]['matchesCombinedOrdinary'] and all(a+b==c for a,b,c in zip(checks[1]['actual'],combined57,checks[1]['expected'])) and all(c['postalGrandConservation'] for c in checks)
(out/'reconciliation.json').write_text(json.dumps(report,indent=2));print(json.dumps({'complete':report['complete'],'checks':checks,'withheld':[r for r in rows if r['status']=='withheld']}))
if not report['releaseChecksPassed']:raise SystemExit('Unexpected reconciliation failure; publication blocked')
