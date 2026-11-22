'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const pp='potion:pp';
function member(id,stats={}){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function meh(first=38171){const m=member(4853);m.moves=[38206,29229,38207,29230,38173];if(!m.moves.includes(first))m.moves[1]=first;const i=m.moves.indexOf(first);[m.moves[0],m.moves[i]]=[m.moves[i],m.moves[0]];return m;}
function make(first=38171,xuan=false){return T.create([[member(3102),meh(first)],[member(3102),...(xuan?[member(4995)]:[])]],[0,0],{seed:14,criticals:false});}
test('梅赫维特因中切登场自动使用真实一号位，敌本回合用技能仍于回末额外获一唱词，下回合不重授',()=>{
 let g=make(),original=g.slots[0][1].fighter.pp['wiki:38171'];g=T.turn(g,[{switchTo:1},'wiki:19564']);const f=g.battle.fighters[0];assert.equal(g.active[0],1);assert.equal(f.pp['wiki:38171'],original-1);assert.equal(f.soulState.mehSwitchIn2038.move,f.moves[0]);assert.equal(f.soulState.mehSwitchIn2038.lyric,2372);assert.equal(f.soulState.mehSwitchIn2038.lyricGranted,true);assert.deepEqual(f.soulState.lyrics4853.list,[2372]);assert.match(g.battle.turns[0].events.map(e=>e.text).join('\n'),/自动选择1号位/);g=T.turn(g,[pp,pp]);assert.deepEqual(g.battle.fighters[0].soulState.lyrics4853.list,[2372]);assert.equal(g.battle.fighters[0].pp['wiki:38171'],original);
});
test('梅赫维特一号位取真实配招顺序，普通无唱词技能不制造唱词，玄武视驱逐的中切也执行',()=>{
 for(const xuan of [false,true]){let g=make(38206,xuan),before=g.slots[0][1].fighter.pp['wiki:38206'];g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].pp['wiki:38206'],before-1);assert.deepEqual(g.battle.fighters[0].soulState.lyrics4853.list,[]);assert.equal(g.battle.fighters[0].soulState.mehSwitchIn2038.lyric,null);}
});
test('梅赫维特自动一号位仍经过真实零PP和控制检查，回末选择对应唱词独立获得',()=>{
 for(const mode of ['noPP','control']){let g=make(),f=g.slots[0][1].fighter;if(mode==='noPP')f.pp['wiki:38171']=0;else f.ailments['瘫痪']=2;const before=f.pp['wiki:38171'];g=T.turn(g,[{switchTo:1},'wiki:19564']);assert.equal(g.battle.fighters[0].pp['wiki:38171'],before);assert.deepEqual(g.battle.fighters[0].soulState.lyrics4853.list,[2372]);assert.match(g.battle.turns[0].events.map(e=>e.text).join('\n'),mode==='noPP'?/已无 PP，无法行动/:/受控制无法行动/);}
});
test('梅赫维特首发和主动换下不自动出招，队友阵亡后的补位也不冒充中切',()=>{
 let g=T.create([[meh(),member(3102)],[member(3102)]],[0,0],{seed:14,criticals:false});const before=g.battle.fighters[0].pp['wiki:38171'];assert.equal(g.battle.fighters[0].soulState.mehSwitchIn2038,undefined);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.active[0],1);assert.equal(g.slots[0][0].fighter.pp['wiki:38171'],before);assert.deepEqual(g.slots[0][0].fighter.soulState.lyrics4853.list,[]);
 const foe=member(3102,{atk:9999});g=T.create([[member(2988,{maxHp:1,def:1}),meh()],[foe]],[0,0],{seed:14,criticals:false});g=T.turn(g,[pp,'wiki:19564']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);const replacementPP=g.battle.fighters[0].pp['wiki:38171'];assert.equal(g.battle.fighters[0].soulState.mehSwitchIn2038,undefined);g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].pp['wiki:38171'],replacementPP);assert.deepEqual(g.battle.fighters[0].soulState.lyrics4853.list,[]);
});
