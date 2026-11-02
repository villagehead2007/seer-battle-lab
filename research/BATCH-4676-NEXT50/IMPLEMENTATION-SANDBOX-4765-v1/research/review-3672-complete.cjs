'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3672.json').snapshot,reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const file='tests/deployed-3672.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const ref=(term,assertion)=>{const name=names.find(x=>x.includes(term));assert.ok(name,term);return {file,name,assertion};};
const map={};for(const [ids,term,success,failure,boundary,interaction]of [
 [[4,5],'4和5有序','指定能力按真实参数变化','概率失败不变化；封招不变化','正负六级截断','免弱拒绝对手下降'],
 [[1354],'1354吸强','对手攻击+2转移给自身并实际吸取300HP','无强化全属性-1；保护导致吸取失败不回血','自身+6不溢出，8999回血封顶9000','禁疗保留敌方扣血但自身不回'],
 [[938],'938先手','先手全能力-2，后手-1','封招不下降','负6不越界','免弱拒绝所有下降'],
 [[1290],'1290按实际','低于半血回复至满并粉伤等于实际回复量','封招或禁疗不回不追加','4499触发而4500不触发；8999只回1','百分比抗性50%实际减少追加粉伤，固定抗性0不混用'],
 [[1364],'1364六状态','六个指定状态两种不重复，非控制实际回合扣血','免疫后无异常并进入封属补偿；封招无抽取','持续1至3，补偿封属两回合到期','反弹给来源时对手无控制，仍封属补偿'],
 [[29,30],'29固定','29追加20固伤，30后手双威力提高实伤','30先手不提高，封招无伤害','先后分支独立算例','护罩30消费20剩10'],
 [[749],'749概率','25%成功对手六能力-1','种子覆盖失败不降级','负6饱和','免弱拒绝下降'],
 [[776,843],'776次两','776后续实际攻击翻倍，843使低速者先行动','施放回合不授予次回合收益，封招不登记','第二第三回合有效，第四回合恢复','843属性技能同样享有先制'],
 [[962],'962无正','无强化六能力+2，已有强化+1','禁强化拒绝变化','六级上限不越界','已有攻击强化改变其余能力提升量'],
 [[677],'677持续','用招后真实转移对手能力等级','没有强化不改变，封招不登记','施放至第三回合有效，第四回合不吸取','强化保护阻止吸取'],
 [[811],'811按本','按本回合实伤登记抵挡下一次真实受伤','封招零伤害不登记','下一击抵挡上限不产生负伤害，仅消费一次','下次受击后再受攻击正常扣血'],
 [[47,191],'47免弱','真实命中下降被拒绝，真实随机异常被反弹','封招不授予免疫','四回合有效第五回合命中下降','与飞泥及1364真实技能交互'],
 [[663,738],'663受攻','攻击后疲惫生效，属性后下两回合攻击无效','属性不触发663，免异常拒绝疲惫，封招不登记','三回合触发窗口到期，封攻起止2至3','已封锁攻击不扣HP；之后攻击恢复'],
 [[1154],'1154三回','使用技能实际扣200，低血扣400','疲惫未行动不追加，封招不登记','含施放共三回合，第四回合不扣血','护罩250抵挡200剩50'],
 [[1114],'两第五1114','消回合成功分别随机清2或3技能PP','无回合效果不清，保护阻止清除','仅一槽有PP时不越界','保留两个第五各自真实实例数量'],
 [[833,1709],'833与1709','按对手最大体力扣3000并回复3000','封招不执行，禁疗不回复','8999回复封顶；1709追加击败不回血','833吸取致死仍回实际扣血，1709未击败条件有区别'],
 [[939],'939后手','后手以自身9000/3吸取3000','先手不触发，封招不执行','8999回复不超9000','禁疗不阻止敌方粉伤但不回血']
])for(const id of ids)map[id]={term,success,failure,boundary,interaction};
for(const item of policy.inventory(s)){
 let r={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString()};
 if(item.kind==='skill'){
 const id=item.raw.instance.id;
 if(id===840){Object.assign(r,{scope:'multiplayer',rationale:'原文明确击败对手后由对方下只精灵出场触发，当前对手不再属于目标。',deferredBehavior:item.raw.instance.description,trigger:'击败对手后下一只对方精灵出场',futureMechanisms:['替补队伍','下一只精灵入场','入场吸取与当前己方接收者']});}
 else{const m=map[id];assert.ok(m,'unmapped '+id);Object.assign(r,{rationale:'当前在场双方可触发：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js',...(id===1364?['dist/status-pools.js','dist/status-rules.js']:[])],tests:Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,[ref(m.term,m[k])]]))});if(id===1290){r.rationale+='；用户明确百分比伤害、实际回复量。';r.userConfirmedSource='research/3672-user-confirmed-rules.json';}if(id===1364)r.tests.interaction.push(ref('1364控制真实','真实控制阻止行动且不扣PP，自然过期后解除；191反弹实际施加于攻击者'));}
 }else if(item.kind==='move'){Object.assign(r,{rationale:'保留真实基础行为，追加技能37297按自有激活技能处理，不延期。',singleBehavior:item.raw.name+'真实分类、威力、命中、先制、PP和暴击',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础18招伤害','逐招PP减1、实际伤害由威力属性本系浮动独立计算')],failure:[ref('基础18招伤害','零PP拒绝、控制不行动不扣PP、封招不伤害')],boundary:[ref('基础18招先制','低速真实先制顺序、非必中负命中导致未命中')],interaction:[ref('基础18招先制','每个攻击必暴伤害双倍，属性本系按来源计算')]}});
 }else{Object.assign(r,{scope:'mixed',rationale:'初始入场观察当前对手及自身使用技能叠层为单精灵；再次登场和下场保留依赖换宠。',singleBehavior:'入场当前回合观察对手使用类别，下一回合封锁另一类；每使用攻击增伤40%封顶120%，属性减伤20%封顶60%，只作用攻击伤害。',implementation:['dist/range-souls.js','dist/souls.js'],tests:{success:[ref('魂印957攻击','当前使用即获得增伤与减伤，逐层真实伤害变化'),ref('魂印957入场','观察对手实际类别，下一回合封锁攻击或属性，真实HP和能力不变化')],failure:[ref('魂印957攻击','疲惫未使用不增加层数，封招已使用增加层数但无伤害'),ref('魂印957入场','对手控制未使用不授予封锁')],boundary:[ref('魂印957攻击','第四次使用仍三层，120%与60%封顶'),ref('魂印957入场','封锁仅第二回合，第三回合恢复且不重复触发')],interaction:[ref('魂印957攻击','技能29额外固伤仍20，不受魂印攻击增伤影响')]},deferredBehavior:'再次登场重新触发当回合观察；攻击增伤和攻击减伤层数下场后保留',trigger:'本精灵离场或再次登场',futureMechanisms:['换宠事件','离场层数持久化','再次入场回合标记']});}
 reviews.entries[item.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const cov=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3672-review-audit.json',JSON.stringify({status:'awaiting-independent-validation',...cov},null,2)+'\n');console.log(cov);
