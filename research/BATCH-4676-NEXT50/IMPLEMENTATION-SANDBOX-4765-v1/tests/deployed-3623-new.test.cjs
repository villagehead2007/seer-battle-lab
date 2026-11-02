'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3623-battle.cjs');const {E,source,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick}=H;
const dmg=s=>s.fighters[0].lastAttackDamage??0;
test('3623 1348对手用属随机两种、失败消回合、攻击不触发及三回合到期',()=>{
 const e=pick(1348)[0],s=make(e),o=turn(s);assert.equal(o.turns[0].events.filter(x=>/B 方 陷入/.test(x.text)).length,2);
 const im=make(e);im.fighters[1].counts.immune=2;timer(im,1,'id913',{bonus:1});const a=turn(im);assert.equal(a.fighters[1].counts.immune,0);assert.equal(a.fighters[1].effects.id913,undefined);assert.deepEqual(a.fighters[1].ailments,{});
 const attack=make(e);timer(attack,1,'id913',{bonus:1});const b=turn(attack,e.moveId,HIT);assert.ok(b.fighters[1].effects.id913);assert.deepEqual(b.fighters[1].ailments,{});
 let t=turn(make(e),e.moveId,HIT);for(let r=2;r<=4;r++){t.fighters[1].ailments={};t=wait(t);assert.equal(t.turns.at(-1).events.filter(x=>/B 方 陷入/.test(x.text)).length,r<=3?2:0);}
 const blocked=make(e);timer(blocked,0,'skillBlock');assert.deepEqual(turn(blocked).fighters[1].ailments,{});
});
test('3623 1349强化80%暴击与无强化基础率、阈值两侧和禁暴开关',()=>{
 const e=pick(1349)[0];let yes=0,no=0,base=0;for(let seed=0;seed<100;seed++){const s=make(e,{seed,criticals:true});s.fighters[0].stages.acc=1;const o=turn(s),critical=o.turns[0].events.find(x=>x.kind==='damage').detail.includes('暴击 2');if(critical)yes++;else no++;
 const b=make(e,{seed,criticals:true}),plain=turn(b);base+=plain.turns[0].events.find(x=>x.kind==='damage').detail.includes('暴击 2')?1:0;
 const next=(seed+0x6D2B79F5)>>>0;let z=next;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);const probability=((z^z>>>14)>>>0)/4294967296;assert.equal(critical,probability<.8);
 }assert.ok(yes>60&&yes<95);assert.ok(no>0);assert.ok(base<yes);const disabled=make(e);disabled.fighters[0].stages.acc=1;assert.equal(turn(disabled).turns[0].events.find(x=>x.kind==='damage').detail.includes('暴击 2'),false);
});
test('3623 1616两实例克制获得本系、非克制不触发且不叠加',()=>{
 for(const e of pick(1616)){const s=make(e);s.fighters[1].type='超能';const affinity=E.typeEffectiveness(s.moveDefinitions[key(e.moveId)].type,'超能',s.typeChart);assert.ok(affinity>1);const o=turn(s),row=o.turns[0].events.find(x=>x.kind==='damage');assert.ok(row.detail.includes('本系 1.5'));
 const plain=make(e,{omit:true});plain.fighters[1].type='超能';assert.ok(Math.abs(dmg(o)-dmg(turn(plain))*1.5)<=1);
 const equal=make(e);equal.fighters[1].type='普通';assert.ok(turn(equal).turns[0].events.find(x=>x.kind==='damage').detail.includes('本系 1 ×'));
 s.fighters[0].type=s.moveDefinitions[key(e.moveId)].type;assert.ok(turn(s).turns[0].events.find(x=>x.kind==='damage').detail.includes('本系 1.5'));timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);
 }
});
test('3623 1686先手与对手体力较高独立增伤、等值和后手',()=>{
 const e=pick(1686)[0];for(const first of [true,false])for(const n of [4999,5000,5001]){const opts={hp:n,targetHp:5000,aStats:{spe:first?500:1}},s=make(e,opts),a=turn(s),b=turn(make(e,{...opts,omit:true}));const multiple=(first?1.6:1)*(n<5000?1.6:1);assert.ok(Math.abs(dmg(a)-dmg(b)*multiple)<3);assert.equal(a.turns[0].first,first?0:1);const row=a.turns[0].events.find(x=>x.kind==='damage');assert.ok(row.detail.includes('增减伤 '+multiple));}const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
});
test('3623 628弱化条件实际伤害八成回复、无弱化满血禁疗与免伤',()=>{
 const e=pick(628)[0];for(const n of [1000,8999,9000]){const s=make(e,{hp:n});s.fighters[1].stages.acc=-1;const o=turn(s);assert.equal(o.fighters[0].hp,Math.min(9000,n+Math.floor(dmg(o)*.8)));}assert.equal(turn(make(e,{hp:1000})).fighters[0].hp,1000);
 const ban=make(e,{hp:1000});ban.fighters[1].stages.acc=-1;timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);timer(ban,1,'当回合免伤');assert.equal(dmg(turn(ban)),0);
});
test('3623 486下两回合忽略敌方强化、保留弱化和存储等级、药品不触发',()=>{
 const e=pick(486)[0],s=make(e,{aStats:{spe:100},bStats:{spe:80}});allStages(s,1,3);let o=turn(s);assert.equal(o.turns[0].first,1);for(let r=2;r<=4;r++){o.rng=0;const n=turn(o,10535,HIT),base=structuredClone(o);if(r<=3)allStages(base,1,0);const plain=turn(base,10535,HIT);assert.equal(dmg(n),dmg(plain));assert.equal(n.turns.at(-1).first,r<=3?0:1);assert.deepEqual(Object.values(n.fighters[1].stages),Array(6).fill(3));o=n;}
 const weak=turn(make(e));allStages(weak,1,-1);const normal=structuredClone(weak);delete normal.fighters[0].effects['无视对手强化'];assert.equal(dmg(turn(weak,10535)),dmg(turn(normal,10535)));
 const item=turn(make(e));item.fighters[1].stages.atk=3;const a=E.resolveTurn(item,['potion:hp',key(HIT)]),b=structuredClone(item);delete b.fighters[0].effects['无视对手强化'];assert.equal(a.fighters[1].lastAttackDamage,E.resolveTurn(b,['potion:hp',key(HIT)]).fighters[1].lastAttackDamage);
});
const loadouts={light:[37464,37461,37463,32097,IDLE],shadow:[37464,37461,37462,32101,IDLE],equal:[37464,37461,37463,37462,IDLE]};
test('3623 2201携带复合属性逐项计数、60%双分支、相等免疫和未携带不计',()=>{
 const e=pick(2201)[0];for(const [kind,status] of [['light','疲惫'],['shadow','害怕']]){let yes=0,no=0;for(let seed=0;seed<60;seed++){const s=make(e,{loadout:loadouts[kind],seed}),o=turn(s);const found=o.turns[0].events.some(x=>x.text.includes('陷入'+status));if(found)yes++;else no++;assert.equal(o.turns[0].events.some(x=>x.text.includes('陷入'+(status==='疲惫'?'害怕':'疲惫'))),false);}assert.ok(yes>0&&no>0);const im=make(e,{loadout:loadouts[kind]});timer(im,1,'免异常');assert.deepEqual(turn(im).fighters[1].ailments,{});}
 const eq=make(e,{loadout:loadouts.equal});assert.deepEqual(eq.fighters[0].soulState.butterflyMoveTypes,{light:3,shadow:3});assert.deepEqual(turn(eq).fighters[1].ailments,{});
});
test('3623 2202光多必暴暗多吸取、相等同时触发、禁疗免伤与残血',()=>{
 const e=pick(2202)[0];for(const kind of ['light','shadow','equal']){const s=make(e,{loadout:loadouts[kind],hp:1000}),o=turn(s);assert.equal(o.turns[0].events.find(x=>x.kind==='damage').detail.includes('暴击 2'),kind!=='shadow');assert.equal(o.fighters[0].hp,kind==='light'?1000:4000);assert.equal(9000-o.fighters[1].hp-dmg(o),kind==='light'?0:3000);const im=make(e,{loadout:loadouts[kind],hp:1000});timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);assert.equal(turn(im).fighters[0].hp,kind==='light'?1000:4000);}
 const ban=make(e,{loadout:loadouts.equal,hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);const dead=turn(make(e,{loadout:loadouts.equal,hp:1000,targetHp:1}));assert.equal(dead.fighters[0].hp,1000);
});
test('3623 964未击败强化翻倍、零负等级、六级和禁强化',()=>{
 const e=pick(964)[0],s=make(e);Object.assign(s.fighters[0].stages,{atk:2,def:5,spa:-2});const o=turn(s);assert.equal(o.fighters[0].stages.atk,4);assert.equal(o.fighters[0].stages.def,6);assert.equal(o.fighters[0].stages.spa,-2);assert.equal(o.fighters[0].stages.acc,0);const dead=structuredClone(s);dead.fighters[1].hp=1;assert.equal(turn(dead).fighters[0].stages.atk,2);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,2);
});
test('3623 1960击败获得自身三回合保护、未击败无保护和真实消强吸取交互',()=>{
 const e=pick(1960)[0],win=turn(make(e,{targetHp:1}));assert.equal(win.fighters[0].effects['幽蝶强化保护'].end,3);assert.equal(turn(make(e)).fighters[0].effects['幽蝶强化保护'],undefined);
 // Isolate the granted timer on a live current-combatant fixture to exercise
 // removal/steal/expiry without introducing a substitute-entry implementation.
 for(const effectId of [33,85]){const src=require('../data/species/3575.json').snapshot;const foreign=src.moves.find(m=>m.effectIds.includes(effectId));assert.ok(foreign);
 const x={source:src,moveId:foreign.id,index:foreign.effectIds.indexOf(effectId)},s=make({moveId:10535,index:null},{omit:true,opponentEffect:x});s.fighters[0].effects['幽蝶强化保护']=structuredClone(win.fighters[0].effects['幽蝶强化保护']);s.fighters[0].stages.atk=2;let o=turn(s,IDLE,900023);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.atk,0);o=wait(wait(o));assert.equal(turn(o,IDLE,900023).fighters[0].stages.atk,0);}
});

