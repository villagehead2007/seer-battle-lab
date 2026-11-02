'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make,turn,pick,timer}=require('./helpers/3673-battle.cjs');
const e=id=>pick(id)[0];
test('3673 基础17招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1,String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3673 基础17招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],m.pp-1);miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3673 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});



test('3673 1359反馈先清弱后强化，免弱失败仍清弱，无负能力与饱和边界',()=>{
 const s=make(e(1359));s.fighters[0].stages.atk=-2;s.fighters[0].stages.def=3;const o=turn(s);assert.equal(o.fighters[1].stages.atk,-2);assert.equal(o.fighters[0].stages.atk,1);assert.equal(o.fighters[0].stages.def,4);
 const im=structuredClone(s);timer(im,1,'免弱');const f=turn(im);assert.equal(f.fighters[1].stages.atk,0);assert.equal(f.fighters[0].stages.atk,0);assert.equal(f.fighters[0].stages.def,3);
 assert.equal(turn(make(e(1359))).fighters[0].stages.atk,0);const cap=structuredClone(s);cap.fighters[1].stages.atk=-6;assert.equal(turn(cap).fighters[0].stages.atk,0);
 const ban=structuredClone(s);timer(ban,0,'禁强化');assert.equal(turn(ban).fighters[0].stages.atk,0);const block=structuredClone(s);timer(block,0,'skillBlock');assert.equal(turn(block).fighters[0].stages.atk,-2);
});

test('3673 1235闪避成功无伤害，失败与必中清两PP，属性不触发和三回合到期',()=>{
 let yes,no;for(let seed=0;seed<60;seed++){const s=make(e(1235),{seed});s.moveDefinitions[key(900040)].alwaysHit=false;const o=turn(s,undefined,900040);const cleared=Object.values(o.fighters[1].pp).filter(n=>n===0).length;if(cleared===0){assert.equal(o.fighters[0].hp,9000);yes=o;}else{assert.equal(cleared,2);assert.ok(o.fighters[0].hp<9000);no=o;}}assert.ok(yes&&no);
 const hit=turn(make(e(1235)),undefined,900040);assert.ok(hit.fighters[0].hp<9000);assert.equal(Object.values(hit.fighters[1].pp).filter(n=>n===0).length,2);
 const st=turn(make(e(1235)));assert.equal(Object.values(st.fighters[1].pp).filter(n=>n===0).length,0);assert.equal(st.fighters[0].effects['概率闪避失败清PP'].end,3);
 let s=st;for(let i=2;i<=4;i++)s=turn(s,900031);assert.equal(s.fighters[0].effects['概率闪避失败清PP'],undefined);const after=turn(s,900031,900040);assert.equal(Object.values(after.fighters[1].pp).filter(n=>n===0).length,0);
 const b=make(e(1235));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects['概率闪避失败清PP'],undefined);
});

test('3673 529交换不同最大体力比例，封招失败且不走禁疗或护罩路径',()=>{
 const s=make(e(529),{hp:2250,targetHp:6000,bStats:{maxHp:8000}}),o=turn(s);const damage=o.fighters[0].lastAttackDamage;assert.equal(o.fighters[0].hp,Math.floor((6000-damage)/8000*9000));assert.equal(o.fighters[1].hp,2000);
 const im=structuredClone(s);timer(im,0,'技能禁疗');im.fighters[1].suitState.barrier=1000;const r=turn(im);assert.equal(r.fighters[1].hp,2000);assert.equal(r.fighters[1].suitState.barrier,1000);assert.equal(r.fighters[0].hp,o.fighters[0].hp);
 const b=structuredClone(s);timer(b,0,'skillBlock');const bo=turn(b);assert.equal(bo.fighters[0].hp,2250);assert.equal(bo.fighters[1].hp,6000);
 const dead=turn(make(e(529),{hp:2000,targetHp:1}));assert.equal(dead.fighters[1].hp,0);assert.equal(dead.fighters[0].hp,2000);
});

