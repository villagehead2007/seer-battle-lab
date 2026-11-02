'use strict';
// Browser mirror of the actual database, not a hand-maintained candidate list.
const fs=require('fs'),crypto=require('crypto');
const db=require('../data/statuses/statuses.json'),rules=require('../data/statuses/project-rules.json');
const audit=require('./status-system-audit.json');
const data={databaseHash:crypto.createHash('sha256').update(fs.readFileSync('data/statuses/statuses.json')).digest('hex'),
 records:db.records.map(({id,name})=>({id,name})),rules,
 effectPoolPolicies:Object.fromEntries(Object.entries(require('../data/random-pools/effects.json').effects).map(([id,row])=>[id,{status:row.status,candidatePool:row.candidatePool??null,distribution:row.distribution??null,duration:row.duration??null}])),
 durationPolicies:{睡眠:{...db.records.find(r=>r.name==='睡眠').durationReview,projectRule:{sourceType:'user_confirmed',confirmation:rules.durationCorrection,...rules.general.defaultDuration},effectScoped:[{effectId:2074,range:[rules.effect2074.duration.min,rules.effect2074.duration.max],distribution:'uniform',sourceType:'project_rule/user_confirmed'}],history:db.records.find(r=>r.name==='睡眠').durationReview}},
 behaviorGaps:Object.fromEntries(db.records.filter(r=>r.publicBehaviorReview?.pending.length).map(r=>[r.name,r.publicBehaviorReview.pending])),
 coverage:audit.records.map(r=>({id:r.id,name:r.name,status:r.observedBehavior.length?'existing-partial':'not-implemented'}))};
fs.writeFileSync('dist/status-catalog.js',"// Generated from data/statuses; regenerate with research/build-status-runtime-catalog.cjs.\n(function(root){const data="+JSON.stringify(data)+";if(typeof module==='object'&&module.exports)module.exports=data;else root.BattleStatusCatalog=data;})(globalThis);\n");
