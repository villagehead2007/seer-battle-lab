'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs');
test('3223两魂弥天战威四回与石破天惊五回真实免弱，原破攻降攻二到期恢复',()=>{
 for(const soul of[558,566])for(const[move,duration]of[[25140,4],[25142,5]]){let s=H.turn(H.make(move,{soul,enemyMoves:[20241],aStats:{spe:4000},bStats:{spe:100}}),move,20241);assert.equal(s.fighters[0].stages.atk,0);for(let r=2;r<=duration;r++){s=H.turn(s,'potion:pp',20241);assert.equal(s.fighters[0].stages.atk,0);}s=H.turn(s,'potion:pp',20241);assert.equal(s.fighters[0].stages.atk,-2);}
});
test('3223两魂弥天战威四回免异实际免睡眠，到期真实安魂曲恢复',()=>{
 for(const soul of[558,566]){let s=H.turn(H.make(25140,{soul,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},seed:1}),25140,22053),immune=0;for(let r=1;r<=4;r++){if(r>1)s=H.turn(s,'potion:pp',22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);immune+=s.turns.at(-1).events.filter(e=>e.text.includes('免疫睡眠')).length;}assert.ok(immune>0);for(let i=0;i<3&&!s.fighters[0].ailments.睡眠;i++)s=H.turn(s,'potion:pp',22053);assert.ok(s.fighters[0].ailments.睡眠);}
});
test('3223两魂弥天战威408当前三回合减红250，与同种子真实冲顶对照不改随机流，第四回合恢复',()=>{
 for(const soul of[558,566]){const options={soul,aStats:{spe:4000,def:1000},bStats:{atk:9999},enemyMoves:[10086]};let s=H.make(25140,options),control=H.make(25140,options);for(let r=1;r<=4;r++){s=H.turn(s,r===1?25140:'potion:pp',10086);control=H.turn(control,'potion:pp',10086);assert.equal(s.rng,control.rng,'实际原招定时效果不改变抽样流');const raw=H.damage(control,'attack',1);assert.ok(raw>250);assert.equal(H.damage(s,'attack',1),r<=3?raw-250:raw);}}
});
test('3223两魂气定神闲843下两回合属性也先制二，授予当轮不抢先且到期恢复',()=>{
 for(const soul of[558,566]){let s=H.turn(H.make(25143,{soul,aStats:{spe:1},bStats:{spe:4000},extraMoves:[20117],enemyMoves:[10086]}),25143,10086);assert.equal(s.turns[0].first,1);for(let r=2;r<=4;r++){s=H.turn(s,20117,10086);assert.equal(s.turns.at(-1).first,r<=3?0:1);}}
});
