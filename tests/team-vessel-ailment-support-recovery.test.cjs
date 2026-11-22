'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={},skills=[],gear={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const skill of skills)if(!moves.includes(skill))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats},...gear}};}
function make(removed=4,resistance=100,target=3291,blocked=false,actorId=4925,ownerFate=null){const slots=[{name:'中毒',chance:resistance},{name:'',chance:0},{name:'',chance:0}];let g=T.create([[member(13311,{maxHp:1000,def:30}),member(actorId,{},actorId===4693?[37662]:[20020]),...(blocked?[member(4000)]:[])],[member(3102,{atk:9999}),member(target,{},target===3291?[25294]:[],{resistance:{slots}}),...(ownerFate==='vanished'?[member(4661,{atk:9999,spa:9999},[37450])]:[])]],[0,0],{seed:14,criticals:false});for(let i=0;i<Math.min(3,removed);i++){g=T.turn(g,['wiki:38626',pp]);g=T.turn(g,[{switchTo:1},pp]);if(i<2||removed===4)g=T.turn(g,[{switchTo:0},pp]);}if(removed===4){g=T.turn(g,[pp,'wiki:19564']);assert.equal(g.battle.teamVessel2162[0].state.removed,4);if(ownerFate){if(ownerFate==='vanished')g=T.turn(g,[pp,{switchTo:2}]);g=T.turn(g,[pp,ownerFate==='vanished'?'wiki:37450':'wiki:19564']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(Boolean(g.battle.fighters[0].soulState.vanished),ownerFate==='vanished');g=T.replace(g,[1,null]);g=T.turn(g,[pp,{switchTo:1}]);}else g=T.turn(g,[{switchTo:1},{switchTo:1}]);}else if(!removed)g=T.turn(g,[{switchTo:1},{switchTo:1}]);else g=T.turn(g,[pp,{switchTo:1}]);return g;}
test('SP最后异常记录须经真实敌方致死移除；存活场下支援穿透100面板抗性与瀚空之门真实两免且不消费两免',()=>{
 let g=make();g=T.turn(g,[pp,'wiki:25294']);const f=g.battle.fighters[1],charges=f.counts.immune;assert.equal(charges,2);assert.equal(E.GEAR.resistanceChance(f,'中毒'),1);g=T.turn(g,['wiki:20020',pp]);assert.ok(g.battle.fighters[1].ailments['中毒']>=g.battle.turns.at(-1).round);assert.equal(g.battle.fighters[1].counts.immune,charges);assert.equal(E.GEAR.resistanceChance(g.battle.fighters[1],'中毒'),1);assert.deepEqual(g.battle.teamVessel2162[0].state.records,[]);
});
test('SP异常记录未移除时不忽略异常免疫与抗性，固定百分比弱化先移除三项也不偷渡异常穿透',()=>{
 for(const removed of [0,3]){let g=make(removed);g=T.turn(g,['wiki:20020',pp]);assert.equal(g.battle.fighters[1].ailments['中毒'],undefined);assert.ok(g.battle.teamVessel2162[0].state.records.includes('ailment'));}
});
test('SP忽略抗性不作额外抵抗抽签：真实初始0与100抗性两配队在穿透毒粉后持续时间及随机状态一致',()=>{
 const outcomes=[];for(const resistance of [0,100]){let g=make(4,resistance,2989);g=T.turn(g,['wiki:20020',pp]);assert.ok(g.battle.fighters[1].ailments['中毒']);outcomes.push({rng:g.battle.rng,end:g.battle.fighters[1].ailments['中毒'],round:g.battle.round});}assert.deepEqual(outcomes[0],outcomes[1]);
});
test('SP异常记录已移除但有活薇尔诗禁止场下指定时不提供支援，原星皇100抗性继续有效',()=>{
 let g=make(4,100,3291,true);g=T.turn(g,['wiki:20020',pp]);assert.equal(g.battle.fighters[1].ailments['中毒'],undefined);assert.equal(E.GEAR.resistanceChance(g.battle.fighters[1],'中毒'),1);
});
test('SP异常支援穿透真实天启帝君永久魂印免异和100中毒抗性，未消除对手的原生免异能力',()=>{
 let g=make(4,100,3550);assert.equal(E.SOULS.trait(g.battle.fighters[1],'ailmentImmune'),true);g=T.turn(g,['wiki:20020',pp]);assert.ok(g.battle.fighters[1].ailments['中毒']);assert.equal(E.SOULS.trait(g.battle.fighters[1],'ailmentImmune'),true);assert.equal(E.GEAR.resistanceChance(g.battle.fighters[1],'中毒'),1);
});
test('SP异常支援不能绕过真实米斯蒂克登场封锁的攻击禁异常，蘑菇原生100中毒特攻正常耗PP而不附毒',()=>{
 for(const target of [4676,2989]){let g=make(4,100,target,false,4693);const before=g.battle.fighters[0].pp['wiki:37662'];if(target===4676)assert.ok(g.battle.fighters[0].effects['神觉攻击禁异常弱化'].end>=g.battle.round);g=T.turn(g,['wiki:37662',pp]);assert.equal(g.battle.fighters[0].pp['wiki:37662'],before-1);assert.equal(Boolean(g.battle.fighters[1].ailments['中毒']),target!==4676);}
});
test('SP真实清空四记录后由瑞尔斯再次伤害击败或被无为击败消逝，已死源不再给继任提供异常穿透',()=>{
 for(const fate of ['dead','vanished']){let g=make(4,100,3291,false,4925,fate);assert.equal(g.slots[0][0].fighter.hp,0);assert.equal(Boolean(g.slots[0][0].fighter.soulState.vanished),fate==='vanished');g=T.turn(g,['wiki:20020',pp]);assert.equal(g.battle.fighters[1].ailments['中毒'],undefined);assert.deepEqual(g.battle.teamVessel2162[0].state.records,[]);}
});
