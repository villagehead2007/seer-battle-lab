'use strict';
const assert=require('node:assert/strict'),test=require('node:test');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const potion='potion:pp';
function member(id,skill){
 let snapshot=store.species(id);
 if(skill&&snapshot.moves.find(m=>m.id===skill)?.fifth)snapshot=E.WIKI.versionSnapshots(snapshot).find(v=>E.WIKI.defaultMoves(v).includes(skill));
 const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;
 return {snapshot,moves,build:{overrides:{maxHp:9000}}};
}
test('涂蝶三色幕条件成立才能累加虚之彩，每只在行动后造成200真伤，主动离场全部消失',()=>{
 for(const complete of [false,true]){
 const owner=member(4861,29242);let g=T.create([[owner,member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.curtains2046.history[0]=complete?[2,3,4]:[2,3];
 if(!complete){g=T.turn(g,['wiki:29242',potion]);assert.ok(!g.battle.voidColors2392?.[0]);continue;}
 for(let count=1;count<=2;count++){
 if(count>1)g=T.turn(g,[potion,potion]);
 const round=g.battle.round;g=T.turn(g,['wiki:29242',potion]);assert.equal(g.battle.voidColors2392[0],count);
 assert.equal(g.battle.damageEvents.filter(e=>e.round===round&&e.type==='true'&&e.sourceSide===0&&e.settledDamage===200).length,count);assert.equal(g.slots[0].length,2);
 }
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.voidColors2392[0],0);
 }
});
test('4946效果2574在双方换人后仍阻止真实场下星皇加护，到期恢复',()=>{
 const [id,skill]=[4946,38538]; const owner=member(id,skill);
 let g=T.create([[owner,member(3056),member(3291)],[member(2988),member(2987),member(3291)]],[0,0],{seed:13,criticals:false});
 for(const side of [0,1])g.slots[side][1].fighter.hp=5000;
 g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(g.battle.teamBenchTargetBlockThrough,[3,3]);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);
 g=T.turn(g,[potion,potion]);assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
 g=T.turn(g,[potion,potion]);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
});

test('4947效果2574在双方换人后仍阻止真实场下星皇加护，到期恢复',()=>{
 const [id,skill]=[4947,38541]; const owner=member(id,skill);
 let g=T.create([[owner,member(3056),member(3291)],[member(2988),member(2987),member(3291)]],[0,0],{seed:13,criticals:false});
 for(const side of [0,1])g.slots[side][1].fighter.hp=5000;
 g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(g.battle.teamBenchTargetBlockThrough,[3,3]);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);
 g=T.turn(g,[potion,potion]);assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
 g=T.turn(g,[potion,potion]);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
});
test('米罗博士献祭即将退场时先复活首位可复活的阵亡队友，存活名单为空也能补位',()=>{
 for(const withLiving of [false,true]){
 let g=T.create([[member(4925,29409),member(3056),member(2987),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 for(let i=1;i<=3;i++)g.slots[0][i].fighter.hp=(withLiving&&i===3)?6000:0;
 g.slots[0][1].fighter.soulState.vanished=true;g.slots[0][1].fighter.stats.maxHp=0;
 g=T.turn(g,['wiki:29409',potion]);assert.equal(g.phase,'replace');assert.equal(g.slots[0][2].fighter.hp,1);assert.ok(g.battle.fighters[0].soulState.vanished);
 assert.equal(g.slots[0][3].fighter.hp,withLiving?6000:0);g=T.replace(g,[2,null]);assert.equal(g.active[0],2);assert.equal(g.slots[0][0].fighter.stats.maxHp,0);
 }
});
test('梅赫维特下次被击败时实际接替者三项伤害抗性各加15，真正换下返场均重置',()=>{
 const foe=member(3056,10127);const owner=member(4853,38173);
 let g=T.create([[owner,member(2987),member(2988)],[foe]],[0,0],{seed:13,criticals:false});
 const base=g.slots[0][2].fighter.build.resistance;
 g=T.turn(g,['wiki:38173',potion]);g.battle.fighters[0].hp=1;g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');
 g=T.replace(g,[2,null]);for(const k of ['critical','fixed','percent'])assert.equal(g.battle.fighters[0].build.resistance[k],Math.min(100,base[k]+15));
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:2},potion]);assert.equal(g.battle.fighters[0].soulState.resistanceGain2379,undefined);for(const k of ['critical','fixed','percent'])assert.equal(g.battle.fighters[0].build.resistance[k],base[k]);
});
test('超维瑞泽全弱无一项下降才使实际接替者同时混乱和束缚',()=>{
 for(const lowered of [false,true]){
 let g=T.create([[member(4865,38246)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 for(const k of Object.keys(g.battle.fighters[1].stages))g.battle.fighters[1].stages[k]=-6;
 if(lowered)g.battle.fighters[1].stages.def=-5;
 g=T.turn(g,['wiki:38246',potion]);g=T.turn(g,[potion,{switchTo:1}]);
 for(const k of ['混乱','束缚'])assert.equal(!!g.battle.fighters[1].ailments[k],!lowered);
 }
});
test('妙时天女转换两种形态时分别使对方接替者疲惫或害怕',()=>{
 for(const [form,status] of [['pale','疲惫'],['wrath','害怕']]){
 let g=T.create([[member(4872,38274)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].soulState.lotus2059.form=form;
 g=T.turn(g,['wiki:38274',potion]);g=T.turn(g,[potion,{switchTo:1}]);assert.ok(g.battle.fighters[1].ailments[status]>=g.battle.round-1);
 }
});
test('冰系精灵王被动统计全队秒杀魂印，五个均在场下也必定不消耗冰点PP',()=>{
 const owner=member(4942,38523);
 let g=T.create([[owner],[3056,3194,3393,3430,3665,4706].map(id=>member(id))],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].pp['wiki:38523'],1);
 g=T.turn(g,['wiki:38523',potion]);assert.equal(g.battle.fighters[0].pp['wiki:38523'],1);assert.equal(g.phase,'action');assert.ok(g.battle.fighters[1].hp>0);assert.equal(g.battle.teamBench[1].find(f=>[1901,1940].includes(f.soulId)).soulState.ophelia4706.firstExecutionUsed,true);g=T.turn(g,['wiki:38523',potion]);assert.equal(g.battle.fighters[0].soulState.basePPCostThisUse.amount,0);assert.equal(g.phase,'replace');const star=g.battle.teamBench[1].find(f=>[1901,1940].includes(f.soulId)).soulState.ophelia4706;assert.deepEqual(star.ppDraws.at(-1).chosen,['wiki:38523']);assert.equal(g.battle.fighters[0].pp['wiki:38523'],0);
});
test('米修莉击败后让对方实际接替者入魅，另一方换人不丢摸摸，用后恢复原技能和PP',()=>{
 let g=T.create([[member(4808,38055),member(2987)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 const heir=g.slots[1][1].fighter,keys=[...heir.moves];for(const key of keys)heir.pp[key]=2;
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:38055',potion]);assert.equal(g.phase,'replace');
 g=T.replace(g,[null,1]);assert.ok(g.battle.fighters[1].moves.every(k=>g.battle.moveDefinitions[k].wikiId===13749));
 const alias=g.battle.fighters[1].moves[1];g=T.turn(g,[{switchTo:1},alias]);
 assert.deepEqual(g.battle.fighters[1].moves,keys);for(const k of keys)assert.equal(g.battle.fighters[1].pp[k],2);
});
test('喧云第三次消耗强弱中弱后全队得命运庇护，换返清天依状态而保庇护及本场次数',()=>{
 let g=T.create([[member(4895,29328),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 g.slots[0][1].fighter.build.resistance.major='麻痹';
 const st=g.battle.fighters[0].soulState.score4895;st.heaven=2;st.heavenGains=2;g.slots[0][1].fighter.soulState.teamHeaven4895=2;st.notes=[3,1,2,1].map((value,i)=>({value,serial:i+1}));
 g=T.turn(g,['wiki:29328',potion]);if(g.pending.includes(1))g=T.replace(g,[null,1]);
 assert.equal(g.slots[0][1].fighter.soulState.teamHeaven4895,3);g=T.turn(g,[{switchTo:1},potion]);const heir=g.battle.fighters[0];
 const ability=E.SOULS.registry[2082].abilities;assert.equal(ability.resistance(heir,'麻痹',0),1);assert.equal(ability.resistance(heir,'害怕',0),0);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.score4895.heaven,0);assert.equal(g.battle.fighters[0].soulState.score4895.heavenGains,3);assert.equal(g.battle.fighters[0].soulState.heavenWard4895,true);assert.equal(g.slots[0][1].fighter.soulState.teamHeaven4895??0,0);assert.equal(g.slots[0][1].fighter.soulState.heavenWard4895,true);
});
test('星光艾欧丽娅换回时用新的速度面板快照重新计算冰封额度',()=>{
 const owner=member(4911,38419);let g=T.create([[owner,member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:38419',potion]);assert.equal(g.battle.fighters[0].soulState.knightIce2505.used,1);
 const originalSpeed=g.battle.fighters[0].soulState.entryPanelSpeed2505;g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.entryPanelSpeed2505,originalSpeed);g=T.turn(g,['wiki:38419',potion]);assert.equal(g.battle.fighters[0].soulState.knightIce2505.used,1);
 // Independent legal 1200-speed entry profile; the first scenario proves genuine use/leave/return reset.
 const fast=member(4911,38419);fast.build.overrides.spe=1200;g=T.create([[fast,member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});assert.equal(g.battle.fighters[0].soulState.entryPanelSpeed2505,1200);
 g=T.turn(g,['wiki:38419',potion]);assert.equal(g.battle.fighters[0].soulState.knightIce2505.used,1);assert.equal(g.battle.fighters[0].soulState.knightIce2505.entrySpeed,1200);
});
test('生之焰灰蛾首次命中用掉忽略先制资格，换回后新一轮在场可重新使用',()=>{
 const receiver=member(3056);Object.assign(receiver.build.overrides,{maxHp:9999,def:9999,spd:9999});
 let g=T.create([[member(4912,38426),member(2987)],[receiver]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].effects['免异常']={start:1,end:8};
 const key='wiki:38426';g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[0].soulState.ignorePositivePriorityConsumed?.[key],true);
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);assert.ok(!g.battle.fighters[0].soulState.ignorePositivePriorityConsumed?.[key]);
 g=T.turn(g,[potion,potion]);g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[0].soulState.ignorePositivePriorityConsumed?.[key],true);
});
test('灰蛾魂印先击败则未命中不消费，技能实际命中击败才消费资格',()=>{
 for(const [hp,consumed] of [[1,false],[3001,true]]){
 let g=T.create([[member(4912,38426)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});g.battle.fighters[1].hp=hp;
 g=T.turn(g,['wiki:38426',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);assert.equal(!!g.battle.fighters[0].soulState.ignorePositivePriorityConsumed?.['wiki:38426'],consumed);
 }
});
test('珀萝场下时队友也能推进起承转合，谋死首领存活仍按无人生还结算胜负',()=>{
 const owner=member(4956,29485),fighter=member(3056,10127);
 let g=T.create([[owner,fighter],[member(2988),member(2987)]],[1,0],{seed:13,criticals:false});
 const plot=g.battle.teamPlot2153[0];plot.phase=3;plot.history=[0,1,2,3];plot.transitions=3;
 g.battle.fighters[1].soulState.murder2153=[3];g.slots[1][1].fighter.soulState.murder2153=[1];
 g.battle.fighters[1].hp=1;g.battle.fighters[1].effects['致命保留']={start:1,end:1,hp:1};
 g=T.turn(g,['wiki:10127',potion]);assert.equal(g.battle.teamPlot2153[0].phase,4);assert.equal(g.phase,'finished');assert.equal(g.battle.winner,0);
 assert.ok(g.slots[1][1].fighter.hp>0);
});
test('珀萝随机转移其他敌人的谋死，不重复保留原标记，最靠后的类型触发己方历史收益',()=>{
 let g=T.create([[member(4956,29485),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 const plot=g.battle.teamPlot2153[0];plot.phase=1;plot.history=[0,1];g.slots[1][1].fighter.soulState.murder2153=[1];
 g=T.turn(g,['wiki:29485',potion]);assert.deepEqual(g.battle.fighters[1].soulState.murder2153,[1]);assert.deepEqual(g.slots[1][1].fighter.soulState.murder2153,[]);
 assert.equal(g.battle.teamPlot2153[0].guardRed,1);
 g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.battle.fighters[0].soulState.ailmentImmuneSources.some(r=>r.kind==='plot2153'&&r.count===1));
});
test('4753未造成吸取损血后本回合阵亡，下一回合的实际接替者用招才吸取',()=>{
 const [id,skill,amount]=[4753,37893,2250]; const owner=member(id,skill),enemy=member(3056,10127);owner.build.overrides.spe=1000;enemy.build.overrides.spe=50;enemy.build.overrides.atk=9999;
 let g=T.create([[owner,member(2987,10004)],[enemy]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;g.battle.fighters[0].effects['技能禁疗']={start:1,end:1};g.battle.fighters[1].suitState.barrier=9000;
 g.slots[0][1].fighter.hp=4000;g=T.turn(g,['wiki:'+skill,'wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],key='wiki:10004';assert.equal(f.soulState.continuations2121_4753.length,1);
 const beforeHp=f.hp;g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[0].hp,beforeHp+amount);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('无悔未KO名义回复')&&e.text.includes(String(amount))));
});

test('4923未造成吸取损血后本回合阵亡，下一回合的实际接替者用招才吸取',()=>{
 const [id,skill,amount]=[4923,38460,2700]; const owner=member(id,skill),enemy=member(3056,10127);owner.build.overrides.spe=1000;enemy.build.overrides.spe=50;enemy.build.overrides.atk=9999;
 let g=T.create([[owner,member(2987,10004)],[enemy]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;g.battle.fighters[0].effects['技能禁疗']={start:1,end:1};g.battle.fighters[1].suitState.barrier=9000;
 g.slots[0][1].fighter.hp=4000;g=T.turn(g,['wiki:'+skill,'wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],key='wiki:10004';assert.equal(f.soulState.continuations2121_4753.length,1);
 const beforeHp=f.hp;g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[0].hp,beforeHp+amount);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('无悔未KO名义回复')&&e.text.includes(String(amount))));
});
test('涂蝶在场下开战时自方白幕仍作用首发，留场幕只对本次换入者结算',()=>{
 const painter=member(4861,29242);
 let g=T.create([[member(3056),painter,member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].hp,8910);assert.equal(g.battle.fighters[1].hp,9000);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.curtains2046.sides[1],1);
 g.battle.curtains2046.sides[0]=4;g=T.turn(g,[{switchTo:2},potion]);assert.ok(g.battle.fighters[0].effects['黄幕抵挡致命']);
 const entries=g.battle.curtains2046.initialEntries;assert.equal(entries.filter(e=>e.side===1).length,0);
});
test('涂蝶黑幕真实换入优先施加一回合狂暴，免异常时转为三回合输出减半',()=>{
 for(const immune of [false,true]){
 let g=T.create([[member(4861),member(2987)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.curtains2046.sides[1]=5;
 if(immune)g.slots[1][1].fighter.effects['免异常']={start:1,end:1};
 g=T.turn(g,[potion,{switchTo:1}]);const f=g.battle.fighters[1];assert.equal(!!f.effects['黑幕输出减半'],immune);if(immune)assert.equal(f.effects['黑幕输出减半'].end,3);
 else assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('狂暴'))||g.battle.entryEvents.some(e=>e.text.includes('狂暴')));
 }
});
test('帝皇铠甲在场下观察队友被清PP与攻击归零，金和火土随己方换人移交',()=>{
 const attacker=member(3056,10127),clearer=member(3932,33652);
 let g=T.create([[attacker,member(4930),member(2987)],[clearer,member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].effects['攻击伤害免疫']={start:1,end:1};g=T.turn(g,['wiki:10127',potion]);
 assert.equal(g.battle.fighters[0].soulState.fiveMarks2125.火土.end,5);
 g=T.turn(g,[potion,'wiki:33652']);assert.ok(g.battle.fighters[0].soulState.fiveMarks2125.金);
 if(g.pending.includes(1))g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:2},potion]);assert.ok(g.battle.fighters[0].soulState.fiveMarks2125.金);assert.ok(g.battle.fighters[0].soulState.fiveMarks2125.火土);
});
test('帝皇铠甲在场下观察敌方场下星皇指定目标，水印实际取消加护并随对方换人',()=>{
 let g=T.create([[member(2987),member(4930)],[member(3056),member(3291),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].hp=4500;
 g=T.turn(g,[potion,potion]);assert.ok(g.battle.fighters[1].soulState.fiveMarks2125.水);
 assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
 g=T.turn(g,[potion,{switchTo:2}]);assert.ok(g.battle.fighters[1].soulState.fiveMarks2125.水);
});
test('阿克希亚当回合阵亡按清除前敌方是否有回合效果，为所选接替者附加三回合冰呪',()=>{
 for(const had of [false,true]){
 const foe=member(3056,10127);foe.build.overrides.atk=9999;let g=T.create([[member(4942),member(2988)],[foe]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;if(had)g.battle.fighters[1].effects['攻击必中']={start:1,end:2};
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 assert.equal(!!g.battle.fighters[0].effects['冰呪'],!had);if(!had)assert.equal(g.battle.fighters[0].effects['冰呪'].end,g.battle.round+2);
 }
});
test('场下霜域血装阻止敌方秒杀，交换体力时施法者和受支援者均保持原值',()=>{
 const swapper=member(4568,28485);let g=T.create([[swapper],[member(2988),member(4942)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=3500;g.battle.fighters[1].hp=7000;
 g=T.turn(g,['wiki:28485',potion]);assert.equal(g.battle.fighters[0].hp,3500);assert.equal(g.battle.fighters[1].hp,7000);
 const caster=member(3699,32450);g=T.create([[caster],[member(2988),member(4942)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].effects['攻击必中']={start:1,end:1};g.battle.fighters[0].effects['属性必中']={start:1,end:1};
 g=T.turn(g,['wiki:32450',potion]);assert.ok(g.battle.fighters[0].hp>0);assert.ok(g.battle.fighters[1].hp>0);assert.equal(g.phase,'action');
});
test('4930按本场实际场下受伤累计汲取，并平分给两个存活替补',()=>{
 const [id,skill,amount]=[4930,38485,300]; const forest=member(3739,29211);forest.build.overrides.maxHp=2000;
 const caster=member(id,skill),enemy=member(3056,10127);
 let g=T.create([[forest,caster,member(2987)],[enemy]],[0,0],{seed:13,criticals:false});
 g.slots[0][2].fighter.hp=4000;
 g=T.turn(g,[{switchTo:1},'wiki:10127']);
 for(let i=1;i<8;i++)g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.battle.teamBenchDamage2532[0],320);
 const priorHp=[0,2].map(i=>g.slots[0][i].fighter.hp);
 g=T.turn(g,['wiki:'+skill,potion]);const events=g.battle.turns.at(-1).events;assert.deepEqual([0,2].map(i=>g.slots[0][i].fighter.hp),priorHp.map(hp=>hp+amount/2));
 assert.equal(events.filter(e=>e.text.includes('平分汲取回复')&&e.text.includes(String(amount/2))).length,2);
 assert.ok(events.some(e=>e.text.includes('场下累计受伤汲取')&&e.text.includes(String(amount))));
});

test('4942按本场实际场下受伤累计汲取，并平分给两个存活替补',()=>{
 const [id,skill,amount]=[4942,29444,260]; const forest=member(3739,29211);forest.build.overrides.maxHp=2000;
 const caster=member(id,skill),enemy=member(3056,10127);
 let g=T.create([[forest,caster,member(2987)],[enemy]],[0,0],{seed:13,criticals:false});
 g.slots[0][2].fighter.hp=4000;
 g=T.turn(g,[{switchTo:1},'wiki:10127']);
 for(let i=1;i<8;i++)g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.battle.teamBenchDamage2532[0],320);
 const priorHp=[0,2].map(i=>g.slots[0][i].fighter.hp);
 g=T.turn(g,['wiki:'+skill,potion]);const events=g.battle.turns.at(-1).events;assert.deepEqual([0,2].map(i=>g.slots[0][i].fighter.hp),priorHp.map(hp=>hp+amount/2));
 assert.equal(events.filter(e=>e.text.includes('平分汲取回复')&&e.text.includes(String(amount/2))).length,2);
 assert.ok(events.some(e=>e.text.includes('场下累计受伤汲取')&&e.text.includes(String(amount))));
});
test('冥契观察对手主动切换时回复PP，已满时全队回100，战阶回复只给最低现体中靠前者',()=>{
 const owner=member(4467);
 let g=T.create([[owner,member(3056),member(2987)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=7000;g.slots[0][1].fighter.hp=4000;g.slots[0][2].fighter.hp=4000;
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.slots[0][1].fighter.hp,6350);assert.equal(g.slots[0][2].fighter.hp,4100);assert.equal(g.battle.fighters[0].hp,7100);
});
test('嬴政首次登场臣服，敌方上回合主动换人时再入场获额外两方玺，六玺封换',()=>{
 let g=T.create([[member(4468),member(2987)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.battle.fighters[1].ailments['臣服']>=1);assert.equal(g.battle.fighters[0].soulState.yongchang,2);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.slots[0][0].fighter.soulState.yongchang,0);g=T.turn(g,[{switchTo:0},potion]);
 assert.equal(g.battle.fighters[0].soulState.emperorRoundSeals,4);assert.ok(!g.battle.fighters[1].ailments['臣服']);assert.ok(T.candidates(g,1).includes(0));
 g=T.turn(g,[potion,potion]);g=T.turn(g,[potion,potion]);
 assert.equal(g.battle.fighters[0].soulState.emperorRoundSeals,6);assert.deepEqual(T.candidates(g,1),[]);
});
test('嫉妒哲利斯被击败时包含自身，己方三只阵亡结算1500固定伤害',()=>{
 const foe=member(3056,10127);foe.build.overrides.atk=9999;
 let g=T.create([[member(4494),member(2987),member(2988),member(3102)],[foe]],[0,0],{seed:13,criticals:false});
 g.slots[0][1].fighter.hp=0;g.slots[0][2].fighter.hp=0;g.battle.fighters[0].hp=1;
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');assert.ok(g.battle.damageEvents.some(e=>e.sourceSide===0&&e.type==='fixed'&&e.settledDamage===1500));
});
test('东辉在返场首回合按新对手强化状态重判，以真实攻击触发疲惫及回合末盾',()=>{
 for(const boosted of [false,true]){
 const foe=member(3056,10127);let g=T.create([[member(4422),member(2987)],[foe]],[0,0],{seed:13,criticals:false});
 if(boosted)g.battle.fighters[1].stages.def=1;
 g.battle.fighters[1].effects['攻击必中']={start:1,end:4};
 g=T.turn(g,[{switchTo:1},potion]);
 g=T.turn(g,[{switchTo:0},'wiki:10127']);assert.equal(g.battle.fighters[0].soulState.donghuiEntryReady,!boosted);
 assert.equal(g.battle.fighters[0].suitState.shield??0,boosted?0:3000);assert.equal(!!g.battle.fighters[1].ailments['疲惫'],!boosted);
 }
});
test('银椋在场升至二级后下场保留，返场不会回到一级',()=>{
 const foe=member(3056,10127);foe.build.overrides.atk=9999;
 let g=T.create([[member(4438),member(2987)],[foe]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.battle.fighters[0].soulState.thunderStarling,2);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.thunderStarling,2);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.thunderStarling,2);
});
test('希拓实读两个场下火系每轮获得4层战意，过10层的命运庇护和战意跨换人保留',()=>{
 let g=T.create([[member(4622),member(4589),member(4627),member(3056)],[member(3056)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.slots[0][2].fighter.type.includes('火'));
 for(let i=0;i<3;i++)g=T.turn(g,[potion,potion]);
 assert.equal(g.battle.fighters[0].soulState.intent1829,12);assert.equal(g.battle.fighters[0].soulState.fateProtection1829,true);
 g=T.turn(g,[{switchTo:3},potion]);assert.equal(g.slots[0][0].fighter.soulState.intent1829,12);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.intent1829,16);
});
test('枫落殇西叶换入按双方各一只阵亡将寄生、流血延至四回合，并回复双方真实PP',()=>{
 let g=T.create([[member(3056),member(4635),member(2988)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.slots[0][2].fighter.hp=0;g.slots[1][1].fighter.hp=0;const f=g.slots[0][1].fighter;f.pp[f.moves[1]]=0;
 g=T.turn(g,[{switchTo:1},potion]);const result=g.battle.fighters[0];
 assert.equal(result.ailments['流血'],4);assert.equal(result.ailments['寄生'],4);assert.equal(result.pp[f.moves[1]],result.teamPPDefinitions[f.moves[1]].pp);
});
test('圣谕邪魇再入场重置圣谕形态但保留异方标记并重新获得下次攻击资格',()=>{
 let g=T.create([[member(4554),member(2987)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});const f=g.battle.fighters[0],t=g.battle.fighters[1];f.soulState.oracleForm1764='evil';f.soulState.oracleNextAttack1764=false;
 E.SOULS.registry[1764].abilities.grantMark({a:f,t,round:1},'holy',2,t);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.oracleMarks1764.holy.length,2);
 g=T.turn(g,[{switchTo:0},{switchTo:0}]);assert.equal(g.battle.fighters[0].soulState.oracleForm1764,'holy');assert.equal(g.battle.fighters[0].soulState.oracleNextAttack1764,true);assert.equal(g.battle.fighters[1].soulState.oracleMarks1764.holy.length,2);
});
test('烛灯使换入逐槽将敌方实际损失PP交给上一位，仅恢复到各槽上限',()=>{
 let g=T.create([[member(3056),member(4620),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 const f=g.battle.fighters[0],t=g.battle.fighters[1];f.moves.forEach(k=>f.pp[k]=0);t.moves.forEach((k,i)=>t.pp[k]=i);
 g=T.turn(g,[{switchTo:1},potion]);const prev=g.slots[0][0].fighter;assert.deepEqual(prev.moves.map(k=>prev.pp[k]),[0,1,2,2,2]);
});
test('赫斯提亚用薪炎永耀获得三层灼火，队友实际受攻用一层，当轮免异常，施攻者烧伤',()=>{
 const a=member(4627,28674),foe=member(3056,10127);
 let g=T.create([[a,member(2987)],[foe]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].ailments['烧伤']=3;
 g=T.turn(g,['wiki:28674',potion]);assert.equal(g.battle.fighters[0].soulState.guardedFlame1833,3);
 g=T.turn(g,[{switchTo:1},'wiki:10127']);const f=g.battle.fighters[0];assert.equal(f.soulState.guardedFlame1833,2);
 assert.ok(g.battle.fighters[1].ailments['烧伤']>=g.battle.round-1);assert.ok(!g.battle.fighters[1].soulState.specialStates?.['炙光火种']);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.guardedFlame1833,2);
});
test('索杰德尔换入免疫上一位持有的束缚；击败后把对手的异常与弱化传给实际补位者',()=>{
 const a=member(4599),foe=member(4995,38549);
 let g=T.create([[member(3056),a],[foe,member(2988)]],[0,0],{seed:13,criticals:false});
 // 初始正能力让玄武不授队伍免异，独立验证1805异常继承正例；共享免异另有专项。
 g.battle.fighters[1].stages.atk=1;g.battle.fighters[0].ailments['束缚']=3;g=T.turn(g,[{switchTo:1},'wiki:38549']);
 assert.ok(g.battle.fighters[0].soulState.prevImmunity1805.statuses.includes('束缚'));assert.equal(g.battle.fighters[0].ailments['束缚'],undefined);
 const enemy=g.battle.fighters[1];enemy.stages.spd=-2;enemy.ailments['流血']=g.battle.round+2;enemy.hp=1;
 g=T.turn(g,['wiki:37088',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].stages.spd,-2);assert.ok(g.battle.fighters[1].ailments['流血']>=g.battle.round);
});
test('弑序神罗首次出战在真实技能槽间散布，三只五枚、四只十五枚，返场不增发',()=>{
 for(const size of [3,4]){
 const foes=[2987,2988,3056,3311].slice(0,size).map(id=>member(id));
 let g=T.create([[member(4169),member(3102)],foes],[0,0],{seed:13,criticals:false});
 const marks=()=>g.slots[1].map(slot=>Object.values(slot.fighter.soulState.fatalMarks??{}).reduce((a,b)=>a+b,0)),expected=size===3?5:15;
 assert.equal(marks().reduce((a,b)=>a+b),expected);assert.ok(marks().slice(1).some(n=>n>0));assert.ok(marks().every(n=>n<=5));
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fatalMarkEvents.filter(e=>e.effectId==='soul:1394').length,expected);
 }
});
test('弑序神罗在场下时队友被击败给凶手一层裂痕，凶手换下保留',()=>{
 const foe=member(3056,10127);foe.build.overrides.atk=9999;let g=T.create([[member(2988),member(4169)],[foe,member(2987)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.battle.fighters[1].soulState.fatalCracks,1);
 g=T.replace(g,[1,null]);g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.fatalCracks,1);
});
test('启灵元神场下神照按其上限授首发盾，敌方主动换入者获得神印并实际受到首回合真伤',()=>{
 const origin=member(3986);origin.build.overrides.maxHp=6000;
 let g=T.create([[member(3056),origin],[member(2987),member(2988)]],[0,0],{seed:13,criticals:false});assert.equal(g.battle.fighters[0].suitState.shield,1800);
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.holyMarks,1);assert.ok(g.battle.damageEvents.some(e=>e.type==='true'&&e.targetSide===1&&e.settledDamage===750));
 g=T.turn(g,[potion,{switchTo:0}]);assert.equal(g.slots[1][1].fighter.soulState.holyMarks,1);
});
test('神秘结界按实际存活数限制放逐名额，神游众生归渺仅扣一只被放逐替补各技能1PP',()=>{
 const owner=member(3986,33894);
 let g=T.create([[owner],[3056,2987,2988,3102,3311].map(id=>member(id))],[0,0],{seed:13,criticals:false});
 const exiles=g.battle.teamExile1246[1].positions;assert.ok(exiles.length>=1&&exiles.length<=3);
 assert.ok(exiles.every(i=>!T.candidates(g,1).includes(i)&&T.candidates(g,1,true).includes(i)));
 const pp=g.slots[1].map(x=>({...x.fighter.pp}));g=T.turn(g,['wiki:33894',potion]);
 const reduced=g.slots[1].flatMap((slot,i)=>slot.fighter.moves.every(k=>slot.fighter.pp[k]===pp[i][k]-1)?[i]:[]);
 assert.equal(reduced.length,1);assert.ok(exiles.includes(reduced[0]));
});
test('圣华入场随机处决最高体力的场下成员，处决者登场即解除，圣华离场给当前对手印记',()=>{
 const seen=new Set();for(let seed=1;seed<20&&seen.size<2;seed++){
 let g=T.create([[member(2987),member(4321)],[member(3056),member(2987),member(2988),member(3102)]],[0,0],{seed,criticals:false});
 g.slots[1][1].fighter.hp=5000;g=T.turn(g,[{switchTo:1},potion]);
 const index=g.slots[1].findIndex(x=>x.fighter.soulState.execution1547);assert.ok([2,3].includes(index));seen.add(index);
 const target=g.slots[1][index].fighter;assert.equal(target.hp,8900);assert.equal(target.soulState.executionMarks,1);
 g=T.turn(g,[potion,{switchTo:index}]);assert.equal(g.battle.fighters[1].soulState.execution1547,undefined);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[1].soulState.executionMarks,2);
 }assert.equal(seen.size,2);
});
test('圣华处决高血目标得一剑，天命已拟使敌用属性时处决对象各槽PP减少',()=>{
 const owner=member(4321,35620);if(!owner.moves.includes(27840))owner.moves[1]=27840;
 const foe=member(3056,20117);let g=T.create([[owner],[foe,member(2988)]],[0,0],{seed:13,criticals:false});
 const before={...g.slots[1][1].fighter.pp};
 g=T.turn(g,['wiki:35620',potion]);assert.equal(g.battle.holySwords[0],1);
 g=T.turn(g,['wiki:27840',potion]);g=T.turn(g,[potion,'wiki:20117']);
 const f=g.slots[1][1].fighter;for(const k of f.moves)assert.equal(f.pp[k],before[k]-1);
});
test('圣华阵亡触发重铸，接替者第一招获先制并消耗一剑造成100真伤',()=>{
 const foe=member(3056,10127);foe.build.overrides.atk=9999;let g=T.create([[member(4321),member(2987,10004)],[foe]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.holySwords[0],1);g=T.replace(g,[1,null]);
 const r=g.battle.round;g=T.turn(g,['wiki:10004',potion]);assert.equal(g.battle.fighters[0].soulState.resolvedPriority.value,1);
 assert.equal(g.battle.holySwords[0],0);assert.ok(g.battle.damageEvents.some(e=>e.round===r&&e.type==='true'&&e.sourceSide===0&&e.settledDamage===100));
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.swordReforge[0],false);
});
test('神谕按每笔开始前体力判断，600/1000扣400到200，此后再次削减无效',()=>{
 const origin=member(3986),reserve=member(2987);reserve.build.overrides.maxHp=1000;
 let g=T.create([[origin,reserve],[member(4516,36662)]],[0,0],{seed:13,criticals:false});
 let f=g.slots[0][1].fighter;f.hp=600;f.hp-=400;assert.equal(f.hp,200);f.hp-=100;assert.equal(f.hp,200);
 g.battle.fighters[0].stages.def=1;g=T.turn(g,[potion,'wiki:36662']);assert.equal(g.slots[0][1].fighter.hp,200);
});
test('圣剑重铸中队友击败对手时圣华在场下复活，体力与每一槽PP都回满',()=>{
 const foe=member(3056,10127);foe.build.overrides.atk=9999;let g=T.create([[member(4321),member(2987,10004)],[foe,member(2988)]],[0,0],{seed:13,criticals:false});
 const own=g.battle.fighters[0];own.hp=1;own.moves.forEach((k,i)=>own.pp[k]=i);
 g=T.turn(g,[potion,'wiki:10127']);g=T.replace(g,[1,null]);const fallen=g.slots[0][0].fighter;fallen.moves.forEach((k,i)=>fallen.pp[k]=i);
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:10004',potion]);const revived=g.slots[0][0].fighter;assert.equal(revived.hp,revived.stats.maxHp);for(const k of revived.moves)assert.equal(revived.pp[k],revived.teamPPDefinitions[k].pp);
});
for(const [which,move] of [['dark',38147],['gold',38148]])test('额外龙'+which+'真实阵亡后才允许零PP选择并执行'+move,()=>{
 const owner=member(4186);owner.snapshot.selectedSoulId=2028;owner.moves=E.WIKI.defaultMoves(owner.snapshot);if(!owner.moves.includes(move))owner.moves[1]=move;
 owner.build.overrides.maxHp=1000;owner.build.overrides.def=10;owner.build.overrides.atk=1;
 const foe=member(3056,10127);foe.build.overrides.atk=3000;
 let g=T.create([[owner],[foe,member(2988)]],[0,0],{seed:13,criticals:false});const own=g.battle.fighters[0];own.pp['wiki:'+move]=0;assert.ok(!E.availableMoves(own).includes('wiki:'+move));
 if(which==='dark'){g.battle.fighters[1].hp=190;g.battle.fighters[1].stats.def=4000;g=T.turn(g,['wiki:34898',potion]);g=T.replace(g,[null,1]);}
 else g=T.turn(g,[potion,'wiki:10127']);
 assert.equal(g.battle.teamDragons2028[0][which],false);assert.ok(E.availableMoves(g.battle.fighters[0]).includes('wiki:'+move));g=T.turn(g,['wiki:'+move,potion]);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes(g.battle.moveDefinitions['wiki:'+move].name)));
});
test('四象门仅计四只彼此不同系别的真实出战者，六芒阵在萨尔蒙回场后把束缚转为全弱',()=>{
 const owner=member(3549,29392),foe=member(4995,38549);
 let g=T.create([[owner,...[3056,2987,2988,3809].map(id=>member(id))],[foe]],[0,0],{seed:13,criticals:false});
 for(const i of [1,2,1,3])g=T.turn(g,[{switchTo:i},potion]);assert.equal(g.battle.salmonGates[0].tier,1);
 g=T.turn(g,[{switchTo:4},potion]);assert.equal(g.battle.salmonGates[0].tier,2);
 g=T.turn(g,[{switchTo:0},'wiki:38549']);assert.ok(!g.battle.fighters[0].ailments['束缚']);
 assert.equal(g.battle.turns.at(-1).events.filter(e=>e.text.startsWith('A 方')&&e.text.includes('等级 0 → -1')).length,6);
 assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===2));
});
test('芳缀山河将存活替补与阵亡替补分别计入下一次减伤和吸取',()=>{
 let g=T.create([[member(4364,27949),member(3056),member(2987),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.slots[0][3].fighter.hp=0;g.battle.fighters[0].hp=4000;
 g=T.turn(g,['wiki:27949',potion]);
 assert.equal(g.battle.fighters[0].soulState.nextPinkReductionFraction,.2);
 assert.equal(g.battle.fighters[1].hp,8950);
});
test('尸走魂嚎按己方阵亡数领取鬼祰，本次在场不重复，返场重新领取',()=>{
 let g=T.create([[member(4444,38382),member(3056),member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.slots[0][2].fighter.hp=0;
 let claims=0;for(const action of ['wiki:38382','wiki:38384','wiki:38382',{switchTo:1},{switchTo:0},'wiki:38382']){
  const original=E.WIKI.effectsEngine,frames=[];E.WIKI.effectsEngine={...original,run(phase,ops,c){const mid=c.m.wikiId??c.m.id;if(phase==='afterHit'&&c.a.side===0&&[38382,38384].includes(mid)){const count=()=>E.GHOST_RULES.kinds.filter(kind=>{const e=c.a.effects['鬼祰·'+kind];return e&&e.start<=c.round&&e.end>=c.round;}).length,before=count(),out=original.run(phase,ops,c);frames.push({mid,before,after:count()});return out;}return original.run(phase,ops,c);}};try{g=T.turn(g,[action,potion]);}finally{E.WIKI.effectsEngine=original;}if(action==='wiki:38384'){const frame=frames.find(x=>x.mid===38384);assert.ok(frame.before>0);assert.equal(frame.after,0,'original fifth consumes the actual earned ghosts before the soul can grant another');}
  if(action==='wiki:38382'){claims++;const frame=frames.find(x=>x.mid===38382);assert.equal(frame.after-frame.before,claims===2?0:1,'the original skill grants once per visit; native soul grants remain separate');
   const st=g.battle.fighters[0].soulState;
   assert.equal(st.ghostGrant2473.claimed,1);assert.equal(st.ghostGrant2473.visit,st.teamEntry.number);
  }
 }
 assert.equal(g.battle.fighters[0].soulState.teamEntry.number,2);
});
test('蔑天行·戾杀命中敌方全队，消耗四道鬼祰后双方都无法主动换人',()=>{
 let g=T.create([[member(4444,38384),member(2987)],[member(3056),member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 for(const kind of E.GHOST_RULES.kinds)E.GHOST_RULES.gain(g.battle.fighters[0],kind,1);
 g=T.turn(g,['wiki:38384',potion]);assert.deepEqual(g.slots[1].slice(1).map(slot=>slot.fighter.hp),[8996,8996]);
 assert.equal(g.battle.fighters[0].soulState.ghostFixedAmount,4);
 for(const side of [0,1]){assert.deepEqual(T.candidates(g,side),[]);assert.ok(T.candidates(g,side,true).length);}
});
test('圣律剑灵击败对手时解放双方剩余圣剑，真实接替者登场后逐柄抽取异常',()=>{
 const owner=member(4400,36017);owner.build.overrides.atk=9999;
 for(const reforge of [true,false]){
  let g=T.create([[owner,member(2987)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
  g.battle.holySwords=[2,1];g.battle.swordReforge=[reforge,false];
  g.battle.fighters[1].hp=160;g=T.turn(g,['wiki:36017',potion]);assert.equal(g.phase,'replace');
  assert.deepEqual(g.battle.holySwords,reforge?[0,0]:[2,1]);g=T.replace(g,[null,1]);
  assert.equal((g.battle.randomStatusEvents??[]).filter(e=>e.type==='draw'&&e.effectId===1830&&e.targetSide===1).length,reforge?2:0);
 }
});
test('4444效果2440零红伤后锁定之后的主动切换，期限结束可换',()=>{const [id,skill,duration]=[4444,38383,1];
 let g=T.create([[member(id,skill)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].effects['任一方弱化免攻']={start:1,end:1};g.battle.fighters[1].stages.def=-1;g=T.turn(g,['wiki:'+skill,potion]);
 const lock=g.battle.fighters[1].effects['不能主动切换'];assert.equal(lock.end-lock.start+1,duration);
 for(let i=0;i<duration;i++){assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[potion,potion]);}
 assert.deepEqual(T.candidates(g,1),[1]);
});
test('4354效果2440零红伤后锁定之后的主动切换，期限结束可换',()=>{const [id,skill,duration]=[4354,38348,2];
 let g=T.create([[member(id,skill)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].effects['任一方弱化免攻']={start:1,end:1};g.battle.fighters[1].stages.def=-1;g=T.turn(g,['wiki:'+skill,potion]);
 const lock=g.battle.fighters[1].effects['不能主动切换'];assert.equal(lock.end-lock.start+1,duration);
 for(let i=0;i<duration;i++){assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[potion,potion]);}
 assert.deepEqual(T.candidates(g,1),[1]);
});
test('4509的在场反击按剩余回合交给中切出战者，期满停止',()=>{const [id,skill,damage]=[4509,36609,300];
 const outcomes=new Set();
 for(let seed=1;seed<=24;seed++){
  let g=T.create([[member(id,skill),member(2987)],[member(3056,10127)]],[0,0],{seed,criticals:false});
  g=T.turn(g,['wiki:'+skill,potion]);const effect=g.battle.fighters[0].effects['在场反击'];
  const r=g.battle.round;g=T.turn(g,[{switchTo:1},'wiki:10127']);
  const counter=round=>g.battle.damageEvents.some(e=>e.round===round&&e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===damage);
  outcomes.add(counter(r));assert.equal(g.active[0],1);
  while(g.battle.round<=effect.end)g=T.turn(g,[potion,potion]);
  const after=g.battle.round;g=T.turn(g,[potion,'wiki:10127']);assert.equal(counter(after),false);
  if(id===4509||outcomes.size===2)break;
 }
 assert.deepEqual([...outcomes].sort(),id===4509?[true]:[false,true]);
});
test('3575的在场反击按剩余回合交给中切出战者，期满停止',()=>{const [id,skill,damage]=[3575,23797,150];
 const outcomes=new Set();
 for(let seed=1;seed<=24;seed++){
  let g=T.create([[member(id,skill),member(2987)],[member(3056,10127)]],[0,0],{seed,criticals:false});
  g=T.turn(g,['wiki:'+skill,potion]);const effect=g.battle.fighters[0].effects['在场反击'];
  const r=g.battle.round;g=T.turn(g,[{switchTo:1},'wiki:10127']);
  const counter=round=>g.battle.damageEvents.some(e=>e.round===round&&e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===damage);
  outcomes.add(counter(r));assert.equal(g.active[0],1);
  while(g.battle.round<=effect.end)g=T.turn(g,[potion,potion]);
  const after=g.battle.round;g=T.turn(g,[potion,'wiki:10127']);assert.equal(counter(after),false);
  if(id===4509||outcomes.size===2)break;
 }
 assert.deepEqual([...outcomes].sort(),id===4509?[true]:[false,true]);
});test('萨尔蒙达到36级立即转为八方圻，随后失去等级仍保留升阶',()=>{
 let g=T.create([[member(3549,29392),member(3056)],[member(2987)]],[0,0],{seed:13,criticals:false});
 g.battle.salmonGates[0].tier=2;for(const k of Object.keys(g.battle.fighters[0].stages))g.battle.fighters[0].stages[k]=5;
 g=T.turn(g,['wiki:29392',potion]);assert.equal(g.battle.salmonGates[0].tier,3);
 for(const k of Object.keys(g.battle.fighters[0].stages))g.battle.fighters[0].stages[k]=0;
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.salmonGates[0].tier,3);
});
test('琉梦场下种花并计敌方场下秒杀魂印，队友在场也成长，重新出场不重置',()=>{
 let g=T.create([[member(4761),member(2987)],[member(3056),member(4762)]],[1,0],{seed:13,criticals:false});
 const dream=g.battle.teamDream1972[0];
 assert.equal(dream.crisis,2);assert.equal(dream.flower,0);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.teamDream1972[0].flower,4);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.dream1972.flower,8);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].soulState.dream1972.flower,12);
});
test('琉梦双方合计一次献祭，队友补位后保留花与增加的危机，对方琉梦后出战不能再献祭',()=>{
 const own=member(4761,37930);let g=T.create([[own,member(2987)],[member(3056),member(4761,37930)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:37930',potion]);assert.equal(g.phase,'replace');assert.equal(g.battle.used2305,true);g=T.replace(g,[1,null]);
 assert.equal(g.battle.fighters[0].soulState.dream1972.crisis,2);
 g=T.turn(g,[potion,{switchTo:1}]);g=T.turn(g,[potion,'wiki:37930']);assert.ok(g.battle.fighters[1].hp>0);
});
test('纳多雷反转成功授一次全队免异，接替者挡下束缚再受同招则生效',()=>{
 let g=T.create([[member(4743,37854),member(3056)],[member(4995,38549)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].stages.atk=2;g=T.turn(g,['wiki:37854',potion]);
 assert.ok(g.battle.fighters[0].soulState.ailmentImmuneSources.some(e=>e.kind==='team904'&&e.count===1));
 g=T.turn(g,[{switchTo:1},'wiki:38549']);assert.ok(!g.battle.fighters[0].ailments['束缚']);
 g=T.turn(g,[potion,'wiki:38549']);assert.ok(g.battle.fighters[0].ailments['束缚']>=g.battle.round-1);
});
test('空元之诗·柱额外行动后封对手下一回合主动切换，随后恢复',()=>{
 let g=T.create([[member(4586,28535)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].effects['攻击必中']={start:1,end:3};
 g=T.turn(g,['wiki:28535',potion]);assert.deepEqual(T.candidates(g,1),[]);assert.ok(T.candidates(g,1,true).length);
 g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[1]);
});
test('帕诺·七星阵列击败对手后，敌方真实接替者下回合攻击技能无效',()=>{
 const owner=member(4995,38550);
 let g=T.create([[owner],[member(2988),member(2987,10004)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:38550',potion]);assert.equal(g.phase,'replace');
 g=T.replace(g,[null,1]);const f=g.battle.fighters[1];assert.equal(f.effects.attackBlock.end,g.battle.round);
 g=T.turn(g,[potion,'wiki:10004']);assert.ok(!g.battle.damageEvents.some(e=>e.round===2&&e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));
});
test('无极圣武英雄之耀三层允许零PP使用并获得先制',()=>{
 const [skill,benefit]=[38086,'先制']; const low=T.create([[member(4800,skill),member(2987),member(3056)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const lf=low.battle.fighters[0],lk='wiki:'+skill;lf.pp[lk]=0;assert.equal(lf.soulState.heroGlory2009,2);assert.ok(!E.availableMoves(lf).includes(lk));assert.throws(()=>T.turn(low,[lk,potion]),/PP|请选择|可选/);
 let g=T.create([[member(4800,skill),member(2987),member(3056),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const key='wiki:'+skill,f=g.battle.fighters[0];assert.equal(f.soulState.heroGlory2009,3);f.pp[key]=0;
 if(skill===29149)f.ailments['流血']=3;if(skill===29150)f.effects['攻击必中']={start:1,end:3};
 assert.ok(E.availableMoves(f).includes(key));g=T.turn(g,[key,potion]);const next=g.battle.fighters[0];
 if(skill===38086)assert.equal(next.soulState.resolvedPriority.value,g.battle.moveDefinitions[key].priority+1);
 if(skill===29149)assert.ok(!next.ailments['流血']);if(skill===29150)assert.ok(!next.effects['攻击必中']);
});

test('无极圣武英雄之耀三层允许零PP使用并获得解除自身异常',()=>{
 const [skill,benefit]=[29149,'解除自身异常']; const low=T.create([[member(4800,skill),member(2987),member(3056)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const lf=low.battle.fighters[0],lk='wiki:'+skill;lf.pp[lk]=0;assert.equal(lf.soulState.heroGlory2009,2);assert.ok(!E.availableMoves(lf).includes(lk));assert.throws(()=>T.turn(low,[lk,potion]),/PP|请选择|可选/);
 let g=T.create([[member(4800,skill),member(2987),member(3056),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const key='wiki:'+skill,f=g.battle.fighters[0];assert.equal(f.soulState.heroGlory2009,3);f.pp[key]=0;
 if(skill===29149)f.ailments['流血']=3;if(skill===29150)f.effects['攻击必中']={start:1,end:3};
 assert.ok(E.availableMoves(f).includes(key));g=T.turn(g,[key,potion]);const next=g.battle.fighters[0];
 if(skill===38086)assert.equal(next.soulState.resolvedPriority.value,g.battle.moveDefinitions[key].priority+1);
 if(skill===29149)assert.ok(!next.ailments['流血']);if(skill===29150)assert.ok(!next.effects['攻击必中']);
});

test('无极圣武英雄之耀三层允许零PP使用并获得清除自身回合效果',()=>{
 const [skill,benefit]=[29150,'清除自身回合效果']; const low=T.create([[member(4800,skill),member(2987),member(3056)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const lf=low.battle.fighters[0],lk='wiki:'+skill;lf.pp[lk]=0;assert.equal(lf.soulState.heroGlory2009,2);assert.ok(!E.availableMoves(lf).includes(lk));assert.throws(()=>T.turn(low,[lk,potion]),/PP|请选择|可选/);
 let g=T.create([[member(4800,skill),member(2987),member(3056),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const key='wiki:'+skill,f=g.battle.fighters[0];assert.equal(f.soulState.heroGlory2009,3);f.pp[key]=0;
 if(skill===29149)f.ailments['流血']=3;if(skill===29150)f.effects['攻击必中']={start:1,end:3};
 assert.ok(E.availableMoves(f).includes(key));g=T.turn(g,[key,potion]);const next=g.battle.fighters[0];
 if(skill===38086)assert.equal(next.soulState.resolvedPriority.value,g.battle.moveDefinitions[key].priority+1);
 if(skill===29149)assert.ok(!next.ailments['流血']);if(skill===29150)assert.ok(!next.effects['攻击必中']);
});
test('无极圣武区分低概率魂印：两正一负得一层，场下仍向真正登场者施加一回合砥砺',()=>{
 let g=T.create([[member(4800,38086),member(2995),member(3056),member(2987)],[member(3056),member(2988)]],[2,0],{seed:13,criticals:false});
 assert.equal(g.slots[0][0].fighter.soulState.heroGlory2009,1);
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.bright2009,3);
 g=T.turn(g,[{switchTo:0},potion]);const f=g.battle.fighters[0];f.pp['wiki:38086']=0;assert.ok(!E.availableMoves(f).includes('wiki:38086'));
});
test('涡锋36688从完整异常池抽中瘫痪，实际切换受限且到期恢复',()=>{
 const [skill,effect,seed,limit]=[36688,1394,5,'瘫痪']; let g=T.create([[member(4521,skill)],[member(3056,20117),member(2988)]],[0,0],{seed,criticals:false});
 g=T.turn(g,['wiki:'+skill,potion]);if(skill===36688)g=T.turn(g,[potion,'wiki:20117']);
 const draws=g.battle.randomStatusEvents.filter(e=>e.effectId===effect&&e.type==='draw');
 assert.equal(draws.length,2);assert.equal(new Set(draws.map(e=>e.name)).size,2);
 const end=g.battle.fighters[1].ailments[limit];assert.ok(end>=g.battle.round);assert.deepEqual(T.candidates(g,1),[]);
 while(g.battle.round<=end)g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[1]);
});

test('涡锋28351从完整异常池抽中凝滞，实际切换受限且到期恢复',()=>{
 const [skill,effect,seed,limit]=[28351,1367,2,'凝滞']; let g=T.create([[member(4521,skill)],[member(3056,20117),member(2988)]],[0,0],{seed,criticals:false});
 g=T.turn(g,['wiki:'+skill,potion]);if(skill===36688)g=T.turn(g,[potion,'wiki:20117']);
 const draws=g.battle.randomStatusEvents.filter(e=>e.effectId===effect&&e.type==='draw');
 assert.equal(draws.length,2);assert.equal(new Set(draws.map(e=>e.name)).size,2);
 const end=g.battle.fighters[1].ailments[limit];assert.ok(end>=g.battle.round);assert.deepEqual(T.candidates(g,1),[]);
 while(g.battle.round<=end)g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[1]);
});
test('王·圣鸣净界击败后封继任者属性技能命中效果，神圣之霆下一次减少时解除',()=>{
 const owner=member(4004,38473); let g=T.create([[owner],[member(2988),member(3056,20117)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].soulId,2121);g.battle.fighters[1].hp=1;g.slots[1][1].fighter.counts.immune=5;
 g=T.turn(g,['wiki:38473',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);const f=g.battle.fighters[1],st=g.battle.fighters[0].soulState;
 assert.equal(f.soulState.thunderSeal2551.serial,st.holyThunderSpentSerial);const pp=f.pp['wiki:20117'];
 g=T.turn(g,[potion,'wiki:20117']);assert.equal(g.battle.fighters[1].pp['wiki:20117'],pp-1);assert.equal(g.battle.fighters[1].stages.atk,0);
 g=T.turn(g,['wiki:38473',potion]);assert.ok(g.battle.fighters[0].soulState.holyThunderSpentSerial>st.holyThunderSpentSerial);
 g=T.turn(g,[potion,'wiki:20117']);assert.ok(g.battle.fighters[1].stages.atk>0);
});
test('圣荷慰心支援队友击败对手，回复场下存活精灵，双方后继分别承接两种莲花效果',()=>{
 let g=T.create([[member(2987,10004),member(3888,38583),member(4069),member(3056)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 for(const slot of g.slots[0].slice(1))slot.fighter.hp=2000;
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:10004',potion]);assert.equal(g.phase,'replace');
 assert.deepEqual(g.slots[0].slice(1).map(slot=>slot.fighter.hp),[5000,5000,5000]);
 g=T.replace(g,[null,1]);const foe=g.battle.fighters[1];assert.ok(foe.ailments['失神']>=g.battle.round);assert.equal(foe.moves.filter(k=>foe.pp[k]===0).length,2);
 g=T.turn(g,[{switchTo:3},potion]);const f=g.battle.fighters[0];assert.equal(f.suitState.shield,400);assert.equal(f.suitState.barrier,400);
});
test('没有装备慧海芙音时，场下凌波清芙不会额外触发被击败效果',()=>{
 const lotus=member(3888);lotus.moves=lotus.moves.filter(k=>k!==38583);if(lotus.moves.length<5)lotus.moves.push(lotus.snapshot.moves.find(m=>!m.fifth&&!lotus.moves.includes(m.id)).id);
 let g=T.create([[member(2987,10004),lotus],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});g.slots[0][1].fighter.hp=2000;
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:10004',potion]);assert.equal(g.slots[0][1].fighter.hp,2000);
});
test('英雄之诫仅授名单成员，六项面板各加65且返场不重复，最高抗性抵抗后不产生全免',()=>{
 const wing=member(2987);wing.build.resistance={major:'束缚',minor:'烧伤'};
 let g=T.create([[member(4800,38087),wing,member(3056)],[member(4995,38549)]],[0,0],{seed:13,criticals:false});
 const before={...g.slots[0][1].fighter.stats},other={...g.slots[0][2].fighter.stats};
 g=T.turn(g,['wiki:38087',potion]);assert.equal(g.phase,'replace');assert.ok(g.slots[0][0].fighter.soulState.vanished);
 g=T.replace(g,[1,null]);const f=g.battle.fighters[0];assert.ok(f.soulState.heroOath2009);
 for(const k of ['maxHp','atk','def','spa','spd','spe'])assert.equal(f.stats[k],before[k]+65);
 assert.deepEqual(g.slots[0][2].fighter.stats,other);
 f.counts.immune=0;delete f.soulState.ailmentImmuneSources;assert.equal(E.GEAR.resistanceChance(f,'束缚'),1);
 g=T.turn(g,[potion,'wiki:38549']);assert.ok(!g.battle.fighters[0].ailments['束缚']);assert.ok((g.battle.fighters[0].resistUntil??0)<g.battle.round);
 g=T.turn(g,[{switchTo:2},potion]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].stats.maxHp,before.maxHp+65);
});
test('英雄之耀按双攻差提高其余面板，入场武诛压低对手先制，攻击消费后下次攻击重新授予',()=>{
 const owner=member(4800,38086);owner.build.overrides.atk=500;owner.build.overrides.spa=300;
 let g=T.create([[owner,member(2987),member(2988),member(3056)],[member(2987,10004)]],[0,0],{seed:13,criticals:false});
 let f=g.battle.fighters[0],target=g.battle.fighters[1];assert.equal(f.stats.maxHp,9090);assert.equal(target.soulState.wuzhu2009End,3);
 g=T.turn(g,['wiki:38086','wiki:10004']);assert.equal(g.battle.fighters[1].soulState.resolvedPriority.value,-2);assert.ok(!g.battle.fighters[1].soulState.wuzhu2009End);
 g=T.turn(g,['wiki:38086',potion]);assert.equal(g.battle.fighters[1].soulState.wuzhu2009End,4);
});
test('赫斯提亚敌方换入时附炙光火种，己方换回后第五只消耗队友受攻后剩余两层',()=>{
 const owner=member(4627,37251);if(!owner.moves.includes(28674))owner.moves[1]=28674;
 let g=T.create([[owner,member(2987)],[member(2988),member(3056,10127)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].ailments['烧伤']=3;g=T.turn(g,['wiki:28674',{switchTo:1}]);assert.ok(g.battle.fighters[1].soulState.specialStates['炙光火种']);
 g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.battle.fighters[0].soulState.guardedFlame1833,2);
 g=T.turn(g,[{switchTo:0},potion]);assert.ok(g.battle.fighters[1].ailments['烧伤']>=g.battle.round);const round=g.battle.round;
 g=T.turn(g,['wiki:37251',potion]);assert.equal(g.battle.fighters[0].soulState.guardedFlame1833,0);
 // Latest2147 answer: two active burn events are true; periodic burn remains a separate event.
 const activeBurn=g.battle.turns.at(-1).events.filter(e=>e.text.includes('佑灵触发烧伤体力扣除'));
 assert.equal(activeBurn.length,2);assert.ok(activeBurn.every(e=>e.damage?.type==='true'&&e.damage.settledDamage===1125&&e.damage.sourceSide===0&&e.damage.targetSide===1));
 const naturalBurn=g.battle.turns.at(-1).events.filter(e=>e.text.includes('烧伤：损失')&&e.damage?.targetSide===1);
 assert.equal(naturalBurn.length,1);assert.equal(naturalBurn[0].damage.type,'true');assert.equal(naturalBurn[0].damage.settledDamage,1125);
});
test('库坦战阶无强化才封下回合中切，取得强化后不再续封',()=>{
 let g=T.create([[member(4503)],[member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].stages.atk=-2;g.battle.fighters[0].stages.def=-2;
 g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[]);
 g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[1]);
});
test('云舆瑞兽战阶为全队存活成员各回41，接近满体按上限，倒下者不能回复',()=>{
 let g=T.create([[member(4963),member(3056),member(2987),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=4500;g.slots[0][1].fighter.hp=6000;g.slots[0][2].fighter.hp=8999;g.slots[0][3].fighter.hp=0;
 g=T.turn(g,[potion,potion]);assert.deepEqual(g.slots[0].map(s=>s.fighter.hp),[4541,6041,9000,0]);
});
test("4822重新出场按新回合再次附加易燃",()=>{
 const [id,status,turns,side]=[4822,"易燃",3,1]; let g=T.create([[member(id),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.battle.fighters[side].ailments[status]>=1);g=T.turn(g,[{switchTo:1},{switchTo:1}]);
 assert.ok(!g.battle.fighters[side].ailments[status]);
 const from=g.battle.round;g=T.turn(g,[{switchTo:0},potion]);assert.ok(g.battle.fighters[side].ailments[status]>=from);
 if(turns)assert.equal(g.battle.fighters[side].ailments[status],from+turns-1);
 if(id===4863)assert.ok(g.battle.fighters[0].ailments[status]>=from);
});

test("4823重新出场按新回合再次附加冻伤",()=>{
 const [id,status,turns,side]=[4823,"冻伤",10,0]; let g=T.create([[member(id),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.battle.fighters[side].ailments[status]>=1);g=T.turn(g,[{switchTo:1},{switchTo:1}]);
 assert.ok(!g.battle.fighters[side].ailments[status]);
 const from=g.battle.round;g=T.turn(g,[{switchTo:0},potion]);assert.ok(g.battle.fighters[side].ailments[status]>=from);
 if(turns)assert.equal(g.battle.fighters[side].ailments[status],from+turns-1);
 if(id===4863)assert.ok(g.battle.fighters[0].ailments[status]>=from);
});

test("4863重新出场按新回合再次附加沉默",()=>{
 const [id,status,turns,side]=[4863,"沉默",null,1]; let g=T.create([[member(id),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.battle.fighters[side].ailments[status]>=1);g=T.turn(g,[{switchTo:1},{switchTo:1}]);
 assert.ok(!g.battle.fighters[side].ailments[status]);
 const from=g.battle.round;g=T.turn(g,[{switchTo:0},potion]);assert.ok(g.battle.fighters[side].ailments[status]>=from);
 if(turns)assert.equal(g.battle.fighters[side].ailments[status],from+turns-1);
 if(id===4863)assert.ok(g.battle.fighters[0].ailments[status]>=from);
});
test('南霜返场才使新的对手全属性各加一，离场不触发',()=>{
 let g=T.create([[member(4511),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.battle.fighters[1].stages.acc,0);
 g=T.turn(g,[{switchTo:0},potion]);for(const f of g.battle.fighters)assert.ok(Object.values(f.stages).every(n=>n===1));
});
test('堕息·迹再入场重开两回合窗口，首次登场独有的痕不会给新的目标',()=>{
 let g=T.create([[member(4532),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[1].soulState.jiHen1745,true);g=T.turn(g,[{switchTo:1},{switchTo:1}]);g=T.turn(g,[{switchTo:0},potion]);
 assert.equal(g.battle.fighters[0].soulState.jiEntryEnd,3);assert.ok(!g.battle.fighters[1].soulState.jiHen1745);
});
test('维德弗尼尔真下场移除临时上限并重置比例，返场从60%重新执行',()=>{
 let g=T.create([[member(4951,10001),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 const base=g.battle.fighters[0].stats.maxHp,speed=g.battle.fighters[0].stats.spe;g=T.turn(g,['wiki:10001',potion]);assert.equal(g.battle.fighters[0].stats.maxHp,base+Math.floor(.6*speed));
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.stats.maxHp,base);g=T.turn(g,[{switchTo:0},potion]);
 g=T.turn(g,['wiki:10001',potion]);assert.equal(g.battle.fighters[0].stats.maxHp,base+Math.floor(.6*speed));
});
test('灰鳞变每次在场首次攻击才减上限，换回再触发且使用次数累计',()=>{
 let g=T.create([[member(4885,10086),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 for(const action of ['wiki:10086','wiki:10086',{switchTo:1},{switchTo:0},'wiki:10086'])g=T.turn(g,[action,potion]);
 const f=g.battle.fighters[0];assert.equal(f.stats.maxHp,8800);assert.equal(f.soulState.moth2071.count,2);
});
test('莫塔里安与北鸟换回后分别重新获得来源护罩和双方两回合混乱',()=>{
 for(const id of [4541,4553]){
  let g=T.create([[member(id),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.ok(!g.battle.fighters[1].ailments['混乱']);g=T.turn(g,[{switchTo:0},potion]);
  if(id===4541)assert.equal(g.battle.fighters[0].suitState.barrier,300);
  else for(const f of g.battle.fighters)assert.equal(f.ailments['混乱'],3);
 }
});
test('科萨斯首次被属性命中的180固伤，每次在场独立触发一次',()=>{
 let g=T.create([[member(4432),member(2987)],[member(3056,20117)]],[0,0],{seed:13,criticals:false});
 for(const action of [potion,potion,{switchTo:1},{switchTo:0}])g=T.turn(g,[action,'wiki:20117']);
 assert.deepEqual(g.battle.damageEvents.filter(e=>e.sourceSide===0&&e.type==='fixed'&&e.settledDamage===180).map(e=>e.round),[1,4]);
});
test('蔑天行·戾杀出招前阵亡者不计，未受固伤逐只令下次乘四但真下场重置累计',()=>{
 for(const blocked of [0,1,2]){
  let g=T.create([[member(4444,38384),member(2987)],[member(3056),member(2988),member(2987),member(2995)]],[0,0],{seed:13,criticals:false});
  g.slots[1][3].fighter.hp=0;
  for(let i=1;i<=blocked;i++)g.slots[1][i].fighter.effects['固定百分比免疫']={start:1,end:1};
  g=T.turn(g,['wiki:38384',potion]);const amount=4*4**blocked;
  assert.deepEqual(g.slots[1].slice(1).map((s,i)=>s.fighter.hp),[blocked>=1?9000:8996,blocked>=2?9000:8996,0]);
  assert.equal(g.battle.fighters[0].soulState.ghostFixedAmount,amount);
  g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.ghostFixedAmount,undefined);g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.ghostFixedAmount,undefined);
 }
});
test('按体力百分比判麻痹和先50%触发再100%冰封的队友均贡献一层英雄之耀',()=>{
 for(const id of [3406,4001,4657]){
  const g=T.create([[member(4800),member(id),member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
  assert.equal(g.battle.fighters[0].soulState.heroGlory2009,3,String(id));
 }
});
test('空元之录在空元行者处于替补席时收录双方阵亡替补，以实际减少上限计诗章且单次封顶',()=>{
 const small=member(2987);small.build.overrides.maxHp=1000;
 const corpse=member(3056);corpse.build.overrides.maxHp=9999;
 let g=T.create([[member(3056),member(4586),small],[member(2988),corpse]],[0,0],{seed:13,criticals:false});
 g.slots[0][2].fighter.hp=0;g.slots[1][1].fighter.hp=0;
 g=T.turn(g,[potion,potion]);const owner=g.slots[0][1].fighter;assert.equal(owner.soulState.emptyVerses1791,2);
 assert.equal(owner.stats.maxHp,10010);assert.equal(owner.hp,9000);
 assert.ok(g.slots[0][2].fighter.soulState.vanished);assert.ok(g.slots[1][1].fighter.soulState.vanished);
 g=T.turn(g,[{switchTo:1},potion]);for(let i=0;i<5;i++)g=T.turn(g,['potion:hp',potion]);assert.equal(g.battle.fighters[0].hp,10010);g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.slots[0][1].fighter.stats.maxHp,9000);assert.equal(g.slots[0][1].fighter.hp,9000);assert.equal(g.slots[0][1].fighter.soulState.poemCapacity1791,undefined);assert.equal(g.slots[0][1].fighter.soulState.emptyVerses1791,2);
});
function versionMember(id,soul,skill){
 const unit=member(id);unit.snapshot=E.WIKI.versionSnapshots(unit.snapshot).find(v=>v.selectedSoulId===soul)??unit.snapshot;
 unit.snapshot.selectedSoulId=soul;unit.moves=E.WIKI.defaultMoves(unit.snapshot);if(skill&&!unit.moves.includes(skill))unit.moves[1]=skill;return unit;
}
for(const soul of [2092,2106])test('西西弗'+soul+'真实返场时本次在场的触发数量从本版本初值重新开始',()=>{
 const initial=soul===2092?1:2;let g=T.create([[versionMember(4905,soul,10211),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 for(const action of ['wiki:10211','wiki:10211',{switchTo:1},{switchTo:0}])g=T.turn(g,[action,potion]);
 assert.equal(g.battle.fighters[0].soulState.sisy4905.nextCount,initial);g=T.turn(g,['wiki:10211',potion]);assert.equal(g.battle.fighters[0].soulState.sisy4905.nextCount,initial+1);
});
test('蕊沃尔2095首次攻击必暴，双方暴击计数随换下清空且返场重新必暴',()=>{
 const [soul]=[2095]; let g=T.create([[versionMember(4908,soul,10086),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:true});
 g=T.turn(g,['wiki:10086',potion]);let st=g.battle.fighters[0].soulState.rebel4908;assert.equal(st.firstAttackUsed,true);assert.ok(st.ownCrit>=1);
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);st=g.battle.fighters[0].soulState.rebel4908;assert.equal(st.firstAttackUsed,false);assert.deepEqual([st.ownCrit,st.foeCrit],[0,0]);
 g=T.turn(g,['wiki:10086',potion]);assert.equal(g.battle.fighters[0].soulState.rebel4908.ownCrit,1);
});

test('蕊沃尔2107首次攻击必暴，双方暴击计数随换下清空且返场重新必暴',()=>{
 const [soul]=[2107]; let g=T.create([[versionMember(4908,soul,10086),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:true});
 g=T.turn(g,['wiki:10086',potion]);let st=g.battle.fighters[0].soulState.rebel4908;assert.equal(st.firstAttackUsed,true);assert.ok(st.ownCrit>=1);
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);st=g.battle.fighters[0].soulState.rebel4908;assert.equal(st.firstAttackUsed,false);assert.deepEqual([st.ownCrit,st.foeCrit],[0,0]);
 g=T.turn(g,['wiki:10086',potion]);assert.equal(g.battle.fighters[0].soulState.rebel4908.ownCrit,1);
});
test('西曼德妮2100真下场清已记录异常，返场以新对手实际技能重新记录类型',()=>{
 const [soul]=[2100]; let g=T.create([[versionMember(4915,soul),member(2987)],[member(3056,20117)]],[0,0],{seed:13,criticals:false});
 const initial=g.battle.fighters[0].soulState.observation4915;initial.active=false;initial.status='流血';
 g=T.turn(g,[potion,'wiki:20117']);const st=g.battle.fighters[0].soulState.observation4915;assert.equal(st.kind,'status');
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},'wiki:19369']);
 const next=g.battle.fighters[0].soulState.observation4915;assert.equal(next.active,false);assert.equal(next.status,null);assert.equal(next.kind,'physical');
});

test('西曼德妮2108真下场清已记录异常，返场以新对手实际技能重新记录类型',()=>{
 const [soul]=[2108]; let g=T.create([[versionMember(4915,soul),member(2987)],[member(3056,20117)]],[0,0],{seed:13,criticals:false});
 const initial=g.battle.fighters[0].soulState.observation4915;initial.active=false;initial.status='流血';
 g=T.turn(g,[potion,'wiki:20117']);const st=g.battle.fighters[0].soulState.observation4915;assert.equal(st.kind,'status');
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},'wiki:19369']);
 const next=g.battle.fighters[0].soulState.observation4915;assert.equal(next.active,false);assert.equal(next.status,null);assert.equal(next.kind,'physical');
});
test('哀目黑子战阶敌失神时下回合封换，没有继续失神则下一回合恢复',()=>{
 let g=T.create([[member(4642)],[member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].ailments['失神']=1;g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[]);
 g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[1]);
});
test('墟婆实际消耗600，每只存活替补各回600，濒满受上限约束且阵亡者不复活',()=>{
 let g=T.create([[member(4922),member(3056),member(2987),member(2988),member(2995)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=3000;[2000,4500,8990,0].forEach((hp,i)=>g.slots[0][i+1].fighter.hp=hp);
 g=T.turn(g,[potion,potion]);assert.deepEqual(g.slots[0].map(s=>s.fighter.hp),[9000,2600,5100,9000,0]);
});
test('王·天冕奉世可选档位0按待命背包设定付费、回复真正精灵王并补满首标记',()=>{const [selection,tier]=[38472,0];
 const owner=versionMember(4004,2121,38472);owner.moves=owner.moves.map(id=>id===38472?selection:id);
 const ally=versionMember(3516,1985),other=member(3056);
 let g=T.create([[owner,ally,other],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 const f=g.slots[0][1].fighter,nonKing=g.slots[0][2].fighter;f.hp=100;nonKing.hp=100;for(const k of f.moves)f.pp[k]=0;nonKing.pp[nonKing.moves[0]]=0;
 const key='wiki:'+selection;assert.ok(g.battle.fighters[0].moves.includes(key));assert.equal(g.battle.moveDefinitions[key].wikiId,38472);
 g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[0].hp,tier===6?1:0);assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,1);
 const healed=g.slots[0][1].fighter;assert.equal(healed.hp,healed.stats.maxHp);for(const k of healed.moves)assert.equal(healed.pp[k],healed.teamPPDefinitions[k].pp);
 assert.equal(g.slots[0][2].fighter.hp,100);assert.equal(g.slots[0][2].fighter.pp[nonKing.moves[0]],0);assert.equal(healed.soulState.sealLayers??0,tier>=5?4:0);
 if(tier>=5)assert.equal(g.battle.fighters[0].soulState.holyThunder,6);
 if(tier===6){g=T.turn(g,[{switchTo:2},potion]);g=T.turn(g,[{switchTo:0},potion]);const prev=g.battle.fighters[1].counts.nextSkillInvalid;g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,prev);}
});
test('王·天冕奉世可选档位5按待命背包设定付费、回复真正精灵王并补满首标记',()=>{const [selection,tier]=["38472@5",5];
 const owner=versionMember(4004,2121,38472);owner.moves=owner.moves.map(id=>id===38472?selection:id);
 const ally=versionMember(3516,1985),other=member(3056);
 let g=T.create([[owner,ally,other],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 const f=g.slots[0][1].fighter,nonKing=g.slots[0][2].fighter;f.hp=100;nonKing.hp=100;for(const k of f.moves)f.pp[k]=0;nonKing.pp[nonKing.moves[0]]=0;
 const key='wiki:'+selection;assert.ok(g.battle.fighters[0].moves.includes(key));assert.equal(g.battle.moveDefinitions[key].wikiId,38472);
 g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[0].hp,tier===6?1:0);assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,1);
 const healed=g.slots[0][1].fighter;assert.equal(healed.hp,healed.stats.maxHp);for(const k of healed.moves)assert.equal(healed.pp[k],healed.teamPPDefinitions[k].pp);
 assert.equal(g.slots[0][2].fighter.hp,100);assert.equal(g.slots[0][2].fighter.pp[nonKing.moves[0]],0);assert.equal(healed.soulState.sealLayers??0,tier>=5?4:0);
 if(tier>=5)assert.equal(g.battle.fighters[0].soulState.holyThunder,6);
 if(tier===6){g=T.turn(g,[{switchTo:2},potion]);g=T.turn(g,[{switchTo:0},potion]);const prev=g.battle.fighters[1].counts.nextSkillInvalid;g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,prev);}
});
test('王·天冕奉世可选档位6按待命背包设定付费、回复真正精灵王并补满首标记',()=>{const [selection,tier]=["38472@6",6];
 const owner=versionMember(4004,2121,38472);owner.moves=owner.moves.map(id=>id===38472?selection:id);
 const ally=versionMember(3516,1985),other=member(3056);
 let g=T.create([[owner,ally,other],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 const f=g.slots[0][1].fighter,nonKing=g.slots[0][2].fighter;f.hp=100;nonKing.hp=100;for(const k of f.moves)f.pp[k]=0;nonKing.pp[nonKing.moves[0]]=0;
 const key='wiki:'+selection;assert.ok(g.battle.fighters[0].moves.includes(key));assert.equal(g.battle.moveDefinitions[key].wikiId,38472);
 g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[0].hp,tier===6?1:0);assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,1);
 const healed=g.slots[0][1].fighter;assert.equal(healed.hp,healed.stats.maxHp);for(const k of healed.moves)assert.equal(healed.pp[k],healed.teamPPDefinitions[k].pp);
 assert.equal(g.slots[0][2].fighter.hp,100);assert.equal(g.slots[0][2].fighter.pp[nonKing.moves[0]],0);assert.equal(healed.soulState.sealLayers??0,tier>=5?4:0);
 if(tier>=5)assert.equal(g.battle.fighters[0].soulState.holyThunder,6);
 if(tier===6){g=T.turn(g,[{switchTo:2},potion]);g=T.turn(g,[{switchTo:0},potion]);const prev=g.battle.fighters[1].counts.nextSkillInvalid;g=T.turn(g,[key,potion]);assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,prev);}
});
test('天冕奉世首标记按所选魂印版本：无上限只加一、上限补满，敌方用的标记也给本人',()=>{
 const kings=[[3407,2093],[3941,1204],[4676,1878],[3524,2005],[3432,2150]].map(([id,soul])=>versionMember(id,soul));
 const owner=versionMember(4004,2121,38472);owner.moves=owner.moves.map(id=>id===38472?'38472@6':id);
 let g=T.create([[owner,...kings],[member(2988)]],[0,0],{seed:13,criticals:false});g.slots[0][1].fighter.soulState.nineScars=8;
 g=T.turn(g,['wiki:38472@6',potion]);const [scars,hoder,lock,might,mirror]=g.slots[0].slice(1).map(slot=>slot.fighter.soulState);
 assert.deepEqual([scars.nineScars,scars.hundredFires??0],[9,0]);assert.equal(hoder.darkSeed.level,5);assert.equal(hoder.darkSeed.phase,'mature');assert.equal(lock.chiyong1878.layers,3);assert.equal(might.inverseMight,5);assert.equal(mirror.mirrors,4);
 assert.ok(!g.battle.fighters[1].soulState.darkSeed);assert.ok(!g.battle.fighters[1].soulState.chiyong1878);
});
test('三种天冕奉世共用每场一次，独立选择与扣PP；原魂印不能携带任何档位',()=>{
 const owner=versionMember(4004,2121),original=versionMember(4004,1260);
 const all=[38472,'38472@5','38472@6'];
 assert.deepEqual(E.WIKI.selectableMoves(original.snapshot).filter(m=>m.id===38472),[]);
 owner.moves=[38473,...all,owner.snapshot.moves.find(m=>m.id===10006).id];
 let g=T.create([[owner,member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:38472@6',potion]);assert.equal(g.battle.fighters[0].hp,1);
 g=T.turn(g,['wiki:38472@5',potion]);g=T.turn(g,['wiki:38472',potion]);assert.equal(g.battle.fighters[0].hp,1);assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,1);
 for(const k of all)assert.equal(g.battle.fighters[0].pp['wiki:'+k],4);
});
test('天冕奉世按双方各自的选档结算；单精灵模式也可区分五只与六只',()=>{
 const a=versionMember(4004,2121,38472),b=versionMember(4004,2121,38472);
 const opts={wikiSnapshots:[a.snapshot,b.snapshot],wikiLoadouts:[a.moves.map(k=>k===38472?'38472@6':k),b.moves.map(k=>k===38472?'38472@5':k)],criticals:false,seed:13};
 for(const [side,tier] of [[0,6],[1,5]]){
  const s=E.createBattle(opts),choices=[potion,potion];choices[side]='wiki:38472@'+tier;
  const out=E.resolveTurn(s,choices);assert.equal(out.fighters[side].hp,tier===6?1:0);assert.equal(out.fighters[side].soulState.holyThunder,6);
 }
});
test('天冕奉世为各版本的有上限首标记补到实战上限，旧日之晷同步可用次数',()=>{
 for(const [id,soul,field,max] of [[3711,987,'natureBlessings',4],[3711,2072,'ningjie',5],[3613,1825,'jasmineCore',3],[3740,1932,'eternalWater',8],[3886,1971,'coldEssence',3],[3941,1834,'darkRoots',5],[4125,2051,'leonOldDialLayers',5],[4287,1508,'lastWhisperLayers',6]]){
  const owner=versionMember(4004,2121,38472);owner.moves=owner.moves.map(k=>k===38472?'38472@6':k);
  let g=T.create([[owner,versionMember(id,soul)],[member(2988)]],[0,0],{seed:13,criticals:false});
  const reserve=g.slots[0][1].fighter;reserve.soulState[field]=1;if(soul===2051)reserve.soulState.leonOldDialUses=1;
  g=T.turn(g,['wiki:38472@6',potion]);const granted=g.slots[0][1].fighter;
  assert.equal(granted.soulState[field],max,String(soul));if(soul===2051)assert.equal(granted.soulState.leonOldDialUses,5);
 }
});
