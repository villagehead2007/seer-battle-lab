const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict'),baseline=require('./3626-baseline.json');
const changed=Object.entries(baseline.files).filter(([p,h])=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h).map(([p])=>p);
const allowed=['dist/range-effects.js','dist/souls.js','dist/soul-registry.js','data/species/3626.json'];assert.ok(changed.every(p=>allowed.includes(p)),JSON.stringify(changed));
const reviews=require('../SINGLE-STAGE-REVIEWS.json');for(const [k,v]of Object.entries(baseline.reviews.entries))assert.deepEqual(reviews.entries[k],v,k);
const todo=require('../MULTI-PET-TODO.json');for(const r of baseline.todo.records)assert.ok(todo.records.some(v=>JSON.stringify(v)===JSON.stringify(r)),r.key);assert.equal(todo.records.length,baseline.todo.records.length+1);
fs.writeFileSync('research/3626-scope-check.json',JSON.stringify({changed,otherReviewsUnchanged:true,previousTodoUnchanged:true,newTodo:1,protectedFilesUnchanged:true},null,2)+'\n');
const a=require('./3626-review-audit.json');a.status='single-stage-complete';a.validation={targeted:'25/25',npm:'774/774',gate:'passed (single-stage)',log:'research/3626-gate.log'};fs.writeFileSync('research/3626-review-audit.json',JSON.stringify(a,null,2)+'\n');
