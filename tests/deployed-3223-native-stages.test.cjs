'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs'),axes=['atk','def','spa','spd','spe','acc'];
test('3223两魂原气力斗志斗战之心狂烈斗气各项强化幅度正确，六级封顶及禁强',()=>{
 for(const soul of[558,566])for(const[move,amounts]of[[20117,{atk:1}],[20164,{spe:1,acc:1}],[25139,{atk:2,spe:1,acc:1}],[25141,Object.fromEntries(axes.map(k=>[k,1]))]])for(const mode of['normal','cap','ban']){const s=H.turn(H.make(move,{soul,aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),move);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:amounts[k]??0);}
});
test('3223两魂原破攻震荡怒息分别降攻击二或双攻二，负六截断和免弱',()=>{
 for(const soul of[558,566])for(const[move,keys]of[[20514,['atk']],[30067,['atk','spa']]])for(const mode of['normal','cap','immune']){const s=H.turn(H.make(move,{soul,bStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,-6])):{},bEffects:mode==='immune'?{免弱:{start:1,end:5}}:{}}),move);for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='cap'?-6:mode==='immune'?0:keys.includes(k)?-2:0);}
});
test('3223两魂原坚毅目光勇敌万魔反转负级，负锁保持原负级与禁强按已有裁定归零',()=>{
 for(const soul of[558,566])for(const move of[30069,30072])for(const mode of['normal','lock','ban']){const s=H.turn(H.make(move,{soul,aStages:{atk:-3,def:-6,spa:2,acc:6},aEffects:mode==='lock'?{弱化不可解除反转:{start:1,end:5}}:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),move);assert.equal(s.fighters[0].stages.atk,mode==='lock'?-3:mode==='ban'?0:3);assert.equal(s.fighters[0].stages.def,mode==='lock'?-6:mode==='ban'?0:6);assert.equal(s.fighters[0].stages.spa,2);}
});
test('3223气定神闲1014严格高半全二否则全一，4499与4500及4501原生边界且禁强阻止提升',()=>{
 for(const soul of[558,566])for(const hp of[4499,4500,4501])for(const blocked of[false,true]){const s=H.turn(H.make(25143,{soul,aHp:hp,aEffects:blocked?{禁强化:{start:1,end:5}}:{}}),25143);for(const k of axes)assert.equal(s.fighters[0].stages[k],blocked?0:hp>4500?2:1);}
});
test('3223先驱战拳983原未击败才全强一，真实KO不奖励，禁强与六级封顶独立',()=>{
 for(const soul of[558,566])for(const mode of['normal','kill','ban','cap']){const s=H.turn(H.make(30068,{soul,bHp:mode==='kill'?1:9000,aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),30068);assert.equal(s.fighters[1].hp===0,mode==='kill');for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='normal'?1:0);}
});
