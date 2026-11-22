'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),P=require('../completion-policy.cjs'),{loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round114-conditional-native-input-20261113.json'),leaves=rows.filter(r=>r.category==='leaf'),stats={maxHp:9000,atk:180,spa:360,def:500,spd:500,spe:9999};
function snapshot(row){const s=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest);assert.ok(s,row.key);return s;}
function make(row,o={}){
 const own=snapshot(row),enemy=L.species(o.enemy??3102),plain=own.moves.find(m=>m.power>0&&!m.fifth&&!m.effectInstances.length);assert.ok(plain);const enemyMove=o.enemyMove??10127,enemyMoves=loadout(enemy,[enemyMove,...(o.enemy===3056?[10716]:[])]),s=E.createBattle({wikiSnapshots:[own,enemy],wikiLoadouts:[loadout(own,[row.move,plain.id]),enemyMoves],builds:[{overrides:stats},{overrides:{...stats,maxHp:9999,atk:o.enemyAtk??400,spa:o.enemyAtk??400,def:9999,spd:9999,spe:1}}],criticals:false,seed:o.seed??14}),a=s.fighters[0],t=s.fighters[1];
 a.hp=8000;a.stages.acc=6;t.effects.免异常={start:1,end:99};if(o.ownNegative)a.stages.atk=-2;if(o.enemyNegative)t.stages.spa=-2;if(o.positive)a.stages.atk=2;if(o.kill)t.hp=1;
 if(o.pinkImmune)a.effects['固定百分比免疫']={start:1,end:99};if(o.mode==='invalid')a.effects.skillBlock={start:1,end:1};if(o.mode==='control')a.ailments.疲惫=2;if(o.mode==='zero')a.pp['wiki:'+row.move]=0;
 assert.deepEqual(s.moveDefinitions['wiki:'+row.move].operations.map(x=>[Number(x.effectId),x.index,x.phase,x.sourceArgs]),row.operations);assert.equal(a.soulId,row.soul);return{s,plain:plain.id,enemyMove};
}
function turn(s,action,enemy='potion:pp'){
 const original=E.WIKI.effectsEngine,frames={},move=typeof action==='number'?action:Number(String(action).replace('wiki:',''));
 E.WIKI.effectsEngine={...original,run(phase,ops,c){const out=original.run(phase,ops,c);if(c.a.side===0&&c.m.wikiId===move)frames[phase]={a:structuredClone(c.a),t:structuredClone(c.t),crit:c.crit};return out;}};
 let out;try{out=E.resolveTurn(s,[typeof action==='number'?'wiki:'+action:action,typeof enemy==='number'?'wiki:'+enemy:enemy]);}finally{E.WIKI.effectsEngine=original;}return{out,frames};
}
function cast(row,o={}){const x=make(row,o);if(o.mode==='zero'){const before=structuredClone(x.s);assert.throws(()=>turn(x.s,row.move),/请选择|有 PP/);assert.deepEqual(x.s,before);return{...x,frames:{}};}return{...x,...turn(x.s,o.mode==='potion'?'potion:pp':row.move,o.castEnemy??'potion:pp')};}
function gates(row){for(const mode of['invalid','control','potion','zero'])assert.equal(cast(row,{mode}).frames.afterHit,undefined,row.key+':'+mode);}
const dot=(s,round)=>(s.turns.find(t=>t.round===round)?.events??[]).filter(e=>e.text.includes('持续固定伤害')&&e.damage?.type==='fixed').reduce((n,e)=>n+e.damage.settledDamage,0);
const sum=(s,round,type,side=1)=>(s.damageEvents??[]).filter(e=>e.round===round&&e.type===type&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);

