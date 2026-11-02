'use strict';
// Produces a reviewable design, not an executable 2074 rule or validation waiver.
const fs=require('fs'),crypto=require('crypto');
const catalog=require('../status-database.cjs'),{inspectNonRestricted}=require('../status-pool-candidates.cjs');
const effect=require('./effect-2074-report.json');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source=catalog.database.sources['wiki-mechanics'];
const userPolicy={kind:'user-requested-design',source:'本次用户指令第4项',gameSourceConfirmed:false};
const design={schemaVersion:1,effectId:2074,status:'design-only-needs-source',runtimeConnected:false,
 sourceDefinition:{originalDescription:effect.definition.originalDescription,sourceUrl:effect.definition.sourceUrl,hash:effect.definition.hash,argsNum:effect.definition.argsNum,param:effect.definition.param},
 sourceCatalog:{file:'data/statuses/statuses.json',sha256:hash('data/statuses/statuses.json'),wiki:source,enum:catalog.database.sources['seerapi-status-enum']},
 separation:{sourceFacts:'状态分类只接受已缓存原文支持的事实，未知保持null；其它随机效果不作为2074池证据。',requestedPolicies:'以下动态全池、等概率及max合并是本次用户要求的接入方案，不能据此改写Wiki来源或通用状态叠加字段。',runtime:'此次仅数据层和只读分类查询；不注册2074、不调用战斗引擎、不推进3667。'},
 policies:{
  pool:{...userPolicy,selection:'从数据库全部记录动态生成；不写死状态ID、名称或数量，不因有益/有害、是否控制行动筛选。',predicate:'classification.isAbnormal === true && classification.isRestrictedClass === false && classification.restrictsSwitching === false',exclude:'任一明确不是异常、属于限制类或禁止换宠则排除；限制类与禁止换宠分别判断。',unknown:'需要的任一分类字段为null时登记unresolved，完整池为null，不将!==true当成false；不得以已确认子集静默替代完整池。',queryModule:'status-pool-candidates.cjs:inspectNonRestricted'},
  distribution:{...userPolicy,kindOfDistribution:'uniform',perDrawProbability:'1 / N',index:'floor(u * N)，u为[0,1)均匀随机数',rng:'未来使用战斗可复现随机数，不用Math.random；非法随机值或空池必须报告失败，不回退固定状态。',multipleDrawReplacement:null,existingStatePreFilter:false,existingStatePreFilterReason:'用户要求已有同状态合并时长，因此不能仅因已有该状态将其从候选中删除。'},
  durationMerge:{...userPolicy,scope:'仅未来2074重施同名状态；不能修改其它效果的持续时间策略，也不代表所有状态允许刷新。',rule:'max',newEnd:'currentRound + sourceConfirmedNewDuration - 1',oldActive:'oldEnd >= currentRound',result:'oldActive ? max(oldEnd, newEnd) : newEnd',noStacking:'不相加，不因较短新时长缩短已有状态。',unknownNewDuration:'返回needs-source且不改变旧状态；不能使用旧1–3回合实验默认值补齐。',examples:[{round:10,oldEnd:12,newDuration:2,resultEnd:12},{round:10,oldEnd:12,newDuration:5,resultEnd:14},{round:10,oldEnd:9,newDuration:2,resultEnd:11},{round:10,oldEnd:12,newDuration:null,resultEnd:null,status:'needs-source-preserve-old'}]}
 },
 plannedFlow:[
  '加载已审核分类快照，绑定数据库内容hash、Wiki revision/hash和SeerAPI效果hash；将来重开局使用新版本，进行中的对局固定原版本。',
  '对2074实例参数沿用既有编译/验证规则，绝不通过放宽验证器接入。检查完整池、各候选真实状态处理器、来源时长和多次抽样策略是否齐备；缺项则明确阻塞。',
  '调用inspectNonRestricted动态生成池。任何unresolved导致poolIds=null；确认空池也是明确错误，不静默跳过效果。',
  '在完整池中每次等概率抽样。超过1种时的放回/去重及失败补抽策略尚未确认，不擅自选择算法。已有同状态保留在候选中。',
  '通过status-rules公共免疫/抗性/反弹入口尝试施加；免疫失败不改旧时长，反弹后在实际接收者上判断同名状态。',
  '计划在公共状态写入处新增可选合并策略，只有2074显式请求max；完成门禁后再合并。抗性窗口仍按新效果原始时长处理，不能先合并后意外延长抗性免疫；该交互需专项验证。',
  '记录抽样集合版本、抽中ID、输入时长、旧/新结束回合、免疫/反弹结果与合并策略出处，供回放和审核。'
 ],
 unresolved:{completeCandidateMembership:null,defaultDurations:null,multipleDrawReplacement:null,retryAfterImmunity:null,applicationOrder:null,effectLevelTriggerProbability:null,relationToActual2074GamePool:'用户要求的动态全池设计尚不构成2074真实游戏候选集合已确认；保留既有专项研究阻塞。'},
 currentClassification:inspectNonRestricted(),
 futureTests:['动态增删或重新分类能改变新局池，旧局版本固定；不按控制/收益过滤。','每个等宽区间选中对应成员，0及接近1边界正确；空池、未知分类不抽样。','同名较短、较长、相等及已过期时长；新时长null保持旧状态且报告待核实。','免疫不刷新旧状态，反弹只合并实际接收方，次数消费和抗性窗口长度不受max误影响。','多次抽样、去重/放回、数量超池、失败重抽及应用顺序在规则确认后覆盖；不能用单次抽样测试认证多种词条。','每个池成员真实行为覆盖成功/失败/边界/交互，未实现成员不能悄悄删去以通过验证。'],
 exclusions:['3667专属逻辑','3670及后续导入','战斗引擎和状态运行时修改','验证器及自动化修改']};
fs.writeFileSync('research/status-pool-2074-design.json',JSON.stringify(design,null,2)+'\n');
console.log(JSON.stringify({status:design.status,classification:design.currentClassification.status,excluded:design.currentClassification.excluded.map(x=>x.name),unresolved:design.currentClassification.unresolved.length}));
