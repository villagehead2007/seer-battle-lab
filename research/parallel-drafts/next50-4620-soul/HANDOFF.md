# 4620 / 1826 交接

来源魂印1826 b5a2035a / eid2213[1,0]，Wiki320361同文。22技42实例1魂印65项来源由main保存；本稿只魂印。没有额外强化/因子魂印版本。

生产整合：range-souls.production-fragment.js复制进现有工厂；souls.production-edits.json只有1条精确唯一锚点（skillContext.hitEffectsDisabled追加1826亮烛最高条件，非全技能无效）。production-test-copy.json给生产ready测试副本，无私有preload/require.cache。

API：candleLit()/ignite()/extinguish()；后两者返回实际changed。字段candleLit1826，默认入场亮；resource-only-v1保留不变，完整魂印同时包含PP/排名/伤害。registry必须有traits:{}。

entry直接扣敌每槽至多2，按真实前后差合计；上只PP恢复只登记deferredReceiver，不给当前+2。合计>=10双方全回复；<10保留1/未触发归属仍003，只在共同结果自然执行。qualifiedEntry({zeroPreservation:'keep-zero'|'raise-one',failureMeaning:'burn-failed'})是明确研究载荷输入，非源答案。PP保护尊重，不让假想上只满PP阻止当前扣除。

排名自然比较回合初/当前/实际扣PP前已有快照，选中并列或资格有差异才001。qualifiedRank1826={snapshot:'current'|'round-start'|'before-consume',ties:'all'}仅明确输入。先制原生0纯额外正先制共同归0；基础/负修正等实际差异002；qualifiedPriority1826='all'只做独立载荷。

灭烛最低真实技能用时无视敌正能力/免攻；最高c.power*=2、ignoreShield，明确是威力非伤害翻倍。beforeUse/attack设置当前用招的ignoreTargetBoostWhenActingRound，afterUse清掉，不污染后续行动。光最高只失效命中载荷，保留红伤。

回合末灭烛成功才烧伤转焚烬，新时长共享4618-001未定；qualifiedBurnConversion1826={duration:n}才明确载荷。公共Q018次轮起完整n，因此内部convert当前轮传n+1；Q017绕免疫/反弹/次数不消费，Q019取最大。当前明确载荷不冒称新时长已解决。

v1 0/17 schema失败；v2 15/17两个隔离entry夹具遇排行001，保留断言控住当前行动隔离；v3 17/17；最终v4 24/24 exit0，private-v4.log，无测试进程。v4后仅细化deferred文案（只上只恢复）及文档，没有行为更改；main仍必须重新在生产整合验证，private通过不等同部署/认证。

多宠仅真实上只PP恢复一条，完整来源/参数/slot依赖见source-audit。所有当前独立分支都已实现或精确pending保护。3新题001/002/003，转化时长共享4618-001新增焚烬实例，不扩大未来只答诅咒的确认。

main组合夹具只读核对已完成：原‘dark红伤≈2*lit±1’不适用于倍威力，main已改capture power170/85 + dark红伤>lit，保留真实HP/PP/2250percent/theoryheal。该main组合未由本代理运行。
