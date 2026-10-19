from pathlib import Path
import pymupdf as fitz
import os,json
root=Path(__file__).resolve().parents[2];name=os.environ['SOURCE_DOCUMENT'];assert name in ['assembly-2012','assembly-2022','parliament-2024','biren-affidavit-2022'];doc=fitz.open(root/'data/raw'/(name+'.pdf'));out=root/'source-review';out.mkdir(exist_ok=True)
for value in os.environ['SOURCE_PAGES'].split(','):
 page=int(value.strip());assert 1<=page<=len(doc);doc[page-1].get_pixmap(dpi=180).save(out/(name+'-p'+str(page)+'.png'))
print('Rendered primary-source pages in the GitHub runner')
