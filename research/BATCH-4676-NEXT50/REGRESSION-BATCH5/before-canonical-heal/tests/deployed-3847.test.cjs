'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,make,turn,pick,timer}=require('./helpers/3847-battle.cjs');const e=id=>pick(id)[0];


test('3847 基础能力逐实例成功失败、上下界与免弱禁强化',()=>{for(const entry of [...pick(4),...pick(5)]){const [stat,chance,delta]=entry.params,side=entry.id===4?0:1,k=keys[stat];let yes=false,no=false;for(let seed=0;seed<70;seed++){const s=make(entry,{seed}),o=turn(s);if(o.fighters[side].stages[k]===delta)yes=true;else no=true;timer(s,side,delta>0?'禁强化':'免弱');assert.equal(turn(s).fighters[side].stages[k],0);delete s.fighters[side].effects[delta>0?'禁强化':'免弱'];s.fighters[side].stages[k]=delta>0?6:-6;assert.equal(turn(s).fighters[side].stages[k],delta>0?6:-6);}assert.ok(yes);if(chance<100)assert.ok(no);}});
test('3847 1001异常翻倍、禁强与六级上限',()=>{for(const x of pick(1001)){const s=make(x);assert.equal(turn(s).fighters[0].stages.atk,1);s.fighters[1].ailments['失神']=9;assert.equal(turn(s).fighters[0].stages.atk,2);s.fighters[0].stages.atk=5;assert.equal(turn(s).fighters[0].stages.atk,6);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,5);}});
test('3847 基础24招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3847 40先手威力与921概率倍伤及失败封属',()=>{
 const s=make(e(40)),a=turn(s),b=turn(make(e(40),{aStats:{spe:1}}));assert.ok(a.fighters[0].lastAttackDamage>b.fighters[0].lastAttackDamage*1.8);
 let yes=false,no=false;for(let seed=0;seed<50;seed++){const o=turn(make(e(921),{seed}));if(o.fighters[1].effects.statusBlock){no=true;assert.equal(o.fighters[1].effects.statusBlock.end,2);}else yes=true;assert.ok(o.fighters[0].lastAttackDamage>0);}assert.ok(yes&&no);
});
test('3847 1180及1199吸强成功增益、无强化与保护失败',()=>{
 for(const id of [1180,1199]){const s=make(e(id));s.fighters[1].stages.atk=2;let o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[0].stages.atk,2);assert.ok(id===1180?o.fighters[0].effects['必定暴击']:o.fighters[1].effects['无法通过自身技能恢复体力']);
  for(const protection of ['hypnosBoostProtect','幽蝶强化保护']){timer(s,1,protection);o=turn(s);assert.equal(o.fighters[1].stages.atk,2);assert.equal(o.fighters[0].stages.atk,0);assert.equal(id===1180?o.fighters[0].effects['必定暴击']:o.fighters[1].effects['无法通过自身技能恢复体力'],undefined);delete s.fighters[1].effects[protection];}
  const none=turn(make(e(id)));assert.equal(id===1180?none.fighters[0].effects['必定暴击']:none.fighters[1].effects['无法通过自身技能恢复体力'],undefined);
 }
});
test('3847 478封属、191反弹以及573消强疲惫',()=>{
 const s=make(e(478),{opponentMove:21684}),o=turn(s,undefined,900042);assert.equal(o.fighters[1].stages.acc,0);assert.equal(o.fighters[1].pp[key(900042)],9);assert.equal(o.fighters[1].effects.statusBlock.end,2);
 for(const x of pick(191)){const b=make(x,{opponentMove:30813});const out=turn(b,undefined,900042);assert.deepEqual(out.fighters[0].ailments,{});assert.equal(Object.keys(out.fighters[1].ailments).length,1);assert.equal(out.fighters[0].effects.reflect.end,4);}
 const b=make(e(573),{opponentMove:30810,opponentEffectId:1180});timer(b,0,'id984',{amount:3});b.fighters[0].stages.atk=1;const out=turn(b,undefined,900042);assert.equal(out.fighters[0].stages.atk,0);assert.equal(out.fighters[1].ailments['疲惫'],2);
 const no=make(e(573),{opponentMove:30810,opponentEffectId:1180});assert.equal(turn(no,undefined,900042).fighters[1].ailments['疲惫'],undefined);
});
test('3847 77用招固定回复与1135低半血回满等量固伤',()=>{
 const s=make(e(77),{hp:1000});let o=turn(s);assert.equal(o.fighters[0].hp,1200);o=turn(o,900031);assert.equal(o.fighters[0].hp,1400);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);
 const low=make(e(1135),{hp:1000});const out=turn(low);assert.equal(out.fighters[0].hp,9000);assert.equal(out.fighters[1].hp,1000);assert.equal(turn(make(e(1135),{hp:4500})).fighters[1].hp,9000);timer(low,0,'技能禁疗');assert.equal(turn(low).fighters[1].hp,9000);
});
test('3847 585全属性、433分项持续强化和1151对手攻击反应',()=>{
 for(const x of pick(585)){const s=make(x);assert.ok(keys.every(k=>turn(s).fighters[0].stages[k]===1));timer(s,0,'禁强化');assert.ok(keys.every(k=>turn(s).fighters[0].stages[k]===0));}
 const s=make(e(433));let o=turn(s);assert.deepEqual(keys.map(k=>o.fighters[0].stages[k]),[1,1,0,1,0,0]);o=turn(o,900031);assert.equal(o.fighters[0].stages.atk,2);assert.equal(turn(o,900031).fighters[0].stages.atk,2);
 const a=make(e(1151));const hit=turn(a,undefined,900040);assert.ok(keys.every(k=>hit.fighters[0].stages[k]===1));assert.equal(turn(a).fighters[0].stages.atk,0);timer(a,0,'禁强化');assert.equal(turn(a,undefined,900040).fighters[0].stages.atk,0);
});
test('3847 417攻击吸血、762损血回复与843全部先制窗口',()=>{
 const s=make(e(417),{hp:1000});const o=turn(s);assert.equal(o.fighters[0].hp,1000+o.fighters[0].lastAttackDamage);assert.equal(o.fighters[0].effects['攻击吸血'].end,4);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);
 const loss=turn(make(e(762),{hp:1000}));assert.equal(loss.fighters[0].hp,5000);assert.equal(turn(loss,900031).fighters[0].hp,7000);
 for(const x of pick(843)){const a=turn(make(x,{aStats:{spe:1}}));assert.equal(a.fighters[0].effects.id984.start,2);assert.equal(turn(a,900031).turns.at(-1).first,0);a.round=4;assert.equal(turn(a,900031).turns.at(-1).first,1);}
});
test('3847 451真实三异常池、971两实例低体双吸及禁疗',()=>{
 const seen=new Set();for(let seed=0;seed<30;seed++){const s=make(e(451),{seed}),o=turn(s);const names=Object.keys(o.fighters[1].ailments);assert.equal(names.length,1);seen.add(names[0]);assert.ok(['烧伤','冻伤','中毒'].includes(names[0]));timer(s,1,'免异常');assert.deepEqual(turn(s).fighters[1].ailments,{});}assert.equal(seen.size,3);
 for(const x of pick(971)){const low=make(x,{hp:1000});const o=turn(low);assert.equal(o.fighters[1].hp,3000);assert.equal(o.fighters[0].hp,7000);assert.equal(turn(make(x,{hp:4500})).fighters[1].hp,6000);timer(low,0,'技能禁疗');assert.equal(turn(low).fighters[0].hp,1000);}
});
test('3847 1134反馈失败补偿和1285逐槽扣PP不低于零',()=>{
 const s=make(e(1134));s.fighters[0].stages.atk=-2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[1].stages.atk,-2);assert.equal(turn(make(e(1134))).fighters[0].stages.atk,1);
 const b=make(e(1285));b.fighters[1].pp[key(900042)]=0;const out=turn(b);assert.equal(out.fighters[1].pp[key(900042)],0);assert.equal(out.fighters[1].pp[key(900040)],98);const killed=turn(make(e(1285),{targetHp:1}));assert.equal(killed.fighters[1].pp[key(900040)],99);
});

test('3847 基础24招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns.at(-1).first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns.at(-1).events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});




{const test=require('node:test').test,assert=require('node:assert/strict');test('3847 1647基础击败理论回复与蛊反噬死亡停止补真公共修复',()=>{const o=require('./helpers/assert-1647-confirmed-boundaries.cjs')(3847);assert.equal(o.fighters[1].hp,30);});}
