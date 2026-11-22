'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round79-3407-natural-average-native.cjs');
test('原3407强化第五2487用原拳击自然积九劫2并真受原冲顶低体麻痹免疫自然百炼1，第五使用雷解再获九劫后真实3比1平均2比2，原必中阳性',()=>{assert.equal(H.average().length,2);});
test('原3407强化第五2487自然真实资源下封命中整招无效不平均，药剂不平均或获九劫，零PP保留原自然层数且状态不改',()=>{assert.equal(H.failures().length,4);});
test('原3407强化第五2487完整原魂低体零层未击败保持零比零，无资源预填',()=>{assert.equal(H.zero(),true);});
test('原3407强化第五2487自然九劫3百炼0平均2比1、自然九劫0百炼3平均1比2，奇数保总层并最少移动',()=>{assert.equal(H.odd().length,2);});
test.after(()=>console.log('ROUND79_3407_NATURAL_AVERAGE_COUNTS '+JSON.stringify(H.report())));
