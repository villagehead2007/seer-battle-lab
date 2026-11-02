'use strict';
const fs=require('fs'),assert=require('assert/strict'),P=require('../completion-policy.cjs');const result=require('../local-species.cjs').save(require('./3697-reviewed-snapshot.json'));assert.equal(result.saved,true);const s=result.snapshot,r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),file='tests/deployed-3697.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]),ref=(term,assertion)=>{const name=names.find(n=>n.includes(term));assert.ok(name,term);return {file,name,assertion};},map={};
for(const [ids,term,...a]of [
[[4,5],'4和5有序','真实实例指定能力变化','概率失败封招不改变','正负6截断','免弱阻止敌方下降'],
[[31],'31二至五段','多段实伤累计且PP只扣1','攻击免疫零伤害','种子覆盖2至5段','物攻特攻分别执行'],
[[942,1310,85],'942消回合','消回合吸取或吸强成功','保护阻止消除及吸取','下一回合必先，到期恢复顺序','回血或能力转移实际状态'],
[[1274,749],'1274害怕','概率施加害怕控制，或能力下降','种子覆盖失败，免疫拒绝控制','弱化状态使概率翻倍','免弱拒绝下降'],
[[29,6],'29固伤','附加60固定伤害或攻击实伤四分之一反弹','攻击免疫时零反弹','反伤可令1HP使用者倒下','固定抗性50%减半'],
[[1255,191],'1255用招','麻痹阻止行动，未触发粉伤3000','免疫异常失败走粉伤','3回合到期或4回合反弹到期','真实对手技能异常反弹'],
[[849],'849三项','当前用招前随机3项降对手升自身','免弱与禁强化分别拒绝能力变化','无重复三项与3回合到期','后续普通攻击继续触发'],
[[585,433],'585与433','直接六能力+1和回合末攻速+1','禁强化或六级拒绝再增','上限6和两回合到期','持续强化与直接强化独立'],
[[532],'532实际','回复量实际作为粉伤','满血或禁疗无粉伤','8999只回1并伤1，4回合到期','回复与粉伤独立执行'],
[[693,843],'693增伤','下回合攻击翻倍或低速先行动','封招不授予','起止2/3回合','普通技能享先制和攻击增伤'],
[[792,837],'792先手','先手封攻实际无伤，吸取200递增','后手不封对手先攻，禁疗不回血','吸取400封顶，第6次夹具补PP验证','后续使用累计固伤与回血'],
[[869],'869速度','速度500按50/75/100%追加','百分比抗性减少追加','第四次仍100%','速度强化提高实际粉伤'],
[[760,1048,679],'760消微弱','微弱提升普通，异常增伤50%，禁疗阻止回血','无对应效果对照伤害较低','两回合禁疗后真实回血恢复','真实回复技能与属性矩阵']
])for(const id of ids)map[id]={term,a};
for(const item of P.inventory(s)){const v={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString()};if(item.kind==='move')Object.assign(v,{rationale:'17招基础行为全部属于当前双方，无队伍前提。',singleBehavior:item.raw.name+'威力PP先制命中暴击属性基础行为',implementation:['dist/wiki-support.js','dist/souls.js'],tests:{success:[ref('基础17招伤害','逐招独立实伤计算和PP扣1')],failure:[ref('基础17招伤害','零PP拒绝控制不行动封招无伤害')],boundary:[ref('基础17招先制','真实先制与低命中未命中')],interaction:[ref('基础17招先制','本系克制暴击实伤')]}});else if(item.kind==='skill'){const m=map[item.raw.instance.id];assert.ok(m,item.key);Object.assign(v,{rationale:'当前双方独立触发：'+item.raw.instance.description,singleBehavior:item.raw.instance.description,implementation:['dist/range-effects.js','dist/souls.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map((k,i)=>[k,[ref(m.term,m.a[i])]]))});}else Object.assign(v,{scope:'mixed',rationale:'学习力刻印转HP与回合HP比较可当前结算；背包死亡数量明示队伍前提。减伤范围依据同hash格式化说明为攻击、固定伤害。',singleBehavior:'速度学习力和刻印收益加至最大HP；回合初高体免异常及50%全属性降对手1，低体攻击/固定减伤50%及必定降对手1；等体无分支。',deferredBehavior:'背包每死亡一只精灵技能先制+1，最高+5。',trigger:'己方背包存在阵亡精灵时计算技能先制',futureMechanisms:['队伍死亡数量','队伍状态驱动先制'],implementation:['dist/range-souls.js','dist/engine.js','dist/souls.js'],tests:{success:[ref('魂印976速度','252速度学习力加80速度刻印使HP多143'),ref('魂印976高体','高体免异常概率降级，低体必降级')],failure:[ref('魂印976高体','等体无分支，免弱拒绝降级')],boundary:[ref('魂印976速度','无速度加成无额外HP，直接覆盖HP优先')],interaction:[ref('魂印976低体','自身输出不减，攻击固定减半，百分比不减；下一回合重新比较')]}});r.entries[item.key]=v;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');const coverage=P.reviewCoverage(s,r);fs.writeFileSync('research/3697-review-audit.json',JSON.stringify({status:'awaiting-independent-validation',...coverage},null,2)+'\n');console.log(coverage);
