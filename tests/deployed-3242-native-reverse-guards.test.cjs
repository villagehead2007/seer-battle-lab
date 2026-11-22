'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3242-native.cjs');
test('3242天诛乱舞733完整原招正常反弱才害怕，禁强负级归零无收益，负锁与无负不授，目标免异只挡害怕',()=>{
 for(const mode of ['normal','ban','lock','none','immune']){const s=H.turn(H.make(17491,{aStages:{atk:mode==='none'?0:-2,def:mode==='none'?0:-1,spa:2,acc:6},aEffects:mode==='ban'?{禁强化:{start:1,end:1}}:mode==='lock'?{弱化不可解除反转:{start:1,end:1}}:{},bEffects:mode==='immune'?{免异常:{start:1,end:1}}:{}}),17491);assert.equal(s.fighters[0].stages.atk,['normal','immune'].includes(mode)?2:mode==='lock'?-2:0);assert.equal(s.fighters[0].stages.def,['normal','immune'].includes(mode)?1:mode==='lock'?-1:0);assert.equal(s.fighters[0].stages.spa,2);assert.equal(Boolean(s.fighters[1].ailments.害怕),mode==='normal');assert.ok(H.damage(s,'attack')>0);}
});
test('3242战霸天下191真实反弹睡眠，原四回免反最后回仍挡，第五回自然到期可被睡眠',()=>{
 const reflected=H.turn(H.make(25183,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStages:{acc:6}}),25183,22053);assert.equal(reflected.fighters[0].ailments.睡眠,undefined);assert.ok(reflected.fighters[1].ailments.睡眠>=1);
 let s=H.make(25183,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStages:{acc:6},bEffects:{免异常:{start:1,end:4}}});for(let round=1;round<=5;round++){s=H.turn(s,round===1?25183:'potion:pp',22053);if(round<=4){assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[1].ailments.睡眠,undefined);}else assert.ok(s.fighters[0].ailments.睡眠>=5);}
});
test('3242战霸天下47五回免弱包含最后第五回，真实断水天涯五项均挡，第六回正常降级，原855储备未伪触发',()=>{
 let s=H.make(25183,{enemyId:3242,enemyMoves:[24118],aStats:{spe:4000}});for(let round=1;round<=6;round++){s=H.turn(s,round===1?25183:'potion:pp',round===4?'potion:pp':24118);for(const k of ['atk','def','spa','spe','acc'])assert.equal(s.fighters[0].stages[k],round<=5?0:-1);assert.equal(s.fighters[0].stages.spd,0);assert.equal(s.fighters[0].counts.nextDamageReturn,2);}
});
test('3242战霸天下855按原200比例真实反馈一次，免粉不挡，零红保留直到真实命中后消费',()=>{
 for(const zero of [false,true]){let s=H.make(25183,{enemyMoves:[10086],aStats:{def:1000,spe:4000},bStats:{atk:6000},bStages:{acc:6},aEffects:zero?{攻击伤害免疫:{start:1,end:1}}:{},bEffects:{固定百分比免疫:{start:1,end:5},protect:{start:1,end:5}}});s=H.turn(s,25183,10086);if(zero){assert.equal(s.fighters[0].counts.nextDamageReturn,2);assert.equal(H.damage(s,'attack',1),0);s=H.turn(s,'potion:pp',10086);}const feedback=s.turns.at(-1).events.find(e=>e.kind==='damage'&&e.text.includes('出手结束反馈'));assert.ok(feedback);assert.equal(feedback.damage.type,'true');assert.equal(feedback.damage.settledDamage,H.damage(s,'attack',1)*2);assert.equal(s.fighters[0].counts.nextDamageReturn,undefined);s=H.turn(s,'potion:pp',10086);assert.ok(!s.turns.at(-1).events.some(e=>e.kind==='damage'&&e.text.includes('出手结束反馈')));}
});
