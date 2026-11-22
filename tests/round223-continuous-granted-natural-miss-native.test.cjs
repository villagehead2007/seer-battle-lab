'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const originalSouls=E.SOULS,keys=['atk','def','spa','spd','spe','acc'];
const rows=[
{effect:1376,seed:1,pet:3705,move:26346,hash:'e2c9369e',index:2,key:'自身用攻异常或吸取',basic:13201},
{effect:960,seed:1,seal:true,pet:4474,move:28224,hash:'dbab883c',index:2,key:'强化用招异常',basic:35655},
{effect:2193,seed:13,pet:4238,move:37419,hash:'627a9455',index:2,key:'hypnosGrowth',basic:10001},
{effect:2320,seed:10,pet:3516,move:29102,hash:'3bd42cb0',index:1,key:'用招弱化失败封攻',basic:19849},
{effect:2161,seed:1,seal:true,pet:3667,move:28684,hash:'22a33449',index:3,key:'用招弱化失败增伤',basic:17084},
{effect:1393,seed:80,pet:3679,move:32374,hash:'fe4c6795',index:1,key:'用招伤害前降防速',basic:32370}
];
function make(row,seed){const source=E.WIKI.versionSnapshots(store.species(row.pet)).find(a=>{const ms=E.WIKI.availableMoves(a);return ms.some(m=>m.id===row.move)&&ms.some(m=>m.id===row.basic);}),enemy=store.species(row.seal?4264:2989);assert.ok(source,'source version '+row.pet);const move=source.moves.find(m=>m.id===row.move);assert.equal(move.hash,row.hash);assert.equal(move.effectInstances[row.index].id,row.effect);const stats={maxHp:9000,atk:100,spa:100,def:4000,spd:4000,spe:1000};return E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[loadout(source,[row.move,row.basic]),loadout(enemy,[row.seal?10001:10086])],seed,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});}
function turn(s,id){return E.resolveTurn(s,[typeof id==='number'?'wiki:'+id:id,'potion:pp']);}
function run(row){assert.equal(E.SOULS,originalSouls);assert.ok(Object.isFrozen(E.SOULS)&&Object.isFrozen(E.SOULS.registry));let found=null;for(const seed of [row.seed]){let s=make(row,seed);s=turn(s,row.move);if(!s.fighters[0].effects[row.key]||s.fighters.some(f=>f.hp<=0))continue;if(row.seal){assert.equal(s.fighters[1].soulId,1488);s=turn(s,row.basic);const lock=s.fighters[0].effects['攻击技能命中效果失效'];if(!lock||lock.start>s.round||lock.end<s.round||!s.fighters[0].effects[row.key])continue;}const before=structuredClone(s),pp=s.fighters[0].pp['wiki:'+row.basic];s=turn(s,row.basic);if(!row.seal&&!s.turns.at(-1).events.some(e=>e.kind==='miss'&&e.text.includes('未命中')))continue;if(s.fighters[0].pp['wiki:'+row.basic]!==pp-1)continue;found={seed,before,after:s};}assert.ok(found,'真实后续场景未找到 '+row.pet);const {seed,before,after}=found,a=after.fighters[0],t=after.fighters[1],ba=before.fighters[0],bt=before.fighters[1],effect=ba.effects[row.key];console.log(JSON.stringify({round:223,effect:row.effect,pet:row.pet,seed,sourceMove:row.move,basic:row.basic,naturalMiss:!row.seal,realSoul1488Sealed:!!row.seal,initialStateUnmodified:true}));
if(row.effect===1376){const refreshed=(t.ailments[effect.ailment]??0)>(bt.ailments[effect.ailment]??0),drained=(after.damageEvents??[]).some(e=>e.round===after.round-1&&e.sourceSide===0&&e.targetSide===1&&e.type==='true'&&e.settledDamage>0);assert.ok(refreshed||drained,'MISS后应尝试异常或真实吸取');}
if(row.effect===960)assert.ok((t.ailments[effect.ailment]??0)>(bt.ailments[effect.ailment]??0),'MISS后应刷新焚烬');
if(row.effect===2193){assert.equal(a.stages.atk,Math.min(6,ba.stages.atk+1));assert.equal(a.stages.spe,Math.min(6,ba.stages.spe+1));}
if([2320,2161].includes(row.effect)){let changed=false;effect.stages.forEach((n,i)=>{if(!n)return;const expected=Math.max(-6,Math.min(6,bt.stages[keys[i]]+n));assert.equal(t.stages[keys[i]],expected,row.effect+'/'+keys[i]);changed||=expected!==bt.stages[keys[i]];});assert.ok(changed,'测试应真实改变弱化');}
if(row.effect===1393){assert.equal(t.stages.def,Math.max(-6,bt.stages.def-effect.def));assert.equal(t.stages.spe,Math.max(-6,bt.stages.spe-effect.spe));}
assert.equal(E.SOULS,originalSouls);return found;
}
test('R223 原源3705/26346实际授予1376后普通技能自然MISS或真实封附效仍执行持续载荷',()=>{const x=run(rows[0]);const e=x.before.fighters[0].effects[rows[0].key];assert.ok((x.after.fighters[1].ailments[e.ailment]??0)>(x.before.fighters[1].ailments[e.ailment]??0)||(x.after.damageEvents??[]).some(ev=>ev.round===x.after.round-1&&ev.sourceSide===0&&ev.targetSide===1&&ev.type==='true'&&ev.settledDamage>0));});
test('R223 原源4474/28224实际授予960后普通技能自然MISS或真实封附效仍执行持续载荷',()=>{const x=run(rows[1]);assert.ok(x.after.fighters[1].ailments['焚烬']>x.before.fighters[1].ailments['焚烬']);});
test('R223 原源4238/37419实际授予2193后普通技能自然MISS或真实封附效仍执行持续载荷',()=>{const x=run(rows[2]);assert.equal(x.after.fighters[0].stages.atk,Math.min(6,x.before.fighters[0].stages.atk+1));});
test('R223 原源3516/29102实际授予2320后普通技能自然MISS或真实封附效仍执行持续载荷',()=>{const x=run(rows[3]);assert.equal(x.after.fighters[1].stages.def,Math.max(-6,x.before.fighters[1].stages.def-1));});
test('R223 原源3667/28684实际授予2161后普通技能自然MISS或真实封附效仍执行持续载荷',()=>{const x=run(rows[4]);assert.equal(x.after.fighters[1].stages.spd,Math.max(-6,x.before.fighters[1].stages.spd-1));});
test('R223 原源3679/32374实际授予1393后普通技能自然MISS或真实封附效仍执行持续载荷',()=>{const x=run(rows[5]);assert.equal(x.after.fighters[1].stages.def,Math.max(-6,x.before.fighters[1].stages.def-2));});
