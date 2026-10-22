from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,requests,pymupdf,os
out=Path('work-2012-acceptance');out.mkdir(exist_ok=True)
url='https://github.com/ethereum007/manipur/releases/download/primary-sources-2026-10-19/assembly-2012.pdf'
response=requests.get(url,timeout=(20,180));response.raise_for_status();raw=response.content
sha=hashlib.sha256(raw).hexdigest()
if sha!='7b48c17057178dbcb67a568eca761f37849ac89f07c6a5ddf18efbcdda125328':raise ValueError('Archived 2012 source hash changed')
pages=[2,8,30,31,33,34]
with pymupdf.open(stream=raw,filetype='pdf') as doc:
 if len(doc)!=174:raise ValueError('Unexpected report page count')
 for page in pages:doc[page-1].get_pixmap(dpi=150).save(out/('assembly-2012-p'+str(page)+'.png'))
manifest={'reviewedArtifactCreatedAt':datetime.now(timezone.utc).isoformat(),'sourceArchiveUrl':url,'sourceUrl':'https://ceomanipur.nic.in/StatisticalReport/AssemblyElection/statistical_report_2012.pdf','sourceSha256':sha,'sourcePages':174,'selectedPages':pages,'scope':'Selected-page visual-review preparation only. No new geographic finding or benchmark score. OCR is not verification.','cloudRun':'https://github.com/ethereum007/manipur/actions/runs/'+os.environ['GITHUB_RUN_ID']}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2));print(json.dumps(manifest))
