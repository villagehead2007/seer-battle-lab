# 4422 草稿交接（未部署、未验收）

所有写入仅在 `research/parallel-drafts/4422/`。未修改正式 dist、tests、data、审核、问答MD、缓存或进度；未访问API/Wiki、使用Git、后台、正式部署、完整npm或正式验证器。4408草稿保持原样。

## 来源与回答

- pet4422/ad4acc28；真实魂印1639/577ee58f/eid2025/[3,100,20,1,3,1]，非强化魂印；17招、50有序实例、唯一第五36147/bd64e58c。没有伙伴追加/其他真实第五版本。
- `source-comparison.json`逐项核原API保存记录：pet、魂印hash/参数、17技能hash、第五/advanced/special原flags、50实例ID及参数全匹配。eid2025本身没有独立API响应记录；eid/参数直接可追溯原soulmark1639响应，未伪造独立eid hash。
- `answer-evidence.json`逐字保存Q4329-006、Q4358-003及关联原段并记原完整manifest SHA256。Q4329-006所有直接秒杀/死亡按归零、只受免死留1、不产生伤害事件；使用当前已落实36和62，未再改公共处决机制。
- Q4358-003本4422关联“都包括”明确覆盖MISS/失明/闪避，不将其单独扩成攻击免疫的答案。`public-4333-answer-evidence.json`另保存Q4333-003完整段和当时MD hash：公共被抵挡包括免疫受到攻击/命中效果封锁，明确“除了写技能无效时的效果”。主代理本轮亲核后指示本源1861精确保留补偿，两个回答scope保持独立。
- 魂印首回合使用攻击的主语采用API格式化明确的“对手”，已留root历史审核依据。只恢复当前首次登场自身完整行为；真正再次登场需换宠事件，仍延期。

## 最小补丁

`changes.json`和`implementation.patch`仅包装dist/range-effects.js原1861注册块，前锚点唯一；SHA256记录文件基准。正式公共文件在变化，须只按唯一锚点核实并合入，不能整体覆盖。

保留原onInvalid行为，新增精准retainedHitHooks：

1. 范围仅技能36141/38d93981、实例1、1861/db7ab820/[]。原始m.hash+revision+index通过validate核；运行时move revision/wikiId及operations中原index1/params/sourceArgs再次匹配。其他1861来源不获得保留授权。
2. 真MISS/失明/整体封锁继续原onInvalid；若命中载荷同时受封锁，则同一onInvalid阶段精确保留。
3. 攻击伤害免疫或已命中但载荷封锁时，在afterAttack阶段执行保留补偿，整招一次，避免多段反复补偿。编译新增真实条件hook，以现有run retainedHitHooks通道执行；不改效果引擎、伤害免疫或异常时序。
4. 普通护盾/护罩完全挡住但attackImmune=false不算技能无效；正常命中不虚执行1861；控制未使用不触发。补偿按原序先清回合再100%沉默3，清失败仍沉默。
5. 原retainedHitHooks调用时没有设置effectInstanceIndex，故没有修改全局run；精确运行守卫改核原move.operations实例索引。明确不依赖不存在的context字段。

当前实际1794/1803注册没有retainedHitHooks，本次没有借机扩大它们；其他1861来源未授权，本补丁保留其既有表现。`1861-impact.json`当前正式保存species中未发现1861来源，因此没有本补丁改变旧已部署目标的名单。完整回归仍由主代理正式gate承担。

## 测试和候选文件

- `candidate-snapshot.json`仅移除36139/36140/36141三处已答旧limitations；真实hash/原参数/类型/flags不改。没有多目标排除的新增需求。
- 复用现有24项独立状态测试，修改旧62测试名称中的“仍待确认”为已答描述，断言不弱化。
- 新增11项状态测试：完整原17技能列表配招/初始化/执行；36真归零穿各伤免与盾、免死留1、未行动与MISS；62完整8回合时点、免死/免伤/自己先死；1861四种无效、精确保留、控制/异常次数免疫、双段只补偿一次、盾0伤不误触及错误来源/index拒绝；1639对手实际已用/MISS/整招封锁；全部16个1860原实例的无正先制必中/正级不触发，保留静默基础先制3。
- 最终隔离运行 `node --test research/parallel-drafts/4422/independent-tests.draft.cjs research/parallel-drafts/4422/state-tests.draft.cjs`：35/35通过、exit0，日志 `combined-final-v2.log`。其中24旧+11新增，不能重复累计先前运行。
- 第一次新增7项中5过2失败，`state-test.log`和原失败测试草稿保留：一项确实发现1861攻击免疫补偿遗漏；另一项测试把可被先清除的“免异常”当保留免疫，改成真实次数免疫并断言消费。此前假设“封命中载荷禁止本精确补偿”按主代理亲核独立公共例外修正，原稿保留。

`formal-helper.cjs`、`formal-independent.cjs`、`formal-deployed.cjs`为正常正式路径版本候选，分别对应tests/helpers/4422-battle.cjs、tests/deployed-4422-independent.test.cjs、tests/deployed-4422.test.cjs。正式文件未写。不要把overlay loader或draft helper引入正式tests。隔离overlay只在子进程加载时替换源码文本，没有写回文件。

`coverage-map.json`含68来源单元与35真实测试名；`review-units.historical.json`保存68当前root审核及有效名称映射（已更正原旧待答测试名），缺失引用0。它是历史/候选证据，不是重新认证结果。主代理须重新绑定最终候选digest并为36/62/1861补入11新增对应真实断言，不能直接把旧independent-state-tested改成验收通过。

## 真延期与剩余工作

只有魂印1639“每次登场首回合”中的真实再次登场重新判断、对手实际用攻击后消回合/疲惫/末给盾，延期到换宠与登场首回合标识；当前首次登场分支完整实现并验证。root MULTI-PET-TODO已有4422:soul:1639，源hash/参数保留。PP快照、天奔释罪、伙伴自身强化不延期。

没有新增未回答问题或必要外部请求；未伪造独立eid_effect/2025响应。主代理仍须逐序审查合入、正式save/local搜索加载配招版本初始化、最终68审核重绑定、完整npm/validator及必要公共回归，然后才能记录passed(single-stage)。本35项草稿测试不替代正式验收，不推进游标。
