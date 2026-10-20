from pathlib import Path
import json,hashlib,requests,pymupdf
m=json.loads(Path('data/research/parliament-segments-2019.json').read_text());r=next(s for s in m['segments'] if s['ac']==45)
raw=requests.get(r['sourceUrl'],timeout=120).content;assert hashlib.sha256(raw).hexdigest()==r['sha256']
out=Path('work-context-review');out.mkdir(exist_ok=True)
with pymupdf.open(stream=raw,filetype='pdf') as doc:
 doc[0].get_pixmap(dpi=140).save(out/'2019-ac45-header.png')
 (out/'provenance.json').write_text(json.dumps({'ac':45,'sourceUrl':r['sourceUrl'],'sha256':r['sha256'],'page':1,'nativeCandidateHeaders':r['candidateHeaders']},indent=2))
