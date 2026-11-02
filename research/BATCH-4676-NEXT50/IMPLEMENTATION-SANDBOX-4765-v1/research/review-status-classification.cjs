'use strict';
const fs=require('fs'),crypto=require('crypto'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline=json('research/status-classification-baseline.json'),db=json('data/statuses/statuses.json');
const allowed=['data/statuses/statuses.json','research/build-status-database.cjs','PROGRESS.md'];
const changed=Object.entries(baseline.files).filter(([p,h])=>hash(p)!==h).map(([p])=>p);
assert.deepEqual(changed.filter(p=>!allowed.includes(p)),[]);
const normalized=structuredClone(db);delete normalized.classificationSchemaVersion;delete normalized.classificationSemantics;
for(const row of normalized.records){delete row.classification;delete row.classificationEvidence;delete row.classificationPending;if(row.name==='星赎')row.explicitRestricted=baseline.database.records.find(r=>r.name==='星赎').explicitRestricted;}
assert.deepEqual(normalized,baseline.database,'原资料除已列明星赎分类修复外不可改变');
function run(log){const text=read(log),number=k=>Number(text.match(new RegExp('ℹ '+k+' (\\d+)'))?.[1]);const result={total:number('tests'),passed:number('pass'),failed:number('fail'),skipped:number('skipped'),log};assert.ok(result.total>0);assert.equal(result.passed,result.total);assert.equal(result.failed,0);assert.equal(result.skipped,0);return result;}
const report={status:'metadata-complete-source-gaps-retained',source:db.sources['wiki-mechanics'],
 fields:db.classificationSemantics,
 counts:Object.fromEntries(Object.keys(db.records[0].classification).map(field=>[field,{true:db.records.filter(r=>r.classification[field]===true).length,false:db.records.filter(r=>r.classification[field]===false).length,unknown:db.records.filter(r=>r.classification[field]===null).length}])),
 records:db.records.map(r=>({id:r.id,name:r.name,classification:r.classification,evidence:r.classificationEvidence,pending:r.classificationPending})),
 correction:{name:'星赎',old:'通过子串“限制类异常状态”匹配，把描述里引用“所有非限制类异常状态”的星赎错误标记为自身限制类。',new:'限制类只从本状态定义开头的明确分类读取；星赎explicitRestricted和isRestrictedClass均为null，不据此认定false。',evidence:db.records.find(r=>r.name==='星赎').description},
 candidateQuery:require('../status-pool-candidates.cjs').inspectNonRestricted(),design:'research/status-pool-2074-design.json',
 validation:{targeted:run('research/status-classification-targeted.log'),regression:run('research/status-classification-npm-test.log'),meaning:'仅认证元数据提取/证据和只读分类查询；不认证2074战斗效果、随机概率执行或3667完成。'},
 scopeCheck:{existingFilesChecked:Object.keys(baseline.files).length,changedExistingFiles:changed,originalSourceFieldsPreservedExceptDocumentedCorrection:true,engineUnchanged:true,allExistingTestsUnchanged:true,speciesUnchanged:true,validatorAndAutomationUnchanged:true,batchResumed:false},
 artifacts:['data/statuses/statuses.json','research/status-classification.cjs','research/build-status-database.cjs','status-pool-candidates.cjs','research/status-pool-2074-design.json','tests/status-classification.test.cjs'].map(file=>({file,sha256:hash(file)}))};
fs.writeFileSync('research/status-classification-review.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({counts:report.counts,validation:report.validation,scopeCheck:report.scopeCheck},null,2));
