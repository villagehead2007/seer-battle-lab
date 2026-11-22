'use strict';

// Independent completion gate for AUTO-PROGRESS.json.  This deliberately
// checks the deployed snapshot and executable registrations instead of trusting
// a Codex-written status field.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const E = require('./dist/engine.js');
const store = require('./local-species.cjs');
const {validateCoverage,reviewCoverage,digest}=require('./completion-policy.cjs');
const {build}=require('./research/build-multiplayer-todo.cjs');
const root = __dirname;
const todoFile = path.join(root, 'MULTI-PET-TODO.json');
const teamGate = process.argv.includes('--complete') ? require('./research/TEAM-STAGE-2/shared-complete.cjs') : null;
if(process.argv[2]==='--team-prerequisites'){
  if(!teamGate||process.argv.includes('--preflight'))throw Error('需要 --team-prerequisites --complete');
  teamGate.runIndependent();
  process.exit(0);
}
if (process.argv[2] === '--team-all') {
  if (!process.argv.includes('--complete') || process.argv.includes('--preflight')) throw Error('需要 --team-all --complete');
  teamGate.run();
  process.exit(0);
}
function readTodo() {
  if (!fs.existsSync(todoFile)) return null;
  const value = JSON.parse(fs.readFileSync(todoFile, 'utf8'));
  return value && value.schemaVersion === 1 && Array.isArray(value.records) ? value : null;
}
function runNpmTest(failures) {
  const startedAt = new Date().toISOString();
  const npmLog = path.join(root, 'research', `validator-${id}-npm-${startedAt.replace(/[:.]/g, '-')}.log`);
  // The latest 13k-test full run took 7.5h. Keep its complete output on disk
  // while it runs, and allow enough time without changing the test command.
  const fd=fs.openSync(npmLog,'wx');
  const options = { cwd:root, encoding:'utf8', timeout:12*60*60*1000, windowsHide:true, stdio:['ignore',fd,fd] };
  console.log(`validator npm test started: ${path.relative(root,npmLog)}`);
  let result;
  try { result = process.platform === 'win32'
    ? cp.spawnSync('cmd.exe', ['/d','/s','/c','npm test'], options)
    : cp.spawnSync('npm', ['test'], options);
  } finally { fs.closeSync(fd); }
  fs.writeFileSync(npmLog.replace(/\.log$/, '-result.json'), JSON.stringify({ startedAt, completedAt:new Date().toISOString(), exitCode:result.status, signal:result.signal, error:result.error?.message ?? null, log:path.relative(root,npmLog), executedInsideValidator:true }, null, 2)+'\n', { flag:'wx' });
  console.log(`validator npm test log: ${path.relative(root,npmLog)}`);
  if (result.error) failures.push(`tests: npm test 无法启动：${result.error.message}`);
  else if (result.status !== 0) failures.push(`tests: npm test 失败（退出码 ${result.status}）${fs.readFileSync(npmLog,'utf8').trim().slice(-2000)}`);
  else if (teamScope) {
    try {teamGate.passedTests(fs.readFileSync(npmLog,'utf8'));}
    catch(error){failures.push('tests: '+error.message);}
  }
}

if (process.argv[2] === '--state') {
  const stateFile = path.join(__dirname, 'AUTO-PROGRESS.json');
  const ids = fs.readFileSync(path.join(__dirname, 'seer_id.txt'), 'utf8')
    .split(/\r?\n/).map(x => x.trim()).filter(x => /^\d+$/.test(x)).map(Number);
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  const failures = [];
  if (state.schemaVersion !== 2) failures.push('state: schemaVersion 2 required');
  if (!Number.isInteger(state.cursor?.index) || ids[state.cursor.index] !== state.cursor.id) {
    failures.push('state: cursor does not match seer_id.txt');
  }
  if (!['source', 'engine', 'tests', 'verify', 'advance'].includes(state.phase)) {
    failures.push('state: invalid phase');
  }
  if (state.strategy?.mode !== 'single-first' || state.strategy?.currentStage !== 'single') {
    failures.push('state: single-first strategy is required');
  }
  if (!Array.isArray(state.completedSubtasks) || !Array.isArray(state.pendingEffects) || !Array.isArray(state.deferredEffects) || !Array.isArray(state.sources)) {
    failures.push('state: durable phase arrays are missing');
  }
  if (failures.length) { console.error('scheduler state rejected'); failures.forEach(x => console.error(`- ${x}`)); process.exit(1); }
  console.log(`scheduler state passed: ${state.phase} species ${state.cursor.id} (single stage)`);
  process.exit(0);
}

