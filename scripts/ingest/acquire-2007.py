from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import json,hashlib,re,os,zipfile,requests,pymupdf
spec=json.loads(Path('data/research/assembly-2007-source-index.json').read_text());out=Path('work-2007');out.mkdir(exist_ok=True);originals=out/'originals';originals.mkdir(exist_ok=True);review=out/'review';review.mkdir(exist_ok=True)
run=os.environ['GITHUB_RUN_ID'];archive='assembly-2007-and-boundaries-run-'+run+'.zip'
def acquire(s):
 r={**s,'checkedAt':datetime.now(timezone.utc).isoformat()}
 try:
  response=requests.get(s['url'],timeout=(20,180));r['httpStatus']=response.status_code;raw=response.content
  if response.status_code!=200 or not raw.lstrip().startswith(b'%PDF-'):r['status']='unavailable-or-not-pdf';return r
  sha=hashlib.sha256(raw).hexdigest();filename=s['role']+'-'+sha[:12]+'.pdf';(originals/filename).write_bytes(raw)
  with pymupdf.open(stream=raw,filetype='pdf') as doc:
   texts=[p.get_text() for p in doc];r.update({'status':'pdf-opened','sha256':sha,'bytes':len(raw),'pages':len(doc),'pagesWithNativeText':sum(len(' '.join(t.split()))>=80 for t in texts),'archiveFile':'originals/'+filename})
   selected=[]
   if s['role']=='eci-statistical-report':
    (out/'report-pages.json').write_text(json.dumps([{'page':i+1,'text':t,'tables':[table.extract() for table in doc[i].find_tables().tables]} for i,t in enumerate(texts)],indent=2))
    selected=[i for i,t in enumerate(texts) if 'SUCCESSFUL' in t.upper() and 'CANDIDATE' in t.upper()][:10]
   elif s['role']=='delimitation-order':
    (out/'delimitation-manipur-pages.json').write_text(json.dumps([{'page':i+1,'text':texts[i],'tables':[table.extract() for table in doc[i].find_tables().tables]} for i in range(280,min(294,len(doc)))],indent=2));selected=[280,293]
   elif s['role']=='administrative-report':
    (out/'admin-pages.json').write_text(json.dumps([{'page':i+1,'text':t} for i,t in enumerate(texts)],indent=2));selected=[i for i,t in enumerate(texts) if '2007' in t and ('1976' in t or 'uploaded' in t.lower())][:3]
   elif s['ac'] in [1,21,33,60]:selected=sorted({0,len(doc)-1})
   for i in selected:
    image=s['role']+'-'+str(s['ac'] or 0)+'-p'+str(i+1)+'.png';doc[i].get_pixmap(dpi=130).save(review/image)
 except Exception as exc:r.update({'status':'acquisition-error','error':type(exc).__name__+': '+str(exc)})
 return r
with ThreadPoolExecutor(max_workers=4) as pool:records=list(pool.map(acquire,spec['documents']))
manifest={'capturedAt':datetime.now(timezone.utc).isoformat(),'scope':'Original source acquisition and native-text readiness only; no new historical benchmark or certified geographic crosswalk approved.','cloudRun':'https://github.com/ethereum007/manipur/actions/runs/'+run,'archiveUrl':'https://github.com/ethereum007/manipur/releases/download/primary-sources-2026-10-19/'+archive,'indexUrl':spec['indexUrl'],'records':records}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2))
with zipfile.ZipFile(out/archive,'w',zipfile.ZIP_DEFLATED) as z:
 z.write(out/'manifest.json','manifest.json')
 for p in originals.glob('*.pdf'):z.write(p,'originals/'+p.name)
print(json.dumps({'sources':len(records),'opened':sum(r['status']=='pdf-opened' for r in records),'unavailable':[r for r in records if r['status']!='pdf-opened']}))
