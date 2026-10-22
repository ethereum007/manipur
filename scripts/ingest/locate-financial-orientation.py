from pathlib import Path
import json,re,hashlib,requests,pymupdf,csv,io,subprocess,tempfile
from PIL import Image
out=Path('work-financial-orientation');out.mkdir(exist_ok=True)
t=json.loads(Path('data/research/financial-review-targets-batch-four.json').read_text())[0]
r=requests.get(t['url'],timeout=(30,120));r.raise_for_status();raw=r.content;assert hashlib.sha256(raw).hexdigest()==t['expectedSha256']
marker=re.compile(r'^(?:move?able|movable|immovable|assets|liabilit\w*|education\w*|occupation\w*|verification|signature)[.,:;)]?$',re.I)
report={'candidate':t['candidate'],'sha256':t['expectedSha256'],'scope':'Rotation-aware OCR heading coordinates only. No values or full-page images exported.','proposals':[],'attemptedRotations':[]}
with pymupdf.open(stream=raw,filetype='pdf')as doc,tempfile.TemporaryDirectory()as tmp:
 for angle in (90,270):
  report['attemptedRotations'].append(angle);abstract=None
  for i,p in enumerate(doc):
   pix=p.get_pixmap(dpi=110);im=Image.open(io.BytesIO(pix.tobytes('png'))).rotate(angle,expand=True);path=Path(tmp)/'rotated.png';im.save(path)
   result=subprocess.run(['tesseract',str(path),'stdout','--psm','3','tsv'],capture_output=True,text=True,check=True).stdout
   words=[w for w in csv.DictReader(io.StringIO(result),delimiter='\t')if w.get('text','').strip()]
   if any(re.search(r'abstr',w['text'],re.I)for w in words):abstract=i+1
   if abstract is not None and abstract<=i+1<=abstract+2:
    markers=[{'marker':w['text'],'rect':[float(w['left'])*72/110,float(w['top'])*72/110,(float(w['left'])+float(w['width']))*72/110,(float(w['top'])+float(w['height']))*72/110]}for w in words if marker.search(w['text'])]
    report['proposals'].append({'page':i+1,'rotation':angle,'viewWidth':im.width*72/110,'viewHeight':im.height*72/110,'markers':markers})
   if abstract is not None and i+1>=abstract+2:break
  if report['proposals']:break
(out/'manifest.json').write_text(json.dumps(report,indent=2));print(json.dumps({'located':len(report['proposals']),'rotations':report['attemptedRotations']}))