const id = Number(process.argv[2]);
const complete = process.argv.includes('--complete');
const preflight = process.argv.includes('--preflight');
let teamScope=false;
if(complete){try{teamScope=teamGate.targets().includes(id);}catch{/* No authority: retain the original complete gates. */}}
const independent = process.argv.includes('--team-independent');
if(independent && (!teamScope || preflight)){
  console.error('team independent gate: outside authorized complete scope');
  process.exit(2);
}
if (preflight) {
  const queueLines = fs.readFileSync(path.join(root, 'seer_id.txt'), 'utf8').split(/\r?\n/);
  const approvals = [
    {file:'research/next50-answer-takeover-2026-10-26T17-09-55-144Z/USER-BATCH-VALIDATION-AUTHORIZATION-2026-10-27.json',start:226,end:276},
    {file:'research/BATCH-4676-NEXT50/ANSWER-IMPLEMENTATION-2026-10-31T04-30-49-890Z/USER-BATCH-VALIDATION-AUTHORIZATION-2026-10-31.json',start:276,end:326},
    {file:'research/BATCH-4816-REMAINING/AUTHORIZATION.json',start:326,end:378,count:52,snapshot:'research/BATCH-4816-REMAINING/QUEUE-SNAPSHOT.json',queueHash:'9893e8955c830cadd9478e98b5dca51885a7a92b1e434abcf4863f2dade83fea'}
  ];
  const temporaryAuthorityFile=path.join(root,'research/LIGHT-SP-2026-11-07/SHARED-REGRESSION-AUTHORIZATION.json');
  let authorizedTemporary=false;
  if(fs.existsSync(temporaryAuthorityFile)){
    try{authorizedTemporary=require('./shared-stage-authorization.cjs').allows(JSON.parse(fs.readFileSync(temporaryAuthorityFile,'utf8')),id,complete,fs.readFileSync(path.join(root,'seer_id.txt')));}catch{/* Invalid authority never permits preflight. */}
  }
  const authorized = authorizedTemporary || approvals.some(entry=>{
    const file=path.join(root,entry.file);
    if(!fs.existsSync(file))return false;
    const data=JSON.parse(fs.readFileSync(file,'utf8')),ids=data.ids;
    const queue=queueLines.slice(entry.start,entry.end).map(x=>Number(x.trim()));
    if(entry.snapshot){
      const frozen=JSON.parse(fs.readFileSync(path.join(root,entry.snapshot),'utf8'));
      if(data.fixedQueue!==entry.queueHash||frozen.sha256!==entry.queueHash||!Array.isArray(frozen.targets)||
        JSON.stringify(frozen.targets)!==JSON.stringify(queue.map((id,index)=>({id,line:entry.start+index+1})))||
        data.executionFrequency!=='full-regression-after-fixed-range-independent-work')return false;
    }
    return Array.isArray(ids)&&ids.length===(entry.count??50)&&JSON.stringify(ids)===JSON.stringify(queue)&&ids.includes(id);
  });
  if (complete || !authorized) {
    console.error('preflight rejected: authorized fixed single-stage scope required');
    process.exit(2);
  }
}
if (!Number.isInteger(id) || id < 1) {
  console.error('completion gate: invalid species id');
  process.exit(2);
}

const failures = [];
let snapshot;
try {
  snapshot = store.species(id);
} catch (error) {
  failures.push(`local snapshot: ${error.message}`);
}
const todo = readTodo();
const proofFile=path.join(root,'research/TEAM-STAGE-2/complete-reviews.json');
const teamProofs=teamScope && fs.existsSync(proofFile)
  ? JSON.parse(fs.readFileSync(proofFile,'utf8')).entries : {};
const hasTeamProof=row=>row?.speciesId===id && !!teamProofs[row.key];
if (!todo) failures.push('multiplayer registry: MULTI-PET-TODO.json missing or invalid; regenerate it');
let reviews={entries:{}};
try { reviews=JSON.parse(fs.readFileSync(path.join(root,'SINGLE-STAGE-REVIEWS.json'),'utf8')); }
catch(error) { failures.push(`semantic reviews: ${error.message}`); }

