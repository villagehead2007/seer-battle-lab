'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,make,turn,pick,timer,key,keys}=require('./helpers/4125-battle.cjs');
function operations(s,side,id,instances){const compiled=E.WIKI.effectsEngine.compileInstances(instances.map(([id,args])=>({id,args,description:E.WIKI.effectsEngine.registry[id].template})),instances.map(([id])=>{const rule=E.WIKI.effectsEngine.registry[id];return{id,argsNum:rule.argsNum,template:rule.template};}),{id});assert.equal(compiled.issue,'');s.moveDefinitions[key(id)].operations=compiled.operations;}

test('4125 Q093旧日之晷使用扣除前PP：2到1放行，1到0无效且消耗一次机会',()=>{
 for(const pp of [1,2]){
  const s=make({moveId:14102,index:null},{omit:true,soul:2051});
  s.fighters[0].ailments['疲惫']=3;s.fighters[0].soulState.leonOldDialLayers=1;
  s.fighters[1].pp[key(900040)]=pp;
  const o=turn(s,14102,900040);
  assert.equal(o.fighters[1].pp[key(900040)],pp-1);
  assert.equal((o.damageEvents??[]).filter(e=>e.sourceSide===1&&e.type==='attack').length,pp===1?0:1);
  assert.equal(o.fighters[0].soulState.leonOldDialUses,pp===1?0:1);
  assert.equal(o.fighters[1].soulState.skillInvalidRound===1,pp===1);
 }
});

test('4125旧日之晷同类型1PP可封其他技能，异类型1PP不封、无次数不封',()=>{
 for(const same of [false,true])for(const uses of [0,1]){
  const s=make({moveId:14102,index:null},{omit:true,soul:2051});
  s.fighters[0].ailments['疲惫']=3;s.fighters[0].soulState.leonOldDialLayers=1;s.fighters[0].soulState.leonOldDialUses=uses;
  s.moveDefinitions[key(900042)].kind=same?'special':'status';s.fighters[1].pp[key(900042)]=1;s.fighters[1].pp[key(900040)]=2;
  const o=turn(s,14102,900040),blocked=same&&uses>0;
  assert.equal((o.damageEvents??[]).some(e=>e.sourceSide===1&&e.type==='attack'),!blocked);
  assert.equal(o.fighters[0].soulState.leonOldDialUses,uses-(blocked?1:0));
  assert.equal(o.fighters[1].pp[key(900042)],1);
 }
});

test('4125旧日之晷首次使用实际获得层数及一次机会，控制和药剂不获得',()=>{
 let s=make({moveId:14102,index:null},{omit:true,soul:2051});
 let o=turn(s,900031);assert.equal(o.fighters[0].soulState.leonOldDialLayers,1);assert.equal(o.fighters[0].soulState.leonOldDialUses,1);
 assert.equal(o.fighters[0].soulState.leonOldDialObtained,true);
 s=make({moveId:14102,index:null},{omit:true,soul:2051});s.fighters[0].ailments['疲惫']=3;o=turn(s,900031);assert.equal(o.fighters[0].soulState.leonOldDialLayers,undefined);
});

test('4125旧日之晷损失PP严格12阈值：回合开始回满HP和PP并额外获得一次机会',()=>{
 for(const missing of [11,12]){
  const s=make({moveId:14102,index:null},{omit:true,soul:2051,hp:1000});
  s.fighters[0].ailments['疲惫']=3;s.fighters[0].soulState.leonOldDialLayers=1;s.fighters[0].soulState.leonOldDialUses=0;
  s.fighters[0].pp[key(900031)]=99-missing;
  const o=turn(s,14102);
  assert.equal(o.fighters[0].hp,missing===12?9000:1000);
  assert.equal(o.fighters[0].pp[key(900031)],missing===12?99:88);
  assert.equal(o.fighters[0].soulState.leonOldDialUses,missing===12?1:0);
 }
});

test('4125 Q025没有实际使用属性技能不产生1622失败补偿',()=>{
 for(const other of [900040,900041]){
  const s=make(pick(1622)[0]);
  if(other===900041)s.fighters[1].ailments['疲惫']=3;
  const o=turn(s,undefined,other);
  assert.equal(o.fighters[0].counts.attackReductionUses??0,0);
  assert.equal(o.fighters[0].soulState.leon1622Round,undefined);
 }
});

test('4125 Q026护盾采用理论吸取量，独立于粉免、过量伤害、回复缺口与禁疗',()=>{
 for(const targetHp of [200,9000])for(const hp of [1000,8999])for(const immune of [false,true])for(const banned of [false,true]){
  const s=make(pick(1327)[0],{hp,targetHp});if(immune)timer(s,1,'固定百分比免疫');if(banned)timer(s,0,'技能禁疗');
  const o=turn(s);
  assert.equal(o.fighters[0].suitState.shield,3000);
  assert.equal(o.fighters[0].hp,banned?hp:Math.min(9000,hp+3000));
  const pink=(o.damageEvents??[]).filter(e=>e.type==='percent');
  assert.equal(pink.reduce((n,e)=>n+e.settledDamage,0),immune?0:3000);
  assert.equal(o.fighters[0].soulState.leonShield1327Pending,undefined);
 }
});

