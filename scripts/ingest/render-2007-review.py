from pathlib import Path
import json,requests,zipfile,io,hashlib,pymupdf
bundle=json.loads(Path('data/processed/assembly-2007-pages.json').read_text());raw=requests.get(bundle['archiveUrl'],timeout=180);raw.raise_for_status();z=zipfile.ZipFile(io.BytesIO(raw.content));out=Path('work-2007-normalization/review');out.mkdir(exist_ok=True)
for ac in [20,57,59]:
 s=next(r for r in bundle['sources'] if r.get('ac')==ac and r['role']=='indexed-form20');b=z.read(s['archiveFile']);assert hashlib.sha256(b).hexdigest()==s['sha256']
 with pymupdf.open(stream=b,filetype='pdf') as doc:
  for i in range(len(doc)):doc[i].get_pixmap(dpi=160).save(out/('ac'+str(ac)+'-p'+str(i+1)+'.png'))
print('Selected original source renders hash-checked')
