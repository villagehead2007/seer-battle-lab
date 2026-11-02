'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,make,turn,timer,pick}=require('./helpers/3865-battle.cjs');
const e=id=>pick(id)[0],m=id=>({moveId:id,index:null});

test('3865 88三倍概率实际伤害与482概率先制',()=>{
 let tripled=false,ordinary=false;for(let seed=0;seed<160;seed++){const q=make(e(88),{seed}),plain=make(e(88),{seed,omit:true});const d=turn(q).fighters[0].lastAttackDamage,b=turn(plain).fighters[0].lastAttackDamage;if(d>2*b)tripled=true;else ordinary=true;}assert.ok(tripled&&ordinary);
 for(const x of pick(482)){const firsts=new Set();for(let seed=0;seed<60;seed++)firsts.add(turn(make(x,{seed,aStats:{spe:1}})).turns[0].first);assert.deepEqual([...firsts].sort(),[0,1]);}
});

test('3865 597用招吸取实际回复、禁疗与到期',()=>{
 const q=turn(make(e(597),{hp:1000}));assert.equal(q.fighters[0].hp,4000);assert.equal(q.fighters[1].hp,6000);
 const next=turn(q,900031);assert.equal(next.fighters[0].hp,7000);assert.equal(next.fighters[1].hp,3000);
 const block=make(e(597),{hp:1000});timer(block,0,'技能禁疗');const b=turn(block);assert.equal(b.fighters[0].hp,1000);assert.equal(b.fighters[1].hp,6000);
 q.round=5;const expired=turn(q,900031);assert.equal(expired.fighters[0].hp,q.fighters[0].hp);assert.equal(expired.fighters[1].hp,q.fighters[1].hp);
});

test('3865 1221反转弱化后免异常次数与无弱化不获得',()=>{
 const q=make(e(1221));q.fighters[0].stages.atk=-3;q.fighters[0].stages.spe=-6;const n=turn(q);assert.equal(n.fighters[0].stages.atk,3);assert.equal(n.fighters[0].stages.spe,6);assert.equal(n.fighters[0].counts.immune,1);
 n.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const first=turn(n,900031);assert.equal(first.fighters[0].counts.immune,0);assert.equal(first.fighters[0].ailments['害怕'],undefined);assert.ok(turn(first,900031).fighters[0].ailments['害怕']);assert.equal(turn(make(e(1221))).fighters[0].counts.immune,undefined);
});

test('3865 护盾护罩真实承伤、1326盾强化翻倍与禁强化',()=>{
 for(const [id,field]of [[847,'shield'],[1342,'barrier']]){const q=turn(make(e(id)));assert.equal(q.fighters[0].suitState[field],300);const hp=q.fighters[0].hp;if(id===1342)q.moveDefinitions[key(900041)].operations=[{effectId:683,index:0,phase:'afterHit',params:[100,100],sourceArgs:[100,100]}];const n=turn(q,900031,id===1342?900041:900040);assert.equal(n.fighters[0].hp,hp);assert.ok(n.fighters[0].suitState[field]<300);}
 for(const shield of [0,1,300]){const q=make(e(1326));q.fighters[0].suitState.shield=shield;assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===(shield?2:1)));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===0));}
});

test('3865 741高额免伤严格300边界、到期与小伤害',()=>{
 const active=turn(make(e(741))).fighters[0].effects['大额攻击免疫'];assert.equal(active.end,2);
 let boundary=false;for(let spa=2970;spa<3030;spa++){const q=make(undefined,{bStats:{spa},aStats:{spd:300}});q.round=2;const plain=turn(q,900031,900040),damage=9000-plain.fighters[0].hp;if(damage<299||damage>301)continue;q.fighters[0].effects['大额攻击免疫']=structuredClone(active);assert.equal(9000-turn(q,900031,900040).fighters[0].hp,damage>300?0:damage);if(damage===300)boundary=true;q.round=3;assert.equal(9000-turn(q,900031,900040).fighters[0].hp,damage);}
 assert.ok(boundary);
});

