'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3211-native.cjs'),axes=['atk','def','spa','spd','spe','acc'];
test('3211原22招两版魂印完整原hash参数编译和实际用招，零PP拒绝与疲惫未用保持真实状态',()=>{
 const original=structuredClone(H.source);assert.equal(H.source.moves.length,22);assert.deepEqual(H.source.souls.map(s=>[s.id,s.hash]),[[538,'a8acaca7'],[549,'ecbf5ffd']]);for(const soul of[538,549])for(const m of H.source.moves){const c=H.E.WIKI.compile(m,H.source);assert.equal(c.issue,'');for(const o of c.operations){assert.equal(o.effectId,m.effectInstances[o.index].id);assert.deepEqual(o.sourceArgs,m.effectInstances[o.index].args);}let s=H.turn(H.make(m.id,{soul}),m.id);assert.equal(s.fighters[0].pp['wiki:'+m.id],m.pp-1);if(m.kind!=='status'&&m.power>0)assert.ok(H.damage(s,'attack')>0,m.name+'原本体红伤');s=H.make(m.id,{soul});s.fighters[0].pp['wiki:'+m.id]=0;const before=structuredClone(s);assert.throws(()=>H.turn(s,m.id),/PP/);assert.deepEqual(s,before);s=H.turn(H.make(m.id,{soul,aAilments:{疲惫:2}}),m.id);assert.equal(s.fighters[0].pp['wiki:'+m.id],m.pp);assert.equal(s.fighters[1].hp,9000);}assert.deepEqual(H.source,original);
});
test('3211幻光盾灵威异能原4与585各项幅度一或二，六级封顶与禁强化真实阻挡',()=>{
 for(const [move,values]of[[21153,{def:1,spd:1}],[25110,{spa:2,spe:2}],[25112,Object.fromEntries(axes.map(k=>[k,1]))]])for(const mode of['normal','cap','ban']){const s=H.turn(H.make(move,{aStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:9}}:{}}),move);for(const k of axes)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:values[k]??0);}
});
test('3211哀叹咒能原5按特防一或攻击速度二降低，负六封底和免弱独立，幻光波15概率自然成败',()=>{
 for(const [move,values]of[[20491,{spd:-1}],[30010,{atk:-2,spe:-2}]])for(const mode of['normal','cap','immune']){const s=H.turn(H.make(move,{bStages:mode==='cap'?Object.fromEntries(axes.map(k=>[k,-6])):{},bEffects:mode==='immune'?{免弱:{start:1,end:9}}:{}}),move);for(const k of axes)assert.equal(s.fighters[1].stages[k],mode==='cap'?-6:mode==='immune'?0:values[k]??0);}
 const seen=new Set;for(let seed=1;seed<=64&&seen.size<2;seed++){const s=H.turn(H.make(11025,{seed}),11025);seen.add(s.fighters[1].stages.acc);}assert.deepEqual([...seen].sort(),[-1,0]);const immune=H.turn(H.make(11025,{bEffects:{免弱:{start:1,end:9}}}),11025);assert.equal(immune.fighters[1].stages.acc,0);
});
test('3211两招原3解除自身负级，锁弱不能解除，超量33真实消强与强化保护分支独立',()=>{
 for(const move of[19991,30012])for(const lock of[false,true]){const s=H.turn(H.make(move,{aStages:{atk:-2,def:-1},aEffects:lock?{弱化不可解除反转:{start:1,end:9}}:{}}),move);assert.equal(s.fighters[0].stages.atk,lock?-2:0);assert.equal(s.fighters[0].stages.def,lock?-1:0);}
 for(const protect of[false,true]){const s=H.turn(H.make(19990,{bStages:{atk:2},bEffects:protect?{强化保护:{start:1,end:9}}:{}}),19990);assert.equal(s.fighters[1].stages.atk,protect?2:0);}
});
test('3211极能与魅影843只在下两轮按各自加一或加二反超，授予当轮不改顺序且第三轮后到期',()=>{
 for(const move of[25111,25113]){let s=H.turn(H.make(move,{aStats:{spe:1},bStats:{spe:4000},enemyMoves:[10086],extraMoves:[10499]}),move,10086);assert.equal(s.turns[0].first,1);assert.equal(s.fighters[0].effects.id984.start,2);assert.equal(s.fighters[0].effects.id984.end,3);assert.equal(s.fighters[0].effects.id984.amount,move===25111?1:2);for(let r=2;r<=4;r++){s=H.turn(s,10499,10086);assert.equal(s.turns.at(-1).first,r<=3?0:1);}}
});
test('3211超能天威180清真实回合与免断保护，异界565先手回复三千而后手不回，技能禁疗和上限独立',()=>{
 for(const protect of[false,true]){const s=H.turn(H.make(30011,{bEffects:{攻击必中:{start:1,end:9},...(protect?{protect:{start:1,end:9}}:{})}}),30011);assert.equal(!!s.fighters[1].effects.攻击必中,protect);}
 for(const [hp,fast,ban,result]of[[5000,true,false,8000],[5000,false,false,5000],[8950,true,false,9000],[5000,true,true,5000]]){const s=H.turn(H.make(30015,{aHp:hp,aStats:{spe:fast?1000:1},bStats:{spe:fast?100:4000},enemyMoves:[20889],aEffects:ban?{技能禁疗:{start:1,end:9}}:{}}),30015,20889);assert.equal(s.fighters[0].hp,result);}
});
test('3211天命942先清回合成功才吸取三千，保护和空目标无奖励，免粉不阻理论回复且679独立封技能回血',()=>{
 for(const mode of['clear','none','protect','heal-ban','percent-immune']){const s=H.turn(H.make(30014,{aHp:5000,enemyId:mode==='percent-immune'?3291:2989,bEffects:mode==='none'?{}:{攻击必中:{start:1,end:9},...(mode==='protect'?{protect:{start:1,end:9}}:{})},aEffects:mode==='heal-ban'?{技能禁疗:{start:1,end:9}}:{}}),30014);assert.equal(s.fighters[0].hp,['clear','percent-immune'].includes(mode)?8000:5000);assert.equal(H.damage(s,'percent'),['clear','heal-ban'].includes(mode)?3000:0);assert.equal(s.fighters[1].effects.技能禁疗.end,2);}
});
test('3211第五1052消强成功才全强一，保护阻清强而自身禁强不阻清强；833未击败吸取三千，真实KO无吸取',()=>{
 for(const mode of['positive','none','protect','ban']){const s=H.turn(H.make(30017,{aHp:5000,bStages:mode==='none'?{}:{atk:2},bEffects:mode==='protect'?{强化保护:{start:1,end:9}}:{},aEffects:mode==='ban'?{禁强化:{start:1,end:9}}:{}}),30017);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===(mode==='positive'?1:0)));assert.equal(H.damage(s,'percent'),3000);assert.equal(s.fighters[0].hp,8000);}
 const killed=H.turn(H.make(30017,{aHp:5000,bHp:1}),30017);assert.equal(killed.fighters[1].hp,0);assert.equal(H.damage(killed,'percent'),0);assert.equal(killed.fighters[0].hp,5000);
});
