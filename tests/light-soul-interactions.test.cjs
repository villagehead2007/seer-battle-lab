'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/light-source-battle.cjs'),E=H.E,store=require('../local-species.cjs');
test('新638追加严格取自身上次完整红伤一半，无受攻不追加，重生只一次且清除成功才授免异',()=>{
 const fresh=H.turn(H.make(38633,{soul:true}),H.HIT);assert.equal(H.sum(fresh,'fixed'),0);
 const s=H.make(38633,{soul:true,enemySpeed:1000});s.fighters[1].lastAttackDamage=888;const hit=H.turn(s,H.HIT,H.HIT);const incoming=hit.damageEvents.find(e=>e.sourceSide===1&&e.type==='attack');assert.ok(incoming.settledDamage>0);assert.equal(H.sum(hit,'fixed'),Math.floor(incoming.settledDamage/2));assert.notEqual(H.sum(hit,'fixed'),444);
 for(const clearable of [false,true]){const first=H.make(38633,{soul:true,hp:1,enemyAttack:9999,enemySpeed:1000});if(clearable)first.fighters[1].stages.atk=1;const out=H.turn(first,H.WAIT,H.HIT),f=out.fighters[0];assert.equal(f.soulState.holyReborn,true);assert.equal(f.hp,900);assert.equal(f.stages.atk,0);assert.equal(out.fighters[1].stages.atk,0);const ledger=JSON.stringify(f).includes('soul:638:53bf6afd:rebirth');assert.equal(ledger,clearable);f.hp=1;const dead=H.turn(out,H.WAIT,H.HIT);assert.equal(dead.fighters[0].hp,0);assert.equal(dead.fighters[0].soulState.holyReborn,true);}
});
function paired(id){const a=structuredClone(require('../research/LIGHT-SP-2026-11-07/candidate-13311.json')),b=store.species(id);return E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[[38624,29502,29503,38625,38626],E.WIKI.defaultMoves(b)],criticals:false,builds:[{overrides:{maxHp:1000,atk:10,def:300,spe:1000}},{overrides:{maxHp:9000,atk:10,def:300,spe:10}}]});}
test('SP低额红伤真实触发已部署4050致死跃迁，普通对照不触发且伤害数值不抬高',()=>{
 const s=paired(4050),out=E.resolveTurn(s,['wiki:38624',s.fighters[1].moves.find(k=>s.moveDefinitions[k].kind==='status')??s.fighters[1].moves[0]]);assert.equal(out.fighters[1].soulState.spacetimeJumps,1);const event=out.lethalDamageEvents.find(e=>e.sourceSide===0&&e.type==='attack');assert.ok(event.amount>0&&event.amount<9000);assert.equal(event.deemedLethal,true);
 const plain=paired(4050);plain.fighters[0].soulId=0;const control=E.resolveTurn(plain,['wiki:38624',plain.fighters[1].moves[0]]);assert.equal(control.fighters[1].soulState.spacetimeJumps??0,0);
});
test('已部署4946与SP实战保持非比例致死免伤，免疫后仍支付真实代价',()=>{
 const a=store.species(4946),b=structuredClone(require('../research/LIGHT-SP-2026-11-07/candidate-13311.json'));const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[E.WIKI.defaultMoves(a),[38624,29502,29503,38625,38626]],criticals:false,builds:[{overrides:{maxHp:1000,atk:9999,spa:9999,spe:1000}},{overrides:{maxHp:1000,atk:10,def:300,spd:300,spe:10}}]});const attack=s.fighters[0].moves.find(k=>['physical','special'].includes(s.moveDefinitions[k].kind));assert.ok(attack);const out=E.resolveTurn(s,[attack,'wiki:29502']),st=out.fighters[1].soulState.divineVessel;assert.equal(out.fighters[1].type,'神灵');assert.equal(st.removed,1);assert.ok(st.history.some(x=>x.kind==='immunity-cost'&&x.cost>0));
});
test('新638复活后的两回合威力实际翻倍并到期，不把独立魂印固伤当作威力增幅',()=>{
 let boosted=H.turn(H.make(38633,{soul:true,hp:1,enemyAttack:500,enemySpeed:1000}),H.WAIT,H.HIT);assert.equal(boosted.fighters[0].soulState.holyReborn,true);let plain=structuredClone(boosted);delete plain.fighters[0].effects['灵神重生威力'];
 for(const active of[true,true,false]){const priorA=H.sum(boosted,'attack'),priorB=H.sum(plain,'attack'),nextA=H.turn(boosted,H.HIT),nextB=H.turn(plain,H.HIT),a=H.sum(nextA,'attack')-priorA,b=H.sum(nextB,'attack')-priorB;assert.ok(b>0);if(active)assert.ok(a>b*1.8&&a<b*2.2);else assert.equal(a,b);assert.equal(H.sum(nextA,'fixed'),H.sum(nextB,'fixed'));boosted=nextA;plain=nextB;}
});
test('新638清除奖励的一次免异与既有次数共存并实际消费，清除失败不额外授予',()=>{
 for(const clearable of[false,true]){let s=H.make(38633,{soul:true,hp:1,enemyAttack:500,enemySpeed:1000,enemyMove:29506});s.fighters[0].counts.immune=1;if(clearable)s.fighters[1].stages.atk=1;s=H.turn(s,H.WAIT,H.HIT);assert.equal(s.fighters[0].soulState.holyReborn,true);const count=clearable?2:1;assert.equal(s.fighters[0].counts.immune,count);for(let i=count;i>0;i--){s=H.turn(s,H.WAIT,29506);assert.equal(s.fighters[0].ailments['疲惫'],undefined);assert.equal(s.fighters[0].counts.immune,i-1);}s=H.turn(s,H.WAIT,29506);assert.ok(s.fighters[0].ailments['疲惫']>=s.round-1);assert.equal(s.fighters[0].counts.immune,0);}
});
