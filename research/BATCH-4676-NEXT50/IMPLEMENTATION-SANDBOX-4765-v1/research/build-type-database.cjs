'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const R=require('../dist/type-rules.js');
const sha=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const input=JSON.parse(fs.readFileSync('data/types/sources.json'));
const save=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
function list(resource){
 const pages=input.records.filter(r=>r.key.startsWith(resource+':'));
 assert(pages.length,'Missing '+resource);const records=pages.flatMap(r=>r.data.results);
 assert.equal(records.length,pages[0].data.count);assert.equal(new Set(records.map(x=>x.id)).size,records.length);
 for(let i=0;i<pages.length;i++){assert.equal(pages[i].data.hash,pages[0].data.hash);assert.equal(pages[i].data.count,records.length);assert.equal(pages[i].data.next,i+1<pages.length?pages[i+1].url:null);}
 return {pages,records,hash:pages[0].data.hash};
}
const elements=list('element_type'),combinations=list('element_type_combination');
function apiSource(resource,record,table){const page=table.pages.find(p=>p.data.results.some(r=>r.id===record.id));return {provider:'seerapi',url:`https://api.seerapi.com/v1/${resource}/${record.id}`,revision:record.hash,hash:sha(record),loadedAt:page.loadedAt,versionTimestamp:null,snapshot:'data/types/sources.json',pointer:`/records/${input.records.indexOf(page)}/data/results/${page.data.results.findIndex(r=>r.id===record.id)}`,responseUrl:page.url,responseHash:page.sha256,listHash:table.hash};}
const wikiRecord=input.records.find(r=>r.key==='wiki-pages:模块:属性克制');
const page=Object.values(wikiRecord.data.query.pages).find(p=>p.title==='模块:属性克制');
const revision=page.revisions[0],raw=revision.slots.main['*'];
assert.equal(revision.revid,388521,'New source revision requires semantic review before rebuilding');
const source={provider:'bwiki',url:`https://wiki.biligame.com/seer/index.php?oldid=${revision.revid}`,revision:revision.revid,hash:sha(raw),loadedAt:wikiRecord.loadedAt,versionTimestamp:revision.timestamp,snapshot:'data/types/sources.json',pointer:`/records/${input.records.indexOf(wikiRecord)}/data/query/pages/${page.pageid}/revisions/0/slots/main/*`};
const ruleExcerpt=raw.slice(raw.indexOf('--[[\n  计算 双属性'),raw.indexOf('-- 图片路径'));
assert(ruleExcerpt.includes('return 4')&&ruleExcerpt.includes('return (x + y) / 2')&&ruleExcerpt.includes('return (c1 + c2) / 4'));
const cached=JSON.parse(fs.readFileSync('data/statuses/sources.json'));
const cachedRecord=cached.records.find(r=>r.key==='wiki-mechanics');
const cachedPage=Object.values(cachedRecord.data.query.pages).find(p=>p.title==='对战机制'),cachedRev=cachedPage.revisions[0],cachedRaw=cachedRev.slots.main['*'];
const start=cachedRaw.indexOf('双属性克制系数的常规计算规则');const conflictingExcerpt=cachedRaw.slice(start,cachedRaw.indexOf('<h3>',start));
const db={schemaVersion:1,scope:'local-type-data-and-opt-in-query-only',engineIntegrated:false,
 version:{elementTypeHash:elements.hash,combinationHash:combinations.hash,ruleRevision:source.revision,loadedAt:input.records.filter(r=>r.key.startsWith('element')).map(r=>r.loadedAt).sort().at(-1)},
 types:elements.records.map(t=>({id:t.id,name:t.name,nameEn:t.name_en,classification:'single',classificationEvidence:'element_type record and matching is_double=false combination',category:null,originalDescription:t.description??t.desc??null,source:apiSource('element_type',t,elements),raw:t})),
 combinations:combinations.records.map(t=>({combinationId:t.id,name:t.name,nameEn:t.name_en,types:[t.primary.id,...(t.secondary?[t.secondary.id]:[])],primaryTypeId:t.primary.id,secondaryTypeId:t.secondary?.id??null,classification:t.is_double?'dual':'single',originalDescription:t.description??t.desc??null,source:apiSource('element_type_combination',t,combinations),raw:t})),
 rules:{combination:{id:R.RULE,status:'source-backed-with-documented-conflict',source,originalDescription:ruleExcerpt,
  singleVsSingle:'Read the directed SeerAPI relation.',singleVsDual:'If both 2: 4; if either 0: sum/4; otherwise sum/2.',dualVsSingle:'Apply the same merge to the two attacking components.',dualVsDual:'Compute dual attack against each defender component, then take their arithmetic mean.',missingData:'null; never assume neutral or execute remote code',
  conflict:{source:{provider:'bwiki-cache',url:`https://wiki.biligame.com/seer/index.php?oldid=${cachedRev.revid}`,revision:cachedRev.revid,hash:sha(cachedRaw),loadedAt:cachedRecord.loadedAt,snapshot:'data/statuses/sources.json'},originalDescription:conflictingExcerpt,issue:'对战机制文字将2与2合成2，专门属性模块明确合成4。',resolution:'采用属性专门模块388521的显式公式；与现有公共计算一致。保留文字冲突，未伪称官方确认。'}}},
 baseMatrix:{},matrix:{},coverage:{},pending:['API未提供属性背景描述、额外分类、上游版本发布时间，保留null。','对战机制文字与专门属性模块的2+2规则冲突保留待上游澄清。','未发行/未列出的组合不分配ID，不自动补入组合表。']};
const ids=new Set(db.types.map(t=>t.id));
for(const c of db.combinations){const names=c.types.map(id=>db.types.find(t=>t.id===id)?.name);c.aliases=[...new Set([c.name,names.join(''),names.join('·')])];c.aliasPolicy='Display formatting of source primary/secondary names only; no new combination or guessed decomposition.';}
for(const c of db.combinations){assert(c.types.every(id=>ids.has(id)));assert.equal(c.types.length,c.classification==='dual'?2:1);assert.equal(new Set(c.types).size,c.types.length);}
for(const t of db.types)assert(db.combinations.some(c=>c.types.length===1&&c.types[0]===t.id));
for(const t of elements.records){assert.equal(t.relations.length,db.types.length);assert.equal(new Set(t.relations.map(r=>r.target_type.id)).size,db.types.length);db.baseMatrix[t.id]={};for(const d of db.types){const n=t.relations.find(r=>r.target_type.id===d.id)?.multiple;db.baseMatrix[t.id][d.id]=typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=4?n:null;}}
for(const a of db.combinations){db.matrix[a.combinationId]={};for(const d of db.combinations)db.matrix[a.combinationId][d.combinationId]=R.calculate(db,a.types,d.types);}
const cells=Object.values(db.matrix).flatMap(Object.values),baseCells=Object.values(db.baseMatrix).flatMap(Object.values);
db.coverage={typeCount:db.types.length,combinationCount:db.combinations.length,singleCount:db.combinations.filter(c=>c.types.length===1).length,dualCount:db.combinations.filter(c=>c.types.length===2).length,baseCells:baseCells.length,baseKnown:baseCells.filter(x=>x!==null).length,combinationCells:cells.length,combinationKnown:cells.filter(x=>x!==null).length,combinationUnknown:cells.filter(x=>x===null).length};
save('data/types/types.json',db);
console.log(db.coverage);
// Keep the derived browser artifact, provenance and runtime STAB rule in sync.
require('./build-type-runtime.cjs');
