'use strict';
const fs=require('fs'),doc='research/BATCH-3940-4068-AND-NEXT40-QUESTIONS.md',id='Q-A60-4169-094';
const section=`## ${id} · 命轮无常1644：当前攻击与新附印记的生效时点（实现时新增）

040“给对手附加”已经明确，本项不重复询问对象。技能27453/e94bfa2f，效果1644/6545e287，实例2/[4,2,1]。
原文：4回合内对手使用攻击技能时随机附加2种异常状态，未触发则随机为对手任意技能散布1枚致命印记。
已核对research/4169-source-check.json中API原始info/analyze/格式化；定向复查BWIKI技能27453 revision305838、效果1644 revision344102及命轮无常全量搜索6个页面，仍只写“对手使用攻击技能时”。证据research/4169-1644-timing-source-check.json；未找到明确的前后时点或本次是否受控中断说明。
具体缺口：随机异常及失败印记在本次攻击伤害前，还是整招结束后结算？若在伤害前，控制是否挡住已经算使用的这次攻击？新印记落在正在使用的技能上，是否本次就生效并消耗？这会改变本次是否造成攻击伤害、3枚命中附效失效及用后真伤。
可选：A 已算用招后、伤害前；控制能挡本次，新印记本次生效消耗。B 已算用招后、伤害前；控制不挡本次，新印记本次生效消耗。C 整招结束后；新异常和新印记只影响以后用招。也可写其他明确时序。
当前只阻塞1644时序及该技能/整只验收；散布算法、其他已答技能和魂印独立工作继续，不推进4169之后的目标。

我的回答：
`;
let text=fs.readFileSync(doc,'utf8');if(!text.includes('## '+id+' ')){fs.appendFileSync(doc,'\n'+section);text=fs.readFileSync(doc,'utf8');}
const file='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(file));
if(!c.confirmations.some(q=>q.questionId===id))c.confirmations.push({questionId:id,primarySpeciesId:4169,heading:section.split('\n')[0],originalSection:section,status:'awaiting-user-clarification',answerVerbatim:null,answerLines:[],sourceType:'new-implementation-question-not-an-answer',source:{skillId:27453,skillHash:'e94bfa2f',effectId:1644,effectHash:'6545e287',index:2,args:[4,2,1]},evidence:'research/4169-1644-timing-source-check.json'});
c.implementation.current=4169;c.implementation.pendingNewQuestions=[...new Set([...(c.implementation.pendingNewQuestions??[]),id])];c.implementation.lastOperation='4169原039/040/027关联已答，新094仅1644时序待人类补充；独立分支继续，不允许验收或跳到4182。';fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');
console.log(JSON.stringify({pending:id,current:4169,originalAnswersPreserved:true}));
