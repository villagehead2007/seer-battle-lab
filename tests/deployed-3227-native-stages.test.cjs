'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs'),axes=['atk','def','spa','spd','spe','acc'];
test('3227两魂原沉默双防二圣洁月光双攻一及月神自由全一，正六封顶禁强分别验证',()=>{
 for(const soul of[552,553])for(const[move,amounts]of[[20521,{def:2,spd:2}],[24481,{atk:1,spa:1}],[24579,Object.fromEntries(axes.map(k=>[k,1]))],[24632,Object.fromEntries(axes.map(k=>[k,1]))]])for(const mode of['normal','cap','ban']){const s=H.turn(H.make(move,{soul,aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),move);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:amounts[k]??0);}
});
test('3227两魂四原弱化招各项幅度正确，负六截断和免弱独立于攻击魂印附伤',()=>{
 for(const soul of[552,553])for(const[move,values]of[[20013,{def:-1}],[20183,{def:-1,spd:-1}],[17988,{spe:-1,acc:-1}],[24482,{acc:-2}]])for(const mode of['normal','cap','immune']){const s=H.turn(H.make(move,{soul,aStages:{acc:6},bStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,-6])):{},bEffects:mode==='immune'?{免弱:{start:1,end:5}}:{}}),move);for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='cap'?-6:mode==='immune'?0:values[k]??0);}
});
test('3227两魂暗月之眼原消强保负，强化保护阻挡；无月疾冲反转负级保正且遵守负锁与既有禁强归零',()=>{
 for(const soul of[552,553]){for(const protectedBoost of[false,true]){const s=H.turn(H.make(18185,{soul,aStages:{acc:6},bStages:{atk:2,def:1,spd:-2},bEffects:protectedBoost?{强化保护:{start:1,end:5}}:{}}),18185);assert.equal(s.fighters[1].stages.atk,protectedBoost?2:0);assert.equal(s.fighters[1].stages.def,protectedBoost?1:0);assert.equal(s.fighters[1].stages.spd,-2);}for(const mode of['normal','lock','ban']){const s=H.turn(H.make(30093,{soul,aStages:{atk:-3,def:-6,spa:2,acc:6},aEffects:mode==='lock'?{弱化不可解除反转:{start:1,end:5}}:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),30093);assert.equal(s.fighters[0].stages.atk,mode==='lock'?-3:mode==='ban'?0:3);assert.equal(s.fighters[0].stages.def,mode==='lock'?-6:mode==='ban'?0:6);assert.equal(s.fighters[0].stages.spa,2);}}
});
test('3227两魂耀世月华893以用招满体才全二，先强化后1039回血不能追溯变二，六封顶和禁强',()=>{
 for(const soul of[552,553])for(const hp of[4499,8999,9000])for(const mode of['normal','cap','ban']){const s=H.turn(H.make(25154,{soul,aHp:hp,aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),25154);assert.equal(s.fighters[0].hp,9000);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:hp===9000?2:1);}
});
test('3227魔环原15降速自然成功失败，真实免弱阻挡，原两版魂印全部保留',()=>{
 for(const soul of[552,553]){let yes=false,no=false;for(let seed=1;seed<=64&&!(yes&&no);seed++){const s=H.turn(H.make(11031,{soul,seed,aStages:{acc:6}}),11031);if(s.fighters[1].stages.spe===-1)yes=true;else{assert.equal(s.fighters[1].stages.spe,0);no=true;}}assert.ok(yes&&no);const immune=H.turn(H.make(11031,{soul,aStages:{acc:6},bEffects:{免弱:{start:1,end:5}}}),11031);assert.equal(immune.fighters[1].stages.spe,0);}
});
