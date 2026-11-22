'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round64-3407-clear-paralyze-native.cjs');
test('3407两完整原魂原30950清强化成功授两轮攻免，敌原冲顶真用招耗PP两轮零红第三轮正红，强化保护或空强化不授',()=>{for(const x of H.shield())assert.equal(x.immune,x.mode==='clear');});
test('3407两原魂原30950原1210高体四成低体八成，真实红伤后严格等体仍四成，原随机与当场麻痹状态在魂印阶段末附异常前分别核',()=>{const xs=H.probabilities();assert.equal(xs.length,48);for(const x of xs)assert.equal(x.paralyzed,x.draw<x.chance);});
test('3407两原魂原30950完整五槽原序失败门槛，封命中无效控制药剂零PP与原MISS不清强化不授攻免不执行原概率抽样',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.immune,false);}});
test.after(()=>console.log('ROUND64_3407_CLEAR_PARALYZE_COUNTS '+JSON.stringify(H.report())));
