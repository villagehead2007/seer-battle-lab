'use strict';const fs=require('fs'),assert=require('node:assert/strict');
const A=__dirname+'/',native='tests/deployed-4766.test.cjs',base='tests/next50-4766.test.cjs',names=[...fs.readFileSync(native,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);assert.equal(names.length,14);
const ref=(...ids)=>ids.map(i=>({file:native,name:names[i-1]}));
const extraTests={move:ref(1),soul:ref(2,3,4,5,6,7,8)};
const moves={37910:[6,10],29046:[7,11],29052:[11],37911:[9],37921:[12],29051:[13],29045:[13],37920:[14]};
const snapshot=JSON.parse(fs.readFileSync('research/BATCH-4676-NEXT50/4766/snapshot.json'));
for(const m of snapshot.moves)for(const[i]of m.effectInstances.entries())if(moves[m.id])extraTests[`4766:skill:${m.id}:${i}`]=ref(...moves[m.id]);
const decisions={'4766:soul:1967':{scope:'mixed',singleBehavior:'当前双方初始血、正转血邪天血有限轨迹；血前10在场回合、敌本次在场超过2回合、天非暴击触发整招抵挡/逆转完整红伤汇总反馈，招后一次衍化，末血全PP恢复再衍化关闭；当前用招伤前粉伤、战斗阶段末回血、天道红伤增幅、普通死亡停止。',deferredBehavior:'真实离场后停止累计自身在场回合；再次登场初始化血道、保留本场累计在场计数；对手真实再出场重置本次在场计时。',trigger:'真实离场、再次登场及对手更换产生本场累计在场与本次在场的生命周期差异。',dependencyEvidence:[{kind:'switch',quote:'登场时自身开启武道，初始为血之道'},{kind:'off-field',quote:'本场战斗自身在场的前10回合'},{kind:'switch',quote:'本次在场超过2回合的精灵'}],futureMechanisms:['真实换宠离场/再入场事件','跨次保留自身本场累计在场回合数','每次对手进入的独立在场回合计数']}};
const plan={id:4766,reviewed:true,oldTestFile:A+'4766-before-next50-4766.test.cjs',testFile:base,extraTests,decisions,
 rationale:'核对原pet4766/2f043c10、魂印1967/86c26636/eid2377[6,6,50,1]、24招47有序实例；保留原始hash参数和来源。按原1完整红伤反馈不按HP损失；原4下次衍化强化同源刷新；原6整招原武道判定/结束衍化一次且逆轨整招汇总；原119逆转保留轨迹位置并消费已累计抵挡；原120复原保留当前武道和关闭状态、清空累计；原121伤前魂印粉伤；122战斗阶段末回血；123只看当前本招且命中零红暴击算暴击；124仅锁伤挡伤不把普通减免、盾罩、HP截断当锁伤；125仅穿护盾承伤、正常免异保护不变；126按免攻层已减伤量累计不纳后层上限，END才加入。当前532/1065等量伤按本次回复非负净HP增加，技能禁疗与魂印回血独立；普通死者无后续反馈，立即2243非KO；733负级反正经真实强化准入，禁强/负级锁失败不授害怕。35保留状态测试逐条对应原题答案，并新增14真实1967完整技能和不同种对手原生测试；两三段、概率、PP、异常能力上限、全版本与命中/暴击、时长、免疫保护、零红和失败条件具名断言保留。自身当前全部行为不得因武道再入场计时延期；仅真实离场与重新入场分支统一登记。',
 soulBehavior:decisions['4766:soul:1967'].singleBehavior};
fs.writeFileSync(A+'4766-review-plan.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
const q=JSON.parse(fs.readFileSync(A+'USER-CONFIRMATIONS.json'));
fs.writeFileSync(A+'4766-ANSWER-BINDINGS.json',JSON.stringify({speciesId:4766,status:'implemented-state-tested-pending-preflight',source:snapshot.source,souls:snapshot.souls.map(x=>({id:x.id,hash:x.hash,eid:x.eid,args:x.args})),inventory:72,bindings:q.questions.filter(x=>x.originalIds.some(y=>y.startsWith('Q-4766-'))||[2,23,37,70,118].includes(x.number)).map(x=>({number:x.number,answerVerbatim:x.answerOriginal,originalIds:x.originalIds,scope:'仅当前魂印/实例符合的已答语义；上游版本和原参数不变'})),rawSourcesUnmodified:true,formalAccepted:false,finalFrozenNpmStarted:false},null,2)+'\n',{flag:'wx'});
console.log('4766 explicit72reviewplan prepared');
