'use strict';
const fs=require('node:fs'),crypto=require('node:crypto');
const hash=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const path='data/types/types.json',db=JSON.parse(fs.readFileSync(path));
const cache=require('../data/statuses/sources.json'),record=cache.records.find(r=>r.key==='wiki-mechanics'),page=Object.values(record.data.query.pages).find(p=>p.title==='对战机制'),rev=page.revisions[0],raw=rev.slots.main['*'];
const start=raw.indexOf('<h3><strong>技能系别</strong>'),quote=raw.slice(start,raw.indexOf('<h3>',start+4));
if(!quote.includes('50%')||!quote.includes('两个单属性系别'))throw new Error('STAB source changed');
db.rules.stab={id:'bwiki-388558-stab',multiplier:1.5,originalDescription:quote,source:{provider:'bwiki-cache',url:'https://wiki.biligame.com/seer/index.php?oldid='+rev.revid,revision:rev.revid,hash:hash(raw),loadedAt:record.loadedAt,snapshot:'data/statuses/sources.json',pointer:`/records/${cache.records.indexOf(record)}/data/query/pages/${page.pageid}/revisions/0/slots/main/*`},scope:'同一组合或双属性精灵使用组成单属性技能。部分重合的不同双属性不获得加成。效果明确指定的本系倍率由调用方保留。'};
db.engineIntegrated=true;
fs.writeFileSync(path,JSON.stringify(db,null,2)+'\n');
const sources=require('../data/types/sources.json'),wikiRec=sources.records.find(r=>r.key==='wiki-pages:模块:属性克制'),wikiPage=Object.values(wikiRec.data.query.pages)[0],wikiRev=wikiPage.revisions[0],wikiRaw=wikiRev.slots.main['*'];
const wiki=require('../wiki.cjs').parseTypeChart(wikiRaw,wikiRev.revid),conflicts=[];
for(const t of db.types)for(const other of db.types){const api=db.baseMatrix[t.id][other.id],value=wiki.rows[t.name][other.name];if(api!==value)conflicts.push({attackTypeId:t.id,defenseTypeId:other.id,attack:t.name,defense:other.name,alternatives:[{value:api,source:t.source,relationPointer:t.source.pointer+'/relations/'+t.raw.relations.findIndex(r=>r.target_type.id===other.id)},{value,source:db.rules.combination.source,originalDescription:wikiRaw.match(new RegExp('\\["'+t.name+'"\\]\\s*=\\s*\\{\\s*\\["attack"\\]\\s*=\\s*\\{([^}]+)'))?.[0]}],selected:{provider:'seerapi',value:api,reason:'项目来源优先级：SeerAPI优先；与现有129份精灵快照一致。'},status:'recorded-source-disagreement'});}
fs.writeFileSync('data/types/conflicts.json',JSON.stringify({schemaVersion:1,policy:'explicit-seerapi-priority-reject-conflicting-runtime-snapshots',matrixConflicts:conflicts,formulaConflict:{selected:db.rules.combination.source,alternative:db.rules.combination.conflict}},null,2)+'\n');
// Generated verbatim database for synchronous/offline browser startup.
fs.writeFileSync('dist/type-catalog.js','// Generated from data/types/types.json by research/build-type-runtime.cjs.\n(function(root){root.BattleTypeCatalog='+JSON.stringify({sha256:hash(fs.readFileSync(path,'utf8')),data:db})+';})(globalThis);\n');
console.log({types:db.types.length,combinations:db.combinations.length,conflicts:conflicts.length});
