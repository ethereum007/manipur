"""Fetch immutable GitHub release sources, or the original public affidavit, in the runner."""
from pathlib import Path
import urllib.request,sys,hashlib
name=sys.argv[1]
allowed={'assembly-2012','assembly-2017','assembly-2022','parliament-2024','biren-affidavit-2022'}
if name not in allowed: raise ValueError('Unknown source')
base='https://github.com/ethereum007/manipur/releases/download/primary-sources-2026-10-19/'
url=base+name+'.pdf' if name!='biren-affidavit-2022' else 'https://ceomanipur.nic.in/Affidavits/AssemblyElection/2022/2/NONGTHOMBAM%20BIREN%20SINGH.pdf'
folder=Path('data/raw');folder.mkdir(parents=True,exist_ok=True)
payload=urllib.request.urlopen(url,timeout=180).read()
if not payload.startswith(b'%PDF'):raise ValueError('Not a PDF')
if name!='biren-affidavit-2022':
 sums=urllib.request.urlopen(base+'SHA256SUMS.txt',timeout=60).read().decode()
 expected=next(line.split()[0] for line in sums.splitlines() if line.split()[-1].endswith(name+'.pdf'))
 if hashlib.sha256(payload).hexdigest()!=expected:raise ValueError('Source checksum mismatch')
(folder/(name+'.pdf')).write_bytes(payload)
print(name,'source acquired with provenance; bytes',len(payload))
