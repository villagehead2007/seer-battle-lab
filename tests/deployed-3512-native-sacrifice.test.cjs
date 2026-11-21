'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3512-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const pp='potion:pp';
function member(id,skill,stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[moves.findIndex(k=>!snapshot.moves.find(m=>m.id===k).fifth)]=skill;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:1000,...stats}}};}
test('3512生命永恒1117仅严格低于半体增加二先制，魂印结束后4499实际先手而4500实际后手',()=>{
 for(const hp of [4499,4500]){let s=make(25861,{aHp:hp,enemyId:2988,enemyMoves:[10018],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp);s=turn(s,pp);assert.equal(s.fighters[0].hp,hp);s=turn(s,25861,10018);assert.equal(s.fighters[0].soulState.resolvedPriority.value,hp<4500?2:0);assert.equal(s.turns.at(-1).first,hp<4500?0:1);assert.equal(s.fighters[0].hp,0);}
});
test('3512生命永恒753真实耗尽全体力、初次保命不阻挡自耗，敌方切入也承受五回合属性失效而第六恢复',()=>{
 let g=T.create([[member(3512,25861),member(3056)],[member(3056),member(2988,24651)]],[0,0],{seed:13,criticals:false});g=T.turn(g,['wiki:25861',pp]);assert.equal(g.slots[0][0].fighter.hp,0);assert.equal(g.phase,'replace');assert.equal(g.battle.teamStatusBlock753[1].end,5);assert.equal((g.battle.damageEvents??[]).filter(e=>e.targetSide===0&&e.hpLoss>0).length,0);g=T.replace(g,[1,null]);g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,'wiki:24651']);assert.equal(g.battle.fighters[1].stages.atk,0);while(g.battle.round<=5)g=T.turn(g,[pp,pp]);g=T.turn(g,[pp,'wiki:24651']);assert.ok(g.battle.fighters[1].stages.atk>0);
});
test('3512守御八方1275实际献祭给首位接替者两次先手必暴，药剂不扣次数、用尽后不再授予',()=>{
 let g=T.create([[member(3512,31505),member(3056,10716,{spe:1})],[member(2988,10018,{spe:9999})]],[0,0],{seed:13,criticals:false});g=T.turn(g,['wiki:31505',pp]);assert.equal(g.slots[0][0].fighter.hp,0);g=T.replace(g,[1,null]);g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].soulState.teamFirstCrit1275,2);for(const left of [1,0]){g=T.turn(g,['wiki:10716','wiki:10018']);assert.equal(g.battle.turns.at(-1).first,0);assert.equal(g.battle.fighters[0].soulState.teamFirstCrit1275,left);assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail,/暴击 2/);}g=T.turn(g,['wiki:10716','wiki:10018']);assert.equal(g.battle.turns.at(-1).first,1);assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail,/暴击 1/);
});
test('3512救赎1187命中令普通目标疲惫，真实初期免异目标失败则消除已由原生技能获得的回合效果',()=>{
 let a=turn(make(31506,{aHp:1000}),31506);assert.equal(a.fighters[1].ailments['疲惫'],3);assert.equal(a.fighters[0].hp,0);let b=make(31506,{enemyId:3512,enemyMoves:[24184],aHp:1000});b=turn(b,pp,24184);assert.ok(b.fighters[1].effects['攻击必中']);b=turn(b,31506);assert.equal(b.fighters[1].ailments['疲惫'],undefined);assert.deepEqual(b.fighters[1].effects,{});assert.equal(b.fighters[0].hp,0);
});
test('3512救赎1276按实际自耗体力一半追加百分比，200与1000体力均耗尽且星皇免疫不改变自耗',()=>{
 for(const hp of [200,1000])for(const enemyId of [2989,3291]){const s=turn(make(31506,{aHp:hp,enemyId}),31506);assert.equal(s.fighters[0].hp,0);assert.equal(s.fighters[1].hp,9000-(enemyId===3291?0:hp/2));assert.equal(s.damageEvents.filter(e=>e.targetSide===0&&e.hpLoss>0).length,0);if(enemyId!==3291)assert.ok(s.damageEvents.some(e=>e.type==='percent'&&e.settledDamage===hp/2));}
});
test('3512三个献祭技能被初始控制阻挡均不耗体不授予队伍效果，也不以自身魂印保命伪造成功',()=>{
 for(const id of [25861,31505,31506]){const s=make(id,{aHp:1000});s.fighters[0].ailments['疲惫']=2;const o=turn(s,id);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].pp['wiki:'+id],source.moves.find(m=>m.id===id).pp);assert.deepEqual(o.fighters[1].ailments,{});assert.equal(o.teamStatusBlock753,undefined);}
});
test('3512魂印821首两回合致死红伤保留一血并按完整伤害反弹，原本一血也反弹，第三回合真实阵亡',()=>{
 let s=make(10001,{enemyId:2988,enemyMoves:[10018],aHp:200,aStats:{def:30},bStats:{atk:2000}});for(const r of [1,2,3]){s=turn(s,pp,10018);const events=s.damageEvents.filter(e=>e.round===r),hit=events.find(e=>e.type==='attack'&&e.sourceSide===1);assert.ok(hit.settledDamage>200);assert.equal(hit.hpLoss,r===1?199:r===2?0:1);assert.equal(s.fighters[0].hp,r<3?1:0);const reflection=events.filter(e=>e.type==='fixed'&&e.sourceSide===0);assert.equal(reflection.length,r<3?1:0);if(r<3)assert.equal(reflection[0].settledDamage,hit.settledDamage);}
});
test('3512魂印821首两回合免疫原生毒粉，第三回合失去免异并实际受到周期中毒伤害',()=>{
 let s=make(10001,{enemyId:4693,enemyMoves:[20020]});for(const r of [1,2,3]){s=turn(s,pp,20020);assert.equal(E.SOULS.trait(s.fighters[0],'ailmentImmune'),r<3);if(r<3){assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.equal(s.fighters[0].hp,9000);}else{assert.ok(s.fighters[0].ailments['中毒']>=3);assert.ok(s.fighters[0].hp<9000);}}
});
test('3512魂印821真实被击败才给下一只当前两回合红伤固定各减半，切入回合占时且到期固定恢复五十',()=>{
 let g=T.create([[member(3512,10001,{def:30}),member(2989)],[member(2988,10018,{atk:2000}),member(3056,10716)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=200;for(let r=1;r<=3;r++)g=T.turn(g,[pp,'wiki:10018']);assert.equal(g.phase,'replace');assert.equal(g.slots[0][0].fighter.hp,0);g=T.replace(g,[1,null]);const start=g.battle.round;assert.deepEqual(g.battle.fighters[0].effects['魂印821后继减伤'],{start,end:start+1});g=T.turn(g,[pp,{switchTo:1}]);for(const reduced of [true,false]){g=T.turn(g,[pp,'wiki:10716']);const round=g.battle.turns.at(-1).round,events=g.battle.damageEvents.filter(e=>e.round===round&&e.sourceSide===1);assert.equal(events.find(e=>e.type==='fixed').settledDamage,reduced?25:50);const red=events.find(e=>e.type==='attack').settledDamage;const a=g.battle.fighters[1],b=g.battle.fighters[0],move=g.battle.moveDefinitions['wiki:10716'],base=Math.floor(Math.floor(42*move.power*a.stats.atk/b.stats.def)/50)+2,factor=E.sameTypeBonus(move.type,a.type,g.battle.typeChart)*E.typeEffectiveness(move.type,b.type,g.battle.typeChart)*(reduced?.5:1);assert.ok(red>=Math.floor(base*factor*.85)&&red<=Math.floor(base*factor),JSON.stringify({red,base,factor}));}assert.equal(g.battle.fighters[0].effects['魂印821后继减伤'],undefined);
});
