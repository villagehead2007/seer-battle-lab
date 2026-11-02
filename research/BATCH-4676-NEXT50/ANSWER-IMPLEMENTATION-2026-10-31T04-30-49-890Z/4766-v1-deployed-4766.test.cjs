'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4676-NEXT50/4766/snapshot.json'),neutral=require('../research/4628-reviewed-snapshot.json'),multi=require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const key=id=>'wiki:'+id,axes=['atk','def','spa','spd','spe','acc'];
function timer(s,side,name,data={},start=s.round,end=99){s.fighters[side].effects[name]={start,end,...data};}
function make({move=10127,ids,hp=9000,aStats={},bStats={},enemy=neutral,enemyIds,seed=0x9e3779b9,hit=true}={}){
 const a=structuredClone(source),b=structuredClone(enemy);a.selectedSoulId=1967;b.souls=[];
 ids??=move===37911?[37909,29045,29046,37910,move]:[move,...[37909,29045,29046,37910].filter(x=>x!==move).slice(0,3),37911];
 enemyIds??=[20030,10086,10392,20521,37258];
 assert.deepEqual(E.WIKI.assess(a,ids).issues,[]);assert.deepEqual(E.WIKI.assess(b,enemyIds).issues,[]);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[ids,enemyIds],criticals:false,builds:[{suit:'none',overrides:{...stats,...aStats}},{suit:'none',overrides:{...stats,spe:100,...bStats}}]});
 Object.assign(s.typeChart.aliases,structuredClone(a.typeChart.aliases),structuredClone(b.typeChart.aliases));s.rng=seed;s.fighters[0].hp=hp;
 if(hit)for(const f of s.fighters)for(const n of ['攻击必中','属性必中'])timer(s,f.side,n);
 assert.equal(s.fighters[0].soulId,1967);assert.equal(s.fighters[1].soulId,null);assert.notEqual(s.fighters[0].number,s.fighters[1].number);
 for(const [snap,loadout]of [[a,ids],[b,enemyIds]])for(const id of loadout){const m=snap.moves.find(x=>x.id===id),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m),actual=s.moveDefinitions[key(id)];assert.equal(c.issue,'');assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));assert.equal(actual.revision,m.revision);}
 return s;
}
function go(s,a=10127,b=20030,observe){const old=E.SOULS;if(observe)E.SOULS={...old,run(e,c){old.run(e,c);observe(e,c);}};try{return Object.assign(s,E.resolveTurn(s,[a===null?'potion:hp':key(a),b===null?'potion:hp':key(b)]));}finally{E.SOULS=old;}}
const events=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type===type&&e.sourceSide===side&&e.targetSide===1-side),sum=(s,type='attack',side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0),st=s=>s.fighters[0].soulState.wudao1967;
function refill(s){for(const f of s.fighters)f.hp=f.stats.maxHp;}
function path(s,{index=0,direction='forward',closed=false,blocked=0}={}){Object.assign(st(s),{index,direction,closed,blocked,sequence:direction==='forward'?['blood','evil','sky','blood']:['blood','sky','evil','blood']});return s;}

