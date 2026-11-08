'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const E=require('../../dist/engine.js'),{convertMove,buildChart}=require('../../seerapi.cjs');
const sources=require('./sources.json'),wiki=require('./wiki-sources.json');
function raw(kind,id){const record=sources.records.find(x=>x.url===`https://api.seerapi.com/v1/${kind}/${id}`);if(!record)throw Error('Missing '+kind+'/'+id);return record.data;}
const chart=buildChart(sources.records.find(x=>x.url.endsWith('/element_type/?limit=30&expand=true')).data);
const names=Object.keys(chart.rows);
function typename(id){const t=raw('element_type_combination',id),elements=sources.records.find(x=>x.url.includes('/element_type/?')).data.results;chart.aliases[t.name]=[t.primary.id,t.secondary?.id].filter(Boolean).map(id=>elements.find(x=>x.id===id).name);return t.name;}
function moves(learns){return learns.map(l=>{const m=raw('skill',l.skill.id);return {...convertMove(m,l,typename(m.type.id),{deferTeamEffects:true}),advanced:l.is_advanced===true};});}
function effects(ms){return [...new Set(ms.flatMap(m=>m.effectIds))].map(id=>{const e=raw('skill_effect_type',id);return{id,argsNum:e.args_num,template:e.info,revision:'seerapi:'+e.hash};});}
function soul(id){const s=raw('soulmark',id);return {id:s.id,description:s.desc,hash:s.hash,eid:s.effect?.effect.id,args:s.effect?.effect_args};}
const p=raw('pet',3311),a=raw('pet_advance',10001),old=require('./original-3311.json').snapshot;
const training={...structuredClone(old),moves:moves(p.skill),souls:[soul(638)],source:{provider:'seerapi',url:'https://api.seerapi.com/v1/pet/3311',revision:p.hash,loadedAt:sources.records.find(x=>x.url.endsWith('/pet/3311')).loadedAt},training:{raw:a,source:{url:'https://api.seerapi.com/v1/pet_advance/10001',revision:a.hash}},historicalSource:{file:'original-3311.json',revision:old.source.revision,soulHashes:old.souls.map(x=>x.hash)},status:'pending-implementation'};
delete training.deployment;training.effects=effects(training.moves);training.typeChart=chart;
const base=x=>({maxHp:x.hp,atk:x.atk,def:x.def,spa:x.sp_atk,spd:x.sp_def,spe:x.spd});
training.trainingCompatibility={rawPet:p,advance:a,advanceSource:{url:'https://api.seerapi.com/v1/pet_advance/10001',revision:a.hash}};
training.skillVersions=[{id:'original',soulId:638,soulHash:soul(638).hash,base:base(p.base_stats),moveIds:training.moves.filter(m=>!m.advanced).map(m=>m.id),source:{url:training.source.url,revision:training.source.revision}},{id:'trained',soulId:638,soulHash:soul(638).hash,base:base(a.base_stats),moveIds:training.moves.filter(m=>m.advanced||!m.fifth).map(m=>m.id),source:training.trainingCompatibility.advanceSource}];
training.base=base(a.base_stats);training.selectedSkillVersion='trained';
const page=Object.values(wiki.records[0].data.query.pages).find(x=>x.title==='精灵:13311'),revision=page.revisions[0],text=revision.slots.main['*'];
function field(name){return text.match(new RegExp('\\|'+name+'=([^\\n]*)'))?.[1];}
const learns=field('技能').split(';').map(x=>{const[id,level,fifth]=x.split('-');return{skill:{id:Number(id)},learning_level:Number(level),is_fifth:fifth==='第五',is_special:false,is_advanced:false};});
const sp={id:Number(field('ID')),name:field('名称'),type:typename(65),base:Object.fromEntries(Object.entries({maxHp:'体力',atk:'攻击',def:'防御',spa:'特攻',spd:'特防',spe:'速度'}).map(([k,v])=>[k,Number(field(v))])),moves:moves(learns),souls:[soul(2162)],missingEffects:[],typeChart:chart,source:{provider:'composite',url:'https://wiki.biligame.com/seer/精灵:13311',revision:String(revision.revid),loadedAt:wiki.records[0].loadedAt,petProvider:'bwiki',skillProvider:'seerapi',soulProvider:'seerapi',authorization:'USER-AUTHORIZATION.json',apiPetFailure:sources.failures.find(x=>x.url.endsWith('/pet/13311')),rawWikiPage:page},status:'pending-implementation'};
sp.effects=effects(sp.moves);
const officialFormSource={provider:'official',url:'https://www.taptap.cn/moment/865268777804107497',releaseDate:'2026-11-06'};
training.relatedForms=[{id:13311,name:'圣光灵神SP',relation:'alternate-form',source:officialFormSource}];
sp.relatedForms=[{id:3311,name:'圣光灵神',relation:'alternate-form',source:officialFormSource}];
for(const s of [training,sp])fs.writeFileSync(path.join(__dirname,`candidate-${s.id}.json`),JSON.stringify(s,null,2)+'\n');
const report={at:new Date().toISOString(),status:'pending-implementation-and-user-answers',sourceRecords:sources.records.length,failures:sources.failures,sourceConflicts:[{target:3311,field:'soul638',oldHash:old.souls[0].hash,newHash:soul(638).hash,oldDescription:old.souls[0].description,newDescription:soul(638).description},{target:13311,field:'fifth effect order',policy:'SeerAPI ordered instances prevail; Wiki fixed/percent order differs',apiSkillHash:raw('skill',38626).hash}],targets:[training,sp].map(s=>({id:s.id,name:s.name,revision:s.source.revision,moves:s.moves.length,compileIssues:s.moves.map(m=>({id:m.id,name:m.name,issue:E.WIKI.compile(m,s).issue})).filter(x=>x.issue)})),queueSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../../seer_id.txt'))).digest('hex')};
fs.writeFileSync(path.join(__dirname,'SOURCE-AUDIT.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.targets,null,2));
