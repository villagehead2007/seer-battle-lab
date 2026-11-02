'use strict';
const fs=require('node:fs'),crypto=require('node:crypto');
const now=new Date().toISOString(),db=require('../data/statuses/statuses.json'),sources=require('./public-status-expansion-sources.json');
const record=sources.records.find(r=>r.data.query?.pages&&Object.values(r.data.query.pages).some(p=>p.title==='对战机制'));
const page=Object.values(record.data.query.pages).find(p=>p.title==='对战机制'),revision=page.revisions[0],content=revision.slots.main['*'];
const evidence={url:'https://wiki.biligame.com/seer/index.php?oldid='+revision.revid,revision:revision.revid,sha256:crypto.createHash('sha256').update(content).digest('hex'),loadedAt:record.loadedAt,cache:'research/public-status-expansion-sources.json'};
const states={
 '衰弱':{implemented:[],pending:['衰弱回合数指剩余、初始还是已持续回合尚无独立说明；不据此选择倍率档位']},
 '山神守护':{implemented:[],pending:['仅有枚举名，没有状态描述或数值规则']},
 '易燃':{implemented:['攻击技能命中率乘0.7，属性技能不受影响；与混乱相乘','火攻击命中产生有来源指针的待核实转化记录'],pending:['烧伤转化持续时间及免疫门禁','双属性含火是否算火系攻击']},
 '束缚':{implemented:['先制等级最终置0，覆盖正负先制和超频加成','公共清除及自然到期扣自身最大体力1/8百分比伤害，经过抗性与免伤'],pending:['旧专属代码直接改写ailments的路径不在此次授权改动；需后续公共清除接口迁移审计']},
 '失神':{implemented:['属性技能50%失效，仍消耗PP；攻击不受影响'],pending:[]},
 '沉默':{implemented:['每回合扣最大体力1/8百分比伤害','按技能真实fifth标记封锁第五技能，仍扣PP，普通技能可用'],pending:[]},
 '臣服':{implemented:['阻止对外攻击、固定和百分比伤害，不阻止真实伤害和自身伤害'],pending:['历史持续伤害没有统一保留施加者，需要后续来源归属审计']},
 '星赐':{implemented:['攻击伤害乘1.3'],pending:['每回合结束恢复2点PP的目标槽位分配未明确；不猜成每槽或总计']},
 '超频':{implemented:['技能先制+1；被束缚覆盖','行动开始恢复所选技能全部PP，随后仍遵守控制和正常PP消耗','结束转化记录保留范围1~2'],pending:['1~2回合的分布与转化免疫规则']},
 '沸涌':{implemented:['攻击伤害下限为最大体力30%，暴击50%；公共减伤/免伤仍处理，臣服不绕过'],pending:['下限与各类伤害限制交互顺序采用既有公共引擎契约，尚非来源完整认证']},
 '砥砺':{implemented:[],pending:['执行过附加异常效果须覆盖概率未触发、免疫及魂印各路径；现有仅ailment调用不能证明该条件，暂不发放80%体力']},
 '星赎':{implemented:['体力恢复乘1.3，保留技能禁疗和上限','回合末自身非限制状态剩余时间+1；按用户确认的限制类只有瘫痪/凝滞，包含星赎自身，不改原Wiki冲突'],pending:['与同一回合其它结束事件的全局精确顺序沿用既有引擎契约']},
 '空定':{implemented:['无法行动且不扣PP','结束记录沉默明确2回合'],pending:['转化时是否重过免疫/抗性；保持待核实，不擅自施加']},
 '狂信':{implemented:['实际施加成功才绑定来源一方；已有信仰不覆盖','仅当前对手为绑定来源时控制，不扣PP；清除异常后恢复行动'],pending:['跨换宠身份/绑定存续机制不在当前双人在场模型中认证']},
 '雷解':{implemented:['按实际攻击伤害附加60%真实伤害，零伤/未命中/属性技能不触发'],pending:[]},
 '魇昧':{implemented:[],pending:['规则要求对己方隐藏双方异常及能力等级的显示；当前双人同屏无观察者身份，不能篡改真实状态或全局隐藏来代替']}
};
const audit=require('./status-system-audit.json');
for(const [name,value]of Object.entries(states)){
 const row=db.records.find(r=>r.name===name);if(row.description&&!content.includes(row.description))throw Error('来源变化 '+name);
 row.publicBehaviorReview={reviewedAt:now,status:value.implemented.length?'implemented-clauses-with-open-items':'needs-source-or-common-interface',source:row.description?evidence:null,implemented:value.implemented,pending:value.pending,defaultDurationTurns:null,commonLifecycle:'显式时长、公共免疫/抗性/反弹、clear/expire；未声明通用默认时长或完整来源认证。',tests:'tests/status-expansion.test.cjs'};
 const a=audit.records.find(r=>r.name===name);a.publicExpansion=row.publicBehaviorReview;
 if(value.implemented.length){a.observedBehavior.push(...value.implemented.map(text=>({file:'dist/status-rules.js',text,review:'research/public-status-expansion-review.json'})));a.assessment='public-clauses-implemented-partial';}
}
const sleep=db.records.find(r=>r.name==='睡眠');sleep.durationReview={checkedAt:now,status:'default-duration-unconfirmed',defaultDurationTurns:null,evidence,confirmed:'无法行动；对手攻击未MISS解除；来源未给出通用默认时长。',effectScoped:[{effectId:2074,range:[1,3],distribution:'uniform',sourceType:'project_rule/user_confirmed'}],compatibility:{policy:'legacy-experimental-1-3',isSource:false},unknown:['默认时长','非2074效果的时长分布','同名状态通用刷新规则']};
fs.writeFileSync('data/statuses/statuses.json',JSON.stringify(db,null,2)+'\n');audit.latestFollowUp='research/public-status-expansion-review.json';fs.writeFileSync('research/status-system-audit.json',JSON.stringify(audit,null,2)+'\n');
const old1348=require('./random-effect-pools.json').records.find(r=>r.effectId===1348);
const poolConfig={schemaVersion:1,updatedAt:now,effects:{
 '2074':{status:'confirmed-project-rule',ruleRef:'data/statuses/project-rules.json#effect2074'},
 '1348':{effectId:1348,status:'needs-source',candidatePool:null,distribution:null,duration:null,retryAfterImmunity:null,sourceUrls:old1348.sourceUrls,apiHash:'52ea44b4',wikiRevision:349330,evidence:'research/public-status-expansion-sources.json',description:old1348.originalDescription,confirmed:{trigger:'对手使用属性技能后，在所设持续回合内触发',countParameter:1,windowParameter:0,fallback:'未触发则消除对手回合类效果'},unconfirmed:['候选成员','是否与任何已定义池共用','单项持续时间','概率分布','部分免疫时未触发的判定'],legacyObservation:{code:'dist/souls.js 对手属性后随机异常清回合',members:['麻痹','烧伤','害怕','疲惫','睡眠','冰封'],authoritative:false,note:'保留旧行为用于兼容；不是新确认配置，不从2074推导。'},historicalInstances:old1348.historicalInstances}
 }};
