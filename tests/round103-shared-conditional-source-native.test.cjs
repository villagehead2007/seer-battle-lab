'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),L=require('../local-species.cjs');
const {loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round103-conditional-native-input-20261113.json');
const stages=['atk','def','spa','spd','spe','acc'];
function make(row,{hp=9000,enemyHp=9000,mode='normal',extra=[],zeroRed=false,pinkImmune=false}={}){
 const source=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>s.selectedSoulId===row.soul),enemy=L.species(2988),stats={maxHp:9000,atk:180,spa:180,def:9999,spd:9999,spe:9999};assert.ok(source);
 const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[extra.length?loadout(source,[row.move,...extra]):row.moves,loadout(enemy,[10018])],builds:[{overrides:stats},{overrides:{...stats,spe:1}}],seed:14,criticals:false});
 s.fighters[0].hp=hp;s.fighters[1].hp=enemyHp;s.fighters[0].stages.acc=6;
 if(pinkImmune)s.fighters[1].effects['固定百分比免疫']={start:1,end:9};
 if(zeroRed)s.fighters[1].effects['攻击伤害免疫']={start:1,end:9};
 if(mode==='invalid')s.fighters[0].effects.skillBlock={start:1,end:1};
 if(mode==='control')s.fighters[0].ailments.疲惫=2;
 if(mode==='zero')s.fighters[0].pp['wiki:'+row.move]=0;
 if(mode==='banHeal')s.fighters[0].effects['无法通过自身技能恢复体力']={start:1,end:9};
 if(mode==='banBoost')s.fighters[0].effects.禁强化={start:1,end:1};
 return s;
}
function turn(s,move){return E.resolveTurn(s,[typeof move==='number'?'wiki:'+move:move,'potion:pp']);}
function execute(row,options={}){
 const before=make(row,options),key='wiki:'+row.move,original=E.SOULS;let atUse;
 E.SOULS={...original,run(event,c){if(event==='afterUse'&&c.a.side===0)atUse=structuredClone(c.a);return original.run(event,c);}};
 let after;try{after=turn(before,options.mode==='potion'?'potion:pp':row.move);}finally{E.SOULS=original;}
 assert.equal(after.fighters[0].pp[key],before.fighters[0].pp[key]-(['control','potion'].includes(options.mode)?0:1));
 const op=after.moveDefinitions[key].operations.find(o=>Number(o.effectId)===row.effect&&o.index===row.index);assert.deepEqual(op.sourceArgs,row.args,row.key);
 return {before,after,atUse};
}
function gates(row,hasGrant){for(const mode of ['invalid','control','potion','zero']){
 if(mode==='zero'){const before=make(row,{mode}),saved=structuredClone(before);assert.throws(()=>turn(before,row.move),/请选择|有 PP/);assert.deepEqual(before,saved);continue;}
 const {after}=execute(row,{mode});assert.equal(hasGrant(after),false,row.key+' '+mode);
}}
function heals(s){return s.turns.at(-1).events.filter(e=>e.kind==='heal'&&e.text.startsWith('A 方 ')).map(e=>Number(e.text.match(/回复 (\d+) 点体力/)?.[1]??0));}
test('九条原57完整招实际按二三四分母回复，其他原魂回血保留并逐笔合计到HP，药剂禁疗及到期共享验证',()=>{
 for(const row of rows.filter(r=>r.effect===57)){
  const {after}=execute(row,{hp:100}),g=after.fighters[0].effects.id57;
  assert.deepEqual(g,{start:1,end:row.args[0],fraction:1/row.args[1]},row.key);
  const event=after.turns[0].events.find(e=>e.text.startsWith('A 方 持续用招回复：'));
  assert.ok(event,row.key);assert.match(event.text,new RegExp('回复 '+9000/row.args[1]+' 点体力'));
  assert.equal(after.fighters[0].hp,100+heals(after).reduce((n,v)=>n+v,0),row.key+' actual HP includes every retained original healing source');
 }
 const row=rows.find(r=>r.id===3529&&r.effect===57);gates(row,s=>!!s.fighters[0].effects.id57);
 const banned=execute(row,{hp:100,mode:'banHeal'}).after;assert.equal(banned.fighters[0].hp,100);
 let s=execute(row,{hp:100,extra:[25113]}).after;assert.equal(s.fighters[0].hp,3100);
 s=turn(s,'potion:pp');assert.equal(s.fighters[0].hp,3100);s=turn(s,25113);assert.equal(s.fighters[0].hp,6100);
 s=turn(s,'potion:pp');s=turn(s,25113);assert.equal(s.fighters[0].hp,6100);
});
test('四条原885按实际高体翻倍，等体及低体各一级，六项实际授予和禁强化共享验证',()=>{
 for(const row of rows.filter(r=>r.effect===885))for(const [hp,enemyHp,n] of [[9000,8500,2],[9000,9000,1],[8500,9000,1]]){
  const {atUse}=execute(row,{hp,enemyHp});assert.ok(atUse,row.key);
  assert.deepEqual(stages.map(k=>atUse.stages[k]),[n,n,n,n,n,6],row.key+' '+hp+'/'+enemyHp);
 }
 const row=rows.find(r=>r.id===3430&&r.effect===885);
 const {atUse}=execute(row,{mode:'banBoost'});assert.deepEqual(stages.map(k=>atUse.stages[k]),[0,0,0,0,0,6]);
 gates(row,s=>stages.slice(0,5).some(k=>s.fighters[0].stages[k]>0));
});
test('四条原693授下两轮百分之一百或一百五十增伤，原普通攻击真实两轮增伤及到期恢复',()=>{
 for(const row of rows.filter(r=>r.effect===693)){
  const {after}=execute(row),g=after.fighters[0].effects.id913;
  assert.deepEqual(g,{start:2,end:3,bonus:row.args[1]/100},row.key);
 }
 const row=rows.find(r=>r.id===3465&&r.effect===693);gates(row,s=>!!s.fighters[0].effects.id913);
 const snapshot=L.species(row.id),plain=E.WIKI.availableMoves(snapshot).find(m=>m.power>0&&!m.effectInstances.length&&!m.fifth);assert.ok(plain);
 let s=execute(row,{extra:[plain.id],enemyHp:8500,pinkImmune:true}).after;
 for(let round=2;round<=4;round++){
  s=turn(s,plain.id);assert.equal(s.fighters[1].soulId,373);const event=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(event);
  assert.ok(event.detail.includes('增减伤 '+(round<=3?1.25:.5)+' ×'),event.detail);
 }
});
test('三个原456在真实零红命中后按280或300严格低于秒杀，等于与高一不杀，未用无效零PP不执行',()=>{
 for(const row of rows.filter(r=>r.effect===456))for(const delta of [-1,0,1]){
  const hp=row.args[0]+delta,{after}=execute(row,{enemyHp:hp,zeroRed:true});
  assert.equal(after.fighters[1].hp,delta<0?0:hp,row.key+' '+hp);
 }
 const row=rows.find(r=>r.move===30016);
 for(const mode of ['invalid','control','potion'])assert.equal(execute(row,{enemyHp:299,mode}).after.fighters[1].hp,299);
 const before=make(row,{mode:'zero',enemyHp:299}),saved=structuredClone(before);assert.throws(()=>turn(before,row.move),/请选择|有 PP/);assert.deepEqual(before,saved);
});
