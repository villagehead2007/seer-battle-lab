// 2026-11-16 untyped small immunity is red only; 874 uses the whole skill. Historical proof lookup titles are retained.
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3001-native.cjs'),pp='potion:pp';
const damage=(s,type,side=1)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.sourceSide===side&&e.type===type).reduce((n,e)=>n+e.settledDamage,0);
test('3001宇宙874真实碎星百分比249免疫而250放行，面板等级不改变基数，当前四回合到期',()=>{
 for(const def of [623,625]){let s=make(24661,{extraMoves:[20155],enemyId:3056,enemyMoves:[15969],aStats:{def,spe:100},bStats:{spe:9999}});s=turn(s,24661);assert.equal(s.fighters[0].effects['小额伤害免疫'].end,4);s=turn(s,20155,15969);assert.equal(damage(s,'percent'),Math.floor(def*.4));assert.equal(damage(s,'attack'),0);s=turn(s,pp);s=turn(s,pp);s=turn(s,20155,15969);assert.equal(damage(s,'percent'),Math.floor(def*.4));assert.ok(damage(s,'attack')>0);}
});
test('3001宇宙874不挡已确认周期真实伤害，两百中毒仍结算且不由小于250变免疫',()=>{
 let s=make(24661,{enemyId:4693,enemyMoves:[20020],aStats:{maxHp:1600,spe:100},bStats:{spe:9999}});s=turn(s,24661,20020);assert.ok(s.fighters[0].ailments['中毒']>=1);assert.equal(damage(s,'true'),200);assert.ok(s.fighters[0].effects['小额伤害免疫']);
});
test('3001三项57按真实技能使用回复三分之一，PP药不回复，当前三或五回合到期与禁疗',()=>{
 for(const [id,n]of [[22561,3],[23109,5],[24661,5]]){let s=make(id,{extraMoves:[20155],enemyMoves:[20889],aHp:1000});s=turn(s,id,20889);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].hp,4000);s=turn(s,pp,20889);assert.equal(s.fighters[0].hp,4000);s=turn(s,20155,20889);assert.equal(s.fighters[0].hp,7000);for(let r=4;r<=n;r++)s=turn(s,pp,20889);s=turn(s,20155,20889);assert.equal(s.fighters[0].hp,7000);s=make(id,{enemyMoves:[20889],aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:6}}});s=turn(s,id,20889);assert.equal(s.fighters[0].hp,1000);}
});
test('3001上古战甲462当前两回合受击反弹一百固定，第三回合停止且真实星皇免粉',()=>{
 for(const enemyId of [2989,3291]){const attack=enemyId===3291?10499:10086;let s=make(22560,{enemyId,enemyMoves:[attack]});s=turn(s,22560,attack);assert.equal(damage(s,'fixed',0),enemyId===3291?0:100);s=turn(s,pp,attack);assert.equal(damage(s,'fixed',0),enemyId===3291?0:100);s=turn(s,pp,attack);assert.equal(damage(s,'fixed',0),0);}
});
test('3001诸神471只有真实先手授予当前两回合免异，后手不授，上古48当前五回合免异到期',()=>{
 for(const first of [true,false]){let s=make(22564,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6},aStats:{spe:first?1000:100},bStats:{spe:first?100:9999}});s=turn(s,22564,22053);assert.equal(!!s.fighters[0].effects['免异常'],first);if(first){s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']>=3);}}
 let s=make(23109,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}});s=turn(s,23109);assert.equal(s.fighters[0].effects['免异常'].end,5);for(let r=2;r<=5;r++){s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);}s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']>=6);
});
test('3001正义191当前四回合免疫反弹真实催眠，第四回合仍反弹而第五回合结束',()=>{
 let s=make(19143,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6},aStats:{spa:180}});s=turn(s,19143);assert.equal(s.fighters[0].effects.reflect?.end,4);for(let r=2;r<=3;r++)s=turn(s,pp);s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);assert.ok(s.fighters[1].ailments['睡眠']>=4);s=turn(s,pp);s=turn(s,pp);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']>=7);
});
test('3001神圣47当前五回合免弱第六回合冰霜真实降防，695自然种子兼有属性成功和无效',()=>{
 let s=make(24662,{enemyId:2995,enemyMoves:[20079],aHp:4000});s=turn(s,24662);assert.equal(s.fighters[0].effects['免弱'].end,5);for(let r=2;r<=5;r++){s=turn(s,pp,20079);assert.equal(s.fighters[0].stages.def,0);}s=turn(s,pp,20079);assert.equal(s.fighters[0].stages.def,-1);
 let yes=0,no=0;for(let seed=1;seed<=24;seed++){s=make(24662,{seed,enemyMoves:[20889],aHp:4000});s=turn(s,24662,20889);assert.equal(s.fighters[0].effects['对手属性失效'].end,4);if(s.fighters[1].stages.spe===1)yes++;else{assert.equal(s.fighters[1].stages.spe,0);no++;}}assert.ok(yes>0&&no>0);
});
test('3001神圣716当前四回合真实攻击后清一个PP，属性或药剂不清，第五回合不再清且不混魂印',()=>{
 let s=make(24662,{enemyMoves:[10086,20889],aHp:4000});s=turn(s,24662,10086);assert.equal(s.fighters[0].effects['对手攻击后清PP'].end,4);assert.equal(Object.values(s.fighters[1].pp).filter(n=>n===0).length,1);s=turn(s,pp,pp);assert.ok(Object.values(s.fighters[1].pp).every(n=>n>0));s=turn(s,pp,20889);assert.ok(Object.values(s.fighters[1].pp).every(n=>n>0));s=turn(s,pp,pp);s=turn(s,pp,10086);assert.ok(Object.values(s.fighters[1].pp).every(n=>n>0));
});
test('3001雷霆39每个真实PP槽减二并令所选槽恰好归零无法行动，三点剩一点仍正常攻击',()=>{
 for(const initial of [2,3]){let s=make(14731,{enemyMoves:[10086],aHp:4000});s.fighters[1].pp['wiki:10086']=initial;const before={...s.fighters[1].pp};s=turn(s,14731,10086);for(const [key,n]of Object.entries(before))assert.equal(s.fighters[1].pp[key],key==='wiki:10086'?0:Math.max(0,n-2));if(initial===2)assert.equal(damage(s,'attack'),0);if(initial===3)assert.ok(damage(s,'attack')>0);if(initial===2)assert.equal(s.fighters[0].hp,4000);}
});
test('3001三个真实害怕概率实例自然成功失败且半体517封顶，真正免异目标无害怕',()=>{
 for(const id of [14103,22563,19143]){let yes=0,no=0;for(let seed=1;seed<=24;seed++){let s=turn(make(id,{seed,aStats:{atk:180,spa:180}}),id);if(s.fighters[1].ailments['害怕']>=1)yes++;else no++;}assert.ok(yes>0&&no>0,id);let s=turn(make(id,{enemyId:3550,aStats:{atk:180,spa:180}}),id);assert.equal(s.fighters[1].ailments['害怕'],undefined);if(id!==14103)for(let seed=1;seed<=8;seed++){s=turn(make(id,{seed,aHp:4500,aStats:{atk:180,spa:180}}),id);assert.ok(s.fighters[1].ailments['害怕']>=1);}}
});
