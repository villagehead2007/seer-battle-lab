'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/team-engine.js'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),status=require('../dist/status-rules.js'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,hp=9000,spe=1000,oracle=false){const snapshot=store.species(id),ids=id===3683&&!oracle?[...snapshot.moves.filter(m=>!m.fifth&&m.id!==38526).slice(0,4).map(m=>m.id),snapshot.moves.find(m=>m.fifth).id]:[];return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:hp,atk:180,spa:180,def:4000,spd:4000,spe}}};}
const pp='potion:pp',draws=g=>(g.battle.randomStatusEvents??[]).filter(e=>e.sourceKey==='soul:968');
test('968真实携带38526堕灵神谕的初始化先于首次登场抽签，两种诅咒无放回且保持原魂印和完整原招',()=>{
 const g=T.create([[member(3683,6000,1000,true)],[member(2989)]],[0,0],{seed:14,criticals:false});assert.equal(g.battle.fighters[0].soulState.fallenOracle,true);assert.ok(g.battle.fighters[0].moves.includes('wiki:38526'));assert.equal(draws(g).length,2);assert.equal(new Set(draws(g).map(x=>x.name)).size,2);assert.ok(draws(g).every(x=>['诅咒','烈焰诅咒','致命诅咒','虚弱诅咒'].includes(x.name)&&x.phase==='entry'));
});
test('968首次登场先于976回初高体免异，双座位真实开局均先中控制且当轮免异不自动解除既中异常',()=>{
 for(const side of[0,1]){let g,picked;for(let seed=1;seed<=64&&!g;seed++){const rosters=[[member(3697,9000)],[member(3683,6000,100)]],q=T.create(side?rosters.slice().reverse():rosters,[0,0],{seed,criticals:false}),target=q.battle.fighters[side],name=Object.keys(target.ailments).find(k=>['睡眠','害怕'].includes(k));if(name){g=q;picked=name;}}assert.ok(g,'must receive entry control before roundStart side '+side);assert.equal(g.battle.fighters[side].soulState.skyHigh,undefined);assert.equal(draws(g).length,1);assert.equal(draws(g)[0].phase,'entry');g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[side].soulState.skyHigh,true);assert.ok(g.battle.fighters[side].ailments[picked]>=g.battle.round);assert.equal(draws(g).length,1,'roundStart must not redraw');}
});
test('968真实再次登场只抽一次普通PVP池，首次池均控制而再次自然种子能抽到非控制，不依赖左右遍历',()=>{
 let nonControl=false;for(let seed=1;seed<=24&&!nonControl;seed++){let g=T.create([[member(3683,6000),member(3056)],[member(2989)]],[0,0],{seed,criticals:false});assert.equal(draws(g).length,1);assert.ok(status.isControl(draws(g)[0].name));g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(draws(g).length,2);assert.equal(draws(g)[1].phase,'entry');assert.equal(g.slots[0][0].entries,2);if(!status.isControl(draws(g)[1].name))nonControl=true;}assert.ok(nonControl);
});
test('968登场控制尊重已经生效的753全异常免疫，只抽一次且免疫不补抽',()=>{
 for(const side of[0,1]){const rosters=[[member(5000)],[member(3683,6000,100)]],g=T.create(side?rosters.slice().reverse():rosters,[0,0],{seed:14,criticals:false});assert.equal(draws(g).length,1);assert.deepEqual(g.battle.fighters[side].ailments,{});assert.ok(g.battle.entryStatusEvents.some(e=>e.targetSide===side&&e.applied===false));}
});
test('976上回合高体免异不会提前延伸到下一回合登场阶段，魔尊中切控制后本轮回初高体仍不清除',()=>{
 let g=T.create([[member(3697)],[member(2989,3000),member(3683,6000,100)]],[0,0],{seed:14,criticals:false});g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].soulState.skyHigh,true);assert.equal(g.battle.round,2);assert.equal(E.SOULS.trait(g.battle.fighters[0],'ailmentImmune'),false);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(draws(g).length,1);assert.ok(g.battle.entryStatusEvents.some(e=>e.sourceSide===1&&e.targetSide===0&&e.applied===true));assert.equal(g.battle.fighters[0].soulState.skyHighRound,2);
});
