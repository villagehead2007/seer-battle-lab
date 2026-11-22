'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';
function make(seed=14,controllerSide=0){const teams=[[member(3102),member(3056),member(2988)],[member(3311),member(3393),member(3524)]];teams[controllerSide].push(member(4995));return T.create(teams,[0,0],{seed,criticals:false});}

test('用户纠正玄武位于任一方活背包仅替代离场类别，多种子双方指定不同目标均精确换入',()=>{
 for(let seed=1;seed<=12;seed++)for(const controllerSide of [0,1]){
  const g=make(seed,controllerSide),before=structuredClone(g);assert.equal(T.switchMode(g,0),'expelled');assert.equal(T.switchMode(g,1),'expelled');
  for(const target of [1,2]){const result=T.turn(g,[{switchTo:target},{switchTo:target}]);assert.deepEqual(result.active,[target,target]);for(const side of [0,1]){const event=result.battle.teamDepartureEvents.find(e=>e.side===side);assert.equal(event.kind,'expelled');assert.equal(event.to,target);}}
  assert.throws(()=>T.turn(g,[{switchTo:'random'},pp]),/不可换入/);assert.deepEqual(g,before);
 }
});

test('视为驱逐只允许指定真实存活未消逝替补，来源死者或消逝立即恢复玩家主动指定',()=>{
 let g=make();g.slots[0][1].fighter.hp=0;g.slots[0][2].fighter.soulState.vanished=true;assert.deepEqual(T.candidates(g,0),[3]);assert.throws(()=>T.turn(g,[{switchTo:1},pp]),/不可换入/);g=T.turn(g,[{switchTo:3},pp]);assert.equal(g.active[0],3);
 for(const mode of ['dead','vanished']){let h=make();if(mode==='dead')h.slots[0][3].fighter.hp=0;else h.slots[0][3].fighter.soulState.vanished=true;assert.equal(T.switchMode(h,0),'voluntary');const before=structuredClone(h);assert.throws(()=>T.turn(h,[{switchTo:'random'},pp]),/不可换入/);assert.deepEqual(h,before);h=T.turn(h,[{switchTo:2},pp]);assert.equal(h.active[0],2);assert.equal(h.battle.teamDepartureEvents[0].kind,'voluntary');}
});

test('用户确认视为驱逐的主动指令仍受封换，合法后不触发诡符而普通主动换人照常消费诡符',()=>{
 for(const driven of [true,false]){
  let g=make();if(!driven)g.slots[0][3].fighter.hp=0;const f=g.battle.fighters[0];f.ailments['凝滞']=10;f.effects['不能主动切换']={start:1,end:10};f.soulState.guiFu1747=2;
  assert.deepEqual(T.candidates(g,0),[]);assert.throws(()=>T.turn(g,[{switchTo:1},pp]),/不可换入/);delete f.ailments['凝滞'];delete f.effects['不能主动切换'];g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.hp,driven?9000:8900);assert.equal(g.battle.teamSwitchRound?.[0]??null,driven?null:1);
 }
});

test('驱逐保留转移寒禁库存，主动下场按来源扣除，真实阵亡换人仍由玩家选择不随机',()=>{
 for(const driven of [true,false]){let g=make();if(!driven)g.slots[0][3].fighter.hp=0;g.battle.fighters[0].soulState.coldBan=150;g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].soulState.coldBan,driven?150:0);}
 let h=T.create([[member(3102,[],{maxHp:10,def:1}),member(3056),member(2988),member(4995)],[member(3102,[10127],{atk:9999,spe:9999})]],[0,0],{seed:14,criticals:false});h=T.turn(h,[pp,'wiki:10127']);assert.equal(h.phase,'replace');assert.deepEqual(T.candidates(h,0,true),[1,2,3]);h=T.replace(h,[2,null]);assert.equal(h.active[0],2);assert.equal(h.battle.teamDepartureEvents[0].kind,'knockout');
});

test('驱逐规则与存活来源中文展示只读，不消费随机数或改写队伍',()=>{const g=make(),before=structuredClone(g);assert.match(D.team(g,0).find(e=>e.name==='主动更换视为驱逐').value,/双方仍指定存活替补/);T.switchMode(g,0);T.candidates(g,0);assert.deepEqual(g,before);});

test('存活驱逐不误触古亚尼斯死亡继承或斯布林蒂主动未来链接同步，任何下场的解析解放仍按活体结算',()=>{
 let g=T.create([[member(4940),member(3102)],[member(4995)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].soulState.guardianInheritance2140={sourceHash:'356c53e0'};g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].soulState.guardianParalysisImmune2140,undefined);
 let h=T.create([[member(4600,[],{maxHp:6000}),member(3102)],[member(4995)]],[0,0],{seed:14,criticals:false});h.battle.fighters[0].hp=1234;assert.equal(h.slots[0][1].fighter.soulState.futureLink,3);h=T.turn(h,[{switchTo:1},pp]);assert.equal(h.battle.fighters[0].stats.maxHp,9000);assert.equal(h.battle.fighters[0].hp,9000);
 let p=T.create([[member(4450,[28162]),member(3102)],[member(3056,[10127]),member(4995)]],[0,0],{seed:14,criticals:false});p.battle.fighters[0].hp=3000;p=T.turn(p,[pp,'wiki:10127']);assert.equal(p.battle.fighters[0].soulState.futureParsedMove.id,'wiki:10127');const hp=p.battle.fighters[0].hp;p=T.turn(p,[{switchTo:1},pp]);assert.equal(p.slots[0][0].fighter.hp,Math.min(9000,hp+3000));assert.equal(p.battle.fighters[0].hp,9000);
});
