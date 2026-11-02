const fs=require('fs'),p='dist/range-effects.js';let s=fs.readFileSync(p,'utf8');
s=s.replace('validate(args){if(id===1423',"validate(args){if(id===2355&&![8,10].includes(args[1]))throw Error('2355异常枚举未核对');if(id===1423");
const i=s.lastIndexOf('\n});');s=s.slice(0,i)+`
metadata[1252]={info:'自身体力低于1/{0}时造成的伤害为{1}倍，低于1/{2}时伤害为{3}倍',args_num:4};
add(1252,'beforeDamage',(c,p)=>{if(c.a.hp<c.a.stats.maxHp/p[2])c.modifier*=p[3];else if(c.a.hp<c.a.stats.maxHp/p[0])c.modifier*=p[1];},[[1,9999],[1,100],[1,9999],[1,100]]);
`+s.slice(i);fs.writeFileSync(p,s);
