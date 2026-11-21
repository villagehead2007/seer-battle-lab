'use strict';
const http=require('node:http');
const {interfaces,networks}=require('./lan-networks.cjs');
const fs=require('node:fs');
const path=require('node:path');
const {createRoom}=require('./lan-room.cjs');
const root=path.join(__dirname,'dist');
const assets=new Set(fs.readdirSync(root).filter(name=>/\.(css|js)$/.test(name)));
let active;
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function body(req){
  const chunks=[];let size=0;
  for await(const part of req){size+=part.length;if(size>16384)throw Error('提交内容过长');chunks.push(part);}
  return JSON.parse(Buffer.concat(chunks).toString());
}
function sameOrigin(req){return req.headers.origin==='http://'+req.headers.host&&req.headers['sec-fetch-site']!=='cross-site'&&req.headers['content-type']==='application/json';}
async function manage(req,res,localHandler){
  if(req.method!=='POST'||req.headers.host!=='127.0.0.1:'+req.socket.localPort||!sameOrigin(req))return json(res,403,{error:'仅限本机模式页操作'});
  if(req.url==='/api/lan/close'){
    if(active){active.server.close();active.server.closeAllConnections();active=null;}
    return json(res,200,{});
  }
  if(req.url==='/api/lan/current'&&!active)return json(res,200,{});
  if(!['/api/lan/open','/api/lan/current'].includes(req.url))return json(res,404,{});
  if(!active){
    const room=createRoom();
    const rows=interfaces(),ips=rows.map(n=>n.ip);
    const server=http.createServer(async(req,res)=>{
      try{
        const address=req.socket.localAddress;
        if(!['127.0.0.1',...ips].includes(address)||req.headers.host!==address+':'+req.socket.localPort||req.headers['sec-fetch-site']==='cross-site'&&req.method!=='GET')return json(res,403,{});
        const url=new URL(req.url,'http://localhost');
        res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');
        if(req.method==='GET'&&(url.pathname==='/room'||assets.has(url.pathname.slice(1)))){
          const file=url.pathname==='/room'?'index.html':url.pathname.slice(1);
          res.setHeader('Content-Type',({'html':'text/html','css':'text/css','js':'text/javascript'})[file.split('.').pop()]+'; charset=utf-8');
          return res.end(fs.readFileSync(path.join(root,file)));
        }
        if(req.method==='POST'&&sameOrigin(req)&&url.pathname==='/claim'){
          const data=await body(req);
          if(data.invite===room.invites[0]&&address!=='127.0.0.1')return json(res,403,{});
          room.claim(data.invite,data.session);return json(res,200,{});
        }
        const side=room.seat(req.headers['x-room-session']);
        if(side<0)return json(res,403,{error:'请使用房主提供的加入地址'});
        if(req.method==='GET'&&['/api/local/search','/api/local/species','/api/local/status','/api/local/team-notes'].includes(url.pathname))return localHandler(req,res);
        if(url.pathname==='/state'&&req.method==='GET'){
          const tag='"'+room.stamp(side)+'"';res.setHeader('ETag',tag);
          if(req.headers['if-none-match']===tag){res.writeHead(304);return res.end();}
          return json(res,200,room.view(side));
        }
        if(url.pathname==='/command'&&req.method==='POST'&&sameOrigin(req)){
          const data=await body(req);room.mutate(side,data);return json(res,200,room.view(side));
        }
        json(res,404,{});
      }catch(error){json(res,400,{error:error.message});}
    });
    const listening=new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'0.0.0.0',resolve);});
    active={room,server,ips,listening,networks:networks(rows)};
  }
  const instance=active;
  try{
    await instance.listening;
    const adapters=await instance.networks;
    if(active!==instance)return json(res,200,{});
    const {server,room,ips}=instance,port=server.address().port;
    const link=(ip,side)=>'http://'+ip+':'+port+'/room?mode=team#'+room.invites[side];
    json(res,200,{host:link('127.0.0.1',0),join:ips.map(ip=>link(ip,1)),networks:adapters,localJoin:link('127.0.0.1',1)});
  }catch(error){if(active===instance)active=null;json(res,500,{error:'房间启动失败：'+error.message});}
}
module.exports={manage};
