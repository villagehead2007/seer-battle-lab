'use strict';const fs=require('fs'),assert=require('assert/strict'),D='research/parallel-drafts/next50-4589-skills/';
// Draft author explicitly froze code/tests after v5; final evidence prose may finish independently.
const validation=fs.readFileSync(D+'4589-skills-v5.log','utf8');assert.match(validation,/ℹ tests 58\b/);assert.match(validation,/ℹ fail 0/);
const patches=JSON.parse(fs.readFileSync(D+'souls.production-edits.json'));let soul=fs.readFileSync('dist/souls.js','utf8');
for(const p of patches){assert.equal(soul.split(p.old).length-1,1,p.old);soul=soul.replace(p.old,p.replacement);}
let range=fs.readFileSync('dist/range-effects.js','utf8');assert.ok(!range.includes('const exact4589='));const at=range.lastIndexOf('\n});');assert.ok(at>0);
range=range.slice(0,at)+'\n'+fs.readFileSync(D+'range-effects.production-fragment.js','utf8')+range.slice(at);
let helper=fs.readFileSync(D+'4589-battle.cjs','utf8').replaceAll('../../../dist/','../../dist/').replaceAll('../../../research/','../../research/');
let tests=fs.readFileSync(D+'4589-skills.test.cjs','utf8').replace("require('./4589-battle.cjs')","require('./helpers/4589-battle.cjs')").replaceAll('../../../data/','../data/').replaceAll('../../../research/','../research/');
assert.ok(!tests.includes('preload-production'));assert.ok(!helper.includes('preload-production'));
fs.writeFileSync('dist/souls.js',soul);fs.writeFileSync('dist/range-effects.js',range);fs.writeFileSync('tests/helpers/4589-battle.cjs',helper);fs.writeFileSync('tests/next50-4589-skills.test.cjs',tests);
fs.writeFileSync('research/4589-skills-production-integration.json',JSON.stringify({at:new Date().toISOString(),patches:patches.length,files:['dist/souls.js','dist/range-effects.js','tests/helpers/4589-battle.cjs','tests/next50-4589-skills.test.cjs'],formalAcceptance:false},null,2)+'\n');console.log('4589 skill production integrated; production tests pending');
