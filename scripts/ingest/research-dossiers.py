from pathlib import Path
import json,hashlib,requests,pymupdf as fitz
root=Path('work-dossiers');root.mkdir(exist_ok=True)
sources=json.loads(Path('data/research/dossier-sources.json').read_text())
manifest=[]
review={'economic-survey-2024-25':[55,57,58,59],'cag-state-finances-2023-24':[13,17],'fiscal-framework-2026-27':[3,4]}
for source in sources:
 try:
  response=requests.get(source['url'],timeout=180);response.raise_for_status()
  payload=response.content
  assert payload.startswith(b'%PDF')
  doc=fitz.open(stream=payload,filetype='pdf')
  pages=[{'page':i+1,'text':page.get_text(sort=True)} for i,page in enumerate(doc)]
  (root/(source['id']+'-pages.json')).write_text(json.dumps(pages,ensure_ascii=False))
  for p in review.get(source['id'],[]):
   doc[p-1].get_pixmap(matrix=fitz.Matrix(1.2,1.2)).save(root/(source['id']+'-p'+str(p)+'.png'))
  manifest.append({**source,'status':'retrieved','sha256':hashlib.sha256(payload).hexdigest(),'pages':len(doc),'textPages':sum(len(p['text'].strip())>100 for p in pages),'method':'Embedded PDF text with selected source-page images for review'})
  print(source['id'],len(doc),'pages')
 except Exception as error:
  manifest.append({**source,'status':'unavailable','error':str(error)})
  print(source['id'],'unavailable',str(error))
 (root/'manifest.json').write_text(json.dumps(manifest,indent=2))
