'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3739-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3739 基础18招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3739 基础18招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3739 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});




test('3739 1357后手增伤先手不加与封招失败',()=>{
 const x=e(1357),late=make(x,{aStats:{spe:1}}),base=make(x,{aStats:{spe:1},omit:true});const a=turn(late).fighters[0].lastAttackDamage,b=turn(base).fighters[0].lastAttackDamage;assert.ok(a===Math.floor(b*1.6)||Math.abs(a-b*1.6)<2);const fast=make(x);fast.moveDefinitions[key(x.moveId)].priority=0;const ref=make(x,{omit:true});ref.moveDefinitions[key(x.moveId)].priority=0;assert.equal(turn(fast).fighters[0].lastAttackDamage,turn(ref).fighters[0].lastAttackDamage);timer(late,0,'skillBlock');assert.equal(turn(late).fighters[1].hp,9000);
});
test('3739 2068睡眠成功与免疫失败回合结束后清回合、保护仍有效',()=>{
 const x=e(2068),s=make(x);timer(s,1,'doubleDamage');const o=turn(s);assert.ok([2,3].includes(o.fighters[1].ailments['睡眠']));assert.ok(o.fighters[1].effects.doubleDamage);const im=make(x);timer(im,1,'免异常');timer(im,1,'doubleDamage');const io=turn(im);assert.equal(io.fighters[1].ailments['睡眠'],undefined);assert.equal(io.fighters[1].effects.doubleDamage,undefined);timer(im,1,'protect');assert.ok(turn(im).fighters[1].effects.doubleDamage);const block=make(x);timer(block,0,'skillBlock');timer(block,1,'doubleDamage');assert.ok(turn(block).fighters[1].effects.doubleDamage);
});
test('3739 1695满体转最大体力粉伤、非满实际回复、禁疗与四回合到期',()=>{
 for(const [hp,wantHP,wantTarget]of [[1000,5500,4500],[8500,9000,8500],[9000,9000,6000]]){const s=make(e(1695),{hp}),o=turn(s);assert.equal(o.fighters[0].hp,wantHP);assert.equal(o.fighters[1].hp,wantTarget);assert.equal(o.fighters[0].effects['用招回血满体改粉伤'].end,4);timer(s,0,'技能禁疗');const no=turn(s);assert.equal(no.fighters[0].hp,hp);assert.equal(no.fighters[1].hp,hp===9000?6000:9000);}
 const s=turn(make(e(1695),{hp:1000}));s.round=5;const o=turn(s,900031);assert.equal(o.fighters[0].hp,s.fighters[0].hp);assert.equal(o.fighters[1].hp,s.fighters[1].hp);
});
test('3739 2355清回合成功附加明确三回合混乱、失败及免疫不附加',()=>{
 const s=turn(make(e(2355))),clear=make(e(928));s.moveDefinitions[key(900030)].operations=clear.moveDefinitions[key(clear.auditMoveId)].operations;timer(s,1,'doubleDamage');const o=turn(s,900030);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[1].ailments['混乱'],4);const no=structuredClone(s);timer(no,1,'protect');assert.equal(turn(no,900030).fighters[1].ailments['混乱'],undefined);const im=structuredClone(s);im.fighters[1].counts.immune=1;assert.equal(turn(im,900030).fighters[1].ailments['混乱'],undefined);const expired=structuredClone(s);expired.round=5;assert.equal(turn(expired,900030).fighters[1].ailments['混乱'],undefined);
});

