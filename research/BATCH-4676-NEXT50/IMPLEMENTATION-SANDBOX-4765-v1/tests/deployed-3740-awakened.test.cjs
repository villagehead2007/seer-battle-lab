'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,make,turn,pick,timer,key}=require('./helpers/3740-battle.cjs');
const shields=require('../dist/shield-rules.js');
const e=id=>pick(id)[0],awake=opts=>make(e(2264),{soul:1932,...opts});
test('3740 1932登场盾来源、后加先耗、粉伤上限及来源耗尽不复活',()=>{
 const s=awake();assert.equal(s.fighters[0].suitState.shield,400);assert.equal(shields.sourceValue(s.fighters[0],'canglan-entry'),400);
 // 581 fixed600 on the opposing attack; zero power isolates ordinary attack under Q-N20-4333-003.
 const p=make(e(2264),{soul:1932,opponentMove:32667,opponentEffectId:581});p.moveDefinitions[key(900042)].power=0;const o=turn(p,900031,900042);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].suitState.shield,0);
 const q=structuredClone(p);q.fighters[0].suitState.shield+=400;const r=turn(q,900031,900042);assert.equal(r.fighters[0].suitState.shield,200);assert.equal(shields.sourceValue(r.fighters[0],'canglan-entry'),200);
 const gone=structuredClone(p);shields.consume(gone.fighters[0]);shields.add(gone.fighters[0],100);const g=turn(gone,900031,900042);assert.ok(g.turns[0].events.some(x=>x.text.includes('500')));assert.equal(shields.sourceValue(g.fighters[0],'canglan-entry'),0);
});
test('3740 1932有盾先制与水层当次增伤、八层封顶和无盾泪层',()=>{
 const plain=turn(make(e(2264)),900030),p=9000-plain.fighters[1].hp;
 for(const water of [0,7,8]){const s=awake({aStats:{spe:1}});s.fighters[0].soulState.eternalWater=water;const o=turn(s,900030);assert.equal(o.turns[0].first,0);assert.equal(o.fighters[0].soulState.eternalWater,Math.min(8,water+1));assert.ok(Math.abs((9000-o.fighters[1].hp)-p*(1+Math.min(8,water+1)*.25))<=2);assert.equal(o.fighters[1].soulState.inkTears,undefined);}
 const s=awake();shields.consume(s.fighters[0]);s.fighters[1].soulState.inkTears=3;const o=turn(s,900030);assert.equal(o.fighters[1].soulState.inkTears,4);assert.equal(o.fighters[1].soulState.inkTearsSource,0);assert.equal(o.fighters[0].soulState.eternalWater,undefined);assert.equal(turn(o,900030).fighters[1].soulState.inkTears,4);
 const b=awake();b.fighters[0].ailments['疲惫']=2;assert.equal(turn(b,900030).fighters[0].soulState.eternalWater,undefined);
});
test('3740 1932无盾不耗PP但零PP不可选择，三滴泪仍算护盾状态',()=>{
 const s=awake();shields.consume(s.fighters[0]);assert.equal(turn(s,900031).fighters[0].pp[key(900031)],99);assert.equal(turn(s,900030).fighters[0].pp[key(900030)],99);
 s.fighters[0].pp[key(900030)]=0;assert.ok(!E.availableMoves(s.fighters[0],s).includes(key(900030)));
 const t=awake({aStats:{spe:1}});t.fighters[0].soulState.inkTears=3;const o=turn(t,900030,900040);assert.equal(o.turns[0].first,0);assert.equal(o.fighters[0].suitState.shield,400);assert.ok(o.fighters[0].hp<9000);assert.equal(o.fighters[0].soulState.eternalWater,1);assert.equal(o.fighters[0].pp[key(900030)],98);
});
test('3740 三滴泪停止抵伤不清盾，四滴穿免疫转回复但不穿闪避封招',()=>{
 for(const tears of [2,3]){const s=make(e(2264));s.fighters[1].soulState.inkTears=tears;s.fighters[1].suitState.shield=1000;const o=turn(s,900030);assert.equal(o.fighters[1].suitState.shield===1000,tears===3);assert.equal(o.fighters[1].hp===9000,tears===2);}
 for(const effect of ['攻击伤害免疫','攻击转治疗'])for(const tears of [3,4]){const s=make(e(2264),{targetHp:8000});s.fighters[1].soulState.inkTears=tears;timer(s,1,effect);const o=turn(s,900030);assert.equal(o.fighters[1].hp<8000,tears===4);}
 for(const blocked of ['skillBlock','attackBlock']){const s=make(e(2264));s.fighters[1].soulState.inkTears=4;timer(s,0,blocked);assert.equal(turn(s,900030).fighters[1].hp,9000);}
 const miss=make(e(2264),{hit:false});miss.fighters[1].soulState.inkTears=4;miss.moveDefinitions[key(900030)].alwaysHit=false;miss.moveDefinitions[key(900030)].accuracy=0;assert.equal(turn(miss,900030).fighters[1].hp,9000);
 const dodge=make(e(2264),{hit:false});dodge.fighters[1].soulState.inkTears=4;dodge.moveDefinitions[key(900030)].alwaysHit=false;timer(dodge,1,'概率闪避',{chance:100});assert.equal(turn(dodge,900030).fighters[1].hp,9000);
});
test('3740 1932战阶按受伤分支抵挡下次或实际回复追加，死亡清自己附加的泪',()=>{
 const s=awake({hp:1000});const o=turn(s,900031);assert.equal(o.fighters[0].hp,3250);assert.equal(o.fighters[1].hp,6750);
 const cap=awake({hp:8999});assert.equal(turn(cap,900031).fighters[1].hp,8999);
 const hurt=awake();shields.consume(hurt.fighters[0]);const h=turn(hurt,900031,900040);assert.ok(h.fighters[0].hp<9000);assert.equal(h.fighters[0].counts.attackNullify,1);assert.equal(turn(h,900031,900040).fighters[0].hp,9000);
 const dead=awake({hp:1,bStats:{spa:9999}});shields.consume(dead.fighters[0]);dead.fighters[1].soulState.inkTears=4;dead.fighters[1].soulState.inkTearsSource=0;const d=turn(dead,900031,900040);assert.equal(d.fighters[0].hp,0);assert.equal(d.fighters[1].soulState.inkTears,undefined);
});
test('3740 1932水泪同在锁弱，解除反转失败而普通强化仍可抵消',()=>{
 const s=awake();s.fighters[0].soulState.eternalWater=1;s.fighters[1].soulState.inkTears=1;const o=turn(s,900031);assert.ok(o.fighters[1].effects['弱化不可解除反转']);const no=turn(awake(),900031);assert.equal(no.fighters[1].effects['弱化不可解除反转'],undefined);
 for(const id of [1194,1232]){const c=make(pick(id)[0]);c.fighters[0].stages.atk=-2;timer(c,0,'弱化不可解除反转');assert.equal(turn(c).fighters[0].stages.atk,-2);delete c.fighters[0].effects['弱化不可解除反转'];assert.equal(turn(c).fighters[0].stages.atk,2);}
 const c=make(pick(4)[0]);c.fighters[0].stages.acc=-3;timer(c,0,'弱化不可解除反转');const boosted=turn(c);assert.equal(boosted.fighters[0].stages.acc,-1);
 const clear=make(pick(4)[0]);clear.moveDefinitions[key(clear.auditMoveId)].operations=[{effectId:3,index:0,phase:'afterHit',params:{},sourceArgs:[]}];clear.fighters[0].stages.atk=-2;timer(clear,0,'弱化不可解除反转');assert.equal(turn(clear).fighters[0].stages.atk,-2);delete clear.fighters[0].effects['弱化不可解除反转'];assert.equal(turn(clear).fighters[0].stages.atk,0);
});
test('3740 弱化锁定公共清除范围、正向强化和到期边界',()=>{
 for(const id of [3,533,1157,1209]){const s=awake();s.moveDefinitions[key(900031)].operations=[{effectId:id,index:0,phase:'afterHit',params:id===3?{}:id===533?[]:[1],sourceArgs:id===3||id===533?[]:[1]}];s.fighters[0].stages.atk=-2;s.fighters[0].stages.def=2;timer(s,0,'弱化不可解除反转',{},1,1);const o=turn(s,900031);assert.equal(o.fighters[0].stages.atk,-2);if(id!==3)assert.equal(o.fighters[0].stages.def,0);assert.equal(o.fighters[0].effects['弱化不可解除反转'],undefined);assert.equal(turn(o,900031).fighters[0].stages.atk,0);}
 const s=awake();s.fighters[0].soulState.eternalWater=1;s.fighters[1].soulState.inkTears=1;const o=turn(s,900031);assert.equal(o.fighters[1].effects['弱化不可解除反转'].end,2);delete o.fighters[0].soulState.eternalWater;assert.equal(turn(o,900031).fighters[1].effects['弱化不可解除反转'],undefined);
});
