'use strict';
// Offline evidence review only. Never evaluates cached code or modifies runtime rules.
const fs=require('fs'),crypto=require('crypto'),assert=require('node:assert/strict');
const catalog=require('../status-database.cjs'),pool=require('../status-pool-candidates.cjs').inspectNonRestricted();
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const save=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const escape=s=>s.replaceAll('~','~0').replaceAll('/','~1');
const source=catalog.database.sources['wiki-mechanics'];
const documents=[],pages=new Map(),missingPages=[],termHits=new Map(),parseFailures=[];
const inputFiles=fs.readdirSync('research').filter(f=>f.endsWith('.json')&&(/source|^selected-|^wiki-/.test(f))&&!/baseline|review|report|audit|inventory|check\.json$/.test(f)).map(f=>'research/'+f);
for(const dir of ['data/species','data/species-pending'])for(const f of fs.readdirSync(dir))if(f.endsWith('.json'))inputFiles.push(dir+'/'+f);
inputFiles.push('data/statuses/sources.json');
for(const file of [...new Set(inputFiles)].sort()){
 const bytes=fs.readFileSync(file);let doc;try{doc=JSON.parse(bytes);}catch(e){parseFailures.push({file,error:e.message});continue;}
 documents.push({file,sha256:sha(bytes)});
 function visit(v,p,url=null){
  if(!v||typeof v!=='object')return;
  url=typeof v.url==='string'?v.url:url;
  if(v.title&&Object.hasOwn(v,'missing'))missingPages.push({file,pointer:p,title:v.title,url,status:'missing-at-cached-fetch-not-proof-of-no-state'});
  if(v.title&&Array.isArray(v.revisions))for(const [i,r]of v.revisions.entries()){
   const text=r.slots?.main?.['*'];if(typeof text!=='string')continue;
   const digest=sha(text),key=JSON.stringify([v.title,r.revid??null,digest]);
   const entry=pages.get(key)??{title:v.title,revision:r.revid??null,hash:digest,hashMeaning:'sha256-of-cached-wikitext',url:r.revid?'https://wiki.biligame.com/seer/index.php?oldid='+r.revid:url,locations:[],statusMentions:catalog.list().filter(s=>text.includes(s.name)).map(s=>s.id),relevantLines:text.split(/\r?\n/).filter(s=>/限制类|换宠|切换|山神守护/.test(s))};
   entry.locations.push({file,pointer:p+'/revisions/'+i+'/slots/main/*'});pages.set(key,entry);
  }
  for(const[k,x]of Object.entries(v)){
   const q=p+'/'+escape(k);
   if(typeof x==='string'&&/山神守护|非限制类|可(?:以)?(?:主动)?(?:切换|换宠)|不限制.{0,4}(?:切|换)/.test(x)){
    const snippets=[...x.matchAll(/[^\n]{0,80}(?:山神守护|非限制类|可(?:以)?(?:主动)?(?:切换|换宠)|不限制.{0,4}(?:切|换))[^\n]{0,100}/g)].map(m=>m[0]);
    for(const snippet of snippets){const key=sha(snippet),hit=termHits.get(key)??{quote:snippet,locations:[]};hit.locations.push({file,pointer:q,url,stringSha256:sha(x)});termHits.set(key,hit);}
   }else if(x&&typeof x==='object')visit(x,q,url);
  }
 }
 visit(doc,'',doc.url??null);
}
const pageList=[...pages.values()];
const cache={scope:'现存research原始source/selected/wiki缓存与data本地快照；排除审核报告/基线/生成清单作为语义证据。没有网络刷新。',documents,parseFailures,
 wikiRevisions:pageList,missingPages,termHits:[...termHits.values()],
 mechanicsVersions:pageList.filter(p=>p.title==='对战机制'),
 findings:['同一修订的多份缓存按title/revision/content hash去重；复制次数不增加语义证据。','“可切换”缓存命中包含精灵形态切换，不能证明异常状态允许换宠。','非限制类用语出现在技能模板、历史实例、搜索摘要和星赎作用对象中，没有给出2074具体名单。','山神守护只在SeerAPI枚举中检出名称；未找到本次来源表的定义。','独立异常状态页面的missing缓存只表明当时页面缺失，不证明状态不存在。']};
