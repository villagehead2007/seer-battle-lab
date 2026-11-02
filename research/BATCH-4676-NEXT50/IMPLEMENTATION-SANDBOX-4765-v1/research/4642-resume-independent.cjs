'use strict';const fs=require('node:fs');
const p='research/4642-apply-independent-confirmations.cjs',s=fs.readFileSync(p,'utf8'),marker="s=fs.readFileSync(core,'utf8');let a=",start=s.indexOf(marker);if(start<0)throw Error('resume marker missing');
const header="'use strict';const fs=require('node:fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\\n'),t=read(base+'TAKEOVER.json'),re='dist/range-effects.js',core='dist/souls.js',souls='dist/range-souls.js';let s;function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,a.slice(0,100));fs.writeFileSync(p,s.replace(a,b));}\n";
const tail=s.slice(start).replaceAll('if(actionPayloadAllowed&&a.hp>0&&t.hp>0&&m.kind', 'if(actionPayloadAllowed&&actionLanded&&a.hp>0&&t.hp>0&&m.kind');
fs.writeFileSync('research/4642-independent-resume-body.cjs',header+tail);
require('./4642-independent-resume-body.cjs');
