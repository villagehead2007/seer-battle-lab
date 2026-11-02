'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make,turn,pick,timer}=require('./helpers/3697-battle.cjs');
const e=id=>pick(id)[0];
test('3697 基础17招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1,String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3697 基础17招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],m.pp-1);miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3697 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});




test('3697 魂印976速度学习力刻印加到体力，正常养成与直接覆盖边界',()=>{
 const b=structuredClone(source);b.id=900697;b.souls=[];const create=build=>E.createBattle({wikiSnapshots:[source,b],builds:[build,build]});const base=create({evs:{spe:0}});assert.equal(base.fighters[0].stats.maxHp,base.fighters[1].stats.maxHp);const ev=create({evs:{spe:252,maxHp:252},inscriptions:[{spe:50},{spe:30}]});assert.equal(ev.fighters[0].stats.maxHp-ev.fighters[1].stats.maxHp,143);assert.equal(ev.fighters[0].stats.spe,ev.fighters[1].stats.spe);assert.equal(ev.fighters[0].hp,ev.fighters[0].stats.maxHp);const over=create({evs:{spe:252},inscriptions:[{spe:50}],overrides:{maxHp:9000}});assert.equal(over.fighters[0].stats.maxHp,9000);
});

test('3697 魂印976高体免异常概率弱化，低体必弱化与相等无分支',()=>{
 let yes=false,no=false;for(let seed=0;seed<20;seed++){const s=make(undefined,{soul:976,targetHp:8000,seed}),o=turn(s,900031);if(o.fighters[1].stages.atk===-1)yes=true;else no=true;assert.equal(o.fighters[0].soulState.skyHigh,true);}assert.ok(yes&&no);const low=turn(make(undefined,{soul:976,hp:8000}),900031);for(const k of keys)assert.equal(low.fighters[1].stages[k],-1);const equal=turn(make(undefined,{soul:976}),900031);assert.equal(equal.fighters[1].stages.atk,0);assert.equal(equal.fighters[0].soulState.skyHigh,false);const im=make(undefined,{soul:976,hp:8000});timer(im,1,'免弱');assert.equal(turn(im,900031).fighters[1].stages.atk,0);
 const s=make(undefined,{soul:976,targetHp:8000,opponentMove:26323,opponentEffectId:1255,seed:1});const o=turn(s,900031,900042);assert.equal(o.fighters[0].ailments['麻痹'],undefined);
});

test('3697 魂印976低体仅受攻击固定减半，自身输出与百分比伤害不减',()=>{
 const s=make(undefined,{soul:976,hp:8000});timer(s,1,'免弱');const ref=structuredClone(s);ref.fighters[0].soulId=null;const a=turn(s,s.auditMoveId,900040),b=turn(ref,ref.auditMoveId,900040);assert.equal(a.fighters[0].lastAttackDamage,b.fighters[0].lastAttackDamage);assert.ok(Math.abs((8000-a.fighters[0].hp)-(8000-b.fighters[0].hp)/2)<=1);
 for(const [move,id,amount]of [[10056,29,30],[32444,869,50]]){const q=make(undefined,{soul:976,hp:8000,opponentMove:move,opponentEffectId:id});timer(q,1,'免弱');const o=turn(q,900031,900042);assert.equal(8000-o.fighters[0].hp-o.fighters[1].lastAttackDamage,amount);}
 const next=structuredClone(a);next.fighters[0].hp=9000;next.fighters[1].hp=8000;const n=turn(next,900031);assert.equal(n.fighters[0].soulState.skyLow,false);assert.equal(n.fighters[0].soulState.skyHigh,true);
});

test('3697 31二至五段攻击真实伤害和只扣一次PP，控制免攻',()=>{
 for(const x of pick(31)){const counts=new Set();for(let seed=0;seed<30;seed++){const s=make(x,{seed}),o=turn(s);const hits=o.turns[0].events.filter(ev=>ev.kind==='damage'&&ev.detail?.includes('威力'));counts.add(hits.length);assert.ok(hits.length>=2&&hits.length<=5);assert.equal(o.fighters[0].pp[key(x.moveId)],source.moves.find(m=>m.id===x.moveId).pp-1);assert.equal(o.fighters[0].lastAttackDamage,9000-o.fighters[1].hp);}assert.deepEqual([...counts].sort(),[2,3,4,5]);const im=make(x);timer(im,1,'攻击伤害免疫');assert.equal(turn(im).fighters[1].hp,9000);}
});

test('3697 942消回合吸取与1310吸强先手85普通吸强，保护失败边界',()=>{
 for(const id of [942,1310,85]){const s=make(e(id),{hp:1000});if(id===942)timer(s,1,'doubleDamage');else s.fighters[1].stages.atk=2;const o=turn(s);if(id===942){assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].effects.doubleDamage,undefined);}else{assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.atk,0);}const b=structuredClone(s);timer(b,1,id===942?'protect':'幽蝶强化保护');assert.equal(turn(b).fighters[0].hp,1000);assert.equal(turn(b).fighters[0].stages.atk,0);if(id===1310){o.fighters[0].stats.spe=1;assert.equal(turn(o,900031).turns[1].first,0);assert.equal(turn(turn(o,900031),900031).turns[2].first,1);}}
});

