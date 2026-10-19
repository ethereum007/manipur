"""Fetch only documented public reference assets, in the GitHub runner."""
from pathlib import Path
import requests,json,shapefile
from shapely.geometry import shape,mapping
from shapely.ops import unary_union
root=Path(__file__).resolve().parents[1];p=root/'public';(p/'data').mkdir(parents=True,exist_ok=True);(p/'fonts').mkdir(exist_ok=True)
def get(url,target):
 r=requests.get(url,timeout=180);r.raise_for_status();target.write_bytes(r.content)
geo=root/'data/geographic/manipur.json'
if not geo.exists():
 temp=root/'data/raw';temp.mkdir(parents=True,exist_ok=True)
 base='https://raw.githubusercontent.com/datameet/maps/master/assembly-constituencies/India_AC.'
 for ext in ['shp','shx','dbf']:get(base+ext,temp/('India_AC.'+ext))
 r=shapefile.Reader(str(temp/'India_AC'));groups={}
 for sr in r.iterShapeRecords():
  x=sr.record.as_dict()
  if x['ST_NAME']=='MANIPUR':
   v=groups.setdefault(x['AC_NO'],{'properties':x,'parts':[]});v['parts'].append(shape(sr.shape.__geo_interface__))
 features=[{'type':'Feature','properties':v['properties'],'geometry':mapping(unary_union(v['parts']).simplify(.0007,preserve_topology=True))} for k,v in sorted(groups.items())]
 assert len(features)==60
 data={'type':'FeatureCollection','features':features}
else:data=json.loads(geo.read_text())
(p/'data/manipur.json').write_text(json.dumps(data,separators=(',',':')))
get('https://cdn.jsdelivr.net/fontsource/fonts/source-sans-3:vf@latest/latin-wght-normal.woff2',p/'fonts/sans.woff2')
get('https://cdn.jsdelivr.net/fontsource/fonts/libre-caslon-display@latest/latin-400-normal.woff2',p/'fonts/serif.woff2')
url='https://server.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer/export?bbox=92.7,23.5,95,26.4&bboxSR=4326&imageSR=4326&size=1200,1500&format=jpg&f=image'
get(url,p/'terrain.jpg')
# Preserve exact asset attribution with the build.
(p/'asset-sources.json').write_text(json.dumps({'terrain':{'url':url,'publisher':'Esri World Shaded Relief','attribution':'Esri, USGS, NOAA','purpose':'Geographic relief context, not an election boundary survey'},'geography':{'url':'https://github.com/datameet/maps/tree/master/assembly-constituencies','license':'CC BY 2.5 India','limitations':'Publisher marks Manipur as pre-delimitation and warns of positional shifts. Multipart features dissolved by AC_NO.'},'fonts':'Source Sans 3 and Libre Caslon Display, SIL Open Font License'},indent=2))
print('Prepared',len(data['features']),'reference constituencies and attributed relief')

# Publish lightweight public exports with source provenance, never raw private identifiers.
import csv,io
records=json.loads((root/'data/processed/results.json').read_text())
sources=json.loads((root/'data/processed/sources.json').read_text())
(p/'data/results.json').write_text(json.dumps({'reference':'Assembly elections 2012/2017/2022','license':'Research transcription; original publication rights retained','sources':sources,'records':records},ensure_ascii=False,indent=2))
columns=['year','ac','name','candidate','party','votes','rank','source','sourcePage']
f=io.StringIO();writer=csv.DictWriter(f,fieldnames=columns,extrasaction='ignore');writer.writeheader();writer.writerows(records)
(p/'data/results.csv').write_text(f.getvalue(),encoding='utf-8')

for filename in ['winners.json','parliament-2024.json','candidate-register.json']:
 (p/'data'/filename).write_text((root/'data/processed'/filename).read_text(),encoding='utf-8')
