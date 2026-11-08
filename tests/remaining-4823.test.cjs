'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4823/snapshot.json'),H=require('./helpers/remaining-battle.cjs')(source),{E,key,keys,make,turn,timer,sum}=H;
const row=id=>{for(const m of source.moves){const index=m.effectInstances.findIndex(x=>x.id===id);if(index>=0)return {move:m.id,index};}throw Error(id);};
test('4823真实2014初始冻伤10、偶数减半5回合并当回合攻固粉减50真伤不减，自然递减后六次冻伤全弱',()=>{
 const s=make({move:10001,soul:true});assert.equal(s.fighters[0].ailments['冻伤'],10);const old=E.SOULS,received=[];E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===1)for(const type of['fixed','percent','true'])received.push(c.hurt(c.t,100,'分通道验证',type));}};try{turn(s,10001,10127);}finally{E.SOULS=old;}assert.deepEqual(received,[50,50,100]);assert.equal(s.fighters[0].ailments['冻伤'],5);assert.equal(s.fighters[0].soulState.snow2014.removed,5);assert.equal(s.fighters[0].soulState.snow2014.end,4);assert.equal(s.fighters[0].soulState.snow2014.delta,-6);for(const k of keys)assert.equal(s.fighters[1].stages[k],-6);assert.ok(s.fighters[1].ailments['冻伤']);
 const baseline=make({move:10001});turn(baseline,10001,10127);assert.ok(Math.abs(sum(s,'attack',1)-sum(baseline,'attack',1)*.5)<=1);
});
test('4823真实2014属性使用消除盾罩按种类各加1，末计数高则清回合清正并冰封；一种恰好抵自然递减回满全部PP',()=>{
 const a=make({move:10001,soul:true});a.fighters[1].suitState.shield=300;a.fighters[1].suitState.barrier=300;a.fighters[1].stages.def=2;turn(a);assert.equal(a.fighters[1].suitState.shield,0);assert.equal(a.fighters[1].suitState.barrier,0);assert.equal(a.fighters[0].ailments['冻伤'],12);assert.equal(a.fighters[0].soulState.snow2014.end,11);assert.ok(a.fighters[1].ailments['冰封']);assert.equal(a.fighters[1].stages.def,0);assert.equal(a.fighters[1].effects['攻击必中'],undefined);
 const b=make({move:10001,soul:true});b.fighters[1].suitState.shield=300;for(const k of b.fighters[0].moves)b.fighters[0].pp[k]=1;turn(b);assert.equal(b.fighters[0].soulState.snow2014.delta,0);for(const k of b.fighters[0].moves)assert.equal(b.fighters[0].pp[k],b.moveDefinitions[k].pp);assert.equal(b.fighters[1].ailments['冰封'],undefined);
});
test('4823真实2014无盾属性后自然少1仍施冻伤，免异失败回复100不受技能禁疗，已有同名冻伤每次成功仍全弱',()=>{
 const a=make({move:10001,soul:true});a.fighters[1].counts.immune=1;timer(a,0,'技能禁疗');turn(a);assert.equal(a.fighters[1].counts.immune,0);assert.equal(a.fighters[1].ailments['冻伤'],undefined);assert.equal(a.fighters[0].hp,7975);assert.equal(a.fighters[0].soulState.snow2014.delta,-1);
 const b=make({move:10001,soul:true});b.fighters[1].ailments['冻伤']=99;turn(b,10001,10127);assert.equal(b.fighters[1].ailments['冻伤'],99);for(const k of keys)assert.equal(b.fighters[1].stages[k],-6);
});
test('4823真实2014奇数减半按已答向下取整，入场冻伤免疫后0减半和相等回满PP，死亡不复活',()=>{
 const odd=make({move:10001,soul:true});odd.fighters[0].ailments['冻伤']=5;turn(odd,10001,10127);assert.equal(odd.fighters[0].ailments['冻伤'],2);assert.equal(odd.fighters[0].soulState.snow2014.removed,3);const a=make({move:10001,soul:true,selfEntryImmune:1});assert.equal(a.fighters[0].ailments['冻伤'],undefined);assert.equal(a.fighters[0].counts.immune,0);turn(a,10001,10127);assert.equal(a.fighters[0].pp[key(10001)],35);assert.equal(a.fighters[0].soulState.snow2014.delta,0);
 const dead=make({move:10001,soul:true,hp:200});turn(dead,10001,10127);assert.equal(dead.fighters[0].hp,0);assert.equal(dead.fighters[1].ailments['冻伤'],undefined);
});
test('4823全部17真实技能完整原生2014初始化与有序实例PP，正常属性对手无需奇数取整分支',()=>{
 for(const m of source.moves){const s=make({move:m.id,soul:true,hp:4000}),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m),actual=s.moveDefinitions[key(m.id)];assert.equal(c.issue,'');assert.equal(s.fighters[0].soulId,2014);assert.equal(actual.wikiId,m.id);assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));turn(s);assert.equal(s.fighters[0].pp[key(m.id)],m.id===38114?m.pp:m.pp-1);if(m.kind!=='status'&&m.power>0)assert.ok(sum(s)>0);}
});
test('4823全部17技能基础64种子负命中MISS、先制顺序、PP与强制暴击',()=>assert.equal(require('./helpers/next50-base-probe.cjs').verify(H).length,17));
test('4823/1542真实冰封吸正、无正全弱与强化保护不误补偿；1773双方负等级绝对值和每级50固定',()=>{
 const a=make(row(1542));a.fighters[1].stages.def=2;turn(a);assert.equal(a.fighters[0].stages.def,2);assert.equal(a.fighters[1].stages.def,0);assert.ok(a.fighters[1].ailments['冰封']);const b=make(row(1542));turn(b);assert.equal(b.fighters[1].stages.def,-1);const c=make(row(1542));c.fighters[1].stages.def=2;timer(c,1,'幽蝶强化保护');turn(c);assert.equal(c.fighters[1].stages.def,2);assert.equal(c.fighters[1].ailments['冰封'],undefined);
 const d=make(row(1773));d.fighters[0].stages.def=-2;d.fighters[1].stages.atk=-3;turn(d);assert.equal(sum(d,'fixed'),250);const full=make({move:38112});turn(full);assert.equal(sum(full,'fixed'),300);
});
test('4823/1932除冻伤外免反与次数免异独立，547双方指定5回合冻伤遵守最大剩余时长',()=>{
 const s=make(row(1932));turn(s);const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='beforeUse'&&c.a.side===1){c.t.counts.immune=2;assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),false);assert.equal(c.t.counts.immune,2);assert.ok(c.a.ailments['中毒']);assert.equal(c.ailment(c.t,'冻伤',c.a,false,false,2),false);assert.equal(c.t.counts.immune,1);}}};try{turn(s);}finally{E.SOULS=old;}
 const a=make(row(547));a.fighters[0].ailments['冻伤']=10;turn(a);assert.equal(a.fighters[0].ailments['冻伤'],10);assert.equal(a.fighters[1].ailments['冻伤'],5);
});
test('4823/676双防面板35%百分附伤在负零正战阶均210，明确下2回合本次不触发',()=>{
 for(const stage of[-6,0,6]){const s=make({...row(676),loadout:[29165,10001,29166,38113,38114]});s.fighters[0].stages.def=stage;s.fighters[0].stages.spd=stage;turn(s);assert.equal(sum(s,'percent'),0);turn(s,10001);assert.equal(sum(s,'percent'),210);}
});
test('4823/130真实男性附300固定女性与无性不附，固粉免疫为0且缺性别明确拒绝；1420有强化50%暴击成功失败',()=>{
 for(const gender of[1,2,0]){const s=make(row(130));s.fighters[1].gender=gender;turn(s);assert.equal(sum(s,'fixed'),gender===1?300:0);}const immune=make(row(130));immune.fighters[1].gender=1;timer(immune,1,'固定百分比免疫');turn(immune);assert.equal(sum(immune,'fixed'),0);const missing=make(row(130));delete missing.fighters[1].gender;assert.throws(()=>turn(missing),/真实性别/);
 const seen=new Set;for(let seed=1;seed<=64;seed++){const s=make({...row(1420),criticals:true,seed:Math.imul(seed,0x9e3779b1)>>>0});s.fighters[0].stages.def=1;turn(s);seen.add(s.turns.at(-1).events.some(e=>e.damage?.sourceSide===0&&e.text.includes('致命一击')));}assert.deepEqual(seen,new Set([false,true]));
});
test('4823/2230当次即回复半体，满体与技能禁疗失败施束缚；1938和1939给敌盾罩同源刷新异源保留',()=>{
 const a=make({...row(2230),hp:1000});turn(a);assert.equal(a.fighters[0].hp,5500);assert.equal(a.fighters[1].ailments['束缚'],undefined);for(const banned of[false,true]){const s=make({...row(2230),hp:banned?1000:9000});if(banned)timer(s,0,'技能禁疗');turn(s);assert.ok(s.fighters[1].ailments['束缚']);assert.equal(s.fighters[0].hp,banned?1000:9000);}
 for(const id of[1938,1939]){const s=make(row(id));if(id===1938)s.fighters[1].suitState.shield=100;else s.fighters[1].suitState.barrier=100;turn(s);assert.equal(s.fighters[1].suitState[id===1938?'shield':'barrier'],400);turn(s);assert.equal(s.fighters[1].suitState[id===1938?'shield':'barrier'],400);}
});
test('4823/1895固定吸取理论回复100，固粉免疫零伤冰封，禁疗阻回复不阻附伤；2035下次命中总PP含基础且当次授予不追溯消费',()=>{
 for(const immune of[false,true]){const s=make({...row(1895),hp:1000});if(immune)timer(s,1,'固定百分比免疫');turn(s);assert.equal(sum(s,'fixed'),immune?0:100);assert.equal(s.fighters[0].hp,1100);assert.equal(!!s.fighters[1].ailments['冰封'],immune);}const banned=make({...row(1895),hp:1000});timer(banned,0,'技能禁疗');turn(banned);assert.equal(banned.fighters[0].hp,1000);assert.equal(sum(banned,'fixed'),100);
 const s=make({...row(2035),loadout:[38114,10001,29165,29166,38113]});turn(s);assert.equal(s.fighters[0].pp[key(38114)],2);assert.equal(s.fighters[0].soulState.windPP2035.count,1);s.fighters[0].pp[key(10001)]=1;turn(s,10001);assert.equal(s.fighters[0].pp[key(10001)],0);assert.equal(s.fighters[0].soulState.windPP2035,undefined);assert.equal(s.fighters[0].soulState.windPP2035Last.counted,1);assert.equal(s.fighters[1].stages.def,-1);
});
test('4823/2035命中红伤免疫0仍耗全部PP，MISS与命中效果封锁保留资源，弱化免疫不退还PP',()=>{
 const loadout=[38114,10001,29165,29166,38113];for(const mode of['immune-red','miss','sealed','immune-weak']){const s=make({...row(2035),loadout});turn(s);s.fighters[0].pp[key(10001)]=3;if(mode==='immune-red')timer(s,1,'攻击伤害免疫');if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];timer(s,0,'攻击必失');}if(mode==='sealed')timer(s,0,'攻击技能命中效果失效');if(mode==='immune-weak')timer(s,1,'免弱');turn(s,10001);const retained=mode==='miss'||mode==='sealed';assert.equal(s.fighters[0].pp[key(10001)],retained?2:0);assert.equal(!!s.fighters[0].soulState.windPP2035,retained);assert.equal(s.fighters[1].stages.def,mode==='immune-red'?-3:0);if(mode==='immune-red')assert.equal(sum(s),0);}
 const full=make({move:38114});turn(full);assert.equal(full.fighters[0].pp[key(38114)],3);turn(full);assert.equal(full.fighters[0].pp[key(38114)],2);assert.equal(full.fighters[0].soulState.windPP2035.count,1);
});
test('4823真实重复4与5实例分别执行、六级截断和免弱；14冻伤50%与20%升速成功失败',()=>{
 for(const [move,expected]of [[20644,{def:-1,spd:-1}],[23745,{spd:-1,spe:-1}],[26722,{spa:2,spe:2,acc:2}]]){const s=make({move});turn(s);for(const[k,n]of Object.entries(expected))assert.equal(s.fighters[move===26722?0:1].stages[k],n);}
 const a=make({move:20177});a.fighters[0].stages.atk=5;turn(a);assert.equal(a.fighters[0].stages.atk,6);const b=make({move:20644});timer(b,1,'免弱');turn(b);assert.equal(b.fighters[1].stages.def,0);assert.equal(b.fighters[1].stages.spd,0);
 const cold=new Set,speed=new Set;for(let seed=1;seed<=64;seed++){for(const move of[33280,14290]){const s=make({move,seed:Math.imul(seed,0x9e3779b1)>>>0});turn(s);(move===33280?cold:speed).add(move===33280?!!s.fighters[1].ailments['冻伤']:s.fighters[0].stages.spe===1);}}assert.deepEqual(cold,new Set([false,true]));assert.deepEqual(speed,new Set([false,true]));
});
test('4823/1122全弱成功不冰封、全失败才冰封与部分负6不误补偿，993按对手冰封强化翻倍及禁强化',()=>{
 const a=make(row(1122));turn(a);assert.equal(a.fighters[1].stages.def,-1);assert.equal(a.fighters[1].ailments['冰封'],undefined);const b=make(row(1122));timer(b,1,'免弱');turn(b);assert.ok(b.fighters[1].ailments['冰封']);const partial=make(row(1122));partial.fighters[1].stages.def=-6;turn(partial);assert.equal(partial.fighters[1].stages.def,-6);assert.equal(partial.fighters[1].ailments['冰封'],undefined);
 for(const frozen of[false,true])for(const blocked of[false,true]){const s=make(row(993));if(frozen)s.fighters[1].ailments['冰封']=3;if(blocked)timer(s,0,'禁强化');turn(s);assert.equal(s.fighters[0].stages.atk,blocked?0:frozen?2:1);assert.equal(s.fighters[0].stages.acc,blocked?0:frozen?2:1);}
});
test('4823/1684敌弱化锁2回合实际阻止星光里奥斯自清弱，第三回合恢复；1438有负级封属性无负级不封',()=>{
 const enemy=require('../research/BATCH-4816-REMAINING/4822/snapshot.json'),s=make({...row(1684),loadout:[38113,10001,29165,29166,38114],enemySource:enemy,enemyLoadout:[38110,20048,20050,29164,38111]});s.fighters[1].stages.def=-2;turn(s,38113,20050);assert.equal(s.fighters[1].effects['弱化不可解除反转'].end,2);turn(s,10001,38110);assert.equal(s.fighters[1].stages.def,-2);turn(s,10001,38110);assert.equal(s.fighters[1].stages.def,0);
 for(const weak of[false,true]){const a=make(row(1438));if(weak)a.fighters[1].stages.def=-1;turn(a);assert.equal(!!a.fighters[1].effects.statusBlock,weak);assert.equal(a.fighters[1].stages.atk,weak?0:1);}
});
test('4823/1821未击败所有槽PP2含当前技能与上限，击败无回复；58与843下两回合起并到期',()=>{
 for(const kill of[false,true]){const s=make({...row(1821),targetHp:kill?1:9000});for(const k of s.fighters[0].moves)if(k!==key(38114))s.fighters[0].pp[k]=1;turn(s);assert.equal(s.fighters[0].pp[key(38114)],kill?2:3);for(const k of s.fighters[0].moves)if(k!==key(38114))assert.equal(s.fighters[0].pp[k],kill?1:3);}
 for(const id of[58,843]){const r=row(id),s=make({...r,loadout:[r.move,10001,29165,r.move===29166?38113:29166,38114]});turn(s);const name=id===58?'必定暴击':'id984';assert.equal(s.fighters[0].effects[name].start,2);assert.equal(s.fighters[0].effects[name].end,3);turn(s,10001);if(id===843)assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);else assert.ok(s.turns.at(-1).events.some(e=>e.damage?.sourceSide===0&&e.text.includes('致命一击')));turn(s,10001);turn(s,10001);assert.equal(s.fighters[0].effects[name],undefined);}
});
test('4823全部17技能零PP拒绝、整招封锁只有基本PP成本没有附固与吸取',()=>{
 for(const m of source.moves){const z=make({move:m.id});z.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(z));const s=make({move:m.id});timer(s,0,'skillBlock');turn(s);assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1);assert.equal(s.fighters[1].hp,9000);assert.equal(sum(s,'fixed'),0);}
});
test('4823/1821真实技能来源受既有领域PP封锁，2014魂印相等分支回满PP独立于技能来源限制',()=>{
 const a=make(row(1821));a.fighters[1].soulState.bedPartnerPP=true;timer(a,1,'次元领域');turn(a);assert.equal(a.fighters[0].pp[key(38114)],2);
 const b=make({move:10001,soul:true});b.fighters[1].soulState.bedPartnerPP=true;timer(b,1,'次元领域');b.fighters[1].suitState.shield=300;for(const k of b.fighters[0].moves)b.fighters[0].pp[k]=1;turn(b);assert.equal(b.fighters[0].soulState.snow2014.delta,0);for(const k of b.fighters[0].moves)assert.equal(b.fighters[0].pp[k],b.moveDefinitions[k].pp);
});
test('4823/130实际男性女性无性三种已部署来源对手保留真实性别并分别判定固定附加',()=>{
 for(const id of[4766,4822,4763]){const enemy=require('../research/BATCH-'+(id===4822?'4816-REMAINING':'4676-NEXT50')+'/'+id+'/snapshot.json'),pure=enemy.moves.find(m=>!m.fifth&&!m.effectInstances.length&&m.kind!=='status'),regular=enemy.moves.filter(m=>!m.fifth&&m.id!==pure.id).slice(0,3),fifth=enemy.moves.find(m=>m.fifth),enemyLoadout=[pure.id,...regular.map(m=>m.id),fifth.id],s=make({...row(130),enemySource:enemy,enemyLoadout});assert.equal(s.fighters[1].gender,enemy.gender.id);turn(s,s.auditMoveId,pure.id);assert.equal(sum(s,'fixed'),enemy.gender.id===1?300:0);}
});
