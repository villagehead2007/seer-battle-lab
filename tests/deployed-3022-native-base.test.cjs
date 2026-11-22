'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3022-native.cjs');
test('3022真实17招逐字段绑定物特属性威力PP命中先制必中第五和暴击率，耗一PP且万里按源恢复一',()=>{
 assert.equal(source.moves.length,17);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(c.type,m.kind==='status'?'属性':m.type);assert.equal(s.fighters[0].soulId,395);assert.equal(s.fighters[0].soulHash,'7cd3227');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.id===24706?m.pp:m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3022原生全部零PP不可选且拒绝保持输入不变，疲惫阻挡出招不扣PP不执行附效',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id);s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,9000);assert.equal(out.fighters[1].hp,9000);assert.ok(Object.values(out.fighters[0].stages).every(n=>n===0));assert.ok(Object.values(out.fighters[1].stages).every(n=>n===0));}
});
test('3022原生物特红伤按真实对应攻防威力本系相性与随机范围核算，附加40固定独立',()=>{
 for(const m of source.moves.filter(x=>x.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1,m.name);assert.ok(hits[0].settledDamage>=Math.floor(base*factor*.85)&&hits[0].settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,base,factor,hit:hits[0]}));if(m.id===10617)assert.equal(out.damageEvents.find(e=>e.type==='fixed').settledDamage,40);}
});
test('3022两真实魂印五槽唯一原第五19230，结算不改输入及来源原实例',()=>{
 for(const soul of [395,396])for(const m of source.moves){const s=make(m.id,{soul}),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19230);turn(s,m.id);assert.deepEqual(s,before);assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3022).moves.find(x=>x.id===m.id));}
});
test('3022原95命中自然有命中与MISS，原生四招必中覆盖负六，双先制三真实抢先',()=>{
 let hit=0,miss=0;for(let seed=1;seed<=32;seed++){const s=turn(make(10616,{seed}),10616);if((s.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0))hit++;else miss++;}assert.ok(hit>0&&miss>0);for(const id of[10622,19249,19229,19230]){const s=turn(make(id,{aStages:{acc:-6}}),id);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));}for(const id of[19227,19248]){const s=turn(make(id,{aStats:{spe:1},bStats:{spe:9999},enemyMoves:[10086]}),id,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);assert.equal(s.turns[0].first,0);}
});
test('3022原生音速十六分之一暴击真实初始种子有普通与致命，红伤分别符合一倍二倍独立公式',()=>{
 let critical=0,normal=0;for(let seed=1;seed<=48;seed++){const s=make(10613,{seed,criticals:true}),out=turn(s,10613),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),crit=/暴击 2/.test(e.detail),base=Math.floor(Math.floor(42*60*1200/4000)/50)+2,n=e.damage.settledDamage;assert.ok(n>=Math.floor(base*(crit?2:1)*.85)&&n<=Math.floor(base*(crit?2:1)));if(crit)critical++;else normal++;}assert.ok(critical>0&&normal>0);
});
