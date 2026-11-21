'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3200-native.cjs'),pp='potion:pp';
// Latest human global rules: own boost-ban clears weakened levels without rewards;
// absorption still clears enemy boosts but grants no own boosts/success rewards.
// Historical titles retained; superseded expectations and failures are archived under research/TEAM-STAGE-2/before-confirmed-oracle-migration-20261112-*.
test('3200复用原22招接入，两魂原hash与多阶段实例原参数绑定，零PP疲惫负分支不改原档',()=>{
 const before=structuredClone(H.source);assert.equal(H.source.moves.length,22);for(const m of H.source.moves){const c=H.E.WIKI.compile(m,H.source);assert.equal(c.issue,'');assert.deepEqual([...new Set(c.operations.map(o=>o.index))],m.effectInstances.map((_,i)=>i));for(const o of c.operations){assert.equal(o.effectId,m.effectInstances[o.index].id);assert.deepEqual(o.sourceArgs,m.effectInstances[o.index].args);}}
 for(const soul of[523,532])for(const id of[10006,25088,19965]){let s=H.make(id,{soul});s.fighters[0].pp['wiki:'+id]=0;assert.throws(()=>H.turn(s,id),/有 PP/);s=H.turn(H.make(id,{soul,aAilments:{疲惫:2}}),id);assert.equal(s.fighters[0].pp['wiki:'+id],H.source.moves.find(m=>m.id===id).pp);assert.equal(s.fighters[1].hp,9000);}assert.deepEqual(H.source,before);
});
test('3200九玄835反弱成功才满回并让魂印战阶走高体，无负级及禁强化不回；黎影907反弱与清两PP保护独立',()=>{
 for(const mode of['normal','empty','ban']){const s=H.turn(H.make(19961,{aHp:1000,aStages:mode==='empty'?{acc:6}:{atk:-2,acc:6},aEffects:mode==='ban'?{禁强化:{start:1,end:3}}:{}}),19961);assert.equal(s.fighters[0].hp,mode==='normal'?9000:1000);assert.equal(s.fighters[0].stages.atk,mode==='normal'?2:0);assert.equal(!!s.fighters[0].effects['免异常'],mode==='normal');}
 for(const mode of['normal','empty','ban','pp']){const s=H.turn(H.make(19964,{enemyMoves:[10086],bStats:{spe:9999},aStages:mode==='empty'?{acc:6}:{def:-1,acc:6},aEffects:mode==='ban'?{禁强化:{start:1,end:3}}:{},bEffects:mode==='pp'?{PP保护:{start:1,end:3}}:{}}),19964,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,mode==='empty'?0:3);assert.equal(s.fighters[0].stages.def,['ban','empty'].includes(mode)?0:1);assert.equal(Object.values(s.fighters[1].pp).filter(n=>n===0).length,mode==='normal'?2:0);}
});
test('3200邪风1039按实际回血时严格低半满回，946低于敌体才双强；四轮用招回血第五停且药剂禁疗各自处理',()=>{
 for(const hp of[1000,4499,4500,4501,9000]){const s=H.turn(H.make(25089,{aHp:hp}),25089);assert.equal(s.fighters[0].hp,hp<4500?9000:Math.min(9000,hp+3000));assert.ok(Object.values(s.fighters[0].stages).every(n=>n===(hp<9000?2:1)));}
 let s=H.make(25089,{aHp:1,aAilments:{中毒:6},extraMoves:[10006]});for(let r=1;r<=5;r++){s=H.turn(s,r===1?25089:10006);assert.equal(s.fighters[0].hp,r<=4?7875:6750);}s=H.turn(H.make(25089,{aHp:1000,aEffects:{无法通过自身技能恢复体力:{start:1,end:6}}}),25089);assert.equal(s.fighters[0].hp,1000);s=H.turn(s,pp);assert.equal(s.fighters[0].hp,1000);
});
test('3200第五1025真实吸强才回4500，防消吸和自身禁强化不吸不回，497原200固定与吸强成败独立',()=>{
 for(const mode of['normal','empty','protect','ban']){const s=H.turn(H.make(19965,{aHp:1000,bStages:mode==='empty'?{}:{def:2},aEffects:mode==='ban'?{禁强化:{start:1,end:3}}:{},bEffects:mode==='protect'?{强化保护:{start:1,end:3}}:{}}),19965);assert.equal(s.fighters[0].hp,mode==='normal'?5500:1000);assert.equal(s.fighters[0].stages.def,mode==='normal'?2:0);assert.equal(s.fighters[1].stages.def,mode==='protect'?2:0);assert.deepEqual(s.damageEvents.filter(e=>e.sourceSide===0&&e.type==='fixed').map(e=>e.settledDamage),[200]);}
});
test('3200幽影1041低红伤才给下一攻击无效，属性药剂不消费而真正攻击消费一次，942空清不吸',()=>{
 let s=H.turn(H.make(19962,{aStats:{spa:180},enemyMoves:[20889,10086]}),19962);assert.equal(s.fighters[1].counts.nextAttackInvalid,1);assert.equal(s.damageEvents.filter(e=>e.type==='percent'&&e.sourceSide===0).length,0);s=H.turn(s,pp,20889);assert.equal(s.fighters[1].counts.nextAttackInvalid,1);s=H.turn(s,pp);assert.equal(s.fighters[1].counts.nextAttackInvalid,1);s=H.turn(s,pp,10086);assert.equal(s.fighters[1].counts.nextAttackInvalid,0);assert.ok(!s.turns.at(-1).events.some(e=>e.damage?.sourceSide===1&&e.damage.type==='attack'));s=H.turn(s,pp,10086);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.sourceSide===1&&e.damage.type==='attack'));
});
test('3200风夜1042三轮自身真技能消强，药剂不消；真实敌属性触发703扣3000百分比而到期不再扣',()=>{
 let s=H.make(25088,{extraMoves:[10006],aStats:{spe:1},bStats:{spe:2000},bStages:{atk:1},enemyMoves:[20889]});s=H.turn(s,25088);assert.equal(s.fighters[1].stages.atk,0);s=H.turn(s,pp,20889);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));assert.equal(s.damageEvents.find(e=>e.round===2&&e.sourceSide===0&&e.type==='percent').settledDamage,3000);s=H.turn(s,10006);assert.ok(Object.values(s.fighters[1].stages).every(n=>n<=0));s=H.turn(s,10006,20889);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));assert.equal(s.damageEvents.filter(e=>e.round===4&&e.sourceSide===0&&e.type==='percent').length,0);
});
test('3200暗灭583真实整招清一槽与33消强独立，PP保护和免疫PP削减阻归零，防消吸只阻清强',()=>{
 const seen=new Set();for(const mode of['none','PP保护','免疫PP削减','强化保护'])for(let i=1;i<=8;i++){const s=H.turn(H.make(19957,{seed:'3200-583-'+i,enemyMoves:[10086],bStats:{spe:9999},aStages:{acc:6},bStages:{def:2},bEffects:mode==='none'?{}:{[mode]:{start:1,end:3}}}),19957,10086),zero=Object.keys(s.fighters[1].pp).filter(k=>s.fighters[1].pp[k]===0);assert.equal(zero.length,['PP保护','免疫PP削减'].includes(mode)?0:1);assert.equal(s.fighters[1].stages.def,mode==='强化保护'?2:0);if(zero.length)seen.add(zero[0]);}assert.ok(seen.size>1);
});
