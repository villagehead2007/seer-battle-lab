// Complete original snapshots, selected original souls, legal initial stats and natural actions; no runtime mutation.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const store=require('../local-species.cjs');
function source(id,version){const raw=store.species(id),versions=E.WIKI.versionSnapshots(raw);const s=versions.find(v=>version?v.selectedSkillVersion===version:v.selectedSoulId===(id===3227?552:1805))??versions[0];if(id===3227)s.selectedSoulId=552;return s;}
function load(s,id){const g=s.skillVersions?.find(g=>g.id===s.selectedSkillVersion),moves=E.WIKI.availableMoves(s),fifth=g?.fifthId??moves.find(m=>m.fifth)?.id;return [id,fifth,...E.WIKI.defaultMoves(s),...moves.map(m=>m.id)].filter((v,i,a)=>v!=null&&a.indexOf(v)===i).slice(0,5);}
function frame(enemy,atk=1){const a=source(4599),b=source(enemy,enemy===4450?'soul-1664-fifth-36302':null),multi=enemy===4450;return E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[load(a,37086),load(b,multi?36298:19087)],criticals:false,builds:[{overrides:{maxHp:multi?9999:9000,atk:1,spa:1,def:multi?500:100,spd:multi?500:100,spe:multi?1000:500}},{overrides:{maxHp:9000,atk,spa:1,def:100,spd:100,spe:100}}]});}
function observe(s){return {round:s.round-1,futureLayers:s.fighters.map(f=>f.soulState.futureSingularity??null),hp:s.fighters.map(f=>f.hp),pp:s.fighters.map(f=>f.pp),souls:s.fighters.map(f=>[f.soulId,f.soulHash]),effects:s.fighters[0].effects['小额伤害免疫'],damage:(s.damageEvents??[]).filter(e=>e.round===s.round-1),turn:s.turns.at(-1),rng:s.rng};}
function run(enemy,atk){let s=frame(enemy,atk);const initial=structuredClone(s.initial),rounds=[];s=E.resolveTurn(s,['wiki:37086','wiki:'+(enemy===4450?36298:19087)]);rounds.push(observe(s));for(let i=0;i<3;i++){s=E.resolveTurn(s,['potion:hp','wiki:'+(enemy===4450?36298:19087)]);rounds.push(observe(s));}assert.equal(E.SOULS,originalSouls);assert.equal(Object.isFrozen(E.SOULS),true);return {enemy,atk,initial,rounds};}

const originalSouls=E.SOULS;
const incoming=(r,type)=>r.damage.filter(e=>e.sourceSide===1&&e.targetSide===0&&e.type===type);
const total=(r,type)=>incoming(r,type).reduce((n,e)=>n+e.settledDamage,0);
test('874原生4599与3227：低红归零而完整552与19087固定100加200保留，三回合后红伤恢复',()=>{
 const x=run(3227,1);assert.deepEqual(x.initial.species,['wiki:4599','wiki:3227:soul:552']);
 for(const r of x.rounds.slice(0,3)){assert.equal(total(r,'attack'),0);assert.deepEqual(incoming(r,'fixed').map(e=>e.settledDamage),[200,100]);}
 assert.ok(total(x.rounds[3],'attack')>0);assert.equal(total(x.rounds[3],'fixed'),300);
 assert.equal(x.rounds[0].effects.start,1);assert.equal(x.rounds[0].effects.end,3);
 assert.equal(E.SOULS,originalSouls);assert.ok(Object.isFrozen(E.SOULS));
});
test('874原生4599与4450完整31：每段低于350但整招超350全部放行，PP及未来奇点只执行一次',()=>{
 const x=run(4450,2200);for(const r of x.rounds.slice(0,2)){const hits=incoming(r,'attack');assert.ok(hits.length>=2&&hits.length<=4);assert.ok(hits.every(e=>e.settledDamage>0&&e.settledDamage<350));assert.ok(total(r,'attack')>=350);}
 assert.equal(x.rounds[0].pp[1]['wiki:36298'],9);assert.equal(x.rounds[1].pp[1]['wiki:36298'],8);assert.equal(x.rounds[0].futureLayers[1],1);assert.equal(x.rounds[1].futureLayers[1],1);assert.deepEqual(x.rounds.map(r=>r.rng),[1090112027,4121407983,1658006500,4057466786]);
 assert.equal(x.rounds[2].damage.length,0,'原95命中的自然MISS保持');
 assert.equal(E.SOULS,originalSouls);assert.ok(Object.isFrozen(E.SOULS));
});
test('874原生4599与4450低攻击多段：整招不足350全部免疫，到期完整小额多段恢复',()=>{
 const x=run(4450,300);for(const r of x.rounds.slice(0,2)){assert.ok(incoming(r,'attack').length>=2);assert.equal(total(r,'attack'),0);}
 const r=x.rounds[3];assert.ok(incoming(r,'attack').length>=2);assert.ok(total(r,'attack')>0&&total(r,'attack')<350);
 assert.equal(E.SOULS,originalSouls);assert.ok(Object.isFrozen(E.SOULS));
});