test('3697 1274害怕弱化翻倍概率和749随机降级，免疫免弱',()=>{
 let amplified=false,yes=false,no=false;for(let seed=0;seed<50;seed++){const s=make(e(1274),{seed}),weak=structuredClone(s);weak.fighters[1].stages.def=-1;const a=turn(s),b=turn(weak);if(a.fighters[1].pp[key(900041)]===99)yes=true;else no=true;if(a.fighters[1].pp[key(900041)]===98&&b.fighters[1].pp[key(900041)]===99)amplified=true;}assert.ok(yes&&no&&amplified);const im=make(e(1274));timer(im,1,'免异常');assert.equal(turn(im).fighters[1].pp[key(900041)],98);
 let success=false,failed=false;for(let seed=0;seed<20;seed++){const s=make(e(749),{seed}),o=turn(s);if(o.fighters[1].stages.atk===-1)success=true;else failed=true;timer(s,1,'免弱');assert.equal(turn(s).fighters[1].stages.atk,0);}assert.ok(success&&failed);
});

test('3697 29固伤与6反伤按实际攻击，抗性免攻和致死',()=>{
 const s=make(e(29)),o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,60);s.fighters[1].build.resistance.fixed=50;const r=turn(s);assert.equal(9000-r.fighters[1].hp-r.fighters[0].lastAttackDamage,30);const a=turn(make(e(6)));assert.equal(9000-a.fighters[0].hp,Math.floor(a.fighters[0].lastAttackDamage/4));const im=make(e(6));timer(im,1,'攻击伤害免疫');assert.equal(turn(im).fighters[0].hp,9000);const dead=make(e(6),{hp:1});assert.equal(turn(dead).fighters[0].hp,0);
});

test('3697 1255用招麻痹与失败百分比伤害，191免疫反弹真实状态',()=>{
 let yes=false,no=false;for(let seed=0;seed<20;seed++){const o=turn(make(e(1255),{seed}));if(o.fighters[1].pp[key(900041)]===99)yes=true;if(o.fighters[1].hp===6000)no=true;}assert.ok(yes&&no);const im=make(e(1255));timer(im,1,'免异常');assert.equal(turn(im).fighters[1].hp,6000);const o=turn(make(e(1255)));o.round=4;const end=turn(o,900031);assert.equal(end.fighters[1].hp,o.fighters[1].hp);
 const s=make(e(191),{opponentMove:26323,opponentEffectId:1255,seed:1}),r=turn(s,s.auditMoveId,900042);assert.equal(r.fighters[0].ailments['麻痹'],undefined);assert.ok(r.turns[0].events.some(ev=>JSON.stringify(ev).includes('反弹')));r.round=4;assert.equal(turn(r,900031).fighters[0].effects.reflect,undefined);
});

test('3697 849三项无放回吸能力在伤害前生效，三回合与免弱禁强化',()=>{
 const s=make(e(849)),o=turn(s);assert.equal(Object.values(o.fighters[0].stages).filter(n=>n===1).length,3);assert.equal(Object.values(o.fighters[1].stages).filter(n=>n===-1).length,3);const n=turn(o,900030);assert.equal(Object.values(n.fighters[0].stages).reduce((a,b)=>a+b,0),6);const end=turn(n,900031);assert.equal(end.fighters[0].effects['用招前随机吸强'],undefined);assert.deepEqual(turn(end,900031).fighters[0].stages,end.fighters[0].stages);const im=make(e(849));timer(im,1,'免弱');timer(im,0,'禁强化');const b=turn(im);assert.ok(Object.values(b.fighters[0].stages).every(n=>n===0));assert.ok(Object.values(b.fighters[1].stages).every(n=>n===0));
});

test('3697 585与433强化参数六级边界和禁强化',()=>{
 const o=turn(make(e(585)));for(const k of keys)assert.equal(o.fighters[0].stages[k],1);const cap=make(e(585));for(const k of keys)cap.fighters[0].stages[k]=6;assert.equal(turn(cap).fighters[0].stages.atk,6);timer(cap,0,'禁强化');assert.equal(turn(cap).fighters[0].stages.atk,6);let a=turn(make(e(433)));assert.equal(a.fighters[0].stages.atk,1);assert.equal(a.fighters[0].stages.spe,1);a=turn(a,900031);assert.equal(a.fighters[0].stages.atk,2);assert.equal(a.fighters[0].effects['每回合强化'],undefined);
});

