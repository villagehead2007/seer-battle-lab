'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{versions,pp,status,make,turn,equipped,firstFailure}=require('./helpers/3425-status-native.cjs');
const low=versions.filter(v=>!make(v).battle.fighters[0].moves.includes('wiki:37198'));
assert.equal(low.length,2);
test('3425原740与1030低版真实50%封属均有成功失败，失败后紧接次回合原穿梭必失效且保底一次消费',()=>{
 for(const source of low){let success;for(let i=0;i<32;i++){const g=turn(make(source,'3425-success-'+i),pp,status);if(g.battle.fighters[1].stages.spe===0){success=g;break;}}assert.ok(success);assert.equal(success.battle.fighters[0].soulState.oscarGuaranteed,false);assert.equal(success.battle.fighters[1].counts.nextStatusInvalid??0,0);let{g}=firstFailure(source);assert.equal(g.battle.fighters[1].stages.spe,1);assert.equal(g.battle.fighters[0].soulState.oscarGuaranteeRound,2);g=turn(g,pp,status);assert.equal(g.battle.fighters[1].stages.spe,1);assert.equal(g.battle.fighters[0].soulState.oscarGuaranteed,false);assert.equal(g.battle.fighters[0].soulState.oscarGuaranteeRound,undefined);assert.equal(g.battle.fighters[1].counts.nextStatusInvalid??0,0);}
});
test('3425原740下回合保底跳过即过期，1030下一次保底跨真实PP空回合仍生效，不共用时限',()=>{
 const original=low.find(v=>v.selectedSoulId===740),advanced=low.find(v=>v.selectedSoulId===1030);let selected;for(let i=0;i<48;i++){const seed='3425-gap-'+i;let g=turn(make(original,seed),pp,status);if(g.battle.fighters[1].stages.spe!==1)continue;g=turn(g);g=turn(g,pp,status);if(g.battle.fighters[1].stages.spe===2){selected={seed,g};break;}}assert.ok(selected,'finite legal seeds expose a genuine second50% miss');assert.equal(selected.g.battle.fighters[0].soulState.oscarGuaranteeRound,4);let g=turn(make(advanced,selected.seed),pp,status);assert.equal(g.battle.fighters[1].stages.spe,1);g=turn(g);assert.equal(g.battle.fighters[0].soulState.oscarGuaranteed,true);g=turn(g,pp,status);assert.equal(g.battle.fighters[1].stages.spe,1);assert.equal(g.battle.fighters[0].soulState.oscarGuaranteed,false);
});
test('3425两真实37198版本携带原第五才提升封属至100%，不同种子与连续原属性行动均无强化且不残留无效库存',()=>{
 const high=versions.filter(v=>equipped(make(v)));assert.equal(high.length,2);for(const source of high)for(let i=0;i<8;i++){let g=make(source,'3425-carried-fifth-'+i);for(let r=1;r<=3;r++){g=turn(g,pp,status);assert.equal(g.battle.fighters[1].stages.spe,0);assert.equal(g.battle.fighters[1].counts.nextStatusInvalid??0,0);assert.equal(g.battle.fighters[0].soulState.oscarGuaranteed,false);}}
});
