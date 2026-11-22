'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs');
test('3221恐惧利爪与战将回闪原30害怕自然命中成败，真实免异常独立阻止控制',()=>{
 for(const move of[14103,16599]){let yes=false,no=false;for(let seed=1;seed<=64&&!(yes&&no);seed++){const s=H.turn(H.make(move,{seed,aStages:{acc:6}}),move);assert.ok(H.damage(s,'attack')>0);if(s.fighters[1].ailments.害怕)yes=true;else no=true;}assert.ok(yes&&no,move+'自然概率两支');const immune=H.turn(H.make(move,{aStages:{acc:6},bEffects:{免异常:{start:1,end:5}}}),move);assert.equal(immune.fighters[1].ailments.害怕,undefined);}
});
test('3221回旋利爪原31自然抽到三四五段且各段红伤真实结算，原魂仍只结算一次吸取',()=>{
 const seen=new Set;for(let seed=1;seed<=64&&seen.size<3;seed++){const s=H.turn(H.make(14395,{seed,aHp:1000,aStages:{acc:6}}),14395),events=s.damageEvents.filter(e=>e.round===1&&e.type==='attack'&&e.sourceSide===0);assert.ok(events.every(e=>e.settledDamage>0));assert.ok(events.length>=3&&events.length<=5);seen.add(events.length);assert.equal(H.damage(s,'fixed'),90);assert.equal(s.fighters[0].hp,1090);}assert.deepEqual([...seen].sort(),[3,4,5]);
});
test('3221九九归心斩原88自然九倍与未触发两支，49吸血均按同次完整红伤计算，另加原魂90',()=>{
 const seen=new Set;for(let seed=1;seed<=128&&seen.size<2;seed++){let ratio;const old=H.E.WIKI.effectsEngine;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c.modifier,result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)ratio=c.modifier/before;return result;}};let s;try{s=H.turn(H.make(19589,{seed,aHp:1000,aStages:{acc:6}}),19589);}finally{H.E.WIKI.effectsEngine=old;}seen.add(ratio);assert.equal(s.fighters[0].hp,1000+Math.floor(H.damage(s,'attack')*.49)+90);assert.equal(H.damage(s,'fixed'),90);}assert.deepEqual([...seen].sort((a,b)=>a-b),[1,9]);
});
test('3221战将霸天斩原36命中后3秒杀自然成功失败，完整181仍保留而不以移除效果强造概率',()=>{
 let yes=false,no=false;for(let seed=1;seed<=256&&!(yes&&no);seed++){const s=H.turn(H.make(16602,{seed,aStages:{acc:6}}),16602);assert.ok(H.damage(s,'attack')>0);if(s.fighters[1].hp===0)yes=true;else no=true;}assert.ok(yes&&no,'原3%自然出现秒杀与未秒杀');
});
