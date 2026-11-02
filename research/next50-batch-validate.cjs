'use strict';
// The human-authorized fixed50 batch gate. A preflight is never an acceptance.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');process.chdir(root);
const base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n',{flag:'wx'});
const batch=Number(process.argv[2]);assert.ok(Number.isInteger(batch)&&batch>=1&&batch<=5,'explicit batch number1–5 required');
const approval=base+'USER-BATCH-VALIDATION-AUTHORIZATION-2026-10-27.json',ids=read(approval).ids;
assert.equal(ids.length,50);assert.deepEqual(fs.readFileSync('seer_id.txt','utf8').split(/\r?\n/).slice(226,276).map(x=>Number(x.trim())),ids,'authorized queue changed');
const members=ids.slice((batch-1)*10,batch*10),status=read('research/BATCH-4509-NEXT50-STATUS.json'),accepted=status.singleStageCompleteIds??[],pending=status.pendingBatchPreflights??[];
for(const id of ids.slice(0,(batch-1)*10))assert.ok(accepted.includes(id),'previous batch not accepted');
assert.ok(members.some(id=>!accepted.includes(id)),'batch already accepted');
for(const id of members)assert.ok(accepted.includes(id)||pending.some(x=>x.speciesId===id),'species has not completed serial preflight: '+id);
const startedAt=new Date().toISOString(),stem='research/next50-batch'+batch+'-formal-'+startedAt.replace(/[:.]/g,'-'),lock='research/.next50-batch-validation.lock';
fs.writeFileSync(lock,JSON.stringify({pid:process.pid,batch,startedAt,stem}),{flag:'wx'});
const proof={schema:1,batch,ids:members,authorization:approval,startedAt,status:'running',accepted:false,preflights:[],npm:null,frozenFilesChanged:[]};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(d+'/'+x.name):[d+'/'+x.name]);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const capture=()=>{
 const files=[...walk('tests').filter(x=>/\.(?:cjs|js|json)$/.test(x)),...walk('dist').filter(x=>/\.(?:js|css)$/.test(x)),...walk('data/species').filter(x=>x.endsWith('.json')),...walk('data/species-pending').filter(x=>x.endsWith('.json')),
  ...fs.readdirSync('.').filter(x=>x.endsWith('.cjs')),...fs.readdirSync('research').filter(x=>x.endsWith('-reviewed-snapshot.json')).map(x=>'research/'+x),
  'SINGLE-STAGE-REVIEWS.json','MULTI-PET-TODO.json','MULTI-PET-TODO.md','seer_id.txt','package.json','AGENTS.md','DEVELOPMENT-STAGES.md',approval,
  'research/next50-batch-validate.cjs','research/next50-performance-run.cjs','research/next50-record-preflight.cjs',
  'research/next50-performance-before-20min-2026-10-27/dist__souls.js',
  ...read(base+'TAKEOVER.json').documents.map(x=>x.original),...walk(base.replace(/\/$/,'' )).filter(x=>/-user-confirmations\.json$|-latest-user-confirmation\.json$/.test(x)),...fs.readdirSync('research').filter(x=>x.endsWith('.cjs')).map(x=>'research/'+x)];
 return Object.fromEntries([...new Set(files)].sort().map(p=>[p,hash(p)]));
};
let frozen;
const unchanged=()=>{const now=capture(),keys=new Set([...Object.keys(frozen),...Object.keys(now)]);return [...keys].filter(p=>frozen[p]!==now[p]);};
try{
 frozen=capture();proof.freeze=stem+'-freeze.json';write(proof.freeze,{at:new Date().toISOString(),files:frozen});
 console.log(JSON.stringify({batch,ids:members,startedAt,frozenFiles:Object.keys(frozen).length,stem}));
 for(const id of members){
  console.log('preflight: '+id);
  const started=new Date().toISOString(),r=cp.spawnSync(process.execPath,['automation-validate.cjs',String(id),'--preflight'],{cwd:root,encoding:'utf8',timeout:15*60*1000,maxBuffer:8*1024*1024,windowsHide:true});
  const log=stem+'-'+id+'-preflight.log',text=(r.stdout??'')+'\n'+(r.stderr??'');fs.writeFileSync(log,text,{flag:'wx'});
  const outcome={id,startedAt:started,completedAt:new Date().toISOString(),exitCode:r.status,error:r.error?.message??null,log,passed:r.status===0&&!r.error&&text.includes(`preflight gate: species ${id} passed (pending-batch-full-regression; NOT stage complete)`)};
  proof.preflights.push(outcome);assert.equal(outcome.passed,true,'species preflight failed; inspect '+log);
 }
 proof.frozenFilesChanged=unchanged();assert.deepEqual(proof.frozenFilesChanged,[],'files changed during batch preflights');
 console.log('all10 preflights passed; starting one fresh complete npm test');
 const npmStarted=new Date().toISOString(),options={cwd:root,encoding:'utf8',timeout:3*60*60*1000,maxBuffer:8*1024*1024,windowsHide:true};
 const r=process.platform==='win32'?cp.spawnSync('cmd.exe',['/d','/s','/c','npm test'],options):cp.spawnSync('npm',['test'],options);
 const text=(r.stdout??'')+'\n'+(r.stderr??''),log=stem+'-npm.log';fs.writeFileSync(log,text,{flag:'wx'});
 const summary=k=>{const found=[...text.matchAll(new RegExp('^(?:ℹ|#) '+k+' ([\\d.]+)','gm'))];return found.length?Number(found.at(-1)[1]):null;};
 proof.npm={startedAt:npmStarted,completedAt:new Date().toISOString(),exitCode:r.status,error:r.error?.message??null,signal:r.signal,log,tests:summary('tests'),pass:summary('pass'),fail:summary('fail'),skipped:summary('skipped'),cancelled:summary('cancelled'),todo:summary('todo'),duration_ms:summary('duration_ms'),actualExecutions:1,executedInsideAuthorizedBatchValidator:true};
 write(stem+'-npm-result.json',proof.npm);assert.equal(r.error,undefined,'complete npm runtime error');assert.equal(r.status,0,'complete npm failed; inspect '+log);
 assert.ok(proof.npm.tests>0);assert.equal(proof.npm.pass,proof.npm.tests);assert.equal(proof.npm.fail,0);assert.equal(proof.npm.skipped,0);assert.equal(proof.npm.cancelled,0);assert.equal(proof.npm.todo,0);
 proof.frozenFilesChanged=unchanged();assert.deepEqual(proof.frozenFilesChanged,[],'frozen state changed during full regression');
 proof.status='passed-single-stage';proof.accepted=true;
 console.log(`completion gate: batch ${batch} passed (single-stage); ${members.join(',')}`);
}catch(error){proof.status='rejected';proof.error=error.stack??String(error);process.exitCode=1;console.error(proof.error);}
finally{
 proof.completedAt=new Date().toISOString();proof.endToEndMinutes=(Date.parse(proof.completedAt)-Date.parse(startedAt))/60000;
 write(stem+'-result.json',proof);console.log('batch result: '+stem+'-result.json');
 if(read(lock).pid===process.pid)fs.unlinkSync(lock);
}
