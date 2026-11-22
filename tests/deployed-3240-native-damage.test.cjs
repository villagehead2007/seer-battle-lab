'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
test('3240邪念侵体原29固定70独立于红伤，固定免疫阻附伤但不阻本体与魂印',()=>{
 for(const immune of[false,true]){const s=H.turn(H.make(15880,{aHp:1000,aStages:{acc:6},bEffects:immune?{固定百分比免疫:{start:1,end:4}}:{}}),15880);assert.ok(H.damage(s,'attack')>0);assert.equal(H.damage(s,'fixed'),immune?0:70);assert.equal(H.damage(s,'percent'),0);assert.ok(s.fighters[0].hp>1000);assert.equal(s.fighters[0].pp['wiki:15880'],H.source.moves.find(m=>m.id===15880).pp-1);}
});
test('3240残酷绞杀514按命中时对手已损HP的15百分比，包含本招实际红伤损失且粉免不吞红',()=>{
 for(const hp of[6000,9000])for(const immune of[false,true]){const s=H.turn(H.make(15881,{aStages:{acc:6},bHp:hp,bEffects:immune?{固定百分比免疫:{start:1,end:4}}:{}}),15881),red=s.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack');assert.ok(red.settledDamage>0);assert.equal(H.damage(s,'percent'),immune?0:Math.floor((9000-hp+red.hpLoss)*.15));assert.equal(H.damage(s,'fixed'),0);}
});
test('3240噬芒之黯原683随机固定200到400，纯观察保留真实随机返回和本招原红，粉免阻固定',()=>{
 const seenValues=new Set;for(let seed=1;seed<=8;seed++){const old=H.E.WIKI.effectsEngine,draws=[];H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const original=c.random;if(phase==='afterHit'&&c.a.side===0&&(c.m.wikiId??c.m.id)===30146)c.random=()=>{const value=original();draws.push(value);return value;};try{return old.run(phase,ops,c);}finally{c.random=original;}}};let s;try{s=H.turn(H.make(30146,{seed,aStages:{acc:6}}),30146);}finally{H.E.WIKI.effectsEngine=old;}assert.equal(draws.length,1);const n=200+Math.floor(draws[0]*201);assert.equal(H.damage(s,'fixed'),n);assert.ok(n>=200&&n<=400);assert.ok(H.damage(s,'attack')>0);seenValues.add(n);}assert.ok(seenValues.size>1);const immune=H.turn(H.make(30146,{aStages:{acc:6},bEffects:{固定百分比免疫:{start:1,end:4}}}),30146);assert.equal(H.damage(immune,'fixed'),0);assert.ok(H.damage(immune,'attack')>0);
});
