'use strict';
const {spawn}=require('node:child_process'),path=require('node:path');
process.chdir(__dirname);
const wanted=process.env.TRIAL_PORT?Number(process.env.TRIAL_PORT):61780;
if(!Number.isInteger(wanted)||wanted<1024||wanted>65515){console.error('端口设置无效，请清除 TRIAL_PORT 后重新启动。');process.exit(1);}
process.env.PORT=String(wanted);
let port=wanted,closing=false;
const server=require('./server.cjs');
server.on('error',error=>{
  if(error.code==='EADDRINUSE'&&port<wanted+19){console.log('端口 '+port+' 已占用，尝试下一个端口…');server.listen(++port,'127.0.0.1');return;}
  console.error('启动失败：'+(error.code==='EADDRINUSE'?'连续 20 个端口均被占用，请关闭旧试玩窗口，或稍后重试。':error.message));process.exitCode=1;process.stdin.pause();
});
server.once('listening',()=>{
  const url='http://127.0.0.1:'+server.address().port+'/modes.html';
  console.log('\n赛 · 便携试玩版\n入口：'+url+'\n请保留本控制台窗口。关闭网页不会结束服务。\n结束试玩：在本窗口按 Q（或 Ctrl+C），也可以关闭本窗口。\n');
  if(!process.argv.includes('--no-open')){
    const browser=spawn(path.join(process.env.SystemRoot||'C:\\Windows','explorer.exe'),[url],{windowsHide:true,stdio:'ignore'});
    browser.on('error',()=>console.log('未能打开默认浏览器，请手动打开上述入口。'));browser.unref();
  }
  if(process.stdin.isTTY)process.stdin.setRawMode(true);
  process.stdin.setEncoding('utf8');process.stdin.resume();
  process.stdin.on('data',key=>{if(/[qQ\u0003]/.test(key))stop();});
});
function stop(){if(closing)return;closing=true;console.log('正在关闭本次试玩服务…');server.close(()=>{console.log('服务已关闭。');process.exit(0);});server.closeAllConnections?.();setTimeout(()=>process.exit(0),2000).unref();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
process.on('uncaughtException',error=>{console.error('运行失败：'+error.message);process.exit(1);});
