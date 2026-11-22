'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),L=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const rows=require('../research/TEAM-STAGE-2/round101-timed-native-input-20261113.json'),cache=new Map();
function make(row,mode='normal',extra=[]){
 const source=L.species(row.id),enemy=L.species(2988),moves=extra.length?loadout(source,[row.move,...extra]):row.moves;
 const stats={maxHp:9000,atk:180,spa:180,def:9999,spd:9999,spe:1};
 const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[moves,loadout(enemy,[10018])],builds:[{overrides:stats},{overrides:{...stats,spe:9999}}],seed:14,criticals:false});
 const a=s.fighters[0];a.stages.acc=6;s.fighters[1].stages.acc=6;
 if(mode==='invalid')a.effects.skillBlock={start:1,end:1};
 if(mode==='control')a.ailments.疲惫=2;
 if(mode==='zero')a.pp['wiki:'+row.move]=0;
 assert.equal(a.soulId,row.soul);return s;
}
function turn(s,move,enemy='potion:pp'){return E.resolveTurn(s,[typeof move==='number'?'wiki:'+move:move,enemy]);}
function actual(row){const key=row.id+':'+row.move;if(!cache.has(key)){const before=make(row);cache.set(key,{before,after:turn(before,row.move)});}return cache.get(key);}
function grant(s,effect){const f=s.fighters[0];return effect===843?f.effects.id984:effect===58?f.effects['必定暴击']:f.counts.attackNullify;}
function sources(effect){for(const row of rows.filter(r=>r.effect===effect)){
 const {before,after}=actual(row),key='wiki:'+row.move;
 assert.equal(after.fighters[0].pp[key],before.fighters[0].pp[key]-1,row.key);
 const op=after.moveDefinitions[key].operations.find(o=>Number(o.effectId)===effect&&o.index===row.index);assert.deepEqual(op.sourceArgs,row.args,row.key);
 if(effect===570)assert.equal(grant(after,effect),row.args[0],row.key);
 else {const g=grant(after,effect);assert.ok(g,row.key);assert.equal(g.start,2,row.key);assert.equal(g.end,1+row.args[0],row.key);if(effect===843)assert.equal(g.amount,row.args[1],row.key);}
}}
function gates(row){for(const mode of ['invalid','control','potion','zero']){
 const before=make(row,mode),key='wiki:'+row.move,pp=before.fighters[0].pp[key];
 if(mode==='zero'){const original=structuredClone(before);assert.throws(()=>turn(before,row.move),/请选择|有 PP/);assert.deepEqual(before,original);continue;}
 const after=turn(before,mode==='potion'?'potion:pp':row.move);assert.ok(!grant(after,row.effect),row.key+' '+mode);
 assert.equal(after.fighters[0].pp[key],pp-(mode==='invalid'?1:0));
}}
test('十二条原843逐原完整招授下两轮先制一或二，授予当轮不改次序，真实后续攻击两轮反超到期恢复',()=>{
 sources(843);const row=rows.find(r=>r.id===3529&&r.move===25111);gates(row);
 let s=turn(make(row,'normal',[10499]),row.move,'wiki:10018');assert.equal(s.turns.at(-1).first,0); // 原836满体属性招先制+1，本条843仍从下轮起。
 for(let round=2;round<=4;round++){s=turn(s,10499,'wiki:10018');assert.equal(s.turns.at(-1).first,round<=3?0:1);}
});
test('五条原58逐完整招授下两轮必暴，实际两次攻击暴击二且第四轮恢复正常，零PP与未用不授',()=>{
 sources(58);const row=rows.find(r=>r.id===3443&&r.move===20592);gates(row);
 const plain=E.WIKI.availableMoves(L.species(row.id)).find(m=>m.power>0&&!m.effectInstances.length&&!m.fifth);assert.ok(plain);
 let s=turn(make(row,'normal',[plain.id]),row.move);
 for(let round=2;round<=4;round++){s=turn(s,plain.id);const event=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(event);assert.equal(/暴击 2/.test(event.detail),round<=3);}
});
test('四条原570逐完整招授免一次攻击，真实药剂保留、首敌攻击零红并消费、第二攻击恢复正红',()=>{
 sources(570);const row=rows.find(r=>r.id===3529&&r.move===25114);gates(row);
 let s=turn(make(row),row.move);s=turn(s,'potion:pp');assert.equal(grant(s,570),1);
 for(const first of [true,false]){s=turn(s,'potion:pp','wiki:10018');const red=(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type==='attack'&&e.sourceSide===1);assert.equal(red.length,1);if(first)assert.equal(red[0].hpLoss,0);else assert.ok(red[0].hpLoss>0);assert.equal(grant(s,570),0);}
});
