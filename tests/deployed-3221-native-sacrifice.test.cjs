'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),status=require('../dist/status-rules.js');
function member(id,moves=[],spe=1000){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe}}};}
function make(seed=14){return T.create([[member(3221,[25144]),member(2989,[10086],1),member(3013)],[member(2989,[10086],4000),member(3013)]],[0,0],{seed,criticals:false});}
test('3221九死未悔原1059真实耗尽九千体力为直接损失，80控制自然成败及免异不补抽，原魂死亡不再吸取',()=>{
 let yes=false,no=false;for(let seed=1;seed<=48&&!(yes&&no);seed++){const g=T.turn(make(seed),['wiki:25144','potion:pp']),s=g.battle;assert.equal(g.phase,'replace');assert.equal(s.fighters[0].hp,0);assert.equal(s.healthLossEvents.find(e=>e.targetSide===0).hpLoss,9000);assert.equal(s.healthLossEvents.find(e=>e.targetSide===0).type,'direct');assert.equal(H.damage(s,'fixed'),0);const draws=(s.randomStatusEvents??[]).filter(e=>e.type==='draw');if(draws.length){yes=true;assert.equal(draws.length,1);assert.ok(status.isControl(draws[0].name));assert.ok([2,3].includes(draws[0].duration));const immune=make(seed);immune.battle.fighters[1].effects.免异常={start:1,end:5};const q=T.turn(immune,['wiki:25144','potion:pp']);assert.equal(Object.keys(q.battle.fighters[1].ailments).length,0);assert.equal(q.battle.randomStatusEvents.filter(e=>e.type==='draw').length,1);}else no=true;}assert.ok(yes&&no);
});
test('3221九死未悔真实死亡补位赋指定接替者三回合49红增伤及先制一，到期排序恢复且不复制至其他队友',()=>{
 let g=T.turn(make(),['wiki:25144','potion:pp']);g=T.replace(g,[1,null]);assert.equal(Number(g.battle.fighters[0].number),2989);assert.deepEqual(g.battle.fighters[0].effects.九死增伤与先制,{start:2,end:4,bonus:.49,priority:1});for(let r=2;r<=5;r++){g=T.turn(g,['wiki:10086','wiki:10086']);assert.equal(g.battle.turns.at(-1).first,r<=4?0:1);assert.ok(H.damage(g.battle,'attack')>0);assert.equal(H.damage(g.battle,'attack'),r<=4?4:2);}assert.equal(g.battle.fighters[0].effects.九死增伤与先制,undefined);assert.equal(g.slots[0][2].fighter.effects.九死增伤与先制,undefined);
});
test('3221九死未悔接替者获得增伤先制后真实换下即清，返场无旧奖励且其他队友不获重复继承',()=>{
 let g=T.replace(T.turn(make(),['wiki:25144','potion:pp']),[1,null]);g=T.turn(g,[{switchTo:2},'potion:pp']);assert.equal(g.slots[0][1].fighter.effects.九死增伤与先制,undefined);assert.equal(g.battle.fighters[0].effects.九死增伤与先制,undefined);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].effects.九死增伤与先制,undefined);
});

