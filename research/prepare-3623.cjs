'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const records=require('./3623-source-check-external.json').records;
const get=resource=>{const r=records.find(x=>x.url==='https://api.seerapi.com/v1/'+resource);if(!r)throw Error('Missing refreshed source '+resource);return r.data;};
const old=require('../data/species/3623.json').snapshot,p=get('pet/3623'),s=structuredClone(old);
assert.equal(p.hash,old.source.revision);
s.source={...old.source,loadedAt:records.find(x=>x.data===p).loadedAt};
const elements=get('element_type?limit=30&expand=true'),names=Object.fromEntries(elements.results.map(x=>[x.id,x.name]));s.typeChart=require('../seerapi.cjs').buildChart(elements);
function typename(ref){const t=get('element_type_combination/'+ref.id),parts=[names[t.primary.id],...(t.secondary?[names[t.secondary.id]]:[])];s.typeChart.aliases[t.name]=parts;s.typeChart.aliases[t.name.replaceAll(' ','')]=parts;return t.name.replaceAll(' ','');}
s.type=typename(p.type);s.gender={...p.gender,source:{url:s.source.url,revision:p.hash}};
s.moves=p.skill.map(learn=>({...require('../seerapi.cjs').convertMove(get('skill/'+learn.skill.id),learn,typename(get('skill/'+learn.skill.id).type)),advanced:learn.is_advanced}));
s.effects=[...new Set(s.moves.flatMap(m=>m.effectIds))].map(id=>{const e=get('skill_effect_type/'+id);return {id:e.id,argsNum:e.args_num,template:e.info,revision:'seerapi:'+e.hash};});
// The exact current source duplicates the same 80 argument while its template
// has one placeholder/argument. Retain both raw values and the pinned evidence.
const m=s.moves.find(x=>x.id===32102),e=m.effectInstances.find(x=>x.id===628);
assert.equal(m.hash,'228b041e');assert.equal(get('skill_effect_type/628').hash,'f349d714');assert.deepEqual(e.args,[80,80]);assert.equal(e.description,'若对手处于能力下降状态则造成伤害的80%恢复体力');
m.sourceEffectInstances=structuredClone(m.effectInstances);m.parameterNormalization={effectId:628,sourceArgs:[80,80],args:[80],skillHash:m.hash,effectHash:'f349d714',reason:'同版本模板args_num=1且原文只包含80%回复比例；原始重复参数完整保存在sourceEffectInstances'};e.args=[80];
const adv=get('pet_advance/22'),advRecord=records.find(x=>x.data===adv);s.advance={id:adv.id,hash:adv.hash,source:{url:advRecord.url,loadedAt:advRecord.loadedAt},raw:adv};
s.souls=p.soulmark.map(ref=>{const r=get('soulmark/'+ref.id);return {id:r.id,description:r.desc,desc_formatting_adjustment:r.desc_formatting_adjustment,hash:r.hash,eid:r.effect.effect.id,args:r.effect.effect_args,isAdvanced:r.is_adv,...(r.is_adv?{base:Object.fromEntries(Object.entries({maxHp:'hp',atk:'atk',def:'def',spa:'sp_atk',spd:'sp_def',spe:'spd'}).map(([k,v])=>[k,adv.base_stats[v]]))}:{})};});
s.skillVersions=['original','awakened'].map(id=>{const awakened=id==='awakened',soul=s.souls.find(x=>x.isAdvanced===awakened);return {id,soulId:soul.id,soulHash:soul.hash,source:awakened?{url:advRecord.url,revision:adv.hash}:{url:s.source.url,revision:s.source.revision},moveIds:s.moves.filter(m=>awakened?m.advanced||!m.fifth:!m.advanced).map(m=>m.id)};});
// 129 needs the opponent's sex, absent in historical deployment schemas.
// Preserve provenance here instead of rewriting already completed species.
const rawPets=new Map();for(const name of fs.readdirSync('research').filter(n=>/^(selected-|range-).*\.json$/.test(n))){const d=JSON.parse(fs.readFileSync('research/'+name));for(const pet of Object.values(d.pet??{}))if(pet.gender)rawPets.set(pet.id,{pet,file:'research/'+name});}
for(const dir of fs.readdirSync('research/seerapi-cache')){const file=`research/seerapi-cache/${dir}/pet-${dir}.json`;if(fs.existsSync(file)){const pet=JSON.parse(fs.readFileSync(file));if(pet.gender)rawPets.set(pet.id,{pet,file});}}
s.targetGenderSources={};const missing=[];for(const file of fs.readdirSync('data/species').filter(n=>/^\d+\.json$/.test(n))){const target=JSON.parse(fs.readFileSync('data/species/'+file)).snapshot,raw=rawPets.get(target.id);if(raw?.pet.hash===target.source.revision)s.targetGenderSources[target.id]={genderId:raw.pet.gender.id,url:'https://api.seerapi.com/v1/pet/'+target.id,revision:raw.pet.hash,cache:raw.file};else missing.push(target.id);}
fs.writeFileSync('research/3623-reviewed-snapshot.json',JSON.stringify(s,null,2)+'\n');
const inventory=require('../completion-policy.cjs').inventory(s);
fs.writeFileSync('research/3623-review-audit.json',JSON.stringify({species:3623,status:'implementation-awaiting-state-verification',source:s.source,inventory,classifications:inventory.map(e=>({key:e.key,scope:'single',rationale:e.kind==='soul'?'两个真实魂印均只依赖当前双方的体力、选招、使用技能及技能有效性；觉醒版本保留独立种族值和技能组。':e.kind==='move'?'当前精灵真实技能基础行为；觉醒四招不是队伍依赖。':e.raw.instance.description})),soulTimingDecision:'917按desc明确的回合开始与当回合选招触发；保存格式化描述但不把“使用攻击技能”简写擅自改成行动时机。1863按使用技能时触发。',normalization:m.parameterNormalization,targetGenderMissing:missing},null,2)+'\n');
fs.writeFileSync('research/3623-source-manifest.json',JSON.stringify({species:3623,records:records.map(r=>({url:r.url,hash:r.data.hash,loadedAt:r.loadedAt,sha256:crypto.createHash('sha256').update(JSON.stringify(r.data)).digest('hex')})),sourceFile:'research/3623-source-check-external.json'},null,2)+'\n');
console.log({moves:s.moves.length,instances:s.moves.reduce((n,m)=>n+m.effectInstances.length,0),inventory:inventory.length,targetGenderMissing:missing});
