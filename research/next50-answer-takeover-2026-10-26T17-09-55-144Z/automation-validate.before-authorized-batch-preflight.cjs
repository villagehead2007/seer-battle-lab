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
function readTodo() {
  if (!fs.existsSync(todoFile)) return null;
  const value = JSON.parse(fs.readFileSync(todoFile, 'utf8'));
  return value && value.schemaVersion === 1 && Array.isArray(value.records) ? value : null;
}
function runNpmTest(failures) {
  const startedAt = new Date().toISOString();
  const npmLog = path.join(root, 'research', `validator-${id}-npm-${startedAt.replace(/[:.]/g, '-')}.log`);
  const options = { cwd:root, encoding:'utf8', timeout:3*60*60*1000, maxBuffer:8*1024*1024, windowsHide:true };
  const result = process.platform === 'win32'
    ? cp.spawnSync('cmd.exe', ['/d','/s','/c','npm test'], options)
    : cp.spawnSync('npm', ['test'], options);
  fs.writeFileSync(npmLog, `${result.stdout ?? ''}\n${result.stderr ?? ''}`, { flag:'wx' });
  fs.writeFileSync(npmLog.replace(/\.log$/, '-result.json'), JSON.stringify({ startedAt, completedAt:new Date().toISOString(), exitCode:result.status, signal:result.signal, error:result.error?.message ?? null, log:path.relative(root,npmLog), executedInsideValidator:true }, null, 2)+'\n', { flag:'wx' });
  console.log(`validator npm test log: ${path.relative(root,npmLog)}`);
  if (result.error) failures.push(`tests: npm test 无法启动：${result.error.message}`);
  else if (result.status !== 0) failures.push(`tests: npm test 失败（退出码 ${result.status}）${`${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim().slice(-2000)}`);
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
if (!todo) failures.push('multiplayer registry: MULTI-PET-TODO.json missing or invalid; regenerate it');
let reviews={entries:{}};
try { reviews=JSON.parse(fs.readFileSync(path.join(root,'SINGLE-STAGE-REVIEWS.json'),'utf8')); }
catch(error) { failures.push(`semantic reviews: ${error.message}`); }

if (snapshot) {
  const coverage=reviewCoverage(snapshot,reviews);
  console.log(`semantic review coverage: species ${id}, total=${coverage.total}, missing=${coverage.missing.length}, stale=${coverage.stale.length}`);
  failures.push(...validateCoverage(snapshot,reviews,todo,root,complete));
  const expected=build([snapshot],reviews).records;
  const actual=(todo?.records??[]).filter(x=>x.speciesId===id);
  if(digest(expected)!==digest(actual))failures.push('multiplayer registry: stale, duplicate or missing records; regenerate it');
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
  if (snapshot.source?.provider !== 'seerapi' || !snapshot.source?.revision || !snapshot.source?.url) {
    failures.push('snapshot: missing SeerAPI provider or revision');
  }
  if (!Array.isArray(snapshot.souls) || snapshot.souls.length === 0) {
    failures.push('soulmark: no real soulmark recorded');
  }
  for (const soul of snapshot.souls ?? []) {
    const rule = E.SOULS.registry[soul.id];
    if (!rule) failures.push(`soulmark ${soul.id}: no registered implementation`);
    else {
      if (snapshot.source?.provider === 'seerapi' && rule.sourceHash !== soul.hash) {
        failures.push(`soulmark ${soul.id}: source hash mismatch`);
      }
      for (const description of rule.deferred ?? []) {
        const found = (todo?.records ?? []).some(x => x.speciesId === id && x.kind === 'soul' && x.ruleId === soul.id && x.legacyNotes?.includes(description) && x.source?.url && x.source?.revision && x.raw?.description);
        if (!found) failures.push(`soulmark ${soul.id}: deferred entry missing from unified multiplayer registry`);
        if (complete) failures.push(`soulmark ${soul.id}: deferred behavior remains`);
      }
    }
  }
  if (!Array.isArray(snapshot.moves) || snapshot.moves.length === 0) {
    failures.push('skills: no skills recorded');
  }
  failures.push(...E.WIKI.skillVersionIssues(snapshot,true).map(issue=>`skills: ${issue}`));
  if (snapshot.missingEffects?.length) failures.push('effects: missingEffects is non-empty');
  if (complete && snapshot.deferredEffects?.length) failures.push('effects: deferredEffects is non-empty');
  if (complete && snapshot.deployment?.deferredSouls?.length) failures.push('effects: deployment deferredSouls is non-empty');

  for (const move of snapshot.moves ?? []) {
    const issue = E.WIKI.moveIssue(move, snapshot);
    if (issue) failures.push(`${move.name || move.id}: ${issue}`);
    if (move.limitations?.length) failures.push(`${move.name || move.id}: unresolved limitations remain`);
    const compiled = E.WIKI.compile(move, snapshot);
    if (compiled.issue) failures.push(`${move.name || move.id}: compile failed: ${compiled.issue}`);
    for (const deferred of compiled.deferred ?? []) {
      const found = (todo?.records ?? []).some(x => x.speciesId === id && x.skillId === move.id && (deferred.effectId ? x.ruleId===deferred.effectId : x.kind==='move') && x.source?.url && x.source?.revision && x.raw);
      if (!found) failures.push(`${move.name || move.id}: deferred effect ${deferred.effectId ?? deferred.field ?? 'unknown'} missing from unified multiplayer registry`);
      if (complete) failures.push(`${move.name || move.id}: deferred effects remain`);
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
  const result=cp.spawnSync(process.execPath,['--test',targeted],{cwd:root,encoding:'utf8',timeout:15*60*1000});
  if(result.error||result.status!==0)failures.push(`tests: targeted test failed: ${result.error?.message??result.stderr??result.stdout}`);
}
if(!failures.length) {
  const result=cp.spawnSync(process.execPath,['--test',path.join(root,'tests','local-integration.test.cjs')],{
    cwd:root,env:{...process.env,SEER_INTEGRATION_ID:String(id)},encoding:'utf8',timeout:60*1000,windowsHide:true
  });
  if(result.error||result.status!==0)failures.push(`integration: HTTP search/load/battle test failed: ${result.error?.message??`${result.stdout??''}\n${result.stderr??''}`}`);
}
if (!failures.length) runNpmTest(failures);

if (failures.length) {
  console.error(`completion gate: species ${id} rejected (${complete ? 'complete' : 'single-stage'})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`completion gate: species ${id} passed (${complete ? 'complete' : 'single-stage'})`);
