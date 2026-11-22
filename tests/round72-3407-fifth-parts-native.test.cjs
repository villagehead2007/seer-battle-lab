'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round72-3407-fifth-parts-native.cjs');
test('3407原722狂电烈火明与原2093王焚罡九虺完整原第五负二反正二负六反正六、清成功回满、禁强负级归零无收益及禁疗锁弱独立，强化第五负级先制三',()=>{for(const x of H.reversal()){if(x.mode==='minusSix')assert.equal(x.atk,6);if(x.mode==='healban')assert.equal(x.hp,5000);if(x.mode==='negative')assert.equal(x.hp,9000);}});
test('3407两合法原第五对原3033真微弱算普通，清回合成功才焚烬，免断空回合与原5000天生免异各不焚烬而清与红伤独立',()=>{for(const x of H.weakAndClear()){assert.ok(x.affinity<1);assert.ok(x.red>0);assert.equal(x.burning,x.mode==='clear');}});
test('3407两合法原第五原魂原槽全部指令保留，封命中无效控制药剂零PP不反转或清回合，原必中面对必失真反转真清焚烬',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND72_3407_FIFTH_PARTS_COUNTS '+JSON.stringify(H.report())));
