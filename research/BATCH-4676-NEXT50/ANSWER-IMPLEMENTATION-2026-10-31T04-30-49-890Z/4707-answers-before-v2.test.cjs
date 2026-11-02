'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,turn}=require('./helpers/4707-battle.cjs');
function mixed(){const a=structuredClone(source),b=structuredClone(source),foreign=require('../data/species/4345.json').snapshot,move=foreign.moves.find(m=>m.id===27903);a.moves.push(structuredClone(move));for(const meta of foreign.effects)if(!a.effects.some(e=>e.id===meta.id))a.effects.push(structuredClone(meta));for(const [side,s]of [a,b].entries()){s.souls=[];for(const m of s.moves){m.deferredEffects=[];m.limitations=[];if(side===0&&[27903,28923].includes(m.id)){m.effectInstances=m.effectInstances.filter(e=>e.id===1768);m.effectIds=[1768];}else{m.effectInstances=[];m.effectIds=[];m.description='';}}}
 // Preserve original effect indexes via compiled full raw instances, not a fabricated ID binding.
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[[27903,28923,28924,37718,37721],[37718,28923,28924,37720,37721]],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:9000,def:300,spd:300,spe:100}}]});
 for(const [snapshot,id]of[[source,28923],[foreign,27903]]){const raw=snapshot.moves.find(m=>m.id===id),compiled=E.WIKI.effectsEngine.compileInstances(raw.effectInstances,snapshot.effects,raw);assert.equal(compiled.issue,'');s.moveDefinitions[key(id)].operations=compiled.operations.filter(o=>o.effectId===1768);}
 for(const f of s.fighters){f.effects['攻击必中']={start:1,end:99};f.effects['属性必中']={start:1,end:99};}return s;
}
test('4707与已部署4345真实1768来源并存，后得先转换一份且各自300上限独立',()=>{
 for(const latest of[28923,27903]){const s=mixed(),first=latest===28923?27903:28923;turn(s,first,28924);turn(s,latest,28924);assert.equal(s.fighters[0].counts.nextAttackShieldConversion,2);
  const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);if(e==='beforeDamage'&&c.a.side===1)c.ignoreShield=true;}};
  try{turn(s,28924,37718);assert.equal(s.fighters[0].counts.nextAttackShieldConversion,1);const layers=s.fighters[0].suitState.shieldLayers;assert.equal(layers.length,1);assert.ok(layers[0].source.includes(':'+latest+':'));assert.equal(layers[0].amount,300);turn(s,28924,37718);}finally{E.SOULS=old;}
  assert.equal(s.fighters[0].counts.nextAttackShieldConversion,0);assert.equal(s.fighters[0].suitState.shield,600);assert.equal(s.fighters[0].hp,9000);
 }
});
