'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs'),D=require('../dist/battle-display.js');
test('3223两版真实魂印累积增伤和上限下场保留文案只读显示，错误hash不显示',()=>{
 for(const[soul,step,cap]of[[558,30,150],[566,35,175]]){let s=H.make(10127,{soul});function panel(){const before=structuredClone(s),row=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items.find(x=>x.name==='斗战 · 攻击增伤');assert.deepEqual(s,before);return row;}assert.match(panel().value,new RegExp('\\+0% / '+cap+'%.*增加'+step+'%.*下场保留'));for(let i=1;i<=6;i++){s=H.turn(s,'potion:pp');assert.match(panel().value,new RegExp('\\+'+Math.min(cap,i*step)+'% / '+cap+'%'));}s.fighters[0].soulHash='wrong-version';assert.equal(panel(),undefined);}
});
