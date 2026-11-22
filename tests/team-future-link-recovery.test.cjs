'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[],stats={}){
 const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);
 const wanted=new Set(skills);
 for(const k of skills)if(!moves.includes(k)){const index=moves.findIndex((id,i)=>i>0&&!wanted.has(id));assert.ok(index>0);moves[index]=k;}
 return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};
}
const links=g=>g.slots[0].map(x=>x.fighter.soulState.futureLink??0);
const red=g=>g.battle.damageEvents.filter(e=>e.round===g.battle.round-1&&e.sourceSide===1&&e.targetSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);
test('未来链接真实开战只给其他队友三层，旋风取最低替补水火并逐位耗尽，随后才扣在场草系层数',()=>{
 let g=T.create([[member(4647),member(4600),member(4648),member(4649)],[member(2988,[10054],{spa:1800})]],[0,0],{seed:14,criticals:false});
 assert.deepEqual(links(g),[3,0,3,3]);assert.ok(!g.battle.fighters[1].soulState.futureLink);
 const untouched=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='未来链接守护').value,/斯布林蒂.*最低.*消耗 1 级/);assert.deepEqual(g,untouched);
 for(let i=0;i<7;i++){
  const before=links(g),best=i<3?2:i<6?3:0,control=structuredClone(g);delete control.battle.fighters[0].soulState.futureLink;
  const ordinary=T.turn(control,['potion:pp','wiki:10054']);g=T.turn(g,['potion:pp','wiki:10054']);
  assert.ok(red(ordinary)>0);assert.ok(Math.abs(red(g)-red(ordinary)*(i<6?.5:1))<=1);
  for(let j=0;j<before.length;j++)assert.equal(links(g)[j],before[j]-(j===best?1:0),JSON.stringify({i,j,best,before,actual:links(g),hp:g.slots[0].map(s=>s.fighter.hp)}));
 }
});
test('斯布林蒂原零至三级交接仍同步PP体力上限，未注明保留的同步上限随持有者下场还原',()=>{
 for(const level of [0,1,2,3]){
  let g=T.create([[member(4600,[],{maxHp:6000}),member(3102),member(2988)],[member(3056)]],[0,0],{seed:14,criticals:false});
  const source=g.battle.fighters[0],next=g.slots[0][1].fighter;source.hp=3000;next.hp=2000;next.soulState.futureLink=level;
  source.moves.forEach((k,i)=>source.pp[k]=i);for(const k of next.moves)next.pp[k]=0;
  const pp=source.moves.map(k=>source.pp[k]);g=T.turn(g,[{switchTo:1},'potion:pp']);const active=g.battle.fighters[0];
  assert.equal(active.stats.maxHp,level===3?6000:9000);assert.equal(active.hp,level>=2?3000:2000);
  active.moves.forEach((k,i)=>assert.equal(active.pp[k],level>=1?Math.min(active.teamPPDefinitions[k].pp,pp[i]):0));
  if(level===3){g=T.turn(g,[{switchTo:2},'potion:pp']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].stats.maxHp,9000);assert.equal(g.battle.fighters[0].hp,3000);}
 }
});
test('斯布林蒂实际被击败按各替补实存三一零级清除并各回900三PP或300一PP，封顶且不复活尸体',()=>{
 let g=T.create([[member(4600,[],{maxHp:1,def:1}),member(3056),member(3102),member(4647),member(2988)],[member(3056,[10127],{atk:9999})]],[0,0],{seed:14,criticals:false});
 const hp=[8800,4000,2000,0],levels=[3,1,0,3];
 g.slots[0].slice(1).forEach((slot,i)=>{slot.fighter.hp=hp[i];slot.fighter.soulState.futureLink=levels[i];for(const k of slot.fighter.moves)slot.fighter.pp[k]=0;});
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.deepEqual(links(g),[0,0,0,0,0]);
 assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),[9000,4300,2000,0]);
 g.slots[0].slice(1).forEach((slot,i)=>{for(const k of slot.fighter.moves)assert.equal(slot.fighter.pp[k],i===3?0:Math.min(slot.fighter.teamPPDefinitions[k].pp,levels[i]));});
 g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].stats.maxHp,9000);assert.ok(!g.battle.fighters[0].soulState.futureLink);
});
test('链接队友真实被击败立刻失去自己的剩余链接，其他队友不扣且源仍存活时不把死者层数转给继任者',()=>{
 let g=T.create([[member(3102,[],{maxHp:1,def:1}),member(4600),member(4649)],[member(3056,[10127],{atk:9999})]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.ok(!g.battle.fighters[0].soulState.futureLink);assert.equal(g.slots[0][2].fighter.soulState.futureLink,3);assert.ok(g.slots[0][1].fighter.hp>0);g=T.replace(g,[2,null]);assert.equal(g.battle.fighters[0].soulState.futureLink,3);
});
test('未来链接三层使原零奇点享受层数门槛，真实解析后随机双异常只耗原一奇点免一次，链接仅扣防御触发一级',()=>{
 let g=T.create([[member(4450),member(4600),member(3056)],[member(3328,[30547]) ]],[0,0],{seed:14,criticals:false});
 assert.equal(g.battle.fighters[0].soulState.futureSingularity??0,0);assert.equal(g.battle.fighters[0].soulState.futureLink,3);
 g=T.turn(g,['potion:pp','wiki:30547']);assert.equal(g.battle.fighters[0].soulState.futureRoundLayers,3);assert.equal(g.battle.fighters[0].soulState.futureSingularity,0);assert.equal(links(g).reduce((n,k)=>n+k,0),5);assert.equal(Object.values(g.battle.fighters[0].ailments).filter(end=>end>=g.battle.round).length,1);
});
test('未来链接真实让零原奇点在回初获得免PP门槛，第五不受非第五回PP掩盖，同态无链接对照仍真实耗一PP',()=>{
 const ready=T.create([[member(4450),member(4600)],[member(3102,[10127])]],[0,0],{seed:14,criticals:false}),control=structuredClone(ready);delete control.battle.fighters[0].soulState.futureLink;const initial=ready.battle.fighters[0].pp['wiki:36302'];const actual=T.turn(ready,['wiki:36302','wiki:10127']),ordinary=T.turn(control,['wiki:36302','wiki:10127']);assert.equal(actual.battle.fighters[0].pp['wiki:36302'],initial);assert.equal(ordinary.battle.fighters[0].pp['wiki:36302'],initial-1);assert.equal(actual.battle.fighters[0].soulState.futureRoundLayers,3);
});
test('未来链接不抵消指令消耗，真换返恢复三指令并清增伤，已崩溃槽本场仍禁用',()=>{
 for(const original of [0,1]){
 let g=T.create([[member(4604,[37110]),member(4600)],[member(3056)]],[0,0],{seed:14,criticals:false});
 const f=g.battle.fighters[0];f.soulState.futureInstructions1809=original;f.effects.attackBlock={start:1,end:1};for(const k of f.moves)f.pp[k]=0;assert.ok(E.availableMoves(f,1).includes('wiki:37110'));
 g=T.turn(g,['wiki:37110','potion:pp']);assert.equal(g.battle.fighters[0].soulState.futureInstructions1809,0);assert.equal(g.battle.fighters[0].soulState.futureLink,3);assert.equal(!!g.battle.fighters[0].soulState.collapsedSkills1809['wiki:37110'],original===0);assert.equal(E.availableMoves(g.battle.fighters[0],g.battle.round).includes('wiki:37110'),original===1);
 g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.futureInstructions1809,3);assert.equal(g.battle.fighters[0].soulState.collapsedCount1809,0);assert.equal(E.availableMoves(g.battle.fighters[0],g.battle.round).includes('wiki:37110'),original===1);assert.equal(E.SOULS.trait(g.battle.fighters[0],'attackMultiplier'),1);const untouched=structuredClone(g);if(original===0)assert.match(D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name==='崩溃招式').value,/本场不可再用.*下场保留/);assert.deepEqual(g,untouched);
 }
});
test('未来链接不抵消原零指令真实崩溃，未明说保留的免控先制增伤依统一下场重置',()=>{
 for(const skill of [28598,28599]){
  let g=T.create([[member(4604,[skill,37124],{spe:9999}),member(4600)],[member(4829,[38133],{spe:100})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].soulState.futureInstructions1809=0;g.battle.fighters[0].effects.statusBlock={start:1,end:1};g=T.turn(g,['wiki:'+skill,'potion:pp']);assert.ok(g.battle.fighters[0].soulState.collapsedSkills1809['wiki:'+skill]);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.collapsedCount1809,0);
  if(skill===28598){assert.equal(g.battle.fighters[0].soulState.saffControlImmune1809??false,false);assert.equal(g.battle.fighters[0].effects.reflect,undefined);g=T.turn(g,['potion:pp','wiki:38133']);assert.ok(g.battle.fighters[0].ailments['麻痹']);}
  else{assert.equal(g.battle.fighters[0].soulState.saffCollapsePriority1809??0,0);assert.equal(g.battle.fighters[0].effects.id984,undefined);g=T.turn(g,['wiki:37124','potion:pp']);assert.equal(g.battle.fighters[0].soulState.resolvedPriority.value,1);}
 }
});
test('斯布林蒂三级同步实际给未首登复合队友的御主位6000上限3000当前HP及各槽二PP，主副换位不丢共享上限',()=>{
 let g=T.create([[member(4600,[],{maxHp:6000}),member(4950,[38568])],[member(3102)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=3000;for(const k of g.battle.fighters[0].moves)g.battle.fighters[0].pp[k]=2;g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.group2149.master,'yu');assert.equal(g.battle.fighters[0].stats.maxHp,6000);assert.equal(g.battle.fighters[0].hp,3000);assert.ok(Object.values(g.battle.fighters[0].pp).every(n=>n===2));g=T.turn(g,['wiki:38568','potion:pp']);assert.equal(g.battle.fighters[0].soulState.group2149.master,'yue');assert.equal(g.battle.fighters[0].stats.maxHp,6000);assert.ok(g.battle.fighters[0].hp<=6000);assert.ok(D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions).group.members.every(m=>m.hp<=m.maxHp));
});
test('未来链接联动真实封属耗尽三道才崩溃，真换返恢复三指令但不重发已废弃技能',()=>{
 let g=T.create([[member(4604,[28599],{spe:9999}),member(4600)],[member(4676),member(3056)]],[0,0],{seed:14,criticals:false});
 const choices=['potion:pp',{switchTo:1},{switchTo:0},{switchTo:1}];
 for(let i=0;i<4;i++){g=T.turn(g,['wiki:28599',choices[i]]);assert.equal(g.battle.fighters[0].soulState.futureInstructions1809,Math.max(0,2-i));assert.equal(g.battle.fighters[0].soulState.collapsedCount1809,i===3?1:0);assert.equal(g.battle.fighters[0].soulState.futureLink,3);assert.ok(!g.battle.fighters[0].soulState.chiyong1878?.layers);assert.ok(g.battle.fighters[0].hp>0);}
 g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.futureInstructions1809,3);assert.equal(g.battle.fighters[0].soulState.collapsedCount1809,0);assert.ok(!E.availableMoves(g.battle.fighters[0],g.battle.round).includes('wiki:28599'));
});
