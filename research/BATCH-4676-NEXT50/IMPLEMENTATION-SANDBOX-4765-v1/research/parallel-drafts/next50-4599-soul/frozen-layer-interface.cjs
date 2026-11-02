'use strict';
function levels1805(c){const s=c.a.soulState;if(!Number.isInteger(s.ming1805)||!Number.isInteger(s.fall1805)||s.ming1805<0||s.fall1805<0||s.ming1805+s.fall1805!==4)throw Error('1805命起魂落缺少真实初始化或破坏恒4');return {ming:s.ming1805,fall:s.fall1805};}
function transfer1805(c,from,n=1){if(!['ming','fall'].includes(from)||!Number.isInteger(n)||n<0)throw Error('1805转移层参数无效');const old=levels1805(c);if(old[from]<n)throw Error('1805零层/溢出边界待资料确认');c.a.soulState.ming1805=old.ming+(from==='fall'?n:-n);c.a.soulState.fall1805=old.fall+(from==='ming'?n:-n);return levels1805(c);}
function swap1805(c){const old=levels1805(c);c.a.soulState.ming1805=old.fall;c.a.soulState.fall1805=old.ming;return levels1805(c);}

module.exports={name:'灵巢之主·索杰德尔·冻结层接口',sourceHash:'61c58f40',partial:true,unimplemented:['仅冻结层数API，非完整魂印'],traits:{},abilities:{levelCount:levels1805,transferLayer:transfer1805,swapLayers:swap1805},hooks:{battleStart(c){c.a.soulState.ming1805=2;c.a.soulState.fall1805=2;}}};
