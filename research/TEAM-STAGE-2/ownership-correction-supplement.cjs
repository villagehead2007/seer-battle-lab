'use strict';
// Finite, source-bound admission of the user-confirmed ownership corrections.
// This does not certify current native prerequisites or replace final audit gates.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),P=require('../../completion-policy.cjs'),C=require('./complete-evidence.cjs');
const root=path.resolve(__dirname,'../..'),manifestPath='research/TEAM-STAGE-2/ownership-correction-supplement-v10.json',bytes=fs.readFileSync(path.join(root,manifestPath)),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
if(sha(bytes)!=='c840e72ac1dab92e39d3b9f6380f956881d7038122f96597bbb134d86f4578c9')throw Error('Ownership supplement manifest changed without qualified revision');
const manifest=JSON.parse(bytes);if(manifest.id!=='ownership-corrections-20261118-v10'||Object.keys(manifest.entries).length!==80||manifest.newRows!==75||manifest.revisedOldRows!==5)throw Error('Ownership supplement exact scope mismatch');
const {assertHistoricalInput}=require('./historical-evidence-file.cjs');
for(const[file,hash]of Object.entries(manifest.evidenceFiles))assertHistoricalInput(file,hash);
function qualify(row,expected,formal,review,entry,anchors){
 const approved=manifest.entries[row.key];if(!approved)return null;
 const issues=[],requireMatch=(ok,message)=>{if(!ok)issues.push(row.key+': ownership supplement '+message);};
 requireMatch(!!formal&&!!review&&!!entry&&!!expected,'current source or evidence missing');if(!formal||!review||!entry||!expected)return{qualified:false,issues};
 requireMatch(row.sourceDigest===approved.sourceDigest&&entry.sourceDigest===approved.sourceDigest&&review.sourceDigest===approved.sourceDigest&&formal.sourceDigest===approved.sourceDigest,'source digest mismatch');
 requireMatch(row.scope===approved.scope&&review.scope===approved.scope&&expected.scope===approved.scope,'scope mismatch');
 requireMatch(C.binding(row)===approved.currentBinding&&C.binding(expected)===approved.currentBinding,'current source binding mismatch');
 requireMatch(formal.ownershipSupplementId===manifest.id&&formal.ownershipCurrentBinding===approved.currentBinding,'qualification id or current binding missing/mismatched');
 const anchor=anchors[row.key];requireMatch(approved.originalBinding===(anchor?.binding??null),'immutable original binding mismatch');requireMatch(formal.binding===(anchor?.binding??approved.currentBinding),'original or new formal binding mismatch');
 const primaryEvidence={sourceDigest:review.sourceDigest,scope:review.scope,singleBehavior:review.singleBehavior,tests:review.tests,implementation:review.implementation},formalEvidence={sourceDigest:formal.sourceDigest,behavior:formal.behavior,tests:formal.tests,implementation:formal.implementation,ownershipCurrentBinding:formal.ownershipCurrentBinding};
 requireMatch(P.digest(primaryEvidence)===approved.primaryEvidenceDigest,'primary source/native evidence changed');requireMatch(P.digest(formalEvidence)===approved.formalEvidenceDigest,'formal source/native evidence changed');
 return{qualified:issues.length===0,issues};
}
module.exports={qualify,requiredKeysForSnapshot:id=>Object.keys(manifest.entries).filter(key=>Number(key.split(':')[0])===Number(id)),inputFiles:[manifestPath,...Object.keys(manifest.evidenceFiles)]};
