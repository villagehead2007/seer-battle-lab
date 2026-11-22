'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四原魂第五组合神兵天降与星界圣令真清回合才控制、真消强才烧冻混，免断空状态免疫六次分开，514按红伤后实际已损HP附四成',()=>{assert.equal(H.clears().length,32);});
test('原3425两原魂两原第五1164纯反转不受普通防消强保护，正级成功保留回合，空和负级回退清回合，明确幽蝶保护同时阻反转清强但回合可清、免断另阻清回合',()=>{assert.equal(H.reverseFallback().length,24);});
test.after(()=>console.log('ROUND81_3425_CLEARS_WINDOW_COUNTS '+JSON.stringify(H.report())));
