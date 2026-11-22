'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3022-native.cjs'),pp='potion:pp';
const hits=(s,side)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type==='attack'&&e.sourceSide===side);
test('3022回避52仅先手本轮封攻击及属性附效，后手不封且次轮恢复真实用招',()=>{
 for(const fast of [true,false])for(const move of[10086,20889]){let s=make(20266,{enemyMoves:[move],aStats:{spe:fast?9999:1},bStats:{spe:1000}});s=turn(s,20266,move);assert.equal(s.turns[0].first,fast?0:1);if(move===10086)assert.equal(hits(s,1).length,fast?0:1);else assert.equal(s.fighters[1].stages.spe,fast?0:1);s=turn(s,pp,move);if(move===10086)assert.equal(hits(s,1).length,1);else assert.equal(s.fighters[1].stages.spe,fast?1:2);}
});
test('3022龙腾880真实清对手必暴才授下回合全技能先制三，再下一轮零，空回合效果不授',()=>{
 let s=make(19227,{extraMoves:[20269],enemyMoves:[20355,10086],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp,20355);assert.ok(s.fighters[1].effects['必定暴击']);s=turn(s,19227);assert.equal(s.fighters[1].effects['必定暴击'],undefined);s=turn(s,20269,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);assert.equal(s.turns.at(-1).first,0);s=turn(s,20269,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.turns.at(-1).first,1);s=turn(make(19227,{extraMoves:[20269]}),19227);assert.equal(s.fighters[0].effects.id984,undefined);
});
test('3022千秋884下次技能无效跨药剂保留，只消费真实用招一次并照扣PP，后续攻击正常',()=>{
 let s=turn(make(24707,{enemyMoves:[10086]}),24707);assert.equal(s.fighters[1].counts.nextSkillInvalid,1);s=turn(s,pp,pp);assert.equal(s.fighters[1].counts.nextSkillInvalid,1);const before=s.fighters[1].pp['wiki:10086'];s=turn(s,pp,10086);assert.equal(s.fighters[1].counts.nextSkillInvalid,undefined);assert.equal(s.fighters[1].pp['wiki:10086'],before-1);assert.equal(hits(s,1).length,0);s=turn(s,pp,10086);assert.equal(hits(s,1).length,1);
});
test('3022龙甲三回合和千秋五回合免异常免弱独立到期，原生睡眠与冰霜降防实际在下轮恢复',()=>{
 for(const[id,duration]of[[22295,3],[24707,5]]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);assert.equal(s.fighters[0].effects['免异常'].end,duration);for(let r=2;r<=duration;r++){s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);}s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']>=2);s=turn(make(id,{enemyId:2995,enemyMoves:[20079]}),id);assert.equal(s.fighters[0].effects['免弱'].end,duration);for(let r=2;r<=duration;r++){s=turn(s,pp,20079);assert.equal(s.fighters[0].stages.def,0);}s=turn(s,pp,20079);assert.equal(s.fighters[0].stages.def,-1);}
});
test('3022万里440当前三回合耗PP二倍第四恢复，444先逐槽扣敌一补自身一且本招先耗后回',()=>{
 let s=make(24706,{enemyMoves:[10086]});for(const k of s.fighters[0].moves)s.fighters[0].pp[k]-=2;const a={...s.fighters[0].pp},b={...s.fighters[1].pp};s=turn(s,24706,10086);for(const k of s.fighters[0].moves)assert.equal(s.fighters[0].pp[k],a[k]+(k==='wiki:24706'?0:1));for(const k of s.fighters[1].moves)assert.equal(s.fighters[1].pp[k],b[k]-(k==='wiki:10086'?3:1));for(let r=2;r<=4;r++){const n=s.fighters[1].pp['wiki:10086'];s=turn(s,pp,10086);assert.equal(s.fighters[1].pp['wiki:10086'],n-(r<=3?2:1));}
 let z=make(24706);for(const k of z.fighters[1].moves)z.fighters[1].pp[k]=0;z=turn(z,24706,'potion:hp');assert.ok(Object.values(z.fighters[1].pp).every(n=>n===0));assert.ok(Object.entries(z.fighters[0].pp).every(([k,n])=>n===z.moveDefinitions[k].pp));
});
test('3022狂龙击杀33只清正级保负级，582未KO只下两轮必暴，KO阴性不授',()=>{
 let s=turn(make(19248,{bStages:{atk:2,def:-1,spe:3},extraMoves:[10613]}),19248);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[1].stages.def,-1);assert.equal(s.fighters[0].effects['必定暴击'].start,2);assert.equal(s.fighters[0].effects['必定暴击'].end,3);for(let r=2;r<=4;r++){s=turn(s,10613);const e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(e);assert.equal(/暴击 2/.test(e.detail),r<=3);}let k=turn(make(19248,{bHp:1}),19248);assert.equal(k.fighters[1].hp,0);assert.equal(k.fighters[0].effects['必定暴击'],undefined);
});
