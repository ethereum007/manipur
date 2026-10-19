"""Runs only in GitHub Actions. Primary scans stay in a short-lived GitHub artifact."""
from pathlib import Path
import requests,json,concurrent.futures,hashlib,re,subprocess,os
import pymupdf as fitz
ROOT=Path(__file__).resolve().parents[2]
for d in ['raw','processed','geographic']: (ROOT/'data'/d).mkdir(parents=True,exist_ok=True)
from acquire import FILES
session=requests.Session()
def fetch(item):
 name,url=item; p=ROOT/'data/raw'/name
 r=session.get(url,timeout=240);r.raise_for_status(); assert r.content[:4]==b'%PDF'
 p.write_bytes(r.content)
 return {'id':name[:-4],'publisher':'Chief Electoral Officer, Manipur','title':name,'url':url,'accessed':'2026-10-19','sha256':hashlib.sha256(r.content).hexdigest(),'classification':'primary','license':'Original publication rights retained; research transcription'}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: sources=list(pool.map(fetch,FILES.items()))
(ROOT/'data/processed/sources.json').write_text(json.dumps(sources,indent=2))
# Text pages are preserved verbatim, including OCR errors, never silently repaired.
def extract(name):
 d=fitz.open(ROOT/'data/raw'/name); pages=[]
 print(name,'pages',len(d),flush=True)
 for i,p in enumerate(d):
  t=p.get_text(sort=True)
  if len(t.strip())<100:
   pix=p.get_pixmap(dpi=160); img=ROOT/'data/raw'/f'{name}-{i}.png'; pix.save(str(img))
   result=subprocess.run(['tesseract',str(img),'stdout','--psm','3'],capture_output=True,text=True)
   t=result.stdout; img.unlink()
  pages.append({'page':i+1,'text':t})
 (ROOT/'data/processed'/name.replace('.pdf','-pages.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2))
 print(name,'extracted',sum(len(x['text']) for x in pages),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: list(pool.map(extract,FILES))
# Dissolve multipart records by official assembly number. Never render 68 parts as 68 seats.
import shapefile
from shapely.geometry import shape,mapping
from shapely.ops import unary_union
base='https://raw.githubusercontent.com/datameet/maps/master/assembly-constituencies/'
for ext in ['shp','shx','dbf']:
 r=session.get(base+'India_AC.'+ext,timeout=120);r.raise_for_status();(ROOT/'data/raw'/('India_AC.'+ext)).write_bytes(r.content)
reader=shapefile.Reader(str(ROOT/'data/raw/India_AC'));groups={}
for sr in reader.iterShapeRecords():
 p=sr.record.as_dict()
 if p['ST_NAME']=='MANIPUR':
  g=groups.setdefault(p['AC_NO'],{'properties':p,'parts':[]});g['parts'].append(shape(sr.shape.__geo_interface__))
features=[{'type':'Feature','properties':v['properties'],'geometry':mapping(unary_union(v['parts']).simplify(.0007,preserve_topology=True))} for k,v in sorted(groups.items())]
assert len(features)==60
(ROOT/'data/geographic/manipur.json').write_text(json.dumps({'type':'FeatureCollection','features':features},separators=(',',':')))
# Official HTML constituency directory and result links are the identity registry.
from bs4 import BeautifulSoup
u='https://ceomanipur.nic.in/ResultSheets/StateLegislativeAssembly/2022/results'
r=session.get(u,timeout=120);r.raise_for_status()
soup=BeautifulSoup(r.text,'html.parser')
(ROOT/'data/processed/official-result-links.json').write_text(json.dumps([{'name':a.get_text(' ',strip=True),'href':requests.compat.urljoin(u,a.get('href'))} for a in soup.select('a[href]') if '.pdf' in a.get('href','').lower()],indent=2))
print('Research acquisition complete. Geometry:',len(features),flush=True)
