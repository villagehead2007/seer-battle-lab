'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3516-battle.cjs');const e=id=>pick(id)[0];
test('3516 4和5所有能力实例、免疫和六级边界',()=>{for(const id of [4,5])for(const x of pick(id)){const q=make(x),side=id===4?0:1,k=keys[x.params[0]];assert.equal(turn(q).fighters[side].stages[k],x.params[2]);timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[k],0);delete q.fighters[side].effects[id===4?'禁强化':'免弱'];q.fighters[side].stages[k]=id===4?6:-6;assert.equal(turn(q).fighters[side].stages[k],id===4?6:-6);}});
test('3516 15害怕真实概率、默认2或3及免疫',()=>{let yes=0,no=0;const ends=new Set();for(let seed=0;seed<200;seed++){const q=make(e(15),{seed}),n=turn(q);if(n.fighters[1].ailments['害怕']){yes++;ends.add(n.fighters[1].ailments['害怕']);}else no++;timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);}assert.ok(yes&&no);assert.deepEqual([...ends].sort(),[2,3]);});
test('3516 605低于对手附加失血50%粉伤、相等边界和抗性',()=>{const q=make(e(605),{hp:1000}),n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,4000);q.fighters[1].hp=1000;const z=turn(q);assert.equal(1000-z.fighters[1].hp,z.fighters[0].lastAttackDamage);q.fighters[1].hp=9000;q.fighters[1].build.resistance.percent=100;const a=turn(q);assert.equal(9000-a.fighters[1].hp,a.fighters[0].lastAttackDamage);});
test('3516 889清回合石化与1052清强全1成功失败保护',()=>{for(const x of pick(889)){const q=make(x);timer(q,1,'免弱');assert.ok(turn(q).fighters[1].ailments['石化']);assert.equal(turn(make(x)).fighters[1].ailments['石化'],undefined);timer(q,1,'protect');assert.equal(turn(q).fighters[1].ailments['石化'],undefined);}for(const x of pick(1052)){const q=make(x);q.fighters[1].stages.atk=2;const n=turn(q);assert.equal(n.fighters[1].stages.atk,0);assert.ok(Object.values(n.fighters[0].stages).every(x=>x===1));assert.equal(turn(make(x)).fighters[0].stages.atk,0);timer(q,1,'幽蝶强化保护');assert.equal(turn(q).fighters[0].stages.atk,0);}});
test('3516 1280当前体力20至40递增封顶与免疫',()=>{let q=make(e(1280),{hp:1000});for(const amount of [200,300,400,400]){q.fighters[1].hp=9000;const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,amount);q=n;}const p=make(e(1280));p.fighters[1].build.resistance.percent=100;const n=turn(p);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage);});
test('3516 1281消耗全部盾、300上下边界、实际回血粉伤与禁疗',()=>{for(const shield of [0,299,300,301]){const q=make(e(1281),{hp:1000});q.fighters[0].suitState.shield=shield;const n=turn(q),heal=shield>0&&shield<300?3000:0,pink=shield>300?3000:heal;assert.equal(n.fighters[0].suitState.shield,0);assert.equal(n.fighters[0].hp,1000+heal);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,shield+pink);}const q=make(e(1281),{hp:1000});q.fighters[0].suitState.shield=100;timer(q,0,'技能禁疗');const n=turn(q);assert.equal(n.fighters[0].hp,1000);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,100);});
test('3516 1626后手按当回合盾承伤40%反弹、先手无追加',()=>{const q=make(e(1626),{aStats:{spe:1}});q.fighters[0].suitState.shield=3000;const n=turn(q,undefined,900040),shield=3000-n.fighters[0].suitState.shield;assert.ok(shield>0);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,Math.floor(shield*.4));q.fighters[0].stats.spe=500;const z=turn(q,undefined,900040);assert.equal(9000-z.fighters[1].hp,z.fighters[0].lastAttackDamage);});
test('3516 1803技能无效低半翻倍高半延长、正常命中不触发',()=>{for(const hp of [4499,4500,4501]){const q=make(e(1803),{hp});timer(q,0,'attackBlock');const n=turn(q);assert.equal(n.fighters[0].hp,hp+(hp<4500?4501:3000));assert.equal(n.fighters[1].effects['属性技能命中效果失效'].start,2);assert.equal(n.fighters[1].effects['属性技能命中效果失效'].end,hp>4500?4:3);}assert.equal(turn(make(e(1803),{hp:1000})).fighters[0].hp,1000);});
test('3516 1752护盾消失吸取和随机两正PP归零、不破不触发',()=>{const q=turn(make(e(1752),{hp:1000}));assert.equal(q.fighters[0].suitState.shield,400);assert.equal(q.fighters[0].hp,1000);q.moveDefinitions[key(900040)].power=2000;const n=turn(q,900031,900040);assert.equal(n.fighters[0].soulState.shieldGoneDrain,undefined);assert.equal(Object.values(n.fighters[1].pp).filter(v=>v===0).length,2);assert.equal(n.fighters[1].hp,8700);});
test('3516 2320逐次防速弱化、失败下回合封攻与四回合期限',()=>{const q=make(e(2320)),n=turn(q);assert.equal(n.fighters[1].stages.def,-1);assert.equal(n.fighters[1].stages.spe,-1);assert.equal(n.fighters[0].effects['用招弱化失败封攻'].end,4);timer(q,1,'免弱');const z=turn(q);assert.equal(z.fighters[1].effects.attackBlock.start,2);assert.equal(z.fighters[1].effects.attackBlock.end,2);assert.equal(turn(z,900031,900040).fighters[0].hp,9000);});
test('3516 1077两版使用攻击后害怕或石化、免异常失败封属',()=>{for(const x of pick(1077)){const q=make(x),n=turn(q,undefined,900040),name=x.params[1]===6?'害怕':'石化';assert.ok(n.fighters[1].ailments[name]);assert.equal(n.fighters[0].effects['攻击后必异常'].end,x.params[0]);timer(q,1,'免异常');const z=turn(q,undefined,900040);assert.equal(z.fighters[1].ailments[name],undefined);assert.equal(z.fighters[1].effects['属性技能命中效果失效'].start,2);assert.equal(z.fighters[1].effects['属性技能命中效果失效'].end,3);}});

