'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3237-native.cjs'),axes=['atk','def','spa','spd','spe','acc'];
test('3237神明之咒原攻击双防速度各一，正六截断禁强化，原减伤408保留',()=>{
 for(const mode of['normal','cap','ban']){const s=H.turn(H.make(23838,{aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:4}}:{}}),23838);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:['atk','def','spd','spe'].includes(k)?1:0);}
});
test('3237神之寂四原弱化双攻双防一，保速度命中，负六与免弱分别阻挡',()=>{
 for(const mode of['normal','cap','immune']){const s=H.turn(H.make(22411,{bStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,-6])):{},bEffects:mode==='immune'?{免弱:{start:1,end:4}}:{}}),22411);for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='cap'?-6:mode==='immune'?0:['atk','def','spa','spd'].includes(k)?-1:0);}
});
test('3237梵音无尽1014严格高半全二，否则全一，4499和4500及4501边界、六截断禁强',()=>{
 for(const hp of[4499,4500,4501])for(const mode of['normal','cap','ban']){const s=H.turn(H.make(25172,{aHp:hp,aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:4}}:{}}),25172);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:hp>4500?2:1);}
});
test('3237苍月之击430消正成功才加攻一，保负级、空目标保护禁强及封顶独立',()=>{
 for(const mode of['normal','empty','protect','ban','cap']){const s=H.turn(H.make(14482,{aStages:{acc:6,...(mode==='cap'?{atk:6}:{})},bStages:mode==='empty'?{spa:-1}:{atk:2,def:1,spa:-1},bEffects:mode==='protect'?{强化保护:{start:1,end:4}}:{},aEffects:mode==='ban'?{禁强化:{start:1,end:4}}:{}}),14482);assert.equal(s.fighters[0].stages.atk,mode==='normal'?1:mode==='cap'?6:0);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.equal(s.fighters[1].stages.spa,-1);}
});
test('3237天佑706及轮转813原双倍反馈负级清自身负级留正，敌免弱受同招清回合先后顺序影响',()=>{
 for(const move of[23837,30131])for(const mode of['normal','immune']){const s=H.turn(H.make(move,{aStages:{atk:-2,def:-4,spa:1,acc:6},bEffects:mode==='immune'?{免弱:{start:1,end:5}}:{}}),move),feedback=mode==='normal'||move===30131;assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].stages.spa,1);assert.equal(s.fighters[1].stages.atk,feedback?-4:0);assert.equal(s.fighters[1].stages.def,feedback?-6:0);if(move===30131&&mode==='immune')assert.equal(s.fighters[1].effects.免弱,undefined);}
});
