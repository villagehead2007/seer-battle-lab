'use strict';
const fs=require('fs'),assert=require('assert/strict'),P=require('../completion-policy.cjs');const saved=require('../local-species.cjs').save(require('./3686-reviewed-snapshot.json'));assert.equal(saved.saved,true);const s=saved.snapshot,reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),file='tests/deployed-3686.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);const ref=(term,assertion)=>{const name=names.find(x=>x.includes(term));assert.ok(name,term);return {file,name,assertion};};const map={};
for(const [ids,term,...a]of [
[[4,5],'4和5有序','实例能力按真实参数变化','概率或封招不改变','正负六级截断','免弱拒绝下降'],
[[740],'740回合末','回合末反馈并清弱','免弱时对手不下降但自身清除','三回合后到期','正等级保留，封招不授予效果'],
[[729],'729高伤','高伤实际控制阻止对手行动','低伤或概率失败不控制','两回合到期，300严格大于另有专项','免异常拒绝控制'],
[[1074],'1074高伤','高伤控制成功，低伤登记后续异常','免疫失败也登记补偿','下2/3回合有效，280严格大于另有专项','后续普通攻击真实控制'],
[[2385],'2385吸强','吸强成功加一次免疫；无强化消回合','无强化不授予免疫','次数精确为1','强化保护拒绝吸取，回合保护阻止消除'],
[[2387],'2387按对手','目标HP每2%加1%威力按独立计算比对','攻击免疫伤害为0','1/179/180/8999/9000体力边界','体力变化改变真实攻击伤害'],
[[2386],'2386伤后','伤后吸取2250并回复','护罩阻挡吸取不误判免疫','回复上限9000','真实粉伤免疫时本次攻击翻倍；禁疗拒绝回复'],
[[77,57],'77和57','施放及后续用招回复200或3000','禁疗不回复','满体封顶和到期不回复','换用属性招同样触发'],
[[585,433],'585有序','指定能力直接或回合末增长','禁强化不增长','正6截断和3回合到期','重复实例参数分别核对'],
[[440],'440双倍','当回合对手PP扣2或3','封招不登记PP倍增','不足只扣至0，3回合后正常','换招后持续消费倍增'],
[[3,63,143],'3清弱','清弱、反馈或反转真实等级','空等级不产生变化，封招保持原状态','正负6反转边界','免弱不反馈但仍清除自身负等级'],
[[775,1073],'775与1073','受到高伤回满，1073反击实际回复量','低伤不回满，禁疗阻止','致死不复活，持续到期','回复量含原已损体力，反击为固定伤害'],
[[694,81,58,843],'694攻击','低速先手、必中与必暴实际伤害','控制未用招不授予','下两回合起止2/3','普通攻击同享先制命中暴击'],
[[48,191],'48免异常','真实恐惧被免疫或反弹','封招不授予','四回合到期','先建立免疫后对抗先制攻击'],
[[683,450,1144],'683随机','固伤回复或吸取在各真实范围','禁疗不回复','多个随机值与满体上限','固定抗性减半，吸取按实际伤害回复'],
[[951,1159],'951反转','反转或吸强成功加一次免疫','无强化与封招不奖励','一次免疫消费到0','真实对手恐惧攻击被免疫'],
[[677],'677持续','后续用招实际吸强','保护阻止吸强','三回合到期','换招仍能吸取'],
[[971],'971低体','低于半血双吸并回血','禁疗不回复','半血严格边界，第5回合停止','低体吸取6000且回复封顶'],
[[877,1283],'877先手','先手奖励或强化翻倍','后手不触发先手增益','六级封顶','禁强化阻止所有增长'],
[[925],'925满体','满体威力翻倍真实伤害','低1HP不翻倍','8999与9000边界','免攻仍无伤害'],
[[478,1208],'478封属','封属真实强化失效，反转后下一次攻击无效','无弱化不封攻，封招不封属','两回合封属到期，封攻一次消费','下次攻击恢复伤害'],
[[1138,897],'1138消回合','消回合控制行动，未击败获得减伤','次数免疫拒绝控制，保护拒绝消回合','减伤一次消费，击败无奖励','下一回合与同随机序列对照无减伤']
])for(const id of ids)map[id]={term,a};
for(const item of P.inventory(s)){const r={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString()};if(item.kind==='move')Object.assign(r,{rationale:'26招真实参数，包括激活道具追加技能38232，均属于当前自身技能。',singleBehavior:item.raw.name+'基础威力分类命中暴击先制属性和PP',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础26招伤害','逐招独立公式比对伤害与PP消费')],failure:[ref('基础26招伤害','零PP拒绝，控制不行动，封招无伤害')],boundary:[ref('基础26招先制','低速先制判断，非必中低命中失败')],interaction:[ref('基础26招先制','属性本系和暴击参与实伤')]}});else if(item.kind==='soul')Object.assign(r,{rationale:'四段魂印均作用当前双方，即使粉伤击败对手后的清回合也不依赖下一只。',singleBehavior:'特攻必中并回复攻击伤害50%；先手增伤50%低体时100%；对手出手前低体全属性+1；对手先手先扣其最大HP1/3，归零则清回合封本回合技能。',implementation:['dist/range-souls.js','dist/souls.js'],userConfirmedSource:'research/3686-user-confirmed-rules.json',tests:{success:[ref('魂印969先手','先手1.5/2倍实际伤害、特攻必中回复'),ref('魂印969对手','双方先后手低体均强化；先手对手失血3000')],failure:[ref('魂印969先手','物攻不回复，攻击免疫零伤不回复')],boundary:[ref('魂印969对手','等体不强化，恰3000HP归零清回合停止攻击')],interaction:[ref('魂印969对手','禁强化拒绝增长，百分比免疫不失血')]}});else if(item.raw.instance.id===698)Object.assign(r,{scope:'multiplayer',rationale:'原文明示击败后对方下只精灵出战触发，依赖下一只入场。',deferredBehavior:item.raw.instance.description,trigger:'本回合击败当前对手后，下一只对手出战',futureMechanisms:['下一只精灵出场','换宠流程'],dependencyEvidence:[{kind:'next-entry',quote:'对方下只精灵出战时'}]});else{const m=map[item.raw.instance.id];assert.ok(m,item.key);Object.assign(r,{rationale:'当前双方独立触发：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map((k,i)=>[k,[ref(m.term,m.a[i])]]))});if([740,2386].includes(item.raw.instance.id))r.userConfirmedSource='research/3686-user-confirmed-rules.json';if([729,1074].includes(item.raw.instance.id))r.tests.boundary.push(ref('高伤条件恰好','攻击实际300或280不触发严格大于分支'));}reviews.entries[item.key]=r;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=P.reviewCoverage(s,reviews);fs.writeFileSync('research/3686-review-audit.json',JSON.stringify({status:'awaiting-independent-validation',...coverage},null,2)+'\n');console.log(coverage);
