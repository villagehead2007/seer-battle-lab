'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3242-native.cjs');
test('3242狂怒破击原消回合与当回合125共250、多段及魂粉1800独立，下一回776双红仅一回到期',()=>{
 let s=H.make(17489,{extraMoves:[10711],enemyId:3079,enemyMoves:[16103],aStats:{spe:4000,def:1000},aStages:{acc:6},bStats:{atk:3000},bEffects:{免异常:{start:1,end:5}}});s=H.turn(s,17489,16103);assert.equal(s.fighters[1].effects.免异常,undefined);assert.equal(H.damage(s,'attack',1),250);assert.equal(H.damage(s,'percent',1),1800);assert.equal(s.fighters[0].effects.doubleDamage.start,2);assert.equal(s.fighters[0].effects.doubleDamage.end,2);for(let r=2;r<=3;r++){s=H.turn(s,10711);const e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');assert.ok(e.damage.settledDamage>0);assert.match(e.detail,new RegExp('增减伤 '+(r===2?2:1)+' ×'));assert.equal(s.fighters[0].effects['攻击伤害上限'],undefined);}
 const blocked=H.turn(H.make(17489,{enemyId:3079,enemyMoves:[16103],aStats:{spe:4000,def:1000},bStats:{atk:3000},aEffects:{skillBlock:{start:1,end:1}}}),17489,16103);assert.ok(H.damage(blocked,'attack',1)>250);assert.equal(blocked.fighters[0].effects.doubleDamage,undefined);
});
test('3242天威力破928仅清除成功得一次免异，真实安魂曲先消耗一次保护，次回正常睡眠',()=>{
 let s=H.make(30155,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},aStages:{acc:6},bStages:{acc:6},bEffects:{免异常:{start:1,end:4}}});s=H.turn(s,30155,22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[0].counts.immune,0);s=H.turn(s,'potion:pp',22053);assert.ok(s.fighters[0].ailments.睡眠>=2);
 for(const mode of ['none','protected']){const out=H.turn(H.make(30155,{aStages:{acc:6},bEffects:mode==='protected'?{免异常:{start:1,end:4},protect:{start:1,end:4}}:{}}),30155);assert.equal(out.fighters[0].counts.immune??0,0);if(mode==='protected')assert.ok(out.fighters[1].effects.免异常);}
});
test('3242天威力破不足280使下两回真正暴击，第四回不暴击，原魂及攻击红伤完整保留',()=>{
 let s=H.make(30155,{extraMoves:[10711],aStages:{acc:6}});const crits=[],old=H.E.SOULS;H.E.SOULS={...old,run(event,c){const result=old.run(event,c);if(event==='afterAttack'&&c.a.side===0)crits.push(c.crit);return result;}};try{s=H.turn(s,30155);assert.ok(H.damage(s,'attack')<280);for(let r=2;r<=4;r++){s=H.turn(s,10711);assert.ok(H.damage(s,'attack')>0);}}finally{H.E.SOULS=old;}assert.deepEqual(crits,[false,true,true,false]);
});
test('3242天威力破475高伤不授暴击，保护下攻击免疫零红仍是命中并授下两回暴击',()=>{
 const high=H.turn(H.make(30155,{aStats:{atk:9999},bStats:{def:1000},aStages:{acc:6}}),30155);assert.ok(H.damage(high,'attack')>=280);assert.equal(high.fighters[0].effects.必定暴击,undefined);const zero=H.turn(H.make(30155,{aStages:{acc:6},bEffects:{攻击伤害免疫:{start:1,end:3},protect:{start:1,end:3}}}),30155);assert.equal(H.damage(zero,'attack'),0);assert.equal(zero.fighters[0].effects.必定暴击.start,2);assert.equal(zero.fighters[0].effects.必定暴击.end,3);
});
