'use strict';
const fs=require('fs'),{inventory,reviewCoverage}=require('../completion-policy.cjs'),s=require('../data/species/3613.json').snapshot,items=inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const base='tests/deployed-3613.test.cjs',soul='tests/deployed-3613-soul.test.cjs',files=['new','reused','mechanisms'].map(x=>'tests/deployed-3613-'+x+'.test.cjs');
const names=[base,soul,...files].flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]})));
function ref(term,assertion){const n=names.find(n=>n.name.includes(term));if(!n)throw Error(term);return {...n,assertion};}
const map={};function cover(ids,term,...assertions){if(assertions.length!==4)throw Error(term);for(const id of ids)map[id]=Object.fromEntries(['success','failure','boundary','interaction'].map((k,i)=>[k,[ref(term,assertions[i])]]));}
cover([1342,2122],'1342与2122','护罩300或400实际抵挡粉伤，2122破罩回复5PP','封招不生成护罩','护罩抵尽后归零，下次粉伤真实扣HP','攻击伤害穿过护罩，粉伤独立被吸收');map[2122].interaction.push(ref('护罩被真实','真实技能1215消除护罩也回复5PP且只触发一次，PP不超上限'));
cover([1207,1726],'1207与1726','目标+2吸成自己+4或+2，下两回合慢速先手','免吸禁强不转移、不降先制','两回合后速度恢复决定先手，等级封顶6','1726无正等级时对手六项-1，1207无强化不触发');
cover([1655,598],'1655与598','真实PP分别回合末+1或即时+2','封招只正常扣PP，无回复','满PP不溢出；1655三回合后不回复','持续回合数与真实技能PP消耗分别验证');
cover([799,977],'799低半血','低于半血4500、高于等于半血2250实际回复和伤害','禁疗阻止回复；799无实际回复不追加粉伤','4499/4500/4501及8999/9000边界','977吸取造成实际伤害独立于禁疗，799按实际回复');
cover([2124],'2124实际','随机伤害真实1倍或2倍，能力条件将概率加至100%','随机未触发保持原伤害，全伤免疫不扣HP','能力正负条件两个方向都验证','相同随机流伤害对照，取整最多差1');
cover([1867],'1867先手','先手实际吸取2250并使对手本回合攻击不损血','后手不额外吸取，禁疗无回复','下一回合封攻到期，真实受伤','目标全伤免疫阻止吸取');
cover([889],'感染889','感染使目标下回合不行动且不扣PP','无可消效果或次数免疫不感染','感染结束双攻-1且中毒持续后两回合','中毒每回合实际损失最大HP八分之一');
cover([2123],'2123芯数','消回合成功感染，1至3芯依序附加中毒、睡眠、寄生','免疫感染转吸取3000，无消回合及免断不吸取','0/1/2/3芯分支分别验证','寄生真实粉伤回血，技能禁疗阻止吸取回复');
cover([1680],'1680无异常','无异常额外200真实伤害','有异常不附加，封招不执行','目标201HP按实际伤害可击败但不负血','攻击免疫不免真伤');
cover([663,1077],'663与1077','对手使用攻击后实际感染','免控不感染，1077转下两回合封属性','三回合期限结束不再感染','1077封属期间对手加速不能强化，期满速度+1');
cover([11],'中毒11','真实概率中毒追加1125粉伤','未触发、免异常、封招分别不追加','最大HP9000的八分之一精确断言','扣血包含正常攻击与独立中毒粉伤');
cover([148],'后手148','后手50%速度-1','先手或概率失败、免弱不下降','速度-6不能越界','后手由真实速度差决定');
cover([1,870],'回复1与固定','攻击伤害一半回血或真实固定吸取100','禁疗不回，免伤无法吸取','8999回血只到9000','实际攻击损血与固定伤害分开计量');
cover([47,48,191],'47免弱48','免弱或免异常使真实对手技能无效，191反弹麻痹','封招不获得免疫','每个实例3/4/5回合到期后重新受弱化或麻痹','对手真实能力技能及异常技能施放');
cover([583,440],'583随机','583随机恰一招PP归零；440对手用招扣3点','封招不清PP','三回合后扣1，只有1PP时降0不负数','实际对手选择技能和PP消费');
cover([408,576],'408减伤','408攻击实伤少200；576低300免疫','封招无法减免','300不被576免疫，三回合后正常损血','固定减伤与攻击限伤顺序，低伤归0');
cover([57,77,532,597],'57与77','期间用招真实回复3000或200，532/597真实粉伤','技能禁疗不回复','逐实例3/4回合到期无回复，满HP不溢出','实际用招、回复、吸取和粉伤独立计量');
cover([1142],'1142回合末','回合末自己降至1，实际降低值一半粉伤','封招不降体，目标全伤免疫不扣HP','1/2/1000/9000体力边界及向下取整','按回合末实际HP计算');
cover([425,849],'425与849','随机2项-2/+2或3项-1/+1','禁强/免弱分别阻止对应等级变化','双方正负6上限，849三回合后停止','每回合真实用招前增减等级，随机不重复取项');
cover([664],'664先手','先手后对手攻击不扣本方HP','后手或封招对手正常攻击','只当回合，下一回合正常损血','真实先后手与攻击伤害');
cover([652],'652消强','消强成功下两回合实际暴击双倍','无正等级不授予必暴','第三回合后正常伤害','正常技能相同种子对照伤害');
cover([837],'837吸取','实际吸取100、200、300并等量回血','禁疗无回复，全伤免疫不吸取','第四次仍300','连续技能使用次数、固定伤害、回复交互');
cover([890],'890正能力','正命中等级触发伤害翻倍','负等级不加倍、免伤不扣HP','+1即满足正等级条件','用命中等级避免攻击面板改变干扰');
cover([1109],'1109消强','真实消强后吸取3000并回复','无强化不吸取，禁疗阻止自身回复','三回合到期不再附加','对手真实消强技能及技能禁疗');
cover([836],'836高体','高于对手时低速先手','等体低体不加先制','4999/5000/5001严格边界','对手+2先制压过本方+1');
cover([760,699],'760微弱','760实际伤害相性微弱转普通；699穿透免攻','封招仍无法造成伤害','对照删除699时免攻完全阻挡','真实草打草微弱、攻击免疫与必中独立');
cover([696],'696暴击率','真实概率暴击，逐次提升至必暴','第一轮部分不暴击、封招无伤害','第九次概率达到上限100%','实际必暴双倍伤害与相同随机流对照');
cover([3],'清弱3','自身攻击-6归零','封招保留负等级','六级负能力清零','正防御+2保留');
cover([1014],'强化1014','高半血六项+2，其余+1','禁强六项不变','4499/4500/4501及六级上限','HP阈值与全属性强化');
cover([939],'后手939','两个实例后手吸取自身最大HP三分之一并回血','先手不吸取、禁疗不回、免伤不扣HP','残血目标按实际剩余HP吸取','真实先制和速度决定先后手');
cover([33],'清强33','对手正攻击+3归零','封招不清、无强化不改','负防御-2保留','正负等级独立处理');
cover([922],'反馈922','自身-3/-6归零，对手对应-3/-6','免弱阻止反馈但自身仍清弱','四回合后不再清弱','正速度保留，反馈原幅度');
for(const e of items){const r={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3613 source and state review',reviewedAt:'2026-10-13',implementation:['dist/souls.js','dist/range-effects.js','dist/effect-registry.js']};
if(e.kind==='move'){const m=e.raw;r.rationale='来源列出的本精灵自身技能，含独立强化技能及两个第五；基础行为在单精灵验证。';r.singleBehavior=`${m.name}(${m.id})，${m.kind}，威力${m.power}，PP${m.pp}，先制${m.priority}，命中${m.accuracy}，必中${m.alwaysHit}；实例按顺序独立审核。`;r.tests={success:[ref('基础31招真实','每招基础扣PP，攻击实际损血'),ref('基础31招原始','威力分类和属性产生真实伤害')],failure:[ref('基础31招真实','控制、封招使实际状态不改变')],boundary:[ref('基础31招真实','零PP无法行动且原状态不变')],interaction:[ref('基础31招原始','速度/先制、命中与暴击共同决定实际结果')]};}
else if(e.kind==='soul'){r.scope='mixed';r.implementation=['dist/soul-registry.js','dist/souls.js','dist/wiki-support.js'];r.rationale='按原文拆分：当前对手选招对应的PP、限伤与免疫当回合实现；原版与强化版独立保留。死亡后的下只精灵出战授予和下场保留只登记未来队伍机制。';r.singleBehavior=e.raw.id===909?'选攻随机一招PP归零并当回合自身受攻最多最大HP一半；选属当回合免异常免弱。':'选攻随机一招PP归零并当回合自身受攻最多最大HP三分之一；选属免异常免弱；对手使用药品而未选择技能时获得灵茉之芯，上限3，逐点固伤粉伤+10%；保留强化种族值与独立魂印。';r.deferredBehavior=e.raw.id===909?'被击败后己方下只出战精灵获得500护盾、500护罩和一次免异常':'被击败后下只精灵出战获得芳馨之祝：500护盾、500护罩，一回合免异常和500临时最大HP；每点灵茉之芯延长祝福回合1，芯及临时HP下场保留';r.trigger='当前精灵被击败，己方下一只精灵出战；相关状态下场保留';r.futureMechanisms=['队伍下一只精灵出战事件','给下一只精灵护盾护罩和免异常','下场状态保存与临时最大HP计数'];r.dependencyEvidence=[{kind:'next-entry',quote:e.raw.id===909?'己方下只出战精灵':'使下只精灵获得芳馨之祝'}];r.tests={success:[ref('选攻随机清一','随机一技能PP归零，真实受攻限4500/3000'),ref('两版选属','真实属性技能异常和弱化均免疫')],failure:[ref('两版选属','对手选攻不保留上回合选属免疫')],boundary:[ref('选攻随机清一','随机清到当回合选择技能则完全不能攻击，其余实伤恰达上限')],interaction:[ref('两版魂印独立','原版与强化版分别开局、真实最大HP差30，两个第五均可用')]};if(e.raw.id===1825){for(const k of ['success','failure','boundary','interaction'])r.tests[k].push(ref('觉醒未选技能','药品回合获得芯，上限3；原魂印不获芯；仅固定/百分比增30%，攻击伤害不变'));r.tests.interaction.push(ref('觉醒完整第五','完整第五消回合后感染、中毒、睡眠、寄生实际扣血和回复，禁疗仍生效'));}}
else {const x=e.raw.instance;r.rationale=`原文“${x.description}”，真实实例参数${JSON.stringify(x.args)}，当前双方效果。`;r.singleBehavior=x.description;if(x.id===1128){r.scope='multiplayer';delete r.implementation;delete r.singleBehavior;r.rationale='当前对手已被击败，其下次攻击须由后继出战对手触发，沿用已审核的1128多精灵分类。';r.deferredBehavior=x.description;r.trigger='击败当前对手后，对手下一只精灵使用攻击技能';r.futureMechanisms=['下一只对手入场','跨出场的一次攻击技能无效计数'];}
else if([4,5].includes(x.id))r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map((b,i)=>[b,[ref('属性4与5',[`${e.key}指定能力按参数${JSON.stringify(x.args)}真实变化`,'封招和免弱/禁强阻止等级变化','能力正负六级上限','真实概率与免疫交互'][i])]]));else {if(!map[x.id])throw Error('Missing '+e.key);r.tests=map[x.id];}}
reviews.entries[e.key]=r;}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');const file='research/3613-review-audit.json',a=JSON.parse(fs.readFileSync(file));a.inventory=items;a.source=s.source;a.status='state-evidence-complete-validation-pending';a.reviews=Object.fromEntries(items.map(e=>[e.key,reviews.entries[e.key]]));a.pendingStateEvidence=[];a.initialFailures=['护罩持续测试等待技能PP仅1，修正夹具等待PP至99，保留护罩和恢复断言。','2124概率对照需前移一次真实随机数，改为项目相同PRNG状态步长。','消回合会移除回合免异常，改用真实次数免疫验证感染失败；未调整效果或断言。','魂印限伤测试使用99999攻击超出真实面板范围，改为合法9999攻击及1防御；浮点期望改用整点110/120/130。','复用939后手测试需指定慢速，408需足够高的合法攻击面板覆盖300限伤，保留精确损血断言。'];fs.writeFileSync(file,JSON.stringify(a,null,2)+'\n');const c=reviewCoverage(s,reviews);console.log({total:c.total,missing:c.missing.length,stale:c.stale.length});
