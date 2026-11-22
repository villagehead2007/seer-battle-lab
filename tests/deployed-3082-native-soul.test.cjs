'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3082-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3082魂424每轮随机两种不同能力减一，原生32种子有多组合，药剂与疲惫仍触发、负六和免弱不补抽',()=>{
 const seen=new Set();for(let seed=1;seed<=32;seed++){const s=turn(make(12258,{seed}),pp),negative=keys.filter(k=>s.fighters[1].stages[k]===-1);assert.equal(negative.length,2);assert.ok(keys.every(k=>s.fighters[1].stages[k]===0||s.fighters[1].stages[k]===-1));seen.add(negative.join(','));assert.equal(s.fighters[0].hp,4500);assert.equal(s.fighters[1].hp,9000);}assert.ok(seen.size>3);const floor=turn(make(12258,{bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),pp);assert.ok(Object.values(floor.fighters[1].stages).every(n=>n===-6));const immune=turn(make(12258,{enemyId:3291}),pp);assert.ok(Object.values(immune.fighters[1].stages).every(n=>n===0));const controlled=turn(make(12258,{aAilments:{疲惫:2}}),12258);assert.equal(keys.filter(k=>controlled.fighters[1].stages[k]===-1).length,2);assert.equal(controlled.fighters[0].pp['wiki:12258'],30);
});
test('3082魂424首两轮封原生属性招且首次惩罚固定350，第三轮属性招恢复，用药不受惩罚',()=>{
 const raised=s=>s.turns.at(-1).events.some(e=>{const m=e.text.match(/^B 方 速度等级 (-?\d+) → (-?\d+)/);return m&&Number(m[2])>Number(m[1]);});
 let s=turn(make(12258,{enemyMoves:[20889],bStages:{acc:6}}),pp,20889);assert.equal(s.fighters[1].hp,8650);assert.equal(s.fighters[1].counts.mystic424NextRedDouble,1);assert.equal(s.damageEvents.find(e=>e.sourceSide===0&&e.type==='fixed').settledDamage,350);assert.equal(s.fighters[1].pp['wiki:20889'],s.moveDefinitions['wiki:20889'].pp-1);assert.equal(raised(s),false);s=turn(s,pp);assert.equal(s.fighters[1].hp,8650);s=turn(s,pp,20889);assert.equal(raised(s),true);assert.equal(s.fighters[1].hp,8650);assert.equal(s.fighters[1].pp['wiki:20889'],s.moveDefinitions['wiki:20889'].pp-1);
 let second=turn(make(12258,{enemyMoves:[20889],bStages:{acc:6}}),pp);second=turn(second,pp,20889);assert.equal(second.fighters[1].hp,8650);assert.equal(raised(second),false);
 const potion=turn(make(12258),pp);assert.equal(potion.fighters[1].hp,9000);assert.equal(potion.fighters[1].counts.mystic424NextRedDouble??0,0);
});
test('3082魂424标记使下一次正红伤两倍且只消费一次，非红分类由人答专项另验',()=>{
 let s=turn(make(12258,{enemyMoves:[20889],bStages:{acc:6}}),pp,20889);for(let r=2;r<=3;r++){s=turn(s,12258);const e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),raw=Number(e.detail.match(/= (\d+)；暴击/)[1]);assert.ok(raw>0);assert.equal(e.damage.settledDamage,raw*(r===2?2:1));assert.equal(s.fighters[1].counts.mystic424NextRedDouble,0);}
});
