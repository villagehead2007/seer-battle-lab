'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3425-native.cjs');
test('3425原740与1030四真实版本下一回合红伤计算实际读取1.5与2倍率，低回复可续翌日但跳过后倍率恢复1',()=>{
 for(const source of H.versions){let x=H.turn(H.make(source));assert.ok(x.observed[0].restored<300);const expected=x.s.fighters[0].soulId===1030?2:1.5;x=H.turn(x.s);assert.ok(x.damageMultipliers.includes(expected),'真实引擎红伤链读取原版本倍率');assert.equal(x.observed[0].request,x.observed[0].red);assert.ok(x.observed[0].red>0);assert.ok(x.observed[0].restored<300);x=H.turn(x.s,false);assert.equal(x.observed.length,0);x=H.turn(x.s);assert.ok(x.damageMultipliers.length>0);assert.ok(x.damageMultipliers.every(n=>n===1),'第四回合没有过期增伤残留');assert.equal(x.observed[0].request,x.observed[0].red*.5);}
});
