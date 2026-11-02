'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),D=require('../type-database.cjs');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rawSources=require('../data/types/sources.json'),records=[],aliases=new Set(),revisions={},missing=[],rowDifferences=[],aliasDifferences=[];
for(const file of fs.readdirSync('data/species').filter(x=>/^\d+\.json$/.test(x))){
 const path='data/species/'+file,s=JSON.parse(fs.readFileSync(path)).snapshot,chart=s.typeChart;
 revisions[chart?.revision]=(revisions[chart?.revision]??0)+1;
 for(const [name,parts]of Object.entries(chart?.aliases??{})){aliases.add(name);const c=D.getCombination(name);if(!c)missing.push({path,name,kind:'alias'});else if(JSON.stringify(c.types.map(id=>D.getType(id).name))!==JSON.stringify(parts))aliasDifferences.push({path,name,parts});}
 for(const name of [s.type,...s.moves.filter(m=>m.kind!=='status').map(m=>m.type)])if(!D.getCombination(name))missing.push({path,name,kind:'battle-use'});
 for(const [a,row]of Object.entries(chart?.rows??{}))for(const [d,n]of Object.entries(row))if(D.baseMultiplier(a,d)!==n)rowDifferences.push({path,attack:a,defense:d,snapshot:n,library:D.baseMultiplier(a,d)});
 records.push({path,sha256:sha(path),id:s.id,type:s.type,combinationId:D.getCombination(s.type)?.combinationId??null,revision:chart?.revision,aliasCount:Object.keys(chart?.aliases??{}).length});
}
const wikiRecord=rawSources.records.find(r=>r.key==='wiki-pages:模块:属性克制'),page=Object.values(wikiRecord.data.query.pages)[0],rev=page.revisions[0];
const wiki=require('../wiki.cjs').parseTypeChart(rev.slots.main['*'],rev.revid),sourceDifferences=[];
for(const a of D.data.types)for(const d of D.data.types)if(wiki.rows[a.name]?.[d.name]!==D.baseMultiplier(a.id,d.id))sourceDifferences.push({attack:a.name,defense:d.name,seerapi:D.baseMultiplier(a.id,d.id),wiki:wiki.rows[a.name]?.[d.name]??null,resolution:'SeerAPI优先；保留Wiki差异，待来源进一步澄清。'});
const used=new Set([...aliases].map(name=>D.getCombination(name)?.combinationId));
const absentFromSnapshots=D.data.combinations.filter(c=>!used.has(c.combinationId)).map(c=>({combinationId:c.combinationId,name:c.name}));
const audit={schemaVersion:1,checkedAt:new Date().toISOString(),status:'data-library-ready-engine-not-migrated',coverage:D.data.coverage,
 sources:{apiElements:D.data.version.elementTypeHash,apiCombinations:D.data.version.combinationHash,wikiRule:D.data.rules.combination.source,sourceDifferences,formulaConflict:D.data.rules.combination.conflict},
 existing:{speciesCount:records.length,chartRevisions:revisions,sharedBaseMatrixCopies:records.length,aliases:aliases.size,uniqueCombinations:used.size,missing,aliasDifferences,rowDifferences,absentFromSnapshots,records},
 implementation:{engineIntegrated:false,queryModule:'type-database.cjs',portableModule:'dist/type-rules.js',database:'data/types/types.json',matrixOrientation:'matrix[attackCombinationId][defenseCombinationId]; incoming is the transpose, never reciprocal',
  currentPaths:[{file:'seerapi.cjs',behavior:'buildChart reads base API table; species fetches combination references and duplicates aliases/chart into each snapshot.'},{file:'research/deploy-local.cjs',behavior:'Builds identical per-species chart from cached API lists using cached combination names; historical aliases differ in spacing from the current API.'},{file:'wiki.cjs',behavior:'Alternative Wiki table parser; source can differ from SeerAPI.'},{file:'dist/wiki-support.js',behavior:'effectiveness combines components; mergeCharts requires equal revisions/rows and merges aliases.'},{file:'dist/souls.js',behavior:'Generic damage uses E.typeEffectiveness; no-chart fallback hardcodes 自然圣灵→电4、电→自然圣灵0.5, others1.'},{file:'dist/engine.js',behavior:'Classic branch (bubuhua battles) hardcodes 草→草0.5, others1.'}],
  duplicateScope:'129份基础矩阵重复存储，在线和缓存部署各有构建入口；双属性运算主公共函数在wiki-support。独立新模块为迁移准备，尚未替换旧函数。',
  sameTypeBonus:{source:'data/statuses/sources.json 对战机制388558 技能系别',known:'双属性本系包括组合属性自身及两个组成单属性。',current:'souls.js uses exact name equality for STAB by default; component single-type STAB is not generally recognized.',status:'existing-gap-not-modified'},
  specialSkillType:{name:'属性',typeId:null,combinationId:null,multiplier:null,note:'技能种类标签，不伪造为第27种元素或新增组合。'}},
 migration:[
  '先固定版本并提供只读查询；当前完成此步。所有旧快照及战斗默认数据来源保持不变。',
  '未来在公共加载边界注入版本化库，显式使用toLegacyChart适配；按版本匹配，不静默覆盖旧快照。保存回放使用的版本引用。',
  '再让wiki-support/souls公共倍率查询委托同一个库；独立处理classic分支与无表fallback，缺失明确报错，不能默认1。',
  '在单独任务中补本系加成识别，验证双属性使用组成单属性技能与特殊覆盖交互。',
  '所有回归和回放兼容通过后，再设计去除精灵快照重复矩阵的存储迁移；本次不改精灵文件、验证器或自动化。'
 ],
 pending:[...D.data.pending,'API和Wiki的3格基础倍率不同，当前以API为准并保留逐格差异。','现有引擎尚未统一读取本库；双属性本系加成、旧classic/fallback分支留待后续公共迁移。'],
 tests:{targeted:'tests/type-database.test.cjs',targetedResult:null,npmTest:null}};
fs.writeFileSync('research/type-system-audit.json',JSON.stringify(audit,null,2)+'\n');
console.log({species:records.length,sourceDifferences,absentFromSnapshots:absentFromSnapshots.length,missing:missing.length,rowDifferences:rowDifferences.length});
