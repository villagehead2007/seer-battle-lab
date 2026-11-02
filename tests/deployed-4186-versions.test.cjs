'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),source=require('../research/4186-answered-snapshot.json');
test('4186授权四组合逐版本真实基础值、技能列表、配招与全部真实技能用招执行',()=>{
 const versions=E.WIKI.versionSnapshots(source);assert.equal(versions.length,4);const visited=new Set();
 for(const s of versions){
  assert.deepEqual(E.WIKI.skillVersionIssues(s,true),[]);const g=s.skillVersions.find(x=>x.id===s.selectedSkillVersion);assert.equal(g.moveIds.filter(id=>s.moves.find(m=>m.id===id).fifth).length,1);
  for(const id of g.moveIds){
   const load=[g.fifthId,id,...g.moveIds.filter(x=>x!==g.fifthId&&x!==id)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);assert.equal(E.WIKI.assess(s,load).supported,true);
   const state=E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[load,load],criticals:false,builds:[{overrides:{maxHp:9000}},{overrides:{maxHp:9000}}]});const f=state.fighters[0],m=s.moves.find(x=>x.id===id),key='wiki:'+id;
   assert.equal(f.soulId,g.soulId);assert.deepEqual(E.SPECIES[f.species].base,g.soulId===2028?s.souls.find(x=>x.id===2028).base:s.base);assert.deepEqual(f.moves,load.map(x=>'wiki:'+x));assert.equal(f.pp[key],m.pp);
   // Empty opposing PP prevents unrelated absorption from restoring this move's just-spent PP.
   for(const k of state.fighters[1].moves)state.fighters[1].pp[k]=0;
   const o=E.resolveTurn(state,[key,'potion:hp']);assert.ok(o.fighters[0].pp[key]<m.pp,id+'实际用招PP');assert.equal(o.fighters[0].previousMoveId,key);assert.ok(o.turns[0].events.some(e=>e.kind==='move'&&e.text.includes(m.name)));visited.add(id);
  }
  const wrong=[34900,37295,...g.moveIds.filter(id=>!s.moves.find(m=>m.id===id).fifth).slice(0,3)];assert.equal(E.WIKI.assess(s,wrong).supported,false);
 }
 assert.equal(visited.size,27);assert.equal(source.advance.raw.skill.at(-1).id,0);assert.equal(source.moves.some(x=>x.id===0),false);
});
test('4186精确兼容不接受错误ID/hash/来源/原始0/实例参数/标记/漏招/混装或授权扩大',()=>{
 const changes=[s=>s.id=4187,s=>s.source.revision='bad',s=>s.source.url='https://api.seerapi.com/v1/pet/4187',s=>s.advance.hash='bad',s=>s.advance.raw.hash='bad',s=>s.advance.raw.skill.pop(),s=>s.advance.raw.skill.at(-1).id=34900,s=>s.souls[0].hash='bad',s=>s.souls[1].isAdvanced=false,s=>s.souls[1].base.maxHp++,s=>s.base.atk++,s=>s.moves[0].hash='bad',s=>s.moves[0].revision='seerapi:bad',s=>s.moves.find(m=>m.effectInstances.length).effectInstances[0].args.push(999),s=>s.moves.find(m=>m.id===37295).fifth=false,s=>s.moves.find(m=>m.id===29187).advanced=false,s=>s.moves.pop(),s=>s.moves.push(s.moves[0]),s=>s.versionCompatibility.questionId='other',s=>s.versionCompatibility.petHash='bad',s=>s.skillVersions.pop(),s=>s.skillVersions[1]=s.skillVersions[0],s=>s.skillVersions[0].soulHash='bad',s=>s.skillVersions[0].source.revision='bad',s=>s.skillVersions[0].fifthId=0,s=>s.skillVersions[0].moveIds.pop(),s=>s.skillVersions[0].moveIds.push(37295),s=>s.skillVersions[0].moveIds.push(29187),s=>s.selectedSkillVersion='unknown',s=>{s.selectedSkillVersion='original:34900';s.selectedSoulId=2028;}];
 for(const change of changes){const s=structuredClone(source);change(s);assert.ok(E.WIKI.skillVersionIssues(s,true).length>0,change.toString());}
 const missing=structuredClone(source);delete missing.versionCompatibility;assert.ok(E.WIKI.skillVersionIssues(missing,true).length);const old=structuredClone(require('../research/4186-reviewed-snapshot.json'));assert.ok(E.WIKI.skillVersionIssues(old,true).length);
});
