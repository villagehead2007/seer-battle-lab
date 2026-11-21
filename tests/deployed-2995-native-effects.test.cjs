'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/2995-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
const red=(s,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type==='attack'&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);
function checkSpecialPower(s,id,power){const m=s.moveDefinitions['wiki:'+id],base=Math.floor(Math.floor(42*power*3600/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart),actual=red(s);assert.ok(actual>=Math.floor(base*factor*.85)&&actual<=Math.floor(base*factor),JSON.stringify({id,power,actual,base,factor}));}
test('2995冰霜5原生降低防御一且负六封底、星皇免弱，落樱585六项加一正六封顶且禁强化阻挡',()=>{
 let s=turn(make(20079),20079);assert.equal(s.fighters[1].stages.def,-1);for(const k of keys.filter(k=>k!=='def'))assert.equal(s.fighters[1].stages[k],0);s=turn(make(20079,{bStages:{def:-6}}),20079);assert.equal(s.fighters[1].stages.def,-6);s=turn(make(20079,{enemyId:3291}),20079);assert.equal(s.fighters[1].stages.def,0);s=turn(make(24646),24646);for(const k of keys)assert.equal(s.fighters[0].stages[k],1);s=turn(make(24646,{aStages:Object.fromEntries(keys.map(k=>[k,5]))}),24646);for(const k of keys)assert.equal(s.fighters[0].stages[k],6);s=turn(make(24646,{aEffects:{禁强化:{start:1,end:2}}}),24646);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);
});
test('2995邪魔749百分之五十六项下降由自然种子覆盖成功失败，负六封底且星皇免弱',()=>{
 let yes=0,no=0;for(let seed=1;seed<=24;seed++){const s=turn(make(24645,{seed}),24645),n=s.fighters[1].stages.atk;assert.ok(n===0||n===-1);for(const k of keys)assert.equal(s.fighters[1].stages[k],n);if(n<0)yes++;else no++;}assert.ok(yes>0&&no>0);let s=turn(make(24645,{enemyId:3291}),24645);for(const k of keys)assert.equal(s.fighters[1].stages[k],0);for(let seed=1;seed<=4;seed++){s=turn(make(24645,{seed,bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),24645);for(const k of keys)assert.equal(s.fighters[1].stages[k],-6);}
});
test('2995三个不同原生14实例自然种子有冻伤与失败，冻伤回合末实际一千一百二十五真伤且免异目标不附加',()=>{
 for(const id of [10150,10204,10553]){let yes=0,no=0;for(let seed=1;seed<=40;seed++){const s=turn(make(id,{seed}),id);if(s.fighters[1].ailments['冻伤']>=1){yes++;const event=s.turns[0].events.find(e=>e.text.includes('冻伤：')&&e.damage);assert.ok(event);assert.equal(event.damage.type,'true');assert.equal(event.damage.settledDamage,1125);assert.ok(red(s)>0);}else no++;}assert.ok(yes>0&&no>0);const s=turn(make(id,{enemyId:3550}),id);assert.equal(s.fighters[1].ailments['冻伤'],undefined);}
});
test('2995冰花867实际消除原生必暴回合后只下回合先制负二，空目标不授且再下一回合归零',()=>{
 for(const setup of [true,false]){let s=make(19109,{extraMoves:[10006],enemyMoves:[20355,10086],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp,setup?20355:pp);s=turn(s,19109);assert.equal(s.fighters[1].effects['必定暴击'],undefined);assert.equal(s.fighters[1].effects.id984?.amount,setup?-2:undefined);s=turn(s,10006,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,setup?-2:0);assert.equal(s.turns.at(-1).first,setup?0:1);s=turn(s,10006,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,0);}
});
test('2995寒冰闪耀65当前两回合只加倍冰系威力，下回合异界之寒180再下一回合90而普通抓仍40',()=>{
 let s=make(21644,{extraMoves:[13224,10006]});s=turn(s,21644);for(const power of [180,90]){s=turn(s,13224);assert.match(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail,new RegExp('威力 '+power+' ·'));const m=s.moveDefinitions['wiki:13224'],base=Math.floor(Math.floor(42*power*3600/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart),actual=red(s);assert.ok(actual>=Math.floor(base*factor*.85)&&actual<=Math.floor(base*factor));}s=make(21644,{extraMoves:[10006]});s=turn(s,21644);s=turn(s,10006);assert.match(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail,/威力 40 ·/);
});
test('2995节日48与47当前四回合分别免原生毒粉及无力光线，第五回合实际中毒或攻击降二',()=>{
 for(const [enemyId,skill,status]of [[4693,20020,'中毒'],[2989,20241,null]]){let s=make(24644,{enemyId,enemyMoves:[skill]});s=turn(s,24644);for(const r of [2,3,4,5]){s=turn(s,pp,skill);if(status){if(r<5)assert.equal(s.fighters[0].ailments[status],undefined);else assert.ok(s.fighters[0].ailments[status]>=5);}else assert.equal(s.fighters[0].stages.atk,r<5?0:-2);}}
});
test('2995节日804真实提升被原生石破天惊消除才反降对方全属性一，没有提升不触发且窗口到期不再反降',()=>{
 for(const boosted of [true,false]){let s=make(24644,{seed:2,extraMoves:[24646],enemyId:2994,enemyMoves:[10715]});if(boosted)s=turn(s,24646);s=turn(s,24644);s=turn(s,pp,10715);for(const k of keys)assert.equal(s.fighters[1].stages[k],boosted?-1:0);if(!boosted)continue;s=turn(s,pp);s=turn(s,24646);s=turn(s,pp,10715);for(const k of keys)assert.equal(s.fighters[1].stages[k],-1);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);}
});
test('2995落樱57当前四回合真实用技能回三分之一、药剂不触发、回复封顶且到期与禁疗不回复',()=>{
 let s=make(24646,{extraMoves:[20079],aHp:1000,enemyMoves:[10086]});s=turn(s,24646);assert.equal(s.fighters[0].hp,4000);s=turn(s,20079);assert.equal(s.fighters[0].hp,7000);s=turn(s,pp);assert.equal(s.fighters[0].hp,7000);s=turn(s,20079);assert.equal(s.fighters[0].hp,9000);s=turn(s,20079,10086);assert.ok(red(s,1)>0);assert.equal(s.fighters[0].hp,9000-red(s,1));const blocked=turn(make(24646,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:5}}}),24646);assert.equal(blocked.fighters[0].hp,1000);assert.equal(blocked.fighters[0].stages.atk,1);
});
test('2995落樱703当前三回合对手实际属性用招扣最大体力三分之一百分比、药剂与免粉不扣且不降低体力上限',()=>{
 let s=make(24646,{enemyMoves:[20889]});s=turn(s,24646,20889);assert.equal(s.fighters[1].hp,6000);assert.equal(s.fighters[1].stats.maxHp,9000);assert.ok(s.damageEvents.some(e=>e.type==='percent'&&e.settledDamage===3000));s=turn(s,pp,pp);assert.equal(s.fighters[1].hp,6000);s=turn(s,pp,20889);assert.equal(s.fighters[1].hp,3000);s=turn(s,pp,20889);assert.equal(s.fighters[1].hp,3000);s=turn(make(24646,{enemyId:3291,enemyMoves:[20530]}),24646,20530);assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].stages.acc,1);
});
test('2995糖果733反转自身负级且成功冰封，真实帝君免异仍反转但不冰封，炫彩609只对事先冰封目标威力三百',()=>{
 let s=make(19112,{extraMoves:[19113],aStages:{atk:-2,def:1}});s=turn(s,19112);assert.equal(s.fighters[0].stages.atk,2);assert.equal(s.fighters[0].stages.def,1);assert.ok(s.fighters[1].ailments['冰封']>=1);s=turn(s,19113);checkSpecialPower(s,19113,300);assert.match(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail,/威力 300 ·/);const plain=turn(make(19113),19113);checkSpecialPower(plain,19113,150);assert.match(plain.turns[0].events.find(e=>e.damage?.type==='attack').detail,/威力 150 ·/);s=turn(make(19112,{enemyId:3550,aStages:{atk:-6}}),19112);assert.equal(s.fighters[0].stages.atk,6);assert.equal(s.fighters[1].ailments['冰封'],undefined);
});
test('2995花火456已命中零红伤仍执行严格二百八十阈值，真实黑洞279秒杀而280保留不破免攻',()=>{
 for(const hp of [279,280]){const s=turn(make(19110,{enemyId:4717,bHp:hp}),19110);assert.equal(red(s),0);assert.equal(s.fighters[1].hp,hp<280?0:280);if(hp===280)assert.equal(s.fighters[1].soulState.void1919.broken,false);}
});
test('2995冰天30实际后手260先手130进公式，漫雪629消强成功只下一回合先制一空目标无奖励',()=>{
 for(const first of [true,false]){const s=turn(make(19111,{enemyMoves:[10086],bStats:{spe:first?100:9999}}),19111,10086);assert.equal(s.turns[0].first,first?0:1);checkSpecialPower(s,19111,first?130:260);assert.match(s.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail,first?/威力 130 ·/:/威力 260 ·/);}for(const boosted of [true,false]){let s=make(19114,{extraMoves:[10006],enemyMoves:[20889,10086],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp,boosted?20889:pp);s=turn(s,19114);assert.equal(s.fighters[1].stages.spe,0);s=turn(s,10006,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,boosted?1:0);assert.equal(s.turns.at(-1).first,boosted?0:1);s=turn(s,10006,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);}
});
test('2995全部十八个原生附加实例的技能已有疲惫时不执行，不耗PP不变HP和等级不授回合效果',()=>{
 for(const m of source.moves.filter(m=>m.effectInstances.length)){const s=make(m.id,{aHp:1000});s.fighters[0].ailments['疲惫']=2;const o=turn(s,m.id);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].pp['wiki:'+m.id],m.pp);for(const f of o.fighters){for(const n of Object.values(f.stages))assert.equal(n,0);assert.deepEqual(f.effects,{});}assert.deepEqual(o.fighters[1].ailments,{});}
});
test('2995节日804也处理真实圣裂冲吸取强化，有保护时吸取后的六项由一降零，无保护时各保留一',()=>{
 for(const protectedBoost of [true,false]){let s=make(24644,{seed:2,extraMoves:[24646],enemyId:3223,enemyMoves:[30066]});s=turn(s,24646);s=turn(s,protectedBoost?24644:pp);s=turn(s,pp,30066);for(const k of keys){assert.equal(s.fighters[0].stages[k],0);assert.equal(s.fighters[1].stages[k],protectedBoost?0:1);}assert.ok(s.turns.at(-1).events.some(e=>e.text.includes('吸取')&&e.text.includes('强化')));}
});
