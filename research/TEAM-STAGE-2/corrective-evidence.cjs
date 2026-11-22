'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const policy = require('../../completion-policy.cjs');

const reviewFile = 'SINGLE-STAGE-REVIEWS.json';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const digest = value => sha(JSON.stringify(value));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function changedKeys(before, after) {
  return Object.keys({...before, ...after}).filter(key => before[key] !== after[key]);
}

// Each reviewed consumer reads specific species rows, or enumerates keys.
// Include all four branches' referenced test bodies, as checkReview can open them.
function reviewReadUnchanged(projection, oldRows, newRows, previous, current) {
  if (!projection || !projection.readers.length || !projection.ids.length) return false;
  if (!projection.readers.every(({file,sha256}) => previous[file] === sha256 && current[file] === sha256)) return false;
  const ids = new Set(projection.ids.map(String));
  const keys = Object.keys({...oldRows,...newRows}).filter(key => ids.has(key.split(':')[0]));
  return keys.every(key => {
    const old = oldRows[key], next = newRows[key];
    if (!old || !next || digest(old) !== digest(next)) return false;
    return Object.values(old.tests ?? {}).flat().every(ref =>
      typeof ref.file === 'string' && previous[ref.file] && previous[ref.file] === current[ref.file]);
  });
}

function verifyCorrection({descriptor, reference, current, ids, plan, sourceProfile, affectedNative, observed, checkFileOutput}) {
  const bound = ref => read(reference(ref));
  const base = bound(descriptor.previousInputs);
  const prior = bound(descriptor.prerequisites);
  const verified = bound(descriptor.verified).verified;
  assert.equal(digest(base.files), base.fingerprint);
  assert.equal(prior.fingerprint, base.fingerprint);
  assert.equal(verified.fingerprint, base.fingerprint);
  assert.deepEqual(prior.targets, ids);
  assert.deepEqual(verified.individual.map(r => r.id), ids);
  const changes = changedKeys(base.files, current);
  const repairs = new Set(descriptor.reviewedChanges);
  assert.deepEqual([...changes].sort(), [...repairs].sort(), 'unreviewed corrective inputs');
  const proof = bound(descriptor.singleReviews);
  const oldRows = bound(descriptor.originalReviews);
  const newRows = read(reviewFile);
  assert.equal(base.files[reviewFile], descriptor.originalReviews.sha256);
  assert.equal(proof.before, base.files[reviewFile]);
  assert.equal(proof.after, current[reviewFile]);
  assert.deepEqual(Object.keys(oldRows.entries), Object.keys(newRows.entries));
  const specifics = new Map(proof.rows.map(r => [r.key,r]));
  const changedReviews = Object.keys(oldRows.entries).filter(k => digest(oldRows.entries[k]) !== digest(newRows.entries[k]));
  assert.deepEqual(changedReviews.sort(), [...specifics.keys()].sort());
  assert.equal(proof.keys, specifics.size);
  const receipts = bound(descriptor.caseEvidence);
  const failed = bound(descriptor.failures).rows;
  const seen = new Set(), verifiedLogs = new Map();
  assert.deepEqual(receipts.map(r => r.index), failed.map(r => r.index));
  for (const r of receipts) {
    const old = failed[r.index-1];
    assert.equal(r.file, old.file);
    assert.equal(r.originalName, old.name);
    assert.equal(r.src, current[r.file]);
    const receipt = bound(r.receipt);
    assert.equal(receipt.exitCode, 0);
    assert.equal(receipt.signal, null);
    assert.ok(receipt.args.includes(r.file), r.file);
    if (receipt.file) {
      assert.equal(receipt.file, r.file);
      assert.equal(receipt.before, r.src);
      assert.equal(receipt.after, r.src);
      assert.equal(receipt.ok, true);
    }
    if (!verifiedLogs.has(receipt.log)) {
      verifiedLogs.set(receipt.log, fs.readFileSync(reference({file:receipt.log,sha256:receipt.logSha256}),'utf8'));
    }
    checkFileOutput(verifiedLogs.get(receipt.log),r.file,[r.name]);
    seen.add(r.file+'\n'+r.name);
  }
  const inventory = new Map();
  for (const key of changedReviews) {
    const id = Number(key.split(':')[0]);
    assert.ok(!ids.includes(id), 'formal source rows need new validation '+key);
    const {tests:oldTests,...oldDecision} = oldRows.entries[key];
    const {tests:newTests,...nextDecision} = newRows.entries[key];
    assert.deepEqual(oldDecision, nextDecision, key);
    const row = specifics.get(key);
    assert.equal(row.before, digest(oldRows.entries[key]));
    assert.equal(row.after, digest(newRows.entries[key]));
    if (!inventory.has(id)) inventory.set(id,policy.inventory(read('data/species/'+id+'.json').snapshot));
    const entry = inventory.get(id).find(r => r.key === key);
    assert.equal(entry.sourceDigest, row.sourceDigest);
    assert.deepEqual(policy.checkReview(entry, newRows.entries[key], process.cwd()), [], key);
    for (const branch of Object.keys(oldTests)) {
      assert.equal(oldTests[branch].length, newTests[branch].length);
      for (let i=0;i<oldTests[branch].length;i++) {
        const original=oldTests[branch][i], updated=newTests[branch][i];
        if (digest(original)===digest(updated)) continue;
        assert.equal(original.file,updated.file);
        assert.ok(seen.has(updated.file+'\n'+updated.name), key);
        assert.ok(receipts.some(r=>r.file===updated.file && r.originalName===original.name && r.name===updated.name), key);
      }
    }
  }
  for (const binding of descriptor.auditRebindings) {
    const historic = bound(binding.original), now = read(binding.file);
    assert.equal(base.files[binding.file], binding.original.sha256);
    const leaf = now.closure.inputs.find(r=>r.file===binding.leaf);
    assert.equal(leaf.sha256,current[binding.leaf]);
    leaf.sha256 = base.files[binding.leaf];
    assert.deepEqual(now,historic,binding.file);
  }
  const httpChanges = changes.filter(file => descriptor.httpDependencies.includes(file)
    || file.startsWith('dist/') || file.startsWith('data/') || /^[^/]+\.(?:js|cjs)$/.test(file));
  assert.deepEqual(httpChanges, [], 'HTTP dependencies changed');
  const projections = bound(descriptor.readProjections);
  const impacted = new Set();
  for (const item of affectedNative(plan, changes, sourceProfile, observed)) {
    const files = item.files.filter(file => file !== reviewFile || !reviewReadUnchanged(
      projections[item.file], oldRows.entries, newRows.entries, base.files, current));
    if (item.environment.length || files.length) impacted.add(item.file);
  }
  return {prior, impacted, baseFingerprint:base.fingerprint, reviewCount:specifics.size, caseCount:seen.size};
}
module.exports = {verifyCorrection, reviewReadUnchanged};
