'use strict';

const {createHash} = require('node:crypto');

function binding(row) {
  const {key, sourceDigest, scope, description, trigger, futureMechanisms, legacyNotes} = row;
  const fields = {key, sourceDigest, scope, description, trigger, futureMechanisms, legacyNotes};
  return createHash('sha256').update(JSON.stringify(fields)).digest('hex');
}

function reviewIssues(row, review, checkStateEvidence) {
  if (!review || review.key !== row.key || review.sourceDigest !== row.sourceDigest ||
      review.binding !== binding(row)) return [row.key + '：全部机制逐项审核缺失或已变化'];
  if (row.reviewStatus !== 'reviewed' || row.stageTwo?.status !== '队伍专项通过，待正式验收') {
    return [row.key + '：该分支仍有审核、实现或测试待办'];
  }
  const issues = checkStateEvidence(row.key, review);
  if (!review.behavior?.trim() || !review.reviewedBy?.trim() || !review.reviewedAt) {
    issues.push(row.key + '：需注明已验证的队伍行为、审核人和日期');
  }
  return issues;
}

module.exports = {binding, reviewIssues};
