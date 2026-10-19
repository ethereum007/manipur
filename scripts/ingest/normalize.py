from pathlib import Path
import requests,json,re,collections
import pymupdf as fitz
root=Path(__file__).resolve().parents[2];out=root/'data/processed';out.mkdir(parents=True,exist_ok=True)
url='https://ceomanipur.nic.in/StatisticalReport/AssemblyElection/statistical_report_2017.pdf'
r=requests.get(url,timeout=180);r.raise_for_status();d=fitz.open(stream=r.content,filetype='pdf')
party_map={'INDIAN NATIONAL CONGRESS':'INC','BHARATIYA JANATA PARTY':'BJP','NATIONAL PEOPLES PARTY':'NPP','NAGA PEOPLES FRONT':'NPF','LOK JAN SHAKTI PARTY':'LJP','ALL INDIA TRINAMOOL CONGRESS':'AITC','INDEPENDENT':'IND'}
winners=[];records=[];issues=[]
for i,page in enumerate(d):
 text=page.get_text()
 if 'LIST OF SUCCESSFUL CANDIDATES' in text:
  ls=[re.sub(r'\s+',' ',x).strip() for x in text.splitlines() if x.strip()]
  for j,line in enumerate(ls):
   m=re.match(r'^(\d{1,2})\s*[-–]\s*(.+)$',line)
   if m and j+2<len(ls) and ls[j+2] in party_map:
    winners.append({'year':2017,'ac':int(m[1]),'name':m[2],'candidate':ls[j+1],'party':party_map[ls[j+2]],'source':'assembly-2017','sourcePage':i+1})
 if 'FINAL RESULT SHEET' not in text or 'Total votes polled' not in text:continue
 m=re.search(r'FROM\s+(\d+)\s*[-–]\s*(.+?)\s+ASSEMBLY CONSTITUENCY',text,re.I)
 if not m:continue
 ac=int(m[1]);name=m[2].strip()
 try:
  candidates=[]
  for line in text.splitlines():
   match=re.match(r'^(.+?)\s*\((INC|BJP|AITC|CPI|CPM|CP\(M\)|NCP|NPF|PDA|AIFB|LJP|MDPF|MNDF|MPP|NEIDP|NPP|PRJA|RPI\(A\)|IND)\)\s*$',line.strip())
   if match:candidates.append((match[1].strip(),match[2]))
  # Column names repeat across continued result sheets; remove exact repeats only.
  candidates=list(dict.fromkeys(candidates))
  tail=text.rsplit('Total votes polled',1)[1]
  nums=[int(x.replace(',','')) for x in re.findall(r'(?m)^\s*(\d[\d,]*)\s*$',tail)]
  n=len(candidates)
  assert n>=2 and len(nums)==n+5, ('column count',n,len(nums))
  votes=nums[:n];valid,rejected,nota,total,tendered=nums[n:]
  assert sum(votes)==valid,('candidate sum',sum(votes),valid)
  assert valid+rejected+nota==total,('poll reconciliation',valid,rejected,nota,total)
  em=re.search(r'Total No. of Electors in Assembly Constituency\s*:\s*(\d+)',text);electors=int(em[1]) if em else None
  assert electors and total<=electors
  group=[{'year':2017,'ac':ac,'name':name,'candidate':c[0],'party':c[1].replace('CPM','CP(M)'),'votes':v,'source':'assembly-2017','sourcePage':i+1,'electors':electors,'nota':nota,'votesPolled':total,'validVotes':valid,'rejected':rejected,'verification':'candidate totals reconcile with source Form 20'} for c,v in zip(candidates,votes)]
  group.sort(key=lambda x:-x['votes'])
  for rank,item in enumerate(group,1):item['rank']=rank
  records.extend(group)
 except Exception as e:issues.append({'year':2017,'ac':ac,'page':i+1,'issue':str(e)})
assert len(winners)==60,('Winner register',len(winners))
# Publish only contests whose winning party agrees with the independent successful-candidate list.
by_ac=collections.defaultdict(list)
for r in records:by_ac[r['ac']].append(r)
accepted=[]
for ac,group in by_ac.items():
 expected=next(w for w in winners if w['ac']==ac)
 if group[0]['party']==expected['party']:accepted.extend(group)
 else:issues.append({'year':2017,'ac':ac,'issue':'winning party disagrees with independent source register'})
existing=json.loads((out/'results.json').read_text()) if (out/'results.json').exists() else []
existing=[r for r in existing if r['year']!=2017]+accepted
(out/'results.json').write_text(json.dumps(existing,ensure_ascii=False,indent=2))
(out/'winners.json').write_text(json.dumps(winners,ensure_ascii=False,indent=2))
report={'year':2017,'publishedContests':len(set(r['ac'] for r in accepted)),'candidacies':len(accepted),'winnerRegister':len(winners),'missingContests':[a for a in range(1,61) if a not in set(r['ac'] for r in accepted)],'issues':issues,'source':url,'method':'Candidate header order paired with Form 20 total-votes row; sums, NOTA/rejected/total and winning party reconciled. Source discrepancies withheld.'}
(out/'normalization-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
