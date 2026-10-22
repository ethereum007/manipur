from pathlib import Path
import json,requests,pymupdf,hashlib,os
spec=json.loads(Path(os.environ.get('FINANCIAL_TARGETS','data/research/financial-review-targets-batch-two.json')).read_text());out=Path('work-financial-review');out.mkdir(exist_ok=True);report=[]
for t in spec:
 response=requests.get(t['url'],timeout=180);response.raise_for_status();raw=response.content;sha=hashlib.sha256(raw).hexdigest();assert sha==t['expectedSha256']
 with pymupdf.open(stream=raw,filetype='pdf') as doc:
  crops=[]
  for c in t['clips']:
   name='ac'+str(t['ac'])+'-'+sha[:12]+'-p'+str(c['page'])+'-financial-selected'+('-'+c['id'] if c.get('id') else '')+'.png';doc[c['page']-1].get_pixmap(dpi=c.get('dpi',170),clip=pymupdf.Rect(c['rect'])).save(out/name);crops.append({**c,'image':name})
  report.append({'ac':t['ac'],'candidate':t['candidate'],'url':t['url'],'sha256':sha,'pages':len(doc),'crops':crops,'scope':'Fixed selected financial regions; no complete-page text, extraction or manual field approval exported'})
(out/'manifest.json').write_text(json.dumps(report,indent=2));print('Two hash-checked selected-region targets rendered')
