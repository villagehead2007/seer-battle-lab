'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4800/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=38086,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true,enemySoul=null,aCharacteristic,bCharacteristic}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=2009;if(enemySoul)b.selectedSoulId=enemySoul;else b.souls=[];
 ids??=move===38088?[38086,29159,29160,38101,move]:[move,...[38086,29159,29160,38101].filter(x=>x!==move).slice(0,3),38088];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',characteristic:aCharacteristic,overrides:{...stats,...aStats}},{suit:'none',characteristic:bCharacteristic,overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,2009);assert.equal(s.fighters[1].soulId,enemySoul);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=38086,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
const characteristic=(name,star=5)=>{const g=E.CHARACTERISTICS.groups.find(x=>x.name===name);assert.ok(g,name);return E.CHARACTERISTICS.normalize({groupId:g.id,star});};
test('4800真实2009与17招全部原生实例、重复强化顺序、PP及自耗不复活',()=>{
 assert.equal(source.source.revision,'b65ccde6');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[2009,'df7fa90e']]);for(const m of source.moves){const s=make({move:m.id,hp:4000});s.fighters[1].stages.atk=2;go(s,m.id);assert.equal(s.fighters[0].soulState.heroGlory2009,0);assert.equal(s.wikiSnapshots[0].moves.length,17);assert.equal(s.fighters[0].pp[key(m.id)],m.id===29149?m.pp:m.pp-1);if(m.id===38087)assert.equal(s.fighters[0].hp,0);if(m.id===29157)assert.equal(s.fighters[0].stages.atk,4);if(m.kind!=='status'&&m.power>0&&m.id!==38087)assert.ok(sum(s)>0,m.name);}
});
test('4800真实入场双边砥砺亮节、三轮0PP恢复含上限且到期停止',()=>{
 const s=make({move:38097});for(const f of s.fighters){assert.equal(f.ailments['砥砺'],1);assert.equal(f.soulState.bright2009,3);}const ppKey=key(10716);for(let r=1;r<=4;r++){s.fighters[1].pp[ppKey]=0;go(s,38097);assert.equal(s.fighters[1].pp[ppKey],r<=3?Math.min(5,neutral.moves.find(m=>m.id===10716).pp):0);}
});
test('4800自然亮节压过4797实际乱流，攻击异常特性零概率且非异常强攻仍生效',()=>{
 const enemy=require('../research/BATCH-4676-NEXT50/4797/snapshot.json'),opts={move:38097,enemy,enemySoul:1987,enemyIds:[38018,29107,29108,38019,38020],bCharacteristic:E.CHARACTERISTICS.normalize({groupId:E.CHARACTERISTICS.groups.find(x=>x.name==='颤栗').id})};
 const s=make(opts);assert.equal(s.fighters[1].soulState.bright2009,3);go(s,38097,38018);assert.equal(s.fighters[1].soulState.compute1987.turbulenceRound,1);assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.equal(s.fighters[0].ailments['麻痹'],undefined);
 const a=make({...opts,bCharacteristic:E.CHARACTERISTICS.normalize({groupId:E.CHARACTERISTICS.groups.find(x=>x.name==='强攻').id,star:5})}),b=make({...opts,bCharacteristic:E.CHARACTERISTICS.normalize({groupId:0})});go(a,38097,38018);go(b,38097,38018);assert.ok(sum(a,'attack',1)>sum(b,'attack',1));
});
test('4800完整38104概率免攻同次真实多段同判，失败也不重抽，禁疗不回血',()=>{
 const enemy=multi,enemyIds=[10389,20167,10390,20168,37933],seen=new Set;for(let seed=1;seed<=12;seed++){const s=make({move:38104,enemy,enemyIds,seed:Math.imul(seed,0x9e3779b1)>>>0,hp:1000});timer(s,0,'技能禁疗');go(s,38104,10389);const ev=events(s,'attack',1);assert.ok(ev.length>=2);assert.ok(ev.every(e=>e.settledDamage===0)||ev.every(e=>e.settledDamage>0));seen.add(ev[0].settledDamage===0);assert.ok(s.fighters[0].hp<=1000);}assert.deepEqual(seen,new Set([true,false]));
});
test('4800威怯只减固粉不减真伤，真实砥砺回复80不篡改完整伤害100',()=>{
 const s=make({move:38097});let values;
 go(s,38097,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===1){c.a.soulState.awe2009=c.round;const before=c.t.hp;c.hurt(c.t,100,'精确固定','fixed');const fixed=before-c.t.hp;const n=c.t.hp;c.hurt(c.t,100,'精确百分比','percent');const percent=n-c.t.hp;const p=c.t.hp;c.hurt(c.t,100,'精确真实','true');values=[fixed,percent,p-c.t.hp];}});assert.deepEqual(values,[40,40,20]);assert.equal(events(s,'true',1).at(-1).settledDamage,100);assert.equal(events(s,'true',1).at(-1).hpLoss,100);
});