save('research/status-classification-cache-review.json',cache);
const notes={
 麻痹:'明确控制且无法行动；不能把无法行动扩展为禁止换宠。',中毒:'最大体力1/8周期扣血已明确；周期伤害不能证明可换宠或入池。',烧伤:'周期扣血和技能威力减半已明确，威力变化不改变换宠分类。',寄生:'周期扣血并给对手恢复体力；回复关系不证明非限制类。',冻伤:'最大体力1/8周期扣血已明确；不能混用冰封或渐冻的属性。',害怕:'明确控制且无法行动；控制类不是限制换宠的同义词。',疲惫:'合并单元格共享麻痹控制描述；没有共享瘫痪的换宠限制。',睡眠:'命中攻击解除属于清除条件，不是换宠许可或入池证据。',石化:'合并单元格提供控制描述，不能从名称推导禁止切换。',混乱:'5%概率每回合扣50及攻击命中降低；概率伤害也是周期行为，但未给换宠属性。',衰弱:'按回合数增加受攻击伤害，不等于状态自身每回合扣血。',山神守护:'枚举ID12和名称可确认；无状态定义，异常身份及类别仍待核实。',易燃:'受火系攻击转化烧伤不等于易燃本体已经具备烧伤周期伤害。',狂暴:'原文明示附属类异常；有益效果不能作为排除异常身份的依据。',冰封:'无法行动与结束转冻伤已明确；转化后伤害不能当作冰封自身周期伤害。',流血:'每回合80点扣血明确；没有非限制类或允许切换的声明。',失明:'攻击MISS/必中效果失效属于技能结果，不直接等同控制行动类别。',焚烬:'控制及结束转烧伤、命中等级下降明确；不能提前继承烧伤扣血。',诅咒:'本体控制；三种后续诅咒的伤害规则不能回填为本体周期伤害。',烈焰诅咒:'每回合1/8百分比伤害明确；不等同诅咒本体控制。',致命诅咒:'受攻击伤害提升50%，没有本体按回合扣血的证据。',虚弱诅咒:'造成攻击伤害降低50%，不是周期扣血定义。',感染:'本体控制，结束转中毒并降低攻特攻；不能继承中毒的周期扣血。',束缚:'先制视为0和解除时扣血明确；解除一次伤害不能标成周期扣血。',失神:'属性技能50%无效；原文列弱化类，不冒充控制类标签。',沉默:'周期扣血明确；第五技能无效不等同原文控制类。',臣服:'禁止造成三种伤害，不等于禁止行动或允许换宠。',星赐:'附属类，增伤与回合末PP恢复；不能仅因有益而从异常池排除。',星哲:'附属类，固伤/百分比伤害增强及回血；增伤不代表本体周期扣血。',超频:'附属类的先制和PP恢复；结束转瘫痪不证明超频本体限制换宠。',沸涌:'受攻击伤害有最低比例，仍需受到攻击，不等于按回合自动扣血。',砥砺:'受真实伤害后条件性回血，没有换宠分类声明。',星赎:'延长所有非限制类异常的回合数，是作用对象范围，不是星赎自身非限制分类。',神游:'本体控制，结束转失神；两状态类别独立审核。',空定:'本体控制，结束转沉默；不能提前继承沉默周期伤害。',狂信:'原文明示控制类，但无法行动以对手为信仰对象为条件。',雷解:'攻击造成伤害后附加真伤，是事件触发，不是按回合周期伤害。',渐冻:'附属类，结束转冰封；不能从转化目标反推本体控制或限制属性。',瘫痪:'原文明示限制类及不能主动切换，维持排除。',凝滞:'原文明示限制类及不能切换；免疫控制不代表自身属于控制类。',魇昧:'原文明示限制类，足以按2074非限制条件排除；原文未说明换宠行为，仍为null。'
};
function fact(row,field){return {value:row.classification[field],evidence:row.classificationEvidence[field],status:row.classification[field]===null?'needs-source':'confirmed'};}
const records=catalog.list().map(row=>{
 assert.ok(notes[row.name]);const excluded=pool.excluded.find(r=>r.id===row.id),unresolved=pool.unresolved.find(r=>r.id===row.id);
 const categoryEvidence=row.category?{...row.classificationEvidence.isAbnormal,quote:row.category+'异常状态'}:null;
 return {id:row.id,name:row.name,wasPending:!!unresolved,originalDescription:row.description,sourceUrls:row.sourceUrls,revision:row.revision,hashes:row.hashes,
  checks:{isAbnormal:fact(row,'isAbnormal'),restrictsSwitching:fact(row,'restrictsSwitching'),
   controlClass:{value:row.category?row.category==='控制类':null,listedCategory:row.category,evidence:categoryEvidence,scope:'仅判断来源明确列出的类别标签；不替代controlsAction，不证明不同类别间其它行为互斥。'},
   controlsAction:fact(row,'controlsAction'),dealsPeriodicDamage:fact(row,'dealsPeriodicDamage'),
   eligibleFor2074:{value:excluded?false:null,status:excluded?'confirmed-excluded':'needs-source',reasons:excluded?.reasons??unresolved?.missing??[],evidence:excluded?[row.classificationEvidence.isRestrictedClass,row.classificationEvidence.restrictsSwitching].filter(Boolean):null}},
  reviewNote:notes[row.name],missingEvidence:excluded?[]:[...(row.description?[]:['该名称对应的异常状态定义']), '本状态是否属于非限制类的明确证据','本状态主动换宠是否受限的明确证据','2074真实候选成员或其与全部非限制状态等价的直接来源'],
  additionalCacheReferences:pageList.filter(p=>p.title!=='对战机制'&&p.statusMentions.includes(row.id)).map(p=>({title:p.title,revision:p.revision,hash:p.hash,locations:p.locations,usage:'仅上下文提及，不据此改变换宠或2074入池分类'})),
  conclusion:excluded?'exclude-from-non-restricted-design':'reviewed-still-unresolved'};
});
const count=key=>({yes:records.filter(r=>r.checks[key].value===true).length,no:records.filter(r=>r.checks[key].value===false).length,unknown:records.filter(r=>r.checks[key].value===null).length});
const review={schemaVersion:1,status:'reviewed-source-gaps-remain',databaseSha256:sha(fs.readFileSync('data/statuses/statuses.json')),sourceCacheReview:'research/status-classification-cache-review.json',source:source,
 summary:{total:records.length,pendingReviewed:records.filter(r=>r.wasPending).length,newlyConfirmedPoolMembers:0,confirmedExcluded:pool.excluded.length,poolMembershipUnresolved:pool.unresolved.length,poolCanBeGenerated:false,poolIds:null,fields:Object.fromEntries(['isAbnormal','restrictsSwitching','controlClass','dealsPeriodicDamage','eligibleFor2074'].map(k=>[k,count(k)]))},
 records,limits:['未发现可消除38项入池待确认的新语义证据；未把重复缓存当成新来源版本。','控制类别的false仅表示来源列明弱化类或附属类，不写回controlsAction=false。','没有显式周期伤害描述不等于确认没有周期伤害，未知仍为null。','所有原状态元数据、动态候选判定和2074设计策略保持不变；本文件补充逐项审核，不是战斗接入或完成认证。']};
save('data/statuses/classification-reviews.json',review);
const prior=JSON.parse(fs.readFileSync('research/status-classification-review.json'));
prior.latestVerification={file:'data/statuses/classification-reviews.json',cacheReview:review.sourceCacheReview,summary:review.summary};
save('research/status-classification-review.json',prior);
console.log(JSON.stringify({documents:documents.length,wikiRevisions:pageList.length,mechanicsVersions:cache.mechanicsVersions.map(r=>({revision:r.revision,hash:r.hash,copies:r.locations.length})),parseFailures,summary:review.summary},null,2));
