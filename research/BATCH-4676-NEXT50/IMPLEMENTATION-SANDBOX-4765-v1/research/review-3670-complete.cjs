'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3670.json').snapshot,reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const files=['tests/deployed-3670.test.cjs','tests/deployed-3670-partial.test.cjs'];const names=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>({file,name:x[1]})));
const ref=(term,assertion)=>{const r=names.find(x=>x.name.includes(term));assert.ok(r,term);return {...r,assertion};};
const map={};for(const [ids,term,success,failure,boundary,interaction] of [
 [[4,5],'4和5有序','实际指定能力增减与概率成功','概率失败或skillBlock等级不变','正负6级饱和不越界','免弱拒绝敌方负等级'],
 [[12,14],'12和14异常','烧伤或冻伤实际扣除回合伤害','概率失败和免异常不施加','默认持续时间后自然到期','反弹改变接收者且扣血'],
 [[3,907,1232],'3清弱与907','清负等级或反转为正；907实际清一槽PP，1232对手负等级','无负等级不额外清PP；封招保留负等级','负6反转到正6，正3保留','免弱阻止反馈但不阻止自身反转'],
 [[962,1014],'962和1014强化','满足条件全属性+2，不满足+1','禁强化、封招拒绝等级变化','半血4500不翻倍，4501翻倍；6级封顶','已有正能力改变962分支'],
 [[40,195,494],'40先手双威力','40先手伤害提高；195/494正双防不降低伤害','后手40不加倍；封招无伤害','正六级防御被忽略但负防仍提高伤害','494忽略对手速度强化影响先后，换招不继承'],
 [[50,127,54],'50物理减伤','适用攻击伤害精确减半','50不减特攻；封招不登记','5或2回合到期后伤害恢复','公共分类减伤/全伤害减半/输出削弱路径实际扣HP'],
 [[47,48,191],'47免弱及48','免弱拒绝命中下降，免异常拒绝麻痹','封招不授予免疫','每个实例实际持续参数及到期清理','与对手真实属性技能交互拒绝状态'],
 [[1003,936],'1003与936','控制实际生效','概率失败或免异常进入弱化/封属补偿','封属2回合结束消失，真实PP消耗','异常免疫后全属性-1；再有免弱则不降'],
 [[1010,693,776],'1010消强后','下两回合实际攻击翻倍','封招不授予；1010无强化或保护不授予','增伤start=2、end=3并到期','1010清强化且保护阻止清除及奖励'],
 [[843],'843下两回合','下两回合低速者因先制+2先行动','封招不授予','当前后手，第2/3回合先手，第4回合后手','属性招也使用先制，仍按对手速度比较'],
 [[456,447],'456斩杀','299残血被斩杀；447攻击实际扣300','封招不执行','300和301不斩杀；最低伤害300','攻击免疫使447伤害归零'],
 [[93,1131],'93概率固定','93实际追加500；1131真实随机追加','概率失败无额外扣血；封招无伤害','1131两区间均覆盖101个整数端点','护罩600吸收500后剩100；正强化切换随机区间'],
 [[532,1065],'532和1065持续','回复体力并追加等于实际回复的粉伤','技能禁疗与封招不回不伤','4499双倍、4500不双倍，满血/8999截断，四回合到期','持续效果后续使用属性招真实回体扣血'],
 [[604],'604连续随机','随机威力按独立公式产生实际伤害','封招无伤害','连续1/2/11次封顶威力，区间与参数保留','换招重置连续次数，重新使用首档伤害'],
 [[1138,889],'1138及889','消除对手doubleDamage并施加失明或焚烬','无回合效果或protect时不施加异常','一次异常免疫消费；1138首异常失败进入第二异常','889免疫后不施加，1138免疫消费后焚烬生效'],
 [[1960],'1960当前击败','击败当前对手授予强化保护','未击败或封招不授予','保护start=1、end=3','公共保护拒绝对手真实消强及827奖励'],
 [[1957,1958],'1957圣辉回复','持有羽翼回满，持有华冠实际攻击翻倍','无对应效果不回满/不增伤','过期效果无收益；回满封顶','技能禁疗阻止1957回复'],
 [[956],'956未击败','未击败后次回合使用技能追加300固伤','击败不登记，疲惫未行动无追加','只下一回合生效，再下一回合停止','电属性天敌追加600，属性与攻击用招均触发'],
 [[519],'公共519使用技能后','使用技能后四种非零能力回复160','非使用事件不由此测试认证，失败证据见其他519专项','包含施放回合共五回合，第六回合不回','属性招和攻击招均可触发']
])for(const id of ids)map[id]={term,success,failure,boundary,interaction};
const items=policy.inventory(s);
for(const item of items){let r;
 if(item.kind==='skill'){
  const id=item.raw.instance.id,old=reviews.entries[item.key];
  if([70,827,1328,713,1772].includes(id)){assert.ok(old);r={...old,sourceDigest:item.sourceDigest};}
  else{const m=map[id];assert.ok(m,'unmapped effect '+id);r={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString(),rationale:'当前双方独立可执行：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,[ref(m.term,m[k])]]))};}
  if(id===519){r.rationale+='；时机为用户明确确认“使用技能后”，原始API模板与[5,40]参数不变。';r.userConfirmedSource='research/3670-user-confirmed-rules.json';r.tests.failure=[ref('公共519施放失效','施放失效不登记、疲惫未行动不回复且不扣PP')];r.tests.boundary=[ref('公共519无等级','无等级不回；正负6级仍只算一种，六种240，8999封顶')];r.tests.interaction=[ref('公共519无等级','技能禁疗使实际回复为0'),ref('191真实反弹','对手消回合移除持续效果后下一回合不再回复')];}
  if(id===191)r.tests.interaction.push(ref('191真实反弹','麻痹实际反弹给对手，自身不受控，对手扣1PP'));
 }else if(item.kind==='move'){
  r={sourceDigest:item.sourceDigest,scope:item.raw.id===12440?'mixed':'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString(),rationale:'保留真实技能基础参数与对应版本，当前对手攻击或属性行为接受逐招测试。',singleBehavior:item.raw.name+'的威力、分类、先制、命中、暴击、PP及当前目标行为',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础28招伤害','逐招实际伤害由原威力、属性、本系和浮动独立算例验证，PP减少1')],failure:[ref('基础28招伤害','零PP拒绝、封招不伤害、疲惫不行动不扣PP')],boundary:[ref('基础28招先制','真实先制决定高速/低速顺序，非必中技能负命中真实miss')],interaction:[ref('基础28招先制','必暴双倍伤害及属性克制、本系加成'),ref('全部技能与两魂印','原版/强化组保留独立第五，原始技能参数逐项一致') ]}};
  if(item.raw.id===12440)Object.assign(r,{deferredBehavior:'来源atk_num=3的额外两个敌方目标选择及其独立命中、伤害和冻伤结算',trigger:'多目标战斗使用极寒冰暴',futureMechanisms:['多目标候选列表','额外两个目标独立结算']});
 }else{
  r={sourceDigest:item.sourceDigest,scope:'mixed',reviewedBy:'Codex',reviewedAt:new Date().toISOString(),rationale:'自身回合初强化/降级及回合末比较当前对手能力，均在单精灵执行；备用来源明确下场不保留，只延期离场清理。',singleBehavior:item.raw.description,implementation:['dist/range-souls.js','dist/souls.js'],tests:{success:[ref('两版魂印回合初','956概率两分支真实等级变化与必暴；1710按正强化有无切换并追加自身9000/3=3000，对手9900不作为基数'),ref('两版魂印回合末','回合末高于初始等级授予下一回合羽翼，实际攻击转回复')],failure:[ref('圣雷华冠只在','无等级升高原版不授华冠；属性技能不享攻击先制'),ref('1957圣辉回复','过期专属效果不产生收益')],boundary:[ref('两版魂印回合末','羽翼start=end=2并到期，1HP面对致死攻击转回复保命'),ref('圣辉免异常','从负能力提高仍触发，免异常/免弱只在有效窗口')],interaction:[ref('圣雷华冠只在','对手有异常时华冠攻击提升50%，无异常不提升；攻击先制使低速先行'),ref('圣辉免异常','真实敌方弱化和麻痹受羽翼免疫')]},deferredBehavior:'圣辉之羽'+(item.raw.id===1710?'、圣雷华冠':'')+'下场不保留',trigger:'本精灵离场',futureMechanisms:['离场事件','专属效果离场清理'],dependencyEvidence:[{kind:'switch',quote:'下场不保留',sourceFile:'research/3670-wiki-source-check.json',revision:item.raw.id===956?319493:320247}]};
 }
 reviews.entries[item.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
const audit=require('./3670-review-audit.json');Object.assign(audit,{status:'awaiting-independent-validation',inventory:items,total:items.length,reviewed:items.length,missing:[],pendingSemanticQuestions:[],resolvedSemanticQuestions:[{effectId:519,answer:'使用技能后',sourceType:'user_confirmed',record:'research/3670-user-confirmed-rules.json'}],unifiedTodoRegistered:false});delete audit.reason;fs.writeFileSync('research/3670-review-audit.json',JSON.stringify(audit,null,2)+'\n');console.log(policy.reviewCoverage(s,reviews));
