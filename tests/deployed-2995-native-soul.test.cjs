'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/2995-native.cjs');
test('2995魂印374按提升种类计冰封概率而不按等级计，同种一级六级自然种子一致、六种提升触发多于零种',()=>{
 let low=0,high=0;for(let seed=1;seed<=48;seed++){const plain=turn(make(10006,{seed}),10006),one=turn(make(10006,{seed,bStages:{atk:1}}),10006),six=turn(make(10006,{seed,bStages:{atk:6}}),10006),all=turn(make(10006,{seed,bStages:{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}}),10006);const iced=s=>s.fighters[1].ailments['冰封']>=1;assert.equal(iced(one),iced(six));if(iced(plain))low++;if(iced(all))high++;}assert.ok(low>0&&low<48);assert.ok(high>low&&high<48);
});
test('2995魂印374不由属性技能触发，真实免异阻挡，命中黑洞零红伤仍可冰封但击败目标不附异常',()=>{
 let zeroDamageIce=0;for(let seed=1;seed<=24;seed++){let s=turn(make(20079,{seed,bStages:{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}}),20079);assert.equal(s.fighters[1].ailments['冰封'],undefined);s=turn(make(10006,{seed,enemyId:3550}),10006);assert.equal(s.fighters[1].ailments['冰封'],undefined);s=turn(make(10006,{seed,enemyId:4717}),10006);assert.equal(s.damageEvents.filter(e=>e.type==='attack').reduce((n,e)=>n+e.settledDamage,0),0);assert.equal(s.fighters[1].soulState.void1919.broken,false);if(s.fighters[1].ailments['冰封']>=1)zeroDamageIce++;s=turn(make(10006,{seed,bHp:1}),10006);assert.equal(s.fighters[1].hp,0);assert.deepEqual(s.fighters[1].ailments,{});}assert.ok(zeroDamageIce>0);
});
