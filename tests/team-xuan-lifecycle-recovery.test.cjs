'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';

test('玄武无论首发或初始场下均在战斗开始只提升本人面板，实际来回驱逐不叠面板或免费回满体力',()=>{
 for(const lead of [0,1]){
  let g=T.create([[member(3102),member(4995)],[member(3102)]],[lead,0],{seed:14,criticals:false});const x=g.slots[0][1].fighter;
  assert.equal(x.stats.maxHp,10200);assert.equal(x.stats.def,5200);assert.equal(x.stats.spd,5200);assert.equal(x.stats.atk,1380);assert.equal(x.stats.spe,1000);assert.equal(g.slots[0][0].fighter.stats.maxHp,9000);
  x.hp=2345;const expected=structuredClone(x.stats);for(let i=0;i<4;i++){g=T.turn(g,[{switchTo:1-g.active[0]},pp]);assert.deepEqual(g.slots[0][1].fighter.stats,expected);assert.equal(g.slots[0][1].fighter.hp,2345);assert.equal(g.slots[0][0].fighter.stats.maxHp,9000);}
 }
});

test('玄武真实在场回初授予全队共享一次免异，换到队友实际中毒消费全队同一份，场下源不再每回合刷新',()=>{
 let g=T.create([[member(4995),member(3102)],[member(4925,[20020])]],[0,0],{seed:14,criticals:false});g.slots[0][1].fighter.counts.immune=2;
 g=T.turn(g,[pp,pp]);assert.equal(g.battle.teamXuan2144Guard[0].count,1);assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.slots[0][1].fighter.counts.immune,3);
 g=T.turn(g,[{switchTo:1-g.active[0]},'wiki:20020']);assert.equal(g.active[0],1);assert.equal(g.battle.teamXuan2144Guard[0].count,0);assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);assert.equal(g.slots[0][0].fighter.counts.immune,0);assert.equal(g.battle.fighters[0].counts.immune,2);
 for(let i=0;i<2;i++)g=T.turn(g,[pp,'wiki:20020']);assert.equal(g.battle.fighters[0].counts.immune,0);g=T.turn(g,[pp,'wiki:20020']);assert.ok(g.battle.fighters[0].ailments['中毒']>=g.battle.round);assert.equal(g.battle.teamXuan2144Guard[0].count,0);
});

test('玄武共享次数同源刷新至一且有正强化不新增，无源在场不凭场下存在发放',()=>{
 let g=T.create([[member(4995),member(3102)],[member(3102)]],[0,0],{seed:14,criticals:false});for(let i=0;i<3;i++){g=T.turn(g,[pp,pp]);assert.equal(g.battle.teamXuan2144Guard[0].count,1);assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.slots[0][1].fighter.counts.immune,1);}
 let h=T.create([[member(4995),member(3102)],[member(3102)]],[0,0],{seed:14,criticals:false});h.battle.fighters[0].stages.atk=1;h=T.turn(h,[pp,pp]);assert.equal(h.battle.teamXuan2144Guard,undefined);h=T.turn(h,[{switchTo:1-h.active[0]},pp]);assert.equal(h.battle.teamXuan2144Guard,undefined);
});

test('存活场下玄武保护队友真实系别不被天道宁论剥离，死者消逝来源均不提供保护',()=>{
 for(const mode of ['alive','dead','vanished']){
  let g=T.create([[member(3102),member(4995)],[member(3847,[29011])]],[0,0],{seed:14,criticals:false});const source=g.slots[0][1].fighter;if(mode==='dead')source.hp=0;if(mode==='vanished')source.soulState.vanished=true;const type=g.battle.fighters[0].type;
  g=T.turn(g,[pp,'wiki:29011']);assert.equal(g.battle.fighters[0].type,mode==='alive'?type:'普通');
 }
});

test('玄武五回真实低概率冻伤执行成长至五层永久八方，实际驱逐及返场保留层数与永久状态',()=>{
 let g=T.create([[member(4995),member(3102)],[member(4823,[33280])]],[0,0],{seed:14,criticals:false});for(let i=1;i<=5;i++){g=T.turn(g,[pp,'wiki:33280']);assert.equal(g.battle.fighters[0].soulState.xuan2144.layers,i);}assert.equal(g.battle.fighters[0].soulState.emperor2144.permanent,true);
 g=T.turn(g,[{switchTo:1-g.active[0]},'potion:hp']);assert.equal(g.slots[0][0].fighter.soulState.xuan2144.layers,5);assert.equal(g.battle.fighters[0].soulState.emperor2144,undefined);g=T.turn(g,[{switchTo:1-g.active[0]},pp]);assert.equal(g.battle.fighters[0].soulState.xuan2144.layers,5);assert.equal(g.battle.fighters[0].soulState.emperor2144.permanent,true);
 const before=structuredClone(g);assert.equal(g.battle.teamXuan2144Guard[0].count,0);assert.match(D.team(g,0).find(e=>e.name==='玄武队伍免异').value,/共享剩余 0 次/);const display=D.fighter(g.battle.fighters[0],g.battle.round).items;assert.equal(display.find(e=>e.name==='气吞山河').value,'5 / 5 层');assert.match(display.find(e=>e.name==='玄武开战面板').value,/各 \+1200/);assert.match(display.find(e=>e.name==='八方真武帝').value,/永久.*下场保留/);assert.deepEqual(g,before);
});

test('玄武原生先手技能令对方最低零PP授临时八方，实际驱逐清除临时状态而不传给队友',()=>{
 let g=T.create([[member(4995,[20276],{spe:9999}),member(3102)],[member(3102,[10127])]], [0,0],{seed:14,criticals:false});g.battle.fighters[1].pp[g.battle.fighters[1].moves[0]]=0;
 g=T.turn(g,['wiki:20276','wiki:10127']);assert.equal(g.battle.fighters[0].soulState.emperor2144.permanent,false);assert.ok(g.battle.fighters[0].soulState.emperor2144.end>=g.battle.round);
 g=T.turn(g,[{switchTo:1-g.active[0]},pp]);assert.equal(g.slots[0][0].fighter.soulState.emperor2144,undefined);assert.equal(g.battle.fighters[0].soulState.emperor2144,undefined);g=T.turn(g,[{switchTo:1-g.active[0]},pp]);assert.equal(g.battle.fighters[0].soulState.emperor2144,undefined);
});



