const fs=require('fs'),a=require('./3737-source-audit.json'),f='dist/range-effects.js';let s=fs.readFileSync(f,'utf8');let add='\n';for(const id of [1234,1315,758,1088]){const d=a.records.find(r=>r.url.endsWith('/skill_effect_type/'+id)).data;add+='metadata['+id+']='+JSON.stringify({info:d.info,args_num:d.args_num})+';\n';}
add+=`add(1234,'afterHit',(c,p)=>{if(c.clear(c.t))c.stage(c.t,-p[0]);},[[1,6]]);
add(1315,'beforeCrit',(c,p)=>{c.chance=p[0]/100;},[pct]);
add(758,'beforeDamage',(c,p)=>{if(c.a.ailments[ailments[p[0]]]>=c.round||c.t.ailments[ailments[p[0]]]>=c.round)c.power*=2;},[[2,2]]);
add(1088,'afterAttack',(c,p)=>{if(c.dealt>p[0]&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/p[1],c.m.name+'高伤吸取','percent'),c.m.name+'高伤吸取');},[[0,99999],[1,9999]]);
`;
const at=s.lastIndexOf('});');s=s.slice(0,at)+add+s.slice(at);s=s.replace("if(id===1605&&", "if(id===993&&![0,2].includes(args[1]))throw Error('993 异常枚举尚未核对');if(id===1188&&![0,22].includes(args[1]))throw Error('1188 异常枚举尚未核对');if(id===1605&&");s=s.replace("},[[1,6],[0,0]]);","},[[1,6],[0,2]]);");s=s.replace("},[[1,10],[0,20],[1,99]]);","},[[1,10],[0,22],[1,99]]);");fs.writeFileSync(f,s);