test('3739 450与683随机回复固伤范围、独立变化、禁疗和满体边界',()=>{
 const heals=new Set(),damages=new Set();for(let seed=0;seed<30;seed++){const h=turn(make(e(450),{hp:1000,seed})).fighters[0].hp-1000;assert.ok(h>=100&&h<=200);heals.add(h);const out=turn(make(e(683),{seed})),d=9000-out.fighters[1].hp-out.fighters[0].lastAttackDamage;assert.ok(d>=100&&d<=200);damages.add(d);}assert.ok(heals.size>1);assert.ok(damages.size>1);
 const blocked=make(e(450),{hp:1000});timer(blocked,0,'技能禁疗');assert.equal(turn(blocked).fighters[0].hp,1000);assert.equal(turn(make(e(450),{hp:8999})).fighters[0].hp,9000);const no=make(e(683));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);
});
test('3739 198两项不重复弱化、免弱与962强化翻倍六级边界',()=>{
 for(let seed=0;seed<20;seed++){const o=turn(make(e(198),{seed}));assert.equal(Object.values(o.fighters[1].stages).filter(x=>x===-2).length,2);}const im=make(e(198));timer(im,1,'免弱');assert.ok(Object.values(turn(im).fighters[1].stages).every(x=>x===0));
 const clean=turn(make(e(962)));assert.ok(Object.values(clean.fighters[0].stages).every(x=>x===2));const boost=make(e(962));boost.fighters[0].stages.atk=6;const o=turn(boost);assert.equal(o.fighters[0].stages.atk,6);assert.equal(o.fighters[0].stages.def,1);timer(boost,0,'skillBlock');assert.equal(turn(boost).fighters[0].stages.def,0);
});
test('3739 583随机清一项PP、封招失败及零PP边界',()=>{
 const chosen=new Set();for(let seed=0;seed<20;seed++){const s=make(e(583)),o=turn({...s,rng:seed});const zero=o.fighters[1].moves.filter(k=>o.fighters[1].pp[k]===0);assert.equal(zero.length,1);chosen.add(zero[0]);}assert.ok(chosen.size>1);const no=make(e(583));timer(no,0,'skillBlock');assert.ok(turn(no).fighters[1].moves.every(k=>turn(no).fighters[1].pp[k]>0));const s=make(e(583));for(const k of s.fighters[1].moves)s.fighters[1].pp[k]=0;s.fighters[1].pp[key(900041)]=1;const o=turn(s);assert.ok(Object.values(o.fighters[1].pp).every(x=>x===0));
});
test('3739 1065低体双倍实际回复粉伤、半血边界、禁疗与到期',()=>{
 for(const [hp,wantHP,wantTarget]of [[1000,7000,3000],[4500,7500,6000],[8999,9000,8999]]){const s=make(e(1065),{hp}),o=turn(s);assert.equal(o.fighters[0].hp,wantHP);assert.equal(o.fighters[1].hp,wantTarget);timer(s,0,'技能禁疗');const no=turn(s);assert.equal(no.fighters[0].hp,hp);assert.equal(no.fighters[1].hp,9000);}const s=turn(make(e(1065),{hp:1000}));s.round=5;assert.equal(turn(s,900031).fighters[0].hp,s.fighters[0].hp);
});
test('3739 1154用招固伤低体翻倍、相等边界、三回合到期',()=>{
 for(const [hp,d]of [[1000,400],[9000,200]]){const s=make(e(1154),{hp}),o=turn(s);assert.equal(9000-o.fighters[1].hp,d);assert.equal(o.fighters[0].effects['用招附加固定'].end,3);o.round=4;assert.equal(turn(o,900031).fighters[1].hp,o.fighters[1].hp);}const no=make(e(1154));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);
});

test('3739 1323暴击追加只取实际回复、满体禁疗零追加及非暴击吸血',()=>{
 for(const hp of [1000,8999,9000])for(const crit of [false,true]){const s=make(e(1323),{hp});if(crit)timer(s,0,'必定暴击');const o=turn(s),restored=o.fighters[0].hp-hp;assert.equal(restored,Math.min(9000-hp,Math.floor(o.fighters[0].lastAttackDamage/2)));assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,crit?restored:0);timer(s,0,'技能禁疗');const no=turn(s);assert.equal(no.fighters[0].hp,hp);assert.equal(9000-no.fighters[1].hp,no.fighters[0].lastAttackDamage);}
});
test('3739 636清强睡眠成功、无强化失败、保护与异常免疫',()=>{
 const s=make(e(636));s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.ok([2,3].includes(o.fighters[1].ailments['睡眠']));assert.equal(turn(make(e(636))).fighters[1].ailments['睡眠'],undefined);timer(s,1,'幽蝶强化保护');const p=turn(s);assert.equal(p.fighters[1].stages.atk,2);assert.equal(p.fighters[1].ailments['睡眠'],undefined);delete s.fighters[1].effects['幽蝶强化保护'];timer(s,1,'免异常');const im=turn(s);assert.equal(im.fighters[1].stages.atk,0);assert.equal(im.fighters[1].ailments['睡眠'],undefined);
});
test('3739 570免疫下一次攻击并消耗、699突破免攻与928清回合免异常',()=>{
 const s=make(e(570)),o=turn(s,s.auditMoveId,900040);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].counts.attackNullify,0);assert.ok(turn(o,900031,900040).fighters[0].hp<9000);const attack=make(e(699));attack.fighters[1].counts.attackNullify=1;assert.ok(turn(attack).fighters[1].hp<9000);const clear=make(e(928));timer(clear,1,'doubleDamage');const co=turn(clear);assert.equal(co.fighters[1].effects.doubleDamage,undefined);assert.equal(co.fighters[0].counts.immune,1);assert.equal(turn(make(e(928))).fighters[0].counts.immune,undefined);timer(clear,1,'protect');assert.equal(turn(clear).fighters[0].counts.immune,undefined);
});

