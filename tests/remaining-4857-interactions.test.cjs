'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4857/snapshot.json'),{key,make,turn,timer,sum}=require('./helpers/remaining-battle.cjs')(source);
test('4857/453已命中零红仍清强附害怕，次数免异只挡害怕不回滚清强，强化保护使清强失败不附害怕',()=>{
 const a=make({move:38216,index:0});a.fighters[1].stages.def=2;timer(a,1,'攻击伤害免疫');turn(a);assert.equal(sum(a),0);assert.equal(a.fighters[1].stages.def,0);assert.ok(a.fighters[1].ailments['害怕']);const b=make({move:38216,index:0});b.fighters[1].stages.def=2;b.fighters[1].counts.immune=1;turn(b);assert.equal(b.fighters[1].stages.def,0);assert.equal(b.fighters[1].ailments['害怕'],undefined);assert.equal(b.fighters[1].counts.immune,0);const c=make({move:38216,index:0});c.fighters[1].stages.def=2;timer(c,1,'强化保护');turn(c);assert.equal(c.fighters[1].stages.def,2);assert.equal(c.fighters[1].ailments['害怕'],undefined);
});
test('4857毒素外甲完整191/817/1768：转盾零红仍授下回合红易伤，真实第五红翻倍但1800粉不翻倍',()=>{
 const a=make({move:29235}),base=make({move:29235,index:2});for(const s of[a,base]){turn(s,29235,10127);assert.equal(sum(s,'attack',1),0);assert.ok(s.fighters[0].suitState.shield>0);s.rng=0x9e3779b9;}turn(a,38218);turn(base,38218);assert.ok(Math.abs(sum(a)-2*sum(base))<=2);assert.equal(sum(a,'percent'),1800);assert.equal(sum(base,'percent'),1800);
});
test('4857真实2044与1768转盾先结算，原本致死攻击归零不会错误消耗首次致死资源',()=>{
 const a=make({move:29235,soul:true,hp:100,bStats:{atk:9999}});turn(a,29235,10127);assert.equal(a.fighters[0].hp,100);assert.equal(sum(a,'attack',1),0);assert.equal(a.fighters[0].suitState.shield,300);assert.equal(a.fighters[0].soulState.phalanx2044?.survivalUsed??false,false);assert.equal(a.fighters[0].soulState.phalanx2044?.pendingSurvival??false,false);assert.equal(a.fighters[0].pp[key(29235)],4);
});
test('4857/843下两回合全技能先制2，授予当回合不提前生效且第三个后继回合到期',()=>{
 const a=make({move:29236,index:2});a.moveDefinitions[key(38218)].operations=[];turn(a);assert.equal(a.fighters[0].soulState.resolvedPriority.value,0);for(const expected of[2,2,0]){turn(a,38218);assert.equal(a.fighters[0].soulState.resolvedPriority.value,expected);}
});
