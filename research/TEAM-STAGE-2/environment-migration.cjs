'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hashFile = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const root = path.resolve(__dirname,'../..');
const stage = 'research/TEAM-STAGE-2/';
const excluded = new Set(['NODE_TEST_CONTEXT','CODEX_TOOL_CALL_ID','SEER_TEAM_TEST_CACHE','SEER_TEAM_INDEPENDENT_BATCH']);

// Store aggregate hashes per capability. Diagnostic records contain no environment values.
function capture(env=process.env) {
  const entries = Object.entries(env).filter(([key])=>!excluded.has(key)).sort(([a],[b])=>a.localeCompare(b));
  const group = pattern => digest(entries.filter(([key])=>pattern.test(key)));
  return {
    schemaVersion:1, full:digest(entries),
    runtime:digest([process.version, process.versions, process.execPath, hashFile(process.execPath), process.arch, process.platform, os.endianness(),
      group(/^(?:NODE_(?!(?:TEST_|USE_ENV_PROXY|EXTRA_CA_CERTS|TLS_|USE_SYSTEM_CA|USE_PEM|REDIRECT_WARNINGS))|V8_|OPENSSL_|LD_|DYLD_)/i)]),
    testRunner:group(/^NODE_TEST_/i), cwd:digest([process.cwd(),root]),
    locale:group(/^(?:TZ$|LANG$|LC_|LANGUAGE$|ICU_)/i),
    http:group(/^(?:HTTP_PROXY$|HTTPS_PROXY$|ALL_PROXY$|NO_PROXY$|NODE_(?:USE_ENV_PROXY|EXTRA_CA_CERTS|TLS_|USE_SYSTEM_CA|USE_PEM)|SSL_CERT_|UV_)/i),
    child:group(/^(?:SYSTEMROOT|WINDIR|COMSPEC|SYSTEMDRIVE|PATHEXT)$/i),
    temp:group(/^(?:TMP|TEMP|TMPDIR)$/i)
  };
}
const profiles = {
  native:['runtime','testRunner','cwd'],
  workspace:['runtime','testRunner','cwd','locale'],
  child:['runtime','testRunner','cwd','child','locale'],
  http:['runtime','testRunner','cwd','child','http','locale'],
  temp:['runtime','testRunner','cwd','child','temp','locale'],
  opaque:['runtime','testRunner','cwd','full']
};
function changedCapabilities(previous,current,profile) {
  assert.ok(Object.hasOwn(profiles,profile),'unknown proof capabilities '+profile);
  return profiles[profile].filter(key => typeof previous?.[key]!=='string' || previous[key]!==current[key]);
}
function evidenceChanges(previous,current,profile,beforeFiles,afterFiles) {
  const keys=new Set([...Object.keys(beforeFiles),...Object.keys(afterFiles)]);
  return {environment:changedCapabilities(previous,current,profile),files:[...keys].filter(key=>beforeFiles[key]!==afterFiles[key]).sort()};
}
function affectedNative(plan,changedFiles,previous,current) {
  const changed=new Set(changedFiles), affected=[];
  for(const row of plan.files){
    const dependencies=plan.closures[row.dependencySet];
    assert.ok(Array.isArray(dependencies)&&dependencies.includes(row.file),row.file);
    const files=dependencies.filter(f=>changed.has(f));
    if(row.usesReviewedLocalRead){
      // Search and catalog may consume any deployed species. Directly bound
      // JSON modules already occur in the closure for tests without this API.
      for(const file of changed)if(/^data\/species\/\d+\.json$/.test(file)&&!files.includes(file))files.push(file);
    }
    const environment=changedCapabilities(previous,current,row.profile);
    if(files.length||environment.length)affected.push({file:row.file,files,environment});
  }
  return affected;
}

