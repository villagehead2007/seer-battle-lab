'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'..');
const s=require('../data/species/3586.json').snapshot,{inventory,reviewCoverage}=require('../completion-policy.cjs'),items=inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const baseFile='tests/deployed-3586.test.cjs',mechanisms='tests/deployed-3586-mechanisms.test.cjs',soulFile='tests/deployed-3586-soul.test.cjs';
const base='3586 基础28招真实扣PP、零PP拒绝、控制和封招阻止执行',damage='3586 基础28招原始威力分类、暴击倍数、先制与命中决定战斗结果',stats='3586 属性4与5逐实例概率、六级边界及免弱禁强';
const names=[...fs.readFileSync(path.join(root,mechanisms),'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);const clauses={},ref=(name,assertion,file=mechanisms)=>({file,name,assertion});
function clause(ids,term,...assertions){const name=names.find(n=>n.includes(term));if(!name||assertions.length!==4)throw Error(term);for(const id of ids)clauses[id]={name,assertions};}
clause([33],'清强33','清除对手攻击+3','封招保留强化，无强化时不改变等级','防御-2原样保留','实际正负等级分别处理');
clause([54],'减伤54','当回合对方攻击实际伤害减半','攻击免疫时HP不变，封招不执行效果','一回合到期后正常损血','与真实攻击伤害及免疫交互');
clause([48,47],'免异常48','48防止真实雷祭麻痹，47防止实际特防弱化','封招不授予保护','四回合后真实麻痹/弱化恢复','按真实雷祭和技能5概率种子验证免疫');
clause([620],'暴击620','真实种子下更多攻击成为双倍暴击','封招没有概率增益','三回合后增益移除','同种子删除增益的反事实对照伤害');
clause([1044],'吸强1044','目标防御+2转到自己，下两回合真实伤害翻倍','无强化、禁强化及免吸不授予全伤翻倍','下两回合后到期','实际吸取成功控制伤害状态');
clause([77],'用招回复77','每次用招真实回复250','禁疗或封招无回复','3次回复后到期，8999只能补1','回血上限与技能禁疗');
clause([463],'定额减伤463','高伤攻击实际扣血比对照少250','封招没有减伤','低伤归零而非负伤害，三回合到期','相同攻击面板与随机种子对照');
clause([511],'概率威力511','同种子覆盖威力翻倍分支','未触发时与对齐随机流的无效果对照相等；封招不损血','4500与4499严格半血边界','60%分支种子数多于20%分支，按伤害验证');
clause([970],'反转970','对手+2转-4，成功后下一回合实际先手','免弱时补消强但不授予先制，无强化不授予','+6反转限至-6，先制仅下一回合','先制压过速度差，免弱反转失败补消');
clause([842,101],'强化增伤842','842有正等级时伤害1.5倍；101真实回复全部攻击伤害','负等级无增伤；101禁疗不回复，全伤免疫无损血回血','101在8999时只回复至9000','使用命中等级正强化隔离攻防面板影响，回复按实际损血');
clause([922],'反馈922','自己-3和-6清零，对手对应变为-3和-6','目标免弱阻止反馈但不阻止自己清弱','4回合后新弱化不再清除','保留正速度+2，反馈使用真实原弱化幅度');
clause([1013],'强化护盾1013','0/1/6项正能力获得0/50/300护盾','无强化或封招无护盾','六项共300，上限计项而非等级','护盾实际抵挡后续攻击伤害');
clause([1336],'体攻1336','攻击等级+2时最大HP9000加攻击360的25%为2340粉伤','控制或目标全伤免疫无损血','连续三次2340，第四回合不再触发','实际攻击面板和用招次数参与结算');
clause([1017],'护盾1017','护盾0/1/450消耗后追加相同固伤','封招保留护盾，目标免伤不损HP','零护盾不追加','免伤仍消费自身护盾');
clause([885],'强化885','自己HP高于目标全属性+2，否则+1','禁强化不改变六项等级','4999/5000/5001和+6上限','直接比较双方实际HP');
clause([1239],'回复1239','回复4500，回复前低于半血时等量粉伤','禁疗使双方HP不变','4499/4500/4501及8999/9000','目标免伤不阻止自身回复，低血判断在回复前');
clause([1751],'护盾1751','护盾被打破后目标真实损400并流血','未破无反击，免异常/全伤免疫阻止结果','破裂后下一次对手用招真实流血损80','护盾真实吸伤，破裂触发一次后清除状态');
clause([1337],'高体1337','高体真实概率两侧，害怕或消doubleDamage','免控及低体转为消回合','高低体分支均保留实际状态断言','protect免断阻止失败补偿消除');
clause([811],'减伤811','次数减伤值等于本回合实际造成伤害','目标免伤时登记0','下一次攻击消费后删除','移除该状态的相同对局对照损血');
clause([2353],'消耗2353','有盾消费盾，否则消费最大HP30%并等量固伤','封招不消费，目标免伤不造成固伤','HP1/1000/9000与盾0/1/400组合，最低保留1','目标免伤仍消耗自身，完整技能按消费后损血参与2350');
clause([2350],'最低2350','损失3000时弱化目标最低1800，无弱化最低3600并攻击回血','禁疗不回复，目标免伤不损血','攻击限伤100仍生效，最低伤害不穿透限伤','目标能力下降状态控制翻倍及真实回血');
clause([619],'先制619','下两回合自己慢速仍先行动','封招不授予降先制','施放当回合不生效，第三回合后恢复原顺序','真实先制与速度共同决定动作顺序');
clause([2351],'混合2351','目标存活时六项-1','目标免弱或击败时不弱化','六项-6下限不越界','只测试单精灵弱化，未触发的禁止换宠独立延期');
clause([797,1285],'消回合797','797实际消除doubleDamage且阻止技能回血；1285各技能PP扣1','797免断不授予禁疗；1285击败目标不扣PP','目标全1PP时降至0，无负PP','扣PP与对手实际用招消费分别计量；禁疗与1239回复交互');
clause([1156],'击败1156','击败后自己HP回满，所有技能PP回满','未击败不回复；禁疗阻止HP回复','PP初始1也恢复至每招真实上限','禁疗不阻止独立PP恢复');
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3586 source and battle-state review',reviewedAt:'2026-10-13',implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};
 if(e.kind==='move'){const m=e.raw;r.rationale='真实单精灵技能基础行为；38119为鏖战双镰激活自身技能，31897原第五独立保留；技能内换宠分支单独延期。';r.singleBehavior=`${m.name}(${m.id}) ${m.kind}，威力${m.power}，PP${m.pp}，先制${m.priority}，命中${m.accuracy}，必中${m.alwaysHit}；${m.effectInstances.length}个有序效果。`;r.tests={success:[ref(base,'实际扣PP且攻击真实损血',baseFile),ref(damage,'原始威力、分类、相性决定伤害',baseFile)],failure:[ref(base,'控制不扣PP，封招不产生技能状态',baseFile)],boundary:[ref(base,'零PP拒绝且原状态不变',baseFile)],interaction:[ref(damage,'先制、暴击和命中影响真实结果',baseFile)]};if(m.hiddenEffect){r.implementation.push('dist/wiki-support.js');r.singleBehavior+='隐藏效果：'+m.hiddenEffect.description;const n='3586 隐藏1先手必暴与隐藏3低半血必暴真实双倍、后手边界和失误';for(const k of ['success','failure','boundary','interaction'])r.tests[k].push(ref(n,'隐藏1先手才必暴，隐藏3严格低于半血才必暴；无条件对照和边界实际伤害，封招不造成伤害',soulFile));}}
 else if(e.kind==='soul'){r.implementation=['dist/soul-registry.js','dist/souls.js'];r.rationale='魂印879各分支仅涉及当前双方；使用同hash修订描述明确的本回合多次致死半血保留，保留原始描述。无强化魂印版本，不虚构。';r.singleBehavior='免所有异常，三类伤害抗性增加15百分点最高100，受到攻击相性最多2倍；低于280随机自身3项+1及对手1招PP归零，高于280随机对手3项-1及下回合减伤50%；首次致命开启本回合半血保留，首次祝福额外半血粉伤并消强消回合。';const a='3586 魂印879异常全免及三类伤害抗性增加15上限100',b='3586 魂印879受攻279与280与281分流、三项随机和PP归零',c='3586 魂印879先制外实际受攻条件、免弱禁强和下回合减伤到期',d='3586 魂印879克制最多二倍、暴击抗性实际减伤',f='3586 圣战祝福致命保留半血、同回合多次保护和次回合死亡';r.tests={success:[ref(a,'真实雷祭免疫，百分比损血降低15%，固定400变340',soulFile),ref(b,'279三项强化及1招PP归零，281三项弱化',soulFile),ref(d,'高克制限定2，暴击损血按15%抗性降低',soulFile),ref(f,'首次致命后HP4500，目标损4500并被消强消回合',soulFile)],failure:[ref(c,'失误不触发，禁强/免弱阻止等级变化',soulFile),ref(f,'下回合再次致命真正死亡',soulFile)],boundary:[ref(b,'279/280/281边界，280不触发',soulFile),ref(a,'99/90/100抗性增加后均封顶100',soulFile)],interaction:[ref(c,'下回合实际减伤50%，到期解除',soulFile),ref(f,'同回合两次致命都保留半血，仅一次反击；技能禁疗不阻止保留',soulFile)]};}
 else{const x=e.raw.instance;r.rationale=`原词条“${x.description}”，参数${JSON.stringify(x.args)}；当前双方分支逐项测试。`;r.singleBehavior=x.description;if([4,5].includes(x.id))r.tests={success:[ref(stats,`${e.key}按参数指定能力改变${x.args[2]}级`,baseFile)],failure:[ref(stats,'封招/免弱/禁强化阻止变化',baseFile)],boundary:[ref(stats,'六级上下限',baseFile)],interaction:[ref(stats,'真实概率和能力免疫交互',baseFile)]};else{const c=clauses[x.id];if(!c)throw Error('Missing '+e.key);r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map((b,i)=>[b,[ref(c.name,c.assertions[i])]]));}if(x.id===2351){r.scope='mixed';r.singleBehavior='未击败对手时对手六项能力-1';r.deferredBehavior='全属性弱化未触发则对手2回合内无法主动切换精灵';r.trigger='未击败对手且全属性弱化未触发';r.futureMechanisms=['主动换宠操作','按回合阻止对手主动换宠'];r.dependencyEvidence=[{kind:'switch',quote:'无法主动切换精灵'}];r.rationale+='该条直接写明主动切换精灵，只有禁止换宠部分属于多精灵延期。';}}
 reviews.entries[e.key]=r;
}
fs.writeFileSync(path.join(root,'SINGLE-STAGE-REVIEWS.json'),JSON.stringify(reviews,null,2)+'\n');
const file=path.join(__dirname,'3586-review-audit.json'),a=JSON.parse(fs.readFileSync(file));a.source=s.source;a.inventory=items;a.status='state-evidence-complete-validation-pending';a.reviews=Object.fromEntries(items.map(e=>[e.key,reviews.entries[e.key]]));a.pendingStateEvidence=[];a.initialFailures=['减伤测试攻击实际不足250，调整3586测试对手攻击至4000以覆盖250固定减免。','511真实概率判定消费随机数，反事实无效果对照需对齐一次随机前移；保留伤害相等/翻倍断言。原技能必中，失败分支改为真实封招并保留HP不变断言。','1751真实随机流血一回合即到期，换用种子8测试跨回合流血实际80固伤。','复合致死测试将属性夹具转攻击时需给真实普通属性，未修改游戏相性规则。'];a.implementationChanges=['魂印879：形态抗性与免异常、攻击克制上限、低高伤随机等级与PP、本回合圣战祝福。','补充1336/1239/1751/1337/2353/2350/2351/1285/1156真实单精灵分支；2351换宠延期。','922按原弱化幅度反馈；1017/2353消盾触发本精灵1751破盾反应。','隐藏效果1、3根据SeerAPI额外来源进入快照和编译后技能，分别验证真实必暴。'];fs.writeFileSync(file,JSON.stringify(a,null,2)+'\n');const c=reviewCoverage(s,reviews);console.log({total:c.total,missing:c.missing.length,stale:c.stale.length});
