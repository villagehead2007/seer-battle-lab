# 4643 魂印1844交接

源码和测试冻结。私有v3 18/18、exit0，无活动进程；v1/v2原日志及错误PP原断言全文保留。主线尚未生产整合/认证。

依次追加range-souls.production-fragment.js到工厂内（复用现有conditionStatusRules/soulStatusPools），应用souls.production-edits.json 4条与status-rules.production-edits.json 1条。所有补丁旧锚点唯一；不得复制私有require或preload到生产。production-test-copy.json直接复制无loader测试。

星执记录初始唯一最高实际异常抗性；可选options.builds[side].resistance1844={entries:{睡眠:.5,中毒:.2},fullBonus:.05}，entries排除独立5%bonus，保持原全局55/18模型。配置无未明总和规则。beforeBattleStart先记最高项和登场maxHP。未配置则读取既有gear major/minor，未拥有唯一项不造记录。

原异常完整门禁成功/notify后，statusRules公共attempt仅当前1844且星执存在、命中记录时convertExisting为3回合星赐。保原success和计数，按Q017绕新星赐门禁；原控制、DOT、感染结束副作用不遗留。星赐不递归自身，已有更长星赐按Q019保留。真实1797初登场烧伤、转换再入、免异/抗性失败、PP与增伤/到期均私有状态通过。

真实敌方击杀按冻结4125-022完整人答消逝定义执行maxHP0/HP0/不存在，并保存本次登场maxHP为星执者初始能量。绝不让死后本体充当其他己方载体。当前37350/1908自身致死是否被击败是Q-N50-4643-001，自然精确诊断；qualifiedSelfDefeat1844='defeated'/'not-defeated'仅两研究载荷。真实已授死亡时技能回复或kingRevivalRound与消逝先后关联Q-N50-4604-007，默认不猜，qualifiedVanish1844='before-revival'仅明确研究输入。

后继己方载体/其他队伍成员死亡300能量与使用15%/末15%/min150是真多宠，2分支完整来源见multi-pet-deferred.json。当前自身记录、技能2167/68/69读取、当前击杀后的释放/消逝/初始能量不得延期。资源only冻结v1供skills getter；它不替代完整魂印生产实现。