test('3516 两版回合初魂印盾按来源刷新、其他来源叠加且无强化按理论新增400',()=>{
 for(const [soul,amount] of [[828,300],[1985,400]]){let q=make(undefined,{soul});q.fighters[0].stages.atk=1;q.fighters[0].suitState.shield=50;let n=turn(q,900031);assert.equal(n.fighters[0].suitState.shield,50+amount);n=turn(n,900031);assert.equal(n.fighters[0].suitState.shield,50+amount);const p=make(undefined,{soul,hp:1000});p.fighters[1].build.resistance.percent=100;p.fighters[0].suitState.shield=25;const a=turn(p,900031);assert.equal(a.fighters[0].hp,4000);assert.equal(a.fighters[1].hp,9000);assert.equal(a.fighters[0].suitState.shield,425);assert.equal(turn(a,900031).fighters[0].suitState.shield,825);}
});

test('3516 两版破盾粉伤、普通消耗不算击破与2318主动消耗视为击破',()=>{
 for(const soul of [828,1985]){const q=make(undefined,{soul});q.fighters[0].stages.atk=1;q.moveDefinitions[key(900040)].power=2000;const n=turn(q,900031,900040);assert.equal(n.fighters[1].hp,6000);assert.equal(n.fighters[0].suitState.shield,0);const p=make(e(1281),{soul});p.fighters[0].stages.atk=1;const z=turn(p);assert.equal(z.fighters[0].soulState.rhNextUseReduction,undefined);assert.equal(z.fighters[0].soulState.rhNextReduction,undefined);}
 const p=make(e(2318),{soul:1985});p.fighters[0].stages.atk=1;const n=turn(p);assert.equal(n.fighters[0].suitState.shield,0);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,3440);assert.equal(n.fighters[0].soulState.rhNextReduction,true);
 for(const shield of [0,399,400,799,800]){const q=make(e(2318));q.fighters[0].suitState.shield=shield;const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,shield+Math.floor(shield/400)*40);}
});

test('3516 828下次对手攻击所在整回合减伤、1985仅下一击及粉伤不减',()=>{
 for(const soul of [828,1985]){const q=make(undefined,{soul});q.fighters[0].stages.atk=1;q.fighters[0].soulState[soul===828?'rhNextUseReduction':'rhNextReduction']=true;const baseline=structuredClone(q);delete baseline.fighters[0].soulState.rhNextUseReduction;delete baseline.fighters[0].soulState.rhNextReduction;q.moveDefinitions[key(900040)].power=2000;baseline.moveDefinitions[key(900040)].power=2000;const n=turn(q,900031,900040),z=turn(baseline,900031,900040);assert.ok(n.fighters[0].hp>z.fighters[0].hp);assert.equal(soul===828?n.fighters[0].soulState.rhReductionRound:n.fighters[0].soulState.rhNextReduction,soul===828?1:true);}
 const q=make(undefined,{soul:828});q.fighters[0].stages.atk=1;q.fighters[0].soulState.rhNextUseReduction=true;q.moveDefinitions[key(900040)].operations=E.WIKI.compile(source.moves.find(x=>x.id===31526),source).operations;q.fighters[1].hp=1000;q.moveDefinitions[key(900040)].power=0;const n=turn(q,900031,900040);assert.equal(n.fighters[0].hp,5000);assert.equal(n.fighters[0].suitState.shield,300);
});

