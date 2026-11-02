# 4516 技能片段定向静态复核

范围：skills草稿range-effects.production-fragment.js与souls.production-edits.json；未修改对方目录或共享、未运行测试、未外查。以下针对本次读取版本，后续修复由主/skills代理核验。

1. **Q002 guard放置错误，必须修复。** 当前combined1677+1554 guard位于attackNullify段前，但nextAttackHealing段先执行。静态套入补丁后转换计数消费offset116613，combined guard offset120506。两计数均1时先转换消费至0，guard失效，免攻继续消费，实际猜了未确认顺序。需将combined guard放转换消费之前，与零伤/盾罩/技能禁疗guard同一入口。
2. **来源标签残留。** panConversion1677/panNullify1554仅写true，耗尽未清。尤其1554免攻耗尽后旧46/570等重新授予attackNullify，旧来源会被残留标签冒认1554。建议来源计数/耗尽清理，真实混源守住待确认边界，勿让旧来源继承标签。主已分配skills代理修复与回归。
3. 1677自伤使用hurtWithHpFloor(...,1)，保持完整固定结算并单独限制最终HP，符合保1用户确认；未见该分支需修改。2019复用公共healingMultiplier，所有来源heal（包括攻击转体力的heal）均受减100%，与技能禁疗Q002区别保留。建议主整合时验证2019与1677真实共同技能流程，不用只测分拆载荷替代。

已消息告知主与skills代理；本复核结束并冻结，不扩为整库架构审核。
