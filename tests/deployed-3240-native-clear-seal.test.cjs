'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
test('3240原17389的736清强成功封当回合与下一回合属性，第三回恢复，负等级不消除',()=>{
 for(const ownBan of[false,true]){let s=H.make(17389,{enemyMoves:[20889],aEffects:ownBan?{禁强化:{start:1,end:3}}:{},bStages:{atk:2,def:-2}});for(let r=1;r<=3;r++){s=H.turn(s,r===1?17389:'potion:pp',20889);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[1].stages.spe,r===3?1:0);assert.equal(s.fighters[1].pp['wiki:20889'],30-r);}}
});
test('3240原736没有正强化、普通防消强、明确保护或自身整招无效均不封属，不把反转绕防扩为清强',()=>{
 for(const mode of['empty','protect','explicit','blocked']){let s=H.make(17389,{enemyMoves:[20889],aEffects:mode==='blocked'?{skillBlock:{start:1,end:1}}:{},bStages:mode==='empty'?{}:{atk:2},bEffects:mode==='protect'?{强化保护:{start:1,end:3}}:mode==='explicit'?{幽蝶强化保护:{start:1,end:3}}:{}});for(let r=1;r<=2;r++){s=H.turn(s,r===1?17389:'potion:pp',20889);assert.equal(s.fighters[1].stages.atk,mode==='empty'?0:2);assert.equal(s.fighters[1].stages.spe,r);assert.equal(s.fighters[1].effects.statusBlock,undefined);}}
});
