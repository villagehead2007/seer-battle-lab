'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3673.json').snapshot,reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const file='tests/deployed-3673.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);const ref=(term,assertion)=>{const name=names.find(x=>x.includes(term));assert.ok(name,term);return {file,name,assertion};};
const map={};for(const [ids,term,success,failure,boundary,interaction]of [
 [[4,5],'4和5有序','各真实实例指定能力按参数变化','封招不改变等级','正负六级饱和','免弱拒绝敌方下降'],
 [[1359],'1359反馈','下降反馈对手成功，自身原下降清零后六项+1','对手免弱反馈失败，自身仍清弱不强化；无负能力不强化','对手负6反馈不再下降时不奖励','禁强化阻止奖励，封招保留自身下降'],
 [[1235],'1235闪避','80%闪避成功实际无伤害；失败真实清2项PP','属性技能不触发，封招不登记','三回合窗口第四回合到期','必中无法闪避但仍清2项PP（用户确认）'],
 [[529],'529交换','不同最大体力以攻击后比例交换得到实际HP','封招不交换，击败对手不交换','体力比例按实际最大体力截断到整数','禁疗及护罩不阻止比例直接交换'],
 [[1365],'1365睡眠概率','低HP提高睡眠率，成功对手无法行动不扣PP','同种子满HP失败而低HP成功；免疫拒绝睡眠','损失不足20%不提前提升','命中后施加睡眠阻止对手本回合行动'],
 [[1163],'1163累计','真实粉伤由特攻加速度按20%30%40%计算','封招本次无伤害但保留已使用次数','第四次仍40%封顶','强化特攻速度影响粉伤，百分比抗性50%减半'],
 [[58,40],'58下两','58下两回合双倍暴击实伤，40先手双威力','封招不登记必暴，40后手不翻倍','下2/3回合有效，第4回合伤害恢复','换用普通攻击享必暴，威力翻倍不等同最终伤害固定倍数'],
 [[795],'795每次','每次使用增伤25%直到100%实伤递增','封招本次无伤害仍记使用','第五次仍100%封顶','换招不继承当回合已到期增伤'],
 [[450,656],'450随机','150至300真实回复；概率成功随机三项PP归零','概率失败PP不清，禁疗不回，封招不清PP','8999回复封顶，随机区间多种取值','技能回复经过公共禁疗'],
 [[191,1322],'191反弹','睡眠真实反弹；受击睡眠成功控制攻击者','免异常时睡眠失败转全属性-1；属性行动不触发受击反应','反弹四回合，受击反应三回合','同时免弱时失败补偿也不能降级'],
 [[1283,843],'1283先手','先手六能力+2后手+1，先制使低速者后续先行动','禁强化拒绝增益，封招不授予先制','六级封顶，先制仅2/3回合','属性技能同样享有先制'],
 [[971],'971四回','用招后实际吸取3000，低于半血6000并回血','封招不登记，禁疗阻止自身回复','4499翻倍4500不翻倍，第四回合有效第五回合停止','对手仅20HP时仅回复实际吸取20'],
 [[697,699],'697忽略','攻击穿过上限1或攻击免疫造成实际伤害','封招仍不造成伤害','对照普通攻击分别只有1或0伤害','净灵咒完整词条同时绕过两种保护'],
 [[180,928],'180消回合','消除doubleDamage，928成功获得一次异常免疫','无效果928不奖励；保护阻止消除','一次免疫被真实睡眠消费到0','真实对手技能睡眠被拒绝但消费次数'],
 [[679],'679两回','目标真实回血技能不能回复HP','封招不登记禁疗','第二回合仍不能回复，第三回合恢复','血药仍实际恢复250，禁疗限自身技能'],
 [[749],'749概率','50%全属性下降实际生效','种子覆盖概率失败不下降','负六级截断','免弱拒绝负等级']
])for(const id of ids)map[id]={term,success,failure,boundary,interaction};
for(const item of policy.inventory(s)){
 const r={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString()};
 if(item.kind==='skill'){const id=item.raw.instance.id,m=map[id];assert.ok(m,'unmapped '+id);Object.assign(r,{rationale:'当前在场双方可独立触发：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,[ref(m.term,m[k])]]))});if([1359,1235].includes(id))r.userConfirmedSource='research/3673-user-confirmed-rules.json';if(id===1365)r.tests.boundary=[ref('1365恰好','7201未跨损失20%门槛，7200恰好跨过；7199相同概率层，真实睡眠是否阻止行动对比')];}
 else if(item.kind==='move')Object.assign(r,{rationale:'真实17招基础行为全部在当前精灵与当前对手间结算，没有队伍前提。',singleBehavior:item.raw.name+'的真实分类、威力、先制、命中、暴击、PP和属性',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础17招伤害','逐招PP扣1，实伤独立按原威力、本系、属性和浮动算例比较')],failure:[ref('基础17招伤害','零PP拒绝、控制不行动不扣PP、封招不伤害')],boundary:[ref('基础17招先制','低速先制决定先后，非必中低命中出现miss')],interaction:[ref('基础17招先制','各攻击必暴双倍、真实属性和本系加成')]}});
 else Object.assign(r,{rationale:'三段魂印均只影响当前双方，包括倒下后清除当前对手状态，不依赖下一只精灵。',singleBehavior:'先手攻击增伤50%后手受攻击减伤50%；回合初有强化消强成功睡眠，无强化先制+1；阶段结束自身0HP时消除当前对手回合效果及强化，任一成功睡眠。',implementation:['dist/range-souls.js','dist/souls.js'],tests:{success:[ref('魂印959先手','先手增伤后手减伤的实际HP/伤害，消强成功睡眠阻止行动'),ref('魂印959倒下阶段','倒下后仍清回合并施加睡眠')],failure:[ref('魂印959先手','强化保护阻止消强且不获得无强化先制，免异常拒绝睡眠'),ref('魂印959倒下阶段','双保护时两项均失败不睡眠，自身存活不触发死亡分支')],boundary:[ref('魂印959倒下阶段','1HP受到攻击倒下并确认战斗结束仍执行阶段结束分支'),ref('魂印959倒下后仅','仅消强化成功也睡眠；回合效果仍受保护不消除')],interaction:[ref('魂印959倒下后仅','对手攻击后自身命中提升被死亡魂印消除，免异常拒绝睡眠但仍消强化')]}});
 reviews.entries[item.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const cov=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3673-review-audit.json',JSON.stringify({status:'awaiting-independent-validation',...cov},null,2)+'\n');console.log(cov);
