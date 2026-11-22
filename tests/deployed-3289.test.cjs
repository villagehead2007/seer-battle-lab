'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289原魂618最新答按理论3000回复，目标仅500仍回3000，百分比免疫仍回3000，禁疗与回复上限独立',()=>{
 for(const mode of ['overkill','pink','ban','cap']){const s=H.turn(H.make(10004,{aHp:mode==='cap'?8999:100,bHp:mode==='cap'?9000:500,enemyMoves:[10086],aEffects:mode==='ban'?{四杀鬼囹:{start:1,end:1}}:{},bEffects:mode==='pink'?{固定百分比免疫:{start:1,end:1}}:{}}),'potion:pp',10086);assert.equal(s.fighters[0].hp,mode==='ban'?100:mode==='cap'?9000:3100);assert.equal(s.fighters[1].hp,mode==='pink'?500:mode==='cap'?6000:0);const heal=s.turns.at(-1).events.find(e=>e.kind==='heal'&&e.text.includes('天苍玄魂回复'));if(mode==='ban')assert.equal(heal,undefined);else assert.match(heal.text,new RegExp('回复 '+(mode==='cap'?1:3000)+' 点体力'));}
});
test('3289原魂618次回实际MISS或整招无效仍触发原攻击用招追击，未用招与致死后不触发',()=>{
 for(const mode of ['miss','invalid','lethal']){let s=H.make(10004,{aHp:mode==='lethal'?1:3000,enemyMoves:[10086],bStats:mode==='lethal'?{atk:6000}:{},bEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:mode==='invalid'?{skillBlock:{start:2,end:2}}:{}});s=H.turn(s,'potion:pp');const pp=s.fighters[1].pp['wiki:10086'];s=H.turn(s,'potion:pp',10086);assert.equal(s.fighters[1].pp['wiki:10086'],pp-1);assert.equal(H.damage(s,'percent'),mode==='lethal'?0:3000);assert.equal(s.fighters[0].hp,mode==='lethal'?0:6000);if(mode!=='lethal')assert.equal(H.damage(s,'attack',1),0);}
});
test('3289原魂618首登当回整招无效仍为实际攻击用招，低体百分比3000并回复，次回原冲顶正常红伤',()=>{
 let s=H.make(10004,{aHp:3000,enemyMoves:[10086],bStages:{acc:6}}),pp=s.fighters[1].pp['wiki:10086'];s=H.turn(s,'potion:pp',10086);assert.equal(H.damage(s,'attack',1),0);assert.equal(s.fighters[1].pp['wiki:10086'],pp-1);assert.equal(H.damage(s,'percent'),3000);assert.equal(s.fighters[0].hp,6000);assert.equal(s.fighters[1].hp,6000);s=H.turn(s,'potion:pp',10086);assert.ok(H.damage(s,'attack',1)>0);assert.equal(H.damage(s,'percent'),3000);assert.equal(s.fighters[1].hp,3000);assert.equal(s.fighters[0].hp,9000-H.damage(s,'attack',1));
});
test('3289原魂618高体附当前体力半数百分比且不回血，相等体力不追加，百分比免疫只挡粉伤',()=>{
 for(const mode of ['higher','equal','pink']){let s=H.make(10004,{aHp:6000,bHp:mode==='equal'?6000:5000,enemyMoves:[10086],bEffects:mode==='pink'?{固定百分比免疫:{start:1,end:1}}:{}});s=H.turn(s,'potion:pp',10086);assert.equal(H.damage(s,'percent'),mode==='higher'?3000:0);assert.equal(s.fighters[0].hp,6000);assert.equal(s.fighters[1].hp,mode==='higher'?2000:mode==='equal'?6000:5000);}
});
test('3289原魂618属性技能与药剂不触发攻击追击，控制未出招不扣PP不追击，首登仍允许原属性暴击效果',()=>{
 for(const mode of ['status','item','control']){let s=H.make(10004,{aHp:3000,enemyMoves:[10086,20355],bAilments:mode==='control'?{睡眠:3}:{}});const pp=s.fighters[1].pp['wiki:10086'];s=H.turn(s,'potion:pp',mode==='status'?20355:mode==='control'?10086:'potion:pp');assert.equal(H.damage(s,'percent'),0);assert.equal(s.fighters[0].hp,3000);if(mode==='control')assert.equal(s.fighters[1].pp['wiki:10086'],pp);if(mode==='status')assert.deepEqual(s.fighters[1].effects.必定暴击,{start:2,end:3});}
});
test('3289原魂618技能禁疗不挡原魂低体回复，全禁疗只禁回复而魂粉独立，百分比免疫不阻理论回复',()=>{
 for(const mode of ['heal-ban','all-ban','pink']){let s=H.make(10004,{aHp:3000,enemyMoves:[10086],aEffects:mode==='heal-ban'?{技能禁疗:{start:1,end:1}}:mode==='all-ban'?{四杀鬼囹:{start:1,end:1}}:{},bEffects:mode==='pink'?{固定百分比免疫:{start:1,end:1}}:{}});s=H.turn(s,'potion:pp',10086);assert.equal(H.damage(s,'percent'),mode==='pink'?0:3000);assert.equal(s.fighters[0].hp,mode==='all-ban'?3000:6000);}
});
