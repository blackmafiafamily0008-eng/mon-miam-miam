from urllib.request import urlopen, Request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
def query(term):
    url='https://dishify.wpthemeverse.com/wp-json/wp/v2/media?per_page=100&search='+term
    try:
        with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as r: data=json.load(r)
        return [{'id':x['id'],'title':x['title']['rendered'],'url':x['source_url']} for x in data]
    except Exception as e: return [{'error':str(e),'term':term}]
with ThreadPoolExecutor(max_workers=6) as pool:
    results=list(pool.map(query,['hero','logo','tacos','cupcake','sorbet','blog','spaghetti','salsa','squash','carrot','classic','testimonial','gallery_img']))
(root/'references/media-library.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
selected=['home_2hero_bg-1.png','logo-1.png','mexican_Tacos_Pastor-1.png','Red-Velvet-Cupcakes-1.png','Mango-Sorbet-1.png','blog_list1-1-1.png','blog_list2-1.png','blog_list3-1.png']
flat=[x for group in results for x in group if 'url' in x]
def save(item):
    name=item['url'].split('/')[-1]
    if name in selected or any(w in name.lower() for w in ['spaghetti','salsa','squash','carrot','classic','testimonial_img','gallery_img3','gallery_img5','gallery_img6']):
        with urlopen(Request(item['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=40) as r:
            (root/'dist/assets'/name).write_bytes(r.read())
        return name
with ThreadPoolExecutor(max_workers=8) as pool: print('Saved:',list(pool.map(save,flat)))
