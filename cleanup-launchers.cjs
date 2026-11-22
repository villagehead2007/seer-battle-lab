'use strict';
const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const fs=require('node:fs');
const path=require('node:path');
const run=promisify(execFile);

async function powershell(script,env={}){
  const exe=path.join(process.env.SystemRoot,'System32','WindowsPowerShell','v1.0','powershell.exe');
  const {stdout}=await run(exe,['-NoProfile','-NonInteractive','-Command',
    "$ErrorActionPreference='Stop';[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false);\n"+script],
    {windowsHide:true,timeout:30000,env:{...process.env,...env}});
  return stdout.trim();
}

async function processes(){
  return JSON.parse(await powershell(String.raw`
    $rows=@(Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ForEach-Object {
      if($_.CommandLine -match '^\s*(?:"[^"]+"|\S+)\s+(?:"([^"]+)"|([^\s"]+))(?:\s|$)'){
        $entry=($matches[1]+$matches[2])
        if($entry -match '(?:^|[\\/])(?:server|start|owned-server)\.cjs$'){
          [pscustomobject]@{pid=$_.ProcessId;entry=$entry;born=$_.CreationDate.ToUniversalTime().Ticks.ToString()}
        }
      }
    })
    if($rows.Count){
      $listeners=@(Get-NetTCPConnection -State Listen)
      foreach($row in $rows){
        $ports=@($listeners | Where-Object OwningProcess -eq $row.pid)
        $row | Add-Member -NotePropertyName ports -NotePropertyValue @($ports | ForEach-Object LocalPort | Sort-Object -Unique)
        $row | Add-Member -NotePropertyName local -NotePropertyValue @($ports | Where-Object LocalAddress -in '127.0.0.1','0.0.0.0' | ForEach-Object LocalPort)
      }
    }
    ConvertTo-Json -Depth 4 -Compress -InputObject $rows`));
}

function isLabEntry(entry){
  if(!path.isAbsolute(entry))return false;
  const dir=path.basename(entry).toLowerCase()==='owned-server.cjs'
    ?path.resolve(path.dirname(entry),'../..'):path.dirname(entry);
  const known=['server.cjs','start.cjs','tests/helpers/owned-server.cjs'].map(name=>path.join(dir,name).toLowerCase());
  if(!known.includes(path.resolve(entry).toLowerCase()))return false;
  if(dir.toLowerCase()===__dirname.toLowerCase())return true;
  try{
    return fs.existsSync(path.join(dir,'启动对战实验台.cmd'))&&
      fs.readFileSync(path.join(dir,'server.cjs'),'utf8').includes('seer-battle-lab');
  }catch{return false;}
}
async function isLab(row){
  if(isLabEntry(row.entry))return true;
  for(const port of row.local){
    try{
      const response=await fetch('http://127.0.0.1:'+port+'/api/launcher/health',
        {redirect:'error',signal:AbortSignal.timeout(1500)});
      if(!response.ok)continue;
      const health=await response.json();
      if(health.app==='seer-battle-lab'&&health.pid===row.pid)return true;
    }catch{}
  }
  return false;
}

async function stop(row){
  // Hold a Windows process handle while rechecking creation time so a recycled PID cannot be stopped.
  return powershell(`
    $p=Get-Process -Id $env:SEER_TARGET_PID -ErrorAction SilentlyContinue
    if(!$p){return}
    try {
      if($p.HasExited){return}
      $null=$p.Handle
      $current=Get-CimInstance Win32_Process -Filter ("ProcessId="+$p.Id)
      if(!$current -or $current.Name -ne 'node.exe' -or $current.CreationDate.ToUniversalTime().Ticks.ToString() -ne $env:SEER_TARGET_BORN){return}
      $p.Kill()
      if(!$p.WaitForExit(5000)){throw '等待进程退出超时'}
    } catch {if(!$p.HasExited){throw}} finally {$p.Dispose()}`,
    {SEER_TARGET_PID:String(row.pid),SEER_TARGET_BORN:row.born});
}

(async()=>{
  // The regression test runs the real CMD with an explicit PID subset to isolate its fixture.
  let subset=null;
  for(const arg of process.argv.slice(2)){
    if(arg==='--auto')continue;
    if(!/^--only-pids=\d+(,\d+)*$/.test(arg))throw Error('无法识别的参数 '+arg);
    subset=new Set(arg.slice('--only-pids='.length).split(',').map(Number));
  }
  async function list(){
    const candidates=(await processes()).filter(row=>!subset||subset.has(row.pid));
    return (await Promise.all(candidates.map(async row=>await isLab(row)?row:null))).filter(Boolean);
  }
  let rows=await list();
  for(let pass=0;rows.length&&pass<3;pass++){
    for(const row of rows){
      try{
        await stop(row);
        console.log('已退出 PID '+row.pid+' / '+(row.ports.join('、')||'无监听端口'));
      }catch(e){console.error('关闭 PID '+row.pid+' 失败：'+(e.stderr?.trim()||e.message));}
    }
    rows=await list();
  }
  console.log('实验台剩余 '+rows.length+' 个进程。'+rows.map(row=>' PID '+row.pid).join(''));
  if(rows.length)process.exitCode=1;
})().catch(e=>{console.error('清理失败：'+(e.stderr?.trim()||e.message));process.exitCode=1;});

