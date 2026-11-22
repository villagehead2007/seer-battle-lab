'use strict';
const {randomUUID}=require('node:crypto');
const path='/api/launcher/';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function command(port,data){
  const response=await fetch('http://127.0.0.1:'+port+path+'control',{method:'POST',
    headers:{'Content-Type':'application/json','X-Seer-Local-Tool':'1',Connection:'close'},body:JSON.stringify(data),signal:AbortSignal.timeout(3000)});
  const result=await response.json();
  if(!response.ok)throw Error(result.error||'服务拒绝操作');
  return result;
}
function create(identity,roomOpen){
  const instance=randomUUID(),requests=new Map();
  const owner=process.env.SEER_LAUNCH_OWNER;
  let attempts=0,pages=0,used=false,failed=false,closing=false,inFlight=0;
  function report(){
    const launching=[...requests.values()].some(t=>!t.seen&&!t.failed&&Date.now()-t.at<30000);
    const protectedReason=roomOpen()?'有局域网房间':identity.scope!=='normal'?'独立测试或直接启动的服务':
      pages?'有打开的实验台页面':inFlight?'正在处理请求':launching?'正在打开网页':null;
    return {instance,pid:process.pid,...identity,protectedReason,automatic:!protectedReason&&failed&&!used};
  }
  async function handle(req,res,server){
    const route=req.url.split('?')[0],origin='http://127.0.0.1:'+req.socket.localPort;
    const json=(status,obj)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj));};
    if(closing){json(503,{error:'服务正在退出'});return true;}
    if(![path+'control',path+'page',path+'visible'].includes(route)){
      if(route!==path+'health'&&route!=='/api/lan/current'){
        used=true;inFlight++;res.once('close',()=>inFlight--);
      }
      return false;
    }
    if(req.socket.remoteAddress!=='127.0.0.1'||req.headers.host!==origin.slice(7)||
      req.headers['sec-fetch-site']==='cross-site'||(req.headers.origin&&req.headers.origin!==origin)){json(403,{});return true;}
    if(route===path+'page'&&req.method==='GET'){
      used=true;pages++;
      res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store'});res.write(': connected\n\n');
      res.once('close',()=>pages--);return true;
    }
    const browser=route===path+'visible';
    if(req.method!=='POST'||(browser?req.headers.origin!==origin:
        req.headers['x-seer-local-tool']!=='1'||req.headers.origin||req.headers['sec-fetch-site'])){json(403,{});return true;}
    try{
      let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>1024)throw Error('请求过长');}
      const data=JSON.parse(raw);
      for(const [id,t] of requests)if(Date.now()-t.at>120000)requests.delete(id);
      const ticket=requests.get(data.ticket);
      if(browser){
        if(ticket){ticket.seen=true;used=true;}
        json(ticket?200:404,{});return true;
      }
      if(data.op==='open'){
        const id=randomUUID();attempts++;failed=false;requests.set(id,{at:Date.now(),seen:false,failed:false,initial:attempts===1&&!!owner&&data.owner===owner});json(200,{ticket:id});
      }else if(data.op==='check'||data.op==='failed'){
        if(!ticket){json(404,{error:'启动回执已过期'});return true;}
        if(data.op==='failed'&&!ticket.seen){ticket.failed=true;failed=ticket.initial&&attempts===1&&data.shellError===true;}
        json(200,{seen:ticket.seen});
      }else if(data.op==='inventory')json(200,report());
      else if(data.op==='cleanup'){
        const current=report();
        if(data.instance!==instance||data.pid!==process.pid||data.installation!==identity.installation||
           current.protectedReason||(!current.automatic&&data.confirm!==true)){
          json(409,{error:current.protectedReason||'身份或清理条件变化'});return true;
        }
        closing=true;res.setHeader('Connection','close');json(200,{pid:process.pid});server.close();server.closeIdleConnections();
      }else json(400,{error:'未知操作'});
    }catch(e){if(!res.headersSent)json(400,{error:e.message});}
    return true;
  }
  return {handle};
}
module.exports={command,create,sleep};
