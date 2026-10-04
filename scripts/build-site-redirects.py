"""Compatibility URLs only; full website builds in the private app repository."""
import html
import json
from pathlib import Path
base = 'https://equilibriumpress.github.io/GeoLibre/'
prefix = '/geolibre-projects/'
paths = ['', 'projects/', 'demo/', 'outputs/rotterdam/']
paths += [f'projects/{p.name}/' for p in Path('projects').iterdir() if p.is_dir() and not p.name.startswith('_')]
script = 'const path=location.pathname.startsWith(PREFIX)?location.pathname.slice(PREFIX.length):"";const target=new URL(path,BASE);target.search=location.search;target.hash=location.hash;location.replace(target.href);'.replace('PREFIX', json.dumps(prefix)).replace('BASE', json.dumps(base))
for path in paths:
    target = base + path
    page = '<!doctype html><html lang="en"><meta charset="utf-8"><title>GeoLibre</title><meta name="robots" content="noindex"><link rel="canonical" href="'+html.escape(target)+'"><p><a href="'+html.escape(target)+'">Open GeoLibre</a></p><script>'+script+'</script></html>'
    file = Path('site')/path/'index.html'
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(page)
(Path('site')/'404.html').write_text(page)
print(f'Generated {len(paths)} compatibility redirects')
