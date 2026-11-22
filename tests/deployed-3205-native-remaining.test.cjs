'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3205-native.cjs');
const events=(s,type,side=0)=>s.turns.at(-1).events.filter(e=>e.damage?.type===type&&e.damage.sourceSide===side),amount=(s,type,side=0)=>events(s,type,side).reduce((n,e)=>n+e.damage.settledDamage,0);
test('3205原33招两魂真实合法整招逐一使用、零PP拒绝保持输入、疲惫未用无技能载荷',()=>{
 for(const soul of [535,548])for(const move of H.source.moves){let s=H.make(move.id,{soul});const before=s.fighters[0].pp['wiki:'+move.id];s=H.turn(s,move.id);assert.equal(s.fighters[0].pp['wiki:'+move.id],before-1,move.id+' actual PP');
  s=H.make(move.id,{soul});s.fighters[0].pp['wiki:'+move.id]=0;const copy=structuredClone(s);assert.throws(()=>H.turn(s,move.id),/PP|技能/);assert.deepEqual(s,copy);
  s=H.turn(H.make(move.id,{soul,aAilments:{疲惫:2}}),move.id);assert.equal(s.fighters[0].pp['wiki:'+move.id],before);assert.equal(amount(s,'attack'),0);assert.equal(s.fighters[1].hp,9000);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0));
 }
});
test('3205幻光波原15%降低命中自然成功失败，免弱独立阻挡且未成功不伪造降低',()=>{
 const outcomes=new Set();for(let seed=1;seed<=64&&outcomes.size<2;seed++){const s=H.turn(H.make(11025,{seed}),11025);outcomes.add(s.fighters[1].stages.acc);assert.ok([0,-1].includes(s.fighters[1].stages.acc));assert.ok(amount(s,'attack')>0);}assert.deepEqual([...outcomes].sort(),[-1,0]);
 for(let seed=1;seed<=8;seed++){const s=H.turn(H.make(11025,{seed,bEffects:{免弱:{start:1,end:9}}}),11025);assert.equal(s.fighters[1].stages.acc,0);}
});
test('3205奥术重击三回合要害率加1/16，飞影袭仅真实负级目标附80固定且固定免疫独立',()=>{
 let s=H.turn(H.make(13867),13867);assert.equal(s.fighters[0].effects['要害概率增加'].chance,1/16);assert.equal(s.fighters[0].effects['要害概率增加'].end,3);s=H.turn(s,'potion:pp');assert.ok(s.fighters[0].effects['要害概率增加']);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].effects['要害概率增加'],undefined);
 for(const mode of ['negative','zero','immune']){const q=H.turn(H.make(16358,{bStages:mode==='zero'?{}:{def:-1},bEffects:mode==='immune'?{'固定百分比免疫':{start:1,end:9}}:{}}),16358);assert.equal(amount(q,'fixed'),mode==='negative'?80:0);assert.ok(amount(q,'attack')>0);}
});
test('3205花咲原636消强成功睡眠、空目标失败和免异阻挡，原魂完整保留不靠拆条证明',()=>{
 let emptyNoSleep=false;for(let seed=1;seed<=32&&!emptyNoSleep;seed++){const empty=H.turn(H.make(16359,{seed}),16359);if(empty.fighters[0].stages.spa===1&&!empty.fighters[1].ailments['睡眠'])emptyNoSleep=true;}assert.ok(emptyNoSleep);
 const cleared=H.turn(H.make(16359,{bStages:{atk:2}}),16359);assert.equal(cleared.fighters[1].stages.atk,0);assert.ok(cleared.fighters[1].ailments['睡眠']);
 const immune=H.turn(H.make(16359,{bStages:{atk:2},bCounts:{immune:9}}),16359);assert.equal(immune.fighters[1].stages.atk,0);assert.equal(immune.fighters[1].ailments['睡眠'],undefined);
 const protectedState=H.turn(H.make(16359,{bStages:{atk:2},bEffects:{强化保护:{start:1,end:9}},bCounts:{immune:9}}),16359);assert.equal(protectedState.fighters[1].stages.atk,2);assert.equal(protectedState.fighters[1].ailments['睡眠'],undefined);
});
test('3205朱瞳按人答本体后序清掉新封属，天瞳原魂自然未清分支保留两回，负级反馈另执行',()=>{
 for(const move of [17807,19986]){let s;for(let seed=1;seed<=64&&!s;seed++){const candidate=H.turn(H.make(move,{seed,bStages:{atk:2},aStages:move===19986?{def:-2,acc:-1}:{},bEffects:{攻击必中:{start:1,end:9}},bCounts:{immune:9},enemyMoves:[20889]}),move,20889);if(amount(candidate,'attack')>0&&(move===17807||candidate.fighters[1].effects.statusBlock))s=candidate;}assert.ok(s,'保留负命中和完整原魂，自然取命中且天瞳原魂未额外清回合分支');assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.spe,move===17807?1:0,'朱瞳新封属已被本体后序清回合清掉；天瞳未额外清时仍封');if(move===17807){assert.equal(s.fighters[1].effects.statusBlock,undefined);assert.equal(s.fighters[1].effects['攻击必中'],undefined);}else{assert.equal(s.fighters[1].effects.statusBlock.end,2);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].stages.acc,0);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[1].stages.acc,-1);}s=H.turn(s,'potion:pp',20889);assert.equal(s.fighters[1].stages.spe,move===17807?2:0);s=H.turn(s,'potion:pp',20889);assert.equal(s.fighters[1].stages.spe,move===17807?3:1);
  const empty=H.turn(H.make(move,{bCounts:{immune:9},enemyMoves:[20889]}),move,20889);assert.equal(empty.fighters[1].stages.spe,1,'no positive stages means no736 reward');
 }
});
test('3205天瞳本体虽无180，完整原魂随机清回合分支仍会清掉刚授封属并使当回合穿梭成功',()=>{
 for(const soul of[535,548]){let found=false;for(let seed=1;seed<=64&&!found;seed++){const s=H.turn(H.make(19986,{soul,seed,bStages:{atk:2},bCounts:{immune:9},enemyMoves:[20889]}),19986,20889);if(amount(s,'attack')<=0||s.fighters[1].effects.statusBlock)continue;found=true;assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.spe,1);assert.ok(s.turns.at(-1).events.some(e=>e.text.includes('的回合效果已消除')&&e.text.includes('属性技能无效')));}assert.ok(found);}
});
test('3205止水50%先制有自然双分支，原170先手才回最大1/5并免当回合红伤，后手不补回',()=>{
 const outcomes=new Set();for(let seed=1;seed<=32&&outcomes.size<2;seed++){const s=H.turn(H.make(24289,{seed,aHp:1000,aStats:{spe:1},bStats:{spe:4000},enemyMoves:[10086]}),24289,10086),first=s.turns.at(-1).first;outcomes.add(first);if(first===0){assert.equal(s.fighters[0].hp,2800);assert.equal(amount(s,'attack',1),0);}else{const loss=events(s,'attack',1).reduce((n,e)=>n+e.damage.hpLoss,0);assert.equal(s.fighters[0].hp,1000-loss);}}assert.deepEqual([...outcomes].sort(),[0,1]);
});
test('3205赤影先手回最大1/3且免伤，后手不回；原843仅下两回合真实反超，到期恢复速度排序',()=>{
 for(const fast of [false,true]){const s=H.turn(H.make(25100,{aHp:1000,aStats:{spe:fast?1000:1},bStats:{spe:fast?100:4000},enemyMoves:[10086]}),25100,10086);if(fast){assert.equal(s.fighters[0].hp,4000);assert.equal(amount(s,'attack',1),0);}else{assert.equal(s.fighters[0].hp,1000-events(s,'attack',1).reduce((n,e)=>n+e.damage.hpLoss,0));assert.equal(s.turns[0].first,1);}assert.equal(s.fighters[0].effects.id984.start,2);assert.equal(s.fighters[0].effects.id984.end,3);}
 let q=H.turn(H.make(25100,{aStats:{spe:1},bStats:{spe:4000},enemyMoves:[10086],extraMoves:[10499]}),25100,10086);for(let r=2;r<=4;r++){q=H.turn(q,10499,10086);assert.equal(q.turns.at(-1).first,r<=3?0:1);}
});
function modifier(move,enemyId){const before=[],registry=H.E.WIKI.effectsEngine;H.E.WIKI.effectsEngine={...registry,run(phase,ops,c){const old=c.modifier,result=registry.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)before.push({old,next:c.modifier,affinity:c.typeAffinity(c.t.type,c.a.type)});return result;}};try{const s=H.turn(H.make(move,{enemyId}),move);assert.ok(amount(s,'attack')>0);assert.equal(before.length,1);return before[0];}finally{H.E.WIKI.effectsEngine=registry;}}
test('3205花咲567按既有真实对手天敌关系伤害翻倍，联盟1064对既有普通目标不加成',()=>{
 const seen=new Set();for(const enemy of [2989,3013]){const p=modifier(16359,enemy),factor=p.affinity>1?2:1;seen.add(factor);assert.equal(p.next,p.old*factor);}assert.deepEqual([...seen].sort(),[1,2]);const p=modifier(30125,2989);assert.equal(p.next,p.old);
});
test('3205联盟1064已核长老身份3162的50%组件分支，不假称未部署3162为当前原生对手',()=>{
 const move=H.source.moves.find(m=>m.id===30125),instance=move.effectInstances.find(e=>e.id===1064);assert.deepEqual(instance.args,[50]);for(const number of [3162,2989]){const c={t:{number},modifier:1.2};H.E.WIKI.effectsEngine.registry[1064].execute(c,instance.args);assert.equal(c.modifier,1.2*(number===3162?1.5:1));}
});
test('3205联盟603原35%睡眠两回合，与魂印独立：自然魂印失败时仍有技能睡眠和两者未触发样本',()=>{
 let yes=false,no=false;for(let seed=1;seed<=64&&!(yes&&no);seed++){const s=H.turn(H.make(30125,{seed}),30125);if(s.fighters[0].stages.spa!==1)continue;if(s.fighters[1].ailments['睡眠']){yes=true;assert.equal(s.fighters[1].ailments['睡眠'],2);}else no=true;}assert.ok(yes&&no);
});
