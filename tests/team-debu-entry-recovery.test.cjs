'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,T,entry}=require('./helpers/team-debu-entry.cjs'),D=require('../dist/battle-display.js');
test('德布比特真实死亡补位按双方当前场下零至十名阵亡，逐档授三回体力标记和当回合免弱免异常必先封技',()=>{
 for(let n=0;n<=10;n++){
  const g=entry(n),a=g.battle.fighters[0],b=g.battle.fighters[1],round=g.battle.round;
  const rec=a.soulState.healthStates?.['回体Ⅰ'],lost=b.soulState.healthStates?.['失体Ⅰ'];assert.equal(!!rec,n>=2,'回体 '+n);assert.equal(!!lost,n>=2,'失体 '+n);if(n>=2){assert.equal(rec.end,round+2);assert.equal(lost.end,round+2);}
  for(const [f,key,threshold]of [[a,'免弱',4],[a,'免异常',6],[a,'所有技能必定先手',8],[b,'skillBlock',10]]){assert.equal(!!f.effects[key],n>=threshold,key+' '+n);if(n>=threshold)assert.equal(f.effects[key].end,round);}
 }
});
test('德布比特四死档真实免疫凝神不语的攻击弱化，三死档仍受弱化',()=>{
 for(const n of [3,4]){let g=entry(n,{foeId:4676,foeSkills:[11027,19470],killSkill:11027});g=T.turn(g,['potion:pp','wiki:19470']);assert.equal(g.battle.fighters[0].stages.spd,n===4?0:-1);assert.equal(g.battle.fighters[0].stages.acc,n===4?0:-1);}
});
test('德布比特六死档真实免疫必中负荷电频麻痹，五死档仍进入麻痹',()=>{
 for(const n of [5,6]){let g=entry(n,{foeId:4829,foeSkills:[38133],killSkill:38133});g=T.turn(g,['potion:pp','wiki:38133']);assert.equal((g.battle.fighters[0].ailments['麻痹']??0)>=g.battle.round-1,n===5);}
});
test('德布比特八死档真实低速攻击仍先于高速对手，七死档不必先；十死档敌气力耗PP但不强化',()=>{
 for(const n of [7,8]){let g=entry(n,{ownStats:{spe:1}});const move=g.battle.fighters[0].moves.find(k=>g.battle.moveDefinitions[k].kind!=='status'&&g.battle.moveDefinitions[k].power>0);g=T.turn(g,[move,'wiki:10127']);assert.equal(g.battle.turns.at(-1).first,n===8?0:1);}
 for(const n of [9,10]){let g=entry(n);const before=g.battle.fighters[1].pp['wiki:20117'];g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].pp['wiki:20117'],before-1);assert.equal(g.battle.fighters[1].stages.atk,n===9?1:0);}
});
test('德布比特按双方各自场下阵亡数叠加魂印红伤与已答20%固粉，原36553原生红增伤和100附固独立叠加',()=>{
 for(const own of [1,2]){
  let g=entry(3,{ownFallen:own,ownSkills:[14897],ownHp:4000});g=T.turn(g,['wiki:14897','potion:pp']);const events=g.battle.turns.at(-1).events,trace=events.find(e=>/^威力 60/.test(e.detail??''))?.detail;assert.ok(trace,JSON.stringify(events));assert.match(trace,new RegExp('增减伤 '+(1+own*.2)+'(?: ×|\\b)'));assert.equal(g.battle.damageEvents.find(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='fixed').settledDamage,50*(1+.2*(3-own)));assert.equal(g.battle.fighters[0].hp,4100);
  g=entry(3,{ownFallen:own,ownSkills:[28285]});g=T.turn(g,['wiki:28285','potion:pp']);assert.equal(g.battle.damageEvents.find(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='percent').settledDamage,3000*(1+.2*(3-own)));
 }
 let g=entry(3,{ownFallen:1});g=T.turn(g,['wiki:36553','potion:pp']);const trace=g.battle.turns.at(-1).events.find(e=>/^威力 160/.test(e.detail??''))?.detail;assert.match(trace,/增减伤 1\.44/);assert.equal(g.battle.damageEvents.find(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='fixed').settledDamage,280);
});
test('德布比特体力标记按持有者离场清除，来源返场重授并刷新仍在场敌标记为三回',()=>{
 let g=entry(2);g=T.turn(g,[{switchTo:3},'potion:pp']);assert.ok(!g.slots[0][1].fighter.soulState.healthStates?.['回体Ⅰ']);assert.ok(g.battle.fighters[1].soulState.healthStates?.['失体Ⅰ']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.healthStates['回体Ⅰ'].end,g.battle.round+1);assert.equal(g.battle.fighters[1].soulState.healthStates['失体Ⅰ'].end,g.battle.round+1);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.ok(!g.slots[1][0].fighter.soulState.healthStates?.['失体Ⅰ']);assert.ok(!g.battle.fighters[1].soulState.healthStates?.['失体Ⅰ']);assert.ok(g.battle.fighters[0].soulState.healthStates?.['回体Ⅰ']);
});
test('德布比特真实三回体力标记自然消失后清敌原生回合与气力强化，下回合分别封攻封属后到期',()=>{
 let g=entry(2,{foeSkills:[10127,20117,23285]});g=T.turn(g,['potion:pp','wiki:20117']);g=T.turn(g,['potion:pp','wiki:23285']);assert.equal(g.battle.fighters[1].stages.atk,1);assert.ok(g.battle.fighters[1].effects['必定暴击']);g=T.turn(g,['potion:pp','potion:pp']);assert.ok(!g.battle.fighters[0].soulState.healthStates?.['回体Ⅰ']);assert.ok(!g.battle.fighters[1].soulState.healthStates?.['失体Ⅰ']);assert.equal(g.battle.fighters[1].stages.atk,0);assert.equal(g.battle.fighters[1].effects['必定暴击'],undefined);
 const attack=T.turn(g,['potion:pp','wiki:10127']);assert.ok(!attack.battle.damageEvents.some(e=>e.round===g.battle.round&&e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,0);g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,1);
});
test('德布比特中文显示本次入场阵亡数、两方独立增伤与体力标记期限，读取不改真实战斗或随机序列',()=>{
 const g=entry(3,{ownFallen:1}),before=structuredClone(g),items=D.fighter(g.battle.fighters[0],g.battle.round).items,team=D.team(g,0);assert.equal(items.find(x=>x.name==='本次登场双方场下阵亡').value,'3 只');assert.equal(team.find(x=>x.name==='回体Ⅰ · 攻击增伤').value,'+20% · 己方场下阵亡 1 只');assert.equal(team.find(x=>x.name==='失体Ⅰ · 固定、百分比增伤').value,'+40% · 对方场下阵亡 2 只');assert.ok(E.describeEffects(g.battle.fighters[0],g.battle.round).includes('回体Ⅰ · 余 3 回合'));assert.deepEqual(g,before);
});
test('德布比特真实解放遵守魂印回体消失后的清回合顺序：仅失体时封换，回体同时消失则被清除',()=>{
 let g=entry(0,{ownSkills:[36552,28285]});g=T.turn(g,['wiki:36552','potion:pp']);assert.ok(!g.battle.fighters[0].soulState.liberation1971);assert.ok(T.candidates(g,1).length>0);
 g=entry(0,{ownSkills:[36552,28285]});g=T.turn(g,['wiki:28285','potion:pp']);assert.ok(!g.battle.fighters[0].soulState.healthStates?.['回体Ⅰ']);assert.ok(g.battle.fighters[1].soulState.healthStates?.['失体Ⅰ']);g=T.turn(g,['wiki:36552','potion:pp']);assert.equal(g.battle.fighters[0].soulState.liberation1971.removed,1);assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,['potion:pp','potion:pp']);assert.ok(T.candidates(g,1).length>0);
 // The existing 4499 independent test confirms that soul1714 clears the freshly
 // granted priority effect at phase end when the holder's own recovery mark disappears.
 // The same clear must also remove the actual switch lock, rather than exempt it.
 g=entry(3,{ownSkills:[36552]});g=T.turn(g,['wiki:36552','potion:pp']);assert.equal(g.battle.fighters[0].soulState.liberation1971.removed,2);assert.ok(T.candidates(g,1).length>0);assert.equal(g.battle.fighters[1].effects['不能主动切换'],undefined);assert.equal(g.battle.fighters[1].effects['先制效果失效'],undefined);assert.equal(g.battle.fighters[1].effects.attackBlock.start,g.battle.round);
});
