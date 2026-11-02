'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3665.json').snapshot,reviews=require('../SINGLE-STAGE-REVIEWS.json'),items=policy.inventory(s);
const names=fs.readdirSync('tests').filter(f=>/^deployed-3665.*\.test.cjs$/.test(f)).flatMap(f=>[...fs.readFileSync('tests/'+f,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file:'tests/'+f,name:m[1]})));
const ref=(term,assertion)=>{const n=names.find(n=>n.name.includes(term));assert.ok(n,term);return {...n,assertion};},map={};
for(const [ids,term,assertion]of [
 [[4,5],'属性4与5','逐有序实例真实正负能力变化、六级截断、禁强免弱，呼啸天地双防各+1'],
 [[11],'11中毒','概率成功时每回合实扣1125、失败只有攻击伤害，免异常拒绝'],
 [[48],'48两期限','三回合真实免麻痹，到期可受麻痹'],
 [[58],'58下一回合','下两回合真实双伤暴击，到期原伤，封招不授予'],
 [[3,33,521],'3解除','清负、消正和反弱均实际等级变化，正负保留分开，禁强免消与六级边界'],
 [[77],'77三回合','用招三回合120回复累积到361，满血截断，禁疗控制与到期不回'],
 [[169],'169三回合','50%害怕成功失败，真实阻止PP消耗，免疫控制及三回合到期不触发'],
 [[660,478],'660消强','消强成功回满，保护/无正能力/禁疗不回；封属当回合起两回合实际强化失败，攻击照常，到期强化恢复'],
 [[1193,1117],'1193与1117','4499半体下先制2改变行动顺序，4500及4501不触发，对手先制3仍先行'],
 [[1035],'1035两实例','疲惫/诅咒概率成功、失败及免异常失败；下两回合攻击害怕/疲惫各两随机分支、到期和失误不触发'],
 [[693,843],'693与843','下两回合按真实公式计算2.5倍攻击伤害；先制2使低速先手，到期恢复，封招无收益'],
 [[786,1116],'786随机','每次真实附加两种异常，一次免疫只挡一个；1116完全失败才消回合，免断保留'],
 [[1001],'1001两实例','两实例对手有异常全+2，无/过期异常全+1，6级封顶禁强不加'],
 [[971],'971两实例','4499吸6000，4500及4501吸3000，实际HP差；四回合期限、控制禁疗与免伤'],
 [[191],'191四回合','两个实例免疫反弹麻痹，双方免异常无异常，四回合到期'],
 [[813,1260],'813双倍','负攻-2转对手-4并清己方负攻，正防保留；1260实际反馈成功才三回合免弱，免弱/-6失败不给免弱'],
 [[933],'933两实例','未击败授予后续两次攻击必暴，属性保留、攻击失误消费，命中实际双伤，击败不授予'],
 [[1361],'1361消强','消強回满或无强化封技能回复两回合；保护失败不错误封回复，禁疗不回，到期恢复4500'],
 [[921],'921五倍','实际五倍攻击与同随机浮动对照符合取整；失败封属两回合真实不强化、到期恢复，失误不触发'],
 [[683,450],'683与450','真实随机233/366两端及全范围、固伤实际扣HP/回复实际加HP，免伤禁疗，满血截断和残血'],
 [[1304],'1304下两回合','物攻特攻下两回合忽略20%双防实际增伤，暴击仍增伤、到期与封招失败'],
 [[857],'857先手','先手100%全-1，后手50%成功失败，免弱与-6下限'],
 [[1297],'1297消回合','诅咒参数按格式化来源三级依赖：消回合成功后诅咒，诅咒被一次免异常挡住则实际吸3000；无可消/免断不吸，禁疗只伤不回']
 ])for(const id of ids)map[id]=[ref(term,assertion)];
