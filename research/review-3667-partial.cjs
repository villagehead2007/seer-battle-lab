'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs');
const s=require('./3667-reviewed-snapshot.json'),reviews=require('../SINGLE-STAGE-REVIEWS.json'),items=policy.inventory(s);
const files=['tests/deployed-3667.test.cjs','tests/deployed-3667-partial.test.cjs'];
const names=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]})));
const ref=(term,assertion)=>{const found=names.find(x=>x.name.includes(term));assert.ok(found,term);return {...found,assertion};};
const effects={
643:['643命中','命中三回合依次-1/-2/-3，免弱、封招和-6下限不再下降；对手消我方回合不清自身计时'],
602:['602对手','攻击后实际双攻下降，属性不触发；免弱、-6下限与先后手两回合窗口'],
493:['493用攻','攻击后下两回合真实暴击双伤，到期恢复；属性/控制不触发，后手窗口延长'],
1213:['1213四回合','每回合用招对手HP降3000，四回合到期停止；控制、免伤及真实消回合停止，残血归零'],
2161:['2161每次','三回合特防速度实际降低；免弱或两项-6才授予下一次双伤，部分成功不授予，属性保留及攻击消费'],
1362:['1362先手','先手吸300固定体力并回复实际扣量，后手不触发；残血仅吸10，满血截断、免伤与技能禁疗'],
476:['476后手','后手HP1000到1300，先手保持1000；满血上限9000、技能禁疗/封招不回'],
656:['656两实例','60%随机1项与30%随机3项均有成功失败状态；不重复抽取、封招不清PP与零PP下限']};
let added=0;
for(const entry of items){let refs,behavior;
 if(entry.kind==='move'){behavior=`${entry.raw.name}基础PP、威力分类、命中暴击与先制；逐效果独立审核，不代表整招效果已完成`;refs=[ref('基础23招真实','全部23招扣1PP，零PP拒绝保持原状态，控制/封招无伤害及强化收益'),ref('基础23招原始','按真实威力分类与属性计算HP、暴击双伤、先制顺序及未命中')];}
 else if(entry.kind==='skill'&&effects[entry.raw.instance.id]){const [term,assertion]=effects[entry.raw.instance.id];refs=[ref(term,assertion)];behavior=entry.raw.instance.description;}
 else continue;
 assert.ok(!reviews.entries[entry.key],entry.key+' already reviewed');
 const review={sourceDigest:entry.sourceDigest,scope:'single',reviewedBy:'Codex 3667 partial state review',reviewedAt:new Date().toISOString(),rationale:entry.kind==='move'?'当前双方技能基础行为；仅基础参数通过状态测试，未知效果和魂印保持缺失审核，绝不据此放行精灵。':`来源“${entry.raw.instance.description}”作用于当前双方，无队伍或换宠依赖；有序参数${JSON.stringify(entry.raw.instance.args)}。`,singleBehavior:behavior,implementation:['dist/range-effects.js','dist/souls.js',...(entry.kind==='move'?['dist/engine.js']:[])],tests:Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,refs]))};
 assert.deepEqual(policy.checkReview(entry,review,process.cwd()),[]);reviews.entries[entry.key]=review;added++;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
const coverage=policy.reviewCoverage(s,reviews);
const audit={species:3667,status:'blocked-single-stage',moves:23,effectInstances:44,soulVersions:s.souls.map(x=>({id:x.id,hash:x.hash})),total:coverage.total,verifiedReviews:added,missing:coverage.missing.map(x=>({key:x.key,...(x.kind==='skill'?{effectId:x.raw.instance.id}:{}),description:x.kind==='soul'?x.raw.description:x.raw.instance?.description})),stale:coverage.stale.length,blockers:[{key:'3667:skill:28684:1',effectId:2074,args:[2],reason:'SeerAPI 与 BWIKI 均未给出非限制类随机异常池的候选集合、抽样规则及持续回合依据；不使用现有六异常池替代。',source:'https://api.seerapi.com/v1/skill_effect_type/2074',hash:'3c24dbfb',bwikiRevision:344532}],deferredMultiplayer:[],notStarted:[3670,3672,3673,3679],notes:['仅基础行为23项和8类新效果的9实例已有真实状态测试。其余35实例及两版魂印尚未完成审核/验证。','未本地部署；等待2074语义证据，正式游标不推进。','伙伴额外技能28684完整保留且属于单精灵，不能延期。'],sourceEvidence:['research/3667-source-check-external.json','research/3667-semantic-sources.json','research/3667-source-manifest.json']};
fs.writeFileSync('research/3667-review-audit.json',JSON.stringify(audit,null,2)+'\n');
console.log({total:coverage.total,verified:added,missing:coverage.missing.length,stale:coverage.stale.length});
