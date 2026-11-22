'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={},skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const skill of skills)if(!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:1000,spa:180,def:1000,spd:1000,spe:1000,...stats}}};}
test('薇尔诗真实原始隔位阵亡才授永久免异，邻位阵亡只授免弱，远位不冒充隔位',()=>{
 for(const dead of [-1,1,2,3]){let g=T.create([[member(4000),member(3056),member(3102),member(2988)],[member(4925,{},[20020])]],[0,0],{seed:14,criticals:false});if(dead>=0)g.slots[0][dead].fighter.hp=0;g=T.turn(g,[pp,'wiki:20020']);g=T.turn(g,[pp,'wiki:20020']);const f=g.battle.fighters[0],st=f.soulState.verse2098;assert.equal(Boolean(st.ailmentImmune),dead===2);assert.equal(Boolean(st.weaknessImmune),dead===1);assert.equal(Boolean(f.ailments['中毒']),dead!==2);}
});
function red(g){return g.battle.damageEvents.filter(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);}
test('薇尔诗首位存活按真实全队已失HP百分比向下取整增红，首位阵亡时有其他存活者也不启动',()=>{
 function make(dead,missing){let g=T.create([[member(3056),member(4000,{},[10047]),member(3102)],[member(2988,{maxHp:9999})]],[1,0],{seed:14,criticals:false});if(dead)g.slots[0][0].fighter.hp=0;if(missing)g.slots[0][2].fighter.hp=4500;return T.turn(g,['wiki:10047',pp]);}
 const base=red(make(false,false)),boost=red(make(false,true));assert.ok(base>0);assert.ok(Math.abs(boost-base*1.16)<=2,JSON.stringify({base,boost}));assert.equal(red(make(true,false)),red(make(true,true)));
});
test('薇尔诗末位真实存活时敌用技能后所有PP各回一，末位阵亡则不回复，敌药剂不冒充用技能',()=>{
 for(const [last,foeSkill]of [[true,true],[false,true],[true,false]]){let g=T.create([[member(4000,{spe:9999},[10047]),member(3102)],[member(4925,{},[20020])]],[0,0],{seed:14,criticals:false});if(!last)g.slots[0][1].fighter.hp=0;const f=g.battle.fighters[0],fifth=f.moves[0];f.pp[fifth]=0;const max=f.pp['wiki:10047'];g=T.turn(g,['wiki:10047',foeSkill?'wiki:20020':pp]);const restored=last&&foeSkill;assert.equal(g.battle.fighters[0].pp[fifth],restored?1:0);assert.equal(g.battle.fighters[0].pp['wiki:10047'],max-1+Number(restored));}
});
