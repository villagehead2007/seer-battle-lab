'use strict';
const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json'),ids=[38,573,1701,961],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id));
const block=`
const bindings4857=${JSON.stringify(bindings)},metadata4857=${JSON.stringify(s.effects.filter(e=>ids.includes(e.id)))};
const handlers4857={38(c,p){c.reduceMaxHp(c.t,p[0],c.m.name+'降低最高体力');},573:handlers4830[573],961(c,p){const values=Object.fromEntries(stats.filter(k=>c.a.stages[k]<0).map(k=>[k,-c.a.stages[k]])),out=c.rewriteStageValues(c.a,values,'reverse');if(!out.removedNegative.length)return;const prior=c.a.effects['攻击伤害免疫'],active=conditionStatusRules.timedPresent(prior,c.round);c.timed(c.a,'攻击伤害免疫',p[0],{source9614857:true},c.round+1);if(active)c.a.effects['攻击伤害免疫'].start=prior.start;}};
for(const id of[38,573,1701,961]){const old=registry[id],meta=metadata4857.find(e=>e.id===id);registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:meta.argsNum,direct:true,phase:id===1701?old.phase:'afterHit',validate(p,m,i){const b=bindings4857.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(b.length){if(!b.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(x.args)===JSON.stringify(p)))throw Error('4857 exact source mismatch '+id);return;}if(!old)throw Error('unreviewed effect '+id);return old.validate(p,m,i);},execute(c,p){if(bindings4857.some(x=>x.id===id&&(c.m.wikiId??c.m.id)===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index)&&handlers4857[id])return handlers4857[id](c,p);if(!old)throw Error('unreviewed effect '+id);return old.execute(c,p);}});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('const bindings4857='));let at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+block+t.slice(at));
const soul=`
const phalanx2044=f=>f.soulState.phalanx2044??={hits:0,survivalUsed:false,pendingSurvival:false};
registry[2044]={name:'戟决先锋',sourceHash:'c27fd69e',partial:true,unimplemented:[],deferred:['真实再次登场之后的奇偶命中计数重置；每场首次致死资源跨登场不重置'],traits:{},hooks:{
afterAttack(c){if(c.a.hp<=0)return;const st=phalanx2044(c.a);st.hits++;const stat=st.hits%2?'def':'spd';if(c.t.hp>0)c.hurt(c.t,c.panelStat(c.a,stat)*.5,'戟决先锋奇偶面板百分比附伤','percent');},
beforeHealthLoss(c){const st=phalanx2044(c.a);if(st.survivalUsed||c.a.hp<=0||!['attack','fixed','percent','true'].includes(c.type)||c.amount<c.a.hp)return;st.survivalUsed=true;st.pendingSurvival=true;c.hpFloor=Math.max(c.hpFloor??0,1);},
damageTaken(c){if(phalanx2044(c.a).pendingSurvival)throw Error('Q-4857-001：首次致死保1后的两防降低与等量回复计算待确认');}
}};
`;
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('registry[2044]='));at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+soul+t.slice(at));console.log({id:4857,bindings:bindings.length});
