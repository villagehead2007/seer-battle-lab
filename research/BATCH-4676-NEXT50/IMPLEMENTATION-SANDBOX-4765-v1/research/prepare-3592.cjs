'use strict';
const fs=require('fs'),crypto=require('crypto'),{inventory}=require('../completion-policy.cjs');
const s=require('../data/species/3592.json').snapshot,p=require('./seerapi-cache/3592/pet-3592.json');
const records=require('./3592-type-source-external.json').records,types=records.find(r=>r.data.results).data,combo=records.find(r=>r.data.id===35).data;
s.typeChart=require('../seerapi.cjs').buildChart(types);const names=Object.fromEntries(types.results.map(t=>[t.id,t.name]));s.typeChart.aliases[s.type]=s.typeChart.aliases[combo.name]=[names[combo.primary.id],names[combo.secondary.id]];
s.moves=s.moves.map(m=>require('../seerapi.cjs').convertMove(require('./seerapi-cache/3592/skill-'+m.id+'.json'),p.skill.find(x=>x.skill.id===m.id),m.type));
// Both freshly fetched resources confirm the fixed +1 clause and a zero-argument
// template. Keep the anomalous raw [1] separately and compile its exact canonical
// zero-argument form, as with the converter's other source normalization cases.
const legacy=s.moves.find(m=>m.id===30127),raw=require('./seerapi-cache/3592/skill-30127.json'),meta=require('./seerapi-cache/3592/skill_effect_type-954.json');
if(raw.hash!=='a9cc2c86'||meta.hash!=='45fecb70'||meta.args_num!==0||JSON.stringify(legacy.effectInstances[1].args)!=='[1]'||legacy.effectInstances[1].description!==meta.info)throw Error('954 source normalization no longer matches verified resources');
legacy.sourceEffectInstances=structuredClone(legacy.effectInstances);
legacy.parameterNormalization={effectId:954,instanceIndex:1,sourceArgs:[1],compiledArgs:[],skillHash:raw.hash,templateHash:meta.hash,reason:'来源模板为固定先制+1且args_num=0，实例冗余[1]原样保存；规范化为零参数指令，保留先制+1语义。'};
legacy.effectInstances[1].args=[];
fs.writeFileSync('research/3592-reviewed-snapshot.json',JSON.stringify(s,null,2)+'\n');
const items=inventory(s);const classifications=items.map(e=>({key:e.key,scope:e.kind==='soul'?'mixed':e.kind==='skill'&&e.raw.instance.id===883?'multiplayer':'single',description:e.kind==='soul'?e.raw.description:e.kind==='skill'?e.raw.instance.description:e.raw.description,reason:e.kind==='soul'?'仅击败后吸取下一只出场对手延期；满血先制、非满血增伤、未击败后必暴属于当前对战':e.kind==='skill'&&e.raw.instance.id===883?'原文明示对手下只出战精灵':'当前双方可触发；特殊追加技能冥之狂电为自身能力，单精灵实现'}));
fs.writeFileSync('research/3592-review-audit.json',JSON.stringify({species:3592,name:s.name,status:'source-reviewed-implementation-pending',source:s.source,inventory:items,classifications,pendingStateEvidence:items.filter(e=>classifications.find(x=>x.key===e.key).scope!=='multiplayer').map(e=>e.key)},null,2)+'\n');
fs.writeFileSync('research/3592-source-manifest.json',JSON.stringify({species:3592,createdAt:new Date().toISOString(),snapshotLoadedAt:s.source.loadedAt,sourceChecks:['research/3592-source-check.json','research/3592-source-check-external.json','research/3592-type-source-external.json'],records:fs.readdirSync('research/seerapi-cache/3592').map(n=>{const file='research/seerapi-cache/3592/'+n,t=fs.readFileSync(file),r=JSON.parse(t);return {file,url:'https://api.seerapi.com/v1/'+n.replace(/-(\d+)\.json$/,'/$1'),revision:r.hash,sha256:crypto.createHash('sha256').update(t).digest('hex')};})},null,2)+'\n');
console.log(s.name,items.length,classifications.filter(x=>x.scope!=='single'));
