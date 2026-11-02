# 4532 魂印1745移交（冻结）

代码 soul1745.draft.cjs、souls.production-edits.json、range-effects.production-fragment.js、preload-production.cjs、soul1745.test.cjs 已冻结，仅独占目录写入。

v4：exit0，14/14；日志 test-v4.log。旧失败日志保留；详细原因与逐分支测试映射见 source-audit.json。未运行整库。

魂印仅原版b7d38834；因子2400260/71116a68需要4502是获取条件，不是队伍战斗条件，无额外魂印版本。

主需整合三个生产片段：注册1745、最终先制快照/痕PP前guard/刻攻免消费seam、46/570/1288混免guard。只保存最终先制，不改现有排序。魂印使用完整结算roundSettledAttackDamage，不误用护盾前置received标记。

技能2051可调用c.soulAbility(1745,'grantKe')与'grantHen'，分别自身刻/对手痕。当前攻击后刻消费、无痕授痕、已有痕授攻免均已真实验证；仅下一只精灵接收刻和换宠保存延期。

Q-N50-4532-001/002分别是API内部死亡反转时机/痕零威力限制冲突。001包括574自耗、反伤死亡归因。另关联4511-002特殊反转保护及006混来源免攻。源完整原文/参数/URL/hash、差异问法与多宠逐项见audit。

剩余工作：主正式整合和组合验证；未回答疑问不得认证。qualifiedReverse是确定前提的载荷测试，不是假定已解决自动触发时间。没有后台进程。
