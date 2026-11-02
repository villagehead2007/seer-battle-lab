'use strict';const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),j=p=>JSON.parse(fs.readFileSync(p)),source=j('research/4604-source-check.json');
const qs=[...j('research/parallel-drafts/next50-4604-soul/questions.draft.json').questions,...j('research/parallel-drafts/next50-4604-skills/questions.draft.json')].sort((a,b)=>a.id.localeCompare(b.id));let body='';for(const q of qs){assert.ok(q.question&&q.gap);body+='\n\n## '+q.id+' · 萨芙凯特4604 · '+(q.title??q.gap)+'\n\n完整来源、原始参数、版本、URL/hash、已查资料与已有确认，以及不同解释的实际差异（以下草稿经主代理核对）：\n\n```json\n'+JSON.stringify(q,null,2)+'\n```\n\n明确问题：'+q.question+'\n\n我的回答：\n';}
const associations=[
['Q-N50-4600-001',37124,1767,'当前实例[0]，模板argsNum=0；新鲜SeerAPI仍矛盾，原值保留，不扩用旧4468特例。'],
['Q-N50-4589-002',28597,849,'[3,3]新来源的伤害前时点与双端联动；明确双端吸取载荷完成，未猜自然时点。'],
['Q-N50-4511-002',28599,1232,'自身负能力反转与敌负能力附加的保护/反制交互，普通明确反转完成。'],
['Q-N50-4511-006',37110,928,'清回合实际成功后获得2次免异；真实混源消费待确认，单源和授予成功/失败已测。'],
['Q-N50-4511-006',28598,1687,'4回合反弹与2112永久免控/次数免异的真实混源；纯永久免控加普通免异常无反弹无次数消费不列为疑问，已主线测试。'],
['Q-N50-4600-003',28599,1892,'4回合实际used监听，300/低体600理论吸取；未受固定伤害250真伤的本次/本回合统计窗口待答。'],
['Q-N50-4589-004',28599,1892,'此前授予载荷在后续用招后击败敌人时的KO奖励时点；普通吸取明确分支完成。'],
['Q-N50-4586-006',37114,2115,'水次元独立属性伤害通道；明确typed输入载荷经过真实免疫/减伤，不宣称自然通道已确认。'],
['Q-N50-4521-001',28597,559,'559若在攻击伤害前随机附加睡眠/害怕，当前已用攻击是否中断，关联原公共问题，不重复新增。']
];
for(const [id,mid,eid,note]of associations){const skill=source.records.find(r=>r.url.endsWith('/skill/'+mid)),effect=source.records.find(r=>r.url.endsWith('/skill_effect_type/'+eid));assert.ok(skill&&effect);body+='\n\n### '+id+' 新关联 · 4604/'+mid+'/'+eid+'\n\n'+note+'\n\n完整关联来源及参数：\n\n```json\n'+JSON.stringify([skill,effect].map(r=>({...r,rawDataSha256:crypto.createHash('sha256').update(JSON.stringify(r.data)).digest('hex')})),null,2)+'\n```\n';}
const p='research/BATCH-4509-NEXT50-QUESTIONS.md',before=fs.readFileSync(p);fs.appendFileSync(p,body);assert.ok(fs.readFileSync(p).subarray(0,before.length).equals(before));fs.writeFileSync('research/4604-question-append-evidence.json',JSON.stringify({at:new Date().toISOString(),questions:qs.map(q=>q.id),associations:associations.map(([questionId,moveId,effectId])=>({questionId,moveId,effectId})),oldPrefixBytes:before.length,oldPrefixSha256:crypto.createHash('sha256').update(before).digest('hex'),newAnswers:'未读取解释落实；原字节前缀保留'},null,2)+'\n');console.log('8 new questions and 9 shared associations appended; old answer bytes preserved');
