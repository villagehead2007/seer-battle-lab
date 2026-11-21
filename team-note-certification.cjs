'use strict';

const {digest} = require('./completion-policy.cjs');
const {binding} = require('./research/TEAM-STAGE-2/complete-evidence.cjs');
const specialistStatus = '队伍专项通过，待正式验收';

function acceptedSpecies(receipt, fingerprint) {
  const run = receipt?.fullRegression;
  const counts = run?.counts;
  if (receipt?.stage !== 'complete' || receipt.status !== 'passed' || receipt.fingerprint !== fingerprint ||
      run?.exitCode !== 0 || run.signal || run.error || !counts || counts.tests <= 0 || counts.tests !== counts.pass ||
      ['fail','skipped','cancelled','todo'].some(key => counts[key] !== 0)) return new Set();
  const targets = new Set(receipt.targets);
  return new Set(receipt.individual.filter(row => targets.has(row.id) && row.exitCode === 0 &&
    !row.signal && !row.error && row.sourceRows > 0 && row.nativeFiles > 0 && row.httpPassed === 1).map(row => row.id));
}

function matchesReview(row, review) {
  return row.reviewStatus === 'reviewed' && row.stageTwo?.status === specialistStatus &&
    review?.key === row.key && review.sourceDigest === row.sourceDigest && review.binding === binding(row);
}

function rowDigest(row, review) {
  return digest({review, stage:row.stageTwo});
}

function state(row, review, sourceCurrent, accepted, frozenDigest) {
  const stage = row.stageTwo;
  if (!sourceCurrent || (stage?.sourceDigest && stage.sourceDigest !== row.sourceDigest)) return 'stale';
  if (matchesReview(row, review)) return accepted && frozenDigest === rowDigest(row, review) ? 'certified' : 'passed';
  if (stage?.status?.startsWith('部分')) return 'partial';
  if (stage?.status?.startsWith('未实现')) return 'unimplemented';
  if (stage?.status === specialistStatus) return 'recorded';
  return 'pending';
}

module.exports = {acceptedSpecies, matchesReview, rowDigest, state};
