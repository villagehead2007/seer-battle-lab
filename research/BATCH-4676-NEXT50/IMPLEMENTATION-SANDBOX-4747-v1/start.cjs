'use strict';
const http=require('node:http'),path=require('node:path'),fs=require('node:fs'),{spawn}=require('node:child_process');
const revision=require('./runtime-revision.cjs')();
const host='127.0.0.1';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function inspect(port){return new Promise(resolve=>{
  const req=http.get(`http://${host}:${port}/api/launcher/health`,res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>{try{const data=JSON.parse(body);resolve(data.app==='seer-battle-lab'&&Number.isInteger(data.pid)?{state:'ours',...data}:{state:'occupied'});}catch{resolve({state:'occupied'});}});});
  req.setTimeout(1200,()=>req.destroy());
  req.on('error',error=>resolve({state:error.code==='ECONNREFUSED'?'free':'occupied'}));
});}
async function launch(port){
  const log=fs.openSync(path.join(__dirname,'launcher-server.log'),'a');
  const child=spawn(process.execPath,[path.join(__dirname,'server.cjs')],{cwd:__dirname,env:{...process.env,PORT:String(port)},detached:true,windowsHide:true,stdio:['ignore',log,log]});
  child.on('error',error=>console.error(error.message));child.unref();fs.closeSync(log);
  for(let i=0;i<24;i++){await sleep(500);const info=await inspect(port);if(info.state==='ours'&&info.revision===revision)return true;}
  return false;
}
(async()=>{
  let port=null;
  for(let candidate=61648;candidate<=61655;candidate++){
    let info=await inspect(candidate);
    if(info.state==='ours'&&info.revision===revision){port=candidate;break;}
    if(info.state==='ours'&&info.revision!==revision){
      try{process.kill(info.pid);for(let i=0;i<20;i++){await sleep(250);if((await inspect(candidate)).state==='free')break;}}catch(error){console.error(`旧服务 ${candidate} 无法停止：${error.message}`);}
      info=await inspect(candidate);
    }
    if(info.state==='free'&&await launch(candidate)){port=candidate;break;}
  }
  if(port===null)throw Error('本地服务未启动。请查看 launcher-server.log，确认端口 61648–61655 可用。');
  const url=`http://${host}:${port}/`;
  console.log('对战实验台已就绪：'+url);
  if(!process.argv.includes('--no-open')){const browser=spawn('explorer.exe',[url],{windowsHide:true,detached:true,stdio:'ignore'});browser.on('error',()=>console.log('请手动打开上述地址。'));browser.unref();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
