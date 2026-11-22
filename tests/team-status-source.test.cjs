'use strict';
const assert=require('node:assert/strict'),test=require('node:test'),store=require('../local-species.cjs'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js');
const member=id=>{const snapshot=store.species(id);return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,spe:900}}};};
function after(id,skill,seed){
 const owner=member(id),target=member(3056);
 if(!owner.moves.includes(skill))owner.moves[1]=skill;
 target.build.overrides.spe=100;
 const g=T.create([[owner],[target,member(2988)]],[0,0],{seed,criticals:false});
 if([31614,38064].includes(skill))g.battle.fighters[1].stages.def=1;
 if(skill===35377)g.battle.fighters[1].stages.def=-1;
 return T.turn(g,['wiki:'+skill,'potion:pp']);
}

const cases=[
  [3383,25516,80,18],[3407,25584,27,18],[3430,25649,27,18],
  [3524,31569,80,115],[3550,25898,27,18],[3576,31838,10,31],
  [4125,27345,27,18],[4169,27453,22,29],[4264,27696,20,2],[4270,35352,10,65],[4305,27797,20,2],
  [3532,24507,10,31],[3532,31614,26,47],[3532,38064,10,31],
  [3847,30814,10,31],[3847,33207,10,31],[4275,35377,26,31]
];
function verifyLock(id,skill,paralysis,stasis){const observed=[];
    for(const [status,seed] of [['瘫痪',paralysis],['凝滞',stasis]]){
      let g=[3532,3847,4275].includes(id)?after(id,skill,seed):require('./helpers/team-lock-source.cjs').battle(id,skill,seed);
      const expires=g.battle.fighters[1].ailments[status];
      assert.ok(expires>=g.battle.round);assert.deepEqual(T.candidates(g,1),[]);
      assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]));
      if(id===4125){
        // 觉醒列奥尼达在异常存在时追加宙变之殢，使目标的异常延续。
        g=T.turn(g,['potion:pp','potion:pp']);
        assert.ok(g.battle.fighters[1].soulState.leonCosmicLayers>0);
        assert.equal(g.battle.fighters[1].ailments[status],expires+1);
        assert.deepEqual(T.candidates(g,1),[]);
        observed.push({active:g.active[1],locked:T.candidates(g,1).length===0});
        continue;
      }
      while(g.battle.round<=expires)g=T.turn(g,['potion:pp','potion:pp']);
      assert.ok(T.candidates(g,1).includes(1));
      g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);observed.push({active:g.active[1],locked:false});
    }
return observed;
}
test('3383 技能 25516 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3383,25516,80,18);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3407 技能 25584 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3407,25584,27,18);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3430 技能 25649 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3430,25649,27,18);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3524 技能 31569 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3524,31569,80,115);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3550 技能 25898 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3550,25898,27,18);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3576 技能 31838 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3576,31838,10,31);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('4125 技能 27345 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(4125,27345,27,18);assert.deepEqual(actual,[{active:0,locked:true},{active:0,locked:true}]);});
test('4169 技能 27453 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(4169,27453,22,29);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('4264 技能 27696 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(4264,27696,20,2);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('4270 技能 35352 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(4270,35352,10,65);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('4305 技能 27797 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(4305,27797,20,2);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3532 技能 24507 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3532,24507,10,31);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3532 技能 31614 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3532,31614,26,47);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3532 技能 38064 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3532,38064,10,31);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3847 技能 30814 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3847,30814,10,31);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('3847 技能 33207 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(3847,33207,10,31);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
test('4275 技能 35377 真实抽中瘫痪和凝滞时均禁止主动换人',()=>{const actual=verifyLock(4275,35377,26,31);assert.deepEqual(actual,[{active:1,locked:false},{active:1,locked:false}]);});
