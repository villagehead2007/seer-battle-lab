'use strict';
// Standalone Windows entry-point check. The optional argument is an extracted trial directory.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {spawn}=require('node:child_process'),{once}=require('node:events');
const {identity}=require('../launcher-service.cjs');
const project=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'seer-launch-'));
const copies=[],owned=[],children=new Set();
function fixture(name,source){
  const dir=path.join(temp,name);fs.mkdirSync(dir);copies.push(dir);
  for(const file of fs.readdirSync(source).filter(n=>/\.(?:cjs|cmd)$/i.test(n)))fs.copyFileSync(path.join(source,file),path.join(dir,file));
  for(const file of ['dist','data','runtime','research'].filter(n=>fs.existsSync(path.join(source,n))))fs.symlinkSync(path.join(source,file),path.join(dir,file),'junction');
  return dir;
}
async function health(port){return (await fetch('http://127.0.0.1:'+port+'/api/launcher/health',{signal:AbortSignal.timeout(2500)})).json();}
function launch(dir,env={},trial=false){
  const child=spawn(process.env.ComSpec,['/d','/c','启动对战实验台.cmd','--no-open'],{cwd:dir,windowsHide:true,
    env:{...process.env,SEER_NO_OPEN:'1',TRIAL_PORT:'',SEER_LAUNCH_PORT:'',...env},stdio:['pipe','pipe','pipe']});
  children.add(child);let out='';
  const exited=new Promise(resolve=>child.once('close',code=>{children.delete(child);resolve(code);}));
  child.stderr.on('data',b=>{out+=b;});
  const ready=new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(Error('入口未就绪')),20000);timeout.unref();
    child.stdout.on('data',b=>{out+=b;const m=/http:\/\/127\.0\.0\.1:(\d+)\/modes.html/.exec(out);if(m){clearTimeout(timeout);resolve(+m[1]);}});
    child.once('error',e=>{clearTimeout(timeout);reject(e);});
    exited.then(code=>{clearTimeout(timeout);reject(Error('入口提前退出 '+code+' '+out+' '+(fs.existsSync(path.join(dir,'launcher-server.log'))?fs.readFileSync(path.join(dir,'launcher-server.log'),'utf8').slice(-1000):'')));});
  });
  if(!trial)child.stdin.end();
  return {ready,exited,child};
}
async function normal(dir,port){
  const run=launch(dir,port?{SEER_LAUNCH_PORT:String(port)}:{});
  const p=await run.ready,h=await health(p);
  assert.equal(h.installation,identity(dir,'development','normal').installation);
  owned.push({port:p,pid:h.pid,installation:h.installation});
  assert.equal(await run.exited,0);return {port:p,pid:h.pid,scope:h.scope};
}
async function reserve(port){
  const server=http.createServer((req,res)=>{res.writeHead(404);res.end();});
  const ready=once(server,'listening');server.listen(port,'127.0.0.1');await ready;return server;
}
async function release(server){await new Promise(resolve=>server.close(resolve));}
(async()=>{
  const one=fixture('one',project),two=fixture('two',project);
  let blocker;
  try{
    for(let p=61648;p<=61654&&!blocker;p++)try{blocker=await reserve(p);}catch(e){if(e.code!=='EADDRINUSE')throw e;}
    assert.ok(blocker);const hole=blocker.address().port;
    const first=await normal(one);assert.ok(first.port>hole);
    await release(blocker);blocker=null;
    const again=await normal(one);assert.deepEqual(again,first);
    const foreign=await normal(two);assert.notEqual(foreign.pid,first.pid);
    const available=await reserve(0),port=available.address().port;await release(available);
    const separate=await normal(one,port);assert.equal(separate.scope,'port-'+port);
    assert.deepEqual(await normal(one,port),separate);assert.notEqual(separate.pid,first.pid);
    // Different revision in the same installation must not reuse the old live service.
    fs.appendFileSync(path.join(one,'local-species.cjs'),'\n// isolated test revision\n');
    const changed=await normal(one);assert.notEqual(changed.pid,first.pid);
    console.log('Development CMD reused existing PID across earlier gap; copies, revisions and explicit tests remained isolated.');
    if(process.argv[2]){
      const trial=fixture('trial',path.resolve(process.argv[2]));
      const holder=launch(trial,{},true),p=await holder.ready,h=await health(p);
      assert.equal(h.edition,'trial');assert.equal(h.installation,identity(trial,'trial','normal').installation);
      owned.push({port:p,pid:h.pid,installation:h.installation});
      const second=launch(trial,{},true);
      assert.equal(await second.ready,p);assert.equal(await second.exited,0);assert.equal((await health(p)).pid,h.pid);
      holder.child.stdin.end('q');assert.equal(await holder.exited,0);
      console.log('Portable CMD reused original PID; only original console owned the service, Q closed it.');
    }
  }finally{
    if(blocker)await release(blocker);
    for(const child of children){child.stdin.end('q\n');}
    for(const target of owned.reverse()){
      const h=await health(target.port).catch(()=>null);
      if(h?.pid===target.pid&&h.installation===target.installation)process.kill(target.pid);
    }
    for(const dir of copies){
      for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
        const file=path.join(dir,entry.name);
        if(entry.isSymbolicLink()||entry.isFile())fs.unlinkSync(file);
      }
      fs.rmdirSync(dir);
    }
    fs.rmdirSync(temp);
  }
})().catch(err=>{console.error(err);process.exitCode=1;});
