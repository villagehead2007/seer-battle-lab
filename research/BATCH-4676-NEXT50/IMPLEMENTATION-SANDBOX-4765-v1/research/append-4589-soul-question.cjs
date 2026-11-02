'use strict';
const fs=require('fs'),assert=require('assert/strict');
const audit=JSON.parse(fs.readFileSync('research/parallel-drafts/next50-4589-soul/source-audit.json'));
const src=audit.souls.find(r=>r.data.id===1864),q=audit.questions;
const file='research/BATCH-4509-NEXT50-QUESTIONS.md',before=fs.readFileSync(file);
const body='\n\n## Q-N50-4589-001 · 曜焰万象·文森特强化魂印1864：低体抵挡后的回复基数与时点\n\n'+
'版本及效果实例：1864/4ba357b8，eid2259/cea4b2f0，参数[1,1,200,1]。原版1797无此回复分支。来源 '+src.url+'；完整原始字段（保留原文与格式化）：\n\n```json\n'+JSON.stringify(src.data,null,2)+'\n```\n\n'+
'原始返回SHA256：'+src.rawDataSha256+'。已查research/4589-source-check.json、4589-source-supplement.json、官方魂印格式字段说明及既有冻结确认；eid接口只有参数数量，Wiki魂印1864 revision320399同文，未解释被抵挡伤害的回复基数。完整结算伤害/实际HP损失、固定吸取理论回复旧全局确认均未定义本条抵挡前的伤害量。\n\n'+
'具体缺口及差异：自身烧伤且HP低于对手时，攻击被抵挡，结算后伤害为0；若按抵挡后的完整结算伤害回复则为0，若按抵挡前经防御等处理的伤害回复则可为正数，HP比较在攻击前或抵挡结算后也可能不同。当前已完成抵挡及明确输入回复载荷的禁疗/倍率/上限状态验证，不将未知基数默认为理论伤害。\n\n'+
'明确问题：1864自身烧伤且体力低于对手时，回复采用抵挡前还是抵挡后的哪一项伤害量，低体比较与回复分别在什么时候判定？\n\n我的回答：\n';
assert.ok(q.some(x=>x.id==='Q-N50-4589-001'));
fs.appendFileSync(file,body);assert.ok(fs.readFileSync(file).subarray(0,before.length).equals(before));
console.log('appended Q-N50-4589-001; existing answer bytes preserved');
