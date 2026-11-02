'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,make,turn,pick,timer,key,keys}=require('./helpers/3847-battle.cjs');
const e=id=>pick(id)[0];
test('3847 两版魂印回合初锁定异常吸取、禁疗与攻击MISS',()=>{
 for(const soul of [1120,1620]){
  const s=make({moveId:10250,index:null},{soul,hp:1000});s.fighters[1].ailments['失明']=9;
  const o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].hp,6000-o.fighters[0].lastAttackDamage);
  timer(s,0,'回复效果削减',{fraction:1});assert.equal(turn(s).fighters[0].hp,1000);
  const none=make({moveId:10250,index:null},{soul,hp:1000});assert.equal(turn(none).fighters[0].hp,1000);
  const miss=make({moveId:10250,index:null},{soul,hp:1000,hit:false});miss.fighters[1].ailments['失明']=9;timer(miss,0,'攻击必失');const out=turn(miss);assert.equal(out.fighters[0].hp,1000);assert.equal(out.fighters[1].hp,9000);
 }
});
test('3847 两版魂印零伤低伤、300边界、高伤反伤类型和下回合增益',()=>{
 for(const soul of [1120,1620]){
  const s=make({moveId:10250,index:null},{soul});const normal=turn(s,900031,900040),n=9000-normal.fighters[0].hp;
  assert.ok(n<300);assert.equal(normal.fighters[0].effects.id984.start,2);assert.equal(normal.fighters[0].effects['攻击伤害倍数'].multiple,soul===1120?1.8:2);
  const immune=structuredClone(s);timer(immune,0,'小额攻击免疫',{threshold:99999});const zero=turn(immune,900031,900040);assert.equal(zero.fighters[0].hp,9000);assert.equal(zero.fighters[0].effects.id984.amount,1);
  assert.equal(turn(s,900031,900041).fighters[0].effects.id984,undefined);
  const big=make({moveId:10250,index:null},{soul,bStats:{spa:5000}});timer(big,1,'免弱');const high=turn(big,900031,900040),dealt=9000-high.fighters[0].hp;
  assert.ok(dealt>300);assert.equal(9000-high.fighters[1].hp,Math.floor(dealt*(soul===1120?.8:1)));
  if(soul===1620){assert.equal(high.fighters[1].effects['免弱'],undefined);assert.ok(high.fighters[1].ailments['疲惫']);}
  const resisted=structuredClone(big);resisted.fighters[1].build.resistance.percent=50;const out=turn(resisted,900031,900040);assert.equal(9000-out.fighters[1].hp,Math.floor(dealt*(soul===1120?.8:1)*.5));
  let boundary=null;for(let power=40;power<1000&&!boundary;power++){const b=structuredClone(s);b.moveDefinitions[key(900040)].power=power;const o=turn(b,900031,900040);if(9000-o.fighters[0].hp===300)boundary=o;}assert.ok(boundary);assert.equal(boundary.fighters[0].effects.id984,undefined);assert.equal(boundary.fighters[1].hp,9000);
 }
});
test('3847 1181用招异常成功失败免弱和持续消费',()=>{
 let yes=false,no=false;for(let seed=0;seed<30;seed++){const s=make(e(1181),{seed}),o=turn(s);if(o.fighters[1].ailments['失明']){yes=true;assert.equal(o.fighters[1].stages.atk,0);}else{no=true;assert.equal(o.fighters[1].stages.atk,-1);}timer(s,1,'免异常');let b=turn(s);assert.equal(b.fighters[1].stages.atk,-1);b=turn(b,900031);assert.equal(b.fighters[1].stages.atk,-2);b.round=4;assert.equal(turn(b,900031).fighters[1].stages.atk,-2);timer(s,1,'免弱');assert.equal(turn(s).fighters[1].stages.atk,0);}assert.ok(yes&&no);
});
test('3847 1491与2058天敌方向、2057翻倍和强化保护',()=>{
 for(const id of [1491,2058]){const s=make(e(id),{aStats:{spe:1}});s.fighters[0].type=id===1491?'草':'火';s.fighters[1].type=id===1491?'火':'草';assert.equal(turn(s).turns.at(-1).first,0);s.fighters[1].type=s.fighters[0].type;assert.equal(turn(s).turns.at(-1).first,1);}
 const s=make(e(2057));s.fighters[0].type='火';s.fighters[1].type='草';assert.ok(keys.every(k=>turn(s).fighters[0].stages[k]===2));s.fighters[1].type='火';assert.equal(turn(s).fighters[0].stages.atk,1);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);
});
test('3847 55交换双方属性、真实伤害变化及清除和到期共同恢复',()=>{
 const s=make(e(55));s.fighters[0].type='火';s.fighters[1].type='草';const o=turn(s);assert.equal(o.fighters[0].type,'草');assert.equal(o.fighters[1].type,'火');
 const expired=structuredClone(o);expired.round=6;const out=turn(expired,900031);assert.equal(out.fighters[0].type,'火');assert.equal(out.fighters[1].type,'草');
 const clear=make(e(55),{opponentMove:33208,opponentEffectId:1423});clear.fighters[0].type='火';clear.fighters[1].type='草';const restored=turn(clear,undefined,900042);assert.equal(restored.fighters[0].type,'火');assert.equal(restored.fighters[1].type,'草');
 const b=turn(o,900030,900040);assert.ok(b.fighters[0].hp<9000);assert.ok(b.fighters[1].hp<o.fighters[1].hp);
});
test('3847 786动态无放回与1078任一免疫补偿、属性先制窗口',()=>{
 for(const id of [786,1078]){const s=make(e(id));const o=turn(s);const draws=o.randomStatusEvents.filter(x=>x.effectId===id);assert.equal(draws.length,2);assert.notEqual(draws[0].name,draws[1].name);assert.ok(draws.every(x=>[2,3].includes(x.duration)&&x.name!=='山神守护'));}
 const s=make(e(1078),{aStats:{spe:1}});s.fighters[1].counts.immune=1;const o=turn(s);assert.equal(o.fighters[0].effects['属性技能先制'].start,2);assert.equal(turn(o,900031).turns.at(-1).first,0);o.round=4;assert.equal(turn(o,900031).turns.at(-1).first,1);
});
test('3847 1423害怕参数及消回合失败不回复、成功后免控补偿',()=>{
 const s=make(e(1423),{hp:1000});const none=turn(s);assert.equal(none.fighters[0].hp,1000);timer(s,1,'免弱');let o=turn(s);assert.ok(o.fighters[1].ailments['害怕']);assert.equal(o.fighters[0].hp,1000);
 s.fighters[1].counts.immune=1;o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].ailments['害怕'],undefined);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);
});
test('3847 1647低体双吸及百分比免疫真伤、禁疗仍吸取',()=>{
 const s=make(e(1647),{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,7000);assert.equal(o.fighters[1].hp,3000);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);
 const b=make(e(1647),{hp:4500});assert.equal(turn(b).fighters[1].hp,6000);b.fighters[1].soulId=1061;b.fighters[1].soulHash='e7c06bfc';b.fighters[1].soulState.xinFusion=true;const immune=turn(b);assert.equal(immune.fighters[1].hp,8750);assert.equal(immune.fighters[0].hp,7500);
});
test('3847 2284剥离双属性控制失败形成两次属性直伤并消费',()=>{
 const s=make(e(2284));s.fighters[1].counts.immune=2;const o=turn(s);assert.equal(o.fighters[1].type,'普通');assert.equal(o.fighters[0].soulState.typedContracts.length,2);assert.ok(o.fighters[0].soulState.typedContracts.every(x=>x.remaining===1));assert.ok(o.fighters[1].hp<9000);
 const second=turn(o,900031);assert.equal(second.fighters[0].soulState.typedContracts.length,0);assert.ok(second.fighters[1].hp<o.fighters[1].hp);const hp=second.fighters[1].hp;assert.equal(turn(second,900031).fighters[1].hp,hp);
 const ordinary=make(e(2284));ordinary.fighters[1].type='普通';const n=turn(ordinary);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].soulState.typedContracts,undefined);
});
test('3847 1878消回合后吸取与保护失败、1111神游失败增伤',()=>{
 const s=make(e(1878),{hp:1000});timer(s,1,'免弱');const o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].effects['免弱'],undefined);
 const a=make(e(1111));let b=turn(a);assert.ok(b.fighters[1].ailments['神游']);assert.equal(b.fighters[0].effects['攻击伤害倍数'],undefined);a.fighters[1].counts.immune=1;b=turn(a);assert.equal(b.fighters[0].effects['攻击伤害倍数'].multiple,2);
});
test('3847 1821逐槽PP实际回复上限与2456击败回满消费',()=>{
 const s=make(e(1821));s.fighters[0].pp[key(900031)]=5;const o=turn(s);assert.equal(o.fighters[0].pp[key(900031)],7);assert.equal(o.fighters[0].pp[key(38455)],5);
 const b=make(e(2456),{hp:1000,targetHp:1});b.fighters[0].pp[key(900031)]=0;const k=turn(b);assert.equal(k.fighters[1].hp,0);assert.equal(k.fighters[0].hp,9000);assert.equal(k.fighters[0].pp[key(900031)],99);assert.equal(k.fighters[0].counts.defeatFullRestore,0);
 const alive=turn(make(e(2456),{hp:1000}));assert.equal(alive.fighters[0].hp,1000);assert.equal(alive.fighters[0].counts.defeatFullRestore,1);
});
test('3847 1427每回合单次抽样、必中减攻击伤害及固伤不减',()=>{
 let dodged=false,hit=false;for(let seed=0;seed<40;seed++){
  const s=make(e(1427),{seed});s.moveDefinitions[key(900040)].alwaysHit=false;
  const o=turn(s,undefined,900040),state=o.fighters[0].effects['回合闪避失败减伤'];assert.equal(state.rolledRound,1);
  if(state.dodge){dodged=true;assert.equal(o.fighters[0].hp,9000);}else{hit=true;assert.ok(o.fighters[0].hp<9000);}
  const sure=structuredClone(s);sure.moveDefinitions[key(900040)].alwaysHit=true;const yes=turn(sure,undefined,900040);assert.ok(yes.fighters[0].hp<9000);
  const base=make(e(1427),{seed,omit:true});const no=turn(base,undefined,900040);assert.ok(9000-yes.fighters[0].hp<9000-no.fighters[0].hp);
  const next=turn(o,900031,900040);assert.equal(next.fighters[0].effects['回合闪避失败减伤'].rolledRound,2);
 }
 assert.ok(dodged&&hit);
 const base=make(e(1427));timer(base,0,'持续固定伤害',{amount:200});assert.equal(turn(base).fighters[0].hp,8800);
});
test('3847 尸骸开局召唤、剥离增伤及六异常消费边界',()=>{
 const s=make(e(2526));assert.equal(s.fighters[0].soulState.corpseCount,1);
 const names=['失明','失神','易燃','束缚','星哲','狂暴'];
 for(const count of [5,6]){const b=structuredClone(s);names.slice(0,count).forEach(k=>b.fighters[1].ailments[k]=9);const o=turn(b,900031);if(count===5){assert.ok(o.fighters[1].hp>0);assert.equal(o.fighters[0].soulState.corpseCount,1);}else{assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[0].soulState.corpseCount,0);}}
 const strip=make(e(2284));strip.fighters[0].soulState.corpseCount=1;strip.fighters[1].counts.immune=2;const o=turn(strip);assert.equal(o.fighters[0].soulState.contractDamageBonus,100);
 const no=make(e(2284));no.fighters[1].counts.immune=2;assert.ok(turn(no).fighters[1].hp>o.fighters[1].hp);
 o.fighters[0].soulState.corpseCount=0;o.fighters[1].type='火';o.fighters[1].counts.immune=1;assert.equal(turn(o).fighters[0].soulState.contractDamageBonus,100);
});
test('3847 尸骸致死增六项能力值、保命也触发及每回合限一次',()=>{
 const s=make(e(2526),{targetHp:1});s.fighters[1].soulId=881;s.fighters[1].soulHash='';
 const before={...s.fighters[0].stats};const o=turn(s,900030);assert.equal(o.fighters[1].hp,1);
 for(const k of ['maxHp','atk','def','spa','spd','spe'])assert.equal(o.fighters[0].stats[k],before[k]+50,k);
 assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].soulState.corpseLethalRound,1);
 const n=turn(o,900030);assert.equal(n.fighters[0].stats.maxHp,before.maxHp+100);
 const consumed=structuredClone(o);consumed.fighters[0].soulState.corpseCount=0;assert.equal(turn(consumed,900030).fighters[0].stats.maxHp,before.maxHp+50);
});
