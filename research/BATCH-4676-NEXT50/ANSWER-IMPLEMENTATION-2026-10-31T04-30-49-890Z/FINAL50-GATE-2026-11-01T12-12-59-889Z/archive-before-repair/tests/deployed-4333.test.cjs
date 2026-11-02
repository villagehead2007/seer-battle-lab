'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4333-battle.cjs'),{make,pick,turn,timer,key,source,keys,E}=H;
const damage=(s,type='percent',side=1)=>(s.damageEvents??[]).filter(e=>e.type===type&&e.targetSide===side&&e.round===s.round-1).reduce((n,e)=>n+e.settledDamage,0);
test('4333确认两版魂印MISS控制整招无效不吸取，免攻击与命中效果封锁仍吸取',()=>{
for(const soul of [1559,1851])for(const mode of ['miss','control','invalid','attack-immune','hit-block']){const s=make({moveId:10001,index:null},{soul,hp:1000});s.fighters[0].counts.nextCrit=0;for(const k of s.fighters[1].moves)s.fighters[1].pp[k]=s.moveDefinitions[k].pp;if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}if(mode==='control')s.fighters[0].ailments['疲惫']=3;if(mode==='invalid')timer(s,0,'skillBlock');if(mode==='attack-immune')s.fighters[1].counts.attackNullify=1;if(mode==='hit-block')timer(s,0,'技能命中效果失效');const o=turn(s);assert.equal(damage(o),['attack-immune','hit-block'].includes(mode)?3000:0);assert.equal(o.fighters[0].hp,['attack-immune','hit-block'].includes(mode)?4000:1000);if(mode==='attack-immune')assert.equal(o.fighters[1].counts.attackNullify,0);}
});
test('4333确认混合暴击多段按整招一次吸取，全暴击才清PP且保留既有crit标记',()=>{
for(const soul of [1559,1851]){let mixed=false;for(let seed=1;seed<150&&!mixed;seed++){const s=make({moveId:10001,index:null},{soul,hp:1000,seed,criticals:true});s.fighters[0].counts.nextCrit=0;for(const k of s.fighters[1].moves)s.fighters[1].pp[k]=s.moveDefinitions[k].pp;s.moveDefinitions[key(s.auditMoveId)].critical='8/16';s.moveDefinitions[key(s.auditMoveId)].operations=[{effectId:1627,index:0,phase:'beforeUse',params:[1,2,2]}];const o=turn(s);if(o.fighters[0].soulState.laberLastAttack?.mixed){mixed=true;assert.equal(damage(o),3000);assert.equal(o.fighters[0].hp,4000);}}assert.ok(mixed);}
});
test('4333确认1851登场名单固定两回合，恢复不解除后来降PP不新增第三回合解除',()=>{
const soul=source.souls.find(x=>x.id===1851),s=make(pick(732)[0],{enemySoul:soul}),foe=s.fighters[1],a=s.fighters[0],m=key(s.auditMoveId);delete foe.soulState.laberEntry;a.pp[m]=1;E.SOULS.registry[1851].hooks.battleStart({a:foe,t:a,round:1,maxPP:k=>s.moveDefinitions[k].pp,ppReductionBlocked:()=>true,random:()=>0});assert.ok(foe.soulState.laberEntry.blocked.includes(m));a.pp[m]=s.moveDefinitions[m].pp;let o=turn(s);assert.equal(o.fighters[0].stages.atk,0);o=turn(o);assert.equal(o.fighters[0].stages.atk,0);o=turn(o);assert.equal(o.fighters[0].stages.atk,1);
const q=make(pick(732)[0],{enemySoul:soul});q.fighters[0].pp[key(q.auditMoveId)]=1;const n=turn(q);assert.equal(n.fighters[0].stages.atk,1);
});
test('4333公共技能载荷在实际攻击免疫时不执行，护盾零伤仍执行且魂印独立',()=>{
for(const mode of ['immune','shield','hit-block']){const s=make(pick(732)[0],{soul:1559,hp:1000});if(mode==='immune')s.fighters[1].counts.attackNullify=1;if(mode==='shield')require('../dist/shield-rules.js').add(s.fighters[1],9000,'test');if(mode==='hit-block')timer(s,0,'技能命中效果失效');const o=turn(s);assert.equal(o.fighters[0].stages.atk,mode!=='hit-block'?1:0);assert.equal(damage(o),mode==='shield'?0:3000);assert.equal(o.fighters[0].hp,4000);if(mode==='shield')assert.equal(damage(o,'attack'),0);}
});
test('4333精确58原始双参真实执行下两回合必暴，邻pet或参数不接受',()=>{
const s=make({moveId:21741,index:null},{omit:true}),m=source.moves.find(x=>x.id===21741),compiled=E.WIKI.compile(m,source);assert.equal(compiled.issue,'');s.moveDefinitions[key(21741)].operations=compiled.operations;const o=turn(s);assert.equal(o.fighters[0].effects['必定暴击'].start,2);assert.equal(o.fighters[0].effects['必定暴击'].end,3);for(const args of [[2,3],[2,2,2]]){const v=structuredClone(m);v.effectInstances[0].args=args;assert.ok(E.WIKI.compile(v,source).issue);}assert.deepEqual(m.effectInstances[0].args,[2,2]);
});

