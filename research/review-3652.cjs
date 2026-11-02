'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('../data/species/3652.json').snapshot,reviews=require('../SINGLE-STAGE-REVIEWS.json'),items=policy.inventory(s);
const names=fs.readdirSync('tests').filter(f=>/^deployed-3652.*\.test.cjs$/.test(f)).flatMap(f=>[...fs.readFileSync('tests/'+f,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file:'tests/'+f,name:m[1]})));
const ref=(term,assertion)=>{const n=names.find(n=>n.name.includes(term));assert.ok(n,term);return {...n,assertion};},map={};
for(const [ids,term,assertion]of [
 [[4,5],'属性4与5','每个有序实例真实等级改变、概率成功失败、±6截断和禁强免弱；机械改良含速度与命中真实各+1'],
 [[40],'40先手','先手真实双威力伤害、后手原伤与免伤零损血'],
 [[48,47],'48两期限','两免异常期限及四回合免弱真实拒绝异常/负命中，到期恢复'],
 [[54],'54两回合','攻击两回合半伤与固定30减至15，到期全伤'],
 [[58],'58下一回合','下两回合真实暴击双伤，当前不增、到期正常，封招无授予'],
 [[56],'56复制','复制对手电属性影响真实受伤克制、五回合恢复原类型，清回合立即恢复，封招不改'],
 [[3,33,521],'3解除','负攻-6清零或反6、消正防2保留负攻，无状态不改，保护/禁强不改'],
 [[29,93],'29确定','固定30及15%概率100实际扣HP，概率未触发零追加，免伤与残血'],
 [[43],'43两实例','两实例半体4500真实回复，8999封顶9000，技能禁疗不回'],
 [[121],'121两种','40/80同属性概率两分支、异属性和免疫无异常，麻痹阻止实际扣PP'],
 [[85,413],'85吸强','完整机甲组装吸正攻2且保留负防，吸强前存在正能力才追加300；保护禁强不吸但条件仍成立，6级封顶免伤零损血'],
 [[694],'694只攻击','下两回合攻击必先真实改顺序，属性仍后手，到期恢复，封招不授予'],
 [[60],'60五回合','每回合实际扣200共五回合，到期无伤，免伤和封招无伤'],
 [[507],'507下回合','当前不触发，下回合249/250不回、251回满，下一回合到期；禁疗/致死不回'],
 [[585,962],'585及962','无正能力962全+2，有正能力全+1，585全+1；禁强与6级边界'],
 [[57],'57用技能','四回合使用技能每次3000，满血截断、控制禁疗与到期不回'],
 [[477],'477受攻击','三回合受攻击对手全-1至-3，属性不触发，到期停止，免弱及-6下限'],
 [[444,456],'444双方','对方各招PP1至0、自身回复1封顶；249斩杀/250及251不斩，封招不执行'],
 [[1062],'1062实际','吸强成功真实回3000扣3000，无正能力/保护/禁强化无吸血，禁疗只伤不回'],
 [[553,1355],'553暴击','暴击疲惫阻止扣PP、免疫无异常；暴击授一次免控，实际消费后可中麻痹；非暴无收益'],
 [[191],'191四回合','反弹麻痹、双方免异常均不受控，四回合到期'],
 [[1140],'1140三回合','攻击后真实瘫痪且已受攻击伤害，属性及免疫不控，三回合到期'],
 [[738],'738属性','对手属性触发下两回合封攻实际零伤；攻击不授封攻，三回合到期'],
 [[1073],'1073严格','299/300不回复、301回满并按实际回复固伤；禁疗及致死不触发，三回合到期'],
 [[843],'693与843','下两回合先制+2使低速先手，到期恢复，封招无授予'],
 [[982],'982强化','基础50%麻痹两侧，六项强化提高实际触发、免疫拒绝'],
 [[1124],'1124消回合','真实清doubleDamage后下两回合攻击2.5倍，无可消/免断不增伤，到期原伤'],
 [[1356],'1356暴击','暴击实扣最大体力三分之一3000，未暴零追加，残血扣至0与免伤零损']
 ])for(const id of ids)map[id]=[ref(term,assertion)];
for(const id of [507,1073])map[id].push(ref('伤害阈值包括','真实固定伤害251/301分别触发回复，1073按实际1301回复反击，技能禁疗与免伤均无回复'));
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3652 source/state review',reviewedAt:new Date().toISOString(),implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};let refs;
 if(e.kind==='move'){r.rationale='来源pet中的自身技能，27招全部保留；21113来源合并的速度与命中三参数组分别执行并保留原始实例。';r.singleBehavior=`${e.raw.name}原始PP、威力、分类、命中、先制及暴击执行`;refs=[ref('基础27招真实','逐招实际扣PP，零PP拒绝且原状态不变，控制和封招无效果收益'),ref('基础27招原始','27招真实威力与相性伤害、暴击倍数及行动顺序，失误不造成伤害')];}
 else if(e.kind==='soul'){r.rationale='937原魂印和1475强化魂印各自来源hash参数保留，暴击与回复仅依赖当前双方，全部属于单精灵。';r.singleBehavior=e.raw.description;r.implementation=['dist/soul-registry.js','dist/souls.js'];refs=[ref('两版魂印50','两版本随机成功/失败，强化版存在原版未暴时暴击的分支；未暴次回合真实先制与双伤且到期'),ref('两版魂印199','实际回复199/200/201严格阈值，2250/3000吸体力分别验证，满血溢出仍触发、免伤与残血'),ref('两版魂印状态','属性及失误无回复，技能禁疗不阻魂印，击败仍回实际攻击伤害一半'),ref('完整异次元','两个魂印版本完整技能吸强、暴击疲惫、次数免控及第五清回合和百分比伤害组合')];}
 else if(e.raw.instance.id===1128){r.scope='multiplayer';delete r.implementation;r.rationale='来源明确下一只出场精灵，当前对手不承接封攻。';r.deferredBehavior=e.raw.instance.description;r.trigger='当回合击败当前对手，其下一只精灵出场时攻击技能失效';r.futureMechanisms=['击败记录','下一只对手出场事件','跨出场攻击技能失效回合状态'];r.dependencyEvidence=[{kind:'next-entry',quote:'下一只出场精灵'}];}
 else{r.rationale=`来源“${e.raw.instance.description}”参数${JSON.stringify(e.raw.instance.args)}可由当前双方触发。`;r.singleBehavior=e.raw.instance.description;refs=map[e.raw.instance.id];assert.ok(refs,e.key);}
 if(refs)r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]));reviews.entries[e.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3652-review-audit.json',JSON.stringify({species:3652,status:'awaiting-gate',source:s.source,inventory:items,coverage,partnerReview:'保留937/1475两个魂印版本分别测试；pet.advance=null，无激活道具或伙伴附加效果，27招均保留。只有1128下一只出场攻击失效延期。',failures:[{log:'research/3652-targeted-state-initial.log',reason:'1062吸强失败仍吸血和507技能回复绕过禁疗；保留失败断言修复。夹具误用技能威力与攻击基础伤害、瘫痪随机一回合到期，按真实数据修正夹具。'},{log:'research/3652-damage-reaction-failure.log',reason:'507/1073原实现只受攻击伤害触发，来源没有攻击限制；补齐固定/百分比伤害接收路径，沿用反伤不递归的上下文标记。'},{log:'research/3652-targeted-state-second.log',reason:'魂印比较去掉魂印导致随机数耗用不同，阈值夹具误设特攻；改为相同魂印随机流及实际物攻，保留伤害倍率和阈值断言。'}]},null,2)+'\n');console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
