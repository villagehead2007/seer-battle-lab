'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3205-native.cjs'),axes=['atk','def','spa','spd','spe','acc'];
test('3205原生4与585多项强化原参数逐项生效，正六封顶和禁强化不影响其他独立条款',()=>{
 for(const [move,keys]of [[21153,['def','spd']],[22054,['spa','spe','acc']],[23506,axes],[24290,axes]])for(const mode of ['normal','cap','ban']){const s=H.turn(H.make(move,{aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:9}}:{}}),move);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:keys.includes(k)?1:0,move+' '+mode+' '+k);}
});
test('3205原生5与749多项弱化原方向和幅度，负六封底，真实免弱挡各项',()=>{
 for(const [move,expected]of [[20491,{spd:-1}],[22052,{atk:-1,spa:-1,spe:-1,acc:-2}],[24289,Object.fromEntries(axes.map(k=>[k,-1]))],[19987,Object.fromEntries(axes.map(k=>[k,-1]))]])for(const mode of ['normal','cap','immune']){const s=H.turn(H.make(move,{bStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,-6])):{},bEffects:mode==='immune'?{免弱:{start:1,end:9}}:{}}),move);for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='cap'?-6:mode==='immune'?0:expected[k]??0,move+' '+mode+' '+k);}
});
test('3205原生3解除真实负级、521反转真实负级，锁弱与禁强化分别遵守已有保护规则',()=>{
 for(const move of [13868,23507,17808])for(const mode of ['normal','lock','ban']){const s=H.turn(H.make(move,{aStages:{def:-2,atk:-1},aEffects:mode==='lock'?{'弱化不可解除反转':{start:1,end:9}}:mode==='ban'?{禁强化:{start:1,end:9}}:{}}),move);assert.equal(s.fighters[0].stages.def,mode==='lock'?-2:move===17808&&mode!=='ban'?2:0);assert.equal(s.fighters[0].stages.atk,mode==='lock'?-1:move===17808&&mode!=='ban'?1:0);}
});
test('3205原13870消强作用于真实正级，强化保护阻挡，原魂后续清回合不追溯重做消强',()=>{
 for(const protectedBoost of [false,true]){const s=H.turn(H.make(13870,{bStages:{atk:2,spd:1},bEffects:protectedBoost?{强化保护:{start:1,end:9}}:{}}),13870);assert.equal(s.fighters[1].stages.atk,protectedBoost?2:0);assert.equal(s.fighters[1].stages.spd,protectedBoost?1:0);}
});
test('3205原10530严格低于对手半体才威力翻倍，完整原招只观察真实beforeDamage不替换操作',()=>{
 for(const hp of [4499,4500,4501]){const old=H.E.WIKI.effectsEngine;let captured;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const power=c.power,result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)captured={power,next:c.power};return result;}};try{const s=H.turn(H.make(10530,{bHp:hp}),10530);assert.ok(s.turns[0].events.some(e=>e.damage?.sourceSide===0&&e.damage.type==='attack'));assert.equal(captured.next,captured.power*(hp<4500?2:1));}finally{H.E.WIKI.effectsEngine=old;}}
});
test('3205原23506的619只在下回合降低对手先制，原23507的481只在下回合让攻击优先而属性不优先',()=>{
 let s=H.turn(H.make(23506,{aStats:{spe:1},bStats:{spe:4000},extraMoves:[10499],enemyMoves:[10086]}),23506);s=H.turn(s,10499,10086);assert.equal(s.turns.at(-1).first,0);s=H.turn(s,10499,10086);assert.equal(s.turns.at(-1).first,1);
 for(const move of [10499,20491]){let q=H.turn(H.make(23507,{aStats:{spe:1},bStats:{spe:4000},extraMoves:[10499,20491],enemyMoves:[10086]}),23507);q=H.turn(q,move,10086);assert.equal(q.turns.at(-1).first,move===10499?0:1);q=H.turn(q,move,10086);assert.equal(q.turns.at(-1).first,1);}
});
test('3205原23507与24290四回合免弱，23507四回合和21042五回合免异，到期真实弱化睡眠恢复',()=>{
 for(const move of [23507,24290]){const baseline=move===24290?1:0;let s=H.turn(H.make(move,{enemyId:3205,enemyMoves:[20491],aStages:move===23507?{def:-2}:{},aStats:{spe:4000},bStats:{spe:100}}),move,20491);assert.equal(s.fighters[0].stages.def,baseline);assert.equal(s.fighters[0].stages.spd,baseline);for(let r=2;r<=5;r++){s=H.turn(s,'potion:pp',20491);assert.equal(s.fighters[0].stages.spd,r<=4?baseline:baseline-1);}}
 for(const [move,duration]of [[21042,5],[23507,4]]){let q=H.turn(H.make(move,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},seed:1}),move,22053),immuneEvents=0;for(let r=1;r<=duration;r++){if(r>1)q=H.turn(q,'potion:pp',22053);assert.equal(q.fighters[0].ailments['睡眠'],undefined);immuneEvents+=q.turns.at(-1).events.filter(e=>e.text.includes('免疫睡眠')).length;}assert.ok(immuneEvents>0);assert.equal(q.fighters[0].effects['免异常'],undefined);for(let n=0;n<3&&!q.fighters[0].ailments['睡眠'];n++)q=H.turn(q,'potion:pp',22053);assert.ok(q.fighters[0].ailments['睡眠']);}
});
test('3205止水原191反弹优先于次数免异，不消费次数，真实安魂曲反弹至原施放者且期限四回合',()=>{
 for(const move of [24289,25100]){let reflected=false;for(let seed=1;seed<=16&&!reflected;seed++){const s=H.turn(H.make(move,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},aCounts:{immune:1},seed}),move,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].effects.reflect.end,4);reflected=!!s.fighters[1].ailments['睡眠'];}assert.ok(reflected);}
});
test('3205原24290的681下两回合攻击真必中必暴，57当前四回合技能回血三千，药剂不触发且第五回合到期',()=>{
 let s=H.turn(H.make(24290,{aHp:1000,aStats:{spe:1},bStats:{spe:4000},aStages:{acc:-6},bCounts:{immune:9},extraMoves:[10499],enemyMoves:[10086]}),24290);assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[0].stages.acc,-5);
 for(let r=2;r<=5;r++){const before=s.fighters[0].hp;s=H.turn(s,10499,10086);const turn=s.turns.at(-1),loss=turn.events.filter(e=>e.damage?.sourceSide===1).reduce((n,e)=>n+e.damage.hpLoss,0);assert.equal(s.fighters[0].hp,r<=4?Math.min(9000,before-loss+3000):before-loss);if(r<=3){assert.ok(turn.events.some(e=>e.damage?.sourceSide===0&&e.damage.type==='attack'));assert.ok(turn.events.some(e=>e.damage?.sourceSide===0&&e.text.includes('致命一击')));}else assert.equal(turn.events.some(e=>e.damage?.sourceSide===0&&e.text.includes('致命一击')),false);}
});
test('3205原25101的693仅下两回合红伤翻倍，到期本体伤害恢复而独立魂印固定不混进比较',()=>{
 let s=H.turn(H.make(25101,{extraMoves:[10499],bCounts:{immune:9}}),25101);const reds=[];for(let r=2;r<=4;r++){s=H.turn(s,10499);reds.push(s.turns.at(-1).events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').reduce((n,e)=>n+e.damage.settledDamage,0));}assert.ok(reds.every(n=>n>0));assert.ok(reds[0]>=reds[2]*1.5);assert.ok(reds[1]>=reds[2]*1.5);
});
test('3205原24290既授57：药剂不触发，真实安魂曲睡眠使未出招时不触发，原PP不消费',()=>{
 let controlled=false;for(let seed=1;seed<=12&&!controlled;seed++){let s=H.turn(H.make(24290,{aHp:1000,enemyId:3205,enemyMoves:[22053],extraMoves:[10499],seed}),24290);assert.equal(s.fighters[0].hp,4000);s=H.turn(s,'potion:pp',22053);assert.equal(s.fighters[0].hp,4000,'PP potion is not a skill-use healing trigger');if(!s.fighters[0].ailments['睡眠'])continue;controlled=true;const prior=s.fighters[0].pp['wiki:10499'];s=H.turn(s,10499,'potion:pp');assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[0].pp['wiki:10499'],prior);assert.equal(s.turns.at(-1).events.some(e=>e.damage?.sourceSide===0),false);}assert.ok(controlled);
});
test('3205原24290既授57：真实圣御反转成功授下次技能无效，已用整招失效仍回复三千',()=>{
 let s=H.turn(H.make(24290,{aHp:1000,enemyId:4321,enemyMoves:[35619],extraMoves:[10499],aStats:{spe:4000},bStats:{spe:100},bStages:{def:-1},aEffects:{id984:{start:1,end:1,amount:4}}}),24290,35619);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].counts.nextSkillInvalid,1);const hp=s.fighters[0].hp,pp=s.fighters[0].pp['wiki:10499'];s=H.turn(s,10499,'potion:pp');assert.equal(s.fighters[0].pp['wiki:10499'],pp-1);assert.equal(s.fighters[0].hp,Math.min(9000,hp+3000));assert.equal(s.turns.at(-1).events.some(e=>e.damage?.sourceSide===0),false);assert.equal(s.fighters[0].counts.nextSkillInvalid??0,0);
});
test('3205原19989的760对真实机械微弱转普通，真实战斗强效关系保持原倍率，观察不改原操作',()=>{
 for(const enemyId of [2989,3056]){const old=H.E.WIKI.effectsEngine;let captured;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c.affinity,result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)captured={before,after:c.affinity};return result;}};try{const s=H.turn(H.make(19989,{enemyId}),19989);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.sourceSide===0&&e.damage.type==='attack'));assert.equal(captured.after,Math.max(1,captured.before));if(enemyId===2989){assert.equal(captured.before,.5);assert.equal(captured.after,1);}else assert.ok(captured.before>1);}finally{H.E.WIKI.effectsEngine=old;}}
});
test('3205原19986的736封属与63负级反馈各自真实执行，合法初始免断保护保留封属至两回合到期',()=>{
 let s=H.turn(H.make(19986,{bStages:{atk:2},aStages:{def:-2,atk:-1},bEffects:{protect:{start:1,end:9}},bCounts:{immune:9},enemyMoves:[20889]}),19986,20889);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[1].stages.atk,-1);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[1].effects.statusBlock.end,2);s=H.turn(s,'potion:pp',20889);assert.equal(s.fighters[1].stages.spe,0);s=H.turn(s,'potion:pp',20889);assert.equal(s.fighters[1].stages.spe,1);
 const empty=H.turn(H.make(19986,{aStages:{def:-2},bEffects:{protect:{start:1,end:9}},bCounts:{immune:9},enemyMoves:[20889]}),19986,20889);assert.equal(empty.fighters[1].stages.spe,1);assert.equal(empty.fighters[1].effects.statusBlock,undefined);
});
test('3205朱瞳736真实先授封属后180清既有回合，纯观察中间状态，封属最终保留关系待人答不冒定论',()=>{
 const old=H.E.WIKI.effectsEngine;let granted;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){if(phase!=='afterHit'||c.a.side!==0)return old.run(phase,ops,c);const timed=c.timed;c.timed=function(...args){const out=timed.apply(this,args);if(args[0]===c.t&&args[1]==='statusBlock')granted=structuredClone(c.t.effects.statusBlock);return out;};try{return old.run(phase,ops,c);}finally{c.timed=timed;}}};try{const s=H.turn(H.make(17807,{bStages:{atk:2},bEffects:{攻击必中:{start:1,end:9}},bCounts:{immune:9}}),17807);assert.deepEqual(granted,{start:1,end:2});assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].effects['攻击必中'],undefined);}finally{H.E.WIKI.effectsEngine=old;}
});
