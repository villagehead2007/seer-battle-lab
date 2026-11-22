'use strict';const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),L=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
test('1872完整原招自然MISS不封招而真实免红零伤命中仍封招，保原魂与原技能参数',()=>{
 for(const snapshot of E.WIKI.versionSnapshots(L.species(3514)))for(const mode of['miss','zeroRed']){
  const enemy=L.species(2989),stats={maxHp:9000,atk:180,spa:360,def:4000,spd:4000,spe:9999},s=E.createBattle({wikiSnapshots:[snapshot,enemy],wikiLoadouts:[loadout(snapshot,[36200]),loadout(enemy,[10330])],builds:[{overrides:stats},{overrides:{...stats,spe:1}}],seed:14,criticals:false});
  s.fighters[0].hp=8000;s.fighters[0].stages.acc=mode==='miss'?-6:6;s.fighters[1].stages.acc=6;if(mode==='zeroRed')s.fighters[1].effects['攻击伤害免疫']={start:1,end:3};
  const out=E.resolveTurn(s,['wiki:36200','wiki:10330']);assert.equal(out.fighters[0].soulId,s.fighters[0].soulId);assert.equal(out.fighters[0].pp['wiki:36200'],s.fighters[0].pp['wiki:36200']-1);
  assert.equal(out.fighters[1].soulState.hunterAttackBlockRound,mode==='miss'?undefined:1);assert.equal((out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0).reduce((n,e)=>n+e.settledDamage,0),0);assert.equal((out.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===1),mode==='miss');
 }
});
