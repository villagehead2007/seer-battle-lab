# 浏览器加载回归最小修复冻结

根因：dist/index.html实际顺序先range-souls.js与soul-registry.js，后status-pools.js/status-rules.js。range-souls工厂执行时两个浏览器const捕获undefined；本批1725顶层立即计算controls=pools.pool()直接抛错。只延迟controls计算仍不能修复已捕获undefined的statuses/pools。

修复稿range-souls.production-edits.json共4个单处替换：浏览器两依赖经get代理访问时解析真实globalThis模块，Node require原样；controls函数化，仅实际控制免疫trait请求时查询真实池。不返回空池，不改变页面脚本顺序，不改测试断言。

真实验证：
- 原2074具名测试：reproduce-v1.log，exit1，0/1，原始TypeError保留。
- 同一原测试套生产等价补丁：repaired-v1.log，exit0，1/1。
- 新browser-1725.test.cjs：browser-1725-v1.log，exit0，1/1；按真实页面顺序加载，无Node require注入浏览器。实际1725 combatEnd清300护盾→punish清疲惫但保留烧伤，下回合真实16睡眠被免疫，再下一回合睡眠施加成功，比较Node/浏览器HP、异常和PP一致。

代码、补丁、测试现全部冻结，无测试进程。未改共享/页面/旧断言，未跑完整npm。其他两项原浏览器失败由主整合后定向验证；不冒称本子代理已运行。

整合新测试到tests/时，将root改为path.resolve(__dirname,'..')；其余以root定位真实dist和research。正式测试不使用preload-repair.cjs；预加载只用于独占草稿验证，按4处锚点各1次替换并显式校验。
