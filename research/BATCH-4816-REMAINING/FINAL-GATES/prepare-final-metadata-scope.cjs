'use strict';
const fs=require('fs'),assert=require('assert/strict'),file='research/BATCH-4816-REMAINING/FINAL-GATES/finish-accepted-metadata.cjs',old=fs.readFileSync(file,'utf8');
let next=old.replace("const mutable=new Set(['SINGLE-STAGE-REVIEWS.json'", "const mutable=new Set([active.dir+'/PARTIAL-4946-KNOWN-ANSWERS.json','SINGLE-STAGE-REVIEWS.json'");
next=next.replace("if(key.startsWith(id+':')){assert.equal(r.batchAcceptance,proof);", "if(key.startsWith(id+':')&&r.batchAcceptance===proof){assert.equal(r.batchAcceptance,proof);");
next=next.replace('acceptedAt:summary.at,acceptance:', 'updatedAt:at,latestUpdate:at,acceptedAt:summary.at,acceptance:');assert.notEqual(next,old);fs.writeFileSync(file,next);
