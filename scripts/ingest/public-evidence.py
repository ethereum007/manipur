"""Read public policy evidence and render selected original pages in GitHub only."""
from pathlib import Path
import json,hashlib,requests,pymupdf as fitz
from bs4 import BeautifulSoup
root=Path('work-public-evidence');root.mkdir(exist_ok=True)
sources=json.loads(Path('data/research/public-evidence-sources.json').read_text())
manifest=[]
for s in sources:
 try:
  r=requests.get(s['url'],timeout=90);r.raise_for_status()
  sha=hashlib.sha256(r.content).hexdigest()
  if s['kind']=='pdf':
   assert r.content.startswith(b'%PDF')
   (root/(s['id']+'.pdf')).write_bytes(r.content)
   doc=fitz.open(stream=r.content,filetype='pdf')
   pages=[{'page':i+1,'text':p.get_text()} for i,p in enumerate(doc)]
   (root/(s['id']+'-text.json')).write_text(json.dumps(pages,ensure_ascii=False))
   for n in s['pages']:
    doc[n-1].get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(root/(s['id']+'-p'+str(n)+'.png'))
  else:
   soup=BeautifulSoup(r.text,'html.parser')
   for tag in soup(['script','style']):tag.decompose()
   (root/(s['id']+'-text.txt')).write_text(soup.get_text(' ',strip=True))
  manifest.append({**s,'sha256':sha,'bytes':len(r.content),'status':'retrieved'})
 except Exception as e:manifest.append({**s,'status':'failed','error':str(e)})
(root/'manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest,indent=2))
if any(r['status']=='failed' for r in manifest):raise SystemExit('Source acquisition incomplete')
