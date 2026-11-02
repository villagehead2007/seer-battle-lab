'use strict';
const fs=require('fs'),assert=require('assert/strict'),P=require('../completion-policy.cjs');const result=require('../local-species.cjs').save(require('./3699-reviewed-snapshot.json'));assert.equal(result.saved,true);const s=result.snapshot,r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),file='tests/deployed-3699.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]),ref=(term,assertion)=>{const name=names.find(n=>n.includes(term));assert.ok(name,term);return {file,name,assertion};},map={};
for(const [ids,term,...a]of [
[[4,5],'4和5有序','真实指定能力增减','概率失败或封招不改变','正负6截断','免弱拒绝下降'],
[[14],'14冻伤','冻伤导致实际HP下降','概率失败或免疫不附加','100%与10%实例分别检查','冻伤伤害区别攻击伤害'],
[[49],'49定额','50点护盾真实抵挡','封招无盾','不足50余量保留','共享攻击护盾消费'],
[[36,1374],'36与1374','命中实际秒杀','封招控制不自死不秒杀','未命中自身HP归零','消除回合且冰封转冻伤，次数免疫拒绝'],
[[194,101],'194与101','实际伤害按1/6或50%回血','禁疗免攻无回血','满血截断','冻伤1/3麻痹仍1/6'],
[[152],'152对手','对手属性后冻伤造成1125伤害','攻击或免异常无冻伤','第五回合结束到期','使用技能后施加且公共状态结算'],
[[195],'195无视','正特防6无减伤','攻击免疫无伤害','负特防仍提高伤害','同随机对照防御计算'],
[[1055,1056],'1055消强','清正强化与负能力反转','保护或无状态不封招','反转负6到正6，封攻仅下一回合','封属当前回合与封攻下回合真实行动'],
[[191,889],'191反弹','免疫反弹冻伤造成对手HP减少或消回合冰封','保护或空状态不冰封','反弹4回合后到期','公共异常转换和回合效果清除'],
[[1023],'1023概率','70%闪避并回复3000','未闪避仍受攻击，禁疗无回复','三回合结束到期','必中不闪避，强制MISS回复'],
[[585,433,843],'585直接','直接六项+1，持续特攻速度+1或先制+2','禁强化拒绝','能力6封顶与2回合到期','先制改变真实先后手'],
[[717],'717用招','吸取3000低体回血6000','禁疗或百分比免疫拒绝','半血4500不翻倍，四回合到期','魂印粉伤免疫与低体回复'],
[[1003,1107],'1003冰封','冰封阻止行动或随机强化弱化','概率失败分支、禁强免弱','独立概率可同时触发或均失败','免冰封转全属性降级，击败不强化'],
[[1373],'1373冰系','260乘冰克制倍率','封招与攻击免疫零伤害','正能力种数非等级，负能力不计','无本系暴击，特防强化不影响'],
[[1375],'1375下两','下一回合实际暴击与附加150至300固伤','封招无附加或粉伤免疫拒绝','只下两回合，不含当前，到期无附加','随机固定伤害实际HP变化与暴击攻击伤害分开']
])for(const id of ids)map[id]={term,a};
for(const item of P.inventory(s)){const v={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString()};if(item.kind==='move')Object.assign(v,{rationale:'28招全部当前双方执行，真实宠物来源没有伙伴追加或觉醒版本。',singleBehavior:item.raw.name+'威力PP先制命中暴击属性基础行为',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础28招伤害','逐招实际伤害计算与PP扣1')],failure:[ref('基础28招伤害','零PP拒绝控制不行动封招无伤害')],boundary:[ref('基础28招先制','真实先制与命中失败')],interaction:[ref('基础28招先制','属性克制本系暴击')]}});else if(item.kind==='skill'){const m=map[item.raw.instance.id];assert.ok(m,item.key);Object.assign(v,{rationale:'当前双方触发，原文：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map((k,i)=>[k,[ref(m.term,m.a[i])]]))});if(item.raw.instance.id===1373)v.tests.interaction.push(ref('1373共享','攻击减半上限次数免疫和护盾，粉伤免疫不拒绝'));if(item.raw.instance.id===1374)Object.assign(v,{scope:'mixed',rationale:'未命中自死、消回合、冰封对当前对手即刻成立；下一只出场祝福明确依赖下一精灵。',singleBehavior:'命中100%秒杀；MISS自身体力归零、消对手回合并100%冰封。',deferredBehavior:'MISS后令我方下一只出场精灵3回合获得冰之祝福。',trigger:'技能MISS且我方下一只精灵出场',futureMechanisms:['下一只精灵入场','跨精灵传递三回合冰之祝福'],dependencyEvidence:[{kind:'next-entry',quote:'我方下一只出场精灵3回合内获得冰之祝福效果'}]});}else Object.assign(v,{rationale:'登场减伤及自身攻击全部当前双方可触发；冰之祝福具体由1375授予，名称相同的21668不自动授予。格式化说明限定攻击固定减伤；用户确认概率和保底时限。',singleBehavior:'首回合攻击固定减伤20%，逐回合+10%上限50%；攻击忽略正特防，50%倍伤失败只下回合100%。祝福为50%暴击与攻击附加150至300固伤。',implementation:['dist/range-souls.js','dist/souls.js'],tests:{success:[ref('魂印978递增','首至第五回合实伤减免且自身输出正常'),ref('1375下两','祝福实际暴击和附加固伤')],failure:[ref('魂印978忽略','物防强化仍减伤，保底过期重新概率')],boundary:[ref('魂印978递增','50%封顶且百分比不减'),ref('魂印978忽略','保底仅下回合')],interaction:[ref('魂印978忽略','忽略特防但保留物防'),ref('1375下两','粉伤免疫阻止附加')]}});r.entries[item.key]=v;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');const coverage=P.reviewCoverage(s,r);fs.writeFileSync('research/3699-review-audit.json',JSON.stringify({status:'awaiting-independent-validation',...coverage,failureHistory:[{reason:'初稿49点数护盾仅写入未消费guard',resolution:'改用已有公共shield路径，不新建护盾系统'},{reason:'初稿检查回合末已解除/转化的冻伤冰封、错误禁疗键',resolution:'保留HP/能力/控制状态断言，按真实公共状态生命周期和技能禁疗名称修正夹具'}]},null,2)+'\n');console.log(coverage);
