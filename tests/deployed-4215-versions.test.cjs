'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),source=require('../research/4215-reviewed-snapshot.json');
test('4215两个真实第五版本逐一配招、初始化及29招实际执行保持原始来源',()=>{
 const versions=E.WIKI.versionSnapshots(source),visited=new Set();assert.equal(versions.length,2);
 for(const s of versions){const g=s.skillVersions.find(x=>x.id===s.selectedSkillVersion);assert.deepEqual(E.WIKI.skillVersionIssues(s,true),[]);assert.equal(g.moveIds.length,28);
  for(const id of g.moveIds){const load=[g.fifthId,id,...g.moveIds.filter(x=>x!==g.fifthId&&x!==id)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);assert.equal(E.WIKI.assess(s,load).supported,true);
   const state=E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[load,load],criticals:false,builds:[{overrides:{maxHp:9000}},{overrides:{maxHp:9000}}]}),m=s.moves.find(x=>x.id===id),key='wiki:'+id;
   assert.equal(state.fighters[0].soulId,1433);assert.deepEqual(state.fighters[0].moves,load.map(x=>'wiki:'+x));assert.equal(state.fighters[0].pp[key],m.pp);
   const o=E.resolveTurn(state,[key,'potion:hp']);assert.equal(o.fighters[0].pp[key],m.pp-1);assert.equal(o.fighters[0].previousMoveId,key);assert.ok(o.turns[0].events.some(e=>e.kind==='move'&&e.text.includes(m.name)));visited.add(id);
  }
  assert.equal(E.WIKI.assess(s,[35050,37966,...g.moveIds.filter(id=>!s.moves.find(m=>m.id===id).fifth).slice(0,3)]).supported,false);
 }
 assert.equal(visited.size,29);assert.equal(source.source.revision,'6cc578dc');assert.equal(source.moves.find(m=>m.id===37966).hash,'3004631a');
});
test('4215普通来源登记仍拒绝错误来源版本、漏招及双第五混装',()=>{
 for(const change of [s=>s.source.revision='bad',s=>s.souls[0].hash='bad',s=>s.moves.pop(),s=>s.skillVersions[0].moveIds.push(37966),s=>s.skillVersions[0].fifthId=37966]){const s=structuredClone(source);change(s);assert.ok(E.WIKI.skillVersionIssues(s,true).length>0,change.toString());}
});
