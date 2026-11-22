'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
test('3291原拳击重击野蛮扑倒与星之光分别依赖物攻特攻，原622魂与完整招式保留，普通有效用招无皇怒且回最大体力八分一',()=>{
 for(const move of [10499,10047,11317,10539]){const k=H.source.moves.find(m=>m.id===move).kind==='physical'?'atk':'spa',s=H.turn(H.make(move,{aHp:1000,aStats:{atk:3000,spa:3000},aStages:{acc:6}}),move),q=H.turn(H.make(move,{aStats:{atk:3000,spa:3000,[k]:1000},aStages:{acc:6}}),move);assert.equal(s.fighters[0].soulId,622);assert.equal(s.fighters[0].soulHash,'2f1e3f2');assert.ok(H.damage(s,'attack')>H.damage(q,'attack'));assert.equal(s.fighters[0].hp,2125);assert.equal(s.fighters[0].pp['wiki:'+move],H.source.moves.find(m=>m.id===move).pp-1);assert.equal(s.turns.at(-1).events.some(e=>e.text.includes('星皇之怒')),false);}
});
test('3291专注与众生俯首按原指定项目强化，禁强与六级上限不伪造成功等级，独立星皇之赐仍回血',()=>{
 for(const move of [20530,25293])for(const mode of ['normal','ban','cap']){const s=H.turn(H.make(move,{aHp:1000,aStages:mode==='cap'?{atk:6,def:6,spa:6,spd:6,spe:6,acc:6}:{},aEffects:mode==='ban'?{禁强化:{start:1,end:1}}:{}}),move),wanted=move===20530?{acc:1}:{atk:2,spe:2};for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:wanted[k]??0);assert.equal(s.fighters[0].hp,2125);assert.equal(s.turns.at(-1).events.some(e=>e.text.includes('星皇之怒')),false);}
});
test('3291寸步难行威胁原速度命中各负二，弑极魔泣原双防负二，免弱只挡负级，整招无效不执行本体弱化',()=>{
 for(const move of [21658,20689,30377])for(const mode of ['normal','immune','invalid']){const s=H.turn(H.make(move,{aStages:{acc:6},bEffects:mode==='immune'?{免弱:{start:1,end:1}}:{},aEffects:mode==='invalid'?{skillBlock:{start:1,end:1}}:{}}),move),wanted=move===21658?['spe']:move===20689?['acc']:['def','spd'];for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[1].stages[k],mode==='normal'&&wanted.includes(k)?-2:0);}
});
test('3291蓄力一击原九十特攻后手威力翻倍，合法同先制速度对照而不用高先制药剂模拟先后手',()=>{
 const reds=[];for(const late of [false,true]){const s=H.turn(H.make(11492,{aStats:{spa:3000,spe:late?1:4000},bStats:{spd:1000},enemyMoves:[20355],aStages:{acc:6}}),11492,20355);assert.equal(s.turns.at(-1).first,late?1:0);reds.push(H.damage(s,'attack'));}assert.ok(reds[0]>0);assert.ok(Math.abs(reds[1]-2*reds[0])<=8,reds.join('/'));
});
test('3291玄震命斩原130物攻严格低三分一才三倍威力，动作后八分一回复不回算出招时的门槛',()=>{
 const reds=[];for(const hp of [2999,3000,3001]){const s=H.turn(H.make(30378,{aHp:hp,aStats:{atk:3000},bStats:{def:1000},aStages:{acc:6}}),30378);assert.equal(s.fighters[0].hp,hp+1125);reds.push(H.damage(s,'attack'));}assert.equal(reds[1],reds[2]);assert.ok(Math.abs(reds[0]-3*reds[1])<=8,reds.join('/'));
});
test('3291极光星粲683原一至五百随机固定与原140特攻独立，免粉只挡附伤，零红命中仍附原固定',()=>{
 const seen=new Set();for(let seed=1;seed<=20;seed++){const s=H.turn(H.make(30379,{seed,aStages:{acc:6}}),30379),n=H.damage(s,'fixed');assert.ok(n>=1&&n<=500);seen.add(n);assert.ok(H.damage(s,'attack')>0);}assert.ok(seen.size>1);for(const pink of [false,true]){const s=H.turn(H.make(30379,{aStages:{acc:6},bEffects:pink?{固定百分比免疫:{start:1,end:1}}:{攻击伤害免疫:{start:1,end:1}}}),30379);assert.equal(H.damage(s,'fixed')>0,!pink);assert.equal(H.damage(s,'attack')>0,pink);}
});