test('3673 1365睡眠概率随每损失20%提高，免疫失败及伤醒交互',()=>{
 let fullFailed,lowPassed;for(let seed=0;seed<100;seed++){const full=turn(make(e(1365),{seed})),low=turn(make(e(1365),{seed,hp:1799}));if(!full.turns[0].events.some(x=>JSON.stringify(x).includes('陷入睡眠'))&&low.turns[0].events.some(x=>JSON.stringify(x).includes('陷入睡眠'))){fullFailed=seed;lowPassed=low;break;}}assert.notEqual(fullFailed,undefined);assert.ok(lowPassed);assert.equal(lowPassed.fighters[1].pp[key(900041)],99);
 const im=make(e(1365),{seed:fullFailed,hp:1799});timer(im,1,'免异常');assert.equal(turn(im).fighters[1].pp[key(900041)],98);
 for(const hp of [7201,7200,7199]){const s=make(e(1365),{hp,seed:2}),o=turn(s);assert.equal(o.fighters[0].pp[key(s.auditMoveId)],source.moves.find(m=>m.id===s.auditMoveId).pp-1);}
 const b=make(e(1365),{hp:1});timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].ailments['睡眠'],undefined);
});

test('3673 1163累计20至40百分比追加，特攻速度强化与抗性封顶',()=>{
 let s=make(e(1163));for(let i=1;i<=4;i++){const before=s.fighters[1].hp;s=turn(s);assert.equal(before-s.fighters[1].hp-s.fighters[0].lastAttackDamage,Math.floor(680*Math.min(.4,.1+i*.1)));}
 const boost=make(e(1163));boost.fighters[0].stages.spa=2;boost.fighters[0].stages.spe=2;const o=turn(boost);// 用户本轮通则：面板比例粉伤不计能力等级，research/historical-eight-user-confirmations-2026-10-18.json
 assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,136);
 const res=make(e(1163));res.fighters[1].build.resistance.percent=50;const r=turn(res);assert.equal(9000-r.fighters[1].hp-r.fighters[0].lastAttackDamage,68);
 const b=make(e(1163));timer(b,0,'skillBlock',{},1,1);const fail=turn(b);assert.equal(fail.fighters[1].hp,9000);const next=turn(fail);assert.equal(9000-next.fighters[1].hp-next.fighters[0].lastAttackDamage,204);
});

test('3673 魂印959先手增伤后手减伤，消强睡眠与无强化先制',()=>{
 const first=make({moveId:10001,index:null},{soul:959,omit:true});const plain=structuredClone(first);plain.fighters[0].soulId=0;const a=turn(first,900030),b=turn(plain,900030);assert.ok(Math.abs(a.fighters[0].lastAttackDamage-b.fighters[0].lastAttackDamage*1.5)<=1);
 const slow=make({moveId:10001,index:null},{soul:959,omit:true,aStats:{spe:1}});slow.fighters[1].stages.atk=1;timer(slow,1,'幽蝶强化保护');const noSoul=structuredClone(slow);noSoul.fighters[0].soulId=0;const reduced=turn(slow,900031,900040),ref=turn(noSoul,900031,900040);assert.equal(reduced.turns[0].first,1);assert.equal(reduced.fighters[1].lastAttackDamage,Math.floor(ref.fighters[1].lastAttackDamage*.5));
 const priority=turn(make({moveId:10001,index:null},{soul:959,omit:true,aStats:{spe:1}}),900031);assert.equal(priority.turns[0].first,0);
 const clear=make({moveId:10001,index:null},{soul:959,omit:true});clear.fighters[1].stages.def=2;const c=turn(clear,900031);assert.equal(c.fighters[1].stages.def,0);assert.equal(c.fighters[1].pp[key(900041)],99);
 const im=structuredClone(clear);timer(im,1,'免异常');const d=turn(im,900031);assert.equal(d.fighters[1].stages.def,0);assert.equal(d.fighters[1].pp[key(900041)],98);
});

