'use strict';

const {test}=require('node:test');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const path=require('node:path');
const {acceptedSpecies,state}=require('../team-note-certification.cjs');
const root=path.join(__dirname,'..');
const stage='../research/TEAM-STAGE-2/';
const index=require(stage+'team-note-formal-receipt.json');
const result=require(stage+'complete-sLE0c5/result.json');
const {entries}=require(stage+'complete-reviews.json');
const {records}=require('../MULTI-PET-TODO.json');

test('正式凭据绑定同一词条的来源、审核和专项记录',()=>{
  const row=records.find(row=>row.key==='4762:soul:1973');
  const entry=entries[row.key],frozen=index.rows[row.key];
  assert.ok(acceptedSpecies(result,index.fingerprint).has(4762));
  assert.equal(state(row,entry,true,true,frozen),'certified');
  assert.equal(state(row,entry,true,false,frozen),'passed');
  assert.equal(state(row,entry,true,true,undefined),'passed');
  assert.equal(state(row,{...entry,behavior:'变更后的审核'},true,true,frozen),'passed');
  assert.equal(state({...row,scope:'变更绑定'},entry,true,true,frozen),'recorded');
  assert.equal(state(row,entry,false,true,frozen),'stale');
  assert.equal(state({...row,stageTwo:{...row.stageTwo,sourceDigest:'new'}},entry,true,true,frozen),'stale');
  assert.equal(state({...row,stageTwo:{status:'未实现'}},entry,true,true,frozen),'unimplemented');
  assert.equal(state({...row,stageTwo:undefined},entry,true,true,frozen),'pending');
  assert.equal(acceptedSpecies({...result,status:'rejected'},index.fingerprint).size,0);
  assert.equal(acceptedSpecies({...result,individual:result.individual.map(row=>row.id===4762?{...row,httpPassed:0}:row)},index.fingerprint).has(4762),false);
});

test('HTTP 对咤克斯返回六条正式验收，3030 的专项记录仍待正式验收',async t=>{
  const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  t.after(async()=>{if(server.exitCode===null){const exited=once(server,'exit');server.kill();await exited;}});
  const [output]=await once(server.stdout,'data');
  const origin=String(output).match(/Local: (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
  assert.ok(origin);
  async function notes(id){
    const response=await fetch(`${origin}/api/local/team-notes?id=${id}`);
    assert.equal(response.status,200);
    return response.json();
  }
  const certified=await notes(4762);
  assert.equal(certified.length,6);
  for(const note of certified){
    assert.equal(note.reviewState,'certified');
    assert.equal(note.displayStatus,'已通过正式验收');
    assert.equal(note.status,'队伍专项通过，待正式验收');
  }
  const pending=await notes(3030);
  assert.equal(pending.find(note=>note.key==='3030:skill:20664:0').displayStatus,'队伍专项通过，待正式验收');
});
