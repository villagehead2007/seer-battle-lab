'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289天龙出水885用回复前当前体力严格比较翻强化，532先按实际回复再百分比，满体零附伤',()=>{
 for(const [hp,foe,stage,heal]of[[1000,9000,1,3000],[6000,5000,2,3000],[8999,9000,1,1],[9000,9000,1,0]]){const s=H.turn(H.make(25290,{aHp:hp,bHp:foe}),25290);for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[0].stages[k],stage);assert.equal(s.fighters[0].hp,hp+heal);assert.equal(H.damage(s,'percent'),heal);assert.equal(s.fighters[1].hp,foe-heal);}
 for(const mode of ['skill-ban','pink']){const s=H.turn(H.make(25290,{aHp:1000,aEffects:mode==='skill-ban'?{技能禁疗:{start:1,end:1}}:{},bEffects:mode==='pink'?{固定百分比免疫:{start:1,end:1}}:{}}),25290);assert.equal(s.fighters[0].hp,mode==='skill-ban'?1000:4000);assert.equal(H.damage(s,'percent'),0);}
});
test('3289天龙出水532持续实际MISS整招无效仍回复与等量百分比，药剂不触发，原四回末后到期',()=>{
 for(const mode of ['miss','invalid','item']){let s=H.make(25290,{aHp:1,extraMoves:[10004],aEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:mode==='invalid'?{skillBlock:{start:2,end:2}}:{}});s=H.turn(s,25290);assert.equal(s.fighters[0].hp,3001);s=H.turn(s,mode==='item'?'potion:pp':10004);assert.equal(s.fighters[0].hp,mode==='item'?3001:6001);assert.equal(H.damage(s,'percent'),mode==='item'?0:3000);assert.equal(H.damage(s,'attack'),0);}
 let s=H.make(25290,{aHp:1,extraMoves:[10004]});s=H.turn(s,25290);s=H.turn(s,'potion:pp');s=H.turn(s,'potion:pp');s=H.turn(s,10004);assert.equal(s.fighters[0].hp,6001);assert.equal(H.damage(s,'percent'),3000);s=H.turn(s,10004);assert.equal(s.fighters[0].hp,6001);assert.equal(H.damage(s,'percent'),0);
});
test('3289万波摧岳原防特防二阶特攻一阶，57当回四回实际用招回血与407下回三回特攻成长独立',()=>{
 let s=H.make(23555,{aHp:1,extraMoves:[10004],aEffects:{攻击必失:{start:2,end:2}}});for(let r=1;r<=5;r++){s=H.turn(s,r===1?23555:r===3?'potion:pp':10004);assert.equal(s.fighters[0].stages.spa,Math.min(r,4));assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.spd,2);assert.equal(s.fighters[0].hp,r===1?2251:r<=3?4501:6751);}assert.equal(H.damage(s,'percent'),0);
 const q=H.turn(H.make(23555,{aHp:1,aEffects:{禁强化:{start:1,end:4}}}),23555);assert.equal(q.fighters[0].stages.def,0);assert.equal(q.fighters[0].stages.spa,0);assert.equal(q.fighters[0].hp,2251);
});
