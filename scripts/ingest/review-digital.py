from pathlib import Path
import json,zipfile,pymupdf as fitz
root=Path('work-deep-review');raw=root/'raw';out=root/'images';out.mkdir(parents=True,exist_ok=True)
selected={2012:[1,2,11,56,60],2017:[7,21],2022:[1,3,9,12,14,16,23,32,50,54,58,60],2024:[1,32,60]}
for year,acs in selected.items():
 for ac in acs:
  doc=fitz.open(raw/str(year)/(str(ac)+'.pdf'))
  first=doc[0];last=next((p for p in doc if 'Total Votes' in p.get_text() and 'Polled' in p.get_text()),doc[-1])
  if year in [2012,2017]:
   first.get_pixmap(matrix=fitz.Matrix(2,2)).save(out/(str(year)+'-'+str(ac)+'-first.png'))
   if last.number!=first.number:last.get_pixmap(matrix=fitz.Matrix(2,2)).save(out/(str(year)+'-'+str(ac)+'-total.png'))
  else:
   first.get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(35,145,first.rect.width-30,265)).save(out/(str(year)+'-'+str(ac)+'-header.png'))
   last.get_pixmap(matrix=fitz.Matrix(2,2)).save(out/(str(year)+'-'+str(ac)+'-total.png'))
with zipfile.ZipFile(root/'official-form20-2012-2017-2022-2024.zip','w',compression=zipfile.ZIP_DEFLATED) as archive:
 for p in raw.rglob('*.pdf'):archive.write(p,p.relative_to(raw))
