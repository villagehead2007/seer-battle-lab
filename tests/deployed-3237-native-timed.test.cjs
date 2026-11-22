'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3237-native.cjs');
test('3237不动之天738原对手属性后才封下两回攻击，当轮属性正常且第四轮恢复原攻击',()=>{
 let s=H.turn(H.make(25171,{enemyMoves:[20241,10086],bStats:{atk:9999},aStats:{def:1000}}),25171,20241);assert.equal(s.fighters[0].stages.atk,-2);for(let r=2;r<=4;r++){const pp=s.fighters[1].pp['wiki:10086'];s=H.turn(s,'potion:pp',10086);assert.equal(s.fighters[1].pp['wiki:10086'],pp-1);if(r<=3)assert.equal(H.damage(s,'attack',1),0);else assert.ok(H.damage(s,'attack',1)>300);}
});
test('3237天佑明尊707原低于三分一回复翻倍，2999和3000及3001严格边界、禁疗与封顶',()=>{
 for(const hp of[2999,3000,3001,8950])for(const ban of[false,true]){const s=H.turn(H.make(23837,{aHp:hp,aEffects:ban?{技能禁疗:{start:1,end:5}}:{}}),23837);assert.equal(s.fighters[0].hp,ban?hp:Math.min(9000,hp+(hp<3000?6000:3000)));}
});
test('3237万物苍生原回满与五回免弱免异，技能禁疗只阻恢复，最后一轮保护而第六轮恢复降防',()=>{
 for(const ban of[false,true]){let s=H.turn(H.make(22412,{aHp:1000,enemyId:3227,enemyMoves:[20013],aEffects:ban?{技能禁疗:{start:1,end:5}}:{}}),22412);assert.equal(s.fighters[0].hp,ban?1000:9000);assert.ok(s.fighters[0].effects.免弱);assert.ok(s.fighters[0].effects.免异常);for(let r=2;r<=6;r++){s=H.turn(s,'potion:pp',20013);assert.equal(s.fighters[0].stages.def,r<=5?0:-1);}}
});
