'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3642.json').snapshot,reviews=require('../SINGLE-STAGE-REVIEWS.json'),items=policy.inventory(s);
const names=fs.readdirSync('tests').filter(f=>/^deployed-3642.*\.test.cjs$/.test(f)).flatMap(f=>[...fs.readFileSync('tests/'+f,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file:'tests/'+f,name:m[1]})));
const ref=(term,assertion)=>{const n=names.find(n=>n.name.includes(term));assert.ok(n,term);return {...n,assertion};};const map={};
for(const [ids,term,assertion]of [
 [[4,5],'属性4与5','逐有序实例真实等级变化、概率成功失败、六级截断与免弱禁强，双防分别+1'],
 [[58,37],'37四分之一','HP2249/2250/2251严格威力边界；下两回合攻击暴击实际双伤，到期恢复，封招无状态'],
 [[15],'15两种概率','两个真实概率成功失败；害怕实际阻止用招扣PP，免异常拒绝'],
 [[31],'31两实例','2~5/3~6段均命中上下端点，累计实伤等于各段之和，击败只一段，免伤零扣血'],
 [[46],'46抵挡','下一次攻击实际零伤并消耗计数，多段全免且只消费一次；属性保留、下次再能受伤'],
 [[33,521],'33消正','每次消强保留负防；反转负攻-6到6，正防保留，保护/禁強失败状态不改'],
 [[116],'116先手','先手每次实际伤害20%回复，后手/禁疗不回，三回合期限；来源冗余3/20另存'],
 [[118,604],'118与604','随机威力实际伤害大于0且覆盖150/220、150/300端点，连续每次+30封顶300，间断重置'],
 [[115],'115速度','15%追加成功166/失败0，速度等级+2追加333，固定抗性50%为166，免伤0'],
 [[117],'117先手','先手五回合真实概率害怕成功失败，后手和免疫不控，到期无异常；固定模板5/50原参另存'],
 [[470,417],'470四回合','470命中攻击40%害怕两分支，失误/到期不触发；417三回合实际攻击伤害50%回复、禁疗与到期不回'],
 [[599,776],'599三回合','599三回合实际受伤半值，到期原伤；776下一回合起两回合伤害双倍，期限明确'],
 [[585,433],'585全一','两实例全属性+1、禁强/6级；433当前起攻速1/2/3、到期停止，禁强不加'],
 [[57],'57用技能','四回合用技能回复3000，满血截断；控制、禁疗和到期无回复'],
 [[126],'126三回合','当前起三回合攻速各1，其他能力不变，六级截断、禁强失败，到期不加'],
 [[804,1109],'804消强','清除/吸取正命中后804反应全属性-1；1109实际扣3000回3000，禁疗只扣不回，无强化/到期不反应'],
 [[697,683],'697穿透','无视10攻击上限仍造成超10实伤，无效果对照恰10；随机固伤100/200两端、免伤0'],
 [[801],'801成功','实际消强成功才在下一回合起两回合必先并回实际全伤，当次不回、无可消/免消失败、禁疗与到期无收益'],
 [[968,1353],'968先手','麻痹两种行动顺序均实测成功失败；五回合先手害怕，免控失败清除回合，免断保留，到期不控'],
 [[693,843],'693与843','下两回合真实2.2倍攻击与先制+2改变先手，第4回合恢复，封招不授予'],
 [[1067],'1067低于','4499低体回复转扣对手3000并回3000，4500/4501只回复，禁疗只吸不回，四回合到期'],
 [[1208],'1208反转','负攻-3实际反转到3后对手下一攻零伤并消费计数，后续正常；无负/禁强反转失败不封攻'],
 [[928,1247],'928消回合','清除增伤后一次免麻痹真实消费，未清无次数；先手禁疗本回合阻回复，后手不阻，次回合恢复'],
 [[853],'853最大','体力2000+速度100依次30/35/40/45%真实扣血，间断不重置、百分比抗性折半，完整第五消回合与免控按序触发']
 ])for(const id of ids)map[id]=[ref(term,assertion)];
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3642 source/state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};let refs;
 if(e.kind==='soul'){r.scope='mixed';r.implementation=['dist/soul-registry.js','dist/souls.js'];r.rationale='原版931和强化1473分别保存真实hash参数。先后手减伤、回复、免控免弱和累计先制均当前双方可触发，仅下场清层依赖换宠。';r.singleBehavior=e.raw.description.replace('，下场不保留','');r.deferredBehavior='下场时清除累计的先制层数，下场不保留';r.trigger='本精灵下场';r.futureMechanisms=['换宠离场事件','魂印层数离场清理'];r.dependencyEvidence=[{kind:'off-field',quote:'下场不保留'}];refs=[ref('两魂印先手','实际半伤与免异常/免弱两回合，后手受到原伤再回3000'),ref('两魂印后手','每次后手HP回复3000，下回合先制逐层至3，控制不触发，技能禁疗不阻魂印'),ref('原版减伤','原版本回合减伤到期，强化跨回合保留一次并在真实攻击消费，失误不消费'),ref('两版魂印两回合','真实清回合移除两免疫、独立选择两个魂印，重开无累计先制')];}
 else if(e.kind==='move'){r.rationale='pet所列27招的当前精灵技能；保留原始学习、第五及全部有序实例。';r.singleBehavior=`${e.raw.name}原始PP、威力分类、先制命中和暴击执行`;refs=[ref('基础27招真实','逐招实际PP消耗、零PP拒绝原状态不变，控制和封招无HP/能力/异常收益'),ref('基础27招原始','按真实威力与属性计算HP差，暴击倍数、行动顺序和失误状态')];if(e.raw.id===11460){r.scope='mixed';r.rationale='真实skill/11460 hash58978e68的atk_num=2表示两目标；单挑仅命中当前对手一次，其余目标依赖多精灵。';r.deferredBehavior='羽翼切割atk_num=2的第二目标选择和独立伤害结算';r.trigger='在可选两个敌方目标的对战中使用羽翼切割';r.futureMechanisms=['多精灵目标列表','第二目标选择和伤害分发'];}}
 else{r.rationale=`来源原文“${e.raw.instance.description}”，当前双方可触发；参数及来源保留。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
 r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3642-review-audit.json',JSON.stringify({species:3642,status:'awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'931/1473原版强化分别实现；没有新增伙伴/觉醒技能。只延期两版下场清层与11460第二目标。',failures:[{log:'research/3642-targeted-initial.log',reason:'11460真实双目标尚未加入来源适配表；新增精确ID/hash/目标数匹配后保留完整多目标延期。'},{log:'research/3642-targeted-state-initial.log',reason:'1208旧解析器返回空参数导致封攻次数NaN，且直接反转绕过禁强。按真实模板解析次数并复用stage、实际变化才封攻，保留失败断言。'}]},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
