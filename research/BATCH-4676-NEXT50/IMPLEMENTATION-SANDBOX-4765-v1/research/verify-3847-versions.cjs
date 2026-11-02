'use strict';
const assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),s=store.species(3847);
assert.ok(store.search('3847').results.some(x=>x.id===3847));
for(const group of s.skillVersions){
 const a=structuredClone(s);a.selectedSoulId=group.soulId;a.selectedSkillVersion=group.id;
 const b=structuredClone(store.species(3840));b.souls=[];
 const load=[10250,21684,29011,26688,group.fifthId],opponent=[10086,20491,10225,20746,33174];
 const state=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[load,opponent],criticals:false,builds:[{overrides:{maxHp:9000,spe:999}},{overrides:{maxHp:9000,spe:1}}]});
 assert.equal(state.fighters[0].soulId,group.soulId);assert.equal(state.fighters[0].soulState.corpseCount??0,group.fifthId===38455?1:0);
 state.fighters[1].counts.immune=2;const out=E.resolveTurn(state,['wiki:29011','wiki:10086']);
 assert.equal(out.fighters[1].type,'普通');assert.ok(out.fighters[1].hp<9000);assert.equal(out.fighters[0].pp['wiki:29011'],4);
 assert.equal(out.fighters[0].soulState.contractDamageBonus??0,group.fifthId===38455?100:0);
 console.log(group.id,'local search/load, real partner loadout, corpse activation, stripped type, HP and PP passed');
}
