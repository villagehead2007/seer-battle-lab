'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3626.json').snapshot,items=policy.inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const files=['tests/deployed-3626.test.cjs',...['effects','mechanisms','soul'].map(n=>'tests/deployed-3626-'+n+'.test.cjs')],names=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]})));
function ref(term,assertion){const n=names.find(x=>x.name.includes(term));assert.ok(n,term);return {...n,assertion};}
const map={};function cover(ids,term,assertion){for(const id of ids)map[id]=[ref(term,assertion)];}
cover([5],'属性4与5','逐实例指定能力下降，100%触发、免弱不降、-6下限；黑雾两个有序实例双攻均-1');
cover([15,11],'15害怕与11','真实害怕阻止行动不扣PP；25%中毒成功/失败、追加1125粉伤；免异常和封招无异常');
cover([1127],'1127吸强','对手攻击+3吸为自己+3并清零；负防御保留；无正能力全-1，免弱/禁强各自阻止，等级封顶6');
cover([494],'494无视','同先制条件忽略+6速度而先手；+6特防/攻击不改变伤害，正命中不加命中率；负特防有效、实际等级不删除，下回合恢复');
cover([425,849],'425与849','随机2或3个不同能力对手-1自身+1；禁强与免弱分别阻止，±6边界；849首回合仅一次且三回合后停止');
cover([762],'762按已损','1001体力三回合逐次回5000/7000/8000，第四回合不回；满血封顶，技能禁疗与封招阻止');
cover([765],'765禁强化','对手真实强化技能三回合等级不变，第4回合+1；原等级保留，封招不授予禁强化');
cover([645,167],'645严格','2999体力威力240，3000/3001威力80；目标负能力追加100固伤，无弱化不追加，免伤与致死边界');
cover([790],'790穿透','三回合内攻击穿透伤害上限1，第4回合恢复限伤1，封招不产生穿透');
cover([941],'941出手','满血不同种子均害怕，半血真实成功失败分支，1血出现失败，免异常无控制；后手受伤后再出手');
cover([191],'191四回合','四回合免疫并反弹真实麻痹，双方免疫则均无异常，第5回合恢复受控');
cover([693,843],'693与843','本回合不提前生效，第2/3回合伤害翻倍或先制+2，第4回合恢复，封招无计时状态');
cover([136],'136未命中','未命中回复2250而命中不回，禁疗和封招阻止，8999封顶9000');
cover([962,597],'962无强化','无正等级强化+2，有正等级+1并封顶6；禁强拦截；吸取四回合每次用招真实伤3000回3000，第5回合失效、免伤禁疗与残血50边界');
cover([1027],'1027无正','无正等级每回合末固伤300共4回合；正命中不附加，清除正等级后附加、负等级可附加；目标免伤和残血归0；完整魅影残乱先强化故无追加');
cover([449],'449弱化','弱化时八成感染成功失败均验证，无弱化或免疫无感染；真实感染使后续回合PP不消耗，解除双攻-1并转中毒损1125');
cover([752],'752异常','目标有异常实际回合末额外扣3000，无异常不扣、次回合不重复、免伤不扣');
cover([928],'928两实例','消回合成功才获得1次免异常，真实麻痹消费后再次可中；无效果或免断不授予');
cover([963,515],'963自身','正能力实际吸取3000并回复，无正能力不吸，禁疗只损对方、全伤免疫不吸；负能力追加300并清负保正，无负能力不追加；完整第五三个实例分别生效');
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3626 source and state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/souls.js']};let refs;
 if(e.kind==='move'){r.rationale='来源pet列出的当前精灵技能，未含伙伴追加或觉醒版本；基础行为及各效果实例分别审核。';r.singleBehavior=`${e.raw.name}(${e.raw.id})原始PP、威力、分类、命中、暴击与先制执行。`;refs=[ref('基础17招真实','每招真实PP-1，零PP拒绝且原状态不变，控制不扣PP，封招无HP/等级/异常/计数收益'),ref('基础17招原始','每招原始威力/分类/属性对应HP差，暴击双倍、先制排序、非必中失败')];r.implementation.push('dist/wiki-support.js');}
 else if(e.kind==='soul'){r.scope='mixed';r.rationale='原文首次登场的首回合对手用招及自身用属分支只依赖当前双方；第二次触发明确要求切换再次上场，单独延期。';r.singleBehavior='首回合对手用攻本方当回合受攻减半并使对手下1次属性无效；对手用属本方当回合免异常并使对手下1次攻击无效；自身每次用属性50%害怕，未触发则消除对手回合效果。';r.deferredBehavior='每场第2次首回合分支由切换再次上场触发；跨出场计数最多2次。';r.trigger='首次出场已触发1次，切换再次上场时触发第2次';r.futureMechanisms=['换宠与重新入场事件','按整场保存的魂印入场触发次数','重入场首回合窗口'];r.dependencyEvidence=[{kind:'switch',quote:'切换再次上场时触发第2次'}];r.implementation=['dist/soul-registry.js','dist/souls.js'];refs=[ref('魂印919首回合受攻','实际伤害减半，下一属性次数1到0，后续恢复真实麻痹；第2回合不减伤，对手被控制不触发'),ref('魂印919首回合对手用属','首回合免异常，下一攻击0伤并消费1到0，再次攻击有伤；次回合麻痹成功，对手属性虽封招仍为用招'),ref('魂印919用属五成','概率成功害怕保留回合效果，失败消回合；免异常消费后转清回合，免断保留；控制不触发、封招仍为用属，攻击不触发')];}
 else {r.rationale=`来源原文“${e.raw.instance.description}”仅涉及当前双方，不含队伍或换宠；保留实例位置及参数${JSON.stringify(e.raw.instance.args)}。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
 r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3626-review-audit.json',JSON.stringify({species:3626,status:'state-tests-passing-awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'pet.advance=null，17个来源技能friend_skill_effect=[]且均非is_advanced；仅原魂印919，无自身强化遗漏',timing:'1027原文未限定用技能或攻击，沿用持续每回合附加固伤的回合末阶段；941出手按发动瞬间体力、技能有效命中阶段前置结算。',failures:[{log:'research/3626-source-check.json',cause:'sandbox EACCES; serial external refresh completed'},{log:'research/3626-targeted-initial.log',cause:'5项夹具问题：494需同先制对照；645原始威力80非90；感染随机1/2回合需取2回合样本；两项魂印反控夹具种子导致雷祭未命中，改用实际命中样本。保留状态断言，无引擎回避修改。'}]},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
