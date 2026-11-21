'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3001-native.cjs');
test('3001真实二十七招基础逐字段绑定分类系别威力PP命中先制必中暴击及第五，每招实际消耗一PP',()=>{
 assert.equal(source.moves.length,27);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const [n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,376);assert.equal(s.fighters[0].soulHash,'3ae1b041');const o=turn(s,m.id);assert.equal(o.fighters[0].pp[k],m.pp-1);assert.ok(o.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3001全部原生技能初始零PP拒绝且输入不变，疲惫阻止用招不扣PP不触发后手附伤或献祭',()=>{
 for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);const c=make(m.id);c.fighters[0].ailments['疲惫']=2;const o=turn(c,m.id);assert.equal(o.fighters[0].pp[k],m.pp);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].hp,9000);assert.deepEqual(o.fighters[1].ailments,{});}
});
test('3001原生物特攻击按各自攻击对应防御原威力与相性独立入公式，无尽责罚零红伤不把魂印固定算入红伤',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),o=turn(s,m.id),events=(o.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(events.length,1,m.name);const n=events[0].settledDamage;if(m.power===0)assert.equal(n,0);else assert.ok(n>=Math.floor(base*factor*.85)&&n<=Math.floor(base*factor),JSON.stringify({id:m.id,n,base,factor}));assert.equal(o.turns[0].first,0);}
});
test('3001真实五槽唯一众神归位斩第五，调用不改输入与原始技能实例，献祭技能保持原普通槽身份',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19144);const out=turn(s,m.id);assert.deepEqual(s,before);if(m.id===14734){assert.equal(m.sourceTargetCount,4);assert.equal(out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length,1);assert.equal(m.deferredEffects[0].field,'atk_num');}assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3001).moves.find(x=>x.id===m.id));}
});
test('3001原生先制一二三低速时均实际抢先，乱击零先制按速度后手且不把魂印先手减伤当先制',()=>{
 for(const id of [23108,14729,15649,19142,19141,14102]){const s=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086),m=source.moves.find(m=>m.id===id);assert.equal(s.turns[0].first,m.priority>0?0:1);assert.equal(s.fighters[0].soulState.resolvedPriority.value,m.priority);}
});
test('3001原生九十五命中自然种子出现MISS与命中，众神归位斩必中覆盖负六命中且正常扣PP',()=>{
 let hit=0,miss=0;for(let seed=1;seed<=32;seed++){let s=turn(make(14733,{seed}),14733);if((s.damageEvents??[]).some(e=>e.type==='attack'))hit++;else miss++;s=turn(make(19144,{seed,aStages:{acc:-6}}),19144);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:19144'],4);}assert.ok(hit>0&&miss>0);
});
test('3001乱击原生十六分之一暴击自然种子有普通与致命，红伤各落一倍二倍公式且魂印固定独立',()=>{
 let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=turn(make(14102,{seed,criticals:true,enemyMoves:[20889],bStats:{spe:9999}}),14102,20889),e=s.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),c=/暴击 2/.test(e.detail),m=s.moveDefinitions['wiki:14102'],base=Math.floor(Math.floor(42*50*1200/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart);assert.ok(e.damage.settledDamage>=Math.floor(base*factor*(c?2:1)*.85)&&e.damage.settledDamage<=Math.floor(base*factor*(c?2:1)));if(c)crit++;else normal++;assert.ok(s.damageEvents.some(e=>e.type==='fixed'&&e.settledDamage===2250));}assert.ok(crit>0&&normal>0);
});
