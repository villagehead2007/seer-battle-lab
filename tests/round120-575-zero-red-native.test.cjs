'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),L=require('../local-species.cjs'),P=require('../completion-policy.cjs'),{loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round120-conditional-native-input-20261113.json');
test('575两原特殊必命中实际零红有效命中不吸血，完整原魂战末回复与附固不混入技能回复',()=>{
 for(const row of rows.filter(r=>r.effect===575)){
  const source=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest),enemy=L.species(3056),stats={maxHp:9999,atk:180,spa:360,def:4000,spd:4000,spe:100};assert.ok(source);const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[loadout(source,[row.move]),loadout(enemy,[10127])],builds:[{overrides:{...stats,maxHp:9000,spe:9999}},{overrides:stats}],seed:14,criticals:false});s.fighters[0].hp=8000;s.fighters[1].ailments['失明']=3;s.fighters[1].effects['攻击伤害免疫']={start:1,end:3};
  const old=E.WIKI.effectsEngine,frames={};E.WIKI.effectsEngine={...old,run(phase,ops,c){const hp=c.a.hp,result=old.run(phase,ops,c);if(c.a.side===0&&(c.m.wikiId??c.m.id)===row.move)frames[phase]={before:hp,after:c.a.hp};return result;}};let out;try{out=E.resolveTurn(s,['wiki:'+row.move,'potion:pp']);}finally{E.WIKI.effectsEngine=old;}
  assert.equal(out.fighters[0].pp['wiki:'+row.move],s.moveDefinitions['wiki:'+row.move].pp-1);assert.ok(frames.afterHit);assert.ok(frames.afterAttack);assert.deepEqual(frames.afterAttack,{before:8000,after:8000});assert.equal((out.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0).reduce((n,e)=>n+e.settledDamage,0),0);assert.equal(out.fighters[0].soulId,758);
 }
});
