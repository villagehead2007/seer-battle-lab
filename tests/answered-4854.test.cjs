'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4854/snapshot.json');
const H=require('./helpers/remaining-battle.cjs')(source),{E,make,turn,timer,sum,key}=H,enemy=require('../research/BATCH-4816-REMAINING/4850/snapshot.json');
const multi=[11188,...enemy.moves.filter(m=>!m.fifth&&m.id!==11188).slice(0,3).map(m=>m.id),enemy.moves.find(m=>m.fifth).id];
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);fn(event,c);}};try{return run();}finally{E.SOULS=old;}}
test('4854已答162：异常时固定300，无异常不附加、固定免疫归零，残血仍保存完整300及实际损失',()=>{
 for(const mode of ['abnormal','none','immune','low']){const s=make({move:38205,index:2,targetHp:mode==='low'?100:9000});if(mode!=='none')s.fighters[1].ailments['中毒']=3;if(mode==='immune')timer(s,1,'固定百分比免疫');if(mode==='low')timer(s,1,'攻击伤害免疫');turn(s,38205,20309);assert.equal(sum(s,'fixed'),['abnormal','low'].includes(mode)?300:0,mode);if(mode==='low'){const e=s.damageEvents.find(e=>e.type==='fixed'&&e.sourceSide===0);assert.equal(e.settledDamage,300);assert.ok(e.hpLoss<=100);}assert.equal(s.fighters[0].pp[key(38205)],source.moves.find(m=>m.id===38205).pp-1);}
});
test('已答125三条精确来源：多段合计按整次攻击限红，正数红不截断记录，免疫零段不消费额度，非红不受限',()=>{
 for(const [id,move,index,cap]of [[4854,38203,1,300],[4903,17585,0,250],[4912,29372,2,170]]){const raw=require('../research/BATCH-4816-REMAINING/'+id+'/snapshot.json'),h=require('./helpers/remaining-battle.cjs')(raw),s=h.make({move,index,enemySource:enemy,enemyLoadout:multi,bStats:{atk:9999}});h.turn(s,move,11188);const reds=s.damageEvents.filter(e=>e.round===1&&e.type==='attack'&&e.targetSide===0);assert.ok(reds.length>=2);assert.equal(reds.reduce((n,e)=>n+e.settledDamage,0),cap,id);assert.equal(s.fighters[0].hp,9000-cap);assert.equal(s.fighters[0].effects['攻击伤害上限'].wholeAttackRedCap,true);}
 const s=make({move:38203,index:1,enemySource:enemy,enemyLoadout:multi,bStats:{atk:9999}});timer(s,0,'攻击伤害免疫');observe((event,c)=>{if(event==='beforeDamage'&&c.a.side===1&&(c.a.soulState.currentAttackSegment??0)>0){delete c.t.effects['攻击伤害免疫'];}},()=>turn(s,38203,11188));assert.equal(sum(s,'attack',1),300);
 const n=make({move:38203,index:1}),values=[];observe((event,c)=>{if(event==='afterUse'&&c.a.side===1)for(const type of ['fixed','percent','true'])values.push(c.hurt(c.t,500,'125不限制其他类型',type));},()=>turn(n,38203,20309));assert.deepEqual(values,[500,500,500]);
});
test('已答125额外行动另开额度：真实3291星皇之怒两次攻击各300，未触发只300；22661旧整回合250例外保持',()=>{
 const emperor=require('../local-species.cjs').species(3291),ids=[30376,25294,25295,30380,30381],seen=new Set();
 for(let seed=1;seed<=16;seed++){const s=make({move:38203,index:1,enemySource:emperor,enemyLoadout:ids,enemySoul:true,bStats:{atk:9999},seed:Math.imul(seed,0x9e3779b1)>>>0});turn(s,38203,30380);const reds=s.damageEvents.filter(e=>e.round===1&&e.type==='attack'&&e.targetSide===0);assert.ok(reds.length===1||reds.length===2);assert.ok(reds.every(e=>e.settledDamage===300));assert.equal(sum(s,'attack',1),reds.length*300);seen.add(reds.length);}assert.deepEqual(seen,new Set([1,2]));
 for(const id of [4921,4000]){const raw=require('../research/BATCH-4816-REMAINING/'+id+'/snapshot.json'),h=require('./helpers/remaining-battle.cjs')(raw),s=h.make({move:22661,index:0,enemySource:emperor,enemyLoadout:ids,enemySoul:true,bStats:{atk:9999},seed:1});h.turn(s,22661,30380);assert.equal(h.sum(s,'attack',1),250,id);assert.equal(s.fighters[0].effects['攻击伤害上限'].cumulativeRoundRed,true);assert.equal(s.fighters[0].effects['攻击伤害上限'].wholeAttackRedCap,undefined);}
});
test('4854已答125：两回合到期且重用刷新，不同版本参数不能使用新答案门槛',()=>{
 const s=make({move:38203,index:1,bStats:{atk:9999}});turn(s,38203,10127);assert.equal(sum(s,'attack',1),300);const idle=s.fighters[0].moves.find(k=>k!==key(38203)&&!s.moveDefinitions[k].fifth);s.moveDefinitions[idle].operations=[];turn(s,Number(idle.slice(5)),10127);assert.equal(sum(s,'attack',1),300);turn(s,Number(idle.slice(5)),10127);assert.ok(sum(s,'attack',1)>300);
 const raw=source.moves.find(m=>m.id===38203),changed=structuredClone(raw);changed.revision='seerapi:00000000';assert.notEqual(E.WIKI.effectsEngine.compileInstances(changed.effectInstances,source.effects,changed).issue,'');
});
