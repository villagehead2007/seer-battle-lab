'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3014-native.cjs');
test('3014真实22招基础逐字段绑定物特属性系别威力PP先制命中必中暴击及第五，每招实际扣一PP',()=>{
 assert.equal(source.moves.length,22);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,382);assert.equal(s.fighters[0].soulHash,'5049fbfa');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3014全部原生零PP拒绝且输入不变，疲惫阻挡用招不扣PP不执行技能附效，满体回末魂印另审',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id);s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,9000);assert.equal(out.fighters[1].hp,9000);assert.ok(Object.values(out.fighters[0].stages).every(n=>n===0));assert.deepEqual(out.fighters[1].ailments,{});}
});
test('3014原生物特红伤按原威力对应攻防本系相性独立公式，初轮上回合受伤零不混入魂印固定',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=(out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1,m.name);assert.ok(hits[0].settledDamage>=Math.floor(base*factor*.85)&&hits[0].settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,n:hits[0].settledDamage,base,factor}));}
});
test('3014五槽唯一原19199第五，结算不改输入原实例，原多重羽剑四目标字段保留而当前仅一次红伤',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19199);const out=turn(s,m.id);assert.deepEqual(s,before);if(m.id===15423){assert.equal(m.sourceTargetCount,4);assert.equal(out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length,1);assert.equal(m.deferredEffects[0].field,'atk_num');}assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3014).moves.find(x=>x.id===m.id));}
});
test('3014疾羽先制二凌空先制三真实低速抢先，普通拍打零先制按速度后手',()=>{
 for(const id of [15424,19196,10004]){const s=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086),m=source.moves.find(m=>m.id===id);assert.equal(s.fighters[0].soulState.resolvedPriority.value,m.priority);assert.equal(s.turns[0].first,m.priority>0?0:1);}
});
test('3014螺旋95命中自然种子有MISS及命中，梦幻与原第五95但原生必中覆盖负六且实际扣一PP',()=>{
 let yes=0,no=0;for(let seed=1;seed<=32;seed++){let s=turn(make(11698,{seed}),11698);if((s.damageEvents??[]).some(e=>e.type==='attack'))yes++;else no++;for(const id of [15425,19199]){s=turn(make(id,{seed,aStages:{acc:-6}}),id);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:'+id],id===19199?4:9);}}assert.ok(yes>0&&no>0);
});
test('3014拍打原生十六分之一暴击自然种子普通与致命均有，原红伤分别满足一倍二倍独立公式',()=>{
 let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=make(10004,{seed,criticals:true}),out=turn(s,10004),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),c=/暴击 2/.test(e.detail),m=s.moveDefinitions['wiki:10004'],base=Math.floor(Math.floor(42*40*1200/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*(c?2:1);assert.ok(e.damage.settledDamage>=Math.floor(base*factor*.85)&&e.damage.settledDamage<=Math.floor(base*factor));if(c)crit++;else normal++;}assert.ok(crit>0&&normal>0);
});
