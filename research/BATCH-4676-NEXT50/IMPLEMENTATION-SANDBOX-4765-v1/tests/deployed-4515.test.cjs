'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4515-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];
const damage=(s,type)=>(s.damageEvents??[]).filter(x=>x.sourceSide===0&&x.type===type).reduce((n,x)=>n+x.settledDamage,0);

test('4515用户003：1878条件读取清除前快照，普通回合成功清除也不吸取，原无回合才吸取',()=>{
 for(const mode of ['none','clear','protected']){
  const s=make(e(1878),{hp:1000});if(mode!=='none')timer(s,1,'测试回合');if(mode==='protected')timer(s,1,'protect');
  const o=turn(s);assert.equal(damage(o,'percent'),mode==='none'?2250:0);assert.equal(o.fighters[0].hp,mode==='none'?3250:1000);
  assert.equal(!!o.fighters[1].effects['测试回合'],mode==='protected');
 }
});

test('4515用户002：复活留场不算击败，2012和2013均不限制复活后的当前对手',()=>{
 for(const id of [2012,2013]){
  const s=make(e(id),{targetHp:1,soul:1727});timer(s,1,'死亡时技能回复');const o=turn(s);
  assert.ok(o.fighters[1].hp>0);assert.equal(o.fighters[1].effects.attackBlock,undefined);assert.equal(o.fighters[1].effects.statusBlock,undefined);
  assert.equal(o.fighters[0].soulState.huoguangNextOpponentRestrictions,undefined);assert.equal(o.fighters[0].soulState.huoguangLastDefeatedRound,undefined);
 }
});

test('4515用户001：真实击败在非首回合记录完整红伤且狂刃到R加3，保1不触发升级',()=>{
 const s=make(e(2011),{soul:1727,targetHp:1});s.round=4;const o=turn(s);
 assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[0].soulState.huoguangFrenzyEnd,7);
 assert.equal(o.fighters[0].soulState.huoguangDefeatAttackDamage,damage(o,'attack'));assert.ok(damage(o,'attack')>1);
 const p=make(e(2011),{soul:1727,targetHp:1});timer(p,1,'致命保留',{hp:1});const q=turn(p);
 assert.equal(q.fighters[1].hp,1);assert.equal(q.fighters[0].soulState.huoguangFrenzyEnd,undefined);
});

test('4515用户001关联2011：R加3末仍加倍，R加4回原刃，不截断保存真伤基数',()=>{
 for(const x of H.pick(2011))for(const round of [4,5]){
  const s=make(x,{soul:1727});s.round=round;s.fighters[0].soulState.huoguangFrenzyEnd=4;s.fighters[0].soulState.huoguangDefeatAttackDamage=777;
  const b=structuredClone(s);b.moveDefinitions[key(x.moveId)].operations=[];
  const o=turn(s),control=turn(b);assert.ok(Math.abs(damage(o,'attack')-damage(control,'attack')*(round===4?2:1))<=2);
  assert.equal(damage(o,'true'),round===4?777:0);
 }
});

test('4515全部17真实技能与1727：零威力第五仍执行全强、控制、回复PP及真实吸取',()=>{
 const other=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,17);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36657))ids[ids.length-1]=36657;
  const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const enemy=other.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);assert.equal(s.fighters[0].soulId,1727);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);
  assert.equal(o.fighters[0].pp[key(m.id)],m.id===36657?m.pp:m.pp-1);
  if(m.id===36657){assert.equal(damage(o,'attack'),0);assert.equal(damage(o,'fixed'),250,'满体力时按原始250吸取，不触发低体翻倍');assert.equal(o.fighters[0].stages.atk,1);assert.equal(o.fighters[1].stages.atk,1);assert.ok(o.turns.at(-1).events.some(x=>x.text.includes('攻击等级 0 → 2')),'先手全强2实际发生，随后1722魔祖之嗟令双方能力发生变化');}
 }
});
