'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3637.json').snapshot,items=policy.inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const files=['tests/deployed-3637.test.cjs',...['effects','reused','soul'].map(n=>'tests/deployed-3637-'+n+'.test.cjs')],names=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]})));
function ref(term,assertion){const n=names.find(x=>x.name.includes(term));assert.ok(n,term);return {...n,assertion};}const map={};function cover(ids,term,assertion){for(const id of ids)map[id]=[ref(term,assertion)];}
cover([4,5],'属性4与5','全部有序实例分别验证实际指定能力变化、概率成功失败、±6截断及免弱禁强化；铁臂同招双防各1');
cover([30,37],'30后手','后手或HP2999威力两倍，先手/3000/3001不翻倍，实际伤害按基础公式验证且免伤为0');
cover([15],'15三个概率','10/15/50三个实例分别找到真实成功与失败，害怕控制不扣PP、免异常无异常');
cover([48,47],'48四五回合','四/五回合免疫麻痹到期后中招，四回合免弱实际防御不降、到期-1，封招不授予');
cover([58,540],'58与540','下一回合起两/一回合必暴实际伤害两倍、到期恢复；540先手不授予，封招无状态');
cover([60],'60每回合','三回合每回合实际50固定HP损失，50%固伤抗性变25，到期和封招无伤害');
cover([33,485],'33与485','正攻击3清零、负防御-2保留；485清强成功回满，未消/强化保护/技能禁疗无回复');
cover([125],'125两三回合','两/三回合内高攻击实际扣280，低伤不抬高，到期超280，固定伤不受攻击上限影响，封招无上限');
cover([63,521],'63负能力','负攻-6反馈至对手并自身清零，免弱拦对手弱化；521翻至6保留正防，禁强仍-6，无负不变');
cover([126],'126三回合','当前起三回合实际攻速1/2/3，其他能力不变，到期停止，六级封顶、禁强无增加');
cover([66],'66击败','击败对手后1000回复到2800，未击败/禁疗无回复，8999封顶9000');
cover([180,1138],'180消回合','回合增伤实际被清、免断保留；1138成功清除后害怕/疲惫两分支，免疫害怕转疲惫，无可清或免断不控制');
cover([187],'187用属','对手用属触发3000回复，三回合到期，攻击不回复且技能禁疗阻止来源于技能的回复');
cover([164,1188],'164受击','真实受击害怕/疲惫；1188免控失败吸3000并回同量、50%粉抗仅1500、技能禁疗只扣不回，属性不触发、到期失效');
cover([585,893],'585全一','全属性实际+1，893满血+2而8999只+1，6级截断、禁强全部不升');
cover([57],'57用技能','当前起四回合用技能回复3000，满血截断，到期/被控制/技能禁疗均不回复');
cover([776,502],'776下两回合','下两回合实际攻击翻倍，到期恢复；502当前起三回合命中攻击后削当前剩余HP四分之一，属性和未命中不削');
cover([447,871],'447最低','447低攻击保底280、高攻击不压低、免伤仍0；871当前不保底、下两回合实际280、到期精确等于无保底对照');
cover([694,723],'694必先','本次低速后手，下一回合攻击先手，到期恢复后手；723先手不授予，封招无优先级收益');
cover([1239],'1239半血','4499/4500/4501严格边界，先判低体再回4500，实际回复等量粉伤，禁疗无回复/追加、粉抗50%追加2250');
cover([191],'191四回合','四回合免疫反弹真实麻痹，双方免疫不出现异常，第五回合自身能中麻痹');
cover([1154],'1154用招','体力8999/9000比较决定当前固伤400/200，抗性后真实200，三回合到期、控制和封招无新增附加');
cover([693],'693下一回合','下一回合起两回合实际增伤100%，不提前、到期恢复且封招不授予');
cover([1351],'1351护罩','真实350护罩不挡攻击，固伤200消耗到150再破0并溢出50；下次攻击无伤消费1到0，后续攻击正常、零罩通知不重复');
cover([774,1086],'774高体','高于/等于/低于命中后对手体力严格追加3000，粉抗减至1500；1086低体真实增伤50%与相等不增；第五按消强回满后比较追加');
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3637 source and state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};let refs;
 if(e.kind==='move'){r.rationale='pet来源正式列出的本精灵技能，仅选择当前对手；atk_num=1，无伙伴额外技能或觉醒技能标记遗漏。';r.singleBehavior=`${e.raw.name}(${e.raw.id})原始分类、威力、PP、命中、暴击、先制执行。`;refs=[ref('基础27招真实','每招真实PP-1，零PP拒绝且原状态不变，控制不扣PP，封招不造成伤害/异常/能力收益'),ref('基础27招原始','真实威力/分类/属性伤害HP差，暴击倍数，速度先制与命中失败；每招全部验证')];}
 else if(e.kind==='soul'){r.implementation=['dist/soul-registry.js','dist/souls.js'];r.rationale='保留原版928和强化1474独立hash/参数。仅当前双方法术与能力，无队伍依赖。反伤原desc与格式化修正冲突，经BWIKI版本化原文核实采用固定伤害；原字段不改写。';r.singleBehavior=`回合开始自身双防速度+1、对手-1；实际受攻击伤害严格大于${e.raw.args[2]}且存活则回满，小于则反弹50%固定伤害，相等不触发。`;r.sourceResolution=e.raw.semanticResolution;refs=[ref('双魂印回合开始','双防速实际±1改变先后，±6截断、免弱禁强分别阻止'),ref('双魂印350与340','两版阈值前1/相等/后1实际HP及反伤精确核对，345在原版反伤、强化版回满'),ref('双魂印反伤类型','仅固定抗性影响反伤、百分比抗性不影响；护罩实际消耗，0伤/失误均无反伤'),ref('双魂印致死','致死不复活，额外固定伤害不触发魂印回满/反伤，技能禁疗不阻魂印回复'),ref('两版真实魂印','原版及强化版分别选择，实际双防3攻击2与350护罩和PP消费')];}
 else{r.rationale=`来源“${e.raw.instance.description}”，实例参数${JSON.stringify(e.raw.instance.args)}；仅依赖当前双方，非多精灵。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
 r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);
fs.writeFileSync('research/3637-review-audit.json',JSON.stringify({species:3637,status:'state-tests-passing-awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'原魂印928及强化1474均单精灵实现并验证；pet.advance=null、27招均非is_advanced/is_special、无激活道具、无friend_skill_effect、atk_num均1，无需多精灵延期。',sourceResolution:s.souls.map(x=>({id:x.id,...x.semanticResolution})),failures:[{log:'research/3637-targeted-initial.log',reason:'187技能回复漏skill来源导致禁疗失效，保留断言修复；1138随机种子未选害怕分支、164/1188随机一回合异常已到期、871低攻击原伤含85%-100%浮动，修正夹具/精确对照保持状态断言。'},{log:'research/3637-fixed-resistance-fixture.log',reason:'来源核实固定反伤后，测试抗性字段替换误将fixed连续赋两次；按原始新来源明确设percent50/fixed0再fixed50，精确HP断言保留。',npmLog:'research/3637-npm-initial.log'}]},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
