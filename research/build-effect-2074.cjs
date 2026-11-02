'use strict';
const fs=require('fs'),crypto=require('crypto');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const local=require('./effect-2074-local.json'),live=require('./effect-2074-sources.json');
const api=live.records.find(x=>x.url==='https://api.seerapi.com/v1/skill_effect_type/2074');
const rawText=r=>r.content;
function fields(text){return Object.fromEntries([...text.matchAll(/\|([^=|{}\n]+)=([^|]*?)(?=\||\}\}|$)/gs)].map(m=>[m[1].trim(),m[2].trim()]));}
const histories=[...new Set(local.wikiRevisions.map(x=>x.title))].map(title=>{const revisions=local.wikiRevisions.filter(x=>x.title===title).sort((a,b)=>a.timestamp.localeCompare(b.timestamp));const differences=[];for(let i=1;i<revisions.length;i++){const a=fields(rawText(revisions[i-1])),b=fields(rawText(revisions[i]));differences.push({fromRevision:revisions[i-1].revid,toRevision:revisions[i].revid,changedFields:[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>a[k]!==b[k]).map(field=>({field,before:a[field]??null,after:b[field]??null})),rawTextChanged:rawText(revisions[i-1])!==rawText(revisions[i]),interpretation:title==='效果:2074'?'模板字段一致，仅排版改变；未提供名单。':title==='技能:36838'?'旧词条明确使对手随机进入1种，后改写为随机附加1种；数量未变。措辞变化不证明实际机制改变。':'2074对应词条数量未变；其它字段及格式差异完整保留，不能据此推断池变化。'});}return {title,coverage:live.historyCoverage.find(x=>x.title===title)??null,revisions,differences};});
const instanceIds=local.instances.map(x=>x.skillId).sort((a,b)=>a-b);
const report={schemaVersion:1,effectId:2074,effectName:'非限制类随机异常池',effectNameIsResearchLabel:true,generatedAt:new Date().toISOString(),status:'definition-unresolved',implementationReady:false,
scope:{task:'只研究2074，禁止接入战斗引擎、修改验证器或恢复3667开发。',scan:local.summary,localInventory:'research/effect-2074-local.json',currentReverseIndexSkillIds:api.data.skill.map(x=>x.id),allDiscoveredInstanceSkillIds:instanceIds,coverageLimit:'覆盖本地扫描范围与SeerAPI当前反向索引；没有穷尽互联网、服务器历史或已删除/隐藏的Wiki修订。当前6招不能表述为所有历史时期仅有6招。',outsideJsonSearch:{command:'rg --no-ignore -l 2074 . -g *.cjs -g *.js -g *.md -g !node_modules/** -g !research/** -g !data/**',matches:['PROGRESS.md'],meaning:'扫描范围外的代码/文档未发现其它实例；不以代码或审核结论作为池定义。'},excludedLocalAuditEntries:local.unclassifiedArguments.map(x=>({file:x.file,pointer:x.pointer,reason:'既有阻塞审核记录，是对28684[2]的引用，不是新的来源实例。'})),prohibitedInference:'没有借用其它随机异常效果的名单，没有用异常全集减去限制类，没有从当前引擎实现反向认证2074。'},
definition:{originalDescription:api.data.info,analyzeInfo:api.data.analyze_info,argsNum:api.data.args_num,param:api.data.param,pveEffective:api.data.pve_effective,hash:api.data.hash,sourceUrl:api.url,loadedAt:api.loadedAt,rawSha256:api.sha256,sourceDefinitions:local.definitions,tag:{id:813,name:'施加异常',hash:live.records.find(x=>x.data.id===813).data.hash,interpretation:'通用分类标签，不是异常成员枚举。'}},
instances:local.instances.map(x=>({...x,wikiHistoryTitle:'技能:'+x.skillId,historyRetrieved:histories.some(h=>h.title==='技能:'+x.skillId),parameterInterpretation:{position:0,meaning:'要求附加的异常种数',observedValue:x.args[0],notEstablished:'该数字不表示概率、异常编号或持续回合；观察到1/2不代表合法值域仅限1/2。'}})),
versionHistory:{seerapi:{distinctDefinitionHashes:[...new Set(local.definitions.map(x=>x.hash.replace(/^seerapi:/,'')))],representations:local.definitions.length,interpretation:'三种保存结构共享同一来源hash：完整API、裁剪缓存、规范化快照；不是三个语义版本。28684旧缓存与本次返回同hash22a33449；其余五招本地只取得本次版本。未取得SeerAPI服务端的更早2074版本，不能断言历史从未改动。'},bwiki:histories,unretrieved:['技能:37654','技能:38191']},
confirmedFacts:[
{id:'F1',claim:'2074原文为随机附加{0}种非限制类异常状态，只有一个数量参数；API param为null，未附异常枚举。',evidence:['definition.sourceDefinitions','效果:2074 revisions 317567/344532']},
{id:'F2',claim:'当前6招实际参数分别为28684[2]、36838[1]、37445[2]、37491[1]、37654[1]、38191[2]；各招friend_skill_effect均为空。',evidence:['instances','research/effect-2074-sources.json']},
{id:'F3',claim:'BWIKI技能36838修订226907明确写使对手随机进入1种非限制类异常状态。该历史文本可确认此招文字描述的施加对象，不等同于2074全部交互规则已确认。',evidence:['https://wiki.biligame.com/seer/index.php?oldid=226907']},
{id:'F4',claim:'效果页的两次可见修订仅排版不同；已取得四招技能页的旧/新文本，2074对应的1种或2种未改变，未列出具体异常。',evidence:['versionHistory.bwiki']},
{id:'F5',claim:'SeerAPI pve_effective=false，analyze_info带iconHit，tag813为施加异常。这些是来源元数据；没有据此补造命中、免疫或概率实现。',evidence:['definition']}
],
reasonableHypotheses:[
{id:'H1',claim:'“2种”从字面倾向表示两个不同类型。',basis:'2074自身原文及参数[2]实例。',notConfirmed:'不能区分无放回抽样、重复后重抽、先过滤已有状态等算法，也不保证免疫后最终得到两种。',usableForImplementation:false},
{id:'H2',claim:'六招引用同一效果ID且只传数量，可能共享内部池定义。',basis:'2074自身六个实例。',notConfirmed:'不能排除按技能、年代、目标或服务器版本分支；没有名单证据。',usableForImplementation:false}
],
candidatePool:{status:'unconfirmed',confirmedMembers:null,namedCandidates:[],literalConstraint:'非限制类异常状态',candidateSets:[{label:'2074实际使用的、满足原文非限制类条件的异常集合',members:null,evidenceLevel:'成员尚无证据',basis:'仅2074模板；这不是“所有非限制类状态”的等式。',eligibleForRuntime:false}],explanation:'暂无可由2074直接证据提名的具体异常。留空表示未知，不表示空池或无效果。未从其它随机异常效果推导。'},
noEvidence:[
'具体异常名称/ID，以及集合是否穷尽所有非限制类状态；非限制类不能直接等同非控制类。',
'各成员选择权重、是否等概率、效果独立触发概率；没有百分比文本不等于确认100%。',
'抽样是否放回、重复处理、已有异常/免疫状态是否在抽取前过滤、失败是否重抽补足。',
'各异常持续回合及抽中后的施加顺序、共存/覆盖规则、抗性/免疫/反弹交互。',
'是否随技能、游戏版本、模式改变候选集合；未取得更早SeerAPI服务端版本。',
'37654与38191的BWIKI历史、讨论页或站内其它含2074的数据，因HTTP567未完成直接查询。'
],
sourceAccess:{successfulRequests:live.records.length,historyCoverage:live.historyCoverage,failures:live.failures,cooldown:live.cooldown,pending:live.pending,rawFile:'research/effect-2074-sources.json',indexedCorroboration:{url:'https://wiki.biligame.com/seer/效果:2074',revision:344532,retrievalMode:'web search indexed result (not fresh direct HTTP)',observedSkillIds:[28684,36838,37445,37491,37654,38191],pageBodyHash:null,note:'搜索索引展示与API一致的六招；未将其当作已完成后两招历史抓取。'},historyDiscovery:{url:'https://pypi.org/project/seerapi/106.4.1/',observation:'官方客户端公开说明展示get/list资源方法，未从本次检索确认2074历史版本查询接口；SDK发布版本不是2074数据版本。',status:'historical-data-endpoint-not-established'}},
nextEvidenceNeeded:['冷却结束后续查37654/38191历史及效果讨论页，保留修订和全文。','需要明确绑定2074的池表、版本化实现说明或可复核原始实验；出现单个异常只能证明它可出现，不能证明完整名单或均匀概率。','需独立确认权重、去重、持续回合和施加失败规则，才能设计可执行公共池定义。'],
delivery:{battleLogicChanged:false,validatorChanged:false,species3667Started:false,batchResumed:false,battleTestsRun:false,reason:'纯资料研究，完整性检查不是战斗行为测试或single-stage认证。'},
sourceManifest:[...new Set(['research/effect-2074-local.json','research/effect-2074-sources.json',...local.definitions.flatMap(x=>x.sources.map(s=>s.file)),...local.instances.flatMap(x=>x.sources.map(s=>s.file)),...local.wikiRevisions.flatMap(x=>x.sources.map(s=>s.file))])].map(file=>({file,sha256:sha(fs.readFileSync(file))}))};
fs.writeFileSync('research/effect-2074-report.json',JSON.stringify(report,null,2)+'\n');console.log({instances:report.instances.length,wikiRevisions:local.wikiRevisions.length,status:report.status,sourceFiles:report.sourceManifest.length});
