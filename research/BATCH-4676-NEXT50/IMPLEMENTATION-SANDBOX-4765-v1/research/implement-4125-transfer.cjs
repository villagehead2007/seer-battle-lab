'use strict';
const fs=require('fs'),assert=require('node:assert/strict');
let rules=fs.readFileSync('dist/range-effects.js','utf8');
const start=rules.indexOf("add(2145,'afterHit'"),end=rules.indexOf('\n\nmetadata[509]',start);assert.ok(start>0&&end>start);
rules=rules.slice(0,start)+`add(2145,'afterHit',(c,p)=>{
 const original=Object.entries(c.a.ailments).filter(([,end])=>end>=c.round).map(([name,end])=>({name,remaining:end-c.round+1}));
 if(!original.length)return;const removed=c.clearAilments(c.a);if(!removed?.length)return;
 for(const status of original){if(!removed.includes(status.name))continue;const prior=Math.max(0,(c.t.ailments[status.name]??0)-c.round+1);
  const applied=c.ailment(c.t,status.name,c.a,false,false,status.remaining);
  // Q027 specifically preserves transferred remaining duration, including 衰弱.
  if(applied&&status.name==='衰弱')c.t.ailments[status.name]=c.round+Math.max(prior,status.remaining)-1;
 }
 c.timed(c.t,'技能命中效果失效',p[0],{});
},[turns]);`+rules.slice(end);
const endFactory=rules.lastIndexOf('\n});');assert.ok(endFactory>0);
const priorityIds=[454,881,616,747,1193,2192,482,828,779,1002,2484,610,836,1070,954,1117,2510,1502,1774,1081,2025,1544,1547,1956,2079,785,1431,1491,2058,1243,2349,1484,2423,1080,2020,539,958];
rules=rules.slice(0,endFactory)+`
// Q-A60-4125-027: retain only the actual priority/always-hit clauses.
// Mixed clauses get a separate retained handler; their other hooks remain disabled.
for(const id of ${JSON.stringify(priorityIds)}){const old=registry[id];registry[id]=Object.freeze({...old,retainedHitHooks:{beforeOrder:old.execute}});}
{const old=registry[714];registry[714]=Object.freeze({...old,retainedHitHooks:{beforeOrder(c,p){if(Object.values(c.t.stages).some(x=>x>0))c.priority+=p[0];}}});}
{const old=registry[2028];registry[2028]=Object.freeze({...old,retainedHitHooks:{beforeAccuracy:old.execute}});}
`+rules.slice(endFactory);
fs.writeFileSync('dist/range-effects.js',rules);
let registry=fs.readFileSync('dist/effect-registry.js','utf8');
const guard="throw new Error('无效效果执行指令');const mark=";assert.ok(registry.includes(guard));
registry=registry.replace(guard,"throw new Error('无效效果执行指令');if(context.hitEffectsDisabled){rule.retainedHitHooks?.[phase]?.(context,op.params);continue;}const mark=");
fs.writeFileSync('dist/effect-registry.js',registry);
let engine=fs.readFileSync('dist/souls.js','utf8');
engine=engine.replace("for(const k of ['statusBlock','skillBlock'])","for(const k of ['statusBlock','skillBlock','技能命中效果失效'])");
engine=engine.replace("if(on(enemy,'对手属性失效'))n++;","if(on(enemy,'对手属性失效'))n++;if(on(enemy,'逐回合属性失效或减伤'))n++;");
const contextAnchor='moveKind:key=>battleMoves[key]?.kind,';assert.ok(engine.includes(contextAnchor));
engine=engine.replace(contextAnchor,contextAnchor+'anyStatusInvalid:()=>statusInvalidKinds(a,t)>0,');
const skillAnchor='return {...c,t:view,restorePP:';assert.ok(engine.includes(skillAnchor));
engine=engine.replace(skillAnchor,"return {...c,t:view,hitEffectsDisabled:on(a,'技能命中效果失效'),restorePP:");
fs.writeFileSync('dist/souls.js',engine);
console.log('2145继承转附和全阶段技能附效失效已接入；魂印事件独立保留。');