for(const id of [1260,1304])map[id].push(ref('1260免弱实际','1260免弱实际阻止对手命中-1，到期恢复；1304实际被清回合后伤害与无忽防对照一致'));
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3665 source/state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};let refs;
 if(e.kind==='move'){r.rationale='真实来源的自身27招，全部技能及有序实例保留，无隐藏/伙伴/觉醒技能缺口。';r.singleBehavior=`${e.raw.name}原始PP、分类威力、命中暴击及先制`;refs=[ref('基础27招真实','27招逐招实际PP消耗，零PP拒绝原状态不变，控制和封招无状态收益'),ref('基础27招原始','按原始分类威力及属性计算实际HP，暴击双伤、行动顺序和失误')];}
 else if(e.kind==='soul'){r.scope='mixed';r.rationale='魂印951及hash单独保存。格式化说明限定攻击伤害增减，受击前体力分支、15%秒杀和当前对手击败的一层已实现；原文“自身每击败一只精灵”的跨后继对手应用需要下一只对手出场机制。';r.singleBehavior='当前双方：攻击伤害增加20%、攻击减伤20%、命中攻击15%秒杀，受击前满血则下回合先制3、非满血回最大体力1/3；当前击败增加一层10%/10%/3%参数。';r.deferredBehavior='原文自身每击败一只精灵的累计增伤、减伤、秒杀概率在后继对手出场后的保留、再次生效与连续击败叠加；当前击败加层已实现。';r.trigger='当前对手被击败后下一只对手出场，之后继续击败其他对手';r.futureMechanisms=['对手换宠与出场事件','跨出场累计击败层数','按每名实际出场对手重置单次击败记账'];r.implementation=['dist/soul-registry.js','dist/souls.js'];refs=[ref('魂印攻击增减','真实攻击分别1.2/.8倍而额外固伤保持不变，魂印版本951选择'),ref('魂印受击前','9000受击不回且下回合实际先制3，8999/6000受击回3000截断，技能禁疗不阻魂印，致死不回'),ref('魂印受击不含','属性、失误和独立固伤不触发，真实多段攻击逐次按受击前体力触发'),ref('魂印15概率','秒杀成功HP归0，失败只有攻击伤害；攻击和粉伤击败均只累计一层，重开清零'),ref('完整虚无异界','完整属性技能吸体力、全强化、先制与忽防；第五异常失败吸体力和下一次必暴组合')];}
 else if(e.raw.instance.id===910){r.scope='multiplayer';delete r.implementation;r.rationale='原文当回合击败对手后施加两回合封属，当前被击败精灵已无法行动，封属后继对手须出场/换宠机制；保留来源原文而不改写。';r.deferredBehavior=e.raw.instance.description;r.trigger='本回合击败对手后，敌方后继出场精灵承接两回合封属';r.futureMechanisms=['击败事件','对手后继出场','跨出场属性技能失效时序'];}
 else{r.rationale=`来源“${e.raw.instance.description}”，参数${JSON.stringify(e.raw.instance.args)}属于当前双方行为。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
 if(refs)r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3665-review-audit.json',JSON.stringify({species:3665,status:'awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'pet.advance=null、单魂印951，无额外激活和伙伴效果；没有自身强化被延期。魂印当前击败加层已实现，仅后继对手出场承接层数和910击败后封属延期。',semanticEvidence:{soul:s.souls[0].semanticResolution,effect1297:require('./3665-source-check-external.json').records.find(r=>r.url.endsWith('/skill_effect_type/1297')),legacyScope:'诅咒23采用本次核对的来源嵌套触发分支；3577已完成的疲惫7分支和测试保持原状，本次没有改写其认证。'},failures:[{log:'research/3665-source-check-external.json',reason:'191及843请求各一次HTTP545非JSON，保存失败并从断点重试均成功，所有来源现已齐全。'},{log:'research/3665-targeted-initial.log',reason:'1035免异常失败未给予后续攻击异常补偿；1297诅咒参数仍沿用旧分支。保留失败断言修复。中毒失败夹具误把一回合到期视为未触发，693倍率比较在小伤害取整误差超1，分别改用事件确认证据与完整伤害公式精确断言。'}]},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
