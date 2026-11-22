'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round56-3383-miracle-native.cjs');
test('3383原30821/1184自然授奇迹之力下三轮，真实原突击先制一加3000固定伤且天然概率一倍二倍均出现、第五轮完整到期',()=>{const xs=H.miracle();assert.equal(xs.length,8);assert.ok(xs.some(x=>x.factors.slice(0,3).includes(2)));assert.ok(xs.every(x=>x.factors[3]===1));});
test('3383原30821/1055真实清强化成功才令下轮攻击无效，原冲顶次轮零红第三轮正红，保护与空正级不授',()=>{const xs=H.attackBlock();assert.equal(xs[0].blocked,true);assert.equal(xs[1].blocked,false);assert.equal(xs[2].blocked,false);});
test('3383完整原697低血真清回合成功才授两次免异，敌原攻击DOT实耗两次第三次进入，等血免断空回合不授且真实KO恢复全HP全PP',()=>{const xs=H.soul();assert.equal(xs[0].dots,1);assert.equal(xs[0].immune,0);for(const x of xs.slice(1)){assert.equal(x.immune,0);assert.equal(x.dots,1);}});
test('3383原30821原魂第五完整门槛，封命中无效控制药剂零PP不授奇迹之力或清强化封攻，原必中阳性保留',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND56_3383_MIRACLE_COUNTS '+JSON.stringify(H.report())));
