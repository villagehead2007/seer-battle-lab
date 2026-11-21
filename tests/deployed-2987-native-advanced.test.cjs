'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/2987-native.cjs'),pp='potion:pp';
const damage=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);
test('2987银雾867与868分别实际消回合及消强成功授下一回合先制负二，空目标不授且一回合到期',()=>{
 for(const soul of [372,574])for(const setup of [20355,20889,null]){let s=make(19100,{soul,extraMoves:[10004],enemyMoves:[20355,20889,10086],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp,setup??pp);s=turn(s,19100);assert.equal(s.fighters[1].effects.id984?.amount,setup?-2:undefined);if(setup===20355)assert.equal(s.fighters[1].effects['必定暴击'],undefined);if(setup===20889)assert.equal(s.fighters[1].stages.spe,0);s=turn(s,10004,10086);assert.equal(s.turns.at(-1).first,setup?0:1);assert.equal(s.fighters[1].soulState.resolvedPriority.value,setup?-2:0);s=turn(s,10004,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,0);}
});
test('2987银雾866非暴击加一层，原生黎羽必暴后的银雾加二层',()=>{
 for(const soul of [372,574]){let s=turn(make(19100,{soul}),19100);assert.equal(s.fighters[0].soulState.energy,1);s=make(24640,{soul,extraMoves:[19100]});s=turn(s,24640);assert.equal(s.fighters[0].soulState.energy,2);s=turn(s,19100);assert.equal(s.fighters[0].soulState.energy,4);assert.match(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail,/暴击 2/);}
});
test('2987蓄力一击30后手双倍威力180先入公式，实际先手保留90且不按最终红伤翻倍',()=>{
 for(const soul of [372,574])for(const first of [true,false]){const s=make(11492,{soul,enemyMoves:[10086],bStats:{spe:first?100:9999}}),o=turn(s,11492,10086),move=s.moveDefinitions['wiki:11492'],power=first?90:180,base=Math.floor(Math.floor(42*power*3600/4000)/50)+2,factor=E.sameTypeBonus(move.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(move.type,s.fighters[1].type,s.typeChart);assert.equal(o.turns[0].first,first?0:1);const n=damage(o,'attack');assert.ok(n>=Math.floor(base*factor*.85)&&n<=Math.floor(base*factor));assert.equal(move.power,90);}
});
test('2987挚金749六项弱化各一负六封底且星皇免弱，756百分之七十失明自然种子覆盖成功失败',()=>{
 for(const soul of [372,574]){let yes=0,no=0;for(let seed=1;seed<=16;seed++){const s=turn(make(24638,{soul,seed}),24638);for(const n of Object.values(s.fighters[1].stages))assert.equal(n,-1);if(s.fighters[1].ailments['失明']>=1)yes++;else no++;}assert.ok(yes>0&&no>0);let s=turn(make(24638,{soul,enemyId:3291}),24638);for(const n of Object.values(s.fighters[1].stages))assert.equal(n,0);s=turn(make(24638,{soul,bStats:{},bStages:Object.fromEntries(['atk','def','spa','spd','spe','acc'].map(k=>[k,-6]))}),24638);for(const n of Object.values(s.fighters[1].stages))assert.equal(n,-6);}
});
test('2987挚金861当前四回合真实属性用招全PP扣二，自身技能用量另扣一，药剂不触发而第五回合到期',()=>{
 for(const soul of [372,574]){let s=make(24638,{soul,enemyMoves:[20889]});const initial={...s.fighters[1].pp};s=turn(s,24638,20889);for(const k of s.fighters[1].moves)assert.equal(s.fighters[1].pp[k],Math.max(0,initial[k]-2-(k==='wiki:20889'?1:0)));s=turn(s,pp,pp);for(const k of s.fighters[1].moves)assert.equal(s.fighters[1].pp[k],initial[k]);s=turn(s,pp,20889);for(const k of s.fighters[1].moves)assert.equal(s.fighters[1].pp[k],Math.max(0,initial[k]-2-(k==='wiki:20889'?1:0)));s=turn(s,pp,pp);s=turn(s,pp,20889);for(const k of s.fighters[1].moves)assert.equal(s.fighters[1].pp[k],initial[k]-(k==='wiki:20889'?1:0));assert.equal(s.fighters[0].effects['属性招扣PP'],undefined);}
});
test('2987纯光128当前回合真实攻击转回复且下一回合恢复受伤，456体力259秒杀而260不触发',()=>{
 for(const soul of [372,574]){let s=make(24639,{soul,aHp:1000,enemyMoves:[10086],aStats:{def:300},bStats:{atk:1200}});s=turn(s,24639,10086);assert.ok(s.fighters[0].hp>1000);assert.equal(damage(s,'attack',1),0);const hp=s.fighters[0].hp;s=turn(s,pp,10086);assert.ok(s.fighters[0].hp<hp);assert.ok(damage(s,'attack',1)>0);for(const hp of [259,260]){const t=turn(make(24639,{soul,bHp:hp}),24639);assert.equal(t.fighters[1].hp,hp===259?0:260);}}
});
test('2987黎羽860真实反复加二封普通五强化六，58必暴仅下两回合且第四回合恢复普通暴击倍率',()=>{
 for(const soul of [372,574]){let s=make(24640,{soul});for(let n=1;n<=4;n++){s=turn(s,24640);assert.equal(s.fighters[0].soulState.energy,Math.min(n*2,soul===372?5:6));}s=make(24640,{soul,extraMoves:[10004]});s=turn(s,24640);for(const r of [2,3,4]){s=turn(s,10004);assert.match(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail,r<4?/暴击 2/:/暴击 1/);}}
});
test('2987第五862自然取得四层后威力370且耗尽，普通五层威力420耗尽、强化六层威力470保留',()=>{
 for(const [soul,uses,power,remaining]of [[372,2,370,0],[574,2,370,0],[372,3,420,0],[574,3,470,6]]){let s=make(24640,{soul,extraMoves:[19103]});for(let n=0;n<uses;n++)s=turn(s,24640);s=turn(s,19103);assert.match(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail,new RegExp('威力 '+power+' ·'));assert.equal(s.fighters[0].soulState.energy,remaining);assert.ok(s.fighters[1].hp>0);}
});
test('2987第五697突破真实低体战龙250伤害限制而空旋斩仍封250，黑洞攻击免疫不被697穿透',()=>{
 for(const soul of [372,574]){for(const id of [19103,10356]){const s=turn(make(id,{soul,enemyId:3046,bHp:4000,aStats:{atk:9999},bStats:{def:901}}),id);assert.equal(E.SOULS.trait(s.fighters[1],'damageCap'),250);assert.ok(id===19103?damage(s,'attack')>250:damage(s,'attack')===250);}const t=turn(make(19103,{soul,enemyId:4717}),19103);assert.equal(damage(t,'attack'),0);assert.equal(t.fighters[1].soulState.void1919.broken,false);}
});
test('2987第五863真实后手封下回合攻击且之后恢复，实际先手时不封对手攻击',()=>{
 for(const soul of [372,574])for(const first of [false,true]){let s=make(19103,{soul,enemyMoves:[10086],bStats:{spe:first?100:9999}});s=turn(s,19103,10086);assert.equal(s.turns[0].first,first?0:1);assert.equal(Boolean(s.fighters[1].effects.attackBlock),!first);s=turn(s,pp,10086);assert.equal(damage(s,'attack',1)>0,first);s=turn(s,pp,10086);assert.ok(damage(s,'attack',1)>0);}
});
test('2987无上864未KO下回合按完整红伤一半反弹百分比且到期，865只有真实KO才加二能量',()=>{
 for(const soul of [372,574]){let s=make(19102,{soul,enemyMoves:[10086],aStats:{def:300},bStats:{atk:1200}});s=turn(s,19102);assert.equal(s.fighters[0].soulState.energy,0);s=turn(s,pp,10086);assert.equal(damage(s,'percent'),Math.floor(damage(s,'attack',1)/2));assert.ok(damage(s,'percent')>0);assert.equal(damage(s,'fixed'),0);s=turn(s,pp,10086);assert.equal(damage(s,'percent'),0);s=turn(make(19102,{soul,bHp:1}),19102);assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].soulState.energy,2);assert.equal(s.fighters[0].effects['受击反弹'],undefined);}
});
test('2987无上807按目标上次真实红伤追加固定且无历史为零，699穿透真实黑洞免攻但普通拍打不穿透',()=>{
 for(const soul of [372,574]){let s=make(19102,{soul,enemyMoves:[10086]});s=turn(s,pp,10086);const previous=damage(s,'attack',1);assert.ok(previous>0);s=turn(s,19102);assert.equal(damage(s,'fixed'),previous);s=turn(make(19102,{soul}),19102);assert.equal(damage(s,'fixed'),0);for(const id of [19102,10004]){s=turn(make(id,{soul,enemyId:4717}),id);assert.equal(damage(s,'attack')>0,id===19102);assert.equal(s.fighters[1].soulState.void1919.broken,id===19102);}}
});
test('2987高级技能原生控制失败：全部实际未用招不执行清除、封锁、秒杀、叠能与自回复',()=>{
 for(const soul of [372,574])for(const id of [19100,24638,24639,24640,19103,19102]){const s=make(id,{soul,aHp:1000});s.fighters[0].ailments['疲惫']=2;const o=turn(s,id);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].soulState.energy,0);assert.deepEqual(o.fighters[1].effects,{});assert.deepEqual(o.fighters[1].ailments,{});assert.equal(o.fighters[0].pp['wiki:'+id],s.fighters[0].pp['wiki:'+id]);}
});
