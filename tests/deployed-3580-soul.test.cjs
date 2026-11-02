'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3580-battle.cjs');
const {make,turn,wait,timer,pick,IDLE,HIT,WAIT,key}=H,base={moveId:10001,index:null};
const cursed=f=>Object.keys(f.ailments).some(k=>k.includes('诅咒'));
test('3580 魂印878回合初高低体力分流、等值不触发及免断',()=>{
  for(const [hp,targetHp,move] of [[8000,9000,HIT],[9000,8000,WAIT],[9000,9000,HIT]]){const s=make(base,{soul:true,hp,targetHp});timer(s,1,'doubleDamage');const o=turn(s,IDLE,move);assert.equal(!!o.fighters[1].effects.doubleDamage,hp===targetHp);if(hp<targetHp)assert.ok(o.fighters[0].hp<hp);}
  const p=make(base,{soul:true,hp:8000});timer(p,1,'protect');timer(p,1,'doubleDamage');assert.ok(turn(p,IDLE,HIT).fighters[1].effects.doubleDamage);
  const noAttack=make(base,{soul:true,hp:8000});timer(noAttack,1,'doubleDamage');assert.ok(wait(noAttack).fighters[1].effects.doubleDamage);
});
test('3580 魂印878体力条件在回合初锁定、技能回复反超后受击仍消回合',()=>{
  const e=pick(1065)[0],s=make(e,{soul:true,hp:1000,targetHp:6500});timer(s,1,'doubleDamage');const o=turn(s,e.moveId,HIT);assert.ok(o.fighters[0].hp>o.fighters[1].hp);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[0].soulState.curseLow,true);
});
test('3580 魂印878无强化下回合60%攻击诅咒、概率两侧和免控补偿',()=>{
  let success=false,failure=false;for(let seed=0;seed<40;seed++){let s=wait(make(base,{soul:true}));assert.equal(s.fighters[0].effects['咒怨反应'].start,2);s.rng=seed;s=turn(s);if(cursed(s.fighters[1])){success=true;assert.equal(s.fighters[0].counts.nextSkillPriority??0,0);}else{failure=true;assert.equal(s.fighters[0].counts.nextSkillPriority,2);}}assert.ok(success&&failure);
  let s=wait(make(base,{soul:true,aStats:{spe:1}}));timer(s,1,'免异常');s=turn(s);assert.equal(s.fighters[0].counts.nextSkillPriority,2);s=wait(s);assert.equal(s.turns[2].first,0);assert.equal(s.fighters[0].counts.nextSkillPriority,1);s=wait(s);assert.equal(s.turns[3].first,0);assert.equal(s.fighters[0].counts.nextSkillPriority,0);assert.equal(wait(s).turns[4].first,1);
});
test('3580 魂印878强化分支下回合对手属性诅咒、攻击不触发与控制不消费',()=>{
  const s=make(base,{soul:true,opponentBoost:true});s.fighters[0].stages.def=1;let o=wait(s);assert.equal(o.fighters[0].effects['强化诅咒'].start,2);o.rng=1;const a=turn(o,IDLE,900023);assert.ok(cursed(a.fighters[1]));assert.equal(cursed(turn(o,IDLE,HIT).fighters[1]),false);
  const protectedEnemy=structuredClone(o);timer(protectedEnemy,1,'免异常');assert.equal(cursed(turn(protectedEnemy,IDLE,900023).fighters[1]),false);
  o.fighters[0].counts.nextSkillPriority=2;o.fighters[0].ailments['疲惫']=3;const c=turn(o,10001);assert.equal(c.fighters[0].counts.nextSkillPriority,2);assert.equal(c.fighters[0].pp[key(10001)],o.fighters[0].pp[key(10001)]);
});
test('3580 诅咒真实阻止用招、自然结束转化三分支持续两回合',()=>{
  const variants=new Set();for(let seed=0;seed<40;seed++){const s=make(base,{seed});s.fighters[0].ailments['诅咒']=1;timer(s,0,'免异常');const o=turn(s);assert.equal(o.fighters[0].pp[key(10001)],s.fighters[0].pp[key(10001)]);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].ailments['诅咒'],undefined);const k=Object.keys(o.fighters[0].ailments)[0];variants.add(k);assert.equal(o.fighters[0].ailments[k],3);const after=wait(wait(o));assert.equal(after.fighters[0].ailments[k],undefined);}assert.deepEqual([...variants].sort(),['烈焰诅咒','致命诅咒','虚弱诅咒'].sort());
});
test('3580 诅咒后续烈焰百分比伤害、致命增伤与虚弱减伤',()=>{
  const flame=make(base);flame.fighters[0].ailments['烈焰诅咒']=2;assert.equal(wait(flame).fighters[0].hp,7875);timer(flame,0,'当回合免伤');assert.equal(wait(flame).fighters[0].hp,9000);
  const c=turn(make(base)),weak=make(base),vulnerable=make(base);weak.fighters[0].ailments['虚弱诅咒']=2;vulnerable.fighters[1].ailments['致命诅咒']=2;assert.ok(Math.abs(turn(weak).fighters[0].lastAttackDamage*2-c.fighters[0].lastAttackDamage)<=1);assert.ok(Math.abs(turn(vulnerable).fighters[0].lastAttackDamage-c.fighters[0].lastAttackDamage*1.5)<=1);
});
test('3580 原第五和两个激活技能独立配招、原始版本及完整组合状态',()=>{
  const source=H.source;assert.deepEqual(source.moves.filter(m=>m.fifth).map(m=>m.id),[31863]);assert.equal(source.moves.find(m=>m.id===37310).sourceFlags.is_fifth,true);assert.equal(source.moves.find(m=>m.id===37310).sourceFlags.is_special,true);assert.equal(source.moves.find(m=>m.id===29076).sourceFlags.is_special,true);
  for(const id of [31863,37310,29076]){const s=make({moveId:id,index:null},{hp:1000,seed:1});timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[0].pp[key(id)],source.moves.find(m=>m.id===id).pp-1);if(id===29076){assert.ok(cursed(o.fighters[1]));assert.equal(o.fighters[0].hp,7000);assert.equal(o.fighters[0].counts.invalidSkillResponse,2);assert.equal(o.fighters[0].counts.nextDefenseIgnore,.5);}else{assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(Object.values(o.fighters[1].pp).filter(n=>n===0).length,2);assert.ok(o.fighters[0].hp>1000);assert.ok(o.fighters[1].hp<6000);}}
});
