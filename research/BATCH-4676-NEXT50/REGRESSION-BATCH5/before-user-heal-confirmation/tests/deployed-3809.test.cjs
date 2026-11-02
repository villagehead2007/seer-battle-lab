'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,make,turn,pick,timer}=require('./helpers/3809-battle.cjs');
const e=id=>pick(id)[0],simple={moveId:10611,index:null};
test('3809 4与5各实例概率成功失败、六级边界与免弱禁强',()=>{
 for(const entry of [...pick(4),...pick(5)]){const [stat,chance,delta]=entry.params,side=entry.id===4?0:1,k=keys[stat];let yes=false,no=false;for(let seed=0;seed<100;seed++){const s=make(entry,{seed}),o=turn(s);if(o.fighters[side].stages[k]===delta)yes=true;else no=true;s.fighters[side].stages[k]=delta>0?6:-6;assert.equal(turn(s).fighters[side].stages[k],delta>0?6:-6);timer(s,side,delta>0?'禁强化':'免弱');assert.equal(turn(s).fighters[side].stages[k],delta>0?6:-6);}assert.ok(yes);if(chance<100)assert.ok(no);}
});
test('3809 11中毒14冻伤概率、独立默认2或3回合、免疫与周期损血',()=>{
 for(const [id,status]of [[11,'中毒'],[14,'冻伤']]){let yes=false,no=false;for(let seed=0;seed<100;seed++){const s=make(e(id),{seed}),o=turn(s);if(o.fighters[1].ailments[status]){yes=true;assert.ok([2,3].includes(o.fighters[1].ailments[status]));assert.ok(9000-o.fighters[1].hp>o.fighters[0].lastAttackDamage);timer(s,1,'免异常');assert.equal(turn(s).fighters[1].ailments[status],undefined);}else no=true;}assert.ok(yes&&no);}
});
test('3809 52先手封招后手不封、884下一次无效消费与191反弹四回合',()=>{
 for(const slow of [false,true]){const s=make(e(52),{aStats:{spe:slow?1:500}}),o=turn(s,undefined,900040);assert.equal(o.fighters[0].hp===9000,!slow);}
 const s=make(e(884)),o=turn(s,undefined,900040);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].counts.nextSkillInvalid??0,0);assert.ok(turn(o,900031,900040).fighters[0].hp<9000);
 let reflected=false;for(let seed=0;seed<100&&!reflected;seed++){const r=make(e(191),{opponentMove:10621,seed}),o=turn(r,undefined,900042);assert.equal(o.fighters[0].effects.reflect.end,4);assert.equal(o.fighters[0].ailments['中毒'],undefined);if(o.fighters[1].ailments['中毒'])reflected=true;}assert.ok(reflected);
});
test('3809 925满体威力与2半血严格阈值，893满体强化及禁强化',()=>{
 for(const id of [925,2]){const s=make(e(id)),normal=turn(s);if(id===925){s.fighters[0].hp=8999;assert.ok(turn(s).fighters[0].lastAttackDamage<normal.fighters[0].lastAttackDamage);}else{s.fighters[1].hp=4500;const equal=turn(s);s.fighters[1].hp=4499;assert.ok(turn(s).fighters[0].lastAttackDamage>equal.fighters[0].lastAttackDamage);}}
 for(const hp of [8999,9000]){const s=make(e(893),{hp}),o=turn(s);for(const k of keys)assert.equal(o.fighters[0].stages[k],hp===9000?2:1);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);}
});
test('3809 1232反弱并反馈原幅度、空弱不触发及解除锁定',()=>{
 const s=make(e(1232));s.fighters[0].stages.atk=-3;const o=turn(s);assert.equal(o.fighters[0].stages.atk,3);assert.equal(o.fighters[1].stages.atk,-3);assert.equal(turn(make(e(1232))).fighters[1].stages.atk,0);timer(s,0,'弱化不可解除反转');assert.equal(turn(s).fighters[0].stages.atk,-3);delete s.fighters[0].effects['弱化不可解除反转'];timer(s,1,'免弱');assert.equal(turn(s).fighters[1].stages.atk,0);
});
test('3809 731暴击后只保留下回合其他攻击必暴，非暴击和到期无保留',()=>{
 const s=make(e(731));timer(s,0,'必定暴击',{},1,1);const o=turn(s);assert.ok(o.fighters[0].counts.nextCrit>0);const other=turn(o,900030);assert.ok(other.fighters[0].lastAttackDamage>100);const same=turn(o);assert.ok(same.fighters[0].lastAttackDamage<other.fighters[0].lastAttackDamage*2);const plain=turn(make(e(731)));assert.equal(plain.fighters[0].counts.nextCrit??0,0);o.round=3;assert.equal(turn(o,900031).fighters[0].counts.nextCrit??0,0);
});
test('3809 1065低体双倍回复和等量粉伤、半血边界、满血禁疗及四回合',()=>{
 for(const hp of [1000,4500,8990,9000]){const s=make(e(1065),{hp}),o=turn(s),n=Math.min(9000-hp,hp<4500?6000:3000);assert.equal(o.fighters[0].hp,hp+n);assert.equal(o.fighters[1].hp,9000-n);assert.equal(o.fighters[0].effects['用招低体双倍回血粉伤'].end,4);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[1].hp,9000);}
});
test('3809 697无视限伤699无视免攻但失误仍不伤、760微弱提升至普通',()=>{
 for(const [id,effect]of [[697,'攻击伤害上限'],[699,'攻击伤害免疫']]){const s=make(e(id));timer(s,1,effect,{amount:1});assert.ok(turn(s).fighters[0].lastAttackDamage>1);}
 const s=make(e(760));s.fighters[1].type='圣灵';const o=turn(s);const b=make(e(760),{omit:true});b.fighters[1].type='圣灵';assert.ok(o.fighters[0].lastAttackDamage>=turn(b).fighters[0].lastAttackDamage);
});
test('3809 942清回合才按上限吸取、免断失败与技能禁疗',()=>{
 const s=make(e(942),{hp:1000});timer(s,1,'免弱');assert.equal(turn(s).fighters[0].hp,4000);assert.equal(turn(make(e(942),{hp:1000})).fighters[0].hp,1000);timer(s,1,'protect');assert.equal(turn(s).fighters[0].hp,1000);delete s.fighters[1].effects.protect;timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);
});
test('3809 1019高于300封属与1066低于300先后手固伤及免粉',()=>{
 for(const id of [1019,1066]){let high=false,low=false;for(const atk of [50,180,600,1200]){const s=make(e(id),{aStats:{atk}}),o=turn(s),d=o.fighters[0].lastAttackDamage;if(d>300)high=true;if(d<300)low=true;if(id===1019)assert.equal(!!o.fighters[1].effects.statusBlock,d>300);else assert.equal(9000-o.fighters[1].hp-d,d<300?450:0);}assert.ok(high&&low);}
 const s=make(e(1066),{aStats:{spe:1}}),o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,300);
});
test('3809 龙系惩罚实际行动与伤害、用属免弱和粉伤精确减免',()=>{
 let proven=false;for(let seed=0;seed<80&&!proven;seed++){const s=make(simple,{soul:1084,seed,aStats:{spe:500},bStats:{spe:600}}),o=turn(s,undefined,900040);if(o.fighters[0].soulState.dragonSubmission){assert.equal(o.turns.at(-1).first,0);const plain=make(simple,{soul:1084,seed,aStats:{spe:500},bStats:{spe:600}});let comparison;for(let otherSeed=0;otherSeed<80;otherSeed++){plain.rng=otherSeed;const n=turn(plain,undefined,900040);if(!n.fighters[0].soulState.dragonSubmission){comparison=n;break;}}assert.ok(comparison);assert.ok(o.fighters[1].lastAttackDamage<comparison.fighters[1].lastAttackDamage);proven=true;}}assert.ok(proven);
 const s=make(e(1449),{targetHp:6000,opponentMove:26596,opponentEffectId:1065});s.moveDefinitions[key(s.auditMoveId)].power=0;timer(s,1,'御之龙魂');assert.equal(turn(s,undefined,900042).fighters[1].hp,5250);
 let weakened=false;for(let seed=0;seed<100&&!weakened;seed++){const s=make(simple,{soul:1084,seed,opponentMove:10612});s.moveDefinitions[key(900042)].kind='status';s.moveDefinitions[key(900042)].power=0;const o=turn(s,undefined,900042);assert.equal(o.fighters[0].stages.def,0);s.fighters[0].soulId=null;const b=turn(s,undefined,900042);if(b.fighters[0].stages.def<0)weakened=true;}assert.ok(weakened);
});
test('3809 1220消强成功才授予下两回合必暴，空强化和保护失败',()=>{
 const s=make(e(1220));s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.deepEqual([o.fighters[0].effects['必定暴击'].start,o.fighters[0].effects['必定暴击'].end],[2,3]);assert.equal(turn(make(e(1220))).fighters[0].effects['必定暴击'],undefined);timer(s,1,'幽蝶强化保护');assert.equal(turn(s).fighters[1].stages.atk,2);assert.equal(turn(s).fighters[0].effects['必定暴击'],undefined);
});
test('3809 1371未满血独立按对手上限吸取，满血不吸、免粉与禁疗各自结算',()=>{
 const s=make(e(1371),{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,3250);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,2250);
 const full=turn(make(e(1371)));assert.equal(9000-full.fighters[1].hp,full.fighters[0].lastAttackDamage);
 const immune=make(e(1371),{hp:1000});immune.fighters[1].soulId=622;assert.equal(turn(immune).fighters[0].hp,3250);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);
 const low=make(e(1371),{hp:1000,targetHp:200});const l=turn(low);assert.equal(l.fighters[1].hp,0);assert.equal(l.fighters[0].hp,3250);
});
test('3809 1449按缺血截断回复转百分比伤害、满血零伤及普通禁疗优先',()=>{
 for(const hp of [1000,8990,9000]){const s=make(e(1449),{targetHp:hp,opponentMove:26596,opponentEffectId:1065});s.moveDefinitions[key(s.auditMoveId)].power=0;const o=turn(s,undefined,900042),wanted=Math.min(9000-hp,hp<4500?6000:3000);assert.equal(o.fighters[1].hp,Math.max(0,hp-Math.floor(wanted/3)));assert.equal(o.fighters[1].effects['技能回复转伤害'].end,2);}
 const s=make(e(1449),{targetHp:1000,opponentMove:26596,opponentEffectId:1065});s.moveDefinitions[key(s.auditMoveId)].power=0;timer(s,1,'技能禁疗');const o=turn(s,undefined,900042);assert.equal(o.fighters[1].hp,1000);delete o.fighters[1].effects['技能禁疗'];o.round=3;const n=turn(o,900031,900042);assert.equal(n.fighters[1].hp,7000);
});
test('3809 1452战龙魂下两回合全技能先制必中，随机增伤50至100与到期',()=>{
 let s=make(e(1452),{aStats:{spe:1},hit:false}),o=turn(s);assert.deepEqual([o.fighters[0].effects['战之龙魂'].start,o.fighters[0].effects['战之龙魂'].end],[2,3]);o.fighters[0].stages.acc=-6;const n=turn(o,900030);assert.equal(n.turns.at(-1).first,0);assert.ok(n.fighters[0].lastAttackDamage>0);assert.equal(turn(o,900031).turns.at(-1).first,0);o.round=4;assert.equal(turn(o,900031).turns.at(-1).first,1);
 for(let seed=0;seed<30;seed++){const s=make(simple,{seed}),b=turn(s);timer(s,0,'战之龙魂');const n=turn(s);assert.ok(n.fighters[0].lastAttackDamage>=b.fighters[0].lastAttackDamage*1.4);assert.ok(n.fighters[0].lastAttackDamage<=b.fighters[0].lastAttackDamage*2.3);}
});
test('3809 1453御龙魂粉伤减25%且命中清一项正PP，MISS不清及并存',()=>{
 const s=make(e(1453)),o=turn(s);assert.deepEqual([o.fighters[0].effects['御之龙魂'].start,o.fighters[0].effects['御之龙魂'].end],[2,3]);timer(o,0,'战之龙魂',{},2,3);const n=turn(o,900030);assert.equal(Object.values(n.fighters[1].pp).filter(n=>n===0).length,1);assert.ok(n.fighters[0].effects['御之龙魂']);assert.ok(n.fighters[0].effects['战之龙魂']);
 let miss=false;for(let seed=0;seed<80&&!miss;seed++){const s=make(simple,{seed,hit:false});s.fighters[0].stages.acc=-6;timer(s,0,'御之龙魂');const o=turn(s);if(o.turns.at(-1).events.some(e=>JSON.stringify(e).includes('未命中'))){miss=true;assert.equal(Object.values(o.fighters[1].pp).filter(n=>n===0).length,0);}}assert.ok(miss);
 const hit=make(simple);timer(hit,0,'御之龙魂');timer(hit,1,'攻击伤害免疫');assert.equal(Object.values(turn(hit).fighters[1].pp).filter(n=>n===0).length,1);
});
test('3809 魂印1084体力档位回合初锁定，半血以下减伤0，下一回合重算',()=>{
 for(const hp of [9000,8101,8100,4500,4499,1]){const s=make(simple,{soul:1084,hp});s.fighters[1].type='普通';const o=turn(s);const tiers=Math.floor((9000-hp)/900);assert.equal(o.fighters[0].soulState.hamoBonus,.5+tiers*.1);assert.equal(o.fighters[0].soulState.hamoReduction,Math.max(0,.5-tiers*.1));}
 const s=make(e(1371),{soul:1084,hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,3250);assert.equal(o.fighters[0].soulState.hamoBonus,1.3);const n=turn(o,900031);assert.equal(n.fighters[0].soulState.hamoBonus,1.1);
});
test('3809 魂印1084龙系50%先制惩罚与减伤，非龙不受，属性用招免弱免异常',()=>{
 let yes=false,no=false;for(let seed=0;seed<50;seed++){const s=make(simple,{soul:1084,seed}),o=turn(s);if(o.fighters[0].soulState.dragonSubmission){yes=true;assert.equal(o.fighters[0].soulState.dragonSubmission,true);}else no=true;}assert.ok(yes&&no);
 const s=make(simple,{soul:1084});s.fighters[1].type='普通';assert.equal(turn(s).fighters[0].soulState.dragonSubmission,false);
 const weak=make(simple,{soul:1084,opponentMove:20268});const o=turn(weak,undefined,900042);assert.equal(o.fighters[0].effects['免弱'],undefined);assert.equal(o.fighters[0].effects['免异常'],undefined);
});
test('3809 魂印1084对手使用攻击战阶150至300固伤、控制未行动无反应与御减粉',()=>{
 const seen=[];for(let seed=0;seed<40;seed++){const s=make(simple,{soul:1084,seed});s.fighters[1].type='普通';const o=turn(s,undefined,900040),extra=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(extra>=150&&extra<=300);seen.push(extra);timer(s,1,'御之龙魂');const n=turn(s,undefined,900040);const reduced=9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage;assert.ok(reduced>=112&&reduced<=225);}assert.ok(new Set(seen).size>1);
 const s=make(simple,{soul:1084});s.fighters[1].ailments['疲惫']=2;const o=turn(s,undefined,900040);assert.equal(9000-o.fighters[1].hp,o.fighters[0].lastAttackDamage);
});
test('3809 基础17招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3809 基础17招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns.at(-1).first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns.at(-1).events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});




{const test=require('node:test').test,assert=require('node:assert/strict');test('3809 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3809);assert.equal(o.fighters[0].hp,8960);});}
