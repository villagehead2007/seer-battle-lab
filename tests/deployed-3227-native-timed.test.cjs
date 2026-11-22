'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs');
test('3227两魂三原免异各三或四回合，真实安魂曲在窗口失败、到期恢复睡眠',()=>{
 for(const soul of[552,553])for(const[move,duration]of[[24484,3],[24579,4],[24631,4]]){let s=H.turn(H.make(move,{soul,seed:1,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100}}),move,22053),n=0;for(let r=1;r<=duration;r++){if(r>1)s=H.turn(s,'potion:pp',22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);n+=s.turns.at(-1).events.filter(e=>e.text.includes('免疫睡眠')).length;}assert.ok(n>0);for(let r=0;r<3&&!s.fighters[0].ailments.睡眠;r++)s=H.turn(s,'potion:pp',22053);assert.ok(s.fighters[0].ailments.睡眠);}
});
test('3227两魂耀世月华原191四回反弹，真实安魂曲返施放者且免异次数不消耗',()=>{
 for(const soul of[552,553]){let found=false;for(let seed=1;seed<=16&&!found;seed++){const s=H.turn(H.make(25154,{soul,seed,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},aCounts:{immune:1}}),25154,22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].effects.reflect.end,4);found=!!s.fighters[1].ailments.睡眠;}assert.ok(found);}
});
test('3227两魂不灭夜辉843次两回合全技能先制一，真实属性反超且第四轮恢复速度排序',()=>{
 for(const soul of[552,553]){let s=H.turn(H.make(25153,{soul,aStats:{spe:1},bStats:{spe:4000},extraMoves:[20013],enemyMoves:[10086]}),25153,10086);assert.equal(s.turns[0].first,1);assert.equal(s.fighters[0].effects.id984.amount,1);for(let r=2;r<=4;r++){s=H.turn(s,20013,10086);assert.equal(s.turns.at(-1).first,r<=3?0:1);}}
});
test('3227两魂九天月坠726次两回合仅在对手先出手时令其攻击无效，授予当轮及第四轮不无效',()=>{
 for(const soul of[552,553])for(const fast of[false,true]){let s=H.turn(H.make(30092,{soul,aStages:{acc:6},aStats:{spe:fast?4000:1},bStats:{spe:fast?100:4000,def:1000,spd:1000},enemyMoves:[10086],extraMoves:[10250]}),30092,10086);assert.equal(s.turns[0].first,0);assert.ok(H.damage(s,'attack',1)>0);for(let r=2;r<=4;r++){s=H.turn(s,10250,10086);assert.equal(s.turns.at(-1).first,fast?0:1);if(!fast&&r<=3)assert.equal(H.damage(s,'attack',1),0);else assert.ok(H.damage(s,'attack',1)>0);assert.ok(H.damage(s,'attack')>0);}}
});
