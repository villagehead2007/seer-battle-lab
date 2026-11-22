'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const {inputs} = require('../LIGHT-SP-2026-11-07/formal-gates.cjs');

const root = path.resolve(__dirname, '../..');
const ownershipSupplementInputs=require('./ownership-correction-supplement.cjs').inputFiles;
const historicalInputs=['research/TEAM-STAGE-2/historical-evidence-file.cjs',...require('./historical-evidence-file.cjs').archiveFiles];
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const hashFile = file => sha(fs.readFileSync(file));
const initialScope = path.join(__dirname, 'initial-todo.json');
const authority = path.join(__dirname, 'AUTHORIZATION.md');
function environmentFingerprint(){
  const env={...process.env};
  // Tool tracing changes per invocation; the battle/runtime corpus does not
  // consume it. Retain every other environment key in the cache fingerprint.
  for(const key of ['NODE_TEST_CONTEXT','CODEX_TOOL_CALL_ID','SEER_TEAM_TEST_CACHE','SEER_TEAM_INDEPENDENT_BATCH'])delete env[key];
  return sha(JSON.stringify(Object.entries(env).sort(([a],[b])=>a.localeCompare(b))));
}

function targets() {
  if (hashFile(initialScope) !== 'e42ee7c3711098979f0b1b4b071de87b308ed28ee1344c694836bb19b458a695' ||
      hashFile(authority) !== '2f098dc6216daefd4addf1f5c056662950ebdf1fe855d2710a999e4fcbb35384') {
    throw Error('原始范围或人类共享授权记录已变化');
  }
  const {records} = JSON.parse(fs.readFileSync(initialScope, 'utf8'));
  const rangeEvidence=path.join(__dirname,'historical-target-counts.json');
  const rangeAuthority=path.join(root,'research/MULTI-TARGET-USER-SCOPE.json');
  if(hashFile(rangeEvidence)!=='e07b30c9a125945ca56daa5fad9dcb3c77bea5a0281c3cfac2566e7faef68cd4' ||
     hashFile(rangeAuthority)!=='0c2bf4efd583d0ffa1bcef6c86cf8947bd1cd90ee311a505b96a40ffd1a76d59')throw Error('多目标范围排除依据已变化');
  const ignored=new Set();
  for(const source of JSON.parse(fs.readFileSync(rangeEvidence,'utf8')).rows){
    const row=records.find(entry=>entry.key===source.key);
    if(row?.kind!=='move' || row.sourceDigest!==source.sourceDigest || row.raw.hash!==source.skillRevision ||
       row.source.snapshot.revision!==source.petRevision || !(source.originalTargetCount>1) ||
       !row.raw.deferredEffects?.length || !row.raw.deferredEffects.every(note=>note.field==='atk_num')) {
      throw Error('额外目标范围与初始来源不符：'+source.key);
    }
    ignored.add(row.key);
  }
  return [...new Set(records.filter(row=>!ignored.has(row.key)).map(row => row.speciesId))];
}

