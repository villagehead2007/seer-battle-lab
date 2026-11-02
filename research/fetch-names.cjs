const {spawnSync}=require('node:child_process');
const shell=process.env.USERPROFILE+'/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const ids=process.argv.slice(2).map(Number);
if(!ids.length||ids.length>20||ids.some(id=>!Number.isInteger(id)||id<1))throw Error('Invalid IDs');
for(const id of ids){
  const url=`https://raw.githubusercontent.com/SeerAPI/api-data/main/data/v1/data/pet/${id}/index.json`;
  let p=spawnSync(shell,['-NoProfile','-File','research/static-fetch.ps1'],{input:url,encoding:'utf8',windowsHide:true,timeout:40000});
  if(p.status!==0)p=spawnSync(shell,['-NoProfile','-File','seerapi-fetch.ps1'],{input:`https://api.seerapi.com/v1/pet/${id}`,encoding:'utf8',windowsHide:true,timeout:40000});
  let r=p.status===0?JSON.parse(p.stdout.replace(/^\uFEFF/,'')):null;
  if(!r||r.status!==200){p=spawnSync('curl.exe',['-4','-L','--max-time','25','-sS',`https://api.seerapi.com/v1/pet/${id}`],{encoding:'utf8',windowsHide:true,timeout:30000});if(p.status!==0)throw Error(`${id}: ${p.stderr}`);r={status:200,body:JSON.parse(p.stdout.replace(/^\uFEFF/,''))};}
  console.log(`${id} ${r.body.name}`);
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,1800);
}
