'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4808/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=38053,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=1999;b.souls=[];
 ids??=move===38055?[38053,29127,29128,38054,move]:[move,...[38053,29127,29128,38054].filter(x=>x!==move).slice(0,3),38055];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',overrides:{...stats,...aStats}},{suit:'none',overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,1999);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=38053,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
test('4808真实1999与22招完整原生源实例、实际PP消耗与伤害回复',()=>{
 assert.equal(source.source.revision,'5c0e7e6f');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[1999,'b2685152']]);for(const m of source.moves){const s=make({move:m.id,hp:1000});let consumed;go(s,m.id,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)consumed=c.a.soulState.basePPCostThisUse.amount;});assert.equal(consumed,1,m.name);assert.equal(s.fighters[0].pp[key(m.id)],m.pp,m.name);assert.equal(s.wikiSnapshots[0].moves.length,22);assert.equal(s.fighters[0].soulState.declines1999,1);if(m.kind!=='status')assert.ok(sum(s,'percent')>=4500,m.name);if(m.id===29128)assert.equal(s.fighters[0].hp,7240);if(m.id===26331)assert.equal(s.fighters[0].hp,4240);}
});
test('4808三次衰减分别50/40/30至20%，240理论回复仅前三轮，技能禁疗不封魂印',()=>{
 const s=make({move:10001,hp:1000});timer(s,0,'技能禁疗');for(let i=0;i<4;i++){refill(s);s.fighters[0].hp=1000;let beforeEnd;go(s,10001,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)beforeEnd=c.a.hp;});assert.equal(sum(s,'percent'),Math.floor(9000*(.5-.1*Math.min(i,3))));assert.equal(s.fighters[0].soulState.resolvedPriority.value,3-Math.min(i,3));assert.equal(s.fighters[0].hp-beforeEnd,i<3?240:0);assert.equal(s.fighters[0].soulState.declines1999,Math.min(3,i+1));}
});
test('4808实际入魅五槽变真实摸摸且不耗PP，立即实际使用后还原原PP和技能，控制保持',()=>{
 const s=make({move:10001});s.fighters[1].ailments['流血']=9;s.fighters[1].hp=8000;const moves=[...s.fighters[1].moves],pp={...s.fighters[1].pp};let transformed,actual;
 go(s,10001,20309,(e,c)=>{if(e==='afterUse'&&c.a.side===0){transformed=c.t.moves.map(k=>({k,pp:c.t.pp[k]}));}if(e==='afterUse'&&c.a.side===1)actual={id:c.m.wikiId,kind:c.m.kind,power:c.m.power,revision:c.m.revision,accuracy:c.m.accuracy,effects:c.m.operations.map(o=>[o.effectId,o.params]),ppCost:c.a.soulState.basePPCostThisUse.amount};});assert.equal(transformed.length,5);for(const x of transformed){assert.ok(x.k.endsWith(':charm1999:1'));assert.equal(x.pp,40);}assert.deepEqual(actual,{id:13749,kind:'physical',power:0,revision:'seerapi:99c7b664',accuracy:100,effects:[[450,[88,331]]],ppCost:0});assert.deepEqual(s.fighters[1].moves,moves);assert.deepEqual(s.fighters[1].pp,pp);assert.equal(s.fighters[1].soulState.charm1999,undefined);
 const q=make({move:10001});q.fighters[1].ailments['流血']=9;q.fighters[1].ailments['疲惫']=9;const zero=key(10716);q.fighters[1].pp[zero]=0;go(q,10001);assert.ok(q.fighters[1].soulState.charm1999);assert.equal(q.fighters[1].pp[zero+':charm1999:1'],40);delete q.fighters[1].ailments['疲惫'];go(q,null,10716+':charm1999:1');assert.equal(q.fighters[1].pp[zero],0);assert.equal(q.fighters[1].soulState.charm1999,undefined);
});
test('4808原136低体属性先制PP含敌每个属性招，原137属性技能不授入魅或下轮必中',()=>{
 const s=make({move:20030,hp:1000});s.fighters[1].ailments['流血']=9;const n=neutral.moves.filter(m=>s.fighters[1].moves.includes(key(m.id))&&m.kind==='status').length;s.fighters[0].pp[key(20030)]=1;go(s,20030);assert.equal(s.fighters[0].soulState.resolvedPriority.value,1+n);assert.equal(s.fighters[0].pp[key(20030)],1+n);assert.equal(s.fighters[1].soulState.charm1999,undefined);assert.equal(s.fighters[0].effects['攻击必中'].start,1);
});
test('4808技能1065净回复粉伤与魂印理论吸取分开，禁疗不吞魂印，粉免疫不降低回复',()=>{
 for(const mode of ['ban','immune','full']){const s=make({move:29128,hp:mode==='full'?9000:1000});if(mode==='ban')timer(s,0,'技能禁疗');if(mode==='immune')timer(s,1,'固定百分比免疫');go(s,29128);assert.equal(s.fighters[0].hp,mode==='full'?9000:mode==='ban'?1240:7240);assert.equal(sum(s,'percent'),0);}
});
test('4808魂印回复触蛊普通死亡停止入魅与回合末240，不用回复复活死者',()=>{
 const s=make({move:10001,hp:1,bStats:{maxHp:3}});s.fighters[1].counts.attackNullify=1;s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];go(s,10001);assert.equal(s.fighters[0].hp,0);assert.equal(sum(s,'percent'),1);assert.equal(s.fighters[1].soulState.charm1999,undefined);assert.equal(s.fighters[0].soulState.declines1999,0);
});
