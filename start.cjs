'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const {identity,preferredPort,inspect,select}=require('./launcher-service.cjs');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function launch(port,wanted,owner){
  const log=fs.openSync(path.join(__dirname,'launcher-server.log'),'a');
  let child;
  try{
    child=spawn(process.execPath,[path.join(__dirname,'server.cjs')],{cwd:__dirname,
      env:{...process.env,PORT:String(port),SEER_SERVICE_SCOPE:wanted.scope,SEER_LAUNCH_OWNER:owner},
      detached:true,windowsHide:true,stdio:['ignore',log,log]});
  }finally{fs.closeSync(log);}
  let failed=false;
  child.once('error',()=>{failed=true;});child.unref();
  for(let i=0;i<24;i++){
    await sleep(500);
    if(await inspect(port,wanted)==='match')return true;
    if(failed||child.exitCode!==null||child.signalCode!==null)return false;
  }
  // Only this launch attempt's own child can be abandoned on timeout.
  child.kill();return false;
}
(async()=>{
  const preferred=preferredPort(process.env.SEER_LAUNCH_PORT);
  const ports=preferred?[preferred]:Array.from({length:8},(_,i)=>61648+i);
  const wanted={...identity(__dirname,'development',preferred?'port-'+preferred:'normal'),revision:require('./runtime-revision.cjs')()};
  const owner=require('node:crypto').randomUUID();
  const port=await select(ports,wanted,p=>launch(p,wanted,owner));
  const url='http://127.0.0.1:'+port+'/modes.html';
  console.log('对战实验台已就绪：'+url);
  if(!process.argv.includes('--no-open')&&!(preferred&&process.env.SEER_NO_OPEN==='1'))await require('./launcher-browser.cjs')(port,owner);
})().catch(error=>{console.error(error.message);process.exitCode=1;});
