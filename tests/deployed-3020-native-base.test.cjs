'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3020-native.cjs');
test('3020真实14招基础字段逐项绑定含原第五，全部实际使用扣一PP且魂印原391版本不改',()=>{
 assert.equal(source.moves.length,14);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p]);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,391);assert.equal(s.fighters[0].soulHash,'d72577f2');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3020原生零PP不能提交且输入不变，疲惫未用招不耗PP不执行附效也不凭空触发受伤魂印',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id);s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,9000);assert.equal(out.fighters[1].hp,9000);assert.ok(Object.values(out.fighters[0].stages).every(n=>n===0));assert.deepEqual(out.fighters[1].ailments,{});assert.ok(!out.fighters[0].effects['鬼王威力翻倍']);assert.ok(!out.fighters[0].effects['鬼王攻击免疫']);}
});
test('3020原生每招物特红伤按对应攻防本系相性原威力独立公式，初次未受伤不带魂印威力翻倍',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=(out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1);assert.ok(hits[0].settledDamage>=Math.floor(base*factor*.85)&&hits[0].settledDamage<=Math.floor(base*factor));}
});
test('3020配招始终唯一原19220第五且只结算副本，来源每个有序附加实例不改写',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s),fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(s.fighters[0].moves.length,5);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19220);turn(s,m.id);assert.deepEqual(s,before);assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3020).moves.find(x=>x.id===m.id));}
});
test('3020鬼爪先制三狂怒先制一实际低速抢先，突斩零先制后手，原第五必中覆盖负六命中',()=>{
 for(const id of[19215,19219,10361]){const s=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086),m=source.moves.find(m=>m.id===id);assert.equal(s.fighters[0].soulState.resolvedPriority.value,m.priority);assert.equal(s.turns[0].first,m.priority>0?0:1);}
 let hit=0,miss=0;for(let seed=1;seed<=32;seed++){let s=turn(make(19216,{seed}),19216);if((s.damageEvents??[]).some(e=>e.type==='attack'))hit++;else miss++;s=turn(make(19220,{seed,aStages:{acc:-6}}),19220);assert.ok((s.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:19220'],4);}assert.ok(hit>0&&miss>0);
});
test('3020突斩原十六分之一暴击自然种子普通致命均有，对应一倍二倍红伤独立公式',()=>{
 let yes=0,no=0;for(let seed=1;seed<=48;seed++){const s=make(10361,{seed,criticals:true}),out=turn(s,10361),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),crit=/暴击 2/.test(e.detail),base=Math.floor(Math.floor(42*50*1200/4000)/50)+2,factor=E.sameTypeBonus(s.moveDefinitions['wiki:10361'].type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(s.moveDefinitions['wiki:10361'].type,s.fighters[1].type,s.typeChart)*(crit?2:1);assert.ok(e.damage.settledDamage>=Math.floor(base*factor*.85)&&e.damage.settledDamage<=Math.floor(base*factor));if(crit)yes++;else no++;}assert.ok(yes>0&&no>0);
});
