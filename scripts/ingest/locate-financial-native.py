from pathlib import Path
import json,re,hashlib,requests,pymupdf,csv,io,subprocess,tempfile,os
out=Path('work-financial-locator');out.mkdir(exist_ok=True)
targets=json.loads(Path(os.environ.get('FINANCIAL_TARGETS','data/research/financial-review-targets-batch-three.json')).read_text());report=[]
marker_pattern=re.compile(r'^(?:move?able|movable|immovable|assets|liabilit\w*|education\w*|occupation\w*|verification|signature)[.,:;)]?$',re.I)
for t in targets:
 if t.get('skipLocator'):
  report.append({**t,'scope':'Previously documented location deferral; not retried or field-reviewed in this run'});continue
 response=requests.get(t['url'],timeout=(20,120));response.raise_for_status();raw=response.content;assert hashlib.sha256(raw).hexdigest()==t['expectedSha256']
 with pymupdf.open(stream=raw,filetype='pdf')as doc:
  abstract=[i+1 for i,p in enumerate(doc)if re.search(r'abstract',p.get_text(),re.I)]
  proposals=[]
  if abstract:
   for i,p in enumerate(doc):
    if any(a<=i+1<=a+2 for a in abstract):
     markers=[{'marker':w[4],'rect':list(w[:4])}for w in p.get_text('words')if marker_pattern.search(w[4])]
     proposals.append({'page':i+1,'width':p.rect.width,'height':p.rect.height,'markers':markers,'locator':'native heading coordinates only'})
  else:
   candidates=[]
   with tempfile.TemporaryDirectory()as tmp:
    for i,p in enumerate(doc):
     path=Path(tmp)/'page.png';p.get_pixmap(dpi=130).save(path)
     result=subprocess.run(['tesseract',str(path),'stdout','--psm','3','tsv'],capture_output=True,text=True,check=True).stdout
     words=[w for w in csv.DictReader(io.StringIO(result),delimiter='\t')if w.get('text','').strip()]
     if any(re.search(r'abstract',w['text'],re.I)for w in words):abstract.append(i+1)
     markers=[{'marker':w['text'],'rect':[float(w['left'])*72/130,float(w['top'])*72/130,(float(w['left'])+float(w['width']))*72/130,(float(w['top'])+float(w['height']))*72/130]}for w in words if marker_pattern.search(w['text'])]
     candidates.append({'page':i+1,'width':p.rect.width,'height':p.rect.height,'markers':markers,'locator':'OCR headings only, not verified values'})
   proposals=[p for p in candidates if any(a<=p['page']<=a+2 for a in abstract)] if abstract else [p for p in candidates[-8:] if p['markers']]
  report.append({**t,'pages':len(doc),'abstractPages':abstract,'proposals':proposals,'scope':'Headings and coordinates only. No financial values, full-page text, personal identifiers or rendered images exported. Fixed crops require separate specification.'})
(out/'manifest.json').write_text(json.dumps(report,indent=2));print(json.dumps([{'candidate':r['candidate'],'abstractPages':r['abstractPages']}for r in report]))
