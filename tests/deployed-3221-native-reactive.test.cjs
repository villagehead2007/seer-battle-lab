'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs');
test('3221王者之战526当前三回合对手真实属性成功各受固定300，整招封属失败不罚且第四回合到期',()=>{
 let s=H.turn(H.make(24873,{aHp:1000,aStats:{spe:4000},enemyMoves:[20241]}),24873,20241);assert.equal(H.damage(s,'fixed'),390);for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp',20241);assert.equal(H.damage(s,'fixed'),(r===2?180:270)+(r<=3?300:0));}s=H.turn(H.make(24873,{aHp:1000,aStats:{spe:4000},enemyMoves:[20241],bEffects:{statusBlock:{start:1,end:5}}}),24873,20241);assert.equal(H.damage(s,'fixed'),90);assert.equal(s.fighters[0].stages.atk,1);
});
test('3221九死一生470按原格式四回合攻击命中49疲惫，MISS属性不触发，第四回合仍有概率而第五回合到期',()=>{
 let lastRoundAttempt=false;for(let seed=1;seed<=48&&!lastRoundAttempt;seed++){let s=H.turn(H.make(24894,{seed,extraMoves:[10004,20496],aStages:{acc:6},aEffects:{攻击必失:{start:2,end:2}},bEffects:{免异常:{start:1,end:4}}}),24894);assert.equal(s.fighters[0].effects.攻击附加异常.end,4);assert.equal(s.fighters[1].ailments.疲惫,undefined);s=H.turn(s,10004);assert.equal(H.damage(s,'attack'),0);assert.equal(s.fighters[1].ailments.疲惫,undefined);assert.equal(s.turns.at(-1).events.some(e=>e.text.includes('免疫疲惫')),false);s=H.turn(s,20496);assert.equal(s.turns.at(-1).events.some(e=>e.text.includes('免疫疲惫')),false);s=H.turn(s,10004);lastRoundAttempt=s.turns.at(-1).events.some(e=>e.text.includes('免疫疲惫'));assert.equal(s.fighters[0].effects.攻击附加异常,undefined);s=H.turn(s,10004);assert.equal(s.fighters[1].ailments.疲惫,undefined);}assert.ok(lastRoundAttempt,'原第四回合实际抽中被免疫，第五回合没有旧控制');
});
test('3221九死一生191反弹真实安魂曲优先于次数免异并保留免异次数',()=>{
 let reflected=false;for(let seed=1;seed<=16&&!reflected;seed++){const initial=H.make(24894,{seed,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100}});initial.fighters[0].counts.immune=1;const s=H.turn(initial,24894,22053);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].ailments.睡眠,undefined);reflected=!!s.fighters[1].ailments.睡眠;}assert.ok(reflected);
});
test('3221九死一生470真实攻击命中自然产生疲惫及未触发两支，不把免疫日志代替成功施加',()=>{
 let yes=false,no=false;for(let seed=1;seed<=48&&!(yes&&no);seed++){let s=H.turn(H.make(24894,{seed,extraMoves:[10004],aStages:{acc:6}}),24894);s=H.turn(s,10004);assert.ok(H.damage(s,'attack')>0);if(s.fighters[1].ailments.疲惫)yes=true;else no=true;}assert.ok(yes&&no);
});
