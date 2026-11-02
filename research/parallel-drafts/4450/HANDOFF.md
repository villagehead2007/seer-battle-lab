# 4450 隔离草稿交接（未正式合入、部署或验收）

唯一工作目录 `research/parallel-drafts/4450/`。本次未写正式 dist/data/tests/审核/缓存/进度，未调用外部API/Wiki、Git、全库测试或正式验证器。

## 精确来源及回答

- pet4450 `57bec5fc`；魂印1664 `46f1182e`，eid2041 `[1,3,1,3,1,1,1]`。18个真实技能及每个原索引/参数/效果hash见 `source-audit.json`，逐条和保存的 `research/4450-source-manifest.json` API记录比对一致；既有53条审核原文已保存在该审计文件。
- 原第五36302真正hash为 `d99707dc`；原问Q4450-001写的 `8458786c` 属36296。原问答和原来源没有修改。36303 `9ce8cd45` 原API字段 `is_fifth=true,is_special=true`，激活物1724967/f83c73f2。因此候选保存两真实第五、两个互斥17技能配招版本，不再延用旧proposal仅一个第五的错误组织。`exact-whitelist-row.json` 只含本pet/魂印/18原hash/两第五。
- Q4450-001原答“授权”；Q4450-002原答“再现所有效果，比如威力先制必中和词条；不替换而是在此基础上增加，先执行再现的效果，再执行该技能的效果，pp依旧是该技能的pp；理论量”。逐字副本/原manifest hash/行号在 `answer-evidence.json`。主代理已明确按同一次实际使用内组件执行。早期误提Q003只保存在过程 `changes.before-primary-replay-clarification.json`，最终patch没有Q003/pending/throw占位。
- 面板比较沿用Q4358-001公共确认。1889明确“技能无效时”属于Q4333-003既有公共例外；只为28166/c78c3497/i1/1889/626ae48e/[100,7,200]加 retained 补偿，不泛化其他来源。
- 类型机械神秘来自已存Wiki4450/rev359745；组合118 API失败证据在原source-check，候选保留typeSource，未冒称API类型表已成功。

## 实现补丁与整合方法

`changes.json` 为可审查的唯一替换锚点列表；每项保留原before、after、基准sha256及核查时唯一命中数。`overlay.cjs` 只在内存应用这些锚点，可运行真实正式引擎。不要运行过程build/update脚本重新生成以免回退后续完善；只审查最终 changes.json。

1. 精确第五白名单一行；候选 `candidate-snapshot.json` 只有本目标真实版本组织修正，原hash、原is_*布尔、原参数不改。
2. 1894无解析/同名：300真伤与理论300技能回复独立；低HP、保1、伤免/减免不截回复，禁疗/倍率/上限照常。编译校验仅36303/9ce8cd45/i0/[]，拒绝未审核来源。
3. 再现：从正式souls.js现有成功命中主链抽取共用 `executeHitComponent`（逐字原链保留 `component-extraction.original.txt`，提取后上下文 `component-extraction.after.txt`）。1894 beforeUse内先调用复制组件，再让原36303组件继续。复制组件复用真实伤害、防御、免疫、盾、完整伤害/HP损失、多段、normalEffect、各实例beforeUse/afterHit/afterAttack/afterUse及命中魂印反应；没有第二次PP、actionStart、skillUses、Soul beforeUse/afterUse、opponentSkillResolved或endAction。
4. 被复制技能原始基础先制由1894带入；复制beforeOrder运行以保留1750等非先制条款，舍弃该阶段产生的priority/forceFirst等临时先制字段。复制beforeAccuracy/原alwaysHit与完整原accuracy/dodge/crit链继续执行。复制攻击只在公共结算倍率加1.5，原36303段不加；复制属性的本体词条先执行，原1894 afterUse按已知条款恢复自身其他技能1PP。恢复PP受禁回机制。
5. 精确1889 retained.beforeUse/onInvalid：命中载荷封锁/整体无效仍100%疲惫+400真，控制实际未用不执行；无效不偷执行其他原技能词条；正常命中不额外400。错误hash/index/参数拒绝。

## 主代理整合时必须亲核

- 正式公共souls.js仍在变，不能覆盖整文件；每个锚点如非唯一应按最终调用链重新提取命中组件。尤其已合1522、529/1858/龙胆以及后续4438公共预算等必须保留。
- 共用组件抽取改变了原成功路径的三项聚合赋值为OR/累计，从而复制段与原段合为一个actual use结果；应核实opponentSkillResolved/符文反击等使用该聚合完整伤害，Soul afterUse原本已有damageEvents范围聚合。
- 复制组件已保留与原入口一致的基础分类/属性/威力防线：指定对手属性、指定系别、低威力、符文、沉默/失神、入场属性禁制、先手攻击禁制及概率属性封锁；原一次性nextSkill/nextAttack/nextStatus/1128等计数只由实际使用根入口消费，不造第二次使用。新增真实符文/低威力/指定属性状态断言。主代理仍须按最终正式公共链亲核一次性消费。
- 复制accuracy/dodge原链直接抽取，共享一次使用已预留的状态；主代理应检查一次性暴击必中/失明与多组件的消费时序，不造额外实际使用。当前状态测试已覆盖控制、根技能整招无效、复制MISS、复制属性封锁、复制多段、免伤/保1、基础先制与临时先制排除。
- 原来的53 reviews需要主代理按正式最终文件重绑，保留本次状态测试具体名称与真实断言。结构/两套17真实ID执行检查不能取代词条状态测试。

## 隔离验证与诚实状态

`independent-tests.draft.cjs` 保留22项真实状态专项（原本文件留 `independent-tests.original.cjs`），把已答后的旧pending断言更新为真实复制行为，没有删除正确失败断言。`state-tests.draft.cjs` 新增16项，含两互斥版本各17真实技能配招、真实36292/36295/36298解析、复制前后伤害/附伤顺序、50%仅复制段、复制状态不耗复制PP、不额外记实际使用、PP禁回、低HP/保1/免伤/技能禁疗、精确授权拒绝等。

最新真实结果 `combined-replay-v8.log`：38/38、exit0；由主代理核对后录正式证据。此前v5为37/37 exit0；v6为测试文本替换导致JS正则语法错，完整失败保留，修复为明确字符串断言，未改变预期。更早v1/v2失败是夹具把真实零威力奇点断言正红伤、目标自行出招消耗PP及控制无damageEvents，完整日志保留。

未运行完整npm、正式本地搜索/存储、正式validator；不能把隔离38通过当作单精灵正式验收。没有后台运行。

## 真实延期与外部请求

仅魂印1664真实再次入场重新记首次解析、真实下场解放技能、主动下场按解析攻击/属性回复自身、死亡下场给下一只满HP/PP、未来奇点下场保留。已有MULTI-PET-TODO `4450:soul:1664` 保留完整source/原文；首次当前在场解析/禁选、0..3层、免异常消费、面板比较、回合快照均为当前实现，不延期。伙伴追加第五36303不延期。

无新增外部请求，无新的未答语义问题。正式数据/审核/日志/必要旧目标回归及部署验收仍由主代理串行执行。
