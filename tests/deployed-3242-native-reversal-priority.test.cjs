'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3242-native.cjs');
test('3242极度冲刺同521版本正常反弱，禁强依已答归零，弱化锁保留，既有正级不改',()=>{
 assert.equal(H.source.effects.find(e=>e.id===521).revision,'seerapi:dcd7a23e');for(const mode of ['normal','ban','lock','empty']){const s=H.turn(H.make(30156,{aStages:{atk:mode==='empty'?0:-2,def:mode==='empty'?0:-1,spa:2,acc:6},aEffects:mode==='ban'?{禁强化:{start:1,end:2}}:mode==='lock'?{弱化不可解除反转:{start:1,end:2}}:{}}),30156);assert.equal(s.fighters[0].stages.atk,mode==='normal'?2:mode==='lock'?-2:0);assert.equal(s.fighters[0].stages.def,mode==='normal'?1:mode==='lock'?-1:0);assert.equal(s.fighters[0].stages.spa,2);assert.ok(H.damage(s,'attack')>0);}
});
test('3242不败之境1014严格高半才全属性加二，在597吸取回血前判定，禁强化不影响独立吸取',()=>{
 for(const hp of [4499,4500,4501])for(const ban of [false,true]){const s=H.turn(H.make(25184,{aHp:hp,aEffects:ban?{禁强化:{start:1,end:1}}:{}}),25184);for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[0].stages[k],ban?0:hp>4500?2:1);assert.equal(s.fighters[1].hp,6000);assert.ok(s.fighters[0].hp>hp);}
});
test('3242不败之境597实际MISS整招无效继续吸取3000，PP药无吸取且原魂回复独立，两回先制第三回到期',()=>{
 for(const mode of ['miss','invalid','item']){let s=H.make(25184,{aHp:4500,extraMoves:[10710],aEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:mode==='invalid'?{skillBlock:{start:2,end:2}}:{}});s=H.turn(s,25184);const before=s.fighters[0].hp;s=H.turn(s,mode==='item'?'potion:pp':10710);assert.equal(H.damage(s,'attack'),0);assert.equal(s.fighters[1].hp,mode==='item'?6000:3000);assert.equal(s.fighters[0].hp,mode==='item'?before+Math.floor((9000-before)*.3):9000);}
 let s=H.turn(H.make(25184,{aHp:4500,extraMoves:[10711],enemyMoves:[10086],aStats:{spe:1},bStats:{spe:4000},aStages:{acc:6},bEffects:{固定百分比免疫:{start:1,end:8}}}),25184);for(let r=2;r<=4;r++){s=H.turn(s,10711,10086);assert.equal(s.turns.at(-1).first,r<=3?0:1);assert.equal(H.damage(s,'percent'),0);}
});
test('3242威斗天罡破对手任一负级先制加一，红伤倍率按负级总和10%，正级不计且无负不加',()=>{
 for(const [stages,levels]of [[{},0],[{atk:3,spa:2},0],[{atk:-3,spa:-2,def:2},5],[{atk:-6,def:-6,spa:-6,spd:-6,spe:-6,acc:-6},36]]){const s=H.turn(H.make(30157,{aStats:{spe:1},bStats:{spe:4000},aStages:{acc:6},bStages:stages,enemyMoves:[10086]}),30157,10086);assert.equal(s.turns.at(-1).first,levels?0:1);const event=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');assert.ok(event?.damage.settledDamage>0);assert.match(event.detail,new RegExp('增减伤 '+(1+levels*.1)+' ×'));}
});
