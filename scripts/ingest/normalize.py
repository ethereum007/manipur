from pathlib import Path
import requests,json
import pymupdf as fitz
root=Path(__file__).resolve().parents[2];p=root/'data/processed';p.mkdir(parents=True,exist_ok=True)
s=requests.Session();audit={'probes':[],'pages':[]}
for u in ['https://results.eci.gov.in/ResultAcGenMar2022/ConstituencywiseS142.htm?ac=2','https://results.eci.gov.in/AssemblyResults2017/ConstituencywiseS142.htm?ac=2']:
 try:
  r=s.get(u,timeout=25);audit['probes'].append({'url':u,'status':r.status_code,'text':r.text[:20000]});print('ECI probe',r.status_code,flush=True)
 except Exception as e:audit['probes'].append({'url':u,'error':str(e)})
u='https://ceomanipur.nic.in/StatisticalReport/AssemblyElection/statistical_report_2017.pdf'
r=s.get(u,timeout=180);r.raise_for_status();d=fitz.open(stream=r.content,filetype='pdf')
for i in [43,44,45,46,47,48,49,50,51,52,53,54,55,56]:
 page=d[i];audit['pages'].append({'page':i+1,'text':page.get_text(),'blocks':[b for b in page.get_text('dict')['blocks'] if b['type']==0]})
(p/'normalization-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print('Audit persisted',len(d),'source pages',flush=True)
