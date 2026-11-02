'use strict';
const fs=require('fs');let f='dist/range-souls.js',s=fs.readFileSync(f,'utf8');
const code=`
for(const [id,hash,fraction]of [[1120,'25657a99',.8],[1620,'9448f0d7',1]])registry[id]={name:id===1120?'魂帝·天循道':'魂帝·天循道·强化',sourceHash:hash,traits:{},hooks:{
roundStart(c){c.a.soulState.soulEmperorDrain=Object.values(c.t.ailments).some(end=>end>=c.round);c.a.soulState.soulEmperorAttacked=false;},
opponentBeforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.soulEmperorAttacked=true;},
afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.soulEmperorDrain)healthRules.drainPercent(c,c.t.stats.maxHp/3,'魂帝异常吸取');},
roundEnd(c){if(c.a.hp<=0||!c.a.soulState.soulEmperorAttacked)return;const n=c.a.roundAttackDamage;if(n>300&&c.t.hp>0){if(id===1620)c.clear(c.t);c.hurt(c.t,n*fraction,'魂帝回合反伤','percent');if(c.t.hp>0&&c.random()<fraction)c.ailment(c.t,'疲惫',c.a);}else if(n<300){c.timed(c.a,'id984',1,{amount:1},c.round+1);c.timed(c.a,'攻击伤害倍数',1,{multiple:1+fraction},c.round+1);}}
}};
`;
s=s.replace(/\}\);\s*$/,code+'});\n');fs.writeFileSync(f,s);
f='dist/souls.js';s=fs.readFileSync(f,'utf8');
s=s.replace("typedAttack:(amount,type)=>damage(a,t,{...m,type,operations:[]}","typedAttack:(amount,type)=>damage(a,t,{...m,kind:m?.kind==='special'?'special':'physical',type,operations:[]}");
s=s.replace("if(f.soulState.oscarPriority?.round===r)","if(battleMoves[choices[i]].kind==='status'&&on(f,'属性技能先制'))priorities[i]+=f.effects['属性技能先制'].amount;if(f.soulState.oscarPriority?.round===r)");
s=s.replace("a.soulState.nextAttackBoostThis=0;a.soulState.nextAttackFixedThis=0;", "if(a.hp>0&&t.hp>0&&a.soulState.typedContracts){for(const entry of a.soulState.typedContracts){if(entry.remaining>0&&t.hp>0){entry.remaining--;context(a,t,m).typedAttack(entry.base+(a.soulState.contractDamageBonus??0),entry.type);}}a.soulState.typedContracts=a.soulState.typedContracts.filter(x=>x.remaining>0);}\n      if(a.hp>0&&t.hp<=0&&a.counts.defeatFullRestore>0){a.counts.defeatFullRestore--;heal(a,a.stats.maxHp,'击败回满','skill');ppRules.restore(a,battleMoves,999);}\n      a.soulState.nextAttackBoostThis=0;a.soulState.nextAttackFixedThis=0;");
fs.writeFileSync(f,s);
