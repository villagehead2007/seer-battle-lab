'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3577-battle.cjs');
const {source,keys,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const hp=s=>s.fighters.map(f=>f.hp);
const base={moveId:10361,index:null};

test('3577 消强33与905消强成功才禁疗、无强化不封回复及两回合到期',()=>{
  for(const id of [33,905]){const e=pick(id)[0],s=make(e,{opponentEffect:pick(77)[0],targetHp:5000});s.fighters[1].stages.atk=2;s.fighters[1].stages.def=-1;const o=turn(s,e.moveId,900023);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.def,-1);assert.equal(o.fighters[1].hp,5000-(o.fighters[0].lastAttackDamage??0)+(id===905?0:250));
    const empty=make(e,{opponentEffect:pick(77)[0],targetHp:5000}),n=turn(empty,e.moveId,900023);assert.equal(n.fighters[1].hp,5000-(n.fighters[0].lastAttackDamage??0)+250);
    if(id===905){const w=wait(o);assert.equal(w.fighters[1].hp,o.fighters[1].hp);const z=wait(w);assert.equal(z.fighters[1].hp,w.fighters[1].hp+250);}
  }
});
test('3577 减伤54一回合真实减半、到期恢复且失误不登记',()=>{
  const e=pick(54)[0],s=make(e),c=make(e,{omit:true}),o=turn(s,e.moveId,HIT),b=turn(c,e.moveId,HIT);assert.ok(Math.abs(o.fighters[1].lastAttackDamage*2-b.fighters[1].lastAttackDamage)<=1);
  o.rng=b.rng=0;assert.equal(turn(o,IDLE,HIT).fighters[1].lastAttackDamage,turn(b,IDLE,HIT).fighters[1].lastAttackDamage);
  const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].effects['伤害输出降低'],undefined);
});
test('3577 免疫48和47四回合抵挡真实异常弱化、到期与封招',()=>{
  for(const id of [48,47]){const e=pick(id)[0];let s=make(e,{opponentEffect:pick(5).find(e=>e.params[1]===100)});for(let r=1;r<=4;r++){s=turn(s,r===1?e.moveId:IDLE,id===48?FEAR:900023);if(id===48)assert.deepEqual(s.fighters[0].ailments,{});else assert.equal(s.fighters[0].stages.spe,0);}s.rng=8;s=turn(s,IDLE,id===48?FEAR:900023);if(id===48)assert.ok(s.fighters[0].ailments['麻痹']);else assert.equal(s.fighters[0].stages.spe,-1);
    const b=make(e);timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects[id===48?'免异常':'免弱'],undefined);
  }
});
test('3577 反弹191真实麻痹反射四回合与到期免疫失效',()=>{
  const e=pick(191)[0];let s=make(e,{seed:8});for(let r=1;r<=4;r++){s.fighters[1].ailments={};s.rng=8;s=turn(s,r===1?e.moveId:IDLE,FEAR);assert.deepEqual(s.fighters[0].ailments,{});assert.ok(s.fighters[1].ailments['麻痹']);}s.fighters[1].ailments={};s.rng=8;const end=turn(s,IDLE,FEAR);assert.ok(end.fighters[0].ailments['麻痹']);assert.deepEqual(end.fighters[1].ailments,{});
});
test('3577 暴击620增加十六分之五概率的三回合窗口并实际改变伤害',()=>{
  const e=pick(620)[0];let s=turn(make(e,{criticals:true}));assert.equal(s.fighters[0].effects['暴击概率增加'].chance,5/16);
  // RNG seed 0 first draw .266... is above baseline 1/16 and below 6/16.
  for(let r=2;r<=3;r++){s.rng=0;const c=structuredClone(s);delete c.fighters[0].effects['暴击概率增加'];const b=turn(c,10361);s=turn(s,10361);assert.ok(Math.abs(s.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);}
  s.rng=0;const normal=turn(s,10361);assert.ok(normal.fighters[0].lastAttackDamage<s.fighters[0].lastAttackDamage);const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].effects['暴击概率增加'],undefined);
});
test('3577 吸强1044只有成功才获下两回合全伤翻倍、禁强和保护不触发',()=>{
  const e=pick(1044)[0],s=make(e);s.fighters[1].stages.atk=2;let o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[0].stages.atk,2);assert.deepEqual(o.fighters[0].effects['全伤害翻倍'],{start:2,end:3});
  for(let r=2;r<=3;r++){const c=structuredClone(o);delete c.fighters[0].effects['全伤害翻倍'];const b=turn(c,10361);o=turn(o,10361);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);}assert.equal(o.fighters[0].effects['全伤害翻倍'],undefined);
  assert.equal(turn(make(e)).fighters[0].effects['全伤害翻倍'],undefined);
  for(const [side,name] of [[0,'禁强化'],[1,'hypnosBoostProtect']]){const b=make(e);b.fighters[1].stages.atk=2;timer(b,side,name);const x=turn(b);assert.equal(x.fighters[1].stages.atk,2);assert.equal(x.fighters[0].stages.atk,0);assert.equal(x.fighters[0].effects['全伤害翻倍'],undefined);}
});
test('3577 回复77三次用招250、满血截断、控制与技能禁疗',()=>{
  const e=pick(77)[0];let s=make(e,{hp:1000});for(let r=1;r<=4;r++){s=turn(s,r===1?e.moveId:IDLE);assert.equal(s.fighters[0].hp,1000+250*Math.min(r,3));}assert.equal(turn(make(e,{hp:8999})).fighters[0].hp,9000);
  const stop=turn(make(e,{hp:1000}));stop.fighters[0].ailments['疲惫']=2;assert.equal(wait(stop).fighters[0].hp,1250);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);
});
test('3577 定额减伤463三回合每次减少250且不能负伤害',()=>{
  const e=pick(463)[0];let s=make(e,{bStats:{atk:2000}}),c=make(e,{omit:true,bStats:{atk:2000}});for(let r=1;r<=4;r++){s.fighters[0].hp=c.fighters[0].hp=9000;s.rng=c.rng=0;s=turn(s,r===1?e.moveId:IDLE,HIT);c=turn(c,r===1?e.moveId:IDLE,HIT);assert.equal(s.fighters[0].hp,Math.min(9000,c.fighters[0].hp+(r<=3?250:0)));}assert.equal(turn(make(e),e.moveId,HIT).fighters[0].hp,9000);
});
test('3577 威力511满体20与低半血60概率、等于半血和威力翻倍实际伤害',()=>{
  const e=pick(511)[0];for(const n of [4499,4500,9000]){let success=0,failure=0;for(let seed=0;seed<64;seed++){const s=make(e,{hp:n,seed}),o=turn(s),c=make(e,{hp:n,seed:(seed+0x6D2B79F5)>>>0,omit:true}),b=turn(c);const extra=o.fighters[0].lastAttackDamage>b.fighters[0].lastAttackDamage;if(extra)success++;else failure++;assert.ok(extra?o.fighters[0].lastAttackDamage>=b.fighters[0].lastAttackDamage*1.9:o.fighters[0].lastAttackDamage===b.fighters[0].lastAttackDamage);}assert.ok(success>0&&failure>0);}
  // First RNG draw .266 is between .20 and .60; exactly half has the ordinary chance.
  assert.ok(turn(make(e,{hp:4499,seed:0})).fighters[0].lastAttackDamage>turn(make(e,{hp:4500,seed:0})).fighters[0].lastAttackDamage);
});
test('3577 消回合1297疲惫或实际吸取、免断不补偿、异常免疫与残血',()=>{
  const e=pick(1297)[0],s=make(e,{hp:1000,seed:1});timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[1].pp[key(WAIT)],99);assert.equal(o.fighters[0].hp,1000);
  const no=turn(make(e,{hp:1000}));assert.equal(no.fighters[0].hp,1000);assert.equal(no.fighters[1].hp,9000-no.fighters[0].lastAttackDamage);
  const protect=make(e,{hp:1000});timer(protect,1,'protect');assert.equal(turn(protect).fighters[0].hp,1000);
  const immune=make(e,{hp:1000});timer(immune,1,'doubleDamage');immune.fighters[1].counts.immune=1;const b=turn(immune);assert.equal(b.fighters[1].counts.immune,0);assert.equal(b.fighters[0].hp,4000);
  const lowState=make(e,{hp:1000,targetHp:200});timer(lowState,1,'doubleDamage');lowState.fighters[1].counts.immune=1;const low=turn(lowState);assert.equal(low.fighters[0].hp,4000);assert.equal(low.fighters[1].hp,0);
});
test('3577 无视699穿透攻击免疫但不凭空增加伤害或无视减伤',()=>{
  const e=pick(699)[0],s=make(e),c=make(e,{omit:true});timer(s,1,'鬼王攻击免疫');timer(c,1,'鬼王攻击免疫');assert.ok(turn(s).fighters[0].lastAttackDamage>0);assert.equal(turn(c).fighters[1].hp,9000);
  const reduce=make(e);timer(reduce,1,'全伤害减半');assert.ok(turn(reduce).fighters[0].lastAttackDamage<turn(make(e)).fighters[0].lastAttackDamage);const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].hp,9000);
});
test('3577 满血925仅严格满血威力加倍、残一血不加成',()=>{
  const e=pick(925)[0],full=turn(make(e)),low=turn(make(e,{hp:8999})),b=turn(make(e,{omit:true}));assert.ok(full.fighters[0].lastAttackDamage>low.fighters[0].lastAttackDamage);assert.equal(low.fighters[0].lastAttackDamage,b.fighters[0].lastAttackDamage);
  const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[1].hp,9000);
});
test('3577 用招1255三回合失明或免疫后的百分比追加且不依赖魂印',()=>{
  const e=pick(1255)[0];let s=make(e,{seed:8});s=turn(s);assert.ok(s.fighters[1].ailments['失明']);assert.equal(s.fighters[1].ailments['害怕'],undefined);
  for(let r=2;r<=4;r++){s.fighters[1].ailments={};s.rng=8;s=wait(s);assert.equal(!!s.fighters[1].ailments['失明'],r<=3);}
  let immune=make(e);timer(immune,1,'免异常');for(let r=1;r<=4;r++){immune.fighters[1].hp=9000;immune=turn(immune,r===1?e.moveId:IDLE);assert.equal(immune.fighters[1].hp,r<=3?6000:9000);}
  const stop=turn(make(e));stop.fighters[0].ailments['疲惫']=2;stop.fighters[1].ailments={};assert.deepEqual(wait(stop).fighters[1].ailments,{});
});
test('3577 受攻1188疲惫失败吸取三分之一、属性不触发及三回合到期',()=>{
  const e=pick(1188)[0],s=make(e,{hp:1000,seed:5}),o=turn(s,e.moveId,HIT);assert.ok(o.fighters[1].ailments['疲惫']);assert.equal(o.fighters[0].hp,1000-o.fighters[1].lastAttackDamage);
  let immune=make(e,{hp:1000});timer(immune,1,'免异常');for(let r=1;r<=4;r++){immune.fighters[0].hp=1000;immune.fighters[1].hp=9000;immune=turn(immune,r===1?e.moveId:IDLE,HIT);assert.equal(immune.fighters[1].hp,r<=3?6000:9000);assert.equal(immune.fighters[0].hp,1000-immune.fighters[1].lastAttackDamage+(r<=3?3000:0));}
  assert.deepEqual(hp(turn(make(e,{hp:1000}))),[1000,9000]);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');timer(ban,1,'免异常');const b=turn(ban,e.moveId,HIT);assert.equal(b.fighters[0].hp,1000-b.fighters[1].lastAttackDamage);
});
test('3577 随机786只附加一种异常、免疫消费及失误无异常',()=>{
  const e=pick(786)[0],yes=seedCase(e,o=>Object.keys(o.fighters[1].ailments).length===1);assert.equal(Object.keys(yes.out.fighters[1].ailments).length,1);
  const once=make(e,{seed:yes.seed});once.fighters[1].counts.immune=1;const b=turn(once);assert.deepEqual(b.fighters[1].ailments,{});assert.equal(b.fighters[1].counts.immune,0);const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.deepEqual(turn(miss).fighters[1].ailments,{});
});
test('3577 属性585全六项和433两回合攻击速度、上限及禁强',()=>{
  const e=pick(585)[0],o=turn(make(e));assert.deepEqual(Object.values(o.fighters[0].stages),Array(6).fill(1));const cap=make(e);allStages(cap,0,6);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));const ban=make(e);timer(ban,0,'禁强化');assert.deepEqual(Object.values(turn(ban).fighters[0].stages),Array(6).fill(0));
  let s=turn(make(pick(433)[0]));assert.equal(s.fighters[0].stages.atk,1);assert.equal(s.fighters[0].stages.spe,1);assert.equal(s.fighters[0].stages.def,0);s=wait(s);assert.equal(s.fighters[0].stages.atk,2);assert.equal(wait(s).fighters[0].stages.atk,2);const blocked=make(pick(433)[0]);timer(blocked,0,'禁强化');assert.equal(wait(turn(blocked)).fighters[0].stages.atk,0);
});
test('3577 吸取971四回合半血严格双倍、比例独立回复与禁疗免伤',()=>{
  const e=pick(971)[0];for(const start of [4499,4500,4501]){const o=turn(make(e,{hp:start})),n=start<4500?6000:3000;assert.deepEqual(hp(o),[Math.min(9000,start+n),9000-n]);}
  let s=make(e,{hp:4500});for(let r=1;r<=5;r++){s.fighters[0].hp=4500;s.fighters[1].hp=9000;s=turn(s,r===1?e.moveId:IDLE);assert.deepEqual(hp(s),r<=4?[7500,6000]:[4500,9000]);}
  assert.deepEqual(hp(turn(make(e,{hp:1000,targetHp:100}))),[7000,0]);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.deepEqual(hp(turn(ban)),[1000,3000]);const immune=make(e,{hp:1000});timer(immune,1,'当回合免伤');assert.deepEqual(hp(turn(immune)),[7000,9000]);
});
test('3577 先手694与翻倍776仅下两回合攻击生效、属性与到期边界',()=>{
  const e=pick(694)[0];let s=turn(make(e,{aStats:{spe:1},bStats:{spe:999}}));assert.equal(s.turns[0].first,1);assert.equal(wait(s).turns[1].first,1);s=turn(s,10361);assert.equal(s.turns[1].first,0);s=turn(s,10361);assert.equal(s.turns[2].first,0);assert.equal(turn(s,10361).turns[3].first,1);
  let d=turn(make(pick(776)[0]));for(let r=2;r<=3;r++){const c=structuredClone(d);delete c.fighters[0].effects.doubleDamage;const b=turn(c,10361);d=turn(d,10361);assert.ok(Math.abs(d.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);}assert.equal(d.fighters[0].effects.doubleDamage,undefined);
});
test('3577 条件1048与769分别判定异常存在、到期和五十增伤',()=>{
  for(const id of [1048,769])for(const end of [0,1,3]){const e=pick(id)[0],s=make(e),c=make(e,{omit:true});s.fighters[1].ailments['失明']=c.fighters[1].ailments['失明']=end;const o=turn(s),b=turn(c);const mult=(id===1048)===(end>=1)?1.5:1;assert.ok(Math.abs(o.fighters[0].lastAttackDamage-b.fighters[0].lastAttackDamage*mult)<2);}
});
test('3577 免异常1258严格高于280才得一次免疫且实际消费',()=>{
  const e=pick(1258)[0];for(const n of [279,280,281]){const s=make(e,{aStats:{atk:2000}});timer(s,1,'伤害上限',{amount:n},1);const o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,n);assert.equal(o.fighters[0].counts.immune??0,n>280?1:0);const b=turn(o,IDLE,FEAR);assert.equal(b.fighters[0].counts.immune??0,0);if(n>280)assert.deepEqual(b.fighters[0].ailments,{});}
});
test('3577 未击败1040疲惫成功失败强化与免疫补偿、击败分支不伪造延期',()=>{
  const e=pick(1040)[0],yes=seedCase(e,o=>o.fighters[1].pp[key(WAIT)]===99),no=seedCase(e,o=>o.fighters[0].stages.atk===1);assert.equal(yes.out.fighters[1].pp[key(WAIT)],99);assert.deepEqual(Object.values(no.out.fighters[0].stages),Array(6).fill(1));
  const immune=make(e,{seed:yes.seed});timer(immune,1,'免异常');assert.deepEqual(Object.values(turn(immune).fighters[0].stages),Array(6).fill(1));
  const dead=turn(make(e,{targetHp:1}));assert.equal(dead.fighters[1].hp,0);assert.equal(dead.fighters[1].counts.nextAttackInvalid,undefined);assert.deepEqual(Object.values(dead.fighters[0].stages),Array(6).fill(0));const ban=make(e,{seed:no.seed});timer(ban,0,'禁强化');assert.equal(turn(ban).fighters[0].stages.atk,0);
});
test('3577 魂印881形态全技能先制一、免弱和克制系数至少二',()=>{
  const s=make(base,{soul:true,aStats:{spe:1},bStats:{spe:999},opponentEffect:pick(5).find(e=>e.params[1]===100)}),o=turn(s,IDLE,900023);assert.equal(o.turns[0].first,0);assert.equal(o.fighters[0].stages.spe,0);
  for(const type of ['草','机械','光战斗']){const s=make(base,{soul:true}),c=make(base);s.fighters[1].type=c.fighters[1].type=type;const x=turn(s),y=turn(c);assert.ok(x.fighters[0].lastAttackDamage>=y.fighters[0].lastAttackDamage);const raw=H.E.typeEffectiveness(source.moves.find(m=>m.id===10361).type,type,s.typeChart);assert.ok(Math.abs(x.fighters[0].lastAttackDamage-y.fighters[0].lastAttackDamage*2/raw)<3);}
});
test('3577 魂印881伤害279、280、281严格分支与下回合封属必暴',()=>{
  for(const n of [279,280,281]){const s=make(base,{soul:true,hp:1000,aStats:{atk:2000},opponentBoost:true});timer(s,1,'伤害上限',{amount:n},1);const o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,n);assert.equal(o.fighters[0].hp,n<280?4000:1000); // 目标限伤仍限制伤害，但不限制最大体力比例吸取的回复基数。
    assert.equal(o.fighters[1].hp,9000-n-(n===280?0:n));assert.equal(!!o.fighters[0].effects['必定暴击'],n<280);assert.equal(!!o.fighters[1].effects.statusBlock,n>280);
    const b=turn(o,IDLE,900023);assert.equal(b.fighters[1].stages.atk,n>280?0:1);assert.equal(b.fighters[1].pp[key(900023)],39);assert.equal(b.fighters[1].effects.statusBlock,undefined);
  }
});
test('3577 魂印881圣光祝福保命整回合、阶段末清异常并保留三次增伤',()=>{
  const s=make(base,{soul:true,hp:1});s.fighters[0].ailments['烧伤']=3;let o=turn(s,IDLE,HIT);assert.equal(o.fighters[0].hp,1);assert.deepEqual(o.fighters[0].ailments,{});assert.equal(o.fighters[0].soulState.lightBlessingAttacks,3);
  o.fighters[0].hp=9000;o=wait(o);assert.equal(o.fighters[0].soulState.lightBlessingAttacks,3);
  for(let n=3;n>0;n--){o.fighters[1].hp=9000;o.rng=0;delete o.fighters[0].effects['必定暴击'];const c=structuredClone(o);c.fighters[0].soulState.lightBlessingAttacks=0;const b=turn(c,10361);o=turn(o,10361);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-b.fighters[0].lastAttackDamage*2.5)<3);assert.equal(o.fighters[0].soulState.lightBlessingAttacks,n-1);}
  o.fighters[0].hp=1;const dead=turn(o,IDLE,HIT);assert.equal(dead.fighters[0].hp,0);assert.equal(dead.finished,true);
});
test('3577 魂印881圣光增伤按攻击用招消费、控制属性不消耗且重新开局复位',()=>{
  const s=make(base,{soul:true,hp:1});let o=turn(s,IDLE,HIT);o.fighters[0].hp=9000;o.fighters[0].ailments['疲惫']=2;o=turn(o,10361);assert.equal(o.fighters[0].soulState.lightBlessingAttacks,3);delete o.fighters[0].effects['攻击必中'];timer(o,0,'攻击必失');o=turn(o,10361);assert.equal(o.fighters[0].soulState.lightBlessingAttacks,2);assert.equal(make(base,{soul:true}).fighters[0].soulState.lightBlessingAttacks??0,0);
});

