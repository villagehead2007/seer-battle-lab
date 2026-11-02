'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4798/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=38021,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=1988;b.souls=[];
 ids??=move===38023?[38021,29109,29110,38022,move]:[move,...[38021,29109,29110,38022].filter(x=>x!==move).slice(0,3),38023];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',overrides:{...stats,...aStats}},{suit:'none',overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,1988);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=38021,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
test('4798真实1988先手覆盖属性技能、后手不翻倍、道具和控制不冒充出招',()=>{
 for(const speed of [500,10]){const s=make({move:20004,aStats:{spe:speed}});go(s,20004);assert.equal(s.fighters[0].stages.atk,speed===500?4:2);assert.equal(s.fighters[0].stages.spe,speed===500?4:2);assert.equal(s.fighters[1].stages.def,-1);}
 for(const mode of ['potion','control']){const s=make({move:20004});if(mode==='control')s.fighters[0].ailments['疲惫']=3;const pp=s.fighters[0].pp[key(20004)];go(s,mode==='potion'?null:20004);assert.equal(s.fighters[0].stages.atk,2);assert.equal(s.fighters[0].pp[key(20004)],pp);}
});
test('4798真实23招完整实例保持源顺序、原生魂印和实际PP消耗及伤害状态',()=>{
 assert.equal(source.source.revision,'7d98bfdc');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[1988,'a85b5549']]);assert.equal(source.moves.reduce((n,m)=>n+m.effectInstances.length,0),32);
 for(const m of source.moves){const s=make({move:m.id,hp:1000});let out;go(s,m.id,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)out={hp:c.a.hp,stages:{...c.a.stages}};});assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1,m.name);assert.equal(s.wikiSnapshots[0].moves.length,23);assert.equal(out.stages.atk>=4,true,m.name);if(m.kind!=='status')assert.ok(sum(s)>0,m.name);if(m.id===20004)assert.equal(s.fighters[1].stages.def,-1);if(m.id===29109){assert.equal(s.fighters[0].suitState.shield,300);assert.equal(s.fighters[0].suitState.barrier,300);}if(m.id===29110){assert.equal(out.hp,7000);assert.equal(sum(s,'percent'),6000);}if(m.id===10072)assert.equal(s.fighters[0].ailments['疲惫'],2);}
});
test('4798先手溢出只增本次红伤，能力封顶与下一次用招不携带旧记录',()=>{
 const a=make({move:10076}),b=make({move:10076});a.fighters[0].stages.def=4;b.fighters[0].stages.def=3;go(a,10076);go(b,10076);assert.equal(a.fighters[0].stages.def,6);assert.equal(b.fighters[0].stages.def,6);assert.equal(a.fighters[0].soulState.overflow1988.active,true);assert.equal(b.fighters[0].soulState.overflow1988.active,false);assert.ok(Math.abs(sum(a)-sum(b)*1.5)<=1);refill(a);refill(b);a.fighters[0].stats.spe=1;b.fighters[0].stats.spe=1;b.rng=a.rng;go(a,10076);go(b,10076);assert.equal(sum(a),sum(b));
});
test('4798精确同模板1247复用原128，仅自身行动技能回复受限且回合末魂印药剂独立',()=>{
 const s=make({move:38021});s.fighters[1].hp=5000;let passive=0,soul=0,potion=0;
 go(s,38021,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0){const n=c.t.hp;c.heal(c.t,300,'敌方行动外被动技能回复','skill');passive=c.t.hp-n;}if(e==='afterUse'&&c.a.side===1){const n=c.a.hp;c.heal(c.a,100,'自身行动技能回复','skill');assert.equal(c.a.hp,n);c.heal(c.a,100,'魂印','soul');soul=c.a.hp-n;const before=c.a.hp;c.heal(c.a,100,'血药','potion');potion=c.a.hp-before;}if(e==='battlePhaseEnd'&&c.a.side===1){const n=c.a.hp;c.heal(c.a,100,'回合末被动技能','skill');assert.equal(c.a.hp,n+100);}});assert.equal(passive,300);assert.equal(soul,100);assert.equal(potion,100);
});
test('4798完整29110当次净HP比例粉伤，技能禁疗零回复零粉伤，粉免疫不反向取消回血',()=>{
 for(const mode of ['normal','ban','immune','full']){const s=make({move:29110,hp:mode==='full'?9000:1000});if(mode==='ban')timer(s,0,'技能禁疗');if(mode==='immune')timer(s,1,'固定百分比免疫');go(s,29110);assert.equal(s.fighters[0].hp,mode==='full'?9000:mode==='ban'?1000:7000);assert.equal(sum(s,'percent'),mode==='normal'?6000:0);}
});
test('4798真实10072下一完整行动受疲惫不消耗PP，10038完整红伤真反伤忽略粉免疫',()=>{
 const s=make({move:10072});go(s,10072);const pp=s.fighters[0].pp[key(10072)];refill(s);go(s,10072);assert.equal(s.fighters[0].pp[key(10072)],pp);go(s,10072);assert.equal(s.fighters[0].pp[key(10072)],pp-1);
 const q=make({move:10038});q.fighters[1].hp=1;timer(q,1,'致命保留',{hp:1});timer(q,0,'固定百分比免疫');go(q,10038);assert.equal(q.fighters[1].hp,1);assert.equal(q.fighters[0].hp,9000-Math.floor(sum(q)/4));
});
test('4798用户新确认禁强化不改变理论溢出资格，实际等级保持且当次红伤仍增加50%',()=>{
 const a=make({move:10076}),b=make({move:10076});for(const s of [a,b])timer(s,0,'禁强化');a.fighters[0].stages.def=4;b.fighters[0].stages.def=3;go(a,10076);go(b,10076);assert.equal(a.fighters[0].stages.def,4);assert.equal(b.fighters[0].stages.def,3);assert.equal(a.fighters[0].stages.atk,0);assert.equal(b.fighters[0].stages.atk,0);assert.equal(a.fighters[0].soulState.overflow1988.active,true);assert.equal(b.fighters[0].soulState.overflow1988.active,false);assert.ok(Math.abs(sum(a)-sum(b)*1.5)<=1);
});
