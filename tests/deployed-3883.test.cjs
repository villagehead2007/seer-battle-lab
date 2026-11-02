'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3883-battle.cjs');
const e=id=>pick(id)[0];
test('3883 魂印低体追加锁定先受伤前数值、伙伴闪避与PP上限',()=>{
 for(const soul of [1152,1448]){const q=make(undefined,{soul,hp:8000,aStats:{spe:1}});q.moveDefinitions[key(900040)].priority=5;timer(q,1,'免异常');timer(q,1,'免弱');const n=turn(q,900030,900040);assert.equal(n.turns[0].first,1);assert.ok(n.fighters[0].hp<8000);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+500);}
 const q=make(e(2067),{hp:1000});q.moveDefinitions[key(900040)].alwaysHit=false;const n=turn(q,undefined,900040);assert.equal(n.fighters[1].lastAttackDamage,undefined);assert.equal(n.fighters[0].hp,9000);assert.equal(n.fighters[0].pp[key(900031)],99);const p=make(e(2067),{hp:1000});timer(p,0,'技能禁疗');assert.ok(turn(p,undefined,900040).fighters[0].hp<1000);
 const slots=make(e(780));for(const k of slots.fighters[1].moves)slots.fighters[1].pp[k]=0;slots.fighters[1].pp[key(900040)]=2;assert.ok(Object.values(turn(slots,undefined,900040).fighters[1].pp).every(v=>v===0));
});
test('3883 双魂印满体封属概率、未满先制和锁定损失追加',()=>{
 for(const soul of [1152,1448]){let blocked=0,passed=0;for(let seed=0;seed<60;seed++){const q=make(undefined,{soul,seed});q.moveDefinitions[key(900041)].operations=[{effectId:585,index:0,phase:'afterHit',params:[1,1,1,1,1,1],sourceArgs:[1,1,1,1,1,1]}];const n=turn(q,900031);if(n.fighters[1].stages.atk===0)blocked++;else passed++;assert.equal(n.fighters[1].pp[key(900041)],98);}assert.ok(blocked);if(soul===1152)assert.ok(passed);else assert.equal(passed,0);
 const q=make(undefined,{soul,hp:8000,aStats:{spe:1}}),n=turn(q,900030,900040);assert.equal(n.turns[0].first,0);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+500);assert.equal(turn(q,900031).fighters[1].hp,9000);timer(q,0,'skillBlock');assert.equal(turn(q,900030).fighters[1].hp,9000);delete q.fighters[0].effects.skillBlock;delete q.fighters[0].effects['攻击必中'];q.moveDefinitions[key(900030)].alwaysHit=false;q.moveDefinitions[key(900030)].accuracy=0;assert.equal(turn(q,900030).fighters[1].hp,9000);
 }
});
test('3883 双魂印受击害怕失败弱化及次回合诅咒、免攻与MISS',()=>{
 for(const soul of [1152,1448]){let fear=0,failed=0,cursed=0,notCursed=0;for(let seed=0;seed<60;seed++){const q=make(undefined,{soul,seed,hp:8000});let n=turn(q,900031,900040);if(n.fighters[1].ailments['害怕'])fear++;else{failed++;assert.ok(Object.values(n.fighters[1].stages).every(x=>x===-1));assert.equal(n.fighters[0].soulState.darkNightCurseRound,2);n=turn(n,900030);if(n.fighters[1].ailments['诅咒'])cursed++;else notCursed++;}}
 assert.ok(fear&&failed&&cursed&&notCursed);const q=make(undefined,{soul,hp:8000});q.fighters[0].counts.attackNullify=1;let n=turn(q,900031,900040);assert.equal(n.fighters[0].soulState.darkNightCurseRound,undefined);assert.equal(n.fighters[1].ailments['害怕'],undefined);q.fighters[0].counts={};q.moveDefinitions[key(900040)].alwaysHit=false;q.moveDefinitions[key(900040)].accuracy=0;n=turn(q,900031,900040);assert.equal(n.fighters[0].soulState.darkNightCurseRound,undefined);
 const p=make(undefined,{soul,hp:8000});timer(p,1,'免异常');timer(p,1,'免弱');n=turn(p,900031,900040);assert.ok(Object.values(n.fighters[1].stages).every(x=>x===0));assert.equal(n.fighters[0].soulState.darkNightCurseRound,2);delete n.fighters[0].effects['攻击必中'];n.moveDefinitions[key(900030)].alwaysHit=false;n.moveDefinitions[key(900030)].accuracy=0;assert.equal(turn(n,900030).fighters[1].ailments['诅咒'],undefined);
 }
});
test('3883 全部4和5实例概率变化、上下限和免疫',()=>{
 for(const id of [4,5])for(const x of pick(id)){const side=id===4?0:1,k=keys[x.params[0]];let yes=0,no=0;for(let seed=0;seed<60;seed++){const q=make(x,{seed}),v=turn(q).fighters[side].stages[k];if(v===x.params[2])yes++;else no++;}assert.ok(yes);if(x.params[1]<100)assert.ok(no);const q=make(x);timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[k],0);delete q.fighters[side].effects[id===4?'禁强化':'免弱'];q.fighters[side].stages[k]=id===4?6:-6;assert.equal(turn(q).fighters[side].stages[k],id===4?6:-6);}
});
test('3883 2低体增威与1180双实例吸强成功必暴',()=>{
 const q=make(e(2),{targetHp:4499});assert.ok(turn(q).fighters[0].lastAttackDamage>turn(make(e(2),{targetHp:4500})).fighters[0].lastAttackDamage*1.8);
 for(const x of pick(1180)){const p=make(x);p.fighters[1].stages.atk=2;const n=turn(p);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[0].effects['必定暴击'].start,2);assert.equal(n.fighters[0].effects['必定暴击'].end,3);assert.equal(turn(make(x)).fighters[0].effects['必定暴击'],undefined);timer(p,1,'幽蝶强化保护');assert.equal(turn(p).fighters[0].effects['必定暴击'],undefined);}
});
test('3883 1066低伤先后手固伤和683随机范围免疫',()=>{
 for(const fast of [true,false]){const q=make(e(1066),{aStats:{spe:fast?500:1}});q.moveDefinitions[key(q.auditMoveId)].priority=0;const n=turn(q);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+(fast?350:250));q.fighters[0].stats.atk=10000;const large=turn(q);assert.equal(9000-large.fighters[1].hp,large.fighters[0].lastAttackDamage);}
 const seen=new Set();for(let seed=0;seed<60;seed++){const q=make(e(683),{seed}),n=turn(q),extra=9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage;assert.ok(extra>=200&&extra<=400);seen.add(extra);q.fighters[1].build.resistance.fixed=100;const z=turn(q);assert.equal(9000-z.fighters[1].hp,z.fighters[0].lastAttackDamage);}assert.ok(seen.size>10);
});
test('3883 15害怕与164受击概率、191反弹和128转治疗',()=>{
 for(const id of [15,164]){let yes=0,no=0;for(let seed=0;seed<70;seed++){const q=make(e(id),{seed}),n=turn(q,undefined,id===164?900040:900041);if(n.fighters[1].ailments['害怕'])yes++;else no++;timer(q,1,'免异常');assert.equal(turn(q,undefined,id===164?900040:900041).fighters[1].ailments['害怕'],undefined);}assert.ok(yes&&no);}
 const p=make(e(191));p.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const reflected=turn(p);assert.equal(reflected.fighters[0].ailments['害怕'],undefined);assert.ok(reflected.fighters[1].ailments['害怕']);
 const q=make(e(128),{hp:1000}),n=turn(q,undefined,900040);assert.ok(n.fighters[0].hp>1000);n.fighters[0].effects['攻击转治疗'].end=1;assert.ok(turn(n,900031,900040).fighters[0].hp<n.fighters[0].hp);
});
test('3883 1087反弱封招与780受击正PP无放回、旧真实实例',()=>{
 const q=make(e(1087));q.fighters[0].stages.atk=-2;const n=turn(q);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[1].effects.skillBlock.start,2);assert.equal(turn(make(e(1087))).fighters[1].effects.skillBlock,undefined);timer(q,0,'弱化不可解除反转');assert.equal(turn(q).fighters[0].stages.atk,-2);
 for(const id of [3883,3242,3393]){const local=id===3883?source:require('../local-species.cjs').species(id),m=local.moves.find(m=>m.effectIds.includes(780)),x=m.effectInstances.find(e=>e.id===780),p=make(e(780));p.moveDefinitions[key(p.auditMoveId)].operations[0].params=x.args.slice();p.fighters[1].pp[key(900042)]=0;const out=turn(p,undefined,900040);assert.equal(Object.values(out.fighters[1].pp).filter(v=>v===0).length,1+x.args[2]);const noHit=turn(p);assert.equal(Object.values(noHit.fighters[1].pp).filter(v=>v===0).length,1);}
});
test('3883 1338弱化翻倍强化、532实际回复粉伤及禁疗',()=>{
 const q=make(e(1338));assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===1));q.fighters[1].stages.atk=-1;assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===2));q.fighters[0].stages.atk=6;assert.equal(turn(q).fighters[0].stages.atk,6);timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].stages.def,0);
 for(const hp of [1000,8500,9000]){const p=make(e(532),{hp}),n=turn(p),gain=Math.min(3000,9000-hp);assert.equal(n.fighters[0].hp,hp+gain);assert.equal(n.fighters[1].hp,9000-gain);timer(p,0,'技能禁疗');assert.equal(turn(p).fighters[1].hp,9000);}
});
test('3883 843与58期限、1243和2349弱化先制',()=>{
 for(const id of [843,58]){const n=turn(make(e(id))),k=id===843?'id984':'必定暴击';assert.equal(n.fighters[0].effects[k].start,2);assert.equal(n.fighters[0].effects[k].end,3);assert.equal(turn(turn(n,900031),900031).fighters[0].effects[k],undefined);}
 for(const id of [1243,2349]){const q=make(e(id),{aStats:{spe:1}});q.moveDefinitions[key(q.auditMoveId)].priority=0;assert.equal(turn(q,undefined,900040).turns[0].first,1);q.fighters[1].stages.atk=-1;assert.equal(turn(q,undefined,900040).turns[0].first,0);q.moveDefinitions[key(900040)].priority=id===2349?2:0;assert.equal(turn(q,undefined,900040).turns[0].first,0);}
});
test('3883 553暴击害怕及1249伤害回复异常粉伤',()=>{
 const q=make(e(553));assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);timer(q,0,'必定暴击');assert.ok(turn(q).fighters[1].ailments['害怕']);timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);
 const p=make(e(1249),{hp:1000});let n=turn(p);assert.equal(n.fighters[0].hp,1000+Math.floor(n.fighters[0].lastAttackDamage*.5));assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage);p.fighters[1].ailments['麻痹']=3;n=turn(p);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+Math.floor(n.fighters[0].lastAttackDamage*.5));timer(p,0,'技能禁疗');assert.equal(turn(p).fighters[0].hp,1000);
});
test('3883 1697免粉追加真伤与2067仅自然到期回满回PP',()=>{
 const q=make(e(1697)),n=turn(q);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+3600);q.fighters[1].build.resistance.percent=100;const immune=turn(q);assert.equal(9000-immune.fighters[1].hp,immune.fighters[0].lastAttackDamage);timer(q,1,'当回合免伤');const trulyImmune=turn(q);assert.equal(9000-trulyImmune.fighters[1].hp,0);delete q.fighters[1].effects['当回合免伤'];q.fighters[1].soulId=622;const pinkImmune=turn(q);assert.equal(9000-pinkImmune.fighters[1].hp,pinkImmune.fighters[0].lastAttackDamage+3600-1125);assert.equal(pinkImmune.fighters[1].stats.maxHp/8,1125);
 const p=make(e(2067),{hp:1000});p.fighters[0].pp[key(900031)]=1;let z=turn(p);assert.equal(z.fighters[0].hp,9000);assert.equal(z.fighters[0].pp[key(900031)],2);assert.equal(z.fighters[0].pp[key(p.auditMoveId)],source.moves.find(x=>x.id===p.auditMoveId).pp);p.moveDefinitions[key(900041)].operations=[{effectId:180,index:0,phase:'afterHit',params:[],sourceArgs:[]}];z=turn(p);assert.equal(z.fighters[0].hp,1000);assert.equal(z.fighters[0].pp[key(900031)],1);p.moveDefinitions[key(900041)].operations=[];timer(p,0,'技能禁疗');assert.equal(turn(p).fighters[0].hp,1000);
});
test('3883 928两个实例清回合免疫、833吸取、980封属及1709未击败回复',()=>{
 for(const x of pick(928)){const q=make(x);timer(q,1,'免弱');assert.equal(turn(q).fighters[0].counts.immune,1);assert.equal(turn(make(x)).fighters[0].counts.immune,undefined);timer(q,1,'protect');assert.equal(turn(q).fighters[0].counts.immune,undefined);}
 const p=make(e(833),{hp:1000}),n=turn(p);assert.equal(n.fighters[0].hp,4000);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+3000);assert.equal(turn(make(e(833),{hp:1000,targetHp:1})).fighters[0].hp,1000);
 const q=make(e(980));q.moveDefinitions[key(900041)].operations=[{effectId:585,index:0,phase:'afterHit',params:[1,1,1,1,1,1],sourceArgs:[1,1,1,1,1,1]}];assert.equal(turn(q).fighters[1].stages.atk,0);q.fighters[0].stats.spe=1;assert.equal(turn(q).fighters[1].stages.atk,1);
 const a=make(e(1709),{hp:1000}),b=turn(a);assert.equal(b.fighters[0].hp,4000);a.fighters[1].hp=1000;assert.equal(turn(a).fighters[0].hp,1000);a.fighters[1].hp=9000;a.fighters[1].build.resistance.percent=100;assert.equal(turn(a).fighters[0].hp,4000);
});

