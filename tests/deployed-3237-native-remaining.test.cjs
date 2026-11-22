'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3237-native.cjs');
test('3237天罡180清实际回合受保护阻挡而619独立授次两回全招先制负一，第四轮恢复',()=>{
 for(const protect of[false,true]){let s=H.turn(H.make(16959,{aStages:{acc:6},aStats:{spe:1},bStats:{spe:4000},extraMoves:[22411],enemyMoves:[20889],bEffects:{攻击必中:{start:1,end:6},...(protect?{protect:{start:1,end:6}}:{})}}),16959,20889);assert.equal(s.turns[0].first,0);assert.equal(!!s.fighters[1].effects.攻击必中,protect);assert.equal(s.fighters[1].effects.id984.amount,-1);for(let r=2;r<=4;r++){s=H.turn(s,22411,20889);assert.equal(s.turns.at(-1).first,r<=3?0:1);}}
});
test('3237天道448原一回末六项弱化一且免弱独立，60当前三回固定100包括药剂回合而第四回过期',()=>{
 const axes=['atk','def','spa','spd','spe','acc'];for(const mode of['normal','immune','fixed-immune']){let s=H.turn(H.make(16960,{aStages:{acc:6},bEffects:mode==='immune'?{免弱:{start:1,end:5}}:{},bGear:mode==='fixed-immune'?{resistance:{fixed:100}}:{}}),16960);for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='immune'?0:-1);assert.equal(H.damage(s,'fixed'),mode==='fixed-immune'?0:100);for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp');for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='immune'?0:-1);assert.equal(H.damage(s,'fixed'),r<=3&&mode!=='fixed-immune'?100:0);}}
});
test('3237神明与梵音原408各减红200或250三回，按原冲顶完整减伤前伤害核对差额与第四回到期',()=>{
 for(const[move,reduction]of[[23838,200],[25172,250]]){let s=H.make(move,{aStats:{spe:4000,def:500},enemyMoves:[10086],bStats:{atk:9999}});for(let r=1;r<=4;r++){s=H.turn(s,r===1?move:'potion:pp',10086);const event=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===1&&e.damage?.type==='attack'),raw=Number(event?.detail.match(/=\s*(\d+)；暴击伤害抗性/)?.[1]);assert.ok(raw>250,event?.detail);assert.equal(H.damage(s,'attack',1),Math.max(0,raw-(r<=3?reduction:0)));if(r<=3)assert.ok(H.damage(s,'attack',1)<=300);}}
});
test('3237梵音843次两回全技能先制二，原属性神之寂亦反超且第四轮按速度恢复',()=>{
 let s=H.turn(H.make(25172,{aStats:{spe:1},bStats:{spe:4000},extraMoves:[22411],enemyMoves:[10086]}),25172,10086);assert.equal(s.turns[0].first,1);for(let r=2;r<=4;r++){s=H.turn(s,22411,10086);assert.equal(s.turns.at(-1).first,r<=3?0:1);}
});
test('3237万物和天佑原五回免异实际安魂曲不能睡眠，最后一轮保护、到期真实恢复控制',()=>{
 for(const move of[22412,23837]){let s=H.turn(H.make(move,{seed:1,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100}}),move,22053);for(let r=1;r<=5;r++){if(r>1)s=H.turn(s,'potion:pp',22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);}let found=false;for(let r=6;r<=9&&!found;r++){s=H.turn(s,'potion:pp',22053);found=!!s.fighters[0].ailments.睡眠;}assert.ok(found);}
});
test('3237不动原191四回免反异常，安魂曲真实反弹敌自身且不消耗免异次数',()=>{
 let found=false;for(let seed=1;seed<=16&&!found;seed++){const s=H.turn(H.make(25171,{seed,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},aCounts:{immune:1}}),25171,22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].effects.reflect.end,4);found=!!s.fighters[1].ailments.睡眠;}assert.ok(found);
});
test('3237轮回705真实互换当前HP按各自上限截断且不当作技能回复，616严格低于三分一才排序先制二',()=>{
 for(const ban of[false,true]){const s=H.turn(H.make(23836,{aHp:2000,bHp:8000,aStats:{maxHp:3000},aEffects:ban?{技能禁疗:{start:1,end:2}}:{}}),23836);assert.equal(s.fighters[0].hp,3000);assert.equal(s.fighters[1].hp,2000);assert.equal((s.damageEvents??[]).length,0);}for(const hp of[2999,3000,3001]){const s=H.turn(H.make(23836,{aHp:hp,aStats:{spe:1},bStats:{spe:4000},enemyMoves:[10086]}),23836,10086),red=H.damage(s,'attack',1),first=hp<3000;assert.equal(s.turns[0].first,first?0:1);assert.equal(s.fighters[0].hp,9000-(first?red:0));assert.equal(s.fighters[1].hp,hp-(first?0:red));}
});
test('3237不破1004三回有效技能附150或高体300固定，药剂不触发、最后一轮有效、到期和免固',()=>{
 for(const high of[false,true])for(const immune of[false,true]){let s=H.turn(H.make(30132,{aHp:high?9000:1000,aStages:{acc:6},extraMoves:[14102],bGear:immune?{resistance:{fixed:100}}:{}}),30132),fixed=immune?0:high?300:150;assert.equal(H.damage(s,'fixed'),fixed);s=H.turn(s,'potion:pp');assert.equal(H.damage(s,'fixed'),0);s=H.turn(s,14102);assert.equal(H.damage(s,'fixed'),fixed);s=H.turn(s,14102);assert.equal(H.damage(s,'fixed'),0);}
});
