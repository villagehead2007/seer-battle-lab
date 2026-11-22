const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const wiki=require('./wiki.cjs'),seerapi=require('./seerapi.cjs'),local=require('./local-species.cjs');
const teamCertification=require('./team-note-certification.cjs');
const deploymentNotes=require('./deployment-team-notes.cjs');
const runtimeRevision=require('./runtime-revision.cjs')();
const serviceIdentity=require('./launcher-service.cjs').identity(__dirname,'development',process.env.SEER_SERVICE_SCOPE||'direct');
const root = path.join(__dirname, 'dist');
const launcherControl=require('./launcher-control.cjs').create(serviceIdentity,()=>require('./lan-server.cjs').hasRoom());
const reviewJsonCache=new Map();
function currentReviewJson(file){const resolved=path.join(__dirname,file),stat=fs.statSync(resolved,{bigint:true}),stamp=stat.size+':'+stat.mtimeNs,old=reviewJsonCache.get(file);if(old?.stamp===stamp)return old.value;const value=JSON.parse(fs.readFileSync(resolved,'utf8'));reviewJsonCache.set(file,{stamp,value});return value;}

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
async function localHandler(req,res) {
  if(req.socket.localPort===server.address()?.port&&await launcherControl.handle(req,res,server))return;
  if(req.url.startsWith('/api/lan/'))return require('./lan-server.cjs').manage(req,res,localHandler);
  if(req.method!=='GET'){res.writeHead(405);return res.end();}
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/launcher/health'){
    res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
    return res.end(JSON.stringify({app:'seer-battle-lab',revision:runtimeRevision,pid:process.pid,launcherControl:1,...serviceIdentity}));
  }
  if(url.pathname==='/api/local/team-notes'){
    if(req.headers['sec-fetch-site']==='cross-site'||(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)){res.writeHead(403);return res.end();}
    try{
      const policy=require('./completion-policy.cjs');
      const id=Number(url.searchParams.get('id')),snapshot=local.species(id),inventory=new Map(policy.inventory(snapshot).map(r=>[r.key,r]));
      const supplement=deploymentNotes.current(id,currentReviewJson);
      const records=supplement?.rows??currentReviewJson('MULTI-PET-TODO.json').records;
      const formal=supplement?.entries??currentReviewJson('research/TEAM-STAGE-2/complete-reviews.json').entries;
      const newer=deploymentNotes.accepted(id,currentReviewJson);
      let frozenRows={},accepted=false;
      try {
        const receipt=currentReviewJson('research/TEAM-STAGE-2/team-note-formal-receipt.json');
        if (/^complete-[A-Za-z0-9]+$/.test(receipt.batch)) {
          const result=currentReviewJson(`research/TEAM-STAGE-2/${receipt.batch}/result.json`);
          accepted=teamCertification.acceptedSpecies(result,receipt.fingerprint).has(id);
          frozenRows=receipt.rows;
        }
      } catch { /* The specialist status remains available without a formal receipt. */ }
      const notes=records.filter(r=>r.speciesId===id).map(r=>{
        const sourceCurrent=inventory.get(r.key)?.sourceDigest===r.sourceDigest,stage=r.stageTwo,entry=formal[r.key];
        const hasNewReceipt=entry&&newer.some(rows=>rows[r.key]===teamCertification.rowDigest(r,entry));
        const keyDigest=hasNewReceipt?teamCertification.rowDigest(r,entry):frozenRows[r.key];
        const reviewState=teamCertification.state(r,entry,sourceCurrent,hasNewReceipt||accepted,keyDigest);
        const displayStatus=({certified:'已通过正式验收',passed:'队伍专项通过，待正式验收',stale:'来源变更，待复核',partial:'部分实现，待核验',unimplemented:'未实现',recorded:'已有专项记录，待逐项核对',pending:'队伍分支待核验'})[reviewState];
        const rawMove=snapshot.moves.find(m=>m.id===r.skillId);
        return {key:r.key,kind:r.kind,speciesId:id,sourceDigest:r.sourceDigest,sourceCurrent,sourceRevision:r.source.snapshot.revision,sourceHash:r.kind==='soul'?r.raw.hash:rawMove?.hash,moveHash:rawMove?.hash,
          deployedRevision:snapshot.source.revision,deployedSoulHash:r.kind==='soul'?snapshot.souls.find(s=>s.id===r.ruleId)?.hash:null,
          skill:r.skillId,soul:r.kind==='soul'?r.ruleId:null,ruleId:r.ruleId,index:r.instanceIndex,reviewState,displayStatus,
          status:stage?.status??'待审核',historicalNotes:r.legacyNotes??[],proof:['certified','passed'].includes(reviewState)?entry.nativeEvidence?.proof??entry.strictNativeEvidence?.proof??null:null,
          text:stage?.finding||[...(r.legacyNotes??[]),...(r.futureMechanisms??[])].join('；')||r.description||r.trigger||'范围待审核'};
      });
      res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});return res.end(JSON.stringify(notes));
    }catch(error){res.writeHead(500);return res.end(JSON.stringify({error:error.message}));}
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
}
const server=http.createServer(localHandler);
server.listen(Number(process.env.PORT)||0, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}`));
module.exports=server;
