"""Parallel page OCR on GitHub runners; no local user storage."""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor,as_completed
import os,sys,json,subprocess,tempfile,hashlib
os.environ['OMP_THREAD_LIMIT']='1';os.environ['OMP_NUM_THREADS']='1'
import pymupdf as fitz
ROOT=Path(__file__).resolve().parents[2]
def read_page(args):
 name,index=args
 path=ROOT/'data/raw'/(name+'.pdf')
 doc=fitz.open(path);page=doc[index];text=page.get_text(sort=True);method='embedded text'
 if len(text.strip())<100:
  method='tesseract OCR, 160 dpi'
  with tempfile.TemporaryDirectory() as scratch:
   img=Path(scratch)/'page.png';page.get_pixmap(dpi=160).save(str(img))
   result=subprocess.run(['tesseract',str(img),'stdout','--psm','3'],capture_output=True,text=True,timeout=75,env=os.environ)
   if result.returncode:raise RuntimeError(result.stderr[-1000:])
   text=result.stdout
 return {'page':index+1,'text':text,'extraction':method,'verification':'unreviewed source extract; not a normalized election result'}
if __name__=='__main__':
 name=sys.argv[1];path=ROOT/'data/raw'/(name+'.pdf');out=ROOT/'data/processed';out.mkdir(parents=True,exist_ok=True)
 doc=fitz.open(path);count=len(doc);doc.close();pages=[]
 print(name,'pages',count,'OMP threads 1; workers 4',flush=True)
 with ProcessPoolExecutor(max_workers=4) as pool:
  pending=[pool.submit(read_page,(name,i)) for i in range(count)]
  for f in as_completed(pending):
   pages.append(f.result())
   if len(pages)%20==0:print(name,len(pages),'/',count,flush=True)
   if len(pages)%20==0 or len(pages)==count:
    (out/(name+'-pages.json')).write_text(json.dumps(sorted(pages,key=lambda p:p['page']),ensure_ascii=False,indent=2))
 metadata={'id':name,'pages':count,'extracted':len(pages),'complete':len(pages)==count,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'accessed':'2026-10-19','verification':'OCR output, unreviewed. Do not publish numbers without reconciliation.'}
 (out/(name+'-extraction.json')).write_text(json.dumps(metadata,indent=2))
 print(json.dumps(metadata),flush=True)
