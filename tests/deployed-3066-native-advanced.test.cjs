'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3066-native.cjs'),pp='potion:pp';
test('3066念力16睡眠30与飞燕12烧伤40原生初始种子均有成功失败，烧伤1125真伤且免异常阻挡',()=>{
 for(const[id,status]of[[11281,'睡眠'],[16072,'烧伤']]){let yes=0,no=0,first;for(let seed=1;seed<=32;seed++){const s=turn(make(id,{seed,aStages:{acc:6}}),id);if(s.fighters[1].ailments[status]){yes++;first??=seed;if(status==='烧伤')assert.equal(s.damageEvents.find(e=>e.type==='true'&&e.targetSide===1).settledDamage,1125);}else no++;}assert.ok(yes>0&&no>0);const s=turn(make(id,{seed:first,aStages:{acc:6},bEffects:{免异常:{start:1,end:3}}}),id);assert.equal(s.fighters[1].ailments[status],undefined);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));}
});
test('3066连营470原生60%命中烧伤四轮，首招烧伤阳性种子推迟到第五轮即无奖励，免异常阻挡',()=>{
 let yes=0,no=0,first;for(let seed=1;seed<=32;seed++){let s=turn(make(24804,{seed,extraMoves:[10001]}),24804);assert.equal(s.fighters[0].effects['攻击附加异常'].end,4);s=turn(s,10001);if(s.fighters[1].ailments['烧伤']){yes++;first??=seed;assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='true').settledDamage,1125);}else no++;}assert.ok(yes>0&&no>0);let s=turn(make(24804,{seed:first,extraMoves:[10001]}),24804);for(let r=2;r<=4;r++)s=turn(s,pp);s=turn(s,10001);assert.equal(s.fighters[1].ailments['烧伤'],undefined);s=turn(make(24804,{seed:first,extraMoves:[10001],bEffects:{免异常:{start:1,end:5}}}),24804);s=turn(s,10001);assert.equal(s.fighters[1].ailments['烧伤'],undefined);
});
test('3066连营525真实三轮50%免攻有成功失败，零红仍有原生固定75且第四轮不再免攻',()=>{
 let yes=0,no=0;for(let seed=1;seed<=24;seed++){let s=turn(make(24804,{seed,enemyId:3017,enemyMoves:[10761]}),24804);s=turn(s,pp,10761);const red=s.damageEvents.find(e=>e.round===2&&e.type==='attack'&&e.sourceSide===1);if(red.settledDamage===0)yes++;else no++;assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='fixed'&&e.sourceSide===1).settledDamage,75);s=turn(s,pp);s=turn(s,pp,10761);assert.ok(s.damageEvents.find(e=>e.round===4&&e.type==='attack'&&e.sourceSide===1).settledDamage>0);}assert.ok(yes>0&&no>0);
});
test('3066智取164仅当轮受原生攻击50%反烧伤，真实盖亚逆转清烧后第三轮再攻不再触发',()=>{
 let yes=0,no=0;for(let seed=1;seed<=24;seed++){let s=turn(make(16076,{seed,enemyId:3056,enemyMoves:[10127,23285],aStages:{acc:6}}),16076,10127);if(s.fighters[1].ailments['烧伤']){yes++;s=turn(s,pp,23285);assert.equal(s.fighters[1].ailments['烧伤'],undefined);s=turn(s,pp,10127);assert.equal(s.fighters[1].ailments['烧伤'],undefined);}else no++;}assert.ok(yes>0&&no>0);
});
test('3066夺命456红伤后严格279秒杀280不秒，原生MISS不执行秒杀',()=>{
 const base=turn(make(19416,{aStages:{acc:6}}),19416),n=base.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage;for(const hp of[279,280]){const s=turn(make(19416,{aStages:{acc:6},bHp:n+hp}),19416);assert.equal(s.fighters[1].hp,hp===279?0:280);}let missed=false;for(let seed=1;seed<=48&&!missed;seed++){const s=turn(make(19416,{seed,bHp:279,aStages:{acc:-6}}),19416);if(s.turns.at(-1).events.some(e=>e.text.includes('未命中'))){missed=true;assert.equal(s.fighters[1].hp,279);assert.equal(s.fighters[0].pp['wiki:19416'],4);}}assert.ok(missed);
});
