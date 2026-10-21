from pathlib import Path
import csv, hashlib, io, json, re, subprocess, tempfile, os
import requests, pymupdf

targets=json.loads(Path(os.environ.get('FINANCIAL_TARGETS','data/research/financial-review-targets.json')).read_text())
out=Path('work-financial-review');out.mkdir(exist_ok=True)
report=[]
for target in targets:
 response=requests.get(target['url'],timeout=180);response.raise_for_status();raw=response.content
 sha=hashlib.sha256(raw).hexdigest()
 if target.get('expectedSha256') and sha!=target['expectedSha256']:raise ValueError('Source hash changed: '+target['candidate'])
 doc=pymupdf.open(stream=raw,filetype='pdf')
 pages=[]
 with tempfile.TemporaryDirectory() as tmp:
  for i,page in enumerate(doc):
   image=Path(tmp)/'page.png';page.get_pixmap(dpi=130).save(image)
   tsv=subprocess.run(['tesseract',str(image),'stdout','--psm','3','tsv'],capture_output=True,text=True,check=True).stdout
   words=[w for w in csv.DictReader(io.StringIO(tsv),delimiter='\t') if w.get('text','').strip()]
   text=' '.join(w['text'] for w in words)
   pages.append({'page':i+1,'abstract':bool(re.search(r'abstract',text,re.I)),'assets':bool(re.search(r'assets',text,re.I)),'liabilities':bool(re.search(r'liabilit',text,re.I)),'words':words})
  abstract=[p['page'] for p in pages if p['abstract']]
  crops=[]
  for p in pages:
   if not any(a<=p['page']<=a+2 for a in abstract):continue
   assetwords=[w for w in p['words'] if re.search(r'^assets[.:,]?$',w['text'],re.I)]
   if not assetwords:continue
   top=min(int(w['top']) for w in assetwords)-20
   # Summary finance rows only: stop before education/occupation/signature headings.
   stops=[int(w['top']) for w in p['words'] if int(w['top'])>top+40 and re.search(r'education|occupation|verification|signature',w['text'],re.I)]
   page=doc[p['page']-1];scale=130/72
   bottom=min(stops)-8 if stops else page.rect.height*scale*.83
   if bottom<=top+30:continue
   name='ac'+str(target['ac'])+'-'+sha[:12]+'-p'+str(p['page'])+'-financial-summary.png'
   clip=pymupdf.Rect(0,max(0,top/scale),page.rect.width,min(page.rect.height,bottom/scale))
   page.get_pixmap(dpi=150,clip=clip).save(out/name)
   crops.append({'page':p['page'],'image':name,'cropPoints':list(clip)})
  report.append({**target,'sha256':hashlib.sha256(raw).hexdigest(),'pages':len(doc),'abstractPages':abstract,'pageFlags':[{k:v for k,v in p.items() if k!='words'} for p in pages],'crops':crops,'status':'unreviewed visual candidates; no field values exported'})
 print('AC',target['ac'],'summary candidates',len(crops),flush=True)
(out/'manifest.json').write_text(json.dumps(report,indent=2))
