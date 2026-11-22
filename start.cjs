'use strict';
const owner=require('node:crypto').randomUUID();
const {identity,preferredPort,select}=require('./launcher-service.cjs');
process.chdir(__dirname);
let server,closing=false;
function listen(port){
  return new Promise((resolve,reject)=>{
    process.env.PORT=String(port);
    if(!server)server=require('./server.cjs');
    else server.listen(port,'127.0.0.1');
    function cleanup(){server.removeListener('error',failed);server.removeListener('listening',ready);}
    function failed(error){cleanup();if(error.code==='EADDRINUSE')resolve(false);else reject(error);}
    function ready(){cleanup();resolve(true);}
    server.once('error',failed);server.once('listening',ready);
  });
}
function stop(){
  if(closing)return;closing=true;
  console.log('正在关闭本次试玩服务…');
  server.close(()=>{console.log('服务已关闭。');process.exit(0);});
  server.closeAllConnections?.();setTimeout(()=>process.exit(0),2000).unref();
}
(async()=>{
  const preferred=preferredPort(process.env.TRIAL_PORT);
  const ports=preferred?[preferred]:Array.from({length:20},(_,i)=>61780+i);
  const scope=preferred?'port-'+preferred:'normal';
  process.env.SEER_SERVICE_SCOPE=scope;
  const wanted={...identity(__dirname,'trial',scope),revision:require('./runtime-revision.cjs')()};
  process.env.SEER_LAUNCH_OWNER=owner;
  const port=await select(ports,wanted,listen);
  const url='http://127.0.0.1:'+port+'/modes.html';
  console.log('赛 · 便携试玩版\n入口：'+url);
  if(!process.argv.includes('--no-open')&&!process.env.SEER_NO_OPEN){
    try{await require('./launcher-browser.cjs')(port,owner);}catch(error){console.error(error.message);}
  }
  if(!server?.listening)return;
  console.log('请保留本控制台窗口。按 Q 或 Ctrl+C 结束本次试玩。');
  if(process.stdin.isTTY)process.stdin.setRawMode(true);
  process.stdin.setEncoding('utf8');process.stdin.resume();
  process.stdin.on('data',key=>{if(/[qQ\u0003]/.test(key))stop();});
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
})().catch(error=>{console.error('启动失败：'+error.message);process.exitCode=1;});
