'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3626-battle.cjs');const {E,source,keys,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const dmg=o=>o.fighters[0].lastAttackDamage??0,hp=o=>o.fighters.map(f=>f.hp),has=(o,k)=>o.turns.at(-1).events.some(x=>x.text.includes('陷入'+k));
test('3626 15害怕与11中毒的概率、免疫和真实行动损血',()=>{
 for(const id of [15,11]){const e=pick(id)[0],name=id===15?'害怕':'中毒',yes=seedCase(e,o=>has(o,name));assert.ok(has(yes.out,name));
 if(e.params[0]<100)assert.ok(!has(seedCase(e,o=>!has(o,name)).out,name));
 const immune=make(e,{seed:yes.seed});timer(immune,1,'免异常');assert.ok(!has(turn(immune),name));
 const s=make(e,{seed:yes.seed}),o=turn(s,e.moveId,HIT);if(id===15){assert.equal(o.fighters[1].pp[key(HIT)],99);assert.equal(o.fighters[0].hp,9000);}else assert.equal(9000-o.fighters[1].hp-dmg(o),1125);
 timer(s,0,'skillBlock');assert.deepEqual(turn(s).fighters[1].ailments,{});
 }
});
test('3626 1127吸强或全弱分支、负等级保留和免弱禁强',()=>{
 const e=pick(1127)[0],s=make(e);s.fighters[1].stages.atk=3;s.fighters[1].stages.def=-2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[0].stages.atk,3);assert.equal(o.fighters[1].stages.def,-2);
 assert.deepEqual(Object.values(turn(make(e)).fighters[1].stages),Array(6).fill(-1));const im=make(e);timer(im,1,'免弱');assert.deepEqual(Object.values(turn(im).fighters[1].stages),Array(6).fill(0));allStages(im,1,-6);assert.deepEqual(Object.values(turn(im).fighters[1].stages),Array(6).fill(-6));
 timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);const cap=make(e);cap.fighters[0].stages.atk=5;cap.fighters[1].stages.atk=3;assert.equal(turn(cap).fighters[0].stages.atk,6);
});
test('3626 494无视正等级影响速度双防攻击命中但不删除等级',()=>{
 const e=pick(494)[0],s=make(e,{aStats:{spe:200},bStats:{spe:100}});s.moveDefinitions[key(HIT)].priority=3;s.fighters[1].stages.spe=6;s.fighters[1].stages.spd=6;s.fighters[1].stages.atk=6;
 const o=turn(s,e.moveId,HIT),plain=make(e,{aStats:{spe:200},bStats:{spe:100}});plain.moveDefinitions[key(HIT)].priority=3;const p=turn(plain,e.moveId,HIT);assert.equal(o.turns[0].first,0);assert.deepEqual(hp(o),hp(p));assert.equal(o.fighters[1].stages.spd,6);
 const no=make(e,{omit:true,aStats:{spe:200},bStats:{spe:100}});no.moveDefinitions[key(HIT)].priority=3;allStages(no,1,6);assert.equal(turn(no,e.moveId,HIT).turns[0].first,1);assert.ok(dmg(turn(no))<dmg(o));
 const neg=make(e);neg.fighters[1].stages.spd=-2;assert.ok(dmg(turn(neg))>dmg(turn(make(e))));
 const next=turn(o,10086,HIT),nextPlain=structuredClone(o);nextPlain.fighters[1].stages.atk=0;assert.ok(next.fighters[0].hp<turn(nextPlain,10086,HIT).fighters[0].hp);
 for(let seed=0;seed<16;seed++){const boosted=make(e,{seed});boosted.fighters[1].stages.acc=6;boosted.moveDefinitions[key(HIT)].accuracy=40;const unboosted=structuredClone(boosted);unboosted.fighters[1].stages.acc=0;assert.equal(turn(boosted,e.moveId,HIT).fighters[0].hp,turn(unboosted,e.moveId,HIT).fighters[0].hp);}
});
test('3626 425与849随机不重复吸等级、三回合与免弱禁强边界',()=>{
 for(const id of [425,849]){const e=pick(id)[0],n=id===425?2:3,s=make(e),o=turn(s);assert.equal(Object.values(o.fighters[0].stages).filter(x=>x===1).length,n);assert.equal(Object.values(o.fighters[1].stages).filter(x=>x===-1).length,n);
 const im=make(e);timer(im,0,'禁强化');timer(im,1,'免弱');const b=turn(im);assert.deepEqual(Object.values(b.fighters[0].stages),Array(6).fill(0));assert.deepEqual(Object.values(b.fighters[1].stages),Array(6).fill(0));
 const cap=make(e);allStages(cap,0,6);allStages(cap,1,-6);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));assert.deepEqual(Object.values(turn(cap).fighters[1].stages),Array(6).fill(-6));
 if(id===849){let t=o;for(let r=2;r<=4;r++){t=wait(t);assert.equal(Object.values(t.fighters[0].stages).reduce((a,b)=>a+b),3*Math.min(r,3));}}
 }
});
test('3626 762按已损体力回复三回合、取整满血与禁疗',()=>{
 const e=pick(762)[0];let s=make(e,{hp:1001});for(const [r,n]of [[1,5000],[2,7000],[3,8000],[4,8000]]){s=turn(s,r===1?e.moveId:IDLE);assert.equal(s.fighters[0].hp,n);}
 assert.equal(turn(make(e)).fighters[0].hp,9000);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);const blocked=make(e,{hp:1000});timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].hp,1000);
});
test('3626 765禁强化三回合、到期恢复且原等级保留',()=>{
 const e=pick(765)[0],s=make(e,{opponentEffect:pick(962)[0]});s.fighters[1].stages.atk=1;let o=turn(s,e.moveId,900023);assert.equal(o.fighters[1].stages.atk,1);for(let r=2;r<=4;r++){o=turn(o,IDLE,900023);assert.equal(o.fighters[1].stages.atk,r<=3?1:2);}const block=make(e,{opponentEffect:pick(962)[0]});timer(block,0,'skillBlock');assert.equal(turn(block,e.moveId,900023).fighters[1].stages.atk,2);
});
test('3626 645严格三分之一威力三倍与167弱化固伤',()=>{
 const e=pick(645)[0];for(const n of [2999,3000,3001]){const o=turn(make(e,{hp:n}));assert.ok(o.turns[0].events.find(x=>x.kind==='damage').detail.includes('威力 '+(n<3000?240:80)));}const im=make(e,{hp:2999});timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
 const x=pick(167)[0],s=make(x);s.fighters[1].stages.acc=-1;const o=turn(s);assert.equal(9000-o.fighters[1].hp-dmg(o),100);assert.equal(9000-turn(make(x)).fighters[1].hp-dmg(turn(make(x))),0);timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);assert.equal(turn(make(x,{targetHp:1})).fighters[1].hp,0);
});
test('3626 790穿透伤害限制三回合、封招及到期恢复限伤',()=>{
 const e=pick(790)[0],s=make(e);timer(s,1,'攻击伤害上限',{amount:1});let o=turn(s);for(let r=2;r<=4;r++){o=turn(o,10086);assert.equal(dmg(o)>1,r<=3);}const block=make(e);timer(block,0,'skillBlock');const b=turn(block);delete b.fighters[0].effects.skillBlock;timer(b,1,'攻击伤害上限',{amount:1});assert.equal(dmg(turn(b,10086)),1);
});
test('3626 941出手体力概率、满血必控、低体失败及免疫',()=>{
 const e=pick(941)[0];for(const hpValue of [1,4500,9000]){const results=new Set();for(let seed=0;seed<48;seed++){const o=turn(make(e,{hp:hpValue,seed}));results.add(has(o,'害怕'));}if(hpValue===9000)assert.deepEqual([...results],[true]);else if(hpValue===1)assert.ok(results.has(false));else assert.deepEqual(results,new Set([false,true]));}
 const im=make(e);timer(im,1,'免异常');assert.equal(has(turn(im),'害怕'),false);timer(im,0,'skillBlock');assert.deepEqual(turn(im).fighters[1].ailments,{});
 const late=make(e,{aStats:{spe:1},bStats:{atk:400}});const o=turn(late,e.moveId,HIT);assert.ok(o.fighters[0].hp<9000);assert.equal(o.turns[0].first,1);
});
test('3626 136未命中回复四分之一、命中不回及禁疗封顶',()=>{
 const e=pick(136)[0],s=make(e,{hp:1000,hit:false});timer(s,0,'攻击必失');assert.equal(turn(s).fighters[0].hp,3250);assert.equal(turn(make(e,{hp:1000})).fighters[0].hp,1000);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);const cap=make(e,{hp:8999,hit:false});timer(cap,0,'攻击必失');assert.equal(turn(cap).fighters[0].hp,9000);timer(cap,0,'skillBlock');assert.equal(turn(cap).fighters[0].hp,8999);
});
test('3626 962无强化翻倍、597四回合用招吸取与禁疗实伤',()=>{
 const e=pick(962)[0];for(const start of [-1,0,1,5,6]){const s=make(e);allStages(s,0,start);assert.deepEqual(Object.values(turn(s).fighters[0].stages),Array(6).fill(Math.min(6,start+(start>0?1:2))));}const ban=make(e);timer(ban,0,'禁强化');assert.deepEqual(Object.values(turn(ban).fighters[0].stages),Array(6).fill(0));
 const x=pick(597)[0];let s=make(x,{hp:1000});for(let r=1;r<=5;r++){s.fighters[0].hp=1000;s.fighters[1].hp=9000;s=turn(s,r===1?x.moveId:IDLE);assert.deepEqual(hp(s),r<=4?[4000,6000]:[1000,9000]);}
 const low=make(x,{hp:1000,targetHp:50});assert.deepEqual(hp(turn(low)),[1050,0]);const no=make(x,{hp:1000});timer(no,0,'技能禁疗');assert.deepEqual(hp(turn(no)),[1000,6000]);timer(no,1,'当回合免伤');assert.deepEqual(hp(turn(no)),[1000,9000]);
});
test('3626 1027无正等级才固伤四回合、消强后触发及免伤',()=>{
 const e=pick(1027)[0];let s=make(e);for(let r=1;r<=5;r++){s=turn(s,r===1?e.moveId:IDLE);assert.equal(s.fighters[1].hp,9000-300*Math.min(r,4));}
 const positive=make(e);positive.fighters[0].stages.acc=1;let o=turn(positive);assert.equal(o.fighters[1].hp,9000);o.fighters[0].stages.acc=0;o=wait(o);assert.equal(o.fighters[1].hp,8700);
 const neg=make(e);neg.fighters[0].stages.atk=-6;assert.equal(turn(neg).fighters[1].hp,8700);const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);const low=make(e,{targetHp:200});assert.equal(turn(low).fighters[1].hp,0);
 const full=turn(make({moveId:26169,index:null},{hp:1000}));assert.equal(full.fighters[1].hp,6000);assert.deepEqual(Object.values(full.fighters[0].stages),Array(6).fill(2));
});
test('3626 449弱化八成感染、免疫与解除后双攻下降中毒',()=>{
 const e=pick(449)[0],seen=new Set();let success;for(let seed=0;seed<64;seed++){const s=make(e,{seed});s.fighters[1].stages.acc=-1;const o=turn(s);seen.add(has(o,'感染'));if(o.fighters[1].ailments['感染']>=o.round)success=s;}assert.deepEqual(seen,new Set([true,false]));assert.equal(has(turn(make(e)),'感染'),false);timer(success,1,'免异常');assert.equal(has(turn(success),'感染'),false);delete success.fighters[1].effects['免异常'];let o=turn(success);const pp=o.fighters[1].pp[key(HIT)];o=turn(o,IDLE,HIT);assert.equal(o.fighters[1].pp[key(HIT)],pp);while(o.fighters[1].ailments['感染']>=o.round)o=wait(o);assert.equal(o.fighters[1].stages.atk,-1);assert.equal(o.fighters[1].stages.spa,-1);const before=o.fighters[1].hp;o=wait(o);assert.equal(before-o.fighters[1].hp,1125);
});
test('3626 752异常才回合末削三分之一、无异常和免伤',()=>{
 const e=pick(752)[0],s=make(e);s.fighters[1].ailments['失明']=9;const o=turn(s);assert.equal(9000-o.fighters[1].hp-dmg(o),3000);const plain=turn(make(e));assert.equal(9000-plain.fighters[1].hp-dmg(plain),0);assert.equal(wait(o).fighters[1].hp,o.fighters[1].hp);timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);
});
test('3626 963自身正等级吸取与515自身弱化固伤清弱独立',()=>{
 const e=pick(963)[0],s=make(e,{hp:1000});s.fighters[0].stages.acc=1;const o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(9000-o.fighters[1].hp-dmg(o),3000);assert.equal(turn(make(e,{hp:1000})).fighters[0].hp,1000);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);
 const x=pick(515)[0],w=make(x);w.fighters[0].stages.atk=-6;w.fighters[0].stages.def=2;const out=turn(w);assert.equal(out.fighters[0].stages.atk,0);assert.equal(out.fighters[0].stages.def,2);assert.equal(9000-out.fighters[1].hp-dmg(out),300);assert.equal(9000-turn(make(x)).fighters[1].hp-dmg(turn(make(x))),0);timer(w,1,'当回合免伤');assert.equal(turn(w).fighters[0].stages.atk,0);assert.equal(turn(w).fighters[1].hp,9000);
 const full=make({moveId:32124,index:null},{hp:1000});full.fighters[0].stages.acc=1;full.fighters[0].stages.atk=-1;timer(full,1,'id913',{bonus:1});const f=turn(full);assert.equal(f.fighters[0].hp,4000);assert.equal(f.fighters[0].counts.immune,1);assert.equal(f.fighters[0].stages.atk,0);assert.equal(9000-f.fighters[1].hp-dmg(f),3300);
});

