'use strict';
// Read-only scope comparison plus a research report; no completion-policy edits.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseline=JSON.parse(fs.readFileSync('research/public-status-expansion-baseline.json','utf8'));
const changed=[],missing=[];
for(const [file,hash]of Object.entries(baseline.files)){
  if(!fs.existsSync(file))missing.push(file);
  else if(digest(fs.readFileSync(file))!==hash)changed.push(file);
}
const allowed=new Set(['dist/status-rules.js','dist/status-pools.js','dist/status-catalog.js','dist/souls.js','dist/wiki-support.js','data/statuses/statuses.json','data/statuses/classification-reviews.json','PROGRESS.md']);
assert.deepEqual(missing,[]);assert.deepEqual(changed.filter(f=>!allowed.has(f)),[]);
// Reverse only the enumerated shared-interface edits in memory. Matching the
// original digest proves the rest of souls.js (including species branches) stayed intact.
const edits=[];
const migration=fs.readFileSync('research/integrate-public-status-expansion.cjs','utf8');
for(const line of migration.split(/\r?\n/).filter(x=>x.startsWith('change(')))vm.runInNewContext(line,{change:(a,b)=>edits.push([a,b])});
let restored=fs.readFileSync('dist/souls.js','utf8');
const pendingLine=restored.split(/(?<=\n)/).filter(x=>x.includes("if(result.applied&&statusRules.behaviorCoverage(k)!=='not-implemented'"));
assert.equal(pendingLine.length,1);restored=restored.replace(pendingLine[0],'');
restored=restored.replace('raw>0?statusRules.minimumAttackDamage(t,r,crit):0','statusRules.minimumAttackDamage(t,r,crit)');
for(const [before,after]of edits.reverse()){
  assert.equal(restored.split(after).length,2,'unique reverse anchor: '+after);restored=restored.replace(after,before);
}
assert.equal(digest(restored),baseline.files['dist/souls.js']);
const wiki=fs.readFileSync('dist/wiki-support.js','utf8').replace('wikiId:m.id,fifth:m.fifth===true,...(m.hiddenEffect','wikiId:m.id,...(m.hiddenEffect');
assert.equal(digest(wiki),baseline.files['dist/wiki-support.js']);
const logs={status:'research/public-status-expansion-status-verified.log',pools:'research/public-status-expansion-pools-verified.log',species3667:'research/public-status-expansion-3667-verified.log',all:'research/public-status-expansion-npm-verified.log'};
const tests={};
for(const [key,file]of Object.entries(logs)){
  const log=fs.readFileSync(file,'utf8'),read=k=>Number(log.match(new RegExp('ℹ '+k+' (\\d+)'))?.[1]);
  tests[key]={file,tests:read('tests'),pass:read('pass'),fail:read('fail'),skipped:read('skipped')};
  assert.equal(tests[key].fail,0);assert.equal(tests[key].pass,tests[key].tests);assert.equal(tests[key].skipped,0);
}
const validationFile='research/public-status-expansion-validate.log';
const validation=fs.readFileSync(validationFile,'utf8');assert.match(validation,/rejected \(single-stage\)/);assert.match(validation,/本地尚未部署/);
const report={at:new Date().toISOString(),baselineAt:baseline.at,compared:Object.keys(baseline.files).length,changed,missing,
  scopeProof:{soulsAfterReversingSharedEditsMatchesBaseline:true,wikiAfterRemovingFifthMetadataMatchesBaseline:true,oldTestsUnchanged:true,allSpeciesFilesUnchanged:true,validatorsAutomationAndCompletionReviewsUnchanged:true},
  tests,validator:{file:validationFile,exitCode:1,result:'rejected (single-stage)',reason:'本地尚未部署该精灵，请先完成资料与规则适配。'},
  coverage:{reviewed:16,withNewBehavior:12,noSpecificBehavior:4,fullySourceCertified:0},
  unresolved:['部分状态转化/交互和四种状态专属行为','1348候选池及持续规则','睡眠通用默认持续时间','强化魂印PP吸取恢复分配与失败边界'],
  researchChanges:['research/build-status-runtime-catalog.cjs','research/status-system-audit.json','research/status-pool-2074-design.json'],
  note:'本次新增研究文件、缓存、日志及测试另存；基线比较范围为原有根目录、data、dist、tests文件。未运行Git，未推进3667或开始3670。'};
fs.writeFileSync('research/public-status-expansion-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
