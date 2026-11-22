'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),V=require('../research/TEAM-STAGE-2/independent-registry-compatibility.cjs'),P=require('../completion-policy.cjs'),S=require('../local-species.cjs'),C=require('../research/TEAM-STAGE-2/complete-evidence.cjs'),reviews=require('../SINGLE-STAGE-REVIEWS.json'),todo=require('../MULTI-PET-TODO.json'),formal=require('../research/TEAM-STAGE-2/complete-reviews.json').entries,root=require('path').resolve(__dirname,'..');
function check(id,t=todo,f=formal,p=reviews){return V.validate(S.species(id),p,t,root,f);}
function fixture(id=3291){return{t:{...todo,records:todo.records.map(r=>r.speciesId===id?structuredClone(r):r)},f:Object.fromEntries(Object.entries(formal).map(([k,v])=>[k,Number(k.split(':')[0])===id?structuredClone(v):v]))};}
test('独立门槛接受已闭合原绑定、真实语义拆分、范围规范化和十二父项组合且不改台账',()=>{
 const before=[P.digest(todo),P.digest(formal),P.digest(reviews)];for(const id of[3291,3407,3383,3205,3425,3481,3482,3506,3514,3529,3672,4599,4925])assert.deepEqual(check(id),[],String(id));assert.deepEqual([P.digest(todo),P.digest(formal),P.digest(reviews)],before);
});
test('审核叙述和历史证据注释变动不冒充原始来源变动，状态和绑定仍强制校验',()=>{const{t,f}=fixture();t.records.find(r=>r.key==='3291:soul:622').stageTwo.finding+='（仅审核注释）';assert.deepEqual(check(3291,t,f),[]);});
test('伪造原参数、来源URL、重复或删除原项均不能通过独立门槛',()=>{
 for(const mutate of[
  ({t})=>{t.records.find(r=>r.key==='3291:soul:622').raw.args[0]++;},
  ({t})=>{t.records.find(r=>r.key==='3291:soul:622').source.url='https://invalid.example/source';},
  ({t})=>{t.records.push(structuredClone(t.records.find(r=>r.key==='3291:soul:622')));},
  ({t,f})=>{t.records=t.records.filter(r=>r.key!=='3291:soul:622');delete f['3291:soul:622'];}
 ]){const x=fixture();mutate(x);assert.ok(check(3291,x.t,x.f).length);}
});
test('原绑定独立锚定，改绑定或同时改canonical范围并重算绑定仍被拒绝',()=>{
 let x=fixture();x.f['3291:soul:622'].binding='0'.repeat(64);assert.ok(check(3291,x.t,x.f).length);
 x=fixture();const row=x.t.records.find(r=>r.key==='3291:soul:622');row.scope='unclassified';row.stageTwo.canonicalBindingPreserved=true;row.stageTwo.currentSemanticScope=reviews.entries[row.key].scope;x.f[row.key].binding=C.binding(row);assert.ok(check(3291,x.t,x.f).some(s=>s.includes('original canonical proof binding')));
});
test('不能略过尚未通过的stageTwo状态或未明确记录的语义兼容',()=>{
 let x=fixture();x.t.records.find(r=>r.key==='3291:soul:622').stageTwo.status='待核验';assert.ok(check(3291,x.t,x.f).length);
 x=fixture(3407);delete x.t.records.find(r=>r.key==='3407:soul:2093').stageTwo.currentSemanticScope;assert.ok(check(3407,x.t,x.f).some(s=>s.includes('explicit preserved-canonical')));
});
test('完整父项的每个原实例仍需当前原源审核与非单宠子项正式绑定',()=>{
 const id=3383,key='3383:skill:30819:0',x=fixture(id),p={...reviews,entries:{...reviews.entries}};delete p.entries[key];assert.ok(check(id,x.t,x.f,p).length);
 const y=fixture(id);delete y.f[key];assert.ok(check(id,y.t,y.f).some(s=>s.includes('parent multiplayer component')));
});
test('正式测试引用不因兼容转换而失去字面断言要求',()=>{const{t,f}=fixture();f['3291:soul:622'].tests.boundary.push({file:'tests/deployed-3291.test.cjs',name:'不存在的断言不得通过',assertion:'必须执行真实具名断言'});assert.ok(check(3291,t,f).length);});
