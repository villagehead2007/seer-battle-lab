'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4186-battle.cjs'),{make,turn,timer,key}=H,shields=require('../dist/shield-rules.js');
const attackEvents=s=>(s.damageEvents??[]).filter(e=>e.type==='attack'&&e.targetSide===0);
test('4186觉醒继承异常已算本回合曾处于，即使本回合清除仍回复并吸PP',()=>{
 const s=make({moveId:10004,index:null},{soul:2028,hp:3000});s.fighters[0].ailments['烧伤']=5;H.op(s,544,[],920031);const o=turn(s,920031);assert.equal(o.fighters[0].ailments['烧伤'],undefined);assert.equal(o.fighters[0].hp,4800);assert.equal(o.fighters[0].soulState.dragonAilmentReceivedRound,1);assert.equal(o.fighters[1].pp[key(920040)],98);
});
test('4186觉醒免疫和反弹的施加尝试按044也算受异常回合，但不凭空挂异常',()=>{
 for(const reflect of [false,true]){const s=make({moveId:10004,index:null},{soul:2028,hp:3000});timer(s,0,reflect?'reflect':'免异常');H.op(s,12,[100],920042);const o=turn(s,920031,920042);assert.equal(o.fighters[0].ailments['烧伤'],undefined);assert.equal(o.fighters[0].soulState.dragonAilmentReceivedRound,1);assert.equal(o.fighters[0].hp,4800);assert.equal(!!o.fighters[1].ailments['烧伤'],reflect);assert.equal(o.fighters[1].pp[key(920040)],98);}
});
test('4186觉醒先受攻击后新增异常，先反击吸PP再在回合结束回复并再次吸PP',()=>{
 const s=make({moveId:10004,index:null},{soul:2028,hp:3000});shields.consume(s.fighters[0]);H.op(s,12,[100],920040);const o=turn(s,920031,920040),loss=attackEvents(o).reduce((n,e)=>n+e.hpLoss,0);assert.equal(o.fighters[1].hp,7200);assert.equal(o.fighters[0].hp,3000-loss+1800-1125);assert.equal(o.fighters[1].pp[key(920040)],96);assert.equal(o.fighters[1].pp[key(920041)],97);assert.equal(o.damageEvents.filter(e=>e.type==='percent'&&e.sourceSide===0).length,1);
});
test('4186觉醒每次正结算攻击即时判断，多段可分别反击；完全免伤不凭空反击',()=>{
 let s=make({moveId:10004,index:null},{soul:2028});shields.consume(s.fighters[0]);H.op(s,31,[2,2],920040);const o=turn(s,920031,920040);assert.equal(o.fighters[1].hp,5400);assert.equal(o.fighters[1].pp[key(920041)],97);assert.equal(o.damageEvents.filter(e=>e.type==='percent'&&e.sourceSide===0).length,2);
 s=make({moveId:10004,index:null},{soul:2028});timer(s,0,'当回合免伤');const z=turn(s,920031,920040);assert.equal(z.fighters[1].hp,9000);assert.equal(z.fighters[1].pp[key(920041)],99);
});
test('4186觉醒回合结束吸PP归零封下回合完整一回合，保护或原0不新触发封攻',()=>{
 const s=make({moveId:10004,index:null},{soul:2028,hp:3000});s.fighters[0].ailments['失明']=5;s.fighters[1].pp[key(920040)]=1;let o=turn(s,920031);assert.deepEqual({start:o.fighters[1].effects.attackBlock.start,end:o.fighters[1].effects.attackBlock.end},{start:2,end:2});o.fighters[1].pp[key(920040)]=99;const b=turn(o,920031,920040);assert.equal(attackEvents(b).filter(e=>e.round===2).length,0);
 const blocked=structuredClone(s);timer(blocked,1,'PP保护');const p=turn(blocked,920031);assert.equal(p.fighters[1].pp[key(920040)],1);assert.equal(p.fighters[1].effects.attackBlock,undefined);assert.equal(p.fighters[0].hp,4800);
 const zero=structuredClone(s);for(const k of zero.fighters[1].moves)zero.fighters[1].pp[k]=0;const z=H.E.resolveTurn(zero,[key(920031),'potion:hp']);assert.equal(z.fighters[1].effects.attackBlock,undefined);
});
test('4186原魂印失败抽一次同值扣全技能、整回合只一次且保护不扣，保留1HP正结算仍反制',()=>{
 let failed=false;for(let seed=0;seed<50&&!failed;seed++){const s=make({moveId:10004,index:null},{soul:1409,seed});shields.consume(s.fighters[0]);H.op(s,31,[3,3],920040);const o=turn(s,920031,920040);if(o.fighters[0].soulState.dragonFailurePPAmount){failed=true;const n=o.fighters[0].soulState.dragonFailurePPAmount;for(const k of o.fighters[1].moves)assert.equal(o.fighters[1].pp[k],99-n-(k===key(920040)?1:0));const b=structuredClone(s);timer(b,1,'PP保护');const p=turn(b,920031,920040);for(const k of p.fighters[1].moves)assert.equal(p.fighters[1].pp[k],99-(k===key(920040)?1:0));}}assert.equal(failed,true);
 const s=make({moveId:10004,index:null},{soul:1409,hp:1});shields.consume(s.fighters[0]);timer(s,0,'致命保留',{hp:1});const o=turn(s,920031,920040);assert.equal(o.fighters[0].hp,1);assert.equal(attackEvents(o)[0].hpLoss,0);assert.ok(attackEvents(o)[0].settledDamage>0);assert.equal(o.fighters[0].soulState.dragonReactionRound,1);
});
