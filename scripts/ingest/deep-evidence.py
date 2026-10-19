"""Acquire individual official Form 20s without altering the published dataset."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
from urllib.parse import urljoin,urlparse
import requests,json,re,hashlib,time,pymupdf as fitz
from bs4 import BeautifulSoup
ROOT=Path('work-evidence');ROOT.mkdir(exist_ok=True)
indexes={2012:'https://ceomanipur.nic.in/Archive/ResultSheets/SLAResult2012.html',2017:'https://ceomanipur.nic.in/ResultSheets/SLAResult2017.html',2022:'https://ceomanipur.nic.in/ResultSheets/StateLegislativeAssembly/2022/results',2024:'https://ceomanipur.nic.in/ResultSheets/LokSabhaElection/ge2024resultsheet'}
tasks=[]
for year,url in indexes.items():
 r=requests.get(url,timeout=90);r.raise_for_status()
 for a in BeautifulSoup(r.text,'html.parser').find_all('a',href=True):
  href=urljoin(url,a['href'])
  if not re.search(r'\.pdf(?:$|\?)',href,re.I):continue
  td=a.find_parent('td');prev=td.find_previous_sibling('td') if td else None
  match=re.search(r'\d+',prev.get_text()) if prev else None
  ac=int(match[0]) if match else None
  if ac is None:
   m=re.search(r'(?:ac_no|/)(\d{1,2})(?:_|\.pdf)',href,re.I)
   if m:ac=int(m[1])
  if ac and 1<=ac<=60:tasks.append((year,ac,a.get_text(' ',strip=True),href))
tasks=list({(t[0],t[1]):t for t in tasks}.values())
def acquire(t):
 year,ac,name,url=t;folder=ROOT/str(year);folder.mkdir(exist_ok=True)
 try:
  for attempt in range(3):
   try:
    r=requests.get(url,timeout=90);r.raise_for_status();payload=r.content;assert payload.startswith(b'%PDF');break
   except Exception:
    if attempt==2:raise
    time.sleep(2)
  (folder/(str(ac)+'.pdf')).write_bytes(payload)
  doc=fitz.open(stream=payload,filetype='pdf');pages=[]
  for i,p in enumerate(doc):
   lines=[]
   for block in p.get_text('dict')['blocks']:
    for line in block.get('lines',[]):
     text=''.join(s['text'] for s in line['spans'])
     lines.append({'bbox':[round(x,2) for x in line['bbox']],'dir':line['dir'],'text':text})
   pages.append({'page':i+1,'width':p.rect.width,'height':p.rect.height,'text':p.get_text(),'sorted':p.get_text(sort=True),'lines':lines})
  return {'year':year,'ac':ac,'name':name,'url':url,'sha256':hashlib.sha256(payload).hexdigest(),'bytes':len(payload),'status':'retrieved','pages':pages}
 except Exception as e:return {'year':year,'ac':ac,'name':name,'url':url,'status':'failed','error':str(e)}
results=[]
with ThreadPoolExecutor(max_workers=4) as pool:
 for f in as_completed([pool.submit(acquire,t) for t in tasks]):
  results.append(f.result())
  if len(results)%20==0:print('Acquired',len(results),'/',len(tasks),flush=True)
for year in indexes:
 rows=sorted([r for r in results if r['year']==year],key=lambda r:r['ac'])
 (ROOT/(str(year)+'-extracts.json')).write_text(json.dumps(rows,ensure_ascii=False))
manifest=[{k:v for k,v in r.items() if k!='pages'}|{'pdfPages':len(r.get('pages',[]))} for r in results]
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2))
print({y:sum(r['year']==y and r['status']=='retrieved' for r in results) for y in indexes},flush=True)
