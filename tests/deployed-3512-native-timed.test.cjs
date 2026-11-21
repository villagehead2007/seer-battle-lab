'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn,red}=require('./helpers/3512-native.cjs');
const pp='potion:pp';
test('3512纯净之心58只令下两回合实际攻击必暴，第三回合恢复普通伤害且药剂照常占回合',()=>{
 let s=turn(make(20618,{extraMoves:[10001],aStats:{atk:1200}}),20618);
 assert.deepEqual(s.fighters[0].effects['必定暴击'],{start:2,end:3});
 for(const round of [2,3,4]){s=turn(s,10001);const d=red(s);assert.ok(round<4?d>=202&&d<=238:d>=101&&d<=119,{round,d});assert.equal(s.turns.at(-1).round,round);}
 let t=turn(make(20618,{extraMoves:[10001],aStats:{atk:1200}}),20618);t=turn(t,pp);t=turn(t,pp);t=turn(t,10001);assert.ok(red(t)<=119);assert.equal(t.fighters[0].effects['必定暴击'],undefined);
});
test('3512绝影夕阳81下三回合覆盖负六命中而第四回合恢复MISS判定，不延长同技能89当前两回合吸血',()=>{
 let expiredMisses=0;
 for(let seed=1;seed<=32;seed++){let s=turn(make(24184,{extraMoves:[10001],seed,aStages:{acc:-6}}),24184);assert.equal(s.fighters[0].effects['攻击必中'].start,2);assert.equal(s.fighters[0].effects['攻击必中'].end,4);for(let r=2;r<=5;r++){s=turn(s,10001);if(r<=4)assert.ok(red(s)>0,'必中期 seed '+seed+' round '+r);else if(red(s)===0)expiredMisses++;}assert.equal(s.fighters[0].effects['攻击必中'],undefined);}
 assert.ok(expiredMisses>0);
});
test('3512绝影夕阳89实际技能伤害三分之一回血、当前第二回合后到期，技能禁疗阻挡但不阻止造成伤害',()=>{
 for(const blocked of [false,true]){let s=turn(make(24184,{extraMoves:[10001],aHp:1000,aStats:{atk:1200},aEffects:blocked?{'技能禁疗':{start:1,end:5}}:{}}),24184);s=turn(s,10001);assert.ok(red(s)>0);assert.equal(s.fighters[0].hp,blocked?1000:1000+Math.floor(red(s)/3));const hp=s.fighters[0].hp;s=turn(s,10001);assert.equal(s.fighters[0].hp,hp);assert.equal(s.fighters[0].effects['全伤害吸血'],undefined);}
});
test('3512寰宇843只给下两回合技能加二先制，低速实际抢先且药剂等待后到期恢复后手',()=>{
 let s=make(25862,{extraMoves:[10001],enemyId:2988,enemyMoves:[10018],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp);s=turn(s,pp);s=turn(s,25862);for(const r of [4,5,6]){s=turn(s,10001,10018);assert.equal(s.turns.at(-1).first,r<6?0:1);assert.equal(s.fighters[0].soulState.resolvedPriority.value,r<6?2:0);}
});
test('3512持续技能受初始控制阻止时58、81、89、191及843均不授予，PP不消耗',()=>{
 for(const id of [20618,24184,25862]){const s=make(id);s.fighters[0].ailments['疲惫']=2;const o=turn(s,id);assert.deepEqual(o.fighters[0].effects,s.fighters[0].effects);assert.equal(o.fighters[0].pp['wiki:'+id],s.fighters[0].pp['wiki:'+id]);assert.equal(o.fighters[0].soulState.emperorConvertRound,undefined);}
});
test('3512寰宇191当前四回合免疫并反弹原生毒粉，首次魂印免异结束后仍生效且第五回合恢复中毒',()=>{
 let s=make(25862,{enemyId:4693,enemyMoves:[20020]});s=turn(s,pp);s=turn(s,pp);s=turn(s,25862);assert.deepEqual(s.fighters[0].effects.reflect,{start:3,end:6});for(const r of [4,5,6]){s=turn(s,pp,20020);assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.ok(s.fighters[1].ailments['中毒']>=r);assert.ok(s.turns.at(-1).events.some(e=>e.text.includes('免疫中毒并反弹')));}s=turn(s,pp,20020);assert.ok(s.fighters[0].ailments['中毒']>=7);assert.ok(s.fighters[0].hp<9000);assert.equal(s.fighters[0].effects.reflect,undefined);
});
