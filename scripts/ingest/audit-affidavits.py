"""Audit public official PDF availability; never export personal PDF text."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib, json, time
import requests
import pymupdf

rows = [r for r in json.loads(Path('data/processed/candidate-register.json').read_text()) if r['year'] == 2022]
assert len(rows) == 265
assert len({(r['ac'],r['candidate']) for r in rows}) == 265

def inspect(row):
    result = {k:row[k] for k in ('year','ac','candidate','party','affidavitUrl')}
    result.update({'checkedAt':datetime.now(timezone.utc).isoformat(), 'manualFieldReview':'not-performed-by-this-audit'})
    for attempt in range(3):
        try:
            response = requests.get(row['affidavitUrl'], timeout=(15,90), headers={'User-Agent':'MandateTerrain-SourceAudit/1.0'})
            result['httpStatus'] = response.status_code
            if response.status_code != 200:
                if response.status_code >= 500 and attempt < 2: time.sleep(2); continue
                result['status'] = 'http-unavailable'; return result
            raw = response.content
            if not raw.lstrip().startswith(b'%PDF-'):
                result['status'] = 'not-a-pdf'; return result
            result.update({'sha256':hashlib.sha256(raw).hexdigest(), 'bytes':len(raw)})
            with pymupdf.open(stream=raw, filetype='pdf') as doc:
                result['pages'] = len(doc)
                counts = [len(' '.join(p.get_text().split())) for p in doc]
                result['pagesWithNativeText'] = sum(n >= 80 for n in counts)
                result['nativeTextCharacters'] = sum(counts)
                result['status'] = 'pdf-opened'
                result['textReadiness'] = 'native-text-present' if result['pagesWithNativeText'] else 'image-or-no-usable-native-text'
            return result
        except Exception as exc:
            if attempt == 2:
                result.update({'status':'request-or-pdf-error', 'errorType':type(exc).__name__}); return result
            time.sleep(2)

with ThreadPoolExecutor(max_workers=4) as pool:
    records = []
    for result in pool.map(inspect, rows):
        records.append(result)
        print(str(len(records)) + '/265 AC ' + str(result['ac']) + ': ' + result['status'], flush=True)

output = {'year':2022, 'capturedAt':datetime.now(timezone.utc).isoformat(),
 'sourceIndex':'https://ceomanipur.nic.in/Affidavits/AssemblyElection/ge_2022',
 'method':'Official candidacy-index URLs; HTTP and PDF opening checks with SHA-256; native text page threshold 80 non-whitespace-normalized characters. No OCR or field verification.',
 'scope':'Availability and machine-readiness observation at capture; PDF content not independently validated. No personal PDF text exported.',
 'manualAuditComplete':False, 'records':sorted(records,key=lambda r:(r['ac'],r['candidate']))}
Path('work-affidavits').mkdir(exist_ok=True)
Path('work-affidavits/affidavit-availability-2022.json').write_text(json.dumps(output, indent=2))
print(json.dumps({'total':len(records),'opened':sum(r['status']=='pdf-opened' for r in records),'nativeTextPresent':sum(r.get('pagesWithNativeText',0)>0 for r in records)}))