test('4333真实原版强化与双第五四组合逐招配招初始化并执行，原始ID名称PP与源第五不混装',()=>{
const E=H.E,source=require('../research/4333-reviewed-snapshot.json'),raw=require('../research/4333-source-check.json').records.find(x=>x.url.endsWith('/pet/4333')).data,other=require('../local-species.cjs').species(4430);assert.equal(source.skillVersions.length,4);for(const original of raw.skill){const move=source.moves.find(x=>x.id===original.skill.id);assert.equal(move.fifth,original.is_fifth);assert.equal(move.sourceFlags.is_special,original.is_special);}
for(const v of E.WIKI.versionSnapshots(source)){const group=v.skillVersions.find(g=>g.id===v.selectedSkillVersion),available=v.moves.filter(m=>group.moveIds.includes(m.id));assert.equal(available.filter(x=>x.fifth).length,1);for(const m of available){const defaults=E.WIKI.defaultMoves(v),load=[m.id,...defaults.filter(x=>x!==m.id)].slice(0,5);if(!load.includes(group.fifthId))load[4]=group.fifthId;assert.equal(E.WIKI.assess(v,load).supported,true);const s=E.createBattle({wikiSnapshots:[v,other],wikiLoadouts:[load,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,spe:500}},{overrides:{maxHp:9000,spe:1}}]});assert.equal(s.fighters[0].soulId,v.selectedSoulId);assert.equal(s.moveDefinitions[key(m.id)].name,m.name);assert.equal(s.fighters[0].pp[key(m.id)],m.pp);const o=E.resolveTurn(s,[key(m.id),'wiki:'+E.WIKI.defaultMoves(other)[0]]);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.ok(o.fighters[0].pp[key(m.id)]<=m.pp);assert.equal(s.moveDefinitions[key(m.id)].operations.length>0,m.effectInstances.length>0);}
const bad=[35687,37398,...E.WIKI.defaultMoves(v).filter(x=>![35687,37398].includes(x))].slice(0,5);assert.equal(E.WIKI.assess(v,bad).supported,false);}
});


test('4333确认先执行状态效果再判实际免疫，不回滚1959清免疫睡眠且后续载荷依实际结果',()=>{
const H2=require('./helpers/4329-battle.cjs');let s=H2.make(H2.pick(1959)[0]);H2.timer(s,1,'攻击伤害免疫');const o=H2.turn(s);assert.equal(o.fighters[1].effects['攻击伤害免疫'],undefined);assert.ok(o.fighters[1].ailments['睡眠']);assert.ok(damage(o,'attack')>0);
for(const threshold of [1,99999]){const q=make(pick(732)[0],{soul:1559,hp:1000});timer(q,1,'大额攻击免疫',{threshold});const n=turn(q);assert.equal(n.fighters[0].stages.atk,1);assert.equal(n.fighters[0].hp,4000);assert.equal(damage(n,'attack')===0,threshold===1);}
});

