'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs'),axes=['atk','def','spa','spd','spe','acc'];
test('3240慧眼疯狂邪神妖祭乱及凌傲原强化各轴幅度准确，正六与禁强不删同招其他效果',()=>{
 for(const[move,values]of[[20230,{acc:1}],[23238,{def:1,spa:1,spd:1,spe:1}],[23239,{acc:2}],[23241,{def:1,spa:1,spd:1,spe:1}],[24065,Object.fromEntries(axes.map(k=>[k,1]))]])for(const mode of['normal','cap','ban']){const s=H.turn(H.make(move,{aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),move);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:values[k]??0);}
});
test('3240诱惑迟缓邪恶狞笑罗刹苦原有序弱化幅度，负六与免弱，完整39扣PP操作仍保留',()=>{
 for(const[move,values]of[[20015,{acc:-1}],[20229,{spe:-2}],[23237,{def:-1,spd:-1,acc:-2}],[15886,{def:-1}]])for(const mode of['normal','cap','immune']){const s=H.turn(H.make(move,{aStages:{acc:6},bStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,-6])):{},bEffects:mode==='immune'?{免弱:{start:1,end:5}}:{}}),move);for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='cap'?-6:mode==='immune'?0:values[k]??0);}
});
test('3240狰狞3清自身负留正遇负锁失败，魂动521反负留正并复用既有禁强归零统一答复',()=>{
 for(const move of[15883,17390])for(const mode of['normal','lock','ban']){const s=H.turn(H.make(move,{aStages:{atk:-3,def:-6,spa:2,acc:6},aEffects:mode==='lock'?{弱化不可解除反转:{start:1,end:5}}:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),move);for(const[k,n]of[['atk',3],['def',6]])assert.equal(s.fighters[0].stages[k],mode==='lock'?-n:move===17390&&mode!=='ban'?n:0);assert.equal(s.fighters[0].stages.spa,2);}
});
test('3240妖祭孽原143普通目标正级反转负级，无正不改并留既有负级',()=>{
 for(const positive of[false,true]){const s=H.turn(H.make(23240,{bStages:positive?{atk:2,def:1,spa:-1}:{spa:-1}}),23240);assert.equal(s.fighters[1].stages.atk,positive?-2:0);assert.equal(s.fighters[1].stages.def,positive?-1:0);assert.equal(s.fighters[1].stages.spa,-1);}
});
test('3240用户统一143直接反转穿普通防消吸，明确免反转保护仍阻挡且原疲惫免反不删',()=>{
 for(const mode of['ordinary','explicit']){const s=H.turn(H.make(23240,{bStages:{atk:2,def:1,spa:-1},bEffects:{protect:{start:1,end:4},[mode==='ordinary'?'强化保护':'幽蝶强化保护']:{start:1,end:4}}}),23240);assert.equal(s.fighters[1].stages.atk,mode==='ordinary'?-2:2);assert.equal(s.fighters[1].stages.def,mode==='ordinary'?-1:1);assert.equal(s.fighters[1].stages.spa,-1);}
});
test('3240幽侵881负级才先制三并1069反负成功当前三回闪避，空负或负锁不授且第四轮恢复命中',()=>{
 for(const mode of['negative','empty','lock']){let s=H.turn(H.make(30147,{aStages:{acc:6,...(mode==='empty'?{}:{atk:-1})},aStats:{spe:1},bStats:{spe:4000},aEffects:mode==='lock'?{弱化不可解除反转:{start:1,end:5}}:{},enemyMoves:[10086],extraMoves:[20230]}),30147,10086);assert.equal(s.turns[0].first,mode==='empty'?1:0);assert.equal(s.fighters[0].stages.atk,mode==='empty'?0:mode==='lock'?-1:1);if(mode!=='negative'){assert.ok(H.damage(s,'attack',1)>0);assert.equal(s.fighters[0].effects.概率闪避,undefined);continue;}assert.equal(H.damage(s,'attack',1),0);assert.equal(s.fighters[0].effects.概率闪避.end,3);for(let r=2;r<=4;r++){s=H.turn(s,20230,10086);if(r<=3)assert.equal(H.damage(s,'attack',1),0);else assert.ok(H.damage(s,'attack',1)>0);}}
});
test('3240叱咤962无正级才全强二，已有正级全一、仅负仍二，正六及禁强，原971和164完整保留',()=>{
 for(const mode of['zero','positive','negative','cap','ban']){const stages=mode==='positive'?{atk:1}:mode==='negative'?{atk:-1}:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},s=H.turn(H.make(25179,{aStages:stages,aEffects:mode==='ban'?{禁强化:{start:1,end:5}}:{}}),25179);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:(stages[k]??0)+(mode==='positive'?1:2));}
});
