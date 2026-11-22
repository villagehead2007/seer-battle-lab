'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {compileFunction} = require('node:vm');
const assert = require('node:assert/strict');
const policy = require('../../completion-policy.cjs');
const store = require('../../local-species.cjs');
const E = require('../../dist/engine.js');

const base = 'research/TEAM-STAGE-2/';
const validator = 'automation-validate.cjs';
const assemblyFiles = new Set([
  base + 'shared-complete.cjs',
  base + 'impact-independent-evidence.cjs',
  base + 'impact-independent-policy.json',
  base + 'effect-ownership-audit.json'
]);
const normalize = file => file.replaceAll('\\', '/');
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const diffs = (before, after) => [...new Set([...Object.keys(before), ...Object.keys(after)])]
  .filter(key => before[key] !== after[key]);

function checkedPath(root, name) {
  assert.equal(typeof name, 'string');
  const full = path.resolve(root, name), relative = path.relative(root, full);
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative), name);
  return full;
}

function checkedReference(root, ref) {
  const file = checkedPath(root, ref.file);
  assert.equal(hash(file), ref.sha256, ref.file);
  return file;
}

function soulValidation(file) {
  const source = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
  const start = source.indexOf('  for (const soul of snapshot.souls ?? []) {');
  const end = source.indexOf('  if (!Array.isArray(snapshot.moves)', start);
  assert.ok(start >= 0 && end > start, file);
  return {
    prefix: source.slice(0, start),
    suffix: source.slice(end),
    decide: compileFunction(source.slice(start, end),
      ['snapshot', 'E', 'failures', 'todo', 'id', 'complete', 'hasTeamProof', 'teamScope', 'actual', 'teamProofs'])
  };
}

function requiredFiles(root, testNames, snapshot, primary, team) {
  const id = snapshot.id;
  const files = new Map(testNames.filter(name => name === 'deployed-' + id + '.test.cjs' ||
    name.startsWith('deployed-' + id + '-') || name === 'next50-' + id + '.test.cjs' ||
    name.startsWith('next50-' + id + '-')).map(name => ['tests/' + name, new Set()]));
  for (const {key} of policy.inventory(snapshot)) {
    for (const review of [primary[key], team[key]]) {
      for (const group of ['success', 'failure', 'boundary', 'interaction']) {
        for (const item of review?.tests?.[group] ?? []) {
          const file = normalize(item.file);
          checkedPath(root, file);
          if (!files.has(file)) files.set(file, new Set());
          files.get(file).add(item.name);
        }
      }
    }
  }
  return files;
}

function checkAssemblyScope(root, approval, oldFiles, newFiles, current) {
  const oldAssembly = read(checkedReference(root, approval.previousOwnerAudit));
  const currentAssembly = read(path.join(root, base, 'effect-ownership-audit.json'));
  assert.equal(approval.previousOwnerAudit.sha256, newFiles[base + 'effect-ownership-audit.json']);
  const previousDriver = checkedReference(root, approval.previousDriver);
  assert.equal(approval.previousDriver.sha256, newFiles[base + 'shared-complete.cjs']);
  assert.equal(oldFiles[base + 'shared-complete.cjs'], approval.previousDriver.sha256);
  assert.equal(oldFiles[base + 'effect-ownership-audit.json'], approval.previousOwnerAudit.sha256);
  assert.equal(current[base + 'shared-complete.cjs'], approval.currentDriverSha256);
  assert.equal(current[base + 'impact-independent-evidence.cjs'], approval.verifierSha256);
  const original = fs.readFileSync(previousDriver, 'utf8').replaceAll('\r\n', '\n');
  let updated = fs.readFileSync(path.join(root, base, 'shared-complete.cjs'), 'utf8').replaceAll('\r\n', '\n');
  for (const label of ['inputs', 'entry', 'final check']) {
    const block = new RegExp('^[ \\t]*// Impact evidence ' + label + '\\n[\\s\\S]*?^[ \\t]*// End impact evidence ' + label + '\\n', 'gm');
    assert.equal([...updated.matchAll(block)].length, 1);
    updated = updated.replace(block, '');
  }
  assert.equal(updated, original, '关闭与复用入口以外的共享验收逻辑已变化');

  // Keep the original audit bindings. The only new binding is the current acceptance driver.
  const restored = structuredClone(currentAssembly);
  const driver = restored.closure.inputs.find(row => row.file === base + 'shared-complete.cjs');
  assert.equal(driver.sha256, current[driver.file]);
  driver.sha256 = approval.previousDriver.sha256;
  assert.deepEqual(restored, oldAssembly);
}

