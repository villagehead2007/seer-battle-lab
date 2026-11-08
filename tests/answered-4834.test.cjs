'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4834/snapshot.json');
const {E,make,turn,timer,sum,key}=require('./helpers/remaining-battle.cjs')(source);
test('4834已答2024：必暴攻击MISS失明整招无效双倍吸取与封下次攻击，无暴击前提不独立补偿，控制未用不触发',()=>{
 for(const mode of ['miss','blind','whole','no-crit','control']){const s=make({move:10181,index:-1,soul:true,hp:1000});if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];timer(s,0,'攻击必失');}if(mode==='blind')s.fighters[0].ailments['失明']=3;if(mode==='whole'||mode==='no-crit')timer(s,0,'skillBlock');if(mode==='no-crit')timer(s,0,'禁强化');if(mode==='control')s.fighters[0].ailments['疲惫']=3;turn(s,10181,20309);
 const compensate=!['no-crit','control'].includes(mode);assert.equal(sum(s,'percent'),compensate?6000:0,mode);assert.equal(s.fighters[1].counts.nextAttackInvalid??0,compensate?1:0,mode);if(compensate)assert.equal(s.fighters[0].hp,7000,mode);assert.equal(s.fighters[0].pp[key(10181)],source.moves.find(m=>m.id===10181).pp-(mode==='control'?0:1));}
});
test('4834已答2024：已命中免攻零红仍为暴击正常三分之一吸取，不叠无效补偿，免粉不减理论魂印回复',()=>{
 for(const immunePink of [false,true]){const s=make({move:10181,index:-1,soul:true,hp:1000});timer(s,1,'攻击伤害免疫');if(immunePink)timer(s,1,'固定百分比免疫');turn(s,10181,20309);assert.equal(sum(s,'attack'),0);assert.equal(sum(s,'percent'),immunePink?0:3000);assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[1].counts.nextAttackInvalid??0,0);}
});
test('4834已答2024：全部回末结算后回复含异常与其他回末伤害，死亡不复活，技能禁疗不封魂印回复',()=>{
 const s=make({move:10181,index:-1,soul:true,hp:4000});timer(s,0,'禁强化');timer(s,0,'技能禁疗');s.fighters[0].ailments['中毒']=3;const old=E.SOULS;let hpBefore;
 E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterRoundEnd'&&c.a.side===0){c.hurt(c.a,100,'最后回末交互真伤','true');hpBefore=c.a.hp;}}};try{turn(s,10181,20309);}finally{E.SOULS=old;}
 assert.ok(hpBefore<4000);assert.equal(s.fighters[0].hp,hpBefore+3000);assert.equal(s.turns.at(-1).remainingHp[0],s.fighters[0].hp);
 const dead=make({move:10181,index:-1,soul:true,hp:100});timer(dead,0,'禁强化');dead.fighters[0].ailments['中毒']=3;turn(dead,10181,20309);assert.equal(dead.fighters[0].hp,0);
});
test('4834已答2363：按清强前快照分支，有正强只清强，无正强才断回合，保护失败不改分支',()=>{
 const m=source.moves.find(m=>m.effectInstances.some(e=>e.id===2363)),index=m.effectInstances.findIndex(e=>e.id===2363);
 for(const mode of ['boost','empty','protected']){const s=make({move:m.id,index});if(mode!=='empty')s.fighters[1].stages.def=2;if(mode==='protected')timer(s,1,'幽蝶强化保护');turn(s,m.id,20309);assert.equal(!!s.fighters[1].effects['攻击必中'],mode!=='empty');assert.equal(s.fighters[1].stages.def,mode==='protected'?2:0);}
});
