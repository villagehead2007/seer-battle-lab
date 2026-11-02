from pathlib import Path
import json,re,sys
p=Path('dist/range-effects.js');s=p.read_text(encoding='utf-8-sig');data=json.loads(Path(sys.argv[1] if len(sys.argv)>1 else 'research/range-2987-3000.json').read_text(encoding='utf-8'))['skill_effect_type'];meta=json.loads(re.search(r'/\*META\*/(.*?)/\*ENDMETA\*/',s).group(1));meta.update({k:{'info':v['info'],'args_num':v['args_num']} for k,v in data.items()});s=re.sub(r'/\*META\*/.*?/\*ENDMETA\*/','/*META*/'+json.dumps(meta,ensure_ascii=False)+'/*ENDMETA*/',s);p.write_text(s,encoding='utf-8')
