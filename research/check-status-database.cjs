'use strict';
// Delivery integrity report; separate from and never used by automation-validate.cjs.
const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const db=require('../data/statuses/statuses.json'),audit=require('./status-system-audit.json'),baseline=require('./random-effect-pools-baseline.json');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const changed=Object.entries(baseline.files).filter(([p,h])=>sha(fs.readFileSync(p))!==h).map(([p])=>p);assert.deepEqual(changed,[]);
for(const s of audit.codeManifest)assert.equal(sha(fs.readFileSync(s.file)),s.sha256);
assert.equal(db.runtimeEnabled,false);assert.equal(audit.records.length,db.records.length);
const npmLog=fs.readFileSync('research/status-database-npm-test.log','utf8');assert.match(npmLog,/tests 995/);assert.match(npmLog,/pass 995/);assert.match(npmLog,/fail 0/);
const result={checkedAt:new Date().toISOString(),status:'data-layer-delivered',sourceWikiRevision:db.sources['wiki-mechanics'].revision,sourceWikiHash:db.sources['wiki-mechanics'].hash,enumHash:db.sources['seerapi-status-enum'].hash,namedStatuses:db.summary.namedStatuses,wikiDescriptions:db.summary.wikiTableStatuses,enumOnly:db.summary.enumOnly,reservedSlots:db.summary.reservedSlots,observedRuntimeBehaviorCount:audit.summary.withObservedBehavior,missingRuntimeBehavior:audit.summary.withoutSpecificBehavior,protectedFilesChecked:Object.keys(baseline.files).length,protectedFilesChanged:changed,targetedTests:{passed:4,total:4},npmTest:{passed:995,total:995,log:'research/status-database-npm-test.log'},runtimeIntegration:false,effect2074Implemented:false,species3667Resumed:false,species3670Started:false,completionValidatorRun:false,files:['data/statuses/statuses.json','data/statuses/sources.json','status-database.cjs','tests/status-database.test.cjs','research/status-system-audit.json'].map(file=>({file,sha256:sha(fs.readFileSync(file))})),note:'测试仅认证资料完整性、来源、只读查询和既有回归；不认证异常行为完整实现，也不改变精灵完成进度。'};
fs.writeFileSync('research/status-database-check.json',JSON.stringify(result,null,2)+'\n');console.log({status:result.status,protectedFiles:result.protectedFilesChecked,changes:changed,npm:result.npmTest});
