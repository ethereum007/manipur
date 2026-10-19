"""Row-oriented table extraction. Original scans and raw OCR remain immutable."""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor,as_completed
import os,sys,json,subprocess,tempfile,re
os.environ['OMP_THREAD_LIMIT']='1';os.environ['OMP_NUM_THREADS']='1'
import pymupdf as fitz
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parents[2]
def ocr(img,folder,label):
 path=folder/(label+'.png');img.save(path)
 r=subprocess.run(['tesseract',str(path),'stdout','--psm','6'],capture_output=True,text=True,timeout=60,env=os.environ)
 if r.returncode:raise RuntimeError(r.stderr[-500:])
 return r.stdout
def extract(args):
 name,index,half=args;doc=fitz.open(ROOT/'data/raw'/(name+'.pdf'));page=doc[index];rect=page.rect
 if half is not None:rect=fitz.Rect(rect.x0+rect.width*half/2,rect.y0,rect.x0+rect.width*(half+1)/2,rect.y1)
 pix=page.get_pixmap(dpi=180,clip=rect);img=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 arr=np.asarray(img.convert('L'));rows=np.flatnonzero(np.mean(arr<165,axis=1)>.60)
 rows=rows[(rows>img.height*.035)&(rows<img.height*.44)]
 clusters=[]
 for y in rows:
  if not clusters or y-clusters[-1][-1]>4:clusters.append([int(y)])
  else:clusters[-1].append(int(y))
 lines=[int(np.mean(c)) for c in clusters]
 # The tallest table-cell band near the top contains rotated candidate column headings.
 pairs=[(a,b) for a,b in zip(lines,lines[1:]) if b-a>35]
 a,b=max(pairs,key=lambda p:p[1]-p[0]) if pairs else (int(img.height*.10),int(img.height*.34))
 header=img.crop((0,a+3,img.width,b-2)).transpose(Image.Transpose.ROTATE_270)
 with tempfile.TemporaryDirectory() as scratch:
  folder=Path(scratch);body=ocr(img,folder,'body');head=ocr(header,folder,'header')
 return {'source':name,'page':index+1,'half':half,'body':body,'header':head,'headerCropPixels':[a,b],'method':'180 dpi; PSM 6 rows; rotated table-heading band; unreviewed extraction'}
if __name__=='__main__':
 name=sys.argv[1];out=ROOT/'data/processed';out.mkdir(parents=True,exist_ok=True)
 if name=='assembly-2012':tasks=[(name,i,None) for i in range(34,164)]
 elif name=='assembly-2022':tasks=[(name,i,h) for i in range(75,120) for h in [0,1]]
 else:tasks=[(name,i,None) for i in range(73,149)]
 results=[]
 with ProcessPoolExecutor(max_workers=4) as pool:
  for future in as_completed([pool.submit(extract,t) for t in tasks]):
   results.append(future.result())
   if len(results)%20==0 or len(results)==len(tasks):
    print(name,len(results),'/',len(tasks),flush=True)
    (out/(name+'-tables.json')).write_text(json.dumps(sorted(results,key=lambda r:(r['page'],r['half'] or 0)),ensure_ascii=False,indent=2))
 if name=='assembly-2022':
  import requests
  from bs4 import BeautifulSoup
  url='https://ceomanipur.nic.in/Affidavits/AssemblyElection/ge_2022'
  response=requests.get(url,timeout=120);response.raise_for_status()
  (out/'official-candidate-index-2022.html').write_text(response.text)
 print('Table extracts preserved; numeric verification is a separate stage.',flush=True)
