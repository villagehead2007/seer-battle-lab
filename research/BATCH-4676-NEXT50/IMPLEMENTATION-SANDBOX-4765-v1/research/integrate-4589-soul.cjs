'use strict';
const fs=require('fs'),assert=require('assert/strict'),path='research/parallel-drafts/next50-4589-soul/';
let souls=fs.readFileSync('dist/souls.js','utf8');
const patches=JSON.parse(fs.readFileSync(path+'souls.production-edits.json'));
for(const p of patches){assert.equal(souls.split(p.old).length-1,1,p.old);souls=souls.replace(p.old,p.replacement);}
let range=fs.readFileSync('dist/range-souls.js','utf8');assert.ok(!range.includes('const burning4589='));const at=range.lastIndexOf('});');assert.ok(at>0);
range=range.slice(0,at)+fs.readFileSync(path+'range-souls.production-fragment.js','utf8')+'\n'+range.slice(at);
let tests=fs.readFileSync(path+'soul4589.test.cjs','utf8');
tests=tests.replace("require('./preload-production.cjs');\n",'');
const begin="'use strict';const test=require('node:test'),assert=require('node:assert/strict'),p=require.resolve('../../../dist/range-souls.js'),extend=require(p);require.cache[p].exports=r=>{extend(r);Object.assign(r,require('./soul4589.draft.cjs'));};const E=require('../../../dist/engine.js'),raw=require('../../4589-reviewed-snapshot.json')";
assert.ok(tests.includes(begin));tests=tests.replace(begin,"'use strict';const test=require('node:test'),assert=require('node:assert/strict');const E=require('../dist/engine.js'),raw=require('../research/4589-reviewed-snapshot.json')");
fs.writeFileSync('dist/souls.js',souls);fs.writeFileSync('dist/range-souls.js',range);fs.writeFileSync('tests/next50-4589-soul.test.cjs',tests);
fs.writeFileSync('research/4589-soul-production-integration.json',JSON.stringify({at:new Date().toISOString(),patches:patches.length,files:['dist/souls.js','dist/range-souls.js','tests/next50-4589-soul.test.cjs'],formalAcceptance:false},null,2)+'\n');
console.log('4589 soul production integrated; tests pending');
