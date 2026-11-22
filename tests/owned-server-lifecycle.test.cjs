'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {spawn}=require('node:child_process'),{once}=require('node:events');
const withTestServer=require('./helpers/owned-server.cjs');
async function stopped(origin){
  for(let i=0;i<40;i++){
    try{await fetch(origin+'/api/launcher/health',{signal:AbortSignal.timeout(300)});}
    catch(err){if(err.cause?.code==='ECONNREFUSED')return;if(err.cause?.code!=='ECONNRESET')throw err;}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  assert.fail('测试端口仍在监听');
}
test('测试结束或回调抛错均回收拥有的实例',async()=>{
  for(const fail of [false,true]){
    let origin;
    const run=withTestServer(async url=>{
      origin=url;const h=await(await fetch(url+'/api/launcher/health')).json();
      assert.equal(h.scope,'owned-test');if(fail)throw Error('模拟失败');
    });
    if(fail)await assert.rejects(run,/模拟失败/);else await run;
    await stopped(origin);
  }
});
test('测试宿主提前退出，独立实例随 IPC 断开退出',async()=>{
  const helper=JSON.stringify(require.resolve('./helpers/owned-server.cjs'));
  const owner=spawn(process.execPath,['-e',`require(${helper})(async url=>{process.send(url);await new Promise(()=>{});});process.on('message',()=>process.exit(17));`],
    {windowsHide:true,stdio:['ignore','ignore','inherit','ipc']});
  try{
    const [origin]=await once(owner,'message');
    assert.equal((await fetch(origin+'/api/launcher/health')).status,200);
    const exit=once(owner,'exit');owner.send('exit');assert.equal((await exit)[0],17);
    await stopped(origin);
  }finally{if(owner.exitCode===null&&owner.signalCode===null)owner.kill();}
});
