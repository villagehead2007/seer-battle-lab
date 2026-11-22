'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289原拍打暗涌突袭龙王波分别依赖物攻特攻，完整原魂保留，非必中MISS与整招无效只扣原PP无红伤',()=>{
 for(const id of [10004,11184,10622]){const k=H.source.moves.find(m=>m.id===id).kind==='physical'?'atk':'spa',hi=H.turn(H.make(id,{aStats:{atk:3000,spa:3000},aStages:{acc:6}}),id),lo=H.turn(H.make(id,{aStats:{atk:3000,spa:3000,[k]:1000},aStages:{acc:6}}),id);assert.ok(H.damage(hi,'attack')>H.damage(lo,'attack'));assert.equal(hi.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack').attackValue,3000);}
 for(const id of [10004,11184,10622]){let s=H.make(id,{aStats:{atk:3000,spa:3000},aStages:{acc:6}});const pp=s.fighters[0].pp['wiki:'+id];s=H.turn(s,id);assert.ok(H.damage(s,'attack')>0);assert.equal(s.fighters[0].pp['wiki:'+id],pp-1);for(const mode of (H.source.moves.find(m=>m.id===id).alwaysHit?['invalid']:['miss','invalid'])){const q=H.turn(H.make(id,{aEffects:mode==='miss'?{攻击必失:{start:1,end:1}}:{skillBlock:{start:1,end:1}}}),id);assert.equal(H.damage(q,'attack'),0);assert.equal(q.fighters[0].pp['wiki:'+id],pp-1);}}
});
test('3289冰结与龙威原指定弱化，免弱和整招封锁保留原级数且不混降其他项',()=>{
 for(const id of [20217,20464])for(const mode of ['normal','immune','invalid']){const s=H.turn(H.make(id,{bEffects:mode==='immune'?{免弱:{start:1,end:1}}:{},aEffects:mode==='invalid'?{statusBlock:{start:1,end:1}}:{}}),id);for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[1].stages[k],mode==='normal'&&(id===20217?k==='acc':['atk','spa'].includes(k))?-1:0);}
});
test('3289水神祝福与青龙震怒原三项和两项强化，禁强与六级上限分别处理',()=>{
 for(const id of [20253,20467])for(const mode of ['normal','ban','cap']){const s=H.turn(H.make(id,{aEffects:mode==='ban'?{禁强化:{start:1,end:1}}:{},aStages:mode==='cap'?{atk:6,def:6,spa:6,spd:6,spe:6,acc:6}:{}}),id);const wanted=id===20253?{def:1,spa:1,acc:1}:{spa:2,spe:1};for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:wanted[k]??0);}
});
test('3289水之牙原65威力仅后手翻倍，先后手均实打红伤且原魂首登不影响属性药剂',()=>{
 const red=[];for(const late of [false,true]){const s=H.turn(H.make(10278,{aStats:{atk:3000,spe:late?1:4000},bStats:{def:1000,spe:100},enemyMoves:[20355],aStages:{acc:6}}),10278,20355);assert.equal(s.turns.at(-1).first,late?1:0);red.push(H.damage(s,'attack'));}assert.ok(red[0]>0);assert.ok(Math.abs(red[1]-2*red[0])<=8,red.join('/'));
});
test('3289水龙击原40威力二至三段，真实随机两档均出现，MISS与免攻不伪造红伤',()=>{
 const seen=new Set();for(let seed=1;seed<=30;seed++){const s=H.turn(H.make(11185,{seed,aStages:{acc:6}}),11185),events=s.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0);assert.ok([2,3].includes(events.length));seen.add(events.length);assert.ok(events.every(e=>e.settledDamage>0));}assert.deepEqual([...seen].sort(),[2,3]);for(const mode of ['miss','immune']){const s=H.turn(H.make(11185,{aEffects:mode==='miss'?{攻击必失:{start:1,end:1}}:{},bEffects:mode==='immune'?{攻击伤害免疫:{start:1,end:1}}:{}}),11185);assert.equal(H.damage(s,'attack'),0);}
});
test('3289真龙闪原清正保留负级及强化保护，真龙湮灭击原解除负级保留正级与弱化锁',()=>{
 for(const protect of [false,true]){let s=H.turn(H.make(11183,{aStages:{acc:6},bStages:{atk:2,def:-1},bEffects:protect?{强化保护:{start:1,end:1}}:{}}),11183);assert.equal(s.fighters[1].stages.atk,protect?2:0);assert.equal(s.fighters[1].stages.def,-1);s=H.turn(H.make(16443,{aStages:{atk:-2,spa:1,acc:6},aEffects:protect?{弱化不可解除反转:{start:1,end:1}}:{}}),16443);assert.equal(s.fighters[0].stages.atk,protect?-2:0);assert.equal(s.fighters[0].stages.spa,1);}
});
