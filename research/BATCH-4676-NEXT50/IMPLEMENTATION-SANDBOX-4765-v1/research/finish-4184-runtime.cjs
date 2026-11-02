'use strict';const fs=require('fs'),assert=require('node:assert/strict'),source=require('./4184-reviewed-snapshot.json');
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});'),code='\n';for(const id of [1635,2540]){const e=source.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(1635,'afterHit',(c,p)=>{c.heal(c.a,p[0],c.m.name+'立即回复');c.timed(c.a,'延迟技能回满',1,{},c.round+p[1]);},[[0,99999],turns]);
add(2540,'afterHit',(c,p)=>{const n=[c.a,c.t].filter(f=>c.priorityValueOf(f)===p[0]).length;if(n)c.timed(c.t,'次回合先制降低',p[1],{amount:n*p[2]},c.round+1);},[[-20,20],turns,[0,20]]);
for(const [id,index,args]of [[1423,1,[100,7,2]],[1471,2,[100,0,2]]]){const old=registry[id];registry[id]=Object.freeze({...old,validate(p,m,i){if(m?.id===38461&&m.hash==='3837abd9'&&i===index&&JSON.stringify(p)===JSON.stringify(args))return;old.validate(p,m,i);}});}
`;
fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
p='dist/souls.js';s=fs.readFileSync(p,'utf8');let q="      if(f.hp>0&&on(f,'回合末设定体力'))";assert.equal(s.split(q).length,2);s=s.replace(q,"      if(f.hp>0&&on(f,'延迟技能回满')){heal(f,f.stats.maxHp,'延迟技能回满','skill');delete f.effects['延迟技能回满'];}\n"+q);fs.writeFileSync(p,s);
let h=fs.readFileSync('tests/helpers/4169-battle.cjs','utf8').replaceAll('4169','4184').replace('unknown=[1644,1650]','unknown=[]').replace('moveId:10047','moveId:10157');
const start="const neutral=(n,kind='status',power=0,fifth=false)=>";assert.equal(h.split(start).length,2);h=h.replace(start,"if(o.carry){const x=original.effectInstances.find(x=>x.id===2539);assert.ok(x);move.effectIds=[2539];move.effectInstances=[structuredClone(x)];move.description=x.description;}\n"+start);
fs.writeFileSync('tests/helpers/4184-battle.cjs',h);
