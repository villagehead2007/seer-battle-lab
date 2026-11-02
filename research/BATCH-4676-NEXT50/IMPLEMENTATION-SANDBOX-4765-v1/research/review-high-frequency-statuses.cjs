'use strict';
// Review artifact builder only. Does not certify species or alter validation policy.
const fs=require('fs'),crypto=require('crypto'),assert=require('node:assert/strict');
const db=require('../status-database.cjs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const save=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline=json('research/status-high-frequency-baseline.json');
const changed=Object.entries(baseline.files).filter(([p,h])=>hash(p)!==h).map(([p])=>p);
const allowed=['dist/status-rules.js','dist/souls.js','dist/range-effects.js','PROGRESS.md'];
assert.deepEqual(changed.filter(p=>!allowed.includes(p)),[],'Protected files changed');
const normalize=s=>s.replaceAll('\r\n','\n');
let souls=read('dist/souls.js');
const beforeFunction=baseline.soulsOriginal.match(/    function ailment\([\s\S]*?(?=    const stage=)/)[0];
const afterFunction=souls.match(/    function ailment\([\s\S]*?(?=    const stage=)/)[0];
const gates=s=>normalize(s.slice(s.indexOf('        if(t.soulState.hypnosReflect'),s.indexOf("        if(r<=(E.SOULS.trait(t,'entryAilmentRounds')")))+
 normalize(s.match(/        if\(r<=\(E\.SOULS\.trait\(t,'entryAilmentRounds'[^\n]+/)[0]);
assert.equal(gates(afterFunction),gates(beforeFunction),'Species and timed immunity gates changed');
souls=souls.replace(afterFunction,beforeFunction);
for(const e of json('research/status-high-frequency-edits.json').filter(e=>e.file==='dist/souls.js').reverse()){
 assert.equal(souls.split(e.after).length,2);souls=souls.replace(e.after,e.before);
}
assert.equal(normalize(souls),normalize(baseline.soulsOriginal),'Non-public souls code changed');
let range=read('dist/range-effects.js');
for(const e of json('research/status-high-frequency-edits.json').filter(e=>e.file==='dist/range-effects.js'))range=range.replace(e.after,e.before);
assert.equal(crypto.createHash('sha256').update(range).digest('hex'),baseline.files['dist/range-effects.js'],'Other effect/validator code changed');
function testRun(log){const text=read(log),count=label=>Number(text.match(new RegExp('ℹ '+label+' (\\d+)'))?.[1]);const result={total:count('tests'),passed:count('pass'),failed:count('fail'),skipped:count('skipped'),log};assert.ok(result.total>0);assert.equal(result.failed,0);assert.equal(result.skipped,0);assert.equal(result.passed,result.total);return result;}
const testFile='tests/status-high-frequency.test.cjs';
const tests=[...read(testFile).matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const refs=(...indexes)=>indexes.map(i=>({file:testFile,name:tests[i]}));
const contract=(implementation,tests,evidence=null)=>({implementation,tests,evidence,sourceStatus:evidence?'source-confirmed-clause-with-tested-engine-interpretation':'existing-engine-contract-source-details-unconfirmed'});
const details={
 中毒:{action:'不因中毒阻止行动；每回合末调用damageOverTime，按当前最大体力1/8交给现有百分比伤害入口，体力不足时扣至0。',interaction:'百分比抗性/免伤沿用公共伤害契约；后加异常免疫只阻止新增施加，不自动清掉既有中毒；与睡眠、混乱共存。',indexes:[10,12],parameters:{maxHpFraction:1/8,triggerProbability:null,flatDamage:null,accuracyMultiplier:null},unknown:['每回合扣血的精确时点','百分比伤害免伤/减伤的完整真实语义','感染转化为中毒的时长及是否重新经过免疫（既有专属分支未修改）']},
 麻痹:{action:'blocksAction在行动阶段阻止行动，不消耗所选技能PP；到期清除后下一回合恢复。',interaction:'受攻击不采用睡眠解除规则；能力等级保持原值；与其它异常共存。',indexes:[11],parameters:{blocksAction:true,maxHpFraction:null,triggerProbability:null,flatDamage:null},unknown:['控制期间药品使用等完整行动边界','受击及清除交互的完整来源证据']},
 睡眠:{action:'blocksAction阻止行动；对手攻击命中经过attackHit清除睡眠，包括攻击最终伤害0。MISS及属性技能不唤醒。',interaction:'中毒/混乱的回合末伤害不调用攻击命中解除；已经错过的行动不补行动；同时有其它控制时仍被阻止。',indexes:[12,13],parameters:{blocksAction:true,wakeOnOpponentAttackHit:true,minimumWakeDamage:0,maxHpFraction:null},unknown:['被其它异常伤害/反伤/转化唤醒的完整来源证据','行动机会已经错过时是否补行动的真实时序']},
 害怕:{action:'blocksAction在行动阶段阻止行动，不消耗所选技能PP；到期清除后下一回合恢复。',interaction:'攻击命中不按睡眠规则解除害怕；能力等级不自动变化；害怕控制期间混乱仍可触发回合末扣血。',indexes:[11,14],parameters:{blocksAction:true,maxHpFraction:null,triggerProbability:null,flatDamage:null},unknown:['控制期间药品使用等完整行动边界','受击及清除交互的完整来源证据']},
 混乱:{action:'物理/特殊攻击命中率沿用×0.2解释，属性技能和必中流程保持原处理；回合末以<0.05判断扣50点体力，经公共固伤入口。',interaction:'固伤抗性/免伤生效、百分比抗性不减此50点伤害；与控制状态共存；清除恢复攻击命中而保留中毒。',indexes:[12,14,15],parameters:{damageChance:0.05,flatDamage:50,accuracyReductionPercent:80,accuracyMultiplierInterpretation:0.2,maxHpFraction:null},unknown:['命中减少80%在全部命中修正中的准确运算顺序','每回合5%判定的精确时点','50点扣血的完整免伤/固伤抗性语义']}
};
const states=Object.entries(details).map(([name,d])=>{
 const source=db.getByName(name);
 return {id:source.id,name,status:'verified-public-behavior-with-open-source-semantics',complete:false,
  source:{urls:source.sourceUrls,revision:source.revision,hashes:source.hashes,originalDescription:source.description,evidence:source.descriptionEvidence},
  confirmedParameters:{defaultDurationTurns:null,...Object.fromEntries(Object.entries(d.parameters).filter(([k])=>!k.endsWith('Interpretation')))},
  interpretationParameters:Object.fromEntries(Object.entries(d.parameters).filter(([k])=>k.endsWith('Interpretation'))),
  lifecycle:{
   application:contract('效果注册表确认命中/触发概率后调用公共attempt；倒下目标不施加。精灵魂印专属门禁仍通过调用方gate注入，原分支未改。',refs(0,1,2,8,9)),
   actionPhase:contract(d.action,refs(...d.indexes),source.descriptionEvidence),
   duration:{defaultDurationTurns:null,status:'needs-source',implementation:'显式正整数n保存为当前回合+n-1；没有时长及兼容策略时返回needs-source，状态/免疫次数/随机数不变。既有引擎显式注入legacy-experimental-1-3保持兼容，仅为旧实验规则。',tests:refs(0,1,5)},
   damageAndControl:contract(d.action,refs(...d.indexes),source.descriptionEvidence),
   clear:contract('公共clear/clearAll处理主动清除；expire处理自然到期，主动清除不触发到期回调；544清除三种持续伤害改走公共clear。睡眠另有来源确认的攻击命中解除。',refs(6,7,...d.indexes),name==='睡眠'?source.clearConditions:null),
   immunity:contract('公共attempt先执行调用方免疫/反弹门禁，再处理次数免疫和抗性窗口；抗性成功写入等长免疫窗口；显式绕过不消费这些保护。门禁、概率、顺序沿用旧实验契约。',refs(2,3,4,8)),
   interaction:contract(d.interaction,refs(...d.indexes)),
   conversion:{outgoingConversion:null,status:'needs-source-not-inferred',implementation:'没有新增此状态自身到期转化。null表示未取得规则，不能解释为证实没有转化。中毒的感染转入路径保持原代码，不在本次认证范围。',tests:refs(6,7)}
  },
  unknown:{defaultDurationTurns:null,immunityConditions:source.immunityConditions,conversion:null,repeatApplicationPolicy:null,preciseTickPhase:null},
  pendingEvidence:['默认持续回合；同名状态重复施加采用覆盖/刷新/叠加的真实策略','通用免疫、抗性和清除的完整来源证据',...d.unknown],
  implementation:['dist/status-rules.js','dist/souls.js（公共适配与调用点）','dist/range-effects.js:544（公共清除入口）']};
});
const report={generatedAt:new Date().toISOString(),status:'partial-state-system',scope:{names:Object.keys(details),speciesSpecificLogicChanged:false,validatorChanged:false,automationChanged:false,effect2074Implemented:false,batchResumed:false},
 changes:['将通用次数免疫、抗性窗口、抗性成败及时长写入集中到status-rules.attempt','缺时长的新公共入口返回needs-source，无默认猜测；旧引擎通过显式带标签的兼容策略保持原实验行为','到期遍历及544单状态清除接入公共模块；没有修改状态默认参数、精灵专属分支或随机池'],
 states,validation:{newTargeted:testRun('research/status-high-frequency-targeted.log'),existingStatusAndDatabase:testRun('research/status-high-frequency-existing.log'),regression:testRun('research/status-high-frequency-npm-test.log')},
 scopeCheck:{existingFilesChecked:Object.keys(baseline.files).length,changedExistingFiles:changed,speciesGatesUnchanged:true,otherSoulsCodeUnchanged:true,otherEffectAndValidatorCodeUnchanged:true,allOtherProtectedFilesUnchanged:true},
 remaining:'五种状态可复用公共行为已有专项状态变化测试，但默认时长与若干交互仍缺完整来源，均不标为完全实现。冰封缺口未处理，3667/2074继续暂停。',
 artifacts:['dist/status-rules.js','dist/souls.js','dist/range-effects.js',testFile].map(file=>({file,sha256:hash(file)}))};
save('research/status-high-frequency-review.json',report);
for(const file of ['research/status-system-audit.json','research/status-behavior-review.json']){
 const audit=json(file);audit.latestFollowUp={at:report.generatedAt,report:'research/status-high-frequency-review.json',status:report.status,validation:report.validation,note:'原静态观察、来源与上轮测试记录保留为历史；五种状态最新实现及证据边界以此报告为准。'};
 for(const r of audit.records??audit.states??[])if(details[r.name])r.latestFollowUp={report:'research/status-high-frequency-review.json',status:'verified-public-behavior-with-open-source-semantics',complete:false,defaultDurationTurns:null};
 save(file,audit);
}
console.log(JSON.stringify({states:states.length,validation:report.validation,scopeCheck:report.scopeCheck},null,2));
