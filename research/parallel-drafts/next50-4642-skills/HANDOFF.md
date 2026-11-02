# 4642技能冻结

23真实基础、50原索引效果；唯一第五37348，追加伙伴29092。当前私有49/49 exit0，含47行为、1结构、1纯诊断；实际23。

整合两片段：range-effects插在最终IIFE结束前，effect-registry-tail在所有legacy定义后；souls.production-edits.json为9条唯一精确锚点补丁。helper复制至tests/helpers/4642-battle.cjs并按项目相对路径转换；测试复制至tests/next50-4642-skills.test.cjs并指向正式helper。不可带preload到生产。1843及多段followup已在生产，不重复注入。

仅新增1430/725/2311/2103全局注册；其余保留原phase/parse/direct接口，仅精确当前来源执行及校验分派。其余旧owner回退原处理器。旧共享11923/d8c998a2的15保持原阶段。三纯多宠1510/2040/2105完整登记，技能基础仍实测。

历史v1=35/34pass1fail，55第五轮结束还原观察夹具错；v2=49/48pass1fail，低HP双倍红伤实际488不满足1066<300，增敌特防至1000保留原阈值及450/900断言；v3=49/49pass0fail，仅两测试夹具修改加1685实际保1断言，效果实现未因夹具修改。

73逐项EV、问题来源及正式运行结果随后补齐，不修改以上代码冻结。


证据已备：4642-instance-evidence.json为73items（23basic/50effects），70single四类显式refs，3multiplayer无假状态；questions.draft.json为new3/shared12，source-audit.json含源摘要和历史。生产结果待主实际补入；不宣称部署或formal。

1430语义限定：literal标题“每段明确抽样政策”实际代码在整招末按currentAttackSegment+1的尝试段数重复抽样，非逐个命中段、非逐段真实施加。它只证明抽样次数导致概率差异；自然单位/时点/MISS计数仍Q010。此研究test不可当未知逐段施加分支已实现。

440已完成正常首次两轮5倍及第3轮恢复；与真实1509×3的费用共存算法关联4635-013；生产souls实际PP消费入口已有maple1509PPCost且PP消耗倍增other!=1时自然guard，新440同名timer自动进入此入口。私有原49阶段未跑新混源专项；现主520中两项实际通过见末尾，无新增生产补丁。


最终当前生产专项：research/4642-production-integrated-targeted-v1-result.json 实际520/520pass exit0；本只77（20魂+3魂多段纠正+49技能+2费用+3main）及必要旧/公共443。单次正式定向，非完整npm/validator，无部署/验收。两费用正式路径tests/next50-4642-additional-pp-boundaries.test.cjs；主复制删除虚归sourceSide且首literal改名为“未给策略时013守卫”，原独占草稿保留。EV取正式文件真实literal名，两个交互均已实际通过。


延期语义勘误：旧EV已逐字节归档deferred-source-correction/before-4642-instance-evidence.json。1510为敌主动切换后回初随机1异常；2040为3轮敌主动换入失神；2105为未击败→敌方场下阵亡首位消逝，涉及场下顺序列表与目标移除。旧依赖/未来机制文字错误，来源原文未改。只读当前生产1510/2105 afterHit/deferred/execute=纯多宠空载荷均正确，不存在己方害怕/己方死亡增威执行逻辑；2040已精确deferredFor当前失神。额外精确metadata wrapper仅为加强本来源文字绑定，不是行为修复。


1356关键原生多段补正已独占冻结1356-multihit-correction/FREEZE.json，v2 6/6pass（v1原5pass亦保留）。原520为补正前历史，当前生产需主统一v2。1356已增010第三实例；6项真实状态refs追加EV对应实例。


当前正式生产v2：research/4642-production-integrated-targeted-v2-result.json实际526/526 exit0（结束2026-10-26T01:40:07.861Z）。本只83=20魂+3魂纠正+49技能+2费用+3main+6暴击纠正，其中81真实状态或明确载荷回调、1结构、1纯诊断；旧公共443。旧520仅补正前历史。用户将本轮缩为原前40、末4650，本只第33；41–50仅保留既有资料不推进。

修订脚本finalization/*scope40-v2.draft.cjs只准备不执行：依当前v2实际526门槛、33/40/末4650，shared按id合并（当前13来源关联行合并为9个独立公共编号，006技能与魂共一块），延期dependencyEvidence仅switch或off-field，魂四类断言按branch.part+准确literal名逐条写，rationale按真实scope/kind。旧原脚本保留，主请只审新v2稿。
