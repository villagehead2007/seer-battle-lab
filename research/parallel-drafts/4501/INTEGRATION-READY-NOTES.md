# 4501 正式整合脚本草稿增量交接

`integrate-main-ready.cjs` 已准备，**未执行**。仅运行 `node --check`，退出0；独立只读 preflight 结果在 `INTEGRATION-PREFLIGHT.json`。未运行战斗测试、整库、validator、部署或外部请求，正式文件未修改。

- 13个patch中1–5依赖已合：原needle均0，1–3为删除项，4–5新实现各1；6–13当前原needle各唯一1，替换尚未出现。脚本同时检查原文和顺序内存替换的唯一性，禁止覆盖整文件旧版本。
- 9个baseline迁移各唯一1。原20项保持顺序、数量和映射；仅6个旧待答标题（第1/13/14/16/18/20项）改为已答事实；额外去除控制未用循环中的旧1827跳过，使真实1827也受原控制断言检查。原文20标题与新20标题逐项写入执行时manifest，供prepare-4501-formal精确迁移审核引用。
- helper从草稿引擎改正式engine；来源改正式store.species(4501)，保留独立对照920688及unknown=[]。
- 6项draft-tests复制为正式wrapper，路径改正式helper和research；末尾require原20项independent。原生22真实ID测试改从正式store加载，新增store.search('4501')实际命中、store加载ID与22招、魂印注册hash=f91439c9；原1715实际初始化、独立对照920751、逐招revision/skillUses/沉默/3000粉/400盾断言保留。
- scope-policy 3项从 research/4501-scope-policy-tests.draft.cjs 原样复制到 tests/deployed-4501-scope-policy.test.cjs，其路径原本即符合正式tests目录。总计20+6+3=29项，未运行，不能宣称通过。
- 正式变更前先对全部准备输出做语法编译，然后备份将修改的正式代码/测试/helper、已有reviews/确认及任何已有4501数据。备份目录严格 `research/4501-before-integration-<ISO时间戳>`、文件名严格路径分隔符转`__`，尤其 `tests__deployed-4501-independent.test.cjs`，符合 prepare-4501-formal.cjs 当前读取方式。preflight当前匹配目录0；若已有同前缀目录，脚本明确停止，避免prepare的find读取错误旧备份。

执行只做正式代码/测试整合和备份，不自动运行prepare/正式save/测试/验收或推进游标；主代理需在当前gate结束、亲审脚本后执行。所有原patch历史hash保留，本次读取hash另记preflight。

主代理应顺手修正 `research/prepare-4501-formal.cjs` 中审核引用的复制文案：extra测试assertion当前仍写“1715整回合红阈值/固粉原单次300/战阶三类…1768…17真ID”，该文案属于4496，不符合4501本次6项1715/1845/1827/1486/1617/22招测试；“当前9项补充状态测试”应明确6项效果+3项独立scope-policy，脚本没有擅改此正式文件。此属记录准确性修正，不是改断言或新语义。
