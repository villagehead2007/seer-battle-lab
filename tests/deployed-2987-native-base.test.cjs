'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/2987-native.cjs');
test('2987两版真实十七招基础逐项绑定物特属性威力PP命中先制必暴概率与第五，各自实际用招耗一PP',()=>{
 assert.equal(source.moves.length,17);for(const soul of [372,574])for(const move of source.moves){const s=make(move.id,{soul}),key='wiki:'+move.id,m=s.moveDefinitions[key];for(const k of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(m[k],move[k],soul+'/'+move.id+'/'+k);assert.equal(m.type,move.kind==='status'?'属性':move.type);const [a,b]=move.critical.split('/').map(Number);assert.equal(m.criticalChance,a/b);assert.equal(s.fighters[0].soulId,soul);assert.equal(s.fighters[0].soulHash,source.souls.find(x=>x.id===soul).hash);const o=turn(s,move.id);assert.equal(o.fighters[0].pp[key],move.pp-1);assert.ok(o.turns[0].events.some(e=>e.text.includes(move.name)));}
});
test('2987两版全部真实技能零PP拒绝且输入不变，已有疲惫阻止技能不扣PP不产生伤害或神耀',()=>{
 for(const soul of [372,574])for(const move of source.moves){const s=make(move.id,{soul}),key='wiki:'+move.id;s.fighters[0].pp[key]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(key));assert.throws(()=>turn(s,move.id),/有 PP/);assert.deepEqual(s,before);const controlled=make(move.id,{soul});controlled.fighters[0].ailments['疲惫']=2;const o=turn(controlled,move.id);assert.equal(o.fighters[0].pp[key],move.pp);assert.equal(o.fighters[0].soulState.energy??0,0);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].hp,9000);}
});
test('2987真实攻击基础按物特不同能力与相性进入公式，蓄力一击真实后手翻倍威力而第五初始零能量保持170',()=>{
 for(const soul of [372,574])for(const move of source.moves.filter(m=>m.kind!=='status')){const late=move.id===11492,s=make(move.id,{soul,enemyMoves:[10086],bStats:{spe:late?9999:100}}),a=s.fighters[0],b=s.fighters[1],atk=move.kind==='physical'?a.stats.atk:a.stats.spa,def=move.kind==='physical'?b.stats.def:b.stats.spd,power=move.id===11492?180:move.power,base=Math.floor(Math.floor(42*power*atk/def)/50)+2,factor=E.sameTypeBonus(move.type,a.type,s.typeChart)*E.typeEffectiveness(move.type,b.type,s.typeChart),o=turn(s,move.id,late?10086:'potion:pp'),events=(o.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(events.length,1);const red=events[0].settledDamage;assert.ok(red>=Math.floor(base*factor*.85)&&red<=Math.floor(base*factor),JSON.stringify({soul,id:move.id,red,base,factor}));assert.equal(o.turns[0].first,late?1:0);}
});
test('2987两版原生五槽唯一第五且用招不修改输入快照与原技能参数，新局神耀为零',()=>{
 for(const soul of [372,574])for(const move of source.moves){const s=make(move.id,{soul}),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);assert.equal(s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth).length,1);turn(s,move.id);assert.deepEqual(s,before);assert.equal(make(move.id,{soul}).fighters[0].soulState.energy??0,0);assert.deepEqual(source.moves.find(m=>m.id===move.id).effectInstances,require('../local-species.cjs').species(2987).moves.find(m=>m.id===move.id).effectInstances);}
});
test('2987银雾原生先制三与纯光先制一在零神耀低速时实际先手，普通拍打仍按速度后手',()=>{
 for(const soul of [372,574])for(const id of [19100,24639,10004]){const s=turn(make(id,{soul,enemyId:2988,enemyMoves:[10018],aStats:{spe:100},bStats:{spe:9999}}),id,10018);assert.equal(s.turns[0].first,id===10004?1:0);assert.equal(s.fighters[0].soulState.resolvedPriority.value,id===19100?3:id===24639?1:0);}
});
test('2987九十五命中招自然初始种子出现命中与MISS，第五必中特征覆盖负六命中而PP仍消耗',()=>{
 for(const soul of [372,574]){let misses=0,hits=0;for(let seed=1;seed<=32;seed++){let s=turn(make(19012,{soul,seed}),19012);if((s.damageEvents??[]).some(e=>e.type==='attack'))hits++;else misses++;const t=make(19103,{soul,seed});t.fighters[0].stages.acc=-6;s=turn(t,19103);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:19103'],4);}assert.ok(misses>0&&hits>0);}
});
test('2987两版拍打原生十六分之一暴击通过自然种子出现两种结果，暴击红伤进入二倍公式',()=>{
 for(const soul of [372,574]){let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=turn(make(10004,{soul,seed,criticals:true}),10004),event=s.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),isCrit=/暴击 2/.test(event.detail),n=event.damage.settledDamage;const base=Math.floor(Math.floor(42*40*1200/4000)/50)+2;assert.ok(n>=Math.floor(base*(isCrit?2:1)*.85)&&n<=base*(isCrit?2:1));if(isCrit)crit++;else normal++;}assert.ok(crit>0&&normal>0);}
});
