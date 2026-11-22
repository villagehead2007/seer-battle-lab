'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round58-3383-explosion-native.cjs');
test('3383原30819完整697原槽真实自爆死亡敌一血且敌原攻击不耗PP，指定第三槽真补位授三次奇迹，MISS药剂不耗而三次真命中附伤先制后耗尽',()=>{const x=H.sequence();assert.equal(x.selected,2);assert.equal(x.enemyPPUnchanged,true);assert.equal(x.unselectedUnchanged,true);assert.deepEqual(x.uses.map(x=>x.left),[2,1,0,0]);assert.deepEqual(x.uses.map(x=>x.fixed),[3000,3000,3000,0]);});
test('3383原30819父技能完整单挑原魂原序自爆自身零敌一血，原PP实耗不凭原697击败回复重生',()=>{const x=H.single();assert.equal(x.selfHP,0);assert.equal(x.enemyHP,1);});
test('3383原30819队伍原魂五槽失败门槛，封命中无效控制药剂零PP不自爆不授后继奇迹、原必中面对必失真自爆真授',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND58_3383_EXPLOSION_COUNTS '+JSON.stringify(H.report())));