function verify({root, folder, result, input, current, nativeFiles, ids, environment, checkFileOutput,
  passedTests, nativeDependencySnapshot}) {
  assert.equal(result.stage, 'impact-reviewed-independent-prerequisites');
  assert.equal(result.status, 'passed');
  assert.equal(result.node, process.version);
  assert.equal(result.environment, environment);
  assert.equal(result.fullNpmRun, false);
  assert.equal(result.frozen, false);
  assert.equal(input.stage, 'pre-freeze-prerequisites');
  assert.equal(input.node, process.version);
  assert.equal(input.environment, environment);
  assert.equal(input.fingerprint, digest(input.files));
  assert.equal(result.fingerprint, input.fingerprint);
  assert.equal(digest(current), input.fingerprint, '影响核证输入已变化');
  assert.deepEqual(result.targets, ids);

  const approvalFile = path.join(root, base, 'impact-independent-policy.json');
  assert.equal(result.policySha256, hash(approvalFile));
  const approval = read(approvalFile);
  assert.equal(approval.schemaVersion, 1);
  assert.equal(approval.validatorDecision, 'soul-deferred-coverage');
  const older = read(checkedReference(root, approval.previousInputs));
  const newer = read(checkedReference(root, approval.currentValidatorInputs));
  assert.equal(older.fingerprint, digest(older.files));
  assert.equal(newer.fingerprint, digest(newer.files));
  assert.equal(older.environment, environment);
  assert.deepEqual(diffs(older.files, newer.files), [validator], '原两候选包含其他差异');
  assert.equal(newer.files[validator], current[validator]);
  checkAssemblyScope(root, approval, older.files, newer.files, current);

  // A change outside the old/test-specific dependency proof needs fresh evidence.
  const unresolved = diffs(newer.files, current).filter(file => !assemblyFiles.has(file) &&
    (!/^tests\/.*[.]test[.]c?js$/.test(file) || file === 'tests/local-integration.test.cjs'));
  assert.deepEqual(unresolved, [], '存在需补验的业务、数据或接入输入');
  const archivedValidator = checkedReference(root, approval.previousValidator);
  assert.equal(approval.previousValidator.sha256, older.files[validator]);
  const oldGate = soulValidation(archivedValidator), liveGate = soulValidation(path.join(root, validator));
  assert.equal(oldGate.prefix, liveGate.prefix);
  assert.equal(oldGate.suffix, liveGate.suffix);

  const audited = read(checkedReference(root, approval.evidenceAudit));
  assert.equal(audited.oldCandidate, older.fingerprint);
  assert.equal(audited.currentCandidate, newer.fingerprint);
  assert.equal(audited.exactSameEnvironment, true);
  assert.deepEqual(audited.missing, []);
  const auditedById = new Map(audited.rows.map(row => [row.id, row]));
  assert.equal(auditedById.size, ids.length);
  const native = new Map(audited.nativeProofs.map(record => [normalize(record.recordFile), record]));
  const snapshots = new Map();
  const checkedNative = new Set();
  const primary = read(path.join(root, 'SINGLE-STAGE-REVIEWS.json')).entries;
  const team = read(path.join(root, base, 'complete-reviews.json')).entries;
  const todo = read(path.join(root, 'MULTI-PET-TODO.json'));
  const testNames = fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.test.cjs'));
  const individual = [];
  const differences = [], carried = [];
  for (const id of ids) {
    const audit = auditedById.get(id), snapshot = store.species(id);
    assert.ok(audit?.prefixVerdict === 'passed', '缺逐宠原始证据 ' + id);
    const records = todo.records.filter(row => row.speciesId === id);
    const hasTeamProof = row => row?.speciesId === id && !!team[row.key];
    const oldIssues = [], liveIssues = [];
    oldGate.decide(snapshot, E, oldIssues, todo, id, true, hasTeamProof, true, records, team);
    liveGate.decide(snapshot, E, liveIssues, todo, id, true, hasTeamProof, true, records, team);
    assert.deepEqual(liveIssues, [], '新版判定拒绝 ' + id);
    const reexecuted = audit.currentWholeReceipt === true;
    if (digest(oldIssues) !== digest(liveIssues)) {
      differences.push(id);
      assert.equal(reexecuted, true, '变更判定缺少新版实跑 ' + id);
    } else {
      assert.deepEqual(oldIssues, [], '旧判定拒绝 ' + id);
      carried.push(id);
    }
    const sourceInputs = reexecuted ? newer : older;
    const log = checkedPath(root, audit.log);
    assert.ok(normalize(path.relative(root, log)).startsWith(base), audit.log);
    assert.equal(hash(log), audit.logSha256);
    const receipt = read(log + '.json');
    assert.equal(receipt.command, process.execPath);
    assert.deepEqual(receipt.args, [validator, String(id), '--complete', '--team-independent']);
    assert.equal(receipt.exitCode, 0);
    assert.equal(receipt.signal, null);
    assert.equal(receipt.error, null);
    assert.equal(receipt.logSha256, audit.logSha256);
    assert.equal(path.resolve(root, receipt.log), log);
    const raw = fs.readFileSync(log, 'utf8');
    assert.ok(raw.split(/\r?\n/).includes('team independent gate: species ' + id + ' passed (pending shared complete regression)'));
    const coverage = raw.match(/^semantic review coverage: species (\d+), total=(\d+), missing=(\d+), stale=(\d+)/m);
    assert.deepEqual(coverage?.slice(1).map(Number), [id, policy.inventory(snapshot).length, 0, 0]);

    const files = requiredFiles(root, testNames, snapshot, primary, team);
    const references = new Map(audit.realNative.map(item => [item.file, normalize(item.record)]));
    const seen = new Set();
    const blocks = [...raw.matchAll(/^\{"species":.*$/gm)];
    let http = 0;
    for (const [index, block] of blocks.entries()) {
      const marker = JSON.parse(block[0]);
      const output = raw.slice(block.index + block[0].length, blocks[index + 1]?.index ?? raw.length);
      assert.equal(marker.species, id);
      assert.equal(marker.signal, null);
      if (!marker.file) {
        assert.equal(marker.httpExitCode, 0);
        http += passedTests(output).pass;
        continue;
      }
      const file = normalize(marker.file), ref = references.get(file), entry = native.get(ref);
      assert.ok(files.has(file) && !seen.has(file) && entry?.file === file, '专项凭证缺失 ' + id + ' ' + file);
      assert.equal(marker.exitCode, 0);
      if (marker.reusedFrom) assert.equal(normalize(marker.reusedFrom), ref);
      checkFileOutput(output, file, [...files.get(file)]);
      if (!checkedNative.has(ref)) {
        const evidence = read(checkedPath(root, ref)), filePath = checkedPath(root, file);
        assert.equal(evidence.file, file);
        assert.equal(evidence.command, process.execPath);
        assert.deepEqual(evidence.args, ['--test', '--test-reporter=spec', filePath]);
        assert.equal(evidence.exitCode, 0);
        assert.equal(evidence.signal, null);
        assert.equal(evidence.error, null);
        assert.equal(evidence.fileSha256, hash(filePath));
        assert.equal(evidence.fileSha256, current[file]);
        assert.equal(hash(checkedPath(root, evidence.log)), evidence.logSha256);
        const archived = checkedPath(root, evidence.inputSnapshot);
        if (!snapshots.has(archived)) snapshots.set(archived, {fileHash: hash(archived), data: read(archived)});
        const saved = snapshots.get(archived);
        assert.equal(saved.fileHash, evidence.inputSnapshotSha256);
        assert.equal(digest(saved.data), evidence.inputFingerprint);
        assert.equal(saved.data.environment, environment);
        const used = nativeDependencySnapshot(saved.data, file, evidence.fileSha256, true);
        assert.equal(digest(used), evidence.dependencyFingerprint);
        const live = nativeDependencySnapshot({...saved.data, files:nativeFiles}, file, evidence.fileSha256, true);
        const bound = diffs(used.files, live.files).filter(key => !assemblyFiles.has(key) && key !== validator);
        assert.deepEqual(bound, [], '专项依赖变化 ' + file);
        assert.equal(used.files[validator], sourceInputs.files[validator]);
        assert.doesNotMatch(fs.readFileSync(filePath, 'utf8'),
          /automation-validate[.]cjs|shared-complete[.]cjs|impact-independent-evidence[.]cjs|effect-ownership-audit[.]json/,
          '验收器依赖需实跑 ' + file);
        checkedNative.add(ref);
      }
      seen.add(file);
    }
    assert.deepEqual([...seen].sort(), [...files.keys()].sort());
    assert.equal(http, 1);
    individual.push({id, command:receipt.command, args:receipt.args, startedAt:receipt.startedAt, finishedAt:receipt.finishedAt,
      exitCode:receipt.exitCode, signal:receipt.signal, error:receipt.error, log:receipt.log, logSha256:receipt.logSha256,
      evidenceInputFingerprint:sourceInputs.fingerprint, evidenceDisposition:reexecuted ? 'current-validator-run' : 'impact-reviewed-original-run',
      sourceRows:Number(coverage[2]), nativeFiles:seen.size, httpPassed:http});
  }
  assert.deepEqual(differences, approval.reexecutedTargets);
  assert.equal(individual.length, ids.length);
  return {folder:path.relative(root, folder), fingerprint:input.fingerprint, individual,
    impact:{carried:carried.length, reexecuted:differences, nativeRecords:checkedNative.size}};
}

module.exports = {verify};