test('五个完整父技能八合法版本保原PP物特独立面板及全多阶段指令，十个已有原组件按精确来源组合',()=>{
 for(const row of rows.filter(x=>x.category==='parent')){const s=snapshot(row),member=(snapshot,moves)=>({snapshot,moves,build:{overrides:{...stats,def:9999,spd:9999}}}),foe=L.species(2989),g=T.create([[member(s,row.moves),member(L.species(3056),loadout(L.species(3056),[]))],[member(foe,loadout(foe,[])),member(L.species(3223),loadout(L.species(3223),[]))]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=5000;g.battle.fighters[0].stages.acc=6;
  const key='wiki:'+row.move,pp=g.battle.fighters[0].pp[key],original=E.SOULS,fx=E.WIKI.effectsEngine;let used,panel;E.SOULS={...original,run(event,c){if(event==='afterUse'&&c.a.side===0&&c.m.wikiId===row.move)used={pp:c.a.pp[key],soul:c.a.soulId,hash:c.a.soulHash,ops:c.m.operations.map(o=>[Number(o.effectId),o.index,o.phase,o.sourceArgs])};return original.run(event,c);}};E.WIKI.effectsEngine={...fx,run(phase,ops,c){const out=fx.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0&&c.m.wikiId===row.move)panel={atk:c.effective(c.a,'atk'),spa:c.effective(c.a,'spa')};return out;}};let out;try{out=T.turn(g,[key,'potion:pp']);}finally{E.SOULS=original;E.WIKI.effectsEngine=fx;}
  assert.ok(used,row.key);assert.equal(used.pp,pp-1);assert.equal(used.soul,row.soul);assert.equal(used.hash,s.souls.find(x=>x.id===row.soul).hash);assert.deepEqual(used.ops,row.operations);const red=(out.battle.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'&&e.moveId===row.move);if(row.kind==='status')assert.equal(red.length,0);else{assert.ok(red.some(e=>e.hpLoss>0));assert.equal(red[0].attackValue,panel[row.kind==='physical'?'atk':'spa']);}
 }assert.equal(rows.filter(x=>x.category==='parent').length,8);
});

test('两条原76固定周期伤害保100或10概率及五回100三回25，真实等待逐回结算与到期免粉边界',()=>{
 for(const row of leaves.filter(r=>r.effect===76)){let chosen,seen=new Set();for(let seed=1;seed<=128;seed++){const x=cast(row,{seed}),yes=!!x.frames.afterHit.t.effects['持续固定伤害'];seen.add(yes);if(yes)chosen=x;if(row.args[0]===100||seen.size===2)break;}assert.ok(chosen,row.key);if(row.args[0]<100)assert.deepEqual([...seen].sort(),[false,true]);const e=chosen.frames.afterHit.t.effects['持续固定伤害'];assert.deepEqual(e,{start:1,end:row.args[1],amount:row.args[2]});assert.equal(sum(chosen.out,1,'fixed',0),250+row.args[2]);let s=chosen.out;for(let r=1;r<=row.args[1];r++){if(r>1)s=turn(s,'potion:pp').out;assert.equal(dot(s,r),row.args[2]);}s=turn(s,'potion:pp').out;assert.equal(dot(s,row.args[1]+1),0);
 const immune=make(row,{seed:chosen.s.initial.seed});immune.s.fighters[1].effects['固定百分比免疫']={start:1,end:99};const blocked=turn(immune.s,row.move).out;assert.equal(sum(blocked,1,'fixed',0),0);gates(row);}
});

test('两条原127全伤减半和原44仅特殊红伤减半，当前授三回真实逐轮与到期不误留分类',()=>{
 for(const row of leaves.filter(r=>[127,44].includes(r.effect)))for(const kind of['physical','special']){const enemy=kind==='physical'?3102:2988,enemyMove=kind==='physical'?10127:10054,x=cast(row,{enemy,enemyMove}),key=row.effect===127?'全伤害减半':'分类攻击减伤',e=x.frames.afterHit.a.effects[key];assert.equal(e.start,1);assert.equal(e.end,3);if(row.effect===44){assert.equal(e.kind,1);assert.equal(e.fraction,.5);}let s=x.out;
 for(let round=2;round<=4;round++){const control=structuredClone(s);delete control.fighters[0].effects[key];const base=turn(control,'potion:pp',enemyMove).out,actual=turn(s,'potion:pp',enemyMove).out;assert.ok(sum(base,round,'attack')>0);const fraction=round<=3&&(row.effect===127||kind==='special')?.5:1;assert.ok(Math.abs(sum(actual,round,'attack')-sum(base,round,'attack')*fraction)<=1);s=actual;}gates(row);}
});

test('两条原125按原一或二回授200限红，原生大于200攻击被限到200到期恢复，小于200不抬伤',()=>{
 for(const row of leaves.filter(r=>r.effect===125)){const x=cast(row,{enemyAtk:4000,castEnemy:10127});assert.deepEqual(x.frames.afterHit.a.effects['攻击伤害上限'],{start:1,end:row.args[0],amount:200,cumulativeRoundRed:true,global125RoundRed:true});assert.equal(sum(x.out,1,'attack'),200);const multi=cast(row,{enemy:4850,enemyMove:11188,enemyAtk:9999,castEnemy:11188}),segments=multi.out.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.type==='attack');assert.ok(segments.length>=2);assert.equal(segments.reduce((n,e)=>n+e.settledDamage,0),200);assert.equal(multi.out.fighters[0].effects['攻击伤害上限']?.wholeAttackRedCap,undefined);let s=x.out;
 for(let round=2;round<=row.args[0]+1;round++){const control=structuredClone(s);delete control.fighters[0].effects['攻击伤害上限'];const base=turn(control,'potion:pp',10127).out,actual=turn(s,'potion:pp',10127).out;assert.ok(sum(base,round,'attack')>200);assert.equal(sum(actual,round,'attack'),round<=row.args[0]?200:sum(base,round,'attack'));s=actual;}
 const small=cast(row,{enemyAtk:10}),control=structuredClone(small.out);delete control.fighters[0].effects['攻击伤害上限'];const a=turn(small.out,'potion:pp',10127).out,b=turn(control,'potion:pp',10127).out;assert.ok(sum(b,2,'attack')<200);assert.equal(sum(a,2,'attack'),sum(b,2,'attack'));gates(row);}
});

test('原582下两回必暴和原933下一一或两次必暴分别真实获得消费，药剂保次数而回合型到期，KO不授',()=>{
 for(const row of leaves.filter(r=>[582,933].includes(r.effect))){const x=cast(row),frame=x.frames[row.effect===582?'afterHit':'afterAttack'];assert.ok(frame);assert.equal(x.frames.afterAttack.crit,false);let s=x.out;
 if(row.effect===582){assert.deepEqual(frame.a.effects['必定暴击'],{start:2,end:3});for(const expected of[true,true,false]){const h=turn(s,x.plain);assert.equal(h.frames.afterAttack.crit,expected);s=h.out;}let wait=x.out;wait=turn(wait,'potion:pp').out;wait=turn(wait,'potion:pp').out;assert.equal(turn(wait,x.plain).frames.afterAttack.crit,false);}
 else{assert.equal(frame.a.counts.nextCrit,row.args[0]);s=turn(s,'potion:pp').out;assert.equal(s.fighters[0].counts.nextCrit,row.args[0]);for(let i=0;i<row.args[0]+1;i++){const h=turn(s,x.plain);assert.equal(h.frames.afterAttack.crit,i<row.args[0]);assert.equal(h.out.fighters[0].counts.nextCrit??0,Math.max(0,row.args[0]-i-1));s=h.out;}}
 const dead=cast(row,{kill:true});assert.equal(dead.out.fighters[1].hp,0);if(row.effect===582)assert.equal(dead.frames.afterHit.a.effects['必定暴击'],undefined);else assert.equal(dead.frames.afterAttack.a.counts.nextCrit??0,0);gates(row);}
});

test('两条原684双方任一负等级才附原400或450固定并清自身负级，只有正等级不附，目标负级不被清',()=>{
 for(const row of leaves.filter(r=>r.effect===684))for(const mode of['none','own','enemy','positive']){const x=cast(row,{ownNegative:mode==='own',enemyNegative:mode==='enemy',positive:mode==='positive'});assert.equal(sum(x.out,1,'fixed',0),['own','enemy'].includes(mode)?row.args[0]:0);assert.ok(Object.values(x.frames.afterHit.a.stages).every(n=>n>=0));if(mode==='enemy')assert.equal(x.frames.afterHit.t.stages.spa,-2);if(mode==='positive')assert.equal(x.frames.afterHit.a.stages.atk,2);}for(const row of leaves.filter(r=>r.effect===684))gates(row);
});