test('4125 Q027转附分别继承每种剩余回合，免疫不补抽、解除成功仍施加命中附效失效',()=>{
 for(const immune of [false,true]){
  const s=make(pick(2145)[0]);s.fighters[0].ailments['烧伤']=4;s.fighters[0].ailments['冻伤']=2;
  if(immune)timer(s,1,'免异常');const o=turn(s);
  assert.equal(o.fighters[0].ailments['烧伤'],undefined);assert.equal(o.fighters[0].ailments['冻伤'],undefined);
  assert.equal(o.fighters[1].ailments['烧伤'],immune?undefined:4);assert.equal(o.fighters[1].ailments['冻伤'],immune?undefined:2);
  assert.equal(o.fighters[1].effects['技能命中效果失效'].end,2);
 }
 const s=make(pick(2145)[0]),o=turn(s);assert.equal(o.fighters[1].effects['技能命中效果失效'],undefined);
});

test('4125 Q027跨阶段关闭多段、必暴、增威、粉伤、用后成长和失败补偿，保留基础攻击与必中',()=>{
 const build=disabled=>{
  const s=make({moveId:14102,index:null},{omit:true,criticals:true});
  operations(s,0,14102,[[31,[3,3]],[1315,[100]],[29,[300]],[2396,[]]]);
  if(disabled)timer(s,0,'技能命中效果失效');
  return s;
 };
 let o=turn(build(true));assert.equal(o.damageEvents.filter(e=>e.type==='attack').length,1);assert.equal(o.damageEvents.some(e=>e.type==='fixed'),false);assert.equal(o.fighters[0].soulState.attackBonus2396,undefined);
 o=turn(build(false));assert.equal(o.damageEvents.filter(e=>e.type==='attack').length,3);assert.equal(o.damageEvents.filter(e=>e.type==='fixed').length,3);assert.equal(o.fighters[0].soulState.attackBonus2396,.3);
 const s=make(pick(1315)[0]??{moveId:14102,index:null},{omit:true,hit:false});
 timer(s,0,'技能命中效果失效');s.moveDefinitions[key(s.auditMoveId)].alwaysHit=true;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;
 assert.ok(turn(s).damageEvents.some(e=>e.type==='attack'));
 for(const disabled of [false,true]){const miss=make({moveId:14102,index:null},{omit:true,hit:false,hp:1000});operations(miss,0,14102,[[136,[3]],[1794,[3,1,50]]]);miss.moveDefinitions[key(14102)].alwaysHit=false;miss.moveDefinitions[key(14102)].accuracy=0;if(disabled)timer(miss,0,'技能命中效果失效');const result=turn(miss);assert.equal(result.fighters[0].hp,disabled?1000:7000);assert.equal(result.fighters[0].counts.nextAttackReductionUses??0,disabled?0:1);}
});

test('4125最新封锁确认：混合先制消强和穿免限伤忽略全部关闭，独立魂印保留',()=>{
 let s=make({moveId:14102,index:null},{omit:true,aStats:{spe:1},bStats:{spe:900}});
 operations(s,0,14102,[[714,[2]],[699,[]],[697,[]]]);s.fighters[1].stages.def=1;timer(s,0,'技能命中效果失效');s.fighters[1].counts.attackNullify=1;
 let o=turn(s);assert.ok(o.turns.at(-1).events.find(e=>e.kind==='move').text.startsWith('B 方'));assert.equal(o.fighters[1].stages.def,1);assert.equal(o.damageEvents.find(e=>e.type==='attack').settledDamage,0);
 s=make({moveId:14102,index:null},{omit:true,soul:2051});timer(s,0,'技能命中效果失效');o=turn(s);assert.equal(o.fighters[0].soulState.leonOldDialLayers,1);
 s=make(pick(697)[0]);timer(s,0,'技能命中效果失效');timer(s,1,'攻击伤害上限',{amount:1});assert.equal(turn(s).damageEvents[0].settledDamage,1);
});

