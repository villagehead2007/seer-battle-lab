'use strict';const test=require('node:test'),{assert,make,turn,pp}=require('./helpers/round142-confirmed-souls-native.cjs');
test('778回末实际回复0或50分别请求0或50固伤，禁疗减疗和满体特攻速度加一分开',()=>{
 for(const [hp,mode,expected]of [[9000,'normal',0],[8950,'normal',50],[1000,'normal',150],[1000,'skill-ban',150],[1000,'all-ban',0],[1000,'half',75]]){const o={hp};if(mode==='skill-ban')o.aEffects={'无法通过自身技能恢复体力':{start:1,end:9}};if(mode==='all-ban')o.aEffects={'四杀鬼囹':{start:1,end:9}};if(mode==='half')o.aEffects={'回复效果削减':{start:1,end:9,fraction:.5}};const x=turn(make(3465,o)),actual=x.heals.filter(h=>h.label==='圣瞳缪斯魂印回复').reduce((n,h)=>n+h.actual,0),fixed=x.hurts.filter(h=>h.label==='圣瞳缪斯魂印等量追加').reduce((n,h)=>n+h.requested,0);assert.equal(actual,expected,mode);assert.equal(fixed,expected,mode);assert.equal(x.out.fighters[0].stages.spa,hp+actual===9000?1:0);assert.equal(x.out.fighters[0].stages.spe,hp+actual===9000?1:0);}
});
test('778真实1985种蛊后回复150与后续40真损分开，回末固定附伤仍按本次实际治疗150',()=>{
 let x=turn(make(3465,{enemy:3516,enemyMoves:[],bStages:{atk:1}}));if(!x.out.fighters[0].soulState.soulGu?.some(g=>g.usedRound===1))x=turn(x.out,pp);assert.ok(x.out.fighters[0].soulState.soulGu?.length>0);const heal=x.heals.find(h=>h.label==='圣瞳缪斯魂印回复');assert.equal(heal.actual,150);assert.equal(heal.before+heal.actual-heal.after,40);assert.equal(x.hurts.find(h=>h.label==='圣瞳缪斯魂印等量追加').requested,150);
});
