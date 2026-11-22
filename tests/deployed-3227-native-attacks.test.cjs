'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs');
test('3227两魂三原40先手本体威力二倍，璀璨银月30后手才二倍，完整攻击魂印保留',()=>{
 for(const soul of[552,553])for(const move of[11648,18369,19088,18187])for(const fast of[false,true]){const old=H.E.WIKI.effectsEngine;let power;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c.power,result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)power={before,after:c.power};return result;}};try{const s=H.turn(H.make(move,{soul,aStats:{spe:fast?4000:1},bStats:{spe:fast?100:4000},enemyMoves:[10086]}),move,10086);assert.equal(s.turns[0].first,fast?0:1);assert.ok(H.damage(s,'attack')>0);assert.equal(power.after,power.before*((move===18187?!fast:fast)?2:1));}finally{H.E.WIKI.effectsEngine=old;}}
});
test('3227两魂交辉日月原180清实际回合，免断保护使清除失败',()=>{
 for(const soul of[552,553])for(const protect of[false,true]){const s=H.turn(H.make(18188,{soul,aStages:{acc:6},bEffects:{攻击必中:{start:1,end:5},...(protect?{protect:{start:1,end:5}}:{})}}),18188);assert.equal(!!s.fighters[1].effects.攻击必中,protect);}
});
test('3227两魂祈祷之月657消强成功才额外固定100，空正级或保护无奖励，魂印固定附加独立',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]])for(const mode of['positive','none','protect','fixed-immune']){const s=H.turn(H.make(18367,{soul,aStages:{acc:6},bStages:mode==='none'?{}:{atk:2},bEffects:mode==='protect'?{强化保护:{start:1,end:5}}:{},bGear:mode==='fixed-immune'?{resistance:{fixed:100}}:{}}),18367);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.equal(H.damage(s,'fixed'),mode==='fixed-immune'?0:8000*fraction+(mode==='positive'?100:0));}
});
test('3227两魂银光与九天781真实消回合成功才两回封属，空目标保护不封且第三回合恢复',()=>{
 for(const soul of[552,553])for(const move of[19086,30092])for(const mode of['clear','none','protect']){let s=H.turn(H.make(move,{soul,aStages:{acc:6},enemyMoves:[20241],bEffects:mode==='none'?{}:{攻击必中:{start:1,end:5},...(mode==='protect'?{protect:{start:1,end:5}}:{})}}),move,20241);assert.equal(s.fighters[0].stages.atk,mode==='clear'?0:-2);s=H.turn(s,'potion:pp',20241);assert.equal(s.fighters[0].stages.atk,mode==='clear'?0:-4);s=H.turn(s,'potion:pp',20241);assert.equal(s.fighters[0].stages.atk,mode==='clear'?-2:-6);}
});
test('3227两魂三原828正等级才先制加一，零或负级不加，其他原效果不删改',()=>{
 for(const soul of[552,553])for(const move of[18369,19088,30094])for(const stages of[{},{atk:-1},{atk:1}]){const old=H.E.WIKI.effectsEngine,seen=[];H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c.priority,result=old.run(phase,ops,c);if(phase==='beforeOrder'&&c.a.side===0)seen.push(c.priority-before);return result;}};try{const s=H.turn(H.make(move,{soul,aStages:stages}),move);assert.ok(H.damage(s,'attack')>0);assert.ok(seen.length);assert.ok(seen.every(n=>n===(stages.atk>0?1:0)));}finally{H.E.WIKI.effectsEngine=old;}}
});
test('3227两魂半月流光980实际先手才封对手当前属性，后手属性已经执行且均不延长至次回',()=>{
 for(const soul of[552,553])for(const fast of[false,true]){let s=H.turn(H.make(30094,{soul,aStats:{spe:fast?4000:1},bStats:{spe:fast?100:4000},enemyMoves:[20241]}),30094,20241);assert.equal(s.turns[0].first,fast?0:1);assert.equal(s.fighters[0].stages.atk,fast?0:-2);s=H.turn(s,'potion:pp',20241);assert.equal(s.fighters[0].stages.atk,fast?-2:-4);}
});

