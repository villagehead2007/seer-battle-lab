'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,make,turn,timer,sum,key}=require('./helpers/4677-battle.cjs');
test('4677双攻先相加再按本次攻击能力等级修正，正零负等级均与等效面板伤害一致',()=>{
  for(const [move,stat] of [[37554,'atk'],[37555,'spa']])for(const stage of[-6,-2,0,2,6]){
    const s=make({move,index:-1,soul:true,aStats:{atk:101,spa:200}}),b=make({move,index:-1,aStats:{atk:301,spa:301}});
    s.fighters[0].stages[stat]=stage;b.fighters[0].stages[stat]=stage;
    s.fighters[0].stages[stat==='atk'?'spa':'atk']=-stage;
    turn(s,move,null);turn(b,move,null);assert.equal(sum(s),sum(b),`${move}/${stage}`);
  }
});
test('4677吸取双防不计能力等级，目标不足或免疫仍按理论量恢复',()=>{
  for(const stage of[-6,0,6])for(const immune of[false,true]){
    const s=make({move:37554,index:-1,soul:true,hp:1000});s.fighters[1].hp=100;
    s.fighters[1].stages.def=stage;s.fighters[1].stages.spd=stage;
    timer(s,1,'攻击伤害免疫');if(immune)timer(s,1,'固定百分比免疫');
    turn(s,37554,28834);assert.equal(s.fighters[0].hp,1180);assert.equal(sum(s,'percent'),immune?0:180);
    assert.equal(s.fighters[1].hp,immune?100:0);
  }
});
test('4677受控未出招仍在双方行动结束后回返，先于回合末毒伤且不扣PP',()=>{
  const s=make({move:37555,index:-1,soul:true,hp:100});
  const a=s.fighters[0];a.ailments['疲惫']=3;a.ailments['中毒']=3;
  a.soulState.astrolabe1879={ticks:2,rewinding:true,sourceHash:'aee7a3b6'};
  const pp=a.pp[key(37555)];turn(s,37555,null);
  const hits=(s.damageEvents??[]).filter(e=>e.sourceSide===0&&e.type==='attack');
  assert.ok(hits.length>0);assert.equal(s.fighters[0].soulState.astrolabe1879.ticks,1);
  assert.equal(s.fighters[0].pp[key(37555)],pp);assert.equal(s.fighters[0].hp,0);
});
test('4677星启仅比较原面板双攻，能力等级反转高低不改变星赐选择',()=>{
  const s=make({move:37555,index:-1,soul:true,aStats:{atk:201,spa:200}});
  s.fighters[0].stages.atk=-6;s.fighters[0].stages.spa=6;
  const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===0)old.registry[1879].abilities.enlighten(c);}};
  try{turn(s,37555,null);}finally{E.SOULS=old;}
  assert.ok(s.fighters[0].ailments['星赐']);assert.equal(s.fighters[0].ailments['星哲'],undefined);
});
