'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3627-battle.cjs');const {E,source,keys,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick}=H;
const dmg=o=>o.fighters[0].lastAttackDamage??0,hp=o=>o.fighters.map(f=>f.hp);
test('3627 40先手与37半血和645三分之一严格威力条件',()=>{
 for(const id of [40,37,645]){const e=pick(id)[0],m=source.moves.find(m=>m.id===e.moveId),threshold=id===37?4500:3000;for(const yes of [false,true]){const s=make(e,id===40?{aStats:{spe:yes?500:1}}:{hp:yes?threshold-1:threshold}),o=turn(s);assert.ok(o.turns[0].events.find(x=>x.kind==='damage').detail.includes('威力 '+m.power*(yes?(id===645?3:2):1)));}const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);}
});
test('3627 63反馈负等级与85吸取正等级、免弱禁强及上下限',()=>{
 for(const e of pick(63)){const s=make(e);s.fighters[0].stages.atk=-6;s.fighters[0].stages.def=2;let o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.def,2);assert.equal(o.fighters[1].stages.atk,-6);timer(s,1,'免弱');o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[1].stages.atk,0);assert.deepEqual(Object.values(turn(make(e)).fighters[1].stages),Array(6).fill(0));}
 const e=pick(85)[0],s=make(e);s.fighters[1].stages.acc=3;s.fighters[1].stages.atk=-2;s.fighters[0].stages.acc=5;const o=turn(s);assert.equal(o.fighters[0].stages.acc,6);assert.equal(o.fighters[1].stages.acc,0);assert.equal(o.fighters[1].stages.atk,-2);timer(s,0,'禁强化');assert.equal(turn(s).fighters[1].stages.acc,3);assert.equal(turn(s).fighters[0].stages.acc,5);
});
test('3627 125两回合限伤250与447两个实例保底及免攻',()=>{
 for(const e of pick(125)){let s=make(e,{bStats:{atk:9999},aStats:{def:1}});for(let r=1;r<=3;r++){const before=s.fighters[0].hp;s=turn(s,r===1?e.moveId:IDLE,HIT);assert.equal(before-s.fighters[0].hp<=250,r<=2);}}
 for(const e of pick(447)){const s=make(e,{aStats:{atk:1,spa:1}});assert.equal(dmg(turn(s)),e.params[0]);timer(s,1,'鬼王攻击免疫');assert.equal(dmg(turn(s)),0);delete s.fighters[1].effects['鬼王攻击免疫'];timer(s,1,'攻击伤害上限',{amount:100});assert.equal(dmg(turn(s)),100);}
});
test('3627 88十五概率翻倍、未触发对照和免伤',()=>{
 const e=pick(88)[0],seen=new Set();for(let seed=0;seed<100;seed++){const s=make(e,{seed}),o=turn(s),row=o.turns[0].events.find(x=>x.kind==='damage');const yes=row.detail.includes('增减伤 2 ');seen.add(yes);const match=row.detail.match(/基础 (\d+).*本系 ([\d.]+).*属性 ([\d.]+).*浮动 (\d+)%/);assert.equal(dmg(o),Math.floor(Number(match[1])*Number(match[2])*Number(match[3])*(yes?2:1)*Number(match[4])/100));}assert.deepEqual(seen,new Set([false,true]));const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
});
test('3627 60每回合固伤两回合与77用招回复两回合边界',()=>{
 const e=pick(60)[0];let s=turn(make(e));assert.equal(s.fighters[1].hp,8850);s=wait(s);assert.equal(s.fighters[1].hp,8700);assert.equal(wait(s).fighters[1].hp,8700);const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
 const x=pick(77)[0];let t=turn(make(x,{hp:1000}));assert.equal(t.fighters[0].hp,1280);t=wait(t);assert.equal(t.fighters[0].hp,1560);assert.equal(wait(t).fighters[0].hp,1560);const ban=make(x,{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);assert.equal(turn(make(x,{hp:8999})).fighters[0].hp,9000);
});
test('3627 523双防与585全强化和1344后手翻倍、六级禁强',()=>{
 for(const id of [523,585,1344]){const e=pick(id)[0],o=turn(make(e));assert.deepEqual(Object.values(o.fighters[0].stages),id===523?[0,1,0,1,0,0]:Array(6).fill(1));if(id===1344){const late=turn(make(e,{aStats:{spe:1}}));assert.deepEqual(Object.values(late.fighters[0].stages),Array(6).fill(2));}const cap=make(e);allStages(cap,0,6);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));const ban=make(e);timer(ban,0,'禁强化');assert.deepEqual(Object.values(turn(ban).fighters[0].stages),Array(6).fill(0));}
});
test('3627 730下回合起攻速每回合加一与47免弱四回合',()=>{
 const e=pick(730)[0];let s=turn(make(e));assert.equal(s.fighters[0].stages.atk,0);for(let r=2;r<=5;r++){s=wait(s);assert.equal(s.fighters[0].stages.atk,Math.min(r-1,3));assert.equal(s.fighters[0].stages.spe,Math.min(r-1,3));}const ban=make(e);timer(ban,0,'禁强化');assert.equal(wait(turn(ban)).fighters[0].stages.atk,0);const cap=make(e);allStages(cap,0,6);assert.equal(wait(turn(cap)).fighters[0].stages.atk,6);
 const x=pick(47)[0];let t=make(x,{opponentEffect:pick(5)[0]});for(let r=1;r<=5;r++){t=turn(t,r===1?x.moveId:IDLE,900023);assert.equal(t.fighters[0].stages.def,r<=4?0:-2);}
});
test('3627 851五异常随机两种不重复、免疫次数与真实毒伤',()=>{
 const e=pick(851)[0],seen=new Set();for(let seed=0;seed<50;seed++){const s=make(e,{seed}),o=turn(s),a=o.turns[0].events.filter(x=>x.text.includes('陷入')).map(x=>x.text.match(/陷入(.+?)（/)[1]);assert.equal(a.length,2);assert.equal(new Set(a).size,2);a.forEach(k=>seen.add(k));const pink=a.filter(k=>['烧伤','冻伤','中毒'].includes(k)).length;assert.equal(9000-o.fighters[1].hp-dmg(o),1125*pink);}assert.deepEqual(seen,new Set(['害怕','失明','烧伤','冻伤','中毒']));const im=make(e);im.fighters[1].counts.immune=2;assert.deepEqual(turn(im).fighters[1].ailments,{});assert.equal(turn(im).fighters[1].counts.immune,0);
});
test('3627 532与1065实际回复等量粉伤、体力阈值和回合期限',()=>{
 for(const id of [532,1065]){const e=pick(id)[0];for(const n of [1000,4499,4500,4501,8999,9000]){const o=turn(make(e,{hp:n})),gain=Math.min(9000-n,id===1065&&n<4500?6000:3000);assert.deepEqual(hp(o),[n+gain,9000-gain]);}
 let s=make(e,{hp:1000});for(let r=1;r<=e.params[0]+1;r++){s.fighters[0].hp=1000;s.fighters[1].hp=9000;s=turn(s,r===1?e.moveId:IDLE);const amount=r<=e.params[0]?(id===1065?6000:3000):0;assert.deepEqual(hp(s),[1000+amount,9000-amount]);}
 const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.deepEqual(hp(turn(ban)),[1000,9000]);const im=make(e,{hp:1000});timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[0].hp,id===1065?7000:4000);assert.equal(turn(im).fighters[1].hp,9000);
 }
});
test('3627 854下次高于120攻击无效、等值保留次数及控制不消费',()=>{
 for(const e of pick(854)){let s=turn(make(e));assert.equal(s.fighters[1].counts.nextHighPowerInvalid,1);for(const power of [119,120,121,121]){s.moveDefinitions[key(HIT)].power=power;const before=s.fighters[0].hp;s=turn(s,IDLE,HIT);if(power===121&&s.fighters[1].pp[key(HIT)]===96){assert.equal(s.fighters[0].hp,before);assert.equal(s.fighters[1].counts.nextHighPowerInvalid,0);}else assert.ok(s.fighters[0].hp<before);}
 const c=turn(make(e));c.moveDefinitions[key(HIT)].power=150;c.fighters[1].ailments['疲惫']=c.round;const o=turn(c,IDLE,HIT);assert.equal(o.fighters[1].counts.nextHighPowerInvalid,1);assert.equal(o.fighters[1].pp[key(HIT)],99);
 }
});
test('3627 180消回合与33消强化、免断负等级保留',()=>{
 const e=pick(180)[0],s=make(e);timer(s,1,'id913',{bonus:1});assert.equal(turn(s).fighters[1].effects.id913,undefined);timer(s,1,'protect');assert.ok(turn(s).fighters[1].effects.id913);assert.deepEqual(turn(make(e)).fighters[1].effects,{});
 const x=pick(33)[0],t=make(x);t.fighters[1].stages.atk=6;t.fighters[1].stages.def=-2;const o=turn(t);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.def,-2);timer(t,0,'skillBlock');assert.equal(turn(t).fighters[1].stages.atk,6);
});
test('3627 852三成追加低于三分之一翻倍、禁疗免伤残血',()=>{
 for(const e of pick(852)){for(const n of [2999,3000,3001]){const o=turn(make(e,{hp:n})),amount=n<3000?5400:2700;assert.equal(o.fighters[0].hp,n+amount);assert.equal(9000-o.fighters[1].hp-dmg(o),amount);}const s=make(e,{hp:1000});timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);const low=turn(make(e,{hp:1000,targetHp:1}));assert.equal(low.fighters[0].hp,1000);assert.equal(low.fighters[1].hp,0);}
});
test('3627 985吸强成功封属与1350反弱成功封攻下回合',()=>{
 const e=pick(985)[0],s=make(e,{opponentEffect:pick(4)[0]});s.fighters[1].stages.atk=2;let o=turn(s,e.moveId,900023);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.acc,1);o=turn(o,IDLE,900023);assert.equal(o.fighters[1].stages.acc,1);o=turn(o,IDLE,900023);assert.equal(o.fighters[1].stages.acc,2);
 const no=turn(make(e));assert.equal(no.fighters[1].effects.statusBlock,undefined);const protectedTarget=make(e);protectedTarget.fighters[1].stages.atk=2;timer(protectedTarget,1,'幽蝶强化保护');assert.equal(turn(protectedTarget).fighters[1].effects.statusBlock,undefined);timer(s,0,'禁强化');assert.equal(turn(s).fighters[1].effects.statusBlock,undefined);
 const x=pick(1350)[0],w=make(x);w.fighters[0].stages.atk=-6;w.fighters[0].stages.def=2;const out=turn(w,x.moveId,HIT);assert.ok(out.fighters[0].hp<9000);assert.equal(out.fighters[0].stages.atk,6);assert.equal(out.fighters[0].stages.def,2);const n=turn(out,IDLE,HIT);assert.equal(n.fighters[0].hp,out.fighters[0].hp);assert.ok(turn(n,IDLE,HIT).fighters[0].hp<n.fighters[0].hp);assert.equal(turn(make(x)).fighters[1].effects.attackBlock,undefined);timer(w,0,'禁强化');assert.equal(turn(w).fighters[0].stages.atk,-6);assert.equal(turn(w).fighters[1].effects.attackBlock,undefined);
});
test('3627 699穿透免攻与31十二至二十段、完整技能仅一次852追加',()=>{
 const e=pick(699)[0],s=make(e);timer(s,1,'鬼王攻击免疫');assert.ok(dmg(turn(s))>0);const no=make(e,{omit:true});timer(no,1,'鬼王攻击免疫');assert.equal(dmg(turn(no)),0);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);
 const x=pick(31)[0],counts=new Set();for(let seed=0;seed<90;seed++){const o=turn(make(x,{seed})),rows=o.turns[0].events.filter(x=>x.kind==='damage');counts.add(rows.length);assert.ok(rows.length>=12&&rows.length<=20);assert.equal(dmg(o),rows.reduce((n,x)=>n+Number(x.text.match(/损失 (\d+)/)[1]),0));}assert.ok(counts.has(12));assert.ok(counts.has(20));assert.equal(turn(make(x,{targetHp:1})).turns[0].events.filter(x=>x.kind==='damage').length,1);
 const full=make({moveId:32127,index:null},{hp:4000}),o=turn(full);assert.equal(o.fighters[0].hp,6700);assert.equal(9000-o.fighters[1].hp-dmg(o),2700);assert.ok(o.turns[0].events.filter(x=>x.kind==='damage').length>=12);
});
test('3627 760微弱转普通与582未击败下回合必暴和1253击败翻倍',()=>{
 const e=pick(760)[0],s=make(e),weak=Object.keys(s.typeChart.rows).find(t=>E.typeEffectiveness('次元',t,s.typeChart)<1&&E.typeEffectiveness('次元',t,s.typeChart)>0);assert.ok(weak);s.fighters[1].type=weak;const o=turn(s),n=make(e,{omit:true});n.fighters[1].type=weak;assert.ok(dmg(o)>dmg(turn(n)));assert.ok(o.turns[0].events.find(x=>x.kind==='damage').detail.includes('属性 1 '));
 const x=pick(582)[0],a=turn(make(x));a.rng=0;const b=turn(a,10250);assert.ok(b.turns.at(-1).events.find(x=>x.kind==='damage').detail.includes('暴击 2 '));b.rng=0;assert.ok(turn(b,10250).turns.at(-1).events.find(x=>x.kind==='damage').detail.includes('暴击 1 '));assert.equal(turn(make(x,{targetHp:1})).fighters[0].effects['必定暴击'],undefined);
 const y=pick(1253)[0];for(const targetHp of [1,9000]){const t=make(y,{targetHp});t.fighters[0].stages.atk=2;t.fighters[0].stages.def=5;t.fighters[0].stages.spa=-2;const out=turn(t);assert.equal(out.fighters[0].stages.atk,targetHp===1?4:2);assert.equal(out.fighters[0].stages.def,targetHp===1?6:5);assert.equal(out.fighters[0].stages.spa,-2);timer(t,0,'禁强化');assert.equal(turn(t).fighters[0].stages.atk,2);}
});
test('3627 853体力速度和递增25至45粉伤、封招计次与免伤',()=>{
 const e=pick(853)[0];let s=make(e);for(let r=1;r<=4;r++){s.fighters[1].hp=9000;s.rng=0;s=turn(s);assert.equal(9000-s.fighters[1].hp-dmg(s),Math.floor(9500*Math.min(.45,.25+.1*(r-1))));}
 for(const stage of [-6,-2,0,2,6]){const speed=make(e);speed.fighters[0].stages.spe=stage;const o=turn(speed);assert.equal(9000-o.fighters[1].hp-dmg(o),2375,'用户确认：面板9500乘25%不计速度等级 '+stage);}const blocked=make(e);timer(blocked,0,'skillBlock',{},1);let n=turn(blocked);assert.equal(n.fighters[1].hp,9000);n=turn(n);assert.equal(9000-n.fighters[1].hp-dmg(n),3325);const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);assert.equal(turn(make(e,{targetHp:1})).fighters[1].hp,0);
});
test('3627 净火繁星只攻击当前对手一次并保留三目标来源',()=>{
 const m=source.moves.find(m=>m.id===14045),s=make({moveId:14045,index:null}),o=turn(s);assert.equal(m.sourceTargetCount,3);assert.equal(o.turns[0].events.filter(x=>x.kind==='damage').length,1);assert.equal(9000-o.fighters[1].hp,dmg(o));assert.equal(o.fighters[0].pp[key(14045)],m.pp-1);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);const im=make({moveId:14045,index:null});timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
});