test('3883 全部技能基础伤害MISS控制封招与PP消费',()=>{
 for(const m of source.moves){const q=make({moveId:m.id,index:null},{omit:true}),n=turn(q);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);q.fighters[0].ailments['疲惫']=2;assert.equal(turn(q).fighters[0].pp[key(m.id)],m.pp);q.fighters[0].ailments={};timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(!m.alwaysHit){const miss=make({moveId:m.id,index:null},{omit:true,hit:false});miss.moveDefinitions[key(m.id)].accuracy=0;assert.equal(turn(miss).fighters[1].hp,9000);}}
});
test('3883 正式本地19招四版本逐招初始化执行与拒绝混装变更',()=>{
 const local=require('../local-species.cjs').species(3883);assert.equal(local.source.storage,'local');const versions=E.WIKI.versionSnapshots(local);assert.equal(versions.length,4);
 for(const a of versions){const group=a.skillVersions.find(g=>g.id===a.selectedSkillVersion);assert.deepEqual(E.WIKI.skillVersionIssues(a,true),[]);for(const id of group.moveIds){const m=a.moves.find(m=>m.id===id),ids=[group.fifthId,id,...group.moveIds].filter((x,i,l)=>l.indexOf(x)===i).slice(0,5);const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(s.fighters[0].soulId,group.soulId);assert.equal(s.fighters[0].pp[key(id)],m.pp);const n=E.resolveTurn(s,[key(id),key(id)]);assert.equal(n.fighters[0].pp[key(id)],m.id===38117?m.pp:m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);}}
 for(const change of [s=>s.additionalFifths.rawPet.hash='wrong',s=>s.souls[0].hash='wrong',s=>s.skillVersions[0].moveIds.push(37336),s=>s.skillVersions[0].moveIds.pop(),s=>s.moves.pop()]){const q=structuredClone(local);change(q);assert.ok(E.WIKI.skillVersionIssues(q,true).length);}
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3883 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3883,532);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3883 1697实际免疫补真或来源盾独立反应公共回归',()=>{const o=require('./helpers/assert-1697-actual-immunity.cjs')(3883);assert.ok(o.fighters[0].hp>0);});}
