# 4586 魂印1791冻结交接（v4）

来源：1791 / e1c0f316，eid2175 [1,1,40,40,3,1]。完整原文、schema优先级、补查、已导入公共确认、逐分支测试映射与问题证据见 source-audit.json。当前Unity analyze_desc 优先于历史formatted，原字段完整保留。本轮新增填写答案未读取/落实。

## 正式整合

- range-souls.production-fragment.js：嵌入range-souls工厂，复用既有healthRules，无顶层require。注册partial及001/002/003/007待确认。
- engine.production-edits.json：唯一精确补丁，E.availableMoves原始合法入口允许1791实际第二槽0PP；无1791/其他槽及struggle路径不变。
- souls.production-edits.json：按顺序精确替换；all:true条目有两处且须全部替换。含PP可用/消费、结算后首次致死保1、卌下次实际攻击输出消费、动作结束/真实诗context、实际槽5技能KO事件。
- prepare-edits.cjs只产生以上独占JSON，不改共享文件。preload-production.cjs仅私有验证用，不能部署。
- app按钮调用E.availableMoves，不另写UI例外。

resolveDeath与技能2089补丁会有同一原函数锚点重叠：主代理必须合并两个source-bound分支。1791依据真实死亡事件，不要求死亡处理后目标仍HP<=0，故即时复活仍应获首次卪；保留defeater身份、实际used/currentActorSide/技能来源，不能从选择槽缓存推定击败归属。技能2089回满PP若复用context，明确传origin='skill'，不能使默认魂印origin绕过技能禁回PP。

## 实现及边界

仐先制与忽略能力保留真实等级；叵真实第2槽0PP完整前置合法且正PP正常消耗、命中逐槽按实际扣除吸取；乂共同明确的选择3槽清异常完成，其他槽有真实分歧时002；卌实际使用包括MISS/整招无效会吸取和授对方下次攻击输出-40%，控制未用不触发，目标被吸取KO仍保留同fighter标记（1603真实复活测试）；卪真实技能KO首次成本/10%攻增减完成，重复同1603复活KO进入007。

首次结算后致死伤害失章、清异常、当轮保1免异常；同轮后续正伤保留完整结算伤害，下一轮不再保命。解锁后自身诗免费，不依赖队伍资源；每轮末maxHP-200明确范围完成，<=200仅003诊断。

资源grant/ensure/count和各真实诗条件/载荷接口完整；原行动不执行poem1791。只有明确qualifiedLifecycle+poemEffectEnabled输入执行已确认载荷，不猜自然额外行动生命周期。该明确输入覆盖原行动hitEffectsDisabled，防止原行动失效状态静默吞掉已明确生效的额外诗。自然双方动作时点/额外行动内容/递归统一001保护。

## 待确认和延期

- Q-N50-4586-001：诗调度完整生命周期。
- Q-N50-4586-002：乂是否仅选第3槽时清异常。
- Q-N50-4586-003：空元之渎上限<=200时减200边界。
- Q-N50-4586-007：再次卪触发时10%增减重授或叠加；明确两种载荷均已测试。

真正多精灵延期仅空元之录：背包存活/双方阵亡的不在场精灵消逝→诗章与其maxHP10%收益及单次上限。全部自身铭文、首次致死、免费诗和普通技能获得诗章不延期；永久buff持续不造多宠延期。

## 验证

最终命令：node --test --test-concurrency=1 research/parallel-drafts/next50-4586-soul/soul1791.test.cjs。

- tests-v1.log：27项26过，exit1，测试夹具转槽伤害阈值错误；原日志与修正依据保留。
- tests-v2.log：27/27 exit0，旧版本。
- tests-v3.log：28/28 exit0，旧版本。
- tests-v4.log：30/30 exit0，487ms，最终冻结版本，无活动进程。

最终新增真实状态边界：目标死亡技能立即复活仍授首次卪/20%成本；原命中效果失效但明确额外诗自身生效时仍实际清强/诅咒/消章。完整测试名和分支映射在source-audit.json。私有preload使用技能代理冻结frozen-poem-interface.js验证2086/2087，正式应整合其完整生产片段。未运行整库或正式验证器，不能宣称正式认证；由主代理整合并完成必要回归。
