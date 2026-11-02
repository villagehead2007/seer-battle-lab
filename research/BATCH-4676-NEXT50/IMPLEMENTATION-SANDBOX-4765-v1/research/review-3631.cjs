'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3631.json').snapshot,items=policy.inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const files=['tests/deployed-3631.test.cjs',...['effects','reused','soul'].map(n=>'tests/deployed-3631-'+n+'.test.cjs')],names=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]})));
function ref(term,assertion){const n=names.find(x=>x.name.includes(term));assert.ok(n,term);return {...n,assertion};}const map={};function cover(ids,term,assertion){for(const id of ids)map[id]=[ref(term,assertion)];}
cover([4,5],'属性4与5','逐实例指定能力和数值真实变化；两个攻击+2/速度+2及双防+1保留顺序，免弱禁强、±6截断');
cover([85,948],'85吸强','正命中3吸至自身5封顶6，负等级保留，948实际吸到才瘫痪；禁强/免吸/无正等级不控制');
cover([756,434],'756两实例','35%/50%和正能力60%实际成功失败瘫痪；控制不扣PP，免异常拦截，434无强化不触发');
cover([37,88],'37严格','半血4499威力双倍、4500/4501不加，88真实15%双伤成功失败与公式一致，免伤0');
cover([749,433,730],'749全弱','全弱-1、免弱和-6下限；433三实例当前回合起每回合按有序数组增加，730下回合开始，共三回合，禁强/6级截断');
cover([937,966],'937瘫痪','真实瘫痪成功无补偿，失败或免控则937下两回合对方先制-2/966本方全+1，期限到期、禁强和6级边界');
cover([47,521],'47五回合','五回合对手真实速度弱化无效、第6回合-2；521负攻-6反6、正防保留，无负能力不变，禁强化保留负6');
cover([962,585,763],'962无正','分别无正能力+2/全+1/无正能力才+1，正能力条件、禁强和6级截断');
cover([707,532],'707四回合','707严格低半血回复6000、其余3000；532按实际回复等量粉伤，满血/禁疗无虚假粉伤；两者四回合到期');
cover([843,693],'693与843','每个实例下两回合生效，攻击分别2.2/2.5倍与低速先手，第4回合恢复，封招不授予');
cover([180,1060],'180消回合','180真实清回合与免断，1060实际吸强后仅下一回合封攻、当回合与到期有伤，无正能力/免吸不封');
cover([191],'191四回合','各实例四回合免疫反弹麻痹、双方免疫无异常，第5回合恢复麻痹');
cover([922],'922两个实例','每个实例回合末自身负攻清零并反馈对手-3/-6，正防保留，免弱阻挡对手负等级，第5回合停止');
cover([1077],'1077对手','对手每次攻击后必瘫痪，免异常消费后转下两回合封属，第4回合恢复强化；三回合到期不控制、属性不触发');
cover([1258],'1258严格','实际攻击伤279/280无次数，281获得一次免异常；麻痹真实消费到0后再可中');
cover([1245],'1245复制','自身正攻击3使目标-3、负能力不复制；无正能力、免弱及目标-6无法下降时真实随机两招PP归零');
cover([1138,963],'1138消回合','消回合成功后瘫痪或疲惫均出现；一次免疫使瘫痪失败转疲惫，免断无控制；963正能力吸3000回3000，无正能力不吸、禁疗只伤、免伤不吸');
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3631 source and state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};let refs;
if(e.kind==='move'){r.rationale=e.raw.id===29018?'真实来源以skill_activation_item/1727010解锁的自身额外技能，不依赖队伍；完整加入技能列表并可独立配招。':'来源pet列出的本精灵技能，按原始参数和有序实例实现。';r.singleBehavior=`${e.raw.name}(${e.raw.id})原始分类、威力、PP、命中、暴击、先制执行。`;refs=[ref('基础24招真实','逐招真实PP-1，零PP拒绝原状态不变，控制/封招均无效果收益'),ref('基础24招原始','按真实威力分类属性计算HP差，暴击倍数、先制与失误')];if(e.raw.id===29018)refs.push(ref('双版本来源与伙伴','两个魂印选择下额外技能实际扣PP、攻速命中+1'));}
else if(e.kind==='soul'){r.implementation=['dist/soul-registry.js','dist/souls.js'];r.rationale='原魂印和强化魂印保留各自hash、参数及来源；两者仅依赖当前双方的暴击、强化及用招，不属多精灵机制。';r.singleBehavior=e.raw.description;refs=[ref('两版魂印暴击','暴击实际免伤和反弹、等量回复与下一回合先制，固定/百分比抗性证明两版本伤害类型不同'),ref('两版暴击反弹致死','反弹击败不虚假回复、无视攻击免疫穿透、技能禁疗不阻魂印回复'),ref('原魂印只消强','原版仅消强瘫痪，强化版消强与吸强均瘫痪，无正能力不触发'),ref('两版瘫痪未触发','免异常失败补偿清回合，原版必暴在下一回合后到期，强化版跨属性回合保留下一攻次数并实际消费'),ref('双版本来源与伙伴','原版920/强化1581独立选择和真实额外技能执行')];if(e.raw.id===1581)refs.push(ref('强化魂印回合开始','正能力在回合开始锁定、用攻吸3000，同回合被清仍生效、临时获得正能力次回合才生效；失效用招仍吸、控制不吸'));}
else if(e.raw.instance.id===698){r.scope='multiplayer';delete r.implementation;r.rationale='原文明示对方下只精灵出战时触发，当前对手死亡后不得把异常施加给尸体或当前方。';r.deferredBehavior=e.raw.instance.description;r.trigger='当回合击败对手，其下一只精灵出战时50%瘫痪';r.futureMechanisms=['当回合击败记录','下一只对手出场事件','跨出场的异常概率判定'];r.dependencyEvidence=[{kind:'next-entry',quote:'对方下只精灵出战时'}];}
else{r.rationale=`来源原文“${e.raw.instance.description}”，参数${JSON.stringify(e.raw.instance.args)}，仅依赖当前双方。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
if(refs)r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3631-review-audit.json',JSON.stringify({species:3631,status:'state-tests-passing-awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'保留920/1581两个来源魂印与强化关系，不覆盖原版；29018命运星痕使用真实激活道具1727010/hash9b654608，作为自身能力实现。pet.advance=null，技能无觉醒标记，无伙伴缺口被延期。',failures:[{log:'research/3631-targeted-initial.log',reason:'来源瘫痪枚举19尚未在756/937/1138的已有适配边界接入，致第五暂不可配；按本次真实模板/参数补齐19专门分支，不改变完成验证标准。'},{log:'research/3631-targeted-state-initial.log',reason:'521直接改写负等级绕过禁强化，保留失败断言，改用stage函数。'}]},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
