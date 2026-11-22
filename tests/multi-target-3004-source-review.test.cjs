'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{build}=require('../research/build-multiplayer-todo.cjs'),{inventory,checkReview}=require('../completion-policy.cjs'),store=require('../local-species.cjs');
function fixture(){return{s:store.species(3004),reviews:JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'))};}
test('3004两真实混合范围只排除atk_num，已独立验证的强化弱化实例与真实来源仍留在来源清单',()=>{
 const f=fixture(),before=structuredClone(f.s),out=build([f.s],f.reviews);for(const id of [20444,10961]){const key='3004:move:'+id,statKey='3004:skill:'+id+':0';assert.ok(out.excludedRecords.some(r=>r.key===key&&r.raw.sourceTargetCount===3));assert.ok(!out.records.some(r=>r.key===key));const e=inventory(f.s).find(e=>e.key===statKey);assert.ok(e);assert.deepEqual(checkReview(e,f.reviews.entries[statKey],process.cwd()),[]);}assert.deepEqual(f.s,before);
});
test('3004混合范围没有独立状态证据或证据过期时仍阻止排除，不借基础技能通过掩盖附效缺口',()=>{
 for(const id of [20444,10961])for(const mismatch of ['missing','stale','no-state-evidence']){const f=fixture(),key='3004:skill:'+id+':0';if(mismatch==='missing')delete f.reviews.entries[key];else if(mismatch==='stale')f.reviews.entries[key].sourceDigest='stale';else f.reviews.entries[key].tests.success=[];const out=build([f.s],f.reviews);assert.ok(out.records.some(r=>r.key==='3004:move:'+id));assert.ok(!out.excludedRecords.some(r=>r.key==='3004:move:'+id));}
});
test('3004精确来源白名单拒绝变更hash参数与额外队伍依赖，重绑基础digest不能扩大排除范围',()=>{
 for(const mutation of ['hash','args','team-dependency']){const f=fixture(),m=f.s.moves.find(m=>m.id===10961);if(mutation==='hash'){m.hash='changed';m.revision='seerapi:changed';}else if(mutation==='args')m.effectInstances[0].args[1]=100;else m.deferredEffects.push({description:'己方下只真实出场',scope:'多精灵待实现'});const entry=inventory(f.s).find(e=>e.key==='3004:move:10961');f.reviews.entries[entry.key].sourceDigest=entry.sourceDigest;f.reviews.entries[entry.key].ignoredSourceFeatures[0].sourceHash=m.hash;const out=build([f.s],f.reviews);assert.ok(out.records.some(r=>r.key===entry.key));assert.ok(!out.excludedRecords.some(r=>r.key===entry.key));}
});
