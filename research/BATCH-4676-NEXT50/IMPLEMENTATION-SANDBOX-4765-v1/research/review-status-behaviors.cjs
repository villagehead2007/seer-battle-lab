'use strict';
const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const previous=require('./status-system-audit.json'),baseline=require('./status-behavior-baseline.json'),db=require('../data/statuses/statuses.json');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const changed=Object.entries(baseline.files).filter(([p,h])=>sha(fs.readFileSync(p))!==h).map(([p])=>p);
assert.deepEqual(changed.sort(),['dist/index.html','dist/souls.js']);
let normalized=fs.readFileSync('dist/souls.js','utf8');
const edits=[
["  'use strict';\n  const statusRules=typeof module==='object'&&module.exports?require('./status-rules.js'):globalThis.BattleStatusRules;\n  E.STATUS_RULES=statusRules;","  'use strict';"],
['      statusRules.apply(t,k,r,n);','      t.ailments[k]=r+n-1;'],
['clearAilments(f){statusRules.clearAll(f);}','clearAilments(f){f.ailments={};}'],
["if(statusRules.blocksAction(a,r)||Object.entries(a.ailments).some(([k,end])=>['瘫痪','焚烬','神游','诅咒','感染'].includes(k)&&end>=r))","if(Object.entries(a.ailments).some(([k,end])=>['麻痹','疲惫','害怕','睡眠','石化','冰封','瘫痪','焚烬','神游','诅咒','感染'].includes(k)&&end>=r))"],
['statusRules.accuracyMultiplier(a,m.kind,r)',"(m.kind!=='status'&&a.ailments['混乱']>=r?.2:1)"],
['      power*=statusRules.powerMultiplier(a,r);\n',''],
["if(statusRules.attackHit(t,r)){emit","if(t.ailments['睡眠']>=r){delete t.ailments['睡眠'];emit"],
["    if(!s.finished)for(const f of fs)statusRules.damageOverTime(f,r,(target,n,k,type)=>inflict(fs[1-f.side],target,n,k,type));","    if(!s.finished)for(const f of fs)for(const k of ['中毒','烧伤','冻伤'])if(f.ailments[k]>=r)inflict(fs[1-f.side],f,f.stats.maxHp/8,k,'percent');"],
["    if(!s.finished)for(const f of fs)statusRules.confusionDamage(f,r,()=>rng(s),(target,n,k,type)=>inflict(fs[1-f.side],target,n,k,type));","    if(!s.finished)for(const f of fs)if(f.hp>0&&f.ailments['混乱']>=r&&rng(s)<.05)inflict(fs[1-f.side],f,50,'混乱','fixed');"],
["if(k==='冰封')statusRules.iceExpired(f,r,stage,issue=>{s.pendingStatusTransitions??=[];s.pendingStatusTransitions.push(issue);emit(`${name(f)} 冰封结束：冻伤转化的持续时间及免疫规则待核实，未擅自施加。`);});",'']
];
for(const [after,before]of edits){assert.equal(normalized.split(after).length,2,'unexpected edit '+after.slice(0,50));normalized=normalized.replace(after,before);}
assert.equal(normalized,baseline.soulsOriginal,'Unlisted battle/species-specific change');
const html=fs.readFileSync('dist/index.html','utf8').replace('<script defer src="status-rules.js"></script>','');assert.equal(sha(html),baseline.files['dist/index.html']);
const testFile='tests/status-rules.test.cjs',testText=fs.readFileSync(testFile,'utf8'),names=[...testText.matchAll(/test\('([^']+)'/g)].map(m=>m[1]);assert.equal(names.length,18);
for(const [file,n]of [['research/status-rules-targeted.log',18],['research/status-rules-npm-test.log',1013]]){const text=fs.readFileSync(file,'utf8');assert.match(text,new RegExp('pass '+n));assert.match(text,/fail 0/);}
const core=Object.keys(require('../dist/status-rules.js').ids),old24=previous.records.filter(x=>x.observedBehavior.length);
const report={generatedAt:new Date().toISOString(),status:'partial-state-system',sourceRevision:db.sources['wiki-mechanics'].revision,sourceHash:db.sources['wiki-mechanics'].hash,sourceDatabase:'data/statuses/statuses.json',previousAudit:'research/status-system-audit.json',scope:{reviewedExistingStates:old24.length,commonModuleStates:core,priorStatesNotModified:old24.filter(x=>!core.includes(x.name)).map(x=>x.name),speciesSpecificLogicChanged:false,validatorChanged:false,effect2074Implemented:false,batchResumed:false},
changes:[{status:'烧伤',change:'在攻击伤害公式前对最终威力乘0.5，覆盖物理/特殊攻击并与威力强化叠加；不会把最终伤害简单除2。',evidence:'攻击技能的威力会减少50%'},{status:'冰封',change:'自然到期经公共能力变化入口速度-1；缺少转化持续时间和免疫语义，冻伤未擅自施加，写入pendingStatusTransitions并记录战斗日志。',completion:'partial-blocked',evidence:'冰封结束后会转化为冻伤、速度等级-1'},{status:'公共基础状态',change:'抽取真实时长写入、行动阻止、攻击命中解除睡眠、混乱命中及概率伤害、三种持续伤害和清除入口；原免疫/抗性流程复用，新增正整数持续时长校验。'}],
states:old24.map(old=>{const data=db.records.find(x=>x.name===old.name),included=core.includes(old.name);return {id:data.id,name:old.name,status:included?'verified-clauses-with-open-semantics':'existing-partial-not-modified',previousGaps:old.knownGaps,lifecycle:{application:included?'共享状态写入及原真实效果入口；石化仅覆盖状态写入/控制，尚无本次真实技能施加测试。':'原实现，未补全',actionPhase:included?'控制类跳过行动不扣PP；混乱仅影响非必中攻击命中，睡眠受未MISS攻击解除。':'原实现，未补全',damageAndStages:old.name==='冰封'?'到期速度下降已实现；目标冻伤未施加。':old.name==='烧伤'?'威力减半及既有1/8扣血通过测试。':included?'来源明确的基础行为通过专项分支验证；无来源的附加效果未补造。':'原实现，未补全',duration:included?'显式正整数时长按绝对结束回合保存并覆盖边界；未注明时长仍沿用RULES.md的旧实验1–3回合，未获来源认证。':'原实验时长及转化硬编码缺口保留。',clear:included?'真实清异常技能和公共清除入口；保持既有主动清除与自然到期分离的约定。':'原实现，未补全',conversion:old.name==='冰封'?'blocked: 转为冻伤的持续时间及是否重走免疫待核实。':included?'未新增无来源的转化；来源未说明不等于证明无转化。':'原实现/缺口见previousGaps。',immunity:included?'复用原免异常、次数免疫、抗性窗口和反弹；八种状态有真实入口交互测试，石化/疲惫未独立覆盖全部免疫分支。':'原实现，未全面复核。'},unknownSourceFields:data.unknownFields,complete:false};}),
tests:{file:testFile,names,targeted:{passed:18,total:18,log:'research/status-rules-targeted.log'},regression:{passed:1013,total:1013,log:'research/status-rules-npm-test.log'},browser:'按index.html脚本顺序在无CommonJS浏览器环境加载并比较真实回合HP/状态，与Node端一致。',initialFailures:[{log:'research/status-rules-targeted-initial-failure.log',cause:'新增夹具误用756混乱参数（原验证不支持）；烧伤到期后伤害比较未对齐下一回合随机序列。',fix:'混乱改用原已允许的1975真实入口，保留状态与免疫断言；用相同下一回合随机序列对照。没有修改验证规则。'},{log:'research/status-rules-targeted-fixture-failure.log',cause:'混乱夹具改为受击触发后仍检查未使用的等待招PP。',fix:'检查实际使用的攻击招PP，仍断言准确扣1。'}]},
remainingEvidence:['冰封转化后冻伤持续时间、是否重新检查免疫/抗性、自然到期与被清除是否同样转化。','未注明时长的各异常默认持续回合；本次测试验证旧实验契约，不认证它为真实规则。','Wiki本表仅称每回合扣血，未统一规定所有异常的精确结算时点；保持既有回合末契约。','其它14个既有状态仍有未逐项认证的行为与交互；17个此前没有状态行为的条目本次未开发。'],
scopeCheck:{existingFilesChecked:Object.keys(baseline.files).length,changedExistingFiles:changed,sharedEditsReversedToExactOriginal:true,allOtherProtectedFilesUnchanged:true},
artifacts:['dist/status-rules.js','dist/souls.js','dist/index.html',testFile].map(file=>({file,sha256:sha(fs.readFileSync(file))})),note:'不宣称完整状态系统完成，不恢复3667/3670，不将状态目录作为2074随机池。'};
fs.writeFileSync('research/status-behavior-review.json',JSON.stringify(report,null,2)+'\n');console.log({status:report.status,reviewed:old24.length,core:core.length,tests:report.tests.targeted,regression:report.tests.regression,scope:report.scopeCheck});