function frozenInputs() {
  const files = inputs();
  for(const file of historicalInputs)files[file]=hashFile(path.join(root,file));
  const migrationPolicy='research/TEAM-STAGE-2/environment-migration-policy.json';
  const migration=JSON.parse(fs.readFileSync(path.join(root,migrationPolicy),'utf8'));
  for(const file of [migrationPolicy,'research/TEAM-STAGE-2/environment-migration.cjs',...migration.freeze]) {
    const absolute=path.resolve(root,file),relative=path.relative(root,absolute);
    if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('迁移冻结输入必须位于项目内：'+file);
    files[file]=hashFile(absolute);
  }
  // Impact evidence inputs
  for (const name of ['impact-independent-evidence.cjs', 'impact-independent-policy.json']) {
    files['research/TEAM-STAGE-2/' + name] = hashFile(path.join(__dirname, name));
  }
  // End impact evidence inputs
  for (const name of ['initial-todo.json', 'AUTHORIZATION.md', 'branch-review.json', 'complete-reviews.json',
    'pending-questions.json','3506-version-review.json','fifth-version-responses.json','supplemental-sources.json', 'historical-target-counts.json','version-source-rebindings.json','reviewed-extra-targets.json','audit-state-display.cjs','state-display-inventory.json','build-state-display-coverage.cjs','state-display-coverage.json','team-ui-browser.cjs','shared-complete.cjs', 'complete-evidence.cjs','independent-registry-compatibility.cjs','ownership-correction-supplement.cjs','round202-before-current-adoption-complete-reviews.json','team-count-miss-seed-v1.json']) {
    files['research/TEAM-STAGE-2/' + name] = hashFile(path.join(__dirname, name));
  }
  for (const name of ['research/build-multiplayer-todo.cjs','research/TEAM-STAGE-2/fetch-team-genders.cjs','data/team-gender-evidence.json','research/MULTI-TARGET-USER-SCOPE.json','MULTI-PET-TODO.md','research/BATCH-4816-REMAINING/FINAL-GATES/inputs-v8.json',nativeLiteralInputManifest,...nativeTestFixtureFiles]) {
    files[name] = hashFile(path.join(root, name));
  }
  const ruleIndex='research/USER-CONFIRMED-GLOBAL-RULES.json';
  const rules=JSON.parse(fs.readFileSync(path.join(root,ruleIndex),'utf8'));
  const ruleFiles=[...ownershipSupplementInputs,"research/TEAM-STAGE-2/ADDITIONAL-REQUIRED-PRE-REGRESSION-GATES-2026-11-17.json","research/TEAM-STAGE-2/effect-ownership-audit.json","research/TEAM-STAGE-2/effect-ownership-current-imported-inventory-v1.json","research/TEAM-STAGE-2/xin-driving-action-audit-20261117.json","research/TEAM-STAGE-2/effect-ownership-ally-scope-inventory-v1.json","research/TEAM-STAGE-2/timed-healing-restriction-ownership-audit.json","research/TEAM-STAGE-2/report-timed-healing-applicable-inventory-v1.json","research/TEAM-STAGE-2/opponent-switch-lock-ownership-audit.json","research/TEAM-STAGE-2/all-opponent-switch-lock-candidate-inventory-v1.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/copy-manifest.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/报告.md","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/context.md","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/evidence.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/inventory.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/read-consistency.json",ruleIndex,'research/TEAM-STAGE-2/global-leave-reset-audit.json','research/TEAM-STAGE-2/global-attack-healing-audit.json','research/TEAM-STAGE-2/global-heal-then-percent-audit.json','research/TEAM-STAGE-2/forced-first-rank-audit.json',...new Set(Object.values(rules.rules).map(rule=>rule.archive))];
  for(const file of ruleFiles){
    const full=path.resolve(root,file),relative=path.relative(root,full);
    if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('统一规则归档必须位于项目内');
    files[file]=hashFile(full);
  }
  return Object.fromEntries(Object.entries(files).sort(([a],[b]) => a.localeCompare(b)));
}

function auditClosureInputs(root,files,gates){
  const merged={...files};
  function add(file,expected){
    if(typeof file!=='string'||!file)throw Error('专项冻结输入路径无效');
    const full=path.resolve(root,file),relative=path.relative(root,full);
    if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('专项冻结输入必须位于项目内：'+file);
    const key=relative.replaceAll('\\','/'),actual=hashFile(full);
    if(expected!==undefined&&actual!==expected)throw Error('专项冻结输入哈希不符：'+file);
    if(Object.hasOwn(merged,key)&&merged[key]!==actual)throw Error('专项冻结输入与基础清单冲突：'+file);
    merged[key]=actual;
    return full;
  }
  for(const gate of gates){
    const audit=JSON.parse(fs.readFileSync(add(gate.file),'utf8'));
    const inputs=audit.closure?.inputs;
    if(inputs===undefined&&gate.status!=='complete'&&audit.status!=='complete')continue;
    if(!Array.isArray(inputs)||!inputs.length)throw Error('专项冻结输入缺少闭合清单：'+gate.id);
    for(const input of inputs){
      if(!input||!(/^[a-f0-9]{64}$/).test(input.sha256))throw Error('专项冻结输入摘要无效：'+gate.id);
      add(input.file,input.sha256);
    }
  }
  return Object.fromEntries(Object.entries(merged).sort(([a],[b])=>a.localeCompare(b)));
}