test('3739 60五回合附加20固伤、封招不建立与第六回合到期',()=>{
 let s=make(e(60));for(let round=1;round<=6;round++){const before=s.fighters[1].hp;s=turn(s,round===1?s.auditMoveId:900031);assert.equal(before-s.fighters[1].hp-(round===1?s.fighters[0].lastAttackDamage:0),round<=5?20:0);}const no=make(e(60));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);
});
test('3739 619两实例下两回合减先制、当回合不减及到期',()=>{
 for(const x of pick(619)){let s=make(x,{aStats:{spe:1},bStats:{spe:999}});s=turn(s);assert.equal(s.turns[0].first,1);assert.equal(s.fighters[1].effects.id984.start,2);assert.equal(s.fighters[1].effects.id984.end,3);for(let r=2;r<=4;r++){s=turn(s,900031);assert.equal(s.turns.at(-1).first,r<=3?0:1);}const no=make(x);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].effects.id984,undefined);}
});
test('3739 47免弱与191异常反弹四回合有效、到期及封招',()=>{
 const weak=make(e(47),{opponentMove:22517,opponentEffectId:5});const w=turn(weak,weak.auditMoveId,900042);assert.equal(w.fighters[0].stages.spd,0);assert.equal(w.fighters[0].stages.spe,0);w.round=5;const wo=turn(w,900031,900042);assert.equal(wo.fighters[0].stages.spd,-2);assert.equal(wo.fighters[0].stages.spe,-1);
 const reflect=make(e(191),{opponentMove:29211,opponentEffectId:2068}),o=turn(reflect,reflect.auditMoveId,900042);assert.equal(o.fighters[0].ailments['睡眠'],undefined);assert.ok(o.fighters[1].ailments['睡眠']>=1);const expired=turn(make(e(191),{opponentMove:29211,opponentEffectId:2068}));expired.round=5;assert.ok(turn(expired,900031,900042).fighters[0].ailments['睡眠']>=5);const no=make(e(191));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].effects.reflect,undefined);
});
test('3739 679禁技能回复两回合、自然到期及封招失败',()=>{
 const s=make(e(679),{opponentMove:19461,opponentEffectId:450,targetHp:1000});const o=turn(s,s.auditMoveId,900042);assert.equal(o.fighters[1].hp,1000-o.fighters[0].lastAttackDamage);o.round=3;const before=o.fighters[1].hp;assert.ok(turn(o,900031,900042).fighters[1].hp>before);const no=make(e(679));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].effects['技能禁疗'],undefined);
});
test('3739 10麻痹概率成功失败、默认二三回合与免疫',()=>{
 const durations=new Set();let failures=0;for(let seed=0;seed<100;seed++){const s=make(e(10),{seed}),o=turn(s),end=o.fighters[1].ailments['麻痹'];if(end===undefined)failures++;else{assert.ok([2,3].includes(end));durations.add(end);timer(s,1,'免异常');assert.equal(turn(s).fighters[1].ailments['麻痹'],undefined);}}assert.ok(failures>0);assert.deepEqual([...durations].sort(),[2,3]);
});

