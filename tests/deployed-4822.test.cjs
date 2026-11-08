'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4822/snapshot.json'),H=require('./helpers/remaining-battle.cjs')(source),{E,key,keys,make,turn,timer,sum}=H;
const row=id=>{for(const m of source.moves){const index=m.effectInstances.findIndex(x=>x.id===id);if(index>=0)return {move:m.id,index};}throw Error(id);};
test('4822真实2013首次登场易燃3回合、免异失败不补抽，魂印攻击命中附300及无异常回复300不受技能禁疗',()=>{
 const a=make({move:10008,soul:true});assert.equal(a.fighters[1].ailments['易燃'],3);turn(a);assert.equal(sum(a,'fixed'),300);
 const b=make({move:10008,soul:true,entryImmune:1,hp:1000});assert.equal(b.fighters[1].ailments['易燃'],undefined);assert.equal(b.fighters[1].counts.immune,0);timer(b,0,'技能禁疗');turn(b);assert.equal(sum(b,'fixed'),300);assert.equal(b.fighters[0].hp,1300);
 const c=make({move:20035,soul:true,entryImmune:1,hp:1000});turn(c);assert.equal(sum(c,'fixed'),0);assert.equal(c.fighters[0].hp,1000);
});
test('4822真实2013命中零红仍附固、整招无效没有附固或回血，战阶烧伤消正级受保护失败',()=>{
 const a=make({move:10008,soul:true});timer(a,1,'攻击伤害免疫');turn(a);assert.equal(sum(a),0);assert.equal(sum(a,'fixed'),300);
 const b=make({move:10008,soul:true,entryImmune:1,hp:1000});timer(b,0,'skillBlock');turn(b);assert.equal(sum(b,'fixed'),0);assert.equal(b.fighters[0].hp,1000);
 for(const protectedBoost of [false,true]){const s=make({move:10008,soul:true});s.fighters[1].ailments['烧伤']=3;s.fighters[1].stages.def=2;if(protectedBoost)timer(s,1,'幽蝶强化保护');turn(s);assert.equal(s.fighters[1].stages.def,protectedBoost?2:0);assert.equal(s.fighters[1].stages.atk,protectedBoost?1:0);}
});
test('4822真实2013易燃战阶末授2回合攻击减伤30%，移除易燃不刷新且到期恢复正常红伤',()=>{
 const a=make({move:10008,soul:true}),b=make({move:10008});turn(a,10008,10127);turn(b,10008,10127);assert.equal(a.fighters[0].effects['额外攻击减伤'].end,2);delete a.fighters[1].ailments['易燃'];turn(a,10008,10127);turn(b,10008,10127);assert.ok(Math.abs(sum(a,'attack',1)-sum(b,'attack',1)*.7)<=1);turn(a,10008,10127);turn(b,10008,10127);assert.equal(sum(a,'attack',1),sum(b,'attack',1));
});
test('4822全部17真实技能含魂印逐招加载配招初始化PP与完整原生实例顺序',()=>{
 for(const m of source.moves){const s=make({move:m.id,soul:true,hp:4000}),actual=s.moveDefinitions[key(m.id)],c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m);assert.equal(c.issue,'');assert.equal(s.fighters[0].soulId,2013);assert.equal(actual.wikiId,m.id);assert.equal(actual.name,m.name);assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));turn(s);assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1);if(m.kind!=='status'&&m.power>0)assert.ok(sum(s)>0);}
});
test('4822全部17技能基础64种子负命中等级MISS、先制行动PP与强制暴击',()=>assert.equal(require('./helpers/next50-base-probe.cjs').verify(H).length,17));
test('4822/1928吸正与无正时理论吸取，正级保护失败不误触发无正补偿；1589异常随机1槽PP清零',()=>{
 for(const boost of [false,true]){const s=make({...row(1928),hp:1000});if(boost)s.fighters[1].stages.def=2;turn(s);assert.equal(s.fighters[0].stages.def,boost?2:0);assert.equal(sum(s,'percent'),boost?0:3000);assert.equal(s.fighters[0].hp,boost?1000:4000);}
 const protectedBoost=make({...row(1928),hp:1000});protectedBoost.fighters[1].stages.def=2;timer(protectedBoost,1,'幽蝶强化保护');turn(protectedBoost);assert.equal(protectedBoost.fighters[1].stages.def,2);assert.equal(sum(protectedBoost,'percent'),0);
 const slots=new Set;for(let seed=1;seed<=32;seed++){const s=make({...row(1589),seed:Math.imul(seed,0x9e3779b1)>>>0});s.fighters[1].ailments['烧伤']=3;turn(s);const zero=s.fighters[1].moves.filter(k=>s.fighters[1].pp[k]===0);assert.equal(zero.length,1);slots.add(zero[0]);}assert.equal(slots.size,5);const no=make(row(1589));turn(no);assert.equal(no.fighters[1].moves.some(k=>no.fighters[1].pp[k]===0),false);
});
test('4822/1424真实50%焚烬有正级翻倍至100%，1058烧伤免疫失败封攻，65只翻火系威力',()=>{
 const chance=new Set;for(let seed=1;seed<=32;seed++)for(const boost of [false,true]){const s=make({...row(1424),seed:Math.imul(seed,0x9e3779b1)>>>0});if(boost)s.fighters[0].stages.def=1;turn(s);const applied=!!s.fighters[1].ailments['焚烬'];if(boost)assert.equal(applied,true);else chance.add(applied);}assert.deepEqual(chance,new Set([true,false]));
 const a=make(row(1058));timer(a,1,'免异常');turn(a,29163,10127);assert.equal(sum(a,'attack',1),0);assert.equal(a.fighters[1].ailments['烧伤'],undefined);const b=make(row(1058));turn(b,29163,10127);assert.ok(b.fighters[1].ailments['烧伤']);assert.ok(sum(b,'attack',1)>0);assert.equal(b.fighters[1].effects.attackBlock,undefined);
 const loadout=[29164,10008,10007,20035,38111],out=[];for(const enabled of[false,true]){const s=make({move:29164,index:enabled?2:-1,loadout});turn(s);turn(s,10007);out.push(sum(s));}assert.ok(out[1]>out[0]*1.8);const c=make({move:29164,index:2,loadout}),d=make({move:29164,index:-1,loadout});turn(c);turn(d);turn(c,10008);turn(d,10008);assert.equal(sum(c),sum(d));
});
test('4822/686烧伤前提下授下2回合必失，非烧伤失败，必中和回合到期按公共命中规则',()=>{
 for(const burned of [false,true]){const s=make(row(686));if(burned)s.fighters[1].ailments['烧伤']=3;turn(s);assert.equal(!!s.fighters[1].effects['攻击必失'],burned);if(burned){assert.equal(s.fighters[1].effects['攻击必失'].start,2);assert.equal(s.fighters[1].effects['攻击必失'].end,3);delete s.fighters[1].effects['攻击必中'];turn(s,38110,10127);assert.equal(sum(s,'attack',1),0);}}
});
test('4822/2271被消强后按真实13易燃，免异失败授下次必暴，未消强不触发',()=>{
 const opts={...row(2271),enemySource:source,enemyLoadout:[38109,20048,20050,29164,38111]};for(const immune of[false,true]){const s=make(opts);timer(s,0,'免异常');turn(s,29163,20048);s.fighters[0].stages.def=2;if(immune)timer(s,1,'免异常');turn(s,29163,38109);assert.equal(s.fighters[0].stages.def,0);assert.equal(!!s.fighters[1].ailments['易燃'],!immune);assert.equal((s.fighters[0].soulState.opheliaCritSources2271??[]).reduce((n,e)=>n+e.count,0),immune?1:0);if(immune){s.fighters[0].ailments={};turn(s,38110,20048);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.sourceSide===0&&e.text.includes('致命一击')));assert.equal((s.fighters[0].soulState.opheliaCritSources2271??[]).reduce((n,e)=>n+e.count,0),0);}}const a=make(opts);timer(a,0,'免异常');turn(a,29163,20048);turn(a,29163,38109);assert.equal(a.fighters[1].ailments['易燃'],undefined);assert.equal(a.fighters[0].counts.nextCrit??0,0);
});
test('4822/1323同版既有确认按完整红伤回复50%，暴击按实际回血附粉；禁疗为0与保1不截基数',()=>{
 for(const critical of[false,true]){const s=make({...row(1323),hp:1000});if(critical)timer(s,0,'必定暴击');turn(s);const healed=Math.floor(sum(s)*.5);assert.equal(s.fighters[0].hp,1000+healed);assert.equal(sum(s,'percent'),critical?healed:0);}
 const s=make({...row(1323),hp:1000});timer(s,0,'技能禁疗');timer(s,0,'必定暴击');turn(s);assert.equal(s.fighters[0].hp,1000);assert.equal(sum(s,'percent'),0);
 const overkill=make({...row(1323),hp:1000,targetHp:200,aStats:{spa:2000}});timer(overkill,1,'致命保留',{hp:1});turn(overkill);const full=sum(overkill);assert.ok(full>200);assert.equal(overkill.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).hpLoss,199);assert.equal(overkill.fighters[0].hp,1000+Math.floor(full/2));
 const lethal=make({...row(1323),hp:1000,targetHp:200,aStats:{spa:2000}});turn(lethal);assert.equal(lethal.fighters[1].hp,0);assert.ok(sum(lethal)>200);assert.equal(lethal.fighters[0].hp,1000+Math.floor(sum(lethal)/2));
});
test('4822/686真实必中第五不受必失、第三回合结束后普通攻击恢复命中',()=>{
 const loadout=[38110,10008,29164,29163,38111],a=make({...row(686),loadout});a.fighters[1].ailments['烧伤']=3;turn(a);turn(a,10008,37911);assert.ok(sum(a,'attack',1)>0);
 const s=make({...row(686),loadout});s.fighters[1].ailments['烧伤']=3;turn(s);delete s.fighters[1].effects['攻击必中'];turn(s,10008,10127);assert.equal(sum(s,'attack',1),0);turn(s,10008,10127);assert.equal(sum(s,'attack',1),0);turn(s,10008,10127);assert.ok(sum(s,'attack',1)>0);assert.equal(s.fighters[1].effects['攻击必失'],undefined);
});
test('4822/1700清弱成功授1次免异同源刷新、异源保留，零负级与不可解除失败不授予',()=>{
 const s=make(row(1700));s.fighters[0].counts.immune=2;s.fighters[0].stages.def=-2;turn(s);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].counts.immune,3);s.fighters[0].stages.def=-1;turn(s);assert.equal(s.fighters[0].counts.immune,3);assert.equal(s.fighters[0].stages.def,0);
 const a=make(row(1700));turn(a);assert.equal(a.fighters[0].counts.immune??0,0);const b=make(row(1700));b.fighters[0].stages.def=-2;timer(b,0,'弱化不可解除反转');turn(b);assert.equal(b.fighters[0].stages.def,-2);assert.equal(b.fighters[0].counts.immune??0,0);
});
test('4822/1833对手实际用攻后下轮红伤0且命中效果封锁，属性技能仍执行并停止续期',()=>{
 const s=make({...row(1833),enemySource:source,enemyLoadout:[10007,20035,20048,29164,38111]});turn(s,29163,10007);assert.ok(sum(s,'attack',1)>0);assert.equal(s.fighters[1].effects['无法造成攻击伤害'].start,2);turn(s,29163,38111);assert.equal(sum(s,'attack',1),0);assert.ok(s.fighters[0].effects['对手攻击触发封攻']);turn(s,29163,20035);assert.equal(s.fighters[0].stages.def,-1);turn(s,29163,38111);assert.ok(sum(s,'attack',1)>0);
});
test('4822/1020无敌正级强化2有正级强化1、717低体理论吸取当前即触发、58与843明确下轮起',()=>{
 for(const boosted of[false,true]){const s=make(row(1020));if(boosted)s.fighters[1].stages.def=1;turn(s);assert.equal(s.fighters[0].stages.atk,boosted?1:2);assert.equal(s.fighters[0].stages.spd,boosted?1:2);}const a=make({...row(717),hp:1000});turn(a);assert.equal(sum(a,'percent'),3000);assert.equal(a.fighters[0].hp,7000);for(const id of[58,843]){const s=make(row(id));turn(s);const e=s.fighters[0].effects[id===58?'必定暴击':'id984'];assert.equal(e.start,2);assert.equal(e.end,3);if(id===843)assert.equal(e.amount,2);}
});
test('4822/2033未击败减全部PP2与PP保护失败，1021无敌正级红伤翻倍，889消回合成功焚烬',()=>{
 for(const protectedPP of[false,true]){const s=make(row(2033));if(protectedPP)timer(s,1,'PP保护');const before={...s.fighters[1].pp};turn(s);for(const k of s.fighters[1].moves)assert.equal(s.fighters[1].pp[k],before[k]-(protectedPP?0:2)-(k===key(20117)?1:0));}
 const values=[];for(const boosted of[false,true]){const s=make(row(1021));if(boosted)s.fighters[1].stages.atk=1;turn(s);values.push(sum(s));}assert.ok(values[0]>values[1]*1.8);
 const a=make(row(889));turn(a);assert.ok(a.fighters[1].ailments['焚烬']);assert.equal(a.fighters[1].effects['攻击必中'],undefined);const b=make(row(889));b.fighters[1].effects={};turn(b);assert.equal(b.fighters[1].ailments['焚烬'],undefined);
});
test('4822真实5弱化负6边界、48免异时限和12与15概率成功失败，881负级排序先制3',()=>{
 const a=make({move:20035});a.fighters[1].stages.def=-6;turn(a);assert.equal(a.fighters[1].stages.def,-6);const b=make({move:20051});turn(b);assert.equal(b.fighters[1].stages.spa,-2);const im=make({move:20050});turn(im);assert.equal(im.fighters[0].effects['免异常'].end,5);const outcomes=new Map([[12,new Set],[15,new Set]]);for(let seed=1;seed<=64;seed++)for(const [move,id,name]of [[10007,12,'烧伤'],[10096,15,'害怕']]){const s=make({move,seed:Math.imul(seed,0x9e3779b1)>>>0});turn(s);outcomes.get(id).add(!!s.fighters[1].ailments[name]);}assert.deepEqual(outcomes.get(12),new Set([false,true]));assert.deepEqual(outcomes.get(15),new Set([false,true]));const p=make(row(881));p.fighters[0].stages.def=-1;turn(p);assert.equal(p.fighters[0].soulState.resolvedPriority.value,3);
});
test('4822全部17技能零PP拒绝、整招失效扣PP且没有魂印附固或技能附伤',()=>{
 for(const m of source.moves){const z=make({move:m.id,soul:true});z.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(z));const s=make({move:m.id,soul:true});timer(s,0,'skillBlock');turn(s);assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1);assert.equal(s.fighters[1].hp,9000);assert.equal(sum(s,'fixed'),0);assert.equal(sum(s,'percent'),0);}
});
test('4822真实因子只解锁同一第五及魂印，原版唯一版本真实hash与枚举参数校验',()=>{
 const report=require('../research/BATCH-4816-REMAINING/4822/source.json'),factor=report.records.find(r=>r.resourceKey==='factor/2400522').data;assert.equal(factor.skill.id,38111);assert.equal(factor.soulmark.id,2013);assert.equal(source.souls.length,1);assert.equal(E.WIKI.versionSnapshots(source).length,1);assert.equal(source.souls[0].hash,'40e20acf');const s=make({soul:true});assert.equal(s.fighters[0].soulId,2013);for(const id of[1424,1058,65]){const r=row(id),m=structuredClone(source.moves.find(m=>m.id===r.move));m.effectInstances[r.index].args[m.effectInstances[r.index].args.length-1]=99;assert.notEqual(E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m).issue,'');}
});
test('4822真实2013固伤免疫为0仍按无异常回复300，满体上限与普通禁疗不影响魂印来源规则',()=>{
 for(const hp of[8999,9000]){const s=make({move:10008,soul:true,entryImmune:1,hp});timer(s,1,'固定百分比免疫');timer(s,0,'技能禁疗');turn(s);assert.equal(sum(s,'fixed'),0);assert.equal(s.fighters[0].hp,9000);}
});
test('4822/1424强化翻倍的实际概率100不被50%威慑误挡，未强化50仍被挡',()=>{
 for(const boosted of[false,true]){const s=make(row(1424));s.fighters[0].soulState.bright2009=99;if(boosted)s.fighters[0].stages.def=1;turn(s);assert.equal(!!s.fighters[1].ailments['焚烬'],boosted);}
});
test('4822真实48两种时长均阻止鬼火且不消耗并存次数免异，100%烧伤与免异失败分别执行',()=>{
 const enemyLoadout=[20048,20035,20050,29164,38111];for(const move of[20050,29163]){const s=make({move,enemySource:source,enemyLoadout});s.fighters[0].counts.immune=2;turn(s,move,20048);assert.equal(s.fighters[0].ailments['烧伤'],undefined);assert.equal(s.fighters[0].counts.immune,2);assert.equal(s.fighters[0].effects['免异常'].end,move===20050?5:4);}
 for(const immune of[false,true]){const s=make({move:20048});if(immune)s.fighters[1].counts.immune=1;turn(s);assert.equal(!!s.fighters[1].ailments['烧伤'],!immune);if(immune)assert.equal(s.fighters[1].counts.immune,0);}
});
