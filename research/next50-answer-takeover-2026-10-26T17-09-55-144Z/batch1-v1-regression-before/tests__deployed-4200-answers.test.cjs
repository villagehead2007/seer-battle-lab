'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4200-battle.cjs'),{make,pick,turn,timer,key,E}=H;
const marks=f=>Object.values(f.soulState.fatalMarks??{}).reduce((n,v)=>n+v,0);
test('4200 2447先手等对手实际用完才加印记，本次不消费、下一次才真伤消费',()=>{
 const s=make(pick(2447)[0]);s.fighters[1].soulState.fatalCracks=1;let o=turn(s,s.auditMoveId,920040);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[1].pp[key(920040)],98);assert.equal(o.fighters[1].soulState.fatalMarks[key(920040)],1);assert.equal(o.damageEvents.some(e=>e.type==='true'&&e.targetSide===1),false);
 o=turn(o,920031,920040);assert.equal(o.fighters[1].hp,7500);assert.equal(marks(o.fighters[1]),0);
});
test('4200 2447后手给已经实际用过的攻击或属性技能加，控制药剂不附加且不延期到后回合',()=>{
 for(const skill of [920040,920041]){const s=make(pick(2447)[0],{aStats:{spe:1},bStats:{spe:900}});s.fighters[1].soulState.fatalCracks=2;let o=turn(s,s.auditMoveId,skill);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[1].soulState.fatalMarks[key(skill)],2);o=turn(o,920031,skill);assert.equal(o.fighters[1].hp,7200);assert.equal(o.fighters[1].pp[key(skill)],96);}
 for(const mode of ['control','potion','no-cracks']){const s=make(pick(2447)[0]);s.fighters[1].soulState.fatalCracks=mode==='no-cracks'?0:2;if(mode==='control')s.fighters[1].ailments['疲惫']=1;const o=mode==='potion'?E.resolveTurn(s,[key(s.auditMoveId),'potion:hp']):turn(s,s.auditMoveId,920040);assert.equal(marks(o.fighters[1]),0,mode);const n=turn(o,920031,920040);assert.equal(marks(n.fighters[1]),0,mode);}
});
test('4200 2447共享每精灵5/每技3容量，多余丢弃；三枚只从下次关闭附效并保留基础攻击',()=>{
 const cap=make(pick(2447)[0]);cap.fighters[1].soulState.fatalCracks=3;cap.fighters[1].soulState.fatalMarks={[key(920042)]:3,[key(920043)]:1};const full=turn(cap,cap.auditMoveId,920040);assert.equal(marks(full.fighters[1]),5);assert.equal(full.fighters[1].soulState.fatalMarks[key(920040)],1);
 const s=make(pick(2447)[0]);s.fighters[1].soulState.fatalCracks=3;H.op(s,29,[100],920040);let o=turn(s,s.auditMoveId,920040);assert.equal(o.fighters[1].soulState.fatalMarks[key(920040)],3);assert.ok(o.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===1));o=turn(o,920031,920040);assert.equal(o.damageEvents.filter(e=>e.round===2&&e.type==='fixed'&&e.sourceSide===1).length,0);assert.ok(o.damageEvents.some(e=>e.round===2&&e.type==='attack'&&e.sourceSide===1));assert.equal(o.fighters[1].hp,6750);assert.equal(marks(o.fighters[1]),0);
});
test('4200 2447对手实际使用现有零PP公共技能后照常附着，下次消费不制造不存在的PP槽',()=>{
 const s=make(pick(2447)[0]);s.fighters[1].soulState.fatalCracks=2;for(const k of s.fighters[1].moves)s.fighters[1].pp[k]=0;
 let o=E.resolveTurn(s,[key(s.auditMoveId),'struggle']);assert.equal(o.fighters[1].soulState.fatalMarks.struggle,2);assert.equal(Object.hasOwn(o.fighters[1].pp,'struggle'),false);
 o=E.resolveTurn(o,[key(920031),'struggle']);assert.equal(marks(o.fighters[1]),0);assert.equal(Object.hasOwn(o.fighters[1].pp,'struggle'),false);assert.ok(o.damageEvents.some(e=>e.round===2&&e.targetSide===1&&e.type==='true'&&e.settledDamage===1800));
});
test('4200 2447精确技能hash序号与空参数，不把用户时序回答推广到未核实来源',()=>{
 const r=E.WIKI.effectsEngine.registry[2447],m=H.source.moves.find(x=>x.id===29477);assert.doesNotThrow(()=>r.validate([],m,5));assert.throws(()=>r.validate([],{...m,hash:'bad'},5));assert.throws(()=>r.validate([],{...m,id:99999},5));assert.throws(()=>r.validate([],m,4));assert.throws(()=>r.validate([1],m,5));
});
test('4200原魂印每回合共享抽样，多段任何一次实际暴击都取消补偿，外部必暴不双获',()=>{
 let external=false,mixed=false;for(let seed=0;seed<70&&!(external&&mixed);seed++){
  const s=make({moveId:10006,index:null},{soul:1422,seed});timer(s,0,'必定暴击');const o=turn(s);if(o.fighters[0].soulState.alectoCritRolls[0]===false){external=true;assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.spe,0);}
  const m=make({moveId:10006,index:null},{soul:1422,seed,hp:5000});m.moveDefinitions[key(10006)].power=6000;H.op(m,31,[2,2],10006);const ops=m.moveDefinitions[key(10006)].operations;H.op(m,1590,[],10006);m.moveDefinitions[key(10006)].operations.push(...ops);const n=turn(m);if(n.fighters[0].soulState.alectoCritRolls[0]===false){const hits=n.turns[0].events.filter(e=>e.kind==='damage'&&e.damage?.type==='attack'&&e.damage.sourceSide===0);if(hits.length===2&&hits[0].detail.includes('暴击 2')&&!hits[1].detail.includes('暴击 2')){mixed=true;assert.equal(n.fighters[0].soulState.alectoCritRolls.length,1);assert.equal(n.fighters[0].stages.atk,0);assert.equal(n.fighters[0].stages.spe,0);}}
 }assert.ok(external&&mixed);
 for(const mode of ['status','control','miss']){const s=make({moveId:10006,index:null},{soul:1422});if(mode==='control')s.fighters[0].ailments['疲惫']=1;if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(10006)].alwaysHit=false;s.moveDefinitions[key(10006)].accuracy=0;}const o=turn(s,mode==='status'?920031:10006);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.spe,0);}
});
function addOps(s,move,list){const ops=[];for(const [id,args]of list){H.op(s,id,args,move);ops.push(...s.moveDefinitions[key(move)].operations);}s.moveDefinitions[key(move)].operations=ops;}
test('4200 1077失败仅关闭属性技能附效各阶段及无效补偿，仍保留必中先制和魂印反应',()=>{
 const initial=make(pick(1077)[0]);timer(initial,1,'免异常');let o=turn(initial,initial.auditMoveId,920040);assert.equal(o.fighters[1].effects['属性技能命中效果失效'].start,2);
 o.fighters[1].soulId=1411;addOps(o,920042,[[4,[0,100,2]],[714,[2]],[2028,[]]]);o.moveDefinitions[key(920042)].accuracy=0;o.moveDefinitions[key(920042)].alwaysHit=false;o.fighters[0].stages.def=2;const n=turn(o,920031,920042);assert.equal(n.turns.at(-1).first,1);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[0].stages.def,2);assert.equal(n.fighters[1].soulState.sakuraLastRawKind,'status');assert.equal(n.fighters[1].pp[key(920042)],98);
 const invalid=structuredClone(o);addOps(invalid,920042,[[1794,[3,1,50]]]);timer(invalid,1,'skillBlock',{},2,2);const x=turn(invalid,920031,920042);assert.equal(x.fighters[1].counts.nextAttackReductionUses??0,0);
 const attack=structuredClone(o);H.op(attack,29,[100],920040);const a=turn(attack,920031,920040);assert.ok(a.damageEvents.some(e=>e.round===2&&e.type==='fixed'&&e.sourceSide===1&&e.settledDamage===100));
});
test('4200正式本地原版和强化魂印分别可选、配入真实10006并实际消耗PP和执行',()=>{
 const store=require('../local-species.cjs'),s=store.species(4200),enemy=store.species(4189);
 for(const soulId of [1422,1762]){const a={...s,selectedSoulId:soulId},load=E.WIKI.defaultMoves(a),slot=load.findIndex(id=>!a.moves.find(m=>m.id===id).fifth);load[slot]=10006;assert.equal(E.WIKI.assess(a,load).supported,true);const enemyMoves=E.WIKI.defaultMoves(enemy),state=E.createBattle({wikiSnapshots:[a,enemy],wikiLoadouts:[load,enemyMoves],criticals:false,builds:[{overrides:{maxHp:9000,spe:500}},{overrides:{maxHp:9000,spe:100}}]});assert.equal(state.fighters[0].soulId,soulId);state.fighters[1].ailments['疲惫']=1;const before=state.fighters[0].pp[key(10006)],o=E.resolveTurn(state,[key(10006),key(enemyMoves[0])]);assert.equal(o.fighters[0].pp[key(10006)],before-1);assert.ok(o.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));if(soulId===1762){assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[0].stages.spe,2);}}
});
