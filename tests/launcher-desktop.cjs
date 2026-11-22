'use strict';
// Uses the actual Windows URL association. Only pages opened on this run's private port receive the test observer.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFile}=require('node:child_process'),{promisify}=require('node:util'),{once}=require('node:events'),{randomUUID}=require('node:crypto');
const {identity}=require('../launcher-service.cjs');
const root=path.join(__dirname,'..'),key=randomUUID(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'seer-open-'));
const preload=path.join(temp,'observe.cjs'),reports=[];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn){for(let i=0;i<80;i++){if(fn())return;await wait(100);}throw Error('缺少测试页面的可见或关闭回执 '+JSON.stringify(reports));}
(async()=>{
  const receiver=http.createServer(async(req,res)=>{
    if(req.method!=='POST'||req.url!=='/'+key){res.writeHead(404);res.end();return;}
    let body='';for await(const chunk of req)body+=chunk;
    reports.push(JSON.parse(body));res.writeHead(204);res.end();
  });
  receiver.listen(0,'127.0.0.1');await once(receiver,'listening');
  const probe=http.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');
  const port=probe.address().port;await new Promise(r=>probe.close(r));
  const base='http://127.0.0.1:'+port,callback='http://127.0.0.1:'+receiver.address().port+'/'+key;
  const script=`<script>
    (()=>{
      if(location.origin!==${JSON.stringify(base)}||!/^#launch=/.test(location.hash))return;
      const id=location.hash,send=(event)=>navigator.sendBeacon(${JSON.stringify(callback)},JSON.stringify({event,id,title:document.title,visible:document.visibilityState,controls:!!document.getElementById('open-room'),edge:navigator.userAgent.includes('Edg/')}));
      const original=window.fetch.bind(window);
      window.fetch=async(...args)=>{
        const r=await original(...args);
        if(args[0]==='/api/launcher/visible'&&r.ok){
          send('visible');window.addEventListener('pagehide',()=>send('closed'),{once:true});setTimeout(()=>window.close(),700);
        }
        return r;
      };
    })();
    </script>`;
  // Observe only this test server's own rendered mode page; keep the launcher, page and URL opener unmodified.
  fs.writeFileSync(preload,`if(process.argv[1]?.toLowerCase()===${JSON.stringify(path.join(root,'server.cjs').toLowerCase())}){
    const fs=require('node:fs'),read=fs.readFile;
    fs.readFile=function(file,...args){
      if(String(file).toLowerCase()===${JSON.stringify(path.join(root,'dist','modes.html').toLowerCase())}){
        const cb=args.pop();args.push((err,buf)=>cb(err,err?buf:Buffer.from(buf.toString().replace('</head>',()=>${JSON.stringify(script)}+'</head>'))));
      }return read.call(this,file,...args);
    };
  }`);
  let owner;
  try{
    for(let i=0;i<2;i++){
      const launch=promisify(execFile)('powershell.exe',['-NoProfile','-NonInteractive','-Command',
        '$p=Start-Process -FilePath $env:SEER_TEST_CMD -WorkingDirectory $env:TEMP -RedirectStandardOutput $env:SEER_TEST_OUT -RedirectStandardError $env:SEER_TEST_ERR -PassThru;if(!$p.WaitForExit(28000)){[void]$p.CloseMainWindow();throw "CMD did not finish"};exit $p.ExitCode'],
        {windowsHide:true,timeout:35000,env:{...process.env,SEER_TEST_OUT:path.join(temp,'out'),SEER_TEST_ERR:path.join(temp,'err'),SEER_TEST_CMD:path.join(root,'启动对战实验台.cmd'),SEER_LAUNCH_PORT:String(port),SEER_NO_OPEN:'',
          NODE_OPTIONS:'--require "'+preload.split(path.sep).join('/')+'"'}});
      try{await launch;}catch(e){throw Error([e.message,fs.readFileSync(path.join(temp,'out'),'utf8'),fs.readFileSync(path.join(temp,'err'),'utf8'),JSON.stringify(reports)].join('\n'));}
      const h=await(await fetch(base+'/api/launcher/health')).json();
      assert.equal(h.scope,'port-'+port);assert.equal(h.installation,identity(root,'development','').installation);
      if(owner)assert.equal(h.pid,owner);owner=h.pid;
      await until(()=>reports.filter(r=>r.event==='visible').length===i+1);
      const seen=reports.filter(r=>r.event==='visible')[i];assert.ok(seen.edge&&seen.controls&&seen.visible==='visible');
      assert.equal(seen.title,'选择对战实验台');await wait(1200);
      console.log(i?'重复双击':'首次双击',port,h.pid,seen.title,'Edge visible;',reports.some(r=>r.id===seen.id&&r.event==='closed')?'测试页已关闭':'未收到测试页关闭回执');
    }
    assert.equal(new Set(reports.filter(r=>r.event==='visible').map(r=>r.id)).size,2);
  }finally{
    const h=await fetch(base+'/api/launcher/health').then(r=>r.json()).catch(()=>null);
    if(h&&h.scope==='port-'+port&&h.installation===identity(root,'development','').installation&&(!owner||owner===h.pid))process.kill(h.pid);
    receiver.closeAllConnections();receiver.close();for(const file of [preload,path.join(temp,'out'),path.join(temp,'err')])fs.rmSync(file,{force:true});fs.rmdirSync(temp);
  }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
