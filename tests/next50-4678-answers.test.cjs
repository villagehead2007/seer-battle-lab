'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,key,timer}=require('./helpers/4678-battle.cjs');
test('4678魂印前三回合仅结束回复300与2PP，技能禁疗不阻挡魂印且第四回合停止',()=>{
  const s=make({move:37518,index:-1,soul:true,hp:1000});timer(s,0,'技能禁疗');
  const old=E.SOULS,observed=[];E.SOULS={...old,run(event,c){if(event==='beforeUse'&&c.a.side===0)observed.push(c.a.hp);old.run(event,c);}};
  try{for(let round=1;round<=4;round++){
    s.fighters[0].hp=1000;s.fighters[0].pp[key(37516)]=1;turn(s,37518,28811);
    assert.equal(s.fighters[0].hp,round<=3?1300:1000);
    assert.equal(s.fighters[0].pp[key(37516)],round<=3?3:1);
  }}finally{E.SOULS=old;}
  assert.deepEqual(observed,[1000,1000,1000,1000]);
});
test('4678真实魂印与全部五招原生组合实际用招并在回末回复PP',()=>{
  const enemy=require('../research/4628-reviewed-snapshot.json');
  for(const m of source.moves){const other=structuredClone(enemy);other.souls=[];
    const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[[37516,28811,37517,37518,37519],[20030,10086,37255,20521,37258]],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
    s.rng=0;s.fighters[1].effects['免异常']={start:1,end:99};
    const out=E.resolveTurn(s,[key(m.id),'wiki:20030']);
    assert.equal(out.fighters[0].soulId,1884);assert.equal(out.fighters[0].soulState.basePPCostThisUse.amount,1);
    assert.equal(out.fighters[0].pp[key(m.id)],m.pp);
    if(m.kind!=='status')assert.ok(out.fighters[1].hp<9000);
  }
});
