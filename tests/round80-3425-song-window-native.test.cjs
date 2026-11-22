'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四配置荣耀战歌先手全二后手全一，532四轮实际用招回复并按实际回复附百分比，药剂禁疗封顶和第五轮到期独立',()=>{assert.equal(H.songWindow().length,16);});
test('原3425四配置荣耀战歌693下两轮真实重击约二倍，原魂与面板状态配对相同第三轮自然复原',()=>{assert.equal(H.songDamage().length,4);});
test.after(()=>console.log('ROUND82_3425_SONG_WINDOW_COUNTS '+JSON.stringify(H.report())));
