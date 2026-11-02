'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const P=require('../completion-policy.cjs'),root=path.resolve(__dirname,'..');
const original=P.inventory(require('../data/species/3741.json').snapshot).find(x=>x.key==='3741:skill:29246:0');
const review=require('../SINGLE-STAGE-REVIEWS.json').entries[original.key];
function fixture(t){const base=fs.mkdtempSync(path.join(os.tmpdir(),'seer-reentry-3741-'));t.after(()=>{assert.ok(path.resolve(base).startsWith(path.resolve(os.tmpdir())+path.sep));fs.rmSync(base,{recursive:true,force:true});});const files=new Set([...review.implementation,...Object.values(review.tests).flat().map(x=>x.file),'research/3741-user-confirmed-rules.json']);for(const f of files){fs.mkdirSync(path.dirname(path.join(base,f)),{recursive:true});fs.copyFileSync(path.join(root,f),path.join(base,f));}return base;}
test('3741重新登场兼容只接受精确来源及用户授权，仍要求自身行为证据',t=>{
 const base=fixture(t);assert.deepEqual(P.checkReview(original,review,base),[]);
 const no=structuredClone(review);delete no.tests.failure;assert.ok(P.checkReview(original,no,base).some(x=>x.includes('failure state assertion')));
 const pure=structuredClone(review);pure.scope='multiplayer';delete pure.singleBehavior;assert.ok(P.checkReview(original,pure,base).some(x=>x.includes('dependencyEvidence')));
});
test('3741重新登场兼容拒绝错误ID位置参数hash摘要和引文',t=>{
 const base=fixture(t);
 const mutations=[e=>e.key='3741:skill:29247:0',e=>e.raw.instance.id=2394,e=>e.raw.index=1,e=>e.raw.instance.args=[1],e=>e.raw.metadata.revision='seerapi:changed',e=>e.source.skillRevision='seerapi:changed',e=>e.source.snapshot.revision='changed',e=>e.raw.instance.description+='变化',e=>e.sourceDigest='wrong'];
 for(const change of mutations){const e=structuredClone(original),r=structuredClone(review);change(e);r.sourceDigest=e.sourceDigest;assert.ok(P.checkReview(e,r,base).some(x=>x.includes('dependencyEvidence')));}
 for(const change of [r=>r.dependencyEvidence[0].quote='登场时',r=>r.dependencyEvidence[0].kind='next-entry',r=>r.userConfirmation='research/other.json']){const r=structuredClone(review);change(r);assert.ok(P.checkReview(original,r,base).some(x=>x.includes('dependencyEvidence')));}
});
test('3741重新登场兼容缺少或变更授权不能放行',t=>{
 const base=fixture(t),file=path.join(base,'research/3741-user-confirmed-rules.json'),saved=JSON.parse(fs.readFileSync(file));
 for(const mutation of [d=>delete d.reentryValidationAuthorization,d=>d.reentryValidationAuthorization.answer='未授权',d=>d.reentryValidationAuthorization.binding.sourceDigest='changed',d=>d.reentryValidationAuthorization.binding.args=[100],d=>d.reentryValidationAuthorization.binding.effectRevision='changed']){const d=structuredClone(saved);mutation(d);fs.writeFileSync(file,JSON.stringify(d));assert.ok(P.checkReview(original,review,base).some(x=>x.includes('dependencyEvidence')));}
 fs.unlinkSync(file);assert.ok(P.checkReview(original,review,base).some(x=>x.includes('dependencyEvidence')));
});
