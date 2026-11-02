'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),{make,pick,turn,key,timer}=require('./helpers/4184-battle.cjs');
test('4184时空漩涡仅束缚与切换限制统称，原领域不刷新、不替换且到期后第五不重启',()=>{
 for(const soul of [1408,1580])for(const hp of [500,501]){
  let s=make(pick(1667)[0],{soul,bStats:{maxHp:hp},targetHp:hp});const name=hp>500?'机械领域':'次元领域';s.moveDefinitions[key(s.auditMoveId)].power=0;
  let o=turn(s);assert.equal(o.fighters[0].effects[name].end,3);assert.ok(o.fighters[1].ailments['束缚']>=1);assert.equal(o.fighters[0].effects['时空漩涡'],undefined);
  o=turn(o,920031);o=turn(o,920031);assert.equal(o.fighters[0].effects[name],undefined);assert.equal(o.fighters[0].suitState.shield,500);assert.equal(o.fighters[0].suitState.barrier,500);
  o.fighters[0].pp[key(s.auditMoveId)]=5;o=turn(o,s.auditMoveId);assert.equal(o.fighters[0].effects['机械领域'],undefined);assert.equal(o.fighters[0].effects['次元领域'],undefined);
 }
});
test('4184时空漩涡不让0PP伙伴技能额外可用，领域被清除后第五不恢复领域携带效果',()=>{
 const e=pick(2539)[0];let s=make(e,{soul:1580,carry:true});delete s.fighters[0].effects['机械领域'];s.fighters[0].pp[key(s.auditMoveId)]=0;
 assert.equal(require('./helpers/4184-battle.cjs').E.availableMoves(s.fighters[0],1).includes(key(s.auditMoveId)),false);
 s=make(pick(1667)[0],{soul:1580});delete s.fighters[0].effects['机械领域'];timer(s,1,'免异常');const o=turn(s);assert.equal(o.fighters[1].ailments['束缚'],undefined);assert.equal(o.fighters[0].effects['机械领域'],undefined);assert.equal(o.fighters[0].effects['次元领域'],undefined);
});
