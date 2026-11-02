'use strict';
// Explicit source/semantic decisions and named battle-state witnesses for 3578 only.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const {inventory,reviewCoverage}=require('../completion-policy.cjs');
const snapshot=require('../data/species/3578.json').snapshot;
const entries=inventory(snapshot);
const file='tests/deployed-3578-mechanisms.test.cjs',baseFile='tests/deployed-3578.test.cjs';
const baseName='3578 基础17招真实扣PP、零PP拒绝、控制和封招阻止执行';
const damageName='3578 基础17招原始威力分类、暴击倍数、先制与命中决定战斗结果';
const statName='3578 属性4与5逐实例概率、六级边界及免弱禁强';
const ref=(name,assertion,testFile=file)=>({file:testFile,name,assertion});
const branches=['success','failure','boundary','interaction'];
// Each string describes assertions in the named test, not just a registered rule.
const clauses={
  736:['3578 消强736成功封属两回合、无强化失败与负等级保留',
    '对手攻击+2归零且当前属性强化被阻止', '对手无正等级时属性招正常防御+2、不登记statusBlock',
    '第二回合仍封属，第三回合防御实际+2', '负特攻-1保持不变，封属仍扣对手PP'],
  1194:['3578 反弱1194成功反转后免弱四回合、无弱化和禁强不登记',
    '自身命中-2、防御-6反转为+2、+6，接续烟幕未降低命中', '无负等级不登记免弱；禁强化时攻击仍-2且不授予免弱',
    '第四回合命中仍+2，第五回合烟幕降至+1；反转-6抵达+6', '反弱成功后的同回合与后三回合免弱保护实际等级，禁强化阻止反转'],
  48:['3578 免异常48两个实例分别四或五回合、到期及次数免疫互不混淆',
    '四回合或五回合内雷祭无法附加麻痹', '到期且一次免疫消耗后，雷祭真实附加麻痹',
    '两个持续参数分别覆盖最后有效回合和到期后的回合', '持续免疫不消费counts.immune，到期后才消费一次免疫'],
  88:['3578 概率88真实百分之十五翻倍、阈值两侧与失误',
    '命中概率分支时实际攻击伤害为同伤害随机数对照的两倍（取整误差至多1）', '未触发概率时伤害与无效果对照一致，失误时对手HP不变',
    '80个确定种子覆盖15%概率阈值两侧，均逐一核对实际伤害', '固定后续伤害随机序列对照，保留原威力与属性相性结算'],
  692:['3578 反射692仅暴击伤害反射、两回合到期与非暴击照常受伤',
    '暴击时自身HP保持9000，对手额外损失未反射对照中的等量攻击伤害', '非暴击攻击照常扣自身HP',
    '第二回合仍反射，第三回合实际受伤', '实际必暴攻击与反射效果交互，比较双方HP及攻击伤害'],
  1195:['3578 受攻1195四回合疲惫或免疫后固定300、属性和失误不触发',
    '受到攻击后对手真实附加疲惫，成功时不额外扣300', '对手属性招或攻击失误均不触发；免异常使疲惫失败后每回合扣300',
    '持续四回合均追加300，第五回合不再追加', '免异常转入固定伤害分支，但当回合免伤保护阻止固定伤害'],
  776:['3578 翻倍776仅下两回合攻击伤害翻倍、封招失败与到期',
    '第二、第三回合攻击实际伤害相对无doubleDamage对照翻倍', 'skillBlock封招后没有doubleDamage增益',
    '覆盖下两回合实际攻击并验证第三回合末增益到期', '与基础攻击取整结算交互，同状态对照仅移除增伤效果'],
  683:['3578 固伤683随机150至300包含两端、免伤与失误',
    '对手总损血减去真实攻击伤害为150至300间固伤', '当回合免伤与攻击必失均令对手HP不变',
    '确定种子搜索实际150、300两个固伤端点并断言均出现', '固定伤害和攻击伤害单独计量，免伤同时保护两类伤害'],
  946:['3578 强化946体力比较严格低于才翻倍、等级上限和禁强',
    '自身HP4999对手5000时六项+2，5000或5001时六项+1', '禁强化时六项等级均不变化',
    '严格低于、等于、高于及六项+6上限均逐一断言', '禁强化和上限通过公共属性流程处理'],
  597:['3578 吸取597四次用招实际损血回复、残血禁疗与免伤',
    '四次用招均使自身1000升至4000，对手9000降至6000', '第五次用招不吸取；疲惫阻止行动不吸取',
    '对手仅100HP时只实际吸取100，自身升至1100；覆盖第四、第五回合', '技能禁疗时对手仍损血自身不回血，免伤阻止损血也阻止虚假回复'],
  843:['3578 先制843下两回合包含属性和攻击、到期及更高先制',
    '原本较慢者下两回合属性与攻击均抢先行动', '对手先制+3时自身+2无法抢先',
    '施放当回合不抢先，下两回合抢先，第四回合再次后手', '与速度和对手更高先制比较真实turns.first'],
  792:['3578 先手792只封当前攻击、后手失败且属性照常执行',
    '自身先手后对手攻击无效，自身HP保持9000', '后手时已经受到真实伤害；对手属性招仍防御+2',
    '只封当前回合，下一回合对手攻击造成真实损血', '被封攻击仍扣PP，属性招不受攻击封锁影响'],
  1258:['3578 免异常1258严格高于300才授予一次免疫并实际消费',
    '攻击伤害301获得一次免异常，雷祭后counts.immune归零且无麻痹', '实际攻击伤害299或300不授予次数免疫',
    '攻击伤害上限分别控制到299、300、301并断言精确伤害及授予数量', '伤害上限与严格大于阈值交互，后续真实异常攻击消费次数'],
  1032:['3578 消回合1032成功仅封下一回合攻击、失败及免断',
    '消除doubleDamage后下回合攻击不能造成损血', '无回合效果不登记封攻，protect免断保留保护且不登记封攻',
    '当前回合仍受攻击，下回合免攻击损血，再下一回合正常受伤', '消回合成功条件、免断保护和下一回合封攻时序交互'],
  933:['3578 未击败933下一次攻击真实必暴、属性不消费且击败不授予',
    '未击败时登记一次必暴，后续真实攻击伤害相对无必暴对照翻倍', '击败仅1HP对手时不授予nextCrit',
    '属性行动保留一次必暴，随后一次攻击消耗至0', '移除下一次必暴的同状态对照证明伤害翻倍及消费，不依赖自然暴击'],
};
const reviews=JSON.parse(fs.readFileSync(path.join(root,'SINGLE-STAGE-REVIEWS.json'),'utf8'));
for(const e of entries){
  const review={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3578 source and battle-state review',reviewedAt:'2026-10-13'};
  if(e.kind==='skill'&&e.raw.instance.id===826){
    Object.assign(review,{scope:'multiplayer',rationale:'原文要求当回合击败对手后，在下回合开始向对手附加异常。当前目标已死亡，单精灵对局此时结束；后续有效目标需要下一只对手出场。本项不包含可对当前存活目标触发的分支。',deferredBehavior:e.raw.instance.description,trigger:'本次攻击当回合击败当前对手，下一回合开始且对手下一只精灵已出场',futureMechanisms:['击败后的下一只对手出场','跨回合待执行异常事件及替补目标绑定','按真实异常池随机一种并按新目标免疫结算']});
  }else if(e.kind==='move'){
    const m=e.raw;
    Object.assign(review,{rationale:'技能基础PP、命中、先制及物理/特殊/属性分类只依赖当前在场双方；各效果实例另行逐项审核。',singleBehavior:`${m.name}(${m.id})：${m.kind}，威力${m.power}，PP${m.pp}，先制${m.priority}，命中${m.accuracy}，必中${m.alwaysHit}；全部${m.effectInstances.length}个实例按来源顺序保留，826击败后跨出场异常单独延期。`,implementation:['dist/engine.js','dist/souls.js','dist/effect-registry.js'],tests:{
      success:[ref(baseName,`${m.id}实际使用PP减1${m.kind==='status'?'':'且造成攻击伤害'}`,baseFile),ref(damageName,`${m.id}按原始威力、分类、相性计算实际HP结果`,baseFile)],
      failure:[ref(baseName,`${m.id}被控制时PP不消耗；封招时PP消耗但双方HP、等级、异常及自身效果和次数不产生技能变化`,baseFile)],
      boundary:[ref(baseName,`${m.id}零PP拒绝且输入战斗状态不变`,baseFile)],
      interaction:[ref(damageName,`${m.id}原始先制与速度决定行动顺序；攻击招按分类面板、暴击及命中结算真实HP`,baseFile)]}});
  }else if(e.kind==='soul'){
    const start='3578 魂印882回合初严格高于半血攻击速度加一、等级上限禁强',hit='3578 魂印882受实际攻击授予下一次双倍、重复受击不累积且属性保留',other='3578 魂印882固定百分比伤害不授予攻击增伤且死亡不获益',end='3578 魂印882阶段末低半血吸取并获下回合全技能先制、半血等值不触发',combo='3578 原招交叉格挡自身强化吸取先制与魂印阶段结算有序';
    Object.assign(review,{rationale:'882全部分支只涉及自身与当前对手的HP、能力和下一次攻击/下回合先制。来源未列伙伴追加技能或强化魂印版本，不能臆造版本，也不能因“下回合”延期。',singleBehavior:'受到实际攻击伤害后自身下一次攻击伤害提升100%，再次受击刷新一次；回合开始严格高于半血时攻击、速度各+1；战斗阶段末严格低于半血时立即吸取对手最大HP的1/3、仅按实际损血回复，并授予下一回合所有技能先制+2。下一回合修饰先制，吸取按阶段末条件当次结算。',implementation:['dist/range-souls.js','dist/souls.js','dist/soul-registry.js'],tests:{
      success:[ref(start,'HP4501时攻击速度各+1'),ref(hit,'受攻击后下一次实际伤害翻倍'),ref(end,'HP4499阶段末变7499，对手9000变6000；下回合较慢者抢先')],
      failure:[ref(start,'禁强化保持六项0'),ref(other,'固伤/百分比伤害不授予攻击增伤；持有者死亡无增伤'),ref(end,'HP4500或4501不吸取也不授予优先级')],
      boundary:[ref(start,'4499/4500/4501及六级上限'),ref(hit,'重复受击仍仅一次，攻击消耗至0'),ref(end,'对手仅100HP时只吸取100，先制仅下回合有效')],
      interaction:[ref(hit,'属性用招保留增伤，疲惫不能消费，攻击免疫零伤害不充能'),ref(end,'对手免伤时双方HP不变'),ref(combo,'交叉格挡先强化两级、用招吸取，低半血再触发魂印吸取至7000；下一回合魂印先强化攻击至3')]}});
  }else{
    const {instance}=e.raw;
    Object.assign(review,{rationale:`按实例原文“${instance.description}”和参数${JSON.stringify(instance.args)}核对：仅作用当前在场双方，属于单精灵。`,singleBehavior:instance.description,implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']});
    if([4,5].includes(instance.id)){
      const stat=['攻击','防御','特攻','特防','速度','命中'][instance.args[0]],target=instance.id===4?'自身':'对手';
      const witnesses=[`${target}${stat}实际变化${instance.args[2]}级`,`${target}受${instance.args[2]>0?'禁强化':'免弱'}保护时等级不变；封招不改变双方等级`,'对应正六级或负六级上限不越界','概率、免疫和等级上限通过真实用招结算'];
      review.tests=Object.fromEntries(branches.map((b,i)=>[b,[ref(statName,witnesses[i],baseFile)]]));
    }else{
      const c=clauses[instance.id];if(!c)throw Error('unreviewed '+e.key);
      review.tests=Object.fromEntries(branches.map((b,i)=>[b,[ref(c[0],c[i+1])]]));
    }
  }
  reviews.entries[e.key]=review;
}
fs.writeFileSync(path.join(root,'SINGLE-STAGE-REVIEWS.json'),JSON.stringify(reviews,null,2)+'\n');
const auditPath=path.join(__dirname,'3578-review-audit.json'),audit=JSON.parse(fs.readFileSync(auditPath,'utf8'));
audit.status='state-evidence-complete-validation-pending';audit.source=snapshot.source;audit.inventory=entries;
audit.reviews=Object.fromEntries(entries.map(e=>[e.key,reviews.entries[e.key]]));
audit.implementationChanges=['新增魂印882：受实际攻击后的下一次增伤、回合初高半血强化、阶段末低半血吸取与下回合先制。','1195接受已核实疲惫枚举7并新增受攻击后的疲惫/未触发300固伤执行；保留原枚举19及未知枚举拒绝。','1194反转负等级改走原有stage流程，禁止绕过禁强化；反转实际成功才授予免弱。'];
audit.initialFailures=[{test:'1194反弱',reason:'原处理器直接写入stages绕过禁强化',resolution:'使用公共stage流程，保留失败断言；一次实现修复'},{test:'48持续免异常',reason:'第五回合免疫到期后，随机雷祭在第六回合未命中，不能消费次数免疫',resolution:'固定真实RNG种子确保测试刺激命中，保留到期、麻痹和次数消费的全部断言'},{test:'1195疲惫',reason:'初始种子5产生仅一回合疲惫，到回合末已经到期',resolution:'换成真实种子1覆盖跨回合疲惫状态，保留原断言和四回合补偿分支'}];
for(const effect of audit.effects){effect.implementationBefore=effect.implementation;delete effect.implementation;effect.review=reviews.entries[effect.key];effect.finalStatus=effect.scope==='multiplayer'?'deferred-multiplayer':'state-tested';}
fs.writeFileSync(auditPath,JSON.stringify(audit,null,2)+'\n');
const coverage=reviewCoverage(snapshot,reviews);console.log({total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length});
