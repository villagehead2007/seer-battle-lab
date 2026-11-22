'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3031-native.cjs');
test('3031真实17招逐字段绑定物特属性威力PP命中先制必中暴击率和第五，实际用招逐招扣一PP',()=>{
 assert.equal(source.moves.length,17);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,400);assert.equal(s.fighters[0].soulHash,'14d6f005');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3031全部真实原生零PP拒绝且保持输入，初始疲惫不出招不耗PP不执行附效或吸血',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id);s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,4500);assert.equal(out.fighters[1].hp,9000);assert.ok(Object.values(out.fighters[0].stages).every(n=>n===0));assert.ok(Object.values(out.fighters[1].stages).every(n=>n===0));}
});
test('3031非满体回初无50增伤，真实物特红伤按对应攻防威力本系相性及88独立二倍核算',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1,m.id);const n=hits[0].settledDamage;assert.ok(n>=Math.floor(base*factor*.85)&&n<=Math.floor(base*factor)||m.id===14042&&n>=Math.floor(base*factor*2*.85)&&n<=Math.floor(base*factor*2),JSON.stringify({id:m.id,n,base,factor}));assert.equal(out.fighters[0].soulState.lubuFull,false);}
});
test('3031真实配招五槽唯一原19274第五，结算不改原输入、源实例及来源哈希',()=>{
 for(const m of source.moves){const s=make(m.id),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19274);turn(s,m.id);assert.deepEqual(s,before);assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3031).moves.find(x=>x.id===m.id));}
});
test('3031原95命中自然有成功MISS，三原生必中覆盖负六且实际红伤命中',()=>{
 let hit=0,miss=0;for(let seed=1;seed<=32;seed++){const s=turn(make(19270,{seed}),19270);if((s.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0))hit++;else miss++;}assert.ok(hit>0&&miss>0);for(const id of[13532,19273,19274]){const s=turn(make(id,{aStages:{acc:-6}}),id);assert.ok((s.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));}
});
test('3031真实普通十六分之一与碎星四分之一级暴击，自然种子普通致命均有且红伤一倍二倍公式独立',()=>{
 for(const id of[10127,13527]){let normal=0,critical=0;for(let seed=1;seed<=48;seed++){const s=make(id,{seed,criticals:true}),m=s.moveDefinitions['wiki:'+id],out=turn(s,id),e=out.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),crit=/暴击 2/.test(e.detail),base=Math.floor(Math.floor(42*m.power*s.fighters[0].stats.atk/s.fighters[1].stats.def)/50)+2,factor=E.sameTypeBonus(m.type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*(crit?2:1),n=e.damage.settledDamage;assert.ok(n>=Math.floor(base*factor*.85)&&n<=Math.floor(base*factor));if(crit)critical++;else normal++;}assert.ok(normal>0&&critical>0);}
});
