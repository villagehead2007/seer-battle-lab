'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round29-original31-native.cjs');
test("3308原魂635完整10703真实原生多段按原范围最小最大各结算一次，逐段红伤与原魂额外伤害分清且PP只扣一次",()=>{H.endpoints(1);const x=H.run(1);assert.equal(H.bodies(x).length,x.row.range[0]);assert.equal(x.state.fighters[0].pp[x.key],x.paid-1);});
test("3308原魂635完整10703整招无效疲惫未出普通MISS与真实零PP分别无本体段数，保留完整原魂和初态拒绝",()=>{H.failures(1);const x=H.run(1,{flag:'miss',targetStages:{atk:2,def:1}});assert.equal(H.reds(x).length,0);assert.equal(x.state.fighters[1].stages.def,1);});
test("3308原魂635完整10703真实首段击败截停但完整伤害不截，攻击免疫零红仍按原多段命中且原魂独立结算",()=>{H.boundaries(1);const x=H.run(1,{targetHp:1});assert.equal(x.state.fighters[1].hp,0);assert.equal(H.reds(x)[0].hpLoss,1);assert.ok(H.reds(x)[0].settledDamage>1);});
test.after(()=>console.log('NATIVE_ORIGINAL31_TRACE '+JSON.stringify(H.report(3308))));
