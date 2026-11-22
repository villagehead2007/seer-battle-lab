'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3242-native.cjs');
test('3242断水天涯五条原弱化不含特防，免弱独立挡等级不挡三回PP双耗，第四回恢复',()=>{
 for(const mode of ['normal','immune','sealed']){let s=H.make(24118,{enemyMoves:[10086],bEffects:mode==='immune'?{免弱:{start:1,end:5}}:{},aEffects:mode==='sealed'?{statusBlock:{start:1,end:1}}:{}});for(let round=1;round<=4;round++){const pp=s.fighters[1].pp['wiki:10086'];s=H.turn(s,round===1?24118:'potion:pp',10086);assert.equal(s.fighters[1].pp['wiki:10086'],pp-(mode==='sealed'||round===4?1:2));}for(const k of ['atk','def','spa','spe','acc'])assert.equal(s.fighters[1].stages[k],mode==='normal'?-1:0);assert.equal(s.fighters[1].stages.spd,0);}
});
test('3242不灭天尊持续57实际MISS封招仍回3000，PP药不触发而原魂回复独立保留',()=>{
 for(const mode of ['miss','invalid','item']){let s=H.make(24119,{aHp:1000,extraMoves:[10710],aEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:mode==='invalid'?{skillBlock:{start:2,end:2}}:{}});s=H.turn(s,24119);assert.equal(s.fighters[0].hp,5500);s=H.turn(s,mode==='item'?'potion:pp':10710);assert.equal(s.fighters[0].hp,mode==='item'?6550:8650);assert.equal(H.damage(s,'attack'),0);assert.equal(H.damage(s,'fixed'),120);}
});
test('3242不灭天尊60原五回每回合120固定不要求用招，PP药仍结算，第六回到期，免固定独立生效',()=>{
 for(const immune of [false,true]){let s=H.make(24119,{aHp:1000,bEffects:immune?{固定百分比免疫:{start:1,end:8}}:{}});for(let round=1;round<=6;round++){s=H.turn(s,round===1?24119:'potion:pp');assert.equal(H.damage(s,'fixed'),!immune&&round<=5?120:0);}assert.equal(s.fighters[1].hp,immune?9000:8400);}
});
test('3242超震拳风两独立原100至200随机回血及固定，实际体力加魂剩余缺口30%，禁疗和免固定分别处理',()=>{
 const healed=new Set(),fixed=new Set();let different=false;for(let seed=1;seed<=24;seed++){const s=H.turn(H.make(17492,{seed,aHp:1000,aStages:{acc:6}}),17492),events=s.turns.at(-1).events,h=events.filter(e=>e.kind==='heal'&&e.text.includes('超震拳风')).reduce((n,e)=>n+Number(e.text.match(/回复 (\d+) 点体力/)?.[1]??0),0),f=H.damage(s,'fixed');assert.ok(h>=100&&h<=200);assert.ok(f>=100&&f<=200);healed.add(h);fixed.add(f);different||=h!==f;assert.equal(s.fighters[0].hp,1000+h+Math.floor((8000-h)*.3));assert.equal(s.fighters[1].hp,9000-H.damage(s,'attack')-f);}assert.ok(healed.size>1&&fixed.size>1&&different);for(const mode of ['skill-ban','all-ban','fixed-immune']){const s=H.turn(H.make(17492,{aHp:1000,aStages:{acc:6},aEffects:mode==='skill-ban'?{技能禁疗:{start:1,end:1}}:mode==='all-ban'?{四杀鬼囹:{start:1,end:1}}:{},bEffects:mode==='fixed-immune'?{固定百分比免疫:{start:1,end:1}}:{}}),17492);if(mode!=='fixed-immune')assert.equal(s.fighters[0].hp,mode==='all-ban'?1000:3400);assert.equal(H.damage(s,'fixed')>0,mode==='skill-ban','四杀鬼囹同时封回复与粉伤，不能当纯禁疗');}
});
test('3242惊天破岩冲本次150物攻击败后攻击速度各加一，存活免攻MISS不授，禁强化只挡成长',()=>{
 for(const mode of ['kill','alive','immune','miss','own-ban']){const s=H.turn(H.make(17493,{bHp:mode==='alive'?9000:1,bEffects:mode==='immune'?{攻击伤害免疫:{start:1,end:1}}:{},aEffects:mode==='miss'?{攻击必失:{start:1,end:1}}:mode==='own-ban'?{禁强化:{start:1,end:1}}:{}}),17493),reward=mode==='kill'?1:0;assert.equal(s.fighters[0].stages.atk,reward);assert.equal(s.fighters[0].stages.spe,reward);assert.equal(s.fighters[1].hp===0,['kill','own-ban'].includes(mode));}
});
