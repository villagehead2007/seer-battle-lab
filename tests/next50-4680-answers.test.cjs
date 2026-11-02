'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,sum,key}=require('./helpers/4680-battle.cjs');
test('4680传播逐种继承不同剩余时长，同名更长时长保留，不重新抽取',()=>{
  const s=make({move:37523,index:-1,soul:true});
  const expected={'烈焰诅咒':1,'致命诅咒':2,'虚弱诅咒':5};
  s.fighters[0].ailments={...expected};s.fighters[1].ailments['虚弱诅咒']=8;
  turn(s,37523,28814);
  const applied=s.fighters[0].soulState.belial1886.spreads[0].applied;
  for(const row of applied){assert.equal(row.duration,expected[row.kind]);assert.equal(row.applied,true);}
  assert.equal(s.fighters[1].ailments['烈焰诅咒'],undefined);
  assert.equal(s.fighters[1].ailments['致命诅咒'],2);assert.equal(s.fighters[1].ailments['虚弱诅咒'],8);
});
test('4680借用双攻面板值不受对手或自身正负能力等级改变',()=>{
  const m=source.moves.find(m=>m.effectIds.includes(1538)),index=m.effectInstances.findIndex(e=>e.id===1538);
  let expected;
  for(const stage of[-6,0,6]){const s=make({move:m.id,index,bStats:{atk:100,spa:500}});
    s.fighters[0].stages.atk=stage;s.fighters[1].stages.atk=-stage;s.fighters[1].stages.spa=stage;
    turn(s,m.id,28814);if(expected===undefined)expected=sum(s);assert.equal(sum(s),expected);
  }
});
test('4680真实魂印与全部五招组合执行，无传播时长研究开关',()=>{
  const enemy=require('../research/4628-reviewed-snapshot.json');
  for(const m of source.moves){const other=structuredClone(enemy);other.souls=[];
    const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[source.moves.map(x=>x.id),[20030,10086,37255,20521,37258]],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
    s.rng=0;s.fighters[1].effects['免异常']={start:1,end:99};
    const out=E.resolveTurn(s,[key(m.id),'wiki:20030']);
    assert.equal(out.fighters[0].soulId,1886);assert.equal(out.fighters[0].soulState.basePPCostThisUse.amount,1);
    assert.equal(out.fighters[0].pp[key(m.id)],m.pp-1);
    if(m.kind!=='status')assert.ok(out.fighters[1].hp<9000);
  }
});
