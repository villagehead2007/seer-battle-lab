'use strict';
const fs=require('fs'),cp=require('child_process'),assert=require('assert/strict');
const text=fs.readFileSync('tests/json-copy-equivalence.test.cjs','utf8');
const code=text.split('const code=String.raw`')[1].split('\n `;')[0].replace("hash:crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex')","state:s");
const run=mode=>{const r=cp.spawnSync(process.execPath,['-e',code,mode],{encoding:'utf8',timeout:120000,maxBuffer:64*1024*1024,windowsHide:true});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
const before=run('baseline'),after=run('optimized'),diff=[];
function walk(a,b,p){if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p+'.'+k);}else diff.push({path:p,before:a,after:b});}
for(let i=0;i<before.length;i++)walk(before[i],after[i],before[i].name);
fs.writeFileSync('research/next50-batch5-copy-diagnosis.json',JSON.stringify({cases:before.length,differences:diff},null,2)+'\n');
console.log(JSON.stringify({cases:before.length,differenceCount:diff.length,fields:[...new Set(diff.map(x=>x.path.split('.state.')[1]?.replace(/^fighters\.\d+\./,'')))].slice(0,60)}));
