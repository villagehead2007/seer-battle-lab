'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4642-battle.cjs'),{make,pick,turn,timer,key}=H;
const x=pick(1356)[0],events=(s,type,round=s.round-1)=>(s.damageEvents??[]).filter(e=>e.round===round&&e.sourceSide===0&&e.targetSide===1&&e.type===type),sum=(s,type)=>events(s,type).reduce((n,e)=>n+e.settledDamage,0);
function full(policy,options={}){
  const s=make({moveId:37348,index:null},{soul:1843,criticals:true,seed:0,...options,policies:{qualifiedBlackAilment1843:'skill-end',...(policy?{qualified1356Unit4642:policy}:{}),...(options.policies??{})}});
  turn(s,920031); // Actual property selection and use by complete1843; next round native critical guarantee.
  assert.equal(s.fighters[0].pp[key(920031)],98);
  assert.equal(s.fighters[0].pp[key(37348)],5);
  assert.equal(s.fighters[0].soulState.blackAttackRound1843,2);
  return s;
}
test('4642原生1356强暴多段打完整招后仅一次3000百分附伤',()=>{const s=full(),o=turn(s),red=events(o,'attack'),pink=events(o,'percent');assert.equal(o.fighters[0].pp[key(37348)],4);assert.ok(red.length>=15&&red.length<=17);assert.equal(pink.length,1);assert.equal(pink[0].settledDamage,3000);assert.equal(o.fighters[1].hp,9000-sum(o,'attack')-3000);assert.equal(o.fighters[0].soulState.ayami1356Round,2);assert.equal(o.fighters[0].soulState.pending1356Multi4642,undefined);});

test('4642真实37348与1843明确逐暴段即时1356每段3000会提前KO而真正整招后一次完成15段再3000',()=>{
  const totals={};
  for(const policy of ['per-critical-hit','skill-end-once']){
    const s=full(policy),o=turn(s),red=events(o,'attack'),pink=events(o,'percent'),criticalEvents=o.turns.at(-1).events.filter(e=>e.text.includes('损失')&&e.text.includes('致命一击'));
    assert.equal(o.fighters[0].pp[key(37348)],4);assert.equal(criticalEvents.length,red.length);
    assert.ok(red.every(e=>e.settledDamage>0));assert.ok(pink.every(e=>e.settledDamage===3000));
    if(policy==='per-critical-hit'){assert.equal(o.fighters[1].hp,0);assert.equal(pink.length,3);assert.ok(red.length<15);}
    else{assert.ok(red.length>=15&&red.length<=17);assert.equal(pink.length,1);assert.equal(o.fighters[1].hp,9000-sum(o,'attack')-3000);assert.ok(o.fighters[1].hp>0);assert.equal(o.fighters[0].soulState.pending1356Multi4642,undefined);}
    totals[policy]={red:red.length,pink:sum(o,'percent')};
  }
  assert.ok(totals['skill-end-once'].red>totals['per-critical-hit'].red);assert.equal(totals['per-critical-hit'].pink,9000);assert.equal(totals['skill-end-once'].pink,3000);
});
test('4642真实1356多段无暴共同不附伤单段必暴仍3000且控制未用整招封锁不误守卫',()=>{
  const noCrit=make({moveId:37348,index:null},{criticals:false}),o=turn(noCrit);
  assert.ok(events(o,'attack').length>=15);assert.equal(sum(o,'percent'),0);assert.equal(o.fighters[0].pp[key(37348)],4);
  const single=make(x,{criticals:true});timer(single,0,'必定暴击');const z=turn(single);
  assert.equal(events(z,'attack').length,1);assert.equal(sum(z,'percent'),3000);assert.equal(z.fighters[1].hp,9000-sum(z,'attack')-3000);
  for(const mode of ['control','blocked']){const s=full();if(mode==='control')s.fighters[0].ailments['疲惫']=3;else timer(s,0,'attackBlock');const q=turn(s);assert.equal(q.fighters[0].pp[key(37348)],mode==='control'?5:4);assert.equal(sum(q,'attack'),0);assert.equal(sum(q,'percent'),0);assert.equal(q.fighters[1].hp,9000);}
});
test('4642真实37348多段1356两明确单位遇永久免粉均0附伤但仍完整强暴红伤不伪单位已答',()=>{
  for(const policy of ['per-critical-hit','skill-end-once']){const s=full(policy);timer(s,1,'固定百分比免疫');const o=turn(s),red=events(o,'attack');assert.ok(red.length>=15&&red.length<=17);assert.equal(sum(o,'percent'),0);assert.equal(o.fighters[1].hp,9000-sum(o,'attack'));assert.equal(o.fighters[0].pp[key(37348)],4);}
});
test('4642真实1356整招后政策以round move use隔离连续两次实际用招不漏附加也不残留token',()=>{
  const s=full('skill-end-once');timer(s,1,'固定百分比免疫');turn(s);assert.equal(s.fighters[0].soulState.pending1356Multi4642,undefined);
  delete s.fighters[1].effects['固定百分比免疫'];timer(s,0,'必定暴击');const hp=s.fighters[1].hp,o=turn(s);
  assert.equal(o.fighters[0].pp[key(37348)],3);assert.equal(sum(o,'percent'),3000);assert.equal(o.fighters[1].hp,hp-sum(o,'attack')-3000);assert.equal(o.fighters[0].soulState.pending1356Multi4642,undefined);
});
test('4642真实37348混合暴击与未暴段明确整招后1356只3000且依据实际合格暴段而非最后段',()=>{
  let witnessed=false;
  for(let seed=0;seed<30&&!witnessed;seed++){
    const s=make({moveId:37348,index:null},{criticals:true,seed,policies:{qualified1356Unit4642:'skill-end-once'}}),o=turn(s),red=events(o,'attack'),pink=events(o,'percent'),redLogs=o.turns.at(-1).events.filter(e=>e.text.includes('损失')&&e.text.includes('结算伤害')),critical=redLogs.filter(e=>e.text.includes('致命一击'));
    if(critical.length>0&&critical.length<red.length&&!redLogs.at(-1).text.includes('致命一击')){
      witnessed=true;assert.ok(red.length>=15&&red.length<=17);assert.ok(critical.length<red.length);assert.equal(pink.length,1);assert.equal(sum(o,'percent'),3000);assert.equal(o.fighters[1].hp,9000-sum(o,'attack')-3000);assert.equal(o.fighters[0].pp[key(37348)],4);assert.equal(o.fighters[0].soulState.pending1356Multi4642,undefined);
    }
  }
  assert.ok(witnessed,'at least one real native random-crit use has mixed criticals and a noncritical final red segment');
});
