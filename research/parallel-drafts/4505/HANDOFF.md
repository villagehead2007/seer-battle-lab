4505 婕克拉德终点草稿交接；未正式合入、部署或验收。到此停止草稿，不开始4509或其它目标。

范围：seer_id第226行，固定名单终点。仅写本目录。pet4505/a0b8d210、唯一原魂1719/f04d5267/eid2110/[1,0]，17真实技能、23效果模板、42审核条目，原hash与有序参数逐项核。唯一第五36589/377b935c。pet.skill全部is_special/is_advanced=false、activation=null；原魂非强化、from/intensifiedTo=null，没有额外伙伴/强化版本遗漏。candidate-snapshot.json逐字节复制原4505-reviewed-snapshot.json；source-audit.json保留原文/URL/hash/参数与原失败。1569旧解析失败已由同文件2026-10-22T10:30:42.991Z真实成功重取恢复，未外查或改源。

changes.json共11个唯一锚点，带正式文件基准SHA256；涉及souls、range-souls、range-effects。主整合须逐锚点审查最新代码，不整文件覆盖。重建顺序：build-independent.cjs → build-full.cjs → migrate-tests.cjs；仅跑build-independent会暂时只生成独立1569补丁，必须接build-full。overlay.cjs只在内存载入改后代码，可读加载local-species作候选完整性核对，未执行save。

Q4505-001及003补充原答：变化前为回合开始，攻、防、特攻、特防、速度、命中逐项abs(后-前)求和，回合初命中-2后计算。souls在任何roundStart效果前保存双方六项快照，1719原roundStart降命中后计算并记录wingNetStage，然后按2/6/12一次启用原条款。原格式化把全部阈值列在“回合开始效果”段，本实现不把后续每次变化重新算n或重复触发寄生/复制。n≥12启用当回合双方实际用技后重置，仍只重置对手。

自动阈值验证没有仅靠qualifiedBands注入：

- 无其它变化，正常命中-2得n2并真实寄生；免弱/已命中-6的实际差0不触发。
- 以已保存4037真实魂印1292/d1c9bfa1在A先回合初全强1，1719在B，A原命中+2，其它0；真正回合初快照至降命中后算n6，触发全正再+1并覆盖复制全2。
- 以已保存3142真实原魂484/43eb4d2d在A先吸取1719持有六项+6，1719在B计算n34，真实全正分支、复制、双方真实使用后重置A实际35级；战阶实际3500固定吸取。日志断言来源side为1719一方，而不是触发opponentAfterUse的技能使用者。

旧qualifiedBands能力保留以支持历史条件载荷专项，但它们单独不作为自动n认证；上述真实双魂印交互和全17原生初始化补齐自动触发证据。

Q4505-002复制/重置/反转：新增最小公共rewriteStageValues helper，复用stage、syncStages和既有boostRemoved，没有新架构。copy按对手当前绝对等级覆盖自己，逐项经己方免弱/禁强化；reset请求变0，reverse请求正级变负级，强保/负锁及免弱/禁强化按实际方向阻止对应变化。重置累加的是实际成功abs差，不把失败请求计入吸取。copy满足全正/全负条件即按对手实际等级复制，即使其±1被阻也不误要求强化实际成功。

stage-semantics-review.json区分用户逐字原答和主代理亲核后的公共语义推导：+6→+2仍保留该项强化，作为等级下降经免弱，不额外消强；+6→0/负才是实际移除正级项。按成功移除的项数触发现有boostRemoved，未按请求或等级数误算按项反击。copy6→2与6→0都有真实状态和现有反击对照断言。

特殊操作的实际消强走既有公共反制：按项固定反击、强化消失清回合/封属/弱化/追加/吸取/惩罚、已有魂印boostRemoved等仍由同一dispatcher执行。helper以本Q4505确认传confirmedOperation，保留operation='reverse'语义，仅为本新来源操作解除旧pendingReverseQuestion；未全局关闭guard，既有triggerOnReverse:false等明确例外保留。1566仅28303/3e62739f的真实计时实例走新反转；970仅28305/6a8963df/i0/[3]走新双倍反转，反转失败后仍按原文独立普通清强，不能把免弱当成普通清强保护。其它来源旧reversePositive未重写。

