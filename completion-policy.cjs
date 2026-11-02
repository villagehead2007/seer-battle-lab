'use strict';
// Development metadata only; never loaded by the battle engine.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const numericArgs = value => Array.isArray(value) && value.every(x=>typeof x==='number' && Number.isFinite(x));
function inventory(s) {
  const entries = [];
  for (const soul of s.souls ?? []) entries.push({key:`${s.id}:soul:${soul.id}`,kind:'soul',raw:soul,source:s.source});
  for (const move of s.moves ?? []) {
    entries.push({key:`${s.id}:move:${move.id}`,kind:'move',raw:move,source:s.source});
    (move.effectInstances ?? []).forEach((instance,index) => entries.push({key:`${s.id}:skill:${move.id}:${index}`,kind:'skill',raw:{instance,index,description:move.description,metadata:s.effects?.find(x=>x.id===instance.id)},source:{snapshot:s.source,skillRevision:move.revision}}));
  }
  return entries.map(x=>({...x,sourceDigest:digest(x)}));
}
// The generated deferred list is evidence to check, never a substitute reviewer.
function reviewCoverage(snapshot, reviews) {
  const entries=inventory(snapshot);
  const missing=entries.filter(e=>!reviews?.entries?.[e.key]);
  const stale=entries.filter(e=>reviews?.entries?.[e.key] && reviews.entries[e.key].sourceDigest!==e.sourceDigest);
  return {total:entries.length,missing,stale};
}
function entryLabel(entry) {
  return entry.kind==='skill'?`${entry.key} (effectId=${entry.raw.instance.id})`:entry.key;
}
function checkSource(entry, snapshot, root) {
  const errors=[],label=entryLabel(entry),source=entry.kind==='skill'?entry.source?.snapshot:entry.source;
  let validUrl=false;
  try { const url=new URL(source?.url);validUrl=url.protocol==='https:' && url.hostname==='api.seerapi.com'; } catch {}
  if(source?.provider!=='seerapi'||!validUrl||!nonempty(source?.revision)||!nonempty(source?.loadedAt)||!Number.isFinite(Date.parse(source.loadedAt))) errors.push(`${label}: source URL, revision and loadedAt required`);
  if(entry.kind==='soul') {
    if(!nonempty(entry.raw.hash)||!nonempty(entry.raw.description))errors.push(`${label}: soul source hash and description required`);
    // The archived 1896 response has an explicit null args field. Preserve it;
    // its reviewed constants come from the versioned description, not invented args.
    const preservedNull1896=snapshot.id===4695&&source?.revision==='d107f361'&&entry.key==='4695:soul:1896'&&entry.raw.args===null&&digest(entry.raw)==='2eda6d57e5f3deaeebaea801ff474adfc82f191300704779879293d6895237f5';
    if(!numericArgs(entry.raw.args)&&!preservedNull1896)errors.push(`${label}: soul instance parameters required (use [] for zero arguments)`);
  } else if(entry.kind==='move') {
    const move=entry.raw;
    if(!nonempty(move.revision)||!nonempty(move.hash))errors.push(`${label}: skill source revision and hash required`);
    if(!Array.isArray(move.effectIds)||!Array.isArray(move.effectInstances)||digest(move.effectIds)!==digest(move.effectInstances.map(x=>x.id))) errors.push(`${label}: effect IDs and ordered instances must match exactly`);
  } else {
    const {instance,metadata}=entry.raw;
    if(!nonempty(entry.source?.skillRevision)||!metadata||!nonempty(metadata.revision)||!nonempty(metadata.template))errors.push(`${label}: effect source revision and template required`);
    const move=snapshot?.moves?.find(m=>`${snapshot.id}:skill:${m.id}:${entry.raw.index}`===entry.key);
    let acceptedConflict=false;
    if(require('./dist/effect-registry.js').acceptsSourceParameterConflict(move,entry.raw.index,instance,metadata)){try{if(snapshot.id===4635&&instance.id===2175&&move.id===28707){const data=JSON.parse(fs.readFileSync(path.join(root,'research/4635-2175-user-confirmation.json'),'utf8'));acceptedConflict=snapshot.source.revision==='ed26a194'&&data.speciesId===4635&&data.sourceHash==='7dcb02d3'&&data.effectMetadataHash==='db31d57e'&&data.userAnswerVerbatim==='按两种附加'&&data.section.sectionOriginal.includes('我的回答：按两种附加')&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,data.document.original))).digest('hex')===data.document.sha256&&JSON.stringify(data.rawParameters)==='[3]'&&JSON.stringify(data.exactParameterConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(snapshot.id===4612&&instance.id===4&&move.id===20420){const data=JSON.parse(fs.readFileSync(path.join(root,'research/4612-4-user-confirmation-2026-10-28.json'),'utf8'));acceptedConflict=snapshot.source.revision==='eea9d0b0'&&data.speciesId===4612&&data.sourceHash==='28707a7b'&&data.effectMetadataHash==='cda7be9a'&&data.userAnswerVerbatim==='速度+1、命中+1'&&JSON.stringify(data.rawParameters)==='[4,100,1,5,100,1]'&&JSON.stringify(data.exactParameterConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(snapshot.id===4604&&instance.id===1767&&move.id===37124){const data=JSON.parse(fs.readFileSync(path.join(root,'research/next50-answer-takeover-2026-10-26T17-09-55-144Z/4604-user-confirmations.json'),'utf8')),b=data.parameterAuthorizations?.find(b=>b.key===entry.key),q=data.parameterClarification;acceptedConflict=snapshot.source.revision==='62baa303'&&data.speciesId===4604&&data.document==='research/BATCH-4509-NEXT50-待澄清问题精简版-2026-10-26-2133.md'&&data.sha256==='bfc6126b097517bc55e92b0eef7f990ba1c550c5ef79748b68daecf332896c84'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,data.document))).digest('hex')===data.sha256&&q?.questionId==='Q-N50-4600-001-4604-1767'&&q.answerOriginal==='是，0仅为冗余，按零参数语义执行'&&q.moveId===37124&&q.skillHash==='aaa27a62'&&q.effectId===1767&&q.index===0&&JSON.stringify(q.args)==='[0]'&&b?.sourceDigest===entry.sourceDigest&&b.rawDigest===digest(entry.raw)&&JSON.stringify(b.confirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(snapshot.id===4600&&[1538,464].includes(instance.id)){const data=JSON.parse(fs.readFileSync(path.join(root,'research/next50-answer-takeover-2026-10-26T17-09-55-144Z/4600-user-confirmations.json'),'utf8')),b=data.parameterAuthorizations?.find(b=>b.key===entry.key);acceptedConflict=snapshot.source.revision==='1706ff16'&&data.speciesId===4600&&data.sections?.some(q=>q.title.startsWith('## Q-N50-4600-001 ')&&q.answerOriginal==='是')&&data.document==='research/BATCH-4509-NEXT50-QUESTIONS.md'&&data.sha256==='c6c40072f5c0aa8ff8425cc83b3457b4ec641035102ef2872d74bd659c3c089c'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,data.document))).digest('hex')===data.sha256&&b?.sourceDigest===entry.sourceDigest&&b.rawDigest===digest(entry.raw)&&JSON.stringify(b.confirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(instance.id===4&&move.id===22079){const data=JSON.parse(fs.readFileSync(path.join(root,'research/4068-4-user-confirmation.json'),'utf8'));acceptedConflict=snapshot.id===4068&&snapshot.source.revision==='a239cba2'&&data.question==='Q-R3940-4068-002'&&data.answer==='无含义；授权'&&JSON.stringify(data.userConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(instance.id===440&&move.id===27163){const data=JSON.parse(fs.readFileSync(path.join(root,'research/4048-440-user-confirmation.json'),'utf8'));acceptedConflict=snapshot.id===4048&&snapshot.source.revision==='dd481bd8'&&data.question==='Q-R3940-4048-002'&&data.answer==='是，授权'&&JSON.stringify(data.userConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(instance.id===446){const data=JSON.parse(fs.readFileSync(path.join(root,'research/3549-user-confirmed-rules.json'),'utf8'));acceptedConflict=snapshot.id===3549&&snapshot.source.revision==='374e56e6'&&data.effect446?.answer==='是'&&JSON.stringify(data.effect446.userConfirmations?.[move.id])===JSON.stringify(move.sourceParameterConfirmation);}else if(instance.id===1767&&move.id===36391){const data=JSON.parse(fs.readFileSync(path.join(root,'research/4468-user-confirmed-rules.json'),'utf8')),b=data.parameterAuthorization,a=b?.scopeAuthorization;acceptedConflict=snapshot.id===4468&&snapshot.source.revision==='80f1440f'&&entry.key==='4468:skill:36391:4'&&entry.sourceDigest==='f17ef67e93771faebbb4248d3d49e8c876be4ba29c59242d6530e8fda0ac3a43'&&digest(entry.raw)==='5f2bac604beb9cd68b3fc6c1f098fce7f163575f227cb55791e9a63a64ee52d2'&&digest({key:entry.key,kind:entry.kind,raw:entry.raw,source:entry.source})===entry.sourceDigest&&b?.questionId==='Q-N20-4468-002'&&b.answer==='授权'&&b.key===entry.key&&b.sourceDigest===entry.sourceDigest&&b.rawDigest===digest(entry.raw)&&b.petHash==='80f1440f'&&b.skillHash==='f88eb61a'&&b.effectRevision==='seerapi:d25219b2'&&b.index===4&&JSON.stringify(b.args)==='[3,37]'&&data.answers?.some(q=>q.questionId==='Q-N20-4468-002'&&q.answerLines?.some(t=>t.split(/\r?\n/)[0].trim()==='我的回答：授权'))&&JSON.stringify(data.exactParameterConfirmation)===JSON.stringify(move.sourceParameterConfirmation)&&a?.file==='research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt'&&a.sha256==='ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.file))).digest('hex')===a.sha256;}else if(instance.id===58&&snapshot.id===4333){const data=JSON.parse(fs.readFileSync(path.join(root,'research/4333-58-user-confirmation.json'),'utf8'));acceptedConflict=snapshot.source.revision==='ad8a14b6'&&data.species===4333&&data.questionId==='Q-N20-4333-001'&&data.answer==='是，同样无意义；授权'&&data.effect58?.answer==='授权'&&JSON.stringify(data.effect58.userConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(instance.id===58&&snapshot.id===4289){const data=JSON.parse(fs.readFileSync(path.join(root,'research/4289-58-user-confirmation.json'),'utf8'));acceptedConflict=snapshot.source.revision==='43769952'&&data.species===4289&&data.questionId==='Q-A60-4289-081'&&data.answer==='授权'&&data.effect58?.answer==='授权'&&JSON.stringify(data.effect58?.userConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}else {const is2105=instance.id===2105,is58=instance.id===58,is1118=instance.id===1118;const record=is2105?'research/3516-user-confirmed-rules.json':is58?'research/3788-user-confirmed-rules.json':is1118?'research/3705-user-confirmed-rules.json':'research/3683-user-confirmed-rules.json';const data=JSON.parse(fs.readFileSync(path.join(root,record),'utf8'));const confirmation=is2105?data.effect2105?.userConfirmation:is58?data.effect58?.userConfirmation:is1118?data.effect1118?.userConfirmation:data.effect2496?.userConfirmation;acceptedConflict=(!is2105||(snapshot.id===3516&&snapshot.source.revision==='dfbdd74d'&&data.effect2105?.answer==='是'))&&(!is58||(snapshot.id===3788&&snapshot.source.revision==='46525787'&&data.effect58?.answer==='是，授权'))&&(!is1118||snapshot.id===3705)&&JSON.stringify(confirmation)===JSON.stringify(move.sourceParameterConfirmation);}}catch{}}
    if(snapshot.id===4677&&snapshot.source?.revision==='5342db4d'&&move?.id===28833&&move.hash==='7f4db27c'&&move.revision==='seerapi:7f4db27c'&&entry.raw.index===0&&instance.id===533&&metadata?.argsNum===0&&metadata.revision==='seerapi:731a9d8c'&&metadata.template==='消除双方能力提升、下降状态'&&JSON.stringify(instance.args)==='[0]')acceptedConflict=true;
    // Reuse only the exact already-confirmed 20420 definition for this saved 4747 source.
    if(snapshot.id===4747&&snapshot.source?.revision==='aee95cec'&&move?.id===20420&&move.hash==='28707a7b'&&move.revision==='seerapi:28707a7b'&&entry.raw.index===0&&instance.id===4&&metadata?.argsNum===3&&metadata.revision==='seerapi:cda7be9a'&&JSON.stringify(instance.args)==='[4,100,1,5,100,1]'&&require('./dist/effect-registry.js').acceptsSourceParameterConflict(move,0,instance,metadata)){
      try{const data=JSON.parse(fs.readFileSync(path.join(root,'research/4612-4-user-confirmation-2026-10-28.json'),'utf8'));acceptedConflict=data.speciesId===4612&&data.sourceHash==='28707a7b'&&data.effectMetadataHash==='cda7be9a'&&data.userAnswerVerbatim==='速度+1、命中+1'&&JSON.stringify(data.rawParameters)==='[4,100,1,5,100,1]'&&JSON.stringify(data.exactParameterConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}catch{/* Missing original evidence never authorizes a parameter conflict. */}
    }
    if(!acceptedConflict&&(!Number.isInteger(metadata?.argsNum)||metadata.argsNum<0||!numericArgs(instance.args)||instance.args.length!==metadata.argsNum))errors.push(`${label}: instance parameters must match source argsNum (including zero arguments)`);
  }
  return errors;
}
// Read literal named test calls without executing the test file. Ignore comments,
// strings and regex literals so a title/comment or another test cannot supply an
// assertion. Dynamic test factories still require a directly inspectable witness.
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
function checkReview(entry, review, root) {
  const errors=[];
  if (!review || review.sourceDigest!==entry.sourceDigest) return [`${entryLabel(entry)}: missing or stale semantic review`];
  if (!['single','mixed','multiplayer'].includes(review.scope) || !review.rationale?.trim() || !review.reviewedBy?.trim() || !review.reviewedAt) errors.push(`${entry.key}: semantic decision and reviewer required`);
  errors.push(...checkEnhancementScope(entry,review,root));
  if (entry.kind==='move' && review.scope==='multiplayer') errors.push(`${entry.key}: skill base behavior must be verified in single combat`);
  if (review.scope==='multiplayer' && nonempty(review.singleBehavior)) errors.push(`${entry.key}: single behavior declared in multiplayer review; mixed scope required`);
  if (review.scope!=='multiplayer' || nonempty(review.singleBehavior)) {
    if (!review.singleBehavior?.trim() || !Array.isArray(review.implementation) || !review.implementation.length) errors.push(`${entry.key}: single behavior/code evidence required`);
    for (const file of review.implementation??[]) if (!safeFile(root,file)) errors.push(`${entry.key}: implementation file missing: ${file}`);
    for (const branch of ['success','failure','boundary','interaction']) {
      const refs=review.tests?.[branch];
      if (!Array.isArray(refs)||!refs.length) {errors.push(`${entry.key}: ${branch} state assertion coverage required`);continue;}
      for (const ref of refs) {
        if (!nonempty(ref.assertion) || /^(success|failure|boundary|interaction)( state)?$/i.test(ref.assertion.trim()) || !nonempty(ref.name) || !safeFile(root,ref.file) || !/^tests\/.+\.test\.cjs$/.test(ref.file)) {errors.push(`${entry.key}: invalid ${branch} test reference (specific state assertion required)`);continue;}
        const text=fs.readFileSync(path.join(root,ref.file),'utf8');
        if (!namedAssertionTest(text,ref.name)) errors.push(`${entry.key}: named assertion test missing: ${branch} ${ref.file} :: ${ref.name}`);
      }
    }
  }
  if (review.scope!=='single' && (!review.deferredBehavior?.trim() || !review.trigger?.trim() || !Array.isArray(review.futureMechanisms) || !review.futureMechanisms.length)) errors.push(`${entry.key}: deferred branch, trigger and future mechanisms required`);
  return errors;
}
// Unlocking a personal enhancement is not a team event. Require a quotation
// from this item's source, rather than accepting a reviewer-invented dependency.
function checkEnhancementScope(entry,review,root) {
  if(!['mixed','multiplayer'].includes(review.scope))return [];
  const raw=entry.raw,sourceText=entry.kind==='skill'
    ? [raw.instance?.description,raw.metadata?.template,raw.description].filter(nonempty).join('\n')
    : [raw.description,raw.desc_formatting_adjustment,raw.analyze_desc].filter(nonempty).join('\n');
  const labels=[JSON.stringify(raw),review.rationale,review.deferredBehavior,review.trigger,...(review.futureMechanisms??[])].join('\n');
  if(!/伙伴|羁绊|觉醒|partner|bond|awakening/i.test(labels)&&!['4354:skill:35793:3','4354:skill:38348:4','4364:skill:35846:3','4364:skill:37340:3','4400:skill:28030:2','4400:skill:28031:2','4501:skill:36289:0','4501:skill:36566:1'].includes(entry.key)&&!(review.userConfirmation==='research/4501-user-confirmed-rules.json'&&raw.instance?.id===1827))return [];
  const dependencies={
    'team-members':/队伍成员|队友|队伍中|背包中|同队/,
    bench:/替补精灵|替补|后备精灵/,
    'next-entry':/下(?:一|1)?只.{0,12}(?:出场|登场)|(?:出场|登场).{0,12}下(?:一|1)?只/,
    switch:/换宠|切换精灵|切换下场|切换上场/,
    'off-field':/场下精灵|场下|不在场/,
    'team-state':/队伍数量|队伍共享|队伍.{0,12}(?:数量|存活|共享)|存活精灵数量|(?:己方|我方|对方|敌方|对手)每存活[1一]只精灵/
  };
  const evidence=review.dependencyEvidence;
  // User-authorized, exact-source compatibility for the literal re-entry phrase.
  // This accepts only the repeated-entry branch, never the personal enhancement.
  let confirmedReentry=false;
  const reentryDigest='9cd56535d91ea3b05e1c6d2853e2d43390fd061a127b2c7922a84a08fec1df3f';
  if(entry.key==='3741:skill:29246:0'&&entry.kind==='skill'&&review.scope==='mixed'&&
    entry.raw.index===0&&entry.raw.instance?.id===2395&&Array.isArray(entry.raw.instance.args)&&entry.raw.instance.args.length===0&&
    entry.raw.metadata?.revision==='seerapi:7fa94b67'&&entry.source?.skillRevision==='seerapi:da5a5b91'&&entry.source?.snapshot?.revision==='6fa1f52a'&&
    entry.sourceDigest===reentryDigest&&digest({key:entry.key,kind:entry.kind,raw:entry.raw,source:entry.source})===reentryDigest&&
    evidence?.length===1&&evidence[0].kind==='switch'&&evidence[0].quote==='每次登场时'&&sourceText.includes('每次登场时')&&
    review.userConfirmation==='research/3741-user-confirmed-rules.json'){
    try{const authorization=JSON.parse(fs.readFileSync(path.join(root,'research/3741-user-confirmed-rules.json'),'utf8')).reentryValidationAuthorization;
      confirmedReentry=authorization?.answer==='授权上述精确兼容'&&authorization.binding?.key===entry.key&&authorization.binding?.sourceDigest===reentryDigest&&
        authorization.binding?.skillRevision===entry.source.skillRevision&&authorization.binding?.effectRevision===entry.raw.metadata.revision&&
        authorization.binding?.skillId===29246&&authorization.binding?.effectId===2395&&authorization.binding?.instanceIndex===0&&
        Array.isArray(authorization.binding?.args)&&authorization.binding.args.length===0&&authorization.binding?.petRevision==='6fa1f52a'&&authorization.binding?.quote==='每次登场时';
    }catch{/* Missing, unreadable or changed authorization never grants compatibility. */}
  }
  const valid=Array.isArray(evidence)&&evidence.length&&evidence.every(e=>
    dependencies[e?.kind]&&nonempty(e.quote)&&sourceText.includes(e.quote)&&
    dependencies[e.kind].test(e.quote)&&!/(?:不|无|无需|不必)(?:依赖|需要|要求)/.test(e.quote));
  // Explicitly authorized literal “出战” compatibility, bound to two source instances.
  const nightEntries={
    '3883:skill:33388:2':['021841e0a97a5a22f416aaa9fed5e56c90a544b4246812306abcc6e08e30d46d','seerapi:9855f219',2],
    '3883:skill:37336:3':['82e086a47666afd9454e0cfbeafe6f217c930a9ed8b0e122d0fd473886390f45','seerapi:da8e73b9',3]
  },night=nightEntries[entry.key];
  let confirmedNightEntry=false;
  if(night&&entry.kind==='skill'&&review.scope==='multiplayer'&&entry.sourceDigest===night[0]&&
    digest({key:entry.key,kind:entry.kind,raw:entry.raw,source:entry.source})===night[0]&&
    raw.index===night[2]&&raw.instance?.id===840&&JSON.stringify(raw.instance.args)==='[3]'&&
    raw.metadata?.revision==='seerapi:e93bb261'&&entry.source?.skillRevision===night[1]&&entry.source?.snapshot?.revision==='6db1cc33'&&
    evidence?.length===1&&evidence[0].kind==='next-entry'&&evidence[0].quote==='对方下只精灵出战时'&&sourceText.includes(evidence[0].quote)&&
    review.userConfirmation==='research/3883-user-confirmed-rules.json'){
    try{
      const authorization=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')).dependencyCompatibilityAuthorization;
      const binding=authorization?.bindings?.find(x=>x.key===entry.key);
      confirmedNightEntry=authorization?.answer==='授权上述两条精确兼容'&&binding?.sourceDigest===night[0]&&
        binding?.skillRevision===night[1]&&binding?.effectRevision==='seerapi:e93bb261'&&binding?.petRevision==='6db1cc33'&&
        binding?.index===night[2]&&JSON.stringify(binding?.args)==='[3]'&&binding?.quote==='对方下只精灵出战时';
    }catch{/* Missing or changed authorization does not grant compatibility. */}
  }
  // Q-A60-4004-008: only these two exact original source instances were authorized.
  let confirmedHolyEntry=false;
  if(['4004:soul:2121','4004:skill:38473:4'].includes(entry.key)&&review.scope==='mixed'&&
    review.userConfirmation==='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json'){
    try{
      const confirmation=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8'));
      const answer=confirmation.confirmations.find(x=>x.questionId==='Q-A60-4004-008');
      const binding=confirmation.instanceBindings?.[entry.key];
      const soul=entry.key==='4004:soul:2121';
      confirmedHolyEntry=answer?.answerLines?.some(x=>x.line==='我的回答：全部授权')&&
        binding?.sourceDigest===entry.sourceDigest&&binding?.rawDigest===digest(raw)&&
        binding?.questionId==='Q-A60-4004-008'&&binding?.petRevision==='ad8c1c08'&&
        (soul?raw.id===2121&&raw.hash==='33a5fd64'&&raw.eid===2532&&JSON.stringify(raw.args)==='[1,0]':
          raw.index===4&&raw.instance.id===2551&&JSON.stringify(raw.instance.args)==='[]'&&
          raw.metadata.revision==='seerapi:55101364'&&entry.source.skillRevision==='seerapi:f32461b3')&&
        evidence?.length===1&&evidence[0].kind===(soul?'switch':'next-entry')&&
        evidence[0].quote===(soul?'自身登场时，获得1道神圣之霆':'对方下只精灵属性技能命中效果失效')&&sourceText.includes(evidence[0].quote);
    }catch{/* Missing or altered authorization/source binding is rejected. */}
  }
  let confirmedLeonPreviousAlly=false;
  if(entry.key==='4125:skill:29253:1'&&review.scope==='mixed'&&review.userConfirmation==='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json'){
    try{
      const confirmation=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8'));
      const answer=confirmation.confirmations.find(x=>x.questionId==='Q-A60-4004-008'),binding=confirmation.instanceBindings?.[entry.key];
      confirmedLeonPreviousAlly=answer?.answerLines?.some(x=>x.line==='我的回答：全部授权')&&binding?.questionId==='Q-A60-4004-008'&&
        binding?.sourceDigest===entry.sourceDigest&&binding?.rawDigest===digest(raw)&&entry.source.snapshot.revision==='7bc78158'&&
        entry.source.skillRevision==='seerapi:b1ae7b1f'&&raw.index===1&&raw.instance.id===2398&&JSON.stringify(raw.instance.args)==='[1,3]'&&
        raw.metadata.revision==='seerapi:4dcf3d4b'&&evidence?.length===1&&evidence[0].kind==='previous-ally'&&
        evidence[0].quote==='己方上只在场精灵'&&sourceText.includes(evidence[0].quote);
    }catch{/* No authorization or changed source cannot grant compatibility. */}
  }
  // Q-A60-4216-089: one authorized cross-source shared-resource dependency.
  let confirmedLachesisSword=false;
  const swordDigest='3a1c98ee6e8385bc1eae318ca82035a2d0752c7c3ef48535a7b8c46e12806e48';
  if(entry.key==='4216:skill:38454:4'&&entry.kind==='skill'&&review.scope==='multiplayer'&&
    entry.sourceDigest===swordDigest&&digest({key:entry.key,kind:entry.kind,raw,source:entry.source})===swordDigest&&
    entry.source?.snapshot?.revision==='8ec9e12d'&&entry.source?.skillRevision==='seerapi:9bf352ae'&&
    raw.index===4&&raw.instance?.id===2446&&JSON.stringify(raw.instance.args)==='[]'&&raw.metadata?.revision==='seerapi:337b0037'&&
    evidence?.length===1&&evidence[0].kind==='team-resource'&&evidence[0].quote==='己方序数最高的圣剑'&&sourceText.includes(evidence[0].quote)&&
    review.userConfirmation==='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json'&&
    review.additionalResourceEvidence==='research/4321-SHARED-SWORDS-SOURCE-ADDENDUM.json'){
    try{
      const c=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')),
        q=c.confirmations.find(x=>x.questionId==='Q-A60-4216-089'),b=c.instanceBindings?.[entry.key],
        a=JSON.parse(fs.readFileSync(path.join(root,review.additionalResourceEvidence),'utf8')),
        owner=JSON.parse(fs.readFileSync(path.join(root,'research/4216-sword-owner-api-source.json'),'utf8'));
      confirmedLachesisSword=q?.answerLines?.some(x=>x.line==='我的回答：授权')&&b?.questionId==='Q-A60-4216-089'&&
        b.sourceDigest===swordDigest&&b.rawDigest===digest(raw)&&
        a.soul?.id===1547&&a.soul.hash==='2a1c0673'&&owner.records?.some(x=>x.url==='https://api.seerapi.com/v1/soulmark/1547'&&x.data?.id===1547&&x.data.hash==='2a1c0673')&&
        a.skill1758?.id===27840&&a.skill1758.hash==='761cb9c4'&&a.skill1763?.id===35620&&a.skill1763.hash==='c031b2d0'&&
        b.resourceEvidenceDigest===digest(a)&&b.ownerEvidenceDigest===digest(owner)&&b.dependencyEvidenceDigest===digest(evidence);
    }catch{/* Absent authorization or altered source evidence never grants this exception. */}
  }
  // Q-N20-4354-008 plus scoped preauthorization: two unchanged source instances only.
  let confirmedSandTeamInvalid=false;
  const sandEntries={'4354:skill:35793:3':['seerapi:e0502df4',3],'4354:skill:38348:4':['seerapi:3bc89db0',4]},sand=sandEntries[entry.key];
  if(sand&&entry.kind==='skill'&&review.scope==='mixed'&&review.userConfirmation==='research/4354-new-details-user-confirmation.json'&&
    entry.source?.snapshot?.revision==='5f80b53'&&entry.source?.skillRevision===sand[0]&&raw.index===sand[1]&&
    raw.instance?.id===1128&&JSON.stringify(raw.instance.args)==='[1]'&&raw.metadata?.revision==='seerapi:1b3b7422'&&
    digest({key:entry.key,kind:entry.kind,raw,source:entry.source})===entry.sourceDigest&&evidence?.length===1&&
    evidence[0].kind==='team-state'&&evidence[0].quote==='对手整个队伍继承；首次实际使用攻击技能时消耗并无效'){
    try{
      const confirmation=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')),binding=confirmation.instanceBindings?.[entry.key];
      const authorization=binding?.scopeAuthorization;
      confirmedSandTeamInvalid=confirmation.answers?.some(x=>x.questionId==='Q-N20-4354-008'&&x.originalAnswer===evidence[0].quote)&&
        binding?.questionId==='Q-N20-4354-008'&&binding.sourceDigest===entry.sourceDigest&&binding.rawDigest===digest(raw)&&
        binding.petRevision==='5f80b53'&&binding.skillRevision===sand[0]&&binding.effectRevision==='seerapi:1b3b7422'&&
        binding.index===sand[1]&&JSON.stringify(binding.args)==='[1]'&&authorization?.file==='research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt'&&
        authorization.sha256==='ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d'&&
        crypto.createHash('sha256').update(fs.readFileSync(path.join(root,authorization.file))).digest('hex')===authorization.sha256;
    }catch{/* Missing or altered confirmation, authorization or source never grants compatibility. */}
  }
  // Q4364-006 historical explicit answer + scoped preauthorization, exact sources only.
  let confirmedYuliNext=false;
  const yuliEntries={'4364:skill:35846:3':['seerapi:363e35f',1],'4364:skill:37340:3':['seerapi:486b4118',2]},yuli=yuliEntries[entry.key];
  if(yuli&&entry.kind==='skill'&&review.scope==='multiplayer'&&review.userConfirmation==='research/4364-user-confirmed-rules.json'&&entry.source?.snapshot?.revision==='61778870'&&entry.source?.skillRevision===yuli[0]&&raw.index===3&&raw.instance?.id===1090&&JSON.stringify(raw.instance.args)===JSON.stringify([yuli[1]])&&raw.metadata?.revision==='seerapi:9c49fdb'&&digest({key:entry.key,kind:entry.kind,raw,source:entry.source})===entry.sourceDigest&&evidence?.length===1&&evidence[0].kind==='next-entry'&&evidence[0].quote==='下一只真实对手，持续击败后的下'+yuli[1]+'回合'){
    try{const confirmation=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')),binding=confirmation.instanceBindings?.[entry.key],authorization=binding?.scopeAuthorization,audit=JSON.parse(fs.readFileSync(path.join(root,confirmation.historicalEvidence),'utf8'));
      confirmedYuliNext=confirmation.historicalRetainedAnswers?.['Q-N20-4364-006']==='是；授权'&&confirmation.historicalEvidenceSha256==='b5193f4bc3ebae81d9207f3ad4b306fe673683fd19bb5b400b7f33c963500a3b'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,confirmation.historicalEvidence))).digest('hex')==='b5193f4bc3ebae81d9207f3ad4b306fe673683fd19bb5b400b7f33c963500a3b'&&audit.threadId==='01a16468-012c-7f52-b1c9-7f4717b6b13e'&&audit.turnId==='01a16468-06ac-79c1-86ed-72442d6c8431'&&audit.bindings?.some(x=>x.questionId==='Q-N20-4364-006'&&x.previousAnswerQuoted==='是；授权')&&binding?.questionId==='Q-N20-4364-006'&&binding.sourceDigest===entry.sourceDigest&&binding.rawDigest===digest(raw)&&binding.petRevision==='61778870'&&binding.skillRevision===yuli[0]&&binding.effectRevision==='seerapi:9c49fdb'&&binding.index===3&&JSON.stringify(binding.args)===JSON.stringify([yuli[1]])&&authorization?.file==='research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt'&&authorization.sha256==='ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,authorization.file))).digest('hex')===authorization.sha256;
    }catch{/* Altered source/confirmation never grants compatibility. */}
  }
  let confirmedYuliOtherEntry=false;
  const yuliSouls={'4364:soul:1588':['d3a9f290',[100,120,1]],'4364:soul:2080':['fa61a6cf',[101,120,1]]},ys=yuliSouls[entry.key];
  if(ys&&entry.kind==='soul'&&review.scope==='mixed'&&review.userConfirmation==='research/4364-user-confirmed-rules.json'&&entry.source?.revision==='61778870'&&raw.hash===ys[0]&&raw.eid===1950&&JSON.stringify(raw.args)===JSON.stringify(ys[1])&&digest({key:entry.key,kind:entry.kind,raw,source:entry.source})===entry.sourceDigest&&evidence?.length===1&&evidence[0].kind==='team-members'&&evidence[0].quote==='己方其他精灵首次出战时'&&sourceText.includes(evidence[0].quote)){
    try{const c=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')),b=c.instanceBindings?.[entry.key],a=b?.scopeAuthorization;confirmedYuliOtherEntry=b?.sourceDigest===entry.sourceDigest&&b.rawDigest===digest(raw)&&a?.file==='research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt'&&a.sha256==='ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.file))).digest('hex')===a.sha256;}catch{}
  }
  let confirmedYuliBackpack=false;
  if(entry.key==='4364:skill:27950:0'&&entry.kind==='skill'&&review.scope==='mixed'&&review.userConfirmation==='research/4364-user-confirmed-rules.json'&&entry.source?.snapshot?.revision==='61778870'&&entry.source?.skillRevision==='seerapi:67904d5a'&&raw.index===0&&raw.instance?.id===1669&&JSON.stringify(raw.instance.args)==='[1,20]'&&raw.metadata?.revision==='seerapi:9889e8ad'&&digest({key:entry.key,kind:entry.kind,raw,source:entry.source})===entry.sourceDigest&&evidence?.length===1&&evidence[0].kind==='bench'&&evidence[0].quote==='自身背包内每存活1只精灵'&&sourceText.includes(evidence[0].quote)){
    try{const c=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')),b=c.instanceBindings?.[entry.key],a=b?.scopeAuthorization;confirmedYuliBackpack=b?.sourceDigest===entry.sourceDigest&&b.rawDigest===digest(raw)&&a?.file==='research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt'&&a.sha256==='ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.file))).digest('hex')===a.sha256;}catch{}
  }
  // Already-associated 4400 sources: preserve source wording and bind each distinct public answer.
  let confirmedSwordTeamLock=false;
  const swordLocks={'4400:skill:28030:2':['seerapi:e5af0d7d',1128,'seerapi:1b3b7422','Q-N20-4354-008','对手整个队伍继承；首次实际使用攻击技能时消耗并无效'],'4400:skill:28031:2':['seerapi:8e13cc2',1827,'seerapi:8a3d6982','Q-N20-4501-001','对手整个队伍都继承；只要对手上场精灵使用了属性就消耗这次次数并无效之']},sl=swordLocks[entry.key];
  if(sl&&entry.kind==='skill'&&review.scope==='mixed'&&review.userConfirmation==='research/4400-user-confirmed-rules.json'&&entry.source?.snapshot?.revision==='a0ef0c14'&&entry.source?.skillRevision===sl[0]&&raw.index===2&&raw.instance?.id===sl[1]&&JSON.stringify(raw.instance.args)==='[1]'&&raw.metadata?.revision===sl[2]&&digest({key:entry.key,kind:entry.kind,raw,source:entry.source})===entry.sourceDigest&&evidence?.length===1&&evidence[0].kind==='team-state'&&evidence[0].quote===sl[4]){
    try{const c=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')),b=c.instanceBindings?.[entry.key],a=c.scopeAuthorization;
      confirmedSwordTeamLock=c.answers?.some(x=>x.questionId===sl[3]&&x.originalAnswer===sl[4])&&b?.questionId===sl[3]&&b.sourceDigest===entry.sourceDigest&&b.rawDigest===digest(raw)&&b.petRevision==='a0ef0c14'&&b.skillRevision===sl[0]&&b.effectRevision===sl[2]&&b.index===2&&JSON.stringify(b.args)==='[1]'&&a?.file==='research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt'&&a.sha256==='ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.file))).digest('hex')===a.sha256;
    }catch{/* Source or answer mismatch retains the strict dependency requirement. */}
  }
  // Exact4501 publicanswer scope; original4400 source checks remain untouched.
  const lock4501={'4501:skill:36289:0':['seerapi:e33544d2',0],'4501:skill:36566:1':['seerapi:612aed0f',1]}[entry.key];
  if(lock4501&&entry.kind==='skill'&&review.scope==='mixed'&&review.userConfirmation==='research/4501-user-confirmed-rules.json'&&entry.source?.snapshot?.revision==='d4895ef3'&&entry.source?.skillRevision===lock4501[0]&&raw.index===lock4501[1]&&raw.instance?.id===1827&&JSON.stringify(raw.instance.args)==='[1]'&&raw.metadata?.revision==='seerapi:8a3d6982'&&digest({key:entry.key,kind:entry.kind,raw,source:entry.source})===entry.sourceDigest&&evidence?.length===1&&evidence[0].kind==='team-state'&&evidence[0].quote==='对手整个队伍都继承；只要对手上场精灵使用了属性就消耗这次次数并无效之'){
    try{const c=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8')),b=c.instanceBindings?.[entry.key],a=c.scopeAuthorization;confirmedSwordTeamLock=c.answers?.some(x=>x.questionId==='Q-N20-4501-001'&&x.originalAnswer==='对手整个队伍都继承；只要对手上场精灵使用了属性就消耗这次次数并无效之')&&b?.questionId==='Q-N20-4501-001'&&b.sourceDigest===entry.sourceDigest&&b.rawDigest===digest(raw)&&b.petRevision==='d4895ef3'&&b.skillRevision===lock4501[0]&&b.effectRevision==='seerapi:8a3d6982'&&b.index===lock4501[1]&&JSON.stringify(b.args)==='[1]'&&a?.file==='research/FIXED50-SCOPED-PREAUTHORIZATION.2026-10-23.txt'&&a.sha256==='ddbaf0b109478e45d1ad3263f87fafcd0a62640863609d648aa1d031a1a2142d'&&crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.file))).digest('hex')===a.sha256;}catch{}
  }
  return (valid||confirmedReentry||confirmedNightEntry||confirmedHolyEntry||confirmedLeonPreviousAlly||confirmedLachesisSword||confirmedSandTeamInvalid||confirmedYuliNext||confirmedYuliOtherEntry||confirmedYuliBackpack||confirmedSwordTeamLock)?[]:[`${entry.key}: partner/bond/awakening enhancement cannot be deferred without explicit source-backed team dependencyEvidence; personal enhancement requires single-stage state assertions`];
}
function safeFile(root,file) {
  if(typeof file!=='string'||path.isAbsolute(file))return false;
  const full=path.resolve(root,file),relative=path.relative(root,full);
  return relative&&!relative.startsWith('..')&&fs.existsSync(full)&&fs.statSync(full).isFile();
}
function validateCoverage(snapshot, reviews, todo, root, complete=false) {
  const failures=[];
  const relevant=inventory(snapshot);
  for(const entry of relevant) {
    failures.push(...checkSource(entry,snapshot,root));
    const review=reviews?.entries?.[entry.key];
    failures.push(...checkReview(entry,review,root));
    const rows=(todo?.records??[]).filter(x=>x.key===entry.key);
    if(review && review.scope!=='single') {
      if(rows.length!==1||rows[0]?.sourceDigest!==entry.sourceDigest||rows[0]?.reviewStatus!=='reviewed') failures.push(`${entry.key}: exactly one current reviewed multiplayer record required`);
      for(const row of rows) {
        if(row.scope!==review.scope||digest(row.raw)!==digest(entry.raw)||!nonempty(row.source?.url)||!nonempty(row.source?.revision)||!nonempty(row.description)||!nonempty(row.trigger)||!Array.isArray(row.futureMechanisms)||!row.futureMechanisms.length) failures.push(`${entry.key}: incomplete or inconsistent multiplayer evidence`);
      }
      if(complete)failures.push(`${entry.key}: multiplayer branch remains deferred`);
    }
    if(review?.scope==='single' && rows.length)failures.push(`${entry.key}: single review conflicts with deferred multiplayer record`);
  }
  return failures;
}
module.exports={inventory,checkReview,validateCoverage,reviewCoverage,entryLabel,digest};
