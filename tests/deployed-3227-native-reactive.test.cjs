'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs');
test('3227两魂月神与自由783实际消强或吸强才反制百分比3000，强化保护阻止取消也不反制，免粉独立',()=>{
 for(const soul of[552,553])for(const move of[24579,24632])for(const enemyMove of[16600,19587])for(const mode of['normal','protect','percent-immune']){const s=H.turn(H.make(move,{soul,enemyId:3221,enemyMoves:[enemyMove],aEffects:{id984:{start:1,end:1,amount:4},...(mode==='protect'?{强化保护:{start:1,end:5}}:{})},bGear:mode==='percent-immune'?{resistance:{percent:100}}:{}}),move,enemyMove);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].stages.atk,mode==='protect'?1:0);assert.equal(H.damage(s,'percent'),mode==='normal'?3000:0);}
});
test('3227两魂783原三或四回合最后一轮反制仍生效，下一轮真实消强无旧反制',()=>{
 for(const soul of[552,553])for(const[move,duration]of[[24579,3],[24632,4]])for(const active of[true,false]){let s=H.turn(H.make(move,{soul,enemyId:3221,enemyMoves:[16600]}),move);const at=duration+(active?0:1);for(let r=2;r<=at;r++)s=H.turn(s,'potion:pp',r===at?16600:'potion:pp');assert.equal(s.fighters[0].stages.atk,0);assert.equal(H.damage(s,'percent'),active?3000:0);}
});
test('3227两魂不灭677当前两回合实际用招吸强，原对方沉默先自强后被吸，第三回合过期不吸',()=>{
 for(const soul of[552,553]){let s=H.turn(H.make(25153,{soul,extraMoves:[20013],enemyId:3227,enemyMoves:[20521],aStats:{spe:4000},bStats:{spe:100},bStages:{atk:1},bEffects:{id984:{start:2,end:3,amount:2}}}),25153,20521);assert.equal(s.fighters[0].stages.atk,1);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.def,2);s=H.turn(s,20013,20521);assert.equal(s.turns.at(-1).first,1);assert.equal(s.fighters[0].stages.def,3);assert.equal(s.fighters[0].stages.spd,4);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);s=H.turn(s,20013,20521);assert.equal(s.fighters[1].stages.def,1);assert.equal(s.fighters[1].stages.spd,2);}
});
test('3227两魂月色502有效直接攻击按当前HP六分一削减，红伤与固伤免疫不阻，属性MISS及过期不触发',()=>{
 for(const soul of[552,553])for(const miss of[false,true]){let s=H.turn(H.make(24631,{soul,aHp:1000,aStats:{def:500,spd:1000},extraMoves:[10250,20013],aEffects:miss?{攻击必失:{start:2,end:2}}:{},bEffects:{攻击伤害免疫:{start:1,end:6}},bGear:{resistance:{fixed:100}}}),24631);s=H.turn(s,10250);assert.equal(H.damage(s,'attack'),0);assert.equal(H.damage(s,'fixed'),0);assert.equal(H.damage(s,'percent'),miss?0:1500);s=H.turn(s,20013);assert.equal(H.damage(s,'percent'),0);s=H.turn(s,10250);assert.equal(H.damage(s,'percent'),miss?1500:1250);s=H.turn(s,10250);assert.equal(H.damage(s,'percent'),0);}
});
