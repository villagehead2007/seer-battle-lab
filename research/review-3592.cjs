'use strict';
const fs=require('fs'),{inventory,reviewCoverage}=require('../completion-policy.cjs');
const s=require('../data/species/3592.json').snapshot,items=inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const base='tests/deployed-3592.test.cjs',extra='tests/deployed-3592-extra.test.cjs',mechanisms='tests/deployed-3592-mechanisms.test.cjs',soul='tests/deployed-3592-soul.test.cjs';
const names=Object.fromEntries([base,extra,mechanisms,soul].map(f=>[f,[...fs.readFileSync(f,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1])]));
function ref(file,term,assertion){const name=names[file].find(n=>n.includes(term));if(!name)throw Error(term);return {file,name,assertion};}
const clauses={};
function clause(ids,term,success,failure,boundary,interaction,file=extra){for(const id of ids)clauses[id]=Object.fromEntries(['success','failure','boundary','interaction'].map((k,i)=>[k,[ref(file,term,[success,failure,boundary,interaction][i])]]));}
clause([85,931],'吸强85','对手攻击+3转自身5至6，目标归零；931仅成功随机两技能PP归零','无强化、免吸或自身禁强化不清PP不转移','自身强化六级上限；只清两项PP','目标原负命中保留；免吸不触发成功分支');
clause([10,16],'麻痹10','真实概率造成麻痹或睡眠，下一回合被控制者不扣攻击PP','另有未保留异常的种子；免异常和封招阻止异常','不同真实15/50/80概率实例及跨回合控制','真实异常阻止行动和PP消费');
clause([29],'固伤29','实际攻击损血之外追加50固伤','全伤免疫及失误没有损血','50定额独立于攻击伤害','攻击免疫仍损50，全伤免疫同时阻止');
clause([9],'连用9','连续攻击威力130、160、190、210的实际损血','封招不造成损血','210封顶，第五次不增加','插入属性等待后再次攻击恢复130威力');
clause([57],'回复57','四次用招各实际回复3000','技能禁疗阻止回复','第五回合不回复，8999回复至9000','持续效果与技能禁疗及体力上限');
clause([478],'封属478','同回合与下一回合对手属性强化均为零','被封招施放不建立封属，对手正常强化','第三回合恢复强化','属性仍消耗PP，攻击技能不被封属阻止');
clause([417],'吸血417','四回合内真实攻击总损血四分之一回复','技能禁疗阻止吸血，全伤免疫攻击为零','第五回合不吸血','按真实攻击伤害而非威力回复');
clause([36,691],'秒杀36','实际概率触发后目标HP为0','未触发目标存活，封招完全不损血','1HP目标死亡但不出现负HP','真实秒杀与正常攻击、封招共同验证');
clause([48],'免异常48','施加免疫后真实雷祭不能麻痹','封招无法建立免疫，实际雷祭麻痹','四回合到期后麻痹恢复','通过真实对手技能验证免疫');
clause([66,650],'击败66','击败当前目标，66回复4500；650攻击和速度各+2','未击败没有回复或强化，禁疗和禁强各自阻止','回复不超最大HP，能力不超6','实际击败、回复、强化分开断言，无下一只假测试');
clause([693],'增伤693','下回合攻击实际增伤50%','本招封锁无增益','一回合后解除','对照删除增益后相同种子损血，取整误差不超1');
clause([521,835],'反弱521','-6和-2转+6和+2，835反转成功回满HP','无弱化不回血，禁疗不回，封招不反转','保留原幅度至+6','原正速度+3保留，禁疗独立于反转');
clause([1001],'强化1001','对手异常有效时六项+2，否则+1','禁强化六项不变','过期异常不加倍，六级封顶','真实异常回合与能力强化交互');
clause([909],'先手909','先手真实麻痹，未触发附加250','免异常转250，目标全伤免疫不扣HP','后手必定走未触发250分支','控制是否成功与实际固伤分别测量');
clause([1024],'概率免攻1024','两个实例有真实攻击免疫和实际受伤分支','未免疫按实损等量回合末粉伤，封招无反击','三回合到期恢复受伤且不反击','两种50/70概率与实际攻击损血、回合末反馈');
clause([936],'936麻痹','成功麻痹不建立封属','概率失败及免异常建立封属','两回合后对手防御可正常+1','麻痹免疫转封属，验证对手真实强化而非调用');
clause([954],'954低体','自身4999目标5000时低速仍先手','相等或高体时低速后手','4999、5000、5001严格边界','对手+2先制压过自身+1');
clause([1063],'1063王战联','五名王战联对象实际伤害提升50%','普通雷伊对象不增伤，封招无伤害','相同种子伤害取整差不超1','仅目标名字符合来源中的指定成员时适用');
clause([468],'468回合开始','回合开始攻击与命中负等级清除，本次实际威力翻倍','无负能力不翻倍；封招不造成伤害','下一回合无新弱化恢复普通威力','封招前回合开始清弱仍生效，按真实时序验证');
clause([31],'31真实20','逐段实际损血之和等于目标损失，真实20至60段','封招不损血','随机数样本覆盖20与60两个端点','目标只有1HP时死亡立刻终止后续攻击');
clause([968],'968先手90','先手后手均有真实麻痹分支','免异常与封招无异常或伤害','先手90和后手45两侧都有未保留异常样本','相同种子样本中先手实际麻痹次数更多');
clause([1138],'1138成功清','成功清除doubleDamage后真实麻痹或疲惫','无可消效果、免断不产生控制；免异常保护','随机分支覆盖麻痹和疲惫','protect保留原回合效果且不施加异常');
clause([496],'496暴击','暴击后1000HP回满9000','无暴击、禁疗及封招不回血','回复上限9000','真实必暴状态传递，配合魂印完整第五技能测试');
clause([882],'882按正能力','零或六项能力状态按160或280威力产生真实伤害','负命中不增伤、封招不扣目标HP','一种正能力+1与+6增伤相同，六项合计120威力','计种类与实际攻击等级伤害共同验证');
clause([783,1109],'783与1109','自身强化被吸取目标损3000，1109额外回复3000','无强化不附加伤害','三回合后不再触发','实际对手技能吸强后能力归零，反应伤害与普通攻击独立');
for(const id of [783,1109])for(const branch of ['success','failure','boundary','interaction'])clauses[id][branch].push(ref(extra,'1109消强','实际消除强化也触发；1109按真实损血回复，技能禁疗及全伤免疫阻止对应回血'));
clause([3],'清弱3','攻击-6归零','封招保留-6，无弱化不改变','清除六级负状态','保留正防御+2',mechanisms);
clause([532,1065],'回复532','持续四次用招回复3000并造成等量粉伤，1065低半血回复6000','禁療无回复无粉伤，满血同样零粉伤','第五回合到期，8900最多回复100','实际回复量决定粉伤，半血4500不翻倍',mechanisms);
for(const branch of ['success','failure','boundary','interaction'])clauses[1065][branch].push(ref(mechanisms,'回复1065','4499/4500/4501严格半血，实际回复不超过上限；全伤免疫不影响自身回复，四回合到期'));
clause([514],'已损体力514','当前攻击伤害也计入已损失HP再附加35%','免伤和失误不造成损血','目标1HP死亡不为负，比例取整','用实测攻击损血计算追加百分比伤害',mechanisms);
clause([191],'反弹191','真实雷祭施放者自己麻痹，本方免疫','双方免异常时双方均无异常','第五回合免疫到期','真实对手麻痹施放和反弹交互',mechanisms);
clause([1014],'强化1014','高于半血六项+2，否则+1','禁强化六项不变','4499/4500/4501和六级上限','自身真实HP控制全属性强化',mechanisms);
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3592 source and battle-state review',reviewedAt:'2026-10-13',implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};
 if(e.kind==='move'){const m=e.raw;r.rationale='真实技能自身可用；特殊追加技能冥之狂电按单精灵实现，原第五独立保留。';r.singleBehavior=`${m.name}(${m.id}) ${m.kind}，威力${m.power}，PP${m.pp}，先制${m.priority}，命中${m.accuracy}，必中${m.alwaysHit}；全部有序实例单独审核。`;r.tests={success:[ref(base,'基础29招真实','实际技能扣1PP，攻击真实损血'),ref(base,'基础29招原始','原始威力分类与属性决定损血')],failure:[ref(base,'基础29招真实','控制不扣PP，封招不产生技能战斗状态')],boundary:[ref(base,'基础29招真实','零PP不能行动且原状态不变')],interaction:[ref(base,'基础29招原始','真实先制、暴击倍数、攻击分类与命中交互')]};if(m.parameterNormalization){r.rationale+='来源技能30127 hash a9cc2c86与954模板hash45fecb70确认：固定先制+1零参数模板存在冗余实例[1]；原始sourceEffectInstances和规范化说明完整保存，执行零参数固定+1。';r.tests.interaction.push(ref(extra,'954低体','4999/5000/5001与先制对抗验证规范化仍为真实固定+1'));}}
 else if(e.kind==='soul'){r.scope='mixed';r.implementation=['dist/soul-registry.js','dist/souls.js'];r.rationale='回合开始满体先制、非满体增伤与未击败必暴只依赖当前双方；击败后吸取下只出场精灵明确需要下一次入场。无额外强化魂印来源，不虚构版本。';r.singleBehavior='回合开始锁定满HP全技能先制+2，否则当回合攻击/固定/百分比伤害+50%；攻击未击败下回合必暴。';r.deferredBehavior='当回合击败对手则吸取对手下只出场精灵最大体力的1/3（boss无效）';r.trigger='当回合击败当前对手，随后对手下只精灵出场';r.futureMechanisms=['下一只对手入场事件','读取下一只最大体力并吸取三分之一'];r.dependencyEvidence=[{kind:'next-entry',quote:'对手下只出场精灵'}];r.tests={success:[ref(soul,'满血所有','满血两类技能慢速先手，残血攻击固伤粉伤实际增伤'),ref(soul,'残血攻击','残血固伤50变75，回血粉伤3000变4500'),ref(soul,'攻击未击败','攻击未击败下回合真实暴击双倍')],failure:[ref(soul,'攻击未击败','控制和属性不授予，失误仍是攻击未击败，击败不虚构下一只回血')],boundary:[ref(soul,'满血所有','8999/9000边界锁定本回合，即使随后被打残也不切换'),ref(soul,'攻击未击败','必暴只下一回合，到期解除')],interaction:[ref(soul,'魂印必暴传递','魂印必暴触发完整第五496回满，封招不回；追加技能真实多段伤害及835反转回血')]};}
 else {const x=e.raw.instance;r.rationale=`原文“${x.description}”，执行参数${JSON.stringify(x.args)}；当前双方可触发分支逐项验证。`;r.singleBehavior=x.description;
 if(x.id===883){r.scope='multiplayer';delete r.singleBehavior;delete r.implementation;r.rationale='原文明示下只出战精灵，当前对手HP不应因该分支减少；全量原文和[10,40]保留。';r.deferredBehavior=x.description;r.trigger='每次命中当前对手，累计登记下一只出战精灵最大体力降低';r.futureMechanisms=['下一只对手出战事件','最大体力削减累计10%并封顶40%'];r.dependencyEvidence=[{kind:'next-entry',quote:'对手下只出战精灵'}];}
 else if([4,5].includes(x.id))r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map((b,i)=>[b,[ref(base,'属性4与5',[`${e.key}指定能力按参数变化${x.args[2]}级`,'封招、免弱、禁强化阻止对应状态变化','六级上下限不能溢出','真实概率及免疫条件共同判断'][i])]]));
 else {if(!clauses[x.id])throw Error('Missing clause '+e.key);r.tests=clauses[x.id];if(x.id===954)r.rationale+='原[1]保留在技能sourceEffectInstances；同hash模板固定+1且args_num=0，因此此处规范化零参数，不修改来源词条。';}}
 reviews.entries[e.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
const file='research/3592-review-audit.json',audit=JSON.parse(fs.readFileSync(file));audit.source=s.source;audit.inventory=items;audit.status='state-evidence-complete-validation-pending';audit.reviews=Object.fromEntries(items.map(e=>[e.key,reviews.entries[e.key]]));audit.pendingStateEvidence=[];audit.initialFailures=['补充1109禁疗交互测试实际4000、预期1000：既有强化被清吸取回复缺少skill来源，错误穿透技能禁疗。本次保留失败断言并补充skill来源，目标损血仍真实发生。','954源模板args_num=0而30127实例[1]：两个资源已重新查询确认同hash；原参数保留sourceEffectInstances，规范化固定+1零参数指令，不修改验证规则。'];audit.validation={targeted:'pending-final',npm:'pending-final',gate:'pending'};fs.writeFileSync(file,JSON.stringify(audit,null,2)+'\n');const c=reviewCoverage(s,reviews);console.log({total:c.total,missing:c.missing.length,stale:c.stale.length});
