from pathlib import Path
import json,requests,pymupdf
out=Path('work-2019');out.mkdir(exist_ok=True)
m=json.loads(Path('data/research/historical-parliament-sources.json').read_text())
r=next(r for r in m['records'] if r['year']==2019 and r['ac']==1)
d=pymupdf.open(stream=requests.get(r['url'],timeout=120).content,filetype='pdf')
for i,p in enumerate(d):
 print('PAGE',i+1,p.get_text()[:1300]);print('TABLES',json.dumps([t.extract() for t in p.find_tables().tables]))
