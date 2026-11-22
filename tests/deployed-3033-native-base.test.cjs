'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3033-native.cjs');
test('3033真实17招逐字段绑定物特属性威力PP命中先制必中暴击率，耗PP且佛祖444独立补一',()=>{
 assert.equal(source.moves.length,17);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,393);assert.equal(s.fighters[0].soulHash,'161bd595');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.id===24735?m.pp:m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3033全部真实原生零PP不可选且拒绝保持输入，疲惫阻止用招不扣PP不执行附效回血',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id);s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,4500);assert.equal(out.fighters[1].hp,9000);assert.ok(Object.values(out.fighters[0].stages).every(n=>n===0));assert.ok(Object.values(out.fighters[1].stages).every(n=>n===0));}
});
test('3033原生物特红伤按真实攻防威力本系相性独立公式，第五首用额外30%和固定50分离',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart)*(m.id===19286?1.3:1),out=turn(s,m.id),hits=out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1,m.id);assert.ok(hits[0].settledDamage>=Math.floor(base*factor*.85)&&hits[0].settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,base,factor,hit:hits[0]}));if(m.id===14733)assert.equal(out.damageEvents.find(e=>e.type==='fixed'&&e.sourceSide===0).settledDamage,50);}
});
test('3033真实五槽唯一原19286第五，结算不改输入及有序真实来源实例',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19286);turn(s,m.id);assert.deepEqual(s,before);assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3033).moves.find(x=>x.id===m.id));}
});
test('3033原95命中自然成功MISS，原生三必中覆盖负六，帝天原先制三真实低速抢先',()=>{
 let hit=0,miss=0;for(let seed=1;seed<=32;seed++){const s=turn(make(14733,{seed}),14733);if((s.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0))hit++;else miss++;}assert.ok(hit>0&&miss>0);for(const id of[14730,19284,19286]){const s=turn(make(id,{aStages:{acc:-6}}),id);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));}const s=turn(make(19281,{aStats:{spe:1},bStats:{spe:9999},enemyMoves:[10086]}),19281,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);assert.equal(s.turns[0].first,0);
});
test('3033冲顶原十六分之一暴击实际初始种子有普通致命，红伤一倍二倍公式独立核对',()=>{
 let normal=0,crit=0;for(let seed=1;seed<=48;seed++){const s=make(10086,{seed,criticals:true}),out=turn(s,10086),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),critical=/暴击 2/.test(e.detail),base=Math.floor(Math.floor(42*40*1200/4000)/50)+2,n=e.damage.settledDamage;assert.ok(n>=Math.floor(base*(critical?2:1)*.85)&&n<=Math.floor(base*(critical?2:1)));if(critical)crit++;else normal++;}assert.ok(crit>0&&normal>0);
});
