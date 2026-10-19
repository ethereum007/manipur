"""Acquire immutable primary election reports and documented reference geography."""
from pathlib import Path
import concurrent.futures, hashlib, json, requests
ROOT = Path(__file__).resolve().parents[2]
BASE = 'https://ceomanipur.nic.in/'
FILES = {
 'assembly-2012.pdf': BASE+'StatisticalReport/AssemblyElection/statistical_report_2012.pdf',
 'assembly-2017.pdf': BASE+'StatisticalReport/AssemblyElection/statistical_report_2017.pdf',
 'assembly-2022.pdf': BASE+'StatisticalReport/AssemblyElection/Statistical%20Report%202022.pdf',
 'parliament-2024.pdf': BASE+'StatisticalReport/LokSabhaElection/SR_lok_Sabha_2024.pdf',
 'biren-affidavit-2022.pdf': BASE+'Affidavits/AssemblyElection/2022/2/NONGTHOMBAM%20BIREN%20SINGH.pdf',
}
def fetch(item):
 name, url = item
 p = ROOT/'data/raw'/name
 if not p.exists():
  r=requests.get(url,timeout=150); r.raise_for_status()
  assert r.content[:4]==b'%PDF', name
  p.write_bytes(r.content)
 print(name,p.stat().st_size,flush=True)
 return {'id':name.removesuffix('.pdf'),'publisher':'Chief Electoral Officer, Manipur','url':url,'file':str(p.relative_to(ROOT)).replace('\\','/'),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'accessed':'2026-10-19','classification':'primary','license':'Public research source; original publication rights retained'}
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: sources=list(pool.map(fetch,FILES.items()))
 (ROOT/'data/processed/sources.json').write_text(json.dumps(sources,indent=2))
 import fitz
 for name in FILES:
  doc=fitz.open(ROOT/'data/raw'/name)
  (ROOT/'data/raw'/name.replace('.pdf','.txt')).write_text('\n'.join(f'\n--- PAGE {i+1} ---\n'+p.get_text(sort=True) for i,p in enumerate(doc)),encoding='utf-8')
 print('Extracted source text',flush=True)
