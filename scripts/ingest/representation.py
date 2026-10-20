"""Acquire a review-only representation snapshot. Never copy addresses or contacts."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import requests,json,hashlib,re,datetime
from bs4 import BeautifulSoup
url='https://assembly.mn.gov.in/members'
response=requests.get(url,timeout=60);response.raise_for_status()
soup=BeautifulSoup(response.text,'html.parser')
cards=soup.select('a.box-member')
assert len(cards)==60
def clean(s):return re.sub(r'\s+',' ',s).strip()
def acquire(card):
 href='https://assembly.mn.gov.in'+card['href']
 p=requests.get(href,timeout=60);p.raise_for_status()
 profile=BeautifulSoup(p.text,'html.parser')
 fields={}
 for item in profile.select('.bu-item'):
  label=item.select_one('.bu-label');value=item.select_one('.bu-value')
  if label and value and label.get_text(strip=True) in ['Constituency','Political Party','Educational Qualification','Position Held']:
   fields[label.get_text(strip=True)]=clean(value.get_text(' ',strip=True))
 ac=int(re.search(r'A/C:\s*(\d+)',card.get_text(' ',strip=True))[1])
 image=card.select_one('img');name=image.get('alt','Vacant') if image else 'Vacant'
 data={'ac':ac,'name':name,'profileUrl':href,'sourceConstituency':fields.get('Constituency'),'partyName':fields.get('Political Party'),'education':fields.get('Educational Qualification'),'officeHistory':fields.get('Position Held'),'effectiveDate':None}
 assert int(re.match(r'\d+',data['sourceConstituency'])[0])==ac
 payload=json.dumps({'ac':data['ac'],'name':data['name'],'party':data['partyName'],'education':data['education'],'officeHistory':data['officeHistory']},ensure_ascii=False,separators=(',',':'))
 return data|{'sourceExtractSha256':hashlib.sha256(payload.encode()).hexdigest()}
with ThreadPoolExecutor(max_workers=4) as pool:records=list(pool.map(acquire,cards))
assert len({r['ac'] for r in records})==60
root=Path('work-representation');root.mkdir(exist_ok=True)
(root/'snapshot.json').write_text(json.dumps({'capturedAt':datetime.date.today().isoformat(),'sourceUrl':url,'scope':'Review-only source observation, not live membership certification','records':sorted(records,key=lambda r:r['ac'])},ensure_ascii=False,indent=2))
print('Captured 60 public institutional records for review; no automatic publication.')
