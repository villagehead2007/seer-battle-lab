'use strict';
function entry(c){if(c.t.hp>0&&c.clearBoost(c.t)){const apply=(f,k)=>c.entryAilment?c.entryAilment(f,k):c.ailment(f,k,c.a);if(!apply(c.t,'害怕'))apply(c.t,'束缚');}}
function grantGuiFu(c,n=1,target=c.t){if(!Number.isInteger(n)||n<0)throw Error('诡符层数须为非负整数');target.soulState.guiFu1747=Math.min(4,(target.soulState.guiFu1747??0)+n);return target.soulState.guiFu1747;}
module.exports={name:'诡魅浮踪·幽美',sourceHash:'ea4444ed',traits:{attackReduction:f=>f.soulState.youmeiReduction1747??0},abilities:{grantGuiFu,releaseGuiFu(c,target=c.t){const n=target.soulState.guiFu1747??0;delete target.soulState.guiFu1747;return n;},qualifiedEntry:entry},deferred:['真实再次登场消强/害怕失败束缚；当前初登场已实现','本次登场回合对方选择主动切换时战斗阶段结束额外加1道诡符','诡符真实下场保留与主动切换前每道直接扣50HP并保1；当前最高4层受暴击每层增15%已实现'],hooks:{battleStart:entry,roundStart(c){c.a.soulState.youmeiReduction1747=Object.values(c.a.stages).some(v=>v>0)?0:.5;},combatEnd(c){if(c.a.hp>0&&Object.values(c.a.stages).some(v=>v>0))c.heal(c.a,c.a.stats.maxHp/3,'幽美战阶正强化回复');}}};

