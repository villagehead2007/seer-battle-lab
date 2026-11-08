'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),base=path.resolve(__dirname,'..'),file=path.join(base,'run-final-gates.cjs'),original=fs.readFileSync(file,'utf8'),definitions=fs.readFileSync(path.join(__dirname,'reuse-v6-definitions.fragment.txt'),'utf8'),stage=fs.readFileSync(path.join(__dirname,'reuse-v6-stage.fragment.txt'),'utf8');
const start=original.indexOf('(async()=>{const batch='),end=original.indexOf('state.checkpointRetries=[];',start);assert(start>0&&end>start);
let code=original.slice(0,start)+stage+original.slice(end);
const inputMarker='const inputs=Object.fromEntries(collect()',returnMarker='return [...files].sort();}',writeMarker='fs.writeFileSync(manifestFile,';
assert.equal(code.split(inputMarker).length,2);code=code.replace(inputMarker,definitions+'\n'+inputMarker);
assert.equal(code.split(returnMarker).length,2);code=code.replace(returnMarker,"add(path.join(base,'run-final-gates.cjs'));for(const f of reuseEvidenceInputs){const full=path.resolve(f);if(!inside(full)||!fs.existsSync(full)||!fs.statSync(full).isFile())throw Error('Invalid reuse evidence '+f);files.add(full);}"+returnMarker);
assert.equal(code.split(writeMarker).length,2);code=code.replace(writeMarker,"const reuseVerification=verifyUnchangedPreflightInputs(inputs);if(process.argv.includes('--verify-only')){console.log(JSON.stringify({verified:true,preflights:reuseVerification.preflights.length,provenance:reuseVerification.provenance}));process.exit(0);}"+writeMarker);
const output=path.join(base,'run-stale-test-recovery.cjs');fs.writeFileSync(output,code,{flag:'wx'});console.log({created:output,changedRuntime:false});
