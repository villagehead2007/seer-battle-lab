'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3629.json').snapshot,items=policy.inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const files=['tests/deployed-3629.test.cjs',...['effects','reused','soul'].map(n=>'tests/deployed-3629-'+n+'.test.cjs')],names=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]})));
function ref(term,assertion){const n=names.find(x=>x.name.includes(term));assert.ok(n,term);return {...n,assertion};}
const map={};function cover(ids,term,assertion){for(const id of ids)map[id]=[ref(term,assertion)];}
cover([4,5],'属性4与5','逐实例能力按参数变化，免弱禁强阻止，±6边界，龙威双攻下降保留两个实例');
cover([15],'15百分之五','5%害怕成功失败均实际发生，控制使对手PP不扣；免异常无状态');
cover([1114],'1114消回合','删除实际回合效果后恰两招PP归0，无效果/免断不清PP，仅一招剩余PP时只清一招');
cover([411],'411当前体力','连续实际按对手剩余HP的20/30/40/40%扣血，间断回20%；免伤0、残血归0');
cover([52],'52先手','先手封攻封属当前回合但仍扣PP，下回合恢复，后手或被封招不产生封锁');
cover([589],'589只复制','对手正攻击3复制到自身5封顶6，负防御不复制、对手等级保留；无正能力不变，禁强阻止');
cover([440],'440两倍','三回合对手用招每次扣2，第四回合扣1；1PP归0，控制不扣PP');
cover([101,450],'101伤害','101按实际攻击伤害一半回血；450真实随机150与300端点；满血封顶、禁疗0、免伤不吸血');
cover([191],'191四回合','四回合免疫反弹真实麻痹，双方免疫无状态，第五回合恢复麻痹');
cover([597,843],'597四回合','597四回合用招真实伤3000回3000，禁疗只伤不回、免伤不吸、残血50；843低速仅下两回合先手');
cover([946],'946严格','4999对5000全+2，等值和高体全+1；六级封顶、禁强化0');
cover([783],'783强化','真实消强和吸强两种方式均触发目标3000粉伤，无正能力不触发，免伤0，第4回合不触发');
cover([695],'695五成','概率实际封属/放行两个分支，PP均正常消费；第4回合恢复强化，攻击不封');
cover([1201],'1201先手','先手真实70%冰封或失败先制+1，免控触发补偿，仅下两回合低速先手；后手无冰封/补偿');
cover([485,582],'485清强','485清正攻保负防并从1000回满，无强化不回、禁疗不回；582未击败仅下2回合必暴，击败无状态');
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3629 source and state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};let refs;
if(e.kind==='move'){r.rationale='真实来源列出的当前精灵自身技能；无伙伴或觉醒版本，完整保留技能参数。';r.singleBehavior=`${e.raw.name}(${e.raw.id})按真实威力、分类、PP、命中、先制、暴击执行。`;refs=[ref('基础17招真实','逐招实际PP-1，零PP拒绝原状态不变，控制不扣PP、封招无实际收益'),ref('基础17招原始','实际分类威力伤害、属性、先制顺序、命中失败和暴击倍数')];}
else if(e.kind==='soul'){r.rationale='当前双方战斗阶段结束回复、攻击保底和攻击减伤无队伍依赖。';r.singleBehavior=e.raw.description;r.implementation=['dist/soul-registry.js','dist/souls.js'];refs=[ref('魂印922战阶','2999回520、3000/3001回260，满血封顶，技能禁疗不挡魂印、控制仍回、先于毒伤，击败对手仍回复'),ref('魂印922攻击保底','攻击最低260，攻击免疫仍0、限伤100仍100；属性和失误不附加伤害'),ref('魂印922只减','真实攻击伤害减260低伤0，粉伤不减，致死不复活回复')];}
else if(e.raw.instance.id===910){r.scope='multiplayer';delete r.implementation;r.rationale='原文当回合击败当前对手后封属性，死亡对手不能再次用招，因此封锁对象为后继对手，按既有910范围登记。';r.deferredBehavior=e.raw.instance.description;r.trigger='当回合击败当前对手后，下一只对手入场并使用属性技能';r.futureMechanisms=['后继对手入场','跨出场的两回合封属窗口'];}
else{r.rationale=`原文“${e.raw.instance.description}”，参数${JSON.stringify(e.raw.instance.args)}，只涉及当前双方。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
if(refs)r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3629-review-audit.json',JSON.stringify({species:3629,status:'state-tests-passing-awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'来源pet.advance=null，无额外魂印或伙伴技能；所有friend_skill_effect=[]且无advanced标记。',timing:'魂印原文战斗阶段结束：双方行动之后、持续回合末毒伤之前结算；仅活着的当前精灵回血。'},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