清弱限制如实保留：负→0/正的真实清弱状态与changedLevels/removedNegative写入stageRewriteEvents，实际负锁/禁强化成功失败已测。当前项目没有独立已注册negativeRemoved/weaknessRemoved等清弱反制处理器，本交接不宣称不存在的反制、未来队伍效果或全局所有特殊操作已经完成。已有同步能力变化仍经syncStages。用户“触发”在当前已有反制满足条件时实际执行，不以空事件替代存在的效果。

Q4505-003效果6：10199/f49ccb7c/i0/6/3b6e7cac/[4]真实伤害、完整结算基数。公共effect-registry处理器原本已用settledDamage并默认true，不破坏旧可用版本；本轮去掉4505研究helper刻意排除6的限制，补完整原始编译及真实状态证据。完整800、目标实际损失200或保1实际0都反200真伤；目标盾挡500只反75，盾全挡不反；自己固粉免/普通盾不挡真伤，自己保1仍记完整200、实际损失99；免攻0/MISS不反。相同10199/f49ccb7c的旧3697来源/实例逐项核实，完整原20项加这些边界均过，仍须主代理正式必要复验/恢复认证，不把草稿当旧认证。

公共Q4442-001已明确1569仅指定下次红伤+100%，附加固定/百分比/真实不翻倍。删除奖励nextAttackBoostScopeQuestion旧待答标记；原红伤倍率与消费链保持，混合附伤实际执行且不翻，状态/控制未用不消费。未扩大其它参数或改技能分类。

额外独立影响审计1569-deployed-impact-audit.json：逐一解析当时268份正式data/species快照moves[].effectInstances，真实1569现代及遗留实例都为0，必要旧复验集合为空。rg唯一3524文本命中是skill31569，不是effect1569，保留反证，不能据此要求3524复验。待部署只有4505/28304/a3b5d6fb/[100,4,1,4,1]，不计已有认证；dist没有另一套内置1569来源实例。该结论只针对1569 guard删除，不取消旧3697因效果6用户语义确认而必要的正式复验。

最终有效isolated-final-v3.log：50/50、exit0。本只旧19迁移+新阶段7+新反弹/混合交互4=30；旧3697原20=50。重复日志不重复累计。测试文件independent-tests.draft.cjs、stage-confirmed-tests.draft.cjs、recoil-confirmed-tests.draft.cjs、3697-prior-tests.draft.cjs都在草稿目录，不能被npm默认tests/*.test.cjs收集。原19归档independent-tests.original.cjs，原问题/回答未改写。

17全原生载荷循环每次用独立对照ID920705，显式选1719/f04d5267、断言对照无魂及真实自动n2/寄生，真实技能ID/五招/全部operations/PP逐次执行；另已有完整源第五与正常寄生共同结算验证。原旧完整测试曾按“n未实现”只预期固定吸取320令1000→1320；现在正常n2另触寄生实际1125，已补事件断言与准确1000+320+1125=2445，不删寄生或降低断言。

失败保留：recoil-v1旧3697副本只因公共helper相对路径迁移漏改而22/23，修路径后23过，未改原断言；full-v1为41/42，差异即上述新寄生回复；full-v2与isolated-final为49过，补目标护盾基数边界后50过；最终修正opponentAfterUse状态重写来源归属并有断言后isolated-final-v3仍50过。一次build-full因多个相同旧guard文本无法作为唯一锚点而失败，改整条唯一boostRemoved行的最小替换，未跑失败补丁或放宽锚点检查。所有旧研究失败原文件继续保留。

candidate-integrity.json为最终内存补丁下实际local-species.issues(candidate)=[]、E.WIKI.assess supported:true/issues:[]、原魂1719 partial=false；属于候选完整性检查，未正式store.save、未正式搜索/加载验收、未正式validator。源42审核中10199原implementation/tests空白是历史待答记录，主合入应按新具名真实测试重绑，不能保留活动pending或直接当旧认证。

真正多精灵延期为0。没有把n、复制、重置或反转保护缺口假登记多精灵。没有新问题、未解决单精灵语义或精确外部资料请求；不存在清弱处理器的范围限制已单独说明，未虚构全部机制完成。

未改正式dist/data/tests/共享缓存/审核/原MD/进度/STATUS/调度/AGENTS/seer_id，未外查、Git、后台、子代理、整库npm或正式validator。无活动草稿进程。主代理按正式队列到4505后亲核11锚点、42审核、正式保存与接入、全专项/validator内置完整回归及旧3697必要认证。本交接完成后不后移，4509及其它范围外目标未开始。
