'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3875-battle.cjs');
const e=id=>pick(id)[0];
test('3875 魂印回合初强化锁定先制与攻击翻倍，双版无强化暴击',()=>{
 for(const soul of [1145,1446]){const q=make(undefined,{soul,aStats:{spe:1}});q.fighters[1].stages.acc=1;const n=turn(q,900030,900040);assert.equal(n.turns[0].first,0);assert.equal(n.fighters[0].soulState.darkWarBoosted,true);assert.equal(n.fighters[0].lastAttackDamage,turn(make(),900030,900040).fighters[0].lastAttackDamage*2);const p=make(undefined,{soul});const out=turn(p,900030);assert.equal(out.fighters[0].soulState.darkWarBoosted,false);assert.equal(Object.values(out.fighters[0].stages).filter(v=>v===1).length,3);}
 let crit=0,plain=0;for(let seed=0;seed<60;seed++){const n=turn(make(undefined,{soul:1145,seed,criticals:true}),900030);const b=turn(make(undefined,{seed}),900030);if(n.fighters[0].lastAttackDamage>b.fighters[0].lastAttackDamage*1.5)crit++;else plain++;}assert.ok(crit>10&&plain>10);
 for(let seed=0;seed<20;seed++){const q=make(undefined,{soul:1145,seed,criticals:true}),b=structuredClone(q);q.moveDefinitions[key(900030)].criticalChance=3/16;b.moveDefinitions[key(900030)].criticalChance=1/16;assert.equal(turn(q,900030).fighters[0].lastAttackDamage,turn(b,900030).fighters[0].lastAttackDamage);}
});
test('3875 魂印攻击吸血和低体战阶追加、属性沿用及MISS清零',()=>{
 for(const soul of [1145,1446]){let q=make(undefined,{soul,hp:1000});let n=turn(q,900030);const d=n.fighters[0].lastAttackDamage;assert.equal(n.fighters[0].hp,1000+Math.floor(d/2));assert.equal(9000-n.fighters[1].hp,d+Math.floor(d/2));const hp=n.fighters[1].hp;n=turn(n,900031);assert.equal(hp-n.fighters[1].hp,Math.floor(d/2));assert.equal(n.fighters[0].soulState.darkWarLastDamage,d);delete n.fighters[0].effects['攻击必中'];n.moveDefinitions[key(900030)].alwaysHit=false;n.moveDefinitions[key(900030)].accuracy=0;const miss=turn(n,900030);assert.equal(miss.fighters[0].soulState.darkWarLastDamage,0);assert.equal(miss.fighters[1].hp,n.fighters[1].hp);n.fighters[0].effects['攻击必中']={start:1,end:99};n.fighters[1].counts.attackNullify=1;const immune=turn(n,900030);assert.equal(immune.fighters[0].soulState.darkWarLastDamage,0);}
 const half=turn(make(undefined,{soul:1145,hp:4500}),900030);assert.equal(9000-half.fighters[1].hp,half.fighters[0].lastAttackDamage);const low=make(undefined,{soul:1145,hp:1000});timer(low,0,'技能禁疗');assert.ok(turn(low,900030).fighters[0].hp>1000);
});
test('3875 魂印随机三项无放回、满级仍入池及禁强化',()=>{
 const seen=new Set();for(let seed=0;seed<60;seed++){const q=make(undefined,{soul:1145,seed});const n=turn(q,900031);const list=keys.filter(k=>n.fighters[0].stages[k]===1);assert.equal(list.length,3);list.forEach(x=>seen.add(x));}assert.equal(seen.size,6);
 const q=make(undefined,{soul:1145});q.moveDefinitions[key(900031)].operations=[{effectId:585,index:0,phase:'afterHit',params:[6,6,6,6,6,6],sourceArgs:[6,6,6,6,6,6]}];assert.ok(Object.values(turn(q,900031).fighters[0].stages).every(v=>v===6));timer(q,0,'禁强化');assert.ok(Object.values(turn(q,900031).fighters[0].stages).every(v=>v===0));
 const counts=new Set();for(let seed=0;seed<40;seed++){const p=make(undefined,{soul:1145,seed});p.moveDefinitions[key(900031)].operations=[{effectId:585,index:0,phase:'afterHit',params:[6,0,0,0,0,0],sourceArgs:[6,0,0,0,0,0]}];const n=turn(p,900031);assert.equal(n.fighters[0].stages.atk,6);counts.add(keys.filter(k=>k!=='atk'&&n.fighters[0].stages[k]===1).length);}assert.deepEqual([...counts].sort(),[2,3]);
});
test('3875 200有强化才概率害怕、无强化与免异常不触发',()=>{
 let yes=false,no=false;for(let seed=0;seed<40;seed++){const q=make(e(200),{seed});assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);q.fighters[1].stages.acc=1;const n=turn(q);yes ||=!!n.fighters[1].ailments['害怕'];no ||=!n.fighters[1].ailments['害怕'];timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);}assert.ok(yes&&no);
});
test('3875 513三类异常威力翻倍且命中清除、MISS保留及其他异常',()=>{
 for(const k of ['烧伤','中毒','冻伤']){const q=make(e(513));q.fighters[0].ailments[k]=5;const n=turn(q);assert.equal(n.fighters[0].ailments[k],undefined);const b=make(e(513),{omit:true});b.fighters[0].ailments[k]=5;assert.ok(n.fighters[0].lastAttackDamage>turn(b).fighters[0].lastAttackDamage*1.8);const miss=make(e(513),{hit:false});miss.fighters[0].ailments[k]=5;miss.moveDefinitions[key(miss.auditMoveId)].accuracy=0;miss.moveDefinitions[key(miss.auditMoveId)].alwaysHit=false;assert.ok(turn(miss).fighters[0].ailments[k]);}const other=make(e(513));other.fighters[0].ailments['失明']=5;assert.ok(turn(other).fighters[0].ailments['失明']);
});
test('3875 1341高伤回复严格300边界、缺血截断与禁疗',()=>{
 for(const cap of [299,300,301]){const q=make(e(1341),{hp:1000,aStats:{atk:9999}});timer(q,1,'伤害上限',{amount:cap});const n=turn(q);assert.equal(n.fighters[0].lastAttackDamage,cap);assert.equal(n.fighters[0].hp,cap>300?4000:1000);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,1000);}const q=make(e(1341),{hp:8000,aStats:{atk:9999}});assert.equal(turn(q).fighters[0].hp,9000);
});
test('3875 967命中双防基础值百分比追加，不随等级增减、MISS无追加',()=>{
 for(const stage of [-3,0,3]){const q=make(e(967));q.fighters[1].stages.def=stage;q.fighters[1].stages.spd=stage;const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,240);q.fighters[1].build.resistance.percent=100;const no=turn(q);assert.equal(9000-no.fighters[1].hp,no.fighters[0].lastAttackDamage);}const miss=make(e(967),{hit:false});miss.moveDefinitions[key(miss.auditMoveId)].alwaysHit=false;miss.moveDefinitions[key(miss.auditMoveId)].accuracy=0;assert.equal(turn(miss).fighters[1].hp,9000);
});
test('3875 2389有强化才微弱转普通、克制不变与伤害变化',()=>{
 const q=make(e(2389));q.fighters[1].type='超能';const b=turn(q);q.fighters[0].stages.acc=1;const n=turn(q);assert.ok(n.fighters[0].lastAttackDamage>b.fighters[0].lastAttackDamage*1.8);q.fighters[1].type='普通';const yes=turn(q);q.fighters[0].stages.acc=0;assert.equal(turn(q).fighters[0].lastAttackDamage,yes.fighters[0].lastAttackDamage);
});
test('3875 1606反弱成功理论比例吸取、无弱化禁强和锁弱失败',()=>{
 const q=make(e(1606),{hp:1000});assert.equal(turn(q).fighters[0].hp,1000);q.fighters[0].stages.acc=-2;const n=turn(q);assert.equal(n.fighters[0].stages.acc,2);assert.equal(n.fighters[0].hp,4000);q.fighters[1].build.resistance.percent=100;assert.equal(turn(q).fighters[0].hp,4000);for(const k of ['禁强化','弱化不可解除反转']){const b=structuredClone(q);timer(b,0,k);assert.equal(turn(b).fighters[0].hp,1000);}
});
test('3875 1233命中递增30至40，MISS封招控制不计且禁疗不改扣血',()=>{
 let q=make(e(1233),{hp:1000});for(const pct of [30,35,40,40]){q.fighters[1].hp=9000;q.fighters[0].hp=1000;const n=turn(q);assert.equal(n.fighters[0].hp,1000+9000*pct/100);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,9000*pct/100);q=n;}
 for(const mode of ['miss','invalid','control']){let s=make(e(1233),{hp:1000,hit:false});if(mode==='miss'){s.moveDefinitions[key(s.auditMoveId)].accuracy=0;s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;}else if(mode==='invalid')timer(s,0,'skillBlock',{},1,1);else s.fighters[0].ailments['疲惫']=1;let n=turn(s);assert.equal(n.fighters[0].soulState.darkWarDrainHits,undefined);n.fighters[0].ailments={};delete n.fighters[0].effects.skillBlock;n.moveDefinitions[key(n.auditMoveId)].accuracy=100;n.moveDefinitions[key(n.auditMoveId)].alwaysHit=true;n.fighters[0].hp=1000;const h=turn(n);assert.equal(h.fighters[0].soulState.darkWarDrainHits,1);assert.equal(h.fighters[0].hp,3700);}
 const s=make(e(1233),{hp:1000});timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);
 const immune=make(e(1233),{hp:1000});immune.fighters[1].build.resistance.percent=100;const hit=turn(immune);assert.equal(hit.fighters[0].hp,3700);assert.equal(hit.fighters[0].soulState.darkWarDrainHits,1);assert.equal(9000-hit.fighters[1].hp,hit.fighters[0].lastAttackDamage);
});
test('3875 4和5真实实例能力变化、免疫和六级边界',()=>{
 for(const id of [4,5])for(const x of pick(id)){const q=make(x),side=id===4?0:1;assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],x.params[2]);timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],0);delete q.fighters[side].effects[id===4?'禁强化':'免弱'];q.fighters[side].stages[keys[x.params[0]]]=id===4?6:-6;assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],id===4?6:-6);}
});
test('3875 985吸强成功封属与1032清回合成功封攻、保护失败',()=>{
 for(const id of [985,1032]){const q=make(e(id));if(id===985)q.fighters[1].stages.atk=2;else timer(q,1,'免弱');const n=turn(q),k=id===985?'statusBlock':'attackBlock';assert.equal(n.fighters[1].effects[k].start,2);assert.equal(n.fighters[1].effects[k].end,2);assert.equal(turn(make(e(id))).fighters[1].effects[k],undefined);timer(q,1,id===985?'幽蝶强化保护':'protect');assert.equal(turn(q).fighters[1].effects[k],undefined);}
});
test('3875 9连续威力增长封顶、换招重置和22真实疲惫两回合',()=>{
 let q=make(e(9)),prior=0;for(let i=0;i<6;i++){q.rng=1;const n=turn(q);assert.ok(n.fighters[0].lastAttackDamage>=prior);prior=n.fighters[0].lastAttackDamage;q=n;}q=turn(q,900031);q.rng=1;const reset=turn(q);const fresh=make(e(9),{seed:1});assert.equal(reset.fighters[0].lastAttackDamage,turn(fresh).fighters[0].lastAttackDamage);
 let yes=false,no=false;for(let seed=0;seed<100;seed++){const q=make(e(22),{seed}),n=turn(q);if(n.fighters[1].ailments['疲惫']){yes=true;assert.equal(n.fighters[1].ailments['疲惫'],2);}else no=true;timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['疲惫'],undefined);}assert.ok(yes&&no);
});
test('3875 43回复截断禁疗、52先手失效与792仅攻击无效',()=>{
 const q=make(e(43),{hp:8000});assert.equal(turn(q).fighters[0].hp,9000);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,8000);
 for(const id of [52,792]){const q=turn(make(e(id)));const next=turn(q,900030,900040);if(id===52)assert.ok(next.fighters[0].hp<q.fighters[0].hp);const active=make(e(id));const n=turn(active,undefined,900040);assert.equal(n.fighters[0].hp,9000);const slow=make(e(id),{aStats:{spe:1}});assert.ok(turn(slow,undefined,900040).fighters[0].hp<9000);}
 for(const id of [52,792]){const q=make(e(id));q.moveDefinitions[key(900041)].operations=[{effectId:585,index:0,phase:'afterHit',params:[1,1,1,1,1,1],sourceArgs:[1,1,1,1,1,1]}];assert.equal(turn(q).fighters[1].stages.atk,id===52?0:1);}
});
test('3875 540后手才下回合必暴、843先制期限与191反弹',()=>{
 for(const x of pick(540)){assert.equal(turn(make(x)).fighters[0].effects['必定暴击'],undefined);const n=turn(make(x,{aStats:{spe:1}}));assert.equal(n.fighters[0].effects['必定暴击'].start,2);assert.equal(n.fighters[0].effects['必定暴击'].end,1+x.params[0]);}
 const q=turn(make(e(843)));assert.equal(q.fighters[0].effects.id984.amount,2);assert.equal(q.fighters[0].effects.id984.end,3);const p=make(e(191));p.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(p);assert.equal(n.fighters[0].ailments['害怕'],undefined);assert.ok(n.fighters[1].ailments['害怕']);
});
test('3875 577有强化才降命中、585全强化与433持续攻速',()=>{
 const q=make(e(577));assert.equal(turn(q).fighters[1].stages.acc,0);q.fighters[0].stages.atk=1;assert.equal(turn(q).fighters[1].stages.acc,-2);timer(q,1,'免弱');assert.equal(turn(q).fighters[1].stages.acc,0);assert.ok(Object.values(turn(make(e(585))).fighters[0].stages).every(v=>v===1));let p=make(e(433));for(let i=1;i<=4;i++){p=turn(p,i===1?undefined:900031);assert.equal(p.fighters[0].stages.atk,Math.min(3,i));assert.equal(p.fighters[0].stages.spe,Math.min(3,i));}
});
test('3875 927低体实际回复粉伤与679技能禁疗期限',()=>{
 for(const hp of [4499,4500,8000]){const q=make(e(927),{hp}),n=turn(q),gain=n.fighters[0].hp-hp;assert.equal(gain,Math.min(4500,9000-hp));assert.equal(9000-n.fighters[1].hp,hp<4500?gain:0);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[1].hp,9000);}
 const q=turn(make(e(679)));q.fighters[1].hp=1000;q.moveDefinitions[key(900041)].operations=[{effectId:579,index:0,phase:'afterHit',params:[2],sourceArgs:[2]}];assert.equal(turn(q,900031).fighters[1].hp,1000);q.round=4;assert.equal(turn(q,900031).fighters[1].hp,5500);
});
test('3875 573强化清除与吸取触发疲惫，免异常和期限',()=>{
 for(const effectId of [33,85]){const q=make(e(573));q.fighters[0].stages.atk=1;q.moveDefinitions[key(900041)].operations=[{effectId,index:0,phase:'afterHit',params:[],sourceArgs:[]}];const n=turn(q);assert.equal(n.fighters[0].stages.atk,0);assert.equal(n.fighters[1].ailments['疲惫'],2);timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['疲惫'],undefined);const empty=make(e(573));empty.moveDefinitions[key(900041)].operations=q.moveDefinitions[key(900041)].operations;assert.equal(turn(empty).fighters[1].ailments['疲惫'],undefined);}
 const expired=turn(make(e(573)));expired.round=4;expired.fighters[0].stages.atk=1;expired.moveDefinitions[key(900041)].operations=[{effectId:33,index:0,phase:'afterHit',params:[],sourceArgs:[]}];assert.equal(turn(expired,900031).fighters[1].ailments['疲惫'],undefined);
});
test('3875 1221反弱免异常次数与1129双概率和1156击败回复PP',()=>{
 const q=make(e(1221));q.fighters[0].stages.atk=-2;const n=turn(q);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[0].counts.immune,1);assert.equal(turn(make(e(1221))).fighters[0].counts.immune,undefined);timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].counts.immune,undefined);
 for(const x of pick(1129)){let low=false,high=false;for(let seed=0;seed<40;seed++){const s=make(x,{seed}),base=turn(make(x,{seed,omit:true})).fighters[0].lastAttackDamage,d=turn(s).fighters[0].lastAttackDamage;low ||=d<base*1.4;high ||=d>base*1.6;}assert.ok(low&&high);}
 const a=make(e(1156),{hp:1000,targetHp:1});a.fighters[0].pp[key(900031)]=1;const dead=turn(a);assert.equal(dead.fighters[0].hp,9000);assert.equal(dead.fighters[0].pp[key(900031)],99);const alive=turn(make(e(1156),{hp:1000}));assert.equal(alive.fighters[0].hp,1000);
 timer(a,0,'技能禁疗');const blocked=turn(a);assert.equal(blocked.fighters[0].hp,1000);assert.equal(blocked.fighters[0].pp[key(900031)],99);
});
test('3875 全部技能基础伤害MISS控制封招与PP消费',()=>{
 for(const m of source.moves){const q=make({moveId:m.id,index:null},{omit:true}),n=turn(q);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);q.fighters[0].ailments['疲惫']=2;assert.equal(turn(q).fighters[0].pp[key(m.id)],m.pp);q.fighters[0].ailments={};timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(!m.alwaysHit){const miss=make({moveId:m.id,index:null},{omit:true,hit:false});miss.moveDefinitions[key(m.id)].accuracy=0;assert.equal(turn(miss).fighters[1].hp,9000);}}
});
test('3875 正式本地18招四版本逐招初始化执行与拒绝混装变更',()=>{
 const local=require('../local-species.cjs').species(3875);assert.equal(local.source.storage,'local');const versions=E.WIKI.versionSnapshots(local);assert.equal(versions.length,4);
 for(const a of versions){const group=a.skillVersions.find(g=>g.id===a.selectedSkillVersion);assert.deepEqual(E.WIKI.skillVersionIssues(a,true),[]);for(const id of group.moveIds){const m=a.moves.find(m=>m.id===id),ids=[group.fifthId,id,...group.moveIds].filter((x,i,l)=>l.indexOf(x)===i).slice(0,5);const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(s.fighters[0].soulId,group.soulId);assert.equal(s.fighters[0].pp[key(id)],m.pp);const n=E.resolveTurn(s,[key(id),key(id)]);assert.equal(n.fighters[0].pp[key(id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);}}
 for(const change of [s=>s.additionalFifths.rawPet.hash='wrong',s=>s.souls[0].hash='wrong',s=>s.skillVersions[0].moveIds.push(38234),s=>s.skillVersions[0].moveIds.pop(),s=>s.moves.pop()]){const q=structuredClone(local);change(q);assert.ok(E.WIKI.skillVersionIssues(q,true).length);}
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3875 927原子实际回复与技能禁疗公共修复',()=>{const o=require('./helpers/assert-4200-public-heal.cjs')(3875,927);assert.ok(o.fighters[0].hp>1000);});}