test('3865 843下两回合先制与980先手封属后手不封',()=>{
 const active=turn(make(e(843))).fighters[0].effects.id984;assert.equal(active.amount,2);for(const round of [1,2,3,4]){const q=make(undefined,{aStats:{spe:1}});q.round=round;q.fighters[0].effects.id984=structuredClone(active);assert.equal(turn(q).turns[0].first,round===2||round===3?0:1);}
 const fast=turn(make(e(980)));assert.equal(fast.fighters[1].effects.statusBlock,undefined);assert.ok(fast.turns[0].events.some(e=>e.text.includes('技能被封锁')));assert.equal(fast.fighters[1].pp[key(900041)],98);const slow=turn(make(e(980),{aStats:{spe:1}}));assert.equal(slow.fighters[1].effects.statusBlock,undefined);assert.equal(slow.fighters[1].pp[key(900041)],98);
});

test('3865 486下两回合忽略强化的实际伤害与速度',()=>{
 const active=turn(make(e(486))).fighters[0].effects['无视对手强化'];assert.equal(active.start,2);assert.equal(active.end,3);
 for(const round of [1,2,3,4]){const q=make(undefined,{aStats:{spe:150},bStats:{spe:100}});q.round=round;q.fighters[1].stages.def=6;q.fighters[1].stages.spe=6;q.fighters[0].effects['无视对手强化']=structuredClone(active);const n=turn(q),plain=structuredClone(q);plain.fighters[1].stages.def=0;plain.fighters[1].stages.spe=0;const base=turn(plain);if(round===2||round===3){assert.equal(n.fighters[0].lastAttackDamage,base.fighters[0].lastAttackDamage);assert.equal(n.turns[0].first,0);}else{assert.ok(n.fighters[0].lastAttackDamage<base.fighters[0].lastAttackDamage);assert.equal(n.turns[0].first,1);}}
});

test('3865 99混乱概率成功失败、独立默认时长与免疫',()=>{
 const seen=new Set();let failed=false;
 for(let seed=0;seed<250;seed++){const q=make(e(99),{seed}),n=turn(q),end=n.fighters[1].ailments['混乱'];if(end)seen.add(end);else failed=true;}
 assert.deepEqual([...seen].sort(),[2,3]);assert.ok(failed);
 for(let seed=0;seed<40;seed++){const q=make(e(99),{seed});timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['混乱'],undefined);}
 const q=make(e(99));q.fighters[1].ailments['混乱']=8;assert.equal(turn(q).fighters[1].ailments['混乱'],8);
});

test('3865 498暴击概率增加实际伤害、持续边界与必暴交互',()=>{
 const s=turn(make(e(498)));assert.equal(s.fighters[0].effects['要害概率增加'].chance,1/8);assert.equal(s.fighters[0].effects['要害概率增加'].end,2);
 let increased=0;for(let seed=0;seed<200;seed++){const q=make(undefined,{criticals:true,seed});q.round=2;q.fighters[0].effects['要害概率增加']=structuredClone(s.fighters[0].effects['要害概率增加']);const no=structuredClone(q);delete no.fighters[0].effects['要害概率增加'];if(turn(q).fighters[0].lastAttackDamage>turn(no).fighters[0].lastAttackDamage)increased++;q.round=3;no.round=3;assert.equal(turn(q).fighters[0].lastAttackDamage,turn(no).fighters[0].lastAttackDamage);timer(q,0,'必定暴击');timer(no,0,'必定暴击');assert.equal(turn(q).fighters[0].lastAttackDamage,turn(no).fighters[0].lastAttackDamage);}
 assert.ok(increased>0);
});

