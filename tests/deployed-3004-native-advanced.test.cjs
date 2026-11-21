'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3004-native.cjs'),pp='potion:pp';
const events=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.sourceSide===side&&(!type||e.type===type)),damage=(s,type,side=0)=>events(s,type,side).reduce((n,e)=>n+e.settledDamage,0);
test('3004三个29原生附加75或100固定与红伤分离，属性招也附加，真实星皇免粉不取消主体',()=>{
 for(const [id,n]of [[10761,75],[22793,100],[23552,100]])for(const enemyId of [2989,3291]){const reply=enemyId===3291?20530:20889,s=turn(make(id,{enemyId,enemyMoves:[reply],bStats:{spe:9999}}),id,reply);assert.equal(damage(s,'fixed'),enemyId===3291?0:n);if(id===10761)assert.ok(damage(s,'attack')>0);else assert.equal(damage(s,'attack'),0);assert.equal(s.fighters[1].hp,9000-damage(s,'fixed')-damage(s,'attack'));if(id===23552)assert.equal(s.fighters[0].effects['免异常'].end,3);}
});
test('3004两60按原25或50当前三回合末固定，药剂和无攻击回合仍结算，第四回合停止且星皇免粉',()=>{
 for(const [id,n]of [[20445,25],[15121,50]]){let s=turn(make(id),id);for(let r=1;r<=4;r++){if(r>1)s=turn(s,pp);assert.equal(damage(s,'fixed'),r<=3?n:0);}s=turn(make(id,{enemyId:3291}),id);assert.equal(damage(s,'fixed'),0);}
});
test('3004失神39全部实际PP减一所选槽一变零取消攻击，初始二剩一仍攻击且其他槽逐一扣一',()=>{
 for(const initial of [1,2]){let s=make(20446,{enemyMoves:[10086],aHp:4000});s.fighters[1].pp['wiki:10086']=initial;const before={...s.fighters[1].pp};s=turn(s,20446,10086);for(const [key,n]of Object.entries(before))assert.equal(s.fighters[1].pp[key],key==='wiki:10086'?0:Math.max(0,n-1));if(initial===1){assert.equal(damage(s,'attack',1),0);assert.equal(s.fighters[0].hp,4000);}else assert.ok(damage(s,'attack',1)>0);}
});
test('3004狂化31真实三四五段均经自然初始种子出现，每段35威力独立红伤且扣一PP不变三次使用',()=>{
 const counts=new Set();for(let seed=1;seed<=24;seed++){const s=make(10975,{seed}),out=turn(s,10975),hits=events(out,'attack'),m=s.moveDefinitions['wiki:10975'],base=Math.floor(Math.floor(42*35*1200/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart);counts.add(hits.length);assert.ok(hits.length>=3&&hits.length<=5);for(const e of hits)assert.ok(e.settledDamage>=Math.floor(base*factor*.85)&&e.settledDamage<=Math.floor(base*factor));assert.equal(out.fighters[0].pp['wiki:10975'],m.pp-1);assert.equal(out.fighters[0].soulState.skillUses['wiki:10975'],1);assert.equal(out.fighters[1].hp,9000-damage(out,'attack'));}assert.deepEqual([...counts].sort(),[3,4,5]);
});
test('3004龙啸43真实回复3000，真实先制二避免混后手200，技能禁疗与近满体封顶分别验证',()=>{
 for(const [hp,blocked]of [[1000,false],[8999,false],[1000,true]]){const s=turn(make(16438,{enemyMoves:[10086],aHp:hp,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:2}}:{}}),16438,10086);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].hp,Math.min(9000,hp+(blocked?0:3000))-damage(s,'attack',1));}
});
test('3004龙魂与贤者两48当前三四回合免异，真实安魂曲边界结束后可睡眠',()=>{
 for(const [id,n]of [[23552,3],[24666,4]]){let s=make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}});s=turn(s,id,22053);assert.equal(s.fighters[0].effects['免异常'].end,n);assert.equal(s.fighters[0].ailments['睡眠'],undefined);for(let r=2;r<=n;r++){s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);}s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']>=n+1);}
});
test('3004千言593按原始特攻3600的20%附720百分比，正负等级不入基数且星皇免粉',()=>{
 for(const spa of [-2,0,2]){const s=turn(make(16440,{aStages:{spa}}),16440);assert.equal(damage(s,'percent'),720);assert.ok(damage(s,'attack')>0);}const s=turn(make(16440,{enemyId:3291}),16440);assert.equal(damage(s,'percent'),0);assert.ok(damage(s,'attack')>0);
});
test('3004上古868仅真实消穿梭强化成功令下回合先制负二，原生慢速抢先且下一回合恢复',()=>{
 for(const success of [true,false]){let s=make(19150,{extraMoves:[10611],enemyMoves:[20889,10086],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp,success?20889:pp);s=turn(s,19150);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[1].effects.id984?.amount,success?-2:undefined);s=turn(s,10611,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,success?-2:0);assert.equal(s.turns.at(-1).first,success?0:1);s=turn(s,10611,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,0);}
});
test('3004贤者676仅下三回合攻击附双防原值30%，502当前三回合按红伤后当前HP四分之一，药剂不触发',()=>{
 for(const grade of [-2,0,2]){let s=make(24666,{extraMoves:[10614],aStats:{def:600,spd:400,spa:180},aStages:{def:grade,spd:grade},bHp:8500});s=turn(s,24666);assert.equal(s.fighters[1].hp,8500);assert.equal(s.fighters[0].effects['攻击双防粉伤'].start,2);assert.equal(s.fighters[0].effects['攻击双防粉伤'].end,4);assert.equal(s.fighters[0].effects['攻击削减当前体力'].end,3);s=turn(s,pp);assert.equal(damage(s,'percent'),0);const before=s.fighters[1].hp;s=turn(s,10614);assert.deepEqual(events(s,'percent').map(e=>e.settledDamage),[Math.floor((before-damage(s,'attack'))/4),300]);s=turn(s,10614);assert.deepEqual(events(s,'percent').map(e=>e.settledDamage),[300]);s=turn(s,10614);assert.equal(damage(s,'percent'),0);}
 let s=make(24666,{extraMoves:[10614],enemyId:3291});s=turn(s,24666);s=turn(s,10614);assert.equal(damage(s,'percent'),0);assert.ok(damage(s,'attack')>0);
});
test('3004龙威57当前四回合每次技能回复3000，药剂不触发禁疗不回，180独立清原生必暴回合',()=>{
 let s=make(24667,{extraMoves:[20369],enemyMoves:[20889,20355,10086],aHp:1000});s=turn(s,24667,20889);assert.equal(s.fighters[0].hp,4000);s=turn(s,pp,20355);assert.equal(s.fighters[0].hp,4000);assert.ok(s.fighters[1].effects['必定暴击']);s=turn(s,20369,20889);assert.equal(s.fighters[0].hp,7000);s=turn(s,20369,10086);const injured=s.fighters[0].hp;assert.equal(injured,9000-damage(s,'attack',1));assert.ok(injured<9000);s=turn(s,20369,20889);assert.equal(s.fighters[0].hp,injured);s=make(24667,{enemyMoves:[20355,20889],aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:5}}});s=turn(s,pp,20355);assert.ok(s.fighters[1].effects['必定暴击']);s=turn(s,24667,20889);assert.equal(s.fighters[1].effects['必定暴击'],undefined);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[0].stages.atk,1);
});
