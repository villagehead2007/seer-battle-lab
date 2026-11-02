'use strict';const fs=require('fs'),assert=require('node:assert/strict'),s=require('./4258-answered-independent-snapshot.json'),file='dist/wiki-support.js';
const row={pet:s.source.revision,souls:Object.fromEntries(s.souls.map(x=>[x.id,x.hash])),fifths:s.moves.filter(x=>x.fifth).map(x=>x.id),skills:s.moves.map(x=>x.id)};
let text=fs.readFileSync(file,'utf8');assert.ok(!text.includes('const reviewed={4258:'));assert.ok(text.includes('const reviewed={4238:'));text=text.replace('const reviewed={4238:','const reviewed={4258:'+JSON.stringify(row)+',4238:');fs.writeFileSync(file,text);
console.log(JSON.stringify({id:4258,registered:row,issues:require('../local-species.cjs').issues(s)}));
