'use strict';
// One-shot research evidence runner. Does not change automation or completion rules.
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const inventory=require('./drain-maxhp-affected.json');
const ids=inventory.rows.filter(x=>x.formal&&x.reviewed).map(x=>x.species);
const summary={startedAt:new Date().toISOString(),rule:'research/2026-10-15-drain-rule-correction.json',ids,results:[]};
const save=()=>fs.writeFileSync(path.join(__dirname,'drain-revalidation-results.json'),JSON.stringify(summary,null,2)+'\n');
save();
for(const id of ids){
 const start=Date.now();console.log('START '+id+' '+new Date().toISOString());
 const r=cp.spawnSync(process.execPath,['automation-validate.cjs',String(id)],{cwd:root,encoding:'utf8',timeout:1200000,maxBuffer:64e6});
 const output=(r.stdout||'')+(r.stderr||'')+(r.error?'\n'+r.error.stack:'');
 const log='research/drain-gate-'+id+'.log';fs.writeFileSync(path.join(root,log),output);
 const passed=r.status===0&&/passed\s*\(single-stage\)/.test(output);
 summary.results.push({id,exitCode:r.status,passed,elapsedMs:Date.now()-start,log,finishedAt:new Date().toISOString()});save();
 console.log('FINISH '+id+' exit='+r.status+' passed='+passed+' ms='+(Date.now()-start));
 if(!passed){summary.status='blocked';save();process.exit(1);}
}
summary.status='passed';summary.finishedAt=new Date().toISOString();save();
