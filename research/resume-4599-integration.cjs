'use strict';
const fs=require('fs'),assert=require('assert/strict');
const p='tests/next50-4599-soul.test.cjs';let t=fs.readFileSync(p,'utf8');
const old='compileInstances([src.effectInstances[i]],raw.effects,src)';assert.equal(t.split(old).length-1,1);
t=t.replace(old,'compileInstances(src.effectInstances,raw.effects,src)').replace("assert.equal(compiled.issue,'');const o=turn(s,c=>{E.WIKI.effectsEngine.run('afterHit',compiled.operations,","assert.equal(compiled.issue,'');const o=turn(s,c=>{E.WIKI.effectsEngine.run('afterHit',compiled.operations.filter(op=>op.index===i),");fs.writeFileSync(p,t);
const d='research/parallel-drafts/next50-4599-skills/late-ko-correction/';let s=fs.readFileSync('dist/souls.js','utf8');for(const patch of JSON.parse(fs.readFileSync(d+'souls.production-edits.json'))){assert.equal(s.split(patch.old).length-1,1);s=s.replace(patch.old,patch.replacement);}fs.writeFileSync('dist/souls.js',s);
fs.writeFileSync('tests/next50-4599-late-ko.test.cjs',fs.readFileSync(d+'4599-late-ko.test.cjs','utf8').replace("require('../4599-battle.cjs')","require('./helpers/4599-battle.cjs')"));
const bp='research/BATCH-4509-NEXT50-STATUS.json',b=JSON.parse(fs.readFileSync(bp));b.activeProcesses=[];b.activeWork={id:4599,stage:'production-targeted-tests',formalValidatorRunning:false,fullRegressionRunning:false};fs.writeFileSync(bp,JSON.stringify(b,null,2)+'\n');
console.log('4599 fixture preserves source index; late-KO guard integrated; stale process cleared');