test('3697 532实际回复等量粉伤，满血禁疗和四回合边界',()=>{
 for(const hp of [1000,8999,9000]){const o=turn(make(e(532),{hp})),gain=Math.min(3000,9000-hp);assert.equal(o.fighters[0].hp,hp+gain);assert.equal(o.fighters[1].hp,9000-gain);}const b=make(e(532),{hp:1000});timer(b,0,'技能禁疗');assert.equal(turn(b).fighters[1].hp,9000);const o=turn(make(e(532),{hp:1000}));o.round=5;assert.equal(turn(o,900031).fighters[0].hp,4000);
});

test('3697 693增伤与843先制下一二回合生效，控制封招不登记',()=>{
 for(const id of [693,843]){const o=turn(make(e(id))),k=id===693?'id913':'id984';assert.equal(o.fighters[0].effects[k].start,2);assert.equal(o.fighters[0].effects[k].end,3);if(id===693){const ref=structuredClone(o);delete ref.fighters[0].effects[k];assert.ok(Math.abs(turn(o,900030).fighters[0].lastAttackDamage-2*turn(ref,900030).fighters[0].lastAttackDamage)<=1);}else{o.fighters[0].stats.spe=1;assert.equal(turn(o,900031).turns[1].first,0);}assert.equal(turn(turn(o,900031),900031).fighters[0].effects[k],undefined);const b=make(e(id));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects[k],undefined);}
});

test('3697 792先手封攻与837固定吸取200递增封顶400',()=>{
 const s=make(e(792)),o=turn(s,s.auditMoveId,900040);assert.equal(o.fighters[0].hp,9000);const slow=make(e(792),{aStats:{spe:1}});slow.moveDefinitions[key(slow.auditMoveId)].priority=0;assert.ok(turn(slow,slow.auditMoveId,900040).fighters[0].hp<9000);let a=make(e(837),{hp:1000});for(let i=0;i<6;i++){if(a.fighters[0].pp[key(a.auditMoveId)]===0)a.fighters[0].pp[key(a.auditMoveId)]=1;const before=a.fighters[1].hp,hp=a.fighters[0].hp;a=turn(a);const n=Math.min(400,200+50*i);assert.equal(before-a.fighters[1].hp-a.fighters[0].lastAttackDamage,n);assert.equal(a.fighters[0].hp-hp,n);}const ban=make(e(837),{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);
});

test('3697 869速度粉伤50至100封顶，强化速度与百分比抗性',()=>{
 let s=make(e(869));for(let i=0;i<4;i++){const hp=s.fighters[1].hp;s=turn(s);assert.equal(hp-s.fighters[1].hp-s.fighters[0].lastAttackDamage,500*Math.min(1,.5+i*.25));}const fast=make(e(869));fast.fighters[0].stages.spe=2;const f=turn(fast);assert.equal(9000-f.fighters[1].hp-f.fighters[0].lastAttackDamage,500);const res=make(e(869));res.fighters[1].build.resistance.percent=50;const r=turn(res);assert.equal(9000-r.fighters[1].hp-r.fighters[0].lastAttackDamage,125);
});

test('3697 760消微弱与1048异常增伤，679两回合技能禁疗',()=>{
 const s=make(e(760));s.fighters[1].type='电';const ref=structuredClone(s);ref.moveDefinitions[key(s.auditMoveId)].operations=[];assert.ok(turn(s).fighters[0].lastAttackDamage>turn(ref).fighters[0].lastAttackDamage);const a=make(e(1048));a.fighters[1].ailments['失明']=3;const plain=structuredClone(a);plain.moveDefinitions[key(a.auditMoveId)].operations=[];assert.ok(Math.abs(turn(a).fighters[0].lastAttackDamage-1.5*turn(plain).fighters[0].lastAttackDamage)<=2);
 const b=make(e(679),{targetHp:1000,opponentMove:26324,opponentEffectId:532});const o=turn(b,b.auditMoveId,900042);assert.equal(o.fighters[1].hp,1000-o.fighters[0].lastAttackDamage);const n=turn(o,900031,900042);assert.equal(n.fighters[1].hp,o.fighters[1].hp);assert.ok(turn(n,900031,900042).fighters[1].hp>n.fighters[1].hp);
});

test('3697 粉伤免疫与封招不追加，过期异常不增伤及禁强化拒绝增长',()=>{
 const s=make(e(869));s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;const o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,0);const b=make(e(869));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);const a=make(e(1048));a.fighters[1].ailments['失明']=0;const ref=structuredClone(a);ref.moveDefinitions[key(a.auditMoveId)].operations=[];assert.equal(turn(a).fighters[0].lastAttackDamage,turn(ref).fighters[0].lastAttackDamage);const ban=make(e(585));timer(ban,0,'禁强化');assert.ok(Object.values(turn(ban).fighters[0].stages).every(n=>n===0));
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3697 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3697,532);assert.equal(o.fighters[0].hp,8960);});}
