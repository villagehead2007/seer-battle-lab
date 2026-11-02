const fs=require('node:fs'),store=require('../local-species.cjs');
const checked=new Set(),skipped=new Map();
for(const file of fs.readdirSync('research')){const match=file.match(/^range-(\d+)-(\d+)\.json$/);if(!match&&!/^selected-.*\.json$/.test(file))continue;const d=JSON.parse(fs.readFileSync('research/'+file,'utf8'));const ids=match?Array.from({length:+match[2]-match[1]+1},(_,i)=>+match[1]+i):d.requestedIds??[];for(const id of ids){const pet=d.pet[id];if(!pet)continue;if(id>=3021&&Array.isArray(pet.soulmark)&&!pet.soulmark.length){checked.add(id);skipped.set(id,{id,name:pet.name});}else {try{store.species(id);checked.add(id);}catch{}}}}
fs.writeFileSync('data/adaptation.json',JSON.stringify({checked:[...checked].sort((a,b)=>a-b),skipped:[...skipped.values()].sort((a,b)=>a.id-b.id)},null,2));
console.log(JSON.stringify(store.status()));