test('3739 确认1856反转弱化再强化与六级禁强化封招边界',()=>{
 const s=make(e(1856));s.fighters[0].stages.atk=-3;s.fighters[0].stages.def=-6;s.fighters[0].stages.spa=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,4);assert.equal(o.fighters[0].stages.def,6);assert.equal(o.fighters[0].stages.spa,3);assert.equal(o.fighters[0].stages.spd,1);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,-3);delete s.fighters[0].effects['禁强化'];timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].stages.atk,-3);
});
test('3739 确认1401仅后手中毒失败保底、先手不触发与两回合到期',()=>{
 const first=make(e(1401));first.moveDefinitions[key(first.auditMoveId)].priority=0;const o=turn(first);assert.equal(o.fighters[1].ailments['中毒'],undefined);assert.equal(o.fighters[0].effects['必定暴击'],undefined);let yes=false,no=false;for(let seed=0;seed<30;seed++){const s=make(e(1401),{seed,aStats:{spe:1}}),q=turn(s);if(q.fighters[1].ailments['中毒']){yes=true;assert.equal(q.fighters[0].effects['必定暴击'],undefined);}else{no=true;assert.equal(q.fighters[0].effects['必定暴击'].start,2);assert.equal(q.fighters[0].effects['必定暴击'].end,3);}}assert.ok(yes&&no);const im=make(e(1401),{aStats:{spe:1}});timer(im,1,'免异常');assert.equal(turn(im).fighters[0].effects['必定暴击'].end,3);
});
test('3739 确认1296受击单次自然庇佑三档回复、零伤害和到期禁疗死亡',()=>{
 const gains=new Set();for(let seed=0;seed<100;seed++){const s=make(e(1296),{hp:1000,seed});s.fighters[0].counts.attackNullify=1;const o=turn(s,s.auditMoveId,900040),gain=o.fighters[0].hp-1000;assert.ok([200,300,400].includes(gain));gains.add(gain);}assert.deepEqual([...gains].sort(),[200,300,400]);const no=make(e(1296),{hp:1000});assert.equal(turn(no).fighters[0].hp,1000);timer(no,0,'技能禁疗');no.fighters[0].counts.attackNullify=1;assert.equal(turn(no,no.auditMoveId,900040).fighters[0].hp,1000);const exp=turn(make(e(1296),{hp:1000}));exp.round=3;exp.fighters[0].counts.attackNullify=1;assert.equal(turn(exp,900031,900040).fighters[0].hp,1000);const dead=make(e(1296),{hp:1});assert.equal(turn(dead,dead.auditMoveId,900040).fighters[0].hp,0);
});

test('3739 魂印1017死亡50%单次判定、满HP满PP、保留自身状态并清对手',()=>{
 let success,failure;for(let seed=0;seed<40&&(!success||!failure);seed++){const s=make({moveId:10001,index:null},{soul:1017,omit:true,hp:1,seed,aStats:{spe:1}});s.fighters[0].stages.def=-2;s.fighters[0].ailments['疲惫']=9;timer(s,0,'doubleDamage');s.fighters[0].pp[key(900030)]=0;s.fighters[1].stages.atk=2;timer(s,1,'doubleDamage');const o=turn(s,10001,900040);if(o.fighters[0].hp>0)success={s,o};else failure={s,o};}assert.ok(success&&failure);const o=success.o;assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].pp[key(900030)],99);assert.equal(o.fighters[0].stages.def,-2);assert.equal(o.fighters[0].ailments['疲惫'],9);assert.ok(o.fighters[0].effects.doubleDamage);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(failure.o.fighters[1].effects.statusBlock.end,3);o.fighters[0].hp=1;const second=turn(o,10001,900040);assert.equal(second.fighters[0].hp,0);assert.equal(second.finished,true);
});
test('3739 魂印1017异常扣血与直接自损立即重生、攻击300阈值',()=>{
 for(const mode of ['dot','self']){let yes=false,no=false;for(let seed=0;seed<40;seed++){const s=make({moveId:10001,index:null},{soul:1017,omit:true,hp:1,seed});if(mode==='dot'){s.fighters[0].ailments['中毒']=3;}else{s.moveDefinitions[key(900031)].operations=[{effectId:1324,index:0,phase:'afterHit',params:[]}];s.fighters[1].soulId=622;}const o=turn(s,900031);if(o.fighters[0].hp>0){yes=true;assert.equal(o.fighters[0].hp,9000);}else no=true;}assert.ok(yes&&no);}
 for(const power of [10,2000]){const s=make({moveId:10001,index:null},{soul:1017,omit:true,hp:1000});s.moveDefinitions[key(10001)].power=power;const o=turn(s),d=o.fighters[0].lastAttackDamage;if(d>300){assert.equal(o.fighters[0].hp,1300);assert.equal(9000-o.fighters[1].hp-d,300);}else{assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[0].effects['必定暴击'].start,2);}}
});
test('3739 树海临时上限固定生命力、面板真伤清强清回合及代触发',()=>{
 const s=make(e(2190),{aStats:{maxHp:1000}});assert.equal(s.fighters[0].stats.maxHp,1210);assert.equal(s.fighters[0].hp,1210);assert.equal(s.fighters[0].soulState.forest.life,210);s.fighters[0].pp[key(900030)]=0;timer(s,0,'doubleDamage');timer(s,1,'doubleDamage');s.fighters[1].stages.atk=2;s.fighters[0].counts.attackNullify=1;const o=turn(s,900031,900040);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.spd,-2);assert.equal(o.fighters[1].stages.spe,-1);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[0].stats.maxHp,1210);assert.equal(o.fighters[0].hp,1210);assert.equal(o.fighters[0].soulState.forest.life,210);assert.equal(o.fighters[0].pp[key(900030)],2);assert.equal(o.fighters[0].pp[key(s.auditMoveId)],5);assert.ok(9000-o.fighters[1].hp>=100&&9000-o.fighters[1].hp<=200);assert.ok(o.turns[0].events.some(x=>JSON.stringify(x).includes('损失 40 点体力')));
});
test('3739 树海不足210无代触发、零临时体力回合末移除与回复补回',()=>{
 const s=make(e(2190),{aStats:{maxHp:999}});assert.equal(s.fighters[0].soulState.forest.life,209);s.fighters[0].hp=999;s.fighters[0].counts.attackNullify=1;const o=turn(s,900031,900040);assert.equal(o.fighters[1].stages.spd,0);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].soulState.forest,undefined);assert.equal(o.fighters[0].stats.maxHp,999);const healed=make(e(2190),{aStats:{maxHp:1000},hp:1000}),h=turn(healed,900031);assert.ok(h.fighters[0].hp>1000);assert.equal(h.fighters[0].stats.maxHp,1210);assert.equal(h.fighters[0].soulState.forest.life,210);
});