test('3516 1985消强吸强加封邪和400盾、反转不触发及四层封顶',()=>{
 const raw=require('../local-species.cjs').species(3883),clear=source.moves.find(x=>x.effectIds.includes(1052)),steal=raw.moves.find(x=>x.effectIds.includes(1180));for(const mode of ['clear','steal']){const q=make(undefined,{soul:1985});q.fighters[0].stages.atk=2;const sourceMove=mode==='clear'?clear:steal;q.moveDefinitions[key(900041)].operations=E.WIKI.compile(sourceMove,mode==='clear'?source:raw).operations.filter(x=>x.effectId===(mode==='clear'?1052:1180));const n=turn(q,900031);assert.equal(n.fighters[0].soulState.sealLayers,1);assert.equal(n.fighters[0].suitState.shield,800);q.fighters[0].soulState.sealLayers=4;assert.equal(turn(q,900031).fighters[0].soulState.sealLayers,4);}
 const q=make(undefined,{soul:1985});q.fighters[0].stages.atk=-1;assert.equal(turn(q,900031).fighters[0].soulState.sealLayers,undefined);
});

test('3516 1985高粉伤按剩余盾回血、严格1/3边界及无盾不回',()=>{
 for(const [damage,shield] of [[3000,500],[3001,500],[3001,0]]){const q=make(undefined,{soul:1985});q.fighters[0].stages.atk=1;q.fighters[0].soulState.attackShield=shield;if(shield===0)q.fighters[0].suitState.shield=0;q.moveDefinitions[key(900041)].operations=[{effectId:29,index:0,phase:'afterHit',params:{damage},sourceArgs:[damage]}];const n=turn(q,900031);const taken=damage;assert.equal(n.fighters[0].hp,9000-taken+(taken>3000&&shield>0?shield+400:0));assert.equal(n.fighters[0].soulState.attackShield,shield);}
});

test('3516 封邪至少一层受击后按盾值清对手盾、MISS免攻不触发',()=>{
 for(const layers of [0,1]){const q=make(undefined,{soul:1985});q.fighters[0].stages.atk=1;q.fighters[0].soulState.sealLayers=layers;q.fighters[1].suitState.shield=1000;const n=turn(q,900031,900040);assert.equal(n.fighters[1].suitState.shield,layers?0:1000);q.fighters[0].counts.attackNullify=1;assert.equal(turn(q,900031,900040).fighters[1].suitState.shield,1000);}
});

test('3516 留魂之蛊每只每回合一次、真实汲取理论回复、满血不触发及4只上限',()=>{
 const q=make(undefined,{soul:1985,hp:1000,targetHp:1000});q.fighters[0].stages.atk=1;q.fighters[1].soulState.soulGu=[{sourceSide:0,usedRound:0},{sourceSide:0,usedRound:0}];q.moveDefinitions[key(900041)].operations=[{effectId:43,index:0,phase:'afterHit',params:{fraction:1/3},sourceArgs:[3]},{effectId:43,index:1,phase:'afterHit',params:{fraction:1/3},sourceArgs:[3]}];const n=turn(q,900031);assert.equal(n.fighters[1].hp,6920);assert.equal(n.fighters[0].hp,1080);assert.equal(n.fighters[1].soulState.soulGu.length,3);assert.ok(n.fighters[1].soulState.soulGu.slice(0,2).every(x=>x.usedRound===1));q.fighters[1].hp=9000;assert.equal(turn(q,900031).fighters[0].hp,1000);q.fighters[1].soulState.soulGu=Array.from({length:4},()=>({sourceSide:0,usedRound:0}));assert.equal(turn(q,900031).fighters[1].soulState.soulGu.length,4);
});

test('3516 2319面板双防忽略能力等级、四蛊加成及零粉伤补偿封邪蛊',()=>{
 for(const count of [0,1,4]){const q=make(e(2319));q.fighters[0].stages.def=6;q.fighters[0].stages.spd=6;q.fighters[1].soulState.soulGu=Array.from({length:count},()=>({sourceSide:0,usedRound:0}));const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,120+count*30);assert.equal(n.fighters[0].soulState.sealLayers,undefined);q.fighters[1].build.resistance.percent=100;const z=turn(q);assert.equal(z.fighters[0].soulState.sealLayers,1);assert.equal(z.fighters[1].soulState.soulGu.length,Math.min(4,count+1));q.fighters[0].soulState.sealLayers=4;assert.equal(turn(q).fighters[1].soulState.soulGu.length,4);}
});

