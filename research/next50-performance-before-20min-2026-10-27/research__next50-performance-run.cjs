'use strict';
// One foreground test chain; preserve raw output and actual exit status.
const fs=require('node:fs'),cp=require('node:child_process'),os=require('node:os');
const [label,...files]=process.argv.slice(2);
if(!/^[a-z0-9-]+$/.test(label)||!files.length)throw Error('label and explicit test files required');
const workers=process.env.SEER_TEST_WORKERS==='2'?2:1;
const validatorId=files[0]==='--validator'?files[1]:null;
if(validatorId!==null&&(!/^\d+$/.test(validatorId??'')||files.length!==2))throw Error('explicit validator ID required');
const commandArgs=validatorId?['automation-validate.cjs',validatorId]:['--test','--test-reporter=tap','--test-concurrency='+workers,...files];
const stem='research/'+label;
if(fs.existsSync(stem+'-result.json')||fs.existsSync(stem+'.log'))throw Error('refuse to overwrite evidence');
const startedAt=new Date().toISOString(),freeBefore=os.freemem(),totalMemory=os.totalmem();
const log=fs.createWriteStream(stem+'.log',{flags:'wx'});
const child=cp.spawn(process.execPath,commandArgs,{windowsHide:true,stdio:['ignore','pipe','pipe']});
child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
const pwsh=cp.spawnSync('where.exe',['pwsh.exe'],{encoding:'utf8',windowsHide:true}).stdout.trim().split(/\r?\n/)[0];
const monitor=cp.spawn(pwsh,['-NoLogo','-NoProfile','-Command','-'],{windowsHide:true,stdio:['pipe','pipe','pipe']});
let metrics='',monitorError='';monitor.stdout.on('data',x=>metrics+=x);monitor.stderr.on('data',x=>monitorError+=x);
monitor.stdin.end(`$rootProcessId=${child.pid}; $peakWorker=0L; $peakTree=0L; $cpu=@{}; $samples=0; while(Get-Process -Id $rootProcessId -ErrorAction SilentlyContinue){ $all=@(Get-Process node,cmd -ErrorAction SilentlyContinue); $ids=@($rootProcessId); do { $more=@($all | Where-Object { $_.Id -notin $ids -and $_.Parent.Id -in $ids } | Select-Object -ExpandProperty Id); $ids+=$more } while($more.Count -gt 0); $own=@($all | Where-Object { $_.Id -in $ids }); $tree=0L; foreach($item in $own){ $tree+=$item.WorkingSet64; $cpu[$item.Id]=$item.TotalProcessorTime.TotalMilliseconds; if($item.Id -ne $rootProcessId){ $peakWorker=[Math]::Max($peakWorker,$item.WorkingSet64) } }; $peakTree=[Math]::Max($peakTree,$tree); $samples++; Start-Sleep -Milliseconds 500 }; @{peakWorkerWorkingSetBytes=$peakWorker;peakTreeWorkingSetBytes=$peakTree;samples=$samples;sampledCpuMilliseconds=($cpu.Values | Measure-Object -Sum).Sum} | ConvertTo-Json -Compress\n`);
const monitored=new Promise(resolve=>monitor.on('close',()=>resolve()));
console.log(JSON.stringify({pid:child.pid,startedAt,files,freeBefore,totalMemory}));
child.on('close',(exitCode,signal)=>log.end(async()=>{
  await monitored;
  const text=fs.readFileSync(stem+'.log','utf8'),counts={};
  for(const k of ['tests','pass','fail','skipped','duration_ms'])counts[k]=Number(text.match(new RegExp('^# '+k+' ([\\d.]+)','m'))?.[1]??-1);
  let memory;try{memory=JSON.parse(metrics.trim());memory.observed=memory.samples>0;}catch{memory={error:monitorError||metrics};}
  const result={startedAt,completedAt:new Date().toISOString(),exitCode,signal,files,commandArgs,validatorId,passedSingleStage:validatorId?exitCode===0&&/passed\s*\(single-stage\)/.test(text):null,...counts,workers,logicalProcessors:os.availableParallelism(),totalMemory,freeBefore,freeAfter:os.freemem(),memory};
  fs.writeFileSync(stem+'-result.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));process.exitCode=exitCode??1;
}));
