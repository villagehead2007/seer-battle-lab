'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,make,turn,pick,timer}=require('./helpers/3711-battle.cjs');const e=id=>pick(id)[0];
test('3711 1909设满前严格半血判断、直接设定绕过禁疗、回合末只补一次',()=>{
 for(const hp of [4499,4500,4501]){const s=make(e(1909),{hp});timer(s,0,'技能禁疗');const out=turn(s,s.auditMoveId,900040);assert.equal(out.fighters[0].hp,hp>4500?9000:9000-out.fighters[1].lastAttackDamage);assert.equal(out.fighters[0].effects['回合末设定体力'],undefined);const next=turn(out,900031,900040);assert.equal(next.fighters[0].hp,out.fighters[0].hp-next.fighters[1].lastAttackDamage);}
 const blocked=make(e(1909),{hp:1234});timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].hp,1234);
 const controlled=make(e(1909),{hp:1234});controlled.fighters[0].ailments['疲惫']=1;assert.equal(turn(controlled).fighters[0].hp,1234);
});
test('3711 2427奇偶层数消耗向下取整、封属回合与无层失败',()=>{
 for(let n=0;n<=5;n++){const s=make(e(2427));s.fighters[0].soulState.ningjie=n;const out=turn(s);assert.equal(out.fighters[0].soulState.ningjie,n-Math.floor(n/2));assert.equal(out.fighters[1].effects.statusBlock?.end,n>=3?Math.ceil(n/2):undefined);}
 const s=make(e(2427));s.fighters[0].soulState.ningjie=5;timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].soulState.ningjie,5);
});
test('3711 2426击败消耗与未击败、攻击免疫、封招均不消耗',()=>{
 // Isolate the actual zero-PP source effect on a synthetic positive-PP fixture;
 // the real zero-PP path is exercised separately below.
 for(const killed of [false,true]){const s=make(e(2426),{targetHp:killed?1:9000});s.fighters[0].pp[key(s.auditMoveId)]=1;s.fighters[0].soulState.ningjie=5;const out=turn(s);assert.equal(out.fighters[0].soulState.ningjie,killed?3:5);}
 for(const block of ['skillBlock','攻击伤害免疫']){const s=make(e(2426),{targetHp:1});s.fighters[0].pp[key(s.auditMoveId)]=1;s.fighters[0].soulState.ningjie=5;timer(s,block==='skillBlock'?0:1,block);assert.equal(turn(s).fighters[0].soulState.ningjie,5);}
});
test('3711 2072初始4层允许真实零PP选招执行，未行动仍记选招，归零失去能力',()=>{
 const s=make(e(2426),{soul:2072});const a=s.fighters[0];assert.equal(a.soulState.ningjie,4);assert.equal(a.pp[key(s.auditMoveId)],0);assert.ok(E.availableMoves(a).includes(key(s.auditMoveId)));const o=turn(s);assert.ok(o.fighters[0].lastAttackDamage>0);assert.equal(o.fighters[0].pp[key(s.auditMoveId)],0);
 const c=structuredClone(s);c.fighters[0].ailments['疲惫']=1;const co=turn(c);assert.equal(co.fighters[0].soulState.selectedSkill,true);assert.equal(co.fighters[1].hp,9000);assert.equal(co.fighters[0].pp[key(c.auditMoveId)],0);
 a.soulState.ningjie=0;assert.ok(!E.availableMoves(a).includes(key(s.auditMoveId)));assert.throws(()=>turn(s));
 const no=make(e(2426));assert.ok(!E.availableMoves(no.fighters[0]).includes(key(no.auditMoveId)));
});
test('3711 零PP与零基础暴击真实来源保留，负数非整数越界仍拒绝',()=>{
 const api=require('../seerapi.cjs'),r=require('../research/3711-source-audit.json').records;const raw=r.find(x=>x.url.endsWith('/skill/38319')).data;const pet=require('../research/3711-source-check-curl.json').records.find(x=>x.url.endsWith('/pet/3711')).data;const learn=pet.skill.find(x=>x.skill.id===38319);const m=api.convertMove(raw,learn,'自然圣灵');assert.equal(m.pp,0);assert.equal(m.critical,'0/16');
 for(const pp of [-1,.5,101]){assert.throws(()=>api.convertMove({...raw,max_pp:pp},learn,'自然圣灵'));const s=structuredClone(source);const q={...m,pp,effectIds:[],effectInstances:[],description:''};assert.ok(E.WIKI.compile(q,s).issue);}
 for(const critical of ['-1/16','0.5/16','17/16'])assert.ok(E.WIKI.compile({...m,critical,effectIds:[],effectInstances:[],description:''},source).issue);
});
test('3711 2072未选技能消层沉默、免疫仍消耗并回退，五层延长与已选受控',()=>{
 for(const immune of [false,true]){const s=make(undefined,{soul:2072});if(immune)timer(s,1,'免异常');const o=E.resolveTurn(s,[key(900031),'potion:hp']);assert.equal(o.fighters[0].soulState.ningjie,3);assert.equal(o.fighters[1].ailments['沉默'],immune?undefined:2);assert.equal(o.fighters[0].effects['最优对手系别']?.end,immune?3:undefined);}
 const five=make(undefined,{soul:2072});five.fighters[0].soulState.ningjie=5;const o=E.resolveTurn(five,[key(900031),'potion:hp']);assert.equal(o.fighters[1].ailments['沉默'],3);assert.equal(o.fighters[0].soulState.ningjie,4);
 const c=make(undefined,{soul:2072});c.fighters[1].ailments['疲惫']=1;const co=turn(c);assert.equal(co.fighters[0].soulState.ningjie,4);assert.equal(co.fighters[1].ailments['沉默'],undefined);assert.equal(co.fighters[0].effects['最优对手系别'],undefined);
});
test('3711 2380两次暴击强制命中突破封招与MISS，控制与非暴不消费',()=>{
 const start=turn(make(e(2380)));assert.equal(start.fighters[0].counts.criticalForceHit,2);
 for(const block of ['skillBlock','攻击必失']){const s=structuredClone(start);s.moveDefinitions[key(900030)].alwaysHit=false;delete s.fighters[0].effects['攻击必中'];timer(s,0,block);timer(s,0,'必定暴击');const o=turn(s,900030);assert.ok(o.fighters[0].lastAttackDamage>0);assert.equal(o.fighters[0].counts.criticalForceHit,1);const twice=turn(o,900030);assert.equal(twice.fighters[0].counts.criticalForceHit,0);const expired=turn(twice,900030);assert.equal(expired.fighters[1].hp,twice.fighters[1].hp);}
 const c=structuredClone(start);c.fighters[0].ailments['疲惫']=c.round;timer(c,0,'必定暴击');assert.equal(turn(c,900030).fighters[0].counts.criticalForceHit,2);
 const no=turn(start,900030);assert.ok(no.fighters[0].lastAttackDamage>0);assert.equal(no.fighters[0].counts.criticalForceHit,2);
});
test('3711 自然祝福初始化上限、行动消耗未行动增加、先制免异常与减伤',()=>{
 const s=make(undefined,{soul:987});assert.equal(s.fighters[0].soulState.natureBlessings,4);assert.equal(turn(s).fighters[0].soulState.natureBlessings,3);
 const item=E.resolveTurn(s,['potion:hp',key(900041)]);assert.equal(item.fighters[0].soulState.natureBlessings,4);
 const control=structuredClone(s);control.fighters[0].soulState.natureBlessings=2;control.fighters[0].ailments['疲惫']=1;assert.equal(turn(control).fighters[0].soulState.natureBlessings,3);
 const slow=make(undefined,{soul:987,aStats:{spe:1}});assert.equal(turn(slow,900030,900040).turns[0].first,0);
 const base=make(),b=turn(base,900031,900040),reduced=turn(make(undefined,{soul:987}),900031,900040);assert.ok(reduced.fighters[1].lastAttackDamage<b.fighters[1].lastAttackDamage);
});
test('3711 自然祝福技能获得与上限、翻倍强化、消耗清PP及击败损层',()=>{
 for(const id of [1382,1384]){const s=make(e(id));s.fighters[0].soulState.natureBlessings=3;assert.equal(turn(s).fighters[0].soulState.natureBlessings,4);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].soulState.natureBlessings,3);}
 for(const n of [0,1]){const s=make(e(1383));s.fighters[0].soulState.natureBlessings=n;assert.equal(turn(s).fighters[0].stages.atk,n?2:1);}
 const clear=make(e(1385));clear.fighters[0].soulState.natureBlessings=4;const out=turn(clear);assert.equal(out.fighters[0].soulState.natureBlessings,0);assert.ok(Object.values(out.fighters[1].pp).some(n=>n===0));const protect=structuredClone(clear);timer(protect,1,'PP保护');assert.deepEqual(turn(protect).fighters[1].pp,Object.fromEntries(protect.fighters[1].moves.map(id=>[id,id===key(900041)?98:99])));
 for(const hp of [1,9000]){const s=make(e(1386),{targetHp:hp});s.fighters[0].soulState.natureBlessings=4;assert.equal(turn(s).fighters[0].soulState.natureBlessings,hp===1?3:4);}
});
test('3711 1485睡眠失败空定及免疫，1054反转成功空定，2430零伤清回合空定',()=>{
 const sleep=make(e(1485));sleep.fighters[1].stages.atk=1;assert.ok(turn(sleep).fighters[1].ailments['睡眠']>=2);const empty=turn(make(e(1485)));assert.equal(empty.fighters[1].ailments['空定'],undefined);const blockedSleep=make(e(1485));blockedSleep.fighters[1].stages.atk=1;blockedSleep.fighters[1].counts.immune=1;assert.ok(turn(blockedSleep).fighters[1].ailments['空定']>=2);
 const immune=make(e(1485));timer(immune,1,'免异常');assert.deepEqual(turn(immune).fighters[1].ailments,{});
 const reverse=make(e(1054));reverse.fighters[0].stages.spe=-2;const r=turn(reverse);assert.equal(r.fighters[0].stages.spe,2);assert.ok(r.fighters[1].ailments['空定']>=2);assert.equal(turn(make(e(1054))).fighters[1].ailments['空定'],undefined);
 const zero=make(e(2430),{soul:2072});zero.moveDefinitions[key(zero.auditMoveId)].power=0;timer(zero,1,'doubleDamage');const z=turn(zero);assert.equal(z.fighters[0].lastAttackDamage,0);assert.equal(z.fighters[1].effects.doubleDamage,undefined);assert.ok(z.fighters[1].ailments['空定']>=2);
 const block=structuredClone(zero);timer(block,0,'skillBlock');const b=turn(block);assert.ok(b.fighters[1].effects.doubleDamage);assert.equal(b.fighters[1].ailments['空定'],undefined);
});
test('3711 2425低PP增伤加算且不计本次扣PP变化，阈值1与2分离',()=>{
 const run=(pp,extra)=>{const s=make(e(2425),{soul:2072});s.fighters[0].pp[key(s.auditMoveId)]=pp;if(extra)s.fighters[1].pp[key(900040)]=1;return turn(s);};
 const two=run(2,false),one=run(1,false),extra=run(2,true);assert.equal(two.fighters[0].pp[key(two.auditMoveId)],1);assert.ok(one.fighters[0].lastAttackDamage>two.fighters[0].lastAttackDamage);assert.equal(one.fighters[0].lastAttackDamage,extra.fighters[0].lastAttackDamage);
 const baseline=make(e(2425),{soul:2072,omit:true});baseline.fighters[0].pp[key(baseline.auditMoveId)]=2;const d=turn(baseline).fighters[0].lastAttackDamage;assert.ok(Math.abs(two.fighters[0].lastAttackDamage-d*1.5)<=2);assert.ok(Math.abs(one.fighters[0].lastAttackDamage-d*1.75)<=2);
});
test('3711 1385只抽正PP且无放回，数量超过候选耗尽后停止',()=>{
 for(const n of [1,2,4]){const s=make(e(1385));s.fighters[0].soulState.natureBlessings=n;s.fighters[1].pp[key(900040)]=0;s.fighters[1].pp[key(900042)]=0;const o=E.resolveTurn(s,[key(s.auditMoveId),'potion:hp']);assert.equal(Object.values(o.fighters[1].pp).filter(x=>x===0).length,2+Math.min(3,n));assert.equal(o.fighters[0].soulState.natureBlessings,0);}
});
test('3711 自然祝福每层25%免异常、满层必免与零层失效',()=>{
 let immune=0,applied=0;for(let seed=0;seed<20;seed++){for(const n of [0,1,4]){const s=make(undefined,{soul:987,opponentMove:26358,opponentEffectId:1047,seed});s.fighters[0].soulState.natureBlessings=n;const o=E.resolveTurn(s,['potion:hp',key(900042)]);const got=!!o.fighters[0].ailments['睡眠'];if(n===4)assert.equal(got,false);if(n===0&&got)applied++;if(n===1&&!got)immune++;}}assert.ok(applied>0);assert.ok(immune>0);
});
test('3711 2380突破封招仍执行真实命中强化，非暴和耗尽不执行',()=>{
 const s=turn(make(e(2380)));const ops=E.WIKI.effectsEngine.compileInstances([{id:4,args:[0,100,1]}],source.effects).operations;s.moveDefinitions[key(900030)].operations=ops;timer(s,0,'skillBlock');timer(s,0,'必定暴击');let o=turn(s,900030);assert.equal(o.fighters[0].stages.atk,1);o=turn(o,900030);assert.equal(o.fighters[0].stages.atk,2);assert.equal(turn(o,900030).fighters[0].stages.atk,2);
 const non=structuredClone(s);delete non.fighters[0].effects['必定暴击'];assert.equal(turn(non,900030).fighters[0].stages.atk,0);
});
test('3711 觉醒版共享技能获得自然祝福后仍按层获得先制与减伤',()=>{
 const s=make(e(1384),{soul:2072,aStats:{spe:1}});const o=turn(s);assert.equal(o.fighters[0].soulState.natureBlessings,2);assert.equal(E.SOULS.trait(o.fighters[0],'attackPriority'),2);const hit=turn(o,900030,900040);assert.equal(hit.turns.at(-1).first,0);const no=structuredClone(o);no.fighters[0].soulState.natureBlessings=0;assert.ok(hit.fighters[1].lastAttackDamage<turn(no,900030,900040).fighters[1].lastAttackDamage);
});
