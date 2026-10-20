from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from urllib.parse import urlsplit, unquote
import hashlib,json,os,re,zipfile
import requests,pymupdf
specs=json.loads(Path('data/research/historical-parliament-source-index.json').read_text())
out=Path('work-history');out.mkdir(exist_ok=True);pdfs=out/'originals';pdfs.mkdir(exist_ok=True);review=out/'review';review.mkdir(exist_ok=True)
run=os.environ.get('GITHUB_RUN_ID','manual');archive='historical-parliament-2014-2019-run-'+run+'.zip'

def acquire(url):
 spec=next(s for s in specs if s['url']==url);record={'url':url,'checkedAt':datetime.now(timezone.utc).isoformat()}
 try:
  response=requests.get(url,timeout=(20,120));record['httpStatus']=response.status_code
  if response.status_code!=200:record['status']='http-unavailable';return record
  raw=response.content
  if not raw.lstrip().startswith(b'%PDF-'):record['status']='not-pdf';return record
  sha=hashlib.sha256(raw).hexdigest();filename=str(spec['year'])+'-'+sha[:12]+'.pdf';(pdfs/filename).write_bytes(raw)
  with pymupdf.open(stream=raw,filetype='pdf') as doc:
   counts=[len(' '.join(p.get_text().split())) for p in doc]
   record.update({'status':'pdf-opened','sha256':sha,'bytes':len(raw),'pages':len(doc),'pagesWithNativeText':sum(n>=80 for n in counts),'nativeTextCharacters':sum(counts),'archiveFile':'originals/'+filename})
   selected=any(s['url']==url and (s['role']=='combined-result' or (s['year']==2014 and s['ac'] in [33,34]) or (s['year']==2019 and s['ac'] in [1,60])) for s in specs)
   if selected:
    record['reviewImages']=[]
    for page in sorted({1,len(doc)}):
     image=str(spec['year'])+'-'+sha[:12]+'-p'+str(page)+'.png';doc[page-1].get_pixmap(dpi=130).save(review/image);record['reviewImages'].append(image)
 except Exception as exc:record.update({'status':'request-or-pdf-error','errorType':type(exc).__name__})
 return record
urls=list(dict.fromkeys(s['url'] for s in specs))
with ThreadPoolExecutor(max_workers=4) as pool:documents=list(pool.map(acquire,urls))
lookup={d['url']:d for d in documents}
records=[{**s,**lookup[s['url']],'indexPathMismatch':s['role']=='indexed-segment' and s['ac']!=s['linkedAc']} for s in specs]
manifest={'capturedAt':datetime.now(timezone.utc).isoformat(),'cloudRun':'https://github.com/ethereum007/manipur/actions/runs/'+run,'archiveUrl':'https://github.com/ethereum007/manipur/releases/download/primary-sources-2026-10-19/'+archive,'scope':'Original PDF acquisition and native-text readiness only; no normalized segment vote data, party mapping or model feature approved. Index references and unlisted probes remain separate.','records':records,'documents':documents}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2))
with zipfile.ZipFile(out/archive,'w',zipfile.ZIP_DEFLATED) as z:
 z.write(out/'manifest.json','manifest.json')
 for p in pdfs.glob('*.pdf'):z.write(p,'originals/'+p.name)
print(json.dumps({'references':len(records),'uniqueUrls':len(documents),'opened':sum(d['status']=='pdf-opened' for d in documents),'mismatches':sum(r['indexPathMismatch'] for r in records)}))
