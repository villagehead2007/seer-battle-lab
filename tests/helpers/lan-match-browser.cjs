'use strict';
const assert=require('node:assert/strict');
module.exports=async function matchControls({a,b,member,lock,state}){
  const both=[a,b],button=(p,name)=>p.getByRole('button',{name,exact:true});
  const heading=(p,name)=>p.getByRole('heading',{name,level:2,exact:true});
  const awaitBoth=fn=>Promise.all(both.map(fn));
  const round=n=>awaitBoth(p=>heading(p,'第 '+n+' 回合').waitFor());
  const ready=()=>awaitBoth(p=>button(p,'准备开战').click());
  async function request(p,op,t,extra={}){
    return p.evaluate(async data=>(await fetch('/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})).status,
      {op,matchId:t.matchId,epoch:t.epoch,...extra});
  }
  async function ended(winner){
    await awaitBoth(p=>heading(p,'AB'[winner]+' 方获胜').waitFor());
    await b.getByText('等待房主选择下一局').waitFor();
    for(const name of ['快速重开','返回队伍选择'])assert.equal(await button(b,name).count(),0);
  }
  async function lobby(){
    await button(a,'返回队伍选择').click();
    await awaitBoth(p=>heading(p,'队伍与首发').waitFor());
    for(const p of both){const s=await state(p);assert.deepEqual(s.ready,[false,false]);assert.deepEqual(s.locked,[false,false]);}
  }
  await member(a,0,2988,{atk:9999,spe:9999,maxHp:9999});await member(b,1,2988,{def:1,spe:1,maxHp:10});
  await ready();await round(1);
  const first=await state(a);
  for(const action of ['快速重开','返回队伍选择']){
    await lock(b,'potion:hp');await lock(a,'wiki:19123');await ended(0);
    const finished=await state(a);
    assert.equal(await request(b,'rematch',finished),400);assert.equal(await request(b,'lobby',finished),400);
    if(action==='快速重开'){
      await button(a,action).click();await round(1);
      const fresh=await state(b);assert.equal(fresh.matchId,first.matchId+1);assert.equal(fresh.side,1);
      assert.deepEqual(fresh.fighters,first.fighters);assert.deepEqual(fresh.history,first.history);
      assert.deepEqual((await state(a)).panels[0].skills,first.panels[0].skills);
      assert.equal(await request(a,'rematch',finished),400);
      assert.equal(await request(a,'lock',first,{target:null,key:'wiki:19123'}),400);
    }else await lobby();
  }
  await button(b,'移除').click();await member(b,1,2988,{maxHp:9000});await ready();
  for(const quitter of [b,a]){
    for(let n=1;n<=10;n++){
      await round(n);
      if(n===10){
        for(const p of both)assert.equal(await button(p,'投降').count(),0);
        assert.equal(await request(quitter,'surrender',await state(quitter),{round:11}),400);
      }
      await awaitBoth(p=>lock(p,'potion:pp'));
    }
    await round(11);
    const ticket=await state(quitter),other=quitter===a?b:a;
    await lock(other,'potion:hp');
    quitter.once('dialog',dialog=>dialog.accept());await button(quitter,'投降').click();
    await ended(quitter===a?1:0);
    const result=await state(other);assert.equal(result.round,11);assert.deepEqual(result.locked,[false,false]);
    assert.equal(result.finishReason,quitter===a?'A 方投降':'B 方投降');
    await awaitBoth(p=>p.locator('.team-actions').getByText(result.finishReason,{exact:true}).waitFor());
    assert.deepEqual(result.history,(await state(quitter)).history);
    assert.equal(await request(other,'surrender',ticket),400);
    if(quitter===b){
      await b.context().setOffline(true);await b.getByText(/连接中断/).waitFor();
      await button(a,'快速重开').click();await heading(a,'第 1 回合').waitFor();
      await b.context().setOffline(false);await b.reload();await round(1);
      assert.equal((await state(b)).side,1);assert.equal((await state(b)).finishReason,null);
    }else await lobby();
  }
  await ready();await round(1);
  for(let n=1;n<=10;n++){
    const t=await state(a);assert.equal(t.round,n);
    const statuses=await awaitBoth(p=>request(p,'lock',t,{key:'potion:pp',target:null}));
    assert.deepEqual(statuses,[200,200]);
  }
  const concurrent=await state(a);
  const statuses=await awaitBoth(p=>request(p,'surrender',concurrent));
  assert.deepEqual([...statuses].sort(),[200,400]);
  const won=statuses[0]===200?1:0;await ended(won);
  const terminal=await state(a);
  assert.equal(terminal.history.filter(row=>row.includes('方投降')).length,1);
  assert.equal(terminal.epoch,concurrent.epoch+1);
  const transitions=await Promise.all(['rematch','lobby'].map(op=>request(a,op,terminal)));
  assert.deepEqual([...transitions].sort(),[200,400]);
  console.log('Passed both natural-end controls, both surrender directions, rounds 10/11, authorization, stale retries, fresh HP/PP, same seats and offline rematch recovery.');
};