test('3673 魂印959倒下阶段结束仍消回合消强，任一成功睡眠与双保护失败',()=>{
 for(const kind of ['effect','boost','both','none','protected']){const s=make({moveId:10001,index:null},{soul:959,omit:true,hp:1});if(['effect','both','protected'].includes(kind))timer(s,1,'doubleDamage');if(['boost','both','protected'].includes(kind)){s.fighters[1].stages.def=2;timer(s,1,'幽蝶强化保护',{},1,1);}
 if(kind==='protected')timer(s,1,'protect');const o=turn(s,900031,900040);assert.equal(o.fighters[0].hp,0);assert.equal(o.finished,true);if(['effect','both'].includes(kind)){assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.ok(o.turns[0].events.some(x=>JSON.stringify(x).includes('睡眠')));}if(kind==='none'||kind==='protected')assert.equal(o.fighters[1].ailments['睡眠'],undefined);}
 const living=make({moveId:10001,index:null},{soul:959,omit:true});timer(living,1,'doubleDamage');assert.ok(turn(living,900031).fighters[1].effects.doubleDamage);
});

test('3673 58下两回合必暴与40先手双威力，过期封招与后手边界',()=>{
 for(const x of pick(58)){let s=turn(make(x));assert.equal(s.fighters[0].effects['必定暴击'].start,2);assert.equal(s.fighters[0].effects['必定暴击'].end,3);for(let r=2;r<=4;r++){const plain=structuredClone(s);delete plain.fighters[0].effects['必定暴击'];const p=turn(plain,900030),o=turn(s,900030);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-p.fighters[0].lastAttackDamage*(r<=3?2:1))<=1);s=o;}const no=make(x);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].effects['必定暴击'],undefined);}
 for(const slow of [false,true]){const s=make(e(40),{aStats:{spe:slow?1:500}}),o=turn(s),plain=turn(make(e(40),{omit:true,aStats:{spe:slow?1:500}}));assert.ok(Math.abs(o.fighters[0].lastAttackDamage-plain.fighters[0].lastAttackDamage*(slow?1:2))<=3);}
});

test('3673 795每次使用成长25至100，换招不继承、封招用次保留',()=>{
 let s=make(e(795));for(let i=1;i<=5;i++){const plain=structuredClone(s);plain.moveDefinitions[key(s.auditMoveId)].operations=[];const p=turn(plain),o=turn(s);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-p.fighters[0].lastAttackDamage*(1+Math.min(i,4)*.25))<=2);s=o;}const control=structuredClone(s);control.fighters[0].soulState.damageGrowth={};const neutral=turn(s,900030),ref=turn(control,900030);assert.equal(neutral.fighters[0].lastAttackDamage,ref.fighters[0].lastAttackDamage);
 const b=make(e(795));timer(b,0,'skillBlock',{},1,1);const f=turn(b);assert.equal(f.fighters[1].hp,9000);const baseline=structuredClone(f);baseline.moveDefinitions[key(f.auditMoveId)].operations=[];const next=turn(f),plain=turn(baseline);assert.ok(Math.abs(next.fighters[0].lastAttackDamage-plain.fighters[0].lastAttackDamage*1.5)<=2);
});

