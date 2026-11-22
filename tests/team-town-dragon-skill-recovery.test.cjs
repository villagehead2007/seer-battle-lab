'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skill,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
function afterDeath(which,move){
 const own=member(4186,move,2028);Object.assign(own.build.overrides,{maxHp:1000,def:10,atk:1});const foe=member(3056,10127);foe.build.overrides.atk=3000;
 let g=T.create([[own],[foe,member(2988)]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].pp['wiki:'+move]=0;
 assert.ok(!E.availableMoves(g.battle.fighters[0]).includes('wiki:'+move));
 if(which==='dark'){g.battle.fighters[1].hp=190;g.battle.fighters[1].stats.def=4000;g=T.turn(g,['wiki:34898','potion:pp']);g=T.replace(g,[null,1]);}
 else g=T.turn(g,['potion:hp','wiki:10127']);
 assert.equal(g.battle.teamDragons2028[0][which],false);assert.ok(E.availableMoves(g.battle.fighters[0]).includes('wiki:'+move));
 // Gold's actual incoming attack also triggers native PP absorption; spend that real single point before testing zero-PP use.
 if(which==='gold'){assert.equal(g.battle.fighters[0].pp['wiki:'+move],1);g=T.turn(g,['wiki:'+move,'potion:pp']);assert.equal(g.battle.fighters[0].pp['wiki:'+move],0);}return g;
}
function red(g,move){const r=g.battle.round;assert.equal(g.battle.fighters[0].pp['wiki:'+move],0);assert.ok(E.availableMoves(g.battle.fighters[0]).includes('wiki:'+move));const out=T.turn(g,['wiki:'+move,'potion:pp']);assert.equal(out.battle.fighters[0].previousMoveId,'wiki:'+move);return out.battle.damageEvents.filter(e=>e.round===r&&e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);}
test('玄源之㡣真实阵亡解锁零PP的38147，实际特攻忽略对手特防提升',()=>{
 const g=afterDeath('dark',38147),boosted=structuredClone(g);boosted.battle.fighters[1].stages.spd=6;
 const normal=red(g,38147);assert.ok(normal>0);assert.equal(red(boosted,38147),normal);
});
test('金祖之龍真实阵亡解锁零PP的38148，实际攻击穿过攻击免疫',()=>{
 const g=afterDeath('gold',38148),immune=structuredClone(g);immune.battle.fighters[1].effects['攻击伤害免疫']={start:g.battle.round,end:g.battle.round+3};
 const normal=red(g,38148);assert.ok(normal>0);assert.equal(red(immune,38148),normal);
});
test('金祖之龍实际牺牲后的两成固伤减免仅作用乔特鲁德且下场重置，已死资格保留',()=>{
 const own=member(4186,null,2028);Object.assign(own.build.overrides,{maxHp:1000,def:10});
 const foe=member(3056,10127);foe.moves[2]=10716;foe.build.overrides.atk=3000;
 let g=T.create([[own,member(2988)],[foe]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.teamDragons2028[0].gold,false);assert.equal(g.battle.fighters[0].hp,200);
 assert.equal(g.battle.fighters[0].hp,200);
 function hit(){const r=g.battle.round;g=T.turn(g,['potion:pp','wiki:10716']);const e=g.battle.damageEvents.find(e=>e.round===r&&e.sourceSide===1&&e.type==='fixed');assert.ok(e,JSON.stringify(g.battle.turns.at(-1)));return e.settledDamage;}
 assert.equal(hit(),40);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(hit(),50);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.townGoldSpent,true);assert.equal(hit(),50);
});
