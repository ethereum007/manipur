from pathlib import Path
from datetime import datetime,timezone
from html.parser import HTMLParser
import json,hashlib,os,zipfile,requests,pymupdf
class TextBlocks(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in ['script','style']:self.skip+=1
  elif tag in ['p','tr','h1','h2','h3','br','div','li']:self.parts.append('\n')
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.skip=max(0,self.skip-1)
  elif tag in ['p','tr','h1','h2','h3','div','li']:self.parts.append('\n')
 def handle_data(self,data):
  if not self.skip:self.parts.append(data)
root=Path('work-continuity');originals=root/'originals';review=root/'review';originals.mkdir(parents=True,exist_ok=True);review.mkdir(exist_ok=True)
spec=json.loads(Path('data/research/boundary-continuity-source-index.json').read_text());records=[];selected=[]
for s in spec['documents']:
 r={**s,'capturedAt':datetime.now(timezone.utc).isoformat()}
 try:
  response=requests.get(s['url'],timeout=(20,150));r.update({'httpStatus':response.status_code,'finalUrl':response.url})
  if response.status_code!=200:r['status']='unavailable';records.append(r);continue
  raw=response.content;r.update({'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw)})
  if s['kind']=='pdf':
   if not raw.lstrip().startswith(b'%PDF-'):raise ValueError('Response is not a PDF')
   filename=s['id']+'.pdf';(originals/filename).write_bytes(raw)
   with pymupdf.open(stream=raw,filetype='pdf') as doc:
    hits=[i for i,p in enumerate(doc) if 'manipur' in p.get_text().lower() and ('delimitation' in p.get_text().lower() or '1976' in p.get_text())]
    r.update({'status':'pdf-opened','pages':len(doc),'selectedPages':[i+1 for i in hits]})
    for i in hits:
     selected.append({'id':s['id'],'page':i+1,'text':doc[i].get_text()})
     doc[i].get_pixmap(dpi=130).save(review/(s['id']+'-p'+str(i+1)+'.png'))
  else:
   if b'<html' not in raw.lower() and b'<!doctype' not in raw.lower():raise ValueError('Response is not HTML')
   filename=s['id']+'.html';(originals/filename).write_bytes(raw);parser=TextBlocks();parser.feed(response.text)
   lines=[' '.join(line.split()) for line in ''.join(parser.parts).splitlines()];lines=[line for line in lines if line]
   hits=[i for i,t in enumerate(lines) if 'delimit' in t.lower() or 'manipur' in t.lower() or 'March, 2009' in t]
   positions=sorted({j for i in hits for j in range(max(0,i-1),min(len(lines),i+2))})
   selected.append({'id':s['id'],'textBlocks':[{'block':i+1,'text':lines[i]} for i in positions]});r.update({'status':'html-opened','textBlocks':len(lines),'selectedBlocks':len(positions)})
  r['archiveFile']='originals/'+filename
 except Exception as exc:r.update({'status':'acquisition-error','error':type(exc).__name__+': '+str(exc)})
 records.append(r)
run=os.environ['GITHUB_RUN_ID'];archive='boundary-continuity-run-'+run+'.zip';manifest={'capturedAt':datetime.now(timezone.utc).isoformat(),'scope':spec['scope'],'cloudRun':'https://github.com/ethereum007/manipur/actions/runs/'+run,'archiveUrl':'https://github.com/ethereum007/manipur/releases/download/primary-sources-2026-10-19/'+archive,'records':records,'additionalBenchmarkApproved':False,'geographicCompatibilityApproved':False}
(root/'manifest.json').write_text(json.dumps(manifest,indent=2));(root/'selected-source-text.json').write_text(json.dumps(selected,indent=2))
with zipfile.ZipFile(root/archive,'w',zipfile.ZIP_DEFLATED) as z:
 z.write(root/'manifest.json','manifest.json')
 for p in originals.iterdir():z.write(p,'originals/'+p.name)
print(json.dumps(manifest))
