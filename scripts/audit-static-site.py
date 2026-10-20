"""Audit the exported site, entirely in GitHub Actions, before deployment."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, os, posixpath

ROOT = Path('out').resolve()
BASE = os.environ.get('NEXT_PUBLIC_BASE_PATH', '').rstrip('/')
class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.refs = path, set(), []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'): self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('name'): self.ids.add(attrs['name'])
        for key in (['href'] if tag in ('a','link') else ['src'] if tag in ('script','img','source','iframe','video','audio') else []):
            if attrs.get(key): self.refs.append((tag, attrs[key]))

docs = {}
for path in sorted(ROOT.rglob('*.html')):
    doc = Document(path)
    doc.feed(path.read_text(encoding='utf-8'))
    docs[path] = doc
errors, references = [], 0
for path, doc in docs.items():
    relative = path.relative_to(ROOT).as_posix()
    route = '/' + relative.removesuffix('index.html') if relative.endswith('index.html') else '/' + relative
    for tag, raw in doc.refs:
        parts = urlsplit(raw)
        if parts.scheme or parts.netloc: continue
        references += 1
        target_url = unquote(parts.path)
        if not target_url: target = path
        else:
            if BASE and (target_url == BASE or target_url.startswith(BASE + '/')):
                target_url = target_url[len(BASE):] or '/'
            normalized = posixpath.normpath(target_url if target_url.startswith('/') else posixpath.join(posixpath.dirname(route), target_url))
            target = ROOT / normalized.lstrip('/')
            if target.is_dir(): target = target / 'index.html'
            elif not target.exists() and not target.suffix:
                target = target / 'index.html'
        if not target.is_relative_to(ROOT) or not target.is_file():
            errors.append({'page': relative, 'reference': raw, 'issue': 'Missing local target'})
        elif tag == 'a' and parts.fragment and target in docs and unquote(parts.fragment) not in docs[target].ids:
            errors.append({'page': relative, 'reference': raw, 'issue': 'Missing target section'})
report = {'pages': len(docs), 'localReferences': references, 'errors': errors, 'scope': 'Exported HTML href/src targets and anchor IDs; external source uptime and JavaScript-generated interactions are separate checks.'}
Path('data/processed/site-integrity.json').write_text(json.dumps(report, indent=2))
print(json.dumps({'pages': len(docs), 'localReferences': references, 'errors': len(errors)}))
for error in errors[:40]: print(json.dumps(error))
assert not errors, 'Internal site integrity audit failed'