test('4333公共实际免疫标记覆盖六界与两版时空跃迁，不以零伤推断免疫',()=>{
const store=require('../local-species.cjs');for(const [pet,id]of [[4032,1288],[4050,1299],[4050,1543]]){const soul=store.species(pet).souls.find(x=>x.id===id),s=make(pick(732)[0],{enemySoul:soul,aStats:{spa:9999},targetHp:id===1288?9000:1000});if(id===1288)timer(s,1,'天玄大伤免疫');const o=turn(s);assert.equal(damage(o,'attack'),0);assert.equal(o.fighters[0].stages.atk,1);if(id!==1288)assert.equal(o.fighters[1].soulState.spacetimeJumps,1);}
});
test('4333公共已挂载技能吸取弱化扣PP及固伤载荷同样受实际攻击免疫门控',()=>{
for(const immune of [false,true]){const s=make({moveId:10001,index:null},{omit:true,hp:1000});timer(s,0,'攻击命中最大体力吸取',{denominator:3});timer(s,0,'攻击命中全属性弱化',{amount:1});timer(s,0,'直接攻击降双防',{amount:-1});timer(s,0,'命中技能附加固伤',{amount:40});timer(s,0,'攻击附加固伤',{amount:50});s.fighters[0].counts.nextHitPPWeak=1;s.fighters[0].soulState.hitPPWeakUnit=2;s.fighters[0].soulState.hitPPWeakAmount=1;if(immune)s.fighters[1].counts.attackNullify=1;const o=turn(s);assert.equal(o.fighters[0].counts.nextHitPPWeak,0);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].stages.atk===0,false);assert.equal(damage(o,'fixed'),90);if(immune){assert.equal(o.fighters[1].hp,5910);assert.equal(o.fighters[0].pp[key(10001)],0);}}
});

test('4333公共下次附伤失败补偿暴击免异常攻击回血与延迟异常全部遵守载荷门槛',()=>{
for(const mode of ['normal','immune','hit-block','miss']){const s=make({moveId:10001,index:null},{omit:true,hp:1000,criticals:true});H.op(s,1176,[0,2,75],s.auditMoveId);timer(s,0,'必定暴击');timer(s,0,'暴击后异常免疫次数',{count:2});s.fighters[0].counts.nextAttackFixed=1;s.fighters[0].soulState.nextAttackFixedAmount=100;s.fighters[0].counts.nextAttackPercentUses=1;s.fighters[0].soulState.nextAttackPercentFraction=1/3;s.fighters[0].soulState.warAttackHeal=true;s.fighters[0].counts.nextSkillCurse=1;s.fighters[0].soulState.nextSkillCurse={chance:1,ailment:'麻痹'};if(mode==='immune')s.fighters[1].counts.attackNullify=1;if(mode==='hit-block')timer(s,0,'技能命中效果失效');if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}const o=turn(s),ok=['normal','immune'].includes(mode);assert.equal(damage(o,'fixed'),ok?175:0);assert.equal(damage(o),ok?3000:0);assert.equal(o.fighters[0].counts.immune??0,ok?2:0);assert.equal(!!o.fighters[1].ailments['麻痹'],ok);assert.equal(o.fighters[0].hp,ok?1000+damage(o,'attack'):1000);assert.equal(o.fighters[0].counts.nextSkillCurse,0);assert.equal(o.fighters[0].counts.nextAttackFixed,0);assert.equal(o.fighters[0].counts.nextAttackPercentUses,0);}
});
test('4333公共584仍是直接处决免疫例外，仅免死保留1HP，真正命中封锁阻止触发且不伪造伤害',()=>{
for(const mode of ['normal','save','hit-block']){const s=make({moveId:10001,index:null},{omit:true});timer(s,0,'攻击附加秒杀概率',{chance:100});timer(s,1,'攻击伤害免疫');if(mode==='save')timer(s,1,'致命保留',{hp:1});if(mode==='hit-block')timer(s,0,'技能命中效果失效');const o=turn(s);assert.equal(o.fighters[1].hp,mode==='save'?1:mode==='hit-block'?9000:0);assert.equal(damage(o,'true'),0);assert.equal((o.healthLossEvents??[]).filter(e=>e.type==='execution').length,mode==='hit-block'?0:1);}
});


