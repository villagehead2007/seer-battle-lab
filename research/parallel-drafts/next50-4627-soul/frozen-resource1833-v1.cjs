'use strict';
function count1833(c){return Math.max(0,Math.min(7,c.a.soulState.guardedFlame1833??0));}
function grant1833(c,n){if(!Number.isInteger(n)||n<0)throw Error('1833灼火层数必须非负整数');const before=count1833(c),after=Math.min(7,before+n);c.a.soulState.guardedFlame1833=after;return {before,after,gained:after-before};}
function consume1833(c){const n=count1833(c);c.a.soulState.guardedFlame1833=0;return n;}
module.exports={name:'赫斯提亚',sourceHash:'7d4fbbb',partial:true,unimplemented:['资源接口仅用于当前技能明确载荷，完整魂印自然时序尚未冻结'],traits:{},abilities:{layerCount:count1833,grantLayers:grant1833,consumeAll:consume1833},hooks:{}};
