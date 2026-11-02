'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn,pick,timer,op,key}=require('./helpers/4147-battle.cjs');
const sum=(s,type,target=1)=>(s.damageEvents??[]).filter(e=>e.type===type&&e.targetSide===target).reduce((n,e)=>n+e.settledDamage,0);
const attackValue=o=>Number(o.turns.at(-1).events.find(e=>e.kind==='damage'&&e.detail?.includes('/ 防御')).detail.match(/(?:攻击|特攻) ([\d.]+) \/ 防御/)[1]);
test('4147 1376低体实际HP减少量回复，过量伤害、固定免疫、护罩及回复削减不取理论量',()=>{
 for(const mode of ['overkill','immune','barrier','reduce']){
  const s=make({moveId:10086,index:null},{soul:1376,omit:true,hp:1000,targetHp:mode==='overkill'?200:9000});timer(s,1,'免异常');
  if(mode==='immune')timer(s,1,'固定百分比免疫');if(mode==='barrier')s.fighters[1].suitState.barrier=5000;if(mode==='reduce')timer(s,0,'回复效果削减',{fraction:.5});
  const o=turn(s),actual=(o.damageEvents??[]).filter(e=>e.type==='fixed'&&e.targetSide===1).reduce((n,e)=>n+e.hpLoss,0);
  assert.equal(o.fighters[0].hp,1000+Math.floor(actual*(mode==='reduce'?.5:1)));assert.equal(o.fighters[0].soulState.moonHealPending,undefined);
  if(mode==='overkill'){assert.ok(actual>0&&actual<200);assert.equal(sum(o,'fixed'),2700);}if(['immune','barrier'].includes(mode))assert.equal(actual,0);
 }
});
test('4147 2110按实际先制识别攻击：基础零临时加二减伤，基础三被减到零不减伤',()=>{
 for(const [base,bonus]of [[0,2],[3,-3],[0,0],[2,0]]){
  const s=make({moveId:10086,index:null},{soul:2110,omit:true});s.celestials=[];s.moveDefinitions[key(920040)].priority=base;
  if(bonus>0)timer(s,1,'id984',{amount:bonus});if(bonus<0)timer(s,1,'次回合先制降低',{amount:-bonus});const control=structuredClone(s);control.fighters[0].soulId=null;
  const o=turn(s,undefined,920040),normal=turn(control,undefined,920040);assert.equal(sum(o,'attack',0),base+bonus>0?Math.floor(sum(normal,'attack',0)*.5):sum(normal,'attack',0));
 }
});
test('4147 2110属性先制只减自身携带部分，奇数向上，临时修正仍叠加且实际非正不触发',()=>{
 for(const [base,bonus,expected]of [[2,2,3],[3,0,2],[1,0,1],[0,2,2],[3,-3,0]]){
  const s=make({moveId:10086,index:null},{soul:2110,omit:true});s.celestials=[];s.moveDefinitions[key(920041)].priority=base;
  if(bonus>0)timer(s,1,'id984',{amount:bonus});if(bonus<0)timer(s,1,'次回合先制降低',{amount:-bonus});const o=turn(s);
  assert.ok(o.turns.at(-1).events.some(e=>e.text.includes('先制 0 / '+expected)),base+':'+bonus);assert.equal(o.fighters[0].soulState.moonPriorityPending,undefined);
 }
});
test('4147 1633交换前比例判失明，HP直接调整不受禁疗倍率护盾护罩也不制造伤害事件',()=>{
 for(const higher of [false,true]){
  const s=make(pick(1633)[0],{hp:higher?7200:1800,targetHp:higher?1800:7200});timer(s,0,'技能禁疗');timer(s,0,'回复效果削减',{fraction:1});timer(s,1,'当回合免伤');s.fighters[0].suitState.shield=400;s.fighters[1].suitState.barrier=500;
  const o=turn(s);assert.equal(o.fighters[0].hp,higher?1800:7200);assert.equal(o.fighters[1].hp,higher?7200:1800);assert.equal(!!o.fighters[1].ailments['失明'],higher);
  assert.equal(o.fighters[0].suitState.shield,400);assert.equal(o.fighters[1].suitState.barrier,500);assert.equal(o.damageEvents,undefined);
 }
 const immune=make(pick(1633)[0],{hp:7200,targetHp:1800});timer(immune,1,'免异常');const o=turn(immune);assert.equal(o.fighters[0].hp,1800);assert.equal(o.fighters[1].hp,7200);assert.equal(o.fighters[1].ailments['失明'],undefined);
});
test('4147 1633按各自最大HP向上取整，极小比例保留1且相同比例不失明',()=>{
 let s=make(pick(1633)[0],{hp:1,targetHp:1,aStats:{maxHp:1000},bStats:{maxHp:9000}}),o=turn(s);assert.equal(o.fighters[0].hp,1);assert.equal(o.fighters[1].hp,9);
 s=make(pick(1633)[0],{hp:1000,targetHp:4500,aStats:{maxHp:3000},bStats:{maxHp:9000}});o=turn(s);assert.equal(o.fighters[0].hp,1500);assert.equal(o.fighters[1].hp,3000);
 s=make(pick(1633)[0],{hp:1000,targetHp:3000,aStats:{maxHp:3000},bStats:{maxHp:9000}});o=turn(s);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,3000);assert.equal(o.fighters[1].ailments['失明'],undefined);
});
test('4147 2422护盾最终加在能力等级之后，物特正零负等级精确状态伤害对照且排除护罩',()=>{
 for(const kind of ['physical','special'])for(const stage of [-2,0,2]){
  const s=make(pick(2422)[0],{aStats:{atk:300,spa:300}});s.moveDefinitions[key(s.auditMoveId)].kind=kind;s.fighters[0].stages[kind==='special'?'spa':'atk']=stage;s.fighters[0].suitState.shield=400;s.fighters[0].suitState.barrier=1000;
  const expected=300*E.multiplier(stage)+400,o=turn(s),control=make(pick(2422)[0],{omit:true,aStats:{atk:expected,spa:expected}});control.moveDefinitions[key(control.auditMoveId)].kind=kind;
  const plain=turn(control);assert.equal(attackValue(o),expected);assert.equal(sum(o,'attack'),sum(plain,'attack'));assert.equal(o.fighters[0].suitState.shield,400);assert.equal(o.fighters[0].suitState.barrier,1000);
 }
});
test('4147 2422在伤害结算读取当前盾，先被真实消盾技能耗尽不再计入旧盾',()=>{
 const s=make(pick(2422)[0],{aStats:{atk:300,spe:1},bStats:{spe:900}});s.fighters[0].suitState.shield=400;op(s,1215,[1]);const o=turn(s,undefined,920042);assert.equal(o.fighters[0].suitState.shield,0);assert.equal(o.fighters[0].stages.atk,-1);assert.equal(attackValue(o),200);
});
test('4147真实19技能全部原生有序效果执行及四个合法魂印第五组合完整加载',()=>{
 for(const m of source.moves){const s=make({moveId:m.id,index:null},{hp:1000}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);assert.ok(o.turns.at(-1).events.some(e=>e.kind==='move'&&e.text.includes(m.name)));if(m.kind!=='status')assert.ok((o.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0));}
 const answered=structuredClone(source);for(const m of answered.moves)if([27395,38437].includes(m.id))m.limitations=[];
 const variants=E.WIKI.versionSnapshots(answered);assert.equal(variants.length,4);for(const v of variants){const fifth=E.WIKI.availableMoves(v).find(m=>m.fifth),load=[10086,27395,27396,37963,fifth.id],s=E.createBattle({wikiSnapshots:[v,v],wikiLoadouts:[load,load],criticals:false});assert.equal(s.fighters[0].soulId,v.selectedSoulId);const o=E.resolveTurn(s,[key(fifth.id),key(10086)]);assert.ok(o.turns.at(-1).events.some(e=>e.kind==='move'&&e.text.includes(fifth.name)));assert.ok(o.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));}
});
