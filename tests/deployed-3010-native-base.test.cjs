'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3010-native.cjs');
test('3010真实23招基础字段逐项绑定分类系别威力PP先制命中必中暴击和第五，实际均消耗一PP',()=>{
 assert.equal(source.moves.length,23);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,166);assert.equal(s.fighters[0].soulHash,'2c6013b9');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3010全部原生技能初始零PP拒绝保持输入，疲惫不耗PP不出手不附伤不回复或强化',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id,{aHp:4000});s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,4000);assert.equal(out.fighters[1].hp,9000);assert.ok(Object.values(out.fighters[0].stages).every(n=>n===0));}
});
test('3010物特红伤按对应攻击防御原威力和相性独立公式，痛苦零威力零红而沙尘实际二三段',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=(out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);if(m.id===10703)assert.ok([2,3].includes(hits.length));else assert.equal(hits.length,1,m.name);for(const e of hits)if(m.power===0)assert.equal(e.settledDamage,0);else assert.ok(e.settledDamage>=Math.floor(base*factor*.85)&&e.settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,n:e.settledDamage,base,factor}));}
});
test('3010五槽唯一原17625第五且结算不改输入与来源，钢尾原范围三只攻击当前目标一次',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,17625);const out=turn(s,m.id);assert.deepEqual(s,before);if(m.id===11141){assert.equal(m.sourceTargetCount,3);assert.equal(out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length,1);assert.equal(m.deferredEffects[0].field,'atk_num');}assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3010).moves.find(x=>x.id===m.id));}
});
test('3010土遁先制一及天威先制三真实低速仍抢先，普通钢尾零先制按速度后手',()=>{
 for(const id of [10705,17622,11141]){const s=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086),m=source.moves.find(m=>m.id===id);assert.equal(s.turns[0].first,m.priority>0?0:1);assert.equal(s.fighters[0].soulState.resolvedPriority.value,m.priority);}
});
test('3010钢尾95原命中自然种子有命中MISS，铁爪与原第五均必中覆盖负六命中且实际扣一PP',()=>{
 let yes=0,no=0;for(let seed=1;seed<=32;seed++){let s=turn(make(11141,{seed}),11141);if((s.damageEvents??[]).some(e=>e.type==='attack'))yes++;else no++;for(const id of [11145,17625]){s=turn(make(id,{seed,aStages:{acc:-6}}),id);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:'+id],4);}}assert.ok(yes>0&&no>0);
});
test('3010铁爪原生十六分之一暴击自然种子普通与致命均有，红伤独立满足一倍二倍公式',()=>{
 let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=make(11145,{seed,criticals:true}),out=turn(s,11145),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),c=/暴击 2/.test(e.detail),m=s.moveDefinitions['wiki:11145'],base=Math.floor(Math.floor(42*150*1200/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*(c?2:1);assert.ok(e.damage.settledDamage>=Math.floor(base*factor*.85)&&e.damage.settledDamage<=Math.floor(base*factor));if(c)crit++;else normal++;}assert.ok(crit>0&&normal>0);
});
