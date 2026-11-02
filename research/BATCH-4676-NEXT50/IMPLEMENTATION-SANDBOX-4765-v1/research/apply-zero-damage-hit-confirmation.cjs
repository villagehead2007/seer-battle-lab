'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const dir='research/zero-damage-hit-2026-10-29';fs.mkdirSync(dir,{recursive:true});
const record={recordedAt:new Date().toISOString(),userOriginal:'技能命中但伤害归零算命中，执行命中效果，不执行无效补偿',scope:'已命中技能，包括伤害免疫、减免及护盾导致零伤；命中词条自身封锁仍独立处理，MISS/失明/整招无效不改为命中',supersedes:['4622/2126攻击免疫归零触发无效补偿','4422/1861攻击免疫触发无效补偿'],status:'implementation-awaiting-regression',upstreamUnchanged:true};
fs.writeFileSync(dir+'/confirmation.json',JSON.stringify(record,null,2)+'\n');
for(const file of ['dist/effect-registry.js','dist/souls.js','dist/range-effects.js'])fs.copyFileSync(file,dir+'/'+file.split('/').at(-1)+'.before');
let file='dist/effect-registry.js',s=fs.readFileSync(file,'utf8');
const gate="if(context.attackImmune&&!rule.attackImmunityExempt){rule.retainedHitHooks?.[phase]?.(context,op.params);if(phase==='beforeOrder'&&context.suppressPositivePriority&&context.priority>beforePriority)context.priority=beforePriority;continue;}";
assert.ok(s.includes(gate));s=s.replace(gate,'');fs.writeFileSync(file,s);
file='dist/souls.js';s=fs.readFileSync(file,'utf8');
const start=s.indexOf('function normalEffect('),end=s.indexOf('\n    function ',start+10);assert.ok(start>=0&&end>start);
let section=s.slice(start,end);section=section.replaceAll('!attackImmune&&','').replace('if(attackImmune||skillContext(a,t,m).hitEffectsDisabled)return;','if(skillContext(a,t,m).hitEffectsDisabled)return;');s=s.slice(0,start)+section+s.slice(end);
assert.ok(s.includes('const hitPayloadAllowed=!hit.attackImmune&&!skillContext(a,t,m).hitEffectsDisabled;'));s=s.replace('const hitPayloadAllowed=!hit.attackImmune&&!skillContext(a,t,m).hitEffectsDisabled;','const hitPayloadAllowed=!skillContext(a,t,m).hitEffectsDisabled;');fs.writeFileSync(file,s);
file='dist/range-effects.js';s=fs.readFileSync(file,'utf8');
function rep(a,b){assert.ok(s.includes(a),a);s=s.replace(a,b);}
rep("afterAttack(c){if(c.attackImmune||c.hitEffectsDisabled)retained(c);}","afterAttack(c){if(c.hitEffectsDisabled)retained(c);}");
// No on-hit compensation hook: 2126 executes only at its onInvalid phase.
rep("hooks:{afterAttack(c){if(!c.hitEffectsDisabled&&!c.attackImmune)return;if(c.hitEffectsDisabled)return;registry[2126].qualifiedFailure4622(c);}},retainedHitHooks:{onInvalid(c,p){registry[2126].execute({...c,effectInstanceIndex:2},p);},afterAttack(c,p){registry[2126].hooks.afterAttack({...c,effectInstanceIndex:2},p);}}","hooks:{},retainedHitHooks:{onInvalid(c,p){registry[2126].execute({...c,effectInstanceIndex:2},p);}} ");
rep("if(c.hitEffectsDisabled||c.attackImmune)retained17944658(c);","if(c.hitEffectsDisabled)retained17944658(c);");
rep('const policy=c.a.soulState.qualified2182Immune4646;','const policy=c.a.soulState.qualified2182Immune4646??"include-attack-immunity";');
rep('immunity=c.a.soulState.qualified2035Immune4650,','immunity=c.a.soulState.qualified2035Immune4650??"include",');
fs.writeFileSync(file,s);
fs.appendFileSync('AGENTS.md','\n\n## 已命中零伤统一规则（用户确认，2026-10-29）\n\n技能命中但伤害归零算命中，执行命中效果，不执行无效补偿。覆盖先前将攻击免疫归零视为技能无效的实例确认；保留来源与旧确认。伤害免疫、减免、护盾和命中效果自身封锁分别处理；本条不将MISS、失明或整招无效改为命中。\n');
console.log('Latest global hit rule applied; full regression required.');
