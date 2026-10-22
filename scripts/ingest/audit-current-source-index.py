import datetime,hashlib,json,re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
import requests
class IndexParser(HTMLParser):
 def __init__(self):
  super().__init__();self.parts=[];self.headings=[];self.links=[];self.in_heading=None;self.heading=[];self.href=None;self.anchor=[];self.skip=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ('script','style'):self.skip+=1
  if tag in ('h1','h2','h3','h4'):self.in_heading=tag;self.heading=[]
  if tag=='a':self.href=a.get('href');self.anchor=[]
 def handle_endtag(self,tag):
  if tag in ('script','style') and self.skip:self.skip-=1
  if tag==self.in_heading:
   self.headings.append(' '.join(' '.join(self.heading).split()));self.in_heading=None
  if tag=='a' and self.href is not None:
   self.links.append({'text':' '.join(' '.join(self.anchor).split()),'href':self.href});self.href=None
 def handle_data(self,data):
  if self.skip:return
  self.parts.append(data)
  if self.in_heading:self.heading.append(data)
  if self.href is not None:self.anchor.append(data)
urls=[('candidate-index','https://ceomanipur.nic.in/candidates'),('party-position','https://assembly.mn.gov.in/members/party-position'),('ceo-notifications','https://ceomanipur.nic.in/')]
records=[]
for ident,url in urls:
 record={'id':ident,'url':url,'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Bounded official index observation, not a comprehensive nomination/alliance search or certified current membership'}
 try:
  r=requests.get(url,timeout=40,headers={'User-Agent':'MandateTerrain-source-audit/1.0'});r.raise_for_status();parser=IndexParser();parser.feed(r.text);text=' '.join(' '.join(parser.parts).split())
  record.update(status=r.status_code,finalUrl=r.url,sha256=hashlib.sha256(r.content).hexdigest(),bytes=len(r.content),headings=parser.headings)
  if ident=='party-position':
   match=re.search(r'As on\s+\d{1,2}\s+[A-Za-z]+,?\s+20\d{2}',text,re.I);record['printedAsOf']=match.group(0) if match else None
   match=re.search(r'Website last updated on:\s*\d{1,2}\s+[A-Za-z]+,?\s+20\d{2}',text,re.I);record['siteUpdatedText']=match.group(0) if match else None
  selected=[x for x in parser.links if re.search(r'2027|nomination|candidate information|contesting candidates|240 dated 15 October 2026|SIR.*2026',x['text'],re.I)]
  record['selectedIndexLinks']=[{'label':x['text'],'url':urljoin(r.url,x['href'])} for x in selected[:30]]
  record['linkSelectionRule']='First 30 anchors matching 2027, nomination, candidate-information/contesting-candidates, selected October-2026 Gazette title or SIR-2026 labels; links are leads, not reviewed underlying documents.'
  record['rawHtmlRetained']=False
 except Exception as exc:record.update(status='unavailable',errorType=type(exc).__name__)
 records.append(record)
output={'schemaVersion':1,'reviewedAt':'2026-10-22','kind':'Bounded official-index capture; selected headings and links only','limits':['Full HTML hashed in the cloud but not exported or retained; no personal contact fields extracted.','Capture date is not event, effective or original publication date.','An absent indexed item is not proof that no announcement exists elsewhere.','A party-position page is neither a 2027 alliance nor a candidate nomination.','Linked documents are unreviewed leads until separately acquired and checked.'],'records':records}
Path('current-source-index-audit.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps([{'id':r['id'],'status':r['status'],'headings':r.get('headings'),'printedAsOf':r.get('printedAsOf'),'links':len(r.get('selectedIndexLinks',[]))}for r in records]))
