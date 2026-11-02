'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),api=require('../seerapi.cjs');
const records=require('./3626-source-check-external.json').records;
const record=r=>{const v=records.find(x=>x.url==='https://api.seerapi.com/v1/'+r);assert.ok(v,r);return v;},get=r=>record(r).data;
const old=require('../data/species/3626.json').snapshot,p=get('pet/3626'),s=structuredClone(old);assert.equal(p.hash,old.source.revision);
s.source.loadedAt=record('pet/3626').loadedAt;s.gender={...p.gender,source:{url:s.source.url,revision:p.hash}};
const elements=get('element_type?limit=30&expand=true'),names=Object.fromEntries(elements.results.map(x=>[x.id,x.name]));s.typeChart=api.buildChart(elements);
function typename(ref){const t=get('element_type_combination/'+ref.id),parts=[names[t.primary.id],...(t.secondary?[names[t.secondary.id]]:[])];s.typeChart.aliases[t.name]=parts;s.typeChart.aliases[t.name.replaceAll(' ','')]=parts;return t.name.replaceAll(' ','');}
s.type=typename(p.type);s.moves=p.skill.map(l=>api.convertMove(get('skill/'+l.skill.id),l,typename(get('skill/'+l.skill.id).type)));
s.effects=[...new Set(s.moves.flatMap(m=>m.effectIds))].map(id=>{const e=get('skill_effect_type/'+id);return {id:e.id,argsNum:e.args_num,template:e.info,revision:'seerapi:'+e.hash};});
s.souls=p.soulmark.map(ref=>{const r=get('soulmark/'+ref.id);return {id:r.id,description:r.desc,desc_formatting_adjustment:r.desc_formatting_adjustment,hash:r.hash,eid:r.effect.effect.id,args:r.effect.effect_args,isAdvanced:r.is_adv};});
assert.equal(p.advance,null);assert.ok(p.skill.every(l=>!l.is_advanced));assert.ok(p.skill.every(l=>get('skill/'+l.skill.id).friend_skill_effect.length===0));
fs.writeFileSync('research/3626-reviewed-snapshot.json',JSON.stringify(s,null,2)+'\n');
fs.writeFileSync('research/3626-source-manifest.json',JSON.stringify({species:3626,records:records.map(r=>({url:r.url,hash:r.data.hash,loadedAt:r.loadedAt,sha256:crypto.createHash('sha256').update(JSON.stringify(r.data)).digest('hex')})),sourceFile:'research/3626-source-check-external.json'},null,2)+'\n');
require('../local-species.cjs').save(s);
console.log({moves:s.moves.length,instances:s.moves.reduce((n,m)=>n+m.effectInstances.length,0),inventory:require('../completion-policy.cjs').inventory(s).length});