test('3673 450随机回复150至300与656概率随机清三PP，禁疗封顶失败',()=>{
 const healed=new Set();let yes,no;for(let seed=0;seed<120;seed++){const s=make(e(450),{hp:5000,seed}),o=turn(s),n=o.fighters[0].hp-5000;assert.ok(n>=150&&n<=300);healed.add(n);const p=turn(make(e(656),{seed})),count=Object.values(p.fighters[1].pp).filter(n=>n===0).length;if(count===3)yes=p;else{assert.equal(count,0);no=p;}}assert.ok(healed.size>30);assert.ok(yes&&no);
 const cap=turn(make(e(450),{hp:8999}));assert.equal(cap.fighters[0].hp,9000);const ban=make(e(450),{hp:5000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,5000);
 const b=make(e(656));timer(b,0,'skillBlock');assert.equal(Object.values(turn(b).fighters[1].pp).filter(n=>n===0).length,0);
});

test('3673 191反弹睡眠四回合到期与1322受击睡眠失败降级',()=>{
 const s=make(e(191),{opponentMove:32340,opponentEffectId:1365,seed:1});let ready=turn(s);const o=turn(ready,900031,900042);assert.equal(o.fighters[0].ailments['睡眠'],undefined);assert.ok(o.turns[1].events.some(x=>JSON.stringify(x).includes('睡眠')));assert.equal(o.fighters[0].effects.reflect.end,4);for(let r=2;r<=4;r++)ready=turn(ready,900031);assert.equal(ready.fighters[0].effects.reflect,undefined);
 let yes;for(let seed=0;seed<10;seed++){const p=turn(make(e(1322),{seed}),undefined,900040);if(p.fighters[1].ailments['睡眠'])yes=p;}assert.ok(yes);assert.equal(yes.fighters[0].effects['诅咒受击反应'].end,3);
 const im=make(e(1322));timer(im,1,'免异常');const f=turn(im,undefined,900040);for(const k of keys)assert.equal(f.fighters[1].stages[k],-1);
 const both=structuredClone(im);timer(both,1,'免弱');assert.equal(turn(both,undefined,900040).fighters[1].stages.atk,0);const status=turn(make(e(1322)));assert.equal(status.fighters[1].ailments['睡眠'],undefined);
 const b=make(e(191));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects.reflect,undefined);
});

test('3673 1283先手双强化与843下两回合先制，禁强化与六级边界',()=>{
 for(const slow of [false,true]){const s=make(e(1283),{aStats:{spe:slow?1:500}}),o=turn(s);for(const k of keys)assert.equal(o.fighters[0].stages[k],slow?1:2);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);}
 const cap=make(e(1283));for(const k of keys)cap.fighters[0].stages[k]=6;assert.equal(turn(cap).fighters[0].stages.atk,6);
 let s=turn(make(e(843),{aStats:{spe:1}}));assert.equal(s.turns[0].first,1);for(let r=2;r<=4;r++){s=turn(s,900031);assert.equal(s.turns[r-1].first,r<=3?0:1);}const b=make(e(843));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects.id984,undefined);
});

test('3673 971四回合使用技能吸取，半血严格翻倍、禁疗与实际扣血上限',()=>{
 for(const hp of [4499,4500,9000]){const s=make(e(971),{hp}),o=turn(s);assert.equal(9000-o.fighters[1].hp,hp<4500?6000:3000);assert.equal(o.fighters[0].hp,Math.min(9000,hp+(hp<4500?6000:3000)));assert.equal(o.fighters[0].effects['用招低体双吸'].end,4);}
 let s=turn(make(e(971)));for(let r=2;r<=5;r++){s.fighters[1].hp=9000;const o=turn(s,900031);assert.equal(9000-o.fighters[1].hp,r<=4?3000:0);s=o;}
 const ban=make(e(971),{hp:1000});timer(ban,0,'技能禁疗');const b=turn(ban);assert.equal(b.fighters[0].hp,1000);assert.equal(b.fighters[1].hp,3000);
 const low=turn(make(e(971),{hp:1000,targetHp:20}));assert.equal(low.fighters[0].hp,7000);assert.equal(low.fighters[1].hp,0);
 const block=make(e(971));timer(block,0,'skillBlock');assert.equal(turn(block).fighters[1].hp,9000);
});

test('3673 697忽略限制及699忽略攻击免疫，普通攻击受限与封招不绕过',()=>{
 for(const [id,kind,data]of [[697,'攻击伤害上限',{amount:1}],[699,'攻击伤害免疫',{}]]){const s=make(e(id));timer(s,1,kind,data);const o=turn(s),plain=make(e(id),{omit:true});timer(plain,1,kind,data);assert.ok(o.fighters[0].lastAttackDamage>1);assert.equal(turn(plain).fighters[0].lastAttackDamage,id===697?1:0);const b=structuredClone(s);timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);}
 const s=make({moveId:32340,index:null});timer(s,1,'攻击伤害上限',{amount:1});timer(s,1,'攻击伤害免疫');assert.ok(turn(s).fighters[0].lastAttackDamage>1);
});

