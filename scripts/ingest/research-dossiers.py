from pathlib import Path
import json,hashlib,requests,pymupdf as fitz
root=Path('work-dossiers');root.mkdir(exist_ok=True)
sources=json.loads(Path('data/research/dossier-sources.json').read_text())
manifest=[]
for source in sources:
 response=requests.get(source['url'],timeout=180);response.raise_for_status();payload=response.content;assert payload.startswith(b'%PDF');doc=fitz.open(stream=payload,filetype='pdf');pages=[{'page':i+1,'text':page.get_text(sort=True)} for i,page in enumerate(doc)];(root/(source['id']+'-pages.json')).write_text(json.dumps(pages,ensure_ascii=False));manifest.append({**source,'sha256':hashlib.sha256(payload).hexdigest(),'pages':len(doc),'textPages':sum(len(p['text'].strip())>100 for p in pages),'method':'Embedded PDF text; unreviewed until cited tables are reconciled'});print(source['id'],len(doc),'pages')
(root/'manifest.json').write_text(json.dumps(manifest,indent=2))