function finalFrozenInputs() {
  const gateFile='research/TEAM-STAGE-2/ADDITIONAL-REQUIRED-PRE-REGRESSION-GATES-2026-11-17.json';
  const gates=JSON.parse(fs.readFileSync(path.join(root,gateFile),'utf8')).requiredAdditionalGates;
  if(!Array.isArray(gates))throw Error('专项冻结任务清单无效');
  const files=frozenInputs();
  return auditClosureInputs(root,files,gates);
}

function passedTests(output) {
  const counts = {};
  for (const key of ['tests','pass','fail','skipped','cancelled','todo']) {
    const matches = [...output.matchAll(new RegExp('^[ℹ#] ' + key + ' (\\d+)\\s*$', 'gm'))];
    if (matches.length !== 1) throw Error('测试摘要缺失或重复：' + key);
    counts[key] = Number(matches[0][1]);
  }
  if (counts.tests < 1 || counts.tests !== counts.pass ||
      ['fail','skipped','cancelled','todo'].some(key => counts[key] !== 0)) {
    throw Error('测试未全部通过：' + JSON.stringify(counts));
  }
  return counts;
}

function checkFileOutput(output, file, names) {
  const clean=require('node:util').stripVTControlCharacters(output);
  const counts=passedTests(clean);
  const actual=new Set();
  for(const line of clean.split(/\r?\n/)){
    const match=line.trimStart().match(/^✔ (.*) \([\d.]+ms\)\s*$/);
    if(match)actual.add(match[1]);
  }
  if(!actual.size || (actual.size===1 && [...actual][0].replaceAll('\\','/').endsWith('tests/'+path.basename(file)))) {
    throw Error(file+'：未执行具名测试');
  }
  for(const name of names)if(!actual.has(name))throw Error(file+'：未执行引用的断言 '+name);
  return counts;
}

