'use strict';
const fs=require('fs'),path=require('path');
let t=fs.readFileSync(path.join(__dirname,'../soul1845.static.test.cjs'),'utf8')
 .replace("require('./1845-battle.draft.cjs')","require('../1845-battle.draft.cjs')")
 .replaceAll('make(', 'qualifiedMake(')
 .replace("require('../next50-4635-skills/1463-interaction-source.json')","require('../../../../research/4643-pregranted1463-source-premise.json')");
const at=t.indexOf('\ntest(');
t=t.slice(0,at)+"\n// Explicit research premises, not source answers.\nfunction qualifiedMake(o={}){return make({...o,policies:{qualifiedConstructPriority1845:'once',qualifiedNoPPExtra1845:'eligible',...o.policies}});}\n"+t.slice(at);
t=t.replace('// STATIC TEST DRAFT ONLY: not executed. Each literal contains actual state assertions for the later authorized private window.','// Qualified recheck copy of frozen20; explicit once/eligible research inputs, not natural source answers.');
fs.writeFileSync(path.join(__dirname,'qualified-base20.test.cjs'),t);
