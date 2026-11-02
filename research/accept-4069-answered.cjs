'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const source=require('./4069-reviewed-snapshot.json'),saved=store.save(source);assert.ok(saved.saved,JSON.stringify(saved));
const s=store.species(4069),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const confirmationPath='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',confirmation=JSON.parse(fs.readFileSync(confirmationPath));
const names=[...fs.readFileSync('tests/deployed-4069.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
for(const e of p.inventory(s)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();
 if(e.kind==='soul'){
  delete v.questions;delete v.pendingSingleBehavior;delete v.reviewStatus;
  v.rationale='保留API原文、格式化和hash；Q009确认原版百分比附伤，Q010确认攻击流程结束、MISS/无效已使用仍触发、控制未使用不触发；真实后继和队伍分支独立延期。';
  v.singleBehavior='攻击流程结束，双方仍存活且实际使用攻击技能则对手失明；原1315附最大HP1/3百分比伤害，强化1562百分比吸取并按理论量回复；异常免疫不阻伤害，粉免不阻理论回复，回复倍率与上限独立处理。';
  v.implementation=['dist/range-souls.js','dist/souls.js','dist/health-rules.js'];v.userConfirmation=confirmationPath;
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=names.map(name=>({file:'tests/deployed-4069.test.cjs',name,assertion:'真实HP/失明/伤害事件与理论回复：3000百分比，免异常不阻附伤，免粉不阻回复，0/50/100%回复削减，MISS/封攻有触发而控制/属性无触发；击败/死亡不执行当前分支；过量伤害完整3000且实际损失较小，满HP封顶，多段一次并早于对手行动。'}));
  v.dependencyEvidence=v.dependencyEvidence.map(x=>({...x,kind:x.kind==='next-pet'?'next-entry':x.kind}));
  confirmation.instanceBindings[e.key]={questionIds:['Q-A60-4069-009','Q-A60-4069-010'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw};
 }
}
confirmation.implementation.species4069Bindings=p.inventory(s).map(e=>({key:e.key,sourceDigest:e.sourceDigest,source:e.source,raw:e.raw}));
confirmation.implementation.species4069TestHistory={initialFailures:'research/4069-answered-special-v1.log',reason:'两个新增测试夹具问题：622兼免异常，不能用作单独粉免；无伤害时damageEvents未创建。改为明确粉免载体、零事件数组断言，回复削减使用已有全源倍率。原伤害/HP断言及历史日志保留。',finalSpecial:'research/4069-answered-special-v3.log'};
fs.writeFileSync(confirmationPath,JSON.stringify(confirmation,null,2)+'\n');fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({saved:true,coverage:p.reviewCoverage(s,r)}));