test('3516 两版减伤多段消费差异、免攻不损盾不误触发',()=>{
 const raw=require('../local-species.cjs').species(2988),ops=E.WIKI.compile(raw.moves.find(x=>x.id===10022),raw).operations;const blocks={};for(const soul of [828,1985]){const q=make(undefined,{soul,seed:4});q.fighters[0].stages.atk=1;q.fighters[0].suitState.shield=100000;q.fighters[0].soulState[soul===828?'rhNextUseReduction':'rhNextReduction']=true;q.moveDefinitions[key(900040)].operations=ops;const n=turn(q,900031,900040);blocks[soul]=n.turns[0].events.filter(x=>x.text.includes('护盾抵挡')&&x.text.includes('攻击伤害')).map(x=>Number(x.text.match(/抵挡 (\d+)/)[1]));assert.ok(blocks[soul].length>=2);const p=make(undefined,{soul});p.fighters[0].stages.atk=1;p.fighters[0].counts.attackNullify=1;const z=turn(p,900031,900040);assert.equal(z.fighters[0].suitState.shield,soul===828?300:400);assert.equal(z.fighters[1].hp,9000);}
 assert.equal(blocks[828][0],blocks[1985][0]);assert.ok(blocks[1985][1]>blocks[828][1]*1.7);
});

test('3516 2105精确参数授权、版本参数位置原文和缺确认拒绝',()=>{
 const m=source.moves.find(x=>x.id===38009),meta=source.effects.find(x=>x.id===2105),inst=m.effectInstances[2],accept=E.WIKI.effectsEngine.acceptsSourceParameterConflict;assert.ok(accept(m,2,inst,meta));for(const mutate of [x=>x.hash='changed',x=>delete x.sourceParameterConfirmation,x=>x.sourceParameterConfirmation.petHash='changed']){const n=structuredClone(m);mutate(n);assert.equal(accept(n,2,inst,meta),false);}assert.equal(accept(m,1,inst,meta),false);assert.equal(accept(m,2,{...inst,args:[]},meta),false);assert.equal(accept(m,2,{...inst,description:'changed'},meta),false);assert.equal(accept(m,2,inst,{...meta,revision:'changed'}),false);
});

test('3516 正式本地双版本21招加载配招魂印和实际技能状态',()=>{
 const local=require('../local-species.cjs').species(3516);assert.equal(local.source.storage,'local');assert.equal(local.deployment.scope,'single');assert.equal(E.WIKI.versionSnapshots(local).length,2);for(const a of E.WIKI.versionSnapshots(local)){const moves=E.WIKI.availableMoves(a),fifth=moves.find(x=>x.fifth).id;for(const m of moves){const ids=[fifth,m.id,...moves.map(x=>x.id)].filter((v,i,l)=>l.indexOf(v)===i).slice(0,5),q=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(q.fighters[0].soulId,a.selectedSoulId);if(m.id===25873)q.fighters[0].effects['PP保护']={start:1,end:99};const n=E.resolveTurn(q,[key(m.id),key(m.id)]);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);if(m.id===20866)assert.equal(n.fighters[0].stages.def,2);if(m.id===29102)assert.equal(n.fighters[0].effects['用招弱化失败封攻'].end,4);}}
});

test('3516 191逐实例反弹四回合和1065逐实例低体翻倍实际回复粉伤',()=>{
 for(const x of pick(191)){const q=make(x);q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q);assert.equal(n.fighters[0].ailments['害怕'],undefined);assert.ok(n.fighters[1].ailments['害怕']);assert.equal(n.fighters[0].effects.reflect.end,4);}
 for(const x of pick(1065))for(const hp of [4499,4500,9000]){const q=make(x,{hp}),n=turn(q),gain=Math.min(9000-hp,hp<4500?6000:3000);assert.equal(n.fighters[0].hp,hp+gain);assert.equal(n.fighters[1].hp,9000-gain);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[1].hp,9000);}
});

test('3516 1014高于半血全2否则全1、450随机200至400回复边界与禁疗',()=>{
 for(const hp of [4499,4500,4501]){const q=make(e(1014),{hp});assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===(hp>4500?2:1)));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===0));}
 const seen=new Set();for(let seed=0;seed<40;seed++){const q=make(e(450),{seed,hp:1000}),n=turn(q),gain=n.fighters[0].hp-1000;assert.ok(gain>=200&&gain<=400);seen.add(gain);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,1000);}assert.ok(seen.size>10);assert.equal(turn(make(e(450),{hp:8999})).fighters[0].hp,9000);
});

