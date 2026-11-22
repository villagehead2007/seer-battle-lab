'use strict';
// Presentation components only; no new original-resource acquisition certification.
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),P=require('../dist/battle-presentation.js');
function member(id,soul,build={}){const snapshot=S.species(id);if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build};}
test('对战魂印全文严格对应实际所选版本和hash，双方及其他版本不串用',()=>{
 for(const id of[558,566]){const m=member(3223,id),g=T.create([[m],[member(4800)]],[0,0],{seed:14}),f=g.battle.fighters[0],source=m.snapshot.souls.find(s=>s.id===id),before=structuredClone(g);const soul=P.soul(f,m.snapshot);assert.equal(soul.id,id);assert.equal(soul.hash,source.hash);assert.equal(soul.text,source.description);assert.deepEqual(g,before);}
});
test('双方在场成员的特性星级参数套装抗性独立，未配置明确为无且读取不改状态',()=>{
 const strong=E.CHARACTERISTICS.groups.find(g=>g.name==='强袭');assert.ok(strong);const g=T.create([[member(4762,null,{characteristic:{groupId:strong.id,star:3},suit:'royal',resistance:{critical:35,fixed:40,percent:20,major:'中毒'}}),member(2989)],[member(4800)]],[0,0],{seed:14}),before=structuredClone(g),a=P.equipment(g.battle.fighters[0]),b=P.equipment(g.battle.fighters[1]);assert.match(a.characteristic,/强袭/);assert.match(a.characteristicEffect,/\d/);assert.equal(a.suit,'皇御');assert.match(a.resistance,/35%/);assert.match(a.ailments,/中毒/);assert.equal(b.characteristic,'无特性');assert.equal(b.suit,'不穿套装');assert.equal(b.ailments,'无异常抗性');assert.deepEqual(g,before);
});
test('595原术语提供状态通用解释与当前值，亮节咒怨和神圣之霆均有真实条件，无臆造上限',()=>{
 for(const [name,value,expected]of[['亮节','余 3 回合','50%'],['魔王咒怨','2 层','10层'],['神圣之霆','1 / 6 道','神圣之霆']]){const text=P.explain({name,value},null,null);assert.ok(text.includes(value));assert.ok(text.includes(expected));}const text=P.explain({name:'魔王咒怨',value:'2 层'},null,null);assert.ok(!text.includes('上限10'));assert.match(text,/达到10层/);
});
test('双向属性展示各自使用实际在场属性及本局克制表，仅读基础属性倍率',()=>{
 const g=T.create([[member(4762)],[member(4800)]],[0,0],{seed:14}),before=structuredClone(g);for(const side of[0,1]){const f=g.battle.fighters[side],t=g.battle.fighters[1-side],a=P.affinity(f,t,g.battle);assert.equal(a.from,f.type);assert.equal(a.to,t.type);assert.equal(a.multiplier,E.typeEffectiveness(f.type,t.type,g.battle.typeChart));assert.match(a.note,/不含增伤、减伤/);}assert.deepEqual(g,before);
});
test('默认单宠入口也使用原魂完整正文与准确hash，内部效果标签不误认成同名术语',()=>{
 const g=E.createBattle();for(const [side,id]of[[0,3291],[1,3142]]){const f=g.fighters[side],source=S.species(id).souls.find(s=>s.id===f.soulId),out=P.soul(f);assert.equal(out.hash,source.hash);assert.equal(out.text,source.description);}assert.equal(P.explain('湮灭实际用招低体吸取 · 余 3 回合',null,null),'湮灭实际用招低体吸取 · 余 3 回合');
});
test('原崩解实际授予的低体吸取状态使用本精灵原技能解释，不串入圣诰邪诲同名术语',()=>{
 const m=member(4762),n=member(4800),move=m.snapshot.moves.find(m=>m.name==='崩解·万念劫灰');let g=T.create([[m],[n]],[0,0],{seed:14});g=T.turn(g,['wiki:'+move.id,'potion:pp']);const f=g.battle.fighters[0],text=E.describeEffects(f,g.battle.round).find(t=>t.startsWith('用招时低体吸取'));assert.ok(text);const help=P.explain(text,f,g.battle,[m.snapshot,n.snapshot]);assert.ok(help.includes(move.name));assert.ok(help.includes(move.description));assert.ok(!help.includes('圣诰'));assert.ok(!help.includes('极渊'));
});
test('原烈武天征持续吸取日志不借用极渊名，原咤克斯真实授盾按通用护盾显示且未知队伍项不借用当前魂印',()=>{
 const build={overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}},a=member(4762,null,build),b=member(4800,null,build),skill=b.snapshot.moves.find(m=>m.name==='烈武天征'),fifth=b.snapshot.moves.find(m=>m.fifth);let g=T.create([[a],[b]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp','wiki:'+skill.id]);const events=g.battle.turns.at(-1).events.map(e=>e.text).join('\n');assert.match(events,/持续低体吸取/);assert.ok(!events.includes('极渊'));g=T.turn(g,['potion:pp','wiki:'+fifth.id]);const f=g.battle.fighters[0];assert.ok(f.suitState.shield>0);const labels=E.describeEffects(f,g.battle.round);assert.ok(labels.some(x=>x.startsWith('护盾 · ')));assert.ok(!labels.some(x=>x.startsWith('裁决护盾')));assert.equal(P.explain({name:'50回合存活计数',value:'1 只'},f,g.battle,[a.snapshot,b.snapshot]),'50回合存活计数 · 1 只');
});
test('快速重开的完整初始队伍配置未被真实战斗污染，同配置新建重置全部HP与PP状态计数日志并重授首发',()=>{
 const strong=E.CHARACTERISTICS.groups.find(g=>g.name==='强袭'),settings={seed:'ui-restart-original',criticals:false},teams=[[member(4762,null,{characteristic:{groupId:strong.id,star:3},suit:'royal',resistance:{critical:35}}),member(3223,558)],[member(4800),member(2989)]],initial=structuredClone({teams,leads:[0,0],settings}),bytes=JSON.stringify(initial),baseline=T.create(initial.teams,initial.leads,initial.settings);let current=structuredClone(baseline);const a=teams[0][0].snapshot.moves.find(m=>m.name==='崩解·万念劫灰'),b=teams[1][0].snapshot.moves.find(m=>m.name==='烈武天征');current=T.turn(current,['wiki:'+a.id,'wiki:'+b.id]);current=T.turn(current,[{switchTo:1},'potion:pp']);assert.notDeepEqual(current,baseline);assert.equal(JSON.stringify(initial),bytes);const restarted=T.create(initial.teams,initial.leads,initial.settings);assert.deepEqual(restarted,baseline);assert.equal(restarted.slots[0][1].fighter.soulId,558);assert.equal(restarted.battle.fighters[0].build.characteristic.star,3);assert.equal(restarted.battle.fighters[0].build.suit,'royal');assert.equal(restarted.battle.fighters[0].build.resistance.critical,35);assert.equal(restarted.battle.round,1);assert.equal(restarted.battle.turns.length,0);assert.equal(restarted.slots[0][0].entries,1);
});
