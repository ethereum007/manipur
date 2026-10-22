from pathlib import Path
import json,re,hashlib,requests,pymupdf
out=Path('work-financial-locator');out.mkdir(exist_ok=True);targets=json.loads(Path('data/research/financial-review-targets-batch-three.json').read_text());report=[]
for t in targets:
 response=requests.get(t['url'],timeout=(20,120));response.raise_for_status();raw=response.content;assert hashlib.sha256(raw).hexdigest()==t['expectedSha256'];pages=[]
 with pymupdf.open(stream=raw,filetype='pdf')as doc:
  abstract=[]
  for i,p in enumerate(doc):
   text=p.get_text();
   if re.search(r'abstract',text,re.I):abstract.append(i+1)
  for i,p in enumerate(doc):
   if not any(a<=i+1<=a+2 for a in abstract):continue
   markers=[{'marker':w[4],'rect':list(w[:4])}for w in p.get_text('words')if re.search(r'^(?:move?able|movable|immovable|assets|liabilit\w*|education\w*|occupation\w*|verification|signature)[.,:;)]?$',w[4],re.I)]
   pages.append({'page':i+1,'width':p.rect.width,'height':p.rect.height,'markers':markers})
  report.append({**t,'pages':len(doc),'abstractPages':abstract,'proposals':pages,'scope':'Native headings/coordinates only, no financial values, full PDF text, personal identifiers or rendered images exported. Fixed crops require separate specification.'})
(out/'manifest.json').write_text(json.dumps(report,indent=2));print(json.dumps([{'candidate':r['candidate'],'abstractPages':r['abstractPages']}for r in report]))
