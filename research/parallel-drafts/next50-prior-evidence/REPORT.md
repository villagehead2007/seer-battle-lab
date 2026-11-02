# 上一固定50只证据核对

- FIXED50-ANSWERED-FINAL-DELIVERY.json 与 BATCH-4329-NEXT20-STATUS.json：4329至4505，队列177–226，共50只。
- 已逐一只读检查50个结果JSON与50个主日志：真实exitCode=0，全部日志含 `passed (single-stage)`；专项、本地接入、完整npm状态均0。
- 最终范围回归研究日志 fixed50-answered-final-npm.log 尾部：7877通过、0失败；交付记录独立执行1次，非验证器内。此前验证器内整库148次（133通过、15历史失败），不是148个独立目标。
- 正式游标 lastPassed=4505、nextId=4509、queueLine=227；新范围应按当前正式队列在4505之后截取。
- 当前保存activeIndependentId=null，answerImplementationRun.activeAgents=[]，pendingNecessaryRecertifications=[]；未读取操作系统进程，不能据此断言机器上没有历史进程。
- 历史parallelPreparation内保留draft-active/actualActiveAgents，以及historicalOldSemanticFollowups内旧剩余3697/4114；这些是历史字段。最终classification已列3697/4114必要旧目标重新认证，不应误认为新的待办或活动验收。
- 多精灵延期仍在，allMechanismsComplete=false，不将单精灵验收当全部机制完成。

## 新批审核确认索引

1. AGENTS.md的显式全局确认：汲取为真伤；面板比例附伤不计能力等级；随机异常全PVP池/限制状态/无放回独立2或3回合；完整伤害与实际HP损失分开；保留1HP事件；理论回复。
2. research/SIX-DEPLOY-USER-CONFIRMATIONS.json 的Q-BATCH-001与Q-BATCH-004：自身最大HP比例附伤等量回复、固定吸取理论回复，严格遵循原适用范围。
3. research/FIXED50-ANSWER-USER-CONFIRMATIONS.json：已保存历史确认索引，旁置 prior-public-question-index.json 收录含公共/全局字样的相关问题原始回答。它是查阅索引，不能仅因标题含公共便扩大回答范围。
4. 重点复用检索：Q-N20-4358-003技能无效/MISS；Q-N20-4359-003受到攻击零伤/MISS；Q-N20-4373-002护罩；Q-N20-4373-003的1709回复；Q-N20-4373-004的833；Q-N20-4442-001整回合红伤；Q-N20-4482-002/003的62和587；Q-N20-4494-003能力比较；Q-N20-4505-002等级特殊操作。精确来源/版本/实例匹配仍需逐项确认。

仅生成独占草稿，没有修改共享文件、执行测试、外部查询或落实新增答案。
