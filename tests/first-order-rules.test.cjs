'use strict';
// Component proofs for the user-designated chart. These are not deployed-species native proofs.
const test=require('node:test'),assert=require('node:assert/strict'),R=require('../dist/first-order-rules.js');
const fighter=()=>({hp:9000,effects:{},soulState:{}}),physical={kind:'physical',name:'组件攻击'},status={kind:'status',name:'组件属性'};
const p=id=>R.profile('skill-effect',id),sourceAtRank=rank=>rank===1?R.profile('soul',753,{hash:'2b305c24'}):p(Number(Object.keys(R.effectRanks).find(id=>R.effectRanks[id]===rank)));
test('房主默认每场随机一次并按种子复现，显式房主用于双座位验证',()=>{const seen=new Set();for(let seed=1;seed<=64;seed++){const side=R.assignChallengedSide(undefined,seed);seen.add(side);assert.equal(R.assignChallengedSide(undefined,seed),side);}assert.deepEqual([...seen].sort(),[0,1]);assert.equal(R.assignChallengedSide(0,14),0);assert.equal(R.assignChallengedSide(1,14),1);assert.throws(()=>R.assignChallengedSide(2,14),/房主/);});
function grant(f,id,n=2,start=2){return R.grantTimed(f,'所有技能必定先手',n,{},start,p(id),(f,key,n,data,start)=>f.effects[key]={start,end:start+n-1,...data});}
test('用户11档必先组件：全部跨档组合双座位始终低档号胜出，同档只由明确房主决定',()=>{
 for(let a=1;a<=11;a++)for(let b=1;b<=11;b++)for(const host of [0,1])assert.equal(R.choose([sourceAtRank(a)],[sourceAtRank(b)],host),a===b?host:a<b?0:1);
 assert.equal(R.choose([],[],undefined),null);assert.equal(R.choose([p(1275)],[],undefined),0);assert.equal(R.choose([],[p(1275)],undefined),1);
 assert.throws(()=>R.choose([p(1275)],[p(1275)],undefined),/房主/);
});
test('必先组件：魂印仅接受图表精确版本，不把所有魂印或未知旧计时器提升为最高档',()=>{
 for(const[id,hash]of Object.entries(R.soulHashes))assert.equal(R.profile('soul',Number(id),{hash}).rank,1);
 assert.throws(()=>R.profile('soul',753,{hash:'wrong'}),/尚未分档/);assert.throws(()=>p(99999),/尚未分档/);
 const f=fighter();f.effects['所有技能必定先手']={start:1,end:3};assert.throws(()=>R.candidates(f,physical,2),/未归档/);
});
test('必先组件：不同来源各自期限，较强排序不抹去较弱命中和暴击，刷新同源不累加',()=>{
 const f=fighter();grant(f,1552,2,2);grant(f,823,4,1);grant(f,1552,1,3);
 assert.equal(f.effects['所有技能必定先手'].firstOrderSources.length,2);
 assert.equal(R.rank(R.candidates(f,status,2)),8);assert.equal(R.rank(R.candidates(f,status,3)),2);assert.equal(R.rank(R.candidates(f,status,4)),8);assert.equal(R.rank(R.candidates(f,status,5)),null);
 f.soulId=753;f.soulHash='2b305c24';f.soulState.pony753={firstRound:3};R.grantCount(f,1275,2);
 assert.equal(R.rank(R.candidates(f,physical,3)),1);const receipt=R.beginUse(f,physical,3);assert.equal(receipt.hit,'true');assert.equal(receipt.critical1275,true);assert.equal(receipt.additionalCritical,true);
});
test('必先组件：1275技能先手次数和攻击暴击次数独立，排序和药剂均不消费',()=>{
 const f=fighter();R.grantCount(f,1275,2);for(let i=0;i<3;i++)R.candidates(f,status,1);
 assert.equal(f.soulState.teamFirstCrit1275,2);assert.equal(R.candidates(f,{kind:'item'},1).length,0);R.beginUse(f,{kind:'item'},1);assert.equal(f.soulState.teamFirstCrit1275,2);
 assert.equal(R.beginUse(f,status,1).critical1275,false);assert.equal(f.soulState.teamFirstCrit1275,1);assert.equal(f.soulState.teamFirstCritAttack1275,2);
 assert.equal(R.beginUse(f,physical,2).critical1275,true);assert.equal(f.soulState.teamFirstCrit1275,0);assert.equal(f.soulState.teamFirstCritAttack1275,1);
 assert.equal(R.beginUse(f,physical,3).critical1275,true);assert.equal(f.soulState.teamFirstCritAttack1275,0);assert.equal(R.beginUse(f,physical,4).critical1275,false);
});
test('必先组件：仅1275搭配1812先用1275，搭配1552先用计时1552；其余次数同用同减',()=>{
 const f=fighter();R.grantCount(f,1275,2);R.grantCount(f,1812,2);R.grantCount(f,435,2);
 R.beginUse(f,status,1);assert.equal(f.soulState.teamFirstCrit1275,1);assert.equal(f.soulState.firstOrderCountSources.find(x=>x.id===1812).remaining,2);assert.equal(f.soulState.firstOrderCountSources.find(x=>x.id===435).remaining,1);
 R.beginUse(f,status,2);R.beginUse(f,status,3);assert.equal(f.soulState.firstOrderCountSources.find(x=>x.id===1812).remaining,1);
 const g=fighter();R.grantCount(g,1275,2);grant(g,1552,2,1);R.beginUse(g,status,1);R.beginUse(g,status,2);assert.equal(g.soulState.teamFirstCrit1275,2);R.beginUse(g,status,3);assert.equal(g.soulState.teamFirstCrit1275,1);
});
test('必先组件：真必中和伪必中按图表分开，801及勘误全技能来源不误限攻击',()=>{
 for(const id of [574,873,1552,1812])assert.equal(p(id).hit,'true');for(const id of [435,754,1275])assert.equal(p(id).hit,'pseudo');assert.equal(p(777).hit,null);assert.equal(p(777).critical,false);
 const f=fighter();R.grantTimed(f,'攻击必定先手',2,{},1,p(801),(f,key,n,data,start)=>f.effects[key]={start,end:start+n-1,...data});assert.equal(R.rank(R.candidates(f,status,1)),2);
});
