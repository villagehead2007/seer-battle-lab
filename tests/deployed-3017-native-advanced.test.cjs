'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3017-native.cjs'),pp='potion:pp';
const damage=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);
test('3017恐怖15命中必定害怕但原50命中自然有MISS，免异阻挡；陷地22一成疲惫持续两轮后恢复行动',()=>{
 let fear=0,miss=0,fatigue=0,none=0,witness;for(let seed=1;seed<=64;seed++){let s=turn(make(20299,{seed}),20299);if(s.fighters[1].ailments['害怕']>=1)fear++;else miss++;s=turn(make(10762,{seed,enemyMoves:[10086]}),10762,10086);if(s.fighters[1].ailments['疲惫']>=1){fatigue++;witness??=s;assert.equal(s.fighters[1].pp['wiki:10086'],35);}else none++;}assert.ok(fear>0&&miss>0&&fatigue>0&&none>0);let s=turn(make(20299,{aStages:{acc:6},enemyId:3550}),20299);assert.equal(s.fighters[1].ailments['害怕'],undefined);s=turn(make(10762,{enemyId:3550}),10762);assert.equal(s.fighters[1].ailments['疲惫'],undefined);assert.equal(witness.fighters[1].ailments['疲惫'],2);witness=turn(witness,pp,10086);assert.equal(witness.fighters[1].pp['wiki:10086'],35);witness=turn(witness,pp,10086);assert.equal(witness.fighters[1].pp['wiki:10086'],34);
});
test('3017元素29只附75固定，星皇免固定保留红伤；龙牙593防御原面板20%不计正零负能力等级',()=>{
 for(const enemyId of[2989,3291]){const s=turn(make(10761,{enemyId}),10761);assert.equal(damage(s,'fixed'),enemyId===3291?0:75);assert.ok(damage(s,'attack')>0);}
 for(const grade of[-2,0,2]){const s=turn(make(16397,{aStages:{def:grade,acc:6}}),16397);assert.equal(damage(s,'percent'),800);assert.equal(s.fighters[0].stages.def,grade+2);}const s=turn(make(16397,{enemyId:3291,aStages:{acc:6}}),16397);assert.equal(damage(s,'percent'),0);
});
test('3017图腾43恢复整条最大体力且原PP仅1用后归零，技能禁疗阻挡回复，近满体封顶',()=>{
 for(const hp of[1,1000,8999]){const s=turn(make(20337,{aHp:hp}),20337);assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[0].pp['wiki:20337'],0);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes('wiki:20337'));}const s=turn(make(20337,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}}),20337);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[0].stages.def,2);
});
test('3017狂龙意志不破龙魂龙魂不灭三57各当前五三四轮用招回三分一，药剂不触发且禁疗阻挡',()=>{
 for(const[id,last]of[[22830,5],[23529,3],[24695,4]]){let s=turn(make(id,{aHp:1000,extraMoves:[20139]}),id);assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[0].effects.id57.end,last);s=turn(s,pp);assert.equal(s.fighters[0].hp,4000);for(let r=3;r<=last+1;r++){s=turn(s,20139);assert.equal(s.turns.at(-1).events.some(e=>e.kind==='heal'&&e.text.includes('持续用招回复')),r<=last);}s=turn(make(id,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:6}}}),id);assert.equal(s.fighters[0].hp,1000);}
});
test('3017狂龙破588仅先手速度加一后手不加，正六封顶禁强化阻挡而魂印双防另计',()=>{
 for(const fast of[true,false]){const s=turn(make(16395,{enemyId:3017,enemyMoves:[16395],aStats:{spe:fast?9999:1},bStats:{spe:1000}}),16395,16395);assert.equal(s.turns[0].first,fast?0:1);assert.equal(s.fighters[0].stages.spe,fast?1:0);}let s=turn(make(16395,{aStages:{spe:6}}),16395);assert.equal(s.fighters[0].stages.spe,6);s=turn(make(16395,{aEffects:{禁强化:{start:1,end:3}}}),16395);assert.equal(s.fighters[0].stages.spe,0);
});
test('3017猛龙48三轮免睡第四轮可睡，觉醒191五轮反弹睡眠第六轮不反弹',()=>{
 for(const[id,last,reflect]of[[23528,3,false],[24696,5,true]])for(const when of[last,last+1]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);for(let r=2;r<=when;r++)s=turn(s,pp,r===when?22053:pp);if(when===last){assert.equal(s.fighters[0].ailments['睡眠'],undefined);if(reflect)assert.ok(s.fighters[1].ailments['睡眠']>=last);}else{assert.ok(s.fighters[0].ailments['睡眠']>=when);assert.equal(s.fighters[1].ailments['睡眠'],undefined);}}
});
test('3017猛龙406受击65概率回100自然有成功失败，药剂不触发第3轮有效第4轮失效，技能禁疗阻挡',()=>{
 let yes=0,no=0,third=0;for(let seed=1;seed<=32;seed++){let s=turn(make(23528,{seed,aHp:1000,enemyMoves:[10086]}),23528,10086),red=damage(s,'attack',1),heal=s.fighters[0].hp-1000+red;assert.ok([0,100].includes(heal));if(heal)yes++;else no++;s=turn(s,pp);const hp=s.fighters[0].hp;s=turn(s,pp,10086);const n=s.fighters[0].hp-hp+damage(s,'attack',1);assert.ok([0,100].includes(n));if(n)third++;const before=s.fighters[0].hp;s=turn(s,pp,10086);assert.equal(s.fighters[0].hp,before-damage(s,'attack',1));}assert.ok(yes>0&&no>0&&third>0);let s=turn(make(23528,{aHp:1000}),23528);assert.equal(s.fighters[0].hp,1000);s=turn(make(23528,{aHp:1000,enemyMoves:[10086],aEffects:{'无法通过自身技能恢复体力':{start:1,end:4}}}),23528,10086);assert.equal(s.fighters[0].hp,1000-damage(s,'attack',1));
});
test('3017怒爪635真正吸收穿梭强化成功仅下轮先制一，空强化或繁苍保护无先制，776独立下轮红伤倍增不翻固定',()=>{
 let s=make(19205,{extraMoves:[10761],enemyMoves:[20889,10086],aStats:{spe:1},bStats:{spe:1000}});s=turn(s,pp,20889);s=turn(s,19205);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[0].stages.spe,1);s=turn(s,10761,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,1);assert.equal(s.turns.at(-1).first,0);assert.equal(damage(s,'fixed'),75);const base=Math.floor(Math.floor(42*80*3600/4000)/50)+2;assert.ok(damage(s,'attack')>=Math.floor(base*1.5*2*.85)&&damage(s,'attack')<=Math.floor(base*1.5*2));s=turn(s,10761,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.ok(damage(s,'attack')<=Math.floor(base*1.5));
 for(const protect of[false,true]){s=make(19205,{extraMoves:[10761],enemyId:protect?3549:2989,enemyMoves:protect?[29392]:[]});if(protect)s=turn(s,pp,29392);const before={...s.fighters[1].stages};s=turn(s,19205);assert.deepEqual(s.fighters[1].stages,before);s=turn(s,10761);assert.equal(s.fighters[0].soulState.resolvedPriority.value,protect?-2:0);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0&&e.detail.includes('增减伤 '+(protect?'1 ':'2 '))));}
});
test('3017龙魂619仅下两轮对手全部技能先制减一，实际属性攻击均减且第三轮恢复零，PP药独立正常',()=>{
 let s=turn(make(24695,{enemyMoves:[20889,10086],aStats:{spe:1},bStats:{spe:9999}}),24695);for(const[id,priority]of[[20889,-1],[10086,-1],[10086,0]]){if(s.fighters[1].pp['wiki:'+id]===0)s=turn(s,pp,pp);s=turn(s,pp,id);assert.equal(s.fighters[1].soulState.resolvedPriority.value,priority);}assert.equal(s.fighters[1].pp['wiki:10086'],33);
});
test('3017觉醒863仅后手使对方下1轮攻击无效，属性不受封锁且第三轮攻击恢复；先手不封',()=>{
 for(const fast of[false,true]){let s=turn(make(24696,{aStats:{spe:fast?9999:1},bStats:{spe:1000},enemyMoves:[10086,20889]}),24696,10086);assert.equal(s.turns[0].first,fast?0:1);s=turn(s,pp,10086);assert.equal(damage(s,'attack',1)>0,fast);s=turn(s,pp,10086);assert.ok(damage(s,'attack',1)>0);}
 let s=turn(make(24696,{aStats:{spe:1},bStats:{spe:9999},enemyMoves:[20889]}),24696,20889);s=turn(s,pp,20889);assert.equal(s.fighters[1].stages.spe,2);
});
test('3017肉身9连续威力150180210240240封顶，实际其它招打断后150，672本招击败才回满且禁疗可阻挡',()=>{
 let s=make(19207,{aStages:{acc:6},extraMoves:[10611]});for(const power of[150,180,210,240,240]){s=turn(s,19207);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0&&e.detail.startsWith('威力 '+power+' ')));}s=turn(s,10611);s=turn(s,pp);s=turn(s,19207);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0&&e.detail.startsWith('威力 150 ')));
 s=turn(make(19207,{aHp:1000,aStages:{acc:6},bHp:1}),19207);assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].hp,9000);s=turn(make(19207,{aHp:1000,aStages:{acc:6}}),19207);assert.ok(s.fighters[0].hp<9000);s=turn(make(19207,{aHp:1000,aStages:{acc:6},bHp:1,aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}}),19207);assert.equal(s.fighters[1].hp,0);assert.ok(s.fighters[0].hp<9000);
});
test('3017第五180清真实必暴回合，685及434只认出招时正级不借末魂印冒充，正级固定200与五成害怕独立',()=>{
 let s=make(19208,{enemyMoves:[20355]});s=turn(s,pp,20355);assert.ok(s.fighters[1].effects['必定暴击']);s=turn(s,19208);assert.equal(s.fighters[1].effects['必定暴击'],undefined);assert.equal(damage(s,'fixed'),200);
 s=turn(make(19208),19208);assert.equal(damage(s,'fixed'),0);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.equal(s.fighters[0].stages.def,2);
 let yes=0,no=0;for(let seed=1;seed<=32;seed++){s=turn(make(19208,{seed,aStages:{spe:1}}),19208);assert.equal(damage(s,'fixed'),200);if(s.fighters[1].ailments['害怕']>=1)yes++;else no++;}assert.ok(yes>0&&no>0);s=turn(make(19208,{aStages:{spe:1},enemyId:3291}),19208);assert.equal(damage(s,'fixed'),0);s=turn(make(19208,{aStages:{spe:1},enemyId:3550}),19208);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.equal(damage(s,'fixed'),0);
});
