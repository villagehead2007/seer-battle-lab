'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3467-battle.cjs');
const e=id=>pick(id)[0];
test('3467 全部17招基础PP伤害、MISS与控制封招',()=>{
 for(const m of source.moves){const q=make({moveId:m.id,index:null},{omit:true}),n=turn(q);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);q.fighters[0].ailments['疲惫']=2;assert.equal(turn(q).fighters[0].pp[key(m.id)],m.pp);q.fighters[0].ailments={};timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(!m.alwaysHit){const p=make({moveId:m.id,index:null},{omit:true,hit:false});p.moveDefinitions[key(m.id)].accuracy=0;assert.equal(turn(p).fighters[1].hp,9000);}}
});
test('3467 4和5所有能力实例、免疫和六级边界',()=>{
 for(const id of [4,5])for(const x of pick(id)){const q=make(x),side=id===4?0:1,k=keys[x.params[0]];assert.equal(turn(q).fighters[side].stages[k],x.params[2]);timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[k],0);delete q.fighters[side].effects[id===4?'禁强化':'免弱'];q.fighters[side].stages[k]=id===4?6:-6;assert.equal(turn(q).fighters[side].stages[k],id===4?6:-6);}
});
test('3467 15真实5%害怕、默认2或3回合及免疫',()=>{
 let yes=0,no=0;const ends=new Set();for(let seed=0;seed<200;seed++){const q=make(e(15),{seed}),n=turn(q);if(n.fighters[1].ailments['害怕']){yes++;ends.add(n.fighters[1].ailments['害怕']);}else no++;timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);}assert.ok(yes&&no);assert.deepEqual([...ends].sort(),[2,3]);
});
test('3467 96烧伤增威与777清强成功下回合必先',()=>{
 const q=make(e(96)),base=turn(q).fighters[0].lastAttackDamage;q.fighters[1].ailments['烧伤']=3;assert.ok(turn(q).fighters[0].lastAttackDamage>base*1.8);q.fighters[1].ailments['烧伤']=0;assert.equal(turn(q).fighters[0].lastAttackDamage,base);
 const p=make(e(777),{aStats:{spe:1}});p.fighters[1].stages.atk=2;const n=turn(p);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[0].effects['所有技能必定先手'].start,2);assert.equal(n.fighters[0].effects['所有技能必定先手'].end,2);assert.equal(turn(n,900030,900040).turns[1].first,0);assert.equal(turn(make(e(777))).fighters[0].effects['所有技能必定先手'],undefined);timer(p,1,'幽蝶强化保护');assert.equal(turn(p).fighters[0].effects['所有技能必定先手'],undefined);
});
test('3467 781清回合封属成功失败与679技能禁疗',()=>{
 const q=make(e(781));timer(q,1,'免弱');assert.equal(turn(q).fighters[1].effects.statusBlock.end,2);assert.equal(turn(make(e(781))).fighters[1].effects.statusBlock,undefined);timer(q,1,'protect');assert.equal(turn(q).fighters[1].effects.statusBlock,undefined);
 const p=make(e(679),{targetHp:1000}),m=require('../local-species.cjs').species(3875),raw=m.moves.find(x=>x.effectIds.includes(43));p.moveDefinitions[key(900041)].operations=E.WIKI.compile(raw,m).operations;p.moveDefinitions[key(900041)].kind='status';const n=turn(p);assert.equal(n.fighters[1].hp,1000-n.fighters[0].lastAttackDamage);n.fighters[1].effects['无法通过自身技能恢复体力'].end=1;assert.ok(turn(n,900031).fighters[1].hp>1000);
});
test('3467 32五回合暴击率增加与697无视限伤保留免攻',()=>{
 const n=turn(make(e(32)));assert.equal(n.fighters[0].effects['要害概率增加'].chance,1/16);assert.equal(n.fighters[0].effects['要害概率增加'].end,5);
 const q=make(e(697));timer(q,1,'攻击伤害上限',{amount:1});assert.ok(turn(q).fighters[0].lastAttackDamage>1);q.fighters[1].counts.attackNullify=1;assert.equal(turn(q).fighters[0].lastAttackDamage,0);
});
test('3467 191五回合反弹异常和570一次攻击免疫消费',()=>{
 const q=make(e(191));q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q);assert.equal(n.fighters[0].ailments['害怕'],undefined);assert.ok(n.fighters[1].ailments['害怕']);assert.equal(n.fighters[0].effects.reflect.end,5);
 const p=make(e(570)),z=turn(p,undefined,900040);assert.equal(z.fighters[0].hp,9000);assert.equal(z.fighters[0].counts.attackNullify,0);assert.ok(turn(z,900031,900040).fighters[0].hp<9000);
});
test('3467 683随机200至400、固定伤害抗性',()=>{
 const seen=new Set();for(let seed=0;seed<60;seed++){const q=make(e(683),{seed}),n=turn(q),extra=9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage;assert.ok(extra>=200&&extra<=400);seen.add(extra);q.fighters[1].build.resistance.fixed=100;const z=turn(q);assert.equal(9000-z.fighters[1].hp,z.fighters[0].lastAttackDamage);}assert.ok(seen.size>10);
});
test('3467 1001异常强化翻倍与1065低体回复粉伤边界',()=>{
 const q=make(e(1001));assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===1));q.fighters[1].ailments['烧伤']=3;assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===2));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===0));
 for(const hp of [4499,4500,9000]){const p=make(e(1065),{hp}),n=turn(p),gain=Math.min(9000-hp,hp<4500?6000:3000);assert.equal(n.fighters[0].hp,hp+gain);assert.equal(n.fighters[1].hp,9000-gain);timer(p,0,'技能禁疗');assert.equal(turn(p).fighters[1].hp,9000);}
});
test('3467 843先制期限和1221反弱免疫次数',()=>{
 const n=turn(make(e(843)));assert.equal(n.fighters[0].effects.id984.start,2);assert.equal(n.fighters[0].effects.id984.end,3);assert.equal(n.fighters[0].effects.id984.amount,2);
 const q=make(e(1221));q.fighters[0].stages.atk=-2;const z=turn(q);assert.equal(z.fighters[0].stages.atk,2);assert.equal(z.fighters[0].counts.immune,1);assert.equal(turn(make(e(1221))).fighters[0].counts.immune,undefined);timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].counts.immune,undefined);
});
test('3467 760不微弱、1048异常75%增伤与1257无异常吸取',()=>{
 const q=make(e(760));q.fighters[1].type='火';q.typeChart.rows['火']['火']=.5;const p=structuredClone(q);p.moveDefinitions[key(p.auditMoveId)].operations=[];assert.ok(turn(q).fighters[0].lastAttackDamage>turn(p).fighters[0].lastAttackDamage*1.8);
 const z=make(e(1048)),base=turn(z).fighters[0].lastAttackDamage;z.fighters[1].ailments['烧伤']=3;assert.ok(Math.abs(turn(z).fighters[0].lastAttackDamage-base*1.75)<=2);
 const a=make(e(1257),{hp:1000});let n=turn(a);assert.equal(n.fighters[0].hp,4000);a.fighters[1].ailments['烧伤']=3;assert.equal(turn(a).fighters[0].hp,1000);a.fighters[1].ailments={};timer(a,0,'技能禁疗');assert.equal(turn(a).fighters[0].hp,1000);
});

