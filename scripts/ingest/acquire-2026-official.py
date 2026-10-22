from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,requests,pymupdf,os
out=Path('work-2026-official');out.mkdir(exist_ok=True)
sources=[('sir-final-2026','https://ceomanipur.nic.in/Documents/PressNote/2026-2027/PRESS%20NOTE%20SIR%20FINAL%20EROLL%202026.pdf'),('ro-aro-2026','https://ceomanipur.nic.in/Documents/gazette/2026/RO%20ARO%20Gazette-2026-240_EG_2026-27_15-10-2026.pdf')]
records=[]
for ident,url in sources:
 record={'id':ident,'url':url,'capturedAt':datetime.now(timezone.utc).isoformat(),'attempts':[]}
 for attempt in range(2):
  try:
   response=requests.get(url,timeout=(20,90));response.raise_for_status();raw=response.content
   with pymupdf.open(stream=raw,filetype='pdf') as doc:
    if len(doc)>30:raise ValueError('Unexpected large document: requires separate review scope')
    (out/(ident+'.pdf')).write_bytes(raw)
    pages=[]
    for i,page in enumerate(doc):
     page.get_pixmap(dpi=130).save(out/(ident+'-p'+str(i+1)+'.png'));pages.append({'page':i+1,'nativeText':page.get_text()})
    record.update(status='retrieved',httpStatus=response.status_code,sha256=hashlib.sha256(raw).hexdigest(),bytes=len(raw),pages=len(doc),nativePages=sum(bool(p['nativeText'].strip())for p in pages),selectedForVisualReview=list(range(1,len(doc)+1)))
    (out/(ident+'-native-pages.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
   break
  except Exception as exc:record['attempts'].append({'attempt':attempt+1,'errorType':type(exc).__name__,'message':str(exc)[:250]})
 else:record['status']='unavailable-after-two-attempts'
 records.append(record)
manifest={'createdAt':datetime.now(timezone.utc).isoformat(),'cloudRun':'https://github.com/ethereum007/manipur/actions/runs/'+os.environ['GITHUB_RUN_ID'],'scope':'Two bounded official administrative/aggregate PDF acquisitions. Native text and renders are review preparation, not verified derived data. No personal electoral-roll records acquired.','records':records}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2));print(json.dumps(manifest))
