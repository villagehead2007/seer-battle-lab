'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),P=require('../completion-policy.cjs'),store=require('../local-species.cjs'),snapshot=structuredClone(require('./4258-answered-independent-snapshot.json')),at=new Date().toISOString(),rf='SINGLE-STAGE-REVIEWS.json',reviews=JSON.parse(fs.readFileSync(rf));
const names=file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]);
const files=['partial','original-answers','executor-payloads','fifth-branches','executor-copy','versions'].map(n=>'tests/deployed-4258-'+n+'.test.cjs');
const refs=files.flatMap(file=>names(file).map(name=>({file,name,assertion:'真实HP/完整伤害/PP/能力等级/免疫、执行者六项面板、回合消耗和派生条件；真实来源四版本配招和104次技能执行，非仅注册或编译'})));
fs.writeFileSync('research/4258-reviews-before-full-answer-implementation.json',JSON.stringify(Object.fromEntries(Object.entries(reviews.entries).filter(([key])=>key.startsWith('4258:'))),null,2)+'\n');
const old=names('research/deployed-4258-partial.test.cjs.before-full-copy.txt'),now=names(files[0]);
for(const e of P.inventory(snapshot)){
 const v=reviews.entries[e.key];assert.ok(v,e.key);
 for(const list of Object.values(v.tests??{}))for(const ref of list){const index=old.indexOf(ref.name);if(index>=0)ref.name=now[index];}
 if(['4258:soul:1482','4258:soul:2139','4258:skill:35191:0','4258:skill:38515:1'].includes(e.key)){
  for(const key of ['question','questions','pendingSingleBehavior','missingSingleTests','pendingSingleTests'])delete v[key];
  v.reviewStatus='reviewed';v.reviewedAt=at;v.implementation=['dist/range-souls.js','dist/soul-registry.js','dist/souls.js','dist/range-effects.js','dist/status-rules.js'];
  if(e.key==='4258:soul:2139'){
   v.singleBehavior='真实初始5架，每架为maxHp/atk/def/spa/spd/spe各加8；数量0至5，当前HP只受新上限约束。全部攻击必中。大于1架按对手魂印声明及派生伤害免疫类型复制一回合，保留条件、概率和次数，来源/条件/原始hash可追溯；同批效果消除或到期只消耗一架。源式崩坏整招攻击40%真伤和双倍理论回复；300边界封攻/属当前及次回合；光垒低伤各技能上限40%PP，高伤次回合先制-1；阵列双方任一未用只补一架、递增停用1至4回合。';
   v.rationale='064原始人类回答及097/098新明确确认逐字保留，不伪称API文本。复制的是伤害免疫部分，不额外授予原魂印的反弹、回复、强化或复活；条件和概率由新持有者实际状态判断，未满足仍持有该条件效果。只复制魂印及其派生，排除单独技能/装备免疫和其他环源。真实额外机械单位及队伍受益仍按原来源完整延期，未扩大延期到自身分支。';
  }
  if(e.key==='4258:skill:38515:1'){v.singleBehavior='继承原35288全部真实实例；拥有实际执行者复制免疫回合效果时同时触发先后手分支、恒定150%增伤、负级对应提升及消回合、无异常仍40%威力，击败亦按理论敌最大HP三分一回复；未持有该来源时沿原条件。';v.rationale='065明确回答，由真实对手魂印生成的执行者免疫实际接通，不用手工输入状态替代来源生成验收。原1482/2139及两个真实第五分别验证，所有来源hash保持。';}
  const relevant=refs.filter(ref=>e.key==='4258:soul:2139'?/executor-copy|executor-payloads|versions/.test(ref.file):e.key.includes('38515')?/fifth-branches|executor-copy|versions/.test(ref.file):/original-answers|versions/.test(ref.file));
  for(const bucket of ['success','failure','boundary','interaction'])v.tests[bucket].push(...relevant);
 }
}
const saved=store.save(snapshot);assert.equal(saved.saved,true,JSON.stringify(saved.issues));for(const e of P.inventory(saved.snapshot))reviews.entries[e.key].sourceDigest=e.sourceDigest;fs.writeFileSync(rf,JSON.stringify(reviews,null,2)+'\n');
const cf='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',confirm=JSON.parse(fs.readFileSync(cf));
for(const [key,questionIds]of [['4258:soul:1482',['Q-A60-4258-063','Q-A60-4075-012']],['4258:soul:2139',['Q-A60-4258-064','Q-A60-4258-097','Q-A60-4258-098']],['4258:skill:35191:0',['Q-A60-4258-066']],['4258:skill:38515:1',['Q-A60-4258-065','Q-A60-4258-098']]]){const e=P.inventory(saved.snapshot).find(x=>x.key===key);confirm.instanceBindings[key]={questionIds,sourceDigest:e.sourceDigest,source:e.source,raw:e.raw,status:'implemented-awaiting-official-gate',accepted:false,scope:'只4258当前真实实例和四版本；097/098不推广为全局规则',specialLog:'research/4258-answered-special-v4.log'};}
for(const q of confirm.confirmations.filter(x=>x.primarySpeciesId===4258)){q.status='answered-implemented-awaiting-official-gate';q.implementationBySpecies??={};q.implementationBySpecies[4258]={state:'implemented-awaiting-official-gate',accepted:false,log:'research/4258-answered-special-v4.log'};}
for(const field of ['pendingQuestions','pendingNewQuestions'])confirm.implementation[field]=(confirm.implementation[field]??[]).filter(x=>!x.startsWith('Q-A60-4258-'));fs.writeFileSync(cf,JSON.stringify(confirm,null,2)+'\n');
const pendingFile='data/species-pending/4258.json',pending=JSON.parse(fs.readFileSync(pendingFile));pending.questions=[];pending.status='implemented-awaiting-verification';pending.snapshot=saved.snapshot;pending.independentImplementation={at,passed:134,total:134,speciesTests:49,sharedTests:85,log:'research/4258-answered-special-v4.log',formalLocalDeployed:true,formalGateRun:false,fullNpmRun:false};fs.writeFileSync(pendingFile,JSON.stringify(pending,null,2)+'\n');
fs.writeFileSync('tests/deployed-4258.test.cjs',"'use strict';\n"+files.map(file=>"require('./"+file.split('/').at(-1)+"');").join('\n')+'\n');
const failures=P.validateCoverage(saved.snapshot,reviews,require('./build-multiplayer-todo.cjs').build([saved.snapshot],reviews),process.cwd(),false);
const evidence={at,speciesId:4258,currentSource:saved.snapshot.source,questionIds:['Q-A60-4258-063','Q-A60-4258-064','Q-A60-4258-065','Q-A60-4258-066','Q-A60-4258-097','Q-A60-4258-098'],ownSpecialTests:49,sharedTests:85,log:'research/4258-answered-special-v4.log',sourceChanges:'原始API字段/原回答/hash未改；真实追加第五按已授权常规精确来源登记，不扩大兼容校验。',publicChanges:'仅实际复制免疫持有者进入新伤害分支；数值型旧回合效果沿原逻辑；只有带资源到期标记的效果发出新结束事件。',oldCertifiedAffected:[],deferred:'死亡后执行者转为真实机械系额外单位并惠及其他队员；461真实换宠清理untilSwitch。',gate:'not-run-yet',failures};fs.writeFileSync('research/4258-answered-impact.json',JSON.stringify(evidence,null,2)+'\n');
fs.writeFileSync('research/ANSWER-IMPLEMENTATION-CHECKPOINT.json',JSON.stringify({at,current:4258,phase:'formally-saved-awaiting-validator',acceptedInFixedScope:48,scopeTotal:60,pendingQuestions:[],currentTests:pending.independentImplementation,currentFormalGateRun:false,currentFullNpmRun:false,formalDeployed:true,nextAfterCurrent:4264,doNotAdvance:true,backgroundRunning:false,activeProcess:null},null,2)+'\n');
fs.writeFileSync('PROGRESS.md',`## ${at} 4258回答已落实，正式部署后待验证器\n\n097/098新回答逐字归档并关联064及具体版本；当前49本体+85共享专项134/134通过，日志research/4258-answered-special-v4.log。两魂印、双第五四组合全部104次真实ID配招初始化/用招执行通过。已正式保存本地，尚未运行当前完整npm或正式验证器，固定范围仍48/60，不推进4264。\n\n`+fs.readFileSync('PROGRESS.md','utf8'));
console.log(JSON.stringify({id:4258,saved:saved.saved,coverage:P.reviewCoverage(saved.snapshot,reviews),failures}));assert.deepEqual(failures,[]);
