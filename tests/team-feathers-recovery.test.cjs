'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';
test('神羽权重规则组件明确皮皮比波波克尔百分之十十一十二，排除本人死者与消逝；不伪称未部署物种实战',()=>{
 const owner={number:4732,hp:1,soulState:{}},others=[10,11,12,3102,3056].map(number=>({number,hp:1,soulState:{}})),weight=E.SOULS.registry[1930].abilities.weight;assert.equal(weight([owner,...others],owner),.43);others[0].hp=0;others[1].soulState.vanished=true;assert.equal(weight([owner,...others],owner),.22);assert.equal(weight([owner],owner),0);
});
test('闪光皮神真实零至五个活队友独立增红伤减红伤，攻击吸血按完整红伤且回末每羽50分开结算',()=>{
 const allies=[3102,3056,2988,3311,3393];let baselineOut,baselineIn;
 for(let n=0;n<=5;n++){
  let g=T.create([[member(4732,[10001],{atk:1000,def:300}),...allies.slice(0,n).map(id=>member(id))],[member(3102,[10127],{atk:1000})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=2000;let heal;
  const old=E.SOULS;E.SOULS={...old,run(event,c){const before=c.a.hp;old.run(event,c);if(event==='damageDealt'&&c.a.soulId===1930&&c.type==='attack')heal={before,after:c.a.hp,dealt:c.settledDamage};}};try{g=T.turn(g,['wiki:10001',pp]);}finally{E.SOULS=old;}
  const red=g.battle.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).reduce((a,e)=>a+e.settledDamage,0);if(n===0)baselineOut=red;assert.ok(Math.abs(red-baselineOut*(1+.05*n))<=2);assert.ok(heal);assert.equal(heal.after-heal.before,Math.floor(heal.dealt*.05*n));assert.equal(g.battle.fighters[0].hp,heal.after+350);
  let h=T.create([[member(4732,[],{def:300}),...allies.slice(0,n).map(id=>member(id))],[member(3102,[10127],{atk:1000})]],[0,0],{seed:14,criticals:false});h.battle.fighters[0].hp=5000;h=T.turn(h,[pp,'wiki:10127']);const incoming=h.battle.damageEvents.filter(e=>e.type==='attack'&&e.targetSide===0).reduce((a,e)=>a+e.settledDamage,0);if(n===0)baselineIn=incoming;assert.ok(Math.abs(incoming-baselineIn*(1-.05*n))<=2);
 }
});
test('神羽真实场下资源同时满足严格低半与低于本人才消耗，加至本人受目标上限，不当作复活或无条件回复',()=>{
 for(const [hp,ownerHp,max,expected,spent]of [[4500,5000,9000,4500,0],[4499,4499,9000,4499,0],[4499,4500,9000,4500,1],[1000,9000,3000,3000,1]]){
  let g=T.create([[member(3102,[],{maxHp:max}),member(4732)],[member(3102)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=hp;g.slots[0][1].fighter.hp=ownerHp;g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].hp,expected);assert.equal(g.slots[0][1].fighter.soulState.feathers1930,7-spent);
 }
});
test('神羽真实七轮挨叩击逐片支援耗尽，源返场不重置资源，原生撞击用后真正施加睡眠',()=>{
 let g=T.create([[member(3102,[],{def:50}),member(4732,[10001])],[member(3102,[10127],{atk:9999,spe:9999})]],[0,0],{seed:14,criticals:false});for(let i=1;i<=7;i++){g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].hp,9000);assert.equal(g.slots[0][1].fighter.soulState.feathers1930,7-i);}assert.equal(g.slots[0][1].fighter.soulState.lostFeathers1930,true);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].soulState.feathers1930,0);g=T.turn(g,['wiki:10001',pp]);assert.ok(g.battle.fighters[1].ailments['睡眠']>=g.battle.round);assert.equal(g.battle.fighters[0].soulState.feathers1930,0);
});
test('神羽来源死者或消逝不支援，神羽与存活队友加成中文读取不改状态随机数',()=>{
 for(const mode of ['dead','vanished']){let g=T.create([[member(3102),member(4732)],[member(3102)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=1000;if(mode==='dead')g.slots[0][1].fighter.hp=0;else g.slots[0][1].fighter.soulState.vanished=true;g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].hp,1000);}
 const g=T.create([[member(4732),member(3102)],[member(3102)]],[0,0],{seed:14,criticals:false}),before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='队伍神羽').value,/7 \/ 7/);assert.match(D.team(g,0).find(x=>x.name==='存活队友增益').value,/5%/);assert.deepEqual(g,before);
});