test('4125宙变上限五层、不是异常、冻结真实异常且星赎不造成双倍延长',()=>{
 let s=make(pick(2398)[0]);s.fighters[1].soulState.leonCosmicLayers=5;s.fighters[1].ailments['烧伤']=3;
 let o=turn(s);assert.equal(o.fighters[1].soulState.leonCosmicLayers,5);assert.equal(o.fighters[1].ailments['烧伤'],4);
 s=make(pick(2398)[0]);o=turn(s);assert.equal(o.fighters[1].soulState.leonCosmicLayers,1);assert.deepEqual(o.fighters[1].ailments,{});
 s=make({moveId:14102,index:null},{omit:true});s.fighters[0].soulState.leonCosmicLayers=1;s.fighters[0].ailments['烧伤']=3;s.fighters[0].ailments['星赎']=3;
 o=turn(s,900031);assert.equal(o.fighters[0].ailments['烧伤'],4);
});

test('4125宙变按层数覆盖在场前N回合非真实输出减半，攻击固定百分比均覆盖、真实不减',()=>{
 for(const id of [29,1327,1680]){
  const build=cosmic=>{const entry=id===1680?{moveId:14102,index:null}:pick(id)[0],s=make(entry,{omit:id===1680});if(id===1680)operations(s,0,14102,[[1680,[300]]]);if(cosmic)s.fighters[0].soulState.leonCosmicLayers=1;return s;};
  const a=turn(build(false)),b=turn(build(true)),type=id===29?'fixed':id===1327?'percent':'true';
  const sum=o=>o.damageEvents.filter(e=>e.type===type).reduce((n,e)=>n+e.settledDamage,0);
  assert.equal(sum(b),id===1680?sum(a):sum(a)/2);
  if(id===29)assert.equal(b.damageEvents.find(e=>e.type==='attack').settledDamage,Math.floor(a.damageEvents.find(e=>e.type==='attack').settledDamage/2));
  if(id===29){const next=turn(b);assert.equal(next.damageEvents.filter(e=>e.round===2&&e.type==='fixed')[0].settledDamage,sum(a));}
 }
});

test('4125 2399只改已有衰弱，修改后检查，概率属性失效及命中附效失效均计载体',()=>{
 for(const carrier of ['概率','命中'])for(const existing of [false,true]){
  const s=make(pick(2399)[0]);s.fighters[0].soulState.leonOldDialLayers=2;
  if(carrier==='概率')timer(s,1,'逐回合属性失效或减伤',{chance:50,attacks:1,reduction:50});else timer(s,1,'技能命中效果失效');
  if(existing)s.fighters[1].ailments['衰弱']=8;const o=turn(s);
  assert.equal(o.fighters[1].ailments['衰弱'],existing?3:undefined);
  assert.equal(o.fighters[1].soulState.leonCosmicLayers,existing?undefined:1);
 }
});

test('4125 2400整招所有反应后清除自身用招记录及成长，下次重新获得旧日',()=>{
 let s=make(pick(2400)[0],{soul:2051,hp:1000});s.fighters[0].soulState.leonLastKind='status';s.fighters[0].soulState.skillUses={'wiki:14102':4};s.fighters[0].soulState.damageGrowth={'wiki:14102':3};s.fighters[0].soulState.attackBonus2396=.6;
 let o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[0].soulState.leonLastKind,undefined);assert.equal(o.fighters[0].previousMoveId,undefined);assert.equal(o.fighters[0].soulState.skillUses,undefined);assert.equal(o.fighters[0].soulState.damageGrowth,undefined);assert.equal(o.fighters[0].soulState.attackBonus2396,undefined);
 o=turn(o,900031);assert.equal(o.fighters[0].soulState.leonOldDialLayers,1);
 s=make(pick(2400)[0],{targetHp:1});o=turn(s);assert.ok(o.fighters[0].soulState.skillUses[key(s.auditMoveId)]>0);
});

test('4125 2397击败后对手全部宙变转成自身三种星状态，未击败不转移',()=>{
 for(const targetHp of [1,9000]){
  const s=make(pick(2397)[0],{targetHp});s.fighters[1].soulState.leonCosmicLayers=4;const o=turn(s);
  assert.equal(o.fighters[1].soulState.leonCosmicLayers,targetHp===1?0:4);
  for(const name of ['星赐','星哲','星赎'])assert.equal((o.fighters[0].ailments[name]??0)>=4,targetHp===1);
 }
});

test('4125 2401按已有累计消逝次数提升本技能攻击、比例吸取和降低旧日阈值',()=>{
 for(const count of [0,1,2]){
  const s=make(pick(2401)[0],{hp:1000});s.vanishedCount=count;const o=turn(s),control=make(pick(2401)[0],{hp:1000,omit:true});timer(control,0,'攻击伤害倍数',{multiple:1+.3*count});const base=turn(control);
  // Apply the same multiplier before final damage rounding, rather than multiplying an already rounded event.
  assert.equal(o.damageEvents.find(e=>e.type==='attack').settledDamage,base.damageEvents.find(e=>e.type==='attack').settledDamage);
  assert.equal(o.fighters[0].soulState.leonOldDialThresholdReduction,count);
  assert.equal(o.fighters[0].hp,1000+900*count);
 }
});

