'use strict';
const fs=require('fs'),assert=require('assert/strict'),policy=require('../completion-policy.cjs'),s=require('./3679-reviewed-snapshot.json'),reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));const file='tests/deployed-3679.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);const ref=(term,assertion)=>{const name=names.find(n=>n.includes(term));assert.ok(name,term);return {file,name,assertion};};const map={};
for(const [ids,term,success,failure,boundary,interaction]of [
 [[4,5],'4和5有序','真实指定能力按参数改变','概率失败或封招不变','正负六级饱和','免弱拒绝下降'],
 [[962],'962无正','无强化+2，有强化+1','禁强化不改变','六级封顶','已有正等级改变分支'],
 [[749],'749概率','100%六能力-1','免弱不下降','负六级截断','保护与真实攻击用招交互'],
 [[1393],'1393施放','施放及后续先降防速，物攻实伤提高','封招不登记；免弱失败追加3000粉伤','三回合后到期，双负六级触发失败补偿','只一项成功不触发补偿，属性招也降级'],
 [[999],'999按正','每种正能力增伤15%，真实伤害比对','负等级不计种类，封招无伤害','零种到六种及等级1/6均按一种计','正负等级参与实际物攻计算后再按种类增伤'],
 [[1366],'1366百分比','按本次实伤追加20/30/40%粉伤','攻击免疫导致零基数；封招无伤害','第四次仍40%','百分比抗性减少粉伤'],
 [[889,636],'889消回合','分别消回合或消强成功令害怕且阻止行动','无可消状态或对应保护不害怕','一次异常免疫消费到0','消除成功与异常施加失败分别处理'],
 [[455,683],'455已损','按真实已损HP追加固伤，随机固伤200至400','满血455零追加；封招不伤害','已损1和5000准确扣血，随机多个取值在区间内','护罩600消耗500剩100'],
 [[696],'696每次','种子覆盖暴击和未暴击，实伤翻倍','未触发无暴击；封招无伤害','第八次所有种子均必暴','对照保留随机抽取顺序验证真实两倍伤害'],
 [[717],'717低血','正常吸3000低血回6000，吸取不翻倍','禁疗不回血，封招不吸取','4499翻倍4500不翻倍，四回合到期','8999回血封顶9000'],
 [[58,843],'58必暴','次两回合暴击实伤翻倍或低速先行动','封招不登记','start2/end3，第四回合恢复','改用普通攻击同样享有先制或暴击'],
 [[850,695],'850按回合','概率免攻实际HP不损；封属真实强化不生效','不同种子不免攻或不封属，封招不登记','两回合到期','850仅免攻击，附加失血固伤仍扣HP'],
 [[1232],'1232反转','负六级变正六级并反馈负六级','无下降不反转，封招保留下降','正负六级边界','免弱拒绝对手反馈不影响自身反转'],
 [[191],'191真实','真实敌方害怕反弹，自身无异常','封招不授予反弹','反弹四回合后到期','对手消强成功但害怕被反弹'],
 [[604],'604随机','随机威力实际攻击扣血，连续使用增长','封招无伤害','第六次起威力封顶300','换招后连续次数归1；补充PP夹具不改变技能数据']
])for(const id of ids)map[id]={term,success,failure,boundary,interaction};
for(const item of policy.inventory(s)){if(item.kind==='soul')continue;const r={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString()};if(item.kind==='skill'){const m=map[item.raw.instance.id];assert.ok(m,item.key);Object.assign(r,{rationale:'当前双方独立触发，无队伍依赖：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,[ref(m.term,m[k])]]))});}else Object.assign(r,{rationale:'14招均保留真实基础参数并逐招验证。',singleBehavior:item.raw.name+'的威力分类、PP、先制命中暴击及属性伤害',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础14招伤害','独立伤害公式逐招比对与实际PP扣1')],failure:[ref('基础14招伤害','零PP拒绝、封招无伤害、控制未行动不扣PP')],boundary:[ref('基础14招先制','低速与真实先制决定顺序，非必中负命中可未命中')],interaction:[ref('基础14招先制','真实必暴双倍实伤，本系与属性矩阵参与')]}});reviews.entries[item.key]=r;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const coverage=policy.reviewCoverage(s,reviews);fs.writeFileSync('research/3679-review-audit.json',JSON.stringify({status:'partial-awaiting-soul-semantics',...coverage,pending:[{key:'3679:soul:965',questions:['连续未触发时概率累计还是固定50%','高伤分支粉伤基于最大体力还是实际回复量'],api:'9ba3285',wikiRevision:319502}],multiplayerBranches:[],nextSpeciesNotStarted:[3683,3686,3697,3699]},null,2)+'\n');console.log(coverage);
