'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs');
test('3221原战将之心九念无动九转归魂手免异各三四二回合，到期真实安魂曲恢复睡眠',()=>{
 for(const[move,duration]of[[23641,3],[24872,4],[30075,2]]){let s=H.turn(H.make(move,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},aStages:{acc:6},seed:1}),move,22053),immune=0;for(let r=1;r<=duration;r++){if(r>1)s=H.turn(s,'potion:pp',22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);immune+=s.turns.at(-1).events.filter(e=>e.text.includes('免疫睡眠')).length;}assert.ok(immune>0);assert.equal(s.fighters[0].effects.免异常,undefined);for(let n=0;n<3&&!s.fighters[0].ailments.睡眠;n++)s=H.turn(s,'potion:pp',22053);assert.ok(s.fighters[0].ailments.睡眠,move+'到期');}
});
test('3221九死一生真实四回合反弹异常，原安魂曲控制返至施放者',()=>{
 let reflected=false;for(let seed=1;seed<=16&&!reflected;seed++){const s=H.turn(H.make(24894,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},seed}),24894,22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[0].effects.reflect.end,4);reflected=!!s.fighters[1].ailments.睡眠;}assert.equal(reflected,true);
});
test('3221两招481只提升下一个或下两个回合攻击先制，属性不享受，授予当轮及到期不反超',()=>{
 for(const[grant,duration]of[[23642,1],[24872,2]])for(const action of[10004,20496]){let s=H.turn(H.make(grant,{extraMoves:[10004,20496],enemyMoves:[10086],aStats:{spe:1},bStats:{spe:4000}}),grant,10086);assert.equal(s.turns[0].first,1);for(let r=2;r<=duration+2;r++){s=H.turn(s,action,10086);assert.equal(s.turns.at(-1).first,action===10004&&r<=duration+1?0:1,grant+':'+action+':R'+r);}}
});
test('3221九死一生843原招下两回合属性技能也先制加二，第三轮后恢复速度排序',()=>{
 let s=H.turn(H.make(24894,{extraMoves:[20496],enemyMoves:[10086],aStats:{spe:1},bStats:{spe:4000}}),24894,10086);assert.equal(s.turns[0].first,1);assert.equal(s.fighters[0].effects.id984.amount,2);for(let r=2;r<=4;r++){s=H.turn(s,20496,10086);assert.equal(s.turns.at(-1).first,r<=3?0:1);}
});
test('3221战将之气408当前两回合定额减红100，属性直伤260降160，到期恢复260且不影响原魂固定吸取',()=>{
 let s=H.make(23640,{aHp:8000,bHp:5000,enemyId:3142,enemyMoves:[24970],aEffects:{id984:{start:1,end:1,amount:4}}});s=H.turn(s,23640,24970);assert.equal(s.turns[0].first,0);assert.equal(H.damage(s,'attack',1),160);assert.equal(H.damage(s,'fixed'),90);s=H.turn(s,'potion:pp',24970);assert.equal(H.damage(s,'attack',1),160);assert.equal(H.damage(s,'fixed'),180);s=H.turn(s,'potion:pp',24970);assert.equal(H.damage(s,'attack',1),260);assert.equal(H.damage(s,'fixed'),270);
});
test('3221战将之气611下两回合原攻击各附固定100，授予当轮无附加且第四回合到期',()=>{
 let s=H.turn(H.make(23640,{extraMoves:[10004]}),23640);assert.equal(H.damage(s,'fixed'),90);s=H.turn(s,10004);assert.equal(H.damage(s,'fixed'),280);s=H.turn(s,10004);assert.equal(H.damage(s,'fixed'),370);s=H.turn(s,10004);assert.equal(H.damage(s,'fixed'),270);
});
test('3221战将之心57当前三回合用招回四分一，药剂不触发，过期只剩原魂吸取',()=>{
 let s=H.turn(H.make(23641,{aHp:1000,extraMoves:[20496]}),23641);assert.equal(s.fighters[0].hp,3340);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].hp,3520);s=H.turn(s,20496);assert.equal(s.fighters[0].hp,6040);s=H.turn(s,20496);assert.equal(s.fighters[0].hp,6310);
});
test('3221九武圣尊532按统一实际回复造成等量百分比，3000与封顶50及满血0，禁疗0和免粉分别处理',()=>{
 for(const[hp,blocked,immune,expected]of[[1000,false,false,3000],[8950,false,false,50],[9000,false,false,0],[1000,true,false,0],[1000,false,true,0]]){const s=H.turn(H.make(24895,{aHp:hp,aEffects:blocked?{技能禁疗:{start:1,end:5}}:{},bGear:immune?{resistance:{percent:100}}:{}}),24895);assert.equal(H.damage(s,'percent'),expected);assert.equal(s.fighters[0].hp,Math.min(9000,hp+(blocked?0:3000)+90));}
});