test('3577 魂印881低伤下回合真实必暴与高伤仅封下回合属性',()=>{
  let s=turn(make(base,{soul:true,hp:1000}));assert.ok(s.fighters[0].lastAttackDamage<280);s.fighters[1].hp=9000;s.rng=0;const c=structuredClone(s);delete c.fighters[0].effects['必定暴击'];const a=turn(s),b=turn(c);assert.ok(Math.abs(a.fighters[0].lastAttackDamage-b.fighters[0].lastAttackDamage*2)<=1);
  const high=make(base,{soul:true,aStats:{atk:2000},opponentBoost:true});timer(high,1,'攻击伤害上限',{amount:281},1);let o=turn(high,10361,900023);assert.equal(o.fighters[1].stages.atk,1);assert.equal(o.fighters[1].effects.statusBlock.start,2);o=turn(o,IDLE,900023);assert.equal(o.fighters[1].stages.atk,1);o=turn(o,IDLE,900023);assert.equal(o.fighters[1].stages.atk,2);
  const miss=make(base,{soul:true,hit:false,hp:1000});timer(miss,0,'攻击必失');assert.deepEqual(hp(turn(miss)),[1000,9000]);assert.deepEqual(hp(wait(make(base,{soul:true,hp:1000}))),[1000,9000]);
});

