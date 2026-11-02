'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3866-battle.cjs');
const e=id=>pick(id)[0];
test('3866 669旧精灵3012和3406真实技能击败登记及未击败无奖励',()=>{
 for(const id of [3012,3406]){const source=require('../local-species.cjs').species(id),move=source.moves.find(m=>m.effectInstances.some(e=>e.id===669));for(const hp of [1,9000]){const a=structuredClone(source);a.souls=[];const chosen=a.moves.find(m=>m.id===move.id);chosen.effectInstances=chosen.effectInstances.filter(e=>e.id===669);chosen.effectIds=[669];const ids=[move.id,...a.moves.filter(m=>m.id!==move.id&&!m.fifth).slice(0,chosen.fifth?4:3).map(m=>m.id),...(!chosen.fifth?[a.moves.find(m=>m.fifth).id]:[])];const q=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});q.fighters[1].hp=hp;const n=E.resolveTurn(q,[key(move.id),key(move.id)]);if(hp===1){assert.equal(n.fighters[1].hp,0);assert.equal(n.fighters[0].effects['攻击先制'].amount,1);assert.equal(n.fighters[0].effects['攻击先制'].start,2);}else assert.equal(n.fighters[0].effects['攻击先制'],undefined);}}
});
test('3866 全部技能基础伤害、MISS、控制封招与暴击倍率',()=>{
 for(const move of source.moves){const entry={moveId:move.id,index:null};const q=make(entry,{omit:true}),n=turn(q);if(move.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);const stopped=make(entry,{omit:true});stopped.fighters[0].ailments['疲惫']=2;assert.equal(turn(stopped).fighters[0].pp[key(move.id)],move.pp);timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(move.power>0){const c=make(entry,{omit:true});timer(c,0,'必定暴击');assert.ok(turn(c).fighters[0].lastAttackDamage>=n.fighters[0].lastAttackDamage*2);}if(!move.alwaysHit){const miss=make(entry,{omit:true,hit:false});miss.moveDefinitions[key(move.id)].accuracy=0;assert.equal(turn(miss).fighters[1].hp,9000);}}
});
test('3866 4和5逐实例能力变化、免疫及六级截断',()=>{
 for(const id of [4,5])for(const x of pick(id)){const q=make(x),side=id===4?0:1;assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],x.params[2]);timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],0);delete q.fighters[side].effects[id===4?'禁强化':'免弱'];q.fighters[side].stages[keys[x.params[0]]]=Math.sign(x.params[2])*6;assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],Math.sign(x.params[2])*6);}
});
test('3866 1114消回合清正PP、免断和无可清不消费',()=>{
 const q=make(e(1114));timer(q,1,'免弱');q.fighters[1].pp[key(900040)]=0;const n=turn(q);assert.equal(Object.values(n.fighters[1].pp).filter(v=>v===0).length,3);assert.equal(n.fighters[1].effects['免弱'],undefined);timer(q,1,'protect');assert.equal(Object.values(turn(q).fighters[1].pp).filter(v=>v===0).length,1);assert.ok(Object.values(turn(make(e(1114))).fighters[1].pp).every(v=>v>0));
});
test('3866 58必暴期限与37低体及40先手威力',()=>{
 const active=turn(make(e(58)));for(const round of [2,3,4]){const q=make();q.round=round;q.fighters[0].effects=structuredClone(active.fighters[0].effects);const n=turn(q);const plain=make();plain.round=round;const b=turn(plain);assert.ok(round<=3?n.fighters[0].lastAttackDamage>=b.fighters[0].lastAttackDamage*2:n.fighters[0].lastAttackDamage===b.fighters[0].lastAttackDamage);}
 for(const hp of [1125,1124]){const q=make(e(37),{hp}),b=make(e(37),{hp,omit:true});assert.ok(hp===1125?turn(q).fighters[0].lastAttackDamage===turn(b).fighters[0].lastAttackDamage:turn(q).fighters[0].lastAttackDamage>turn(b).fighters[0].lastAttackDamage);}
 const fast=turn(make(e(40))),slow=turn(make(e(40),{aStats:{spe:1}}));assert.ok(fast.fighters[0].lastAttackDamage>slow.fighters[0].lastAttackDamage*1.8);
});
test('3866 57用招回复及532等量粉伤、禁疗与满血截断',()=>{
 for(const id of [57,532]){const x=e(id),q=make(x,{hp:8000}),n=turn(q);assert.equal(n.fighters[0].hp,9000);assert.equal(n.fighters[1].hp,id===532?8000:9000);timer(q,0,'技能禁疗');const no=turn(q);assert.equal(no.fighters[0].hp,8000);assert.equal(no.fighters[1].hp,9000);const full=turn(make(x));assert.equal(full.fighters[1].hp,9000);}
});
test('3866 48免异常与191反弹到期和双免疫',()=>{
 for(const id of [48,191])for(const x of pick(id)){const q=make(x);q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q);assert.equal(n.fighters[0].ailments['害怕'],undefined);if(id===191)assert.ok(n.fighters[1].ailments['害怕']);n.round=x.params[0]+1;n.fighters[1].ailments={};assert.ok(turn(n,900031).fighters[0].ailments['害怕']);timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);}
});
test('3866 1014半血严格强化翻倍、免疫与570攻击次数',()=>{
 for(const hp of [4500,4501]){const q=make(e(1014),{hp});assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===(hp===4500?1:2)));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===0));}
 const q=turn(make(e(570)));const n=turn(q,900031,900040);assert.equal(n.fighters[0].hp,9000);assert.ok(turn(n,900031,900040).fighters[0].hp<9000);
});
test('3866 843先制和776增伤有效期、486忽略双防强化',()=>{
 for(const x of pick(843)){const n=turn(make(x));assert.equal(n.fighters[0].effects.id984.start,2);const q=make(undefined,{aStats:{spe:1}});q.round=2;q.fighters[0].effects.id984=n.fighters[0].effects.id984;assert.equal(turn(q).turns[0].first,0);q.round=x.params[0]+2;assert.equal(turn(q).turns[0].first,1);}
 const active=turn(make(e(776)));const q=make();q.round=2;q.fighters[0].effects.doubleDamage=active.fighters[0].effects.doubleDamage;assert.ok(turn(q).fighters[0].lastAttackDamage>=turn(make()).fighters[0].lastAttackDamage*2);
 const state=turn(make(e(486)));const b=make();b.round=2;b.fighters[0].effects['无视对手强化']=state.fighters[0].effects['无视对手强化'];b.fighters[1].stages.def=6;assert.equal(turn(b).fighters[0].lastAttackDamage,turn(make()).fighters[0].lastAttackDamage);
});
test('3866 1199吸强禁疗、失败免护与1106阈值睡眠',()=>{
 const q=make(e(1199));q.fighters[1].stages.atk=2;const n=turn(q);assert.equal(n.fighters[0].stages.atk,2);assert.ok(n.fighters[1].effects['无法通过自身技能恢复体力']);timer(q,1,'幽蝶强化保护');assert.equal(turn(q).fighters[1].effects['无法通过自身技能恢复体力'],undefined);
 for(const spa of [180,4000]){const q=make(e(1106),{aStats:{spa}});q.moveDefinitions[key(q.auditMoveId)].power=180;const n=turn(q);assert.equal(!!n.fighters[1].ailments['睡眠'],n.fighters[0].lastAttackDamage>300);timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['睡眠'],undefined);}
});
test('3866 428遇天敌固伤与792先手封攻击、669击败奖励',()=>{
 const q=make(e(428));q.fighters[1].type='电';const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,e(428).params[0]);const no=turn(make(e(428)));assert.equal(9000-no.fighters[1].hp,no.fighters[0].lastAttackDamage);
 assert.equal(turn(make(e(792)),undefined,900040).fighters[0].hp,9000);assert.ok(turn(make(e(792),{aStats:{spe:1}}),undefined,900040).fighters[0].hp<9000);
 const kill=make(e(669),{targetHp:1});kill.moveDefinitions[key(kill.auditMoveId)].power=180;const won=turn(kill);assert.equal(won.fighters[1].hp,0);assert.ok(won.fighters[0].effects['攻击先制']);
});
test('3866 正式本地18招双魂印配招初始化执行与PP伤害',()=>{
 const local=require('../local-species.cjs').species(3866);assert.equal(local.source.storage,'local');
 for(const soulId of [1138,1437])for(const m of local.moves){const a=structuredClone(local);a.selectedSoulId=soulId;const ids=[m.id,...a.moves.filter(x=>!x.fifth&&x.id!==m.id).slice(0,m.fifth?4:3).map(x=>x.id),...(!m.fifth?[33310]:[])];const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(s.fighters[0].soulId,soulId);assert.equal(s.fighters[0].pp[key(m.id)],m.pp);const n=E.resolveTurn(s,[key(m.id),key(m.id)]);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.kind!=='status')assert.ok(n.fighters[0].lastAttackDamage>0);s.fighters[0].pp[key(m.id)]=0;assert.throws(()=>E.resolveTurn(s,[key(m.id),key(m.id)]));}
});
test('3866 双魂印首回合免异常免弱必暴、强化第二回合免断',()=>{
 for(const soul of [1138,1437])for(const round of [1,2,3]){const q=make(undefined,{soul});q.round=round;q.moveDefinitions[key(900041)].operations=[{effectId:749,index:0,phase:'afterHit',params:[100,1],sourceArgs:[100,1]},{effectId:603,index:1,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q),active=round<=(soul===1437?2:1);assert.equal(n.fighters[0].stages.atk,active?0:-1);assert.equal(!!n.fighters[0].ailments['害怕'],!active);if(active)assert.ok(n.fighters[1].ailments['失明']);}
 const q=make(undefined,{soul:1437});q.moveDefinitions[key(900041)].operations=[{effectId:180,index:0,phase:'afterHit',params:[],sourceArgs:[]}];const n=turn(q);assert.ok(n.turns[0].events.some(x=>x.text.includes('致命')));
});
test('3866 魂印低伤下回合必暴、失明免疫追加百分比',()=>{
 for(const soul of [1138,1437]){const q=make(undefined,{soul});assert.equal(q.fighters[0].soulState.moonEntryTriggers,1);assert.equal(q.fighters[0].soulState.moonEntryLimit,soul===1437?3:2);const n=turn(turn(q));assert.equal(n.fighters[0].soulState.moonEntryTriggers,1);}
 for(const soul of [1138,1437]){const q=make(undefined,{soul});q.fighters[1].counts.immune=1;const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,3000);assert.equal(n.fighters[0].effects['必定暴击'].end,2);q.fighters[1].build.resistance.percent=100;const no=turn(q);assert.equal(9000-no.fighters[1].hp,no.fighters[0].lastAttackDamage);}
});
test('3866 2312实际回复登记与当次追加、禁疗零回复不登记',()=>{
 const q=make(e(2312),{hp:8000}),n=turn(q);assert.equal(n.fighters[0].hp,9000);assert.equal(n.fighters[1].hp,8000);assert.equal(n.fighters[0].effects['技能回复量追加'].amount,1000);const next=turn(n,900031);assert.equal(next.fighters[1].hp,7000);
 for(const mode of ['full','block']){const q=make(e(2312),{hp:mode==='full'?9000:8000});if(mode==='block')timer(q,0,'技能禁疗');const n=turn(q);assert.equal(n.fighters[0].effects['技能回复量追加'],undefined);assert.equal(n.fighters[1].hp,9000);}
 n.round=4;assert.equal(turn(n,900031).fighters[1].hp,8000);
});
test('3866 2312免粉随机无放回、免异常不补抽、MISS仍追加',()=>{
 const q=make(e(2312),{hp:8000});q.fighters[1].build.resistance.percent=100;const n=turn(q);assert.equal(n.fighters[1].hp,9000);assert.equal(Object.keys(n.fighters[1].ailments).length,2);assert.ok(Object.values(n.fighters[1].ailments).every(v=>v===2||v===3));timer(q,1,'免异常');assert.deepEqual(turn(q).fighters[1].ailments,{});
 const s=turn(make(e(2312),{hp:8000}));s.moveDefinitions[key(900030)].alwaysHit=false;s.moveDefinitions[key(900030)].accuracy=0;delete s.fighters[0].effects['攻击必中'];assert.equal(turn(s,900030).fighters[1].hp,7000);
});
test('3866 1469固定百分比增伤、攻击不加、抗性和期限',()=>{
 for(const entry of pick(1469)){const active=turn(make(entry)).fighters[0].effects['固定百分比增伤'];for(const id of [683,977]){const q=make();q.fighters[0].effects['固定百分比增伤']=structuredClone(active);q.moveDefinitions[key(900031)].operations=[{effectId:id,index:0,phase:'afterHit',params:id===683?[100,100]:[3,2],sourceArgs:id===683?[100,100]:[3,2]}];const n=turn(q,900031);assert.equal(9000-n.fighters[1].hp,Math.floor((id===683?100:3000)*(1+entry.params[1]/100)));q.round=4;assert.equal(9000-turn(q,900031).fighters[1].hp,id===683?100:3000);}const q=make();q.fighters[0].effects['固定百分比增伤']=active;const no=make();assert.equal(turn(q).fighters[0].lastAttackDamage,turn(no).fighters[0].lastAttackDamage);}
});
test('3866 2355仅8或10、消回合睡眠2回合与免断免异常',()=>{
 const reg=E.WIKI.effectsEngine.registry[2355];reg.validate([3,8,2]);reg.validate([3,10,2]);assert.throws(()=>reg.validate([3,9,2]));
 const q=turn(make(e(2355)));q.moveDefinitions[key(900031)].operations=[{effectId:180,index:0,phase:'afterHit',params:[],sourceArgs:[]}];timer(q,1,'免弱');const n=turn(q,900031);assert.ok(n.fighters[1].ailments['睡眠']);assert.equal(n.fighters[1].ailments['睡眠'],3);timer(q,1,'protect');assert.equal(turn(q,900031).fighters[1].ailments['睡眠'],undefined);
});
test('3866 1470五档天赋边界由真实第五产生伤害',()=>{
 for(const [iv,power]of [[0,100],[10,100],[11,120],[20,120],[21,140],[25,140],[26,160],[30,160],[31,180]]){const q=make(e(1470));q.fighters[0].build.iv=iv;const n=turn(q);const base=Math.floor(Math.floor(42*power*180/300)/50)+2;const expected=Math.floor(base*1.5*E.typeEffectiveness(q.moveDefinitions[key(33310)].type,q.fighters[1].type,q.typeChart)*.89);assert.equal(n.fighters[0].lastAttackDamage,expected);}
});
test('3866 1251必先199与200边界、1252两档伤害不叠乘',()=>{
 for(const hp of [199,200])assert.equal(turn(make(e(1251),{hp,aStats:{spe:1}})).turns[0].first,hp===199?0:1);
 for(const [hp,mult]of [[4500,1],[4499,2],[3000,2],[2999,3]]){const q=make(e(1252),{hp}),plain=make(e(1252),{hp,omit:true});assert.ok(Math.abs(turn(q).fighters[0].lastAttackDamage-mult*turn(plain).fighters[0].lastAttackDamage)<=mult);}
});
test('3866 844非暴击吸取、暴击不吸与禁疗',()=>{
 const q=make(e(844),{hp:1000}),n=turn(q);assert.equal(n.fighters[0].hp,3250);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,2250);timer(q,0,'必定暴击');assert.equal(turn(q).fighters[0].hp,1000);delete q.fighters[0].effects['必定暴击'];timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,1000);
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3866 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3866,532);assert.equal(o.fighters[0].hp,8960);});}
