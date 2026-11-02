'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4208-battle.cjs'),{make,pick,turn,key,timer,E}=H;
const attacks=(s,side=0)=>(s.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===side);
test('4208精神封锁052公式满体0、差1向上取整、半体两侧及1HP真实伤害均对照实际威力',()=>{
 for(const [hp,power]of [[9000,0],[8999,1],[4501,50],[4500,50],[4499,51],[1,100]]){const s=make(pick(100)[0],{hp}),b=structuredClone(s);b.moveDefinitions[key(s.auditMoveId)].operations=[];b.moveDefinitions[key(s.auditMoveId)].power=power;const o=turn(s),reference=turn(b);assert.equal(o.fighters[0].soulState.hpPower1444.power,power);assert.deepEqual(attacks(o).map(x=>x.settledDamage),attacks(reference).map(x=>x.settledDamage));assert.equal(o.fighters[0].pp[key(35008)],9);}
 for(const [maxHp,hp]of [[1000,500],[9000,4500]]){const s=make(pick(100)[0],{hp,aStats:{maxHp}});assert.equal(turn(s).fighters[0].soulState.hpPower1444.power,50);}
});
test('4208精神封锁读取实际出手时HP，不取回合开始值；同一招多段中途回复不重取威力',()=>{
 const s=make(pick(100)[0],{aStats:{spe:1},bStats:{spe:900}}),o=turn(s,s.auditMoveId,920040),lost=attacks(o,1).reduce((n,x)=>n+x.hpLoss,0);assert.ok(lost>0);assert.equal(o.fighters[0].soulState.hpPower1444.power,Math.ceil(lost*100/9000));assert.ok(attacks(o)[0].settledDamage>0);
 const m=make(pick(100)[0],{hp:4500}),original=m.moveDefinitions[key(35008)].operations;H.op(m,31,[2,2],35008);const multi=m.moveDefinitions[key(35008)].operations;H.op(m,43,[4],35008);m.moveDefinitions[key(35008)].operations=[...original,...multi,...m.moveDefinitions[key(35008)].operations];const b=structuredClone(m);b.moveDefinitions[key(35008)].operations=b.moveDefinitions[key(35008)].operations.filter(x=>x.effectId!==100);b.moveDefinitions[key(35008)].power=50;const actual=turn(m),expected=turn(b);assert.equal(actual.fighters[0].hp,9000);assert.equal(actual.fighters[0].soulState.hpPower1444.power,50);assert.equal(attacks(actual).length,2);assert.deepEqual(attacks(actual).map(x=>x.settledDamage),attacks(expected).map(x=>x.settledDamage));
});
test('4208魂印按整回合多段完整攻击总量选唯一分支，400不触发，固定附伤不混入攻击',()=>{
 for(const each of [199,200,201]){const s=make({moveId:10499,index:null},{soul:1427});s.moveDefinitions[key(920040)].power=99999;H.op(s,31,[2,2],920040);timer(s,0,'攻击伤害上限',{amount:each});const o=turn(s,920031,920040),n=attacks(o,1).reduce((v,e)=>v+e.settledDamage,0);assert.equal(n,each*2);assert.equal(!!o.fighters[1].effects.statusBlock,n<400);assert.equal(!!o.fighters[1].effects.attackBlock,n>400);}
 const s=make({moveId:10499,index:null},{soul:1427});H.op(s,29,[1000],920040);const o=turn(s,920031,920040);assert.ok(o.damageEvents.some(e=>e.type==='fixed'&&e.settledDamage===1000));assert.ok(attacks(o,1).reduce((v,e)=>v+e.settledDamage,0)<400);assert.equal(o.fighters[1].effects.statusBlock.start,2);assert.equal(o.fighters[1].effects.attackBlock,undefined);
});
test('4208全部17招包含真实35008在1HP可执行并耗PP，100与混乱各自按原始实例执行',()=>{
 const s=make({moveId:35008,index:null},{hp:1}),o=turn(s);assert.equal(o.fighters[0].pp[key(35008)],9);assert.equal(o.fighters[0].soulState.hpPower1444.power,100);assert.ok(attacks(o)[0].settledDamage>0);let yes=false,no=false;for(let seed=0;seed<70;seed++){const m=make({moveId:35008,index:null},{seed}),n=turn(m);assert.equal(attacks(n)[0].settledDamage,0);yes ||=!!n.fighters[1].ailments['混乱'];no ||=!n.fighters[1].ailments['混乱'];}assert.ok(yes&&no);
});
test('4208 100严格来源与零参数，不把当前公式推广到未核实技能',()=>{
 const r=E.WIKI.effectsEngine.registry[100],m=H.source.moves.find(x=>x.id===35008);assert.doesNotThrow(()=>r.validate([],m,0));assert.throws(()=>r.validate([],{...m,hash:'bad'},0));assert.throws(()=>r.validate([],{...m,id:35070},0));assert.throws(()=>r.validate([],m,1));assert.throws(()=>r.validate([1],m,0));
});
