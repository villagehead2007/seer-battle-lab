'use strict';
const {fork}=require('node:child_process');
const path=require('node:path');
if(require.main===module){
  const server=require('../../server.cjs');
  // The IPC channel closes even when the test runner cannot execute its finally block.
  function stop(){server.close(()=>process.exit(0));server.closeAllConnections();}
  process.once('disconnect',stop);
  if(!process.connected)stop();
  else server.once('listening',()=>{if(process.connected)process.send(server.address().port);});
}
module.exports=async function withTestServer(run){
  const child=fork(__filename,[],{cwd:path.resolve(__dirname,'../..'),execArgv:[],windowsHide:true,
    env:{...process.env,PORT:'0',SEER_SERVICE_SCOPE:'owned-test'},stdio:['ignore','ignore','inherit','ipc']});
  const closed=new Promise(resolve=>{child.once('exit',resolve);child.once('error',resolve);});
  let timer;
  try{
    const port=await new Promise((resolve,reject)=>{
      timer=setTimeout(()=>reject(Error('测试服务启动超时')),15000);
      child.once('message',resolve);child.once('error',reject);
      child.once('exit',()=>reject(Error('测试服务未就绪即退出')));
    });
    clearTimeout(timer);
    await run('http://127.0.0.1:'+port);
  }finally{
    clearTimeout(timer);
    if(child.connected)child.disconnect();
    const fallback=setTimeout(()=>child.kill(),5000);
    try{await closed;}finally{clearTimeout(fallback);}
  }
};
