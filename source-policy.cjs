'use strict';
// A narrowly authorized fallback for the missing SP pet resource. Skill,
// soul and element payloads remain the actual captured SeerAPI responses.
const fs=require('fs'),path=require('path'),{convertMove}=require('./seerapi.cjs');
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function compositeIssues(s,root=__dirname){
 const errors=[];if(s?.source?.provider!=='composite')return ['not a composite source'];
 try{
  const dir=path.join(root,'research/LIGHT-SP-2026-11-07'),auth=JSON.parse(fs.readFileSync(path.join(dir,'USER-AUTHORIZATION.json'))),api=JSON.parse(fs.readFileSync(path.join(dir,'sources.json'))),wiki=JSON.parse(fs.readFileSync(path.join(dir,'wiki-sources.json')));
  if(s.id!==13311||auth.verbatimAnswer!=='允许以官方与 Wiki 核实补齐 SP 缺失资料，保留来源差异'||!equal(auth.targets,[3311,13311])||auth.advanceFormalQueue!==false)throw Error('SP fallback authorization mismatch');
  const record=wiki.records.find(r=>Object.values(r.data?.query?.pages??{}).some(p=>p.title==='精灵:13311')),page=Object.values(record?.data.query.pages??{}).find(p=>p.title==='精灵:13311'),revision=page?.revisions?.[0],text=revision?.slots?.main?.['*'];if(typeof text!=='string')throw Error('missing raw Wiki revision');
  const field=k=>text.match(new RegExp('\\|'+k+'=([^\\n]*)'))?.[1];
  if(s.source.url!=='https://wiki.biligame.com/seer/精灵:13311'||s.source.revision!==String(revision.revid)||s.source.loadedAt!==record.loadedAt||!equal(s.source.rawWikiPage,page)||s.source.authorization!=='USER-AUTHORIZATION.json'||s.source.skillProvider!=='seerapi'||s.source.soulProvider!=='seerapi'||s.source.petProvider!=='bwiki')errors.push('SP Wiki source URL/revision/raw snapshot mismatch');
  if(!api.failures.some(x=>x.url==='https://api.seerapi.com/v1/pet/13311'&&x.error.includes('HTTP 404')))errors.push('SP missing API resource evidence required');
  const raw=(kind,id)=>api.records.find(r=>r.url===`https://api.seerapi.com/v1/${kind}/${id}`)?.data;
  const base=Object.fromEntries(Object.entries({maxHp:'体力',atk:'攻击',def:'防御',spa:'特攻',spd:'特防',spe:'速度'}).map(([k,v])=>[k,Number(field(v))]));
  if(s.id!==Number(field('ID'))||s.name!==field('名称')||!equal(s.base,base)||s.type!==raw('element_type_combination',65)?.name)errors.push('SP identity/base/type differs from approved source');
  const learns=field('技能').split(';').map(x=>{const[id,level,fifth]=x.split('-');return{skill:{id:Number(id)},learning_level:Number(level),is_fifth:fifth==='第五',is_special:false,is_advanced:false};});
  if(!equal(s.moves.map(x=>x.id),learns.map(x=>x.skill.id)))errors.push('SP full ordered skill inventory differs from Wiki');
  for(const l of learns){const actual=s.moves.find(x=>x.id===l.skill.id),m=raw('skill',l.skill.id),type=raw('element_type_combination',m?.type?.id);if(!actual||!m||!type){errors.push('SP missing API move '+l.skill.id);continue;}const expected=convertMove(m,l,type.name,{deferTeamEffects:true});for(const k of['id','name','type','kind','power','pp','priority','accuracy','alwaysHit','critical','effectIds','effectInstances','description','revision','hash','level','fifth','sourceFlags','provider','sourceTargetCount'])if(!equal(actual[k],expected[k]))errors.push(`SP move ${m.id} ${k} source mismatch`);}
  const soul=raw('soulmark',2162),expected={id:2162,description:soul?.desc,hash:soul?.hash,eid:soul?.effect?.effect.id,args:soul?.effect?.effect_args};if(!soul?.pet?.some(x=>x.id===13311)||!equal(s.souls,[expected]))errors.push('SP soul must retain the actual SeerAPI 2162 payload');
 }catch(e){errors.push(e.message);}
 return errors;
}
function originalIssues(snapshot,root=__dirname){
 const mars=require('./dist/sp-mars-rules.js');
 const directory='research/POST-V9-20261121/original-source';
 const hash=bytes=>require('node:crypto').createHash('sha256').update(bytes).digest('hex');
 if(!mars.validSource(snapshot)||snapshot.source.url!==`local:${directory}/design-v1.txt`)
   return ['原创精灵身份或来源字段未匹配'];
 try{
   const original=fs.readFileSync(path.join(root,directory,'design-v1.txt'));
   const bytes=fs.readFileSync(path.join(root,directory,'spec.json'));
   if(hash(original)!==mars.SOURCE_HASH||hash(bytes)!==mars.SPEC_HASH)throw Error('原创原文或定稿哈希不符');
   const spec=JSON.parse(bytes);
   if(!equal(snapshot.originalSpec,spec)||snapshot.name!==spec.species.name)throw Error('原创定稿引用不符');
   const description=original.toString('utf8').split('神谕技能')[0].split('魂印效果')[1].trim();
   if(snapshot.souls[0].description!==description||!equal(snapshot.souls[0].args,[]))throw Error('原创魂印原文不符');
   if(!equal(snapshot.moves.map(move=>move.id),Object.values(mars.MOVES)))throw Error('原创技能顺序不符');
   for(const [key,raw] of Object.entries(spec.moves)){
     const actual=snapshot.moves.find(move=>move.id===mars.MOVES[key]);
     const expected={name:raw.name,type:raw.element??'属性',kind:raw.category,power:raw.power,pp:raw.pp,
       accuracy:100,alwaysHit:raw.alwaysHit,critical:'1/16',priority:raw.priority??0,fifth:key==='fifth',
       effectIds:[],effectInstances:[],provider:'user-original',revision:spec.revision,hash:hash(JSON.stringify({key,move:raw}))};
     if(!Object.keys(expected).every(field=>equal(actual[field],expected[field])))throw Error(`原创技能 ${key} 字段不符`);
   }
   return [];
 }catch(error){return [error.message];}
}

module.exports={compositeIssues,originalIssues};
