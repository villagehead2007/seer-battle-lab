const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const wiki=require('./wiki.cjs'),seerapi=require('./seerapi.cjs'),local=require('./local-species.cjs');
const runtimeRevision=require('./runtime-revision.cjs')();
const root = path.join(__dirname, 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  if(req.method!=='GET'){res.writeHead(405);return res.end();}
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/launcher/health'){
    res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
    return res.end(JSON.stringify({app:'seer-battle-lab',revision:runtimeRevision,pid:process.pid}));
  }
  if(url.pathname.startsWith('/api/wiki/')||url.pathname.startsWith('/api/seerapi/')||url.pathname.startsWith('/api/local/')){
    const source=url.pathname.startsWith('/api/local/')?local:url.pathname.startsWith('/api/seerapi/')?seerapi:wiki;
    if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`){res.writeHead(403);return res.end();}
    if(req.headers['sec-fetch-site']==='cross-site'){res.writeHead(403);return res.end();}
    try{let result;if(url.pathname.endsWith('/status'))result=source.status();else if(url.pathname.endsWith('/search'))result=await source.search(url.searchParams.get('q')??'');else if(url.pathname.endsWith('/types'))result=await source.typeChart();else if(url.pathname.endsWith('/species')){result=await source.species(url.searchParams.get('id')??'');if(source!==local){const saved=local.save(result);if(saved.saved)result=saved.snapshot;}}else{res.writeHead(404);return res.end();}res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});return res.end(JSON.stringify(result));}
    catch(e){res.writeHead(e.status??502,{'Content-Type':'application/json; charset=utf-8',...(e.retryAfter?{'Retry-After':String(e.retryAfter)}:{})});return res.end(JSON.stringify({error:e.message,retryAfter:e.retryAfter??null}));}
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); return res.end(); }
  const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!target.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(target, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(data);
  });
});
server.listen(Number(process.env.PORT)||0, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}`));
