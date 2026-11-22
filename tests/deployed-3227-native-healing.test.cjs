'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs');
test('3227两魂三原57各三四五回合与四分一或三分一回复，药剂不回，禁疗与真实到期分开',()=>{
 for(const soul of[552,553])for(const[move,duration,heal]of[[24484,3,2250],[24632,4,2250],[25153,5,3000]]){let s=H.turn(H.make(move,{soul,aHp:1000,extraMoves:[20013],aEffects:{技能禁疗:{start:4,end:5}}}),move);assert.equal(s.fighters[0].hp,1000+heal);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].hp,1000+heal);s=H.turn(s,20013);assert.equal(s.fighters[0].hp,1000+heal*2);for(let r=4;r<=6;r++){s=H.turn(s,20013);assert.equal(s.fighters[0].hp,1000+heal*2);if(r>=duration)assert.equal(s.fighters[0].effects.id57,undefined);}}
});
test('3227两魂耀世月华1039按回复时严格低半才回满，4499与4500及4501原生边界、技能禁疗和封顶',()=>{
 for(const soul of[552,553])for(const hp of[4499,4500,4501,8950])for(const ban of[false,true]){const s=H.turn(H.make(25154,{soul,aHp:hp,aEffects:ban?{技能禁疗:{start:1,end:5}}:{}}),25154);assert.equal(s.fighters[0].hp,ban?hp:hp<4500?9000:Math.min(9000,hp+3000));}
});
test('3227两魂月色417原五回合只吸完整红伤，保1实际损失零仍回红伤，独立魂印按自身双防回复不混入吸血',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]])for(const ban of[false,true]){let s=H.turn(H.make(24631,{soul,aHp:1000,bHp:1,aStats:{def:1000,spd:2000},bStats:{def:2000,spd:3000},aStages:{acc:6},extraMoves:[10250],bEffects:{致命保留:{start:1,end:10,hp:1}},aEffects:ban?{技能禁疗:{start:2,end:5}}:{}}),24631);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[0].effects.攻击吸血.end,5);for(let r=2;r<=6;r++){const before=s.fighters[0].hp;s=H.turn(s,r===3?'potion:pp':10250);assert.equal(s.fighters[1].hp,1);if(r===3){assert.equal(s.fighters[0].hp,before);continue;}const red=H.damage(s,'attack');assert.ok(red>0);assert.equal(s.fighters[0].hp,before+3000*fraction+(!ban&&r<=5?red:0));assert.equal(H.damage(s,'percent'),0);}}
});
test('3227两魂三原57已授后真实MISS或整招无效仍按既有实际用招规则回复，原攻击魂印不触发',()=>{
 for(const soul of[552,553])for(const[move,heal]of[[24484,2250],[24632,2250],[25153,3000]])for(const mode of['miss','invalid']){let s=H.turn(H.make(move,{soul,aHp:1000,extraMoves:[10250],aEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:{skillBlock:{start:2,end:2}}}),move);assert.equal(s.fighters[0].hp,1000+heal);s=H.turn(s,10250);assert.equal(H.damage(s,'attack'),0);assert.equal(H.damage(s,'fixed'),0);assert.equal(s.fighters[0].hp,1000+heal*2);assert.equal(s.fighters[0].pp['wiki:10250'],H.source.moves.find(m=>m.id===10250).pp-1);}
});
test('3227两魂不灭57已授后真实原苍白之瀑自然自疲惫，随后未出招不回复不扣PP',()=>{
 for(const soul of[552,553]){let found=false;for(let seed=1;seed<=48&&!found;seed++){let s=H.turn(H.make(25153,{soul,seed,aHp:1,aStats:{def:1,spd:1},aStages:{acc:6},extraMoves:[18186,10250]}),25153);s=H.turn(s,18186);if(!s.fighters[0].ailments.疲惫)continue;found=true;const hp=s.fighters[0].hp,pp=s.fighters[0].pp['wiki:10250'];assert.ok(hp<9000);s=H.turn(s,10250);assert.equal(s.fighters[0].hp,hp);assert.equal(s.fighters[0].pp['wiki:10250'],pp);assert.equal(H.damage(s,'attack'),0);}assert.ok(found,'真实40%自疲惫');}
});
