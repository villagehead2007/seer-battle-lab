# 4514 技能片段定向只读审阅

范围仅 range-effects.production-fragment.js 的1749与1040。未修改技能目录/共享、未测试、未外查。

1749：使用roundSettledFixedDamageTaken在本次固定追加前后的差值。dist/souls.js recordDamage为type=fixed累加完整settledDamage，符合保1仍算受到正结算伤害确认；0结算/无空PP才补真实伤害。保1HP实际损失0不会误判。未见所审分支缺陷。

1040：qualifiedPayload4514严格校验36651/bc66c402/索引2/[100,8,1]并复用原效果载荷；36651不在已确认时序表，故这只是前提已明确满足的独立载荷测试，不能宣称真实自动时序完成。

发现需修缺陷：execute仅精确is命中才执行Q-N50-4514-002 guard；同36651但hash/revision/index/params不匹配会落入old.execute，按原立即时序运行，绕过问题隔离。该wrapper未补目标特定validate。建议先识别目标36651，来源不匹配直接抛错，只允许其他旧技能回退。已消息告知主及skills代理。
