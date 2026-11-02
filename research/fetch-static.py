import json,time,urllib.request
from pathlib import Path
p=Path('research/range-2987-3000.json');data=json.loads(p.read_text(encoding='utf-8'))
def get(kind,id):
 key=str(id)
 if key in data[kind]:return data[kind][key]
 time.sleep(1.8)
 url=f'https://raw.githubusercontent.com/SeerAPI/api-data/main/data/v1/data/{kind}/{id}/index.json'
 with urllib.request.urlopen(url,timeout=30) as response:record=json.load(response)
 if record.get('id')!=id:raise ValueError('Unexpected ID')
 if kind=='skill_effect_type':record.pop('skill',None);record.pop('tag',None)
 data[kind][key]=record;p.write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8');print(kind,id,flush=True)
 return record
for pet in data['pet'].values():
 for learn in pet['skill']:
  skill=get('skill',learn['skill']['id'])
  for effect in skill['skill_effect']:get('skill_effect_type',effect['effect']['id'])
print('DONE',flush=True)
