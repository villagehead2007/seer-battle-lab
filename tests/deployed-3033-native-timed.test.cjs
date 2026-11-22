'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3033-native.cjs'),pp='potion:pp';
const attacks=(s,side)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type==='attack'&&e.sourceSide===side),detail=(s,side)=>s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===side)?.detail;
test('3033渡世765当前三回禁敌真实加速第四恢复，191第五回仍反睡第六正常受睡',()=>{
 let s=make(24736,{enemyMoves:[20889]});for(let r=1;r<=4;r++){s=turn(s,r===1?24736:pp,20889);assert.equal(s.fighters[1].stages.spe,r<=3?0:1);}
 for(const end of[5,6]){s=turn(make(24736,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),24736);for(let r=2;r<end;r++)s=turn(s,pp);s=turn(s,pp,22053);assert.equal(!!s.fighters[0].ailments['睡眠'],end===6);assert.equal(!!s.fighters[1].ailments['睡眠'],end===5);}
});
test('3033不败57当前四回合仅真实用技能回复三分一，药剂不触发，第五回停止且技能禁疗阻挡',()=>{
 let s=turn(make(24737,{aHp:1000,extraMoves:[20267,20307,10086]}),24737);assert.equal(s.fighters[0].hp,4000);s=turn(s,20267);assert.equal(s.fighters[0].hp,7000);s=turn(s,pp);assert.equal(s.fighters[0].hp,7000);s=turn(s,20307);assert.equal(s.fighters[0].hp,9000);s=turn(s,10086);assert.ok(!s.turns.at(-1).events.some(e=>e.text.includes('持续用招回复')));
 s=turn(make(24737,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:10}}}),24737);assert.equal(s.fighters[0].hp,1000);s=turn(s,'potion:hp');assert.ok(s.fighters[0].hp>1000);
});
test('3033不败440当前三回合敌技能PP两倍第四单耗，佛祖444逐槽扣一补一且本招先耗后回',()=>{
 let s=make(24737,{enemyMoves:[10086]}),n=s.fighters[1].pp['wiki:10086'];for(let r=1;r<=4;r++){s=turn(s,r===1?24737:pp,10086);n-=r<=3?2:1;assert.equal(s.fighters[1].pp['wiki:10086'],n);}
 s=make(24735);for(const k of s.fighters[0].moves)s.fighters[0].pp[k]-=2;const a={...s.fighters[0].pp},b={...s.fighters[1].pp};s=turn(s,24735,'potion:hp');for(const k of s.fighters[0].moves)assert.equal(s.fighters[0].pp[k],a[k]+(k==='wiki:24735'?0:1));for(const k of s.fighters[1].moves)assert.equal(s.fighters[1].pp[k],b[k]-1);
});
test('3033越战599当前三轮物理特殊红伤各减50%，第四恢复，原生固定75百分比800不减',()=>{
 let s=turn(make(19282,{enemyId:3014,enemyMoves:[10004,11042],aStages:{acc:6}}),19282,10004);assert.equal(s.fighters[0].effects['分类攻击减伤'].end,3);assert.ok(detail(s,1).includes('增减伤 0.5'));s=turn(s,pp,11042);assert.ok(detail(s,1).includes('增减伤 0.5'));s=turn(s,pp,10004);assert.ok(detail(s,1).includes('增减伤 0.5'));s=turn(s,pp,10004);assert.ok(detail(s,1).includes('增减伤 1 ×'));for(const[move,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){const out=turn(make(19282,{enemyId:3017,enemyMoves:[move],aStages:{acc:6}}),19282,move);assert.equal(out.damageEvents.filter(e=>e.type===type&&e.targetSide===0).reduce((sum,e)=>sum+e.settledDamage,0),n);}
});
test('3033帝天889真实消掉对手必暴才施害怕并阻当前出招，空回合不害怕且原先制三抢先',()=>{
 let s=make(19281,{enemyMoves:[20355,10086],aStats:{spe:1},bStats:{spe:9999}});s=turn(s,pp,20355);assert.ok(s.fighters[1].effects['必定暴击']);const before=s.fighters[1].pp['wiki:10086'];s=turn(s,19281,10086);assert.equal(s.fighters[1].effects['必定暴击'],undefined);assert.ok(s.fighters[1].ailments['害怕']);assert.equal(s.fighters[1].pp['wiki:10086'],before);assert.equal(attacks(s,1).length,0);assert.equal(s.turns.at(-1).first,0);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);s=turn(make(19281),19281);assert.equal(s.fighters[1].ailments['害怕'],undefined);
});
test('3033公共692沿已答直接体力损失：两轮免暴击按完整量直扣，不产生真伤，第3轮暴击正常',()=>{
 const setup=heal=>{let s=make(24737,{aHp:heal?1000:4000,enemyId:3031,enemyMoves:[20769,10127]});s=turn(s,heal?24737:pp,20769);return turn(s,pp,10127);},raw=attacks(setup(false),1)[0].settledDamage;let s=setup(true);assert.ok(raw>0);assert.equal(attacks(s,1)[0].settledDamage,0);assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[1].hp,9000-raw);const loss=s.healthLossEvents.filter(e=>e.round===2&&e.targetSide===1);assert.equal(loss.length,1);assert.equal(loss[0].requested,raw);assert.equal(loss[0].hpLoss,raw);assert.ok(!s.damageEvents.some(e=>e.round===2&&e.type==='true'));s=turn(s,pp,10127);assert.ok(attacks(s,1)[0].settledDamage>0);
});
test('3033公共692直接扣血遵守真实冥王首次致死保1，完整请求保留而实际损0',()=>{
 const s=turn(make(24737,{aHp:1000,enemyId:3141,enemyMoves:[10074],bHp:1,bStats:{atk:9999},aEffects:{id984:{start:1,end:1,amount:3}},bEffects:{必定暴击:{start:1,end:1}}}),24737,10074);assert.equal(s.fighters[1].soulId,611);assert.equal(attacks(s,1)[0].settledDamage,0);assert.equal(s.fighters[1].hp,1);const e=s.healthLossEvents.find(e=>e.targetSide===1);assert.ok(e.requested>1);assert.equal(e.hpLoss,0);assert.equal(e.type,'direct');
});
