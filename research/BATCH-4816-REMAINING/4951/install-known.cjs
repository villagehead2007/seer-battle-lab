'use strict';
const fs=require('fs'),dir=__dirname;
let s=JSON.parse(fs.readFileSync(dir+'/snapshot.json')),m=s.moves.find(m=>m.id===14404);
if(m.hash!=='a3b11ed1'||m.sourceTargetCount!==3)throw Error('14404 source mismatch');
m.limitations=m.limitations.filter(x=>x!=='多目标攻击尚未适配');
m.deferredEffects=[{field:'atk_num',description:'多目标字段 atk_num=3；原始来源保留，按用户确认只对当前目标普通攻击一次',scope:'用户明确排除多目标'}];
fs.writeFileSync(dir+'/snapshot.json',JSON.stringify(s,null,2)+'\n');
let file='dist/range-effects.js',text=fs.readFileSync(file,'utf8'),tag='// 4951 exact sourced skill instances';
if(!text.includes(tag)){
const block=`
${tag}
{const rows=[{id:2485,move:38570,hash:'2cd71e1f',index:1,args:[0,6]},{id:937,move:29468,hash:'217c6cdc',index:3,args:[100,10,2,3]},{id:2299,move:38572,hash:'6cfb2f01',index:0,args:[]}];
for(const row of rows){const old=registry[row.id],exact=(p,m,i)=>(m?.wikiId??m?.id)===row.move&&m.revision==='seerapi:'+row.hash&&i===row.index&&JSON.stringify(p)===JSON.stringify(row.args);registry[row.id]=Object.freeze({...old,validate(p,m,i){if(exact(p,m,i))return;return old.validate(p,m,i);},execute(c,p){if(!exact(p,c.m,c.effectInstanceIndex))return old.execute(c,p);if(row.id===2485){if(!(c.t.suitState.shield>0&&c.t.suitState.barrier>0))return;const a=c.consumeShields(c.t,c.a),b=c.consumeBarrier(c.t);if(a>0&&b>0)for(const k of ['麻痹','害怕'])c.ailment(c.t,k,c.a);return;}if(row.id===937){if(!(statusRoll(c,p[0])&&c.ailment(c.t,'混乱',c.a)))c.timed(c.t,'id984',p[2],{amount:-p[3]},c.round+1);return;}if(!c.clear(c.t)||c.ppReductionBlocked(c.t))return;for(const k of c.t.moves)if(['physical','special'].includes(c.moveKind(k)))clearPp2125(c,c.t,k);}});}}
`;
const at=text.lastIndexOf('\n});');if(at<0)throw Error('effect closure missing');text=text.slice(0,at)+block+text.slice(at);fs.writeFileSync(file,text);
}
file='dist/range-souls.js';text=fs.readFileSync(file,'utf8');const soulTag='// 4951 current sourced independent soul branches';
if(!text.includes(soulTag)){
const block=`
${soulTag}
const wind2151=f=>f.soulState.wind2151??={sourceHash:'35e1e75a',capacityRate:60,damageRate:60,fullRate:60,events:[]};
const windAbilities2151={state:wind2151,capacity(c){const st=wind2151(c.a),speed=panel(c,c.a,'spe');if(c.a.stages.spe!==0)throw Error('Q-4951-001：速度值是否计能力等级尚未确认');return {speed,rate:st.capacityRate,amount:speed*st.capacityRate/100};},used(c){if(c.a.hp<=0||c.t.hp<=0||!c.usedSkillThisRound(c.a)||!['physical','special'].includes(c.m?.kind))return;const st=wind2151(c.a),rate=st.damageRate,amount=(c.a.stats.maxHp-c.a.hp)*rate/100;c.hurt(c.t,amount,'维德弗尼尔已损体力附加','percent');st.events.push({kind:'lost-hp',round:c.round,rate,amount});st.damageRate=Math.min(120,rate+20);}};
registry[2151]={name:'维德弗尼尔',sourceHash:'35e1e75a',partial:true,pending:['Q-4951-001：速度计量','Q-4951-002：临时上限授予与叠加的当前HP处理'],deferred:['临时体力上限真实下场时移除；当前授予语义待答不延期'],traits:{},abilities:windAbilities2151,hooks:{roundStart(c){const st=wind2151(c.a);st.fullBonus=0;if(c.a.hp===c.a.stats.maxHp){st.fullBonus=st.fullRate/100;st.events.push({kind:'full',round:c.round,rate:st.fullRate});st.fullRate=Math.min(120,st.fullRate+20);}},beforeDamage(c){c.modifier*=1+(wind2151(c.a).fullBonus??0);},beforeUse(c){if(!['physical','special'].includes(c.m?.kind))return;windAbilities2151.capacity(c);throw Error('Q-4951-002：临时上限增加是否同步当前HP及重复叠加尚未确认');},afterUse:windAbilities2151.used}};
`;
const at=text.lastIndexOf('\n});');if(at<0)throw Error('soul closure missing');text=text.slice(0,at)+block+text.slice(at);fs.writeFileSync(file,text);
}
fs.writeFileSync('tests/helpers/remaining-4951.cjs',"'use strict';module.exports=require('./remaining-battle.cjs')(require('../../research/BATCH-4816-REMAINING/4951/snapshot.json'));\n");
console.log('4951 sourced known branches installed; capacity remains explicitly unconfirmed');
