'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3211-native.cjs');
test('3211原冲击2仅对手严格低半威力翻倍，观察完整真实beforeDamage不替换任何操作',()=>{
 for(const hp of[4499,4500,4501]){const old=H.E.WIKI.effectsEngine;let seen;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const power=c.power,result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)seen={power,next:c.power};return result;}};try{const s=H.turn(H.make(10530,{bHp:hp}),10530);assert.ok(H.damage(s,'attack')>0);assert.equal(seen.next,seen.power*(hp<4500?2:1));}finally{H.E.WIKI.effectsEngine=old;}}
});
test('3211原极能免弱四回和魅影免弱五回，真实哀叹到期才恢复降低特防',()=>{
 for(const [move,duration]of[[25111,4],[25113,5]]){let s=H.turn(H.make(move,{enemyId:3205,enemyMoves:[20491],aStats:{spe:4000},bStats:{spe:100}}),move,20491);assert.equal(s.fighters[0].stages.spd,0);for(let r=2;r<=duration+1;r++){s=H.turn(s,'potion:pp',20491);assert.equal(s.fighters[0].stages.spd,r<=duration?0:-1);}}
});
test('3211原幻变五回和极能四回免异，真实安魂曲受阻而到期后恢复睡眠；魅影反弹先于次数免异',()=>{
 for(const [move,duration]of[[21042,5],[25111,4]]){let s=H.turn(H.make(move,{seed:1,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100}}),move,22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);for(let r=2;r<=duration;r++){s=H.turn(s,'potion:pp',22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);}assert.equal(s.fighters[0].effects.免异常,undefined);for(let i=0;i<3&&!s.fighters[0].ailments.睡眠;i++)s=H.turn(s,'potion:pp',22053);assert.ok(s.fighters[0].ailments.睡眠);}
 let reflected=false;for(let seed=1;seed<=16&&!reflected;seed++){const s=H.turn(H.make(25113,{seed,enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStats:{spe:100},aCounts:{immune:1}}),25113,22053);assert.equal(s.fighters[0].ailments.睡眠,undefined);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].effects.reflect.end,4);reflected=!!s.fighters[1].ailments.睡眠;}assert.equal(reflected,true);
});
test('3211两招456按本体红伤之后的实际HP严格低于280或300才秒杀，保1独立挡致死；不裁定1051类型',()=>{
 for(const [move,threshold]of[[30013,280],[30016,300]]){const normal=H.turn(H.make(move),move),red=H.damage(normal,'attack');for(const offset of[-1,0,1]){const s=H.turn(H.make(move,{bHp:red+threshold+offset}),move);assert.equal(s.fighters[1].hp,offset<0?0:threshold+offset);}const saved=H.turn(H.make(move,{bHp:red+threshold-1,bEffects:{致命保留:{start:1,end:9,hp:1}}}),move);assert.equal(saved.fighters[1].hp,1);}
});
test('3211原第五760真实微弱转普通，原本强效保持原倍率；只观察现有克制表和实际操作',()=>{
 const seen=new Set;for(const enemyId of[2989,3056]){const old=H.E.WIKI.effectsEngine;let captured;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const affinity=c.affinity,result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)captured={affinity,next:c.affinity};return result;}};try{const s=H.turn(H.make(30017,{enemyId}),30017);assert.ok(H.damage(s,'attack')>0);assert.ok(captured);seen.add(captured.affinity);assert.equal(captured.next,captured.affinity<1?1:captured.affinity);}finally{H.E.WIKI.effectsEngine=old;}}assert.ok([...seen].some(x=>x<1));assert.ok([...seen].some(x=>x>1));
});
