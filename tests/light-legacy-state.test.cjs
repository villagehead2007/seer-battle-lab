'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/light-source-battle.cjs');
test('两目标全部真实技能基础行为：逐招PP、真实攻击或属性执行，控制不消费PP',()=>{
 for(const id of[3311,13311])for(const m of require(`../research/LIGHT-SP-2026-11-07/candidate-${id}.json`).moves){const s=H.make(m.id,{id,hp:200});s.fighters[0].effects['攻击必中']={start:1,end:9};const out=H.turn(s);assert.equal(out.fighters[0].pp['wiki:'+m.id],m.pp-1,`${id}/${m.id}`);if(m.kind!=='status'&&m.power>0)assert.ok(H.sum(out,'attack')>0,`${id}/${m.id} red`);else assert.ok(out.turns[0].events.some(e=>e.kind==='move'&&e.text.includes(m.name)),`${id}/${m.id} action`);const blocked=H.make(m.id,{id});blocked.fighters[0].ailments['疲惫']=3;const no=H.turn(blocked);assert.equal(no.fighters[0].pp['wiki:'+m.id],m.pp);assert.equal(no.fighters[1].hp,9000);}
});
test('两目标全部技能PP1到0的可选边界，非必中攻击MISS无附伤且仍正常消费PP',()=>{
 for(const id of[3311,13311])for(const m of require(`../research/LIGHT-SP-2026-11-07/candidate-${id}.json`).moves){const s=H.make(m.id,{id});s.fighters[0].pp['wiki:'+m.id]=1;const out=H.turn(s);assert.equal(out.fighters[0].pp['wiki:'+m.id],0,`${id}/${m.id}`);assert.equal(H.E.availableMoves(out.fighters[0]).includes('wiki:'+m.id),false,`${id}/${m.id} zero`);if(m.kind!=='status'&&!m.alwaysHit){const miss=H.make(m.id,{id});H.timer(miss,0,'攻击必失');const failed=H.turn(miss);assert.equal(failed.fighters[1].hp,9000,`${id}/${m.id} MISS`);assert.equal(failed.fighters[0].pp['wiki:'+m.id],m.pp-1);}}
});
test('共同基础状态4/5及重复弱化实例真实改变等级，免弱、禁强和上下限分别处理',()=>{
 const boost=H.turn(H.make(20307));assert.equal(boost.fighters[0].stages.def,1);const s=H.make(22358);const out=H.turn(s);assert.equal(out.fighters[1].stages.spe,-1);assert.equal(out.fighters[1].stages.acc,-1);const immune=H.make(22358);H.timer(immune,1,'免弱');assert.equal(H.turn(immune).fighters[1].stages.spe,0);const full=H.make(20307);full.fighters[0].stages.def=6;assert.equal(H.turn(full).fighters[0].stages.def,6);const blocked=H.make(20307);H.timer(blocked,0,'禁强化');assert.equal(H.turn(blocked).fighters[0].stages.def,0);
});
test('共同29固定50、30后手翻倍、48免异和33清强：实际伤害与保护交互',()=>{
 for(const id of[12898,14733]){const s=H.make(id);s.fighters[0].effects['攻击必中']={start:1,end:9};assert.equal(H.sum(H.turn(s),'fixed'),50);const blocked=H.make(id);H.timer(blocked,1,'固定百分比免疫');assert.equal(H.sum(H.turn(blocked),'fixed'),0);}
 const quick=H.make(12903),slow=H.make(12903,{enemySpeed:900});quick.rng=slow.rng=1024;const a=H.sum(H.turn(quick),'attack'),b=H.sum(H.turn(slow),'attack');assert.ok(b>a*1.8&&b<a*2.2);
 const s=H.make(16684);s.fighters[1].stages.atk=3;const out=H.turn(s);assert.equal(out.fighters[1].stages.atk,0);assert.ok(out.fighters[0].effects['免异常']);const protectedState=H.make(16684);protectedState.fighters[1].stages.atk=3;H.timer(protectedState,1,'强化保护');assert.equal(H.turn(protectedState).fighters[1].stages.atk,3);
});
test('共同85即时转移强化、677后续吸强、469属性反应概率成功失败与免异',()=>{
 const s=H.make(23685);s.fighters[1].stages.atk=2;const first=H.turn(s);assert.equal(first.fighters[1].stages.atk,0);assert.equal(first.fighters[0].stages.atk,2);first.fighters[1].stages.spe=2;const second=H.turn(first,H.WAIT);assert.equal(second.fighters[1].stages.spe,0);assert.equal(second.fighters[0].stages.spe,2);
 const seen=new Set();for(let i=1;i<=24&&seen.size<2;i++){const x=H.make(23685,{index:1});x.rng=(i*0x9e3779b9)>>>0;const o=H.turn(x,23685,H.BOOST);seen.add(o.fighters[1].ailments['疲惫']>=1);}assert.deepEqual([...seen].sort(),[false,true]);const immune=H.make(23685,{index:1});H.timer(immune,1,'免异常');assert.equal(H.turn(immune,23685,H.BOOST).fighters[1].ailments['疲惫'],undefined);
});
test('共同39真实削PP到零阻止后手，PP保护保留技能；3和57解弱并按用招回复',()=>{
 const s=H.make(16686);s.fighters[1].stages.def=2;s.fighters[1].pp['wiki:'+H.BOOST]=2;const out=H.turn(s,16686,H.BOOST);assert.equal(out.fighters[1].pp['wiki:'+H.BOOST],0);assert.equal(out.fighters[1].stages.def,0);
 const guard=H.make(16686);H.timer(guard,1,'PP保护');assert.equal(H.turn(guard).fighters[1].pp['wiki:'+H.WAIT],98);
 const armor=H.make(23686,{hp:100});armor.fighters[0].stages.atk=-2;const first=H.turn(armor);assert.equal(first.fighters[0].stages.atk,0);assert.ok(first.fighters[0].hp>100);const second=H.turn(first,H.WAIT);assert.ok(second.fighters[0].hp>=first.fighters[0].hp);const noHeal=H.make(23686,{hp:100});H.timer(noHeal,0,'技能禁疗');assert.equal(H.turn(noHeal).fighters[0].hp,100);
});
test('共同164受攻疲惫与93附200固定伤害均有概率成功失败且免异免固分别生效',()=>{
 for(const [move,index,kind]of[[23686,2,'status'],[16687,0,'fixed']]){const seen=new Set();for(let i=1;i<=48&&seen.size<2;i++){const s=H.make(move,{index});s.rng=(i*0x9e3779b9)>>>0;s.fighters[0].effects['攻击必中']={start:1,end:9};const o=H.turn(s,move,kind==='status'?H.HIT:H.WAIT);seen.add(kind==='status'?o.fighters[1].ailments['疲惫']>=1:H.sum(o,'fixed')===200);}assert.deepEqual([...seen].sort(),[false,true]);}
 const immune=H.make(23686,{index:2});H.timer(immune,1,'免异常');assert.equal(H.turn(immune,23686,H.HIT).fighters[1].ailments['疲惫'],undefined);const block=H.make(16687);H.timer(block,1,'固定百分比免疫');assert.equal(H.sum(H.turn(block),'fixed'),0);
});
test('共同681/481/440未来必命中暴击及攻击先制，PP倍耗按3回合生效并到期',()=>{
 const s=H.make(23687);const first=H.turn(s);assert.equal(first.fighters[1].pp['wiki:'+H.WAIT],97);assert.ok(first.fighters[0].effects['必定暴击']);first.criticals=true;const second=H.turn(first,H.HIT);assert.ok(second.turns.at(-1).events.some(e=>e.text.includes('致命一击')));assert.equal(second.fighters[1].pp['wiki:'+H.WAIT],95);let state=second;for(let i=0;i<3;i++)state=H.turn(state,H.WAIT);const before=state.fighters[1].pp['wiki:'+H.WAIT];assert.equal(H.turn(state,H.WAIT).fighters[1].pp['wiki:'+H.WAIT],before-1);
});
test('共同609疲惫威力翻倍、180清回合与432普通攻击闪避且必中有效、198两项弱化不重复',()=>{
 const a=H.make(16688),b=H.make(16688);a.rng=b.rng=1024;b.fighters[1].ailments['疲惫']=3;assert.ok(H.sum(H.turn(b),'attack')>H.sum(H.turn(a),'attack')*1.8);
 const clear=H.make(23800,{index:0});H.timer(clear,1,'攻击必中');assert.equal(H.turn(clear).fighters[1].effects['攻击必中'],undefined);const protect=H.make(23800,{index:0});H.timer(protect,1,'protect');H.timer(protect,1,'攻击必中');assert.ok(H.turn(protect).fighters[1].effects['攻击必中']);
 const miss=H.make(23800,{index:1});miss.moveDefinitions['wiki:'+H.HIT].alwaysHit=false;assert.equal(H.turn(miss,23800,H.HIT).fighters[0].hp,600);assert.ok(H.turn(H.make(23800,{index:1}),23800,H.HIT).fighters[0].hp<600);
 const weak=H.turn(H.make(23800,{index:2}));assert.equal(Object.values(weak.fighters[1].stages).filter(n=>n===-2).length,2);const immune=H.make(23800,{index:2});H.timer(immune,1,'免弱');assert.ok(Object.values(H.turn(immune).fighters[1].stages).every(n=>n===0));
});
test('神圣领域433每回合攻速命强化、491减伤50%与690清强反制状态',()=>{
 const s=H.make(23771,{index:0});let out=H.turn(s);assert.equal(out.fighters[0].stages.atk,1);assert.equal(out.fighters[0].stages.spe,1);assert.equal(out.fighters[0].stages.acc,1);out=H.turn(out,H.WAIT);assert.equal(out.fighters[0].stages.atk,2);out=H.turn(out,H.WAIT);assert.equal(out.fighters[0].stages.atk,3);out=H.turn(out,H.WAIT);assert.equal(out.fighters[0].stages.atk,3);
 const half=H.make(23771,{index:1}),normal=H.make(23771,{index:1});normal.moveDefinitions['wiki:23771'].operations=[];half.rng=normal.rng=2048;const reduced=H.sum(H.turn(half,23771,H.HIT),'attack',1),full=H.sum(H.turn(normal,23771,H.HIT),'attack',1);assert.ok(reduced>=full*.45&&reduced<=full*.55);
 const guard=H.turn(H.make(23771,{index:2,enemyMove:16684}));assert.ok(guard.fighters[0].effects['强化消失封属']);guard.fighters[0].stages.atk=2;const triggered=H.turn(guard,H.WAIT,16684);assert.equal(triggered.fighters[0].stages.atk,0);assert.equal(triggered.fighters[1].effects.statusBlock.start,3);
});
test('诛魔807按对手上次完整红伤追加固定，776下两回合翻倍，610仅被克制时增加先制',()=>{
 const s=H.make(17908,{index:0});s.fighters[1].lastSettledAttackDamage=800;assert.equal(H.sum(H.turn(s),'fixed'),800);const immune=H.make(17908,{index:0});immune.fighters[1].lastSettledAttackDamage=800;H.timer(immune,1,'固定百分比免疫');assert.equal(H.sum(H.turn(immune),'fixed'),0);
 const boosted=H.turn(H.make(17908,{index:1})),plain=H.make(17908,{index:1});plain.moveDefinitions['wiki:17908'].operations=[];const control=H.turn(plain);boosted.rng=control.rng=1024;assert.ok(H.sum(H.turn(boosted,H.HIT),'attack')-H.sum(boosted,'attack')>(H.sum(H.turn(control,H.HIT),'attack')-H.sum(control,'attack'))*1.8);
 const c=H.make(17908,{index:2});c.fighters[1].type='混沌';const out=H.turn(c,17908,H.HIT);assert.ok(out.turns[0].events.some(e=>e.text.includes('先制')));
});
test('光辉125真实红伤上限250、626随机一项+1且禁强化失败、1124成功清回合才后续增伤',()=>{
 const cap=H.make(17955,{index:0,enemyAttack:9000});const out=H.turn(cap,17955,H.HIT);assert.ok(H.sum(out,'attack',1)<=250);assert.ok(H.sum(out,'attack',1)>0);
 const random=H.turn(H.make(17955,{index:1}));assert.equal(Object.values(random.fighters[0].stages).filter(n=>n===1).length,1);const blocked=H.make(17955,{index:1});H.timer(blocked,0,'禁强化');assert.ok(Object.values(H.turn(blocked).fighters[0].stages).every(n=>n===0));
 const success=H.make(30466,{index:0});H.timer(success,1,'攻击必中');const grant=H.turn(success);assert.ok(grant.fighters[0].effects.id913);assert.equal(grant.fighters[0].effects.id913.start,2);const failure=H.make(30466,{index:0});assert.equal(H.turn(failure).fighters[0].effects.id913,undefined);
});
test('寰宇894固定吸取按理论量回复并严格低体翻倍，免固与禁疗分别处理',()=>{
 const s=H.make(25338,{index:0,hp:100,targetHp:200});const out=H.turn(s);assert.equal(out.fighters[0].hp,500);assert.equal(H.sum(out,'fixed'),400);assert.equal(out.fighters[1].hp,0);
 const equal=H.make(25338,{index:0,hp:600,targetHp:600});assert.equal(H.turn(equal).fighters[0].hp,800);const immune=H.make(25338,{index:0,hp:100});H.timer(immune,1,'固定百分比免疫');const absorbed=H.turn(immune);assert.equal(absorbed.fighters[1].hp,9000);assert.equal(absorbed.fighters[0].hp,500);const blocked=H.make(25338,{index:0,hp:100});H.timer(blocked,0,'技能禁疗');assert.equal(H.turn(blocked).fighters[0].hp,100);
});
test('寰宇470四回合攻击命中疲惫与1125普通攻击MISS、必中命中封锁后续属性',()=>{
 const granted=H.turn(H.make(25338,{index:1}));assert.equal(granted.fighters[0].effects['攻击附加异常'].end,4);const seen=new Set();for(let i=1;i<=24&&seen.size<2;i++){const s=structuredClone(granted);s.rng=(i*0x9e3779b9)>>>0;const o=H.turn(s,H.HIT);seen.add(o.fighters[1].ailments['疲惫']>=2);}assert.deepEqual([...seen].sort(),[false,true]);
 const s=H.make(25338,{index:2});s.moveDefinitions['wiki:'+H.HIT].alwaysHit=false;assert.equal(H.turn(s,25338,H.HIT).fighters[0].hp,600);const sure=H.turn(H.make(25338,{index:2}),25338,H.HIT);assert.ok(sure.fighters[0].hp<600);assert.ok(sure.fighters[1].effects.statusBlock);assert.equal(sure.fighters[1].effects.statusBlock.start,2);
});
test('剑定585即时全强与433持续攻速、843先制、681必中暴击和532按实际回复追加粉伤',()=>{
 const out=H.turn(H.make(25339,{hp:100}));assert.equal(out.fighters[0].stages.def,1);assert.equal(out.fighters[0].stages.atk,2);assert.equal(out.fighters[0].stages.spe,2);assert.equal(out.fighters[0].hp,400);assert.equal(H.sum(out,'percent'),300);assert.equal(out.fighters[0].effects.id984.amount,2);assert.ok(out.fighters[0].effects['必定暴击']);
 const full=H.turn(H.make(25339,{index:4,hp:900}));assert.equal(H.sum(full,'percent'),0);const blocked=H.make(25339,{index:4,hp:100});H.timer(blocked,0,'技能禁疗');const no=H.turn(blocked);assert.equal(no.fighters[0].hp,100);assert.equal(H.sum(no,'percent'),0);
});
test('十字1126未受攻清2PP本回合已受攻清3PP，PP保护有效；679真实阻止技能回血',()=>{
 const s=H.make(30468,{index:2});const first=H.turn(s,30468,H.WAIT);assert.equal(Object.values(first.fighters[1].pp).filter(n=>n===0).length,2);const received=H.make(30468,{index:2,enemySpeed:900});assert.equal(Object.values(H.turn(received,30468,H.HIT).fighters[1].pp).filter(n=>n===0).length,3);const protectedPp=H.make(30468,{index:2});H.timer(protectedPp,1,'PP保护');assert.equal(Object.values(H.turn(protectedPp).fighters[1].pp).filter(n=>n===0).length,0);
 const sealed=H.make(30469,{index:0,enemyMove:29506,targetHp:6000}),control=H.make(30469,{index:0,enemyMove:29506,targetHp:6000});control.moveDefinitions['wiki:30469'].operations=[];sealed.rng=control.rng=1024;const seal=H.turn(sealed,30469,29506),normal=H.turn(control,30469,29506);assert.equal(seal.fighters[1].effects['技能禁疗'].end,3);assert.equal(seal.fighters[1].hp,6000-H.sum(seal,'attack'));assert.ok(normal.fighters[1].hp>seal.fighters[1].hp);
});
test('原第五1128真实击败才授予对手下次攻击失效，当前目标而非按效果ID整条延期',()=>{
 const kill=H.turn(H.make(30469,{index:2,targetHp:1}));assert.equal(kill.fighters[1].hp,0);assert.equal(kill.fighters[1].counts.nextAttackInvalid1128,1);const alive=H.turn(H.make(30469,{index:2}));assert.ok(alive.fighters[1].hp>0);assert.equal(alive.fighters[1].counts.nextAttackInvalid1128,undefined);
 const s=H.make(30469,{index:2});s.fighters[0].counts.nextAttackInvalid1128=1;const blocked=H.turn(s,H.HIT);assert.equal(blocked.fighters[0].counts.nextAttackInvalid1128,0);assert.equal(blocked.fighters[0].pp['wiki:'+H.HIT],98);assert.equal(H.sum(blocked,'attack'),0);const next=H.turn(blocked,H.HIT);assert.ok(H.sum(next,'attack')>0);
});