test('3577 原招光之惩戒两项持续机制不会因携带魂印重复追加',()=>{
  const s=make({moveId:26031,index:null},{soul:true,hp:1000});timer(s,1,'免异常');let o=turn(s,26031,HIT);assert.equal(o.fighters[1].hp,3000);assert.equal(o.fighters[0].hp,4000-o.fighters[1].lastAttackDamage);assert.ok(o.fighters[0].effects.reflect);
  o.fighters[0].hp=1000;o.fighters[1].hp=9000;o=turn(o,IDLE,HIT);assert.equal(o.fighters[1].hp,3000);assert.equal(o.fighters[0].hp,4000-o.fighters[1].lastAttackDamage);
});

test('3577 原招无始源光逐实例强化吸取与后续先手翻倍同时成立',()=>{
  const s=make({moveId:26032,index:null},{hp:1000,aStats:{spe:1},bStats:{spe:999}}),o=turn(s);assert.deepEqual(hp(o),[7000,3000]);assert.deepEqual(o.fighters[0].stages,{atk:2,def:1,spa:1,spd:1,spe:2,acc:1});
  o.fighters[1].hp=9000;const next=turn(o,10361);assert.equal(next.turns[1].first,0);assert.equal(next.fighters[0].stages.atk,3);assert.equal(next.fighters[0].hp,9000);assert.equal(next.fighters[1].hp,6000-next.fighters[0].lastAttackDamage);
});

test('3577 形态来源保留完整圣光祝福说明与原魂印版本不覆盖',()=>{
  const raw=require('../research/seerapi-cache/3577/soulmark-881.json'),pet=require('../research/seerapi-cache/3577/pet-3577.json');assert.equal(raw.hash,source.souls[0].hash);assert.equal(raw.desc,source.souls[0].description);assert.ok(raw.desc_formatting_adjustment.includes('提升</color>150%'));assert.ok(raw.desc_formatting_adjustment.includes('至少为2'));
  assert.deepEqual(source.moves.map(m=>m.id),pet.skill.map(x=>x.skill.id));assert.deepEqual(source.souls.map(x=>x.id),pet.soulmark.map(x=>x.id));assert.equal(raw.intensified_to,null);assert.equal(raw.advance,null);
});
