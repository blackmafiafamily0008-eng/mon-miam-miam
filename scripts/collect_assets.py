"""Collect reference media used by the supplied Dishify screenshot."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor
import re, json, html

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'dist/assets'
REFS = ROOT / 'references'

def read_url(url):
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=40) as response:
        return response.read()

source = (REFS / 'demo-home.html').read_text(encoding='utf-8')
css_urls = re.findall(r'<link[^>]+href=[\"\']([^\"\']+)[\"\'][^>]*>', source)
css_urls = [html.unescape(u) for u in css_urls if any(x in u for x in ['post-6552.css','post-3144.css','css-variable.css','local-6552-frontend-desktop.css'])]
for url in css_urls:
    data = read_url(url).decode()
    (REFS / Path(urlparse(url).path).name).write_text(data, encoding='utf-8')
    source += '\n' + data
source = html.unescape(source).replace('\\/', '/')
urls = set(re.findall(r'https?[^\s\"<>\)]+?\.(?:png|jpe?g|webp|svg)', source))
urls = sorted(u for u in urls if '/uploads/' in u and '/loader.' not in u)
def download(url):
    name = Path(urlparse(url).path).name
    target = ASSETS / name
    try:
        if not target.exists(): target.write_bytes(read_url(url))
        return {'file':name,'source':url,'bytes':target.stat().st_size}
    except Exception as e:
        return {'file':name,'source':url,'error':str(e)}
with ThreadPoolExecutor(max_workers=8) as pool:
    records = list(pool.map(download, urls))
(REFS / 'assets-sources.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print(json.dumps(records,indent=2))

fonts_url = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Work+Sans:wght@400;500;600&family=Corinthia:wght@400;700&display=swap'
font_css = read_url(fonts_url).decode()
for url in set(re.findall(r'url\((https[^)]+)\)',font_css)):
    name=Path(urlparse(url).path).name
    (ASSETS/name).write_bytes(read_url(url))
    font_css=font_css.replace(url,name)
(ASSETS/'fonts.css').write_text(font_css,encoding='utf-8')
print('Fonts saved locally.')
