'use strict';
const fs=require('fs'),p='tests/remaining-fixed52-classifications.test.cjs',s=fs.readFileSync(p,'utf8');
let n=s.replace("const source=require('../research/BATCH-4816-REMAINING/4951/snapshot.json'),review=", "const historical=require('../research/BATCH-4816-REMAINING/4951/snapshot.json'),source=require('../data/species/4951.json').snapshot,review=");
n=n.replace("assert.equal(review.sourceDigest,item.sourceDigest);", "assert.deepEqual(source.souls,historical.souls);for(const k of ['provider','url','revision','loadedAt'])assert.equal(source.source[k],historical.source[k]);assert.equal(review.sourceDigest,item.sourceDigest);");
n=n.replace("assert.ok(review.singleBehavior.includes('待答'));", "assert.equal(review.singleBehavior.includes('待答'),false);assert.ok(review.userConfirmations.includes('research/BATCH-4816-REMAINING/ANSWER-DEPLOYMENT-2026-11-05T10-51-34-562Z/CONFIRMATION-4951.json'));");
if(n===s||n.includes("assert.ok(review.singleBehavior.includes('待答'))"))throw Error('draft transformation failed');
fs.writeFileSync('research/BATCH-4816-REMAINING/FINAL-GATES/classifications-repair-draft.cjs',n.replaceAll("require('../","require('../../../").replace("require('./helpers/remaining-battle.cjs')","require('../../../tests/helpers/remaining-battle.cjs')"),{flag:'wx'});
