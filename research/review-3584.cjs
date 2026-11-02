'use strict';
// Explicit per-instance source/semantic review, referencing executable battle witnesses.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),s=require('../data/species/3584.json').snapshot;
const {inventory,reviewCoverage}=require('../completion-policy.cjs');
const items=inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const baseFile='tests/deployed-3584.test.cjs',mechanisms='tests/deployed-3584-mechanisms.test.cjs',soulFile='tests/deployed-3584-soul.test.cjs';
const base='3584 基础18招真实扣PP、零PP拒绝、控制和封招阻止执行',damage='3584 基础18招原始威力分类、暴击倍数、先制与命中决定战斗结果',stats='3584 属性4与5逐实例概率、六级边界及免弱禁强';
const names=[...fs.readFileSync(path.join(root,mechanisms),'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const ref=(name,assertion,file=mechanisms)=>({file,name,assertion}),clauses={};
function clause(ids,term,...assertions){const name=names.find(n=>n.includes(term));if(!name||assertions.length!==4)throw Error(term);for(const id of ids)clauses[id]={name,assertions};}
clause([15],'害怕15','真实种子覆盖害怕后对手不能行动且PP不消费','免异常及封招不施加害怕','控制持续当回合对手行动点，300种子覆盖触发与未触发','害怕影响真实攻击伤害和PP，免控阻止异常');
clause([797],'消回合797','消除doubleDamage后对手技能回复被禁止','无回合效果或protect免断不授予禁疗','当回合及下一回合禁止回复，第三回合技能回复恢复','实际1065回血与技能禁疗的HP交互');
clause([1249],'吸血1249','HP增加真实攻击伤害一半，目标异常时追加等量粉伤','无异常无追加，禁疗不回复，全伤免疫不造成伤害','回复受9000满血上限约束并向下取整','粉伤基于源攻击伤害份额，满血/禁疗不抹掉独立异常追加');
clause([676],'双防676','防御+2后双防总和900附加270百分比伤害','属性用招、失误、全伤免疫不扣目标HP','施放当回合不触发，随后三回合有效，第五回合失效','使用实际防御等级计算追加量，与基础攻击分别计量');
clause([514],'已损体力514','目标实际损血包含攻击与已损HP25%追加','免伤或失误不损血','满血及已损1000两种情况，目标仅10HP不低于0','已损HP包含当次攻击，向下取整并保留攻击独立计量');
clause([191],'反弹191','真实雷祭反弹后施术者麻痹，自己无麻痹','双方免异常时双方均无麻痹','四回合保护后第五回合雷祭使自己麻痹','免控、反弹及真实概率命中共同结算');
clause([1085],'低伤1085','实际受到299攻击伤害后对手损失300固伤','300/301、攻击失误或免伤时不反击','四回合反击，第五回合停止；精确299/300/301边界','对手粉伤免疫阻止300反击，但自己仍真实受攻击伤害');
clause([1073],'高伤1073','301受伤后回满并反击实际回复量，原8000HP时回复反击1301','299/300不触发，禁疗不回复也不反击','致死不复活，四回合后到期','主动回复遵守技能禁疗，反击按HP真实增量计算');
clause([683],'固伤683','真实随机种子产生150至300的固伤','免伤或失误时HP不变','种子覆盖150与300两端','追加固伤与基础攻击分开计量');
clause([1014],'强化1014','半血以下或等值全属性+1，高于半血全属性+2','禁强化时六项保持0','4499/4500/4501边界，六项不超过+6','实际HP阈值和禁强化决定六项能力变化');
clause([1065],'回复1065','低半血回复6000，否则3000，并按实际回复量扣目标HP','满血、禁疗时无回复无追加','4499/4500/4501及8999/9000边界；四回合后到期','目标免伤不阻止自己回血，禁疗使双方HP均不变');
clause([570],'攻击免疫570','一次攻击不损血且次数归0，再次攻击真实损血','属性和攻击失误不消费，封招不授予免疫','仅一次攻击免疫','攻击免疫次数和用招/命中结果分别验证');
clause([697,699],'无视697','697穿过10点攻击限伤，699穿过攻击免疫真实扣血','封招不损血，移除对应效果的对照仍被限伤或免攻','697仍被免攻，699仍被限伤到10','按实例分别证明限伤和免疫是独立条件');
clause([939],'后手939','后手扣除目标3000并回复自己3000','先手、全伤免疫不吸取；技能禁疗不回复','目标仅1000时最多吸取攻击后剩余HP','先制改变实际顺序；禁疗仍允许损血但不能回复');
clause([1060],'吸強1060','对手攻击+2转为自己+2，下回合攻击不损血','无强化、自己禁强化、目标免吸时不封攻','原第五1回合与激活招2回合分别到期；当回合对手仍攻击','保留目标负防御；以实际吸取成功决定封攻');
clause([1258],'高伤1258','301攻击伤害后一次异常免疫真实抵挡雷祭','299/300或封招不增加免疫','两个实例均覆盖299/300/301；免疫消费后再次雷祭麻痹','真实麻痹与免疫次数交互，不只检测登记字段');
clause([989],'低伤989','299伤害后追加300，自己HP低于对手追加600','300/301、免伤或封招无追加','精确299/300/301，双方实际体力比较两侧','基础攻击与固伤分开计量，不能把粉伤算入攻击阈值');
clause([2240],'清异常2240','解除烧伤且本次实际攻击按1.5倍威力公式结算','无异常时伤害与无该效果相同；封招不解除烧伤','疲惫阻止行动且不消耗PP','烧伤清除后不再回合扣血，解除发生在本次伤害计算前');
clause([2307],'微弱2307','真实属性相性小于1时追加300除以相性固伤','达到300攻击伤害、免伤或封招不追加','299/300/301及多种真实属性相性','微弱倍率独立参与固伤，正常相性只追加300');
for(const e of items){
 const review={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3584 source and battle-state review',reviewedAt:'2026-10-13',implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};
 if(e.kind==='move'){
  const m=e.raw;review.rationale='当前精灵技能基础行为；激活37965属于自身能力，与原第五31887独立保留，不延期。';review.singleBehavior=`${m.name}(${m.id})：${m.kind}，威力${m.power}，PP${m.pp}，先制${m.priority}，命中${m.accuracy}，必中${m.alwaysHit}；有序执行${m.effectInstances.length}个实例。`;
  review.tests={success:[ref(base,`${m.id}真实用招PP减1，攻击造成HP变化`,baseFile),ref(damage,`${m.id}按原威力、分类和属性计算HP损失`,baseFile)],failure:[ref(base,`${m.id}被控制不行动、封招扣PP但不执行技能状态`,baseFile)],boundary:[ref(base,`${m.id}零PP拒绝且输入状态不变`,baseFile)],interaction:[ref(damage,`${m.id}先制、速度、暴击、命中和攻防分类影响实际战斗结果`,baseFile)]};
 }else if(e.kind==='soul'){
  review.implementation=['dist/soul-registry.js','dist/souls.js'];review.rationale='885所有分支只依赖当前在场双方；采用同hash的desc_formatting_adjustment明确防守分支须实际受到攻击伤害，原desc保留。来源advance/intensified_to为空，不编造强化魂印。';review.singleBehavior='战斗HP上限与当前HP增加200；自身使用攻击技能或实际受到攻击伤害时50%害怕对手，实际未触发的每个分支在阶段末附加自身最大HP的1/3百分比伤害；免控失败计入补偿，免伤/失误不算受到攻击伤害。';
  const a='3584 魂印885入场增加200真实体力、回合不叠加与重开',b='3584 魂印885攻击50%实际害怕或阶段末粉伤、概率两侧',c='3584 魂印885用招失误仍触发、控制和属性不触发、阶段末才结算',d='3584 魂印885实际受攻击伤害才反应、失误免攻无效及属性不触发',f='3584 魂印885免控转为粉伤、粉伤免疫与致死不复活';
  review.tests={success:[ref(a,'基础9000入场变为9200，回合不叠加',soulFile),ref(b,'真实概率两侧：害怕阻止对手攻击，未触发追加HP损失',soulFile),ref(d,'实际受攻击伤害后害怕或阶段末损血',soulFile)],failure:[ref(c,'控制不消费PP，属性无触发；攻击失误仍属于使用',soulFile),ref(d,'对手失误或攻击免疫不触发受伤分支',soulFile)],boundary:[ref(a,'重开只有200增益，跨回合不增加',soulFile),ref(f,'自身致死不复活、不造成阶段末补偿',soulFile)],interaction:[ref(c,'攻击和受击各失败一次，阶段末两次各3066伤害；对手仍完成攻击证明非即时补偿',soulFile),ref(f,'对手免控触发补偿，粉伤免疫阻止损血',soulFile)]};
 }else{
  const x=e.raw.instance;review.rationale=`真实词条“${x.description}”，有序参数${JSON.stringify(x.args)}；未引用队伍/替补/下一只出场，单精灵实现。`;review.singleBehavior=x.description;
  if([4,5].includes(x.id))review.tests={success:[ref(stats,`${e.key}改变参数指定能力等级${x.args[2]}`,baseFile)],failure:[ref(stats,'封招、免弱和禁强化阻止变化',baseFile)],boundary:[ref(stats,'正负六级上限保持',baseFile)],interaction:[ref(stats,'按参数索引逐实例核验能力、概率、免疫的实际结果',baseFile)]};
  else{const c=clauses[x.id];if(!c)throw Error('Missing evidence '+e.key);review.tests=Object.fromEntries(['success','failure','boundary','interaction'].map((b,i)=>[b,[ref(c.name,c.assertions[i])]]));}
 }
 reviews.entries[e.key]=review;
}
fs.writeFileSync(path.join(root,'SINGLE-STAGE-REVIEWS.json'),JSON.stringify(reviews,null,2)+'\n');
const auditPath=path.join(__dirname,'3584-review-audit.json'),audit=JSON.parse(fs.readFileSync(auditPath));
audit.inventory=items;audit.source=s.source;audit.status='state-evidence-complete-validation-pending';audit.reviews=Object.fromEntries(items.map(e=>[e.key,reviews.entries[e.key]]));audit.pendingStateEvidence=[];
audit.implementationChanges=['新增魂印885及仅其使用的入场200体力增益；攻击/实际受伤害怕分支与阶段末补偿。','新增1085/1073受攻低伤反击、高伤主动回满实际等量反击；2240清异常本次威力增幅；2307微弱比例固伤。','1060按真实吸取成功封攻，禁强化/免吸不虚假成功；3575–3580已完成精灵未使用该效果。','补齐3584自身属性组合97映射，使用真实属性表；原第五与激活技能独立分类并经local-species.save部署。'];
audit.initialFailures=['从3580复用的测试辅助配招残留10194并非3584技能；改为3584真实暗影箭10392，保留状态断言。','两个失误反例用了必中攻击夹具，导致实际命中；将3584专用普通攻击夹具改为非必中且准确率100，保留全部失败断言，不改游戏命中机制。'];
fs.writeFileSync(auditPath,JSON.stringify(audit,null,2)+'\n');const c=reviewCoverage(s,reviews);console.log({total:c.total,missing:c.missing.length,stale:c.stale.length});
