'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4787/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=37991,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=1983;b.souls=[];
 ids??=move===37993?[37991,29094,29095,37992,move]:[move,...[37991,29094,29095,37992].filter(x=>x!==move).slice(0,3),37993];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',overrides:{...stats,...aStats}},{suit:'none',overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,1983);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=37991,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
test('4787全部23招真实1983及30有序实例完整执行，原hash和基础PP、红伤、异常、能力及持续状态验证',()=>{
 assert.equal(source.source.revision,'5dace37c');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[1983,'eb66af3d']]);assert.equal(source.moves.reduce((n,m)=>n+m.effectInstances.length,0),30);
 for(const m of source.moves){const s=make({move:m.id,hp:1000});let out;go(s,m.id,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)out={hp:c.a.hp,stages:{...c.a.stages},effects:structuredClone(c.a.effects)};});assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1,m.name);assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount,1);assert.equal(s.wikiSnapshots[0].moves.length,23);if(m.kind!=='status')assert.ok(sum(s)>0,m.name);if(m.id===20017)assert.equal(out.stages.spe,2);if(m.id===20039)assert.ok(out.effects['要害概率增加']);if(m.id===10072)assert.equal(s.fighters[0].ailments['疲惫'],2);if(m.id===37993)assert.equal(sum(s,'fixed'),200);assert.ok(Number.isFinite(s.fighters[0].hp));}
});
test('4787魂印自易燃耗全体力与MAX真实附伤为源明确同一自耗分支，普通盾罩与保1不抵资源消耗',()=>{
 for(const mode of ['normal','invalid','control','status']){const s=make({move:10011,hp:1000});s.fighters[0].ailments['易燃']=3;s.fighters[0].suitState.shield=400;s.fighters[0].suitState.barrier=400;timer(s,0,'致命保留',{hp:1});timer(s,1,'致命保留',{hp:1});timer(s,1,'固定百分比免疫');if(mode==='invalid')s.fighters[0].counts.nextSkillInvalid=1;if(mode==='control')s.fighters[0].ailments['疲惫']=3;
 const ids=mode==='status'?[20004,10011,29094,29095,37993]:undefined;const q=ids?make({ids,hp:1000}):s;if(ids){q.fighters[0].ailments['易燃']=3;}go(q,mode==='status'?20004:10011);const trigger=!['control','status'].includes(mode);assert.equal(q.fighters[0].hp,trigger?0:1000);assert.equal(sum(q,'true'),trigger?9000:0);if(trigger){assert.equal(q.fighters[1].hp,1);assert.equal(q.fighters[0].suitState.shield,400);assert.equal(q.fighters[0].suitState.barrier,400);}}
});
test('4787双易燃自耗后不执行第二独立回满附粉分支，实际消耗不会被回满复活',()=>{
 const s=make({move:10011,hp:1000});for(const f of s.fighters)f.ailments['易燃']=3;timer(s,1,'致命保留',{hp:1});go(s,10011);assert.equal(s.fighters[0].hp,0);assert.equal(sum(s,'true'),9000);assert.equal(sum(s,'percent'),0);assert.equal(s.fighters[1].hp,1);
});
test('4787魂印回满附粉按原2回复前缺失HP，满血溢出禁疗倍率蛊与粉免疫分开，技能禁疗不封魂印',()=>{
 for(const mode of ['normal','full','cap','skill-ban','all-ban','half','gu','pink-immune']){const hp=mode==='full'?9000:mode==='cap'?8999:1000,s=make({move:10011,hp});s.fighters[1].ailments['易燃']=3;if(mode==='skill-ban')timer(s,0,'技能禁疗');if(mode==='all-ban')timer(s,0,'四杀鬼囹');if(mode==='half')timer(s,0,'回复效果削减',{fraction:.5});if(mode==='gu')s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];if(mode==='pink-immune')timer(s,1,'固定百分比免疫');go(s,10011);assert.equal(sum(s,'percent'),mode==='pink-immune'?0:9000-hp);assert.equal(s.fighters[0].hp,mode==='all-ban'?hp:mode==='half'?5500:mode==='gu'?8960:9000);}
 const dead=make({move:10011,hp:1,aStats:{maxHp:3}});dead.fighters[1].ailments['易燃']=3;dead.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];go(dead,10011);assert.equal(dead.fighters[0].hp,0);assert.equal(sum(dead,'percent'),0);
});
test('4787魂印仅回合初自身流血才附易燃中毒，正常免异及反弹独立，属性技能不触攻击后回满',()=>{
 for(const mode of ['plain','immune','reflect','no-bleed']){const s=make({ids:[20004,10011,29094,29095,37993],hp:1000});if(mode!=='no-bleed')s.fighters[0].ailments['流血']=9;if(mode==='immune')timer(s,1,'免异常');if(mode==='reflect')timer(s,1,'reflect');go(s,20004,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)assert.equal(c.a.hp,1000,'status does not run the attack-only full recovery');});assert.equal(!!s.fighters[1].ailments['易燃'],mode==='plain');assert.equal(!!s.fighters[1].ailments['中毒'],mode==='plain');if(mode==='reflect'){assert.ok(s.fighters[0].ailments['易燃']);assert.ok(s.fighters[0].ailments['中毒']);}assert.equal(sum(s,'percent'),mode==='plain'?1125:0,'plain poison DOT is independent of soul full-reply damage');}
});
test('4787真实1139仅本次结束后存在流血才授解除回满监听，实际解除/禁疗及失败后无无关监听',()=>{
 for(const mode of ['normal','ban','blocked']){const s=make({ids:[37991,20004,29094,29095,37993],hp:1000});if(mode==='blocked')s.fighters[0].counts.immune=1;go(s,37991);assert.equal(s.fighters[0].soulState.removedAilmentFullHeal,mode==='blocked'?undefined:'流血');refill(s);s.fighters[0].hp=1000;if(mode==='ban')timer(s,0,'技能禁疗');let before,after;go(s,20004,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===1){if(mode==='blocked')c.ailment(c.t,'流血',c.a);before=c.t.hp;c.clearAilment(c.t,'流血');after=c.t.hp;}});assert.equal(after,mode==='normal'?9000:before);assert.equal(s.fighters[0].ailments['流血'],undefined);}
});
test('4787真实1582均免异和同名未延长按已答补400盾，仅一边触发不补且同源刷新',()=>{
 for(const mode of ['normal','both-immune','same']){const s=make({move:29095});if(mode==='both-immune')for(const f of s.fighters)f.counts.immune=1;if(mode==='same'){s.fighters[0].ailments['流血']=10;s.fighters[1].ailments['冻伤']=10;}go(s,29095);assert.equal(s.fighters[0].suitState.shield,mode==='normal'?0:400);if(mode==='same')assert.equal(s.fighters[0].hp,8920);}
});
test('4787真实1709实际KO才不回复，2243立即满血非KO仍按理论回复，粉免疫不缩回复',()=>{
 for(const mode of ['normal','ko','revive','pink-immune']){const s=make({move:37991,hp:1000});if(mode==='ko')s.fighters[1].hp=2000;if(mode==='revive'){s.fighters[1].hp=1;s.fighters[1].soulState.rebirth2243={armed:true};}if(mode==='pink-immune')timer(s,1,'固定百分比免疫');let hp;go(s,37991,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)hp=c.a.hp;});assert.equal(hp,mode==='ko'?1000:4000);if(mode==='revive')assert.ok(s.fighters[1].hp>0);if(mode==='ko')assert.equal(s.fighters[1].hp,0);}
});
test('4787真实796当前HP理论三分一回复与免粉、三轮实际到期；不偷换成最大HP基数',()=>{
 for(const immune of [false,true]){const s=make({ids:[37992,20004,10011,29094,37993],hp:1000});if(immune)timer(s,1,'固定百分比免疫');go(s,37992);const n=Math.floor((9000-sum(s))/3);assert.equal(sum(s,'percent'),immune?0:n);assert.equal(s.fighters[0].hp,4000+n);for(let r=2;r<=4;r++){const hp=s.fighters[1].hp,own=s.fighters[0].hp;go(s,20004);const n=r<=3?Math.floor(hp/3):0;assert.equal(sum(s,'percent'),immune?0:n);assert.equal(s.fighters[0].hp,Math.min(9000,own+n));}}
});
test('4787真实10038自反伤为完整红伤四分之一真伤，保1目标零损仍扣，固定百分比免疫不挡且零红不扣',()=>{
 for(const mode of ['normal','floor','red-immune']){const s=make({move:10038});timer(s,0,'固定百分比免疫');if(mode==='floor'){s.fighters[1].hp=1;timer(s,1,'致命保留',{hp:1});}if(mode==='red-immune')timer(s,1,'攻击伤害免疫');go(s,10038);const n=Math.floor(sum(s)/4);assert.equal(s.fighters[0].hp,9000-n);assert.equal(events(s,'true',0).length,0);assert.equal((s.damageEvents??[]).filter(e=>e.type==='true'&&e.targetSide===0).reduce((n,e)=>n+e.settledDamage,0),n);if(mode==='floor'){assert.equal(events(s)[0].hpLoss,0);assert.ok(n>0);}}
});
test('4787真实1582普通盾被真实攻击扣量后同源重授刷新400，不累加且不触发消失',()=>{
 const s=make({move:29095});for(const f of s.fighters)f.counts.immune=1;go(s,29095,10127);const prior=s.fighters[0].suitState.shield;assert.ok(prior>0&&prior<400);assert.equal(s.fighters[0].hp,9000);for(const f of s.fighters)f.counts.immune=1;go(s,29095,20117);assert.equal(s.fighters[0].suitState.shield,400);assert.equal(s.fighters[0].hp,9000);
});
test('4787完整29094真实闪避/命中两分支，命中后随机冻伤混乱且1775清实际用招PP，免异不补抽',()=>{
 const seen=new Set,ailments=new Set;for(let seed=1;seed<=32;seed++){const s=make({move:29094,hit:false,seed:Math.imul(seed,0x9e3779b1)>>>0});go(s,29094,10127);const landed=sum(s,'attack',1)>0;seen.add(landed);assert.equal(s.fighters[1].pp[key(10127)],0);const got=['冻伤','混乱'].filter(x=>s.fighters[1].ailments[x]);if(landed){assert.equal(got.length,1);ailments.add(got[0]);}else assert.equal(got.length,0);}assert.deepEqual(seen,new Set([false,true]));assert.deepEqual(ailments,new Set(['冻伤','混乱']));
 const s=make({move:29094});timer(s,1,'免异常');go(s,29094,10127);assert.ok(sum(s,'attack',1)>0);assert.equal(s.fighters[1].ailments['冻伤'],undefined);assert.equal(s.fighters[1].ailments['混乱'],undefined);
});
