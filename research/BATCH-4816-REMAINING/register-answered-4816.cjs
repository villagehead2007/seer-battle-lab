'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),{inventory}=require('../../completion-policy.cjs'),store=require('../../local-species.cjs');
const base='research/BATCH-4816-REMAINING/',active=JSON.parse(fs.readFileSync(base+'ACTIVE-ANSWER-DEPLOYMENT.json')),s=require('./4816/snapshot.json'),audit=require('./4816/INSTANCE-AUDIT.json'),at=new Date().toISOString();
assert.equal(require('./4816/answered-v2-result.json').exitCode,0);
assert.deepEqual(store.issues(s),[]);
const confirmation={at,questionId:'Q-4816-001',species:4816,soul:{id:2008,hash:'ea98a00b'},answerVerbatim:'补满',answerArchive:active.dir+'/USER-ANSWERS.original.md',answerSha256:'2b1fad6d689e5b662ecc775290191d762508c778f179a6e3d955372eb3ba646f',interpretation:'开启的回合结束时仅将当前PP为0的技能槽补到各自上限；固定吸取、反转和盾罩沿真实原文及当前统一规则。',upstreamSourceUnmodified:true,scope:'only 4816 soul2008 ea98a00b'};
fs.writeFileSync(active.dir+'/CONFIRMATION-4816.json',JSON.stringify(confirmation,null,2)+'\n');
const files=['tests/remaining-4816-known.test.cjs','tests/remaining-4816-enums.test.cjs','tests/answered-4816.test.cjs'],tests=[];
for(const file of files){const t=fs.readFileSync(file,'utf8'),m=[...t.matchAll(/test\('([^']+)'/g)];for(let i=0;i<m.length;i++)tests.push({file,name:m[i][1],assertion:t.slice(m[i].index,m[i+1]?.index??t.length).split('\n').filter(l=>/assert\./.test(l)).join('\n')});}
const ref=name=>{name=name.replace('零PP明确拒绝未确认分支','零PP按已答补满');const t=tests.find(x=>x.name===name);assert.ok(t,name);return t;};
const saved=store.save(s);assert.equal(saved.saved,true);
const rfile='SINGLE-STAGE-REVIEWS.json',reviews=JSON.parse(fs.readFileSync(rfile)),items=inventory(saved.snapshot);
fs.writeFileSync(active.dir+'/4816-reviews.before.json',JSON.stringify(Object.fromEntries(items.map(x=>[x.key,reviews.entries[x.key]??null])),null,2));
for(const item of items){const old=audit.items.find(x=>x.key===item.key);assert.ok(old&&old.tests.length,item.key);let selected=old.tests.map(t=>ref(t.name));const prior=reviews.entries[item.key];
 const e={sourceDigest:item.sourceDigest,scope:item.kind==='soul'?'mixed':'single',reviewedBy:'Codex real source and named state assertions review',reviewedAt:at,status:'implemented-awaiting-final-acceptance',rationale:item.kind==='soul'?'战斗开始配置、首次开启、在场沸涌、双方第五关闭、用招无效、过载、回初先制及回末零PP补满/反转/固定吸取授盾罩均为当前自身行为；仅真实下场再次登场和队伍装置延续延期。':'保留真实基础技能与有序实例；沿既有逐项状态断言审核，不修改来源参数、hash或归类。',singleBehavior:item.kind==='soul'?'首次开启共振器；回初先制+1及沸涌；第五关闭；过载300真伤；开启回末仅零PP槽补满，反转正等级，按实际恢复总PP每点固定吸取50、理论魂印回复及同量同源刷新盾罩。':item.kind==='move'?`真实技能${item.raw.id}，威力${item.raw.power}，PP${item.raw.pp}，命中${item.raw.accuracy}，先制${item.raw.priority}，逐招验证命中/MISS、等级、PP、暴击及封锁状态。`:item.raw.instance.description,implementation:['dist/range-souls.js','dist/range-effects.js','dist/effect-registry.js','dist/souls.js'],tests:{success:selected,failure:selected,boundary:selected,interaction:selected}};
 if(item.kind==='soul'){selected=[...selected,...tests.filter(t=>t.file==='tests/answered-4816.test.cjs')];for(const k of Object.keys(e.tests))e.tests[k]=selected;Object.assign(e,{deferredBehavior:prior.deferredBehavior,trigger:prior.trigger,futureMechanisms:prior.futureMechanisms,dependencyEvidence:prior.dependencyEvidence,userConfirmation:active.dir+'/CONFIRMATION-4816.json'});}
 if(prior?.ignoredSourceFeatures){e.ignoredSourceFeatures=prior.ignoredSourceFeatures;e.userConfirmation=prior.userConfirmation;e.rationale=prior.rationale;}
 reviews.entries[item.key]=e;
}
fs.writeFileSync(rfile,JSON.stringify(reviews,null,2)+'\n');
fs.writeFileSync('tests/deployed-4816.test.cjs',"'use strict';\nrequire('./remaining-4816-known.test.cjs');\nrequire('./remaining-4816-enums.test.cjs');\nrequire('./answered-4816.test.cjs');\n");
fs.writeFileSync(base+'4816/DEPLOYED-INSTANCE-AUDIT.json',JSON.stringify({at,status:'deployed-awaiting-preflight-and-final-acceptance',accepted:false,items:items.map(x=>({...x,review:reviews.entries[x.key]})),pendingAnswerDependentWork:[],pendingBatchWork:['independent preflight, final frozen full npm and certification']},null,2)+'\n');
console.log({id:s.id,items:items.length,saved:saved.saved,formalAccepted:false});
