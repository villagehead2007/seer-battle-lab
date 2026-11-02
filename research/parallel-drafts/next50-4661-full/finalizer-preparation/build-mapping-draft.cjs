'use strict';
// Metadata-only mapping. No engine imports, test execution, policy validator calls,
// shared writes, status changes or MD access. Only P.inventory() is used.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../../..'),out=__dirname;
const P=require(path.join(root,'completion-policy.cjs'));
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
const readText=f=>fs.readFileSync(path.join(root,f),'utf8');
const categories=['success','failure','boundary','interaction'];
const sourceDir=id=>'research/parallel-drafts/next50-'+id+'-full/';
function literalNames(t){return [...t.matchAll(/test\('([^']+)'/g)].map(m=>m[1]);}
function basicDescription(m){return m.description?.trim()||`${m.name}；${m.kind}；属性${m.type}；威力${m.power}；PP${m.pp}；命中${m.accuracy}；必中${m.alwaysHit}；先制${m.priority}`;}
function normalizedKey(id,v){return v.kind==='soul'?`${id}:soul:${v.soulId??v.id??Number(v.key.split(':').at(-1))}`:['basic','skill-basic'].includes(v.kind)?`${id}:move:${v.moveId}`:`${id}:skill:${v.moveId}:${v.index}`;}
function sourceCheck(s,v,e){const errors=[];if(!e)return ['inventory key missing'];if(e.kind==='move'){if((v.moveRevision??v.source?.revision)&& (v.moveRevision??v.source.revision)!==e.raw.revision)errors.push('move revision mismatch');if(v.source?.hash&&v.source.hash!==e.raw.hash)errors.push('move hash mismatch');}else if(e.kind==='skill'){const m=s.moves.find(m=>m.id===v.moveId);for(const [field,a,b] of [['effectId',v.effectId,e.raw.instance.id],['index',v.index,e.raw.index],['args',JSON.stringify(v.params??v.args),JSON.stringify(e.raw.instance.args)],['moveHash',v.sourceHash??v.moveHash,m.hash]])if(a!==b)errors.push(field+' mismatch');if(v.description&&v.description!==e.raw.instance.description)errors.push('description mismatch');if(v.sourceEffect&&JSON.stringify(v.sourceEffect)!==JSON.stringify(e.raw.metadata))errors.push('effect definition mismatch');if(v.sourceInstance&&JSON.stringify(v.sourceInstance)!==JSON.stringify(e.raw.instance))errors.push('instance mismatch');}else{if((v.sourceHash??v.source?.hash)!==e.raw.hash)errors.push('soul hash mismatch');if(v.source?.id&&v.source.id!==e.raw.id)errors.push('soul id mismatch');}return errors;}
function namedAssertionTest(text, name) {
  const tokens=[];
  const lexical=/\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\[\s\S]|[^'\\])*'|"(?:\\[\s\S]|[^"\\])*"|`(?:\\[\s\S]|[^`\\])*`|[A-Za-z_$][\w$]*|=>|[^\s]/gy;
  const regexp=/\/(?![/*])(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\n\\])+\/[dgimsuvy]*/y;
  let match;
  while((match=lexical.exec(text))) {
    let value=match[0];
    if(value==='/' && (!tokens.length||['=','(',',','[','{',':',';','!','?','return','=>','&','|'].includes(tokens.at(-1)))) {
      regexp.lastIndex=match.index;
      const literal=regexp.exec(text);
      if(literal){value=literal[0];lexical.lastIndex=regexp.lastIndex;}
    }
    if(!/^\s|^\/\/|^\/\*/.test(value))tokens.push(value);
  }
  const names=[JSON.stringify(name),`'${name.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}'`];
  for(let i=0;i<tokens.length;i++) {
    if(tokens[i]!=='test'||tokens[i-1]==='.'||tokens[i+1]!=='('||!names.includes(tokens[i+2])||tokens[i+3]!==',')continue;
    let depth=1,end=i+4;
    for(;end<tokens.length&&depth;end++){if(tokens[end]==='(')depth++;if(tokens[end]===')')depth--;}
    const call=tokens.slice(i+4,end-1);
    // A skipped/todo test is not executable evidence.
    if(call.some((x,j)=>['skip','todo'].includes(x)&&call[j+1]===':'))continue;
    const callback=call.findIndex(x=>x==='=>'||x==='function');
    if(callback<0)continue;
    for(let j=callback+1;j<call.length;j++) {
      if(call[j]!=='assert'||call[j-1]==='.'||call[j+1]!=='.'||!['equal','strictEqual','deepEqual','deepStrictEqual','ok','notEqual','notStrictEqual'].includes(call[j+2])||call[j+3]!=='(')continue;
      // A constant assertion (e.g. equal(1,1)) is not a state witness. Inspect
      // only the first argument; a message string cannot make it a witness.
      let nested=0,actual=[];
      for(let k=j+4;k<call.length;k++) {
        if(nested===0&&(call[k]===','||call[k]===')'))break;
        if(['(','[','{'].includes(call[k]))nested++;
        if([')',']','}'].includes(call[k]))nested--;
        actual.push(call[k]);
      }
      if(actual.some(x=>/^[A-Za-z_$][\w$]*$/.test(x)&&!['true','false','null','undefined','NaN','Infinity'].includes(x)))return true;
    }
  }
  return false;
}

function referenceAudit(ref, fallbackFiles){const candidates=[ref.file,...fallbackFiles];const files=[...new Set(candidates)].filter(f=>fs.existsSync(path.join(root,f)));for(const file of files){const text=readText(file);if(namedAssertionTest(text,ref.name))return {...ref,file,found:true,sha256:sha(file),originalEvidenceFile:ref.file};}return {...ref,found:false,checkedFiles:files};}
function sourceFiles(id){const d=sourceDir(id);return ['research/'+id+'-reviewed-snapshot.json',d+(id===4662?'4662-instance-evidence.json':'evidence.json'),d+'questions.draft.json',d+(id===4662?'multi-pet-deferred.json':'deferred.draft.json'),d+'FREEZE.json',d+'CODE-FREEZE.json'];}
function freezeAudit(id){const d=sourceDir(id),man=read(d+'FREEZE.json');return (man.files??[]).map(x=>{const f=(x.path??x.file).startsWith('research/')?(x.path??x.file):d+(x.path??x.file);return {file:f,expected:x.sha256,actual:fs.existsSync(path.join(root,f))?sha(f):null,match:fs.existsSync(path.join(root,f))&&sha(f)===x.sha256};});}
function entrySources(e,s){return {key:e.key,sourceDigest:e.sourceDigest,source:e.source,raw:e.raw,petHash:s.source.revision,...(e.kind==='skill'?{skillHash:s.moves.find(m=>m.id===Number(e.key.split(':')[2])).hash,effectHash:e.raw.metadata?.revision,index:e.raw.index,args:e.raw.instance.args}:e.kind==='move'?{moveHash:e.raw.hash}:{soulHash:e.raw.hash})};}
function build45(){const id=4662,d=sourceDir(id),s=read('research/4662-reviewed-snapshot.json'),ev=read(d+'4662-instance-evidence.json'),q=read(d+'questions.draft.json'),def=read(d+'multi-pet-deferred.json'),inv=P.inventory(s),byKey=new Map(inv.map(e=>[e.key,e])),entries={},audits=[];const names=literalNames(readText(d+'production-ready-full.test.cjs'));const makeRef=(index,assertion)=>({file:'tests/next50-4662-full.test.cjs',name:names[index],assertion});
 for(const v of ev.items){const key=normalizedKey(id,v),e=byKey.get(key),sourceErrors=sourceCheck(s,v,e);if(entries[key])sourceErrors.push('duplicate key');const scope=v.scope==='multi'?'multiplayer':v.scope,tests={};if(scope!=='multiplayer')for(const c of categories)tests[c]=(v.stateRefs?.[c]??[]).map(r=>({file:r.file,name:r.name??r.test,assertion:r.assertion??r.assertions}));
 // Refine soul evidence away from generic move PP matrices to actual source branches.
 if(e?.kind==='soul'){tests.success=[makeRef(4,'目标异常使用时快照取消红伤，afterUse实际2倍威力真伤；原命中fixed仍执行'),makeRef(6,'实际正非暴受伤后下轮冻伤2；失败补凝滞并真实消费免异'),makeRef(7,'实际暴击后次轮清异常与必暴，连续至第三轮')];tests.failure=[makeRef(34,'控制未用无威力真伤；整招无效但已used仍80真伤，明确区分')];tests.boundary=[makeRef(32,'实际完整红0的暴击资格自然待问，明确两政策真实次轮crit不同'),makeRef(33,'完全免攻0的受非暴资格自然待问，明确两政策真实冻伤状态不同')];tests.interaction=[makeRef(31,'完整37469把异常转走后仍按用时快照取消本体红，实际附280true'),makeRef(42,'真实同源微弱属性对照，50%增幅翻倍为100%，actual modifier恰2')];}
 const deferred=def.filter(x=>x.instance?.moveId===v.moveId&&x.instance?.index===v.index);const pending=[...new Set(v.pending??[])];const review={sourceDigest:e?.sourceDigest,scope,reviewedBy:'Codex mapping draft; parent review required',reviewedAt:new Date().toISOString(),reviewStatus:'draft-not-applied',rationale:scope==='multiplayer'?'原文明示下1回合对手无法主动切换，仅该真实换宠门禁延期。':'按当前真实来源逐实例匹配；保留冻结实态/明确研究资格与未答范围，非部署或验收结论。',singleBehavior:e?.kind==='move'?basicDescription(e.raw):v.description||e?.raw.description||e?.raw.instance?.description,implementation:['dist/range-effects.js','dist/effect-registry.js','dist/range-souls.js','dist/souls.js'],tests,questions:pending,...(pending.length?{pendingSingleBehavior:pending.join(', ')}:{})};if(deferred.length){review.deferredBehavior=deferred.map(x=>x.sourceText).join('；');review.trigger='对手在本技能效果的下一回合实际选择主动切换精灵';review.futureMechanisms=deferred.flatMap(x=>x.futureMechanisms??[x.dependency]);review.dependencyEvidence=deferred.map(x=>({kind:'switch',quote:x.sourceText}));review.deferredSourceRecords=deferred;}if(scope==='multiplayer'){delete review.singleBehavior;delete review.tests;review.implementation=[];}
 const refChecks=Object.entries(tests).flatMap(([category,refs])=>refs.map(r=>({category,...referenceAudit(r,[d+'production-ready-full.test.cjs'])})));entries[key]=review;audits.push({key,originalEvidenceKey:v.key,kind:e?.kind,sourceErrors,sourceBinding:e?entrySources(e,s):null,references:refChecks,emptyCategories:scope==='multiplayer'?[]:categories.filter(c=>!tests[c]?.length)});}
 for(const x of JSON.parse(fs.readFileSync(path.join(out,'soul-branch-evidence.overrides.json'),'utf8'))[id]??[])entries[x.key].branchEvidence=x.branches;
 const missing=inv.filter(e=>!entries[e.key]).map(e=>e.key);return {species:id,draftOnly:true,neverApplyAutomatically:true,productionResultGate:'Parent must provide actual production result; this draft does not accept or advance state',policyFile:{file:'completion-policy.cjs',sha256:sha('completion-policy.cjs'),functionsUsed:['inventory only; no checkReview/checkSource/validateCoverage called']},inputs:sourceFiles(id).map(file=>({file,sha256:sha(file)})),freezeAudit:freezeAudit(id),inventory:inv.length,sourceBindings:audits.map(x=>x.sourceBinding),entries,questions:{new:q.new,shared:q.shared},mappingAudit:{mapped:audits.length,missing,duplicates:audits.length-Object.keys(entries).length,sourceErrors:audits.flatMap(a=>a.sourceErrors.map(error=>({key:a.key,error}))),missingReferences:audits.flatMap(a=>a.references.filter(r=>!r.found).map(r=>({key:a.key,...r}))),emptyCategories:audits.filter(a=>a.emptyCategories.length),perItem:audits},notes:['Original frozen evidence unchanged; keys normalized to policy inventory.','Empty basic descriptions filled from exact real raw move fields.','Soul refs refined manually to actual source-specific state tests rather than generic PP boundary matrices.','No source/API/Wiki code, engine, tests, validator, liveMD, sharedfile or state writes executed.']};}
function save45(){const r=build45();fs.writeFileSync(path.join(out,'4662-review-mapping.draft.json'),JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({species:r.species,inventory:r.inventory,mapped:r.mappingAudit.mapped,sourceErrors:r.mappingAudit.sourceErrors.length,missing:r.mappingAudit.missing,missingRefs:r.mappingAudit.missingReferences.length,empty:r.mappingAudit.emptyCategories.length,freezeMismatches:r.freezeAudit.filter(x=>!x.match).length}));}
module.exports={build45,sourceCheck,normalizedKey,referenceAudit,entrySources,sourceFiles,freezeAudit,basicDescription,categories,literalNames,sourceDir,read,readText,sha,root,out,P};
if(require.main===module)save45();
