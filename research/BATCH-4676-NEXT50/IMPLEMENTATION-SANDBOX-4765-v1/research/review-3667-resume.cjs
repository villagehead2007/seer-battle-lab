'use strict';
// Manual, instance-specific review of the resumed work. No completion-policy changes.
const fs=require('node:fs'),assert=require('node:assert/strict'),policy=require('../completion-policy.cjs');
const snapshot=require('./3667-reviewed-snapshot.json'),reviews=require('../SINGLE-STAGE-REVIEWS.json'),items=policy.inventory(snapshot);
const file='tests/deployed-3667-resume.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]);
const groups=[
 [[4,5],'4和5','按各实例索引、概率和等级变动值验证实际能力等级，概率成功/失败、封招、±6边界以及免弱'],
 [[3,63],'3和63','自身负面归零、正面保留；63使对手实际下降，免弱下对手不降，封招保留原负面'],
 [[22],'22疲惫','明确两回合控制不扣PP，第三回合恢复攻击并扣血；次数免疫消费、反弹和封招'],
 [[33,1099],'33和1099','消正面保留负面；1099仅成功消强授予1次免疫，随后真实消费并允许再次施加麻痹；无强化和封招不授予'],
 [[585],'585两组','分别断言[0,1,1,1,1,0]与[1,1,1,1,1,1]能力向量、负面等级叠加、+6上限及封招'],
 [[77,57],'77和57','逐回合真实回复180或最大体力1/3，到期停止；受控不触发、技能禁疗、体力上限与封招'],
 [[433,448],'433和448','持续三回合能力向量累加，第四回合不再变化；±6限幅、免弱与封招'],
 [[619,843],'619和843','自身+2/对手-1均从下一回合生效两回合，真实行动顺序逆转后恢复，封招无计时'],
 [[1167],'1167实际','负面归零并HP1000回满9000，正面保留；无负面不回、禁疗只解弱、封招不解不回'],
 [[726],'726仅封','下两回合对手先手攻击扣PP但不造成伤害，到期恢复；后手攻击和属性施加不封'],
 [[191],'191两期限','分别验证3/4回合反弹窗口、真实状态接收者、双向反弹停止、到期恢复施加及封招'],
 [[683],'683随机','实际伤害分离红伤后覆盖150至300全部151整数值，残血归零、免伤及封招'],
 [[494],'494无视','对手+6特防不降低伤害且强化保留，与无该效果对照；负特防仍增加伤害，封招无伤害'],
 [[1070],'1070仅对手','用真实先后手验证对手0/+1无额外先制，-1/-6才加先制'],
 [[976],'976消回合','清除真实回合效果保留能力等级，只有成功消除才得一次封属，攻击保留次数、属性扣PP消费且无法施加麻痹'],
 [[408],'408三回合','三回合真实攻击及固定伤害减100，到期恢复；低伤归零，封招不登记'],
 [[439],'439仅自身','仅自身异常或负面时造成200固定伤害，五回合期限、免伤和清除条件后停止'],
 [[511],'511威力','真实概率成功失败；4499/4500严格半血边界增加概率，独立威力公式及随机浮动算例核对，封招无伤害'],
 [[1242],'1242失败','未触发25/50累计、概率100%时三倍实伤、成功清累计；未命中保留累计、封招无新增累计'],
 [[681],'681下两回合','下一回合开始两回合必中必暴，实际暴击双伤、对抗必失、到期恢复、封招仍无伤害']
];
const byId=new Map(groups.flatMap(([ids,term,assertion])=>ids.map(id=>[id,{term,assertion}])));
let added=0;
for(const entry of items){
 if(entry.kind!=='skill'||reviews.entries[entry.key])continue;
 const mapping=byId.get(entry.raw.instance.id);if(!mapping)continue;
 const name=names.find(n=>n.includes(mapping.term));assert.ok(name,mapping.term);
 const ref={file,name,assertion:mapping.assertion};
 const review={sourceDigest:entry.sourceDigest,scope:'single',reviewedBy:'Codex 3667 resumed instance review',reviewedAt:new Date().toISOString(),rationale:`来源“${entry.raw.instance.description}”针对当前双方，无队伍、换宠、场下依赖。有序参数${JSON.stringify(entry.raw.instance.args)}；仅认证本实例，不代表整只精灵完成。`,singleBehavior:entry.raw.instance.description,implementation:['dist/effect-registry.js','dist/range-effects.js','dist/souls.js','dist/status-rules.js','dist/type-rules.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,[ref]]))};
 assert.deepEqual(policy.checkReview(entry,review,process.cwd()),[]);reviews.entries[entry.key]=review;added++;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
const coverage=policy.reviewCoverage(snapshot,reviews);
const previousFile='research/3667-review-audit-before-resume.json';if(!fs.existsSync(previousFile))fs.copyFileSync('research/3667-review-audit.json',previousFile);
const audit={species:3667,status:'blocked-single-stage',updatedAt:new Date().toISOString(),moves:23,effectInstances:44,soulVersions:snapshot.souls.map(s=>({id:s.id,hash:s.hash})),total:coverage.total,verifiedReviews:coverage.total-coverage.missing.length-coverage.stale.length,addedReviews:added,missing:coverage.missing.map(e=>({key:e.key,kind:e.kind,effectId:e.raw.instance?.id,description:e.kind==='soul'?e.raw.description:e.raw.instance?.description})),stale:coverage.stale.length,
 blockers:[
  {key:'3667:skill:28684:1',effectId:2074,status:'public-pool-connected-member-behaviors-partial',reason:'项目确认的39候选、等概率、1–3回合与max刷新已接入真实伙伴技能；16项成员只有施加/计时及pendingStatusBehaviors，缺少自身状态行为。不得缩池、按登记成功放行或作为多精灵延期。',missingStates:['衰弱','山神守护','易燃','束缚','失神','沉默','臣服','星赐','超频','沸涌','砥砺','星赎','空定','狂信','雷解','魇昧'],evidence:['research/effect-2074-report.json','dist/status-catalog.js','tests/deployed-3667-resume.test.cjs']},
  {key:'3667:skill:26258:2',effectId:1348,status:'needs-source',reason:'SeerAPI hash52ea44b4及BWIKI349330均只说明随机2种异常；现有公共反应仍用六状态池，不能从2074的独立用户规则推导1348。池、默认时长仍未确认。'},
  {key:'3667:skill:17083:0',effectId:470,status:'runtime-tested-source-incomplete',reason:'4回合30%睡眠附加的触发、概率、控制与免疫已测试；所附加睡眠的默认持续时间未明示，公共调用仍用legacy-experimental-1-3，不能认证为真实时长。'},
  {key:'3667:soul:955',status:'runtime-implemented-source-incomplete',reason:'已接入299/300/301受击分支、PP下限、下次增减伤消费及公共睡眠；睡眠默认持续时间未知。首回合按原文每回合开始30+10得到40%，但未找到独立时序实测，保留待核实且不登记整版完成审核。',implementation:'dist/soul-registry.js',tests:'tests/deployed-3667-soul.test.cjs'},
  {key:'3667:soul:1935',status:'needs-source-and-implementation',reason:'完整保留强化魂印cc25b75e及参数；PP吸取没有现成公共接口。API/BWIKI未说明自身回复各槽位的分配及对手零PP时的行为，eid_effect仅返回8参数数量；不猜造槽位对应或回复量，不以仅扣PP代替吸取。该版本仍未注册。另有睡眠默认时长与触发成功判定待核实。'}
 ],
 classification:items.map(e=>({key:e.key,scope:'single',basis:'原文仅涉及当前双方；伙伴追加技能和强化魂印是自身能力，不按名称延期。'})),
 deferredMultiplayer:[],deployment:{status:'not-deployed',reason:'强化魂印1935未注册，且上述单精灵依赖未完成；保留研究快照，不生成正式已部署文件。'},notStarted:[3670,3672,3673,3679],previousAudit:previousFile,
 sourceEvidence:['research/3667-source-check-external.json','research/3667-semantic-sources.json','research/3667-source-manifest.json','research/3667-resume-source-check.json'],
 notes:['正式完成仍17只，游标停3667。','所有已确认属性/状态操作复用公共系统，无3667属性表或状态实现。','本轮未修改验证器、自动化、AGENTS.md或已完成精灵。','所有测试只认证具名分支；470、2074和955运行时测试不能豁免来源/成员行为缺口。']};
fs.writeFileSync('research/3667-review-audit.json',JSON.stringify(audit,null,2)+'\n');console.log({added,verified:audit.verifiedReviews,total:coverage.total,missing:coverage.missing.map(e=>e.key),stale:coverage.stale.length});
