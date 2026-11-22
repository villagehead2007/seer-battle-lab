'use strict';
const http=require('node:http');
const fs=require('node:fs');
const crypto=require('node:crypto');

function identity(directory,edition,scope){
  const real=fs.realpathSync.native(directory);
  const installation=crypto.createHash('sha256').update(process.platform==='win32'?real.toLowerCase():real).digest('hex');
  return {installation,edition,scope};
}
function preferredPort(value){
  if(value==null||value==='')return null;
  if(!/^\d+$/.test(value)||Number(value)<1||Number(value)>65535)throw Error('指定端口须为 1～65535 的整数');
  return Number(value);
}
function inspect(port,wanted){
  return new Promise(resolve=>{
    const req=http.get({host:'127.0.0.1',port,path:'/api/launcher/health',agent:false},res=>{
      let text='';
      res.on('error',()=>resolve('occupied'));
      res.on('data',chunk=>{text+=chunk;if(text.length>8192)req.destroy(Error('响应过长'));});
      res.on('end',()=>{
        try{
          const h=JSON.parse(text);
          resolve(res.statusCode===200&&h.app==='seer-battle-lab'&&Number.isInteger(h.pid)&&
            Object.entries(wanted).every(([key,value])=>h[key]===value)?'match':'occupied');
        }catch{resolve('occupied');}
      });
    });
    const timer=setTimeout(()=>req.destroy(Error('检查超时')),1500);
    req.on('close',()=>clearTimeout(timer));
    req.on('error',err=>resolve(err.code==='ECONNREFUSED'?'free':'occupied'));
  });
}
async function select(ports,wanted,start){
  const states=await Promise.all(ports.map(port=>inspect(port,wanted)));
  const existing=states.indexOf('match');
  if(existing!==-1)return ports[existing];
  for(let i=0;i<ports.length;i++){
    if(states[i]!=='free')continue;
    const port=ports[i];
    if(await start(port)||await inspect(port,wanted)==='match')return port;
  }
  throw Error('没有可复用的同版本服务或空闲端口（'+ports.join('、')+'）');
}
module.exports={identity,preferredPort,inspect,select};