test('4333公共持续用招手动载荷逐项状态矩阵：正常触发，免攻封锁MISS整招无效不追加',()=>{
const cases=[
['自身用攻异常或吸取',{chance:0,ailment:'麻痹',denominator:3},'heal'],
['托鲁克先手害怕',{chance:100},'ailment'],['托鲁克先手控制清回合',{chance:100,ailment:'麻痹'},'ailment'],
['技能回复量追加',{amount:100,count:1},'percent'],['用招疲惫或全强化',{chance:0,ailment:'疲惫',amount:1},'stage'],
['用招异常失败吸取',{chance:0,ailment:'麻痹',denominator:3},'heal'],['用招消盾真伤',{fraction:1},'shield'],
['启灵固真追加',{amount:100},'fixed'],['用招失明或粉伤',{chance:0,ailment:'失明',denominator:3},'percent'],
['用招回血满体改粉伤',{fraction:1/3,fullFraction:1/2},'heal'],['用招回血固定伤害',{amount:100},'heal'],
['用招回血粉伤',{fraction:1/3},'heal'],['用招冻伤失败减PP',{chance:0,ailment:'冻伤',amount:2},'pp'],
['用招异常失败弱化',{chance:0,ailment:'麻痹',amount:1},'weaken'],['用招低体双吸',{fraction:1/3,threshold:.5},'heal'],
['用招低体吸取禁疗',{fraction:1/3,threshold:.5,duration:2},'heal'],['用招低体吸取',{fraction:1/3,threshold:.5},'heal'],
['努恩用招回复免疫补真',{fraction:1/3,extraFraction:.1},'heal'],['魏武用招吸取补真',{denominator:3,trueDamage:100},'heal'],
['用招固定吸取体力',{amount:100},'heal'],['强化用招异常',{chance:100,ailment:'焚烬'},'ailment'],
['用招低体吸取改双倍粉伤',{denominator:3,threshold:.5},'percent'],['低体固定吸取失败真伤',{amount:100,threshold:.5,failureDamage:50},'heal'],
['用招吸取体力',{fraction:1/3},'heal'],['drain',{},'heal'],['比较体力回血',{fraction:1/3},'heal'],
['用招体攻粉伤',{fraction:.1},'percent'],['用招条件回血',{fraction:.1,threshold:.5},'heal'],['用招低体回满',{amount:100,threshold:.5},'heal'],
['用招低体比例回满',{fraction:.1,threshold:.5},'heal'],['用招低体改吸取',{threshold:.5,drainFraction:.1,healFraction:.1},'heal'],
['天玄回复待确认附伤',{threshold:.5,fraction:.1},'heal'],['用招低体双倍回血粉伤',{threshold:.5,fraction:.1},'heal'],
['用招天敌固伤',{amount:100},'fixed'],['用招高体固伤',{amount:100},'fixed'],['用招消强',{},'clear'],['用招吸强',{},'clear'],
['用招定额回血',{amount:100},'heal'],['用招按能力种类回复',{amount:100},'heal'],['hypnosGrowth',{stages:[1,1,1,1,1,1]},'stage'],
['hypnosDrain',{denominator:3},'heal'],['用招异常失败攻击减免',{chance:0,ailment:'麻痹',count:1,amount:100},'reduction'],
['用招附加固定',{amount:100},'fixed'],['用招附加最大体力粉伤',{fraction:.1},'percent'],
['用招弱化失败封攻',{stages:[-1,0,0,0,0,0],duration:2},'weaken'],['用招弱化失败增伤',{stages:[-1,0,0,0,0,0],count:1,fraction:.5},'weaken'],
['fullHeal',{},'heal'],['用招回复溢出盾',{fraction:.1},'heal'],['用招低体固定吸取',{lowAmount:100,amount:50},'heal'],
['id57',{fraction:.1},'heal'],['用招无强化百分比追加',{healDenominator:3,damageDenominator:3},'heal'],['thirdHeal',{},'heal'],
['2230持续',{denominator:3,chance:100},'heal'],['用招源盾比例真伤',{fraction:.1,extra:100},'percent'],['用招额外真伤',{amount:100},'true'],
['用招强化登场反应',{},'stage'],['命中后消耗当前体力粉伤',{denominator:10},'cost'],['用招低体回血粉伤',{threshold:.5,fraction:.1},'heal']
];
for(const [effect,params,witness]of cases)for(const mode of ['normal','immune','hit-block','miss','invalid']){
const s=make({moveId:10001,index:null},{omit:true,hp:1000});timer(s,0,effect,params);if(witness==='clear')s.fighters[1].stages.atk=2;if(effect==='用招按能力种类回复'||effect==='强化用招异常')s.fighters[0].stages.atk=1;if(witness==='shield')require('../dist/shield-rules.js').add(s.fighters[1],100,'fixture');
if(mode==='immune')s.fighters[1].counts.attackNullify=1;if(mode==='hit-block')timer(s,0,'技能命中效果失效');if(mode==='invalid')timer(s,0,'skillBlock');if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}
const o=turn(s),a=o.fighters[0],t=o.fighters[1],ok=['normal','immune'].includes(mode),label=effect+'/'+mode;
if(witness==='heal')assert.equal(a.hp>1000,ok,label);if(witness==='cost')assert.equal(a.hp<1000,ok,label);if(['fixed','percent','true'].includes(witness))assert.equal(damage(o,witness)>0,ok,label);
if(witness==='ailment')assert.equal(Object.keys(t.ailments).length>0||!t.soulState.skillUses?.[key(920041)],ok,label);if(witness==='stage')assert.equal(a.stages.def>0,ok,label);if(witness==='weaken')assert.equal(t.stages.atk<0,ok,label);if(witness==='clear')assert.equal(t.stages.atk,ok?0:2,label);
if(witness==='pp')assert.equal(t.pp[key(920040)],ok?97:99,label);if(witness==='shield')assert.equal(damage(o,'true')>0,ok,label);if(witness==='reduction')assert.equal(!!a.soulState.nextAttackFlatReduction,ok,label);
if(!ok){assert.equal(a.hp,1000,label);assert.equal(damage(o,'fixed')+damage(o,'percent')+damage(o,'true'),0,label);}
}
});


