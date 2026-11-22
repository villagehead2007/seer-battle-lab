'use strict';
// Standalone Windows test with an isolated installation identity and independently owned children.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn,execFile}=require('node:child_process'),{once}=require('node:events'),{promisify}=require('node:util');
const foreignDir=fs.mkdtempSync(path.join(os.tmpdir(),'unrelated node '));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'seer cleanup ')),root=path.join(__dirname,'..'),children=[];
async function start(scope){
  const child=spawn(process.execPath,[path.join(dir,'server.cjs')],{cwd:dir,windowsHide:true,env:{...process.env,PORT:'0',SEER_SERVICE_SCOPE:scope,SEER_LAUNCH_OWNER:'fixture'},stdio:['ignore','pipe','inherit']});
  children.push(child);
  const [buf]=await once(child.stdout,'data'),port=Number(String(buf).match(/:(\d+)\s*$/)[1]);return {child,port};
}
async function clean(){
  const {stdout}=await promisify(execFile)(process.env.ComSpec,['/d','/c','清理残留实验台进程.cmd','--auto','--only-pids='+[process.pid,...children.map(child=>child.pid)].join(',')],{cwd:dir,windowsHide:true,timeout:45000});return stdout;
}
(async()=>{
  let stream;
  try{
    for(const n of fs.readdirSync(root).filter(n=>/\.(cjs|cmd)$/.test(n)))fs.copyFileSync(path.join(root,n),path.join(dir,n));
    for(const n of ['research','dist','data'])fs.symlinkSync(path.join(root,n),path.join(dir,n),'junction');
    assert.match(await clean(),/剩余 0 个/);
    const failed=await start('normal'),page=await start('normal'),room=await start('normal'),test=await start('owned-test');
    const systemRoot=process.env.SystemRoot;
    try{
      process.env.SystemRoot=dir;
      await assert.rejects(require('../launcher-browser.cjs')(failed.port,'fixture'),error=>
        error.message.includes('ENOENT')&&error.message.includes('http://127.0.0.1:'+failed.port+'/modes.html'));
    }finally{process.env.SystemRoot=systemRoot;}
    const pageBase='http://127.0.0.1:'+page.port;
    stream=await fetch(pageBase+'/api/launcher/page');assert.equal(stream.status,200);
    const roomBase='http://127.0.0.1:'+room.port;
    assert.equal((await fetch(roomBase+'/api/lan/open',{method:'POST',headers:{Origin:roomBase,'Content-Type':'application/json'},body:'{}'})).status,200);
    fs.writeFileSync(path.join(foreignDir,'server.cjs'),"require('node:http').createServer((req,res)=>res.end('{}')).listen(0,'127.0.0.1',()=>console.log('ready'))");
    const foreign=spawn(process.execPath,[path.join(foreignDir,'server.cjs')],{windowsHide:true,stdio:['ignore','pipe','inherit']});
    children.push(foreign);await once(foreign.stdout,'data');
    const out=await clean();console.log(out.trim());
    for(const instance of [failed,page,room,test]){
      assert.ok(out.includes('已退出 PID '+instance.child.pid+' / '));
      assert.notEqual(instance.child.exitCode,null);
    }
    assert.match(out,/剩余 0 个/);
    assert.equal(foreign.exitCode,null);
    const twice=await clean();assert.match(twice,/剩余 0 个/);assert.ok(!twice.includes('已退出'));
    console.log('Verified cleanup with open page, room, test, failed launch, unrelated Node and repeat run.');
  }finally{
    await stream?.body.cancel().catch(()=>{});
    await Promise.all(children.map(async c=>{if(c.exitCode===null&&c.signalCode===null){const exit=once(c,'exit');c.kill();await exit;}}));
    fs.rmSync(path.join(foreignDir,'server.cjs'),{force:true});fs.rmdirSync(foreignDir);
    for(const n of fs.readdirSync(dir))fs.unlinkSync(path.join(dir,n));fs.rmdirSync(dir);
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
