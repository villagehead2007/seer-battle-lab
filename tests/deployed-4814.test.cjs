'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4814/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=38077,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=2006;b.souls=[];
 ids??=move===38079?[38077,29143,29144,38078,move]:[move,...[38077,29143,29144,38078].filter(x=>x!==move).slice(0,3),38079];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',overrides:{...stats,...aStats}},{suit:'none',overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,2006);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=38077,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
test('4814真实2006完整17招与33实例，真实HP/PP及基础行为不依赖候选开关',()=>{
 assert.equal(source.source.revision,'3c959a7f');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[2006,'e0b859']]);for(const m of source.moves){const s=make({move:m.id,hp:1000});let cost;go(s,m.id,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)cost=c.a.soulState.basePPCostThisUse.amount;});assert.equal(cost,1,m.name);assert.equal(s.fighters[0].pp[key(m.id)],m.id===29144?m.pp:m.pp-1,m.name);assert.equal(s.wikiSnapshots[0].moves.length,17);if(m.kind!=='status')assert.ok(sum(s)>0,m.name);}
});
test('4814真实中性对手用属性招仍授流血，免异未触发则消回合且普通死亡停止',()=>{
 for(const immune of [false,true]){const s=make({move:20117,enemy:require('../research/BATCH-4676-NEXT50/4798/snapshot.json'),enemyIds:[20004,10011,10075,20011,38023]});if(immune)timer(s,1,'免异常');go(s,20117,20004);assert.equal(!!s.fighters[1].ailments['流血'],!immune);assert.equal(s.fighters[1].effects['免异常'],undefined);assert.equal(!!s.fighters[1].effects['攻击必中'],!immune);}
 const s=make({move:20117,hp:1});go(s,20117,10127);assert.equal(s.fighters[0].hp,0);
});
test('4814真实4800远古机械克制分支战阶反转正级并恢复每槽2PP，负级不改',()=>{
 const enemy=require('../research/BATCH-4676-NEXT50/4800/snapshot.json'),s=make({move:20117,enemy,enemyIds:[29157,29159,29160,38087,38088]});assert.ok(E.typeEffectiveness(source.type,enemy.type,s.typeChart)>1);s.fighters[1].stages.atk=2;s.fighters[1].stages.def=-2;for(const k of s.fighters[0].moves)s.fighters[0].pp[k]=1;go(s,20117,29157);assert.equal(s.fighters[1].stages.atk,-6);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[0].pp[key(20117)],2);assert.equal(s.fighters[0].pp[key(29143)],3);
});
test('4814真实4766战斗微弱分支回合后魂印回复三分之一，技能禁疗仍允许且相等HP不截完整伤',()=>{
 const enemy=neutral,s=make({move:20117,hp:1000});assert.ok(E.typeEffectiveness(source.type,enemy.type,s.typeChart)<1);timer(s,0,'技能禁疗');go(s,20117,20117);assert.equal(s.fighters[0].hp,4000);
});
test('4814原138已知飞行类型前态对真实4800地面多段零克制保持0，不除零且不触红伤',()=>{
 const enemy=require('../research/BATCH-4676-NEXT50/4800/snapshot.json'),s=make({move:20117,enemy,enemyIds:[38100,29157,29159,29160,38088]});s.fighters[0].type='飞行';assert.ok(E.typeEffectiveness('飞行',enemy.type,s.typeChart)<1);assert.equal(E.typeEffectiveness('地面','飞行',s.typeChart),0);go(s,20117,38100);const ev=events(s,'attack',1);assert.ok(ev.length>=10);assert.ok(ev.every(e=>e.settledDamage===0));assert.equal(s.fighters[0].hp,9000);
});
test('4814真实男性/无性/雌性来源与回合初强化分别决定固粉30/60/0减伤，真伤不减',()=>{
 for(const id of [4766,4763,4808])for(const boosted of [false,true]){const enemy=require('../research/BATCH-4676-NEXT50/'+id+'/snapshot.json'),enemyIds=id===4766?[20117,10127,10716,20309,37911]:id===4763?[20167,10389,10390,20168,37933]:[20030,20118,20631,26329,38055],s=make({move:20117,enemy,enemyIds});assert.equal(s.fighters[1].gender,enemy.gender.id);if(boosted)s.fighters[1].stages.atk=1;go(s,20117,enemyIds[0],(e,c)=>{if(e==='afterUse'&&c.a.side===1){for(const type of ['fixed','percent','true'])c.hurt(c.t,100,'精确源类型伤害',type);}});const expected=enemy.gender.id===2?100:boosted?40:70;assert.equal(sum(s,'fixed',1),expected);assert.equal(sum(s,'percent',1),expected);assert.equal(sum(s,'true',1),100);}
});
test('4814完整38078后手反馈按完整技能红伤，保1实际199不截反击基数，零红不反馈',()=>{
 for(const immune of [false,true]){const s=make({move:38078,hp:200,aStats:{spe:10},bStats:{atk:5000}});timer(s,0,'致命保留',{hp:1});if(immune)timer(s,0,'攻击伤害免疫');go(s,38078,10127);const red=sum(s,'attack',1);if(immune){assert.equal(red,0);assert.equal(sum(s,'percent'),0);}else{assert.ok(red>200);assert.equal(events(s,'attack',1)[0].hpLoss,199);assert.equal(sum(s,'percent'),Math.floor(red*1.2));}}
});