// Retain all production/data/helper inputs. A native file need not rerun when
// only an unrelated test changes. Tests inspecting the test/gate universe keep
// the full input set; source/HTTP gates always run separately for every pet.
const nativeReviewFiles=[...ownershipSupplementInputs,"research/TEAM-STAGE-2/ADDITIONAL-REQUIRED-PRE-REGRESSION-GATES-2026-11-17.json","research/TEAM-STAGE-2/effect-ownership-audit.json","research/TEAM-STAGE-2/effect-ownership-current-imported-inventory-v1.json","research/TEAM-STAGE-2/xin-driving-action-audit-20261117.json","research/TEAM-STAGE-2/effect-ownership-ally-scope-inventory-v1.json","research/TEAM-STAGE-2/timed-healing-restriction-ownership-audit.json","research/TEAM-STAGE-2/report-timed-healing-applicable-inventory-v1.json","research/TEAM-STAGE-2/opponent-switch-lock-ownership-audit.json","research/TEAM-STAGE-2/all-opponent-switch-lock-candidate-inventory-v1.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/copy-manifest.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/报告.md","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/context.md","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/evidence.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/inventory.json","research/TEAM-STAGE-2/HEALING-RESTRICTIONS-REPORT-20261117/read-consistency.json",'SINGLE-STAGE-REVIEWS.json','MULTI-PET-TODO.md','research/TEAM-STAGE-2/complete-reviews.json','research/TEAM-STAGE-2/branch-review.json'];
const nativeLiteralInputManifest='research/TEAM-STAGE-2/round207-required-static-dependency-gaps-v2-20261113.json';
const discoveredNativeInputs=JSON.parse(fs.readFileSync(path.join(root,nativeLiteralInputManifest),'utf8')).missing;
if(!Array.isArray(discoveredNativeInputs)||discoveredNativeInputs.some(name=>typeof name!=='string'||!name.startsWith('research/TEAM-STAGE-2/')||!name.endsWith('.json')||path.relative(__dirname,path.resolve(root,name)).startsWith('..')))throw Error('专项静态依赖输入清单范围不符');
const nativeTestFixtureFiles=[...new Set(['research/TEAM-STAGE-2/team-count-miss-seed-v1.json',...discoveredNativeInputs])];
const nativeControllerInputFiles=['research/TEAM-STAGE-2/shared-complete.cjs','research/BATCH-4816-REMAINING/FINAL-GATES/inputs-v8.json',nativeLiteralInputManifest,'dist/battle-display.js'];
function nativeDependencySnapshot(snapshot,file,fileSha256=hashFile(file),requireBound=false) {
  file=path.resolve(root,file);const visited=new Set();let universe=false;
  function inspect(name){
    if(visited.has(name))return;visited.add(name);
    const relative=path.relative(root,name).replaceAll('\\','/');
    if(requireBound&&name!==file&&!snapshot.files[relative])throw Error('静态依赖未纳入完整输入：'+relative);
    if(!/[.]c?js$/.test(name))return;
    const source=fs.readFileSync(name,'utf8');
    if(/[.]test[.](?:c?js)|['"]tests['"]|shared-complete[.]cjs|automation-validate[.]cjs/.test(source)||nativeReviewFiles.some(name=>source.includes(path.basename(name))))universe=true;
    for(const match of source.matchAll(/\brequire\(\s*['"]([^'"]+)['"]\s*\)/g))if(match[1].startsWith('.')||path.isAbsolute(match[1])){
      const resolved=new Set();let failure;
      // Some tests serialize a Node -e program executed with project-root cwd.
      // Include both resolvable contexts instead of discarding those literals.
      for(const candidate of new Set([path.resolve(path.dirname(name),match[1]),path.resolve(root,match[1])])){
        if(path.relative(root,candidate).startsWith('..'))continue;
        try{resolved.add(require.resolve(candidate));}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;failure??=error;}
      }
      if(!resolved.size)throw failure??Error('无法定位静态依赖：'+match[1]);
      for(const dependency of resolved)inspect(dependency);
    }
  }
  inspect(file);
  const files=Object.fromEntries(Object.entries(snapshot.files).filter(([name])=>universe||
    ((!/^tests\/.*[.]test[.]c?js$/.test(name)||visited.has(path.resolve(root,name)))&&(!nativeTestFixtureFiles.includes(name)||visited.has(path.resolve(root,name)))&&(!nativeControllerInputFiles.includes(name)||visited.has(path.resolve(root,name)))&&!nativeReviewFiles.includes(name))));
  // Reviews never stand in for runtime assertions. They are validated afresh
  // by each source gate before cache use, and current named proofs are checked
  // against the actual original stdout. Readers of reviews keep full inputs.
  return {...snapshot,files,testedFile:{file:path.relative(root,file).replaceAll('\\','/'),sha256:fileSha256}};
}

// Commit successful child evidence even if a later child rejects its parent.
function nativeFileCache(folder) {
  folder=path.resolve(root,folder);
  const relative=path.relative(__dirname,folder);
  if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('专项缓存必须位于TEAM-STAGE-2子目录');
  const snapshot=()=>({node:process.version,executable:process.execPath,environment:environmentFingerprint(),files:frozenInputs()});
  const initial=snapshot(),inputFingerprint=sha(JSON.stringify(initial)),pending=[];
  fs.mkdirSync(folder,{recursive:true});
  const inputSnapshot=path.join(folder,'inputs-'+inputFingerprint+'.json');
  if(!fs.existsSync(inputSnapshot))fs.writeFileSync(inputSnapshot,JSON.stringify(initial,null,2)+'\n',{flag:'wx'});
  if(sha(JSON.stringify(JSON.parse(fs.readFileSync(inputSnapshot,'utf8'))))!==inputFingerprint)throw Error('专项原完整输入快照不符');
  let attempt;
  return {
    inputFingerprint,
    run(file,names){
      file=path.resolve(root,file);
      const relativeFile=path.relative(root,file).replaceAll('\\','/');
      if(!relativeFile||relativeFile.startsWith('..')||path.isAbsolute(relativeFile))throw Error('专项文件必须位于项目内');
      const dependencyFingerprint=sha(JSON.stringify(nativeDependencySnapshot(initial,file,hashFile(file),true)));
      const records=path.join(folder,dependencyFingerprint);fs.mkdirSync(records,{recursive:true});
      const args=['--test','--test-reporter=spec',file];
      const recordFile=path.join(records,sha(relativeFile)+'.json');
      if(fs.existsSync(recordFile)){
        const record=JSON.parse(fs.readFileSync(recordFile,'utf8'));
        if(record.dependencyFingerprint!==dependencyFingerprint||!/^[a-f0-9]{64}$/.test(record.inputFingerprint??'')||record.file!==relativeFile||record.fileSha256!==hashFile(file)||record.command!==process.execPath||
          JSON.stringify(record.args)!==JSON.stringify(args)||record.exitCode!==0||record.signal||record.error)throw Error('专项缓存命令/输入/退出不符：'+relativeFile);
        const originalPath=path.resolve(root,record.inputSnapshot??''),originalRelative=path.relative(folder,originalPath);
        if(!originalRelative||originalRelative.startsWith('..')||path.isAbsolute(originalRelative)||hashFile(originalPath)!==record.inputSnapshotSha256)throw Error('专项缓存原完整输入快照不符：'+relativeFile);
        const original=JSON.parse(fs.readFileSync(originalPath,'utf8'));
        if(sha(JSON.stringify(original))!==record.inputFingerprint||sha(JSON.stringify(nativeDependencySnapshot(original,file,record.fileSha256,true)))!==dependencyFingerprint)throw Error('专项缓存原完整输入或依赖不符：'+relativeFile);
        const log=path.resolve(root,record.log),logRelative=path.relative(folder,log);
        if(logRelative.startsWith('..')||path.isAbsolute(logRelative)||hashFile(log)!==record.logSha256)throw Error('专项缓存日志不符：'+relativeFile);
        const stdout=fs.readFileSync(log,'utf8');
        checkFileOutput(stdout,file,names);
        return {status:0,signal:null,stdout,reusedFrom:path.relative(root,recordFile),evidenceRecord:path.relative(root,recordFile),dependencyFingerprint};
      }
      attempt??=fs.mkdtempSync(path.join(folder,'attempt-'));
      const log=path.join(attempt,sha(relativeFile)+'.log'),startedAt=new Date().toISOString(),fileSha256=hashFile(file);
      const env={...process.env};delete env.NODE_TEST_CONTEXT;
      const result=spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8',timeout:12*60*60*1000,maxBuffer:8*1024*1024,windowsHide:true});
      fs.writeFileSync(log,(result.stdout??'')+(result.stderr??''),{flag:'wx'});
      const record={schemaVersion:2,file:relativeFile,fileSha256,inputFingerprint,dependencyFingerprint,inputSnapshot:path.relative(root,inputSnapshot),inputSnapshotSha256:hashFile(inputSnapshot),command:process.execPath,args,startedAt,finishedAt:new Date().toISOString(),exitCode:result.status,signal:result.signal,error:result.error?.message??null,log:path.relative(root,log),logSha256:hashFile(log)};
      fs.writeFileSync(log+'.json',JSON.stringify(record,null,2)+'\n',{flag:'wx'});
      if(hashFile(file)!==fileSha256)throw Error('受测文件在运行期间变化：'+relativeFile);
      if(!record.error&&record.exitCode===0&&!record.signal){
        record.counts=checkFileOutput(result.stdout??'',file,names);
        pending.push({recordFile,record});
      }
      return {...result,evidenceRecord:path.relative(root,recordFile),dependencyFingerprint};
    },
    finish(){
      if(sha(JSON.stringify(snapshot()))!==inputFingerprint)throw Error('专项执行期间完整输入变化，不能采用或保存缓存');
      for(const {recordFile,record} of pending)fs.writeFileSync(recordFile,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
      pending.length=0;
    }
  };
}

function execute(command, args, log, extraEnv={}) {
  const startedAt = new Date().toISOString();
  const fd = fs.openSync(log, 'wx');
  let result;
  try {
    result = spawnSync(command, args, {cwd:root, env:{...process.env,...extraEnv}, stdio:['ignore',fd,fd], windowsHide:true, timeout:12*60*60*1000});
  } finally {
    fs.closeSync(fd);
  }
  const record = {
    command, args, startedAt, finishedAt:new Date().toISOString(),
    exitCode:result.status, signal:result.signal, error:result.error?.message ?? null,
    log:path.relative(root, log), logSha256:hashFile(log)
  };
  fs.writeFileSync(log + '.json', JSON.stringify(record, null, 2) + '\n', {flag:'wx'});
  if (record.exitCode !== 0 || record.signal || record.error) throw Error('验收命令未通过：' + log);
  return record;
}

function checkPublicAudits() {
  const added=JSON.parse(fs.readFileSync(path.join(__dirname,'ADDITIONAL-REQUIRED-PRE-REGRESSION-GATES-2026-11-17.json'),'utf8'));
  const requiredUserGateIds=['effect-ownership-all-current-imported','xin-driving-consumes-action-confirmation','timed-healing-report-opponent-ownership','all-current-opponent-switch-lock-ownership'];
  if(!Array.isArray(added.requiredAdditionalGates)||requiredUserGateIds.some(id=>!added.requiredAdditionalGates.some(gate=>gate.id===id)))throw Error('新增用户前置任务清单缺失');
  for(const gate of added.requiredAdditionalGates){
    if(!gate.mustPassBeforeFreezeAndNpm||gate.status!=='complete')throw Error('新增用户前置任务尚未闭合：'+gate.id+'，不能进入最终独立批次、冻结或共享整库验收');
    const audit=JSON.parse(fs.readFileSync(path.resolve(root,gate.file),'utf8'));
    if(audit.status!=='complete'||!audit.closure?.verifiedAt||!Array.isArray(audit.closure.inputs)||!audit.closure.inputs.length)throw Error('新增用户前置任务缺少版本绑定闭合证据：'+gate.id);
    for(const input of audit.closure.inputs){const full=path.resolve(root,input.file),relative=path.relative(root,full);if(!relative||relative.startsWith('..')||path.isAbsolute(relative)||hashFile(full)!==input.sha256)throw Error('新增前置任务的闭合输入已变化：'+gate.id+' '+input.file);}
    if(gate.id==='effect-ownership-all-current-imported'&&(!(audit.counts.totalInstances>0)||audit.counts.pendingReview!==0||audit.counts.pendingSemanticQuestions!==0||audit.counts.fixedAndTested!==audit.counts.needsFix||audit.counts.reviewed+(audit.counts.excludedByUser??0)!==audit.counts.totalInstances))throw Error('效果归属仍有未审或未修条目');
    if(gate.id==='effect-ownership-all-current-imported'){
      const scopeName='research/TEAM-STAGE-2/effect-ownership-ally-scope-inventory-v1.json',scopeFile=path.resolve(root,scopeName),scope=JSON.parse(fs.readFileSync(scopeFile,'utf8'));
      if(audit.scopeScreening?.file!==scopeName||audit.scopeScreening.sha256!==hashFile(scopeFile)||scope.candidateRows!==audit.counts.totalInstances||scope.fullCatalogRows!==audit.fullCatalogRows||!scope.screeningOnlyNotOwnershipReviewPass||audit.activeScope?.opponentBranch?.status!=='user-deferred-not-in-current-scope'||audit.activeScope.opponentBranch.notFreezeBlocking!==true)throw Error('最新己方限定范围及对方暂缓范围未正确对齐');
      const inventoryFile=path.join(__dirname,'effect-ownership-current-imported-inventory-v1.json'),inventory=JSON.parse(fs.readFileSync(inventoryFile,'utf8'));
      if(hashFile(inventoryFile)!==scope.sourceInventorySha256)throw Error('归属原始盘点已变化');
      const currentSpecies=fs.readdirSync(path.join(root,'data/species')).filter(f=>/^\d+\.json$/.test(f)).sort(),coveredSpecies=inventory.inputSourceFiles.map(x=>path.basename(x.file)).sort();
      if(JSON.stringify(currentSpecies)!==JSON.stringify(coveredSpecies)||inventory.inputSourceFiles.some(x=>hashFile(path.resolve(root,x.file))!==x.sha256))throw Error('当前导入来源未被范围盘点完整覆盖');
    }
  }
  const leaveAudit=JSON.parse(fs.readFileSync(path.join(__dirname,'global-leave-reset-audit.json'),'utf8'));
  if(leaveAudit.status!=='complete')throw Error('最新统一下场重置规则尚未逐项闭合，不能进入最终冻结或共享整库验收');
  for(const file of ['global-attack-healing-audit.json','global-heal-then-percent-audit.json','forced-first-rank-audit.json']){
    const audit=JSON.parse(fs.readFileSync(path.join(__dirname,file),'utf8'));
    if(audit.status!=='complete')throw Error('最新统一规则尚未逐项闭合：'+file+'，不能进入最终冻结或共享整库验收');
  }
}

function runIndependent() {
  checkPublicAudits();
  const ids=targets(),folder=fs.mkdtempSync(path.join(__dirname,'independent-'));
  const files=finalFrozenInputs(),fingerprint=sha(JSON.stringify(files)),individual=[];
  const save=(name,data)=>fs.writeFileSync(path.join(folder,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
  const environment=environmentFingerprint();
  save('inputs.json',{stage:'pre-freeze-prerequisites',node:process.version,environment,fingerprint,files});
  const check=()=>{if(sha(JSON.stringify(finalFrozenInputs()))!==fingerprint||environmentFingerprint()!==environment)throw Error('独立前置运行期间输入变化');};
  try{
    for(const id of ids){
      check();
      console.log(JSON.stringify({stage:'independent-prerequisites',id,completed:individual.length,total:ids.length,folder:path.relative(root,folder),fullNpmRun:false}));
      const evidence=execute(process.execPath,['automation-validate.cjs',String(id),'--complete','--team-independent'],path.join(folder,id+'.log'),{SEER_TEAM_TEST_CACHE:path.join(__dirname,'native-file-cache')});
      const marker='team independent gate: species '+id+' passed (pending shared complete regression)';
      if(!fs.readFileSync(path.resolve(root,evidence.log),'utf8').split(/\r?\n/).includes(marker))throw Error('缺少逐宠独立通过标记：'+id);
      check();individual.push({id,...evidence});
    }
    save('result.json',{stage:'independent-prerequisites',status:'passed',node:process.version,environment,targets:ids,fingerprint,individual,formalCertified:0,frozen:false,fullNpmRun:false});
    console.log('independent prerequisites passed: '+path.relative(root,folder));
  }catch(error){
    save('result.json',{stage:'independent-prerequisites',status:'rejected',node:process.version,environment,targets:ids,fingerprint,individual,error:error.message,formalCertified:0,frozen:false,fullNpmRun:false});throw error;
  }
  return folder;
}

function independentEvidence(folder,ids) {
  if(!folder)throw Error('必须先完成独立前置；设置SEER_TEAM_INDEPENDENT_BATCH指向其已通过目录，不能提前冻结或npm');
  folder=path.resolve(root,folder);const rel=path.relative(__dirname,folder);
  if(!rel||rel.startsWith('..')||path.isAbsolute(rel))throw Error('独立前置证据目录必须位于TEAM-STAGE-2内');
  const result=JSON.parse(fs.readFileSync(path.join(folder,'result.json'),'utf8'));
  const input=JSON.parse(fs.readFileSync(path.join(folder,'inputs.json'),'utf8'));
  if(result.stage==='environment-reviewed-independent-prerequisites'){
    return require('./environment-migration.cjs').verify({
      folder,result,input,current:finalFrozenInputs(),ids,environment:environmentFingerprint(),passedTests,checkFileOutput
    });
  }
  // Impact evidence entry
  if (result.stage === 'impact-reviewed-independent-prerequisites') {
    return require('./impact-independent-evidence.cjs').verify({
      root, folder, result, input, current:finalFrozenInputs(), nativeFiles:frozenInputs(), ids,
      environment:environmentFingerprint(), checkFileOutput, passedTests, nativeDependencySnapshot
    });
  }
  // End impact evidence entry
  if(result.stage!=='independent-prerequisites'||result.status!=='passed'||result.node!==process.version||result.environment!==environmentFingerprint()||input.environment!==result.environment||
    result.fullNpmRun!==false||result.frozen!==false||JSON.stringify(result.targets)!==JSON.stringify(ids)||
    result.individual?.length!==ids.length||input.stage!=='pre-freeze-prerequisites'||input.node!==process.version||
    sha(JSON.stringify(input.files))!==input.fingerprint||input.fingerprint!==result.fingerprint||
    sha(JSON.stringify(finalFrozenInputs()))!==input.fingerprint)throw Error('逐宠独立前置不完整、输入过期或未通过');
  for(let i=0;i<ids.length;i++){
    const row=result.individual[i],log=path.resolve(root,row.log??''),relative=path.relative(folder,log);
    const args=['automation-validate.cjs',String(ids[i]),'--complete','--team-independent'];
    if(row.id!==ids[i]||row.exitCode!==0||row.signal||row.error||row.command!==process.execPath||
      JSON.stringify(row.args)!==JSON.stringify(args)||!relative||relative.startsWith('..')||path.isAbsolute(relative)||
      hashFile(log)!==row.logSha256||!fs.readFileSync(log,'utf8').split(/\r?\n/).includes('team independent gate: species '+ids[i]+' passed (pending shared complete regression)'))throw Error('逐宠独立原始命令/日志未通过：'+ids[i]);
    const original=JSON.parse(fs.readFileSync(log+'.json','utf8'));
    const {id,...evidence}=row;
    if(JSON.stringify(original)!==JSON.stringify(evidence))throw Error('逐宠独立原始收据不符：'+ids[i]);
  }
  return {folder:path.relative(root,folder),fingerprint:input.fingerprint,individual:result.individual};
}

function run() {
  const ids = targets();
  const prior=independentEvidence(process.env.SEER_TEAM_INDEPENDENT_BATCH,ids);
  checkPublicAudits();
  const folder = fs.mkdtempSync(path.join(__dirname, 'complete-'));
  const frozen = finalFrozenInputs();
  const fingerprint = sha(JSON.stringify(frozen));
  const save = (name, data) => fs.writeFileSync(path.join(folder, name), JSON.stringify(data, null, 2) + '\n', {flag:'wx'});
  const checkFreeze = () => {
    if (sha(JSON.stringify(finalFrozenInputs())) !== fingerprint) throw Error('冻结输入已变化，本轮证据失效');
  };
  save('inputs.json', {fingerprint, files:frozen});
  const individual = prior.individual;
  try {
    if(prior.fingerprint!==fingerprint)throw Error('独立前置与冻结版不一致');
    checkFreeze();
    const npmLog = path.join(folder, 'npm.log');
    const npm = process.platform === 'win32'
      ? execute('cmd.exe', ['/d','/s','/c','npm test'], npmLog)
      : execute('npm', ['test'], npmLog);
    const counts = passedTests(fs.readFileSync(npmLog, 'utf8'));
    checkFreeze();
    // Impact evidence final check
    if (prior.impact) independentEvidence(prior.folder, ids);
    // End impact evidence final check
    save('result.json', {stage:'complete',status:'passed',targets:ids,fingerprint,independentPrerequisites:prior.folder,individual,fullRegression:{...npm,counts}});
  } catch (error) {
    save('result.json', {stage:'complete',status:'rejected',certified:0,fingerprint,individual,error:error.message});
    throw error;
  }
}

module.exports = {auditClosureInputs, finalFrozenInputs, targets, passedTests, checkFileOutput, nativeDependencySnapshot, nativeFileCache, runIndependent, independentEvidence, run};

