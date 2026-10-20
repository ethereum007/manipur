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
  doc=pymupdf.open(stream=raw,filetype='pdf');stations=[];footers=[];headers=[]
  for pi,p in enumerate(doc):
   text=p.get_text();match=re.search(r'Name\s*of\s*(?:the\s*)?Assembly\s*(?:Segment|Segmen|Segement)\s*:\s*(\d+)',text,re.I)
   assert match and int(match[1])==ac,('AC header',ac,pi+1)
   for table in p.find_tables().tables:
    for row in table.extract():
     if len(row)!=n+7:continue
     if not row[0] and all(row[2:2+n]) and any('James' in str(c) or 'Nabakishore' in str(c) for c in row[2:2+n]):headers.append(row[2:2+n])
     if re.fullmatch(r'\d+/\d+[A-Z]?',re.sub(r'\s','',row[0] or '')):
      cells=row[2:]
      if ac==31 and row[0]=='31/24' and re.sub(r'\s','',cells[7])=='0..':cells[7]='0'
      v=list(map(num,cells));ballot(v,n);stations.append({'id':re.sub(r'\s','',row[0]),'page':pi+1,'values':v})
     elif re.search(r'totalvotes?polled', re.sub(r'[^a-z]','',(' '.join(str(x or '') for x in row[:2])).lower())):
      v=list(map(num,row[2:]));ballot(v,n);footers.append({'page':pi+1,'values':v})
  assert len(footers)==1,('footer count',len(footers))
  assert stations and len({s['id'] for s in stations})==len(stations),'station coverage'
  assert all(int(s['id'].split('/')[0])==ac for s in stations),'station AC'
  assert [sum(s['values'][j] for s in stations) for j in range(n+5)]==footers[0]['values'],'station/footer discrepancy'
  assert headers,'candidate headers missing'
  assert all(h==headers[0] for h in headers),'within-document candidate order changed'
  return {'ac':ac,'name':r['label'],'pc':pc,'status':'reconciled','sourceUrl':r['url'],'sha256':r['sha256'],'footerPage':footers[0]['page'],'candidateHeaders':headers[0],'values':footers[0]['values'],'pollingStations':len(stations),'stationRows':stations}
 except Exception as exc:
  if 'doc' in locals():
   (out/('diagnostic-'+str(ac)+'.json')).write_text(json.dumps([{'page':i+1,'text':p.get_text(),'tables':[t.extract() for t in p.find_tables().tables]} for i,p in enumerate(doc)]))
   if ac in [31,34,43]:
    for i,p in enumerate(doc):p.get_pixmap(dpi=120).save(out/('review-'+str(ac)+'-'+str(i+1)+'.png'))
  return {'ac':ac,'pc':pc,'status':'withheld','reason':str(exc),'sourceUrl':r['url'],'sha256':r['sha256']}
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
(out/'reconciliation.json').write_text(json.dumps(report,indent=2));print(json.dumps({'complete':report['complete'],'checks':checks,'withheld':[r for r in rows if r['status']=='withheld']}))
if not report['complete']:raise SystemExit('Withheld: unresolved reconciliation failures')
