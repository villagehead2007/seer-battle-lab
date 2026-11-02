# 4622 / 1829 魂印冻结交接

魂印1829/13cc07dd/eid2217[1,0]原版唯一版本，17技27实例1魂印45项由主线来源保存。真实formatted的cap20、4%/5%、命运庇护明细是补充，raw/analyze省略不构成矛盾。完整source-audit有原始三字段/eid/Wiki和培养机制389166原始内容SHA/URL。

生产：range-souls.production-fragment.js入现有工厂；souls.production-edits.json共5条精确唯一锚点，只对1829条件生效。production-test-copy.json复制production-ready-soul1829.test.cjs，已去私有loader/cache。

资源：intentCount()/gainIntent(n)/fateProtection()。初始0，roundEnd先旧层*10真实伤害再+2、cap20/到10授庇护。场下火系额外层数、资源真实下场保留两条真多宠单独登记；不把当前+2或庇护延期。攻击每层+5%不是倍威力，固定/百分每层减4%（浮点round到1e-12避免20层199伪差），真伤不减，遵守既有完全无视减伤入口。

培养机制389166新补源明确全免抗性是独立全状态+5%概率，不是resistUntil。草稿初期错误方案在任何测试前已撤销，最终实现从不删除/改变既有公共resistUntil窗口；不把代码当定义。

仅1829局部可选builds[side].resistance1829={fullBonus:0|0.05,includedInConfigured:boolean}。不提供字段就保持旧major55/minor18原基数，不默认开满抗。测试的true载荷明确55已含50+5、18已含13+5，不能再+5；false表示调用者明确原配置基数未含该分量。profile同时保存originalFullBonus和active fullBonus，进入庇护令active变0，已配置major/minor变100%，未配项不凭空增加抗性。实际同seed7额外5取消前挡害怕并扣PP29；取消后害怕成功控制未用PP30，独立于DOT类型证明。既有窗口6在授庇护前后保持6。

命运庇护与次数/反弹仅在当前状态确有配置抗性100%时共享4511-006保护；未配状态的count真实消费、reflect真实反弹已测，不能省略这些独立分支。绕免疫的公共转化不受本新抗性阻止。

无新魂印独有问题。候选0项/全免001已由真实培养机制消除，questions.draft只关联既有共享006，并保留原文和2059[2,200]相关实例。

测试：private-v1 19项18pass1fail exit1，错误期望烧伤损1125漏算同时10层40%percent减伤；实际8325正确。保留失败原日志；private-v2 21/21 exit0，无活动测试进程。675沿既有已认证公共烧伤percent管线回归，不把本轮改assert当重新定义DOT类型；source-audit保留Wiki388558基数和Q021范围说明，另害怕PP证据无此依赖。main正式整合/部署/完整回归/validator未由本代理执行。
