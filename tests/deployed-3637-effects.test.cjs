'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3637-battle.cjs');
const {source,keys,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const dmg=s=>s.fighters[0].lastAttackDamage??0,hp=s=>s.fighters.map(f=>f.hp),entry=id=>pick(id)[0];
test('3637 30后手与37严格低体力威力翻倍、无条件不加和免伤',()=>{
 for(const id of [30,37])for(const active of [false,true]){const e=entry(id),opt=id===30?{aStats:{spe:active?1:500}}:{hp:active?2999:3000},s=make(e,opt),plain=make(e,{...opt,omit:true}),a=turn(s),b=turn(plain);assert.ok(Math.abs(dmg(a)-dmg(b)*(active?2:1))<=2);const immune=make(e,opt);timer(immune,1,'当回合免伤');assert.equal(dmg(turn(immune)),0);}
 const above=make(entry(37),{hp:3001}),plain=make(entry(37),{hp:3001,omit:true});assert.equal(dmg(turn(above)),dmg(turn(plain)));
});
test('3637 15三个概率实例害怕成功失败、免疫与控制不扣PP',()=>{
 for(const e of pick(15)){const yes=seedCase(e,o=>!!o.fighters[1].ailments['害怕']),no=seedCase(e,o=>!o.fighters[1].ailments['害怕']);assert.ok(yes.out.fighters[1].ailments['害怕']);assert.deepEqual(no.out.fighters[1].ailments,{});const immune=make(e,{seed:yes.seed});timer(immune,1,'免异常');assert.deepEqual(turn(immune).fighters[1].ailments,{});const o=turn(yes.out,IDLE,HIT);assert.equal(o.fighters[1].pp[key(HIT)],yes.out.fighters[1].pp[key(HIT)]);}
});
test('3637 48四五回合免异常与47免弱实际拦截并到期',()=>{
 for(const e of pick(48)){let s=turn(make(e));for(let r=2;r<=e.params[0];r++){s.rng=8;s=turn(s,IDLE,FEAR);assert.deepEqual(s.fighters[0].ailments,{});}s.rng=8;assert.ok(turn(s,IDLE,FEAR).fighters[0].ailments['麻痹']);}
 const e=entry(47);let s=turn(make(e,{opponentEffect:{moveId:21147,index:0}}));for(let r=2;r<=4;r++){s=turn(s,IDLE,900023);assert.equal(s.fighters[0].stages.def,0);}assert.equal(turn(s,IDLE,900023).fighters[0].stages.def,-1);const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].effects['免弱'],undefined);
});
test('3637 58与540下一回合必暴条件、两回合期限和免暴',()=>{
 for(const id of [58,540]){const e=entry(id);let s=turn(make(e,{aStats:{spe:1}}));for(let r=2;r<=e.params[0]+2;r++){s.rng=0;const plain=structuredClone(s);delete plain.fighters[0].effects['必定暴击'];const a=turn(s,10128),b=turn(plain,10128);assert.ok(Math.abs(dmg(a)-dmg(b)*(r<=e.params[0]+1?2:1))<=1);s=a;}
 if(id===540){const first=turn(make(e));assert.equal(first.fighters[0].effects['必定暴击'],undefined);}const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].effects['必定暴击'],undefined);}
});
test('3637 60每回合50固定伤害三回合、抗性与到期',()=>{
 let s=turn(make(entry(60)));assert.equal(s.fighters[1].hp,8950-dmg(s));s=wait(s);assert.equal(s.fighters[1].hp,8900-dmg(s));s=wait(s);const before=s.fighters[1].hp;assert.equal(wait(s).fighters[1].hp,before);const resist=make(entry(60));resist.fighters[1].build.resistance.fixed=50;const o=turn(resist);assert.equal(9000-o.fighters[1].hp-dmg(o),25);const no=make(entry(60));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);
});
test('3637 33与485真实消强及成功回满、负能力保护与禁疗',()=>{
 for(const id of [33,485]){const e=entry(id),s=make(e,{hp:1000});s.fighters[1].stages.atk=3;s.fighters[1].stages.def=-2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.def,-2);assert.equal(o.fighters[0].hp,id===485?9000:1000);assert.equal(turn(make(e,{hp:1000})).fighters[0].hp,1000);const protect=structuredClone(s);timer(protect,1,'幽蝶强化保护');const p=turn(protect);assert.equal(p.fighters[1].stages.atk,3);assert.equal(p.fighters[0].hp,1000);const ban=structuredClone(s);timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);}
});
test('3637 125两三回合攻击上限280及边界、固伤不受限',()=>{
 for(const e of pick(125)){let s=turn(make(e,{bStats:{atk:9000}}));for(let r=2;r<=e.params[0];r++){const before=s.fighters[0].hp;s=turn(s,IDLE,HIT);assert.equal(before-s.fighters[0].hp,280);}const before=s.fighters[0].hp;assert.ok(before-turn(s,IDLE,HIT).fighters[0].hp>280);const low=turn(make(e));const b=low.fighters[0].hp,o=turn(low,IDLE,HIT);assert.ok(b-o.fighters[0].hp>0&&b-o.fighters[0].hp<280);const no=make(e);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].effects['攻击伤害上限'],undefined);}
 const s=turn(make(entry(125),{opponentEffect:{moveId:26194,index:2}}));const o=turn(s,IDLE,900023);assert.equal(s.fighters[0].hp-o.fighters[0].hp,200);
});
test('3637 63负能力反馈与521反转、免弱禁强和六级边界',()=>{
 const s=make(entry(63));s.fighters[0].stages.atk=-6;s.fighters[0].stages.def=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[1].stages.atk,-6);assert.equal(o.fighters[0].stages.def,2);timer(s,1,'免弱');assert.equal(turn(s).fighters[1].stages.atk,0);assert.equal(turn(s).fighters[0].stages.atk,0);
 const r=make(entry(521));r.fighters[0].stages.atk=-6;r.fighters[0].stages.def=2;assert.equal(turn(r).fighters[0].stages.atk,6);assert.equal(turn(r).fighters[0].stages.def,2);timer(r,0,'禁强化');assert.equal(turn(r).fighters[0].stages.atk,-6);assert.deepEqual(turn(make(entry(521))).fighters[0].stages,make(entry(521)).fighters[0].stages);
});
test('3637 126三回合攻速各一、六级截断与禁强化',()=>{
 let s=turn(make(entry(126)));for(let n=1;n<=3;n++){assert.equal(s.fighters[0].stages.atk,n);assert.equal(s.fighters[0].stages.spe,n);assert.equal(s.fighters[0].stages.def,0);s=wait(s);}assert.equal(s.fighters[0].stages.atk,3);const cap=allStages(make(entry(126)),0,6);assert.equal(turn(cap).fighters[0].stages.atk,6);const ban=make(entry(126));timer(ban,0,'禁强化');assert.deepEqual(turn(ban).fighters[0].stages,ban.fighters[0].stages);
});
test('3637 66击败后五分之一回复、未击败与禁疗及满血边界',()=>{
 const e=entry(66);assert.equal(turn(make(e,{hp:1000,targetHp:1})).fighters[0].hp,2800);assert.equal(turn(make(e,{hp:1000})).fighters[0].hp,1000);assert.equal(turn(make(e,{hp:8999,targetHp:1})).fighters[0].hp,9000);const ban=make(e,{hp:1000,targetHp:1});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);
});
test('3637 180消回合与1138消除后害怕或疲惫、免断和失败转支',()=>{
 const e=entry(180),s=make(e);timer(s,1,'id913',{bonus:1});assert.equal(turn(s).fighters[1].effects.id913,undefined);timer(s,1,'protect');assert.ok(turn(s).fighters[1].effects.id913);
 const x=entry(1138);for(const ail of ['害怕','疲惫']){let found=false;for(let seed=0;seed<128&&!found;seed++){const q=make(x,{seed});timer(q,1,'id913',{bonus:1});const o=turn(q);if(o.fighters[1].ailments[ail]){found=true;assert.equal(o.fighters[1].effects.id913,undefined);}}assert.ok(found);}
 const one=make(x,{seed:1});timer(one,1,'id913',{bonus:1});one.fighters[1].counts.immune=1;assert.equal(turn(one).fighters[1].counts.immune,0);assert.ok(turn(one).fighters[1].ailments['疲惫']);const none=make(x);assert.deepEqual(turn(none).fighters[1].ailments,{});timer(one,1,'protect');assert.deepEqual(turn(one).fighters[1].ailments,{});
});
test('3637 187用属回复三回合、攻击不触发及技能禁疗',()=>{
 const e=entry(187);let s=turn(make(e,{hp:1}));assert.equal(s.fighters[0].hp,3001);s=wait(s);assert.equal(s.fighters[0].hp,6001);s=wait(s);assert.equal(s.fighters[0].hp,9000);s.fighters[0].hp=1;assert.equal(wait(s).fighters[0].hp,1);const attack=make(e,{hp:5000});assert.ok(turn(attack,e.moveId,HIT).fighters[0].hp<5000);const ban=make(e,{hp:1});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1);
});
test('3637 164受击害怕与1188疲惫失败吸取、抗性禁疗和到期',()=>{
 for(const id of [164,1188]){const e=entry(id),s=turn(make(e,{hp:1000}));s.rng=1;const o=turn(s,IDLE,HIT);assert.ok(o.fighters[1].ailments[id===164?'害怕':'疲惫']);assert.equal(o.fighters[1].hp,9000);const immune=structuredClone(s);timer(immune,1,'免异常');const n=turn(immune,IDLE,HIT);assert.deepEqual(n.fighters[1].ailments,{});assert.equal(n.fighters[1].hp,id===1188?6000:9000);if(id===1188){assert.equal(n.fighters[0].hp,4000-n.fighters[1].lastAttackDamage);const ban=structuredClone(immune);timer(ban,0,'技能禁疗');assert.equal(turn(ban,IDLE,HIT).fighters[0].hp,1000-turn(ban,IDLE,HIT).fighters[1].lastAttackDamage);const resist=structuredClone(immune);resist.fighters[1].build.resistance.percent=50;assert.equal(turn(resist,IDLE,HIT).fighters[1].hp,7500);}
 const end=wait(wait(s));assert.deepEqual(turn(end,IDLE,HIT).fighters[1].ailments,{});assert.equal(turn(s,IDLE).fighters[1].hp,9000);}
});
test('3637 585全一与893满血翻倍、残一体力不翻及禁强封顶',()=>{
 for(const id of [585,893]){const e=entry(id),s=turn(make(e));for(const k of keys)assert.equal(s.fighters[0].stages[k],id===893?2:1);const low=turn(make(e,{hp:8999}));for(const k of keys)assert.equal(low.fighters[0].stages[k],1);const cap=allStages(make(e),0,6);assert.deepEqual(turn(cap).fighters[0].stages,cap.fighters[0].stages);const ban=make(e);timer(ban,0,'禁强化');assert.deepEqual(turn(ban).fighters[0].stages,ban.fighters[0].stages);}
});
test('3637 57用技能四回合回复、控制不触发和禁疗',()=>{
 const e=entry(57);let s=turn(make(e,{hp:1}));assert.equal(s.fighters[0].hp,3001);s=wait(s);assert.equal(s.fighters[0].hp,6001);s=wait(s);assert.equal(s.fighters[0].hp,9000);s.fighters[0].hp=1;s=wait(s);assert.equal(s.fighters[0].hp,3001);s=wait(s);assert.equal(s.fighters[0].hp,3001);const ban=make(e,{hp:1});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1);const control=turn(make(e,{hp:1}));control.fighters[0].ailments['疲惫']=99;assert.equal(wait(control).fighters[0].hp,3001);
});
test('3637 776下两回合翻倍与502直接攻击削当前四分之一',()=>{
 let s=turn(make(entry(776)));for(let r=2;r<=4;r++){s.rng=0;const plain=structuredClone(s);delete plain.fighters[0].effects.doubleDamage;const a=turn(s,10128),b=turn(plain,10128);assert.ok(Math.abs(dmg(a)-dmg(b)*(r<=3?2:1))<=1);s=a;}
 let v=turn(make(entry(502)));assert.equal(v.fighters[1].hp,9000);for(let r=2;r<=4;r++){v.rng=0;const before=v.fighters[1].hp,o=turn(v,10128);assert.equal(o.fighters[1].hp,before-dmg(o)-(r<=3?Math.floor((before-dmg(o))/4):0));v=o;}const miss=turn(make(entry(502),{hit:false}));timer(miss,0,'攻击必失');assert.equal(turn(miss,10128).fighters[1].hp,9000);
});
test('3637 447最低280与871下两回合保底、免伤和到期',()=>{
 const e=entry(447);assert.equal(dmg(turn(make(e,{aStats:{atk:1}}))),280);const large=make(e,{aStats:{atk:9000}});assert.ok(dmg(turn(large))>280);timer(large,1,'当回合免伤');assert.equal(dmg(turn(large)),0);
 let s=turn(make(entry(871),{aStats:{atk:1}}));assert.ok(dmg(s)<280);for(let r=2;r<=4;r++){const plain=structuredClone(s);delete plain.fighters[0].effects['攻击最低伤害'];const expected=dmg(turn(plain,10128));s=turn(s,10128);assert.equal(dmg(s),r<=3?280:expected);}const no=make(entry(871));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].effects['攻击最低伤害'],undefined);
});
test('3637 694必先与723后手降对手先制、下一回合与到期',()=>{
 for(const id of [694,723]){const e=entry(id),s=turn(make(e,{aStats:{spe:1}}));assert.equal(s.turns[0].first,1);assert.equal(turn(s,10128).turns.at(-1).first,0);assert.equal(turn(wait(s),10128).turns.at(-1).first,1);const no=make(e);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[id===694?0:1].effects[id===694?'攻击必定先手':'id984'],undefined);if(id===723)assert.equal(turn(make(e)).fighters[1].effects.id984,undefined);}
});
test('3637 1239半血先判回复等量粉伤、严格边界和禁疗抗性',()=>{
 const e=entry(1239);for(const value of [4499,4500,4501]){const o=turn(make(e,{hp:value}));assert.equal(o.fighters[0].hp,Math.min(9000,value+4500));assert.equal(9000-o.fighters[1].hp-dmg(o),value<4500?4500:0);}const ban=make(e,{hp:100});timer(ban,0,'技能禁疗');const b=turn(ban);assert.equal(b.fighters[0].hp,100);assert.equal(9000-b.fighters[1].hp-dmg(b),0);const r=make(e,{hp:100});r.fighters[1].build.resistance.percent=50;const o=turn(r);assert.equal(9000-o.fighters[1].hp-dmg(o),2250);
});
test('3637 1154用招固伤按当前体力严格翻倍、抗性及三回合期限',()=>{
 const e=entry(1154);for(const value of [8999,9000]){let s=turn(make(e,{hp:value}));assert.equal(s.fighters[1].hp,9000-(value<9000?400:200));s=wait(s);s=wait(s);const b=s.fighters[1].hp;assert.equal(wait(s).fighters[1].hp,b);}const r=make(e,{hp:1});r.fighters[1].build.resistance.fixed=50;assert.equal(turn(r).fighters[1].hp,8800);const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[1].hp,9000);const controlled=turn(make(e));controlled.fighters[0].ailments['疲惫']=99;assert.equal(wait(controlled).fighters[1].hp,controlled.fighters[1].hp);
});
test('3637 1351护罩仅挡固粉、破罩封下次攻击且只消费一次',()=>{
 const e=entry(1351),s=turn(make(e,{opponentEffect:{moveId:26194,index:2}}));assert.equal(s.fighters[0].suitState.barrier,350);const hit=turn(s,IDLE,HIT);assert.ok(hit.fighters[0].hp<9000);assert.equal(hit.fighters[0].suitState.barrier,350);let o=turn(s,IDLE,900023);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].suitState.barrier,150);o=turn(o,IDLE,900023);assert.equal(o.fighters[0].suitState.barrier,0);assert.equal(o.fighters[0].hp,8950);assert.equal(o.fighters[1].counts.nextAttackInvalid,1);delete o.fighters[1].effects['用招附加固定'];const b=o.fighters[0].hp,n=turn(o,IDLE,HIT);assert.equal(n.fighters[0].hp,b);assert.equal(n.fighters[1].counts.nextAttackInvalid,0);assert.ok(turn(n,IDLE,HIT).fighters[0].hp<b);
 const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].suitState.barrier,0);const exact=turn(make(e));exact.fighters[0].suitState.barrier=0;const end=wait(exact);assert.equal(end.fighters[1].counts.nextAttackInvalid,1);assert.equal(wait(end).fighters[1].counts.nextAttackInvalid,1);
});
test('3637 774高体追加与1086低体增伤、相等边界和第五顺序',()=>{
 const e=entry(774),base=turn(make(e,{omit:true})),loss=dmg(base);for(const value of [9000-loss-1,9000-loss,9000-loss+1]){const o=turn(make(e,{hp:value}));assert.equal(9000-o.fighters[1].hp-dmg(o),value>9000-loss?3000:0);}const resist=make(e);resist.fighters[1].build.resistance.percent=50;assert.equal(9000-turn(resist).fighters[1].hp-dmg(turn(resist)),1500);
 for(const value of [8999,9000]){const x=entry(1086),a=turn(make(x,{hp:value})),b=turn(make(x,{hp:value,omit:true}));assert.ok(Math.abs(dmg(a)-dmg(b)*(value<9000?1.5:1))<=1);}
 const full=make({moveId:32178,index:null},{hp:1000});full.fighters[1].stages.acc=1;const o=turn(full);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].stages.acc,0);assert.equal(9000-o.fighters[1].hp-dmg(o),3000);
});
