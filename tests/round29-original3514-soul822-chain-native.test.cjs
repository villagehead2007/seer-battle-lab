'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round29-original31-native.cjs');
test('3514原822完整11904连续四次真实多段攻击，忽防应按每次使用25/35/45/45而非按段增长或第二次仍25',()=>{let x=H.run(2);for(const[use,expected]of[.25,.35,.45,.45].entries()){if(use)x=H.follow(x);const frames=H.bodies(x);assert.ok(frames.length>=4&&frames.length<=6);assert.ok(frames.every(f=>f.ignore===expected),'use '+(use+1)+' expected '+expected+' actual '+JSON.stringify(frames.map(f=>f.ignore)));assert.equal(x.state.fighters[0].soulState.hunterAttackChain,use+1);}});
test.after(()=>console.log('NATIVE_SOUL822_CHAIN_TRACE '+JSON.stringify(H.report(3514))));