const cases=[ [3001,24661,874,376,250,4,350], [3580,25990,1018,878,400,3,300], [4114,27316,874,1346,300,4,300], [4222,27585,1018,1441,300,3,300], [4482,36466,874,1694,500,3,300], [4599,37086,874,1805,350,3,300], [4704,28919,874,1908,500,3,300], [4755,29037,1018,1963,1000,3,300], [4808,26331,874,1999,300,3,400] ];
function runOriginalSmallSourceCase([species,move,id,soul,threshold,end,fixed]){
const raw=store.species(species),a=E.WIKI.versionSnapshots(raw)[0];a.selectedSoulId=soul;const b=source(3227);
 const initial=[{overrides:{maxHp:9999,atk:1,spa:1,def:100,spd:100,spe:1000}},{overrides:{maxHp:9000,atk:1,spa:1,def:100,spd:100,spe:100}}];
 let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[load(a,move),load(b,19087)],criticals:false,builds:initial});
 assert.equal(s.fighters[0].soulId,soul);assert.equal(s.fighters[1].soulId,552);
 const pp=s.fighters[0].pp['wiki:'+move];s=E.resolveTurn(s,['wiki:'+move,'wiki:19087']);
 const immunity=s.fighters[0].effects[id===874?'小额伤害免疫':'低伤免疫返还'];assert.equal(immunity.threshold,threshold);assert.equal(immunity.start,1);assert.equal(immunity.end,end);
 const events=s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0);assert.equal(events.filter(e=>e.type==='attack').reduce((n,e)=>n+e.settledDamage,0),0);assert.equal(events.filter(e=>e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),fixed);
 assert.equal(s.fighters[1].pp['wiki:19087'],species===4704?2:4);if(species===4704)for(const [k,n]of Object.entries(s.fighters[1].pp))assert.equal(n,k==='wiki:19087'?2:3,'完整39逐槽扣2，所选19087再消费1');assert.ok(s.fighters[0].pp['wiki:'+move]<=pp);
 if(id===874){assert.equal(immunity.attackOnly,true);assert.equal(immunity.wholeAttackThreshold,true);assert.equal(immunity.cumulativeRoundRedThreshold,undefined);}
 else assert.ok(s.damageEvents.some(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='fixed'&&e.settledDamage>0),'低红的固定返伤仍执行');
 assert.equal(E.SOULS,originalSouls);assert.ok(Object.isFrozen(E.SOULS));

return s;
}
test("3001原魂完整874仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[0]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),350);});
test("3580原魂完整1018仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[1]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),300);});
test("4114原魂完整874仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[2]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),300);});
test("4222原魂完整1018仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[3]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),300);});
test("4482原魂完整874仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[4]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),300);});
test("4599原魂完整874仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[5]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),300);});
test("4704原魂完整874仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[6]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),300);});
test("4755原魂完整1018仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[7]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),300);});
test("4808原魂完整874仅免低红而保留完整19087与552固定附伤",()=>{const s=runOriginalSmallSourceCase(cases[8]);assert.equal(s.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),400);});