test('4333公共前置状态只在有效命中执行，实际免攻仍依005保留已先行状态',()=>{
for(const effect of ['用招前随机吸强','先手附加异常','攻击随机异常','用招伤害前降防速'])for(const mode of ['normal','immune','hit-block','miss','invalid']){const s=make({moveId:10001,index:null},{omit:true});const data=effect==='用招前随机吸强'?{count:1}:effect==='用招伤害前降防速'?{def:1,spe:1,denominator:3}:{chance:100,ailment:'麻痹'};timer(s,0,effect,data);if(mode==='immune')s.fighters[1].counts.attackNullify=1;if(mode==='hit-block')timer(s,0,'技能命中效果失效');if(mode==='invalid')timer(s,0,'skillBlock');if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}const o=turn(s),ok=['normal','immune'].includes(mode),label=effect+'/'+mode;if(effect==='用招前随机吸强')assert.equal(Object.values(o.fighters[0].stages).some(x=>x>0),ok,label);else if(effect==='用招伤害前降防速')assert.equal(o.fighters[1].stages.def,ok?-1:0,label);else assert.equal(Object.keys(o.fighters[1].ailments).length>0,ok,label);}
});

test('4333公共2353保留先消耗时序，八荒1141与邪龙附伤受实际免疫及封锁限制',()=>{
for(const mode of ['normal','immune','hit-block','miss']){const s=make({moveId:10001,index:null},{omit:true,hp:1000}),a=s.fighters[0];a.soulState.warConsumedDamage=50;a.soulState.dragonEaterStacks=1;a.soulState.eye1141={round:1,move:key(s.auditMoveId),chance:100,ailment:'麻痹'};timer(s,0,'八荒之力');if(mode==='immune')s.fighters[1].counts.attackNullify=1;if(mode==='hit-block')timer(s,0,'技能命中效果失效');if(mode==='miss'){delete a.effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}const o=turn(s),ok=['normal','immune'].includes(mode);assert.equal(damage(o,'fixed')>=200,ok);assert.equal(o.fighters[1].stats.maxHp,ok?8980:9000);assert.equal(!!o.fighters[1].ailments['麻痹'],ok);assert.equal(o.fighters[0].soulState.dragonEaterStacks,0);if(mode!=='miss')assert.equal(o.fighters[0].soulState.warConsumedDamage,undefined);}
for(const immune of [false,true]){const s=make({moveId:10001,index:null},{omit:true,hp:1000});H.op(s,2353,[10],s.auditMoveId);if(immune)s.fighters[1].counts.attackNullify=1;const o=turn(s);assert.equal(o.fighters[0].hp,100);assert.equal(damage(o,'fixed'),900);}
});