fs.mkdirSync('data/random-pools',{recursive:true});fs.writeFileSync('data/random-pools/effects.json',JSON.stringify(poolConfig,null,2)+'\n');
const pp={status:'source-incomplete-not-implemented',sourceType:'seerapi-and-bwiki',soulId:1935,soulHash:'cc25b75e',eid:2348,eidHash:'f2247cc6',args:[300,1,300,2,50,0,100,1],sourceUrls:['https://api.seerapi.com/v1/soulmark/1935','https://api.seerapi.com/v1/eid_effect/2348','https://wiki.biligame.com/seer/index.php?oldid=320469'],evidence:'research/public-status-expansion-sources.json',confirmed:{trigger:'对手使用攻击技能后',low:{comparison:'<=',threshold:300,opponentAmountPerMove:1},high:{comparison:'>',threshold:300,opponentAmountPerMove:2},opponentScope:'所有技能',basicPP:'选择技能要求可用PP；正常使用消耗1；回复不得超过最大PP。'},unconfirmed:{ownRecoveryDistribution:null,ownRecoveryAmount:null,opponentZeroPPBehavior:null,ownFullPPBehavior:null,skillSlotCorrespondence:null,missOrInvalidAttackBehavior:null,multiHitAggregation:null,ppPreventionInteraction:null},implementationDecision:'不实现猜测的吸取；未来独立公共接口应区分请求量、实际扣除量、实际恢复量与失败原因，先核实分配/失败规则。'};
fs.writeFileSync('research/pp-absorption-review.json',JSON.stringify(pp,null,2)+'\n');
const review={updatedAt:now,evidence,sourceComparison:'新Wiki388666与原388558的目标状态描述逐字一致，新增页面段落不涉及这些状态。原始描述、hash、revision保留。',states,scope:'common-modules-only',counts:{reviewed:16,withNewBehavior:12,noSpecificBehavior:4,fullySourceCertified:0},sleep:sleep.durationReview,random1348:'data/random-pools/effects.json#effects/1348',pp:'research/pp-absorption-review.json',notCompleted:'3667专属逻辑和审核不改；没有声明16种状态全部完成。',conventions:['持续伤害沿用回合末时序；技能失效仍扣PP。','回合结束延长先于自然到期，星赎也延长自身；限制类名由用户规则提供。','状态转化缺少时长或免疫规则则记录pendingStatusTransitions，字段为null时不发明默认值。']};
fs.writeFileSync('research/public-status-expansion-review.json',JSON.stringify(review,null,2)+'\n');
console.log(review.counts);