test('3739 魂印反伤致死可重生、恰好300无吸取无必暴、保护不被绕过',()=>{
 let revived=false;for(let seed=0;seed<25&&!revived;seed++){const s=make({moveId:10001,index:null},{soul:1017,omit:true,hp:1,seed});timer(s,1,'受击定额反弹',{amount:999});const o=turn(s);if(o.fighters[0].hp>0){revived=true;assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].effects['受击定额反弹'],undefined);}}assert.ok(revived);
 const s=make({moveId:10001,index:null},{soul:1017,omit:true,hp:1000});s.moveDefinitions[key(10001)].power=2000;timer(s,1,'伤害上限',{amount:300});const o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,300);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[0].effects['必定暴击'],undefined);
 let protectedRevive=false;for(let seed=0;seed<25&&!protectedRevive;seed++){const q=make({moveId:10001,index:null},{soul:1017,omit:true,hp:1,seed,aStats:{spe:1}});q.fighters[0].ailments['疲惫']=3;q.fighters[1].stages.atk=2;timer(q,1,'protect');timer(q,1,'幽蝶强化保护');const out=turn(q,10001,900040);if(out.fighters[0].hp>0){protectedRevive=true;assert.equal(out.fighters[1].stages.atk,2);assert.ok(out.fighters[1].effects.protect);}}assert.ok(protectedRevive);
});
test('3739 树海代触发不形成用招连锁、真伤无视减免而清除仍遵守保护',()=>{
 const s=make(e(2190),{aStats:{maxHp:2000},hp:2420});timer(s,0,'当回合免伤');timer(s,0,'用招附加固定',{amount:200});timer(s,1,'protect');timer(s,1,'幽蝶强化保护');s.fighters[1].stages.atk=2;const o=turn(s,900031,900040);assert.ok(o.turns[0].events.some(x=>JSON.stringify(x).includes('损失 40 点体力')));assert.equal(o.fighters[1].stages.atk,2);assert.equal(o.fighters[1].stages.spd,-4);assert.equal(o.fighters[1].stages.spe,-2);assert.ok(o.fighters[1].effects.protect);const lost=9000-o.fighters[1].hp;assert.ok(lost>=600&&lost<=800);assert.equal(o.fighters[0].soulState.forest.life,420);
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3739 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3739);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3739 583真实实例PP保护及免疫PP削减公共修复状态验证',()=>{const o=require('./helpers/assert-583-pp-protection.cjs')(3739);assert.ok(o.fighters[1].moves.every(k=>o.fighters[1].pp[k]>0));});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3739 1323原子实际回复与技能禁疗公共修复',()=>{const o=require('./helpers/assert-4200-public-heal.cjs')(3739,1323);assert.ok(o.fighters[0].hp>1000);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3739 1695实际用攻触发或原子回复量公共修复',()=>{const o=require('./helpers/assert-1695-atomic-heal.cjs')(3739);assert.equal(o.fighters[0].hp,0);});}
