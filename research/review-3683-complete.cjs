const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs');const saved=require('../local-species.cjs').save(require('./3683-reviewed-snapshot.json'));assert.equal(saved.saved,true);const s=saved.snapshot,reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));const file='tests/deployed-3683.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);const ref=(term,assertion)=>{const name=names.find(x=>x.includes(term));assert.ok(name,term);return {file,name,assertion};};const map={};
for(const [ids,term,...assertions]of [
[[4,5],'4和5有序','按真实实例改变指定能力','概率失败封招不变','正负六级截断','免弱阻止下降'],
[[1123],'1123吸强','吸强清除目标并提升自身，下回合先制+2','无强化与保护不登记先制','仅下一回合生效','禁强化阻止吸取'],
[[1038],'1038双倍','负2变正4并获得300或400护盾','无弱化不获得护盾','负4反转截断正6','封招保留原负等级'],
[[1367],'1367动态','抽取两种不同状态并施加','免疫全失败封属两回合','时长1至3且封属到期清理','封招不抽取'],
[[2352,1048],'2352异常','实际伤害按异常与版本增幅','无异常不触发异常增幅','过期异常不计入','免攻阻止攻击伤害'],
[[1257],'1257无异常','无异常吸取目标最大体力三分之一并回复','目标已有异常不吸取','回复不超过最大体力','百分比抗性与禁疗分别参与'],
[[2496],'2496零攻击','低体攻击零伤交换实际体力','正常伤害不交换','等体高体不交换，超上限截断','攻击免疫满足零伤，封招不执行命中效果'],
[[37,58],'37半血','低血威力提升；后续两回合暴击实伤翻倍','控制阻止登记，封招无伤害','半血及四分之一严格阈值、两回合到期','普通攻击享必暴'],
[[15,982],'15与982','随机成功施加害怕或疲惫阻止行动','种子覆盖概率失败','六种强化保证982触发','异常免疫拒绝施加'],
[[936,48,191],'936失明','失明成功，免异常及反弹真实生效','免疫拒绝失明触发封属；封招不登记','免疫三回合或反弹四回合到期','真实对手失明技能被免疫或反弹'],
[[867,1032,736],'867与1032','消回合或消强化成功封锁相应技能或降先制','无可消状态与保护不触发','下一回合到期清除','736当回合封属在行动后自然到期'],
[[585,433],'585与433','直接六能力+1或回合末攻击速度+1','禁强化拒绝增益','六级截断、两回合到期','回合末强化与用招直接强化独立'],
[[971],'971四回合','用招吸取实际体力并回复','禁疗不回复','半血严格边界与第五回合停止','百分比抗性减少吸取'],
[[521,583],'521弱化','反转负等级，随机一项PP清零','无弱化不变化，封招不清PP','负六变正六，PP全零不为负','已有正等级保持'],
[[683,843],'683追加','随机固定追加200至400，后续先制+2','封招不登记先制','随机区间与两回合先制到期','固定抗性减半实伤，低速者先行动'],
[[938],'938先后手','先手全属性-2后手-1','免弱拒绝下降','负六级截断','先后手影响实际等级'],
[[731],'731暴击','暴击登记，其他攻击双倍暴击伤害','未暴击不登记','同招不享有，回合结束过期','其他攻击使用消费次数'],
[[1751],'1751护盾','护盾400，破碎对手失血400及失明','未破碎不反应，封招不建盾','消耗至0触发一次','免异常拒绝失明但仍受到400固伤'],
[[2561],'2561携带','携带剥离混沌且首次入场封一次属性','目标控制中不封属','一次封属被消费，不重复每回合入场','属性剥离改变本系加成']
])for(const id of ids)map[id]={term,assertions};
for(const item of policy.inventory(s)){const r={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString()};if(item.kind==='move'){Object.assign(r,{rationale:'全部22招真实基础参数逐招核对，包括追加技能38526。',singleBehavior:item.raw.name+'的分类威力属性先制命中暴击PP',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础22招伤害','独立公式比对实际伤害与PP扣1')],failure:[ref('基础22招伤害','零PP拒绝、控制不行动、封招无伤害')],boundary:[ref('基础22招先制','低速先制与非必中低命中')],interaction:[ref('基础22招先制','各招本系属性和必暴实际伤害')]}});}else if(item.kind==='skill'){const m=map[item.raw.instance.id];assert.ok(m,item.key);Object.assign(r,{rationale:'当前双方可触发：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js','dist/status-rules.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map((k,i)=>[k,[ref(m.term,m.assertions[i])]]))});if(item.raw.instance.id===2561){Object.assign(r,{scope:'mixed',rationale:'战斗开始剥离自身属性与当前首次入场属于单精灵；之后再次登场依赖换宠。堕灵神谕完整定义由用户补充确认。',singleBehavior:'携带技能剥离混沌属性；初次入场目标无控制异常时封下一次属性；随机池含诅咒则改四诅咒池并增加一抽。',deferredBehavior:'之后每次登场时判断当前新对手控制状态并封其下一次属性技能。',trigger:'该精灵换宠后再次登场',futureMechanisms:['换宠流程','重复入场事件'],userConfirmedSource:'research/3683-user-confirmed-rules.json'});r.tests.interaction.push(ref('堕灵神谕替换','控制魂印抽2种诅咒，普通技能抽3种，池无诅咒不替换'));}if(item.raw.instance.id===1367)r.userConfirmedSource='research/3683-user-confirmed-rules.json';}else Object.assign(r,{scope:'mixed',rationale:'首次登场和伤害阈值均为当前双方分支；之后每次登场需要换宠。',singleBehavior:'首次控制池随机一异常；攻击>280随机普通异常；<280下回合攻击先制+1且必暴；等于280不触发。',deferredBehavior:'之后每次登场随机令对手进入一种异常状态。',trigger:'换宠后再次登场',futureMechanisms:['换宠流程','重复入场事件'],implementation:['dist/range-souls.js','dist/souls.js','dist/status-rules.js'],userConfirmedSource:'research/3683-user-confirmed-rules.json',tests:{success:[ref('968初次控制','实际控制阻止对手行动'),ref('968低伤','低伤次回合先手必暴，高伤随机异常')],failure:[ref('968初次控制','免疫拒绝初次异常'),ref('968攻击免疫','属性及控制未用招不奖励')],boundary:[ref('968低伤','实际攻击伤害恰280不触发两分支')],interaction:[ref('堕灵神谕替换','控制随机也被诅咒池替换并增加一抽'),ref('968攻击免疫','攻击免疫或封招零伤仍低伤奖励')]}});reviews.entries[item.key]=r;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3683-review-audit.json',JSON.stringify({status:'awaiting-independent-validation',...coverage},null,2)+'\n');console.log(coverage);