test('4125消逝与普通击败区分：真实HP上限归零、只计一次、当前对手即时计数且不能复活',()=>{
 const rules=require('../dist/status-rules.js'),s=make(pick(2401)[0]);
 const opponent=s.fighters[1];assert.equal(rules.vanish(s,opponent,1),true);
 assert.equal(opponent.hp,0);assert.equal(opponent.stats.maxHp,0);assert.equal(opponent.soulState.vanished,true);assert.equal(s.vanishedCount,1);
 assert.equal(rules.vanish(s,opponent,1),false);assert.equal(s.vanishedCount,1);assert.equal(s.vanishEvents.length,1);
 const o=turn(s);assert.equal(o.finished,true);assert.equal(o.winner,0);assert.equal(o.fighters[1].hp,0);
 const plain=turn(make(pick(2401)[0],{targetHp:1}));assert.equal(plain.vanishedCount??0,0);assert.equal(plain.fighters[1].stats.maxHp,9000);
});

test('4125原版前述包含回合初分支，随机在使用后、失败吸取在战阶，首用无分支不吸取',()=>{
 let s=make({moveId:14102,index:null},{omit:true,soul:1356,hp:1000});s.fighters[0].ailments['烧伤']=3;timer(s,1,'免异常');
 let o=turn(s,900031);assert.equal(o.randomStatusEvents.filter(e=>e.type==='draw').length,1);
 assert.equal(o.damageEvents.filter(e=>e.type==='percent'&&e.sourceSide===0&&e.targetSide===1).length,1);
 const burn=o.damageEvents.find(e=>e.targetSide===0&&e.type==='fixed'&&e.settledDamage===1125);assert.ok(burn);assert.equal(burn.hpLoss,1125);assert.equal(o.fighters[0].hp+burn.hpLoss,4000);assert.equal(o.fighters[0].hp,2875);assert.equal(o.fighters[0].suitState.shield,3000); // 失败吸取理论3000回复；普通盾不抵挡烧伤固伤。
 s=make({moveId:14102,index:null},{omit:true,soul:1356,hp:1000});timer(s,1,'免异常');o=turn(s,900031);assert.equal(o.randomStatusEvents,undefined);assert.equal(o.fighters[0].hp,1000);
 s=make({moveId:14102,index:null},{omit:true,soul:1356,hp:1000});s.fighters[0].ailments['疲惫']=3;timer(s,1,'免异常');o=turn(s,900031);assert.equal(o.randomStatusEvents,undefined);assert.equal(o.fighters[0].hp,1000);
});

test('4125原版异类回复在流程末附伤之后，觉醒三类记录跨受控或药剂保留',()=>{
 let s=make({moveId:14102,index:null},{omit:true,soul:1356,hp:1000});s.fighters[0].soulState.leonLastKind='status';s.fighters[1].stages.def=-1;timer(s,0,'流程末弱化附伤',{amount:100});timer(s,1,'免异常');
 let o=turn(s),events=o.damageEvents.filter(e=>e.sourceSide===0),fixed=events.findIndex(e=>e.source==='流程末弱化附伤'||e.type==='fixed'),percent=events.findIndex(e=>e.type==='percent');assert.ok(fixed>=0&&percent>fixed);assert.equal(events[percent].settledDamage,3000);
 s=make({moveId:14102,index:null},{omit:true,soul:2051});s=turn(s);s.fighters[0].ailments['疲惫']=s.round;let controlled=turn(s);assert.equal(controlled.fighters[0].soulState.leonLastKind,'physical');
 controlled=E.resolveTurn(controlled,['potion:hp',key(900041)]);assert.equal(controlled.fighters[0].soulState.leonLastKind,'physical');
 o=turn(controlled);assert.equal(o.fighters[0].soulState.leonSame,true);assert.equal(o.fighters[0].soulState.leonAttackBonus,.5);
});

test('4125觉醒未获得旧日时衰弱失败附三层宙变，已获得后不触发、层数最高五',()=>{
 for(const immune of [false,true]){
  const s=make({moveId:14102,index:null},{omit:true,soul:2051});s.fighters[0].ailments['疲惫']=3;if(immune)timer(s,1,'免异常');const o=turn(s);
  assert.equal(o.fighters[1].soulState.leonCosmicLayers,immune?4:1);
  assert.equal(!!o.fighters[1].ailments['衰弱'],!immune);
 }
 const s=make({moveId:14102,index:null},{omit:true,soul:2051});s.fighters[0].soulState.leonOldDialLayers=5;s.fighters[0].soulState.leonOldDialUses=0;const o=turn(s,900031);assert.equal(o.fighters[0].soulState.leonOldDialLayers,5);assert.equal(o.fighters[0].soulState.leonOldDialUses,0);assert.equal(o.fighters[1].ailments['衰弱'],undefined);
});
