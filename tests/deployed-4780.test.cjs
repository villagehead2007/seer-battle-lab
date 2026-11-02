'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4780/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=37967,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=1977;b.souls=[];
 ids??=move===37969?[37967,29077,29078,37968,move]:[move,...[37967,29077,29078,37968].filter(x=>x!==move).slice(0,3),37969];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',overrides:{...stats,...aStats}},{suit:'none',overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,1977);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=37967,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
test('4780全部20招真实1977及30有序实例逐招完整执行，真实基础PP与状态和源版本绑定',()=>{
 assert.equal(source.source.revision,'6d616052');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[1977,'480fc859']]);assert.equal(source.moves.reduce((n,m)=>n+m.effectInstances.length,0),30);
 for(const m of source.moves){const s=make({move:m.id,hp:1000});let out;go(s,m.id,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)out={hp:c.a.hp,stages:{...c.a.stages},effects:structuredClone(c.a.effects)};});assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1,m.name);assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount,1);assert.equal(s.wikiSnapshots[0].moves.length,20);if(m.kind!=='status')assert.ok(sum(s)>0,m.name);if(m.id===20035)assert.equal(s.fighters[1].stages.def,-1);if(m.id===20001)assert.equal(out.stages.def,1);if(m.id===20038){assert.equal(out.stages.def,1);assert.equal(out.stages.spd,1);}if(m.id===20037){assert.equal(out.stages.spa,2);assert.equal(out.stages.spd,2);}if(m.id===20036)assert.equal(s.fighters[0].counts.attackNullify,1);if(m.id===29078)assert.equal(out.hp,1500);if([10072,10073].includes(m.id))assert.equal(s.fighters[0].ailments['疲惫'],2);assert.ok(Number.isFinite(s.fighters[0].hp));}
});
test('4780两个真实自疲惫技能持续下一完整行动轮，魂印免攻封属且不消费PP，之后恢复实际行动',()=>{
 for(const move of [10072,10073]){const s=make({move});go(s,move);const pp=s.fighters[0].pp[key(move)];go(s,move,10127,(e,c)=>{if(e==='battlePhaseEnd'&&c.a.side===0)assert.deepEqual(c.a.effects['攻击伤害免疫'],{start:2,end:2});});assert.equal(s.fighters[0].pp[key(move)],pp);assert.equal(sum(s,'attack',1),0);assert.equal(s.fighters[0].effects['攻击伤害免疫'],undefined);go(s,move);assert.equal(s.fighters[0].pp[key(move)],pp-1);}
 const s=make({move:10072});go(s,10072);const atk=s.fighters[1].stages.atk;go(s,10072,20117);assert.equal(s.fighters[1].stages.atk,atk);assert.equal(s.fighters[1].pp[key(20117)],neutral.moves.find(x=>x.id===20117).pp-2);
});
test('4780真实魂印异常目标先理论吸取再疲惫，粉免疫过杀保1与魂印禁疗来源独立',()=>{
 for(const mode of ['normal','immune','floor','overkill','skill-ban','all-ban']){const s=make({move:10001,hp:1000});s.fighters[1].ailments['疲惫']=9;if(mode==='immune')timer(s,1,'固定百分比免疫');if(mode==='floor'||mode==='overkill'){s.fighters[1].hp=1;if(mode==='floor')timer(s,1,'致命保留',{hp:1});}if(mode==='skill-ban')timer(s,0,'技能禁疗');if(mode==='all-ban')timer(s,0,'四杀鬼囹');go(s,10001);assert.equal(sum(s,'percent'),mode==='immune'?0:3000);assert.equal(s.fighters[0].hp,mode==='all-ban'?1000:4000);if(mode==='floor')assert.equal(s.fighters[1].hp,1);if(mode==='overkill')assert.equal(s.fighters[1].hp,0);}
});
test('4780魂印吸取回复触蛊死亡停止疲惫及普通攻击，真实红伤零与异常施加免疫分别处理',()=>{
 const s=make({move:10001,hp:1,bStats:{maxHp:3}});s.fighters[1].ailments['烧伤']=9;s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];go(s,10001);assert.equal(s.fighters[0].hp,0);assert.equal(sum(s,'percent'),1);assert.equal(s.fighters[1].ailments['疲惫'],undefined);assert.equal(sum(s),0);
 const q=make({move:10001,hp:1000});q.fighters[1].ailments['中毒']=9;timer(q,1,'免异常');go(q,10001);assert.equal(q.fighters[1].ailments['疲惫'],undefined);assert.equal(q.fighters[0].hp,4000);
});
test('4780完整29077高伤主动回满按原2回复前缺失HP反击，正常禁疗蛊和回复转伤不再入',()=>{
 for(const mode of ['normal','ban','gu','conversion','counter']){const s=make({move:29077,hp:1000});if(mode==='ban')timer(s,0,'技能禁疗');if(mode==='gu')s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];if(mode==='conversion'){timer(s,0,'致命保留',{hp:1});timer(s,0,'技能回复转伤害',{fraction:1,sourceSide:1});}
 go(s,29077,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===1){if(mode==='counter'){c.hurt(c.t,300,'明确反击来源夹具','fixed',false,true);}else c.hurt(c.t,201,'明确高伤事件夹具','true');}});
 const healed=mode==='counter'?0:8201;assert.equal(sum(s,'fixed'),healed);assert.equal(s.fighters[0].hp,mode==='normal'?9000:mode==='gu'?8960:mode==='conversion'?1:mode==='counter'?850:799);assert.equal(s.fighters[0].soulState.counterBusy4780,undefined);}
});
test('4780完整高伤回满严格大于200、两轮到期，保1实际损失0仍按完整正伤判断',()=>{
 for(const amount of [200,201]){const s=make({move:29077,hp:1000});go(s,29077,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===1)c.hurt(c.t,amount,'精确边界真伤夹具','true');});assert.equal(s.fighters[0].hp,amount===200?800:9000);assert.equal(sum(s,'fixed'),amount===200?0:8201);}
 const s=make({ids:[29077,10001,20001,20037,37969],hp:1000});go(s,29077);for(let r=2;r<=3;r++){s.fighters[0].hp=1000;refill(s);s.fighters[0].hp=1000;go(s,10001,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===1)c.hurt(c.t,201,'两轮到期夹具','true');});assert.equal(s.fighters[0].hp,r===2?9000:799);}
});
test('4780精确1247只封自身行动中的技能回复，敌行动被动回复及魂印和血药保留，普通技能禁疗仍按来源',()=>{
 for(const speed of [500,50]){const s=make({move:37969,aStats:{spe:speed},bStats:{spe:100}});s.fighters[1].hp=1000;let afterEnemy;
 go(s,37969,20309,(e,c)=>{if(e==='afterUse'&&c.a.side===1)afterEnemy=c.a.hp;});assert.equal(afterEnemy,speed===500?1000-sum(s):4000);assert.equal(s.fighters[1].hp,speed===500?1000-sum(s):4000-sum(s));}
 const s=make({move:37969});s.fighters[1].hp=5000;let passive,potion,soul;
 go(s,37969,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0){const n=c.t.hp;c.heal(c.t,300,'明确敌行动外被动技能回复','skill');passive=c.t.hp-n;}if(e==='afterUse'&&c.a.side===1){const n=c.a.hp;c.heal(c.a,100,'自身行动技能回复','skill');assert.equal(c.a.hp,n);c.heal(c.a,100,'明确魂印回血','soul');soul=c.a.hp-n;const before=c.a.hp;c.heal(c.a,100,'明确血药','potion');potion=c.a.hp-before;}if(e==='battlePhaseEnd'&&c.a.side===1){const before=c.a.hp;c.heal(c.a,100,'明确回合末技能回复','skill');assert.equal(c.a.hp,before+100);}});assert.equal(passive,300);assert.equal(soul,100);assert.equal(potion,100);
});
test('4780完整29078四轮实际用招回复含当次、无效仍触发、控制道具不触发及真实到期',()=>{
 const s=make({ids:[29078,10001,20001,20037,37969],hp:1000});go(s,29078);assert.equal(s.fighters[0].hp,1500);s.fighters[0].counts.nextSkillInvalid=1;go(s,10001);assert.equal(s.fighters[0].hp,2000);s.fighters[0].ailments['疲惫']=3;go(s,10001);assert.equal(s.fighters[0].hp,2000);go(s,null);assert.equal(s.fighters[0].hp,2250);go(s,10001);assert.equal(s.fighters[0].hp,2250);
});
test('4780完整第五和37968真实KO与立即2243非KO分开，保1不误自疲惫或次轮封攻',()=>{
 for(const move of [37968,37969])for(const mode of ['ko','revive','floor']){const s=make({move});s.fighters[1].hp=1;if(mode==='revive')s.fighters[1].soulState.rebirth2243={armed:true};if(mode==='floor'){timer(s,1,'致命保留',{hp:1});timer(s,1,'protect');}go(s,move,20117);assert.equal(s.fighters[1].hp,mode==='ko'?0:mode==='floor'?1:move===37968?6000:9000);if(move===37969)assert.equal(!!s.fighters[0].ailments['疲惫'],mode==='ko');else assert.equal(!!s.fighters[1].effects.attackBlock,mode==='ko');}
});
