'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,make,turn,timer,pick}=require('./helpers/3291-battle.cjs');
const m=id=>({moveId:id,index:null});
test('3291 本地真实命宇轮回强化吸取与皇怒增益，封属失败和半血边界',()=>{
 for(const hp of [4499,4500,9000]){const s=make(m(25295),{soul:622,hp});s.fighters[0].counts.rageDouble=1;const o=turn(s);assert.ok(Object.values(o.fighters[0].stages).every(n=>n===(hp<4500?2:1)));assert.equal(o.fighters[0].effects.drain.end,4);assert.equal(o.fighters[1].hp,hp<4500?3000:6000);assert.equal(o.fighters[0].counts.halfDamage,2);assert.equal(o.fighters[0].effects.doubleDamage.start,2);assert.equal(o.fighters[0].pp[key(25295)],4);
 const blocked=make(m(25295),{soul:622});blocked.fighters[0].counts.rageDouble=1;timer(blocked,0,'statusBlock');const b=turn(blocked);assert.equal(b.fighters[0].stages.atk,0);assert.equal(b.fighters[0].effects.drain,undefined);assert.equal(b.fighters[0].counts.halfDamage,2);assert.equal(b.fighters[0].pp[key(25295)],4);}
});
test('3291 瀚空之门免异常次数及皇怒，敌方属性扣PP和攻击反制实际血量',()=>{
 const s=make(m(25294),{soul:622});s.fighters[0].counts.rageDouble=1;const o=turn(s);assert.equal(o.fighters[0].counts.immune,2);assert.ok(o.fighters[0].effects.gate);assert.ok(o.fighters[0].effects.protect);assert.equal(o.fighters[0].effects.priority.start,2);
 for(const id of o.fighters[1].moves)assert.ok(o.fighters[1].pp[id]<99);
 const before=o.fighters[1].hp,n=turn(o,900031,900040);assert.equal(n.fighters[1].hp,before-3000);timer(s,0,'statusBlock');const b=turn(s);assert.equal(b.fighters[0].effects.gate,undefined);assert.equal(b.fighters[0].counts.immune,undefined);
});
test('3291 圣世惩杀清回合清PP消强与皇怒，正PP候选和保护失败',()=>{
 const s=make(m(30376),{soul:622});s.fighters[0].counts.rageDouble=1;timer(s,1,'免弱');s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[1].effects['免弱'],undefined);assert.equal(Object.values(o.fighters[1].pp).filter(n=>n===0).length,2);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[0].effects.rageBonus.start,2);assert.ok(o.fighters[1].hp<6000);
 const no=make(m(30376),{soul:622});timer(no,1,'protect');const n=turn(no);assert.ok(n.fighters[1].effects.protect);assert.equal(Object.values(n.fighters[1].pp).filter(n=>n===0).length,0);
 const few=make(m(30376));timer(few,1,'免弱');for(const id of few.fighters[1].moves)few.fighters[1].pp[id]=0;few.fighters[1].pp[key(900041)]=4;assert.equal(turn(few).fighters[1].pp[key(900041)],0);
});
test('3291 亘古圣辰决低伤疲惫未击败封攻，免异常及皇怒封属',()=>{
 const s=make(m(30380),{soul:622});s.fighters[0].counts.rageDouble=1;const o=turn(s);assert.ok(o.fighters[1].ailments['疲惫']);assert.equal(o.fighters[1].effects.attackBlock.start,2);assert.equal(o.fighters[1].effects.attackBlock.end,2);assert.ok(o.fighters[1].ailments['失明']||o.fighters[1].effects.statusBlock);
 const no=make(m(30380),{soul:622});no.fighters[0].counts.rageDouble=1;no.fighters[1].counts.immune=2;const b=turn(no);assert.equal(b.fighters[1].ailments['疲惫'],undefined);assert.ok(b.fighters[1].effects.statusBlock||b.fighters[1].ailments['失明']);
 const high=make(m(30380),{aStats:{atk:5000}});assert.equal(turn(high).fighters[1].ailments['疲惫'],undefined);
});
test('3291 万皇宗魄决逐次暴击计数、暴击完整皇怒和攻击先制消费',()=>{
 const s=make(m(30381),{soul:622});s.fighters[0].counts.rageDouble=1;timer(s,0,'必定暴击');const o=turn(s);assert.equal(o.fighters[0].fifthUses,1);assert.equal(o.fighters[0].counts.rageFull,2);assert.equal(o.fighters[0].counts.attackPriority,2);assert.equal(o.fighters[0].pp[key(30381)],4);
 const n=turn(o,900030);assert.equal(n.fighters[0].counts.attackPriority,1);assert.equal(n.fighters[0].counts.rageFull,1);assert.equal(n.fighters[0].fifthUses,1);
 const no=make(m(30381),{soul:622});timer(no,0,'attackBlock');const b=turn(no);assert.equal(b.fighters[0].counts.rageFull,undefined);assert.equal(b.fighters[0].fifthUses,1);
});
test('3291 魂印免粉免弱、初始免异常、行动回复和基础技能不误触皇怒',()=>{
 const s=make(m(20530),{soul:622,hp:1000});s.fighters[0].counts.rageDouble=1;const o=turn(s);assert.equal(o.fighters[0].hp,2125);assert.equal(o.fighters[0].stages.acc,1);assert.ok(!o.turns[0].events.some(e=>e.text.includes('星皇之怒判定')));
 for(const [id,args]of [[683,[100,100]],[603,[100,6,2]],[749,[100,2]]]){const q=make(m(20530),{soul:622});q.moveDefinitions[key(900041)].operations=[{effectId:id,index:0,phase:'afterHit',params:args,sourceArgs:args}];const n=turn(q);assert.equal(n.fighters[0].hp,9000);assert.equal(n.fighters[0].stages.atk,0);assert.deepEqual(n.fighters[0].ailments,{});}
 const expired=make(m(20530),{soul:622});expired.round=4;expired.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];assert.ok(turn(expired).fighters[0].ailments['害怕']);
});
test('3291 普通能力技能逐实例成功、六级边界与免疫失败',()=>{
 for(const id of [4,5])for(const x of pick(id)){const s=make(x),[stat,,n]=x.params,o=turn(s);assert.equal(o.fighters[id===4?0:1].stages[keys[stat]],n);const f=s.fighters[id===4?0:1];f.stages[keys[stat]]=n>0?6:-6;assert.equal(turn(s).fighters[id===4?0:1].stages[keys[stat]],n>0?6:-6);f.stages[keys[stat]]=0;timer(s,id===4?0:1,id===4?'禁强化':'免弱');assert.equal(turn(s).fighters[id===4?0:1].stages[keys[stat]],0);}
});
test('3291 普通攻击后手双倍、低体三倍与随机固伤边界免疫',()=>{
 const slow=make(m(11492),{aStats:{spe:1}}),fast=make(m(11492));assert.ok(turn(slow).fighters[0].lastAttackDamage>turn(fast).fighters[0].lastAttackDamage*1.8);
 const low=make(m(30378),{hp:2999}),edge=make(m(30378),{hp:3000});assert.ok(turn(low).fighters[0].lastAttackDamage>turn(edge).fighters[0].lastAttackDamage*2.8);
 for(let seed=0;seed<20;seed++){const s=make(m(30379),{seed}),o=turn(s),pink=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(pink>=1&&pink<=500);s.fighters[1].build.resistance.fixed=100;const b=turn(s);assert.equal(9000-b.fighters[1].hp,b.fighters[0].lastAttackDamage);}
});
test('3291 全部17招真实伤害PP、零PP、封招与控制逐招',()=>{
 for(const move of source.moves){const s=make(m(move.id),{omit:true});s.moveDefinitions[key(move.id)].wikiId=900999;const o=turn(s);assert.equal(o.fighters[0].pp[key(move.id)],move.pp-1);assert.equal(o.fighters[1].hp<9000,move.kind!=='status'&&move.power>0);const no=make(m(move.id),{omit:true});no.fighters[0].pp[key(move.id)]=0;assert.throws(()=>turn(no));const block=make(m(move.id),{omit:true});timer(block,0,'skillBlock');assert.equal(turn(block).fighters[1].hp,9000);const control=make(m(move.id),{omit:true});control.fighters[0].ailments['疲惫']=2;assert.equal(turn(control).fighters[0].pp[key(move.id)],move.pp);}
});
