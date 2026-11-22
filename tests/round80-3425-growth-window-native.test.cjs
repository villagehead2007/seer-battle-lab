'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四原魂第五组合守护圣击411按命中后当前HP连续8到12到16到20封顶，MISS整招无效不推进，换原重击后重置8',()=>{assert.equal(H.consecutive().length,4);});
test('原3425两原魂圣元破魔阵696按真实有效命中逐次提升暴击率并封顶100，原随机下一抽与实际暴击严格对应，真实PP药不增长',()=>{assert.equal(H.critGrowth().length,2);});
test('原3425两原魂圣元破魔阵696整招无效和真实PP药不推进命中成长，下一真实原第五只增长到第二次概率',()=>{assert.equal(H.critGrowthGates(),true);});
test.after(()=>console.log('ROUND81_3425_GROWTH_WINDOW_COUNTS '+JSON.stringify(H.report())));
