'use strict';
const P=require('../../completion-policy.cjs'),C=require('./complete-evidence.cjs'),{build}=require('../build-multiplayer-todo.cjs');
const fs=require('fs'),path=require('path'),crypto=require('crypto'),anchorFile=path.join(__dirname,'round202-before-current-adoption-complete-reviews.json'),anchorBytes=fs.readFileSync(anchorFile);
if(crypto.createHash('sha256').update(anchorBytes).digest('hex')!=='b0a630aac7383978cfa8a46b2079d32eca0eb3c0a01776cd8265b4de7ec42b4b')throw Error('Immutable canonical proof archive changed');
const anchors=JSON.parse(anchorBytes).entries;
const ownershipSupplement=require('./ownership-correction-supplement.cjs');
// Current semantic classification and immutable canonical evidence serve different
// purposes. Validate each independently; never regenerate or rewrite either ledger.
function validate(snapshot,reviews,todo,root,formalReviews){
  const failures=[],inventory=P.inventory(snapshot),entries=new Map(inventory.map(e=>[e.key,e])),generated=build([snapshot],reviews).records,generatedByKey=new Map(generated.map(r=>[r.key,r])),currentRows=generated.filter(r=>reviews.entries[r.key]?.scope!=='single');
  failures.push(...P.validateCoverage(snapshot,reviews,{...todo,records:currentRows},root,false));
  const canonical=(todo?.records??[]).filter(r=>r.speciesId===snapshot.id),actualByKey=new Map();
  for(const row of canonical){if(actualByKey.has(row.key))failures.push(row.key+': duplicate canonical record');actualByKey.set(row.key,row);}
  const requiredKeys=Object.keys(anchors).filter(key=>Number(key.split(':')[0])===snapshot.id);
  for(const key of requiredKeys){
    if(!actualByKey.has(key))failures.push(key+': canonical formal record missing');
    if(!formalReviews[key]||formalReviews[key].binding!==anchors[key].binding||formalReviews[key].sourceDigest!==anchors[key].sourceDigest)failures.push(key+': original canonical proof binding changed or missing');
  }
  for(const key of ownershipSupplement.requiredKeysForSnapshot(snapshot.id))if(!actualByKey.has(key))failures.push(key+': supplemental canonical record missing');
  for(const row of canonical){
    const entry=entries.get(row.key),expected=generatedByKey.get(row.key),formal=formalReviews[row.key],review=reviews.entries[row.key];
    if(!entry||!expected||!formal||!review){failures.push(row.key+': canonical source or formal binding missing');continue;}
    const ownership=ownershipSupplement.qualify(row,expected,formal,review,entry,anchors);
    if(ownership)failures.push(...ownership.issues);
    if(!anchors[row.key]&&!ownership?.qualified)failures.push(row.key+': canonical record is outside the qualified original and supplemental bindings');
    for(const field of['key','speciesId','speciesName','kind','skillId','ruleId','instanceIndex','sourceDigest','raw','source'])if(P.digest([row[field]])!==P.digest([expected[field]]))failures.push(row.key+': canonical source field mismatch '+field);
    if(row.sourceDigest!==entry.sourceDigest||formal.sourceDigest!==entry.sourceDigest)failures.push(row.key+': canonical source digest mismatch');
    if(row.stageTwo?.sourceDigest&&row.stageTwo.sourceDigest!==entry.sourceDigest)failures.push(row.key+': stage-two source digest mismatch');
    // Original descriptions remain anchored by the archived binding. Current
    // descriptions/trigger/future-mechanism wording are checked by checkReview
    // above; a genuine scope change additionally needs its explicit reconciliation.
    if(row.scope!==expected.scope&&(row.stageTwo?.canonicalBindingPreserved!==true||row.stageTwo?.currentSemanticScope!==review.scope))failures.push(row.key+': current semantic classification lacks explicit preserved-canonical reconciliation');
    failures.push(...C.reviewIssues(row,ownership?.qualified?{...formal,binding:formal.ownershipCurrentBinding}:formal,(_key,evidence)=>P.checkReview(entry,{...evidence,scope:'single',rationale:evidence.behavior,singleBehavior:entry.raw.instance?.description||entry.raw.description||evidence.behavior},root)));
  }
  for(const row of currentRows){
    if(formalReviews[row.key])continue;
    const entry=entries.get(row.key);
    if(entry?.kind!=='move'||!entry.raw.effectInstances?.length||entry.raw.deferredEffects?.length){failures.push(row.key+': current multiplayer source has no canonical proof or qualified instance composition');continue;}
    let teamComponents=0;
    for(let index=0;index<entry.raw.effectInstances.length;index++){
      const key=snapshot.id+':skill:'+entry.raw.id+':'+index,child=entries.get(key),review=reviews.entries[key];
      if(!child||!review){failures.push(key+': parent component source review missing');continue;}
      failures.push(...P.checkReview(child,review,root));
      if(review.scope!=='single'){teamComponents++;if(!formalReviews[key]||!actualByKey.has(key)||formalReviews[key].sourceDigest!==child.sourceDigest)failures.push(key+': parent multiplayer component lacks matching canonical formal proof');}
    }
    if(!teamComponents)failures.push(row.key+': parent composition has no verified multiplayer component');
  }
  return failures;
}
module.exports={validate};
