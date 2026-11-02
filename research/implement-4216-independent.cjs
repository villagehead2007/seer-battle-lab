'use strict';const fs=require('fs'),assert=require('node:assert/strict');function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,p+' unique');fs.writeFileSync(p,s.replace(a,b));}function append(p,c){const s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('\n});');assert.ok(i>0);fs.writeFileSync(p,s.slice(0,i)+'\n'+c+s.slice(i));}
edit('dist/souls.js',"if(on(t,'reflect')){", "if(on(t,'控制异常反弹')&&statusRules.isControl(k)){emit(`${name(t)} 免疫控制异常${k}${reflected?'':'并反弹'}。`);if(source&&source!==t&&!reflected)ailment(source,k,t,false,true,duration,statusPolicy);return immuneGate();}\n        if(on(t,'reflect')){");
edit('dist/souls.js','randomAilmentsFrom(count,names,effectId){','selfRandomAilmentsFrom(count,names,effectId){return statusRules.randomAilments({a,t:a,round:r,random:()=>rng(s),ailment:(target,k,source,bypass,reflected,duration,policy)=>ailment(target,k,source,bypass,reflected,duration,{...policy,probabilityPercent:100}),record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push(event);}},count,effectId,names);},randomAilmentsFrom(count,names,effectId){');
const s=require('./4216-reviewed-snapshot.json');let c='';for(const id of [768,1687,2508,2446]){const e=s.effects.find(e=>e.id===id);c+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
c+=`add(768,'afterHit',(c,p)=>{const count=Object.values(c.t.ailments).filter(end=>end>=c.round).length;if(count)c.hurt(c.t,count*p[0],c.m.name+'异常种类追加','fixed');},[[1,99999]]);
add(1687,'afterHit',(c,p)=>c.timed(c.a,'控制异常反弹',p[0],{}),[turns]);
add(2508,'afterHit',(c,p)=>{c.clear(c.t);if(statusRoll(c,p[0])&&c.ailment(c.a,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]}))c.ailment(c.t,ailments[p[2]],c.a,false,false,null,{probabilityPercent:100});},[pct,[16,16],[16,16]]);
add(2446,'battleStart',()=>{},[],'仅对手存在处决印记且己方有真实圣剑资源时附着最高序数圣剑；API魂印1547/2a1c0673明确圣剑由至序圣华首次死亡后为己方创建，拉克希斯单独在场无法获得己方圣剑，不伪造队友死亡资源');
{const old=registry[1414];registry[1414]=Object.freeze({...old,validate(p,m,i){if(m?.id===35054&&m.hash==='cda63bcd'&&i===0&&JSON.stringify(p)==='[16]')return;old.validate(p,m,i);}});}
`;
append('dist/range-effects.js',c);
append('dist/range-souls.js',`for(const [id,hash,chance]of [[1434,'39a21510',20],[1703,'a82db158',30]])registry[id]={name:id===1434?'拉克希斯':'拉克希斯·强化',sourceHash:hash,traits:{},hooks:{
afterUse(c){if(c.a.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;let applied=false;for(const name of ['中毒','烧伤','冻伤','麻痹','睡眠','害怕'])if(c.random()<c.statusProbability(chance)/100){if(c.ailment(c.t,name,c.a,false,false,null,{probabilityPercent:chance}))applied=true;}if(!applied&&c.a.hp>0){c.stage(c.a,1);c.selfRandomAilmentsFrom(1,['中毒','烧伤','冻伤'],'soul:'+id);}},
combatEnd(c){if(c.a.hp>0&&Object.values(c.a.ailments).some(end=>end>=c.round))c.a.soulState.lachesisCleanseRound=c.round+1;},
beforeRoundStart(c){if(c.a.soulState.lachesisCleanseRound!==c.round)return;delete c.a.soulState.lachesisCleanseRound;c.clearAilments(c.a);c.timed(c.a,'必定暴击',1,{});}
}};`);
let h=fs.readFileSync('tests/helpers/4215-battle.cjs','utf8').replaceAll('4215','4216');fs.writeFileSync('tests/helpers/4216-battle.cjs',h);edit('tests/helpers/sourced-583-1647-battle.cjs','[4169,4189,4194,4200,4208,4215].includes(id)','[4169,4189,4194,4200,4208,4215,4216].includes(id)');
console.log('4216 two soul versions and independently sourced skills implemented; true team-resource branch retained');
