'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,make,turn,pick,timer}=require('./helpers/3705-battle.cjs');const e=id=>pick(id)[0];
test('3705 1425七参数按六种能力强化，低伤成功阈值不含等值，免攻封招禁强上限',()=>{
 const s=make(e(1425)),o=turn(s);assert.ok(o.fighters[0].lastAttackDamage<300);assert.deepEqual(keys.map(k=>o.fighters[0].stages[k]),[1,1,1,1,2,1]);assert.equal(o.fighters[0].hp,9000);
 for(const limit of [299,300]){const q=make(e(1425),{aStats:{spa:9999}});timer(q,1,'攻击伤害上限',{amount:limit});const n=turn(q);assert.equal(n.fighters[0].lastAttackDamage,limit);assert.equal(n.fighters[0].stages.atk,limit===299?1:0);}
 const im=make(e(1425));timer(im,1,'攻击伤害免疫');const z=turn(im);assert.equal(z.fighters[0].lastAttackDamage,0);assert.equal(z.fighters[0].stages.spe,2);
 for(const block of ['skillBlock','禁强化']){const q=make(e(1425));timer(q,0,block);assert.equal(turn(q).fighters[0].stages.spe,0);}
 const cap=make(e(1425));cap.fighters[0].stages.spe=5;assert.equal(turn(cap).fighters[0].stages.spe,6);
 const miss=make(e(1425),{hit:false});miss.moveDefinitions[key(miss.auditMoveId)].alwaysHit=false;timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[0].stages.spe,0);
});
test('3705 1425保留真实七参数，截断参数与越界参数拒绝',()=>{const m=source.moves.find(m=>m.id===36943),r=E.WIKI.effectsEngine;assert.deepEqual(m.effectInstances[2].args,[300,1,1,1,1,2,1]);for(const args of [[300,1],[300,1,1,1,1,7,1]])assert.ok(r.compileInstances([{id:1425,args}],source.effects).issue);assert.equal(r.compileInstances([m.effectInstances[2]],source.effects).issue,'');});
test('3705 1539高伤麻痹，低伤等值不清回合与高伤免疫失败清回合，保护封招和MISS',()=>{
 const high=make(e(1539),{aStats:{spa:9999}}),h=turn(high);assert.ok(h.fighters[0].lastAttackDamage>300);assert.ok([2,3].includes(h.fighters[1].ailments['麻痹']));assert.equal(h.fighters[1].ailments['害怕'],undefined);
 for(const amount of [299,300,301]){const s=make(e(1539),{aStats:{spa:9999}});timer(s,1,'攻击伤害上限',{amount});timer(s,1,'doubleDamage');if(amount===301)timer(s,1,'免异常');const o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,amount);assert.equal(!!o.fighters[1].effects.doubleDamage,amount<=300);}
 for(const block of ['protect','skillBlock','攻击必失']){const q=make(e(1539),{hit:false});q.moveDefinitions[key(q.auditMoveId)].alwaysHit=false;timer(q,1,'doubleDamage');timer(q,block==='protect'?1:0,block);assert.ok(turn(q).fighters[1].effects.doubleDamage);}
});
test('3705 1372三回合对手用攻麻痹，免疫清回合，属性控制到期不触发',()=>{
 const start=make(e(1372)),o=turn(start,start.auditMoveId,900040);assert.ok([2,3].includes(o.fighters[1].ailments['麻痹']));assert.equal(o.fighters[0].effects['对手用攻异常或清回合'].end,3);
 const no=make(e(1372));timer(no,1,'免异常');timer(no,1,'doubleDamage');assert.equal(turn(no,no.auditMoveId,900040).fighters[1].effects.doubleDamage,undefined);
 const protect=make(e(1372));timer(protect,1,'免异常');timer(protect,1,'protect');timer(protect,1,'doubleDamage');assert.ok(turn(protect,protect.auditMoveId,900040).fighters[1].effects.doubleDamage);
 assert.equal(turn(make(e(1372))).fighters[1].ailments['麻痹'],undefined);
 const controlled=make(e(1372));controlled.fighters[1].ailments['疲惫']=1;assert.equal(turn(controlled,controlled.auditMoveId,900040).fighters[1].ailments['麻痹'],undefined);
 const exp=turn(make(e(1372)));exp.round=4;assert.equal(turn(exp,900031,900040).fighters[1].ailments['麻痹'],undefined);
});
test('3705 1376三回合自身用攻害怕，未触发比例吸取回复，禁疗免粉属性到期',()=>{
 const s=make(e(1376),{hp:1000}),start=turn(s);assert.equal(start.fighters[1].ailments['害怕'],undefined);assert.equal(start.fighters[1].hp,9000);assert.equal(start.fighters[0].effects['自身用攻异常或吸取'].end,3);
 const hit=turn(start,900030);assert.ok([3,4].includes(hit.fighters[1].ailments['害怕']));
 for(const blocked of [false,true]){const q=structuredClone(start);timer(q,1,'免异常');if(blocked)timer(q,0,'技能禁疗');const o=turn(q,900030);assert.equal(o.fighters[0].hp,blocked?1000:4000);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,3000);}
 const pink=structuredClone(start);timer(pink,1,'免异常');pink.fighters[1].soulId=622;pink.fighters[1].ailments['疲惫']=2;const p=turn(pink,900030);assert.equal(p.fighters[0].hp,4000);assert.equal(9000-p.fighters[1].hp,p.fighters[0].lastAttackDamage);
 const control=structuredClone(start);control.fighters[0].ailments['疲惫']=2;assert.equal(turn(control,900030).fighters[1].hp,9000);
 start.round=4;assert.equal(turn(start,900030).fighters[1].ailments['害怕'],undefined);
});
test('3705 1781千灭雷翼回合开始锁定五条件，护盾强化弱化害怕与免疫上限',()=>{
 const s=make(undefined,{soul:1781,hp:1000});s.fighters[0].stages.atk=1;s.fighters[1].ailments['烧伤']=3;s.fighters[1].stages.def=-1;const o=turn(s,900031);assert.equal(o.fighters[0].suitState.shield,300);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[0].stages.spe,1);assert.equal(o.fighters[1].stages.atk,-1);assert.equal(o.fighters[1].stages.def,-2);assert.ok([2,3].includes(o.fighters[1].ailments['害怕']));
 const no=make(undefined,{soul:1781,hp:8000,targetHp:1000});const n=turn(no,900031);assert.equal(n.fighters[0].suitState.shield,0);assert.equal(n.fighters[0].stages.atk,0);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[1].ailments['害怕'],undefined);
 const immune=structuredClone(s);timer(immune,0,'禁强化');timer(immune,1,'免弱');timer(immune,1,'免异常');const im=turn(immune,900031);assert.equal(im.fighters[0].stages.atk,1);assert.equal(im.fighters[1].stages.atk,0);assert.equal(im.fighters[1].ailments['害怕'],undefined);
 s.fighters[0].stages.atk=6;assert.equal(turn(s,900031).fighters[0].stages.atk,6);
 const unlocked=make(pick(4)[0],{soul:1781,hp:8000});const u=turn(unlocked);assert.equal(u.fighters[0].stages.spa,2);assert.equal(u.fighters[0].stages.def,0);assert.equal(turn(u,900031).fighters[0].stages.def,1);
});
test('3705 1781满体当回合必暴，未满不触发，控制不获用招护盾，下回合先制到期',()=>{
 const s=make(undefined,{soul:1781}),o=turn(s,900030);const q=make(undefined,{soul:1781,hp:8999}),n=turn(q,900030);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-2*n.fighters[0].lastAttackDamage)<=1);
 const block=make(undefined,{soul:1781,hp:1000});block.fighters[0].ailments['疲惫']=1;assert.equal(turn(block,900031).fighters[0].suitState.shield,0);
 const slow=make(undefined,{soul:1781,hp:1000,aStats:{spe:1}}),a=turn(slow,900031);assert.equal(a.turns[0].first,1);assert.equal(a.fighters[0].effects.id984.start,2);assert.equal(a.fighters[0].effects.id984.end,2);const b=turn(a,900031);assert.equal(b.turns[1].first,0);assert.equal(turn(b,900031).turns[2].first,1);
});
test('3705 984随机五分支真实变化，百分比追加，必暴只限当前攻击不留存',()=>{
 const found=new Set();let criticalSeed=null;
 for(let seed=0;seed<80;seed++){const s=make(undefined,{soul:984,seed}),o=turn(s,900030),a=o.fighters[0],b=o.fighters[1];assert.equal(9000-b.hp-a.lastAttackDamage,250);if(b.stages.atk===-1)found.add('drop');else if(a.stages.atk===1)found.add('boost');else if(b.ailments['害怕'])found.add('fear');else if(a.suitState.shield===300)found.add('shield');else if(o.turns[0].events.some(e=>e.detail?.includes('暴击 2'))){found.add('crit');criticalSeed??=seed;}else found.add('fear-failed');assert.equal(a.soulState.guardianCritical,false);}
 assert.deepEqual([...found].sort(),['boost','crit','drop','fear','fear-failed','shield'].sort());assert.notEqual(criticalSeed,null);
 const s=make(undefined,{soul:984,seed:criticalSeed}),a=turn(s,900031);assert.equal(a.fighters[0].soulState.guardianCritical,false);assert.equal(a.fighters[0].lastAttackDamage,0);
 let plainSeed;for(let seed=0;seed<80;seed++){const q=make(undefined,{soul:984,seed});const o=turn(q,900030);if(o.fighters[0].suitState.shield===300){plainSeed=seed;break;}}assert.notEqual(plainSeed,undefined);
 a.rng=plainSeed;const b=turn(a,900030);assert.ok(!b.turns[1].events.some(e=>e.detail?.includes('暴击 2')));
});
test('3705 984百分比免疫阻断追加，控制不抽奖，后手仅下回合先制',()=>{
 const s=make(undefined,{soul:984});s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;const o=turn(s,900030);assert.equal(9000-o.fighters[1].hp,o.fighters[0].lastAttackDamage);
 const c=make(undefined,{soul:984});c.fighters[0].ailments['疲惫']=1;const n=turn(c,900031);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].suitState.shield,0);assert.equal(n.fighters[0].stages.atk,0);
 const slow=make(undefined,{soul:984,aStats:{spe:1}}),a=turn(slow,900031);assert.equal(a.turns[0].first,1);assert.equal(a.fighters[0].effects.id984.start,2);assert.equal(a.fighters[0].effects.id984.end,2);const b=turn(a,900031);assert.equal(b.turns[1].first,0);assert.equal(turn(b,900031).turns[2].first,1);
});
test('3705 1118五参数实际攻击后麻痹与属性后降级，免疫免弱控制和到期',()=>{
 const x={moveId:28496,index:null};const s=make(x),a=turn(s,28496,900040);assert.ok([2,3].includes(a.fighters[1].ailments['麻痹']));assert.equal(a.fighters[1].ailments['睡眠'],undefined);assert.equal(a.fighters[0].effects.hathawayReaction.end,3);
 const b=turn(make(x));for(const k of keys)assert.equal(b.fighters[1].stages[k],-1);
 const im=make(x);timer(im,1,'免异常');assert.equal(turn(im,28496,900040).fighters[1].ailments['麻痹'],undefined);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);
 const c=make(x);c.fighters[1].ailments['疲惫']=1;assert.equal(turn(c,28496,900040).fighters[1].ailments['麻痹'],undefined);
 b.round=4;b.fighters[1].stages.atk=0;assert.equal(turn(b,900031).fighters[1].stages.atk,0);
});
test('3705 1781先手吸取实际回复与禁疗粉伤免疫，后手不吸取',()=>{for(const speed of [500,1]){const s=make(undefined,{soul:1781,hp:1000,aStats:{spe:speed}}),o=turn(s,900031);assert.equal(o.fighters[0].hp,speed===500?1250:1000);assert.equal(o.fighters[1].hp,speed===500?8750:9000);}const no=make(undefined,{soul:1781,hp:1000});timer(no,0,'技能禁疗');assert.equal(turn(no,900031).fighters[0].hp,1250);const im=make(undefined,{soul:1781,hp:1000});im.fighters[1].soulId=622;im.fighters[1].ailments['疲惫']=1;assert.equal(turn(im,900031).fighters[0].hp,1000);});
test('3705 原版觉醒绑定真实第五和种族值，各版完整技能接入并拒绝跨版第五',()=>{assert.deepEqual(E.WIKI.skillVersionIssues(source,true),[]);for(const group of source.skillVersions){const snapshot={...structuredClone(source),selectedSoulId:group.soulId},moves=E.WIKI.availableMoves(snapshot),fifth=moves.find(m=>m.fifth),regular=moves.filter(m=>!m.fifth);assert.equal(fifth.id,group.id==='original'?32491:36944);for(const m of moves){const ids=[fifth.id,...[...new Set([...(m.fifth?[]:[m.id]),...regular.map(x=>x.id)])].slice(0,4)];const s=E.createBattle({wikiSnapshots:[snapshot,snapshot],wikiLoadouts:[ids,ids]});assert.equal(s.fighters[0].pp[key(m.id)],m.pp);}assert.equal(snapshot.souls.find(x=>x.id===1781).base.spe,138);const ids=[group.id==='original'?36944:32491,...regular.slice(0,4).map(x=>x.id)];assert.throws(()=>E.createBattle({wikiSnapshots:[snapshot,snapshot],wikiLoadouts:[ids,ids]}));}});
