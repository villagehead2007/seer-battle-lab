'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3036-native.cjs');
test('3036真实22招逐字段绑定物特属性威力PP命中先制必中暴击率，原398用招实际逐招扣一PP',()=>{
 assert.equal(source.moves.length,22);for(const m of source.moves){const s=make(m.id),k='wiki:'+m.id,c=s.moveDefinitions[k];for(const p of['name','kind','power','pp','accuracy','priority','alwaysHit','fifth'])assert.equal(c[p],m[p],m.id+'/'+p);assert.equal(c.type,m.kind==='status'?'属性':m.type);const[n,d]=m.critical.split('/').map(Number);assert.equal(c.criticalChance,n/d);assert.equal(s.fighters[0].soulId,398);assert.equal(s.fighters[0].soulHash,'5edce8dd');const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp-1);assert.ok(out.turns[0].events.some(e=>e.text.includes(m.name)));}
});
test('3036全部原生零PP不可选且拒绝保持输入，疲惫不出招不扣PP不执行附效回血',()=>{
 for(const m of source.moves){let s=make(m.id),k='wiki:'+m.id;s.fighters[0].pp[k]=0;const before=structuredClone(s);assert.ok(!E.availableMoves(s.fighters[0],s.round).includes(k));assert.throws(()=>turn(s,m.id),/有 PP/);assert.deepEqual(s,before);s=make(m.id);s.fighters[0].ailments['疲惫']=2;const out=turn(s,m.id);assert.equal(out.fighters[0].pp[k],m.pp);assert.equal(out.fighters[0].hp,4500);assert.equal(out.fighters[1].hp,9000);assert.ok(Object.values(out.fighters[0].stages).every(n=>n===0));assert.ok(Object.values(out.fighters[1].stages).every(n=>n===0));}
});
test('3036无队友阵亡原398出招红伤按原物特攻防威力本系相性浮动公式，原75固定独立',()=>{
 for(const m of source.moves.filter(m=>m.kind!=='status')){const s=make(m.id),a=s.fighters[0],b=s.fighters[1],atk=m.kind==='physical'?a.stats.atk:a.stats.spa,def=m.kind==='physical'?b.stats.def:b.stats.spd,base=Math.floor(Math.floor(42*m.power*atk/def)/50)+2,factor=E.sameTypeBonus(m.type,a.type,s.typeChart)*E.typeEffectiveness(m.type,b.type,s.typeChart),out=turn(s,m.id),hits=out.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(hits.length,1,m.id);assert.ok(hits[0].settledDamage>=Math.floor(base*factor*.85)&&hits[0].settledDamage<=Math.floor(base*factor),JSON.stringify({id:m.id,base,factor,hit:hits[0]}));if(m.id===10761)assert.equal(out.damageEvents.find(e=>e.type==='fixed').settledDamage,75);}
});
test('3036两真实魂印均保五槽唯一原19295第五，结算不改输入或有序真实源实例',()=>{
 for(const soul of[398,399])for(const m of source.moves){const s=make(m.id,{soul}),before=structuredClone(s);assert.equal(s.fighters[0].moves.length,5);const fifth=s.fighters[0].moves.filter(k=>s.moveDefinitions[k].fifth);assert.equal(fifth.length,1);assert.equal(s.moveDefinitions[fifth[0]].wikiId,19295);turn(s,m.id);assert.deepEqual(s,before);assert.deepEqual(source.moves.find(x=>x.id===m.id),require('../local-species.cjs').species(3036).moves.find(x=>x.id===m.id));}
});
