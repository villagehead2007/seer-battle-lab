# 4635 魂印1842交接

源码均冻结，仅独占目录。fragment直接插入range-souls工厂内（复用conditionStatusRules）；engine.production-edits.json 1条、souls.production-edits.json 1条，共2条唯一锚点。不得复制私有preload。生产测试可直接复制production-ready-soul1842.test.cjs，production-test-copy.json已给清单。

最终私有tests-v3.log：21/21，exit0，进程已结束。v1 18/0p18f为createBattle有限上下文缺完整接口；v2 18/18过，随后补已知初始数值规则并v3全21过，原日志均保留。没有运行整库/validator，私有通过不代替主线生产验证。

首次入场entrySelfAilment复用真实门禁，PP复用ppRules.restore逐槽实际结果；初始回复窄helper可达性证明见initial-helper-domain-audit.json，保留全部已知数值规则。普通在场abilities.entry使用完整c.heal/c.restorePP/c.ailment，不用初始窄helper。镜像746 afterHit、留魂蛊2319 afterHit/1985 combatEnd，均不是fresh initial可达状态。

魂印审核完成，无新增/共享魂印疑问。两项multi：双方阵亡数延长入场异常、真实重复入场调度；当前首次2回合及双方PP/HP恢复完整实现，不把自身分支延期。factor2400377/249a53da只当前37320/1842兑换，无新版本。94源检查1失败是技能2175参数矛盾，魂印EID2240/ba0b7b02 arity8一致，不能称所有来源全过。
