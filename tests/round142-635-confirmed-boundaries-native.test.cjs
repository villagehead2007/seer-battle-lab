'use strict';const test=require('node:test'),{assert,make,turn,pp,sum}=require('./helpers/round142-confirmed-souls-native.cjs');
test('635仅一防正强化仍免真实原小火球烧伤，双正不免，零负防仍免',()=>{
 let seed;for(let i=1;i<=48;i++){const candidate=Math.imul(i,2654435761)>>>0,x=turn(make(3308,{seed:candidate,hp:9000,aStats:{spe:1},aStages:{def:1,spd:1},enemy:3012,enemyMoves:[12567]}),20276,12567);if(x.out.fighters[0].ailments['烧伤']>=1){seed=candidate;break;}}assert.notEqual(seed,undefined);
 for(const aStages of [{def:1,spd:0},{def:0,spd:1},{def:0,spd:0},{def:-1,spd:-1}]){const x=turn(make(3308,{seed,hp:9000,aStats:{spe:1},aStages,enemy:3012,enemyMoves:[12567]}),20276,12567);assert.equal(x.out.fighters[0].ailments['烧伤'],undefined,JSON.stringify(aStages));assert.ok(sum(x.out,'attack',1)>0);}
});
test('635后手双防固定附伤按原400加600面板的25%，正负六级均250而非等级倍率',()=>{
 for(const level of [-6,-1,0,1,6]){const x=turn(make(3308,{aStats:{spe:1},aStages:{def:level,spd:level}}),20276,20889);assert.equal(x.out.turns.at(-1).first,1);assert.equal(sum(x.out,'fixed'),250,String(level));assert.equal(x.out.fighters[0].hp,1250);}
});
test('635真实PP药不触发先手归零或后手固定回血，疲惫未出招亦不触发',()=>{
 const first=make(3308,{aStats:{spe:3000}}),sourcePp=first.moveDefinitions['wiki:20889'].pp,x=turn(first,pp,20889);assert.equal(x.out.fighters[1].pp['wiki:20889'],sourcePp-1);assert.equal(x.out.fighters[0].hp,1000);assert.ok(!x.out.turns.at(-1).events.some(e=>e.text.includes('玄武魂印')||e.text.includes('玄武双防吸取')));
 const late=turn(make(3308,{aStats:{spe:1}}),pp,pp);assert.equal(late.out.turns.at(-1).first,1);assert.equal(sum(late.out,'fixed'),0);assert.equal(late.out.fighters[0].hp,1000);
 const stopped=turn(make(3308,{aStats:{spe:1},aAilments:{疲惫:3}}),20276,20889);assert.equal(sum(stopped.out,'fixed'),0);assert.equal(stopped.out.fighters[0].hp,1000);
});
test('635先手只抽真实正PP槽，三零一正的敌方原槽每个自然种子均归零唯一正槽',()=>{
 for(let i=1;i<=16;i++){const s=make(3308,{seed:Math.imul(i,2654435761)>>>0,aStats:{spe:3000},onePp:20889});assert.ok(s.fighters[1].pp['wiki:20889']>0);const x=turn(s,20276,20889);assert.equal(x.out.turns.at(-1).first,0);assert.ok(Object.values(x.out.fighters[1].pp).every(n=>n===0));assert.equal(x.out.fighters[0].hp,1000);assert.equal(sum(x.out,'fixed'),0);}
});
test('635后手按理论250回魂HP，敌只剩50或免固仍回250，技能禁疗不挡而全禁疗只挡自身回复',()=>{
 for(const mode of ['overkill','immune','skill-ban','all-ban']){const o={aStats:{spe:1}};if(mode==='overkill')o.enemyHP=50;if(mode==='immune')o.bEffects={'固定百分比免疫':{start:1,end:9}};if(mode==='skill-ban')o.aEffects={'无法通过自身技能恢复体力':{start:1,end:9}};if(mode==='all-ban')o.aEffects={'四杀鬼囹':{start:1,end:9}};const x=turn(make(3308,o),20276,20889);assert.equal(x.out.fighters[0].hp,mode==='all-ban'?1000:1250,mode);assert.equal(sum(x.out,'fixed'),mode==='immune'?0:250,mode);if(mode==='overkill')assert.ok(x.out.damageEvents.some(e=>e.sourceSide===0&&e.type==='fixed'&&e.settledDamage===250&&e.hpLoss===50));}
});
