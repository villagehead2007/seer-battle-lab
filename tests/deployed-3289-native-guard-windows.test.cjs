'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289水龙吟192按自身当前体力15百分比，正负强化不改基数，零红命中仍附加而MISS无效免粉不扣',()=>{
 for(const mode of ['normal','positive','negative','zero','miss','invalid','pink']){const s=H.turn(H.make(16442,{aHp:3000,aStages:{acc:6,atk:mode==='positive'?6:mode==='negative'?-6:0,spa:mode==='positive'?6:mode==='negative'?-6:0},aEffects:mode==='miss'?{攻击必失:{start:1,end:1}}:mode==='invalid'?{skillBlock:{start:1,end:1}}:{},bEffects:mode==='zero'?{攻击伤害免疫:{start:1,end:1}}:mode==='pink'?{固定百分比免疫:{start:1,end:1}}:{}}),16442);assert.equal(H.damage(s,'percent'),['miss','invalid','pink'].includes(mode)?0:450);assert.equal(s.fighters[0].hp,3000);}
});
test('3289龙隐云霄992原三回含当回窗口，攻击附当前体力半数百分比，属性和药剂不附加，第四回到期',()=>{
 let s=H.make(25289,{aHp:3000,extraMoves:[10004],aStages:{acc:6}});for(let r=1;r<=4;r++){s=H.turn(s,r===1?25289:10004);assert.equal(H.damage(s,'percent'),r===2||r===3?1500:0);assert.equal(s.fighters[0].hp,3000);}for(const mode of ['miss','invalid','pink']){let q=H.make(25289,{aHp:3000,extraMoves:[10004],aEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:mode==='invalid'?{skillBlock:{start:2,end:2}}:{},bEffects:mode==='pink'?{固定百分比免疫:{start:1,end:3}}:{}});q=H.turn(q,25289);q=H.turn(q,10004);assert.equal(H.damage(q,'percent'),0);}
});
test('3289龙隐云霄477受击命中零红也降对手六项，MISS不降且第五回窗口到期，原618追击独立',()=>{
 for(const mode of ['normal','zero','miss']){let s=H.make(25289,{aHp:3000,enemyMoves:[10086],bStages:{acc:6},aEffects:mode==='zero'?{攻击伤害免疫:{start:2,end:2}}:{},bEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:{}});s=H.turn(s,25289);for(let r=2;r<=5;r++){s=H.turn(s,'potion:pp',r===2||r===5?10086:'potion:pp');for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[1].stages[k],(k==='acc'?6:0)-(mode==='miss'?0:1));if(r===2){assert.equal(H.damage(s,'attack',1)>0,mode==='normal');assert.equal(H.damage(s,'percent'),3000);}}}
});
test('3289龙隐云霄47五回免弱含最后回，第六回原断水五项才下降，特防仍不受该原招影响',()=>{
 let s=H.make(25289,{enemyId:3242,enemyMoves:[24118],aStats:{spe:4000}});for(let r=1;r<=6;r++){s=H.turn(s,r===1?25289:'potion:pp',r===4?'potion:pp':24118);for(const k of ['atk','def','spa','spe','acc'])assert.equal(s.fighters[0].stages[k],r===6?-1:0);assert.equal(s.fighters[0].stages.spd,0);}
});
test('3289碧海惊涛闪186仅后手速度加二，先手无奖励，禁强与六级边界保留攻击本体',()=>{
 for(const mode of ['early','late','ban','cap']){const s=H.turn(H.make(16444,{aStats:{spe:mode==='early'?4000:1},enemyMoves:[20355],aStages:{acc:6,...(mode==='cap'?{spe:6}:{})},aEffects:mode==='ban'?{禁强化:{start:1,end:1}}:{}}),16444,20355);assert.equal(s.turns.at(-1).first,mode==='early'?0:1);assert.equal(s.fighters[0].stages.spe,mode==='cap'?6:mode==='late'?2:0);assert.ok(H.damage(s,'attack')>0);}
});
