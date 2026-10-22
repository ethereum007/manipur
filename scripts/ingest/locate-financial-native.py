from pathlib import Path
import json,re,hashlib,requests,pymupdf,csv,io,subprocess,tempfile
out=Path('work-financial-locator');out.mkdir(exist_ok=True);targets=json.loads(Path('data/research/financial-review-targets-batch-three.json').read_text());report=[]
for t in targets:
 response=requests.get(t['url'],timeout=(20,120));response.raise_for_status();raw=response.content;assert hashlib.sha256(raw).hexdigest()==t['expectedSha256'];pages=[]
 with pymupdf.open(stream=raw,filetype='pdf')as doc:
  abstract=[]
  for i,p in enumerate(doc):
   text=p.get_text();
   if re.search(r'abstract',text,re.I):abstract.append(i+1)
  native_abstract=bool(abstract)
  if not abstract:
   with tempfile.TemporaryDirectory()as tmp:
    candidates=[]
    for i,p in enumerate(doc):
     path=Path(tmp)/'page.png';p.get_pixmap(dpi=130).save(path)
     result=subprocess.run(['tesseract',str(path),'stdout','--psm','3','tsv'],capture_output=True,text=True,check=True).stdout
     words=[w for w in csv.DictReader(io.StringIO(result),delimiter='\t')if w.get('text','').strip()]
     if any(re.search(r'abstract',w['text'],re.I)for w in words):abstract.append(i+1)
     markers=[{'marker':w['text'],'rect':[float(w['left'])*72/130,float(w['top'])*72/130,(float(w['left'])+float(w['width']))*72/130,(float(w['top'])+float(w['height']))*72/130]}for w in words if re.search(r'^(?:move?able|movable|immovable|assets|liabilit\w*|education\w*|occupation\w*|verification|signature)[.,:;)]?
   markers=[{'marker':w[4],'rect':list(w[:4])}for w in p.get_text('words')if re.search(r'^(?:move?able|movable|immovable|assets|liabilit\w*|education\w*|occupation\w*|verification|signature)[.,:;)]?$',w[4],re.I)]
   pages.append({'page':i+1,'width':p.rect.width,'height':p.rect.height,'markers':markers})
  report.append({**t,'pages':len(doc),'abstractPages':abstract,'proposals':pages,'scope':'Native headings/coordinates only, no financial values, full PDF text, personal identifiers or rendered images exported. Fixed crops require separate specification.'})
(out/'manifest.json').write_text(json.dumps(report,indent=2));print(json.dumps([{'candidate':r['candidate'],'abstractPages':r['abstractPages']}for r in report]))
,w['text'],re.I)]
     candidates.append({'page':i+1,'width':p.rect.width,'height':p.rect.height,'markers':markers,'locator':'OCR headings only; not verified values'})
    pages=[p for p in candidates if any(a<=p['page']<=a+2 for a in abstract)]
  for i,p in enumerate(doc):
   if not native_abstract:break
   if not any(a<=i+1<=a+2 for a in abstract):continue
   markers=[{'marker':w[4],'rect':list(w[:4])}for w in p.get_text('words')if re.search(r'^(?:move?able|movable|immovable|assets|liabilit\w*|education\w*|occupation\w*|verification|signature)[.,:;)]?$',w[4],re.I)]
   pages.append({'page':i+1,'width':p.rect.width,'height':p.rect.height,'markers':markers})
  report.append({**t,'pages':len(doc),'abstractPages':abstract,'proposals':pages,'scope':'Native headings/coordinates only, no financial values, full PDF text, personal identifiers or rendered images exported. Fixed crops require separate specification.'})
(out/'manifest.json').write_text(json.dumps(report,indent=2));print(json.dumps([{'candidate':r['candidate'],'abstractPages':r['abstractPages']}for r in report]))
