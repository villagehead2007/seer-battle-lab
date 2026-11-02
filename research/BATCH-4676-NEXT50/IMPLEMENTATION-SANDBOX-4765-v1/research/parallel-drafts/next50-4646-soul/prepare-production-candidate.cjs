'use strict';
// Static artifact generation only; not a test, compilation or integration.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
let code=fs.readFileSync(path.join(__dirname,'soul1846.static.draft.cjs'),'utf8');
code=code.replace("const statusRules=require('../../../dist/status-rules.js');","const statusRules=conditionStatusRules;").replace('module.exports=','registry[1846]=');
fs.writeFileSync(path.join(__dirname,'range-souls.static-fragment.js'),'\n(()=>{\n'+code+'\n})();\n');
const files=['soul1846.static.draft.cjs','range-souls.static-fragment.js','souls.static-edits.json','1846-battle.static.cjs','soul1846.static.test.cjs','preload-static.cjs','source-audit.static.json','questions.draft.json'];
fs.writeFileSync(path.join(__dirname,'STATIC-MANIFEST.json'),JSON.stringify({status:'unexecuted-active-draft-not-integration-ready',testsExecuted:0,formalDeployment:false,files:files.map(name=>({name,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,name))).digest('hex')}))},null,2)+'\n');