test('3623 完整原第五与觉醒第五按实例顺序组合状态',()=>{
 const original=make({moveId:32102,index:null},{hp:1000});original.fighters[1].stages.acc=-1;original.fighters[0].stages.acc=1;timer(original,1,'id913',{bonus:1});const a=turn(original);assert.equal(a.fighters[1].effects.id913,undefined);assert.equal(a.fighters[0].counts.immune,1);assert.equal(a.fighters[0].hp,1000+Math.floor(dmg(a)*.8));
 const awakened=make({moveId:37464,index:null},{hp:1000,loadout:loadouts.equal});awakened.fighters[0].stages.atk=1;timer(awakened,1,'id913',{bonus:1});const b=turn(awakened);assert.equal(b.fighters[0].hp,4000);assert.equal(b.fighters[0].counts.immune,1);assert.equal(b.fighters[0].stages.atk,2);assert.equal(b.fighters[1].effects.id913,undefined);assert.equal(b.fighters[0].effects['幽蝶强化保护'],undefined);assert.ok(b.turns[0].events.find(x=>x.kind==='damage').detail.includes('暴击 2'));
 const killing=make({moveId:37464,index:null},{hp:1000,targetHp:1,loadout:loadouts.equal});killing.fighters[0].stages.atk=1;const c=turn(killing);assert.equal(c.fighters[0].stages.atk,1);assert.equal(c.fighters[0].hp,1000);assert.equal(c.fighters[0].effects['幽蝶强化保护'].end,3);
});