test('4333公共afterUse成长契约回PP与零伤石化按有效载荷执行，次数消费保留',()=>{
for(const mode of ['normal','immune','hit-block','miss','invalid']){const s=make({moveId:10001,index:null},{omit:true});H.op(s,2396,[],s.auditMoveId);s.fighters[0].counts.chenDefenseReplace=1;s.fighters[0].counts.darkSkyDust=1;s.fighters[0].pp[key(920030)]=10;if(mode==='immune')s.fighters[1].counts.attackNullify=1;if(mode==='hit-block')timer(s,0,'技能命中效果失效');if(mode==='invalid')timer(s,0,'skillBlock');if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}const o=turn(s),ok=['normal','immune'].includes(mode);assert.equal(o.fighters[0].soulState.attackBonus2396??0,ok?.3:0);assert.equal(o.fighters[0].pp[key(920030)],ok?12:10);assert.equal(!!o.fighters[1].ailments['石化'],mode==='immune');if(mode!=='invalid')assert.equal(o.fighters[0].counts.chenDefenseReplace,0);}
});


test('4333公共真实849注册与持续状态合用每回合只吸三项，MISS无效封锁不触发',()=>{
const R=require('./helpers/3575-battle.cjs');for(const mode of ['normal','hit-block','miss','invalid']){let s=R.make(R.pick(849)[0]);const entry=R.pick(849)[0],k=R.key(entry.moveId);if(mode==='hit-block')R.timer(s,0,'技能命中效果失效');if(mode==='invalid')R.timer(s,0,'skillBlock');if(mode==='miss'){delete s.fighters[0].effects['属性必中'];delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[k].alwaysHit=false;s.moveDefinitions[k].accuracy=0;}let o=R.turn(s);assert.equal(Object.values(o.fighters[0].stages).reduce((a,b)=>a+b,0),mode==='normal'?3:0);assert.equal(Object.values(o.fighters[1].stages).reduce((a,b)=>a+b,0),mode==='normal'?-3:0);if(mode==='normal'){o=R.turn(o);assert.equal(Object.values(o.fighters[0].stages).reduce((a,b)=>a+b,0),6);assert.equal(Object.values(o.fighters[1].stages).reduce((a,b)=>a+b,0),-6);}}
});
