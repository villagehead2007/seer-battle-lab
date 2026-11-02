'use strict';
const fs=require('fs'),crypto=require('crypto'),assert=require('node:assert/strict');
const P=require('../dist/status-pools.js'),S=require('../dist/status-rules.js');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p)),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseline=json('research/effect-2074-implementation-baseline.json');
const file='research/effect-2074-report.json',report=json(file),rule=json('data/statuses/project-rules.json').effect2074;
const pool=P.pool();
function results(log){const s=read(log),n=k=>Number(s.match(new RegExp('ℹ '+k+' (\\d+)'))?.[1]);const r={total:n('tests'),passed:n('pass'),failed:n('fail'),skipped:n('skipped'),log};assert.ok(r.total>0);assert.equal(r.total,r.passed);assert.equal(r.failed,0);assert.equal(r.skipped,0);return r;}
const validation={status:results('research/effect-2074-status-tests.log'),effect2074:results('research/effect-2074-targeted.log'),regression:results('research/effect-2074-npm-test.log')};
const historical=baseline.reportOriginal;
report.historicalResearch={status:historical.status,implementationReady:historical.implementationReady,scope:historical.scope,candidatePool:historical.candidatePool,delivery:historical.delivery,nextEvidenceNeeded:historical.nextEvidenceNeeded,note:'此前仅资料研究的历史结论。Wiki/API仍没有确认此池；当前执行依据新增项目规则。'};
report.status='project-rule-random-pool-implemented-member-behaviors-partial';
report.implementationReady=true;
report.implementationReadyScope='仅2074项目规则的候选、抽样、持续时间、施加/免疫/反弹及刷新入口；不等于全部候选行为或任何精灵single-stage完成。';
report.scope={...historical.scope,task:'按用户确认项目规则实现2074公共随机池；不修改3667专属逻辑，不恢复精灵批次。'};
report.projectRule={...rule,file:'data/statuses/project-rules.json',sha256:sha(fs.readFileSync('data/statuses/project-rules.json')),sourceEvidenceIsWikiOrAPI:false};
report.candidatePool={status:'confirmed-by-project-rule',sourceType:rule.sourceType,ruleId:rule.ruleId,dynamicSource:'data/statuses/statuses.json#/records',databaseSha256:sha(fs.readFileSync('data/statuses/statuses.json')),confirmedMembers:pool,excludedNames:rule.excludedNames,count:pool.length,
 conflicts:[{name:'魇昧',wiki:'限制类异常状态',project:'纳入2074候选，项目规则仅排除瘫痪、凝滞',resolution:'保留Wiki字段不变；运行时使用项目规则。'},{name:'山神守护',wiki:null,project:'属于本项目状态数据库命名记录，纳入全状态候选',resolution:'异常身份和行为资料仍为null，不伪造来源；实际施加时明确记录行为未实现。'}]};
report.execution={implementation:['dist/status-pools.js','dist/status-rules.js','dist/souls.js（公共入口）','dist/range-effects.js:2074'],catalog:'dist/status-catalog.js由状态数据库生成浏览器快照；Node候选直接读取数据库，抽样时动态排除两个名称。',selection:'每次在剩余候选等概率选择，无放回得到N种；已有异常仍参与，免疫失败不补抽。无放回/失败不补抽属于implementation_decision，非用户原文或API证实。',duration:'独立等概率1/2/3回合；包含当前回合沿用现有引擎时长约定，非新增Wiki事实。',refresh:'公共attempt以可选max-remaining在免疫/抗性通过后合并；其它效果默认replace不变。',reflection:'同一抽中状态和时长经过原反弹门禁，max策略传至实际接收者；双向反弹最多一次返回。',resistance:'以新抽取时长确定抗性窗口，不受旧状态较长剩余时长影响。',invalidInput:'数量非正整数/超池或随机值非法明确报错；不削减数量、不改验证规则、不退回固定状态。',trace:'randomStatusEvents保存抽中ID/名称、时长、项目规则来源及实际接收者施加结果；未实现状态记录pendingStatusBehaviors并输出日志。'};
report.behaviorCoverage={complete:false,notImplemented:pool.filter(r=>S.behaviorCoverage(r.name)==='not-implemented'),existingPartial:pool.filter(r=>S.behaviorCoverage(r.name)==='existing-partial'),note:'16个候选的专属行为仍未实现；其余23个存在既有部分行为，不等于完全认证。全部39候选均保留。2074抽样/施加链路测试不能替代各状态的完整行为测试。'};
report.delivery={battleLogicChanged:true,validatorChanged:false,species3667Started:false,species3667SpecificLogicChanged:false,batchResumed:false,battleTestsRun:true,validation,fullSpeciesCertification:false};
report.nextEvidenceNeeded=['项目确认规则已可执行，无需伪造Wiki来源补齐。Wiki/API层面的真实池及参数研究历史仍保留。','后续独立完善16个缺失的候选状态专属行为及23个部分实现状态的未确认细节；本次不扩大精灵开发范围。'];
for(const k of ['definition','instances','versionHistory','confirmedFacts','reasonableHypotheses','noEvidence','sourceAccess','sourceManifest'])assert.deepEqual(report[k],historical[k],k+'原始研究证据必须保留');
fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
let souls=read('dist/souls.js');for(const e of json('research/effect-2074-runtime-edits.json').filter(e=>e.file==='dist/souls.js').reverse()){assert.ok(souls.includes(e.after));souls=e.all?souls.replaceAll(e.after,e.before):souls.replace(e.after,e.before);}
assert.equal(souls.replaceAll('\r\n','\n'),baseline.soulsOriginal.replaceAll('\r\n','\n'),'公共适配之外的代码有变化');
const added="\n// Template: SeerAPI skill_effect_type/2074 hash 3c24dbfb.\n// Pool, uniform duration and max refresh: project_rule/user_confirmed, not Wiki/API.\nmetadata[2074]={info:'随机附加{0}种非限制类异常状态',args_num:1};\nadd(2074,'afterHit',(c,p)=>c.randomAilments2074(p[0]),[[1,9999]],undefined,'项目确认随机池/时长/刷新规则；候选状态自身的未实现行为另行显式记录，非完整状态系统认证。');\n";
const range=read('dist/range-effects.js');assert.ok(range.includes(added));assert.equal(sha(range.replace(added,'')),baseline.files['dist/range-effects.js'],'既有注册项或验证规则改变');
const allowed=['dist/status-rules.js','dist/souls.js','dist/range-effects.js','dist/index.html',file,'PROGRESS.md'];
const changed=Object.entries(baseline.files).filter(([p,h])=>sha(fs.readFileSync(p))!==h).map(([p])=>p);assert.deepEqual(changed.filter(p=>!allowed.includes(p)),[]);
const check={existingFilesChecked:Object.keys(baseline.files).length,changedExistingFiles:changed,otherSoulsCodeUnchanged:true,existingRegistryAndValidatorsUnchanged:true,allExistingTestsUnchanged:true,allSpeciesFilesUnchanged:true,originalResearchEvidencePreserved:true,validation,candidateCount:pool.length,behaviorCoverage:report.behaviorCoverage};
fs.writeFileSync('research/effect-2074-implementation-check.json',JSON.stringify(check,null,2)+'\n');console.log(JSON.stringify({changed,validation,candidateCount:pool.length,notImplemented:report.behaviorCoverage.notImplemented.length},null,2));
