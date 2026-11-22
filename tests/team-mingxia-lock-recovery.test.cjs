'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const[i,k]of skills.entries())if(!moves.includes(k))moves[i+1]=k;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000}}};}
test('冥霞实际弥罪强化与残霞免异失败全弱达双阈值，双方等级翻倍并禁敌下回合换人；源离场后原期限解除',()=>{
 let g=T.create([[member(4482,[28246,28247]),member(3102)],[member(3056,[23287]),member(2987)]],[0,0],{seed:14,criticals:false});assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,['wiki:28247','wiki:23287']);assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===2));assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,['wiki:28246','potion:pp']);assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===4));assert.ok(Object.values(g.battle.fighters[1].stages).every(n=>n===-2));assert.deepEqual(T.candidates(g,1),[]);const before=structuredClone(g);assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]),/不可换入/);assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);assert.equal(g.battle.fighters[1].effects['不能主动切换'],undefined);
});
test('冥霞真实回合在五种提升及五种下降边界才禁下一回合，四种任一不足或跨双方重复种类不凑数',()=>{
 const keys=['atk','def','spa','spd','spe','acc'];for(const [positive,negative,lock]of [[5,5,true],[4,5,false],[5,4,false]]){
  let g=T.create([[member(4482),member(3102)],[member(3056),member(2987)]],[0,0],{seed:14,criticals:false});for(const k of keys.slice(0,positive))g.battle.fighters[0].stages[k]=1;for(const k of keys.slice(0,negative))g.battle.fighters[1].stages[k]=-1;g=T.turn(g,['potion:pp','potion:pp']);assert.deepEqual(T.candidates(g,1),lock?[]:[1]);for(const k of keys.slice(0,positive))assert.equal(g.battle.fighters[0].stages[k],lock?2:1);
 }
 let duplicate=T.create([[member(4482),member(3102)],[member(3056),member(2987)]],[0,0],{seed:14,criticals:false});for(const f of duplicate.battle.fighters)for(const [i,k]of keys.entries())f.stages[k]=i<4?1:-1;duplicate=T.turn(duplicate,['potion:pp','potion:pp']);assert.deepEqual(T.candidates(duplicate,1),[1]);for(const f of duplicate.battle.fighters)assert.deepEqual(Object.values(f.stages),[1,1,1,1,-1,-1]);
});
