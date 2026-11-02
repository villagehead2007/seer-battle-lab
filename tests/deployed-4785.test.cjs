'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4785/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=37984,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=1982;b.souls=[];
 ids??=move===29089?[37984,37985,37986,29088,move]:[move,...[37984,37985,37986,29088].filter(x=>x!==move).slice(0,3),29089];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',overrides:{...stats,...aStats}},{suit:'none',overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,1982);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=37984,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
test('4785全部17招真实1982和28有序实例逐招执行，纯场下效果不替代当前目标，真实PP和状态保留',()=>{
 assert.equal(source.source.revision,'3f926159');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[1982,'926df70b']]);assert.equal(source.moves.reduce((n,m)=>n+m.effectInstances.length,0),28);
 for(const m of source.moves){const s=make({move:m.id,hp:1000});if(m.id===37984)s.fighters[1].pp[key(20117)]--;let out;go(s,m.id,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)out={hp:c.a.hp,stages:{...c.a.stages},targetStages:{...c.t.stages},effects:structuredClone(c.a.effects)};});assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1,m.name);assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount,1);assert.equal(s.wikiSnapshots[0].moves.length,17);if(m.kind!=='status'&&m.power>0)assert.ok(sum(s)>0,m.name);if(m.id===37984){assert.equal(sum(s),0);assert.equal(sum(s,'fixed'),30);};assert.equal(sum(s,'true'),90);if(m.id===37985){assert.equal(sum(s,'percent'),3000);assert.ok(s.fighters[1].ailments['疲惫']);}if(m.id===37986){assert.ok(axes.every(k=>out.stages[k]===2&&out.targetStages[k]===2));assert.equal(out.hp,9000);}if(m.id===29088){assert.equal(s.fighters[0].suitState.shield,300);assert.equal(s.fighters[1].ailments['寄生'],undefined);assert.equal(s.fighters[1].effects['攻击必中'],undefined);assert.equal(s.fighters[1].effects['属性必中'],undefined);}assert.ok(Number.isFinite(s.fighters[0].hp));}
});
test('4785当前入场痴愚危机1、战斗阶段末真实汲取逐次90/180/360且先于回合末DOT和解除',()=>{
 const s=make({ids:[10001,20167,20168,20169,29089],hp:1000});assert.ok(s.fighters[1].soulState.chiyu1982);assert.equal(s.fighters[1].soulState.crisis1982,1);
 for(let r=1;r<=3;r++){s.rng=1234;s.fighters[1].hp=9000;let afterPhase;go(s,10001,20117,(e,c)=>{if(e==='battlePhaseEnd'&&c.a.side===0)afterPhase={hp:c.a.hp,crisis:c.t.soulState.crisis1982,fraction:c.a.soulState.ming1982.drainPercent};});assert.equal(sum(s,'true'),90*2**(r-1));assert.equal(afterPhase.hp,1000+90*(2**r-1));assert.equal(afterPhase.crisis,r+1);assert.equal(afterPhase.fraction,2**r);assert.ok(s.fighters[1].soulState.chiyu1982);}
});
test('4785魂印汲取真实伤害独立于固定百分比免疫，技能禁疗不封魂印，禁疗倍率溢出按公共回复处理',()=>{
 for(const mode of ['normal','pink-immune','skill-ban','all-ban','half','cap']){const s=make({move:10001,hp:mode==='cap'?8999:1000});if(mode==='pink-immune')timer(s,1,'固定百分比免疫');if(mode==='skill-ban')timer(s,0,'技能禁疗');if(mode==='all-ban')timer(s,0,'四杀鬼囹');if(mode==='half')timer(s,0,'回复效果削减',{fraction:.5});go(s,10001);assert.equal(sum(s,'true'),90);assert.equal(s.fighters[0].hp,mode==='cap'?9000:mode==='all-ban'?1000:mode==='half'?1045:1090);}
});
test('4785原129危机1/7/9/20对痴愚红固定百分比减伤最低0，真实伤害不减且不伪造增伤',()=>{
 for(const crisis of [1,7,9,20]){const s=make({move:10001});s.fighters[1].soulState.crisis1982=crisis;go(s,10001,10716,(e,c)=>{if(e==='afterUse'&&c.a.side===1){c.hurt(c.t,100,'明确痴愚固定','fixed');c.hurt(c.t,100,'明确痴愚百分比','percent');c.hurt(c.t,100,'明确痴愚真实','true');}});assert.equal(sum(s,'fixed',1),crisis===1?60:150);assert.equal(sum(s,'percent',1),crisis===1?40:100);assert.equal(sum(s,'true',1),100);assert.ok(sum(s,'attack',1)>0);}
});
test('4785痴愚回合结束后按危机5%解除，真实反转正级保负级并尊重免弱，概率成功失败',()=>{
 const seen=new Set;for(let seed=1;seed<=32;seed++){const s=make({move:10001,seed:Math.imul(seed,0x9e3779b1)>>>0});s.fighters[0].stages.atk=2;s.fighters[1].stages.def=3;s.fighters[1].stages.spe=-2;go(s,10001);const gone=!s.fighters[1].soulState.chiyu1982;seen.add(gone);assert.equal(s.fighters[0].stages.atk,gone?-2:2);assert.equal(s.fighters[1].stages.def,gone?-3:3);assert.equal(s.fighters[1].stages.spe,-2);}assert.deepEqual(seen,new Set([false,true]));
 const s=make({move:10001});s.fighters[1].soulState.crisis1982=19;s.fighters[0].stages.atk=2;timer(s,0,'免弱');go(s,10001);assert.equal(s.fighters[1].soulState.chiyu1982,undefined);assert.equal(s.fighters[0].stages.atk,2);
});
test('4785汲取回复触三蛊死亡停止增长危机和翻倍，无复活及死者普通载荷',()=>{
 const s=make({move:10001,hp:1});s.fighters[0].soulState.soulGu=Array.from({length:3},()=>({sourceSide:1,usedRound:0}));go(s,10001);assert.equal(s.fighters[0].hp,0);assert.equal(sum(s,'true'),90);assert.equal(s.fighters[0].soulState.ming1982.drainPercent,1);assert.equal(s.fighters[1].soulState.crisis1982,1);assert.equal(events(s,'true',1).reduce((n,e)=>n+e.hpLoss,0),91);
});
test('4785真实37985无换宠疲惫当前分支、免异反弹失败，场下2315不伤当前目标',()=>{
 for(const mode of ['normal','immune','reflect']){const s=make({move:37985});if(mode==='immune')timer(s,1,'免异常');if(mode==='reflect')timer(s,1,'reflect');go(s,37985);assert.equal(!!s.fighters[1].ailments['疲惫'],mode==='normal');assert.equal(sum(s,'true'),90);assert.equal(sum(s,'percent'),3000);assert.equal(s.fighters[1].hp,9000-3000-90);assert.equal(s.fighters[0].hp,9000);}
});
test('4785真实1753与1752同源刷新不触发消失，实际消盾分别技能回血和固定吸取清PP',()=>{
 const s=make({ids:[37986,10001,20167,20168,29089],hp:1000});go(s,37986);assert.equal(s.fighters[0].suitState.shield,200);s.fighters[0].hp=1000;refill(s);s.fighters[0].hp=1000;go(s,10001,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===1){const hp=c.t.hp;c.consumeShields(c.t,c.a);assert.equal(c.t.hp,hp+3000);assert.equal(c.t.suitState.shield,0);}});
 const q=make({ids:[29088,10001,20167,20168,29089],hp:1000});go(q,29088);assert.equal(q.fighters[0].suitState.shield,300);refill(q);q.fighters[0].hp=1000;go(q,10001,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===1){const hp=c.t.hp;c.consumeShields(c.t,c.a);assert.equal(c.t.hp,hp+300);assert.equal(c.t.suitState.shield,0);assert.ok(Object.values(c.a.pp).some(n=>n===0));}});assert.equal(sum(q,'fixed'),300);
});
test('4785真实1791按双方普通盾合计严格大于300才双倍，护罩保留且消失回血链真实执行',()=>{
 for(const total of [300,301]){const s=make({move:29089});s.fighters[0].suitState.shield=100;s.fighters[1].suitState.shield=total-100;s.fighters[0].suitState.barrier=500;go(s,29089);assert.equal(sum(s,'percent'),total*(total>300?2:1));assert.equal(s.fighters[0].suitState.shield,0);assert.equal(s.fighters[1].suitState.shield,0);assert.equal(s.fighters[0].suitState.barrier,500);}
});
test('4785真实1777按原有回合效果判寄生，无回合授寄生、有回合只清除、保护阻清除不冒充原无回合',()=>{
 for(const mode of ['empty','timed','protected']){const s=make({move:29088,hit:false});if(mode!=='empty')timer(s,1,'固定增伤',{amount:1});if(mode==='protected')timer(s,1,'protect');go(s,29088);assert.equal(!!s.fighters[1].ailments['寄生'],mode==='empty');assert.equal(!!s.fighters[1].effects['固定增伤'],mode==='protected');assert.equal(s.fighters[0].suitState.shield,300);}
});
