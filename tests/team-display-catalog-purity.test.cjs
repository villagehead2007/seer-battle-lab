'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
function member(snapshot){return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
test('全部已绑定本地魂印版本的双方初始专属状态展示不改战斗状态或随机序列',()=>{
 const rows=[],failures=[];
 for(const file of fs.readdirSync(path.join(__dirname,'../data/species')).filter(n=>/^\d+\.json$/.test(n))){
  const source=store.species(Number(file.slice(0,-5))),versions=E.WIKI.versionSnapshots(source);
  for(const soul of source.souls){
   const variants=versions.filter(v=>v.selectedSoulId===soul.id);
   for(const snapshot of variants.length?variants:[{...source,selectedSoulId:soul.id}]){
   const row={species:source.id,name:source.name,soul:soul.id,sourceHash:soul.hash,loadout:E.WIKI.defaultMoves(snapshot)};rows.push(row);
   if(!E.SOULS.acceptsSource(soul.id,soul.hash)){row.status='来源版本未绑定，不计为已实现展示验证';continue;}
   try{
    const bench=member(store.species(source.id===3056?2988:3056));
    const g=T.create([[member(snapshot),bench],[member(snapshot),bench]],[0,0],{seed:13,criticals:false});
    const before=hash(g),labels=[];
    for(let pass=0;pass<2;pass++)for(const side of [0,1]){
     const fighter=D.fighter(g.battle.fighters[side],g.battle.round),team=D.team(g,side);
     if(pass===0)labels.push({side,items:fighter.items,group:fighter.group,companions:fighter.companions,team});
    }
    const after=hash(g);row.before=before;row.after=after;row.initialDisplay=labels;
    assert.equal(after,before,`${source.id}/${soul.id}展示改变状态`);
    row.status='双方初始展示只读通过';
   }catch(error){row.status='失败';row.error=error.message;failures.push({species:source.id,soul:soul.id,error:error.message});}
   }
  }
 }
 const counts=rows.reduce((a,r)=>(a[r.status]=(a[r.status]??0)+1,a),{});
 fs.writeFileSync(path.join(__dirname,'../research/TEAM-STAGE-2/initial-display-purity.json'),JSON.stringify({scope:'本地图鉴真实来源绑定版本，仅初始状态；不替代各机制增减/消耗/到期/切换/复活显示验证。',counts,failures,rows},null,2)+'\n');
 assert.deepEqual(failures,[]);
 assert.ok(rows.filter(r=>r.status==='双方初始展示只读通过').length>=525);
});
