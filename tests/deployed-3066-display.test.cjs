'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{make,turn}=require('./helpers/3066-native.cjs'),pp='potion:pp';
function items(s){const before=structuredClone(s),v=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return v;}
test('3066当前烧伤条件独立于最近排序快照，真实敌方逆转清烧后立即显示未满足，读状态不改写',()=>{
 let s=make(10001,{enemyId:3056,enemyMoves:[23285],bAilments:{烧伤:3}});assert.equal(items(s).find(x=>x.name==='鬼焰 · 当前烧伤条件').value,'对手烧伤：技能先制+1、攻击威力×2');s=turn(s,pp,23285);assert.equal(s.fighters[0].soulState.luxunBurning,true);assert.equal(s.fighters[1].ailments['烧伤'],undefined);assert.equal(items(s).find(x=>x.name==='鬼焰 · 当前烧伤条件').value,'对手未烧伤：无魂印先制与威力加成');s.fighters[0].soulHash='unverified-source';assert.ok(!items(s).some(x=>x.name==='鬼焰 · 当前烧伤条件'));
});
test('3066延迟62显示真实第六回合结算且要求双方令牌相配，实际天马消回合后不留有效计时',()=>{
 let s=turn(make(23344,{enemyId:3014,enemyMoves:[19199]}),23344);assert.equal(items(s).find(x=>x.name==='延迟决胜 · 计时').value,'第 6 回合结算 · 任一方换人或被消回合即失效');s=turn(s,pp,19199);assert.equal(items(s).find(x=>x.name==='延迟决胜 · 计时'),undefined);
});
