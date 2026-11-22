'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round42-original1868-native.cjs');
function positive(id){const xs=H.success(id);assert.equal(xs.find(x=>x.mode==='ok').selected,2);assert.ok(xs.find(x=>x.mode==='onceImmune').calls.length);for(const mode of ['noSwitch','xuan','death'])assert.equal(xs.find(x=>x.mode===mode).calls.length,0);return xs;}
function negative(id){const xs=H.failures(id);assert.equal(xs.find(x=>x.mode==='control').calls.length,0);assert.equal(xs.find(x=>x.mode==='potion').calls.length,0);return xs;}
test('4068原37990/1868实际指定第三槽冻伤及天然一次免异后冰封，未换视驱真实死补两段均不触发',()=>{const x=positive(4068);assert.ok(x[0].ailments.冻伤);assert.ok(x[1].ailments.冰封);});
test('4068原37990/1868封命中无效受控药剂零PP及MISS不触发，原魂与第五槽保留',()=>{const x=negative(4068);assert.equal(x[4].zeroRejected,true);});
test('4604原37114/1868实际第三槽凝滞及天然一次免异后冻伤，未换视驱真实死补两段均不触发',()=>{const x=positive(4604);assert.ok(x[0].ailments.凝滞);assert.ok(x[1].ailments.冻伤);});
test('4604原37114/1868原1809自然未来指令强制封命中整招无效并允许零PP，受控药剂仍不触发',()=>{const x=negative(4604);for(const i of[0,1,4]){assert.equal(x[i].forcedByOriginalSoul,true);assert.equal(x[i].calls[0].applied,true);}});
test('4661原37459/1868实际第三槽臣服及天然一次免异后束缚，未换视驱真实死补两段均不触发',()=>{const x=positive(4661);assert.ok(x[0].ailments.臣服);assert.ok(x[1].ailments.束缚);});
test('4661原37459/1868原1862零PP万相强执行与正PP封无效分开，受控药剂不借旧束缚回退',()=>{const x=negative(4661);assert.equal(x[4].forcedByOriginalSoul,true);assert.equal(x[4].calls[0].applied,true);});
test('4747原37870/1868真实种子覆盖70疲惫成功及失败后失明，免疫不补抽，未换视驱死补不触发',()=>{const x=positive(4747);assert.ok(x.some(y=>y.mode==='ok'&&y.ailments.疲惫));assert.ok(x.some(y=>y.mode==='ok'&&y.ailments.失明));});
test('4747原37870/1868封命中整招无效受控药剂零PP及MISS不触发，原魂附伤保留',()=>{const x=negative(4747);assert.equal(x[4].zeroRejected,true);});
test('4785原37985/1868实际第三槽睡眠及天然一次免异后疲惫，未换视驱真实死补不误用旧疲惫',()=>{const x=positive(4785);assert.ok(x[0].ailments.睡眠);assert.ok(x[1].ailments.疲惫);});
test('4785原37985/1868封命中整招无效受控药剂零PP与原必中分别核验，场下汲取不替代本词条',()=>{const x=negative(4785);assert.equal(x[4].zeroRejected,true);assert.equal(x.at(-1).calls[0].applied,true);});
test.after(()=>console.log('ROUND42_ORIGINAL1868_COUNTS '+JSON.stringify(H.report())));
