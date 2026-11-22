'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
const event=s=>(s.damageEvents??[]).filter(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='true'&&e.round===s.round-1);
function make(o={}){return H.make(17391,{aHp:1,enemyMoves:[10086],aStats:{def:1,spe:4000},bStats:{atk:9999,spe:100},...o});}
test('3240原587复用已有公共答真实500：被原招击败触发，目标残血保1，完整500与实际损失独立',()=>{
 for(const hp of[100,500,501,9000]){const s=H.turn(make({bHp:hp,bGear:{resistance:{fixed:100,percent:100}}}),17391,10086),body=(s.damageEvents??[]).filter(e=>e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+e.hpLoss,0);assert.ok(body>0,'原17391完整攻击本体保留');assert.equal(s.fighters[0].hp,0);assert.equal(s.fighters[1].hp,Math.max(1,hp-body-500));assert.equal(event(s).length,1);assert.equal(event(s)[0].settledDamage,500);assert.equal(event(s)[0].hpLoss,Math.min(500,hp-body-1));assert.equal(H.damage(s,'fixed'),0);assert.equal(H.damage(s,'percent'),0);}
});
test('3240原587两回窗口含最后回，第三回已到期，发动被封无奖励，幸存未击败不反击',()=>{
 for(const lethalRound of[2,3]){let s=H.turn(make(),17391);const hp=s.fighters[1].hp;assert.ok(hp<9000,'发动的原攻击本体仍扣HP');for(let r=2;r<=lethalRound;r++)s=H.turn(s,'potion:pp',r===lethalRound?10086:'potion:pp');assert.equal(s.fighters[0].hp,0);assert.equal(event(s).length,lethalRound===2?1:0);assert.equal(s.fighters[1].hp,lethalRound===2?hp-500:hp);}
 const blocked=H.turn(make({aEffects:{skillBlock:{start:1,end:1}}}),17391,10086);assert.equal(blocked.fighters[0].hp,0);assert.equal(event(blocked).length,0);const live=H.turn(make({aHp:9000,bStats:{atk:100,spe:100},aStats:{def:5000,spe:4000}}),17391,10086);assert.ok(live.fighters[0].hp>0);assert.equal(event(live).length,0);
});
