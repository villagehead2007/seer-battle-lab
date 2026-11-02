'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4712-battle.cjs'),{E,make,turn,timer,source}=H;
const row=id=>source.moves.flatMap(m=>m.effectInstances.map((e,index)=>({move:m.id,index,...e}))).find(x=>x.id===id);
test('4712确认回初无首回合基线，次回合锁定免异不可清且回末按回初条件恢复',()=>{
 const s=make({soul:true,index:-1,move:10611,hp:1000});turn(s,10611,28935);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[0].soulState.dragon1914.frame.eligible,false);
 s.fighters[0].counts.immune=1;const old=E.SOULS;let applied;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===1){c.clear(c.t);applied=c.ailment(c.t,'中毒',c.a);}}};try{turn(s,10611,28935);}finally{E.SOULS=old;}
 assert.equal(applied,false);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.equal(s.fighters[0].effects['龙琰本回合免异'],undefined);
});
test('4712第五本次变为龙不授无效，原带龙刷新一次且不累加',()=>{
 const s=make(row(2255));s.fighters[1].type='普通';turn(s,s.auditMoveId,null);assert.equal(s.fighters[1].type,'龙');assert.equal(s.fighters[1].counts.nextSkillInvalid??0,0);
 for(let i=0;i<2;i++){turn(s,s.auditMoveId,null);assert.equal(s.fighters[1].counts.nextSkillInvalid,1);}
});
test('4712自身中毒失败不授未来监听，龙契醒只按清回合前是否为空吸取',()=>{
 const s=make({...row(1139),hp:5000});timer(s,0,'免异常');timer(s,0,'protect');turn(s);assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.equal(s.fighters[0].soulState.removedAilmentFullHeal,undefined);
 for(const had of[false,true]){const t=make({...row(1878),hp:1000});if(!had)t.fighters[1].effects={};turn(t);assert.equal(H.sum(t,'percent'),had?0:3000);assert.equal(t.fighters[0].hp,had?1000:4000);}
});
test('4712契约仅己方，真实敌方龙焉不加面板或HP且没有穿盾标记',()=>{
 const P=require('./helpers/4712-partner.cjs'),s=P.make();assert.deepEqual(s.fighters[1].stats,s.partnerBaseline.stats);assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].soulState.contract1914,undefined);
});
test('4712已确认250独立元素伤害同时穿护盾免攻限伤，不消费护盾和免攻资源',()=>{
 const s=make({soul:true,index:-1,move:21119});s.fighters[1].type='普通';const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='beforeUse'&&c.a.side===0){c.refreshShield(c.t,1000,'confirmed-element');c.t.counts.attackNullify=1;c.timed(c.t,'伤害上限',1,{amount:50});}}};try{turn(s,21119,28935);}finally{E.SOULS=old;}
 assert.equal(H.sum(s),250);assert.equal(s.fighters[1].hp,8750);assert.equal(s.fighters[1].suitState.shield,1000);assert.equal(s.fighters[1].counts.attackNullify,1);assert.equal(s.fighters[1].roundActualSettledSkillDamageTaken??0,0);
});
