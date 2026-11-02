'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4797/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=38018,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true,aCharacteristic,bCharacteristic}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=1987;b.souls=[];
 ids??=move===38020?[38018,29107,29108,38019,move]:[move,...[38018,29107,29108,38019].filter(x=>x!==move).slice(0,3),38020];
 enemyIds??=[20117,10127,10716,20309,37911];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',characteristic:aCharacteristic,overrides:{...stats,...aStats}},{suit:'none',characteristic:bCharacteristic,overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,1987);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=38018,b=20117,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
const characteristic=(name,star=5)=>{const g=E.CHARACTERISTICS.groups.find(x=>x.name===name);assert.ok(g,name);return E.CHARACTERISTICS.normalize({groupId:g.id,star});};
test('4797全部10招真实1987及24有序实例完整执行，源版本与实际基础PP及魂印回PP分别验证',()=>{
 assert.equal(source.source.revision,'95493f1b');assert.deepEqual(source.souls.map(x=>[x.id,x.hash]),[[1987,'cdaba0e1']]);assert.equal(source.moves.reduce((n,m)=>n+m.effectInstances.length,0),24);
 for(const m of source.moves){const s=make({move:m.id,hp:1000});let out;go(s,m.id,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)out={hp:c.a.hp,stages:{...c.a.stages},targetStages:{...c.t.stages},pp:{...c.a.pp},effects:structuredClone(c.a.effects)};});assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount,1);assert.equal(out.pp[key(m.id)],m.id===38020?0:m.pp-1);assert.equal(s.fighters[0].pp[key(m.id)],m.id===38020?1:m.pp,m.name+':soul restoresPP1 after real use');assert.deepEqual(s.fighters[0].soulState.compute1987.lastEndRolls,[true,true,true,true,true]);if(m.kind!=='status'&&m.id!==38020)assert.ok(sum(s)>0,m.name);if(m.id===38020){assert.equal(sum(s),0);assert.ok(Object.values(out.pp).every(x=>x===0));assert.equal(out.hp,9000);assert.deepEqual(['atk','spa','spe'].map(k=>out.targetStages[k]),[-1,-1,-1]);}assert.ok(Number.isFinite(s.fighters[0].hp));}
});
test('4797真实算力不足50保留且不触乱流，恰50正常支付，五个20%仅 funded 时全100',()=>{
 for(const points of [0,30,49,50,100]){const s=make({move:10611});s.fighters[0].soulState.compute1987.points=points;let start;go(s,10611,20117,(e,c)=>{if(e==='roundStart'&&c.a.side===0)start=structuredClone(c.a.soulState.compute1987);});const remaining=points>=50?points-50:points;assert.equal(start.points,remaining);assert.equal(start.turbulenceRound,points>=50?1:null);const end=s.fighters[0].soulState.compute1987;assert.equal(end.points,remaining+(end.lastEndRolls.some(Boolean)?0:20));if(points>=50)assert.deepEqual(end.lastEndRolls,[true,true,true,true,true]);}
});
test('4797完整魂印五项清异常回PP减PP强化净回血附固定，保护失败仍算抽中不补算力',()=>{
 for(const mode of ['normal','protected','gu','cap']){const s=make({move:10611,hp:mode==='cap'?8999:1000});s.fighters[0].ailments['失明']=4;for(const k of s.fighters[0].moves)s.fighters[0].pp[k]=2;if(mode==='protected'){timer(s,1,'PP保护');timer(s,0,'禁强化');timer(s,0,'回复效果削减',{fraction:1});}if(mode==='gu')s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];go(s,10611);assert.equal(s.fighters[0].ailments['失明'],undefined);assert.equal(s.fighters[0].pp[key(10611)],2);assert.equal(s.fighters[1].pp[key(10127)],neutral.moves.find(x=>x.id===10127).pp-(mode==='protected'?0:1));assert.equal(s.fighters[0].stages.atk,mode==='protected'?0:1);const net=mode==='protected'?0:mode==='gu'?160:mode==='cap'?1:200;assert.equal(sum(s,'fixed'),net);assert.equal(s.fighters[0].hp,(mode==='cap'?8999:1000)+net);assert.equal(s.fighters[0].soulState.compute1987.points,50);}
});
test('4797同一受限特性不同星级真实共振仅一次，10%四舍五入且当前HP保持，异种特性不共振',()=>{
 const s=make({move:20265,hp:1000,aStats:{maxHp:9005},aCharacteristic:characteristic('回神',0),bCharacteristic:characteristic('回神',5)});for(let r=1;r<=2;r++){let start;go(s,20265,20117,(e,c)=>{if(e==='roundStart'&&c.a.side===0)start={hp:c.a.hp,max:c.a.stats.maxHp,limited:c.a.soulState.compute1987.limited};});assert.deepEqual(start,{hp:1000+200*(r-1),max:9906,limited:false});assert.equal(s.fighters[0].soulState.compute1987.hpBonus,901);}
 const no=make({move:20265,hp:1000,aStats:{maxHp:9005},aCharacteristic:characteristic('顽强'),bCharacteristic:characteristic('回神')});go(no,20265);assert.equal(no.fighters[0].stats.maxHp,9005);assert.equal(no.fighters[0].soulState.compute1987.limited,true);
});
test('4797三限制特性在真实乱流中仍失效，共振解除后顽强瞬杀回神在原生战斗中真实生效',()=>{
 const instant=make({move:10611,aCharacteristic:characteristic('瞬杀')});go(instant,10611);assert.ok(instant.fighters[1].hp>0);assert.equal(E.CHARACTERISTIC_RULES.active(instant.fighters[0]),null);
 const recover=make({move:10611,hp:1000,aCharacteristic:characteristic('回神')});go(recover,10611,10127);assert.equal(recover.fighters[0].hp,1200-sum(recover,'attack',1));
 const endure=make({move:10611,hp:1,aCharacteristic:characteristic('顽强'),aStats:{spe:1},bStats:{atk:9999,spe:999}});go(endure,10611,10127);assert.equal(endure.fighters[0].hp,0);
 const releasedInstant=make({move:10611,aCharacteristic:characteristic('瞬杀'),bCharacteristic:characteristic('瞬杀')});go(releasedInstant,10611);assert.equal(releasedInstant.fighters[1].hp,0);
 const releasedRecover=make({move:10611,hp:1000,aCharacteristic:characteristic('回神'),bCharacteristic:characteristic('回神')});timer(releasedRecover,0,'技能禁疗');go(releasedRecover,10611,10127);assert.equal(releasedRecover.fighters[0].hp,9900);
 const releasedEndure=make({move:10611,hp:100,aCharacteristic:characteristic('顽强'),bCharacteristic:characteristic('顽强'),bStats:{atk:9999}});go(releasedEndure,10611,10127);assert.equal(releasedEndure.fighters[0].hp,202);assert.ok(events(releasedEndure,'attack',1)[0].settledDamage>100);assert.equal(events(releasedEndure,'attack',1)[0].hpLoss,98);
});
test('4797攻击特性只在命中后判定，MISS整招无效不触发，免攻零红和命中封锁仍独立触发特性',()=>{
 for(const mode of ['normal','miss','invalid','zero','seal']){const s=make({move:10611,aCharacteristic:characteristic('颤栗',0),hit:mode!=='miss'});if(mode==='miss')timer(s,0,'攻击必失');if(mode==='invalid')s.fighters[0].counts.nextSkillInvalid=1;if(mode==='zero')timer(s,1,'攻击伤害免疫');if(mode==='seal')timer(s,0,'技能命中效果失效');go(s,10611);assert.equal(!!s.fighters[1].ailments['害怕'],!['miss','invalid'].includes(mode),mode);if(['miss','invalid','zero'].includes(mode))assert.equal(sum(s),0);}
});
test('4797亮节公共已授前态优先于真实乱流升百，旧优先级字段不改变原140为0',()=>{
 for(const mode of [undefined,'turbulence-last','bright-last']){const s=make({move:10611,aCharacteristic:characteristic('颤栗',0)});s.fighters[0].soulState.bright2009=3;s.fighters[0].soulState.characteristicProbabilityOrder=mode;go(s,10611);assert.ok(sum(s)>0);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.equal(s.fighters[0].soulState.compute1987.turbulenceRound,1);}
});
test('4797真实对手多段10389下概率受击特性整招仅尝试一次，普通死者不反应或回合末复活',()=>{
 const s=make({move:10611,enemy:multi,enemyIds:[10389,20167,10392,10397,37933],aCharacteristic:characteristic('反击',0)});go(s,10611,10389);assert.ok(events(s,'attack',1).length>=2);assert.equal(s.fighters[0].stages.atk,2,'one characteristic boost plus one soul end boost');
 const dead=make({move:10611,hp:1,enemy:multi,enemyIds:[10389,20167,10392,10397,37933],aCharacteristic:characteristic('反击',0),aStats:{spe:1},bStats:{atk:9999,spe:999}});go(dead,10611,10389);assert.equal(dead.fighters[0].hp,0);assert.equal(dead.fighters[0].stages.atk,0);assert.equal(sum(dead,'fixed'),0);
});
test('4797通用吸血只取完整技能红伤，保1实际损失0仍回血，非技能红及固粉真与魂印附伤均不计入',()=>{
 for(const mode of ['normal','floor','zero','soul-red','fixed','percent','true']){const s=make({move:10611,hp:1000,aCharacteristic:characteristic('吸血')});if(mode==='floor'){s.fighters[1].hp=1;timer(s,1,'致命保留',{hp:1});}if(mode==='zero')timer(s,1,'攻击伤害免疫');let red;go(s,10611,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0){red=c.a.lastSettledAttackDamage??0;if(['soul-red','fixed','percent','true'].includes(mode)){const before=c.a.hp;c.hurt(c.t,100,'明确独立非技能伤害前态',mode==='soul-red'?'attack':mode);assert.equal(c.a.hp,before);}}});assert.equal(s.fighters[0].hp,1200+Math.floor(red*.11));if(mode==='floor'){assert.equal(events(s)[0].hpLoss,0);assert.ok(red>1);}}
});
test('4797完整第五限红仍执行已授非红吸取与独立魂印固定，PP清零后魂印恢复1，不把0红当无效',()=>{
 const s=make({ids:[29108,10611,20265,38018,38020],hp:1000});timer(s,0,'protect');timer(s,1,'protect');timer(s,1,'致命保留',{hp:1});go(s,29108);s.fighters[0].hp=1000;s.fighters[1].hp=9000;timer(s,0,'技能禁疗');go(s,38020);assert.equal(sum(s),0);assert.equal(sum(s,'percent'),6000);assert.equal(sum(s,'fixed'),200);assert.equal(s.fighters[0].hp,1200);assert.ok(Object.values(s.fighters[0].pp).every(x=>x===1));assert.ok(Object.values(s.fighters[1].pp).every(x=>x===0));
});
test('4797真实第五命中效果封锁仍净化自身并限红，其他命中载荷不穿锁且魂印五项正常',()=>{
 const s=make({move:38020,hp:1000});s.fighters[0].ailments['流血']=4;timer(s,0,'攻击技能命中效果失效');let beforeEnd;go(s,38020,20117,(e,c)=>{if(e==='afterUse'&&c.a.side===0)beforeEnd={hp:c.a.hp,bleed:c.a.ailments['流血'],pp:{...c.a.pp}};});assert.equal(beforeEnd.bleed,undefined);assert.equal(beforeEnd.hp,1000);assert.equal(sum(s),0);assert.equal(beforeEnd.pp[key(38020)],source.moves.find(m=>m.id===38020).pp-1);assert.equal(s.fighters[1].ailments['臣服'],undefined);assert.equal(s.fighters[0].hp,1200);
});
test('4797完整第五臣服同名未延长或免异均吸取，三弱化任一失败仍封攻而非只全失败',()=>{
 for(const mode of ['same','immune','partial']){const s=make({move:38020,hp:1000});timer(s,1,'protect');if(mode==='same')s.fighters[1].ailments['臣服']=10;if(mode==='immune')timer(s,1,'免异常');if(mode==='partial'){s.fighters[1].stages.atk=-6;timer(s,1,'弱化不可解除反转');}go(s,38020,null);assert.equal(sum(s),0);if(mode!=='partial'){assert.equal(sum(s,'percent'),3000);assert.equal(s.fighters[0].hp,9000);}else{assert.equal(s.fighters[1].stages.atk,-6);assert.equal(s.fighters[1].stages.spa,-1);assert.equal(s.fighters[1].stages.spe,-1);assert.ok(s.fighters[1].effects['封攻']);}}
});
test('4797真实乱流虚无按源一次伤害抵挡当前一段，整招只尝试一次而后续多段不补判',()=>{
 const s=make({move:10611,enemy:multi,enemyIds:[10389,20167,10392,10397,37933],aCharacteristic:characteristic('虚无')});const row=E.CHARACTERISTICS.get(s.fighters[0].build.characteristic.groupId,5);assert.equal(row.hash,'aa8596f9');assert.equal(row.description,'8%几率完全抵挡一次伤害');go(s,10611,10389);const hits=events(s,'attack',1);assert.ok(hits.length>=2);assert.equal(hits[0].settledDamage,0);assert.ok(hits.slice(1).every(e=>e.settledDamage>0));
});