test('3467 111等级附加固伤、等级边界、抗性与MISS',()=>{
 for(const level of [1,2,100]){const q=make(e(111));q.fighters[0].build.level=level;const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,99+level);q.fighters[1].build.resistance.fixed=100;const z=turn(q);assert.equal(9000-z.fighters[1].hp,z.fighters[0].lastAttackDamage);}const q=make(e(111),{hit:false});q.moveDefinitions[key(q.auditMoveId)].accuracy=0;assert.equal(turn(q).fighters[1].hp,9000);
});

test('3467 1255焚烬成功失败粉伤、四回合期限与枚举拒绝',()=>{
 let yes=0,no=0;for(let seed=0;seed<60;seed++){const q=make(e(1255),{seed}),n=turn(q);assert.equal(n.fighters[0].effects['用招失明或粉伤'].end,4);if(n.fighters[1].ailments['焚烬'])yes++;else{no++;assert.equal(n.fighters[1].hp,6000);}timer(q,1,'免异常');assert.equal(turn(q).fighters[1].hp,6000);q.fighters[1].build.resistance.percent=100;assert.equal(turn(q).fighters[1].hp,9000);}assert.ok(yes&&no);
 const rule=E.WIKI.effectsEngine.registry[1255];for(const x of [0,20,22])assert.doesNotThrow(()=>rule.validate([4,70,x,3]));for(const x of [21,23,-1])assert.throws(()=>rule.validate([4,70,x,3]));
});

