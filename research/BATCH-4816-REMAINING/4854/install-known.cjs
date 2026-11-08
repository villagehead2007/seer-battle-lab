'use strict';
const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json'),ids=[993,1164,2081,162,125],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id));
const block=`
const bindings4854=${JSON.stringify(bindings)},metadata4854=${JSON.stringify(s.effects.filter(e=>ids.includes(e.id)))};
const handlers4854={
993(c,p){c.stage(c.a,p[0]*(conditionStatusRules.active(c.t,'中毒',c.round)?2:1));},
1164(c){const values=Object.fromEntries(stats.filter(k=>c.t.stages[k]>0).map(k=>[k,-c.t.stages[k]])),out=c.rewriteStageValues(c.t,values,'reverse');if(!out.removedPositive.length){c.clearBoost(c.t);c.clear(c.t);}},
2081(c,p){if(!conditionStatusRules.conditionPresent(c.t,c.round)&&!c.ppReductionBlocked(c.t))randomEmpty(c,p[0]);},
162(c){if(c.t.hp>0&&conditionStatusRules.conditionPresent(c.t,c.round))throw Error('Q-4854-001：162附加300点输出伤害类型待确认');},
125(c,p){c.timed(c.a,'攻击伤害上限',p[0],{amount:p[1],pending1254854:true});}
};
for(const[idText,fn]of Object.entries(handlers4854)){const id=+idText,old=registry[id],meta=metadata4854.find(e=>e.id===id);registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:meta.argsNum,direct:true,phase:'afterHit',validate(p,m,i){const b=bindings4854.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(b.length){if(!b.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(x.args)===JSON.stringify(p)))throw Error('4854 exact source mismatch '+id);return;}if(!old)throw Error('unreviewed effect '+id);return old.validate(p,m,i);},execute(c,p){if(bindings4854.some(x=>x.id===id&&(c.m.wikiId??c.m.id)===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index))return fn(c,p);if(!old)throw Error('unreviewed effect '+id);return old.execute(c,p);},...([125,162].includes(id)?{partial:true,deploymentPendingFor(p,m,i){return bindings4854.some(x=>x.id===id&&(m.wikiId??m.id)===x.moveId)?'效果'+id+'待确认'+(id===125?'Q-4854-002':'Q-4854-001'):old?.deploymentPendingFor?.(p,m,i);}}:{})});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('const bindings4854='));let at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+block+t.slice(at));
const soul=`
registry[2043]={name:'西忒蕾妃',sourceHash:'55eedbee',partial:false,unimplemented:[],deferred:['真实背包其他存活成员的每只5%红减与属性命中50点吸取贡献；回初真实队伍存在图特摩斯且敌中毒时300盾'],traits:{},hooks:{
beforeIncomingAttack(c){c.reduction=1-(1-c.reduction)*.95;},
afterHit(c){if(c.m.kind==='status'&&c.a.hp>0&&c.t.hp>0)healthRules.drainFixed(c,50,'西忒蕾妃当前自身存活贡献固定吸取','西忒蕾妃固定理论回复');},
receivedAttack(c){const n=c.settledDamage??c.dealt;if(c.a.hp<=0||c.t.hp<=0||n<=0||n>300)return;if(conditionStatusRules.active(c.t,'中毒',c.round))healthRules.drainFixed(c,300,'西忒蕾妃敌已中毒固定吸取','西忒蕾妃固定理论回复');else c.ailment(c.t,'中毒',c.a,false,false,null,{probabilityPercent:100});}
}};
`;
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('registry[2043]='));at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+soul+t.slice(at));
p='dist/souls.js';t=fs.readFileSync(p,'utf8');const token='function recordDamage(target,source,type,settledDamage,hpLoss){';assert.ok(t.includes(token));t=t.replace(token,token+"if(type==='attack'&&settledDamage>0&&on(target,'攻击伤害上限')&&target.effects['攻击伤害上限'].pending1254854&&(s.damageEvents??[]).some(e=>e.round===r&&e.targetSide===target.side&&e.type==='attack'&&e.settledDamage>0))throw Error('Q-4854-002：125同回合第二个正红事件的限伤单位待确认');");fs.writeFileSync(p,t);console.log({id:4854,bindings:bindings.length});
