'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {capture, changedCapabilities, affectedNative} = require('../research/TEAM-STAGE-2/environment-migration.cjs');

const plan = {
  files:[
    {file:'local.test.cjs',dependencySet:'a',profile:'native'},
    {file:'child.test.cjs',dependencySet:'b',profile:'child'}
  ],
  closures:{a:['local.test.cjs','data/a.json'],b:['child.test.cjs','child.js']}
};

test('聊天身份变更保留完整摘要差异，只复用具有相同依赖的凭证',()=>{
  const first=capture({CODEX_THREAD_ID:'chat-a',LANG:'zh_CN'});
  const next=capture({CODEX_THREAD_ID:'chat-b',LANG:'zh_CN'});
  assert.notEqual(first.full,next.full);
  assert.deepEqual(affectedNative(plan,[],first,next),[]);
  assert.deepEqual(changedCapabilities(first,next,'http'),[]);
  assert.deepEqual(changedCapabilities(first,next,'opaque'),['full']);
});

test('真实子进程、代理、运行时和单文件变化仅命中使用对应输入的凭证',()=>{
  const base=capture({});
  const shell=capture({SystemRoot:'a-different-root'});
  assert.deepEqual(affectedNative(plan,[],base,shell),[{file:'child.test.cjs',files:[],environment:['child']}]);
  assert.deepEqual(affectedNative(plan,['data/a.json'],base,base),[{file:'local.test.cjs',files:['data/a.json'],environment:[]}]);
  const proxy=capture({HTTP_PROXY:'test-proxy'});
  assert.deepEqual(changedCapabilities(base,proxy,'http'),['http']);
  assert.deepEqual(affectedNative(plan,[],base,proxy),[]);
  const runtime=capture({NODE_OPTIONS:'--no-warnings'});
  assert.equal(affectedNative(plan,[],base,runtime).length,2);
  assert.throws(()=>changedCapabilities(base,proxy,'unregistered'));
});

const {reviewReadUnchanged}=require('../research/TEAM-STAGE-2/corrective-evidence.cjs');
test('单宠审核投影核对读取者、精灵审核行及其动态引用的测试文件',()=>{
 const file='tests/reader.test.cjs', child='tests/named.test.cjs';
 const projection={ids:[10],readers:[{file,sha256:'reader'}]};
 const evidence={tests:{success:[{file:child,name:'named'}]}};
 const rows={'10:soul:1':evidence,'20:soul:2':{value:1}};
 const baseline={[file]:'reader',[child]:'original'};
 assert.equal(reviewReadUnchanged(projection,rows,{...rows,'20:soul:2':{value:2}},baseline,baseline),true);
 assert.equal(reviewReadUnchanged(projection,rows,{...rows,'10:soul:1':{...evidence,edited:true}},baseline,baseline),false);
 assert.equal(reviewReadUnchanged(projection,rows,rows,baseline,{...baseline,[child]:'changed'}),false);
 assert.equal(reviewReadUnchanged(projection,rows,rows,baseline,{...baseline,[file]:'changed'}),false);
 assert.equal(reviewReadUnchanged(undefined,rows,rows,baseline,baseline),false);
});
