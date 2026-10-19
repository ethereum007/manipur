from pathlib import Path
import json, shapefile
from shapely.geometry import shape, mapping
ROOT=Path(__file__).resolve().parents[2]
r=shapefile.Reader(str(ROOT/'data/geographic/India_AC'))
features=[]
for sr in r.iterShapeRecords():
 p=sr.record.as_dict()
 if any(str(v).lower()=='manipur' for v in p.values()):
  g=shape(sr.shape.__geo_interface__).simplify(.001,preserve_topology=True)
  features.append({'type':'Feature','properties':p,'geometry':mapping(g)})
out={'type':'FeatureCollection','features':features}
(ROOT/'data/geographic/manipur.json').write_text(json.dumps(out,separators=(',',':')))
print('features',len(features),[f['properties'] for f in features[:2]])
