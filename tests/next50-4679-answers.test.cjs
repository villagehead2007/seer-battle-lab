'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,sum,key}=require('./helpers/4679-battle.cjs');
test('4679回初比较扣前能量与上轮扣后值，增伤先制减伤和相等边界真实生效',()=>{
  for(const energy of[7000,7200,9000]){
    const s=make({move:37520,index:-1,soul:true}),b=make({move:37520,index:-1,soul:true});
    turn(s,null,null);turn(b,null,null);
    assert.equal(s.fighters[0].soulState.radiant1885.previousAfterDeduction,7200);
    s.fighters[0].soulState.radiant1885.energy=energy;b.fighters[0].soulState.radiant1885.energy=energy;
    b.fighters[0].soulState.radiant1885.previousAfterDeduction=energy;
    turn(s,37520,37521);turn(b,37520,37521);
    assert.ok(Math.abs(sum(s)-sum(b)*(energy>7200?1.5:1))<=1);
    assert.ok(Math.abs(sum(s,'attack',1)-sum(b,'attack',1)*(energy<7200?.5:1))<=1);
    assert.equal(s.fighters[0].soulState.resolvedPriority.value,b.fighters[0].soulState.resolvedPriority.value+(energy>7200?1:0));
    assert.equal(s.fighters[0].soulState.radiant1885.previousAfterDeduction,energy-1800);
  }
});
test('4679已记录共享封攻在当前承载者上次轮生效一轮，原轮及过期均正常且仍扣PP',()=>{
  const move=source.moves.find(m=>m.effectIds.includes(1090)),index=move.effectInstances.findIndex(e=>e.id===1090);
  const ko=make({move:move.id,index});ko.fighters[1].hp=1;turn(ko,move.id,28812);
  const effect=structuredClone(ko.fighters[1].effects.attackBlock);
  assert.equal(ko.fighters[1].soulState.teamAttackBlock1090.scope,'opponent-team');
  const s=make({move:37520,index:-1});s.fighters[1].effects.attackBlock=effect;
  turn(s,null,37521);assert.ok(sum(s,'attack',1)>0);
  const pp=s.fighters[1].pp[key(37521)];turn(s,null,37521);
  assert.equal(sum(s,'attack',1),0);assert.equal(s.fighters[1].pp[key(37521)],pp-1);
  turn(s,null,37521);assert.ok(sum(s,'attack',1)>0);
});
test('4679真实魂印与全部五招原生组合实际结算PP和HP，无研究模型开关',()=>{
  const enemy=require('../research/4628-reviewed-snapshot.json');
  for(const m of source.moves){const other=structuredClone(enemy);other.souls=[];
    const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[source.moves.map(x=>x.id),[20030,10086,37255,20521,37258]],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
    s.rng=0;s.fighters[1].effects['免异常']={start:1,end:99};
    const out=E.resolveTurn(s,[key(m.id),'wiki:20030']);
    assert.equal(out.fighters[0].soulId,1885);assert.equal(out.fighters[0].soulState.basePPCostThisUse.amount,1);
    assert.equal(out.fighters[0].pp[key(m.id)],m.pp-1);
    if(m.kind!=='status')assert.ok(out.fighters[1].hp<9000);
  }
});
