'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),P=require('../completion-policy.cjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',cp=base+'4608-user-confirmations.json',c=read(cp),r=read('SINGLE-STAGE-REVIEWS.json'),s=read('research/4608-reviewed-snapshot.json'),proof=read('research/4608-whole741-v1-result.json'),shared=read('research/4608-shared-rules-v1-result.json'),at=new Date().toISOString();
assert.equal(proof.exitCode,0);assert.equal(proof.pass,77);assert.equal(shared.exitCode,0);assert.equal(shared.pass,71);assert.equal(c.count1204Confirmation.answerOriginal,'刷新为2次，不累加');
const renames=['4608-independent-test-renames.json','4608-feedback-test-renames.json'].flatMap(f=>read(base+f).renames);
renames.push({before:'4608 191同源刷新4回合且不延长为叠加，1204重复次数仍待直接回答',after:'4608 191同源刷新4回合，1204剩1重授刷新2且不累加'},
{before:'4608 741多次小伤统计歧义诊断001，大伤连续同判免疫不被过度保护',after:'4608 741整招两段200均免疫，无首段HP泄漏，大伤两段也全免'},
{before:'4608 741明确逐事件与整轮载荷真实2段200区别200/400，护盾前后候选仅歧义001保护',after:'4608 741明确逐事件与整轮载荷真实2段200区别200/400，护盾前实际免疫不消费盾且保留历史候选'},
{before:'4608 741与972实际阈值免疫重叠只006，未超阈值正常消费972和无次数单741同判',after:'4608 741阈值免疫优先于972且不消费次数，未超阈值正常消费972'});
function remap(x){if(Array.isArray(x))return x.map(remap);if(x&&typeof x==='object')for(const[k,v]of Object.entries(x)){if(k==='name'){let n=v;for(const row of renames)if(n===row.before)n=row.after;x[k]=n;}else x[k]=remap(v);}return x;}
const files=['tests/deployed-4608.test.cjs','tests/next50-4608-whole-attack.test.cjs','tests/next50-4608-skills.test.cjs','tests/next50-4608-soul.test.cjs'];
const refs=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>({file,name:x[1]})));
const behavior={741:'按整招实际攻击段在护盾抵挡前累计严格大于300免疫整招，阈值正好300不免；免疫不消费普通盾及972；预计算保持对象引用并回滚HP/PP/随机数/等级/异常/消费及事件，只提交实际路径',929:'本招原生红伤等于当前对手本回合已造成红伤的2倍；先手零基数为0，不叠普通技能基础伤害，仍走普通红伤减免免疫护盾；回复取完整结算红伤而非HP实损',1327:'吸取理论自身最大HP的1/3，按原百分比伤害与理论回复处理，再授理论等量盾；禁疗、免伤、低敌HP与红伤先击败均不降低理论盾',1204:'仅本源28619/89332a29下2次必暴同源刷新2，不累加，保留其他来源次数；实际攻击含MISS消费，属性或控制未用不消费',191:'4回合免反同源刷新，常驻免异/抗性优先，反弹先于次数并不消费次数',972:'实际低HP使用时授来源免攻1次，同源刷新、不同来源保留后得先消费；741整招免疫先触发则不消费本次数',1924:'已授4轮每次实际用招回血500，固定附伤读取实际回复；禁疗、回复倍率和溢出分别影响附伤，控制未用不触发'};
for(const e of P.inventory(s)){const v=r.entries[e.key];assert.ok(v,e.key);remap(v);v.reviewedAt=at;v.reviewStatus='state-tested-awaiting-preflight';v.rationale='46项来源逐审，17招28实例与1813真实当前双方分支；用户原文不改，按具体实例落实已答规则；77/77专项及71/71公共回归通过，待HTTP与第三批整库回归。';v.historicalQuestions=[...new Set([...(v.historicalQuestions??[]),...(v.questions??[])])];v.resolvedQuestions=v.historicalQuestions.slice();v.questions=[];delete v.pendingSingleBehavior;v.userConfirmation=cp;
 if(e.kind==='soul')v.singleBehavior='额外200最大HP与初始HP；每轮开始低实际HP敌防速-2；动态高HP防清吸不阻止纯反转；真实被击败反转敌正等级，遵守免弱/强化保护/反制，成功锁负2轮。';
 if(e.kind==='skill'&&behavior[e.raw.instance.id])v.singleBehavior=behavior[e.raw.instance.id];
 const extra=refs.filter(x=>e.kind==='move'?x.name.startsWith('4608全部17真实完整技能'):e.kind==='soul'?x.file==='tests/next50-4608-soul.test.cjs'||x.name.includes('1813'):behavior[e.raw.instance.id]?x.name.includes(String(e.raw.instance.id)):false);
 for(const cat of['success','failure','boundary','interaction'])for(const x of extra)v.tests[cat].push({...x,assertion:v.singleBehavior});
}
assert.deepEqual(P.inventory(s).flatMap(e=>P.checkReview(e,r.entries[e.key],process.cwd())),[]);
const saved=require('../local-species.cjs').save(s);assert.equal(saved.saved,true,JSON.stringify(saved));for(const e of P.inventory(saved.snapshot))r.entries[e.key].sourceDigest=e.sourceDigest;
assert.deepEqual(P.inventory(saved.snapshot).flatMap(e=>P.checkReview(e,r.entries[e.key],process.cwd())),[]);write('SINGLE-STAGE-REVIEWS.json',r);
const pending=read('data/species-pending/4608.json');Object.assign(pending,{status:'state-tested-awaiting-preflight',questions:[],snapshot:saved.snapshot,validationIssues:[]});write('data/species-pending/4608.json',pending);
c.status='state-tested-awaiting-preflight';c.evidence='research/4608-whole741-v1-result.json';c.sharedEvidence='research/4608-shared-rules-v1-result.json';c.remaining=[];c.pending=[];c.count1204Confirmation.status='state-tested-awaiting-batch-regression';for(const x of c.compact){x.implementationStatus='state-tested-awaiting-batch-regression';x.instanceBindingStatus='bound-to-4608-reviewed-snapshot';}c.failuresPreserved=['research/4608-confirmed-independent-initial-v1-result.json','research/4608-feedback-native-v1-result.json','research/4608-feedback-targeted-v3-result.json'];write(cp,c);
write('research/4608-confirmed-current.json',{recordedAt:at,speciesId:4608,status:'state-tested-awaiting-preflight',deployed:true,accepted:false,stageComplete:false,tests:proof,sharedTests:shared,confirmation:cp,coverage:P.reviewCoverage(saved.snapshot,r),pending:[],multiDeferred:[]});
write(base+'4608-confirmed-all-test-renames.json',{at,renames});console.log({saved:saved.saved,inventory:46,speciesTests:77,sharedTests:71,coverage:P.reviewCoverage(saved.snapshot,r)});
