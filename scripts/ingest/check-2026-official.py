from pathlib import Path
import hashlib,json,re,requests,pymupdf
r=json.loads(Path('data/research/election-administration-2026.json').read_text())
compact=lambda s:re.sub(r'\s+','',s)
for source in r['sources']:
 response=requests.get(source['archiveUrl'],timeout=(20,90));response.raise_for_status();raw=response.content
 assert hashlib.sha256(raw).hexdigest()==source['sha256'],'Archived original hash drift'
 with pymupdf.open(stream=raw,filetype='pdf')as doc:
  assert len(doc)==source['pages']
  if source['id']=='ro-aro-2026':
   for page in (2,3):
    text=compact(doc[page-1].get_text());rows=[x for x in r['administration']['records']if x['sourcePage']==page]
    positions=[]
    for row in rows:
     marker=str(row['ac'])+'-'+compact(row['sourceLabel']);start=text.index(marker);positions.append((row,start+len(marker)))
    for i,(row,start)in enumerate(positions):
     if i+1<len(positions):
      following=rows[i+1];end=text.index(str(following['ac'])+'-'+compact(following['sourceLabel']),start)
     else:
      endings=[text.find(token,start)for token in ('ByOrder','ID-DPS')];end=min(p for p in endings if p>=0)
     observed=text[start:end];expected=compact(row['returningOfficerOffice']);assert observed==expected,(row['ac'],observed,expected)
print('Both archived PDF hashes and page counts verified; all sixty reviewed RO office transcriptions match source-native cells. Scanned SIR values remain visual transcriptions, not OCR validation.')
