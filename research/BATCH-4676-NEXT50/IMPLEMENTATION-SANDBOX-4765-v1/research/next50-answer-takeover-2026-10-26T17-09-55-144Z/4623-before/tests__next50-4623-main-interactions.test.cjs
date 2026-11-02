'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4623-battle.cjs'),entry=id=>H.entries.find(x=>x.id===id),red=(s,side=1)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.targetSide===side&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);
function capture(s,move=s.auditMoveId,other=920041){const old=H.E.SOULS;let pp;H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===0)pp=c.a.pp[H.key(move)];}};try{return {state:H.turn(s,move,other),pp};}finally{H.E.SOULS=old;}}
test('4623主线1830首次共同值伤害盾支撑1487真实第五先制，满HP攻击PP实际消耗再回复',()=>{
  const e=entry(1487),s=H.make(e,{soul:1830,aStats:{atk:30}}),first=capture(s,920030),a=first.state.fighters[0],damage=red(first.state);
  assert.ok(damage>0&&damage<100);assert.equal(first.state.fighters[1].hp,9000-damage);assert.equal(a.suitState.shield,damage);assert.equal(a.hp,9000);assert.equal(first.pp,98);assert.equal(a.pp[H.key(920030)],99);for(const k of H.keys)assert.equal(a.stages[k],1);
  first.state.fighters[1].stats.spe=1000;assert.equal(a.stats.spe,500);const second=capture(first.state),o=second.state;
  assert.equal(o.turns[1].first,0);assert.equal(o.fighters[0].soulState.resolvedPriority.value,1);assert.equal(second.pp,4);assert.equal(o.fighters[0].pp[H.key(e.moveId)],5);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].suitState.shield,damage+red(o));assert.ok(o.fighters[0].suitState.shield<300);
});
test('4623主线1830后手明确转化三回合流血后2137读取当前异常，等于已有三回合且高于一回合',()=>{
  const e=entry(2137),results={};for(const mode of ['convert','three','one']){const s=H.make(e,{soul:1830,aStats:{spe:1},bStats:{spe:500}});s.fighters[0].soulState.qualifiedBleed1830={duration:3};s.fighters[0].ailments[mode==='convert'?'烧伤':'流血']=mode==='one'?1:mode==='convert'?1:3;const o=H.turn(s,e.moveId,920040);assert.equal(o.turns[0].first,1);assert.equal(o.fighters[0].ailments['烧伤'],undefined);if(mode!=='one')assert.equal(o.fighters[0].ailments['流血'],3);assert.equal(o.fighters[0].pp[H.key(e.moveId)],4);assert.ok(o.fighters[0].hp<9000);assert.ok(red(o)>0);results[mode]=red(o);}
  assert.equal(results.convert,results.three);assert.ok(results.convert>results.one);
});
