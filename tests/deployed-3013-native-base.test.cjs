'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3013-native.cjs');
test('3013真实17招逐字段分类系别威力PP先制命中必中暴击第五绑定，实际各扣一PP且魂印真实383',()=>{
 assert.equal(source.moves.length,17);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,383);assert.equal(s.fighters[0].soulHash,'8cebde62');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3013全部原生零PP拒绝且输入不变，初始疲惫不出手不耗PP不回血换血或改变目标',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id,{aHp:4000});s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,4000);assert.equal(out.fighters[1].hp,9000);assert.deepEqual(out.fighters[1].ailments,{});}
});
test('3013半体恰4500排除魂印两条件，原物特红伤按对应攻防与相性独立公式，破间原447最低300另核算',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=(out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1,m.name);const n=hits[0].settledDamage,minimum=m.id===19194?300:0;assert.ok(n>=Math.max(minimum,Math.floor(base*factor*.85))&&n<=Math.max(minimum,Math.floor(base*factor)),JSON.stringify({id:m.id,n,base,factor}));assert.equal(out.fighters[0].soulState.halfLow,false);assert.equal(out.fighters[0].soulState.halfHigh,false);}
});
test('3013五槽唯一原19195第五、结算不改输入或原技能参数，斗转原三目标字段保留而当前只一段',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19195);const out=turn(s,m.id);assert.deepEqual(s,before);if(m.id===13533){assert.equal(m.sourceTargetCount,3);assert.equal(out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length,1);assert.equal(m.deferredEffects[0].field,'atk_num');}assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3013).moves.find(x=>x.id===m.id));}
});
test('3013幻灭原生先制三真实低速抢先，半体普通突击先制零按速度后手不借魂印加先制',()=>{
 for(const id of [19190,10157]){const s=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,id===19190?3:0);assert.equal(s.turns[0].first,id===19190?0:1);}
});
test('3013吞噬原95命中自然种子有命中MISS，尘埃与第五原95但必中覆盖负六命中且实际扣PP',()=>{
 let yes=0,no=0;for(let seed=1;seed<=32;seed++){let s=turn(make(19191,{seed}),19191);if((s.damageEvents??[]).some(e=>e.type==='attack'))yes++;else no++;for(const id of [19193,19195]){s=turn(make(id,{seed,aStages:{acc:-6}}),id);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:'+id],4);}}assert.ok(yes>0&&no>0);
});
test('3013突击原十六分之一暴击自然种子有普通与致命，半体无魂印增伤时各按一倍二倍独立公式',()=>{
 let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=make(10157,{seed,criticals:true}),out=turn(s,10157),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),isCrit=/暴击 2/.test(e.detail),m=s.moveDefinitions['wiki:10157'],base=Math.floor(Math.floor(42*45*1200/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*(isCrit?2:1);assert.ok(e.damage.settledDamage>=Math.floor(base*factor*.85)&&e.damage.settledDamage<=Math.floor(base*factor));if(isCrit)crit++;else normal++;}assert.ok(crit>0&&normal>0);
});
