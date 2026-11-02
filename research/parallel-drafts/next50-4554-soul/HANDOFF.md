4554 圣谕邪魇 / 魂印1764 hash196ef534 / eid2148 参数[1,0]。

生产接口已冻结为v4，测试`tests-v4.log`21/21退出0。未运行整库或正式验证器。

- `soul1764.draft.cjs`整合至range-souls registry[1764]，保留partial/unimplemented。请移除module.exports包装并使用独立块避免局部声明互撞。
- `souls.production-edits.json`逐项精确替换，所有锚点在生成时唯一验证。改动包括1764消除/吸取保护路由、通用标记受攻击事件、湮灭当前回合禁行动/禁回与明确结束载荷清理。
- `prepare-edits.cjs`仅为独占草稿补丁准备器，不是正式开发工具，不要作为正式运行依赖。
- 集成测试去掉preload/私有registry override，修正dist与snapshot相对路径。
- setForm('holy'|'evil')返回是否真实变形；同形不重新授予攻击强化。
- grantMark(kind,n=1,target=c.t)返回实际新增数量；kind支持holy/evil及原词。层保存在target.soulState.oracleMarks1764两类数组，各max3且记录triggerUsed/annihilationUsed。
- annihilate(target=c.t)来自真实技能源；落实明确238真伤、整轮不能行动/回复，并记录未知层释放时点。后续观察/释放层数或同轮再次湮灭触发001，不猜时序。
- qualifiedAnnihilate仅用于已明确结束时点的测试负载，不能从真实2066自动选择roundEnd。qualifiedMarkResponse同样只为明确输入层索引/伤害/回复类型载荷。
- `source-audit.json`含全部来源字段快照、分支测试映射、两个完整新问题和真多宠延期。
- 001合并多层响应、新层/减层先后、湮灭结束与连续时点；002邪诲70%吸取类型及回复基数。
- 初始/切形免疫、下一攻击先制/必中/穿免及MISS/控制/属性边界、真实选择与未用区别、当前保护触发、标记cap/一次响应、严格完整伤害阈值、明确湮灭载荷均已实测。
- 真实再次登场、标记下场保留才延期；自身两形态不延期。

v4修复B方初始入口：形态尚未经过自身battleStart初始化时按明确初始holy默认。新增原始1764真实B方建局，A方登场异常先执行仍免疫；另以未初始化B方实际公共伤害入口断言免异常/固定、不免百分比、不免弱化/真伤。v3旧日志保留，不再作为当前验证结果。
