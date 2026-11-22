'use strict';
const assert=require('node:assert/strict'),E=require('../../dist/engine.js'),store=require('../../local-species.cjs'),{loadout}=require('./3001-native.cjs'),bindings=require('../../research/TEAM-STAGE-2/forced-first-rank-audit.json').sourceBindings;
const timerIds=[694,823,777,1310,801,827,1817];
function setup(row,enabled=true){const id=Number(row.key.split(':')[0]),raw=store.species(id),wantedKind=row.effectId===694?'physical':'status';
 const source=E.WIKI.versionSnapshots(raw).find(v=>v.moves.some(m=>m.id===row.moveId)&&E.WIKI.assess(v,loadout(v,[row.moveId])).supported);assert.ok(source,'actual legal version '+row.key);
 const next=source.moves.find(m=>m.id!==row.moveId&&m.kind===wantedKind&&m.priority===0&&!m.effectInstances.some(e=>Object.hasOwn(E.FIRST_ORDER.effectRanks,e.id)))??source.moves.find(m=>m.id!==row.moveId&&(row.effectId===694?['physical','special'].includes(m.kind):m.kind==='status'));
 assert.ok(next,'native followup '+row.key);const enemy=store.species(2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1};
 const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[loadout(source,[row.moveId,next.id]),loadout(enemy,[10086])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:4000}}]});
 if(enabled&&[777,801,827,1310].includes(row.effectId))s.fighters[1].stages.atk=id===3670?2:1;
 if(enabled&&row.effectId===1817)s.fighters[1].effects['攻击必中']={start:1,end:5};
 if(id===3577)s.fighters[1].effects['致命保留']={start:1,end:8,hp:1};
 return {s,source,next};
}
function verify(key){const row=bindings.find(x=>x.key===key);assert.ok(row);assert.ok(timerIds.includes(row.effectId));let {s,source,next}=setup(row);const raw=source.moves.find(m=>m.id===row.moveId);assert.equal(raw.revision,row.moveRevision);assert.deepEqual(raw.effectInstances[row.index].args,row.args);
 s=E.resolveTurn(s,['wiki:'+row.moveId,'potion:pp']);const move=s.moveDefinitions['wiki:'+next.id],sources=E.FIRST_ORDER.candidates(s.fighters[0],move,s.round).filter(x=>x.namespace==='skill-effect'&&x.id===row.effectId);assert.equal(sources.length,1,row.key+' exact source grant');assert.equal(sources[0].rank,row.rank);assert.equal(sources[0].moveId,row.moveId);
 if(row.effectId===694){const status=source.moves.find(m=>m.kind==='status');if(status)assert.equal(E.FIRST_ORDER.candidates(s.fighters[0],s.moveDefinitions['wiki:'+status.id]??status,s.round).filter(x=>x.id===694).length,0,'694 attack scope');}
 s=E.resolveTurn(s,['wiki:'+next.id,'wiki:10086']);assert.equal(s.turns.at(-1).first,0,row.key+' forced-first beats faster opponent');assert.ok(s.firstOrderComparisons.at(-1).candidates[0].some(x=>x.id===row.effectId&&x.rank===row.rank));
 const end=sources[0].end;while(!s.finished&&s.round<=end)s=E.resolveTurn(s,['potion:pp','potion:pp']);assert.ok(s.round>end);assert.equal(E.FIRST_ORDER.candidates(s.fighters[0],move,s.round).filter(x=>x.id===row.effectId).length,0,row.key+' expires');
 if([777,801,827,1310,1817].includes(row.effectId)){let q=setup(row,false).s;q=E.resolveTurn(q,['wiki:'+row.moveId,'potion:pp']);assert.equal(E.FIRST_ORDER.candidates(q.fighters[0],q.moveDefinitions['wiki:'+next.id],q.round).filter(x=>x.id===row.effectId).length,0,row.key+' false condition does not grant');}
 return {rank:row.rank,expectedRank:row.rank,sourceKey:key};
}
function conditional(key){const row=bindings.find(x=>x.key===key),threshold={1251:200,1634:250,1412:300}[row.effectId];assert.ok(threshold);const observations=[];for(const enabled of [false,true]){let {s}=setup(row);s.fighters[0].hp=threshold-(enabled?1:0);s=E.resolveTurn(s,['wiki:'+row.moveId,'wiki:10086']);const candidate=s.firstOrderComparisons[0].candidates[0].find(x=>x.id===row.effectId);assert.equal(!!candidate,enabled,key+' strict threshold');if(enabled){assert.equal(candidate.rank,row.rank);assert.equal(s.turns[0].first,0,key+' conditional first');}observations.push({enabled,granted:!!candidate});}return observations;}
module.exports={verify,conditional,timerIds,setup};
