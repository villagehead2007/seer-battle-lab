'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3627.json').snapshot,items=policy.inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const files=['tests/deployed-3627.test.cjs',...['effects','mechanisms','soul'].map(n=>'tests/deployed-3627-'+n+'.test.cjs')],names=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]})));
function ref(term,assertion){const n=names.find(x=>x.name.includes(term));assert.ok(n,term);return {...n,assertion};}
const map={};function cover(ids,term,assertion){for(const id of ids)map[id]=[ref(term,assertion)];}
cover([4,5],'属性4与5','每次有序实例指定属性实际变化；正负6截断，免弱和禁强化分别阻止，沉稳双防各+1');
cover([40,37,645],'40先手与37','先手、严格低于半血/三分之一的真实威力倍数；等阈值不加，免伤阻挡伤害');
cover([63,85],'63反馈','两次63各自负攻-6反馈后自己归零、保正防；免弱阻止对手弱化但自己仍清；85吸正能力封顶6、保负能力，禁强不吸');
cover([125,447],'125两回合','两实例125两回合受攻击不超过250，第3回合恢复；两实例447分别保底250/240，攻击免疫0、伤害上限100优先');
cover([88],'88十五','不同种子真实1或2倍伤害与伤害公式一致，免伤0；概率成功失败均覆盖');
cover([60,77],'60每回合','60两回合每回合扣150，第3回合停止、免伤0；77两回合用招回280、第3回合停止，禁疗0、满血封顶');
cover([523,585,1344],'523双防','523双防+1、585全+1、1344先手全+1后手全+2；禁强化0、6级边界');
cover([730,47],'730下回合','首回合不增长，随后三回合攻速各+1，再后停止；禁强和6级封顶；47四回合真实弱化无效，第5回合防御-2');
cover([693,843],'693与843','下两回合才150%增伤或先制+1/+2，实际伤害2.5倍、慢速变先手，第4回合失效，封招无计时');
cover([851],'851五异常','每次两种不同异常，所有五种均出现；烧伤冻伤中毒分别真实损1125；2次免异常完整消费无异常');
cover([532,1065],'532与1065','真实回复量对应等量粉伤，满血与技能禁疗不粉伤；1065半血严格边界翻倍；分别3/4回合期限、免伤仅阻挡对手损血');
cover([191],'191四回合','两个技能分别四回合免疫反弹麻痹，双方免疫无异常，期满恢复实际麻痹');
cover([854],'854下次','两个实例均保留119/120威力次数，首个121攻击无效并消费一次，第二个121有伤；控制不消费次数和PP');
cover([180,33],'180消回合','180实际删除回合效果，免断不删；33正攻击+6清零、负防御保留，封招不清');
cover([852],'852三成','两个实例2999体力实际追加5400并回复、3000/3001追加2700；禁疗不回、免伤不吸取、致死攻击无虚假回复');
cover([985,1350],'985吸强','985吸强成功仅下一回合封属，原回合及再下一回合可强化；无强化、禁强、免吸不封属；1350负攻-6反+6，成功仅下一回合封攻、无负能力或禁强不触发');
cover([699,31],'699穿透','699穿透攻击免疫、封招不攻击；31真实12至20段端点、伤害和、致死停止；完整领域崩坏852只追加回复一次2700');
cover([760,582,1253],'760微弱','760真实微弱变普通增伤；582未击败次回合必暴、第3回合恢复，击败不登记；1253击败正2到4、5到6，负能力保留，未击败或禁强不翻倍');
cover([853],'853体力','实际最大体力9000+速度500按25/35/45/45%追加；速度强化参与计算，封招使用计次但当次0伤，免伤及致死边界');
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3627 source and state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/souls.js']};let refs;
 if(e.kind==='move'){r.rationale='来源pet列出的当前精灵技能，无伙伴或觉醒追加；保留全部原始技能基础字段与有序效果。';r.singleBehavior=`${e.raw.name}(${e.raw.id})原始PP、威力、分类、命中、暴击、先制；当前对手一次技能结算，多段次数由真实效果31单独执行。`;refs=[ref('基础22招真实','逐招PP-1、控制不扣PP、零PP拒绝且不改状态、封招无收益'),ref('基础22招原始','真实分类威力/属性伤害、先制顺序、暴击双倍与非必中失误')];if(e.raw.id===14045){r.scope='mixed';r.rationale='来源skill/14045 hash d84245f6的atk_num=3经现有SeerAPI reviewedTargets绑定为多目标数，不是多段次数；当前对手一次攻击立即实现，其他目标选择延期。';r.deferredBehavior='保留原始atk_num=3；多精灵场景剩余攻击目标选择与逐目标伤害。';r.trigger='净火繁星使用时存在多个可选精灵目标';r.futureMechanisms=['多精灵战场目标列表','atk_num=3的目标选择及逐目标伤害'];refs.push(ref('净火繁星只攻击','当前对手恰一条实际伤害与一次PP消费，封招/免伤0损血；来源三目标字段完整保留'));}}
 else if(e.kind==='soul'){r.rationale='全部原文只依赖当前双方的出手先后、技能命中前和当回合状态，不含队伍、换宠或伙伴强化依赖。';r.singleBehavior='自身攻击命中前清对手回合；对手先出手则自其命中前免异常和受攻减50%；自身先出手则自命中前免弱和攻击伤害+50%，均仅当回合。';r.implementation=['dist/soul-registry.js','dist/souls.js'];refs=[ref('魂印921攻击命中前','攻击清回合先于免攻与命中判定，失误/封招仍清，免断拦截，属性或控制不清'),ref('魂印921先出手','先手实际免弱且攻击倍率1.5，固定/百分比追加不增伤；次回合改后手恢复受弱，控制未出手不获免弱'),ref('魂印921对手先出手','后手受攻真实减半并免麻痹，攻击输出不增；次回合先手不保留免异常，失效用招触发而受控未用招不触发')];}
 else {r.rationale=`原文“${e.raw.instance.description}”参数${JSON.stringify(e.raw.instance.args)}，行为只涉及当前双方，击败后对自身能力的增益仍是单精灵分支。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
 r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);
fs.writeFileSync('research/3627-review-audit.json',JSON.stringify({species:3627,status:'state-tests-passing-awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'pet.advance=null；全部22招friend_skill_effect=[]、无is_advanced，魂印921 intensified_to=null；没有可遗漏的伙伴/觉醒自身强化。',sourceFailures:require('./3627-source-check-external.json').failures},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
