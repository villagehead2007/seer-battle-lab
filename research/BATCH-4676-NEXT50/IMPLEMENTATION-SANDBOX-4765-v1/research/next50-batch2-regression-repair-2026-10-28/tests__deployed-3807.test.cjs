'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,make,turn,pick,timer,key}=require('./helpers/3807-battle.cjs');
const simple={moveId:10499,index:null};
test('3807 魂印1082先手用招立即失效且本次增伤，MISS免攻亦触发，控制不行动不触发',()=>{
 const s=make(simple,{soul:1082}),o=turn(s,undefined,900040);assert.equal(o.fighters[0].soulState.extraordinaryTriggers,1);assert.equal(o.fighters[0].hp,9000);const b=turn(make(simple));assert.ok(o.fighters[0].lastAttackDamage>b.fighters[0].lastAttackDamage);
 const immune=make(simple,{soul:1082});timer(immune,1,'攻击伤害免疫');const i=turn(immune,undefined,900040);assert.equal(i.fighters[1].hp,9000);assert.equal(i.fighters[0].hp,9000);assert.equal(i.fighters[0].soulState.extraordinaryTriggers,1);
 let miss=false;for(let seed=0;seed<100&&!miss;seed++){const s=make(simple,{soul:1082,hit:false,seed});s.fighters[0].stages.acc=-6;const n=turn(s,undefined,900040);if(n.turns.at(-1).events.some(ev=>JSON.stringify(ev).includes('未命中'))){miss=true;assert.equal(n.fighters[0].soulState.extraordinaryTriggers,1);assert.equal(n.fighters[0].hp,9000);}}assert.ok(miss);
 const control=make(simple,{soul:1082});control.fighters[0].ailments['疲惫']=2;const c=turn(control,undefined,900040);assert.equal(c.fighters[0].soulState.extraordinaryTriggers,undefined);assert.equal(c.fighters[0].pp[key(10499)],40);
});
test('3807 魂印1082概率100到0逐档成功失败，后手不触发，四次封顶',()=>{
 for(const n of [0,1,2,3,4]){let yes=false,no=false;for(let seed=0;seed<80;seed++){const s=make(simple,{soul:1082,seed});s.fighters[0].soulState.extraordinaryTriggers=n;const o=turn(s);const next=o.fighters[0].soulState.extraordinaryTriggers;assert.ok(next===n||next===n+1);if(next===n+1)yes=true;else no=true;}assert.equal(yes,n<4);assert.equal(no,n>0);}
 const slow=make(simple,{soul:1082,aStats:{spe:1}});slow.fighters[0].stages.acc=1;const o=turn(slow,undefined,900040);assert.equal(o.turns.at(-1).first,1);assert.equal(o.fighters[0].soulState.extraordinaryTriggers,undefined);
});
test('3807 魂印1082回合初锁定强化条件、全技能先制及增伤加算2.5倍',()=>{
 const status=make({moveId:20530,index:null},{soul:1082,aStats:{spe:1}});const o=turn(status);assert.equal(o.turns.at(-1).first,0);assert.equal(o.fighters[0].stages.acc,1);assert.equal(turn(o,900031).turns.at(-1).first,1);
 const s=make(simple,{soul:1082});s.fighters[0].stages.acc=1;s.fighters[0].soulState.extraordinaryTriggers=4;const n=turn(s);const plain=make(simple);plain.fighters[0].stages.acc=1;const b=turn(plain);assert.ok(n.fighters[0].lastAttackDamage>=b.fighters[0].lastAttackDamage*2.5-1);assert.ok(n.fighters[0].lastAttackDamage<=b.fighters[0].lastAttackDamage*2.5+2);
 const ctx={a:n.fighters[0],modifier:1};E.SOULS.run('beforeDamage',ctx);assert.equal(ctx.modifier,2.5);
});
test('3807 魂印1082第四次清两项正PP无放回，不足两项与零项安全且只触发一次',()=>{
 const seen=new Set();for(let seed=0;seed<80;seed++){const s=make(simple,{soul:1082,seed});s.fighters[0].soulState.extraordinaryTriggers=3;s.fighters[1].pp[key(900044)]=0;const o=turn(s);if(o.fighters[0].soulState.extraordinaryTriggers===4){const cleared=[900040,900041,900042,900043].filter(id=>o.fighters[1].pp[key(id)]===0);assert.equal(cleared.length,2);cleared.forEach(id=>seen.add(id));const next=turn(o,900031,[900040,900041,900042,900043].find(id=>o.fighters[1].pp[key(id)]>0));assert.equal(Object.values(next.fighters[1].pp).filter(n=>n===0).length,3);}}assert.equal(seen.size,4);
 for(const count of [0,1]){const s=make(simple,{soul:1082});s.fighters[0].soulState.extraordinaryTriggers=3;for(const id of s.fighters[1].moves)s.fighters[1].pp[id]=0;if(count)s.fighters[1].pp[key(900040)]=2;const c={a:s.fighters[0],t:s.fighters[1],first:0,round:1,random:()=>0};E.SOULS.run('beforeUse',c);assert.equal(Object.values(c.t.pp).reduce((a,b)=>a+b,0),0);assert.equal(c.a.soulState.extraordinaryTriggers,4);}
});
test('3807 1413最终50%暴击与实际非暴击的下两回合先制、必暴不补偿',()=>{
 const entry=pick(1413)[0];let yes=false,no=false;for(let seed=0;seed<80;seed++){const s=make(entry,{criticals:true,seed}),o=turn(s);if(o.fighters[0].effects.id984){no=true;assert.equal(o.fighters[0].effects.id984.start,2);assert.equal(o.fighters[0].effects.id984.end,3);assert.equal(o.fighters[0].effects.id984.amount,2);}else yes=true;}assert.ok(yes&&no);
 const s=make(entry,{criticals:true});timer(s,0,'必定暴击');assert.equal(turn(s).fighters[0].effects.id984,undefined);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].effects.id984,undefined);
 const operations=s.moveDefinitions[key(s.auditMoveId)].operations,c={chance:.0625};E.WIKI.effectsEngine.run('beforeCrit',operations,c);assert.equal(c.chance,.5);
});
test('3807 原招组合魂印、第五反强清PP与两项强化护盾共存',()=>{
 const s=make({moveId:33004,index:null},{soul:1082});s.fighters[1].stages.atk=2;const o=turn(s,undefined,900040);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.atk,-2);assert.equal(o.fighters[1].pp[key(900040)],96);assert.equal(o.fighters[0].hp,9000);
 const h=make({moveId:26591,index:null},{soul:1082,targetHp:8000}),n=turn(h);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[0].suitState.shield,400);assert.equal(n.fighters[0].effects['免异常'].end,5);assert.equal(n.fighters[0].effects['免弱'].end,5);
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3807 33004效果1061公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-1061-reversal-path.cjs')(3807,33004);assert.ok(o.fighters[0].hp>0);});}