test('3467 1256低伤焚烬、免疫补偿一次双伤、300边界与枚举',()=>{
 const q=make(e(1256)),n=turn(q);assert.ok(n.fighters[1].ailments['焚烬']);assert.equal(n.fighters[0].counts.nextAttackBoost,undefined);timer(q,1,'免异常');const z=turn(q);assert.equal(z.fighters[0].counts.nextAttackBoost,1);const plain=structuredClone(z);plain.fighters[0].counts.nextAttackBoost=0;const base=turn(plain,900030).fighters[0].lastAttackDamage;const hit=turn(z,900030);assert.ok(Math.abs(hit.fighters[0].lastAttackDamage-base*2)<=2);assert.equal(hit.fighters[0].counts.nextAttackBoost,0);
 const b=make(e(1256));timer(b,0,'攻击最低伤害',{amount:300});assert.equal(turn(b).fighters[1].ailments['焚烬'],undefined);const rule=E.WIKI.effectsEngine.registry[1256];for(const x of [7,22])assert.doesNotThrow(()=>rule.validate([300,x,1,100]));for(const x of [6,8,21,23])assert.throws(()=>rule.validate([300,x,1,100]));
});

test('3467 782高体受击前焚烬、免疫失败清回合、MISS零伤不触发',()=>{
 const q=make(undefined,{soul:782,targetHp:8000}),n=turn(q,900031,900040);assert.ok(n.fighters[1].ailments['焚烬']);const hitIndex=n.turns[0].events.findIndex(x=>x.text.includes('焚烬'));assert.ok(hitIndex>=0);
 timer(q,1,'免异常');timer(q,1,'免弱');const z=turn(q,900031,900040);assert.equal(z.fighters[1].effects['免弱'],undefined);const p=make(undefined,{soul:782,targetHp:8000});p.fighters[0].counts.attackNullify=1;assert.equal(turn(p,900031,900040).fighters[1].ailments['焚烬'],undefined);p.fighters[0].counts.attackNullify=0;p.moveDefinitions[key(900040)].alwaysHit=false;p.moveDefinitions[key(900040)].accuracy=0;assert.equal(turn(p,900031,900040).fighters[1].ailments['焚烬'],undefined);const equal=make(undefined,{soul:782});assert.equal(turn(equal,900031,900040).fighters[1].ailments['焚烬'],undefined);
});

test('3467 782首次对手致死保一、清双方强化回合烧伤与同回合后续保一',()=>{
 const q=make(undefined,{soul:782,hp:10});q.fighters[0].stages.atk=2;q.fighters[1].stages.def=2;timer(q,0,'免弱');timer(q,1,'免弱');q.moveDefinitions[key(900040)].operations=E.WIKI.compile(source.moves.find(x=>x.id===11977),source).operations;const n=turn(q,900031,900040);assert.equal(n.fighters[0].soulState.ainsSaved,true);assert.equal(n.fighters[0].soulState.ainsSurvivalRound,1);assert.equal(n.fighters[0].hp,4500);for(const f of n.fighters){assert.equal(f.stages.atk,0);assert.equal(f.stages.def,0);assert.equal(f.effects['免弱'],undefined);}assert.equal(n.fighters[1].ailments['烧伤'],2);
 n.fighters[0].hp=1;assert.equal(turn(n,900031,900040).fighters[0].hp,0);
 const own=make(undefined,{soul:782,hp:10});own.moveDefinitions[key(900031)].operations=[{effectId:80,index:0,phase:'afterHit',params:[],sourceArgs:[]}];const a=turn(own,900031);assert.equal(a.fighters[0].soulState.ainsSaved,undefined);
});

test('3467 782战阶末失血半回复、相等与禁疗',()=>{
 const q=make(undefined,{soul:782,hp:1000});assert.equal(turn(q,900031).fighters[0].hp,5000);const p=make(undefined,{soul:782,hp:4500,targetHp:4500});assert.equal(turn(p,900031).fighters[0].hp,4500);timer(q,0,'技能禁疗');assert.equal(turn(q,900031).fighters[0].hp,5000);
});

test('3467 正式本地17招搜索加载配招魂印选择与实际技能效果',()=>{
 const store=require('../local-species.cjs'),local=store.species(3467);assert.equal(local.source.storage,'local');assert.equal(local.deployment.scope,'single');assert.equal(local.souls.length,1);assert.equal(E.WIKI.versionSnapshots(local).length,1);
 for(const m of local.moves){const ids=[31273,m.id,...local.moves.map(x=>x.id)].filter((v,i,l)=>l.indexOf(v)===i).slice(0,5),q=E.createBattle({wikiSnapshots:[local,local],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(q.fighters[0].soulId,782);const n=E.resolveTurn(q,[key(m.id),key(m.id)]);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);if(m.id===25743)assert.equal(n.fighters[0].stages.atk,2);if(m.id===25744)assert.equal(n.fighters[0].effects.reflect.end,5);if(m.id===11977)assert.ok(n.turns[0].events.some(x=>x.text.includes('等级附加')&&x.text.includes('199')));}
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3467 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3467);assert.equal(o.fighters[0].hp,8960);});}
