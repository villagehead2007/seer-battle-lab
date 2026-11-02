'use strict';
const fs=require('fs'),crypto=require('crypto');
const at=new Date().toISOString(),file='research/BATCH-3940-4068-AND-NEXT40-QUESTIONS.md';
const answers={'Q-A60-4258-097':'都包括；当前hp只受新上限约束','Q-A60-4258-098':'按对手魂印中写有的免疫类型复制 ；保留；合计一架'};
const archive=`research/BATCH-3940-4068-AND-NEXT40-QUESTIONS.${at.replace(/[:.]/g,'-')}.before-4258-clarification-answers.archive.md`;
fs.copyFileSync(file,archive);let text=fs.readFileSync(file,'utf8');
const cf='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(cf));
for(const [id,answer]of Object.entries(answers)){
 const start=text.indexOf('## '+id);if(start<0)throw Error('missing '+id);
 const end=text.indexOf('\n## ',start+1),block=text.slice(start,end<0?undefined:end);
 if(!block.includes('我的回答：\n\n'))throw Error('answer already present '+id);
 const updated=block.replace('我的回答：\n\n','我的回答：'+answer+'\n\n').replace('处理状态：新增待澄清；继续当前精灵独立工作，不验收、不跳下一只。','处理状态：用户已明确回答；待实现和整体验收，不提前计为完成。');
 text=text.slice(0,start)+updated+(end<0?'':text.slice(end));
 const q=c.confirmations.find(q=>q.questionId===id);if(!q)throw Error('missing confirmation');
 Object.assign(q,{sourceType:'human-reply',status:'answered-awaiting-implementation',answerLines:[answer],verbatimAnswer:answer,answeredAt:at,humanReplyRequestId:'call_0239f78056b64bff9184d3f5571df693',scope:{speciesId:4258,soulmarkId:2139,soulmarkHash:'f102f34c'},archiveBeforeAnswer:archive,archiveBeforeAnswerSha256:crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex')});
}
fs.writeFileSync(file,text);const answeredArchive=`research/BATCH-3940-4068-AND-NEXT40-QUESTIONS.${at.replace(/[:.]/g,'-')}.4258-clarification-answers.archive.md`;fs.copyFileSync(file,answeredArchive);
for(const q of c.confirmations.filter(q=>answers[q.questionId]))Object.assign(q,{answeredArchive,answeredArchiveSha256:crypto.createHash('sha256').update(fs.readFileSync(answeredArchive)).digest('hex')});
c.implementation.pendingQuestions=(c.implementation.pendingQuestions??[]).filter(id=>!answers[id]);fs.writeFileSync(cf,JSON.stringify(c,null,2)+'\n');
for(const path of ['research/ANSWER-IMPLEMENTATION-CHECKPOINT.json','research/BATCH-3940-4068-AND-NEXT40-STATUS.json']){const obj=JSON.parse(fs.readFileSync(path));if(path.includes('CHECKPOINT'))Object.assign(obj,{at,phase:'4258-implementing-confirmed-executor-stats-and-immunity-copy',pendingQuestions:[],formalDeployed:false,currentFullNpmRun:false,backgroundRunning:false});else if(obj.answerImplementation)obj.answerImplementation.pendingClarifications=[];fs.writeFileSync(path,JSON.stringify(obj,null,2)+'\n');}
console.log(JSON.stringify({answered:Object.keys(answers),archive:answeredArchive}));
