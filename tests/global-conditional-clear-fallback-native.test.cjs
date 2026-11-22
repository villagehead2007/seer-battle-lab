'use strict';const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),inventory=require('../research/TEAM-STAGE-2/global-conditional-fallback-by-effect.json');
function frame(c){return structuredClone({aHp:c.a.hp,tHp:c.t.hp,aEffects:c.a.effects,tEffects:c.t.effects,aCounts:c.a.counts,tCounts:c.t.counts,tStages:c.t.stages});}
function verify(id){
 let successes=0;for(const key of inventory.find(x=>x.id===id).keys){const[pet,,move,index]=key.split(':'),a=E.WIKI.versionSnapshots(store.species(+pet)).find(s=>E.WIKI.availableMoves(s).some(m=>m.id===+move));assert.ok(a,key);for(const protect of [false,true]){const b=store.species(2989),stats={maxHp:9000,atk:100,spa:100,def:5000,spd:5000,spe:1000};let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[+move]),loadout(b,[])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});Object.assign(s.fighters[0].stages,{acc:6});s.fighters[0].counts.immune=50;s.fighters[1].counts.immune=50;Object.assign(s.fighters[1].stages,{atk:6,def:6,spa:6,spd:6,spe:6,acc:6});s.fighters[1].effects.免异常={start:1,end:5};if(protect)Object.assign(s.fighters[1].effects,{强化保护:{start:1,end:5},protect:{start:1,end:5}});const old=E.WIKI.effectsEngine,seen=[];E.WIKI.effectsEngine={...old,run(phase,ops,c){let result;for(const op of ops??[]){const watch=c.a.side===0&&c.m.wikiId===+move&&op.effectId===id&&op.index===+index&&op.phase===phase,clears=[],before=watch?frame(c):null,wrapped=watch?{...c,clear(...args){const out=c.clear(...args);clears.push(Boolean(out));return out;},clearBoost(...args){const out=c.clearBoost(...args);clears.push(Boolean(out));return out;}}:c;result=old.run(phase,[op],wrapped);if(watch)seen.push({before,after:frame(c),clears});}return result;}};try{s=E.resolveTurn(s,['wiki:'+move,'potion:pp']);}finally{E.WIKI.effectsEngine=old;}assert.ok(seen.length,key);const f=seen[0],ok=f.clears.some(Boolean);assert.ok(f.clears.length,key+'原执行确实尝试消除');if(protect)assert.equal(ok,false,key);if(ok)successes++;if(id===1978)assert.equal(f.before.tHp-f.after.tHp,ok?3000:0,key);if(id===2034){if(ok)assert.equal(f.after.aEffects.分类攻击减伤?.fraction,.5,key);else assert.deepEqual(f.after.aEffects.分类攻击减伤,f.before.aEffects.分类攻击减伤,key);}if(id===1370){if(ok)assert.ok(f.after.tEffects.技能禁疗,key);else assert.deepEqual(f.after.tEffects.技能禁疗,f.before.tEffects.技能禁疗,key);}if(id===1399)assert.equal(f.after.aCounts.immune-f.before.aCounts.immune,ok?1:0,key);if(id===2452)for(const k of Object.keys(f.before.tStages))assert.equal(f.after.tStages[k],f.before.tStages[k]-(ok?1:0),key+k);}}
 assert.ok(successes>0,id+'至少一个完整原招真实成功消除且控免失败');return successes;
}

test("全局条件补偿1978完整原魂原招：消除失败不发失败补偿，实际消除成功但控免才发补偿",()=>assert.ok(verify(1978)>0));

test("全局条件补偿2034完整原魂原招：消除失败不发失败补偿，实际消除成功但控免才发补偿",()=>assert.ok(verify(2034)>0));

test("全局条件补偿1370完整原魂原招：消除失败不发失败补偿，实际消除成功但控免才发补偿",()=>assert.ok(verify(1370)>0));

test("全局条件补偿1399完整原魂原招：消除失败不发失败补偿，实际消除成功但控免才发补偿",()=>assert.ok(verify(1399)>0));

test("全局条件补偿2452完整原魂原招：消除失败不发失败补偿，实际消除成功但控免才发补偿",()=>assert.ok(verify(2452)>0));