test('3865 能力实例4成功、禁强化和六级边界',()=>{
 for(const x of pick(4)){const q=make(x);assert.equal(turn(q).fighters[0].stages[keys[x.params[0]]],x.params[2]);timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].stages[keys[x.params[0]]],0);delete q.fighters[0].effects['禁强化'];q.fighters[0].stages[keys[x.params[0]]]=6;assert.equal(turn(q).fighters[0].stages[keys[x.params[0]]],6);}
});

test('3865 167弱化固伤80与848每项100，免伤和空弱化',()=>{
 for(const id of [167,848]){const q=make(e(id)),plain=turn(q);assert.equal(9000-plain.fighters[1].hp,plain.fighters[0].lastAttackDamage);q.fighters[1].stages.atk=-1;q.fighters[1].stages.spe=-6;const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,id===167?80:200);q.fighters[1].build.resistance.fixed=100;const blocked=turn(q);assert.equal(9000-blocked.fighters[1].hp,blocked.fighters[0].lastAttackDamage);}
});

test('3865 132低体威力翻倍严格边界与776下两回合增伤',()=>{
 const low=turn(make(e(132),{hp:8999})),equal=turn(make(e(132)));assert.ok(low.fighters[0].lastAttackDamage>equal.fighters[0].lastAttackDamage*1.9);
 const active=turn(make(e(776)));assert.equal(active.fighters[0].effects.doubleDamage.start,2);assert.equal(active.fighters[0].effects.doubleDamage.end,3);
 for(const round of [1,2,3,4]){const q=make();q.round=round;q.fighters[0].effects.doubleDamage=structuredClone(active.fighters[0].effects.doubleDamage);const no=structuredClone(q);delete no.fighters[0].effects.doubleDamage;const damage=turn(q).fighters[0].lastAttackDamage,base=turn(no).fighters[0].lastAttackDamage;assert.ok(round===2||round===3?damage>=2*base&&damage<=2*base+1:damage===base);}
});

test('3865 1187害怕成功、免疫失败清回合及免断',()=>{
 const q=make(e(1187));timer(q,1,'免弱');const n=turn(q);assert.ok(n.fighters[1].ailments['害怕']);assert.ok(n.fighters[1].effects['免弱']);q.fighters[1].counts.immune=1;assert.equal(turn(q).fighters[1].effects['免弱'],undefined);timer(q,1,'protect');assert.ok(turn(q).fighters[1].effects['免弱']);
});
test('3865 基础17招伤害PP、零PP拒绝、封招和控制逐招',()=>{
 for(const move of source.moves){const s=make(m(move.id),{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(move.id)],move.pp-1);if(move.kind==='status')assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*move.power*180/300)/50)+2,stab=require('./helpers/source-stab.cjs')(move.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(move.type,s.fighters[1].type,s.typeChart)*.89));}
 const no=make(m(move.id),{omit:true});no.fighters[0].pp[key(move.id)]=0;assert.throws(()=>turn(no));const b=make(m(move.id),{omit:true});timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);b.fighters[0].ailments['疲惫']=2;assert.equal(turn(b).fighters[0].pp[key(move.id)],move.pp);}
});
test('3865 基础17招先制、MISS、必中与暴击实际伤害',()=>{
 for(const move of source.moves){const s=make(m(move.id),{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(s).turns[0].first,move.priority>0?0:1);
 const q=make(m(move.id),{omit:true}),plain=turn(q);timer(q,0,'必定暴击');const crit=turn(q);if(move.kind!=='status'){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=2*n&&crit.fighters[0].lastAttackDamage<=2*n+1);}
 if(!move.alwaysHit){let missed=false;for(let seed=0;seed<40&&!missed;seed++){const q=make(m(move.id),{omit:true,hit:false,seed});q.fighters[0].stages.acc=-6;const n=turn(q);if(n.turns[0].events.some(x=>x.text.includes('未命中'))){missed=true;assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(move.id)],move.pp-1);}}assert.ok(missed,String(move.id));}}
});
