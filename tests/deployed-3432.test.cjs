'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3432-battle.cjs');
const e=id=>pick(id)[0];
test('3432 426实测闪避与到期、镜子命中等级视图不改原等级',()=>{
 const q=turn(make(e(426)));q.moveDefinitions[key(900040)].alwaysHit=false;assert.equal(turn(q,900031,900040).fighters[0].hp,9000);q.moveDefinitions[key(900040)].alwaysHit=true;assert.ok(turn(q,900031,900040).fighters[0].hp<9000);q.moveDefinitions[key(900040)].alwaysHit=false;q.fighters[0].effects['概率闪避'].end=1;assert.ok(turn(q,900031,900040).fighters[0].hp<9000);
 const p=make(undefined,{soul:2150});p.fighters[0].soulState.mirrors=3;p.fighters[0].stages.acc=-1;delete p.fighters[0].effects['攻击必中'];p.moveDefinitions[key(900030)].alwaysHit=false;p.moveDefinitions[key(900030)].accuracy=50;for(let seed=0;seed<30;seed++){p.rng=seed;const n=turn(p,900030);assert.ok(n.fighters[0].lastAttackDamage>0);assert.equal(n.fighters[0].stages.acc,-1);}
});
test('3432 871来源最低400期限、冷月定时状态与魂印概率拦截',()=>{
 const n=turn(make(e(871)));assert.equal(n.fighters[0].effects['攻击最低伤害'].start,2);assert.equal(n.fighters[0].effects['攻击最低伤害'].end,3);assert.equal(turn(n,900030).fighters[0].lastAttackDamage,400);const immune=structuredClone(n);immune.fighters[1].counts.attackNullify=1;assert.equal(turn(immune,900030).fighters[0].lastAttackDamage,0);
 const q=make(undefined,{soul:2150,hp:4500});q.celestials=[{name:'寒月',side:0,start:1,end:10}];q.fighters[0].effects['用招异常失败吸取']={start:1,end:3,chance:50,ailment:'麻痹',denominator:3};for(let seed=0;seed<40;seed++){q.rng=seed;assert.equal(turn(q,900031).fighters[1].ailments['麻痹'],undefined);}
});
test('3432 正式本地21招双版本实际配招、基础能力与技能状态',()=>{
 const local=require('../local-species.cjs').species(3432);assert.equal(local.source.storage,'local');assert.equal(local.deployment.scope,'single');assert.equal(E.WIKI.versionSnapshots(local).length,2);
 for(const a of E.WIKI.versionSnapshots(local)){const available=E.WIKI.availableMoves(a),fifth=available.find(x=>x.fifth).id;for(const m of available){const ids=[fifth,m.id,...available.map(x=>x.id)].filter((v,i,l)=>l.indexOf(v)===i).slice(0,5),q=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(q.fighters[0].soulId,a.selectedSoulId);const n=E.resolveTurn(q,[key(m.id),key(m.id)]);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);if(m.id===25653||m.id===29465)assert.equal(n.fighters[0].stages.atk,1);}}
 const invalid=structuredClone(local);invalid.skillVersions[0].moveIds.push(38553);assert.ok(E.WIKI.skillVersionIssues(invalid,true).length);
});
test('3432 2150按最大体力整百分比减伤、回复、500累计与四镜上限',()=>{
 const base=make(undefined,{hp:8000});base.moveDefinitions[key(900040)].power=800;const raw=8000-turn(base,900031,900040).fighters[0].hp;
 const q=make(undefined,{soul:2150,hp:8000});q.moveDefinitions[key(900040)].power=800;const saved=Math.floor(raw*Math.min(.5,Math.floor(raw/90)/100)),n=turn(q,900031,900040);assert.equal(8000-n.fighters[0].hp,raw-saved);assert.equal(n.fighters[0].soulState.mirrorProgress,saved%500);
 const p=make(undefined,{soul:2150,hp:1000});p.moveDefinitions[key(900030)].power=900;const hit=turn(p,900030),damage=hit.fighters[0].lastAttackDamage,gain=Math.min(8000,Math.floor(damage*Math.min(.5,Math.floor(damage/90)/100)));assert.equal(hit.fighters[0].hp,1000+gain);assert.equal(hit.fighters[0].soulState.mirrors,Math.min(4,Math.floor(gain/500)));
 const f=make().fighters[0];E.CELESTIAL_RULES.gain(f,499);assert.equal(f.soulState.mirrors,0);E.CELESTIAL_RULES.gain(f,1);assert.equal(f.soulState.mirrors,1);E.CELESTIAL_RULES.gain(f,10000);assert.equal(f.soulState.mirrors,4);
});
test('3432 2150镜子仅能力视图、对手正等级与镜数下限、命中与速度',()=>{
 const q=make(undefined,{soul:2150,aStats:{spe:100},bStats:{spe:150}});q.fighters[0].soulState.mirrors=3;q.fighters[0].stages.atk=-1;q.fighters[0].stages.acc=-1;q.fighters[1].stages.atk=2;q.fighters[1].stages.spe=1;const n=turn(q,900031);assert.equal(n.fighters[0].stages.atk,-1);assert.equal(n.fighters[0].soulState.mirrorStageView.atk,3);assert.equal(n.fighters[0].soulState.mirrorStageView.spe,3);assert.equal(E.effective(n.fighters[0],'atk'),450);assert.equal(n.turns[0].first,0);const view=E.CELESTIAL_RULES.view(n.fighters[0],n.fighters[1]);assert.equal(view.acc,3);n.fighters[1].stages.atk=6;assert.equal(E.CELESTIAL_RULES.view(n.fighters[0],n.fighters[1]).atk,6);
 const p=make(undefined,{soul:2150});p.fighters[0].stages.atk=-2;assert.equal(turn(p,900031).fighters[0].soulState.mirrorStageView.atk,-2);
});
test('3432 2150零镜清附属、有镜随机转移保留时长与30%回复PP',()=>{
 const q=make(undefined,{soul:2150,hp:4500});q.fighters[1].ailments={'星赐':5,'烧伤':5};let n=turn(q,900031);assert.equal(n.fighters[1].ailments['星赐'],undefined);assert.ok(n.fighters[1].ailments['烧伤']);assert.equal(n.fighters[0].ailments['星赐'],undefined);
 q.fighters[0].soulState.mirrors=1;q.fighters[0].pp[key(900030)]=1;n=turn(q,900031);assert.equal(n.fighters[1].ailments['星赐'],undefined);assert.equal(n.fighters[0].ailments['星赐'],5);assert.equal(n.fighters[0].hp,7200);assert.equal(n.fighters[0].pp[key(900030)],4);assert.equal(n.fighters[0].pp[key(900031)],99);
 const p=make(undefined,{soul:2150,hp:4500});p.fighters[0].soulState.mirrors=4;p.fighters[1].ailments={'星赐':5,'星哲':5};n=turn(p,900031);assert.equal(n.fighters[1].ailments['星赐'],undefined);assert.equal(n.fighters[1].ailments['星哲'],undefined);assert.equal(n.fighters[0].hp,9000);
});
test('3432 2150高体重复失败的异常执行、数量不同清自己并批量附加月',()=>{
 const q=make(undefined,{soul:2150,hp:6000});q.fighters[0].ailments={'烧伤':4,'冻伤':4};q.moveDefinitions[key(900041)].operations=[{effectId:10,index:0,phase:'afterHit',params:{chance:0},sourceArgs:[0],statusDeclarations:[{name:'麻痹',chance:0}]}];const n=turn(q,900031);assert.ok(n.fighters[1].ailments['麻痹']);assert.equal(n.fighters[0].ailments['烧伤'],undefined);assert.equal(n.fighters[0].ailments['冻伤'],undefined);assert.equal(n.celestials.find(x=>x.name==='没夜之月').end,4);
 const equal=make(undefined,{soul:2150,hp:4500});equal.fighters[0].ailments={'烧伤':4};const out=turn(equal,900031);assert.ok(out.fighters[0].ailments['烧伤']);assert.equal(out.celestials?.length??0,0);
});
test('3432 2579双方减时各自触发、最后一回合清除与两边失败加月',()=>{
 const q=make(e(2579));q.fighters[0].ailments={'烧伤':3};let n=turn(q);assert.equal(n.fighters[0].ailments['烧伤'],2);assert.ok(n.fighters[1].ailments['冰封']);assert.equal(n.fighters[1].ailments['害怕'],undefined);
 const p=make(e(2579));p.fighters[1].ailments={'烧伤':1};n=turn(p);assert.equal(n.fighters[1].ailments['烧伤'],undefined);assert.ok(n.fighters[1].ailments['害怕']);assert.equal(n.fighters[1].ailments['冰封'],undefined);
 const none=make(e(2579));none.fighters[0].soulState.mirrors=4;n=turn(none);assert.equal(n.celestials[0].name,'没夜之月');assert.equal(n.celestials[0].end,5);assert.equal(n.celestials[0].side,1);
});
test('3432 2578三种月转移保留剩余、原方清魇昧与空场失败',()=>{
 const q=make(e(2578));q.celestials=[{name:'寒月',side:1,start:1,end:9,suspendedUntil:5},{name:'血月',side:1,start:1,end:8,suspendedUntil:5},{name:'没夜之月',side:1,start:1,end:7}];q.fighters[1].ailments['魇昧']=9;const n=turn(q);assert.ok(n.celestials.every(x=>x.side===0));assert.equal(n.celestials.find(x=>x.name==='寒月').end,9);assert.equal(n.celestials.find(x=>x.name==='没夜之月').end,7);assert.equal(n.fighters[1].ailments['魇昧'],undefined);assert.equal(turn(make(e(2578))).celestials.length,0);
});
test('3432 没夜之月加长取最大、每回合魇昧与消失清理及非限制拦截',()=>{
 const q=make(undefined,{soul:748});E.CELESTIAL_RULES.add(q,'没夜之月',1,3,1);E.CELESTIAL_RULES.add(q,'没夜之月',1,2,1);assert.equal(q.celestials[0].end,3);q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];let n=turn(q,900031);assert.equal(n.fighters[1].ailments['魇昧'],3);assert.equal(n.fighters[0].ailments['害怕'],undefined);n=turn(n,900031);n=turn(n,900031);assert.equal(n.celestials.length,0);assert.equal(n.fighters[1].ailments['魇昧'],undefined);
 const s=make();E.CELESTIAL_RULES.add(s,'没夜之月',0,4,1);s.fighters[0].ailments['魇昧']=5;E.CELESTIAL_RULES.remove(s,s.celestials[0],(side,k)=>delete s.fighters[side].ailments[k]);assert.equal(s.fighters[0].ailments['魇昧'],undefined);
});
test('3432 寒月低体与血月高体转移、同方全部暂停三回合',()=>{
 const q=make(undefined,{hp:1000,targetHp:8000});q.celestials=[{name:'寒月',side:1,start:1,end:20},{name:'血月',side:0,start:1,end:20}];const n=turn(q,900031);assert.equal(n.celestials.find(x=>x.name==='寒月').side,0);assert.equal(n.celestials.find(x=>x.name==='血月').side,0);assert.equal(n.celestials[0].suspendedUntil,3);assert.equal(E.CELESTIAL_RULES.probability(n,n.fighters[0],50,2),50);assert.equal(E.CELESTIAL_RULES.probability(n,n.fighters[0],50,4),0);
 const p=make(undefined,{hp:1000,targetHp:8000});p.celestials=[{name:'血月',side:0,start:1,end:10}];assert.equal(turn(p,900031).celestials[0].side,1);
});
test('3432 寒月不高于50%状态附加归零，高概率保留与失败补偿',()=>{
 const q=make({moveId:10150,index:0});q.celestials=[{name:'寒月',side:0,start:1,end:10}];for(let seed=0;seed<40;seed++){q.rng=seed;assert.equal(turn(q).fighters[1].ailments['冻伤'],undefined);}
 const p=make(e(1231));p.celestials=[{name:'寒月',side:0,start:1,end:10}];assert.ok(turn(p).fighters[1].ailments['害怕']);
 const t=make(e(1040));t.moveDefinitions[key(t.auditMoveId)].operations[0].params=[50,44,1];t.moveDefinitions[key(t.auditMoveId)].operations[0].statusDeclarations=[{name:'魇昧',chance:50}];t.celestials=[{name:'寒月',side:0,start:1,end:10}];for(let seed=0;seed<20;seed++){t.rng=seed;const n=turn(t);assert.equal(n.fighters[1].ailments['魇昧'],undefined);assert.ok(Object.values(n.fighters[0].stages).every(x=>x===1));}
});
test('3432 2577五回合双方自然冰封结束归零、提前解除和期限',()=>{
 const q=make(e(2577));q.fighters[1].ailments['魇昧']=5;q.fighters[0].ailments['冰封']=1;let n=turn(q);assert.equal(n.iceExpiryUntil,undefined);
 q.fighters[0].ailments={};n=turn(q);assert.equal(n.iceExpiryUntil,5);n.fighters[0].ailments['冰封']=2;n.fighters[1].ailments['冰封']=2;n=turn(n,900031);assert.equal(n.fighters[0].hp,0);assert.equal(n.fighters[1].hp,0);
 const p=turn(make(e(2577)));assert.equal(p.iceExpiryUntil,undefined);const early=make(e(2579));early.iceExpiryUntil=5;early.fighters[1].ailments['冰封']=1;assert.ok(turn(early).fighters[1].hp>0);
 const last=make();last.iceExpiryUntil=1;last.fighters[1].ailments['冰封']=1;assert.equal(turn(last,900031).fighters[1].hp,0);const expired=make();expired.iceExpiryUntil=0;expired.fighters[1].ailments['冰封']=1;assert.ok(turn(expired,900031).fighters[1].hp>0);
});
test('3432 2590按镜数吸取增当次伤害、无递增、禁疗与抗性',()=>{
 for(const count of [0,4]){const q=make(e(2590),{hp:1000});q.fighters[0].soulState.mirrors=count;const n=turn(q),amount=9000*(.25+count*.05);assert.equal(n.fighters[0].hp,1000+amount);assert.equal(9000-n.fighters[1].hp,amount+n.fighters[0].lastAttackDamage);const again=structuredClone(q);again.fighters[0].soulState.skillUses={[key(q.auditMoveId)]:10};assert.equal(turn(again).fighters[0].hp,n.fighters[0].hp);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,1000);q.fighters[1].build.resistance.percent=100;const resistant=turn(q);assert.equal(9000-resistant.fighters[1].hp,resistant.fighters[0].lastAttackDamage);}
});
test('3432 1040精确魇昧枚举、免疫补偿与其他枚举拒绝',()=>{
 const x=pick(1040)[0],q=make(x);assert.ok(turn(q).fighters[1].ailments['魇昧']);timer(q,1,'免异常');assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===1));for(const id of [21,22,43,45])assert.throws(()=>E.WIKI.effectsEngine.registry[1040].validate([100,id,1]));assert.doesNotThrow(()=>E.WIKI.effectsEngine.registry[1040].validate([100,44,1]));
});
test('3432 全部21招基础PP伤害、控制、封招和非必中MISS',()=>{
 for(const m of source.moves){const q=make({moveId:m.id,index:null},{omit:true}),n=turn(q);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);q.fighters[0].ailments['疲惫']=2;assert.equal(turn(q).fighters[0].pp[key(m.id)],m.pp);q.fighters[0].ailments={};timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(!m.alwaysHit){const p=make({moveId:m.id,index:null},{omit:true,hit:false});p.moveDefinitions[key(m.id)].accuracy=0;assert.equal(turn(p).fighters[1].hp,9000);}}
});
test('3432 原版17招真实来源ID与原魂印版本配招执行',()=>{
 const a=structuredClone(source);a.selectedSoulId=748;a.selectedSkillVersion='original';const ids=E.WIKI.availableMoves(a).map(m=>m.id);assert.equal(ids.length,17);assert.equal(ids.includes(38553),false);
 for(const id of ids){const move=a.moves.find(m=>m.id===id),load=[31091,id,...ids].filter((x,i,l)=>l.indexOf(x)===i).slice(0,5),q=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[load,load],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(q.fighters[0].soulId,748);assert.equal(q.fighters[0].pp[key(id)],move.pp);const n=E.resolveTurn(q,[key(id),key(id)]);assert.equal(n.fighters[0].pp[key(id)],move.pp-1);if(move.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);}
});
test('3432 2504忽略正先制仅命中消费、负先制和必先保持',()=>{
 const q=make(e(2504));q.moveDefinitions[key(900040)].priority=5;const n=turn(q,undefined,900040);assert.equal(n.turns[0].first,0);assert.equal(n.fighters[0].soulState.ignorePositivePriorityConsumed[key(q.auditMoveId)],true);assert.equal(turn(n,undefined,900040).turns[1].first,1);
 const p=make(e(2504),{hit:false});p.moveDefinitions[key(p.auditMoveId)].alwaysHit=false;p.moveDefinitions[key(p.auditMoveId)].accuracy=0;p.moveDefinitions[key(900040)].priority=5;const miss=turn(p,undefined,900040);assert.equal(miss.turns[0].first,0);assert.equal(miss.fighters[0].soulState.ignorePositivePriorityConsumed,undefined);assert.equal(turn(miss,undefined,900040).turns[1].first,0);
 const negative=make(e(2504));negative.moveDefinitions[key(negative.auditMoveId)].priority=-1;negative.moveDefinitions[key(900040)].priority=-2;assert.equal(turn(negative,undefined,900040).turns[0].first,0);timer(q,1,'攻击必定先手');assert.equal(turn(q,undefined,900040).turns[0].first,1);
});
test('3432 2001需目标强化、清回合与冰封独立、显式三回合',()=>{
 const q=make(e(2001));timer(q,1,'免弱');assert.equal(turn(q).fighters[1].ailments['冰封'],undefined);assert.ok(turn(q).fighters[1].effects['免弱']);q.fighters[1].stages.atk=1;const n=turn(q);assert.equal(n.fighters[1].effects['免弱'],undefined);assert.equal(n.fighters[1].ailments['冰封'],3);timer(q,1,'protect');const protectedRound=turn(q);assert.ok(protectedRound.fighters[1].effects['免弱']);assert.equal(protectedRound.fighters[1].ailments['冰封'],3);timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['冰封'],undefined);
});
test('3432 原魂印当前体力半数伤害阈值、严格边界和固定伤害不减',()=>{
 const base=make(),damage=9000-turn(base,900031,900040).fighters[0].hp;
 for(const hp of [damage*2,damage*2-1]){const q=make(undefined,{soul:748,hp}),n=turn(q,900031,900040);assert.equal(hp-n.fighters[0].hp,hp===damage*2?damage:Math.floor(damage/2));}
 const q=make(undefined,{soul:748,hp:1000});const real=require('../local-species.cjs').species(3879);q.moveDefinitions[key(900041)].operations=E.WIKI.compile(real.moves.find(m=>m.id===10040),real).operations;assert.equal(turn(q,900031).fighters[0].hp,970);
});
test('3432 原魂印低体先制双倍伤害吸血、半血不触发和MISS',()=>{
 const q=make(undefined,{soul:748,hp:4499,aStats:{spe:1}}),n=turn(q,900030,900040);assert.equal(n.turns[0].first,0);const ref=turn(make(undefined,{hp:4499}),900030);assert.ok(Math.abs(n.fighters[0].lastAttackDamage-ref.fighters[0].lastAttackDamage*2)<=2);
 const alone=turn(q,900030);assert.equal(alone.fighters[0].hp,4499+Math.floor(alone.fighters[0].lastAttackDamage/2));const equal=make(undefined,{soul:748,hp:4500,aStats:{spe:1}});assert.equal(turn(equal,900030,900040).turns[0].first,1);assert.equal(turn(equal,900030).fighters[0].hp,4500);
 delete q.fighters[0].effects['攻击必中'];q.moveDefinitions[key(900030)].alwaysHit=false;q.moveDefinitions[key(900030)].accuracy=0;assert.equal(turn(q,900030).fighters[0].hp,4499);
});
test('3432 原魂印回合末高体反弹、半血边界及不刷新时到期',()=>{
 const q=turn(make(undefined,{soul:748}),900031);assert.equal(q.fighters[0].effects.reflect.end,2);q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q,900031);assert.equal(n.fighters[0].ailments['害怕'],undefined);assert.ok(n.fighters[1].ailments['害怕']);
 assert.equal(turn(make(undefined,{soul:748,hp:4500}),900031).fighters[0].effects.reflect,undefined);q.fighters[0].hp=4500;const end=turn(q,900031);assert.equal(end.fighters[0].effects.reflect,undefined);
});
test('3432 原版4和5所有能力实例、免疫和六级边界',()=>{
 for(const id of [4,5])for(const x of pick(id)){const q=make(x),side=id===4?0:1,k=keys[x.params[0]];assert.equal(turn(q).fighters[side].stages[k],x.params[2]);timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[k],0);delete q.fighters[side].effects[id===4?'禁强化':'免弱'];q.fighters[side].stages[k]=id===4?6:-6;assert.equal(turn(q).fighters[side].stages[k],id===4?6:-6);}
});
test('3432 14冻伤与15害怕真实概率、独立2或3回合和免疫',()=>{
 for(const id of [14,15])for(const x of pick(id)){const name=id===14?'冻伤':'害怕',ends=new Set();let yes=0,no=0;for(let seed=0;seed<80;seed++){const q=make(x,{seed}),n=turn(q);if(n.fighters[1].ailments[name]){yes++;ends.add(n.fighters[1].ailments[name]);}else no++;timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments[name],undefined);}assert.ok(yes);if(x.params[0]<100)assert.ok(no);assert.deepEqual([...ends].sort(),[2,3]);}
});
test('3432 2低体增威、928清回合免疫和191异常反弹',()=>{
 const q=make(e(2),{targetHp:4499});assert.ok(turn(q).fighters[0].lastAttackDamage>turn(make(e(2),{targetHp:4500})).fighters[0].lastAttackDamage*1.8);
 for(const x of pick(928)){const q=make(x);timer(q,1,'免弱');assert.equal(turn(q).fighters[0].counts.immune,1);assert.equal(turn(make(x)).fighters[0].counts.immune,undefined);timer(q,1,'protect');assert.equal(turn(q).fighters[0].counts.immune,undefined);}
 const p=make(e(191));p.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(p);assert.equal(n.fighters[0].ailments['害怕'],undefined);assert.ok(n.fighters[1].ailments['害怕']);
});
test('3432 1231害怕成功失败百分比伤害与693后续伤害期限',()=>{
 const q=make(e(1231));assert.ok(turn(q).fighters[1].ailments['害怕']);timer(q,1,'免异常');assert.equal(turn(q).fighters[1].hp,6000);q.fighters[1].build.resistance.percent=100;assert.equal(turn(q).fighters[1].hp,9000);
 const n=turn(make(e(693)));assert.equal(n.fighters[0].effects.id913.start,2);assert.equal(n.fighters[0].effects.id913.end,3);
});
test('3432 1235闪避成功与失败清正PP、必中和期限',()=>{
 let yes=0,no=0;for(let seed=0;seed<60;seed++){const q=make(e(1235),{seed}),n=turn(q);n.moveDefinitions[key(900040)].alwaysHit=false;n.moveDefinitions[key(900040)].accuracy=100;const z=turn(n,900031,900040);if(z.fighters[0].hp===9000)yes++;else no++;}assert.ok(yes&&no);
 const p=turn(make(e(1235)));p.fighters[1].pp[key(900042)]=0;const n=turn(p,900031,900040);assert.equal(Object.values(n.fighters[1].pp).filter(x=>x===0).length,2);
});
test('3432 877先手强化、1001异常翻倍和971低体双吸边界',()=>{
 const q=make(e(877));q.moveDefinitions[key(q.auditMoveId)].priority=0;assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===1));q.fighters[0].stats.spe=1;assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===0));
 for(const x of pick(1001)){const p=make(x);assert.ok(Object.values(turn(p).fighters[0].stages).every(v=>v===1));p.fighters[1].ailments['烧伤']=3;assert.ok(Object.values(turn(p).fighters[0].stages).every(v=>v===2));timer(p,0,'禁强化');assert.ok(Object.values(turn(p).fighters[0].stages).every(v=>v===0));}
 for(const x of pick(971))for(const hp of [4499,4500]){const p=make(x,{hp}),n=turn(p);assert.equal(n.fighters[1].hp,hp===4499?3000:6000);assert.equal(n.fighters[0].hp,hp===4499?9000:7500);timer(p,0,'技能禁疗');assert.equal(turn(p).fighters[0].hp,hp);}
});
test('3432 843先制期限、881自身弱化先制与1232反弱同步',()=>{
 for(const x of pick(843)){const n=turn(make(x));assert.equal(n.fighters[0].effects.id984.start,2);assert.equal(n.fighters[0].effects.id984.end,3);assert.equal(n.fighters[0].effects.id984.amount,2);}
 const q=make(e(881),{aStats:{spe:1}});assert.equal(turn(q,undefined,900040).turns[0].first,1);q.fighters[0].stages.atk=-1;assert.equal(turn(q,undefined,900040).turns[0].first,0);
 for(const x of pick(1232)){const p=make(x);p.fighters[0].stages.atk=-2;const n=turn(p);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[1].stages.atk,-2);timer(p,0,'弱化不可解除反转');assert.equal(turn(p).fighters[0].stages.atk,-2);}
});
test('3432 760不微弱、1061反强复制和1048目标异常增伤',()=>{
 const q=make(e(760));q.fighters[1].type='冰';q.typeChart.rows['冰']['冰']=.5;q.typeChart.rows['暗影']['冰']=.5;const n=turn(q),plain=structuredClone(q);plain.moveDefinitions[key(plain.auditMoveId)].operations=[];assert.ok(n.fighters[0].lastAttackDamage>turn(plain).fighters[0].lastAttackDamage*1.8);
 for(const x of pick(1061)){const p=make(x);p.fighters[1].stages.atk=2;const n=turn(p);assert.equal(n.fighters[1].stages.atk,-2);assert.equal(n.fighters[0].stages.atk,2);assert.equal(turn(make(x)).fighters[0].stages.atk,0);}
 const p=make(e(1048)),base=turn(p).fighters[0].lastAttackDamage;p.fighters[1].ailments['麻痹']=3;assert.ok(Math.abs(turn(p).fighters[0].lastAttackDamage-base*1.5)<=2);
});
test('3432 原第五1233递增吸取上限、零伤抗性和禁疗',()=>{
 let q=make(e(1233),{hp:1000});for(const expected of [1800,2700,3600,3600]){q.fighters[1].hp=9000;q.fighters[0].hp=1000;const n=turn(q);assert.equal(n.fighters[0].hp,1000+expected);q=n;}const p=make(e(1233),{hp:1000});timer(p,0,'技能禁疗');assert.equal(turn(p).fighters[0].hp,1000);p.fighters[1].build.resistance.percent=100;assert.equal(turn(p).fighters[1].hp,9000-turn(p).fighters[0].lastAttackDamage);
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3432 31091效果1061公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-1061-reversal-path.cjs')(3432,31091);assert.ok(o.fighters[0].hp>0);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3432 38553效果1061公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-1061-reversal-path.cjs')(3432,38553);assert.ok(o.fighters[0].hp>0);});}