test('4766全部24招真实1967和47有序实例逐招完整执行，当前来源参数版本及PP与状态独立验证',()=>{
 assert.equal(source.source.revision,'2f043c10');assert.deepEqual(source.souls.map(x=>[x.id,x.hash,x.eid,x.args]),[[1967,'86c26636',2377,[6,6,50,1]]]);assert.equal(source.moves.reduce((n,m)=>n+m.effectInstances.length,0),47);
 for(const m of source.moves){const s=make({move:m.id,hp:1000}),before=s.fighters[1].stats.maxHp;let out;
 go(s,m.id,20030,(e,c)=>{if(e==='afterUse'&&c.a.side===0)out={hp:c.a.hp,stages:{...c.a.stages},effects:structuredClone(c.a.effects)};});
 assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount,1,m.name);assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1,m.name);assert.equal(s.wikiSnapshots[0].moves.length,24);
 assert.ok(sum(s,'percent')>=1500,m.name+':before-use soul damage');if(m.kind!=='status')assert.ok(sum(s)>0,m.name+':native red');
 if(m.id===20117)assert.equal(out.stages.atk,1);if(m.id===20307)assert.equal(out.stages.def,1);if(m.id===20308){assert.equal(out.stages.atk,1);assert.equal(out.stages.spa,1);}if(m.id===20309)assert.equal(out.hp,4000);if(m.id===10718)assert.equal(s.fighters[1].stats.maxHp,before-10);if(m.id===10716)assert.equal(sum(s,'fixed'),50);if(m.id===20310)assert.equal(s.fighters[0].counts.attackNullify,1);
 assert.ok(Number.isFinite(s.fighters[0].hp)&&Number.isFinite(s.fighters[1].hp));}
});
test('4766整招原血道抵挡真实不同种10389二至三段，招后衍化一次且END才累计抵挡，不纳入后层上限',()=>{
 for(const cap of [false,true]){const s=make({enemy:multi,enemyIds:[10389,20167,10392,10397,37933]});if(cap)timer(s,0,'攻击伤害上限',{amount:1});let atUse;
 go(s,10127,10389,(e,c)=>{if(e==='afterUse'&&c.a.side===1){const current=c.t.soulState.wudao1967;atUse={index:current.index,blocked:current.blocked,pending:current.pendingBlocked};}});
 assert.ok(events(s,'attack',1).length>=2);assert.equal(sum(s,'attack',1),0);assert.equal(st(s).index,1);assert.equal(atUse.blocked,0);assert.ok(atUse.pending>2);assert.equal(st(s).blocked,atUse.pending);assert.equal(st(s).pendingBlocked,0);}
});
test('4766逆转真实多段汇总完整红伤一次反馈且招后衍化，保1HP损失0仍按完整量反馈',()=>{
 for(const floor of [false,true]){const s=path(make({enemy:multi,enemyIds:[10389,20167,10392,10397,37933],hp:floor?1:9000}),{direction:'reverse'});if(floor)timer(s,0,'致命保留',{hp:1});
 go(s,10127,10389);const red=sum(s,'attack',1),feedback=events(s,'percent').slice(1);
 assert.ok(red>0);assert.equal(feedback.length,1);assert.equal(feedback[0].settledDamage,red);assert.equal(st(s).index,1);if(floor)assert.ok(events(s,'attack',1).every(x=>x.hpLoss===0));}
});
test('4766逆转普通致死即停止反馈衍化，免攻零结算不触发，技能禁疗不封战斗阶段魂印回血',()=>{
 const dead=path(make({hp:1,bStats:{atk:9999}}),{direction:'reverse'});go(dead,10127,10086);assert.equal(dead.fighters[0].hp,0);assert.equal(st(dead).index,0);assert.equal(sum(dead,'percent'),1500);
 const immune=path(make({hp:1000}),{direction:'reverse'});timer(immune,0,'攻击伤害免疫');timer(immune,0,'技能禁疗');go(immune,10127,10086);assert.equal(st(immune).index,0);assert.equal(sum(immune,'percent'),1500);assert.equal(immune.fighters[0].hp,4000);
});
test('4766当前有限血邪天血轨迹、末血回满PP及再衍化关闭，关闭后常驻附伤回血仍在',()=>{
 const s=make({ids:[10127,20117,20307,20308,37911]});s.fighters[0].pp[key(37911)]=1;
 for(let r=1;r<=5;r++){refill(s);go(s,10127,10086);assert.equal(st(s).index,[1,1,2,3,3][r-1]);if(r===4)assert.equal(s.fighters[0].pp[key(37911)],source.moves.find(m=>m.id===37911).pp);}
 assert.equal(st(s).closed,true);refill(s);s.fighters[0].hp=1000;go(s,10127);assert.equal(sum(s,'percent'),1500);assert.equal(s.fighters[0].hp,2500);
});
test('4766战日月逆行逆转保留当前位置且累计仅反馈一次，免疫和150%上限不改变消费',()=>{
 for(const immune of [false,true]){const s=path(make({move:37910,aStats:{maxHp:9000}}),{index:1,blocked:20000});timer(s,1,'致命保留',{hp:1});timer(s,1,'protect');if(immune)timer(s,1,'固定百分比免疫');go(s,37910);assert.equal(st(s).direction,'reverse');assert.equal(st(s).index,1);assert.equal(st(s).sequence[1],'sky');assert.equal(st(s).blocked,0);assert.equal(sum(s,'fixed'),immune?0:13500);refill(s);go(s,37910);assert.equal(sum(s,'fixed'),0);}
});
test('4766复原轨迹保留武道种类与关闭态、清累计、同源下次强化刷新且实际衍化才消费',()=>{
 for(const closed of [false,true]){const s=path(make({ids:[29046,20117,20307,37909,37911]}),{direction:'reverse',index:1,closed,blocked:300});
 go(s,29046);assert.equal(st(s).direction,'forward');assert.equal(st(s).closed,closed);assert.equal(st(s).index,closed?1:2);assert.equal(st(s).blocked,0);assert.equal(st(s).nextBoost,1);refill(s);go(s,29046);assert.equal(st(s).nextBoost,1);
 const before={...s.fighters[0].stages};refill(s);go(s,37909);assert.equal(st(s).nextBoost,closed?1:0);for(const k of axes)assert.equal(s.fighters[0].stages[k],closed?before[k]:Math.min(6,before[k]+1));}
});
test('4766魂印附粉在红伤之前、实际无效仍用招，控制道具不算用招；阶段回血先于END',()=>{
 for(const mode of ['normal','invalid','control','item']){const s=make({hp:1000});if(mode==='invalid')s.fighters[0].counts.nextSkillInvalid=1;if(mode==='control')s.fighters[0].ailments['疲惫']=9;let atPhase;
 go(s,mode==='item'?null:10127,20030,(e,c)=>{if(e==='battlePhaseEnd'&&c.a.side===0)atPhase=c.a.hp;});const ev=events(s,'percent');assert.equal(ev.length,['control','item'].includes(mode)?0:1);if(mode==='normal')assert.equal(s.damageEvents.find(x=>x.sourceSide===0).type,'percent');assert.equal(atPhase,mode==='item'?4250:4000);}
});
test('4766真实2300锁伤挡伤触发害怕，普通减免护盾护罩和残血保1不算锁伤，1568仅穿盾承伤',()=>{
 for(const mode of ['cap','block','flat','shield','barrier','floor']){const s=make({move:37911});timer(s,1,'protect');if(mode==='cap')timer(s,1,'攻击伤害上限',{amount:1});if(mode==='block')timer(s,1,'攻击伤害免疫');if(mode==='flat')timer(s,1,'伤害定额减免',{amount:99999});if(mode==='shield')s.fighters[1].suitState.shield=99999;if(mode==='barrier')s.fighters[1].suitState.barrier=99999;if(mode==='floor'){s.fighters[1].hp=1;timer(s,1,'致命保留',{hp:1});timer(s,1,'固定百分比免疫');}
 go(s,37911);assert.equal(!!s.fighters[1].ailments['害怕'],['cap','block'].includes(mode),mode);if(mode==='shield'){assert.ok(sum(s)>0);assert.equal(s.fighters[1].suitState.shield,99999);}if(mode==='cap')assert.equal(sum(s),1);if(mode==='block'||mode==='flat')assert.equal(sum(s),0);}
 const protectedStatus=make({move:37911});timer(protectedStatus,1,'攻击伤害上限',{amount:1});timer(protectedStatus,1,'免异常');timer(protectedStatus,1,'protect');protectedStatus.fighters[1].suitState.shield=500;go(protectedStatus,37911);assert.equal(protectedStatus.fighters[1].ailments['害怕'],undefined);assert.equal(protectedStatus.fighters[1].suitState.shield,500);
});
test('4766真实733负级反转触发强化事件，禁强化与负级锁失败不授害怕，正常免异可阻补偿',()=>{
 for(const mode of ['normal','ban','lock','immune']){const s=make({move:37910});s.fighters[0].stages.atk=-2;if(mode==='ban')timer(s,0,'禁强化');if(mode==='lock')timer(s,0,'弱化不可解除反转');if(mode==='immune')timer(s,1,'免异常');go(s,37910);assert.equal(s.fighters[0].stages.atk,['ban','lock'].includes(mode)?-2:2);assert.equal(!!s.fighters[1].ailments['害怕'],mode==='normal');}
});
test('4766真实532及1065按对应一次净HP增加附粉，溢出禁疗蛊转伤和两种回复来源互不混算',()=>{
 for(const id of [29052,29046])for(const mode of ['normal','cap','ban','gu','conversion']){const s=make({move:id,hp:mode==='cap'?8999:1000});if(mode==='ban')timer(s,0,'技能禁疗');if(mode==='gu')s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];if(mode==='conversion')timer(s,0,'自身技能回复转伤害',{sourceSide:1,fraction:1});let before,after;
 go(s,id,20030,(e,c)=>{if(e==='afterUse'&&c.a.side===0){after=c.a.hp;}});const request=id===29046?6000:3000,net=mode==='ban'||mode==='conversion'?0:mode==='cap'?1:request-(mode==='gu'?40:0);assert.equal(sum(s,'percent'),1500+net);assert.equal(after,mode==='conversion'?0:mode==='ban'?1000:mode==='cap'?9000:1000+net);}
});
test('4766真实1748只看本招，已命中零红暴击算暴击，MISS无效与命中封锁保留',()=>{
 for(const mode of ['noncrit','crit','zero','miss','invalid','seal']){const s=make({move:37921,hit:mode!=='miss'});if(mode!=='noncrit')timer(s,0,'必定暴击',{},1,1);if(mode==='zero')timer(s,1,'攻击伤害免疫');if(mode==='miss')timer(s,0,'攻击必失');if(mode==='invalid')s.fighters[0].counts.nextSkillInvalid=1;if(mode==='seal')timer(s,0,'技能命中效果失效');go(s,37921);assert.equal(!!s.fighters[0].effects['必定暴击'],mode==='noncrit',mode);}
});
test('4766真实1664整招无效不执行命中固伤，2301免攻零红保命中，普通盾仅抵红不挡独立粉',()=>{
 const s=path(make({move:29051}),{closed:true});go(s,29051,10086);assert.equal(sum(s,'attack',1),0);refill(s);go(s,37909,10086);assert.ok(sum(s,'attack',1)>0);
 const q=path(make({move:29045}),{closed:true});go(q,29045,10086);assert.equal(sum(q,'attack',1),0);assert.equal(q.fighters[0].effects['攻击伤害免疫'].end,2);refill(q);go(q,37909,10086);assert.equal(sum(q,'attack',1),0);refill(q);go(q,37909,10086);assert.ok(sum(q,'attack',1)>0);
});
test('4766真实1105按双攻面板30%不计能力等级，完整2220与下轮转伤护盾交互',()=>{
 for(const level of [-6,0,6]){const s=make({move:37920,aStats:{atk:200,spa:400}});s.fighters[0].stages.atk=level;s.fighters[0].stages.spa=level;go(s,37920);assert.equal(sum(s,'percent'),1500+120);}
 const s=make({move:37920,hp:1000});timer(s,1,'固定增伤',{amount:1});go(s,37920);assert.equal(s.fighters[0].soulState.emperorConvertRound,2);
});