if (snapshot) {
  const coverage=reviewCoverage(snapshot,reviews);
  console.log(`semantic review coverage: species ${id}, total=${coverage.total}, missing=${coverage.missing.length}, stale=${coverage.stale.length}`);
  if(teamScope)failures.push(...require('./research/TEAM-STAGE-2/independent-registry-compatibility.cjs').validate(snapshot,reviews,todo,root,teamProofs));
  else failures.push(...validateCoverage(snapshot,reviews,todo,root,complete,teamProofs));
  const expected=build([snapshot],reviews).records;
  const actual=(todo?.records??[]).filter(x=>x.speciesId===id);
  if(!teamScope&&digest(expected)!==digest(actual))failures.push('multiplayer registry: stale, duplicate or missing records; regenerate it');
  const pendingReviews=actual.filter(x=>x.reviewStatus!=='reviewed').map(x=>x.key);
  if(pendingReviews.length)failures.push(`multiplayer registry: semantic review still required for ${pendingReviews.join('、')}; historical deferred labels are not exemptions`);
  const issues = store.issues(snapshot);
  if (issues.length) failures.push(...issues.map(x => `snapshot: ${x}`));
  // A semantic completion is deployable only when the same local snapshot
  // that the browser endpoint serves can pass the real selection and battle
  // initialization path.  Earlier snapshots were manually assembled and
  // lacked source.storage, so the UI treated them as online data even though
  // the rule-only gate passed.
  if (snapshot.source?.storage !== 'local') failures.push('integration: snapshot is not marked as locally deployed');
  if (snapshot.deployment?.scope !== 'single') failures.push('integration: single-stage deployment record missing');
  const sourcePolicy=require('./source-policy.cjs');
  const authorSource=snapshot.source?.provider==='user-original'&&sourcePolicy.originalIssues(snapshot,root).length===0;
  if (!authorSource&&((snapshot.source?.provider !== 'seerapi' && !(snapshot.source?.provider==='composite'&&sourcePolicy.compositeIssues(snapshot,root).length===0)) || !snapshot.source?.revision || !snapshot.source?.url)) {
    failures.push('snapshot: missing SeerAPI provider or revision');
  }
  if (!Array.isArray(snapshot.souls) || snapshot.souls.length === 0) {
    failures.push('soulmark: no real soulmark recorded');
  }
  for (const soul of snapshot.souls ?? []) {
    const rule = E.SOULS.registry[soul.id];
    if (!rule) failures.push(`soulmark ${soul.id}: no registered implementation`);
    else {
      if (['seerapi','composite','user-original'].includes(snapshot.source?.provider) && !E.SOULS.acceptsSource(soul.id,soul.hash)) {
        failures.push(`soulmark ${soul.id}: source hash mismatch`);
      }
      for (const description of rule.deferred ?? []) {
        const records = actual.filter(row => row.kind === 'soul' && row.ruleId === soul.id);
        const matching = records.filter(row => {
          if (row.legacyNotes?.includes(description)) return true;
          // The round 158 review changed the leave behavior while retaining the canonical binding.
          return teamScope && row.key === '4925:soul:2120' && soul.hash === 'e0d4403d' &&
            row.sourceDigest === '6a068a482b772a96d25dc93d600f6de6af7008c8ed060478d7037191c8430aa2' &&
            teamProofs[row.key]?.historicalNativeInterpretationSupersededBy === 'research/TEAM-STAGE-2/round158-doctor-leave-reset-closure-20261113.json' &&
            description === '真实再次登场重复消强/睡眠；未注明保留的递减时长依全局规则下场重置；本人真实场下时观察双方复活及重置；当前在场真实0到正HP的重生与立即死亡回复成功观察已实现';
        });
        if (!matching.some(row => row.source?.url && row.source?.revision && row.raw?.description)) {
          failures.push(`soulmark ${soul.id}: deferred entry missing from unified multiplayer registry`);
        }
        if (complete && !matching.some(hasTeamProof)) failures.push(`soulmark ${soul.id}: deferred behavior remains`);
      }
    }
  }
  if (!Array.isArray(snapshot.moves) || snapshot.moves.length === 0) {
    failures.push('skills: no skills recorded');
  }
  failures.push(...E.WIKI.skillVersionIssues(snapshot,true).map(issue=>`skills: ${issue}`));
  if (snapshot.missingEffects?.length) failures.push('effects: missingEffects is non-empty');
  if (complete && snapshot.deferredEffects?.length) failures.push('effects: deferredEffects is non-empty');
  if (complete && snapshot.deployment?.deferredSouls?.some(note=>!(todo?.records??[]).some(row=>
    row.kind==='soul' && row.ruleId===note.soulId && row.legacyNotes?.includes(note.description) && hasTeamProof(row)))) {
    failures.push('effects: deployment deferredSouls is non-empty');
  }

  for (const move of snapshot.moves ?? []) {
    const issue = E.WIKI.moveIssue(move, snapshot);
    if (issue) failures.push(`${move.name || move.id}: ${issue}`);
    if (move.limitations?.length) failures.push(`${move.name || move.id}: unresolved limitations remain`);
    const compiled = E.WIKI.compile(move, snapshot);
    if (compiled.issue) failures.push(`${move.name || move.id}: compile failed: ${compiled.issue}`);
    for (const deferred of compiled.deferred ?? []) {
      const found = (todo?.records ?? []).some(x => x.speciesId === id && x.skillId === move.id && (deferred.effectId ? x.ruleId===deferred.effectId : x.kind==='move') && x.source?.url && x.source?.revision && x.raw);
      if (!found) failures.push(`${move.name || move.id}: deferred effect ${deferred.effectId ?? deferred.field ?? 'unknown'} missing from unified multiplayer registry`);
      if (complete) {
        const rows=(todo?.records??[]).filter(row=>row.speciesId===id && row.skillId===move.id &&
          (deferred.effectId?row.ruleId===deferred.effectId:row.kind==='move'));
        if(!rows.length || !rows.every(hasTeamProof))failures.push(`${move.name || move.id}: deferred effects remain`);
      }
    }
    for (const instance of move.effectInstances ?? []) {
      const rule = E.WIKI.effectsEngine.registry[instance.id];
      if (!rule || typeof rule.execute !== 'function') {
        failures.push(`${move.name || move.id}: effect ${instance.id} has no executable registration`);
      }
    }
  }
  const integrationTest = path.join(root, 'tests', 'local-integration.test.cjs');
  if (!fs.existsSync(integrationTest)) failures.push('integration: local game data-chain test missing');
  try {
    if (!store.search(String(id)).results.some(entry => entry.id === id)) throw new Error('species missing from local search');
    const opponent = store.search('').results.map(x => x.id).find(other => other !== id);
    if (!opponent) throw new Error('no second locally deployed species available');
    const otherSnapshot = store.species(opponent);
    for (const version of E.WIKI.versionSnapshots(snapshot)) {
    const loadouts = [E.WIKI.defaultMoves(version), E.WIKI.defaultMoves(otherSnapshot)];
    const check = E.WIKI.assess(version, loadouts[0]);
    if (!check.supported) throw new Error(`local selection rejected: ${check.issues.join('；')}`);
    E.WIKI.prepare([version, otherSnapshot], loadouts);
    const battle = E.createBattle({wikiSnapshots:[version, otherSnapshot],wikiLoadouts:loadouts,criticals:false});
    if (battle.fighters.length !== 2 || battle.fighters.some(f => !Array.isArray(f.moves) || f.moves.length !== loadouts[f.side].length)) {
      throw new Error('battle fighters or skill loadout was not initialized');
    }
    }
  } catch (error) {
    failures.push(`integration: local selection/battle initialization failed: ${error.message}`);
  }
}

