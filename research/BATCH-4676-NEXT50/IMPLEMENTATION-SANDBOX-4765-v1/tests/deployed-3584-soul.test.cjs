'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3584-battle.cjs');
const {key,IDLE,WAIT,HIT,make,turn,wait,timer}=H;
const entry={moveId:10001,index:null};
test('3584 魂印885入场增加200真实体力、回合不叠加与重开',()=>{
 const a=make(entry,{soul:true}),b=make(entry);assert.equal(a.fighters[0].stats.maxHp-b.fighters[0].stats.maxHp,200);assert.equal(a.fighters[0].hp,9200);assert.equal(wait(wait(a)).fighters[0].hp,9200);assert.equal(wait(wait(a)).fighters[0].stats.maxHp,9200);assert.equal(make(entry,{soul:true}).fighters[0].hp,9200);assert.equal(b.fighters[0].stats.maxHp,9000);
});
test('3584 魂印885攻击50%实际害怕或阶段末粉伤、概率两侧',()=>{
 let yes=false,no=false;for(let seed=0;seed<50;seed++){const s=make(entry,{soul:true,seed}),o=turn(s,10001,HIT);const fear=o.turns[0].events.some(x=>x.text.includes('害怕'));if(o.fighters[1].pp[key(HIT)]===99){yes=true;assert.ok(fear);assert.equal(o.fighters[0].hp,9200);assert.equal(9000-o.fighters[1].hp,o.fighters[0].lastAttackDamage);}else {no=true;assert.ok(o.fighters[0].hp<9200);assert.ok(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage>=Math.floor(9200/3));}}assert.ok(yes&&no);
});
test('3584 魂印885用招失误仍触发、控制和属性不触发、阶段末才结算',()=>{
 const s=make(entry,{soul:true,hit:false});timer(s,1,'免异常');timer(s,0,'攻击必失');const o=turn(s,10001,HIT);assert.ok(o.fighters[0].hp<9200);assert.equal(o.fighters[1].pp[key(HIT)],98);assert.equal(o.fighters[1].hp,9000-2*Math.floor(9200/3));assert.equal(o.fighters[0].soulState.beastPending,undefined);assert.equal(wait(o).fighters[1].hp,o.fighters[1].hp);
 const st=make(entry,{soul:true});assert.equal(wait(st).fighters[1].hp,9000);st.fighters[0].ailments['疲惫']=2;const c=turn(st);assert.equal(c.fighters[0].pp[key(10001)],35);assert.equal(c.fighters[1].hp,9000);
 const blocked=make(entry,{soul:true});timer(blocked,0,'attackBlock');timer(blocked,1,'免异常');const b=turn(blocked);assert.equal(b.fighters[1].hp,9000-Math.floor(9200/3));assert.equal(b.fighters[0].pp[key(10001)],34);
});
test('3584 魂印885实际受攻击伤害才反应、失误免攻无效及属性不触发',()=>{
 const s=make(entry,{soul:true});timer(s,1,'免异常');const o=turn(s,IDLE,HIT);assert.ok(o.fighters[0].hp<9200);assert.equal(o.fighters[1].hp,9000-Math.floor(9200/3));
 const miss=make(entry,{soul:true});timer(miss,1,'攻击必失');assert.equal(turn(miss,IDLE,HIT).fighters[1].hp,9000);const im=make(entry,{soul:true});im.fighters[0].counts.attackNullify=1;assert.equal(turn(im,IDLE,HIT).fighters[1].hp,9000);assert.equal(wait(make(entry,{soul:true})).fighters[1].hp,9000);
 let yes=false,no=false;for(let seed=0;seed<40;seed++){const a=make(entry,{soul:true,seed}),b=turn(a,IDLE,HIT);const bonus=9000-b.fighters[1].hp;if(bonus===0){yes=true;assert.ok(b.turns[0].events.some(e=>e.text.includes('害怕')));}else{no=true;assert.equal(bonus,Math.floor(9200/3));}}assert.ok(yes&&no);
});
test('3584 魂印885免控转为粉伤、粉伤免疫与致死不复活',()=>{
 const s=make(entry,{soul:true});timer(s,1,'免异常');timer(s,1,'当回合免伤');const o=turn(s);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].soulState.beastPending,undefined);
 const lethal=make(entry,{soul:true,hp:1,bStats:{spe:999,atk:9000}});timer(lethal,1,'免异常');const l=turn(lethal,10001,HIT);assert.equal(l.fighters[0].hp,0);assert.equal(l.fighters[1].hp,9000);assert.equal(l.fighters[0].pp[key(10001)],35);
});
test('3584 原第五与激活技能来源独立保留并验证完整组合',()=>{
 const src=H.source;assert.deepEqual(src.moves.filter(m=>m.fifth).map(m=>m.id),[31887]);const enhanced=src.moves.find(m=>m.id===37965);assert.equal(enhanced.sourceFlags.is_special,true);assert.equal(enhanced.sourceFlags.skill_activation_item.id,1727209);
 for(const id of [31887,37965]){const s=make({moveId:id,index:null},{hp:1000});s.fighters[1].stages.def=2;s.fighters[0].ailments['烧伤']=3;const o=turn(s);assert.equal(o.fighters[0].pp[key(id)],4);assert.equal(o.fighters[1].stages.def,0);assert.equal(o.fighters[0].stages.def,2);assert.ok(o.fighters[1].hp<9000);assert.equal(o.fighters[1].effects.attackBlock.start,2);assert.equal(o.fighters[1].effects.attackBlock.end,id===37965?3:2);if(id===37965){assert.equal(o.fighters[0].ailments['烧伤'],undefined);assert.equal(o.fighters[0].hp,1000);}else assert.ok(o.fighters[0].hp<1000);}
 const defensive=make({moveId:26051,index:null},{bStats:{atk:9000}});timer(defensive,0,'攻击伤害上限',{amount:301});const d=turn(defensive,26051,HIT);assert.equal(d.fighters[0].hp,9000);assert.equal(d.fighters[1].hp,8699);assert.ok(d.fighters[0].effects.reflect);
});
