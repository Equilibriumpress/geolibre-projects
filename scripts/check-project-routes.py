"""Verify links in built user routes, including query-based project/video references."""
import html.parser
import json
import pathlib
import urllib.parse
site = pathlib.Path('site')
publication = json.loads((site/'publication.json').read_text())
revision = publication['revision']
app_build = json.loads((site/'demo/app-build.json').read_text())
assert app_build['revision'] == publication['appRevision'], 'Published app revision differs from release contract'
assert (site/'demo/LICENSE.txt').is_file(), 'Compiled app license is missing'
projects = {p['id']:p for p in publication['projects']}
base = publication.get('pagesBase', 'https://equilibriumpress.github.io/geolibre-projects/')
base_path = urllib.parse.urlparse(base).path
repository_path = urllib.parse.urlparse(publication.get('repositoryUrl', 'https://github.com/Equilibriumpress/geolibre-projects')).path.strip('/')
class Links(html.parser.HTMLParser):
    def __init__(self): super().__init__(); self.links=[]
    def handle_starttag(self,tag,attrs):
        if tag == 'a':
            for key,value in attrs:
                if key == 'href': self.links.append(value)
paths = ['index.html','projects/index.html']+[f'projects/{slug}/index.html' for slug in projects]
checked = 0
for relative in paths:
    parser=Links();parser.feed((site/relative).read_text())
    page = urllib.parse.urljoin(base,relative.removesuffix('index.html'))
    for href in parser.links:
        url=urllib.parse.urlparse(urllib.parse.urljoin(page,href))
        if url.netloc != urllib.parse.urlparse(base).netloc or not url.path.startswith(base_path): continue
        target=site/urllib.parse.unquote(url.path.removeprefix(base_path))
        if url.path.endswith('/'): target=target/'index.html'
        if not target.is_file(): raise RuntimeError(f'{relative}: broken link {href}')
        query=urllib.parse.parse_qs(url.query)
        for key in ['url','videoStory']:
            if key not in query:continue
            source=urllib.parse.urlparse(query[key][0])
            if source.netloc != 'raw.githubusercontent.com': raise RuntimeError(f'Unexpected project host: {source.netloc}')
            parts=source.path.strip('/').split('/')
            if len(parts)<6 or '/'.join(parts[:2]) != repository_path or parts[2] != revision: raise RuntimeError(f'Mixed publication revision: {href}')
            slug=parts[4]; filename='/'.join(parts[5:])
            if not (pathlib.Path('projects')/slug/filename).is_file(): raise RuntimeError(f'Missing source file: {href}')
        checked+=1
    print('Built route verified:',relative)
assert not (site/'utrecht-65plus-density/index.html').exists(), 'Legacy invalid route unexpectedly generated'
print('Checked internal links:',checked)
