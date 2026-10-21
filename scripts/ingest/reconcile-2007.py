from pathlib import Path
import json,re,hashlib,os,sys

def compact(v):return re.sub(r'\s+','',v or '').lower()
def number(v):
 s=re.sub(r'[,\s]','',v or '')
 return int(s) if re.fullmatch(r'\d+',s) else None
def vector(row,cols):return [number(row[i]) for i in cols]

def reconcile_documents(data,reviews=None):
 out=[]
 for doc in data['documents']:
  ac=doc['ac']; source=next(s for s in data['sources'] if s.get('ac')==ac and s['role']=='indexed-form20'); problems=[];headers=[];footers={};stations=[];shape=[]
  review=next((r for r in (reviews or {}).get('records',[]) if r['ac']==ac),None)
  if review:
   if source['sha256']!=review['sha256']:raise ValueError('Reviewed source hash changed for AC'+str(ac))
   for h in review['headerRows']:
    p=next((p for p in doc['pages'] if p['page']==h['page']),None)
    if p is None or p['tables'][h['table']-1][h['row']-1][2:14]!=h['expected']:raise ValueError('Reviewed header changed for AC'+str(ac))
  for page in doc['pages']:
   for ti,table in enumerate(page['tables']):
    shape.append([page['page'],len(table),len(table[0]) if table else 0])
    if not table or any(len(row)!=18 for row in table):problems.append({'type':'unsupported-table-shape','page':page['page']});continue
    for ri,row in enumerate(table):
     meta={'page':page['page'],'table':ti+1,'row':ri+1}
     cols=[i for i in range(2,14) if row[i] and '(' in row[i] and ')' in row[i]]
     if len(cols)>=2:headers.append({**meta,'columns':cols,'labels':[row[i] for i in cols]})
     label=compact(row[0])
     if 'totalnoofvotesrecordedatpolling' in label:key='ordinary'
     elif 'noofvotesonpostalballot' in label:key='postal'
     elif label=='totalvotespolled':key='final'
     else:key=None
     if key:
      if key in footers:problems.append({'type':'duplicate-footer','kind':key})
      footers[key]={**meta,'raw':row}
     elif row[1] and compact(row[1]) not in ['b/f','bf','c/f','cf'] and number(row[14]) is not None and any(number(row[i]) is not None for i in range(2,14)):
      stations.append({**meta,'printedId':row[0],'label':row[1],'raw':row})
  rawHeaders=json.loads(json.dumps(headers))
  if review:
   headers=[{'page':h['page'],'table':h['table'],'row':h['row'],'columns':review['columns'],'labels':review['canonicalHeader']['labels']} for h in review['headerRows']]
  if not headers:problems.append({'type':'missing-candidate-header'});cols=[];labels=[]
  else:
   cols=headers[0]['columns'];labels=headers[0]['labels']
   for h in headers[1:]:
    if h['columns']!=cols or [compact(v) for v in h['labels']]!=[compact(v) for v in labels]:problems.append({'type':'header-variation','page':h['page'],'labels':h['labels']})
  for key in ['ordinary','postal','final']:
   if key not in footers:problems.append({'type':'missing-footer','kind':key});continue
   f=footers[key];row=f.pop('raw');f.update({'candidateVotes':vector(row,cols),'printedValid':number(row[14]),'printedRejected':number(row[15]),'printedTotal':number(row[16]),'printedTendered':number(row[17]),'rawCells':row})
   vals=f['candidateVotes']
   if not cols or None in vals or f['printedValid'] is None or sum(vals)!=f['printedValid']:problems.append({'type':'footer-candidate-accounting','kind':key,'candidateSum':sum(v for v in vals if v is not None),'printedValid':f['printedValid']})
   if f['printedTotal'] is None or f['printedValid'] is None or (f['printedRejected'] is not None and f['printedValid']+f['printedRejected']!=f['printedTotal']):problems.append({'type':'footer-ballot-accounting','kind':key})
   if f['printedRejected'] is None and f['printedValid']!=f['printedTotal']:problems.append({'type':'blank-rejected-with-difference','kind':key})
   if any(row[i] not in [None,''] for i in range(2,14) if i not in cols):problems.append({'type':'unexpected-unused-column','kind':key})
  if all(k in footers for k in ['ordinary','postal','final']):
   a,b,c=[footers[k] for k in ['ordinary','postal','final']]
   if any(x is None or y is None or z is None or x+y!=z for x,y,z in zip(a['candidateVotes'],b['candidateVotes'],c['candidateVotes'])):problems.append({'type':'ordinary-postal-candidate-conservation'})
   for field in ['printedValid','printedTotal']:
    if any(f[field] is None for f in [a,b,c]) or a[field]+b[field]!=c[field]:problems.append({'type':'ordinary-postal-total-conservation','field':field})
  totals=[0]*len(cols);stationIssues=[]
  for s in stations:
   row=s.pop('raw');vals=vector(row,cols);s.update({'candidateVotes':vals,'printedValid':number(row[14]),'printedTotal':number(row[16])})
   if None in vals or sum(v for v in vals if v is not None)!=s['printedValid']:stationIssues.append({'type':'station-candidate-accounting','page':s['page'],'printedId':s['printedId'],'label':s['label']})
   if s['printedValid']!=s['printedTotal']:stationIssues.append({'type':'station-total-difference','printedId':s['printedId']})
   for i,v in enumerate(vals):totals[i]+=v or 0
  if 'ordinary' in footers and totals!=footers['ordinary']['candidateVotes']:stationIssues.append({'type':'station-to-ordinary-column-mismatch','stationSum':totals,'ordinary':footers['ordinary']['candidateVotes']})
  problems+=stationIssues
  out.append({'ac':ac,'label':source['label'],'sourceUrl':source['url'],'sha256':source['sha256'],'header':headers[0] if headers else None,'sourceHeaders':rawHeaders,'headerReview':review,'candidateHeaders':labels,'columns':cols,'footers':footers,'stationRows':len(stations),'stationProblems':stationIssues,'problems':problems,'tableShapes':shape,'status':'machine-reconciled' if not problems else 'withheld'})
 
 return sorted(out,key=lambda r:r['ac'])

if __name__=='__main__':
 src=Path('data/processed/assembly-2007-pages.json');data=json.loads(src.read_text());reviewPath=Path('data/research/assembly-2007-header-reviews.json');reviews=json.loads(reviewPath.read_text())
 report={'schemaVersion':1,'scope':'Native Form20 numerical reconciliation; source-derived historical research only. No independent winner check, geographic comparability or additional benchmark approved.','inputSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'scriptSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'headerReviewSha256':hashlib.sha256(reviewPath.read_bytes()).hexdigest(),'records':reconcile_documents(data,reviews)}
 if '--check' in sys.argv:
  saved=json.loads(Path('data/research/assembly-2007-reconciliation.json').read_text())
  for key in ['inputSha256','scriptSha256','headerReviewSha256','records']:
   if report[key]!=saved[key]:raise SystemExit('2007 reconciliation drift: '+key)
  print('2007 native reconciliation golden verified: '+str(sum(r['status']=='machine-reconciled' for r in report['records']))+'/60')
 else:
  report['cloudRun']='https://github.com/ethereum007/manipur/actions/runs/'+os.environ['GITHUB_RUN_ID'];Path('work-2007-normalization').mkdir(exist_ok=True);Path('work-2007-normalization/diagnostic.json').write_text(json.dumps(report,indent=2));print(json.dumps({'passed':sum(r['status']=='machine-reconciled' for r in report['records']),'withheld':[r['ac'] for r in report['records'] if r['problems']]}))
