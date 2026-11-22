'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3017-native.cjs');
test('3017真实32招基础逐字段绑定物特属性系别威力PP先制命中必中暴击及第五，每招实际扣一PP',()=>{
 assert.equal(source.moves.length,32);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,387);assert.equal(s.fighters[0].soulHash,'548f5341');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3017全部原生零PP拒绝且输入不变，疲惫阻挡用招不扣PP不执行技能附效，魂印回末双防另审',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id);s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,9000);assert.equal(out.fighters[1].hp,9000);assert.deepEqual(out.fighters[0].stages,{atk:0,def:2,spa:0,spd:2,spe:0,acc:0});assert.deepEqual(out.fighters[1].ailments,{});}
});
test('3017原生物特红伤按原威力对应攻防本系相性独立公式，魂印末双防不提前改本次红伤',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=(out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1,m.name);assert.ok(hits[0].settledDamage>=Math.floor(base*factor*.85)&&hits[0].settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,n:hits[0].settledDamage,base,factor}));}
});
test('3017五槽唯一原19208第五，结算不改输入实例，灰飞烟灭原三目标字段保留而当前仅一次红伤',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19208);const out=turn(s,m.id);assert.deepEqual(s,before);if(m.id===10759){assert.equal(m.sourceTargetCount,3);assert.equal(out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length,1);assert.equal(m.deferredEffects[0].field,'atk_num');}assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3017).moves.find(x=>x.id===m.id));}
});
test('3017摆尾先制一狂龙破及图腾二怒爪三真实低速先手，龙爪零先制按速度后手',()=>{
 for(const id of[10758,16395,20337,19205,10611]){const s=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086),m=source.moves.find(m=>m.id===id);assert.equal(s.fighters[0].soulState.resolvedPriority.value,m.priority);assert.equal(s.turns[0].first,m.priority>0?0:1);}
});
test('3017龙爪95命中自然种子成功MISS，龙王波碎骨与原第五必中覆盖负六且实际扣一PP',()=>{
 let yes=0,no=0;for(let seed=1;seed<=32;seed++){let s=turn(make(10611,{seed}),10611);if((s.damageEvents??[]).some(e=>e.type==='attack'))yes++;else no++;for(const id of[10622,15180,19208]){s=turn(make(id,{seed,aStages:{acc:-6}}),id);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:'+id],source.moves.find(m=>m.id===id).pp-1);}}assert.ok(yes>0&&no>0);
});
test('3017锋利之牙原四分之一暴击实际多于普通龙吼，各自然种子红伤满足对应一倍二倍独立公式',()=>{
 const counts=[];for(const id of[10614,10988]){let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=make(id,{seed,criticals:true}),out=turn(s,id),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),c=/暴击 2/.test(e.detail),m=s.moveDefinitions['wiki:'+id],base=Math.floor(Math.floor(42*m.power*(id===10614?3600:1200)/4000)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*(c?2:1);assert.ok(e.damage.settledDamage>=Math.floor(base*factor*.85)&&e.damage.settledDamage<=Math.floor(base*factor));if(c)crit++;else normal++;}assert.ok(crit>0&&normal>0);counts.push(crit);}assert.ok(counts[1]>counts[0]);
});
