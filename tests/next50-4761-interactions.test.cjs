'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4761-battle.cjs'),{E,source,key,make,turn}=H;
function observed(s,event,side,fn,a=s.auditMoveId,b=20142){const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);if(e===event&&c.a.side===side)fn(c);}};try{return turn(s,a,b);}finally{E.SOULS=old;}}

test('4761公共初始化entryAilment在真实反弹被清后记录抗性窗口及次数免异，阶段不错误补偿回血；受控入口不冒称额外原生招',()=>{
 for(const mode of ['window','count']){
  const a=structuredClone(source),b=structuredClone(require('../research/BATCH-4676-NEXT50/4676/snapshot.json'));
  a.selectedSoulId=1972;b.souls=[];delete b.selectedSoulId;
  for(const pet of [a,b])for(const m of pet.moves){m.effectInstances=[];m.effectIds=[];m.description='';m.deferredEffects=[];m.limitations=[];}
  const status=b.moves.find(m=>m.kind==='status'&&!m.fifth);assert.ok(status);
  const ids=[status.id,...b.moves.filter(m=>!m.fifth&&m.id!==status.id).slice(0,3).map(m=>m.id),b.moves.find(m=>m.fifth).id];
  const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);if(e==='battleStart'&&c.a.side===1){assert.equal(c.clear(c.t),true);assert.equal(c.t.effects['琉梦登场反弹'],undefined);c.t.hp=1000;if(mode==='window')c.t.resistUntil=1;else c.t.counts.immune=1;assert.equal(c.entryAilment(c.t,'烧伤',2),false);}}};
  let s;try{s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[[14102,20142,29055,29056,37930],ids],criticals:false,builds:[{suit:'none',overrides:{maxHp:9000,spe:500}},{suit:'none',overrides:{maxHp:9000,spe:100}}]});}finally{E.SOULS=old;}
  assert.equal(s.entryStatusEvents.at(-1).reason,mode==='window'?'resistance-window':'count-immunity');
  const entry=s.fighters[0].soulState.entries1972[0];assert.equal(entry.immune,mode==='count');assert.deepEqual(entry.ambiguous,mode==='window'?['resistance-window']:[]);
  turn(s,20142,status.id);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[0].ailments['烧伤'],undefined);assert.equal(s.fighters[0].soulState.entries1972.length,0);assert.equal(s.fighters[0].soulState.dream1972.flower,2);
 }
});

test('4761魔王咒怨概率公共资源按同回合同次实际使用身份只抽一次，下一使用重新抽；受控组件不冒充额外学会多段技能',()=>{
 const s=make({move:14102,index:-1}),a=s.fighters[0],t=s.fighters[1];a.soulState.magicCurse1973=10;
 let use=1,draws=0;const ability=E.SOULS.registry[1972].abilities.curseOutgoing;
 const context=()=>({a,t,m:{id:key(14102)},round:1,modifier:1,effectUseCount:()=>use,random:()=>++draws===1?.28:.99});
 const first=context();ability(first);assert.equal(draws,1);assert.equal(first.minimumDamage,9000);assert.equal(first.modifier,1.5);assert.equal(first.magicMinimumAfter1973,false);
 const same=context();ability(same);assert.equal(draws,1);assert.equal(same.minimumDamage,9000);assert.equal(same.modifier,1.5);
 use=2;const next=context();ability(next);assert.equal(draws,2);assert.equal(next.minimumDamage,undefined);assert.equal(next.modifier,1.5);
 for(const c of [first,same,next])for(const field of ['ignoreShield','ignoreImmunity','ignoreLimit'])assert.equal(c[field],undefined);
});

test('4761十层咒怨只免控制不免中毒，非红百分比毒伤仍完整1125不被五成红减伤错误缩小',()=>{
 const s=make({move:20142,index:-1});s.fighters[0].soulState.magicCurse1973=10;
 observed(s,'afterUse',1,c=>{assert.equal(c.ailment(c.t,'睡眠',c.a,false,false,2),false);assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),true);});
 assert.equal(s.fighters[0].ailments['睡眠'],undefined);assert.ok(s.fighters[0].ailments['中毒']);assert.equal(s.fighters[0].hp,7875);
 const poison=(s.damageEvents??[]).filter(e=>e.type==='percent'&&e.targetSide===0);assert.equal(poison.length,1);assert.equal(poison[0].settledDamage,1125);assert.equal(poison[0].hpLoss,1125);
});
