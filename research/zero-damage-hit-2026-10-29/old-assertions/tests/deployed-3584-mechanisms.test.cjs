'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3584-battle.cjs');
const {key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,pick,seedCase}=H;
const hp=s=>s.fighters.map(f=>f.hp),damage=s=>s.fighters[0].lastAttackDamage;

test('3584 害怕15概率两侧、免疫、控制与持续边界',()=>{
 const e=pick(15)[0];let yes=false,no=false;
 for(let seed=0;seed<300;seed++){const s=make(e,{seed}),o=turn(s,e.moveId,HIT);if(o.turns[0].events.some(x=>x.text.includes('陷入害怕'))||o.fighters[1].pp[key(HIT)]===99){yes=true;assert.equal(o.fighters[1].pp[key(HIT)],99);assert.equal(o.fighters[0].hp,9000);}else no=true;}
 assert.ok(yes&&no);const s=make(e);timer(s,1,'免异常');assert.deepEqual(turn(s).fighters[1].ailments,{});timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);
});
test('3584 消回合797仅成功才禁技能回血、免断和两回合到期',()=>{
 const e=pick(797)[0],heal=pick(1065)[0];let s=make(e,{opponentEffect:heal,targetHp:1000});timer(s,1,'doubleDamage');let o=turn(s,e.moveId,900023);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[1].hp,1000-damage(o));const before=o.fighters[1].hp;o=turn(o,IDLE,WAIT);assert.equal(o.fighters[1].hp,before);o=turn(o,IDLE,WAIT);assert.ok(o.fighters[1].hp>before);
 const no=make(e);assert.equal(turn(no).fighters[1].effects['技能禁疗'],undefined);timer(no,1,'doubleDamage');timer(no,1,'protect');const p=turn(no);assert.ok(p.fighters[1].effects.doubleDamage);assert.equal(p.fighters[1].effects['技能禁疗'],undefined);
});
test('3584 吸血1249攻击伤害一半、异常粉伤、禁疗及满血',()=>{
 const e=pick(1249)[0];for(const abnormal of [false,true]){const s=make(e,{hp:1000});if(abnormal)s.fighters[1].ailments['失明']=4;const o=turn(s),n=Math.floor(damage(o)/2);assert.equal(o.fighters[0].hp,1000+n);assert.equal(9000-o.fighters[1].hp,damage(o)+(abnormal?n:0));}
 const full=make(e);full.fighters[1].ailments['失明']=4;const f=turn(full);assert.equal(f.fighters[0].hp,9000);assert.equal(9000-f.fighters[1].hp-damage(f),Math.floor(damage(f)/2));
 const block=make(e,{hp:1000});timer(block,0,'技能禁疗');block.fighters[1].ailments['失明']=4;const b=turn(block);assert.equal(b.fighters[0].hp,1000);assert.equal(9000-b.fighters[1].hp-damage(b),Math.floor(damage(b)/2));timer(block,1,'当回合免伤');assert.deepEqual(hp(turn(block)),[1000,9000]);
});
test('3584 双防676从下回合持续三回合、状态不触发、强化数值及免伤',()=>{
 const e=pick(676)[0];let s=turn(make(e));assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[0].effects['攻击双防粉伤'].start,2);s.fighters[0].stages.def=2;
 for(let r=2;r<=5;r++){const before=s.fighters[1].hp;s=turn(s,10001);assert.equal(before-s.fighters[1].hp-damage(s),r<=4?180:0);}
 assert.equal(wait(turn(make(e))).fighters[1].hp,9000);const im=turn(make(e));timer(im,1,'当回合免伤');assert.equal(turn(im,10001).fighters[1].hp,9000);const miss=turn(make(e,{hit:false}));timer(miss,0,'攻击必失');assert.equal(turn(miss,10001).fighters[1].hp,9000);
});
test('3584 已损体力514包含当次攻击、取整、残血和免伤',()=>{
 const e=pick(514)[0];for(const targetHp of [9000,8000]){const o=turn(make(e,{targetHp}));assert.equal(targetHp-o.fighters[1].hp-damage(o),Math.floor((9000-targetHp+damage(o))*.25));}
 const low=turn(make(e,{targetHp:10}));assert.equal(low.fighters[1].hp,0);const s=make(e);timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].hp,9000);
});
test('3584 反弹191四回合免疫反弹、双方免疫及到期',()=>{
 const e=pick(191)[0];let s=turn(make(e));s.rng=8;let o=turn(s,IDLE,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.ok(o.fighters[1].ailments['麻痹']);
 const both=turn(make(e));timer(both,1,'免异常');both.rng=8;assert.deepEqual(turn(both,IDLE,FEAR).fighters.map(f=>f.ailments),[{},{}]);s=wait(wait(wait(s)));assert.equal(s.round,5);s.rng=8;o=turn(s,IDLE,FEAR);assert.ok(o.fighters[0].ailments['麻痹']);
});
function receiver(e,n,extra={}){const s=make(e,{bStats:{atk:9000},...extra});timer(s,0,'攻击伤害上限',{amount:n});return s;}
test('3584 低伤1085严格299和300边界、持续四回合及免伤',()=>{
 const e=pick(1085)[0];for(const n of [299,300,301]){const o=turn(receiver(e,n),e.moveId,HIT);assert.equal(o.fighters[0].hp,9000-n);assert.equal(o.fighters[1].hp,n<300?8700:9000);}
 let s=turn(receiver(e,299),e.moveId,HIT);for(let r=2;r<=5;r++){const before=s.fighters[1].hp;s=turn(s,IDLE,HIT);assert.equal(before-s.fighters[1].hp,r<=4?300:0);}
 const im=receiver(e,299);timer(im,0,'当回合免伤');assert.deepEqual(hp(turn(im,e.moveId,HIT)),[9000,9000]);const miss=receiver(e,299);timer(miss,1,'攻击必失');assert.deepEqual(hp(turn(miss,e.moveId,HIT)),[9000,9000]);const pink=receiver(e,299);timer(pink,1,'当回合免伤');assert.equal(turn(pink,e.moveId,HIT).fighters[1].hp,9000);
});
test('3584 高伤1073严格300边界、实际回满等量固伤、禁疗和致死',()=>{
 const e=pick(1073)[0];for(const n of [299,300,301]){const o=turn(receiver(e,n),e.moveId,HIT);assert.equal(o.fighters[0].hp,n>300?9000:9000-n);assert.equal(o.fighters[1].hp,n>300?9000-n:9000);}
 const hurt=receiver(e,301,{hp:8000});assert.deepEqual(hp(turn(hurt,e.moveId,HIT)),[9000,7699]);const block=receiver(e,301,{hp:8000});timer(block,0,'技能禁疗');assert.deepEqual(hp(turn(block,e.moveId,HIT)),[7699,9000]);const lethal=receiver(e,301,{hp:301});assert.deepEqual(hp(turn(lethal,e.moveId,HIT)),[0,9000]);
 let expired=turn(receiver(e,301));expired=wait(wait(wait(expired)));assert.equal(expired.round,5);const before=expired.fighters[0].hp;assert.equal(turn(expired,IDLE,HIT).fighters[0].hp,before-301);
});
test('3584 固伤683真实随机150至300、免伤与失误',()=>{
 const e=pick(683)[0],values=new Set();for(let seed=0;seed<1500;seed++){const o=turn(make(e,{seed})),n=9000-o.fighters[1].hp-damage(o);assert.ok(n>=150&&n<=300);values.add(n);}assert.ok(values.has(150)&&values.has(300));const s=make(e);timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].hp,9000);
});
test('3584 强化1014严格半血、禁强化和六级上限',()=>{
 const e=pick(1014)[0];for(const n of [4499,4500,4501])assert.deepEqual(Object.values(turn(make(e,{hp:n})).fighters[0].stages),Array(6).fill(n>4500?2:1));const s=make(e);H.allStages(s,0,6);assert.deepEqual(Object.values(turn(s).fighters[0].stages),Array(6).fill(6));timer(s,0,'禁强化');H.allStages(s,0,0);assert.deepEqual(Object.values(turn(s).fighters[0].stages),Array(6).fill(0));
});
test('3584 回复1065半血边界实际等量粉伤、禁疗、满血与到期',()=>{
 const e=pick(1065)[0];for(const n of [1000,4499,4500,4501,8999,9000]){const o=turn(make(e,{hp:n})),gain=Math.min(9000-n,n<4500?6000:3000);assert.deepEqual(hp(o),[n+gain,9000-gain]);}
 const s=make(e,{hp:1000});timer(s,0,'技能禁疗');assert.deepEqual(hp(turn(s)),[1000,9000]);const im=make(e,{hp:1000});timer(im,1,'当回合免伤');assert.deepEqual(hp(turn(im)),[7000,9000]);let o=turn(make(e));for(let r=2;r<=5;r++){o.fighters[0].hp=8999;const before=o.fighters[1].hp;o=wait(o);assert.equal(o.fighters[0].hp,r<=4?9000:8999);assert.equal(before-o.fighters[1].hp,r<=4?1:0);}
});
test('3584 攻击免疫570仅消费一次、属性失误不消费',()=>{
 const e=pick(570)[0];let s=turn(make(e),e.moveId,HIT);assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[0].counts.attackNullify,0);assert.ok(turn(s,IDLE,HIT).fighters[0].hp<9000);s=turn(make(e));assert.equal(wait(s).fighters[0].counts.attackNullify,1);timer(s,1,'攻击必失');assert.equal(turn(s,IDLE,HIT).fighters[0].counts.attackNullify,1);const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].counts.attackNullify,undefined);
});
test('3584 无视697与699分别穿透限伤和免攻、失误及粉伤独立',()=>{
 for(const id of [697,699])for(const e of pick(id)){const s=make(e),no=make(e,{omit:true});if(id===697){timer(s,1,'攻击伤害上限',{amount:10});timer(no,1,'攻击伤害上限',{amount:10});assert.equal(damage(turn(no)),10);assert.ok(damage(turn(s))>10);timer(s,1,'鬼王攻击免疫');assert.equal(damage(turn(s)),0);}else{timer(s,1,'鬼王攻击免疫');timer(no,1,'鬼王攻击免疫');assert.equal(damage(turn(no)),0);assert.ok(damage(turn(s))>0);timer(s,1,'攻击伤害上限',{amount:10});assert.equal(damage(turn(s)),10);}timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);}
});
test('3584 后手939真实吸取三分之一、先手失败、残血禁疗与免伤',()=>{
 const e=pick(939)[0],o=turn(make(e,{hp:1000}));assert.deepEqual(hp(o),[4000,6000-damage(o)]);const first=make(e,{hp:1000});first.fighters[0].counts.nextSkillPriority=1;first.fighters[0].soulState.nextSkillPriorityAmount=4;assert.equal(turn(first).fighters[0].hp,1000);
 const noheal=make(e,{hp:1000});timer(noheal,0,'技能禁疗');const n=turn(noheal);assert.deepEqual(hp(n),[1000,6000-damage(n)]);const im=make(e,{hp:1000});timer(im,1,'当回合免伤');assert.deepEqual(hp(turn(im)),[1000,9000]);const low=turn(make(e,{hp:1000,targetHp:1000}));assert.equal(low.fighters[1].hp,0);assert.equal(low.fighters[0].hp,4000);
});
test('3584 吸強1060两个实例实际成功才下回合封攻、免吸禁强和到期',()=>{
 for(const e of pick(1060)){let s=make(e);s.fighters[1].stages.atk=2;s.fighters[1].stages.def=-1;let o=turn(s,e.moveId,HIT);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.def,-1);assert.ok(o.fighters[0].hp<9000);for(let n=0;n<e.params[0];n++){const before=o.fighters[0].hp;o=turn(o,IDLE,HIT);assert.equal(o.fighters[0].hp,before);}assert.ok(turn(o,IDLE,HIT).fighters[0].hp<o.fighters[0].hp);
 for(const mode of ['none','禁强化','hypnosBoostProtect']){s=make(e);if(mode!=='none'){s.fighters[1].stages.atk=2;timer(s,mode==='禁强化'?0:1,mode);}const result=turn(s);assert.equal(result.fighters[1].effects.attackBlock,undefined);assert.equal(result.fighters[0].stages.atk,0);}
 }
});
test('3584 高伤1258两个实例300边界、一次异常免疫和失误',()=>{
 for(const e of pick(1258)){for(const n of [299,300,301]){const s=make(e,{aStats:{atk:9000}});timer(s,1,'攻击伤害上限',{amount:n});const o=turn(s);assert.equal(damage(o),n);assert.equal(o.fighters[0].counts.immune??0,n>300?1:0);if(n>300){o.rng=8;const b=turn(o,IDLE,FEAR);assert.equal(b.fighters[0].counts.immune,0);assert.equal(b.fighters[0].ailments['麻痹'],undefined);b.rng=8;assert.ok(turn(b,IDLE,FEAR).fighters[0].ailments['麻痹']);}}const miss=make(e);timer(miss,0,'skillBlock');assert.equal(turn(miss).fighters[0].counts.immune,undefined);}
});
test('3584 低伤989严格300与双方体力比较、翻倍和固伤免疫',()=>{
 const e=pick(989)[0];for(const n of [299,300,301])for(const low of [false,true]){const s=make(e,{hp:low?1000:9000,aStats:{atk:9000}});timer(s,1,'攻击伤害上限',{amount:n});const o=turn(s);assert.equal(9000-o.fighters[1].hp-damage(o),n<300?(low?600:300):0);}const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);const miss=make(e);timer(miss,0,'skillBlock');assert.equal(turn(miss).fighters[1].hp,9000);
});
test('3584 清异常2240本次威力提升50%、无异常、封招与控制',()=>{
 const e=pick(2240)[0],s=make(e);s.fighters[0].ailments['烧伤']=3;const o=turn(s);assert.deepEqual(o.fighters[0].ailments,{});assert.equal(o.fighters[0].hp,9000);const clean=turn(make(e)),base=turn(make(e,{omit:true}));assert.equal(damage(clean),damage(base));const m=H.source.moves.find(m=>m.id===e.moveId),aff=H.E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart);assert.equal(damage(o),Math.floor((Math.floor(Math.floor(42*m.power*1.5*180/300)/50)+2)*1.5*aff*.89));
 const blocked=make(e);blocked.fighters[0].ailments['烧伤']=3;timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].ailments['烧伤'],3);const controlled=make(e);controlled.fighters[0].ailments['疲惫']=3;assert.equal(turn(controlled).fighters[0].pp[key(e.moveId)],5);assert.equal(turn(controlled).fighters[1].hp,9000);
});
test('3584 微弱2307按真实相性补偿、300边界及免伤封招',()=>{
 const e=pick(2307)[0];for(const type of ['普通','光','邪灵','圣灵','暗影邪灵']){const s=make(e);s.fighters[1].type=type;const affinity=H.E.typeEffectiveness(H.source.moves.find(m=>m.id===e.moveId).type,type,s.typeChart);const o=turn(s);assert.equal(9000-o.fighters[1].hp-damage(o),damage(o)<300?Math.floor(300/(affinity>0&&affinity<1?affinity:1)):0);}
 for(const n of [299,300,301]){const s=make(e,{aStats:{atk:9000}});s.fighters[1].type='普通';timer(s,1,'攻击伤害上限',{amount:n});const o=turn(s);assert.equal(damage(o),n);assert.equal(9000-o.fighters[1].hp-n,n<300?300:0);}const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[1].hp,9000);
});

test('3584 双防676比例粉伤使用面板且正零负能力等级基数一致',()=>{const values=[];for(const n of [-2,0,2]){let s=turn(make(pick(676)[0]));s.fighters[0].stages.def=n;s.fighters[0].stages.spd=n;const before=s.fighters[1].hp;s=turn(s,10001);values.push(before-s.fighters[1].hp-damage(s));}assert.deepEqual(values,[180,180,180]);});
