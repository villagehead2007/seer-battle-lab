const {test}=require('node:test');
const assert=require('node:assert/strict');
const store=require('../local-species.cjs');
const E=require('../dist/engine.js');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const path=require('node:path');
const request=require('../dist/wiki-request.js');

const ids=[...new Set([3575,3576,3577,3613,...(process.env.SEER_INTEGRATION_ID?[Number(process.env.SEER_INTEGRATION_ID)]:[])])];

test('本地阶段完成精灵经浏览器请求客户端和HTTP搜索加载，全部技能可注入单挑',async t=>{
  const server=spawn(process.execPath,['server.cjs'],{
    cwd:path.join(__dirname,'..'),env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']
  });
  t.after(async()=>{if(server.exitCode===null){const exited=once(server,'exit');server.kill();await exited;}});
  const origin=await new Promise((resolve,reject)=>{
    let output='';
    const timer=setTimeout(()=>reject(Error('本地测试服务启动超时')),10000);
    server.once('error',error=>{clearTimeout(timer);reject(error);});
    server.once('exit',code=>{clearTimeout(timer);reject(Error('本地测试服务提前退出 '+code));});
    server.stdout.on('data',chunk=>{output+=chunk;const match=output.match(/Local: (http:\/\/127\.0\.0\.1:\d+)/);if(match){clearTimeout(timer);resolve(match[1]);}});
  });
  const local=(route,params)=>request('local',route,params,{
    fetchImpl:(url,options)=>fetch(new URL(url,origin),options),timeout:10000
  });
  const snapshots=[];
  for(const id of ids){
    const search=await local('search',{q:String(id)});
    assert.equal(search.results.length,1,`${id} 未出现在游戏本地搜索结果中`);
    assert.equal(search.results[0].id,id);
    const snapshot=await local('species',{id:search.results[0].id});
    assert.deepEqual(snapshot,store.species(id),`${id} HTTP接口与正式本地库不一致`);
    assert.equal(search.results[0].name,snapshot.name);
    snapshots.push(snapshot);
  }
  for(const snapshot of snapshots){
    assert.equal(snapshot.source.storage,'local',`${snapshot.id} 未标记为本地资料`);
    assert.equal(snapshot.deployment?.scope,'single',`${snapshot.id} 缺少单精灵部署记录`);
    const loadout=E.WIKI.defaultMoves(snapshot);
    assert.equal(E.WIKI.assess(snapshot,loadout).supported,true,`${snapshot.id} 本地配招不能通过游戏适配检查`);
    assert.ok(loadout.length>=4,`${snapshot.id} 没有可加载的技能列表`);
  }
  // Keep initialization PP assertions independent of the rotating target's entry effects.
  // Every target/version is still the real actor; 3575/3576 are stable local counterparts.
  for(let i=0;i<snapshots.length;i++){
    const snapshot=snapshots[i],b=snapshots[i===0?1:0],visited=new Set();
    for(const a of E.WIKI.versionSnapshots(snapshot)){
    const loadouts=[E.WIKI.defaultMoves(a),E.WIKI.defaultMoves(b)];
    const prepared=E.WIKI.prepare([a,b],loadouts);
    assert.equal(prepared.length,2,`${a.id}/${b.id} 未生成战斗配对`);
    const battle=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:loadouts,criticals:false});
    assert.equal(battle.fighters.length,2,`${a.id}/${b.id} 未初始化双方精灵`);
    assert.ok(battle.fighters.every(f=>f.moves.length===loadouts[f.side].length),`${a.id}/${b.id} 技能未注入战斗`);
    for(const fighter of battle.fighters){
      assert.equal(Number(fighter.number),[a,b][fighter.side].id);
      assert.deepEqual(fighter.moves.map(key=>E.MOVES[key].wikiId),loadouts[fighter.side]);
    }
    // 默认配招只覆盖部分技能；逐招换入验证完整技能列表的可选性和资源初始化。
    for(const move of E.WIKI.availableMoves(a)){
      visited.add(move.id);
      const selected=loadouts[0].slice();
      if(!selected.includes(move.id)){
        const slot=selected.findIndex(id=>Boolean(a.moves.find(m=>m.id===id).fifth)===Boolean(move.fifth));
        assert.ok(slot>=0,'必须在同类技能位替换，保留恰好一个第五技能');
        selected[slot]=move.id;
      }
      const state=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[selected,loadouts[1]],criticals:false});
      const fighter=state.fighters[0],key=fighter.moves.find(key=>E.MOVES[key].wikiId===move.id);
      assert.ok(key,`${a.id} 技能 ${move.id} 未进入战斗`);
      assert.equal(E.MOVES[key].name,move.name);
      assert.equal(E.MOVES[key].pp,move.pp);
      assert.equal(fighter.pp[key],move.pp,`${a.id} 技能 ${move.id} 初始PP错误`);
    }
    }
    assert.deepEqual([...visited].sort((a,b)=>a-b),snapshot.moves.map(m=>m.id).sort((a,b)=>a-b),'分版本接入仍须覆盖全部来源技能');
  }
});
