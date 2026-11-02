# 4628 / 1835 冻结交接

私有v2 20/20 pass，exit0，private-v2.log，无活动测试。v1也20/20但hp-loss当时使用前后净差，后审修为直接取公共hurt实际损失返回，故修后重新跑全部20，两个真实日志均保留。

生产整合 range-souls.production-fragment.js 与 souls.production-edits.json 唯一补丁：只给已有afterUse payload追加本次红伤/全伤的实际HP损失读数，不改原伤害计算。production-test-copy.json指向生产ready20测试，无私有loader/cache注入。frozen-soul1835-v1.cjs为完整冻结接口。

自然首次属性自流血3/普通免疫失败/控制不使用、动态血态免异、回初300盾与实耗、无血或0伤不虚构吸取均实做。新001伤害值吸取基数/类型/回复，002自身血态免异与再次属性自流血；共享005已有普通盾重授、006真实有消费或反弹免异重合。明确研究态载荷各候选真实HP/PP/盾/时长/消费通过，不当作答案。

主线吸取配置：a.soulState.qualifiedAbsorb1835={basis:'attack-settled'|'attack-hp-loss'|'all-settled'|'all-hp-loss',type:'fixed'|'percent'|'true',heal:'nominal'|'hp-loss'}。完整37254两300固伤+547后比较attack/all正差600；捕afterUse恢复值，或回末另扣首次血DOT80，无初轮盾。该完整技能组合未由本代理执行。

source-audit.json有原始API/hash/参数/同版因子及20literal分支证据；questions.draft.json完整问题与空回答/查证；本魂无多精灵分支，不以技能第五未来目标归本魂延期。