const testFiles = fs.existsSync(path.join(__dirname, 'tests'))
  ? fs.readdirSync(path.join(__dirname, 'tests')).filter(name => name.endsWith('.test.cjs'))
  : [];
const mentions = testFiles.some(name => {
  const text = fs.readFileSync(path.join(__dirname, 'tests', name), 'utf8');
  return new RegExp(`\\b${id}\\b`).test(text) && /\btest\s*\(/.test(text) && /assert\./.test(text);
});
if (!mentions) failures.push('tests: no species-specific assertion test found');
const targeted=path.join(root,'tests',`deployed-${id}.test.cjs`);
if(!fs.existsSync(targeted))failures.push('tests: dedicated species state assertion test required');
if(!failures.length) {
  const selected=preflight||teamScope ? testFiles.filter(name=>name===`deployed-${id}.test.cjs`||name.startsWith(`deployed-${id}-`)||name===`next50-${id}.test.cjs`||name.startsWith(`next50-${id}-`)).map(name=>path.join(root,'tests',name)) : [targeted];
  if(teamScope){
    const cache=independent&&process.env.SEER_TEAM_TEST_CACHE?teamGate.nativeFileCache(process.env.SEER_TEAM_TEST_CACHE):null;
    const files=new Map(selected.map(file=>[file,new Set()]));
    for(const {key} of require('./completion-policy.cjs').inventory(snapshot)){
      for(const proof of [reviews.entries[key],teamProofs[key]]){
        for(const branch of ['success','failure','boundary','interaction']){
          for(const ref of proof?.tests?.[branch]??[]){
            const file=path.join(root,ref.file);
            if(!files.has(file))files.set(file,new Set());
            files.get(file).add(ref.name);
          }
        }
      }
    }
    for(const [file,names] of files){
      let result;
      try{result=cache?cache.run(file,names):cp.spawnSync(process.execPath,['--test','--test-reporter=spec',file],{
        cwd:root,encoding:'utf8',timeout:12*60*60*1000,maxBuffer:8*1024*1024,windowsHide:true
      });}catch(error){failures.push('tests: '+error.message);break;}
      console.log(JSON.stringify({species:id,file:path.relative(root,file),exitCode:result.status,signal:result.signal,...(result.reusedFrom?{reusedFrom:result.reusedFrom}:{})}));
      console.log(result.stdout??'');
      if(result.error||result.status!==0){failures.push('tests: '+file+' '+(result.error?.message??result.stderr??result.status));break;}
      try{teamGate.checkFileOutput(result.stdout??'',file,names);}
      catch(error){failures.push('tests: '+error.message);break;}
    }
    try{cache?.finish();}catch(error){failures.push('tests: '+error.message);}
  }else{
    const result=cp.spawnSync(process.execPath,['--test','--test-concurrency=4',...selected],{cwd:root,encoding:'utf8',timeout:15*60*1000,maxBuffer:8*1024*1024,windowsHide:true});
    if(preflight)console.log(`preflight species test files: ${selected.map(x=>path.basename(x)).join(', ')}`);
    if(preflight&&result.stdout)console.log(result.stdout.trim());
    if(result.error||result.status!==0)failures.push(`tests: targeted test failed: ${result.error?.message??result.stderr??result.stdout}`);
  }
}
if(!failures.length) {
  const result=cp.spawnSync(process.execPath,['--test',path.join(root,'tests','local-integration.test.cjs')],{
    cwd:root,env:{...process.env,SEER_INTEGRATION_ID:String(id),SEER_COMPLETE_TEAM_ID:teamScope?String(id):''},
    encoding:'utf8',timeout:teamScope?15*60*1000:60*1000,windowsHide:true
  });
  if(preflight&&result.stdout)console.log(result.stdout.trim());
  if(result.error||result.status!==0)failures.push(`integration: HTTP search/load/battle test failed: ${result.error?.message??`${result.stdout??''}\n${result.stderr??''}`}`);
  if(teamScope){
    console.log(JSON.stringify({species:id,httpExitCode:result.status,signal:result.signal}));
    console.log(result.stdout??'');
    try{teamGate.passedTests(result.stdout??'');}catch(error){failures.push('integration: '+error.message);}
  }
}
if (!failures.length && !preflight && !independent) runNpmTest(failures);

if (failures.length) {
  console.error(`completion gate: species ${id} rejected (${complete ? 'complete' : 'single-stage'})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
if (independent) console.log(`team independent gate: species ${id} passed (pending shared complete regression)`);
else if (preflight) console.log(`preflight gate: species ${id} passed (pending-batch-full-regression; NOT stage complete)`);
else console.log(`completion gate: species ${id} passed (${complete ? 'complete' : 'single-stage'})`);
