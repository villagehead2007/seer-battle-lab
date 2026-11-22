'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3211-native.cjs');
test('3211双魂低于半体攻击命中才吸取对手最大三分一，恰半不吸，零回复与免粉独立而理论回复不被截断',()=>{
 for(const soul of[538,549])for(const hp of[1000,4499,4500,4501]){const s=H.turn(H.make(10499,{soul,aHp:hp}),10499);assert.equal(H.damage(s,'percent'),hp<4500?3000:0);assert.equal(s.fighters[0].hp,hp+(hp<4500?3000:0));}
 for(const soul of[538,549])for(const mode of['heal-ban','percent-immune','both']){const s=H.turn(H.make(10499,{soul,aHp:1000,aEffects:mode!=='percent-immune'?{回复效果削减:{start:1,end:4,fraction:1}}:{},bEffects:mode!=='heal-ban'?{'固定百分比免疫':{start:1,end:4}}:{}}),10499);assert.equal(H.damage(s,'percent'),mode==='heal-ban'?3000:0);assert.equal(s.fighters[0].hp,mode==='percent-immune'?4000:1000);}
});
test('3211双魂真实MISS或属性技能不吸取，疲惫未用与零PP不产生攻击魂印载荷',()=>{
 for(const soul of[538,549]){let s=H.turn(H.make(10499,{soul,aHp:1000,aEffects:{攻击必失:{start:1,end:2}}}),10499);assert.equal(s.fighters[0].hp,1000);assert.equal(H.damage(s,'percent'),0);s=H.turn(H.make(20491,{soul,aHp:1000}),20491);assert.equal(s.fighters[0].hp,1000);s=H.turn(H.make(10499,{soul,aHp:1000,aAilments:{疲惫:2}}),10499);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[0].pp['wiki:10499'],H.source.moves.find(m=>m.id===10499).pp);s=H.make(10499,{soul,aHp:1000});s.fighters[0].pp['wiki:10499']=0;const before=structuredClone(s);assert.throws(()=>H.turn(s,10499),/PP/);assert.deepEqual(s,before);}
});
test('3211双魂满体受到真实红伤后存下次红伤减半或减65，首击不提前减，非满体不授予且只消费一次',()=>{
 for(const [soul,fraction]of[[538,.5],[549,.35]]){let s=H.make(10499,{soul,enemyMoves:[10086],bStats:{atk:4000}}),control=H.make(10499,{soul,aHp:8999,enemyMoves:[10086],bStats:{atk:4000}});for(let round=1;round<=3;round++){s=H.turn(s,'potion:pp',10086);control=H.turn(control,'potion:pp',10086);const a=H.damage(s,'attack',1),b=H.damage(control,'attack',1);assert.ok(b>0);assert.ok(Math.abs(a-b*(round===2?fraction:1))<=1,'round'+round+' '+a+'/'+b);if(round===1)assert.equal(s.fighters[0].soulState.nextDamageReductionFraction,1-fraction);else assert.equal(s.fighters[0].soulState.nextDamageReductionFraction??0,0);}}
});
