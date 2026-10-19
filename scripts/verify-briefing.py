from pathlib import Path
import pymupdf as fitz
pdf=Path('out/data/executive-brief.pdf')
assert pdf.exists() and pdf.stat().st_size>20000
doc=fitz.open(pdf)
assert len(doc)==5, f'Expected five handout pages; received {len(doc)}'
out=Path('document-review');out.mkdir(exist_ok=True)
expected=['A state. Sixty constituencies.','Three elections. A changing map.','Follow the candidate record.','Public resources, in context.','What is established. What comes next.']
for i,page in enumerate(doc):
 text=' '.join(page.get_text().split());assert expected[i] in text,(i,text[:200])
 assert page.rect.width>page.rect.height
 page.get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(out/f'executive-page-{i+1}.png')
print('Five landscape PDF pages verified; screenshots available for review.')
