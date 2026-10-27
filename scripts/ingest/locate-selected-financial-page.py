from pathlib import Path
import json,hashlib,requests,pymupdf,subprocess,tempfile,csv,io,re,os
targets=json.loads(Path(os.environ['FINANCIAL_TARGETS']).read_text());out=Path('work-financial-locator');out.mkdir(exist_ok=True);report=[]
pattern=re.compile(r'^(?:liabilit\w*|government|loans?|verification|signature)[.,:;)]?$',re.I)
for t in targets:
 response=requests.get(t['url'],timeout=(20,120));response.raise_for_status();raw=response.content;sha=hashlib.sha256(raw).hexdigest();assert sha==t['expectedSha256']
 with pymupdf.open(stream=raw,filetype='pdf')as doc:
  proposals=[]
  with tempfile.TemporaryDirectory()as tmp:
   for number in t['locatorPages']:
    p=doc[number-1];path=Path(tmp)/'page.png';p.get_pixmap(dpi=150).save(path)
    result=subprocess.run(['tesseract',str(path),'stdout','--psm','3','tsv'],capture_output=True,text=True,check=True).stdout
    words=csv.DictReader(io.StringIO(result),delimiter='\t')
    markers=[{'marker':w['text'],'rect':[float(w['left'])*72/150,float(w['top'])*72/150,(float(w['left'])+float(w['width']))*72/150,(float(w['top'])+float(w['height']))*72/150]}for w in words if pattern.search(w.get('text','').strip())]
    proposals.append({'page':number,'width':p.rect.width,'height':p.rect.height,'markers':markers,'locator':'Selected-page OCR headings only; no financial values approved'})
  report.append({'candidate':t['candidate'],'ac':t['ac'],'url':t['url'],'sha256':sha,'pages':len(doc),'proposals':proposals,'scope':'Fixed-page heading coordinates only; no monetary values, full extracted text or rendered images exported'})
(out/'manifest.json').write_text(json.dumps(report,indent=2));print('Selected page heading location completed; no field values approved')
