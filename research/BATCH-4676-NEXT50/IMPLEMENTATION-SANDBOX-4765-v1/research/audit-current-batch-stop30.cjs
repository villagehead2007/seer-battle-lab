'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),crypto=require('crypto');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const paths=['research/DEPLOY-3940-4068-STATUS.json','research/BATCH-AFTER-4068-NEXT40-STATUS.json'];
const batches=paths.map(read),rootPath='research/BATCH-3940-4068-AND-NEXT40-STATUS.json',root=read(rootPath);
const ids=[...root.firstBatch.ids,...root.secondBatch.ids];
const queue=fs.readFileSync('seer_id.txt','utf8').match(/\d+/g).map(Number);
assert.equal(new Set(ids).size,ids.length);
for(let i=1;i<ids.length;i++)assert.ok(queue.indexOf(ids[i])>queue.indexOf(ids[i-1]));
const accepted=[];
for(let b=0;b<batches.length;b++)for(const id of batches[b].accepted){
 const t=batches[b].targets.find(x=>x.id===id);assert.ok(ids.includes(id));assert.equal(t.status,'single-stage-complete');assert.equal(t.gate.exitCode,0);
 const log=fs.readFileSync(t.gate.log,'utf8');assert.ok(log.includes('completion gate: species '+id+' passed (single-stage)'),t.gate.log);
 const revalidations=['currentRuntimeRevalidation','runtimeRevalidation'].flatMap(k=>{const r=t[k];if(!r)return[];const p=r.log||r.gate;if(!p)return[];assert.equal(r.exitCode,0);assert.ok(fs.readFileSync(p,'utf8').includes('species '+id+' passed (single-stage)'));return[{path:p,exitCode:r.exitCode}];});
 accepted.push({id,batch:b+1,exitCode:t.gate.exitCode,gateLog:t.gate.log,gateLogSha256:crypto.createHash('sha256').update(log).digest('hex'),revalidations});
}
accepted.sort((a,b)=>queue.indexOf(a.id)-queue.indexOf(b.id));assert.equal(new Set(accepted.map(x=>x.id)).size,accepted.length);
const pending=batches.flatMap(x=>x.targets.filter(t=>t.processed&&t.status!=='single-stage-complete').map(t=>({id:t.id,status:t.status,questions:t.questions??[]})));
const result={auditedAt:new Date().toISOString(),scope:'3940至4068明确范围20只及其后原固定40只；历史目标重新认证不计数',stopAfterAccepted:30,acceptedCount:accepted.length,remaining:Math.max(0,30-accepted.length),accepted,excludedEarlierSix:[3886,3888,3896,3907,3924,3932],processedSecondBatch:batches[1].processed.length,explanation:'此前28为第二批已处理数，非本范围验收完成数。第一批19+第二批3=22。',pending,scanCurrent:batches[1].current,formalNext:4004,backgroundRunning:false};
fs.writeFileSync('research/CURRENT-BATCH-STOP30-AUDIT.json',JSON.stringify(result,null,2)+'\n');
root.stopCondition={userInstructionDate:'2026-10-20',acceptedLimit:30,scope:result.scope,acceptedIds:accepted.map(x=>x.id),acceptedCount:accepted.length,remaining:result.remaining,audit:'research/CURRENT-BATCH-STOP30-AUDIT.json',excludeHistoricalRecertifications:true,stopNewResearchWhenReached:true};
fs.writeFileSync(rootPath,JSON.stringify(root,null,2)+'\n');
const checkpoint=read('research/DEPLOY-3940-4068-CHECKPOINT.json');checkpoint.stopCondition=root.stopCondition;checkpoint.backgroundRunning=false;fs.writeFileSync('research/DEPLOY-3940-4068-CHECKPOINT.json',JSON.stringify(checkpoint,null,2)+'\n');
const marker='## 2026-10-20 用户调整：累计30只验收后停止';const progress=fs.readFileSync('PROGRESS.md','utf8');
if(!progress.includes(marker))fs.writeFileSync('PROGRESS.md',marker+'\n\n已按两批固定名单和逐只正式验收日志核实：第一批19只、第二批3只，合计22只（剩余8只），并非28只。此前28是第二批已处理数；历史六只3886、3888、3896、3907、3924、3932及历史重新认证均不计入本范围完成数。核实名单：'+accepted.map(x=>x.id).join('、')+'。完整日志路径、退出码和哈希见research/CURRENT-BATCH-STOP30-AUDIT.json。继续扫描位置4258；正式连续游标仍为4002/下一4004，待确认不越过。达到30只后停止新资料查询、实现和部署，仅做必要收尾与最终完整回归。\n\n'+progress);
console.log(JSON.stringify({accepted:accepted.map(x=>x.id),acceptedCount:accepted.length,remaining:result.remaining,next:result.scanCurrent,pending:pending.length}));
