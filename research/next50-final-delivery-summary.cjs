'use strict';
const fs=require('fs'),assert=require('assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',read=p=>JSON.parse(fs.readFileSync(p)),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const file='research/BATCH-4509-NEXT50-STATUS.json',s=read(file),proof=s.lastAcceptedFullRegression,p=read(proof),t=read(base+'TAKEOVER.json');
assert.equal(s.formalCompletedCount,50);assert.equal(s.status,'fixed50-single-stage-complete');assert.equal(p.accepted,true);assert.equal(p.npm.tests,8913);assert.equal(p.npm.fail,0);assert.equal(s.pendingBatchPreflights.length,0);
for(const id of s.singleStageCompleteIds){const cert=read(base+id+'-ACCEPTED.json');assert.equal(cert.passedSingleStage,true);assert.ok(s.targets.find(x=>x.id===id)?.accepted);}
const records=read('MULTI-PET-TODO.json').records.filter(x=>s.singleStageCompleteIds.includes(x.speciesId));assert.ok(records.every(x=>x.reviewStatus==='reviewed'));
const message='固定50只单精灵阶段已正式完成；本次在4674停止，无下一批起点。多精灵分支保留延期，自动开发继续暂停。';
s.nextAction=message;s.activeWork=message;s.updatedAt=new Date().toISOString();t.nextAction=message;t.activeWork=message;t.updatedAt=s.updatedAt;write(file,s);write(base+'TAKEOVER.json',t);
const summary='## 2026-10-29 最终交付：固定50只单精灵阶段50/50完成\n\n最后一批4654、4657、4658、4661、4662、4663、4665、4669、4671、4674已正式验收。每只全部专项状态检查及HTTP接入通过；最新冻结版本完整npm 8913/8913，失败、跳过、取消均为0，3901个冻结文件无变化。完整npm约32分34秒，整批含预检约40分45秒。正式记录：'+proof+'。\n\n本固定范围：单精灵阶段完成50；全部机制完全完成认证0；跳过0；待验证0；阻塞0。多精灵延期'+records.length+'条，涉及'+new Set(records.map(x=>x.speciesId)).size+'只，已保留来源、参数及审核记录，不宣称全部机制完成。无下一批起点，截止正式队列第276行4674；不自动处理4676，不启动多精灵阶段或自动开发。4669回命重授已按最新回答刷新3回合。\n\n上轮唯一失败为旧整份引擎参与JSON复制对照，已隔离复制变量并保留全部37组全状态断言；修复专项4/4及本次完整npm均通过。此前失败、修复及等待记录见下方历史，不代表当前状态。\n\n';
for(const path of ['PROGRESS.md','research/BATCH-4509-NEXT50-CHECKPOINT.md'])fs.writeFileSync(path,summary+fs.readFileSync(path,'utf8'));
console.log(JSON.stringify({formalCompleted:s.formalCompletedCount,tests:p.npm.tests,pass:p.npm.pass,deferred:records.length,deferredSpecies:new Set(records.map(x=>x.speciesId)).size,next:s.formalCursor.id,proof}));
