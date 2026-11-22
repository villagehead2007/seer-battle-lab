'use strict';
const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const path=require('node:path');
const {command,sleep}=require('./launcher-control.cjs');
const invoke=promisify(execFile);
module.exports=async function openBrowser(port,owner){
  const base='http://127.0.0.1:'+port+'/modes.html';
  const {ticket}=await command(port,{op:'open',owner});
  const url=base+'#launch='+ticket;
  const exe=path.join(process.env.SystemRoot||'C:\\Windows','System32','WindowsPowerShell','v1.0','powershell.exe');
  const script=`
    $ErrorActionPreference='Stop'
    [Console]::OutputEncoding=[Text.UTF8Encoding]::new($false)
    try {
      $info=New-Object System.Diagnostics.ProcessStartInfo
      $info.FileName=$env:SEER_OPEN_URL
      $info.UseShellExecute=$true
      $info.WindowStyle='Normal'
      [void][System.Diagnostics.Process]::Start($info)
    } catch {[Console]::Error.WriteLine($_.Exception.GetBaseException().Message);exit 1}`;
  let reason,shellAccepted=false,confirmedFailure=false;
  try{
    await invoke(exe,['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,timeout:15000,env:{...process.env,SEER_OPEN_URL:url}});
    shellAccepted=true;
    for(let i=0;i<50;i++){
      if((await command(port,{op:'check',ticket})).seen)return;
      await sleep(300);
    }
    reason='Windows 已接收打开请求，但在 15 秒内未收到模式页可见回执。浏览器可能在后台或仍在加载。';
  }catch(e){confirmedFailure=!shellAccepted&&(e.code==='ENOENT'||(e.code===1&&Boolean(e.stderr?.trim())));reason='打开默认浏览器或读取页面回执失败：'+(e.stderr?.trim()||e.code||e.message);}
  await command(port,{op:'failed',ticket,shellError:confirmedFailure}).catch(()=>{});
  throw Error(reason+'\n请复制此地址到浏览器：'+base);
};