test('3673 180消回合及928成功免下次异常，保护失败与一次消费',()=>{
 for(const id of [180,928]){const s=make(e(id));timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);if(id===928)assert.equal(o.fighters[0].counts.immune,1);const no=turn(make(e(id)));if(id===928)assert.equal(no.fighters[0].counts.immune??0,0);const p=structuredClone(s);timer(p,1,'protect');assert.ok(turn(p).fighters[1].effects.doubleDamage);}
 let s=make(e(928),{opponentMove:32340,opponentEffectId:1365,seed:0});timer(s,1,'doubleDamage');s=turn(s);s.fighters[1].hp=1;const o=turn(s,900031,900042);assert.equal(o.fighters[0].counts.immune,0);assert.equal(o.fighters[0].ailments['睡眠'],undefined);
});

test('3673 679两回合只禁技能回复，失败到期与血药交互',()=>{
 const s=make(e(679),{opponentMove:32338,opponentEffectId:450,targetHp:4000});const o=turn(s,undefined,900042);assert.equal(o.fighters[1].hp,4000-o.fighters[0].lastAttackDamage);assert.equal(o.fighters[1].effects['技能禁疗'].end,2);const n=turn(o,900031,900042);assert.equal(n.fighters[1].hp,o.fighters[1].hp);const end=turn(n,900031,900042);assert.ok(end.fighters[1].hp>n.fighters[1].hp);
 const potion=E.resolveTurn(o,[key(900031),'potion:hp']);assert.equal(potion.fighters[1].hp,o.fighters[1].hp+250);
 const b=make(e(679));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].effects['技能禁疗'],undefined);
});
test('3673 749概率降级成功失败、免弱和负六级边界',()=>{
 let yes,no;for(let seed=0;seed<40;seed++){const s=make(e(749),{seed}),o=turn(s);if(o.fighters[1].stages.atk===-1)yes=s;else no=o;}assert.ok(yes&&no);for(const k of keys)assert.equal(turn(yes).fighters[1].stages[k],-1);
 const im=structuredClone(yes);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);for(const k of keys)yes.fighters[1].stages[k]=-6;assert.equal(turn(yes).fighters[1].stages.atk,-6);
});


test('3673 1365恰好损失20%跨越概率阈值，连续区间不提前增加',()=>{
 let found=false;for(let seed=0;seed<250;seed++){const before=turn(make(e(1365),{hp:7201,seed})),at=turn(make(e(1365),{hp:7200,seed}));const used=before.fighters[1].pp[key(900041)],usedAt=at.fighters[1].pp[key(900041)];if(used===98&&usedAt===99){assert.equal(used,98);assert.equal(usedAt,99);const below=turn(make(e(1365),{hp:7199,seed}));assert.equal(below.fighters[1].pp[key(900041)],99);found=true;break;}}assert.ok(found);
});

test('3673 魂印959倒下后仅能力提升也能消除并睡眠，异常免疫拒绝补偿',()=>{
 for(const immune of [false,true]){const s=make({moveId:10001,index:null},{soul:959,omit:true,hp:1,opponentMove:20168});const m=s.moveDefinitions[key(900042)];m.kind='physical';m.type='普通';m.power=40;if(immune)timer(s,1,'免异常');timer(s,1,'protect');const o=turn(s,900031,900042);assert.equal(o.fighters[0].hp,0);assert.equal(o.fighters[1].stages.acc,0);assert.ok(o.fighters[1].effects.protect);assert.equal(o.turns[0].events.some(x=>JSON.stringify(x).includes('陷入睡眠')), !immune);}
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3673 1322真实百分之百异常不被寒月误作百分之一',()=>{const o=require('./helpers/assert-1322-cold-moon.cjs')(3673);assert.equal(o.fighters[1].stages.atk,0);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3673 32338效果656公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-656-907-protection.cjs')(3673,656,32338);assert.ok(o.fighters[0].hp>0);});}
