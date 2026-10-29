from pathlib import Path
import pymupdf as fitz
import json
import hashlib
pdf=Path('out/data/executive-brief.pdf')
assert pdf.exists() and pdf.stat().st_size>20000
doc=fitz.open(pdf)

out=Path('document-review');out.mkdir(exist_ok=True)
expected=['A state. Sixty constituencies.','Three elections. A changing map.','Follow the candidate record.','Public resources, in context.','What is established. What comes next.']
for i,page in enumerate(doc):
 text=' '.join(page.get_text().split());print('Page',i+1,'text:',text[:250])
 assert page.rect.width>page.rect.height
 page.get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(out/f'executive-page-{i+1}.png')
assert len(doc)==5, f'Expected five handout pages; received {len(doc)}'
for i,page in enumerate(doc):
 assert expected[i] in ' '.join(page.get_text().split()),(i,page.get_text()[:200])
print('Five landscape PDF pages verified; screenshots available for review.')

# Content gate: the generated handout must follow the current web register.
reviews=json.loads(Path('data/research/disclosure-field-reviews-2022.json').read_text())
count=len(reviews['records'])
notes=sum(len(r['fields']) for r in reviews['records'])
text=' '.join(' '.join(p.get_text().split()) for p in doc)
for required in [f'{count} of 265',f'{265-count} remain without',f'{notes} scoped field notes','2017 AC21 full numerical contest remains withheld','All 60 ordinary 2024 Parliamentary segments reconcile','2027 analysis track is deferred']:
 assert required in text, ('Missing current handout evidence gate',required)
receipt={'sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pages':len(doc),'selectedCandidates':count,'scopedFieldNotes':notes,'withoutSelectedComparison':265-count,'contentAssertions':'passed','scope':'Generated walkthrough handout; not an independent source audit'}
(out/'executive-brief-verification.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt))
