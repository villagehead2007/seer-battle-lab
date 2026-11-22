'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs'),store=require('../local-species.cjs');
test('3240完整32原招较慢出手只由原基础先制抢先，幽侵无负级不获条件先制且原魂未预授优先级',()=>{
 for(const m of H.source.moves){const s=H.turn(H.make(m.id,{aStages:{acc:6},aStats:{spe:1},bStats:{spe:4000},enemyMoves:[10086]}),m.id,10086);assert.equal(s.turns[0].first,m.priority>0?0:1,m.name);assert.equal(s.fighters[0].soulState.resolvedPriority.value,m.priority,m.name);assert.equal(s.fighters[0].pp['wiki:'+m.id],m.pp-1,m.name);}
});
test('3240全部原必中招在负六命中与100闪避下真实用招，正常耗PP且不走MISS分支',()=>{
 for(const m of H.source.moves.filter(m=>m.alwaysHit)){let observed=false,miss;const old=H.E.SOULS;H.E.SOULS={...old,run(event,c){const out=old.run(event,c);if(event==='afterUse'&&c.a.side===0){observed=true;miss=!!c.invalidReason?.miss;}return out;}};let s;try{s=H.turn(H.make(m.id,{aStages:{acc:-6},bEffects:{概率闪避:{start:1,end:3,chance:100}}}),m.id);}finally{H.E.SOULS=old;}assert.ok(observed,m.name);assert.equal(miss,false,m.name);assert.equal(s.fighters[0].pp['wiki:'+m.id],m.pp-1,m.name);if(m.kind!=='status')assert.ok(H.damage(s,'attack')>0,m.name);}
});
test('3240原抽打正常暴击自然有与无，源1/16字段及原40威力物攻不替换',()=>{
 const m=H.source.moves.find(m=>m.id===10535);assert.equal(m.power,40);assert.equal(m.kind,'physical');assert.equal(m.critical,'1/16');const outcomes=new Set;for(let n=1;n<=96&&outcomes.size<2;n++){const a=structuredClone(H.source),b=store.species(2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000},s=H.E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[H.loadout(a,[10535]),H.loadout(b,[])],seed:Math.imul(n,2654435761)>>>0,criticals:true,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]}),o=H.turn(s,10535);assert.ok(H.damage(o,'attack')>0);outcomes.add(o.turns[0].events.some(e=>e.text?.includes('致命一击')));}assert.deepEqual([...outcomes].sort(),[false,true]);
});
