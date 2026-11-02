# Q-DAMAGE-001 当前实现与验收追踪

用户确认原文单独保存在 Q-DAMAGE-001-user-confirmation.json，AGENTS.md 同步确认。上游描述、参数、hash 未改写。

## 数值契约

- settledDamage：防御、减免、伤害上限、免疫、护盾等处理后的完整结算值；不会被剩余HP或留1HP截断。
- hpLoss：最终实际扣除的HP；保命状态下由最终HP下限限制。
- 历史 dealt、hurt/inflict 返回值及 roundDamageTaken 等HP损失字段继续保持兼容；使用完整伤害的读取点显式迁移到 settledDamage / roundSettled*。
- 正结算伤害触发 damageTaken / damageDealt 等正伤害路径，即使 hpLoss 为0；护盾/免疫将结算值压为0时不走正伤害路径。attackDamageTaken/receivedAttack 中原本按“受到攻击”或护盾受击判定的分支保留独立条件。
- 吸血、汲取后等量恢复、实际回复量附加伤害、受击前HP重建保留实际HP口径；没有把所有 dealt 机械替换。
- 多段伤害各段独立结算记录；结束后 lastSettledAttackDamage 保存本次多段合计。死亡后后续段停止。

## 查证与验证

圣甲·盖亚真实编号3056，魂印410，hash 30d4ab29；来源见 damage-gaia-source.json。临终反击使用当回合完整技能伤害合计，100级、死亡、战斗阶段、对方HP归零后恢复1HP等条件保持来源逻辑。

逐实例原文、参数、版本及本地来源：damage-final-instance-source-audit.json。反伤、伤害阈值、延迟伤害缓存、未受伤条件、套装阈值等读取点已核对。

专项：tests/damage-settlement.test.cjs（15项；包含各项中的多种状态组合），最终专项日志 Q-DAMAGE-001-final-boundaries-v2.log，退出0。首次新增测试错误是夹具maxHP超范围；后续反馈测试须包含瑞尔斯原有回合回复与追加；未受伤对照须确保攻击者先于哈迪斯先制+2出手。保留所有失败日志，未弱化正确机制断言。

当前代码实际界面：Q-DAMAGE-001-stable-ui.png；829结算伤害，实际扣443，HP归零。

## 重新认证

共40只受影响且已有审核的目标；比原34只增加3550、3679、3813、3815、3875、3879。精确逐只状态、当前目标、代码摘要和日志以 damage-recertification.json 为准。手工触发的前台串行认证脚本只执行既有 automation-validate.cjs，无调度、无定时任务、不修改自动化系统。每只包含专项、真实本地接入和完整npm test，非0即停止。

前置验收未完成前固定60只保持 scanIndex=0，不推进正式完成游标。
