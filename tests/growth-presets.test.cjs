'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../dist/growth-presets'),E=require('../dist/engine'),T=require('../dist/team-engine');
const local=require('../local-species.cjs'),{createRoom}=require('../lan-room.cjs');
const keys=['atk','spa','def','spd','spe','maxHp'];
const expected=[
 [42310,41286,140,0,84,84,121,260],[42311,41287,0,140,84,84,121,260],
 [42312,41288,183,0,84,84,95,244],[42313,41289,0,183,84,84,95,244],
 [42316,41292,90,0,126,126,84,271],[42317,41293,0,90,126,126,84,271],
 [42314,41290,126,0,91,91,80,342],[42315,41291,0,126,91,91,80,342]
];
test('固定版全表、八套逐槽满级数值与手填面板一致',()=>{
 const {marks,titles,eyes}=G.catalog;
 assert.deepEqual([marks.length,titles.length,eyes.length],[955,84,11]);
 assert.deepEqual([2,3,4,5].map(n=>marks.filter(m=>m.angles===n).length),[80,61,64,750]);
 assert.equal(titles.some(x=>[304,327].includes(x.id)),false);assert.equal(eyes.some(x=>[1300871,1300872].includes(x.id)),false);
 expected.forEach(([pair,single,...totals],i)=>{
   const ids=G.sets[i].ids;assert.deepEqual(ids,[pair,pair,single]);
   const inscriptions=ids.map(id=>G.item('marks',id).stats);
   assert.deepEqual(keys.map(k=>inscriptions.reduce((n,m)=>n+m[k],0)),totals);
   const preset=E.calculateStats('king',{inscriptions,inscriptionPresetIds:ids}),manual=E.calculateStats('king',{inscriptions});
   assert.deepEqual(preset.stats,manual.stats);assert.deepEqual(preset.build.inscriptionPresetIds,ids);
   assert.deepEqual(preset.build.inscriptions,inscriptions);
 });
});
test('每个原始 ID 对应唯一等价候选，旧配置保留 ID 与面板',()=>{
 const visible=G.candidates('marks'),allIds=visible.flatMap(m=>G.aliases(m.id));
 assert.equal(visible.length,871);
 assert.deepEqual(allIds.sort((a,b)=>a-b),G.catalog.marks.map(m=>m.id).sort((a,b)=>a-b));
 for(const m of G.catalog.marks){
   const [match,...rest]=G.candidates('marks','#'+m.id);
   assert.equal(rest.length,0);assert.equal(match.id,m.id);
   const base=G.item('marks',G.aliases(m.id)[0]);
   assert.equal(base.name,m.name);assert.equal(base.angles,m.angles);assert.deepEqual(base.stats,m.stats);
 }
 const ids=[45043,45044,40127],inscriptions=ids.map(id=>G.item('marks',id).stats);
 const state=E.createBattle({builds:[{inscriptions,inscriptionPresetIds:ids},{}]});
 const restored=E.createBattle(JSON.parse(JSON.stringify(state.initial)));
 assert.deepEqual(restored.fighters[0].build.inscriptionPresetIds,ids);
 assert.deepEqual(restored.fighters[0].stats,state.fighters[0].stats);
});
test('年费与六个独立开关、腐蚀目镜归零、旧手填与恢复不叠加',()=>{
 const base=E.calculateStats('king'),all=Object.fromEntries(keys.map(k=>[k,true]));
 const build={annualBonus:true,teamBonus:all},stats=E.calculateStats('king',build).stats;
 assert.deepEqual(keys.map(k=>stats[k]-base.stats[k]),[25,25,25,25,20,40]);
 for(const key of keys){
   const single=E.calculateStats('king',{teamBonus:{[key]:true}}).stats;
   for(const k of keys)assert.equal(single[k]-base.stats[k],key===k?G.teamBonus[key]:0);
 }
 const old=E.calculateStats('king',{inscriptions:[{atk:33}]});
 assert.equal(old.build.inscriptions[0].atk,33);assert.equal(old.build.annualBonus,false);
 assert.deepEqual(Object.values(old.build.teamBonus),keys.map(()=>false));assert.equal(old.build.eyeId,null);assert.equal(old.build.titleId,null);
 const data={...build,titleId:151,eyeId:1300773},s=E.createBattle({builds:[data,{...data,suit:'corrosion'}]});
 assert.equal(s.fighters[0].build.eyeId,1300773);assert.equal(s.fighters[1].build.eyeId,null);
 const withoutEye=E.calculateStats('king',{...data,suit:'corrosion',eyeId:null}).stats;
 assert.deepEqual(s.fighters[1].stats,withoutEye);
 assert.deepEqual(E.createBattle(JSON.parse(JSON.stringify(s.initial))).fighters.map(f=>f.stats),s.fighters.map(f=>f.stats));
 assert.throws(()=>E.calculateStats('king',{eyeId:1300872}));assert.throws(()=>E.calculateStats('king',{titleId:304}));
});
test('队伍不同队员独立，局域网双方进场使用同一面板',()=>{
 const s=local.species(2988),r=local.species(3056);
 const member=(snapshot,build)=>({snapshot,build,moves:E.WIKI.defaultMoves(snapshot)});
 const build={titleId:151,eyeId:1300773,annualBonus:true,teamBonus:{maxHp:true},inscriptions:[{maxHp:30}]};
 const a=member(s,build),b=member(s,{}),reserve=member(r,{...build,suit:'corrosion'});
 const game=T.create([[a,reserve],[b]]);
 assert.equal(game.slots[0][1].config.build.eyeId,null);assert.equal(game.slots[0][1].fighter.build.eyeId,null);
 const stats=game.battle.fighters.map(f=>f.stats);
 assert.equal(stats[0].maxHp-stats[1].maxHp,80);
 assert.equal(stats[0].def-stats[1].def,40);
 const next=T.turn(game,[{switchTo:1},'potion:pp']);assert.deepEqual(next.battle.fighters[0].stats,game.slots[0][1].base.stats);
 const room=createRoom();
 for(const [side,m] of [a,b].entries())room.mutate(side,{op:'add',edit:room.view(side).edit,member:{id:s.id,moves:m.moves,build:side===1?{suit:'corrosion',eyeId:1301040}:m.build}});
 for(const side of [0,1])room.mutate(side,{op:'ready',edit:room.view(side).edit});
 for(const side of [0,1])assert.deepEqual(room.view(side).fighters.map(f=>f.maxHp),stats.map(x=>x.maxHp));
});
