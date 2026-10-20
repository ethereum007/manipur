from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,requests,pymupdf,hashlib
out=Path('work-2014');out.mkdir(exist_ok=True)
m=json.loads(Path('data/research/historical-parliament-sources.json').read_text())
specs=[r for r in m['records'] if r['year']==2014 and (r['role']=='combined-result' or (r['ac'] in [1,29,33,34,60] and not r['indexPathMismatch']))]
def probe(r):
 raw=requests.get(r['url'],timeout=(20,120)).content;assert hashlib.sha256(raw).hexdigest()==r['sha256']
 with pymupdf.open(stream=raw,filetype='pdf') as doc:
  label=('inner' if 'INNER' in r['url'] else 'outer') if r['role']=='combined-result' else str(r['ac'])
  result={**r,'extraction':[{'page':i+1,'text':p.get_text(),'tables':[t.extract() for t in p.find_tables().tables]} for i,p in enumerate(doc)] if r['role']=='combined-result' else []}
  (out/(label+'.json')).write_text(json.dumps(result,indent=2))
  for i in sorted({0,len(doc)-1}):doc[i].get_pixmap(dpi=140).save(out/(label+'-page'+str(i+1)+'.png'))
 return {'label':label,'pages':len(result['extraction'])}
with ThreadPoolExecutor(max_workers=4) as pool:print(list(pool.map(probe,specs)))
