'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/2995-native.cjs');
test('2995真实十七招逐字段绑定物特属性威力PP命中先制必中暴击概率与第五，实际用招耗一PP',()=>{
 assert.equal(source.moves.length,17);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const [n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,374);assert.equal(s.fighters[0].soulHash,'eceb56f4');const o=turn(s,m.id);assert.equal(o.fighters[0].pp[k],m.pp-1);assert.ok(o.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('2995全部原生技能初始零PP不在可选列表且提交拒绝输入不变，疲惫阻挡不耗PP不改变HP',()=>{
 for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);const c=make(m.id);c.fighters[0].ailments['疲惫']=2;const o=turn(c,m.id);assert.equal(o.fighters[0].pp[k],m.pp);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].hp,9000);assert.deepEqual(o.fighters[1].ailments,{});}
});
test('2995原生攻击按各自物特能力本系相性与威力独立入公式，冰天果味后手260且炫彩空冰封仍150',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const late=m.id===19111,s=make(m.id,{enemyMoves:[10086],bStats:{spe:late?9999:100}}),a=s.fighters[0],b=s.fighters[1],power=m.id===19111?260:m.power,atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),o=turn(s,m.id,late?10086:'potion:pp'),reds=(o.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(reds.length,1);assert.ok(reds[0].settledDamage>=Math.floor(base*factor*.85)&&reds[0].settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,actual:reds[0].settledDamage,base,factor}));assert.equal(o.turns[0].first,late?1:0);}
});
test('2995真实五槽唯一原第五，调用不修改战斗输入与原快照，异界之寒仅当前目标一次攻击保留原范围字段',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);assert.equal(s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth).length,1);const o=turn(s,m.id);assert.deepEqual(s,before);assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(2995).moves.find(x=>x.id===m.id));if(m.id===13224){assert.equal(o.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length,1);assert.ok(m.sourceTargetCount>1);assert.equal(m.deferredEffects[0].field,'atk_num');}}
});
test('2995冰花舞原先制三在低速时实际抢先，普通抓保持零先制按速度后手',()=>{
 for(const id of [19109,10006]){const s=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086);assert.equal(s.turns[0].first,id===19109?0:1);assert.equal(s.fighters[0].soulState.resolvedPriority.value,id===19109?3:0);}
});
test('2995九十五命中原生招自然种子有MISS与命中，第五必中覆盖初始负六命中仍有红伤与正常PP消耗',()=>{
 let miss=0,hit=0;for(let seed=1;seed<=32;seed++){let s=turn(make(19110,{seed}),19110);if((s.damageEvents??[]).some(e=>e.type==='attack'))hit++;else miss++;s=turn(make(19114,{seed,aStages:{acc:-6}}),19114);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:19114'],4);}assert.ok(miss>0&&hit>0);
});
test('2995抓的原生十六分之一暴击由自然初始种子出现普通和致命两类，红伤分别进入一倍二倍公式',()=>{
 let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=turn(make(10006,{seed,criticals:true}),10006),e=s.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),c=/暴击 2/.test(e.detail),base=Math.floor(Math.floor(42*40*1200/4000)/50)+2;assert.ok(e.damage.settledDamage>=Math.floor(base*(c?2:1)*.85)&&e.damage.settledDamage<=base*(c?2:1));if(c)crit++;else normal++;}assert.ok(crit>0&&normal>0);
});
