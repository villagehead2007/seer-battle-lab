'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
test('3221原543严格比较当前体力才红伤增减49，等体不增不减且原邪灵魔光固定30不随增伤变化',()=>{
 const attack=hp=>{let fixed,old=H.E.SOULS;H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterAttack'&&c.a.side===0)fixed=c.outgoingSettledDamage('fixed');}};let s;try{s=H.turn(H.make(14398,{aHp:hp,bHp:5000}),14398);}finally{H.E.SOULS=old;}assert.equal(fixed,30,'原技能固伤不含随后魂印的回末吸取');return s;},equal=attack(5000),high=attack(6000),low=attack(4000);assert.ok(Math.abs(H.damage(high,'attack')-H.damage(equal,'attack')*1.49)<=2);assert.equal(H.damage(low,'attack'),H.damage(equal,'attack'));const incoming=hp=>H.turn(H.make(10004,{aHp:hp,bHp:5000,enemyMoves:[10086]}),'potion:pp',10086);const incomingEqual=incoming(5000),incomingLow=incoming(4000),incomingHigh=incoming(6000);assert.ok(Math.abs(H.damage(incomingLow,'attack',1)-H.damage(incomingEqual,'attack',1)*.51)<=2);assert.equal(H.damage(incomingHigh,'attack',1),H.damage(incomingEqual,'attack',1));
});
test('3221未注明类别的49减伤按既有人答只减红伤，真实原固伤百分比和铭唤汲取真伤均不减',()=>{
 let s=H.turn(H.make(10004,{aHp:4000,bHp:6000,enemyMoves:[19070]}),'potion:pp',19070);assert.equal(H.damage(s,'fixed',1),100);s=H.turn(H.make(10004,{aHp:3500,bHp:4000,enemyId:3211,enemyMoves:[25114]}),'potion:pp',25114);assert.equal(H.damage(s,'percent',1),3000);s=H.turn(H.make(10004,{aHp:1000,enemyId:4785}),'potion:pp');assert.equal(H.damage(s,'true',1),90);
});
test('3221魂543吸取依API323固定点数为固定伤害，90至270封顶，免疫保1不截理论回复并服从禁疗',()=>{
 let s=H.make(10004,{aHp:1000});for(const amount of[90,180,270,270]){const hp=s.fighters[0].hp;s=H.turn(s,'potion:pp');assert.equal(H.damage(s,'fixed'),amount);assert.equal(H.damage(s,'true'),0);assert.equal(s.fighters[0].hp,hp+amount);}
 for(const mode of['immune','floor','heal-block']){let q=H.make(10004,{aHp:1000,bHp:mode==='floor'?1:9000,bGear:mode==='immune'?{resistance:{fixed:100}}:{},bEffects:mode==='floor'?{致命保留:{start:1,end:5,hp:1}}:{},aEffects:mode==='heal-block'?{四杀鬼囹:{start:1,end:5}}:{}});q=H.turn(q,'potion:pp');if(mode==='immune')assert.equal(H.damage(q,'fixed'),0);if(mode==='floor')assert.equal(q.fighters[1].hp,1);assert.equal(q.fighters[0].hp,mode==='heal-block'?1000:1090);}
});
test('3221原魂固定吸取在真实迟入场及下场返场均从90开始，不按整场轮数误增或保留旧成长',()=>{
 function member(id){const snapshot=store.species(id);return{snapshot,moves:H.E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}let g=T.create([[member(2989),member(3221)],[member(2989)]],[0,0],{seed:14,criticals:false});for(let i=0;i<2;i++)g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(H.damage(g.battle,'fixed'),90);g=T.turn(g,['potion:pp','potion:pp']);assert.equal(H.damage(g.battle,'fixed'),180);g=T.turn(g,[{switchTo:0},'potion:pp']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(H.damage(g.battle,'fixed'),90);
});
test('3221魂543按原文在战斗阶段结束吸取，进入回合结束阶段前已回复90，不延后到回末',()=>{
 const seen=[],old=H.E.SOULS;H.E.SOULS={...old,run(event,c){if(c.a.side===0&&['combatEnd','roundEnd'].includes(event)){const before=c.a.hp;old.run(event,c);seen.push({event,before,after:c.a.hp});return;}return old.run(event,c);}};try{H.turn(H.make(10004,{aHp:1000}),'potion:pp');}finally{H.E.SOULS=old;}
 assert.deepEqual(seen.find(e=>e.event==='combatEnd'),{event:'combatEnd',before:1000,after:1090});assert.deepEqual(seen.find(e=>e.event==='roundEnd'),{event:'roundEnd',before:1090,after:1090});
});
