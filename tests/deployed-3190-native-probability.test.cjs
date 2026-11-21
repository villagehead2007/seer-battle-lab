'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3190-native.cjs'),pp='potion:pp';
test('3190黑夜119按本体完整红伤奇偶独立三成疲惫或速度一，魂附固定不改变分支',()=>{
 const seen=new Set();for(let i=1;i<=64&&seen.size<4;i++){const s=H.turn(H.make(12111,{seed:'3190-119-'+i,aStages:{acc:6}}),12111),d=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').damage.settledDamage,odd=d%2!==0,fatigue=s.turns.at(-1).events.some(e=>e.text.includes('陷入疲惫')),speed=s.fighters[0].stages.spe;assert.ok(odd?speed===0:!fatigue);assert.ok(speed===0||speed===1);seen.add((odd?'odd':'even')+':'+(odd?fatigue:!!speed));}assert.equal(seen.size,4);
});
test('3190真实梦魇40和联盟35害怕均有成败，联盟持续两轮；迷世最低280红伤与无视上限并存',()=>{
 for(const id of[15856,30124]){const seen=new Set();for(let i=1;i<=32&&seen.size<2;i++){const s=H.turn(H.make(id,{seed:'3190-fear-'+i,aStages:{acc:6}}),id),end=s.fighters[1].ailments['害怕'];seen.add(!!end);if(id===30124&&end)assert.equal(end,2);}assert.equal(seen.size,2);const s=H.turn(H.make(id,{bEffects:{免异常:{start:1,end:3}},aStages:{acc:6}}),id);assert.equal(s.fighters[1].ailments['害怕'],undefined);}
 const s=H.turn(H.make(17732,{aStats:{atk:180},bStats:{def:9999},bEffects:{伤害上限:{start:1,end:3,amount:100}},aStages:{acc:6}}),17732);assert.equal(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').damage.settledDamage,280);
});
test('3190黑夜魅影426两轮四成与幻影三轮七成各自原期限，原魂闪避不随定时效果到期消失',()=>{
 for(const[id,chance,last]of[[23225,40,2],[24247,70,3]]){let s=H.make(id);for(let r=1;r<=last+1;r++){s=H.turn(s,r===1?id:pp);if(r<last){assert.equal(s.fighters[0].effects['概率闪避'].chance,chance);assert.equal(s.fighters[0].effects['概率闪避'].end,last);}else assert.equal(s.fighters[0].effects['概率闪避'],undefined);assert.equal(H.E.SOULS.trait(s.fighters[0],'dodgeChance'),.7);}}
});