test('3516 1087逐实例反弱下回合封招、禁强化失败与843先制期限',()=>{
 for(const x of pick(1087)){const q=make(x);q.fighters[0].stages.atk=-2;const n=turn(q);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[1].effects.skillBlock.start,2);assert.equal(n.fighters[1].effects.skillBlock.end,2);assert.equal(turn(n,900031,900040).fighters[0].hp,9000);assert.equal(turn(make(x)).fighters[1].effects.skillBlock,undefined);timer(q,0,'禁强化');assert.equal(turn(q).fighters[1].effects.skillBlock,undefined);}
 const n=turn(make(e(843)));assert.equal(n.fighters[0].effects.id984.start,2);assert.equal(n.fighters[0].effects.id984.end,3);assert.equal(n.fighters[0].effects.id984.amount,2);
});

test('3516 两个第五760真实微弱属性伤害不微弱',()=>{for(const x of pick(760)){const q=make(x);q.fighters[1].type='草';assert.equal(E.typeEffectiveness(q.fighters[0].type,'草',q.typeChart),.75);const z=structuredClone(q);z.moveDefinitions[key(z.auditMoveId)].operations=[];assert.ok(Math.abs(turn(q).fighters[0].lastAttackDamage-turn(z).fighters[0].lastAttackDamage/.75)<=3);}});

test('3516 全部21招基础PP伤害、MISS与控制封招',()=>{for(const m of source.moves){const q=make({moveId:m.id,index:null},{omit:true}),n=turn(q);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);q.fighters[0].ailments['疲惫']=2;assert.equal(turn(q).fighters[0].pp[key(m.id)],m.pp);q.fighters[0].ailments={};timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(!m.alwaysHit){const p=make({moveId:m.id,index:null},{omit:true,hit:false});p.moveDefinitions[key(m.id)].accuracy=0;assert.equal(turn(p).fighters[1].hp,9000);}}});

test('3516 2105缺授权文件或精灵版本不匹配时源参数审查拒绝',()=>{
 const P=require('../completion-policy.cjs'),s=require('../local-species.cjs').species(3516),reviews=require('../SINGLE-STAGE-REVIEWS.json'),todo=require('../MULTI-PET-TODO.json'),path=require('node:path'),root=path.join(__dirname,'..');assert.deepEqual(P.validateCoverage(s,reviews,todo,root,false),[]);const missing=P.validateCoverage(s,reviews,todo,path.join(root,'research'),false);assert.ok(missing.some(x=>x.includes('3516:skill:38009:2')&&x.includes('instance parameters must match source argsNum')));const changed=structuredClone(s);changed.source.revision='changed';const errors=P.validateCoverage(changed,reviews,todo,root,false);assert.ok(errors.some(x=>x.includes('3516:skill:38009:2')&&x.includes('instance parameters must match source argsNum')));
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3516 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3516);assert.equal(o.fighters[0].hp,8960);});}

test('3516 两真实魂印镜像1752盾来源反应可归零已使用技能PP，保护时仍严格消费1PP',()=>{
 const local=require('../local-species.cjs').species(3516);
 for(const a of E.WIKI.versionSnapshots(local))for(const protect of[false,true]){
 const all=E.WIKI.availableMoves(a),attack=all.find(m=>m.id===11923),ids=[11923,25873,all.find(m=>m.fifth).id,...all.map(m=>m.id)].filter((n,i,l)=>l.indexOf(n)===i).slice(0,5),s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:9999,spa:180,def:300,spd:300,spe:100}},{overrides:{maxHp:9000,atk:180,spa:180,def:100,spd:300,spe:900}}]});
 s.rng=0;timer(s,0,'攻击必中');for(const k of s.fighters[0].moves)if(![key(11923),key(25873)].includes(k))s.fighters[0].pp[k]=0;
 if(protect)timer(s,0,'PP保护');const o=E.resolveTurn(s,[key(11923),key(25873)]);
 assert.equal(o.turns.at(-1).first,1);assert.equal(o.fighters[0].pp[key(11923)],protect?attack.pp-1:0);assert.equal(o.fighters[0].pp[key(25873)],protect?5:0);assert.ok(o.turns.at(-1).events.some(e=>e.text.includes('护盾消失吸取')));assert.ok(o.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));
 }
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3516 1752实际免疫补真或来源盾独立反应公共回归',()=>{const o=require('./helpers/assert-1752-source-shield.cjs')(3516);assert.ok(o.fighters[0].hp>0);});}