function read(file) {return JSON.parse(fs.readFileSync(file,'utf8'));}
function resolve(name) {
  assert.equal(typeof name,'string');
  const file=path.resolve(root,name),relative=path.relative(root,file);
  assert.ok(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative),name);
  return file;
}
function reference(ref) {
  const file=resolve(ref.file);
  assert.equal(hashFile(file),ref.sha256,ref.file);
  return file;
}
function verify({folder,result,input,current,ids,environment,passedTests,checkFileOutput}) {
  const approved=read(path.join(__dirname,'environment-migration-policy.json'));
  const plan=read(reference(approved.plan));
  const archive=read(reference(approved.history));
  const before=read(reference(approved.previousInputs));
  const historic=read(reference(approved.historicalProof)).verified;
  const observed=capture();
  assert.equal(environment,observed.full);
  assert.equal(process.cwd(),root);
  assert.equal(result.stage,'environment-reviewed-independent-prerequisites');
  assert.equal(result.status,'passed');
  assert.equal(result.fullNpmRun,false);
  assert.equal(result.frozen,false);
  assert.equal(result.node,process.version);
  assert.equal(result.policySha256,hashFile(path.join(__dirname,'environment-migration-policy.json')));
  assert.deepEqual(result.targets,ids);
  assert.deepEqual(archive.verified,historic);
  assert.deepEqual(historic.individual.map(x=>x.id),ids);
  assert.equal(input.stage,'pre-freeze-prerequisites');
  assert.equal(input.fingerprint,digest(input.files));
  assert.equal(result.fingerprint,input.fingerprint);
  if(input.fingerprint!==digest(current)){
    const changed=Object.keys({...input.files,...current}).filter(f=>input.files[f]!==current[f]);
    const profile=read(reference(approved.bootstrapProfile));
    const native=affectedNative(plan,changed,profile,observed);
    throw Error('冻结输入已变化，需按影响范围重新绑定：'+JSON.stringify({changed,native:native.map(r=>r.file)}));
  }
  assert.deepEqual(input.files,current);
  assert.equal(before.fingerprint,digest(before.files));
  assert.equal(archive.frozenFingerprint,before.fingerprint);
  assert.equal(plan.scope,before.fingerprint);
  assert.equal(archive.certifiesNewEnvironment,false);
  const allowed=approved.assemblyChanges;
  const actualDiff=Object.keys({...before.files,...current}).filter(f=>before.files[f]!==current[f]).sort();
  assert.deepEqual(actualDiff,Object.keys(allowed).sort(),'unreviewed freeze change');
  for (const [file,expected] of Object.entries(allowed)) {
    assert.ok(current[file],file);
    if(file===stage+'environment-migration-policy.json') continue;
    assert.equal(current[file],expected,file);
  }
  // The original ownership review retains all decisions. Only its controller binding moves.
  const owner=read(resolve(stage+'effect-ownership-audit.json'));
  const ownerBefore=read(reference(approved.originalOwner));
  const driverName=stage+'shared-complete.cjs';
  const driver=owner.closure.inputs.filter(x=>x.file===driverName);
  assert.equal(driver.length,1);
  assert.equal(driver[0].sha256,current[driverName]);
  driver[0].sha256=before.files[driverName];
  assert.deepEqual(owner,ownerBefore);
  for(const [file,expected] of Object.entries(plan.bindings)){
    if(Object.hasOwn(allowed,file))continue;
    assert.equal(hashFile(resolve(file)),expected,file);
  }
  assert.equal(approved.historicalEnvironment,archive.historicalEnvironment);
  const nativeSet=new Set(plan.files.map(x=>x.file));
  assert.equal(nativeSet.size,plan.files.length);
  const priorByFile=new Map();
  const requiredSourceRows=new Map(historic.individual.map(r=>[r.id,r.sourceRows]));
  const replayed=new Set(), carried=new Set(), http=[];
  const normal=name=>name.replaceAll('\\','/');
  for(const id of ids) {
    const species=plan.species[id];
    assert.equal(species.sourceRows,requiredSourceRows.get(id));
    for(const ref of species.native) {
      assert.ok(nativeSet.has(ref.file),ref.file);
      if(!priorByFile.has(ref.file))priorByFile.set(ref.file,new Set());
      priorByFile.get(ref.file).add(normal(ref.record));
    }
  }
  assert.equal(priorByFile.size,nativeSet.size);
  const runtimeChanges=[];
  function requireProfile(old,kind,label) {
    const keys=changedCapabilities(old,observed,kind);
    if(keys.length)runtimeChanges.push({proof:label,changed:keys});
  }
  // The policy pins the reviewed bootstrap capabilities, including the executable.
  const sourceProfile=read(reference(approved.bootstrapProfile));
  const correction = approved.correctiveReview
    ? require('./corrective-evidence.cjs').verifyCorrection({
        descriptor:read(reference(approved.correctiveReview)), reference, current, ids, plan,
        sourceProfile, affectedNative, observed, checkFileOutput
      })
    : null;
  const registeredProfiles=new Map([sourceProfile,...(approved.additionalProfiles??[]).map(ref=>read(reference(ref)))].map(p=>[p.full,p]));
  for(const [id,profile] of Object.entries(result.receiptProfiles)){
    assert.deepEqual(profile,registeredProfiles.get(id),'unbound capability observation '+id);
  }
  requireProfile(sourceProfile,'native','historical source verdicts');
  const httpName='本地阶段完成精灵经浏览器请求客户端和HTTP搜索加载，全部技能可注入单挑';
  const receiptProfiles=result.receiptProfiles;
  for(const id of ids){
    const row=read(reference(result.http[id]));
    assert.equal(row.id,id);
    assert.equal(row.command,process.execPath);
    assert.deepEqual(row.args,['--test',path.join(root,'tests','local-integration.test.cjs')]);
    assert.deepEqual(row.overrides,{SEER_INTEGRATION_ID:String(id),SEER_COMPLETE_TEAM_ID:String(id)});
    assert.equal(row.exitCode,0);assert.equal(row.signal,null);assert.equal(row.error,null);
    assert.equal(row.validationError,null);
    if (correction && row.fingerprint !== input.fingerprint) {
      assert.deepEqual(result.http[id],correction.prior.http[id],'unbound prior HTTP receipt '+id);
    }
    assert.ok([before.fingerprint,input.fingerprint,correction?.baseFingerprint].includes(row.fingerprint) && typeof row.fingerprint==='string');
    const context=receiptProfiles[row.environment];
    assert.equal(context?.full,row.environment);
    requireProfile(context,'http','HTTP '+id);
    const log=reference({file:row.log,sha256:row.logSha256});
    const counts=checkFileOutput(fs.readFileSync(log,'utf8'),log,[httpName]);
    assert.deepEqual(row.counts,counts);assert.equal(counts.tests,1);
    http.push(id);
  }
  for(const item of plan.files){
    const file=item.file;
    const replacement=result.native[file];
    const oldRefs=priorByFile.get(file);
    assert.ok(oldRefs.size);
    if(!replacement) {
      assert.ok(!correction?.impacted.has(file),'dependency changed, current native run required '+file);
      assert.equal(item.decision,'content-bound-native',file+' needs a new run');
      assert.equal(current[file],item.sha256,file);
      requireProfile(sourceProfile,item.profile??'native',file);
      carried.add(file);
      continue;
    }
    const row=read(reference(replacement));
    assert.equal(row.file,file);assert.equal(row.fileSha256,current[file]);
    assert.equal(row.command,process.execPath);assert.equal(row.cwd,root);
    assert.deepEqual(row.args,['--test','--test-reporter=spec',resolve(file)]);
    assert.equal(row.exitCode,0);assert.equal(row.signal,null);assert.equal(row.error,null);assert.equal(row.validationError,null);
    if (correction && row.fingerprint !== input.fingerprint) {
      assert.ok(!correction.impacted.has(file),'stale native run '+file);
      assert.deepEqual(replacement,correction.prior.native[file],'unbound prior native receipt '+file);
      assert.ok(row.fingerprint===correction.baseFingerprint ||
        approved.preAssemblyReplays.includes(file) && row.fingerprint===before.fingerprint,file);
    } else {
      assert.ok(row.fingerprint===input.fingerprint ||
        approved.preAssemblyReplays.includes(file) && row.fingerprint===before.fingerprint,file);
    }
    const context=receiptProfiles[row.environment];
    assert.equal(context?.full,row.environment);
    requireProfile(context,item.profile??'opaque',file);
    const raw=fs.readFileSync(reference({file:row.log,sha256:row.logSha256}),'utf8');
    for(const old of oldRefs) {
      const original=read(resolve(old));
      const output=fs.readFileSync(reference({file:original.log,sha256:original.logSha256}),'utf8');
      const names=[...output.matchAll(/^✔ (.*) \([\d.]+ms\)\s*$/gm)].map(m=>m[1]);
      assert.ok(names.length>0,old);
      const counts=checkFileOutput(raw,file,names);
      assert.equal(counts.tests,passedTests(output).tests,file);
      assert.deepEqual(counts,row.counts);
    }
    replayed.add(file);
  }
  assert.deepEqual(Object.keys(result.http).map(Number).sort((a,b)=>a-b),[...ids].sort((a,b)=>a-b));
  assert.deepEqual(Object.keys(result.native).sort(),[...replayed].sort());
  assert.deepEqual(runtimeChanges,[],'affected evidence requires current execution '+JSON.stringify(runtimeChanges));
  const individual=historic.individual.map(row=>({...row,evidenceDisposition:'environment-reviewed',originalDisposition:row.evidenceDisposition,
    currentHttpReceipt:result.http[row.id],currentNativeReceipts:plan.species[row.id].native.filter(x=>replayed.has(x.file)).map(x=>result.native[x.file])}));
  return {folder:path.relative(root,folder),fingerprint:input.fingerprint,individual,
    impact:{historicalEnvironment:approved.historicalEnvironment,observedEnvironment:observed.full,sourceRows:individual.reduce((n,r)=>n+r.sourceRows,0),
      carriedNative:carried.size,reexecutedNative:replayed.size,http:http.length,...(correction?{correctedReviews:correction.reviewCount,verifiedCases:correction.caseCount,changedNativeDependencies:correction.impacted.size}:{})}};
}
module.exports={capture,changedCapabilities,evidenceChanges,affectedNative,verify};

