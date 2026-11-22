'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3004-native.cjs');
test('3004真实32招逐字段绑定分类系别威力PP命中先制必中暴击和第五，每招实际消耗一PP',()=>{
 assert.equal(source.moves.length,32);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of ['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,378);assert.equal(s.fighters[0].soulHash,'9952ed16');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3004全部原生技能零PP拒绝且输入不变，疲惫阻止用招不扣PP不执行附效与后手回复',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id,{aHp:4000});s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,4000);assert.equal(out.fighters[1].hp,9000);assert.deepEqual(out.fighters[1].ailments,{});}
});
test('3004原生物特红伤按对应攻击防御原威力独立公式，狂化龙舞真实三至五段且附伤不混入红伤',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=(out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);if(m.id===10975)assert.ok(hits.length>=3&&hits.length<=5);else assert.equal(hits.length,1,m.name);for(const e of hits)assert.ok(e.settledDamage>=Math.floor(base*factor*.85)&&e.settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,n:e.settledDamage,base,factor}));}
});
test('3004五槽唯一乾坤第五保持且结算不改输入原实例，三个真实范围字段不转为多段也不丢独立强化弱化',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19153);const out=turn(s,m.id);assert.deepEqual(s,before);if([20444,10961,10979].includes(m.id)){assert.equal(m.sourceTargetCount,m.id===10979?2:3);assert.equal((out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0).length,m.id===20444?0:1);assert.equal(m.deferredEffects[0].field,'atk_num');if(m.id===20444)assert.equal(out.fighters[0].stages.def,1);}assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3004).moves.find(x=>x.id===m.id));}
});
test('3004破坏和龙啸真实先制二及上古先制三低速抢先，普通龙爪按速度后手',()=>{
 for(const id of [15120,16438,19150,10611]){const out=turn(make(id,{enemyMoves:[10086],aStats:{spe:100},bStats:{spe:9999}}),id,10086),m=source.moves.find(m=>m.id===id);assert.equal(out.turns[0].first,m.priority>0?0:1);assert.equal(out.fighters[0].soulState.resolvedPriority.value,m.priority);}
});
test('3004原生95命中自然种子有命中及MISS，乾坤第五虽然95但原生必中覆盖负六命中',()=>{
 let yes=0,no=0;for(let seed=1;seed<=32;seed++){let out=turn(make(10611,{seed}),10611);if((out.damageEvents??[]).some(e=>e.type==='attack'))yes++;else no++;out=turn(make(19153,{seed,aStages:{acc:-6}}),19153);assert.ok((out.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(out.fighters[0].pp['wiki:19153'],4);}assert.ok(yes>0&&no>0);
});
test('3004龙吼原生十六分之一暴击自然种子有普通与致命，红伤分别满足一倍二倍独立公式',()=>{
 let crit=0,normal=0;for(let seed=1;seed<=48;seed++){const s=make(10614,{seed,criticals:true}),out=turn(s,10614),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),isCrit=/暴击 2/.test(e.detail),base=Math.floor(Math.floor(42*50*3600/4000)/50)+2,m=s.moveDefinitions['wiki:10614'],factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*(isCrit?2:1);assert.ok(e.damage.settledDamage>=Math.floor(base*factor*.85)&&e.damage.settledDamage<=Math.floor(base*factor));if(isCrit)crit++;else normal++;}assert.ok(crit>0&&normal>0);
});
