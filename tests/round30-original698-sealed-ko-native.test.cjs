'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round30-original698-native.cjs');
test('3631原920完整32145命中效果已封但本体真实击败时，不得从队伍KO后置旁路授予698瘫痪',()=>{const x=H.run(3,{flag:'seal'});assert.equal(x.wasKO,true);assert.ok(H.reds(x).some(e=>e.settledDamage>e.hpLoss));assert.equal(x.state.fighters[0].soulState.teamLandedPayload??null,null);assert.equal(H.grants(x).length,0);});
test.after(()=>console.log('NATIVE_SEALED698_TRACE '+JSON.stringify(H.report(1))));
