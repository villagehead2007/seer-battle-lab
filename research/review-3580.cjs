'use strict';
// Explicit semantic audit for 3580; keep other species reviews intact.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),s=require('../data/species/3580.json').snapshot;
const {inventory,reviewCoverage}=require('../completion-policy.cjs');
const items=inventory(s),reviews=require('../SINGLE-STAGE-REVIEWS.json');
const baseFile='tests/deployed-3580.test.cjs',mechanisms='tests/deployed-3580-mechanisms.test.cjs',soulFile='tests/deployed-3580-soul.test.cjs';
const base='3580 基础24招真实扣PP、零PP拒绝、控制和封招阻止执行',damage='3580 基础24招原始威力分类、暴击倍数、先制与命中决定战斗结果',stats='3580 属性4与5逐实例概率、六级边界及免弱禁强';
const names=[...fs.readFileSync(path.join(root,mechanisms),'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const ref=(name,assertion,file=mechanisms)=>({file,name,assertion});
const clauses={};
function clause(ids,term,...assertions){const name=names.find(n=>n.includes(term));if(!name||assertions.length!==4)throw Error(term);for(const id of ids)clauses[id]={name,assertions};}
clause([1055,988],'消强1055','对手攻击+2消除为0，负防御-1保留；下回合攻击不损血','无强化不登记封锁','当前回合仍受伤，仅下一回合封锁，之后恢复攻击损血','988封全部技能阻止属性强化；1055只封攻击，属性仍攻击+2');
clause([925],'满血925','满血时真实攻击伤害随翻倍威力增加','8999/9000体力时不触发，与无该效果对照伤害一致','8999与9000严格满血边界','失误时不产生攻击伤害');
clause([29],'固伤29','实际损血减攻击伤害恰为75','失误时不追加','攻击伤害免疫时仍损75；全伤免疫时损0','分别验证攻击免疫和全伤免疫对固定追加的区别');
clause([3],'清弱3','攻击-6归零，防御+2保留','skillBlock时攻击仍为-6','无弱化时等级不变，-6可以清至0','保留正等级且封招阻止清弱');
clause([590],'弱化590','六项同时-1或-2，真实随机种子覆盖两分支','免弱时六项仍0','六项-6下限不越界','翻倍分支与免弱、下限共同验证');
clause([782],'失明782','真实攻击命中后存在失明状态','第一使用概率未触发时无失明，免异常也无失明','第六次使用次数为6，概率达到100并确实附加失明','使用次数递增与目标免异常交互');
clause([532,1065],'回复532','持续四次真实回血并对手减少对应HP','第五回合不再触发，满血或禁疗时不产生虚假粉伤','HP4500不触发1065双倍，HP8900只恢复100并只造成100粉伤','1065低于半血恢复6000并粉伤6000；532恢复3000；均遵守禁疗');
clause([1322],'受击1322','无魂印夹具实际受攻击后对手进入诅咒','未受攻击不弱化；免异常导致诅咒失败后全属性-1','持续四回合分别累加到-4，第五回合不再追加','免异常且免弱时六项不变，技能机制不依赖魂印');
clause([1018],'低伤1018','399攻击伤害免疫并返还399固伤，对手HP变8601','400和401照常损血、不返还','严格399/400/401阈值，三回合结束后重新受伤','攻击免疫后独立75固伤仍被返还；对手全伤免疫阻止返还伤害');
clause([786],'随机异常786','真实种子产生单个异常，覆盖至少五个异常种类','免异常或失误时无异常','每次最多一种异常，不重复附加多种','源技能命中和异常免疫决定目标真实状态');
clause([191],'反弹191','自身无麻痹，施术者被真实反弹麻痹','双方免疫时双方均无异常','两个实例的四回合保护、第五回合到期后自身麻痹','实际雷祭命中后按免疫反弹链结算');
clause([58,693],'必暴58','下两回合实际攻击伤害为无相应增益对照的两倍','封招时不授予增益','覆盖下两回合，第三回合结束移除增益','58通过真实暴击、693通过真实增伤分别计算伤害');
clause([980],'先手980','先手封当回合属性，阻止对手攻击等级+2','后手不阻止已执行的属性强化','下一回合属性重新强化+2','攻击技能仍真实扣HP，不被属性封锁影响');
clause([1317],'后手1317','后手时自身HP1000变4000','先手或技能禁疗时仍1000','HP8900仅补满到9000','行动顺序及禁疗限制真实回复');
clause([594],'594严格','299真实攻击伤害后附加诅咒','300或301不附加，免异常阻止诅咒','精确299/300/301严格阈值','伤害上限控制边界，异常免疫单独核验');
clause([1152],'1152无正','无正等级时实际攻击伤害为对照的1.8倍（取整差至多2）','存在正等级时与对照相同，失误不扣HP','负等级-1、0、+1三种条件','非攻击项的正等级也阻止无强化增伤');
clause([1333],'1333有正','存在正等级时80%分支实际诅咒','无强化不诅咒，概率失败或免异常时不诅咒','正等级+1和+6触发条件、64种子覆盖概率两侧','能力状态和目标免疫共同决定是否诅咒');
clause([1047],'1047诅咒','诅咒成功时自身HP1000不变，未触发时吸取3000','免异常转入吸取；全伤免疫使双方HP不变','对手只有100体力时仅吸取100，自身升至1100','技能禁疗阻止自身回复但对手仍减少3000');
clause([1077],'1077使用','对手使用攻击后必定实际诅咒','对手用属性不触发；免异常后下两回合属性强化被封','两回合封属后第三回合属性恢复攻击+2','对手攻击失误仍属于使用攻击，仍触发诅咒');
clause([1334],'1334低伤','低于300即时诅咒，不额外登记下一次','免异常导致即时失败，授予下一次技能诅咒','恰300转入下一次；下一次属性实际附加后计数归0','疲惫阻止行动时不消费下一次诅咒，两个实例逐项覆盖');
clause([937],'937免诅咒','诅咒成功后目标真实异常','免异常使前置失败，转入下两回合先制-2','施放当回合对手仍先手，后两回合后手，再下一回合恢复先手','先制扣减与原本更快的速度比较实际行动顺序');
clause([971],'吸取971','低于半血吸取6000，等于或高于半血吸取3000','第五回合不再吸取，禁疗时自身HP不增','4499/4500/4501边界，对手仅100时只吸100','禁疗仍允许真实扣对手HP，持续四回合独立结算');
clause([2306],'2306下两次','下两次被封攻击各造成300攻击伤害并诅咒，计数依次变1、0','疲惫阻止用招不消耗；第三次被封攻击不再有补偿','两次上限，属性被封只诅咒不造成攻击伤害','成功用招也消费下一次使用次数，补偿攻击不恢复原技能命中效果');
clause([886],'忽防886','下一次攻击忽略一半防御，伤害高于普通对照','封招不能授予忽防','属性用招保留0.5，下一次攻击消费后删除','同战斗状态仅移除忽防的真实伤害对照');
clause([1114],'消回合1114','两个实例均清doubleDamage后清空两项PP','无回合效果或protect免断时不清空PP','四技能列表精确两项归0','按实际消回合成功状态控制PP随机清空');
clause([833,1709],'吸取833','排除基础攻击损血后，两效果均实际追加3000且回复3000','全伤免疫时不损血不回复，技能禁疗只阻止回复','对手仅100时833回复100，而1709击败后不回复','保持吸取与未击败才回复的语义区别');
clause([897],'未击败897','未击败后下一次实际受攻伤害减半','击败不授予次数减伤','一次受攻后计数归零','有无减伤的相同战斗状态伤害对照');
clause([1049],'击败1049','击败后全属性增加源参数1或2','未击败或禁强化时六项不变','六项+6不超上限，两个参数实例均覆盖','击败判定与禁强化共同控制真实等级变化');
clause([1956],'1956对手','对手无异常时较慢的自己先行动并真实造成伤害','对手有失明时不获先制、自己后手','有/无异常边界','先制加一压过速度差');
clause([683],'固伤683','实际损血减攻击伤害为200至400固伤','全伤免疫和失误时对手HP不变','确定种子找到200与400两端','固伤与基础攻击分别计量');
clause([946],'强化946','自身HP4999、对手5000时六项+2，否则+1','禁强化时六项不变','4999/5000/5001及六级上限','使用实际体力值比较而非百分比');
clause([843],'先制843','下两回合属性及攻击均先于原本更快的对手','对手先制+3压过自身+2','施放回合不加、下两回合生效、到期恢复后手','速度和更高先制共同决定行动顺序');
for(const e of items){
  const review={sourceDigest:e.sourceDigest,scope:'single',reviewedBy:'Codex 3580 source and battle-state review',reviewedAt:'2026-10-13',implementation:['dist/range-effects.js','dist/effect-registry.js','dist/souls.js']};
  if(e.kind==='move'){
    const m=e.raw;review.rationale='当前在场精灵可使用的技能基础行为；原第五31863与激活技能29076/37310各自保留真实来源标记，不属于多精灵延期。';review.singleBehavior=`${m.name}(${m.id})，${m.kind}，威力${m.power}，PP${m.pp}，先制${m.priority}，命中${m.accuracy}，必中${m.alwaysHit}；按来源顺序执行${m.effectInstances.length}个实例。`;
    review.tests={success:[ref(base,`${m.id}用招PP减1，攻击招实际损血`,baseFile),ref(damage,`${m.id}实际HP按原始分类威力和相性计算`,baseFile)],failure:[ref(base,`${m.id}控制不扣PP，封招扣PP但不产生技能状态变化`,baseFile)],boundary:[ref(base,`${m.id}零PP拒绝且输入状态不变`,baseFile)],interaction:[ref(damage,`${m.id}先制、速度、必中和分类面板参与真实结算`,baseFile)]};
  }else if(e.kind==='soul'){
    review.implementation=['dist/soul-registry.js','dist/souls.js'];review.rationale='魂印878高低体力、下回合异常及下两次先制均只需要当前在场双方。SeerAPI没有强化魂印版本；激活技能另行逐项审核，不伪造新魂印。';review.singleBehavior='回合初锁定低/高/等体力条件：低于时当回合受攻击清对手回合，高于时自身属性用招清对手回合；阶段末无正等级则下回合攻击60%诅咒，实际失败授予下两次技能先制+1；有正等级则下回合对手属性用招诅咒。';
    const a='3580 魂印878回合初高低体力分流、等值不触发及免断',b='3580 魂印878体力条件在回合初锁定、技能回复反超后受击仍消回合',c='3580 魂印878无强化下回合60%攻击诅咒、概率两侧和免控补偿',d='3580 魂印878强化分支下回合对手属性诅咒、攻击不触发与控制不消费';
    review.tests={success:[ref(a,'高血属性/低血受攻消doubleDamage，低血实际受到攻击损血',soulFile),ref(c,'真实60%概率两侧，成功时诅咒，失败登记两次先制',soulFile),ref(d,'强化分支下回合对手属性技能实际诅咒',soulFile)],failure:[ref(a,'体力相等不触发，免断保护阻止消回合',soulFile),ref(d,'对手攻击不触发强化分支，免异常时无诅咒',soulFile)],boundary:[ref(b,'回合初低血锁定，回复并伤害反超后受攻仍消回合',soulFile),ref(c,'两次先制依次消费为1、0，第三次恢复速度顺序',soulFile)],interaction:[ref(d,'疲惫阻止行动时PP和先制次数保留',soulFile),ref(c,'免控转入先制补偿，属性技能也能消费并实际抢先',soulFile)]};
  }else{
    const x=e.raw.instance;review.rationale=`原文“${x.description}”，有序参数${JSON.stringify(x.args)}；只依赖当前双方，单精灵实现。`;review.singleBehavior=x.description;
    if([4,5].includes(x.id))review.tests={success:[ref(stats,`实例${e.key}实际改变源参数指定等级${x.args[2]}`,baseFile)],failure:[ref(stats,'封招及免弱/禁强化阻止等级变化',baseFile)],boundary:[ref(stats,'六级上下限不越界',baseFile)],interaction:[ref(stats,'真实概率、能力变化与免疫交互',baseFile)]};
    else{const clause=clauses[x.id];if(!clause)throw Error('Missing state evidence '+e.key);review.tests=Object.fromEntries(['success','failure','boundary','interaction'].map((b,i)=>[b,[ref(clause.name,clause.assertions[i])]]));}
  }
  reviews.entries[e.key]=review;
}
fs.writeFileSync(path.join(root,'SINGLE-STAGE-REVIEWS.json'),JSON.stringify(reviews,null,2)+'\n');
const auditPath=path.join(__dirname,'3580-review-audit.json'),audit=JSON.parse(fs.readFileSync(auditPath));audit.inventory=items;audit.source=s.source;audit.status='state-evidence-complete-validation-pending';audit.reviews=Object.fromEntries(items.map(e=>[e.key,reviews.entries[e.key]]));
audit.additionalStatusEvidence={enum:'research/3580-status-source-external.json',semantics:'research/3580-wiki-mechanics-source.json',revision:388558,curseDuration:{url:'https://www.bilibili.com/read/cv4943131/',note:'原始机制观察文章说明诅咒1–3回合控制、结束转入三种子状态且持续2回合。子状态伤害类型采用当前BWIKI修订388558明确的百分比伤害，未沿用旧文固定伤害。'},tests:['3580 诅咒真实阻止用招、自然结束转化三分支持续两回合','3580 诅咒后续烈焰百分比伤害、致命增伤与虚弱减伤']};
audit.implementationChanges=['新注册1018、594、1333、2306，保留来源模板/参数。','1047/937接受已核实的诅咒枚举23，仍拒绝未审核枚举；937按实际异常成功判定补偿。','988下回合封全部；1334从回合持续改为真实下次技能次数，立即异常免疫也算失败。','1322移出魂印成为技能独立受击反应；1077诅咒参数正确使用后必定判定并按失败封属，原其他参数行为保留。','532粉伤按实际回复HP计算，禁疗/满血不伪造伤害。','魂印878异常实际失败补偿先制，复用当前次数消费与行动顺序。','补齐诅咒控制及三种后续状态，复用现有异常/伤害/回合结算。'];
audit.initialFailures=['新增2306补偿if/else绑定错误导致失误/封招仍执行原技能；修正条件块，保留全部失败断言。','532错误使用无返回值的heal函数导致没有等量伤害；改为治疗前后HP差值。','191雷祭随机失误/异常一回合到期，改用真实种子8保留状态断言。','2306计数预期算式4-r误写，按两次使用后的1、0改为3-r。','复用843测试引用3578技能10250，改为当前3580真实撞击10001。','魂印体力反超夹具目标5000被6000粉伤击败，改为6500保留对手受攻动作和全部断言。'];
fs.writeFileSync(auditPath,JSON.stringify(audit,null,2)+'\n');const c=reviewCoverage(s,reviews);console.log({total:c.total,missing:c.missing.length,stale:c.stale.length});
