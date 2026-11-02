const fs=require('fs');let p='dist/souls.js',s=fs.readFileSync(p,'utf8');s=s.replace("  E.STATUS_RULES=statusRules;","  E.STATUS_RULES=statusRules;\n  const healthRules=typeof module==='object'&&module.exports?require('./health-rules.js'):globalThis.BattleHealthRules;");s=s.replace('    function damageDealt(a,t,dealt){',"    function drainPercent(a,t,n,label,origin='skill',multiplier=1){return healthRules.drainPercent({a,t,hurt:(f,amount,source,type)=>inflict(a,f,amount,source,type),heal:(f,amount,source)=>heal(f,amount,source,origin)},n,label,label,multiplier);}\n    function damageDealt(a,t,dealt){");
const edits=[
["const n=inflict(f,by,by.stats.maxHp*f.effects['强化被清吸取'].fraction,'强化被清吸取','percent');heal(f,n,'强化被清吸取','skill');","drainPercent(f,by,by.stats.maxHp*f.effects['强化被清吸取'].fraction,'强化被清吸取');"],
["const n=inflict(t,a,a.stats.maxHp/e.denominator,'光之惩戒受击吸取','percent');heal(t,n,'光之惩戒受击吸取','skill');","drainPercent(t,a,a.stats.maxHp/e.denominator,'光之惩戒受击吸取');"],
["const n=inflict(t,a,a.stats.maxHp/t.effects.poseidonAttackDrain.denominator,'波塞冬命中前吸取','percent');heal(t,n,'波塞冬命中前吸取');","drainPercent(t,a,a.stats.maxHp/t.effects.poseidonAttackDrain.denominator,'波塞冬命中前吸取','');"],
["heal(a,inflict(a,t,t.stats.maxHp/butterflyDrain.params[0],m.name,'percent'),m.name,'skill');","drainPercent(a,t,t.stats.maxHp/butterflyDrain.params[0],m.name);"],
["const n=inflict(a,t,t.stats.maxHp/e.denominator,'用攻异常未触发吸取','percent');heal(a,n,'用攻异常未触发吸取','skill');","drainPercent(a,t,t.stats.maxHp/e.denominator,'用攻异常未触发吸取');"],
["heal(a,inflict(a,t,t.stats.maxHp*e.fraction*multiple,'用招低体双吸','percent'),'用招低体双吸','skill');","drainPercent(a,t,t.stats.maxHp*e.fraction*multiple,'用招低体双吸');"],
["n=inflict(a,t,t.stats.maxHp*e.fraction*(a.hp<a.stats.maxHp*e.threshold?2:1),'用招低体吸取禁疗','percent');heal(a,n,'用招低体吸取禁疗','skill');","n=drainPercent(a,t,t.stats.maxHp*e.fraction*(a.hp<a.stats.maxHp*e.threshold?2:1),'用招低体吸取禁疗');"],
["heal(a,inflict(a,t,t.stats.maxHp*e.fraction,'用招低体吸取','percent')*multiple,'用招低体吸取','skill');","drainPercent(a,t,t.stats.maxHp*e.fraction,'用招低体吸取','skill',multiple);"],
["heal(a,inflict(a,t,t.stats.maxHp*a.effects['用招吸取体力'].fraction,'用招吸取体力','percent'),'用招吸取体力','skill');","drainPercent(a,t,t.stats.maxHp*a.effects['用招吸取体力'].fraction,'用招吸取体力');"],
["const drained=inflict(a,t,requested,'命宇轮回吸血',true);heal(a,drained,'命宇轮回吸血','skill');","drainPercent(a,t,requested,'命宇轮回吸血');"],
["heal(a,inflict(a,t,t.stats.maxHp*e.drainFraction,'低体改吸取','percent'),'低体改吸取','skill');","drainPercent(a,t,t.stats.maxHp*e.drainFraction,'低体改吸取');"],
["n=inflict(a,t,t.stats.maxHp/e.denominator*(boosted(a).length?1:2),'零时诳语持续吸取','percent');heal(a,n,'零时诳语持续吸取','skill');","n=drainPercent(a,t,t.stats.maxHp/e.denominator*(boosted(a).length?1:2),'零时诳语持续吸取');"],
["n=inflict(f,target,target.stats.maxHp*f.effects['回合末最大体力吸取'].fraction,'回合末最大体力吸取','percent');heal(f,n,'回合末最大体力吸取','skill');","n=drainPercent(f,target,target.stats.maxHp*f.effects['回合末最大体力吸取'].fraction,'回合末最大体力吸取');"],
["const n=inflict(fs[1-f.side],f,f.stats.maxHp/8,'寄生种子','percent');heal(fs[f.effects['寄生种子'].source],n,'寄生种子','skill');","drainPercent(fs[f.effects['寄生种子'].source],f,f.stats.maxHp/8,'寄生种子');"]
];for(const [from,to]of edits){if(!s.includes(from))throw Error('missing '+from);s=s.replace(from,to);}fs.writeFileSync(p,s);
p='dist/effect-registry.js';s=fs.readFileSync(p,'utf8').replace("'use strict';","'use strict';\nconst healthRules=typeof module==='object'&&module.exports?require('./health-rules.js'):globalThis.BattleHealthRules;");s=s.replace("const n=c.hurt(c.t,c.t.stats.maxHp/p.denominator,c.m.name,'percent');c.a.suitState.shield", "const n=healthRules.drainPercent(c,c.t.stats.maxHp/p.denominator,c.m.name);c.a.suitState.shield");fs.writeFileSync(p,s);
console.log('14 timed/context paths plus 1327 migrated');
