'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn,pick,timer,op,key}=require('./helpers/4169-battle.cjs');
const total=f=>Object.values(f.soulState.fatalMarks??{}).reduce((a,b)=>a+b,0);
function operations(s,id,instances){const c=E.WIKI.effectsEngine.compileInstances(instances.map(([id,args])=>({id,args,description:E.WIKI.effectsEngine.registry[id].template})),instances.map(([id])=>{const r=E.WIKI.effectsEngine.registry[id];return{id,argsNum:r.argsNum,template:r.template};}),{id});assert.equal(c.issue,'');s.moveDefinitions[key(id)].operations=c.operations;}
test('4169魂印1394首次真实散布五枚，每技能至多三枚且同种子可复现',()=>{
 const seen=new Set;
 for(let seed=0;seed<50;seed++){
  const s=make({moveId:10047,index:null},{soul:1394,omit:true,initialSeed:String(seed)}),again=make({moveId:10047,index:null},{soul:1394,omit:true,initialSeed:String(seed)}),f=s.fighters[1];
  assert.equal(total(f),5);assert.ok(Object.values(f.soulState.fatalMarks).every(n=>n>=1&&n<=3));assert.deepEqual(f.soulState.fatalMarks,again.fighters[1].soulState.fatalMarks);assert.equal(s.fatalMarkEvents.length,5);assert.ok(s.fatalMarkEvents.every(e=>e.candidates.length>=4));seen.add(JSON.stringify(f.soulState.fatalMarks));
 }
 assert.ok(seen.size>20);
});
test('4169 1642逐枚独立均匀选合法技能，已满三枚改选，精灵总量五枚不溢出',()=>{
 const spread=new Set,selected=new Set;
 for(let seed=0;seed<60;seed++){
  const s=make(pick(1642)[0],{seed});s.fighters[1].stages.atk=1;s.fighters[1].ailments['疲惫']=3;const o=turn(s);assert.equal(total(o.fighters[1]),2);const draws=o.fatalMarkEvents.filter(e=>e.effectId===1642);assert.equal(draws.length,2);for(const d of draws){assert.equal(d.candidates.length,5);selected.add(d.skillId);}spread.add(Object.values(o.fighters[1].soulState.fatalMarks).sort().join(','));
 }
 assert.equal(selected.size,5);assert.ok(spread.has('2')&&spread.has('1,1'));
 for(const initial of [3,4,5]){const s=make(pick(1642)[0]);s.fighters[1].stages.atk=1;s.fighters[1].ailments['疲惫']=3;const keys=s.fighters[1].moves;s.fighters[1].soulState.fatalMarks={[keys[0]]:3};if(initial>3)s.fighters[1].soulState.fatalMarks[keys[1]]=initial-3;const o=turn(s),events=o.fatalMarkEvents??[];assert.equal(total(o.fighters[1]),5);assert.equal(o.fighters[1].soulState.fatalMarks[keys[0]],3);assert.equal(events.length,5-initial);assert.ok(events.every(e=>!e.candidates.includes(keys[0])));}
});
test('4169印记随机池包含零PP技能且不受异常免疫，未行动不消耗',()=>{
 let seen=false;for(let seed=0;seed<40;seed++){const s=make(pick(1642)[0],{seed});s.fighters[1].stages.atk=1;s.fighters[1].ailments['疲惫']=3;s.fighters[1].soulId=622;s.fighters[1].pp[key(920040)]=0;const o=turn(s);assert.equal(total(o.fighters[1]),2);if(o.fighters[1].soulState.fatalMarks[key(920040)])seen=true;}assert.equal(seen,true);
});
test('4169 1650按当前裂痕不足二附一、达到二附二，标记上限及未命中边界',()=>{
 for(const cracks of [0,1,2,3]){const s=make(pick(1650)[0]);s.fighters[1].soulState.fatalCracks=cracks;s.fighters[1].ailments['疲惫']=3;const o=turn(s);assert.equal(total(o.fighters[1]),cracks>=2?2:1);}
 const miss=make(pick(1650)[0],{hit:false});miss.moveDefinitions[key(miss.auditMoveId)].accuracy=0;miss.moveDefinitions[key(miss.auditMoveId)].alwaysHit=false;assert.equal(total(turn(miss).fighters[1]),0);
});
test('4169三枚印记只保留基础攻击必中先制，多段暴击增伤和用后成长全部关闭',()=>{
 const s=make({moveId:10047,index:null},{omit:true,criticals:true});s.fighters[1].soulState.fatalMarks={[key(920040)]:3};operations(s,920040,[[31,[3,3]],[1315,[100]],[29,[300]],[2396,[]]]);s.moveDefinitions[key(920040)].alwaysHit=true;s.moveDefinitions[key(920040)].accuracy=0;const o=turn(s,920031,920040);
 assert.equal(o.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1).length,1);assert.equal(o.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===1),false);assert.equal(o.fighters[1].soulState.attackBonus2396,undefined);assert.equal(o.damageEvents.find(e=>e.type==='true'&&e.targetSide===1).settledDamage,2250);assert.equal(o.fighters[1].pp[key(920040)],98);assert.equal(o.fighters[1].soulState.fatalMarks[key(920040)],undefined);
});
test('4169三枚印记属性技能及无效补偿关闭，保留1HP完整真伤、粉免不免真伤',()=>{
 let s=make({moveId:10047,index:null},{omit:true});s.fighters[1].soulState.fatalMarks={[key(920042)]:3};s.fighters[1].hp=100;operations(s,920042,[[4,[0,100,2]],[1794,[3,1,50]]]);timer(s,1,'skillBlock');timer(s,1,'致命保留',{hp:1});const o=turn(s,920031,920042);assert.equal(o.fighters[1].hp,1);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].counts.nextAttackReductionUses??0,0);const d=o.damageEvents.find(e=>e.type==='true'&&e.targetSide===1);assert.equal(d.settledDamage,2250);assert.equal(d.hpLoss,99);
 s=make({moveId:10047,index:null},{omit:true});s.fighters[1].soulId=622;s.fighters[1].soulState.fatalMarks={[key(920040)]:3};const immune=turn(s,920031,920040);assert.equal(immune.damageEvents.find(e=>e.type==='true'&&e.targetSide===1).settledDamage,2250);
});
test('4169三枚印记仍保留先制但混合先制词条中的消强关闭，魂印独立反应保留',()=>{
 let s=make({moveId:10047,index:null},{omit:true,aStats:{spe:900},bStats:{spe:1}});s.fighters[0].stages.def=1;s.fighters[1].soulState.fatalMarks={[key(920040)]:3};operations(s,920040,[[714,[2]]]);let o=turn(s,920031,920040);assert.ok(o.turns.at(-1).events.find(e=>e.kind==='move').text.startsWith('B 方'));assert.equal(o.fighters[0].stages.def,1);
 s=make({moveId:10047,index:null},{omit:true});s.fighters[1].soulId=2051;s.fighters[1].soulState.fatalMarks={[key(920040)]:3};o=turn(s,920031,920040);assert.equal(o.fighters[1].soulState.leonOldDialLayers,1);assert.equal(o.fighters[1].soulState.leonOldDialUses,1);
});
test('4169击败持有者真实清空印记，施加者被击败不豁免持有者当前使用后的真伤',()=>{
 let s=make({moveId:10047,index:null},{omit:true,targetHp:1});s.fighters[1].soulState.fatalMarks={[key(920040)]:3};let o=turn(s);assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[1].soulState.fatalMarks,undefined);
 s=make({moveId:10047,index:null},{omit:true,hp:1});s.fighters[1].soulState.fatalMarks={[key(920040)]:3};o=turn(s,920031,920040);assert.equal(o.fighters[0].hp,0);assert.equal(o.fighters[1].hp,6750);assert.equal(o.fighters[1].soulState.fatalMarks[key(920040)],undefined);
});
